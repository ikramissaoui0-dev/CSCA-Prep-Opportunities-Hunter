---
title: Union & Intersection
minutes: 10
---

## What you will learn

- the definitions of union, intersection and disjoint sets;
- the counting formula $|A \cup B| = |A| + |B| - |A \cap B|$;
- how to compute union and intersection of sets of real numbers.

## 1. Definitions

- **Union** $A \cup B = \{x \mid x \in A \text{ or } x \in B\}$: everything in at least one of the sets, each element listed once.
- **Intersection** $A \cap B = \{x \mid x \in A \text{ and } x \in B\}$: only what the two sets share.
- $A$ and $B$ are **disjoint** if $A \cap B = \varnothing$.

"Or" in mathematics is *inclusive*: an element in both sets belongs to the union.

## 2. Properties

- $A \cap B \subseteq A \subseteq A \cup B$ (the intersection is the smallest, the union the largest).
- $A \cup A = A$, $A \cap A = A$, $A \cup \varnothing = A$, $A \cap \varnothing = \varnothing$.
- Commutative: $A \cup B = B \cup A$, $A \cap B = B \cap A$; associative; and distributive: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$.
- $A \subseteq B \iff A \cap B = A \iff A \cup B = B$.

## 3. The counting formula

$$
|A \cup B| = |A| + |B| - |A \cap B|.
$$

Adding $|A|$ and $|B|$ counts the common elements twice, so we subtract them once. If the sets are disjoint, $|A \cap B| = 0$ and the sizes simply add.

## 4. Worked examples

**Example 1.** $A = \{a, b, c, d\}$, $B = \{c, d, e, f\}$. Union: $\{a, b, c, d, e, f\}$; intersection: $\{c, d\}$.

**Example 2.** In a class of 40, 22 play football, 18 play basketball and 8 play both. How many play at least one sport? $|F \cup B| = 22 + 18 - 8 = 32$; so $40 - 32 = 8$ play neither.

**Example 3.** If $A \cap B = \varnothing$, $|A| = 5$ and $|B| = 7$, then $|A \cup B| = 12$.

**Example 4 (real numbers).** $A = \{x \mid -2 \le x < 3\}$ and $B = \{x \mid 1 < x \le 5\}$. Draw both on a number line: the union is $[-2, 5]$ and the intersection is $(1, 3)$. Check the endpoints one by one: $A = [-2, 3)$ and $B = (1, 5]$. The point $3$ belongs to $B$ but not to $A$, so it is in the union but **not** in the intersection (an endpoint is in the intersection only if it is in both sets). The point $1$ belongs to $A$ but not to $B$, so it is not in the intersection either.

**Example 5.** $|A| = 20$, $|B| = 15$, $|A \cup B| = 28$: $|A \cap B| = 20 + 15 - 28 = 7$.

## Common mistakes

- Forgetting to subtract the intersection when counting the union.
- Mixing up the symbols $\cup$ (union, "cup") and $\cap$ (intersection, "cap").
- Mishandling endpoints when intersecting intervals: an endpoint is in the intersection only if it is in **both** sets.

## Exam tips

- On a number line, shade each set in a different colour: the union is everything shaded, the intersection is the doubly shaded part.
- "At least one" = union; "both" = intersection.

## Practice problems

1. $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$. Find $A \cup B$ and $A \cap B$.
2. $A = (-\infty, 2]$, $B = (0, 5)$. Find $A \cup B$ and $A \cap B$.
3. 30 students take French, 25 take German, 10 take both. How many take at least one?

**Answers.** (1) $\{1, 2, 3, 4, 5\}$ and $\{3, 4\}$. (2) $(-\infty, 5)$ and $(0, 2]$. (3) $30 + 25 - 10 = 45$.
