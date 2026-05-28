-- =============================================================
-- Auth + RLS + public-share RPC migration
-- Reverts the dev loosening from 20260528 and locks the system down.
-- =============================================================

-- ---------- 0. Dev-data cleanup ----------
-- Old pre-auth seed rows can't satisfy the new constraints.
-- (trainer_id was nullable; some clients have null email.)
delete from plan_exercises
  where plan_id in (select id from plans where trainer_id is null);
delete from plans where trainer_id is null;
delete from clients where email is null;

-- ---------- 1. Schema changes ----------
alter table clients
  add column auth_user_id uuid references auth.users(id) on delete set null;

-- One auth user maps to at most one clients row.
create unique index clients_auth_user_id_unique
  on clients(auth_user_id)
  where auth_user_id is not null;

alter table clients alter column email set not null;
alter table plans   alter column trainer_id set not null;

-- ---------- 2. Trainer-profile dispatch trigger ----------
-- Auto-creates the trainers row on auth signup when raw_user_meta_data.user_type = 'trainer'.
-- Client rows are NOT auto-created here — client signup goes through
-- ensure_client_profile() or claim_plan_for_client() RPC so we can branch on
-- whether they signed up via a share link.
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data->>'user_type' = 'trainer' then
    insert into trainers (id, email)
    values (new.id, new.email)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- ---------- 3. RPC: public plan view ----------
-- The one trust boundary for unauthenticated /plan/{shareCode} reads.
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
          'day_of_week', pe.day_of_week,
          'order_in_day', pe.order_in_day,
          'sets', pe.sets,
          'reps', pe.reps,
          'weight', pe.weight,
          'notes', pe.notes,
          'exercise_name', ex.name,
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

grant execute on function get_plan_by_share_code(text) to anon, authenticated;

-- ---------- 4. RPC: client signup helpers ----------
-- Called by /signup/client when there's no ?plan= param.
create or replace function ensure_client_profile()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;
  if exists (select 1 from clients where auth_user_id = auth.uid()) then
    return;
  end if;
  select email into v_email from auth.users where id = auth.uid();
  insert into clients (auth_user_id, email) values (auth.uid(), v_email);
end;
$$;

grant execute on function ensure_client_profile() to authenticated;

-- Called by /signup/client when ?plan={shareCode} is present.
-- Claims the stub clients row referenced by the plan.
create or replace function claim_plan_for_client(share_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id     uuid;
  v_existing_auth uuid;
  v_user_email    text;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;

  select c.id, c.auth_user_id
    into v_client_id, v_existing_auth
    from plans p
    join clients c on c.id = p.client_id
    where p.share_code = share_code;

  if not found then
    raise exception 'plan_not_found';
  end if;

  if v_existing_auth is not null then
    if v_existing_auth = auth.uid() then
      return; -- already claimed by this user, no-op
    end if;
    raise exception 'plan_already_claimed';
  end if;

  select email into v_user_email from auth.users where id = auth.uid();

  update clients
    set auth_user_id = auth.uid(),
        email = v_user_email
    where id = v_client_id;
end;
$$;

grant execute on function claim_plan_for_client(text) to authenticated;

-- ---------- 5. Enable RLS ----------
alter table trainers       enable row level security;
alter table clients        enable row level security;
alter table categories     enable row level security;
alter table exercises      enable row level security;
alter table plans          enable row level security;
alter table plan_exercises enable row level security;

-- ---------- 6. Policies: trainers ----------
-- Trainers can read & update their own row only. Inserts happen via trigger.
create policy "trainer_self_select" on trainers
  for select to authenticated using (id = auth.uid());

create policy "trainer_self_update" on trainers
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------- 7. Policies: clients ----------
-- A client can read/update their own row.
create policy "client_self_select" on clients
  for select to authenticated using (auth_user_id = auth.uid());

create policy "client_self_update" on clients
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- A trainer can read clients they have plans for.
create policy "trainer_reads_their_clients" on clients
  for select to authenticated
  using (exists (
    select 1 from plans
    where plans.client_id = clients.id
      and plans.trainer_id = auth.uid()
  ));

-- A trainer can insert stub clients (used by the plan builder).
create policy "trainer_inserts_clients" on clients
  for insert to authenticated
  with check (exists (select 1 from trainers where id = auth.uid()));

-- Claiming a stub goes through claim_plan_for_client() RPC (security definer);
-- no direct UPDATE policy needed for the claim path.

-- ---------- 8. Policies: categories ----------
-- Read globally; no insert/update/delete from clients yet.
create policy "categories_authenticated_read" on categories
  for select to authenticated using (true);

-- ---------- 9. Policies: exercises ----------
-- Read globally (clients see exercise names in their plans).
create policy "exercises_authenticated_read" on exercises
  for select to authenticated using (true);

create policy "trainer_inserts_own_exercises" on exercises
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (select 1 from trainers where id = auth.uid())
  );

create policy "trainer_updates_own_exercises" on exercises
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "trainer_deletes_own_exercises" on exercises
  for delete to authenticated
  using (created_by = auth.uid());

-- ---------- 10. Policies: plans ----------
create policy "trainer_manages_own_plans" on plans
  for all to authenticated
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

create policy "client_reads_assigned_plans" on plans
  for select to authenticated
  using (exists (
    select 1 from clients
    where clients.id = plans.client_id
      and clients.auth_user_id = auth.uid()
  ));

-- ---------- 11. Policies: plan_exercises ----------
create policy "trainer_manages_own_plan_exercises" on plan_exercises
  for all to authenticated
  using (exists (
    select 1 from plans p
    where p.id = plan_exercises.plan_id
      and p.trainer_id = auth.uid()
  ))
  with check (exists (
    select 1 from plans p
    where p.id = plan_exercises.plan_id
      and p.trainer_id = auth.uid()
  ));

create policy "client_reads_own_plan_exercises" on plan_exercises
  for select to authenticated
  using (exists (
    select 1
    from plans p
    join clients c on c.id = p.client_id
    where p.id = plan_exercises.plan_id
      and c.auth_user_id = auth.uid()
  ));
