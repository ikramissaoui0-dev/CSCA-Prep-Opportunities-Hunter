-- Lets a subject_practice session optionally scope itself to one topic
-- (question_categories row) within the chosen subject, not just the
-- subject as a whole — mirrors the existing subject_id ad-hoc filter
-- column from 0003_exam_schema.sql. Nullable: "all topics in this
-- subject" (today's only behavior) stays a valid choice, this only adds
-- a narrower option on top of it.
alter table public.exam_sessions
  add column category_id uuid references public.question_categories (id);
