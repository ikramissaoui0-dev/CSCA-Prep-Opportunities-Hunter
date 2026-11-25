---
title: Coordinate Geometry Basics
minutes: 10
---

## What you will learn

- distance, midpoint, and the slope (gradient) of a segment;
- parallel and perpendicular lines through slopes;
- collinearity and the inclination angle.

## 1. Key formulas

For $A(x_1, y_1)$ and $B(x_2, y_2)$:

$$
|AB| = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}, \qquad M = \left(\frac{x_1 + x_2}2, \frac{y_1 + y_2}2\right), \qquad m = \frac{y_2 - y_1}{x_2 - x_1}.
$$

The **centroid** of a triangle with vertices $(x_i, y_i)$ is $\left(\dfrac{x_1 + x_2 + x_3}3, \dfrac{y_1 + y_2 + y_3}3\right)$.

The slope $m = \tan\alpha$, where $\alpha \in [0, \pi)$ is the **inclination angle** of the line. A horizontal line has $m = 0$; a vertical line has an undefined slope.

**Example 1.** Distance between $A(1, 3)$ and $B(4, 7)$: $\sqrt{9 + 16} = 5$. Midpoint of $(-2, 6)$ and $(4, -2)$: $(1, 2)$.

## 2. Parallel, perpendicular, collinear

- **Parallel** lines: equal slopes, $m_1 = m_2$.
- **Perpendicular** lines: $m_1m_2 = -1$ (or one horizontal and one vertical).
- Three points $A$, $B$, $C$ are **collinear** if $m_{AB} = m_{AC}$.

**Example 2.** Line $L_1$ has slope $2$. A parallel line has slope $2$; a perpendicular line has slope $-\dfrac12$.

**Example 3.** Are $A(1, 1)$, $B(3, 5)$, $C(5, 9)$ collinear? $m_{AB} = 2$, $m_{AC} = \dfrac84 = 2$: yes.

**Example 4 (right triangle).** $A(0, 0)$, $B(4, 0)$, $C(0, 3)$: $m_{AB} = 0$ and $AC$ is vertical, so the angle at $A$ is right; $|BC| = 5$. Check Pythagoras: $4^2 + 3^2 = 5^2$.

**Example 5 (finding a point).** If $M(2, 1)$ is the midpoint of $AB$ and $A = (-1, 3)$, then $B = (2 \cdot 2 - (-1), 2 \cdot 1 - 3) = (5, -1)$.

**Example 6 (parallelogram).** In parallelogram $ABCD$ the diagonals have the same midpoint: with $A(0, 0)$, $B(4, 1)$, $C(5, 4)$, the midpoint of $AC$ is $(2.5, 2)$, so $D = (2 \cdot 2.5 - 4, 2 \cdot 2 - 1) = (1, 3)$.

**Symmetry.** Reflection of $(a, b)$ in the $x$-axis: $(a, -b)$; in the $y$-axis: $(-a, b)$; in the origin: $(-a, -b)$; in $y = x$: $(b, a)$.

## Common mistakes

- Computing a slope as $\dfrac{x_2 - x_1}{y_2 - y_1}$ (inverted).
- Using slope formulas for vertical lines.
- Forgetting the square root in the distance formula.

## Practice problems

1. Slope and distance of $A(1, 2)$, $B(5, 5)$.
2. Is the triangle with vertices $(0, 0)$, $(6, 0)$, $(3, 3)$ right-angled?
3. The line through $(1, 2)$ perpendicular to a line of slope $\dfrac23$ has what slope?

**Answers.** (1) $m = \dfrac34$, $|AB| = 5$. (2) Sides $6$, $3\sqrt2$, $3\sqrt2$: $18 + 18 = 36$, yes (right angle at $(3, 3)$). (3) $-\dfrac32$.
