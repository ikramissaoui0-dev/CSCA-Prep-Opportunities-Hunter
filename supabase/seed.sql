-- Local development seed data — NOT production content. Auto-applied by
-- the Supabase CLI after `supabase db reset`. Phase 5 will replace this
-- with a real admin-authored question bank; until then, this is what
-- lets the Phase 4 exam engine be exercised end-to-end locally.
--
-- Almost every question here is type='mcq' (auto-graded instantly off
-- question_options.is_correct). One free_response question is seeded too,
-- now that Phase 7 added AI grading (lib/ai/grade-free-response.ts) —
-- see the note just above its insert below.
--
-- created_by is left null throughout: a fresh local instance has no
-- auth.users rows to reference, and the column is nullable for exactly
-- this reason.

-- ============================================================
-- SUBJECTS
-- ============================================================
insert into public.subjects (id, name, slug, description, display_order) values
  ('10000000-0000-0000-0000-000000000001', 'Math', 'math', 'Algebra, geometry, and quantitative reasoning.', 1),
  ('10000000-0000-0000-0000-000000000002', 'Chinese', 'chinese', 'Grammar, vocabulary, and reading comprehension.', 2),
  ('10000000-0000-0000-0000-000000000003', 'Logic', 'logic', 'Critical reasoning and problem solving.', 3);

-- ============================================================
-- QUESTION CATEGORIES
-- ============================================================
insert into public.question_categories (id, subject_id, name, slug, display_order) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Algebra', 'algebra', 1),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Geometry', 'geometry', 2),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Grammar', 'grammar', 1),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Reading Comprehension', 'reading-comprehension', 2),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Critical Reasoning', 'critical-reasoning', 1);

-- ============================================================
-- QUESTIONS + OPTIONS
-- ============================================================
-- Math / Algebra
insert into public.questions (id, category_id, difficulty, title, body, is_published) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 0.2, 'Solve for x', 'If 2x + 4 = 10, what is x?', true),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 0.4, 'Simplify', 'Simplify: 3(x + 2) - 2x', true),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 0.5, 'Linear system', 'If x + y = 10 and x - y = 4, what is x?', true),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 0.7, 'Quadratic roots', 'What are the roots of x^2 - 5x + 6 = 0?', true),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 0.8, 'Exponents', 'Simplify: (2^3) * (2^2)', true);

insert into public.question_options (question_id, content, is_correct, position) values
  ('30000000-0000-0000-0000-000000000001', 'x = 3', true, 1),
  ('30000000-0000-0000-0000-000000000001', 'x = 4', false, 2),
  ('30000000-0000-0000-0000-000000000001', 'x = 6', false, 3),
  ('30000000-0000-0000-0000-000000000002', 'x + 6', true, 1),
  ('30000000-0000-0000-0000-000000000002', '5x + 6', false, 2),
  ('30000000-0000-0000-0000-000000000002', 'x + 2', false, 3),
  ('30000000-0000-0000-0000-000000000003', 'x = 7', true, 1),
  ('30000000-0000-0000-0000-000000000003', 'x = 3', false, 2),
  ('30000000-0000-0000-0000-000000000003', 'x = 10', false, 3),
  ('30000000-0000-0000-0000-000000000004', 'x = 2 or x = 3', true, 1),
  ('30000000-0000-0000-0000-000000000004', 'x = -2 or x = -3', false, 2),
  ('30000000-0000-0000-0000-000000000004', 'x = 1 or x = 6', false, 3),
  ('30000000-0000-0000-0000-000000000005', '32', true, 1),
  ('30000000-0000-0000-0000-000000000005', '16', false, 2),
  ('30000000-0000-0000-0000-000000000005', '64', false, 3);

-- Math / Geometry
insert into public.questions (id, category_id, difficulty, title, body, is_published) values
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', 0.3, 'Triangle angles', 'What is the sum of the interior angles of a triangle?', true),
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002', 0.5, 'Circle area', 'What is the area of a circle with radius 3? (use pi ~ 3.14)', true),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', 0.6, 'Right triangle', 'A right triangle has legs of length 3 and 4. What is the hypotenuse?', true),
  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', 0.7, 'Rectangle perimeter', 'A rectangle has length 8 and width 5. What is its perimeter?', true);

insert into public.question_options (question_id, content, is_correct, position) values
  ('30000000-0000-0000-0000-000000000006', '180 degrees', true, 1),
  ('30000000-0000-0000-0000-000000000006', '360 degrees', false, 2),
  ('30000000-0000-0000-0000-000000000006', '90 degrees', false, 3),
  ('30000000-0000-0000-0000-000000000007', '28.26', true, 1),
  ('30000000-0000-0000-0000-000000000007', '18.84', false, 2),
  ('30000000-0000-0000-0000-000000000007', '9.42', false, 3),
  ('30000000-0000-0000-0000-000000000008', '5', true, 1),
  ('30000000-0000-0000-0000-000000000008', '6', false, 2),
  ('30000000-0000-0000-0000-000000000008', '7', false, 3),
  ('30000000-0000-0000-0000-000000000009', '26', true, 1),
  ('30000000-0000-0000-0000-000000000009', '40', false, 2),
  ('30000000-0000-0000-0000-000000000009', '13', false, 3);

-- Chinese / Grammar
insert into public.questions (id, category_id, difficulty, title, body, is_published) values
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000003', 0.3, 'Choose the correct particle', '我 __ 去学校。', true),
  ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000003', 0.4, 'Measure word', '一 __ 书', true),
  ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000003', 0.6, 'Word order', 'Choose the grammatically correct sentence.', true),
  ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000003', 0.5, 'Aspect particle', '他 __ 完 作业了。', true);

insert into public.question_options (question_id, content, is_correct, position) values
  ('30000000-0000-0000-0000-000000000010', '要', true, 1),
  ('30000000-0000-0000-0000-000000000010', '在', false, 2),
  ('30000000-0000-0000-0000-000000000010', '了', false, 3),
  ('30000000-0000-0000-0000-000000000011', '本', true, 1),
  ('30000000-0000-0000-0000-000000000011', '个', false, 2),
  ('30000000-0000-0000-0000-000000000011', '张', false, 3),
  ('30000000-0000-0000-0000-000000000012', '我昨天去了图书馆。', true, 1),
  ('30000000-0000-0000-0000-000000000012', '我去了昨天图书馆。', false, 2),
  ('30000000-0000-0000-0000-000000000012', '昨天我图书馆去了。', false, 3),
  ('30000000-0000-0000-0000-000000000013', '做', true, 1),
  ('30000000-0000-0000-0000-000000000013', '在', false, 2),
  ('30000000-0000-0000-0000-000000000013', '要', false, 3);

-- Chinese / Reading Comprehension
insert into public.questions (id, category_id, difficulty, title, body, is_published) values
  ('30000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000004', 0.4, 'Main idea', '"小明每天早上七点起床，然后去学校。" What time does Xiao Ming wake up?', true),
  ('30000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000004', 0.6, 'Detail', '"这家餐厅的菜很好吃，但是价格有点贵。" What is the drawback mentioned?', true),
  ('30000000-0000-0000-0000-000000000016', '20000000-0000-0000-0000-000000000004', 0.7, 'Inference', '"他今天没有带伞，但是外面在下雨。" What is likely to happen?', true);

insert into public.question_options (question_id, content, is_correct, position) values
  ('30000000-0000-0000-0000-000000000014', '7:00 AM', true, 1),
  ('30000000-0000-0000-0000-000000000014', '8:00 AM', false, 2),
  ('30000000-0000-0000-0000-000000000014', '9:00 AM', false, 3),
  ('30000000-0000-0000-0000-000000000015', 'The price is a bit expensive', true, 1),
  ('30000000-0000-0000-0000-000000000015', 'The food is not tasty', false, 2),
  ('30000000-0000-0000-0000-000000000015', 'The restaurant is far away', false, 3),
  ('30000000-0000-0000-0000-000000000016', 'He will likely get wet', true, 1),
  ('30000000-0000-0000-0000-000000000016', 'He will stay dry', false, 2),
  ('30000000-0000-0000-0000-000000000016', 'It will stop raining', false, 3);

-- Logic / Critical Reasoning
insert into public.questions (id, category_id, difficulty, title, body, is_published) values
  ('30000000-0000-0000-0000-000000000017', '20000000-0000-0000-0000-000000000005', 0.4, 'Sequence', 'What comes next in the sequence: 2, 4, 8, 16, __?', true),
  ('30000000-0000-0000-0000-000000000018', '20000000-0000-0000-0000-000000000005', 0.6, 'Syllogism', 'All cats are mammals. All mammals are animals. Therefore:', true),
  ('30000000-0000-0000-0000-000000000019', '20000000-0000-0000-0000-000000000005', 0.8, 'Odd one out', 'Which does not belong: Apple, Banana, Carrot, Orange?', true);

insert into public.question_options (question_id, content, is_correct, position) values
  ('30000000-0000-0000-0000-000000000017', '32', true, 1),
  ('30000000-0000-0000-0000-000000000017', '24', false, 2),
  ('30000000-0000-0000-0000-000000000017', '30', false, 3),
  ('30000000-0000-0000-0000-000000000018', 'All cats are animals', true, 1),
  ('30000000-0000-0000-0000-000000000018', 'All animals are cats', false, 2),
  ('30000000-0000-0000-0000-000000000018', 'No cats are animals', false, 3),
  ('30000000-0000-0000-0000-000000000019', 'Carrot', true, 1),
  ('30000000-0000-0000-0000-000000000019', 'Apple', false, 2),
  ('30000000-0000-0000-0000-000000000019', 'Banana', false, 3);

-- One free_response question, so Phase 7's AI grading pipeline
-- (gradeFreeResponseAnswers) has something to exercise locally. Left out
-- of the curated exams below — those keep their original mcq-only
-- question counts — so it's only reachable via subject_practice/
-- difficulty_practice, where startExamCore's gradeableQuestion filter
-- picks it up automatically now that it has a correct_answer_text.
insert into public.questions (id, category_id, type, difficulty, title, body, correct_answer_text, is_published) values
  ('30000000-0000-0000-0000-000000000020', '20000000-0000-0000-0000-000000000005', 'free_response', 0.5, 'Explain the pattern', 'In your own words, explain the rule behind the sequence 2, 4, 8, 16, 32.', 'Each term is double the previous term (multiply by 2 each time).', true);

-- ============================================================
-- CURATED EXAMS
-- ============================================================
insert into public.exams (id, title, description, mode, time_limit_seconds, is_published) values
  ('40000000-0000-0000-0000-000000000001', 'CSCA Full Mock — Sample', 'A short sample full-length simulation covering Math, Chinese, and Logic.', 'full_mock', 1800, true);

insert into public.exam_questions (exam_id, question_id, position) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 1),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 2),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000006', 3),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000008', 4),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000010', 5),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000012', 6),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000014', 7),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000017', 8),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000018', 9);

-- Today's daily challenge — re-seeded fresh each `supabase db reset`.
insert into public.exams (id, title, description, mode, time_limit_seconds, challenge_date, is_published) values
  ('40000000-0000-0000-0000-000000000002', 'Daily Challenge', 'Five quick questions across every subject.', 'daily_challenge', 600, current_date, true);

insert into public.exam_questions (exam_id, question_id, position) values
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 1),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000007', 2),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000011', 3),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000015', 4),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000019', 5);
