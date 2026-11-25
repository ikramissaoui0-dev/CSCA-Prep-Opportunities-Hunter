---
title: Even, Odd & Injective Functions
minutes: 12
---

## What you will learn

- how to test whether a function is even, odd or neither;
- how to use parity together with monotonicity to solve inequalities;
- increasing/decreasing functions and one-to-one (injective) functions.

## 1. Even and odd functions

Assume the domain is **symmetric about $0$** (if $x$ is in it, so is $-x$). If not, the function is neither even nor odd.

- **Even**: $f(-x) = f(x)$ — graph symmetric about the $y$-axis. Examples: $x^2$, $|x|$, $\cos x$.
- **Odd**: $f(-x) = -f(x)$ — graph symmetric about the origin. Examples: $x^3$, $\sin x$, $\tan x$, $\dfrac1x$.

**Testing procedure**: (1) check the domain; (2) compute $f(-x)$ and simplify; (3) compare with $f(x)$ and $-f(x)$.

Rules: even $\pm$ even is even; odd $\pm$ odd is odd; even $\times$ even and odd $\times$ odd are even; even $\times$ odd is odd. An odd function defined at $0$ has $f(0) = 0$.

**Example 1.** $f(x) = x^3 + x$: $f(-x) = -x^3 - x = -f(x)$: odd.

**Example 2.** $g(x) = x^2 - 3$: $g(-x) = g(x)$: even.

**Example 3.** $h(x) = 2x + 1$: $h(-x) = -2x + 1$, which is neither $h(x)$ nor $-h(x)$: neither.

**Example 4.** $f(x) = \ln\dfrac{1 - x}{1 + x}$ has domain $(-1, 1)$ (symmetric) and $f(-x) = \ln\dfrac{1 + x}{1 - x} = -f(x)$: odd.

## 2. Monotonicity

$f$ is **increasing** on an interval if $x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$, and **decreasing** if the inequality reverses. For a quadratic $ax^2 + bx + c$ the axis is $x = -\dfrac{b}{2a}$: it is monotonic on each side of it. To prove a function increasing, take $x_1 < x_2$ and show $f(x_2) - f(x_1) > 0$.

## 3. Parity + monotonicity

- If $f$ is **even** and increasing on $[0, +\infty)$, then $f(a) < f(b) \iff |a| < |b|$. So $f(2x - 1) < f(3)$ becomes $|2x - 1| < 3$, i.e. $-1 < x < 2$.
- If $f$ is **odd** and increasing on $\mathbb{R}$: $f(x - 1) + f(2x) > 0 \Rightarrow f(x - 1) > f(-2x) \Rightarrow x - 1 > -2x \Rightarrow x > \dfrac13$.

**Example 5.** If $f(x) = x^3 + ax^2 + 2x$ is odd, the even term $ax^2$ must vanish: $a = 0$.

## 4. Injective (one-to-one) functions

$f$ is **injective** if different inputs always give different outputs: $f(x_1) = f(x_2) \Rightarrow x_1 = x_2$. Graphically, every horizontal line meets the graph at most once (the **horizontal line test**). A strictly monotonic function is injective, and **only injective functions have an inverse**.

- $h(x) = 2x + 1$ is injective: $2x_1 + 1 = 2x_2 + 1 \Rightarrow x_1 = x_2$.
- $x^2$ is not injective on $\mathbb{R}$ ($f(-2) = f(2)$) but is on $[0, +\infty)$.
- $x^3$, $e^x$, $\ln x$ are strictly increasing, hence injective.

## Common mistakes

- Declaring a function even or odd without checking that the domain is symmetric.
- Believing "not even" means "odd".
- Using $f(a) < f(b) \iff a < b$ for an even function (you need $|a| < |b|$).

## Practice problems

1. Is $f(x) = \dfrac{x}{x^2 + 1}$ even, odd or neither?
2. $f$ is even and increasing on $[0, +\infty)$. Solve $f(x) < f(2)$.
3. Is $g(x) = x^2 - 2x$ injective on $\mathbb{R}$? On $[1, +\infty)$?

**Answers.** (1) odd. (2) $|x| < 2$: $(-2, 2)$. (3) No (axis $x = 1$); yes on $[1, +\infty)$.
