-- Phase 1 launch scoping: no self-serve checkout yet (Stripe stays wired
-- but off the UI — see billing/pricing page changes) — a student
-- contacts the team, who grants paid-tier access via student_access_grants
-- (0012). Free accounts get exactly one practice-exercises series per
-- subject as a taste of the content; everything else, and every past
-- exam paper, requires that admin-granted access.

-- ============================================================
-- QUESTION_CATEGORIES: required_plan_tier
-- ============================================================
-- Same shape as courses/lessons' required_plan_tier (0005_learning_schema.sql)
-- — one column, checked via plan_tier_rank/current_user_plan_tier() at
-- read time, rather than a second bespoke gating mechanism. Defaults to
-- 'premium' (locked) so every newly-added category is locked by
-- default; a topic group's own children are set individually below
-- (nesting doesn't auto-inherit — see the comment on the update below).
alter table public.question_categories
  add column required_plan_tier public.plan_tier not null default 'premium';

-- The one free series per subject: an entire topic group (parent row
-- and its children both marked 'free') so a free account gets a full,
-- coherent set of topics to try, not a single narrow leaf. Chosen as
-- each subject's most foundational/introductory group — Functions
-- (Math), Mechanics (Physics), Fundamentals (Chemistry, literally named
-- for this).
update public.question_categories
set required_plan_tier = 'free'
where id in (
  '68ddd66b-26a9-4db1-949f-8c582ecbd2b4', -- Mathematics: Functions (group)
  '126ee771-dcfe-4ebc-8881-8776301d5e1c', -- Mathematics: Functions -> Calculus
  'a2135739-a6f4-4f35-bba8-215eda2e6ea6', -- Mathematics: Functions -> Elementary functions
  'cbad9000-f355-4ea8-bf13-7a09cc4faa33', -- Mathematics: Functions -> Functions (leaf)
  'eb28212f-378b-4144-bd7b-d414277bd752', -- Mathematics: Functions -> Sequences
  '40db470d-529e-47c3-bddc-cdb88fc548ac', -- Physics: Mechanics (group)
  '817ba2cd-bb49-4e07-88cc-759f3e528941', -- Physics: Mechanics -> Circular Motion & Gravitation
  '8e15cb32-4659-4708-8fd9-d84e03f47948', -- Physics: Mechanics -> Kinematics
  'ed1cf086-cde1-4ca8-8805-9b2871a5a7a5', -- Physics: Mechanics -> Momentum & Impulse
  '89ba8a91-3400-48f5-9180-288e4296bcd1', -- Physics: Mechanics -> Newton's Laws of Motion
  '36315a77-aecd-42fd-92c5-8246a6f70c13', -- Physics: Mechanics -> Work & Energy
  'ff22f939-7f12-40f9-a3e1-fc4564e9a468', -- Chemistry: Fundamentals (group)
  'b4fd416e-86db-4672-b674-0e5c03616ef8', -- Chemistry: Fundamentals -> Atomic Structure & Periodic Law
  'ba6b576b-da39-47bd-b9a1-b7a3cb9111af', -- Chemistry: Fundamentals -> Chemical Bonding & Intermolecular Forces
  'e1f1bf67-8ab9-4fbe-afe3-161bc496f51a', -- Chemistry: Fundamentals -> Chemical Nomenclature & Equations
  '3b78f37b-fe7f-4b88-8dd7-90178563dc99', -- Chemistry: Fundamentals -> Mole Calculations
  'a8fc6235-690e-4508-8872-5a3855be2dda'  -- Chemistry: Fundamentals -> Matter Classification & State Changes
);

-- ============================================================
-- QUESTIONS / QUESTION_OPTIONS_PUBLIC: gate by category tier
-- ============================================================
-- Defense in depth alongside the app-layer check in startExamCore —
-- without this, a signed-in user could still read locked question
-- content directly via PostgREST (Supabase's auto-generated REST API),
-- bypassing the app entirely. Mirrors lessons_read_accessible's
-- plan_tier_rank comparison (0005_learning_schema.sql).
drop policy "questions_read_published" on public.questions;
create policy "questions_read_published" on public.questions
  for select to authenticated
  using (
    is_published = true
    and category_id in (
      select id from public.question_categories
      where public.plan_tier_rank(public.current_user_plan_tier()) >= public.plan_tier_rank(required_plan_tier)
    )
  );

-- question_options_public runs as the view owner, not security_invoker
-- (0002_content_schema.sql's own comment: authenticated has no grant on
-- the base table), so the tier check must be repeated here explicitly —
-- the new questions_read_published policy above never applies to it.
create or replace view public.question_options_public
  as
  select qo.id, qo.question_id, qo.content, qo.position
  from public.question_options qo
  join public.questions q on q.id = qo.question_id
  join public.question_categories qc on qc.id = q.category_id
  where q.is_published = true
    and public.plan_tier_rank(public.current_user_plan_tier()) >= public.plan_tier_rank(qc.required_plan_tier);
