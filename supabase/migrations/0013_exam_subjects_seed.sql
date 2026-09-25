-- Starter subject/category taxonomy for the three CSCA subjects
-- (Mathématiques, Physique, Chimie).
--
-- Reference data, not test content — same reasoning as
-- 0011_gamification_seed.sql's achievement catalog. It's needed now
-- because there's no admin CRUD for subjects/categories (see that
-- migration's comment): the question form's subject/category dropdowns
-- (server/queries/admin-content.ts's listTaxonomy) are empty, and a
-- question literally can't be created by hand, until these rows exist.
-- Bulk import (lib/question-bank/actions-core.ts) matches subjects/
-- categories by name and only creates a row when no match is found, so
-- importing a CSV later with these same names reuses these rows instead
-- of duplicating them.
--
-- question_categories supports one level of nesting via parent_id
-- (added below) — deliberately not a general tree, since nothing in the
-- actual source content goes deeper than "topic group" (e.g. Functions)
-- containing "topic" (e.g. Calculus). A leaf with no children (like
-- Probability & Statistics, which has no further subdivision) is just a
-- category whose parent_id is itself null and who has no children —
-- both "groups" and "standalone topics" are ordinary rows, told apart
-- only by whether anything points at them as a parent.
--
-- "Examens blancs" and "Annales" are timed, composed question sets, not
-- something a student browses by topic — those belong in the `exams`
-- table (already built, see /admin/exams), not as question_categories
-- rows; they're seeded here only if/when the business actually splits
-- them by topic too.
insert into public.subjects (name, slug, description, display_order) values
  ('Mathématiques', 'mathematiques', 'Algèbre, analyse, géométrie et probabilités au programme du CSCA.', 1),
  ('Physique', 'physique', 'Mécanique, électricité, ondes et thermodynamique au programme du CSCA.', 2),
  ('Chimie', 'chimie', 'Chimie générale, organique et réactions au programme du CSCA.', 3)
on conflict (slug) do nothing;

alter table public.question_categories
  add column parent_id uuid references public.question_categories (id) on delete cascade;

create index idx_question_categories_parent on public.question_categories (parent_id);

-- Top-level rows: the 3 topic groups for Mathématiques, Probability &
-- Statistics (a standalone topic, no group), Examens blancs/Annales, and
-- Physique/Chimie's not-yet-subdivided placeholders. parent_id is null
-- for all of these — set below, once the group rows exist to point at.
insert into public.question_categories (subject_id, name, slug, description, display_order)
select s.id, c.name, c.slug, c.description, c.display_order
from public.subjects s
join (
  values
    ('mathematiques', 'Exercices pratiques - Functions', 'exercices-pratiques-functions', 'Fonctions, suites, calcul.', 1),
    ('mathematiques', 'Exercices pratiques - Geometry & Algebra', 'exercices-pratiques-geometry-algebra', 'Géométrie, vecteurs, nombres complexes.', 6),
    ('mathematiques', 'Exercices pratiques - Probability & Statistics', 'exercices-pratiques-probability-statistics', 'Probabilités et statistiques.', 12),
    ('mathematiques', 'Exercices pratiques - Sets & Inequalities', 'exercices-pratiques-sets-inequalities', 'Ensembles et inéquations.', 13),
    ('mathematiques', 'Examens blancs', 'examens-blancs', 'Sujets d''examens blancs complets et minutés.', 16),
    ('mathematiques', 'Annales', 'annales', 'Sujets d''examens officiels des sessions précédentes.', 17),
    -- Physique — Exercices pratiques, split into its real topics, one
    -- per source folder (mirrors Mathématiques' structure above).
    ('physique', 'Exercices pratiques - Electromagnetism', 'exercices-pratiques-electromagnetism', 'Électrostatique, circuits, champ magnétique, induction.', 1),
    ('physique', 'Exercices pratiques - Mechanics', 'exercices-pratiques-mechanics', 'Cinématique, lois de Newton, énergie, quantité de mouvement.', 6),
    ('physique', 'Exercices pratiques - Modern Physics', 'exercices-pratiques-modern-physics', 'Structure atomique, physique nucléaire, effet photoélectrique.', 12),
    ('physique', 'Exercices pratiques - Thermodynamics', 'exercices-pratiques-thermodynamics', 'Gaz parfaits, théorie cinétique, premier principe.', 17),
    ('physique', 'Exercices pratiques - Waves & Optics', 'exercices-pratiques-waves-optics', 'Optique géométrique et physique, ondes.', 22),
    ('physique', 'Examens blancs', 'examens-blancs', 'Sujets d''examens blancs complets et minutés.', 27),
    ('physique', 'Annales', 'annales', 'Sujets d''examens officiels des sessions précédentes.', 28),
    -- Chimie — pas encore de sous-thèmes connus pour Exercices
    -- pratiques ; une seule catégorie pour l'instant, à affiner (même
    -- logique que pour les maths/physique) une fois le contenu reçu.
    ('chimie', 'Exercices pratiques', 'exercices-pratiques', 'Questions d''entraînement classées par thème.', 1),
    ('chimie', 'Examens blancs', 'examens-blancs', 'Sujets d''examens blancs complets et minutés.', 2),
    ('chimie', 'Annales', 'annales', 'Sujets d''examens officiels des sessions précédentes.', 3)
) as c (subject_slug, name, slug, description, display_order)
  on c.subject_slug = s.slug
on conflict (subject_id, slug) do nothing;

-- Second-level rows: each one's parent_id points at its group above, via
-- a by-slug lookup within the same subject (safe: subject_id + slug is
-- unique, and the parent rows were just inserted in this same
-- transaction, so they're visible here).
insert into public.question_categories (subject_id, parent_id, name, slug, description, display_order)
select
  s.id,
  (select id from public.question_categories where subject_id = s.id and slug = c.parent_slug),
  c.name, c.slug, c.description, c.display_order
from public.subjects s
join (
  values
    ('mathematiques', 'exercices-pratiques-functions', 'Exercices pratiques - Calculus', 'exercices-pratiques-calculus', 'Calcul différentiel et intégral.', 2),
    ('mathematiques', 'exercices-pratiques-functions', 'Exercices pratiques - Elementary functions', 'exercices-pratiques-elementary-functions', 'Fonctions élémentaires.', 3),
    ('mathematiques', 'exercices-pratiques-functions', 'Exercices pratiques - Functions', 'exercices-pratiques-functions-leaf', 'Fonctions — notions générales.', 4),
    ('mathematiques', 'exercices-pratiques-functions', 'Exercices pratiques - Sequences', 'exercices-pratiques-sequences', 'Suites numériques.', 5),
    ('mathematiques', 'exercices-pratiques-geometry-algebra', 'Exercices pratiques - Analytic Geometry', 'exercices-pratiques-analytic-geometry', 'Géométrie analytique.', 7),
    ('mathematiques', 'exercices-pratiques-geometry-algebra', 'Exercices pratiques - Complex numbers', 'exercices-pratiques-complex-numbers', 'Nombres complexes.', 8),
    ('mathematiques', 'exercices-pratiques-geometry-algebra', 'Exercices pratiques - Solid Geometry', 'exercices-pratiques-solid-geometry', 'Géométrie dans l''espace.', 9),
    ('mathematiques', 'exercices-pratiques-geometry-algebra', 'Exercices pratiques - Space Coordinate System', 'exercices-pratiques-space-coordinate-system', 'Repères dans l''espace.', 10),
    ('mathematiques', 'exercices-pratiques-geometry-algebra', 'Exercices pratiques - Vectors', 'exercices-pratiques-vectors', 'Vecteurs.', 11),
    ('mathematiques', 'exercices-pratiques-sets-inequalities', 'Exercices pratiques - Inequalities', 'exercices-pratiques-inequalities', 'Inéquations.', 14),
    ('mathematiques', 'exercices-pratiques-sets-inequalities', 'Exercices pratiques - Sets', 'exercices-pratiques-sets', 'Ensembles.', 15),
    ('physique', 'exercices-pratiques-electromagnetism', 'Exercices pratiques - DC Circuits', 'exercices-pratiques-dc-circuits', 'Circuits à courant continu.', 2),
    ('physique', 'exercices-pratiques-electromagnetism', 'Exercices pratiques - Electromagnetic induction', 'exercices-pratiques-electromagnetic-induction', 'Induction électromagnétique.', 3),
    ('physique', 'exercices-pratiques-electromagnetism', 'Exercices pratiques - Electrostatics', 'exercices-pratiques-electrostatics', 'Électrostatique.', 4),
    ('physique', 'exercices-pratiques-electromagnetism', 'Exercices pratiques - Magnetic field', 'exercices-pratiques-magnetic-field', 'Champ magnétique.', 5),
    ('physique', 'exercices-pratiques-mechanics', 'Exercices pratiques - Circular Motion & Gravitation', 'exercices-pratiques-circular-motion-gravitation', 'Mouvement circulaire et gravitation.', 7),
    ('physique', 'exercices-pratiques-mechanics', 'Exercices pratiques - Kinematics', 'exercices-pratiques-kinematics', 'Cinématique.', 8),
    ('physique', 'exercices-pratiques-mechanics', 'Exercices pratiques - Momentum & Impulse', 'exercices-pratiques-momentum-impulse', 'Quantité de mouvement et impulsion.', 9),
    ('physique', 'exercices-pratiques-mechanics', 'Exercices pratiques - Newton''s Laws of Motion', 'exercices-pratiques-newtons-laws', 'Lois de Newton.', 10),
    ('physique', 'exercices-pratiques-mechanics', 'Exercices pratiques - Work & Energy', 'exercices-pratiques-work-energy', 'Travail et énergie.', 11),
    ('physique', 'exercices-pratiques-modern-physics', 'Exercices pratiques - Atomic Structure', 'exercices-pratiques-atomic-structure', 'Structure atomique.', 13),
    ('physique', 'exercices-pratiques-modern-physics', 'Exercices pratiques - Modern Physics', 'exercices-pratiques-modern-physics-leaf', 'Physique moderne — notions générales.', 14),
    ('physique', 'exercices-pratiques-modern-physics', 'Exercices pratiques - Nuclear Physics Fundamentals', 'exercices-pratiques-nuclear-physics-fundamentals', 'Fondamentaux de physique nucléaire.', 15),
    ('physique', 'exercices-pratiques-modern-physics', 'Exercices pratiques - Photoelectric Effect', 'exercices-pratiques-photoelectric-effect', 'Effet photoélectrique.', 16),
    ('physique', 'exercices-pratiques-thermodynamics', 'Exercices pratiques - First Law of Thermodynamics', 'exercices-pratiques-first-law-thermodynamics', 'Premier principe de la thermodynamique.', 18),
    ('physique', 'exercices-pratiques-thermodynamics', 'Exercices pratiques - Ideal Gas Law', 'exercices-pratiques-ideal-gas-law', 'Loi des gaz parfaits.', 19),
    ('physique', 'exercices-pratiques-thermodynamics', 'Exercices pratiques - Kinetic Theory of Gases', 'exercices-pratiques-kinetic-theory-gases', 'Théorie cinétique des gaz.', 20),
    ('physique', 'exercices-pratiques-thermodynamics', 'Exercices pratiques - Thermodynamics', 'exercices-pratiques-thermodynamics-leaf', 'Thermodynamique — notions générales.', 21),
    ('physique', 'exercices-pratiques-waves-optics', 'Exercices pratiques - Geometric Optics', 'exercices-pratiques-geometric-optics', 'Optique géométrique.', 23),
    ('physique', 'exercices-pratiques-waves-optics', 'Exercices pratiques - Optics', 'exercices-pratiques-optics', 'Optique — notions générales.', 24),
    ('physique', 'exercices-pratiques-waves-optics', 'Exercices pratiques - Physical Optics', 'exercices-pratiques-physical-optics', 'Optique physique.', 25),
    ('physique', 'exercices-pratiques-waves-optics', 'Exercices pratiques - Simple Harmonic Motion & Waves', 'exercices-pratiques-shm-waves', 'Mouvement harmonique simple et ondes.', 26)
) as c (subject_slug, parent_slug, name, slug, description, display_order)
  on c.subject_slug = s.slug
on conflict (subject_id, slug) do nothing;
