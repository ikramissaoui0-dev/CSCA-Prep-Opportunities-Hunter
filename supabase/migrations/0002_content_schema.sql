-- Phase 2 — content schema: subjects, question categories, questions,
-- question options, and cached AI explanations (Phase 5's question bank
-- and Phase 7's AI tutor both build on this).

-- ============================================================
-- ENUMS
-- ============================================================
create type public.question_type as enum ('mcq', 'free_response');

-- ============================================================
-- SUBJECTS
-- ============================================================
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger subjects_set_updated_at
  before update on public.subjects
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- QUESTION CATEGORIES (topics within a subject, e.g. "Algebra" in "Math")
-- ============================================================
create table public.question_categories (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, slug)
);

create index idx_question_categories_subject on public.question_categories (subject_id);

create trigger question_categories_set_updated_at
  before update on public.question_categories
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- QUESTIONS
-- ============================================================
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.question_categories (id) on delete restrict,
  type public.question_type not null default 'mcq',
  difficulty numeric(4, 2) not null default 0.5,
  title text not null,
  body text not null,
  -- Only meaningful for type = 'free_response'; MCQ correctness lives on
  -- question_options instead, since a question can have >1 valid framing
  -- of "the correct option".
  correct_answer_text text,
  -- Human-authored fallback, always available even before the AI pipeline
  -- (Phase 7) has generated/cached an explanation for this question.
  author_explanation text,
  image_url text,
  -- [{ "url": "...", "name": "...", "type": "pdf" }, ...]
  attachments jsonb not null default '[]',
  is_published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_difficulty_range check (difficulty >= 0 and difficulty <= 1),
  constraint questions_free_response_has_answer
    check (type <> 'free_response' or correct_answer_text is not null)
);

create index idx_questions_category_difficulty on public.questions (category_id, difficulty);
create index idx_questions_published on public.questions (is_published);

create trigger questions_set_updated_at
  before update on public.questions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- QUESTION OPTIONS (MCQ choices)
-- ============================================================
create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  content text not null,
  is_correct boolean not null default false,
  position smallint not null,
  created_at timestamptz not null default now(),
  unique (question_id, position)
);

create index idx_question_options_question on public.question_options (question_id);

-- At most one correct option per question — the other half ("at least
-- one exists") isn't expressible as a plain constraint (it depends on
-- sibling rows) and is enforced by the Phase 5 question editor instead.
create unique index uq_question_options_one_correct
  on public.question_options (question_id)
  where is_correct;

-- ============================================================
-- EXPLANATIONS (AI-generated, cached per question + language — Phase 7)
-- ============================================================
create table public.explanations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  language text not null default 'en',
  content text not null,
  model_version text not null,
  generated_at timestamptz not null default now(),
  unique (question_id, language)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.subjects enable row level security;
alter table public.question_categories enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.explanations enable row level security;

-- Subjects/categories are non-sensitive taxonomy — readable by anyone
-- signed in, writable only by content staff.
create policy "subjects_read_all" on public.subjects
  for select to authenticated using (true);
create policy "subjects_write_staff" on public.subjects
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "question_categories_read_all" on public.question_categories
  for select to authenticated using (true);
create policy "question_categories_write_staff" on public.question_categories
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

-- Students may only ever see published questions; staff see everything
-- (drafts included) so they can review before publishing.
create policy "questions_read_published" on public.questions
  for select to authenticated using (is_published = true);
create policy "questions_read_staff" on public.questions
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));
create policy "questions_write_staff" on public.questions
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

-- question_options: RLS is row-level, not column-level, so it cannot by
-- itself hide `is_correct` from a student mid-exam — see the
-- question_options_public view below, which is what the exam-taking UI
-- (Phase 4) actually reads from.
create policy "question_options_staff_all" on public.question_options
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

revoke select on public.question_options from authenticated;

-- Answer-key protection (docs/ARCHITECTURE.md security section): the
-- exam-taking UI reads options through this view, which simply omits
-- is_correct. Grading (Phase 4) reads the base table with the service-role
-- client instead, after a submission is already recorded.
--
-- Deliberately NOT security_invoker: `authenticated` has no SELECT grant
-- on the base table (revoked above) specifically so this view is the
-- only way in. A security_invoker view would check the *caller's*
-- privileges on question_options and fail for everyone — this needs to
-- run as the view owner instead, which is exactly the default.
create view public.question_options_public
  as
  select qo.id, qo.question_id, qo.content, qo.position
  from public.question_options qo
  join public.questions q on q.id = qo.question_id
  where q.is_published = true;

grant select on public.question_options_public to authenticated;

create policy "explanations_read_published" on public.explanations
  for select to authenticated
  using (
    question_id in (select id from public.questions where is_published = true)
  );
create policy "explanations_write_staff" on public.explanations
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));
