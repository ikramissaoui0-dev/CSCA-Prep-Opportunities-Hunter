-- Phase 4 — exam engine additions and an RLS correction found while
-- building it.
--
-- SECURITY FIX: 0003_exam_schema.sql granted `authenticated` a `for all`
-- policy on exam_sessions and session_answers (owner-scoped by user_id).
-- That was fine for reads, but for writes it means a signed-in student
-- could call the Supabase REST API directly — bypassing this app
-- entirely — and INSERT a session with status='submitted', score=100,
-- or UPDATE an in-progress session's score, without ever answering a
-- question. Grading has to be trusted server logic, the same way
-- subscriptions/payments already are (0004_commerce_schema.sql): the
-- client can read its own rows, but only the server can write them.

-- ============================================================
-- EXAM_SESSIONS: new columns
-- ============================================================
alter table public.exam_sessions
  add column question_order jsonb not null default '[]'::jsonb,
  add column tab_switch_count integer not null default 0;

comment on column public.exam_sessions.question_order is
  'Ordered array of question UUIDs, randomized once at session start and fixed for the life of the session — makes shared "answer #3 is B" cheat sheets useless without preventing legitimate resume.';
comment on column public.exam_sessions.tab_switch_count is
  'Basic anti-cheat telemetry: incremented when the exam-taking page loses focus. Logged, not enforced — a browser cannot reliably prevent tab-switching, only report it.';

alter table public.exam_sessions
  add constraint exam_sessions_question_count_range
    check (question_count is null or (question_count > 0 and question_count <= 100)),
  add constraint exam_sessions_difficulty_range_valid
    check (difficulty_min is null or difficulty_max is null or difficulty_min <= difficulty_max);

-- ============================================================
-- EXAM_SESSIONS: lock down writes to server-only
-- ============================================================
drop policy if exists "exam_sessions_owner" on public.exam_sessions;

create policy "exam_sessions_owner_read" on public.exam_sessions
  for select to authenticated
  using (user_id = (select auth.uid()));

revoke insert, update, delete on public.exam_sessions from authenticated;

-- ============================================================
-- SESSION_ANSWERS: same correction
-- ============================================================
drop policy if exists "session_answers_owner" on public.session_answers;

create policy "session_answers_owner_read" on public.session_answers
  for select to authenticated
  using (session_id in (select id from public.exam_sessions where user_id = (select auth.uid())));

revoke insert, update, delete on public.session_answers from authenticated;
