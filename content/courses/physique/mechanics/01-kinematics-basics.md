---
title: Kinematics Basics
minutes: 12
---

## What you will learn

- distance, displacement, speed, velocity, acceleration;
- the equations of uniformly accelerated motion;
- graphs, free fall and chasing problems.

## 1. Basic quantities

- **Displacement** $\Delta x$: change of position (a vector). **Distance**: total path length (a scalar).
- **Average velocity** $\bar v = \dfrac{\Delta x}{\Delta t}$; **average speed** $= \dfrac{\text{distance}}{\Delta t}$.
- **Acceleration** $a = \dfrac{\Delta v}{\Delta t}$ ($\text{m/s}^2$). If $v$ and $a$ have the same sign the object speeds up; opposite signs: it slows down.

Choose a positive direction at the start and keep signs consistent.

## 2. Uniformly accelerated motion

$$
v = v_0 + at, \qquad x = x_0 + v_0t + \tfrac12at^2, \qquad v^2 = v_0^2 + 2a\,\Delta x, \qquad \Delta x = \frac{v_0 + v}2\,t.
$$

Consequences: the average velocity over a time interval equals the velocity at its midpoint; for equal successive intervals $T$, $\Delta x_2 - \Delta x_1 = aT^2$; from rest, distances in successive equal times are in the ratio $1 : 3 : 5 : \dots$

**Example 1.** A car accelerates from rest at $3\ \text{m/s}^2$ for $8\ \text{s}$: $v = 24\ \text{m/s}$, $x = \tfrac12 \cdot 3 \cdot 64 = 96\ \text{m}$.

**Example 2 (braking).** A train at $30\ \text{m/s}$ brakes at $2\ \text{m/s}^2$: it stops after $15\ \text{s}$ and $225\ \text{m}$. After $20\ \text{s}$ the distance is still $225\ \text{m}$ (it has stopped) — **do not substitute $t = 20$** into the formula.

## 3. Graphs

| Graph | Slope | Area under the curve |
|---|---|---|
| $x$–$t$ | velocity | — |
| $v$–$t$ | acceleration | displacement |
| $a$–$t$ | — | change in velocity |

A straight $x$–$t$ line means constant velocity; a parabola, constant acceleration. Where $v$–$t$ crosses zero the direction reverses; the signed area is the displacement, the total area the distance.

## 4. Free fall

Free fall is uniformly accelerated motion with $a = g \approx 9.8\ \text{m/s}^2$ (often $10$), downward, neglecting air resistance. Dropped from height $h$: $t = \sqrt{\dfrac{2h}g}$, $v = \sqrt{2gh}$. Thrown up at $v_0$: maximum height $\dfrac{v_0^2}{2g}$ at $t = \dfrac{v_0}g$, and it returns with the same speed.

**Example 3.** A ball thrown up at $20\ \text{m/s}$ ($g = 10$): maximum height $20\ \text{m}$ at $2\ \text{s}$; back at the start after $4\ \text{s}$. A stone dropped from $45\ \text{m}$: $t = 3\ \text{s}$, $v = 30\ \text{m/s}$.

## 5. Chasing problems

Write each position as a function of time with the same origin and clock, then equate. A car starting from rest with $a = 2\ \text{m/s}^2$ chases a truck at $10\ \text{m/s}$ that is $24\ \text{m}$ ahead: $t^2 = 10t + 24 \Rightarrow t = 12\ \text{s}$. The gap is largest when the speeds are equal ($t = 5\ \text{s}$): $24 + 50 - 25 = 49\ \text{m}$.

## Common mistakes

- Using the equations when the acceleration changes.
- Forgetting that a braking object stops.
- Mixing up distance and displacement.

## Practice problems

1. $v_0 = 5$, $a = 2$, $t = 4$: find $v$ and $x$.
2. A stone dropped from a $20\ \text{m}$ cliff ($g = 10$): time and speed at the bottom.
3. A car at $20\ \text{m/s}$ brakes at $5\ \text{m/s}^2$: stopping distance.

**Answers.** (1) $13\ \text{m/s}$, $36\ \text{m}$. (2) $2\ \text{s}$, $20\ \text{m/s}$. (3) $\dfrac{400}{10} = 40\ \text{m}$.
