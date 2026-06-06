-- Client Check-in feature: wire up progress_logs (previously deny-all from
-- 20260606b_lock_down_orphan_tables.sql) for the check-in flow.
--
-- Columns probed live: id, client_id, plan_exercise_id, actual_sets,
-- actual_reps, actual_weight, notes, media_url, coach_feedback. There was NO
-- timestamp column, so we add created_at to support "10 most recent".

-- ---------- 1. created_at (for recency ordering) ----------
alter table progress_logs
  add column if not exists created_at timestamptz not null default now();

create index if not exists progress_logs_created_at_idx
  on progress_logs (created_at desc);

-- ---------- 2. RLS policies (replace the deny-all stance) ----------
-- Writes do NOT get a direct INSERT policy: the only insert path is the
-- SECURITY DEFINER submit_check_in() RPC below, which validates the target
-- against the share code. Trainers can read and add feedback to logs that
-- belong to plans they own.
drop policy if exists "trainer_reads_logs_for_their_plans" on progress_logs;
create policy "trainer_reads_logs_for_their_plans" on progress_logs
  for select to authenticated
  using (exists (
    select 1
    from plan_exercises pe
    join plans p on p.id = pe.plan_id
    where pe.id = progress_logs.plan_exercise_id
      and p.trainer_id = auth.uid()
  ));

drop policy if exists "trainer_updates_feedback_for_their_plans" on progress_logs;
create policy "trainer_updates_feedback_for_their_plans" on progress_logs
  for update to authenticated
  using (exists (
    select 1
    from plan_exercises pe
    join plans p on p.id = pe.plan_id
    where pe.id = progress_logs.plan_exercise_id
      and p.trainer_id = auth.uid()
  ))
  with check (exists (
    select 1
    from plan_exercises pe
    join plans p on p.id = pe.plan_id
    where pe.id = progress_logs.plan_exercise_id
      and p.trainer_id = auth.uid()
  ));

-- ---------- 3. RPC: anonymous (share-code) check-in submission ----------
-- SECURITY DEFINER so an unauthenticated /plan/{shareCode} visitor can submit.
-- We validate that the plan_exercise actually belongs to the plan addressed by
-- the share code, and derive client_id from that plan (visitors never pass it).
create or replace function submit_check_in(
  p_share_code       text,
  p_plan_exercise_id uuid,
  p_actual_sets      int,
  p_actual_reps      int,
  p_actual_weight    numeric,
  p_notes            text,
  p_media_url        text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
  v_log_id    uuid;
begin
  select p.client_id
    into v_client_id
    from plan_exercises pe
    join plans p on p.id = pe.plan_id
   where pe.id = p_plan_exercise_id
     and p.share_code = p_share_code;

  if not found then
    raise exception 'invalid_check_in_target';
  end if;

  insert into progress_logs
    (client_id, plan_exercise_id, actual_sets, actual_reps, actual_weight, notes, media_url)
  values
    (v_client_id, p_plan_exercise_id, p_actual_sets, p_actual_reps,
     p_actual_weight, nullif(p_notes, ''), nullif(p_media_url, ''))
  returning id into v_log_id;

  return v_log_id;
end;
$$;

grant execute on function
  submit_check_in(text, uuid, int, int, numeric, text, text)
  to anon, authenticated;

-- ---------- 4. Expose plan_exercises.id on the public share view ----------
-- The check-in modal needs the plan_exercise id to log against. Re-create the
-- share RPC adding 'id' to each exercise object (keeps video_url from 20260606).
create or replace function get_plan_by_share_code(code text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'start_date', p.start_date,
    'end_date', p.end_date,
    'share_code', p.share_code,
    'client_name', c.name,
    'exercises', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', pe.id,
          'day_of_week', pe.day_of_week,
          'order_in_day', pe.order_in_day,
          'sets', pe.sets,
          'reps', pe.reps,
          'weight', pe.weight,
          'notes', pe.notes,
          'exercise_name', ex.name,
          'video_url', ex.video_url,
          'category_name', cat.name
        ) order by pe.day_of_week, pe.order_in_day
      )
      from plan_exercises pe
      join exercises ex on ex.id = pe.exercise_id
      left join categories cat on cat.id = ex.category_id
      where pe.plan_id = p.id
    ), '[]'::jsonb)
  )
  from plans p
  left join clients c on c.id = p.client_id
  where p.share_code = code;
$$;
