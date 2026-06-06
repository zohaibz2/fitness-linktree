-- Atomic "edit plan" path. A plpgsql function runs in a single transaction, so
-- the update + delete + bulk-insert either all commit or all roll back — no
-- window where a plan is left with its exercises deleted but not yet re-inserted.
--
-- SECURITY INVOKER (the default): the function executes with the caller's role,
-- so the existing RLS policies still apply:
--   * plans                -> trainer_manages_own_plans (trainer_id = auth.uid())
--   * plan_exercises       -> trainer_manages_own_plan_exercises (via parent plan)
-- A non-owner therefore can't see or mutate the plan. We also assert ownership
-- explicitly up front for a clear error instead of a silent 0-row update.
--
-- p_exercises is a JSON array of objects shaped like:
--   { "exercise_id": uuid, "day_of_week": int, "order_in_day": int,
--     "sets": int, "reps": int, "weight": number|null, "notes": text|null }

create or replace function update_plan_with_exercises(
  p_plan_id    uuid,
  p_name       text,
  p_start_date date,
  p_end_date   date,
  p_exercises  jsonb
)
returns void
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;

  if not exists (
    select 1 from plans
    where id = p_plan_id and trainer_id = auth.uid()
  ) then
    raise exception 'plan_not_found_or_forbidden';
  end if;

  update plans
     set name       = p_name,
         start_date = p_start_date,
         end_date   = p_end_date,
         updated_at = now()
   where id = p_plan_id;

  delete from plan_exercises where plan_id = p_plan_id;

  insert into plan_exercises
    (plan_id, exercise_id, day_of_week, order_in_day, sets, reps, weight, notes)
  select
    p_plan_id,
    (e->>'exercise_id')::uuid,
    (e->>'day_of_week')::int,
    (e->>'order_in_day')::int,
    (e->>'sets')::int,
    (e->>'reps')::int,
    nullif(e->>'weight', '')::numeric,
    nullif(e->>'notes', '')
  from jsonb_array_elements(coalesce(p_exercises, '[]'::jsonb)) e;
end;
$$;

grant execute on function update_plan_with_exercises(uuid, text, date, date, jsonb)
  to authenticated;
