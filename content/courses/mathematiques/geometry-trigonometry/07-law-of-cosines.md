---
title: Law of Cosines
minutes: 10
---

## What you will learn

- the law of cosines for SAS and SSS;
- how to classify a triangle (acute, right, obtuse);
- how to choose between the two laws, and bearings.

## 1. The law

$$
a^2 = b^2 + c^2 - 2bc\cos A, \qquad \cos A = \frac{b^2 + c^2 - a^2}{2bc},
$$

and similarly for the other sides. The side on the left is **opposite** the angle in the cosine. When $A = 90^\circ$ it reduces to Pythagoras.

Use it for **SAS** (two sides and the included angle — find the third side) and **SSS** (three sides — find an angle).

**Example 1.** $a = 6$, $b = 10$, $C = 60^\circ$: $c^2 = 36 + 100 - 120 \cdot \tfrac12 = 76$, so $c = 2\sqrt{19} \approx 8.72$.

**Example 2.** $a = 7$, $b = 5$, $c = 8$: $\cos A = \dfrac{25 + 64 - 49}{80} = \dfrac12$, so $A = 60^\circ$.

**Example 3.** $a = 3$, $b = 5$, $C = 120^\circ$: $c^2 = 9 + 25 + 15 = 49$, $c = 7$.

## 2. Type of triangle

Angle $A$ is acute, right or obtuse according to whether $a^2 <$, $=$, $> b^2 + c^2$. For the *largest* side this tells you the type of the triangle.

**Example 4.** Sides $4, 5, 6$: $6^2 = 36 < 16 + 25 = 41$: acute. Sides $2, 3, 4$: $16 > 4 + 9$: obtuse.

## 3. Choosing the right law

| Given | Use |
|---|---|
| side + its opposite angle + one more angle or side | law of sines |
| two sides and the included angle (SAS) | law of cosines |
| three sides (SSS) | law of cosines (angle), then sines |
| right triangle | SOH-CAH-TOA |

## 4. Bearings

A **bearing** is measured clockwise from north, with three digits ($045^\circ$ is north-east). The **back bearing** is the bearing $\pm 180^\circ$.

**Example 5.** A ship sails $6\ \text{km}$ on bearing $040^\circ$, then $10\ \text{km}$ on bearing $100^\circ$. The angle at the turn between the two legs is $180^\circ - (100^\circ - 40^\circ) = 120^\circ$, so the distance from the start is $\sqrt{36 + 100 - 2 \cdot 6 \cdot 10\cos120^\circ} = \sqrt{196} = 14\ \text{km}$.

## 5. Mixed problems

**Example 6.** In $\triangle ABC$, $b = 2$, $c = 3$, $A = 60^\circ$: $a^2 = 4 + 9 - 6 = 7$; area $= \tfrac12 \cdot 2 \cdot 3 \cdot \dfrac{\sqrt3}2 = \dfrac{3\sqrt3}2$.

**Example 7 (median).** The median length from $A$: $m_a^2 = \dfrac{2b^2 + 2c^2 - a^2}4$.

## Common mistakes

- Using the wrong angle (must be opposite the side on the left).
- Using the law of sines for SSS or SAS.
- Dropping the sign of $\cos$ for obtuse angles.

## Practice problems

1. $a = 5$, $b = 8$, $C = 60^\circ$. Find $c$.
2. $a = 3$, $b = 4$, $c = 6$. Find $\cos C$ and the type of triangle.
3. Angle between two tracks of $8\ \text{km}$ and $5\ \text{km}$ is $60^\circ$; distance between the ends?

**Answers.** (1) $c^2 = 25 + 64 - 40 = 49$, $c = 7$. (2) $\cos C = \dfrac{9 + 16 - 36}{24} = -\dfrac{11}{24}$: obtuse. (3) $7\ \text{km}$.
