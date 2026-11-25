---
title: Absolute Value Inequalities
minutes: 10
---

## What you will learn

- the two core rules for $|f(x)| < a$ and $|f(x)| > a$;
- the cases "no solution" and "all reals";
- the triangle inequality and inequalities with two absolute values.

## 1. Meaning

$|x|$ is the distance from $x$ to $0$ on the number line; $|x - a|$ is the distance from $x$ to $a$. So $|x - 3| < 5$ means "within 5 units of 3".

## 2. Two core rules (for $a > 0$)

$$
|f(x)| < a \iff -a < f(x) < a, \qquad |f(x)| > a \iff f(x) < -a \ \text{ or } \ f(x) > a.
$$

*Memory aid*: "less thAND, greatOR" — "less than" gives one chain (and), "greater than" gives two pieces (or).

## 3. Worked examples

**Example 1.** $|x - 3| < 5 \iff -5 < x - 3 < 5 \iff -2 < x < 8$: $(-2, 8)$.

**Example 2.** $|2x + 1| \ge 7 \iff 2x + 1 \le -7$ or $2x + 1 \ge 7 \iff x \le -4$ or $x \ge 3$: $(-\infty, -4] \cup [3, +\infty)$.

**Example 3.** $|3x - 6| < -1$: an absolute value is always $\ge 0$, so it can never be negative: **no solution**.

**Example 4.** $|x + 2| > -3$: always true, so the solution is **all real numbers**.

**Example 5.** $|2x - 1| \le 5 \iff -5 \le 2x - 1 \le 5 \iff -2 \le x \le 3$.

**General form with an expression on the right.** $|f(x)| < g(x) \iff -g(x) < f(x) < g(x)$ (this requires $g(x) > 0$); $|f(x)| > g(x) \iff f(x) < -g(x)$ or $f(x) > g(x)$.

## 4. Two absolute values

Split the number line at the points where each expression is zero and solve on each piece, or use the geometric meaning.

**Example 6.** $|x - 1| + |x + 2| < 5$. Zeros at $1$ and $-2$:

- $x < -2$: $-(x - 1) - (x + 2) = -2x - 1 < 5 \Rightarrow x > -3$, so $-3 < x < -2$;
- $-2 \le x \le 1$: $(1 - x) + (x + 2) = 3 < 5$ true: all of $[-2, 1]$;
- $x > 1$: $(x - 1) + (x + 2) = 2x + 1 < 5 \Rightarrow x < 2$, so $1 < x < 2$.

Union: $(-3, 2)$.

## 5. Triangle inequality

$$
|a + b| \le |a| + |b|, \qquad \bigl||a| - |b|\bigr| \le |a - b|.
$$

Equality holds in the first when $a$ and $b$ have the same sign (or one is zero).

## Common mistakes

- Forgetting to split into two cases for the "greater than" type.
- Dropping the absolute value incorrectly: $|x - 3| = x - 3$ only when $x \ge 3$.
- Writing $|x| > a$ as a single chain.

## Practice problems

1. Solve $|x + 1| \le 4$.
2. Solve $|2x - 3| > 5$.
3. Solve $|x - 2| = |x + 4|$.

**Answers.** (1) $[-5, 3]$. (2) $x < -1$ or $x > 4$. (3) Equidistant from $2$ and $-4$: $x = -1$.
