-- Storage for client check-in progress photos.
--
-- Private bucket (public = false): objects are NOT world-readable. Trainers view
-- photos via short-lived signed URLs generated server-side. media_url in
-- progress_logs stores the object *path* (key), not a public URL.
--
-- Policies on storage.objects (RLS is enabled on that table by Supabase default):
--   INSERT: anon + authenticated may upload to this bucket. "anon" is required
--           because the public /plan/[shareCode] check-in is unauthenticated
--           ("shared users"); the Server Action runs as anon for those visitors.
--   SELECT: authenticated only — needed so trainers can create signed URLs.
--           (createSignedUrl requires SELECT on the object for the caller.)

insert into storage.buckets (id, name, public)
values ('client-uploads', 'client-uploads', false)
on conflict (id) do nothing;

drop policy if exists "client_uploads_insert" on storage.objects;
create policy "client_uploads_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'client-uploads');

drop policy if exists "client_uploads_select" on storage.objects;
create policy "client_uploads_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'client-uploads');
