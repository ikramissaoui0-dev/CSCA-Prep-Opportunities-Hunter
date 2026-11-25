---
title: Ellipses
minutes: 12
---

## What you will learn

- the focal definition and the standard equations of an ellipse;
- semi-axes, foci, eccentricity and the relation $c^2 = a^2 - b^2$;
- chords, tangents and shifted ellipses.

## 1. Definition

An **ellipse** is the set of points $P$ for which the sum of the distances to two fixed points $F_1$, $F_2$ (the **foci**) is a constant $2a$, with $2a > |F_1F_2| = 2c$:

$$
|PF_1| + |PF_2| = 2a.
$$

## 2. Standard equations (centre at the origin, $a > b > 0$)

$$
\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (\text{foci on the } x\text{-axis}), \qquad \frac{y^2}{a^2} + \frac{x^2}{b^2} = 1 \quad (\text{foci on the } y\text{-axis}).
$$

- **Semi-major axis** $a$ (the larger denominator's root), **semi-minor axis** $b$, **focal half-distance** $c$, with

$$
c^2 = a^2 - b^2, \qquad e = \frac ca \in (0, 1).
$$

- Vertices: $(\pm a, 0)$ and $(0, \pm b)$ (for the first form); foci $(\pm c, 0)$. The closer $e$ is to $0$, the closer the ellipse is to a circle.
- The **latus rectum** has length $\dfrac{2b^2}a$.
- **Which axis?** The focus axis is the one with the **larger denominator**.

**Example 1.** $\dfrac{x^2}{25} + \dfrac{y^2}9 = 1$: $a = 5$, $b = 3$, $c = 4$, foci $(\pm4, 0)$, $e = \dfrac45$.

**Example 2.** Centre $(0, 0)$, $a = 6$ (horizontal), $b = 4$: $\dfrac{x^2}{36} + \dfrac{y^2}{16} = 1$.

**Example 3.** Foci $(\pm3, 0)$, passing through $(0, 4)$: $b = 4$, $c = 3$, $a^2 = 25$: $\dfrac{x^2}{25} + \dfrac{y^2}{16} = 1$.

**Example 4.** $\dfrac{y^2}{9} + \dfrac{x^2}4 = 1$: foci on the $y$-axis since $9 > 4$: $a = 3$, $b = 2$, $c = \sqrt5$, foci $(0, \pm\sqrt5)$.

## 3. Focal distances and chords

**Example 5.** On $\dfrac{x^2}{16} + \dfrac{y^2}9 = 1$ ($2a = 8$), if $|PF_1| = 3$ then $|PF_2| = 5$. For a point with abscissa $x_0$: $|PF_{1,2}| = a \pm ex_0$.

**Chord length.** If a line of slope $k$ meets the ellipse in points with abscissas $x_1, x_2$: $|AB| = \sqrt{1 + k^2}\,|x_1 - x_2|$, computed from Vieta's relations on the quadratic obtained by substitution.

**Midpoint of a chord.** If $M(x_0, y_0)$ is the midpoint of a chord of $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$, then the chord's slope is $k = -\dfrac{b^2x_0}{a^2y_0}$ (the point-difference method).

## 4. Tangents and shifted ellipses

The tangent at $(x_0, y_0)$ on the ellipse is $\dfrac{x_0x}{a^2} + \dfrac{y_0y}{b^2} = 1$. A line $y = kx + m$ is tangent iff $m^2 = a^2k^2 + b^2$.

**Example 6.** $y = kx + 1$ tangent to $\dfrac{x^2}4 + y^2 = 1$: $1 = 4k^2 + 1 \Rightarrow k = 0$.

**Shifted ellipse.** $\dfrac{(x - h)^2}{a^2} + \dfrac{(y - k)^2}{b^2} = 1$ has centre $(h, k)$ and foci $(h \pm c, k)$. **Example 7.** $\dfrac{(x - 1)^2}9 + \dfrac{(y + 2)^2}4 = 1$: centre $(1, -2)$, foci $(1 \pm \sqrt5, -2)$.

**Reflection property.** A ray from one focus reflects to the other (whispering galleries, lithotripsy).

## Common mistakes

- Using $c^2 = a^2 + b^2$ (that is for hyperbolas).
- Taking $a$ to be the denominator of $x^2$ regardless of size.
- Forgetting that $2a > 2c$.

## Practice problems

1. For $9x^2 + 25y^2 = 225$ find $a, b, c, e$.
2. An ellipse has $2a = 10$ and $e = 0.6$. Write its equation.
3. $|PF_1| = 4$ on an ellipse with $2a = 14$. Find $|PF_2|$.

**Answers.** (1) $\dfrac{x^2}{25} + \dfrac{y^2}9 = 1$: $a = 5$, $b = 3$, $c = 4$, $e = 0.8$. (2) $a = 5$, $c = 3$, $b = 4$: $\dfrac{x^2}{25} + \dfrac{y^2}{16} = 1$. (3) $10$.
