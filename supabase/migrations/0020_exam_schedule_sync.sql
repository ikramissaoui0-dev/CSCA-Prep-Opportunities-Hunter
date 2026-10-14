-- Exam Guide auto-sync: official CSCA test-session schedule, kept in
-- sync with csca.cn's own homepage data feed (GET
-- https://csca.cn/sv/open/getConfByCode?confCode=SY_KSRQ, the exact
-- JSON that powers their own "考试日期" cards — no HTML scraping) via
-- a Vercel Cron job hitting app/api/cron/sync-exam-schedule. Replaces
-- the hand-maintained UPCOMING_SESSIONS constant that used to live in
-- apps/web/app/(marketing)/exam-guide/page.tsx.
create table public.exam_schedule_sessions (
  id uuid primary key default gen_random_uuid(),
  -- csca.cn's own numeric id for this session card — the stable key
  -- synced rows are matched against, not the exam date (their IDs
  -- outlive the one time they've ever changed a published date).
  source_id text not null unique,
  exam_start date not null,
  exam_end date not null,
  signup_start timestamptz,
  signup_end timestamptz,
  -- Kept verbatim alongside the parsed signup_start/end — csca.cn's own
  -- format for this field ("2026.10.15 15:00-2026.10.21 23:59") has no
  -- documented stability guarantee, so if a future sync ever fails to
  -- parse it, this is what tells a human what actually came back.
  signup_text_raw text,
  status_zh text,
  status_en text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger exam_schedule_sessions_set_updated_at
  before update on public.exam_schedule_sessions
  for each row execute procedure public.set_updated_at();

alter table public.exam_schedule_sessions enable row level security;

-- Public reference data (powers the public /exam-guide page) — readable
-- by anyone. No write policy at all: every write goes through the sync
-- job's elevated `db` connection (lib/db.ts), which bypasses RLS by
-- design, so there is deliberately no authenticated-write path for this
-- table through PostgREST/the client-facing API.
create policy "exam_schedule_sessions_read_all" on public.exam_schedule_sessions
  for select to anon, authenticated using (true);
