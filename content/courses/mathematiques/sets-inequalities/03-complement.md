---
title: Complement
minutes: 8
---

## What you will learn

- the universal set and the complement of a set;
- De Morgan's laws;
- complements of intervals of real numbers.

## 1. Definition

All sets in a problem live inside a **universal set** $U$. The **complement** of $A$ is everything in $U$ that is **not** in $A$:

$$
\complement_U A = A' = \{x \in U \mid x \notin A\}.
$$

Properties: $A \cup A' = U$, $A \cap A' = \varnothing$, $(A')' = A$, $\complement_U U = \varnothing$ and $\complement_U\varnothing = U$. The complement depends on the universe: the complement of $\{1, 2\}$ is different in $\mathbb{N}$ and in $\mathbb{R}$.

Counting: $|A'| = |U| - |A|$. This is very useful for "at least one" problems: count the opposite and subtract.

## 2. De Morgan's laws

$$
\complement_U (A \cup B) = \complement_U A \cap \complement_U B, \qquad \complement_U (A \cap B) = \complement_U A \cup \complement_U B.
$$

"Not (A or B)" means "not A **and** not B"; "not (A and B)" means "not A **or** not B". The law swaps union and intersection when you take a complement.

## 3. With intervals

For $U = \mathbb{R}$: the complement of $[a, b]$ is $(-\infty, a) \cup (b, +\infty)$; the complement of $(a, +\infty)$ is $(-\infty, a]$. **Brackets flip**: an included endpoint becomes excluded in the complement and the reverse.

## 4. Worked examples

**Example 1.** $U = \{1, \dots, 10\}$, $A = \{2, 4, 6, 8, 10\}$: $A' = \{1, 3, 5, 7, 9\}$.

**Example 2.** $U = \mathbb{R}$, $A = (-\infty, 2]$, $B = (0, 5)$. Then $A \cup B = (-\infty, 5)$, so $\complement(A \cup B) = [5, +\infty)$; and $A' = (2, +\infty)$, so $A' \cap B = (2, 5)$.

**Example 3 (De Morgan).** $U = \{1, \dots, 6\}$, $A = \{1, 2, 3\}$, $B = \{3, 4, 5\}$. $A \cup B = \{1, 2, 3, 4, 5\}$, so $(A \cup B)' = \{6\}$. Check: $A' \cap B' = \{4, 5, 6\} \cap \{1, 2, 6\} = \{6\}$ ✓.

**Example 4.** If $A = \{x \mid x^2 - 3x + 2 \ge 0\}$ in $\mathbb{R}$, then $A = (-\infty, 1] \cup [2, +\infty)$ and $A' = (1, 2)$.

## Common mistakes

- Forgetting to flip the brackets when taking the complement of an interval.
- Applying De Morgan without swapping $\cup$ and $\cap$.
- Taking a complement without checking which universal set is meant.

## Exam tips

- When a question says "not in $A$" or "$x \notin A$", think complement.
- To count "at least one", compute $|U| - |\text{none}|$.

## Practice problems

1. $U = \{1, \dots, 8\}$, $A = \{1, 3, 5\}$, $B = \{3, 4\}$. Find $(A \cap B)'$.
2. Find the complement in $\mathbb{R}$ of $(-3, 4]$.
3. Prove that $(A \cup B)' \subseteq A'$.

**Answers.** (1) $A \cap B = \{3\}$, so $\{1, 2, 4, 5, 6, 7, 8\}$. (2) $(-\infty, -3] \cup (4, +\infty)$. (3) By De Morgan $(A \cup B)' = A' \cap B' \subseteq A'$.
