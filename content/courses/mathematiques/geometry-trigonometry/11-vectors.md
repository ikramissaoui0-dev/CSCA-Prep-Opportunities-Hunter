---
title: Vectors
minutes: 12
---

## What you will learn

- vector operations, components, magnitude and unit vectors;
- the dot product, angles, projections, perpendicularity;
- collinearity, position vectors and basic geometric proofs.

## 1. Basics

A **vector** has a magnitude and a direction. In components $\vec a = (x, y)$, with magnitude $|\vec a| = \sqrt{x^2 + y^2}$. For points $A(x_1, y_1)$, $B(x_2, y_2)$: $\overrightarrow{AB} = (x_2 - x_1, y_2 - y_1)$. The **position vector** of a point $P$ is $\overrightarrow{OP}$.

- **Addition** and **scalar multiplication** work componentwise. Triangle rule: $\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$.
- **Unit vector** in the direction of $\vec a$: $\hat a = \dfrac{\vec a}{|\vec a|}$. For $\vec a = (3, 4)$: $|\vec a| = 5$, $\hat a = \left(\tfrac35, \tfrac45\right)$.
- **Midpoint**: $\overrightarrow{OM} = \tfrac12(\overrightarrow{OA} + \overrightarrow{OB})$. The point dividing $AB$ in ratio $m : n$ has position vector $\dfrac{n\vec a + m\vec b}{m + n}$.
- **Collinear (parallel)** vectors: $\vec a = \lambda\vec b$, i.e. $x_1y_2 - x_2y_1 = 0$. Points $A$, $B$, $C$ are collinear iff $\overrightarrow{AB} \parallel \overrightarrow{AC}$.

## 2. The dot product

$$
\vec a\cdot\vec b = |\vec a||\vec b|\cos\theta = x_1x_2 + y_1y_2, \qquad \cos\theta = \frac{\vec a\cdot\vec b}{|\vec a||\vec b|}.
$$

- $\vec a \perp \vec b \iff \vec a\cdot\vec b = 0$.
- $\vec a\cdot\vec a = |\vec a|^2$; $|\vec a \pm \vec b|^2 = |\vec a|^2 \pm 2\vec a\cdot\vec b + |\vec b|^2$.
- The angle is acute if $\vec a\cdot\vec b > 0$ and obtuse if $< 0$ (excluding the opposite direction).
- **Projection** of $\vec a$ on $\vec b$: signed length $\dfrac{\vec a\cdot\vec b}{|\vec b|}$; vector $\dfrac{\vec a\cdot\vec b}{|\vec b|^2}\vec b$.

**Example 1.** $\vec u = (2, -1)$, $\vec v = (3, 6)$: $\vec u\cdot\vec v = 0$, so they are perpendicular.

**Example 2.** The angle between $(1, 0)$ and $(1, 1)$: $\cos\theta = \dfrac1{\sqrt2}$, $\theta = 45^\circ$.

**Example 3 (parameter).** $\vec a = (1, \lambda)$ and $\vec b = (2, 1)$ form an acute angle: $2 + \lambda > 0$, and not parallel in the same direction ($\lambda \ne \tfrac12$): $\lambda > -2$, $\lambda \ne \tfrac12$.

**Example 4.** $|\vec a| = 2$, $|\vec b| = 3$, angle $60^\circ$: $\vec a\cdot\vec b = 3$ and $|\vec a + \vec b|^2 = 4 + 9 + 6 = 19$.

**Example 5.** $A(1, 2)$, $B(7, 5)$: the point $P$ with $AP : PB = 1 : 2$ is $\dfrac{2(1, 2) + 1(7, 5)}3 = (3, 3)$.

**Example 6 (right triangle).** $A(0, 0)$, $B(4, 0)$, $C(0, 3)$: $\overrightarrow{AB}\cdot\overrightarrow{AC} = 0$, so the angle at $A$ is right.

## 3. Basis vectors

If $\vec e_1$, $\vec e_2$ are not collinear, every vector is $x\vec e_1 + y\vec e_2$ in a unique way; equating coefficients gives two equations. **Example 7.** $\overrightarrow{AD} = \tfrac13\overrightarrow{AB} + \tfrac23\overrightarrow{AC}$ places $D$ on $BC$ with $BD : DC = 2 : 1$.

## Common mistakes

- Subtracting position vectors in the wrong order ($\overrightarrow{AB} = \vec b - \vec a$).
- Writing $\vec a\cdot\vec b$ as a vector.
- Concluding "obtuse" from a negative dot product when the vectors are opposite.

## Practice problems

1. $\vec a = (2, -1)$, $\vec b = (k, 3)$. Find $k$ if $\vec a\perp\vec b$ and if $\vec a\parallel\vec b$.
2. Angle between $(1, \sqrt3)$ and $(1, 0)$.
3. Projection length of $(3, 4)$ onto $(1, 0)$.

**Answers.** (1) $2k - 3 = 0$, $k = \tfrac32$; $6 + k = 0$, $k = -6$. (2) $\cos\theta = \tfrac12$, $60^\circ$. (3) $3$.
