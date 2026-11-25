---
title: Composite Functions
minutes: 8
---

## What you will learn

- how to form $f \circ g$ and evaluate it;
- how to find the domain of a composition;
- how to decompose a function and how to find $f$ from a composition.

## 1. Definition

The **composition** of $f$ and $g$ is

$$
(f \circ g)(x) = f(g(x)),
$$

"apply $g$ first, then $f$". Its domain is the set of $x$ in the domain of $g$ for which $g(x)$ lies in the domain of $f$.

In general $f \circ g \ne g \circ f$.

## 2. Examples

**Example 1.** $f(x) = 2x - 1$, $g(x) = x^2$. $(f \circ g)(x) = 2x^2 - 1$ but $(g \circ f)(x) = (2x - 1)^2$. At $x = 3$: $(f \circ g)(3) = 17$, $(g \circ f)(3) = 25$.

**Example 2.** $f(x) = x + 1$, $g(x) = \dfrac1x$: $(g \circ f)(x) = \dfrac{1}{x + 1}$, with domain $x \ne -1$.

**Example 3 (domain).** $f(x) = \sqrt x$, $g(x) = x - 4$: $(f \circ g)(x) = \sqrt{x - 4}$, domain $[4, +\infty)$. Note that the domain of $g$ is $\mathbb{R}$ but only $g(x) \ge 0$ is allowed by $f$.

**Example 4.** $f(x) = \dfrac{1}{x}$ and $g(x) = x^2 - 1$: $(f \circ g)(x) = \dfrac{1}{x^2 - 1}$, domain $x \ne \pm 1$.

## 3. Decomposing a function

Write $h$ as an "outside" function applied to an "inside" function: $h(x) = (3x - 2)^5$ is $f(g(x))$ with $g(x) = 3x - 2$ and $f(u) = u^5$. Similarly $e^{x^2 + 1}$ is $f(g(x))$ with $g = x^2 + 1$, $f = e^u$. This is exactly what the chain rule in calculus uses.

## 4. Finding $f$ from a composition

**Example 5.** If $f(2x - 1) = 4x^2 + 3$, put $t = 2x - 1$, so $x = \dfrac{t + 1}2$ and $f(t) = (t + 1)^2 + 3 = t^2 + 2t + 4$.

**Example 6.** If $f(x + 1) = x^2 - 3x$: $t = x + 1$, $f(t) = (t - 1)^2 - 3(t - 1) = t^2 - 5t + 4$.

**Example 7.** If $f(g(x)) = x$ and $g(f(x)) = x$ then $g = f^{-1}$.

## 5. Connection with inverses

$f^{-1} \circ f$ and $f \circ f^{-1}$ are the identity function. This is how you can *check* an inverse: $f(f^{-1}(x))$ must equal $x$.

## Common mistakes

- Applying $f$ first instead of $g$ in $(f \circ g)(x)$.
- Forgetting to adjust the domain of the composition.
- Substituting incorrectly in "find $f$" problems: define $t$ first, then rewrite $x$.

## Practice problems

1. $f(x) = x + 1$, $g(x) = x^2$. Find $(g \circ f)(2)$ and $(f \circ g)(2)$.
2. Find the domain of $\sqrt{x - 1}$ composed with $x^2$, i.e. $f(g(x))$ with $f(u) = \sqrt{u - 1}$, $g(x) = x^2$.
3. Decompose $\ln(x^2 + 1)$.

**Answers.** (1) $9$ and $5$. (2) $x^2 \ge 1$: $(-\infty, -1] \cup [1, +\infty)$. (3) $f(u) = \ln u$, $g(x) = x^2 + 1$.
