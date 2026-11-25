---
title: Transformations of Functions
minutes: 10
---

## What you will learn

- the effect of shifts, stretches and reflections on a graph;
- the correct order of transformations;
- how to track a point and describe a transformation in words.

## 1. The basic transformations

Starting from the graph of $y = f(x)$, with constants $h, k, a, b$:

| New function | Effect on the graph |
|---|---|
| $f(x) + k$ | shift **up** by $k$ (down if $k < 0$) |
| $f(x - h)$ | shift **right** by $h$ (left if $h < 0$) |
| $-f(x)$ | reflect in the $x$-axis |
| $f(-x)$ | reflect in the $y$-axis |
| $a\,f(x)$, $a > 0$ | vertical stretch by factor $a$ ($a < 1$ compresses) |
| $f(bx)$, $b > 0$ | horizontal compression by factor $b$ (stretch by $\tfrac1b$) |
| $\lvert f(x)\rvert$ | reflect the parts below the $x$-axis upward |
| $f(\lvert x\rvert)$ | keep the right half, mirror it onto the left |

**Key idea**: operations on $y$ (outside $f$) act "as expected"; operations on $x$ (inside $f$) act in the **opposite** way: $f(x - 3)$ moves right, $f(2x)$ squeezes.

## 2. Order of transformations

For $y = a\,f\bigl(b(x - h)\bigr) + k$: first the horizontal operations — compress by $b$, then shift right by $h$ — and then the vertical ones — stretch by $a$, then shift up by $k$. Factor the inside so that $x$ has coefficient $1$ after the stretch: $f(2x - 6) = f\bigl(2(x - 3)\bigr)$ is a compression by $2$ followed by a shift right by $3$.

**Example 1.** Describe $y = 2(x - 3)^2 + 1$ from $y = x^2$: shift right 3, stretch vertically by 2, shift up 1; vertex $(3, 1)$.

**Example 2.** $y = -2(x + 1)^2 + 3$: shift left 1, stretch by 2, reflect in the $x$-axis, shift up 3; vertex $(-1, 3)$, opens downward.

**Example 3.** For $f(x) = \sqrt x$: the graph shifted left 4 and reflected in the $x$-axis is $y = -\sqrt{x + 4}$.

**Example 4 (tracking a point).** $(2, 5)$ is on $y = f(x)$. Then $y = f(x - 1) + 3$ passes through $(3, 8)$; $y = f(-x)$ through $(-2, 5)$; $y = 2f(x)$ through $(2, 10)$; $y = f(2x)$ through $(1, 5)$.

**Example 5 (vertex of a parabola).** $y = x^2 - 4x + 7 = (x - 2)^2 + 3$ is $y = x^2$ shifted right 2 and up 3.

## 3. Symmetry from transformations

The graph of $y = f(x)$ and of $y = f(2a - x)$ are symmetric about the line $x = a$. If $f(a + x) = f(a - x)$ for all $x$, the graph is symmetric about $x = a$. Likewise $f(a + x) + f(a - x) = 2b$ shows symmetry about the point $(a, b)$.

## Common mistakes

- Reading $f(x - h)$ as a shift to the *left*.
- Applying transformations in the wrong order.
- Forgetting that $f(bx)$ scales $x$-coordinates by $1/b$, not by $b$.

## Practice problems

1. How is $y = \sqrt{x - 2} + 1$ obtained from $y = \sqrt x$?
2. The graph of $f$ has a maximum at $(1, 4)$. Where is the maximum of $y = 3f(x + 2) - 1$?
3. What is the effect of $y = f(3x)$ on a point $(6, 2)$ of $y = f(x)$?

**Answers.** (1) right 2, up 1. (2) $(-1, 11)$. (3) it moves to $(2, 2)$.
