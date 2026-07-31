-- Phase 2 — commerce schema: subscriptions and payments (Phase 9 wires
-- Stripe up to these; this migration only defines the mirror tables).
--
-- Design note: there is no `plan_tier` column on `profiles`. The
-- authoritative "what plan is this user on" answer is "their most recent
-- subscriptions row with status in ('active','trialing')" — a
-- denormalized profiles.plan_tier could silently drift from Stripe if a
-- webhook is ever missed. No row at all means the free plan, implicitly.
--
-- Both tables are written only by the Stripe webhook handler (Phase 9's
-- `stripe-webhook` Edge Function, using the service-role client, which
-- bypasses RLS) — never directly by an authenticated user, hence no
-- insert/update policy for `authenticated` on either table.

create type public.plan_tier as enum ('free', 'premium', 'premium_plus');
-- Mirrors Stripe's own subscription.status values 1:1.
create type public.subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused'
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_tier public.plan_tier not null,
  status public.subscription_status not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  stripe_price_id text not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_user on public.subscriptions (user_id);
create index idx_subscriptions_user_status on public.subscriptions (user_id, status);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- PAYMENTS (one-off purchases and subscription invoice receipts)
-- ============================================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Null for a one-off purchase (e.g. an extra mock-exam bundle) not tied
  -- to a subscription invoice.
  subscription_id uuid references public.subscriptions (id) on delete set null,
  stripe_payment_intent_id text not null unique,
  -- Idempotency guard against webhook replays (docs/ARCHITECTURE.md security section).
  stripe_event_id text not null unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'succeeded',
  description text,
  created_at timestamptz not null default now(),
  constraint payments_status_allowed check (status in ('succeeded', 'failed', 'refunded'))
);

create index idx_payments_user on public.payments (user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "subscriptions_owner_read" on public.subscriptions
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "subscriptions_staff_read" on public.subscriptions
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') = 'admin');

create policy "payments_owner_read" on public.payments
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "payments_staff_read" on public.payments
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') = 'admin');
