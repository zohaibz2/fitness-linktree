-- Corrective follow-up to 20260606f.
--
-- (1) Re-assert get_plan_by_share_code WITH the plan_exercise id. Diagnostics
--     showed the deployed function still lacked 'id' (the f re-definition didn't
--     take), so the check-in modal had no plan_exercise_id to log against.
--
-- (2) Add get_recent_check_ins() for the trainer Activity Hub. A direct
--     progress_logs -> clients(name) embed returns null because the trainer
--     can't read the clients row through RLS (a known clients-table RLS quirk in
--     this project, see 20260528c). A SECURITY DEFINER RPC assembles the cross-
--     table read the same way the public share page does, while staying safe by
--     filtering to the calling trainer's own plans (trainer_id = auth.uid()).

-- (1) ----------------------------------------------------------------------
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

-- (2) ----------------------------------------------------------------------
create or replace function get_recent_check_ins()
returns table (
  id             uuid,
  client_name    text,
  exercise_name  text,
  actual_sets    int,
  actual_reps    int,
  actual_weight  numeric,
  notes          text,
  media_url      text,
  coach_feedback text,
  created_at     timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    pl.id,
    c.name,
    ex.name,
    pl.actual_sets,
    pl.actual_reps,
    pl.actual_weight,
    pl.notes,
    pl.media_url,
    pl.coach_feedback,
    pl.created_at
  from progress_logs pl
  join plan_exercises pe on pe.id = pl.plan_exercise_id
  join plans p          on p.id  = pe.plan_id
  join exercises ex     on ex.id = pe.exercise_id
  left join clients c   on c.id  = pl.client_id
  where p.trainer_id = auth.uid()
  order by pl.created_at desc
  limit 10;
$$;

grant execute on function get_recent_check_ins() to authenticated;
