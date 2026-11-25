---
title: Rational Inequalities
minutes: 12
---

## What you will learn

- why you must never cross-multiply by an unknown expression;
- the sign-analysis method with a sign table;
- the endpoint rules for numerator zeros and denominator zeros.

## 1. Never cross-multiply

If you multiply both sides of $\dfrac{x + 1}{x - 2} \ge 0$ by $x - 2$, you do not know whether $x - 2$ is positive or negative, so you cannot tell whether to flip the sign. Instead, **move everything to one side, combine into a single fraction, and study its sign.**

## 2. The method

1. Rearrange so that one side is $0$: $\dfrac{f(x)}{g(x)} \gtrless 0$ (combine terms over a common denominator).
2. **Critical values**: the zeros of the numerator and the zeros of the denominator.
3. Mark them on a number line; they split it into intervals.
4. Test the sign of each factor (or of the whole fraction) in each interval — a sign table.
5. Collect the intervals that satisfy the inequality.

**Endpoint rules.** A zero of the **numerator** is included only if the inequality is non-strict ($\ge$ or $\le$). A zero of the **denominator** is **never** included (division by zero).

**Shortcut.** $\dfrac fg > 0 \iff fg > 0$, and $\dfrac fg \ge 0 \iff fg \ge 0$ with $g \ne 0$. So a rational inequality can be turned into a polynomial one (but remember to exclude $g = 0$).

## 3. Worked examples

**Example 1.** $\dfrac{x - 1}{x + 2} > 0$. Critical values $1$ and $-2$. Testing $x = -3$: $\dfrac{-4}{-1} > 0$ ✓; $x = 0$: $\dfrac{-1}{2} < 0$; $x = 2$: $\dfrac14 > 0$ ✓. Answer: $(-\infty, -2) \cup (1, +\infty)$.

**Example 2.** $\dfrac1x < 2$. Rearrange: $\dfrac1x - 2 < 0 \Rightarrow \dfrac{1 - 2x}{x} < 0$. Critical values $\dfrac12$ and $0$. Testing gives $x < 0$ or $x > \dfrac12$. (Note: you cannot simply write $x > \tfrac12$ — that would lose the negative values.)

**Example 3.** $\dfrac{x + 3}{x - 1} \ge 0$. Critical values $-3$ (numerator, included) and $1$ (denominator, excluded): $x \le -3$ or $x > 1$.

**Example 4.** $\dfrac{x + 1}{x - 2} \ge 0$. A sign table:

| | $x < -1$ | $-1 < x < 2$ | $x > 2$ |
|---|---|---|---|
| $x + 1$ | $-$ | $+$ | $+$ |
| $x - 2$ | $-$ | $-$ | $+$ |
| quotient | $+$ | $-$ | $+$ |

Answer: $(-\infty, -1] \cup (2, +\infty)$.

**Example 5.** $\dfrac{2}{x - 1} < 1$: $\dfrac{2 - (x - 1)}{x - 1} < 0 \iff \dfrac{3 - x}{x - 1} < 0 \iff \dfrac{x - 3}{x - 1} > 0$: $(-\infty, 1) \cup (3, +\infty)$.

**Example 6 (quadratic numerator).** $\dfrac{x^2 - 4}{x + 1} \le 0$. Numerator $(x - 2)(x + 2)$; critical values $-2, -1, 2$ ($-1$ excluded). Signs: $x < -2$: $\dfrac{+}{-} < 0$ ✓; $-2 < x < -1$: $\dfrac{-}{-} > 0$; $-1 < x < 2$: $\dfrac{-}{+} < 0$ ✓; $x > 2$: $+$. Answer: $(-\infty, -2] \cup (-1, 2]$.

## Common mistakes

- Cross-multiplying by an expression of unknown sign.
- Including a value that makes the denominator zero.
- Forgetting to include the numerator zero when the inequality is $\ge$ or $\le$.

## Practice problems

1. Solve $\dfrac{x - 2}{x + 3} \le 0$.
2. Solve $\dfrac{3}{x} \ge 1$.
3. Solve $\dfrac{x^2 - 1}{x} > 0$.

**Answers.** (1) $-3 < x \le 2$. (2) $\dfrac{3 - x}{x} \ge 0$: $0 < x \le 3$. (3) Critical $-1, 0, 1$: $(-1, 0) \cup (1, +\infty)$.
