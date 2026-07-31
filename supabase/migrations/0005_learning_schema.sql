-- Phase 2 — learning schema: courses/lessons (Phase 10), progress
-- tracking, per-topic mastery, and AI recommendations (Phase 7).
--
-- Also adds the plan-tier access-control helpers Phase 9 asks for
-- ("access control based on subscription") — that's fundamentally an RLS
-- concern, so it belongs in the schema layer rather than app code.

create type public.lesson_content_type as enum ('video', 'pdf', 'notes', 'exercise');
create type public.recommendation_type as enum ('study_plan', 'revision', 'mistake_explanation', 'learning_strategy');

-- ============================================================
-- PLAN-TIER ACCESS HELPERS
-- ============================================================
create function public.plan_tier_rank(t public.plan_tier)
returns smallint
language sql
immutable
as $$
  select case t
    when 'free' then 0
    when 'premium' then 1
    when 'premium_plus' then 2
  end;
$$;

-- Not security definer: relies on the caller's own RLS access to
-- subscriptions (the "owner can read their own rows" policy from
-- 0004_commerce_schema.sql), which is exactly the access this needs.
create function public.current_user_plan_tier()
returns public.plan_tier
language sql
stable
as $$
  select coalesce(
    (
      select plan_tier from public.subscriptions
      where user_id = auth.uid() and status in ('active', 'trialing')
      order by current_period_end desc
      limit 1
    ),
    'free'::public.plan_tier
  );
$$;

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects (id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  required_plan_tier public.plan_tier not null default 'premium_plus',
  is_published boolean not null default false,
  display_order smallint not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- LESSONS
-- ============================================================
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position smallint not null,
  content_type public.lesson_content_type not null,
  video_url text,
  pdf_url text,
  notes_body text,
  -- For content_type = 'exercise': practice questions are pulled live
  -- from this category rather than a fixed list, so new questions added
  -- to the category benefit existing lessons automatically.
  exercise_category_id uuid references public.question_categories (id),
  duration_seconds integer,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, position),
  constraint lessons_content_matches_type check (
    (content_type = 'video' and video_url is not null)
    or (content_type = 'pdf' and pdf_url is not null)
    or (content_type = 'notes' and notes_body is not null)
    or (content_type = 'exercise' and exercise_category_id is not null)
  )
);

create index idx_lessons_course on public.lessons (course_id);

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  time_spent_seconds integer not null default 0,
  completed_at timestamptz,
  last_accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index idx_lesson_progress_user on public.lesson_progress (user_id);

-- Course-level completion is derived, not stored — a writable
-- `course_progress` table would just be one more place for the numbers
-- to drift from lesson_progress, the table that's actually true.
create view public.course_progress
  with (security_invoker = true)
  as
  select
    lp.user_id,
    l.course_id,
    count(*) filter (where lp.completed_at is not null) as completed_lessons,
    (select count(*) from public.lessons pl where pl.course_id = l.course_id and pl.is_published = true) as total_lessons,
    sum(lp.time_spent_seconds) as total_time_spent_seconds,
    max(lp.last_accessed_at) as last_accessed_at
  from public.lesson_progress lp
  join public.lessons l on l.id = lp.lesson_id
  group by lp.user_id, l.course_id;

grant select on public.course_progress to authenticated;

-- ============================================================
-- TOPIC MASTERY (per user, per question category)
-- ============================================================
create table public.topic_mastery (
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.question_categories (id) on delete cascade,
  mastery_score numeric(4, 2) not null default 0.5,
  questions_attempted integer not null default 0,
  questions_correct integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, category_id),
  constraint topic_mastery_score_range check (mastery_score >= 0 and mastery_score <= 1)
);

-- ============================================================
-- AI RECOMMENDATIONS
-- ============================================================
create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.recommendation_type not null,
  title text not null,
  content text not null,
  related_category_id uuid references public.question_categories (id) on delete set null,
  related_session_id uuid references public.exam_sessions (id) on delete set null,
  model_version text not null,
  is_read boolean not null default false,
  is_dismissed boolean not null default false,
  generated_at timestamptz not null default now(),
  expires_at timestamptz
);

create index idx_ai_recommendations_user on public.ai_recommendations (user_id, generated_at desc);
create index idx_ai_recommendations_unread on public.ai_recommendations (user_id) where is_read = false;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.topic_mastery enable row level security;
alter table public.ai_recommendations enable row level security;

create policy "courses_read_accessible" on public.courses
  for select to authenticated
  using (
    is_published = true
    and public.plan_tier_rank(public.current_user_plan_tier()) >= public.plan_tier_rank(required_plan_tier)
  );
create policy "courses_staff_all" on public.courses
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "lessons_read_accessible" on public.lessons
  for select to authenticated
  using (
    is_published = true
    and course_id in (
      select id from public.courses
      where is_published = true
        and public.plan_tier_rank(public.current_user_plan_tier()) >= public.plan_tier_rank(required_plan_tier)
    )
  );
create policy "lessons_staff_all" on public.lessons
  for all to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'))
  with check ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

create policy "lesson_progress_owner" on public.lesson_progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "topic_mastery_owner_read" on public.topic_mastery
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "topic_mastery_staff_read" on public.topic_mastery
  for select to authenticated
  using ((select auth.jwt() ->> 'user_role') in ('admin', 'content_manager'));

-- Recommendations are AI/system-generated (service-role write only);
-- a student may only read their own and toggle read/dismissed.
create policy "ai_recommendations_owner_read" on public.ai_recommendations
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy "ai_recommendations_owner_update" on public.ai_recommendations
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke update on public.ai_recommendations from authenticated;
grant update (is_read, is_dismissed) on public.ai_recommendations to authenticated;
