---
title: Piecewise Functions
minutes: 8
---

## What you will learn

- how to read and evaluate a piecewise function;
- how to test continuity at the boundaries;
- how to find unknown constants and sketch the graph.

## 1. Notation and evaluation

A **piecewise function** uses different formulas on different parts of its domain:

$$
f(x) = \begin{cases} 3x - 1, & x < 2 \\ x^2, & x \ge 2 \end{cases}
$$

To evaluate $f(a)$, **first decide which interval contains $a$**, then use that formula only. Here $f(0) = -1$, $f(2) = 4$, $f(3) = 9$. The domain is the union of the intervals; here $\mathbb{R}$.

**Using the wrong piece** is the usual error: $f(2)$ uses $x^2$, because $2 \ge 2$.

## 2. Continuity at the boundary

The graph is connected at a boundary $x = c$ if the two formulas give the **same value at $c$** (the left and right limits agree). Otherwise there is a **jump discontinuity**.

At $x = 2$ above: left formula $3 \cdot 2 - 1 = 5$, right formula $2^2 = 4$: they differ, so the graph jumps.

## 3. Finding unknown constants

**Example 1.** For which $k$ is $f(x) = \begin{cases} kx + 3, & x < 1 \\ 2x^2, & x \ge 1 \end{cases}$ continuous at $x = 1$? Match the values: $k + 3 = 2 \Rightarrow k = -1$.

**Example 2.** $g(x) = \begin{cases} ax + 1, & x \le 1 \\ x^2 + 2, & x > 1 \end{cases}$ continuous: $a + 1 = 3 \Rightarrow a = 2$.

**Example 3.** $h(x) = \begin{cases} |x|, & x \le 0 \\ x + 1, & x > 0 \end{cases}$: at $0$ the left value is $0$ and the right limit is $1$, so there is a jump of $1$.

**Example 4 (composition).** For $f(x) = \begin{cases} x + 1, & x < 0 \\ x^2, & x \ge 0 \end{cases}$: $f(f(-3)) = f(-2) = -1$.

## 4. Graphing

Graph each piece on its own interval. Use an **open circle** at an excluded endpoint and a **filled circle** at an included one. Check where the pieces meet.

**Absolute value as a piecewise function**: $|x| = \begin{cases} x, & x \ge 0 \\ -x, & x < 0 \end{cases}$; a graph like $y = |x - 2| + 1$ has its vertex at $(2, 1)$.

**Solving equations and inequalities.** Solve on each piece separately and keep only solutions that lie in that piece's interval.

**Example 5.** $f(x) = \begin{cases} x^2, & x \le 1 \\ 2x - 1, & x > 1 \end{cases}$ and $f(x) = 4$: on $x \le 1$, $x^2 = 4 \Rightarrow x = \pm 2$ and only $x = -2$ satisfies $x \le 1$; on $x > 1$, $2x - 1 = 4 \Rightarrow x = 2.5$. Solutions $-2$ and $2.5$.

## Common mistakes

- Using the wrong piece for a boundary value.
- Forgetting to reject solutions outside a piece's interval.
- Not checking both sides when asked for continuity.

## Practice problems

1. For $f(x) = \begin{cases} 2x, & x < 1 \\ x + 1, & x \ge 1 \end{cases}$, find $f(0)$, $f(1)$, $f(3)$.
2. Find $k$ so that $\begin{cases} x^2 + k, & x \le 2 \\ 3x, & x > 2 \end{cases}$ is continuous.

**Answers.** (1) $0, 2, 4$. (2) $4 + k = 6$, so $k = 2$.
