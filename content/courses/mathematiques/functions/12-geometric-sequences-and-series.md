---
title: Geometric Sequences & Series
minutes: 12
---

## What you will learn

- the general term and the sum of a geometric sequence;
- the infinite sum when $|q| < 1$;
- recurrences that reduce to geometric sequences.

## 1. Geometric sequences

The ratio between consecutive terms is a constant $q$ (all terms non-zero):

$$
a_n = a_1q^{n-1}, \qquad S_n = \begin{cases} na_1, & q = 1 \\[2pt] \dfrac{a_1(1 - q^n)}{1 - q} = \dfrac{a_1(q^n - 1)}{q - 1}, & q \ne 1. \end{cases}
$$

- $a, b, c$ are in geometric progression $\iff b^2 = ac$ (for non-zero terms).
- If $m + n = p + q$ then $a_ma_n = a_pa_q$.
- Three terms in geometric progression: $\dfrac aq, a, aq$ (product $a^3$).
- $S_n$, $S_{2n} - S_n$, $S_{3n} - S_{2n}$ form a geometric sequence (when none is zero).

## 2. Infinite series

If $|q| < 1$ the terms shrink and the infinite sum converges:

$$
S_\infty = \frac{a_1}{1 - q}.
$$

If $|q| \ge 1$ the series does not converge.

**Example 1.** $a_1 = 2$, $q = 3$: $a_5 = 2 \cdot 3^4 = 162$.

**Example 2.** $3 + 6 + 12 + \dots$ (6 terms): $S_6 = 3 \cdot \dfrac{2^6 - 1}{2 - 1} = 189$.

**Example 3.** $8 + 4 + 2 + 1 + \dots$: $q = \tfrac12$, $S_\infty = \dfrac{8}{1 - 1/2} = 16$.

**Example 4 (negative ratio).** $a_1 = 5$, $q = -\tfrac12$: terms $5, -2.5, 1.25, \dots$ alternate in sign and $S_\infty = \dfrac{5}{1.5} = \dfrac{10}3$.

**Example 5.** $a_2 = 6$ and $a_5 = 162$: $q^3 = 27$, $q = 3$, $a_1 = 2$.

**Example 6 (repeating decimal).** $0.\overline{3} = 0.3 + 0.03 + \dots = \dfrac{0.3}{1 - 0.1} = \dfrac13$.

**Example 7 (bouncing ball).** A ball dropped from $8\ \text{m}$ rebounds to half its height each time. Total distance $= 8 + 2(4 + 2 + 1 + \dots) = 8 + 2 \cdot 8 = 24\ \text{m}$.

## 3. Recurrences

For $a_{n+1} = pa_n + r$ ($p \ne 1$), subtract the fixed point $x = \dfrac r{1 - p}$: $a_{n+1} - x = p(a_n - x)$, so $(a_n - x)$ is geometric.

**Example 8.** $a_1 = 1$, $a_{n+1} = 2a_n + 1$: fixed point $-1$; $a_n + 1 = 2^n$, so $a_n = 2^n - 1$.

**Example 9.** $a_1 = 2$, $a_{n+1} = 3a_n - 2$: fixed point $1$; $a_n = 1 + 3^{n-1}$.

## 4. Real-life models

Constant percentage change (interest, depreciation, population) is geometric. A deposit $P$ each year at rate $r$ gives, after $n$ years, $P\dfrac{(1 + r)^n - 1}{r}\,(1 + r)$ if deposits are at the start of each year.

## Common mistakes

- Using $\dfrac{a_1(1 - q^n)}{1 - q}$ when $q = 1$.
- Applying the infinite-sum formula when $|q| \ge 1$.
- Assuming a sequence is geometric without checking the ratio is constant.

## Practice problems

1. A geometric sequence has $a_1 = 3$, $q = 2$. Find $S_5$.
2. Find $S_\infty$ for $9 - 3 + 1 - \dots$.
3. For which $x$ are $x$, $2x + 2$, $3x + 3$ consecutive terms of a geometric progression?

**Answers.** (1) $93$. (2) $q = -\tfrac13$, $S = \dfrac{9}{4/3} = 6.75$. (3) $(2x + 2)^2 = x(3x + 3) \Rightarrow 4(x + 1)^2 = 3x(x + 1) \Rightarrow x = -1$ or $4(x + 1) = 3x$, $x = -4$; but $x = -1$ gives all zeros (not allowed): $x = -4$.
