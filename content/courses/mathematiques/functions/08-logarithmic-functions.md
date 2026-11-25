---
title: Logarithmic Functions
minutes: 10
---

## What you will learn

- the definition of the logarithm and its link with exponentials;
- common and natural logarithms;
- the graph and properties of $y = \log_a x$, and comparing logarithms.

## 1. Definition

For $a > 0$, $a \ne 1$ and $x > 0$:

$$
\log_a x = y \iff a^y = x.
$$

The logarithm is **the exponent** to which the base must be raised to give $x$. Two special cases: $\lg x = \log_{10}x$ (common) and $\ln x = \log_ex$ (natural). Basic identities: $\log_a1 = 0$, $\log_aa = 1$, $a^{\log_ax} = x$, $\log_aa^x = x$.

**Example 1.** $\log_2 32 = 5$ (since $2^5 = 32$); $\log_3\dfrac19 = -2$; $\log_5x = 3 \Rightarrow x = 125$; $\lg 1000 = 3$; $\ln e^2 = 2$.

## 2. The function $y = \log_a x$

It is the **inverse** of $a^x$, so its graph is the mirror image of $y = a^x$ in $y = x$.

- Domain $(0, +\infty)$, range $\mathbb{R}$.
- Passes through $(1, 0)$ and $(a, 1)$; the $y$-axis is a vertical asymptote.
- $a > 1$: increasing; $0 < a < 1$: decreasing.
- Positive when $x > 1$ (for $a > 1$) and negative for $0 < x < 1$.

**Domain examples.** $\ln(x - 1)$: $x > 1$. $\log_2(x^2 - 4)$: $x < -2$ or $x > 2$. $\log_{x}5$ requires $x > 0$, $x \ne 1$.

## 3. Comparing values

To compare logarithms, use monotonicity or a bridge value.

- $\log_2 3 < \log_2 5$ (same base $>1$, larger argument).
- $\log_{0.5}3 < \log_{0.5}2$ (base below 1 reverses the order).
- Bridge: $\log_2 3 > 1.5$ since $3 > 2^{1.5} = 2\sqrt2 \approx 2.83$, while $\log_3 5 < 1.5$ since $5 < 3^{1.5} = 3\sqrt3 \approx 5.20$; hence $\log_2 3 > \log_3 5$.
- Compare to $0$ or $1$: $\log_3 2 \in (0, 1)$ and $\log_2 3 > 1$.

## 4. Relationship with exponentials

Every exponential equation $a^x = b$ is solved by $x = \log_a b$; every log equation $\log_a x = c$ by $x = a^c$. Taking logarithms linearises growth: if data grows like $Ca^x$, then $\ln y$ is linear in $x$.

## Common mistakes

- Writing $\log 0$ or a log of a negative number.
- Confusing $\log_a b$ with $\log_b a$ (they are reciprocals: $\log_ab \cdot \log_ba = 1$).
- Forgetting the base-below-1 reversal.

## Practice problems

1. Evaluate $\log_2 32$, $\log_3\dfrac19$ and $\lg 0.01$.
2. Find the domain of $y = \ln(3 - x)$.
3. Which is larger: $\log_3 7$ or $\log_2 3$?

**Answers.** (1) $5$, $-2$, $-2$. (2) $x < 3$. (3) $\log_37 \approx 1.77$ and $\log_23 \approx 1.58$, so $\log_37$ is larger (bridge value $1.7$: $3^{1.7} \approx 6.5 < 7$, while $2^{1.7} \approx 3.25 > 3$).
