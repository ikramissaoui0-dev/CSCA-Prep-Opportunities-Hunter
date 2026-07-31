-- Admin-granted free access — a student/client of the business gets full
-- paid-tier access without going through Stripe. Deliberately its own
-- table, never touching `subscriptions`/`payments`: billing state (what
-- Stripe thinks) and access entitlement state (what the app grants) must
-- stay separate, or a free grant could be mistaken for real revenue or
-- vice versa.

-- ============================================================
-- STUDENT ACCESS GRANTS
-- ============================================================
-- Status is intentionally NOT a stored column — EXPIRED (expires_at in
-- the past) and PENDING_REGISTRATION (user_id still null) are both
-- derivable at read time, the same reasoning `course_progress` is a
-- view rather than a synced table: a background job flipping a stored
-- status is one more place for the truth to drift. Only revoked_at is
-- actually stored state (null = still active).
create table public.student_access_grants (
  id uuid primary key default gen_random_uuid(),
  -- Always stored lower(trim(...)) — every write path (grant, bulk
  -- import, the registration trigger below) normalizes before touching
  -- this column, so a plain unique index is enough; no citext needed.
  email text not null,
  user_id uuid references public.profiles (id) on delete set null,
  granted_tier public.plan_tier not null,
  granted_by uuid not null references public.profiles (id) on delete restrict,
  granted_at timestamptz not null default now(),
  -- null = permanent access.
  expires_at timestamptz,
  revoked_at timestamptz,
  admin_note text,
  -- Lets the student dashboard show "Your CSCA Prep access has been
  -- activated" exactly once, on first visit after the grant links to
  -- their new account — flips true via a narrow, self-service column
  -- grant below, the same pattern ai_recommendations uses for is_read.
  activation_message_shown boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_access_grants_tier_is_paid check (granted_tier in ('premium', 'premium_plus')),
  constraint student_access_grants_expiry_after_grant check (expires_at is null or expires_at > granted_at)
);

-- One active (non-revoked) grant per email at a time — granting again
-- to an already-granted email is an update (extend/change tier), never
-- a second row; see grantFreeAccessCore's upsert-by-email logic.
create unique index uq_student_access_grants_active_email
  on public.student_access_grants (email)
  where revoked_at is null;

create index idx_student_access_grants_user on public.student_access_grants (user_id);
create index idx_student_access_grants_email on public.student_access_grants (email);
create index idx_student_access_grants_expires on public.student_access_grants (expires_at) where revoked_at is null;

create trigger student_access_grants_set_updated_at
  before update on public.student_access_grants
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- AUDIT LOGS
-- ============================================================
-- Deferred since Phase 1 (docs/ARCHITECTURE.md: "no sense creating the
-- log table before there's a feature writing to it") — this is that
-- feature. Append-only, system-written only, same posture as
-- points_ledger: no insert/update policy for `authenticated` at all.
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  -- Denormalized: a PENDING_REGISTRATION grant's target has no account
  -- (and therefore no stable profile row) yet, so target_id alone can't
  -- always identify who an action was about.
  target_email text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_target on public.audit_logs (target_type, target_id);
create index idx_audit_logs_created on public.audit_logs (created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.student_access_grants enable row level security;
alter table public.audit_logs enable row level security;

-- Admin-only, matching profiles_admin_read_all/payments_staff_read —
-- this is billing-adjacent, sensitive data, not content_manager's
-- concern. No write policy for `authenticated` at all: every mutation
-- goes through the elevated `db` client in
-- lib/admin/access-grants-actions-core.ts, the same trusted-server-only
-- pattern already used for role changes on `profiles`.
create policy "student_access_grants_admin_read" on public.student_access_grants
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') = 'admin');

-- A student may see their own grant (needed to render "your access is
-- active/expiring" on their own dashboard) and flip the one
-- self-service flag below — never anything that actually controls
-- their entitlement (tier, expiry, revocation stay admin/service-role
-- only). Same shape as ai_recommendations_owner_update.
create policy "student_access_grants_owner_read" on public.student_access_grants
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "student_access_grants_owner_update" on public.student_access_grants
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke update on public.student_access_grants from authenticated;
grant update (activation_message_shown) on public.student_access_grants to authenticated;

create policy "audit_logs_admin_read" on public.audit_logs
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') = 'admin');

-- ============================================================
-- EFFECTIVE ACCESS: extend current_user_plan_tier()
-- ============================================================
-- The one function every plan-tier check in the app already calls (RLS
-- on courses/lessons, lib/billing/plan.ts's getCurrentPlanTier, the
-- free-tier exam limit) — extending it here means an admin-granted free
-- access is respected everywhere automatically, with zero other call
-- sites touched. This *is* this feature's getEffectiveAccess(): the
-- higher (via plan_tier_rank) of the paid-subscription tier and the
-- active-grant tier.
create or replace function public.current_user_plan_tier()
returns public.plan_tier
language sql
stable
as $$
  with subscription_tier as (
    select coalesce(
      (
        select plan_tier from public.subscriptions
        where user_id = auth.uid() and status in ('active', 'trialing')
        order by current_period_end desc
        limit 1
      ),
      'free'::public.plan_tier
    ) as tier
  ),
  grant_tier as (
    select coalesce(
      (
        select granted_tier from public.student_access_grants
        where user_id = auth.uid()
          and revoked_at is null
          and (expires_at is null or expires_at > now())
        order by granted_at desc
        limit 1
      ),
      'free'::public.plan_tier
    ) as tier
  )
  select case
    when public.plan_tier_rank((select tier from subscription_tier)) >= public.plan_tier_rank((select tier from grant_tier))
      then (select tier from subscription_tier)
    else (select tier from grant_tier)
  end;
$$;

-- ============================================================
-- REGISTRATION: auto-link a pending grant by normalized email
-- ============================================================
-- Scenario B from this feature's spec: an admin grants access to an
-- email before the student ever signs up. Done here, inside the
-- existing signup trigger (security definer, so it can read/write
-- student_access_grants/audit_logs regardless of RLS), so the linking
-- can never be raced, skipped, or influenced by anything the client
-- sends at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  matched_grant_id uuid;
  normalized_email text := lower(trim(new.email));
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  select id into matched_grant_id
  from public.student_access_grants
  where email = normalized_email
    and user_id is null
    and revoked_at is null
    and (expires_at is null or expires_at > now())
  limit 1;

  if matched_grant_id is not null then
    update public.student_access_grants
    set user_id = new.id, updated_at = now()
    where id = matched_grant_id;

    insert into public.audit_logs (actor_id, action, target_type, target_id, target_email, new_value)
    values (
      null,
      'access_auto_linked_at_registration',
      'student_access_grant',
      matched_grant_id,
      normalized_email,
      jsonb_build_object('user_id', new.id)
    );
  end if;

  return new;
end;
$$;

-- ============================================================
-- ADMIN_USER_DIRECTORY: add last_sign_in_at
-- ============================================================
-- This feature's admin table wants a "Last Login" column — auth.users
-- already tracks this natively, so it's an additive column on the
-- existing view (0010_admin_user_directory.sql) rather than a new one.
-- CREATE OR REPLACE VIEW can append columns without breaking anything
-- already selecting the original ones by name.
create or replace view public.admin_user_directory as
select
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at,
  u.last_sign_in_at
from public.profiles p
join auth.users u on u.id = p.id
where (select auth.jwt() ->> 'user_role') = 'admin';

