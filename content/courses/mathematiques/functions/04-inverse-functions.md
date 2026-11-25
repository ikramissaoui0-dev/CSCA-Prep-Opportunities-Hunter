---
title: Inverse Functions
minutes: 10
---

## What you will learn

- the definition of the inverse and when it exists;
- how to find $f^{-1}$ algebraically;
- the relationship between graphs, domains and ranges.

## 1. Definition

If $f$ is injective, its **inverse** $f^{-1}$ undoes it:

$$
f^{-1}(f(x)) = x \ \text{ for } x \text{ in the domain of } f, \qquad f(f^{-1}(y)) = y \ \text{ for } y \text{ in the range of } f.
$$

$f^{-1}$ exists only if $f$ is one-to-one. Warning: $f^{-1}(x)$ is **not** $\dfrac{1}{f(x)}$.

## 2. Finding the inverse

1. Write $y = f(x)$.
2. Solve for $x$ in terms of $y$.
3. Swap the names: $f^{-1}(x)$ is the resulting expression with $y$ renamed $x$.
4. State the domain of $f^{-1}$ = the range of $f$.

**Example 1.** $f(x) = \dfrac{3x - 1}{2}$: $y = \dfrac{3x - 1}2 \Rightarrow x = \dfrac{2y + 1}{3}$, so $f^{-1}(x) = \dfrac{2x + 1}3$.

**Example 2.** $f(x) = x^3 + 2$: $x = \sqrt[3]{y - 2}$, so $f^{-1}(x) = \sqrt[3]{x - 2}$.

**Example 3.** $f(x) = \dfrac{2x + 1}{x - 3}$: $y(x - 3) = 2x + 1 \Rightarrow x(y - 2) = 3y + 1 \Rightarrow x = \dfrac{3y + 1}{y - 2}$. So $f^{-1}(x) = \dfrac{3x + 1}{x - 2}$, with domain $x \ne 2$ (the range of $f$).

**Example 4 (restricted domain).** $f(x) = x^2 - 2x$ on $[1, +\infty)$: $y = (x - 1)^2 - 1$, so $x = 1 + \sqrt{y + 1}$ (choose $+$ because $x \ge 1$). $f^{-1}(x) = 1 + \sqrt{x + 1}$ on $[-1, +\infty)$.

**Example 5 (verifying).** $f(x) = e^x$ and $g(x) = \ln x$ are inverses: $\ln(e^x) = x$ and $e^{\ln x} = x$.

**Shortcut for a single value.** To find $f^{-1}(5)$, solve $f(x) = 5$: no need for the formula.

## 3. Domain, range and graphs

- Domain of $f^{-1}$ = range of $f$; range of $f^{-1}$ = domain of $f$.
- $(a, b)$ is on the graph of $f$ $\iff$ $(b, a)$ is on the graph of $f^{-1}$.
- The graphs are mirror images in the line $y = x$.
- If $f$ is increasing (decreasing), so is $f^{-1}$.

**Common inverse pairs**: $a^x \leftrightarrow \log_a x$; $x^n \leftrightarrow \sqrt[n]{x}$ (for suitable domains); $x + c \leftrightarrow x - c$; $\sin x \leftrightarrow \arcsin x$ (on $[-\tfrac\pi2, \tfrac\pi2]$).

**Self-inverse functions.** If $f^{-1} = f$, the graph is symmetric about $y = x$: for example $f(x) = \dfrac1x$, $f(x) = c - x$, $f(x) = \dfrac{x + 1}{2x - 1}$.

## Common mistakes

- Reading $f^{-1}$ as $1/f$.
- Forgetting to restrict the domain before inverting a non-injective function.
- Not swapping the domain and range.

## Practice problems

1. Find the inverse of $f(x) = 2x - 5$.
2. Find $f^{-1}(3)$ for $f(x) = x^3 + 1$.
3. If $f(2) = 7$, what is $f^{-1}(7)$?

**Answers.** (1) $\dfrac{x + 5}{2}$. (2) $x^3 + 1 = 3 \Rightarrow x = \sqrt[3]2$. (3) $2$.
