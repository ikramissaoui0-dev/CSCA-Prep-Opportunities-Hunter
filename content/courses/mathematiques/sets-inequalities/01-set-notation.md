---
title: Set Notation
minutes: 10
---

## What you will learn

- what a set is, and how to describe it in roster form, set-builder form and interval notation;
- the standard symbols and the standard number sets;
- cardinality, and the three properties of the elements of a set.

## 1. What is a set?

A **set** is a collection of objects, called **elements**, for which we can always decide whether a given object belongs to it or not. We write $x \in A$ when $x$ is an element of $A$, and $x \notin A$ otherwise. Sets are named with capital letters.

- "The even integers between 1 and 9" is a set: $\{2, 4, 6, 8\}$.
- "The nicest songs of the year" is **not** a set: there is no clear test for membership.

Every set has three properties that are used constantly in exercises:

1. **Definite** — membership can always be decided.
2. **Distinct** — no element is counted twice: $\{1, 1, 2\} = \{1, 2\}$.
3. **Unordered** — the order does not matter: $\{a, b, c\} = \{c, a, b\}$.

## 2. Three ways to describe a set

| Form | Example | Reading |
|---|---|---|
| Roster (list) | $A = \{2, 4, 6, 8\}$ | the set whose elements are 2, 4, 6, 8 |
| Set-builder | $B = \{x \in \mathbb{Z} \mid x \text{ is even},\ 0 < x < 10\}$ | the integers $x$ **such that** $x$ is even and between 0 and 10 |
| Interval | $[a, b]$, $(a, b)$, $[a, b)$, $(a, +\infty)$ | sets of real numbers between two bounds |

The vertical bar "$\mid$" is read "such that".

**Interval notation (real numbers only).**

- $[a, b]$ closed: includes both endpoints; $(a, b)$ open: excludes both; $[a, b)$ and $(a, b]$ half-open.
- $(-\infty, b]$ and $[a, +\infty)$ are unbounded intervals. **Infinity always gets a round bracket**, because it is not a number you can reach: write $[a, +\infty)$, never $[a, \infty]$.

## 3. Key symbols and standard sets

| Symbol | Meaning |
|---|---|
| $\in$, $\notin$ | is an element of, is not an element of |
| $\varnothing$ or $\{\}$ | the empty set (no elements) |
| $\mathbb{N}$ | natural numbers $\{0, 1, 2, \dots\}$ (in the Chinese convention used by the CSCA, $0$ **is** natural) |
| $\mathbb{N}^*$ or $\mathbb{N}_+$ | positive integers $\{1, 2, 3, \dots\}$ |
| $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$ | integers, rationals, reals |

**Cardinality** is the number of elements of a finite set, written $|A|$, $n(A)$ or $\operatorname{card}(A)$. For $A = \{1, 2, 3\}$, $|A| = 3$; $|\varnothing| = 0$.

## 4. Worked examples

**Example 1.** Write the prime numbers less than 20 in roster notation. The primes are $2, 3, 5, 7, 11, 13, 17, 19$, so $P = \{2, 3, 5, 7, 11, 13, 17, 19\}$ and $|P| = 8$.

**Example 2.** Convert $\{x \in \mathbb{Z} \mid -3 \le x < 2\}$ to roster notation: the integers from $-3$ up to, but not including, $2$ are $\{-3, -2, -1, 0, 1\}$.

**Example 3.** "All real numbers greater than 5" in interval notation is $(5, +\infty)$: round bracket on $5$ because "greater than" is strict.

**Example 4 (distinctness with a parameter).** For $\{1, a, a^2\}$ to be a set we need $a \ne 1$, $a \ne a^2$ and $a^2 \ne 1$, so $a \ne 0, 1, -1$. After solving for a parameter, **always substitute back** and reject any value that makes two elements equal.

**Example 5.** Write $\{x \in \mathbb{N} \mid x^2 < 30\}$ in roster form: $x^2 < 30$ means $x \le 5$, so $\{0, 1, 2, 3, 4, 5\}$ (remember that $0 \in \mathbb{N}$).

## Common mistakes

- Using a square bracket with $\infty$.
- Listing duplicates: write $\{1, 2, 3\}$, never $\{1, 2, 2, 3\}$.
- Confusing $\varnothing$ (0 elements) with $\{\varnothing\}$ (1 element: the empty set).
- Forgetting whether $0$ belongs to $\mathbb{N}$.

## Exam tips

- Always check whether the question asks for integers, reals or natural numbers: the same inequality gives different roster sets.
- When converting between notations, double-check endpoint inclusion.

## Practice problems

1. Write $\{x \in \mathbb{Z} \mid |x| \le 2\}$ in roster form.
2. Write the set of all real numbers $x$ with $-1 < x \le 4$ in interval notation.
3. How many elements does $\{\varnothing, \{1\}, 2\}$ have?

**Answers.** (1) $\{-2, -1, 0, 1, 2\}$. (2) $(-1, 4]$. (3) $3$.
