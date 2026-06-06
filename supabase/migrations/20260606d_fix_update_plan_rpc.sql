-- Fix: update_plan_with_exercises inserted NULL exercise_id (and every other
-- field) for all exercises.
--
-- Root cause: the previous body did
--     from jsonb_array_elements(...) e
--     ... (e->>'exercise_id') ...
-- jsonb_array_elements returns a set whose single column is named "value", and
-- "AS e" is a TABLE alias (it does not rename the column). So `e` referred to
-- the row-composite, not the element jsonb, and `e->>'key'` extracted nothing
-- (NULL) for every key — the insert then failed on the first NOT NULL column,
-- exercise_id.
--
-- jsonb_to_recordset expands the JSON array directly into typed columns, with
-- no alias/column ambiguity.

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
    r.exercise_id,
    r.day_of_week,
    r.order_in_day,
    r.sets,
    r.reps,
    r.weight,
    r.notes
  from jsonb_to_recordset(coalesce(p_exercises, '[]'::jsonb)) as r(
    exercise_id  uuid,
    day_of_week  int,
    order_in_day int,
    sets         int,
    reps         int,
    weight       numeric,
    notes        text
  );
end;
$$;

grant execute on function update_plan_with_exercises(uuid, text, date, date, jsonb)
  to authenticated;
