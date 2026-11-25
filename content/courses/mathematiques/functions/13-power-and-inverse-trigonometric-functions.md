---
title: Power & Inverse Trigonometric Functions
minutes: 12
---

## What you will learn

- the family of power functions $y = x^\alpha$ and how its shape depends on $\alpha$;
- parameter problems on power functions;
- $\arcsin$, $\arccos$, $\arctan$: domains, ranges and values.

## 1. Power functions

A **power function** has the form $y = x^\alpha$ with a constant exponent $\alpha$.

| Exponent | Domain | Parity | On $(0, +\infty)$ |
|---|---|---|---|
| $\alpha = 1, 3, 5, \dots$ | $\mathbb{R}$ | odd | increasing |
| $\alpha = 2, 4, \dots$ | $\mathbb{R}$ | even | increasing |
| $\alpha = \tfrac12$ ($\sqrt x$) | $[0, +\infty)$ | neither | increasing |
| $\alpha = -1$ ($1/x$) | $x \ne 0$ | odd | decreasing |
| $\alpha = -2$ | $x \ne 0$ | even | decreasing |

For $x > 0$ every power function passes through $(1, 1)$; it is increasing if $\alpha > 0$ and decreasing if $\alpha < 0$. On $(0, 1)$ a larger exponent gives a *smaller* value ($x^3 < x^2$); for $x > 1$ it gives a larger value.

**Example 1.** Domain of $y = x^{1/2}$: $[0, +\infty)$; of $y = x^{-1}$: $x \ne 0$.

**Example 2 (parameter).** $f(x) = (m^2 - m - 1)x^m$ is a power function increasing on $(0, +\infty)$. The coefficient must be $1$: $m^2 - m - 2 = 0 \Rightarrow m = 2$ or $-1$; increasing needs $m > 0$: $m = 2$.

**Example 3 (comparing).** Compare $0.3^{1/2}$ and $0.2^{1/2}$: the function $x^{1/2}$ is increasing, so $0.3^{1/2} > 0.2^{1/2}$. Compare $0.5^{-2}$ and $0.6^{-2}$: $x^{-2}$ is decreasing on $(0, +\infty)$, so $0.5^{-2} > 0.6^{-2}$.

## 2. Inverse trigonometric functions

The trigonometric functions are not injective, so the inverses use restricted domains:

| Function | Domain | Range |
|---|---|---|
| $y = \arcsin x$ | $[-1, 1]$ | $\left[-\dfrac\pi2, \dfrac\pi2\right]$ |
| $y = \arccos x$ | $[-1, 1]$ | $[0, \pi]$ |
| $y = \arctan x$ | $\mathbb{R}$ | $\left(-\dfrac\pi2, \dfrac\pi2\right)$ |

$\arcsin x$ is the *angle in $[-\tfrac\pi2, \tfrac\pi2]$ whose sine is $x$*; $\arccos x$ the angle in $[0, \pi]$ whose cosine is $x$.

**Example 4.** $\arcsin\tfrac12 = \dfrac\pi6$; $\arccos(-1) = \pi$; $\arccos\left(-\tfrac12\right) = \dfrac{2\pi}3$; $\arctan1 = \dfrac\pi4$; $\arcsin\left(-\tfrac{\sqrt3}2\right) = -\dfrac\pi3$.

**Identities.** $\sin(\arcsin x) = x$ for $x \in [-1, 1]$, but $\arcsin(\sin x) = x$ only when $x \in \left[-\tfrac\pi2, \tfrac\pi2\right]$. $\arcsin x + \arccos x = \dfrac\pi2$. $\arcsin(-x) = -\arcsin x$ and $\arctan(-x) = -\arctan x$ (odd), $\arccos(-x) = \pi - \arccos x$.

**Example 5.** $\arcsin\left(\sin\dfrac{5\pi}6\right) = \arcsin\tfrac12 = \dfrac\pi6$, not $\dfrac{5\pi}6$.

**Example 6.** $\sin\left(\arccos\dfrac35\right)$: let $\theta = \arccos\tfrac35 \in [0, \pi]$; then $\sin\theta = \sqrt{1 - \tfrac9{25}} = \tfrac45$.

## 3. Equations from an inverse

$\sin x = \tfrac12$ on $[0, \pi]$: $x = \dfrac\pi6$ or $\dfrac{5\pi}6$ (not only $\arcsin\tfrac12$). Always list both solutions in the required interval.

## Common mistakes

- Forgetting the restricted range of the inverse functions.
- Writing $\arcsin(\sin x) = x$ for any $x$.
- Writing $\arcsin x$ for $\dfrac1{\sin x}$.

## Practice problems

1. Evaluate $\arccos\dfrac{\sqrt2}2$ and $\arctan(-1)$.
2. Evaluate $\arcsin\left(\sin\dfrac{2\pi}3\right)$.
3. For $y = x^{-1/2}$ give the domain and state whether it is increasing.

**Answers.** (1) $\dfrac\pi4$ and $-\dfrac\pi4$. (2) $\dfrac\pi3$. (3) $x > 0$; decreasing.
