---
title: Parabolas
minutes: 12
---

## What you will learn

- the focus–directrix definition and the four standard forms;
- how to find the focus, directrix and focal distances;
- tangents, chords and focal chords.

## 1. Definition

A **parabola** is the set of points $P$ whose distance to a fixed point $F$ (the **focus**) equals its distance to a fixed line $\ell$ (the **directrix**): $|PF| = d(P, \ell)$. The line through $F$ perpendicular to $\ell$ is the axis; the **vertex** is the midpoint of the focus and the directrix on the axis. The constant $p$ is the distance from the focus to the directrix.

## 2. The four standard forms ($p > 0$, vertex at the origin)

| Equation | Opens | Focus | Directrix |
|---|---|---|---|
| $y^2 = 2px$ | right | $\left(\dfrac p2, 0\right)$ | $x = -\dfrac p2$ |
| $y^2 = -2px$ | left | $\left(-\dfrac p2, 0\right)$ | $x = \dfrac p2$ |
| $x^2 = 2py$ | up | $\left(0, \dfrac p2\right)$ | $y = -\dfrac p2$ |
| $x^2 = -2py$ | down | $\left(0, -\dfrac p2\right)$ | $y = \dfrac p2$ |

(Chinese textbooks write $y^2 = 2px$ with the parameter $p$; some other books use $y^2 = 4ax$, so $p = 2a$.) **Reading off $p$**: from $y^2 = 12x$, $2p = 12$, $p = 6$.

**Example 1.** $y^2 = 12x$: $p = 6$, focus $(3, 0)$, directrix $x = -3$.

**Example 2.** Focus $(4, 0)$ and directrix $x = -4$: $\dfrac p2 = 4$, so $y^2 = 16x$.

**Example 3.** Focus $(0, -3)$, vertex at origin: opens down, $\dfrac p2 = 3$: $x^2 = -12y$.

## 3. Focal distance and chords

For $P(x_0, y_0)$ on $y^2 = 2px$: **focal distance** $|PF| = x_0 + \dfrac p2$. The **latus rectum** (chord through the focus perpendicular to the axis) has length $2p$. For a focal chord with endpoints $A$, $B$: $|AB| = x_1 + x_2 + p$ (for $y^2 = 2px$).

**Example 4.** On $y^2 = 8x$ ($p = 4$), a point with $x = 3$ is at distance $3 + 2 = 5$ from the focus $(2, 0)$.

**Example 5 (focal chord).** The line $y = x - 1$ meets $y^2 = 4x$ ($p = 2$, focus $(1, 0)$ on the line): $(x - 1)^2 = 4x \Rightarrow x^2 - 6x + 1 = 0$, so $x_1 + x_2 = 6$ and $|AB| = 6 + 2 = 8$.

## 4. Tangents

The tangent to $y^2 = 2px$ at $(x_0, y_0)$ is $y_0y = p(x + x_0)$.

**Example 6.** Tangent to $y^2 = 8x$ at $(2, 4)$: $p = 4$, so $4y = 4(x + 2) \Rightarrow y = x + 2$.

A line meets the parabola in 0, 1 or 2 points according to the discriminant of the quadratic obtained by substitution; $\Delta = 0$ means tangent (except for a line parallel to the axis, which meets the parabola once without being tangent).

**Example 7.** $y = x + 1$ meets $y^2 = 4x$: $(x + 1)^2 = 4x \Rightarrow (x - 1)^2 = 0$, tangent at $(1, 2)$.

**Shifted parabola.** $(y - k)^2 = 2p(x - h)$ has vertex $(h, k)$, focus $\left(h + \dfrac p2, k\right)$, directrix $x = h - \dfrac p2$.

**Reflection property.** A ray parallel to the axis reflects through the focus (headlights, satellite dishes).

## Common mistakes

- Reading $2p$ as $p$.
- Using the focal distance formula for the wrong orientation.
- Forgetting that $y^2 = 2px$ is symmetric about the $x$-axis.

## Practice problems

1. Focus and directrix of $x^2 = -8y$.
2. A parabola $y^2 = 2px$ passes through $(2, 4)$. Find $p$ and the focus.
3. Distance from $(4, 4)$ on $y^2 = 4x$ to its focus.

**Answers.** (1) $p = 4$: focus $(0, -2)$, directrix $y = 2$. (2) $16 = 4p$, $p = 4$, focus $(2, 0)$. (3) $4 + 1 = 5$.
