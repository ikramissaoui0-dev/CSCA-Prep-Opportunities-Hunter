-- Phase 1 — auth foundation: profiles, roles, signup trigger, and the
-- custom access token hook that puts the role into the JWT.
--
-- Scope is deliberately limited to what Phase 1 (auth + RBAC) needs.
-- The full application schema (questions, exams, subscriptions, ...)
-- is Phase 2 — see docs/schema.sql for that design.

-- ============================================================
-- ROLES
-- ============================================================
-- Three roles for now, per the Phase 1 brief. docs/ARCHITECTURE.md's
-- original design also has `support` and `super_admin` as finer-grained
-- tiers under admin — add them here with `alter type user_role add value`
-- when Phase 8 (admin dashboard) actually needs that distinction.
create type public.user_role as enum ('student', 'admin', 'content_manager');

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.user_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App-level user data extending auth.users. role is never client-settable — see handle_new_user().';

create index idx_profiles_role on public.profiles (role);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
-- role always defaults to 'student' here, regardless of what a client
-- sends in signUp() options.data — promoting to admin/content_manager is
-- a separate, explicit action (Phase 8), never something a signup
-- payload can influence.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at current on any profile edit.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- CUSTOM ACCESS TOKEN HOOK
-- ============================================================
-- Registered in supabase/config.toml's [auth.hook.custom_access_token]
-- for local dev. On a hosted project this must ALSO be wired up manually
-- in Dashboard > Authentication > Hooks > Customize Access Token (JWT)
-- Claims hook — config.toml only governs `supabase start`, it does not
-- push this setting to a linked remote project.
create function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  fetched_role public.user_role;
begin
  select role into fetched_role
  from public.profiles
  where id = (event ->> 'user_id')::uuid;

  claims := coalesce(event -> 'claims', '{}'::jsonb);
  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(fetched_role, 'student'::public.user_role)));

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- Required grants for the Auth server (running as supabase_auth_admin)
-- to invoke the hook and read the role it needs — and nothing else.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

grant select on public.profiles to supabase_auth_admin;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles_update_own" on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- RLS gates *rows*, not columns — without this, the policy above would
-- still let a student UPDATE their own row's `role` to 'admin'. Column-
-- level grants close that: self-service updates can only ever touch
-- display fields. Role changes are an admin-only action (Phase 8),
-- performed with the service-role client, which bypasses RLS entirely.
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

create policy "profiles_admin_read_all" on public.profiles
  for select
  to authenticated
  using ((select auth.jwt() ->> 'user_role') = 'admin');

-- Lets the Auth server read the role of the user whose token is being
-- issued, independent of any RLS policy scoped to `authenticated`/`anon`.
create policy "profiles_auth_admin_read" on public.profiles
  as permissive
  for select
  to supabase_auth_admin
  using (true);
