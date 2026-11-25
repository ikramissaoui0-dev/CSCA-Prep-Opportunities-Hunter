---
title: Arithmetic Sequences & Series
minutes: 12
---

## What you will learn

- the general term and the sum of an arithmetic sequence;
- the properties of terms and sums;
- sign changes and the maximum of $S_n$.

## 1. Sequences and sums

A **sequence** $(a_n)$ lists numbers by position. A **series** is a sum of terms: $S_n = a_1 + \dots + a_n$. Two key relations hold for any sequence:

$$
a_1 = S_1, \qquad a_n = S_n - S_{n-1} \quad (n \ge 2).
$$

Always treat $n = 1$ separately when recovering $a_n$ from $S_n$.

## 2. Arithmetic sequences

The difference between consecutive terms is a constant $d$:

$$
a_n = a_1 + (n - 1)d = a_m + (n - m)d, \qquad S_n = \frac{n(a_1 + a_n)}{2} = na_1 + \frac{n(n-1)}{2}d.
$$

Useful facts:

- $a, b, c$ are in arithmetic progression $\iff 2b = a + c$ ($b$ is the *arithmetic mean*).
- If $m + n = p + q$ then $a_m + a_n = a_p + a_q$ (so $S_n = \dfrac{n(a_1 + a_n)}{2}$ uses $a_1 + a_n = a_2 + a_{n-1} = \dots$).
- $S_n$ is a quadratic in $n$ without constant term: $S_n = \dfrac d2n^2 + \left(a_1 - \dfrac d2\right)n$.
- $S_n$, $S_{2n} - S_n$, $S_{3n} - S_{2n}$ form an arithmetic sequence.
- Three terms in arithmetic progression: call them $a - d, a, a + d$.

## 3. Worked examples

**Example 1.** $a_1 = 5$, $d = 3$: $a_{10} = 5 + 9 \cdot 3 = 32$.

**Example 2.** $a_5 = 17$ and $a_9 = 29$: $4d = 12$, so $d = 3$ and $a_1 = 5$; $a_n = 3n + 2$.

**Example 3.** Sum of $2 + 5 + 8 + \dots$ (20 terms): $a_{20} = 2 + 19 \cdot 3 = 59$; $S_{20} = \dfrac{20(2 + 59)}2 = 610$.

**Example 4 (first negative term).** In $20, 17, 14, \dots$: $a_n = 23 - 3n < 0 \iff n > 7.67$, so the first negative term is $a_8 = -1$.

**Example 5 (maximum sum).** With $a_1 = 20$, $d = -3$: $S_n = \dfrac{n(43 - 3n)}2$ is maximal at $n = 7$, with $S_7 = 77$ (stop adding when the terms turn negative).

**Example 6.** Given $S_n = n^2 + 2n$: $a_1 = 3$ and for $n \ge 2$, $a_n = 2n + 1$, which also gives $3$ for $n = 1$; so $a_n = 2n + 1$ (arithmetic with $d = 2$).

**Example 7.** $1 + 3 + 5 + \dots + 99$ has $50$ terms: $S = \dfrac{50(1 + 99)}2 = 2500$.

## Common mistakes

- Using $a_n = S_n - S_{n-1}$ at $n = 1$.
- Confusing $n$ (number of terms) with the value of the last term.
- Mixing up $d$ and $a_1$ when using $S_n$.

## Practice problems

1. Find $a_1$ and $d$ if $a_3 = 7$ and $a_7 = 19$.
2. An arithmetic sequence has $a_1 = 5$ and $S_4 = 38$. Find $d$.
3. How many terms of $3, 7, 11, \dots$ are needed to exceed $100$?

**Answers.** (1) $d = 3$, $a_1 = 1$. (2) $20 + 6d = 38$, $d = 3$. (3) $3 + 4(n - 1) > 100 \Rightarrow n > 25.25$: $26$ terms.
