-- Phase 2 — exam schema: curated exams, exam sessions (Phase 2 brief calls
-- these "Exam Sessions"), answers, and computed results.
--
-- Design note on the four exam modes from Phase 4 (full simulation,
-- practice by subject, practice by difficulty, daily challenge): only
-- `full_mock` and `daily_challenge` are *curated* — a staff-picked, fixed
-- question list. `subject_practice` and `difficulty_practice` are ad-hoc:
-- the question set is chosen at session-start time from a filter
-- (subject or difficulty range), not from a persisted question list. So
-- `exams` only ever holds the two curated modes, and `exam_sessions.exam_id`
-- is nullable — null means "ad-hoc, see the filter columns instead".

create type public.exam_mode as enum ('full_mock', 'subject_practice', 'difficulty_practice', 'daily_challenge');
create type public.exam_session_status as enum ('in_progress', 'submitted', 'expired');

-- ============================================================
-- EXAMS (curated only — full_mock and daily_challenge)
-- ============================================================
create table public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  mode public.exam_mode not null,
  time_limit_seconds integer not null,
  -- Set only when mode = 'daily_challenge'; one challenge per calendar day.
  challenge_date date,
  is_published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exams_curated_modes_only check (mode in ('full_mock', 'daily_challenge')),
  constraint exams_challenge_date_matches_mode
    check ((mode = 'daily_challenge') = (challenge_date is not null))
);

create unique index uq_exams_challenge_date on public.exams (challenge_date) where mode = 'daily_challenge';

create trigger exams_set_updated_at
  before update on public.exams
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- EXAM QUESTIONS (curated question list, ordered)
-- ============================================================
create table public.exam_questions (
  exam_id uuid not null references public.exams (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete restrict,
  position smallint not null,
  primary key (exam_id, question_id),
  unique (exam_id, position)
);

-- ============================================================
-- EXAM SESSIONS ("Exam Sessions" in the Phase 2 brief)
-- ============================================================
create table public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Null for ad-hoc practice (subject_practice / difficulty_practice).
  exam_id uuid references public.exams (id) on delete restrict,
  mode public.exam_mode not null,
  -- Ad-hoc session filters — only the ones matching `mode` are set.
  subject_id uuid references public.subjects (id),
  difficulty_min numeric(4, 2),
  difficulty_max numeric(4, 2),
  question_count smallint,
  -- Null = untimed practice. Curated exams always carry their own limit
  -- (copied from exams.time_limit_seconds when the session starts).
  time_limit_seconds integer,
  status public.exam_session_status not null default 'in_progress',
  score numeric(5, 2),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint exam_sessions_curated_needs_exam
    check ((mode in ('full_mock', 'daily_challenge')) = (exam_id is not null)),
  constraint exam_sessions_subject_practice_needs_subject
    check (mode <> 'subject_practice' or subject_id is not null),
  constraint exam_sessions_difficulty_practice_needs_range
    check (mode <> 'difficulty_practice' or (difficulty_min is not null and difficulty_max is not null)),
  -- NULL exam_id values are never considered equal by a unique
  -- constraint, so this only actually restricts curated-mode sessions —
  -- exactly the ones where "duplicate concurrent attempt" is meaningful.
  unique (user_id, exam_id, started_at)
);

create index idx_exam_sessions_user_exam on public.exam_sessions (user_id, exam_id);
create index idx_exam_sessions_in_progress on public.exam_sessions (status) where status = 'in_progress';

create trigger exam_sessions_set_updated_at
  before update on public.exam_sessions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- SESSION ANSWERS ("Answers" in the Phase 2 brief)
-- ============================================================
create table public.session_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete restrict,
  -- Exactly one of these two should be set, matching questions.type — not
  -- enforceable as a check constraint (that would need to inspect the
  -- referenced question's type, a different table), so this is an
  -- invariant the Phase 4 submission logic is responsible for.
  selected_option_id uuid references public.question_options (id),
  free_response_text text,
  is_correct boolean,
  time_spent_ms integer,
  answered_at timestamptz not null default now(),
  unique (session_id, question_id)
);

create index idx_session_answers_session on public.session_answers (session_id);

-- ============================================================
-- EXAM RESULTS (Phase 6 result analysis — one row per submitted session)
-- ============================================================
-- Populated by application logic when a session's status moves to
-- 'submitted' (Phase 4/6), not written directly by users — hence no
-- default-generating columns beyond created_at.
create table public.exam_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.exam_sessions (id) on delete cascade,
  total_questions smallint not null,
  correct_count smallint not null,
  wrong_count smallint not null,
  skipped_count smallint not null default 0,
  score numeric(5, 2) not null,
  percentage numeric(5, 2) not null,
  time_spent_seconds integer not null,
  -- { "<subject_id>": { "correct": n, "total": n, "percentage": n }, ... }
  subject_breakdown jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint exam_results_percentage_range check (percentage >= 0 and percentage <= 100)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.session_answers enable row level security;
alter table public.exam_results enable row level security;

create policy "exams_read_published" on public.exams
  for select to authenticated using (is_published = true);
create policy "exams_staff_all" on public.exams
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "exam_questions_read_published" on public.exam_questions
  for select to authenticated
  using (exam_id in (select id from public.exams where is_published = true));
create policy "exam_questions_staff_all" on public.exam_questions
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "exam_sessions_owner" on public.exam_sessions
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "exam_sessions_staff_read" on public.exam_sessions
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "session_answers_owner" on public.session_answers
  for all to authenticated
  using (session_id in (select id from public.exam_sessions where user_id = (select auth.uid())))
  with check (session_id in (select id from public.exam_sessions where user_id = (select auth.uid())));
create policy "session_answers_staff_read" on public.session_answers
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "exam_results_owner_read" on public.exam_results
  for select to authenticated
  using (session_id in (select id from public.exam_sessions where user_id = (select auth.uid())));
create policy "exam_results_staff_read" on public.exam_results
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));
