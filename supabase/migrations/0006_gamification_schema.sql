-- Phase 2 — gamification schema: achievements, points, and the
-- leaderboard (Phase 11).
--
-- "Leaderboard" is intentionally not a raw writable table — it's a
-- ranking derived from `points_ledger`, an append-only event log (one
-- row per point-earning event: exam completed, achievement earned,
-- streak bonus, ...). Storing "current points" as its own mutable column
-- would drift from that log the first time an update was missed; the
-- ledger is the only thing that has to stay correct.

-- ============================================================
-- ACHIEVEMENTS (badge catalog)
-- ============================================================
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  icon_url text,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.user_achievements (
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create index idx_user_achievements_user on public.user_achievements (user_id);

-- ============================================================
-- POINTS LEDGER
-- ============================================================
create table public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  points integer not null,
  source_type text not null,
  -- Polymorphic pointer (exam_sessions.id, achievements.id, ...) — no FK,
  -- since a single column can't reference multiple tables. Accepted
  -- trade-off for a ledger that spans several event sources.
  source_id uuid,
  description text,
  created_at timestamptz not null default now(),
  constraint points_ledger_nonzero check (points <> 0),
  constraint points_ledger_known_source check (
    source_type in ('exam_completed', 'achievement_earned', 'streak_bonus', 'daily_challenge', 'lesson_completed')
  )
);

create index idx_points_ledger_user on public.points_ledger (user_id);

-- ============================================================
-- PROFILES_PUBLIC (leaderboard's first consumer)
-- ============================================================
-- A leaderboard is inherently cross-user visible by design, but
-- `profiles` (0001_auth_foundation.sql) only lets a user read their own
-- row — role and other account fields have no business being broadcast.
-- This view exposes just the display-safe columns, and — like
-- question_options_public — deliberately runs as its owner (default,
-- non-security-invoker) rather than the caller, so it can see every
-- user's row without loosening profiles' own RLS at all.
create view public.profiles_public
  as
  select id, full_name, avatar_url
  from public.profiles;

grant select on public.profiles_public to authenticated;

-- ============================================================
-- LEADERBOARD (view, not a table — see file header)
-- ============================================================
-- security_invoker = true here is correct (unlike profiles_public
-- above): points_ledger already grants SELECT of every row to
-- `authenticated` below, so running as the caller changes nothing except
-- correctly deferring to whatever that grant is in the future.
create view public.leaderboard
  with (security_invoker = true)
  as
  select
    pl.user_id,
    pp.full_name,
    pp.avatar_url,
    sum(pl.points) as total_points,
    dense_rank() over (order by sum(pl.points) desc) as rank
  from public.points_ledger pl
  join public.profiles_public pp on pp.id = pl.user_id
  group by pl.user_id, pp.full_name, pp.avatar_url;

grant select on public.leaderboard to authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.points_ledger enable row level security;

-- Badge catalog and who-earned-what are both non-sensitive and meant to
-- be visible on a public profile / leaderboard — readable by anyone
-- signed in, writable only by staff (catalog) or the system (awarding).
create policy "achievements_read_all" on public.achievements
  for select to authenticated using (true);
create policy "achievements_staff_write" on public.achievements
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') = 'admin')
  with check ((select auth.jwt() ->> 'user_role') = 'admin');

create policy "user_achievements_read_all" on public.user_achievements
  for select to authenticated using (true);

-- Points are the whole point of a public leaderboard — readable by
-- anyone signed in. Both tables are written only by application logic
-- (the service-role client, awarding points/badges on exam completion,
-- streaks, etc. in later phases) — no authenticated insert/update policy.
create policy "points_ledger_read_all" on public.points_ledger
  for select to authenticated using (true);
