-- Extend the public-share RPC to expose exercise video_url so the
-- unauthenticated /plan/{shareCode} view can render a "watch" link.
-- Same signature, so CREATE OR REPLACE keeps the existing anon/authenticated
-- grants intact (no re-grant needed).
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
