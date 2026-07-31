-- Phase 11 — starter achievement catalog. Reference data (what badges
-- exist at all), not test content — same reasoning as why `user_role`'s
-- enum values live in a migration rather than a seed script. There is no
-- admin UI for authoring achievements (matching how subjects/categories
-- also have no dedicated CRUD screen — see admin/content's bulk import
-- creating them on the fly instead); the catalog is small and fixed
-- enough for now that a migration is the simplest source of truth.
--
-- code is what application code (lib/gamification/achievements.ts)
-- checks against — never the id, so this table can be re-seeded or
-- extended without touching the rule-checking code.
insert into public.achievements (code, title, description, points) values
  ('first_exam', 'First Steps', 'Complete your first exam.', 10),
  ('perfect_score', 'Perfectionist', 'Score 100% on a mock exam.', 50),
  ('ten_exams', 'Dedicated', 'Complete 10 exams.', 100),
  ('week_streak', 'On a Roll', 'Practice on 7 days in a row.', 75),
  ('bookworm', 'Bookworm', 'Complete 5 lessons.', 30),
  ('course_complete', 'Course Champion', 'Complete every lesson in a course.', 60)
on conflict (code) do nothing;
