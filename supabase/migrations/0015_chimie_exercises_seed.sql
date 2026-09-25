-- Splits Chimie's "Exercices pratiques" into its real topic taxonomy,
-- now that the source content has been received — mirrors the
-- Mathématiques/Physique structure added in 0013_exam_subjects_seed.sql
-- (one level of group -> topic nesting via question_categories.parent_id).
--
-- The single flat "Exercices pratiques" placeholder row inserted by
-- 0013 (chimie/exercices-pratiques) is superseded by this real
-- structure and removed below — it never accumulated any questions
-- (bulk import matches by exact category name, and no CSV uses that
-- generic name), so the delete is safe.
delete from public.question_categories
where subject_id = (select id from public.subjects where slug = 'chimie')
  and slug = 'exercices-pratiques';

-- Top-level rows: the 4 topic groups for Chimie. parent_id is null for
-- all of these — set below, once these rows exist to point at.
insert into public.question_categories (subject_id, name, slug, description, display_order)
select s.id, c.name, c.slug, c.description, c.display_order
from public.subjects s
join (
  values
    ('chimie', 'Exercices pratiques - Fundamentals', 'exercices-pratiques-fundamentals', 'Structure atomique, liaisons, nomenclature, mole.', 4),
    ('chimie', 'Exercices pratiques - Reactions', 'exercices-pratiques-reactions', 'Cinétique, équilibre, réactions ioniques et redox.', 9),
    ('chimie', 'Exercices pratiques - Solutions', 'exercices-pratiques-solutions', 'Solutions, électrolytes, gaz parfaits, pH.', 13),
    ('chimie', 'Exercices pratiques - Substances & Applications', 'exercices-pratiques-substances-applications', 'Composés organiques, chimie industrielle, expériences.', 17)
) as c (subject_slug, name, slug, description, display_order)
  on c.subject_slug = s.slug
on conflict (subject_id, slug) do nothing;

-- Second-level rows: each one's parent_id points at its group above, via
-- a by-slug lookup within the same subject.
insert into public.question_categories (subject_id, parent_id, name, slug, description, display_order)
select
  s.id,
  (select id from public.question_categories where subject_id = s.id and slug = c.parent_slug),
  c.name, c.slug, c.description, c.display_order
from public.subjects s
join (
  values
    ('chimie', 'exercices-pratiques-fundamentals', 'Exercices pratiques - Atomic Structure & Periodic Law', 'exercices-pratiques-atomic-structure-periodic-law', 'Structure atomique et classification périodique.', 5),
    ('chimie', 'exercices-pratiques-fundamentals', 'Exercices pratiques - Chemical Bonding & Intermolecular Forces', 'exercices-pratiques-chemical-bonding-intermolecular-forces', 'Liaisons chimiques et forces intermoléculaires.', 6),
    ('chimie', 'exercices-pratiques-fundamentals', 'Exercices pratiques - Chemical Nomenclature & Equations', 'exercices-pratiques-chemical-nomenclature-equations', 'Nomenclature et équations chimiques.', 7),
    ('chimie', 'exercices-pratiques-fundamentals', 'Exercices pratiques - Matter Classification & State Changes', 'exercices-pratiques-matter-classification-state-changes', 'Classification de la matière et changements d''état.', 8),
    ('chimie', 'exercices-pratiques-fundamentals', 'Exercices pratiques - Mole Calculations', 'exercices-pratiques-mole-calculations', 'Calculs sur la mole.', 8),
    ('chimie', 'exercices-pratiques-reactions', 'Exercices pratiques - Chemical Reaction Rate & Equilibrium', 'exercices-pratiques-chemical-reaction-rate-equilibrium', 'Cinétique et équilibre chimique.', 10),
    ('chimie', 'exercices-pratiques-reactions', 'Exercices pratiques - Ionic Reactions & Tests', 'exercices-pratiques-ionic-reactions-tests', 'Réactions ioniques et tests de reconnaissance.', 11),
    ('chimie', 'exercices-pratiques-reactions', 'Exercices pratiques - Redox Reactions', 'exercices-pratiques-redox-reactions', 'Réactions d''oxydoréduction.', 12),
    ('chimie', 'exercices-pratiques-solutions', 'Exercices pratiques - Electrolyte Solution Theory', 'exercices-pratiques-electrolyte-solution-theory', 'Théorie des solutions électrolytiques.', 14),
    ('chimie', 'exercices-pratiques-solutions', 'Exercices pratiques - Ideal Gas Law', 'exercices-pratiques-ideal-gas-law-chimie', 'Loi des gaz parfaits.', 15),
    ('chimie', 'exercices-pratiques-solutions', 'Exercices pratiques - Solution Concentration & PH', 'exercices-pratiques-solution-concentration-ph', 'Concentration des solutions et pH.', 16),
    ('chimie', 'exercices-pratiques-substances-applications', 'Exercices pratiques - Basic Organic Compounds', 'exercices-pratiques-basic-organic-compounds', 'Composés organiques de base.', 18),
    ('chimie', 'exercices-pratiques-substances-applications', 'Exercices pratiques - Chemical Experiment & Application', 'exercices-pratiques-chemical-experiment-application', 'Expériences et applications chimiques.', 19),
    ('chimie', 'exercices-pratiques-substances-applications', 'Exercices pratiques - Common Inorganic Properties', 'exercices-pratiques-common-inorganic-properties', 'Propriétés des composés inorganiques courants.', 20),
    ('chimie', 'exercices-pratiques-substances-applications', 'Exercices pratiques - Industrial Chemistry Process', 'exercices-pratiques-industrial-chemistry-process', 'Procédés de chimie industrielle.', 21)
) as c (subject_slug, parent_slug, name, slug, description, display_order)
  on c.subject_slug = s.slug
on conflict (subject_id, slug) do nothing;
