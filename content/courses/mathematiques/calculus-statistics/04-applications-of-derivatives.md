---
title: Applications of Derivatives
minutes: 14
---

## What you will learn

- monotonicity and extrema with the first and second derivative tests;
- optimisation problems;
- inequalities, zeros and parameter problems.

## 1. Monotonicity (单调性)

On an interval: $f' > 0 \Rightarrow$ strictly increasing; $f' < 0 \Rightarrow$ strictly decreasing; $f' \ge 0$ with equality only at isolated points $\Rightarrow$ still strictly increasing.

**Procedure**: domain $\to$ $f'$ $\to$ solve $f' = 0$ (and where $f'$ is undefined) $\to$ sign table.

**Example 1.** $f(x) = x^3 - 3x^2 + 1$: $f' = 3x(x - 2)$; increasing on $(-\infty, 0)$ and $(2, +\infty)$, decreasing on $(0, 2)$.

**Example 2.** $f(x) = x - \ln x$ ($x > 0$): $f' = \dfrac{x - 1}x$; decreasing on $(0, 1)$, increasing on $(1, +\infty)$; minimum $f(1) = 1$.

**"Increasing on an interval" parameter problems**: $f'(x) \ge 0$ for all $x$ in the interval; e.g. $x^3 + ax$ is increasing on $\mathbb{R}$ iff $3x^2 + a \ge 0$ for all $x$, i.e. $a \ge 0$.

## 2. Extrema

A **critical point** has $f'(x_0) = 0$ (or $f'$ undefined).

- **First derivative test**: $f'$ changes from $+$ to $-$: local maximum; from $-$ to $+$: local minimum; no change: no extremum ($x^3$ at $0$).
- **Second derivative test**: $f'(x_0) = 0$ and $f''(x_0) > 0$: local minimum; $f''(x_0) < 0$: local maximum; $f'' = 0$: inconclusive.
- **Global extrema on $[a, b]$**: compare $f$ at the endpoints and at critical points inside.

**Example 3.** $f(x) = x^3 - 3x + 2$: $f' = 3x^2 - 3 = 0$ at $x = \pm1$; local maximum $f(-1) = 4$, local minimum $f(1) = 0$.

**Example 4.** On $[-2, 3]$, $f(x) = x^3 - 3x$: $f(-2) = -2$, $f(-1) = 2$, $f(1) = -2$, $f(3) = 18$: maximum $18$, minimum $-2$.

**Example 5 (parameters).** $f(x) = x^3 + ax^2 + bx$ has a local minimum $-2$ at $x = 1$: $f'(1) = 3 + 2a + b = 0$ and $1 + a + b = -2$, so $a = 0$, $b = -3$. **Check** that $f' = 3x^2 - 3$ changes sign from $-$ to $+$ at $1$ ✓.

## 3. Optimisation

1. Introduce a variable and write the quantity as a function of it. 2. Find the allowed interval. 3. Find critical points and compare values, including endpoints. 4. Answer what was asked.

**Example 6.** A farmer has $100\ \text{m}$ of fence for a rectangular pen against a wall (three sides). Width $x$, length $100 - 2x$: $A = x(100 - 2x)$, $A' = 100 - 4x = 0 \Rightarrow x = 25$, maximum area $1250\ \text{m}^2$.

**Example 7.** A rectangle with perimeter $20$: $A = x(10 - x)$, maximal at $x = 5$ (a square), $A = 25$.

**Example 8.** A closed can of volume $2\pi$ with minimum surface: $S = 2\pi r^2 + \dfrac{4\pi}r$; $S' = 0 \Rightarrow r = 1$, $h = 2$.

## 4. Inequalities and zeros

- To prove $f(x) \ge g(x)$, study $h = f - g$ and show $\min h \ge 0$. Classic: $e^x \ge x + 1$ and $\ln x \le x - 1$.
- **Number of zeros**: use the monotonic intervals and the values at turning points; on each monotonic interval there is at most one zero. For $x^3 - 3x + 1$: local max $f(-1) = 3 > 0$, local min $f(1) = -1 < 0$: three roots.
- "For all $x$" problems: isolate the parameter: $m \ge g(x)$ for all $x$ means $m \ge \max g$.

## Common mistakes

- Treating $f'(x_0) = 0$ as enough for an extremum.
- Forgetting endpoints on closed intervals.
- Optimising without checking the allowed domain.

## Practice problems

1. Intervals where $f(x) = x^3 - 12x$ is decreasing.
2. Maximum of $f(x) = \dfrac{\ln x}x$.
3. Minimum of $x^2 + \dfrac{16}x$ for $x > 0$.

**Answers.** (1) $(-2, 2)$. (2) $\dfrac1e$ at $x = e$. (3) $f' = 2x - \dfrac{16}{x^2} = 0 \Rightarrow x = 2$; minimum $12$.
