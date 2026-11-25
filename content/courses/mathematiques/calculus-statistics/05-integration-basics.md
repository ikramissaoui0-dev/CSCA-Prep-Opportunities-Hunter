---
title: Integration Basics
minutes: 10
---

## What you will learn

- antiderivatives and the indefinite integral;
- the basic rules and table;
- reverse chain rule (substitution) and why $+C$.

## 1. Indefinite integral

$F$ is an **antiderivative** of $f$ if $F' = f$. All antiderivatives differ by a constant, so

$$
\int f(x)\,dx = F(x) + C.
$$

**Why $+C$?** Differentiating kills constants, so $x^2$, $x^2 + 5$ and $x^2 - 3$ all have derivative $2x$.

## 2. Table and rules

| $f(x)$ | $\int f(x)\,dx$ |
|---|---|
| $x^n$ ($n \ne -1$) | $\dfrac{x^{n+1}}{n+1} + C$ |
| $\dfrac1x$ | $\ln\lvert x\rvert + C$ |
| $e^x$ | $e^x + C$ |
| $a^x$ | $\dfrac{a^x}{\ln a} + C$ |
| $\sin x$ | $-\cos x + C$ |
| $\cos x$ | $\sin x + C$ |
| $\dfrac1{\cos^2x}$ | $\tan x + C$ |

Linearity: $\int(af + bg) = a\int f + b\int g$. For a linear inner function: $\int f(ax + b)\,dx = \dfrac1aF(ax + b) + C$.

**Example 1.** $\int(4x^3 - 2x + 5)\,dx = x^4 - x^2 + 5x + C$.

**Example 2.** $\int e^{3x}\,dx = \dfrac13e^{3x} + C$; $\int\cos2x\,dx = \dfrac12\sin2x + C$.

**Example 3.** $\int\dfrac{dx}{\sqrt x} = \int x^{-1/2}dx = 2\sqrt x + C$.

**Example 4 (initial condition).** $f'(x) = 2x + 1$ and $f(0) = 3$: $f(x) = x^2 + x + 3$.

## 3. Reverse chain rule (substitution)

When the integrand is a function of $u(x)$ times $u'(x)$: let $u = u(x)$, $du = u'(x)\,dx$.

**Example 5.** $\int2xe^{x^2}dx$: $u = x^2$, $du = 2x\,dx$: $\int e^udu = e^{x^2} + C$.

**Example 6.** $\int x(x^2 + 1)^3dx$: $u = x^2 + 1$, $\tfrac12du = x\,dx$: $\tfrac12\cdot\dfrac{u^4}4 = \dfrac{(x^2 + 1)^4}8 + C$.

**Example 7.** $\int\sin^2x\,dx = \int\dfrac{1 - \cos2x}2dx = \dfrac x2 - \dfrac{\sin2x}4 + C$.

**Always check by differentiating** your answer.

## Common mistakes

- Forgetting $+C$.
- Forgetting the factor $\dfrac1a$ for $f(ax + b)$.
- Using the power rule for $n = -1$ (the result is $\ln|x|$).

## Practice problems

1. $\int(3x^2 - 4x + 1)\,dx$.
2. $\int\sin3x\,dx$.
3. $\int\dfrac{2x}{x^2 + 1}dx$.

**Answers.** (1) $x^3 - 2x^2 + x + C$. (2) $-\dfrac13\cos3x + C$. (3) $\ln(x^2 + 1) + C$.
