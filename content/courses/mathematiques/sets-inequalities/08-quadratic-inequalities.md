---
title: Quadratic Inequalities
minutes: 12
---

## What you will learn

- the sign-analysis method for $ax^2 + bx + c > 0$ (or $<$, $\ge$, $\le$);
- the special cases $\Delta = 0$ and $\Delta < 0$;
- "true for all real $x$" problems and working backwards from a solution set.

## 1. Method

1. Move everything to one side: $f(x) = ax^2 + bx + c$ compared with $0$. If $a < 0$, multiply by $-1$ **and flip the inequality**.
2. Find the roots of $f(x) = 0$ (factoring, formula $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, or completing the square).
3. Sketch the parabola ($a > 0$: opens upward) or mark the roots on a number line.
4. Read the intervals: for $a > 0$, $f > 0$ **outside** the roots and $f < 0$ **between** them.
5. Include the roots only if the inequality is non-strict ($\le$ or $\ge$).

## 2. All cases ($a > 0$, $\Delta = b^2 - 4ac$)

| $\Delta$ | $f(x) > 0$ | $f(x) < 0$ | $f(x) \ge 0$ | $f(x) \le 0$ |
|---|---|---|---|---|
| $> 0$, roots $x_1 < x_2$ | $x < x_1$ or $x > x_2$ | $x_1 < x < x_2$ | $x \le x_1$ or $x \ge x_2$ | $x_1 \le x \le x_2$ |
| $= 0$, root $x_0$ | $x \ne x_0$ | no solution | all $\mathbb{R}$ | only $x = x_0$ |
| $< 0$ | all $\mathbb{R}$ | no solution | all $\mathbb{R}$ | no solution |

## 3. Worked examples

**Example 1.** $x^2 - 4 \ge 0$: $(x - 2)(x + 2) \ge 0$, roots $\pm 2$, parabola up: $x \le -2$ or $x \ge 2$, i.e. $(-\infty, -2] \cup [2, +\infty)$.

**Example 2.** $-x^2 + 3x - 2 > 0$: multiply by $-1$ (flip!): $x^2 - 3x + 2 < 0 \iff (x - 1)(x - 2) < 0 \iff 1 < x < 2$.

**Example 3.** $x^2 + 1 < 0$: $\Delta = -4 < 0$ and $a > 0$, so $f > 0$ for all $x$. No solution: $\varnothing$.

**Example 4 (working backwards).** The solution set of $ax^2 + bx + 2 > 0$ is $\left(-\tfrac12, \tfrac13\right)$. Since the quadratic is positive between the roots, the parabola opens downward: $a < 0$. Vieta: product of roots $\dfrac2a = -\dfrac16 \Rightarrow a = -12$; sum of roots $-\dfrac ba = -\dfrac16 \Rightarrow b = -2$. So $a + b = -14$. Check: $-12x^2 - 2x + 2 > 0 \iff 6x^2 + x - 1 < 0 \iff (2x + 1)(3x - 1) < 0$ ✓.

## 4. True for every real $x$

$ax^2 + bx + c > 0$ for all real $x$ $\iff$ $a > 0$ and $\Delta < 0$; $ax^2 + bx + c < 0$ for all real $x$ $\iff$ $a < 0$ and $\Delta < 0$. If $a$ may be $0$, check that case separately.

**Example 5.** For which $k$ is $kx^2 - 2kx + 3 > 0$ for all $x$? If $k = 0$ the expression is $3 > 0$ (true). If $k \ne 0$: $k > 0$ and $\Delta = 4k^2 - 12k < 0 \iff 0 < k < 3$. Together: $0 \le k < 3$.

## Common mistakes

- Forgetting to flip the sign after multiplying by $-1$.
- Including the roots when the inequality is strict.
- Forgetting the case $a = 0$ in "for all $x$" problems.

## Exam tips

- Sketch a quick parabola: a smile ($a > 0$) is positive outside the roots; a frown ($a < 0$) is the opposite.
- A solution set given as an interval tells you the roots: use Vieta to recover coefficients.

## Practice problems

1. Solve $x^2 + 2x - 8 \le 0$.
2. Solve $x^2 - 6x + 9 > 0$.
3. Find $m$ so that $x^2 + mx + 1 > 0$ for all real $x$.

**Answers.** (1) $(x + 4)(x - 2) \le 0$: $[-4, 2]$. (2) $(x - 3)^2 > 0$: $x \ne 3$. (3) $m^2 - 4 < 0$: $-2 < m < 2$.
