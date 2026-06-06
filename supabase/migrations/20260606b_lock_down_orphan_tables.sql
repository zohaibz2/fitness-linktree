-- Security hardening: lock down the four tables that exist in the database
-- but are not covered by any prior migration, not present in lib/database.types.ts,
-- and not referenced anywhere in application code:
--
--   trainer_clients, plan_templates, template_exercises, progress_logs
--
-- They are currently empty and unused, but without RLS enabled any data that
-- ever lands in them would be world-readable/writable through the anon key.
-- We enable RLS and intentionally create NO policies — a "deny-all" posture.
--
-- Effect:
--   * anon / authenticated  -> RLS with zero policies denies all access.
--   * service_role          -> bypasses RLS (by design), so server-side admin
--                              and future migrations can still operate.
--
-- This does NOT touch the public /plan/[shareCode] page: that reads exclusively
-- through the get_plan_by_share_code SECURITY DEFINER RPC, which is unaffected
-- by table-level RLS on these (or any) tables.
--
-- When a feature actually uses one of these tables, replace the deny-all stance
-- here with real ownership policies (rooted at trainer_id / created_by, matching
-- the pattern in 20260528b_auth_and_rls.sql).
--
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY is idempotent, so this migration is
-- safe to re-run.

alter table trainer_clients    enable row level security;
alter table plan_templates     enable row level security;
alter table template_exercises enable row level security;
alter table progress_logs      enable row level security;
