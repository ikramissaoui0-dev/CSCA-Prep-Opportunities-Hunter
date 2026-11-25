---
title: Derivative Rules
minutes: 12
---

## What you will learn

- the definition of the derivative and its meaning;
- the table of basic derivatives;
- the sum, product and quotient rules; tangent lines.

## 1. Definition and meaning

$$
f'(a) = \lim_{h \to 0}\frac{f(a + h) - f(a)}h
$$

is the slope of the tangent line at $x = a$, and the instantaneous rate of change. Velocity is $s'(t)$ and acceleration $s''(t)$. A differentiable function is continuous; the converse is false ($|x|$ at $0$).

**Example 1.** $f(x) = x^2$ at $x = 3$: $\lim\dfrac{(3 + h)^2 - 9}h = \lim(6 + h) = 6$.

## 2. Basic derivatives

| $f(x)$ | $f'(x)$ | $f(x)$ | $f'(x)$ |
|---|---|---|---|
| $c$ | $0$ | $e^x$ | $e^x$ |
| $x^n$ | $nx^{n-1}$ | $a^x$ | $a^x\ln a$ |
| $\sin x$ | $\cos x$ | $\ln x$ | $\dfrac1x$ |
| $\cos x$ | $-\sin x$ | $\log_ax$ | $\dfrac1{x\ln a}$ |
| $\tan x$ | $\dfrac1{\cos^2x}$ | $\sqrt x$ | $\dfrac1{2\sqrt x}$ |

Rules: $(cf)' = cf'$, $(f \pm g)' = f' \pm g'$.

**Example 2.** $f(x) = 3x^4 - 2x^2 + 7$: $f'(x) = 12x^3 - 4x$.

## 3. Product and quotient rules

$$
(uv)' = u'v + uv', \qquad \left(\frac uv\right)' = \frac{u'v - uv'}{v^2}.
$$

**Example 3.** $y = x^2e^x$: $y' = 2xe^x + x^2e^x = x(x + 2)e^x$.

**Example 4.** $y = \dfrac{3x + 1}{x^2}$: $y' = \dfrac{3x^2 - (3x + 1)2x}{x^4} = \dfrac{-3x^2 - 2x}{x^4} = -\dfrac{3x + 2}{x^3}$. (Rewriting as $3x^{-1} + x^{-2}$ gives the same answer faster.)

**Example 5.** $y = \dfrac{x}{x^2 + 1}$: $y' = \dfrac{(x^2 + 1) - 2x^2}{(x^2 + 1)^2} = \dfrac{1 - x^2}{(x^2 + 1)^2}$.

**Example 6.** $y = x\ln x$: $y' = \ln x + 1$.

## 4. Tangent lines

Tangent at $x = a$: $y - f(a) = f'(a)(x - a)$. For $f(x) = x^3 - 2x$ at $x = 1$: $f(1) = -1$, $f'(1) = 3 - 2 = 1$, so $y = x - 2$.

**Tangent through an external point.** Let the point of tangency be $(t, f(t))$ and require the tangent to pass through the given point. For $y = e^x$ through the origin: $-e^t = -te^t \Rightarrow t = 1$, the line $y = ex$.

**Normal line.** Perpendicular to the tangent, slope $-\dfrac1{f'(a)}$.

## Common mistakes

- Using $(uv)' = u'v'$.
- Sign errors in the quotient rule numerator.
- Differentiating a constant multiple of $x$ incorrectly: $(5x)' = 5$, not $5x$.

## Practice problems

1. Differentiate $y = x^3\sin x$.
2. Differentiate $y = \dfrac{e^x}x$.
3. Equation of the tangent to $y = x^2$ at $x = 2$.

**Answers.** (1) $3x^2\sin x + x^3\cos x$. (2) $\dfrac{e^x(x - 1)}{x^2}$. (3) $y - 4 = 4(x - 2)$, i.e. $y = 4x - 4$.
