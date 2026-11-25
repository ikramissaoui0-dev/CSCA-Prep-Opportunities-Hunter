---
title: Radians & the Unit Circle
minutes: 12
---

## What you will learn

- radians, arc length and sector area;
- the unit circle and exact values of the trigonometric functions;
- signs by quadrant, and reduction (reference-angle) formulas.

## 1. Radians

One **radian** is the angle at the centre of a circle that cuts off an arc equal to the radius. A full turn is $2\pi$ radians, so $\pi\ \text{rad} = 180^\circ$:

$$
1^\circ = \frac\pi{180}\ \text{rad}, \qquad 1\ \text{rad} = \frac{180^\circ}\pi \approx 57.3^\circ.
$$

**Arc length** $s = r\theta$ and **sector area** $A = \tfrac12r^2\theta$ (with $\theta$ in radians).

**Example 1.** A sector has radius $9\ \text{cm}$ and central angle $40^\circ = \dfrac{2\pi}9$: arc $= 9 \cdot \dfrac{2\pi}9 = 2\pi\ \text{cm}$, area $= \tfrac12 \cdot 81 \cdot \dfrac{2\pi}9 = 9\pi\ \text{cm}^2$.

**Example 2.** Convert $240^\circ = \dfrac{240\pi}{180} = \dfrac{4\pi}3$; and $\dfrac{5\pi}{12}$ rad $= 75^\circ$.

## 2. The unit circle

On the circle of radius $1$ centred at the origin, the point at angle $\theta$ (measured counter-clockwise from the positive $x$-axis) is $(\cos\theta, \sin\theta)$. If a point $P(x, y)$ is on the terminal side of $\alpha$ and $r = \sqrt{x^2 + y^2}$, then $\sin\alpha = \dfrac yr$, $\cos\alpha = \dfrac xr$, $\tan\alpha = \dfrac yx$.

**Example 3.** $P(5, -12)$: $r = 13$, $\sin\alpha = -\dfrac{12}{13}$, $\cos\alpha = \dfrac5{13}$, $\tan\alpha = -\dfrac{12}5$.

**Special values**:

| $\theta$ | $0$ | $\dfrac\pi6$ | $\dfrac\pi4$ | $\dfrac\pi3$ | $\dfrac\pi2$ | $\pi$ | $\dfrac{3\pi}2$ |
|---|---|---|---|---|---|---|---|
| $\sin\theta$ | $0$ | $\dfrac12$ | $\dfrac{\sqrt2}2$ | $\dfrac{\sqrt3}2$ | $1$ | $0$ | $-1$ |
| $\cos\theta$ | $1$ | $\dfrac{\sqrt3}2$ | $\dfrac{\sqrt2}2$ | $\dfrac12$ | $0$ | $-1$ | $0$ |
| $\tan\theta$ | $0$ | $\dfrac{\sqrt3}3$ | $1$ | $\sqrt3$ | undefined | $0$ | undefined |

## 3. Signs and reduction

**ASTC** ("All, Sine, Tangent, Cosine"): the function named is positive in that quadrant — I: all; II: $\sin$; III: $\tan$; IV: $\cos$.

**Reduction formulas.**

$$
\sin(\pi - x) = \sin x, \quad \cos(\pi - x) = -\cos x, \quad \sin(\pi + x) = -\sin x, \quad \cos(\pi + x) = -\cos x,
$$

$$
\sin(-x) = -\sin x, \quad \cos(-x) = \cos x, \quad \sin\left(\tfrac\pi2 - x\right) = \cos x, \quad \cos\left(\tfrac\pi2 - x\right) = \sin x.
$$

Method: reduce the angle to a first-quadrant reference angle, then attach the sign from ASTC.

**Example 4.** $\sin150^\circ = \sin30^\circ = \dfrac12$; $\tan315^\circ = -\tan45^\circ = -1$; $\cos\left(-\dfrac\pi3\right) = \dfrac12$; $\sin\dfrac{5\pi}4 = -\dfrac{\sqrt2}2$.

**Example 5.** $\cos\left(-\dfrac\pi3\right) + \sin\dfrac{5\pi}4 = \dfrac12 - \dfrac{\sqrt2}2 = \dfrac{1 - \sqrt2}2$.

**Example 6.** Find $\alpha \in [0, 2\pi)$ with $\sin\alpha = -\dfrac{\sqrt3}2$ and $\cos\alpha = \dfrac12$: sine negative and cosine positive means quadrant IV: $\alpha = \dfrac{5\pi}3$.

## Common mistakes

- Using degrees where radians are required.
- Forgetting the sign in quadrants II–IV.
- Writing $\tan\dfrac\pi2$ as a number.

## Practice problems

1. Convert $135^\circ$ to radians and $\dfrac{7\pi}6$ to degrees.
2. Find the arc length for $r = 6$ and $\theta = \dfrac{2\pi}3$.
3. Evaluate $\sin\dfrac{7\pi}6$ and $\cos\dfrac{5\pi}3$.

**Answers.** (1) $\dfrac{3\pi}4$; $210^\circ$. (2) $4\pi$. (3) $-\dfrac12$; $\dfrac12$.
