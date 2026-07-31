-- CSCA Prep — reference schema (PostgreSQL / Supabase)
--
-- SUPERSEDED as of Phase 2: this was the pre-implementation sketch. The
-- real, applied schema is supabase/migrations/0001-0007_*.sql — that's
-- what's authoritative now, and it differs from this file in real ways
-- (e.g. `exam_attempts`/`attempt_answers` here became `exam_sessions`/
-- `session_answers`; `topics` became `question_categories`; roles are
-- `student`/`admin`/`content_manager`, not the 5-role set below; plan
-- tiers are `free`/`premium`/`premium_plus`). Kept only as a historical
-- record of the original design intent — read the migrations for what's
-- actually there.

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('student', 'content_editor', 'support', 'admin', 'super_admin');
create type plan_tier as enum ('free', 'basic', 'premium');
create type question_type as enum ('mcq', 'free_response');
create type exam_type as enum ('full_mock', 'topic_quiz');
create type attempt_status as enum ('in_progress', 'submitted', 'expired');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');

-- ============================================================
-- IDENTITY
-- ============================================================
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role user_role not null default 'student',
  locale text not null default 'en',
  country text,
  plan_tier plan_tier not null default 'free',
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup; role is never client-settable.
create function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- CONTENT
-- ============================================================
create table subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  name text not null,
  slug text not null
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics (id) on delete restrict,
  type question_type not null default 'mcq',
  difficulty numeric(4,2) not null default 0.5,   -- 0.00 (easiest) - 1.00 (hardest)
  content jsonb not null,                          -- { "en": "...", "zh": "..." }
  correct_explanation jsonb,                       -- author-written fallback, server-only
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  content jsonb not null,
  is_correct boolean not null default false,
  position smallint not null
);

-- AI-generated explanations, cached per question+language so cost scales
-- with question-bank size, not student count.
create table explanations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  language text not null,
  content text not null,
  model_version text not null,
  generated_at timestamptz not null default now(),
  unique (question_id, language)
);

create table exams (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  type exam_type not null default 'full_mock',
  time_limit_seconds integer not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table exam_questions (
  exam_id uuid not null references exams (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  position smallint not null,
  primary key (exam_id, question_id)
);

-- ============================================================
-- LEARNING ACTIVITY
-- ============================================================
create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exam_id uuid not null references exams (id) on delete restrict,
  status attempt_status not null default 'in_progress',
  score numeric(5,2),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique (user_id, exam_id, started_at)
);

create index idx_exam_attempts_user_exam on exam_attempts (user_id, exam_id);
create index idx_exam_attempts_in_progress on exam_attempts (status) where status = 'in_progress';

create table attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references exam_attempts (id) on delete cascade,
  question_id uuid not null references questions (id) on delete restrict,
  selected_option_id uuid references question_options (id),
  is_correct boolean,
  time_spent_ms integer,
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create index idx_attempt_answers_attempt on attempt_answers (attempt_id);

create table learning_paths (
  user_id uuid primary key references profiles (id) on delete cascade,
  mastery_vector jsonb not null default '{}',   -- { topic_id: score }
  next_recommended_topic_id uuid references topics (id),
  updated_at timestamptz not null default now()
);

create index idx_questions_topic_difficulty on questions (topic_id, difficulty);

-- ============================================================
-- COMMERCE
-- ============================================================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique not null,
  status subscription_status not null,
  current_period_end timestamptz not null
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  stripe_payment_intent_id text unique not null,
  stripe_event_id text unique not null,   -- idempotency guard for webhook replays
  amount_cents integer not null,
  currency text not null default 'usd',
  created_at timestamptz not null default now()
);

-- ============================================================
-- PLATFORM
-- ============================================================
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id),
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  channel text not null,   -- 'email' | 'in_app'
  payload jsonb not null,
  sent_at timestamptz
);

-- ============================================================
-- ROW LEVEL SECURITY (representative policies — extend per table)
-- ============================================================
alter table profiles enable row level security;
alter table exam_attempts enable row level security;
alter table attempt_answers enable row level security;
alter table learning_paths enable row level security;
alter table subscriptions enable row level security;
alter table questions enable row level security;
alter table question_options enable row level security;

-- Students can only see/edit their own profile.
create policy profiles_self on profiles
  for select using (id = auth.uid());
create policy profiles_self_update on profiles
  for update using (id = auth.uid());

-- Students can only see/mutate their own exam attempts.
create policy exam_attempts_owner on exam_attempts
  for all using (user_id = auth.uid());

create policy attempt_answers_owner on attempt_answers
  for all using (
    attempt_id in (select id from exam_attempts where user_id = auth.uid())
  );

create policy learning_paths_owner on learning_paths
  for all using (user_id = auth.uid());

create policy subscriptions_owner on subscriptions
  for select using (user_id = auth.uid());

-- Published questions are readable by any authenticated student,
-- but is_correct on options is only exposed via server-role queries
-- (enforced in application layer, not by column-level RLS, since
-- Postgres RLS is row- not column-scoped).
create policy questions_read_published on questions
  for select using (is_published = true);
create policy question_options_read_published on question_options
  for select using (
    question_id in (select id from questions where is_published = true)
  );

-- Admin/content_editor override (example pattern; repeat per table as needed).
create policy questions_admin_all on questions
  for all using (
    (auth.jwt() ->> 'role') in ('admin', 'super_admin', 'content_editor')
  );
