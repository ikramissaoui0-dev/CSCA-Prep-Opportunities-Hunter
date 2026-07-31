-- Phase 8 — admin dashboard: exposes auth.users.email alongside profiles
-- for the admin Users management screen. The app's Postgres roles have
-- no grant on the `auth` schema (Supabase restricts it by design), so a
-- view owned by the migration role (which *can* read auth.users) is the
-- standard way to surface just the one column staff actually need —
-- same reasoning as question_options_public in 0002_content_schema.sql.
--
-- Row visibility is enforced in the view's own WHERE clause rather than
-- table RLS (views don't inherit RLS from a security-invoker-off view;
-- Postgres checks privileges against the view's owner for auth.users,
-- which is what lets this work at all) — every non-admin caller gets
-- zero rows back, not an error.
create view public.admin_user_directory as
select
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at
from public.profiles p
join auth.users u on u.id = p.id
where (select auth.jwt() ->> 'user_role') = 'admin';

grant select on public.admin_user_directory to authenticated;
