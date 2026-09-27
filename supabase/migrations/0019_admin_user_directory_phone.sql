-- Surface profiles.phone (0018_profile_phone.sql) on the admin user
-- directory (0010_admin_user_directory.sql, extended in
-- 0012_student_access_grants.sql) so the admin Users page can show it.
-- CREATE OR REPLACE VIEW can only append columns, never insert or
-- reorder them (Postgres error 42P16) — phone goes after the existing
-- last_sign_in_at, not next to full_name.
create or replace view public.admin_user_directory as
select
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at,
  u.last_sign_in_at,
  p.phone
from public.profiles p
join auth.users u on u.id = p.id
where (select auth.jwt() ->> 'user_role') = 'admin';
