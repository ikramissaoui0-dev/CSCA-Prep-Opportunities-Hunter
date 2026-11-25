---
title: Definite Integrals
minutes: 12
---

## What you will learn

- the definite integral and the Fundamental Theorem of Calculus;
- its geometric meaning and properties;
- areas between curves and volumes of revolution.

## 1. Definition and the Fundamental Theorem

If $F' = f$ on $[a, b]$,

$$
\int_a^bf(x)\,dx = F(b) - F(a) = \bigl[F(x)\bigr]_a^b.
$$

Geometrically it is the **signed area** between the graph and the $x$-axis: parts below the axis count negatively. No $+C$ is needed.

Properties: $\int_a^bf = -\int_b^af$; $\int_a^bf = \int_a^cf + \int_c^bf$; for an odd $f$, $\int_{-a}^af = 0$; for an even $f$, $\int_{-a}^af = 2\int_0^af$. Average value of $f$: $\dfrac1{b - a}\int_a^bf$.

**Example 1.** $\int_0^2(3x^2 + 1)\,dx = [x^3 + x]_0^2 = 10$.

**Example 2.** $\int_0^\pi\sin x\,dx = 2$, but $\int_0^{2\pi}\sin x\,dx = 0$ (positive and negative parts cancel).

**Example 3.** $\int_1^4x^{-1/2}dx = [2\sqrt x]_1^4 = 2$.

**Example 4 (geometric).** $\int_{-1}^1\sqrt{1 - x^2}\,dx = \dfrac\pi2$ (half of the unit disc).

## 2. Area between curves

If $f \ge g$ on $[a, b]$: $A = \int_a^b(f - g)\,dx$. Find the intersections for the limits; if the curves cross, split the interval. For the **total area** between a curve and the $x$-axis when it changes sign, integrate $|f|$ piece by piece.

**Example 5.** Area between $y = x^2$ and $y = x$: they meet at $0$ and $1$; $\int_0^1(x - x^2)\,dx = \dfrac16$.

**Example 6.** Area between $y = x^2$ and $y = 4$: $\int_{-2}^2(4 - x^2)\,dx = \dfrac{32}3$.

**Displacement and distance.** If $v(t)$ changes sign, the displacement is $\int v\,dt$ but the **distance** is $\int|v|\,dt$.

## 3. Volumes of revolution

Rotating the region under $y = f(x)$, $a \le x \le b$, about the $x$-axis gives

$$
V = \pi\int_a^b\bigl(f(x)\bigr)^2dx.
$$

**Example 7.** $y = \sqrt x$ on $[0, 4]$: $V = \pi\int_0^4x\,dx = 8\pi$. Check with a cone: $y = \dfrac x2$ on $[0, 4]$ gives $\pi\int_0^4\dfrac{x^2}4dx = \dfrac{16\pi}3 = \tfrac13\pi r^2h$ with $r = 2$, $h = 4$ ✓.

## Common mistakes

- Including $+C$ in a definite integral.
- Mixing up signed area and total area.
- Forgetting to square the function (and $\pi$) in the volume formula.

## Practice problems

1. $\int_1^3(2x + 1)\,dx$.
2. $\int_0^1e^{3x}dx$.
3. Area between $y = x^2$ and $y = 2x$.

**Answers.** (1) $10$. (2) $\dfrac{e^3 - 1}3$. (3) They meet at $0$, $2$: $\int_0^2(2x - x^2)dx = \dfrac43$.
