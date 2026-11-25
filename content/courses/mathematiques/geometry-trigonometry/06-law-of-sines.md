---
title: Law of Sines
minutes: 10
---

## What you will learn

- the law of sines and the circumradius;
- the ambiguous case (SSA);
- the area formula $\tfrac12ab\sin C$.

## 1. The law

In a triangle $ABC$ with sides $a, b, c$ opposite to angles $A, B, C$ (and $A + B + C = \pi$):

$$
\frac a{\sin A} = \frac b{\sin B} = \frac c{\sin C} = 2R,
$$

where $R$ is the radius of the circumscribed circle. Use it when you know **two angles and a side** (AAS/ASA), or **two sides and an angle opposite one of them** (SSA).

Useful facts: the largest side is opposite the largest angle; $\sin(A + B) = \sin C$ and $\cos(A + B) = -\cos C$. To convert a condition mixing sides and angles, replace $a = 2R\sin A$, etc.

**Example 1.** $A = 30^\circ$, $B = 70^\circ$, $a = 10$: $b = \dfrac{10\sin70^\circ}{\sin30^\circ} \approx 18.79$.

**Example 2.** $a = 5$, $A = 60^\circ$: $2R = \dfrac5{\sin60^\circ} = \dfrac{10}{\sqrt3}$, so $R = \dfrac5{\sqrt3} \approx 2.89$.

## 2. The ambiguous case (SSA)

Given $A$, $a$, $b$: compute $\sin B = \dfrac{b\sin A}a$.

- If $\sin B > 1$: no triangle.
- If $\sin B = 1$: one right triangle.
- Otherwise $B$ may be acute, or obtuse ($\pi - B$). If $a \ge b$, then $B \le A$, so $B$ is acute: **one** triangle. If $a < b$, both values may work: **two** triangles when $A + (\pi - B) < \pi$ (i.e. $A < B$, which holds here).

**Example 3.** $A = 30^\circ$, $a = \sqrt2$, $b = 2$: $\sin B = \dfrac{2 \cdot 0.5}{\sqrt2} = \dfrac{\sqrt2}2$, so $B = 45^\circ$ or $135^\circ$ — both valid since $30^\circ + 135^\circ < 180^\circ$. Two triangles.

**Example 4.** $A = 40^\circ$, $a = 3$, $b = 8$: $\sin B = \dfrac{8 \cdot 0.643}3 = 1.71 > 1$: no triangle.

## 3. Area

$$
S = \tfrac12ab\sin C = \tfrac12bc\sin A = \tfrac12ca\sin B.
$$

**Example 5.** $a = 8$, $b = 5$, $C = 60^\circ$: $S = \tfrac12 \cdot 8 \cdot 5 \cdot \dfrac{\sqrt3}2 = 10\sqrt3 \approx 17.3$.

**Example 6 (isosceles or right?).** If $a\cos A = b\cos B$, then $\sin2A = \sin2B$, so $A = B$ or $A + B = \dfrac\pi2$: the triangle is isosceles or right-angled.

## Common mistakes

- Missing the second solution in the SSA case.
- Using degrees mode / radians incorrectly in a calculator.
- Using the law of sines when the known angle is not opposite a known side.

## Practice problems

1. $A = 45^\circ$, $B = 60^\circ$, $a = 6$. Find $b$.
2. $a = 7$, $A = 30^\circ$: find $R$.
3. Area with $b = 4$, $c = 6$, $A = 30^\circ$.

**Answers.** (1) $b = \dfrac{6\sin60^\circ}{\sin45^\circ} = 3\sqrt6$. (2) $R = 7$. (3) $\tfrac12 \cdot 4 \cdot 6 \cdot \tfrac12 = 6$.
