---
title: Lines & Distances
minutes: 12
---

## What you will learn

- the forms of the equation of a line and how to choose one;
- parallel/perpendicular lines in general form, and the intersection of two lines;
- the distance from a point to a line and between parallel lines; areas of triangles.

## 1. Forms of a line

| Form | Equation | Use |
|---|---|---|
| Point–slope | $y - y_0 = m(x - x_0)$ | a point and the slope |
| Slope–intercept | $y = mx + b$ | slope and $y$-intercept |
| Two points | $\dfrac{y - y_1}{y_2 - y_1} = \dfrac{x - x_1}{x_2 - x_1}$ | two points |
| Intercept | $\dfrac xa + \dfrac yb = 1$ | intercepts $a, b \ne 0$ |
| General | $Ax + By + C = 0$ | always valid (also vertical lines) |

**Example 1.** Through $(2, 3)$ with slope $4$: $y - 3 = 4(x - 2)$, i.e. $y = 4x - 5$.

**Example 2.** Through $(1, 3)$ and $(3, -1)$: slope $-2$, so $y - 3 = -2(x - 1)$, i.e. $2x + y - 5 = 0$.

**Example 3.** A line with intercepts $3$ and $-2$: $\dfrac x3 - \dfrac y2 = 1$.

## 2. Parallel and perpendicular (general form)

For $\ell_1: A_1x + B_1y + C_1 = 0$ and $\ell_2: A_2x + B_2y + C_2 = 0$:

- **Parallel**: $A_1B_2 = A_2B_1$ (and not identical).
- **Perpendicular**: $A_1A_2 + B_1B_2 = 0$.
- A line parallel to $Ax + By + C = 0$ is $Ax + By + C' = 0$; a perpendicular one is $Bx - Ay + C' = 0$.

**Example 4.** Through $(1, 2)$ parallel to $2x - y + 3 = 0$: $2x - y + c = 0$ with $2 - 2 + c = 0$, so $2x - y = 0$. Perpendicular: $x + 2y + c = 0$ with $1 + 4 + c = 0$: $x + 2y - 5 = 0$.

**Example 5.** $ax + 2y + 1 = 0$ perpendicular to $x - (a - 1)y - 3 = 0$: $a - 2(a - 1) = 0 \Rightarrow a = 2$.

## 3. Intersection and distances

**Intersection**: solve the two equations simultaneously. A line through the intersection of two given lines is found by solving for the point first.

$$
d(P, \ell) = \frac{|Ax_0 + By_0 + C|}{\sqrt{A^2 + B^2}}, \qquad d(\ell_1, \ell_2) = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}
$$

(the second for parallel lines with the *same* $A$, $B$).

**Example 6.** Distance from $(1, 2)$ to $3x + 4y - 5 = 0$: $\dfrac{|3 + 8 - 5|}5 = \dfrac65$.

**Example 7.** Distance between $x + y - 1 = 0$ and $x + y + 3 = 0$: $\dfrac{4}{\sqrt2} = 2\sqrt2$.

**Reflection of a point in a line.** The segment joining $P$ and its image is perpendicular to the line and its midpoint lies on the line: two equations for the image.

## 4. Area of a triangle

$S = \tfrac12|AB|\cdot d(C, AB)$, or with coordinates $S = \tfrac12\bigl|x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\bigr|$.

**Example 8.** Triangle $(0, 0)$, $(4, 0)$, $(0, 3)$: $S = \tfrac12 \cdot 4 \cdot 3 = 6$.

**Family of lines through a fixed point.** $y - 2 = k(x - 1)$ passes through $(1, 2)$ for every $k$.

## Common mistakes

- Using $\dfrac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}$ without making the coefficients of $x$, $y$ equal.
- Forgetting the absolute value in the distance formula.
- Writing the equation of a vertical line as $y = \dots$.

## Practice problems

1. Line through $(2, -1)$ with slope $3$ in general form.
2. Distance from the origin to $3x - 4y + 10 = 0$.
3. Intersection of $x + y = 4$ and $2x - y = 2$.

**Answers.** (1) $3x - y - 7 = 0$. (2) $\dfrac{10}5 = 2$. (3) $x = 2$, $y = 2$.
