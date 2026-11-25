---
title: Subsets & Power Sets
minutes: 10
---

## What you will learn

- subset, proper subset and equality of sets;
- counting subsets, and subsets of a given size;
- parameter problems of the form $B \subseteq A$.

## 1. Subsets

$A$ is a **subset** of $B$, written $A \subseteq B$, if every element of $A$ is in $B$. It is a **proper subset**, $A \subsetneq B$, if moreover $A \ne B$.

- $\varnothing \subseteq A$ for **every** set $A$, and $A \subseteq A$.
- If $A \subseteq B$ and $B \subseteq A$, then $A = B$.
- If $A \subseteq B$ and $B \subseteq C$, then $A \subseteq C$.

Do not confuse the two relations: $2 \in \{1, 2\}$ (element) but $\{2\} \subseteq \{1, 2\}$ (subset). Also $\varnothing \subseteq \{1, 2, 3\}$ is true but $\{\varnothing\} \subseteq \{1, 2, 3\}$ is false, because $\varnothing$ is not an element of $\{1, 2, 3\}$.

## 2. Counting subsets

A set with $n$ elements has

$$
2^n \text{ subsets}, \qquad 2^n - 1 \text{ proper subsets}, \qquad 2^n - 2 \text{ non-empty proper subsets}.
$$

*Why $2^n$?* Each element is either in the subset or not: two choices per element.

The **power set** $\mathcal{P}(A)$ is the set of all subsets of $A$; it has $2^n$ elements. The number of subsets with exactly $k$ elements is $\binom nk$.

**Subsets containing (or avoiding) given elements.** To count the subsets of $\{1, 2, 3\}$ that contain $1$: fix $1$ in, each of the remaining two elements is free: $2^2 = 4$. If a subset must contain $k$ given elements and avoid $m$ given ones, the rest are free: $2^{n - k - m}$.

## 3. Worked examples

**Example 1.** All subsets of $\{a, b, c\}$: $\varnothing$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$, $\{a, b, c\}$ — $2^3 = 8$.

**Example 2.** A set with 5 elements has $2^5 = 32$ subsets and $31$ proper subsets.

**Example 3.** $A = \{x \mid x^2 - 3x + 2 = 0\} = \{1, 2\}$ has $2^2 - 1 = 3$ proper subsets.

**Example 4 (parameter).** $A = [-2, 5]$ and $B = \{x \mid m \le x \le 2m - 1\}$. Find $m$ with $B \subseteq A$.

- *Case $B = \varnothing$*: $m > 2m - 1$, i.e. $m < 1$. The empty set is a subset of every set, so all $m < 1$ work.
- *Case $B \ne \varnothing$* ($m \ge 1$): we need $m \ge -2$ and $2m - 1 \le 5$, i.e. $m \le 3$. So $1 \le m \le 3$.

Combining both cases: $m \le 3$. **Always check $B = \varnothing$ first**.

**Example 5.** If $A = \{1, 2\}$ and $A \subseteq B \subseteq \{1, 2, 3, 4\}$, then $B$ is $A$ plus any subset of $\{3, 4\}$: $4$ possibilities.

## Common mistakes

- Confusing $\in$ and $\subseteq$.
- Forgetting $\varnothing$ in a count of subsets or in a parameter problem.
- Mistaking $\{\varnothing\}$ for $\varnothing$.

## Practice problems

1. How many subsets of $\{1, 2, 3, 4\}$ have exactly two elements?
2. $A = \{x \mid -1 < x < 3\}$, $B = \{x \mid x < a\}$. Find $a$ so that $A \subseteq B$.
3. If $A \subsetneq \{1, 2, 3\}$ and $A$ is non-empty, how many choices for $A$?

**Answers.** (1) $\binom42 = 6$. (2) $a \ge 3$. (3) $2^3 - 2 = 6$.
