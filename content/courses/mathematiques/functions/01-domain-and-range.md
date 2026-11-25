---
title: Domain & Range
minutes: 10
---

## What you will learn

- what a function, its domain and its range are;
- how to find the domain from the formula;
- several methods to find the range.

## 1. Function, domain, range

A **function** $f: A \to B$ assigns to every $x$ in the **domain** $A$ exactly one value $f(x)$. The **range** (or image) is the set of values actually reached: $\{f(x) \mid x \in A\}$. Domain and range are different sets: do not read one from the other.

## 2. Finding the domain

When no domain is given, take the **largest set where the formula makes sense**:

| Expression | Condition |
|---|---|
| $\dfrac{1}{g(x)}$ | $g(x) \ne 0$ |
| $\sqrt{g(x)}$ (any even root) | $g(x) \ge 0$ |
| $\ln g(x)$, $\log_a g(x)$ | $g(x) > 0$ |
| $\tan x$ | $x \ne \dfrac\pi2 + k\pi$ |
| polynomials, $a^{g(x)}$, $\sin$, $\cos$ | no restriction |

When several conditions apply, **intersect** them.

**Example 1.** $f(x) = \sqrt{6 - 2x}$: $6 - 2x \ge 0 \Rightarrow x \le 3$; domain $(-\infty, 3]$.

**Example 2.** $f(x) = \dfrac{\sqrt{x + 2}}{x - 1}$: $x \ge -2$ and $x \ne 1$; domain $[-2, 1) \cup (1, +\infty)$.

**Example 3.** $g(x) = \ln(x^2 - 4)$: $x^2 > 4 \Rightarrow x < -2$ or $x > 2$.

## 3. Finding the range

- **Complete the square** for quadratics: $x^2 - 4x + 7 = (x - 2)^2 + 3 \ge 3$, so the range is $[3, +\infty)$.
- **Use known bounds**: $-1 \le \sin x \le 1$, $a^x > 0$, $\sqrt{\cdot} \ge 0$, $x^2 \ge 0$.
- **Rewrite a fraction**: $\dfrac{2x + 1}{x - 3} = 2 + \dfrac{7}{x - 3}$ takes every value except $2$: range $\mathbb{R} \setminus \{2\}$.
- **Solve for $x$** in terms of $y$ and see which $y$ give a solution (this is how inverses are found).
- **Monotonicity and endpoints** on a closed interval: evaluate at the endpoints and critical points.

**Example 4.** $f(x) = \dfrac{1}{x^2 + 1}$: the domain is $\mathbb{R}$; $x^2 + 1 \ge 1$, so $0 < f(x) \le 1$; range $(0, 1]$.

**Example 5.** $f(x) = -x^2 + 2x + 3 = -(x - 1)^2 + 4 \le 4$: range $(-\infty, 4]$.

**Example 6.** $f(x) = \sqrt{4 - x^2}$ has domain $[-2, 2]$ and range $[0, 2]$.

**Same function?** Two functions are equal only if they have the same domain **and** the same rule: $f(x) = \dfrac{x^2 - 1}{x - 1}$ and $g(x) = x + 1$ are different (the first is undefined at $1$).

## Common mistakes

- Forgetting a condition when two apply (a root *and* a denominator).
- Reading the range off the domain.
- Writing a log or root condition with the wrong inequality (strict for logs, non-strict for roots).

## Practice problems

1. Domain of $f(x) = \sqrt{4 - x^2} + \dfrac1x$.
2. Range of $f(x) = 2^x + 1$.
3. Domain of $f(x) = \dfrac{1}{\ln x}$.

**Answers.** (1) $[-2, 0) \cup (0, 2]$. (2) $(1, +\infty)$. (3) $x > 0$ and $\ln x \ne 0$: $(0, 1) \cup (1, +\infty)$.
