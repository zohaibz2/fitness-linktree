-- Workaround for PostgREST-layer RLS rejection on trainer→clients inserts.
-- The canonical trainer_inserts_clients policy is correct at the catalog
-- layer (verified extensively: WITH CHECK true also rejected, manual SQL
-- under simulated authenticated role succeeds, schema cache reload had no
-- effect). Route the insert through a SECURITY DEFINER RPC, matching the
-- pattern used by claim_plan_for_client and ensure_client_profile.

create or replace function create_client_stub(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;
  if not exists (select 1 from trainers where id = auth.uid()) then
    raise exception 'must be a trainer';
  end if;

  insert into clients (name, email, subscription_status)
  values (
    p_name,
    'stub+' || gen_random_uuid()::text || '@local.invalid',
    'inactive'
  )
  returning id into v_client_id;

  return v_client_id;
end;
$$;

grant execute on function create_client_stub(text) to authenticated;

-- Restore canonical trainer_inserts_clients as defense-in-depth.
-- Direct PostgREST inserts will be rejected by this policy (which is the
-- behavior we want — the RPC is the supported path). If the underlying
-- PostgREST mystery resolves later, this policy is already correct.
drop policy if exists "trainer_inserts_clients" on public.clients;
create policy "trainer_inserts_clients"
  on public.clients
  for insert
  to authenticated
  with check (exists (select 1 from trainers where id = auth.uid()));
