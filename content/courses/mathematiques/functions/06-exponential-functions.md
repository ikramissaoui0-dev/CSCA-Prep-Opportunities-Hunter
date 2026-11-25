---
title: Exponential Functions
minutes: 10
---

## What you will learn

- the exponent laws and the graph of $f(x) = a^x$;
- the natural exponential $e^x$;
- how to solve exponential equations and inequalities.

## 1. The exponential function

$f(x) = a^x$ with $a > 0$, $a \ne 1$.

- Domain $\mathbb{R}$, range $(0, +\infty)$: **always positive**.
- Passes through $(0, 1)$; the $x$-axis is a horizontal asymptote.
- $a > 1$: strictly increasing (growth); $0 < a < 1$: strictly decreasing (decay).
- $a^x$ and $\left(\tfrac1a\right)^x$ are mirror images in the $y$-axis.

The **natural exponential** $e^x$ uses the irrational constant $e \approx 2.718$; it is the exponential whose slope at $0$ equals $1$ (its derivative is itself).

## 2. Exponent laws

$$
a^ma^n = a^{m+n}, \quad \frac{a^m}{a^n} = a^{m-n}, \quad (a^m)^n = a^{mn}, \quad (ab)^n = a^nb^n, \quad a^{-n} = \frac1{a^n}, \quad a^{m/n} = \sqrt[n]{a^m}, \quad a^0 = 1.
$$

Use them only when the **bases are the same** (for multiplication/division of powers): $2^3 \cdot 3^2$ cannot be combined.

**Example 1.** $2^3 \cdot 2^5 = 2^8 = 256$. $\dfrac{(2^3)^4}{2^5} = 2^{12 - 5} = 2^7 = 128$.

## 3. Equations and inequalities

Because $a^x$ is injective, $a^{f(x)} = a^{g(x)} \iff f(x) = g(x)$. Write both sides with the same base.

**Example 2.** $3^x = 81 \Rightarrow 3^x = 3^4 \Rightarrow x = 4$.

**Example 3.** $4^x = 8^{x - 1} \Rightarrow 2^{2x} = 2^{3x - 3} \Rightarrow x = 3$.

**Example 4 (substitution).** $9^x - 4 \cdot 3^x + 3 = 0$: put $t = 3^x > 0$: $t^2 - 4t + 3 = 0 \Rightarrow t = 1$ or $3$, so $x = 0$ or $1$.

**Example 5 (sum of powers).** $2^{x + 1} + 2^{x - 1} = 10$: factor: $2^x\left(2 + \tfrac12\right) = 10 \Rightarrow 2^x = 4 \Rightarrow x = 2$.

**Inequalities.** For $a > 1$: $a^{f} < a^{g} \iff f < g$ (the direction is kept). For $0 < a < 1$ the direction **flips**.

**Example 6.** $3^x > 9^{x - 2} \Rightarrow x > 2x - 4 \Rightarrow x < 4$. (Check: $3^x > 3^{2x - 4} \iff x > 2x - 4$.)

**Example 7.** $\left(\tfrac12\right)^x < \tfrac14 \Rightarrow x > 2$ (base below 1 flips the sign).

## 4. Comparing graphs

On $x > 0$, $3^x > 2^x$; on $x < 0$, $3^x < 2^x$; at $x = 0$ they are equal. Among $y = 2^x$, $y = 3^x$, $y = \left(\tfrac12\right)^x$, a larger base gives a steeper rise.

## Common mistakes

- Adding exponents when bases are different.
- Forgetting $a^0 = 1$.
- Treating $a^x$ as able to be zero or negative.
- Not flipping an inequality when the base is between $0$ and $1$.

## Practice problems

1. Solve $2^{x + 1} = 32$.
2. Solve $4^x - 3 \cdot 2^x - 4 = 0$.
3. Solve $\left(\tfrac13\right)^x > 9$.

**Answers.** (1) $x = 4$. (2) $t^2 - 3t - 4 = 0$, $t = 4$ ($t = -1$ rejected): $x = 2$. (3) $x < -2$.
