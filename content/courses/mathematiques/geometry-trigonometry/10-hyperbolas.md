---
title: Hyperbolas
minutes: 12
---

## What you will learn

- the focal definition and the standard equations of a hyperbola;
- vertices, foci, asymptotes and eccentricity, with $c^2 = a^2 + b^2$;
- how to identify a hyperbola and handle a shifted one.

## 1. Definition

A **hyperbola** is the set of points $P$ for which the **difference** of the distances to two foci is constant:

$$
\bigl||PF_1| - |PF_2|\bigr| = 2a, \qquad 0 < 2a < |F_1F_2| = 2c.
$$

It has two branches.

## 2. Standard equations (centre at the origin)

$$
\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1 \ (\text{foci } (\pm c, 0)), \qquad \frac{y^2}{a^2} - \frac{x^2}{b^2} = 1 \ (\text{foci } (0, \pm c)),
$$

with

$$
c^2 = a^2 + b^2, \qquad e = \frac ca > 1.
$$

- **Vertices**: $(\pm a, 0)$ for the first form; $(0, \pm a)$ for the second.
- **Asymptotes**: $y = \pm\dfrac bax$ (first form); $y = \pm\dfrac abx$ (second form).
- **Identifying the axis**: the variable with the **positive** sign (the first term) gives the direction of the transverse axis. Unlike the ellipse, $a$ is not required to be larger than $b$.
- Hyperbolas with the same asymptotes $\dfrac xa \pm \dfrac yb = 0$ have equation $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = \lambda$ ($\lambda \ne 0$).
- An equilateral (rectangular) hyperbola has $a = b$ (so $e = \sqrt2$).

**Example 1.** $\dfrac{x^2}{16} - \dfrac{y^2}9 = 1$: $a = 4$, $b = 3$, $c = 5$, $e = \dfrac54$, vertices $(\pm4, 0)$, foci $(\pm5, 0)$, asymptotes $y = \pm\dfrac34x$.

**Example 2.** $\dfrac{y^2}4 - \dfrac{x^2}{25} = 1$: opens up and down; $a = 2$, $b = 5$, $c = \sqrt{29}$; asymptotes $y = \pm\dfrac25x$.

**Example 3.** $e = 2$ and $a = 1$: $c = 2$, $b^2 = 3$: $x^2 - \dfrac{y^2}3 = 1$.

**Example 4.** A hyperbola has asymptotes $y = \pm\dfrac12x$ and passes through $(2\sqrt2, 1)$. Hyperbolas with these asymptotes are $\dfrac{x^2}4 - y^2 = \lambda$; substituting the point gives $\lambda = \dfrac84 - 1 = 1$, so the equation is $\dfrac{x^2}4 - y^2 = 1$.

## 3. Focal distance and eccentricity

For $P$ on the right branch of $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = 1$: $|PF_1| - |PF_2| = 2a$. If $|PF_1| = 10$ and $2a = 6$ then $|PF_2| = 4$ or $16$ (check which branch: $|PF_2| \ge c - a$).

**Example 5.** Eccentricity from asymptotes: if $\dfrac ba = \dfrac34$ then $e = \sqrt{1 + \left(\tfrac ba\right)^2} = \dfrac54$.

## 4. Tangents, shifted hyperbolas

Tangent at $(x_0, y_0)$: $\dfrac{x_0x}{a^2} - \dfrac{y_0y}{b^2} = 1$. A line parallel to an asymptote meets the hyperbola in exactly one point (without being tangent).

Shifted: $\dfrac{(x - h)^2}{a^2} - \dfrac{(y - k)^2}{b^2} = 1$ has centre $(h, k)$ and asymptotes $y - k = \pm\dfrac ba(x - h)$.

**Compare the three conics** by $e$: ellipse $0 < e < 1$, parabola $e = 1$, hyperbola $e > 1$.

## Common mistakes

- Using $c^2 = a^2 - b^2$ (ellipse) instead of $a^2 + b^2$.
- Confusing which axis is transverse.
- Writing asymptotes with $\dfrac ab$ instead of $\dfrac ba$ for the $x$-axis form.

## Practice problems

1. Asymptotes of $\dfrac{y^2}4 - \dfrac{x^2}9 = 1$.
2. A hyperbola has $a = 3$, $c = 5$, foci on the $x$-axis. Write its equation.
3. Find $e$ for $x^2 - y^2 = 1$.

**Answers.** (1) $y = \pm\dfrac23x$. (2) $b = 4$: $\dfrac{x^2}9 - \dfrac{y^2}{16} = 1$. (3) $\sqrt2$.
