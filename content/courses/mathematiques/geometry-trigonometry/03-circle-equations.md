---
title: Circle Equations
minutes: 12
---

## What you will learn

- the standard and general equations of a circle;
- how to find the centre and radius by completing the square;
- position of a line and a circle (tangents, chords); two circles.

## 1. Equations

Centre $(a, b)$ and radius $r > 0$:

$$
(x - a)^2 + (y - b)^2 = r^2 \quad \text{(standard)}, \qquad x^2 + y^2 + Dx + Ey + F = 0 \quad \text{(general)}.
$$

The general equation is a real circle iff $D^2 + E^2 - 4F > 0$, with centre $\left(-\dfrac D2, -\dfrac E2\right)$ and $r = \dfrac12\sqrt{D^2 + E^2 - 4F}$.

**Example 1.** Centre $(2, -1)$, radius $3$: $(x - 2)^2 + (y + 1)^2 = 9$.

**Example 2.** $x^2 + y^2 + 8x - 2y + 8 = 0$: complete the square: $(x + 4)^2 + (y - 1)^2 = 16 + 1 - 8 = 9$: centre $(-4, 1)$, radius $3$. (Forgetting to halve the coefficients is the usual mistake.)

**Example 3.** Circle through $(0, 0)$, $(4, 0)$, $(0, 2)$: $F = 0$; $16 + 4D = 0 \Rightarrow D = -4$; $4 + 2E = 0 \Rightarrow E = -2$. So $x^2 + y^2 - 4x - 2y = 0$, centre $(2, 1)$, $r = \sqrt5$.

**Example 4 (diameter ends).** A circle with diameter $AB$, $A(1, 2)$, $B(5, 4)$: centre $(3, 3)$, radius $\tfrac12|AB| = \sqrt5$.

## 2. Line and circle

Compare the distance $d$ from the centre to the line with $r$:

- $d < r$: two intersection points; chord length $2\sqrt{r^2 - d^2}$.
- $d = r$: tangent.
- $d > r$: no intersection.

**Example 5.** Does $y = x + 1$ meet $x^2 + y^2 = 4$? $d = \dfrac{|1|}{\sqrt2} \approx 0.71 < 2$: yes, two points.

**Example 6 (chord).** $x + y - 5 = 0$ with $x^2 + y^2 = 25$: $d = \dfrac5{\sqrt2}$; chord $= 2\sqrt{25 - 12.5} = 5\sqrt2$.

## 3. Tangent lines

- **Point on the circle**: the tangent is perpendicular to the radius. For $x^2 + y^2 = r^2$ the tangent at $(x_0, y_0)$ is $x_0x + y_0y = r^2$.
- **External point**: write a line through it with unknown slope $k$ and set $d = r$. If only one $k$ appears, the other tangent is vertical.
- **Tangent length** from $P$: $\sqrt{|PC|^2 - r^2}$.

**Example 7.** Tangent to $x^2 + y^2 = 25$ at $(3, 4)$: $3x + 4y = 25$.

## 4. Two circles

With centre distance $d$ and radii $r_1, r_2$: separate ($d > r_1 + r_2$); externally tangent ($d = r_1 + r_2$); two intersection points ($|r_1 - r_2| < d < r_1 + r_2$); internally tangent ($d = |r_1 - r_2|$); one inside the other ($d < |r_1 - r_2|$). Subtracting the two equations gives the **common chord**.

**Maximum/minimum distance** from a point $P$ to a circle: $|PC| \pm r$.

## Common mistakes

- Forgetting to halve $D$ and $E$.
- Writing $r$ instead of $r^2$ on the right-hand side.
- Missing the vertical tangent.

## Practice problems

1. Centre and radius of $x^2 + y^2 - 6x + 4y - 3 = 0$.
2. Is $y = 2x + 5$ tangent to $x^2 + y^2 = 5$?
3. Distance from $(5, 0)$ to the circle $x^2 + y^2 = 9$ (minimum).

**Answers.** (1) $(3, -2)$, $r = 4$. (2) $d = \dfrac5{\sqrt5} = \sqrt5 = r$: yes. (3) $5 - 3 = 2$.
