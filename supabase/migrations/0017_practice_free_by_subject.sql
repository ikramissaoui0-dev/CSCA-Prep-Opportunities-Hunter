-- Supersedes 0016_practice_free_preview.sql's per-topic free preview:
-- a free account's one practice shot is now one whole-subject session
-- (all topics mixed, capped at 48 questions server-side in
-- startExamCore), not one single topic forever. The per-category
-- required_plan_tier gate is no longer how that's enforced — the real
-- boundary is now "has this user already started one subject_practice
-- session for this subject" (checked in app code) — so every practice
-- category goes back to 'free' here; RLS on questions/
-- question_options_public still exists (0016) but is now a no-op for
-- practice content since nothing is tiered 'premium' anymore. Past
-- exam papers stay gated the same way they always were (0 free access,
-- enforced directly on exam mode in startExamCore, untouched by this).
update public.question_categories
set required_plan_tier = 'free'
where name like 'Practice exercises - %';
