---
title: Limits & Continuity
minutes: 12
---

## What you will learn

- the meaning of a limit, one-sided limits and limits at infinity;
- techniques for indeterminate forms ($\tfrac00$, $\tfrac\infty\infty$);
- continuity, discontinuities and the intermediate value theorem.

## 1. Limits

$\lim_{x \to a}f(x) = L$ means $f(x)$ gets as close to $L$ as we like when $x$ is close to $a$ (with $x \ne a$). The limit exists iff the **left limit** $\lim_{x \to a^-}$ and the **right limit** $\lim_{x \to a^+}$ both exist and are equal. For $f(x) = \dfrac{|x|}x$ the one-sided limits at $0$ are $-1$ and $+1$, so there is no limit.

Limit laws: when each limit exists, the limit of a sum, product and quotient (denominator limit $\ne 0$) is the sum, product, quotient of the limits.

## 2. Techniques

- **Direct substitution** when $f$ is defined and continuous at $a$.
- **Factor and cancel** for $\tfrac00$: $\lim_{x \to 2}\dfrac{x^2 - 4}{x - 2} = \lim(x + 2) = 4$.
- **Rationalise** for square roots: $\lim_{x \to 0}\dfrac{\sqrt{x + 1} - 1}x = \lim\dfrac1{\sqrt{x + 1} + 1} = \dfrac12$.
- **Divide by the highest power** at infinity: $\lim_{x \to \infty}\dfrac{3x^2 + 1}{5x^2 - 2} = \dfrac35$. If the numerator's degree is higher the limit is infinite; if lower, it is $0$.
- **L'Hôpital's rule** (for $\tfrac00$ or $\tfrac\infty\infty$): $\lim\dfrac fg = \lim\dfrac{f'}{g'}$ when the latter exists. For example $\lim_{x \to 0}\dfrac{e^x - 1 - x}{x^2} = \dfrac12$. Use it only after checking the form.

**Standard limits.**

$$
\lim_{x \to 0}\frac{\sin x}x = 1, \quad \lim_{x \to 0}\frac{1 - \cos x}{x^2} = \frac12, \quad \lim_{x \to 0}\frac{e^x - 1}x = 1, \quad \lim_{x \to 0}\frac{\ln(1 + x)}x = 1, \quad \lim_{n \to \infty}\left(1 + \frac1n\right)^n = e.
$$

**Example 1.** $\lim_{x \to 0}\dfrac{\sin3x}x = 3$.

**Example 2.** $\lim_{n \to \infty}\dfrac{2^n + 3^n}{3^{n+1}} = \dfrac13$.

**Example 3.** $\lim_{x \to 3}\dfrac{x^2 - 9}{x^2 - 5x + 6} = \lim\dfrac{(x + 3)}{(x - 2)} = 6$.

**Asymptotes.** $x = a$ is a vertical asymptote if $f \to \pm\infty$ as $x \to a$; $y = L$ is a horizontal asymptote if $\lim_{x \to \pm\infty}f = L$.

## 3. Continuity

$f$ is continuous at $a$ if $f(a)$ is defined, $\lim_{x \to a}f$ exists, and they are equal. Polynomials, $e^x$, $\sin$, $\cos$ are continuous everywhere; rational functions and logs on their domains.

**Types of discontinuity**: *removable* (limit exists but differs from $f(a)$ or $f(a)$ is undefined, like $\dfrac{x^2 - 1}{x - 1}$ at $1$); *jump* (different one-sided limits); *infinite* (vertical asymptote).

**Example 4.** $f(x) = \begin{cases} \dfrac{\sin2x}x, & x \ne 0 \\ k, & x = 0 \end{cases}$ is continuous at $0$ iff $k = 2$.

**Intermediate value theorem.** If $f$ is continuous on $[a, b]$ and $f(a)f(b) < 0$, then $f$ has a zero in $(a, b)$. For $f(x) = x^3 + x - 1$: $f(0) = -1$, $f(1) = 1$, so there is a root in $(0, 1)$.

## Common mistakes

- Cancelling terms in a sum instead of factors.
- Using $\lim\dfrac{\sin x}x = 1$ when $x$ does not tend to $0$.
- Forgetting one-sided limits for piecewise functions.

## Practice problems

1. $\lim_{x \to 1}\dfrac{x^2 - 1}{x - 1}$.
2. $\lim_{x \to \infty}\dfrac{4x^3 - x}{2x^3 + 5}$.
3. $\lim_{x \to 0}\dfrac{\tan x}x$.

**Answers.** (1) $2$. (2) $2$. (3) $1$.
