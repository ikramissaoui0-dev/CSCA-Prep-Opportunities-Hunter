---
title: Systems of Inequalities
minutes: 10
---

## What you will learn

- how to solve a system in one variable by intersecting solution sets;
- how to graph a system in two variables;
- the idea behind linear programming (corner points).

## 1. One variable

A **system of inequalities** asks for the values of $x$ that satisfy **all** the inequalities: solve each one separately, then take the **intersection** of the solution sets (not the union).

**Example 1.** $x + 3 > 5$ and $2x - 1 < 9$: $x > 2$ and $x < 5$, so $(2, 5)$.

**Example 2.** $\begin{cases} 2x - 1 > 3 \\ x^2 - 5x + 4 \le 0 \end{cases}$: first gives $x > 2$; second $(x - 1)(x - 4) \le 0 \Rightarrow 1 \le x \le 4$. Intersection $(2, 4]$.

**Example 3 (empty).** $x > 5$ and $x < 2$ have no common solution: $\varnothing$.

**Example 4.** $\begin{cases} |x - 1| \le 3 \\ \dfrac{x}{x - 2} > 0 \end{cases}$: first $-2 \le x \le 4$; second $x < 0$ or $x > 2$. Intersection: $[-2, 0) \cup (2, 4]$.

## 2. Two variables (graphical)

1. Draw the **boundary line** of each inequality: dashed if the inequality is strict ($<$, $>$), solid if it is not.
2. Choose a test point (the origin if it is not on the line) and shade the side that satisfies the inequality.
3. The solution is the **common shaded region**.

**Example 5.** $x + y \le 4$, $x \ge 0$, $y \ge 0$: the triangle with vertices $(0, 0)$, $(4, 0)$, $(0, 4)$, boundary included.

## 3. Linear programming (enrichment)

To maximise or minimise a linear expression such as $P = 2x + 3y$ over a region bounded by lines, the optimum is always at a **corner point** (vertex) of the region. So: find the vertices, evaluate $P$ at each, and compare.

**Example 6.** Maximise $P = 2x + 3y$ subject to $x + y \le 4$, $x \ge 0$, $y \ge 0$. Vertices: $(0, 0) \to 0$; $(4, 0) \to 8$; $(0, 4) \to 12$. The maximum is $12$ at $(0, 4)$.

## Common mistakes

- Taking the union instead of the intersection.
- Forgetting to test all corner points.
- Drawing a solid line for a strict inequality.

## Practice problems

1. Solve $\begin{cases} x - 1 \ge 0 \\ 2x < 8 \end{cases}$.
2. Describe the region $y > x$ and $y < 3$ in the first quadrant ($x \ge 0$).
3. Minimise $C = x + 2y$ with $x + y \ge 3$, $x \ge 0$, $y \ge 0$.

**Answers.** (1) $[1, 4)$. (2) The triangle with vertices $(0, 0)$, $(0, 3)$, $(3, 3)$, with the sides on $y = x$ and $y = 3$ excluded. (3) Vertices $(3, 0) \to 3$ and $(0, 3) \to 6$; minimum $3$.
