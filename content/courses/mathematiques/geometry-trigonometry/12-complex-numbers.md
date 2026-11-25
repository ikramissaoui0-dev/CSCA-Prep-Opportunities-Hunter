---
title: Complex Numbers
minutes: 14
---

## What you will learn

- the imaginary unit, algebraic form and arithmetic;
- conjugate, modulus, division and powers of $i$;
- the complex plane, trigonometric form, de Moivre and loci.

## 1. The imaginary unit and standard form

$i^2 = -1$. A complex number is $z = a + bi$ with **real part** $a$ and **imaginary part** $b$; $\mathbb{R} \subset \mathbb{C}$. Two complex numbers are equal iff both parts match. $z$ is real iff $b = 0$ and **purely imaginary** iff $a = 0$ and $b \ne 0$.

**Powers of $i$** repeat with period $4$: $i, -1, -i, 1$. So $i^{2026} = i^{2026 \bmod 4} = i^2 = -1$; $i^{2025} = i$.

## 2. Arithmetic

Add and subtract componentwise; multiply by expanding with $i^2 = -1$:

**Example 1.** $(2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 5 + i$.

**Conjugate** $\bar z = a - bi$; **modulus** $|z| = \sqrt{a^2 + b^2}$; $z\bar z = |z|^2$.

**Division**: multiply numerator and denominator by the conjugate of the denominator.

**Example 2.** $\dfrac{2 + i}{1 - i} = \dfrac{(2 + i)(1 + i)}2 = \dfrac{1 + 3i}2$.

**Example 3.** $z = 2 - 3i$: $z\bar z = 13$, $|z| = \sqrt{13}$.

**Properties**: $\overline{z_1z_2} = \bar z_1\bar z_2$, $|z_1z_2| = |z_1||z_2|$, $|z_1 + z_2| \le |z_1| + |z_2|$; $z$ real $\iff z = \bar z$.

**Example 4.** For which real $m$ is $(m^2 - 1) + (m + 1)i$ purely imaginary? Real part $0$: $m = \pm1$; imaginary part $\ne 0$: $m \ne -1$. So $m = 1$.

**Quadratics.** If $\Delta < 0$ (real coefficients), the roots are conjugates $\dfrac{-b \pm i\sqrt{-\Delta}}{2a}$. Vieta still applies.

## 3. The complex plane and trigonometric form

$z = a + bi$ corresponds to the point $(a, b)$ or the vector from the origin; $|z|$ is its distance from the origin, $|z_1 - z_2|$ the distance between two points. The **argument** $\theta$ is the angle with the positive real axis:

$$
z = r(\cos\theta + i\sin\theta) = re^{i\theta}, \qquad r = |z|, \quad \tan\theta = \frac ba \text{ (quadrant of } (a, b)).
$$

$$
z_1z_2 = r_1r_2\bigl(\cos(\theta_1 + \theta_2) + i\sin(\theta_1 + \theta_2)\bigr), \quad \frac{z_1}{z_2} = \frac{r_1}{r_2}\bigl(\cos(\theta_1 - \theta_2) + i\sin(\theta_1 - \theta_2)\bigr), \quad z^n = r^n(\cos n\theta + i\sin n\theta).
$$

Multiplying by $e^{i\alpha}$ rotates by $\alpha$ about the origin.

**Example 5.** $1 + i = \sqrt2\left(\cos\dfrac\pi4 + i\sin\dfrac\pi4\right)$, so $(1 + i)^8 = 16$.

**Example 6.** $-1 + \sqrt3i$: $|z| = 2$, argument $\dfrac{2\pi}3$ (quadrant II).

**Example 7.** $(1 - i)^6 = (\sqrt2)^6\left(\cos\left(-\dfrac{3\pi}2\right) + i\sin\left(-\dfrac{3\pi}2\right)\right) = 8i$.

## 4. Loci

$|z - z_0| = r$ is a circle; $|z - z_1| = |z - z_2|$ is the perpendicular bisector; $|z - z_1| + |z - z_2| = 2a$ (with $2a > |z_1 - z_2|$) is an ellipse. If $|z - 2i| = 3$, the maximum of $|z|$ is $2 + 3 = 5$.

## Common mistakes

- Treating $i^2$ as $+1$.
- Leaving $i$ in a denominator.
- Forgetting the quadrant for the argument.

## Practice problems

1. Compute $\dfrac{3 + i}{1 - i}$.
2. $|z|$ and $\arg z$ for $z = \sqrt3 - i$.
3. Find $i^{101}$.

**Answers.** (1) $1 + 2i$. (2) $|z| = 2$, $\arg = -\dfrac\pi6$. (3) $i^{101} = i$.
