---
title: Venn Diagrams (2-3 Circles)
minutes: 10
---

## What you will learn

- how to draw and fill two- and three-circle Venn diagrams;
- the inclusion–exclusion formula for three sets;
- how to avoid the classic "A" versus "only A" confusion.

## 1. Two circles

A Venn diagram draws each set as a circle inside a rectangle that represents the universal set. For two sets there are four regions: $A$ only, $B$ only, both, neither.

**Always fill from the inside out**: start with the intersection, then the "only" regions, then the outside. This order works because the numbers you are given ($|A|$, $|B|$) include the intersection.

**Example 1.** 100 students; 60 study English, 50 study Maths, 20 study both. Both: $20$. English only: $60 - 20 = 40$. Maths only: $50 - 20 = 30$. Neither: $100 - (40 + 20 + 30) = 10$.

## 2. Three circles

With three sets there are eight regions. Fill them in this order: (1) the centre $A \cap B \cap C$; (2) each pairwise region **only** = pairwise intersection $-$ centre; (3) each single-set "only" region = set total $-$ (the pairwise-only regions and centre that lie inside it); (4) the outside.

$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |B \cap C| - |A \cap C| + |A \cap B \cap C|.
$$

**Example 2.** $|A| = 30$, $|B| = 25$, $|C| = 20$, $|A \cap B| = 10$, $|A \cap C| = 8$, $|B \cap C| = 6$, $|A \cap B \cap C| = 3$, $|U| = 60$.

- Centre: $3$.
- $A \cap B$ only: $10 - 3 = 7$; $A \cap C$ only: $8 - 3 = 5$; $B \cap C$ only: $6 - 3 = 3$.
- $A$ only: $30 - 7 - 3 - 5 = 15$; $B$ only: $25 - 7 - 3 - 3 = 12$; $C$ only: $20 - 5 - 3 - 3 = 9$.
- Union: $15 + 12 + 9 + 7 + 5 + 3 + 3 = 54$; neither: $60 - 54 = 6$.

## 3. Reading regions with set notation

| Region | Notation |
|---|---|
| in $A$ only | $A \cap B' $ (two sets) |
| in exactly one of $A$, $B$ | $(A \cup B) \setminus (A \cap B)$ |
| in neither | $(A \cup B)'$ |
| in $A$ or $B$ but not $C$ | $(A \cup B) \cap C'$ |

## Common mistakes

- Filling outside-in, which double-counts the overlaps.
- Confusing "A" (the whole circle, including the overlap) with "only A".
- Forgetting the region outside all circles.

## Exam strategy

Draw the diagram first, write every given number on it, and check that the totals add up to $|U|$.

## Practice problems

1. $|U| = 50$, $|A| = 28$, $|B| = 20$, $|A \cap B| = 8$. How many are in neither?
2. In a group, 12 like tea, 15 coffee, 8 juice; 5 tea and coffee, 3 tea and juice, 4 coffee and juice; 2 like all three. How many like at least one drink?

**Answers.** (1) $|A \cup B| = 40$, so $10$. (2) $12 + 15 + 8 - 5 - 3 - 4 + 2 = 25$.
