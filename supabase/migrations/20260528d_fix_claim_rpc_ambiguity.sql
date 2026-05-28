-- Rename claim_plan_for_client parameter share_code → p_share_code to
-- avoid collision with plans.share_code column in the WHERE clause.
-- Parameter names don't affect function identity (only types do), so
-- CREATE OR REPLACE works without a DROP. Caller must pass the new key.

create or replace function claim_plan_for_client(p_share_code text)
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
    where p.share_code = p_share_code;

  if not found then
    raise exception 'plan_not_found';
  end if;

  if v_existing_auth is not null then
    if v_existing_auth = auth.uid() then
      return;
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
