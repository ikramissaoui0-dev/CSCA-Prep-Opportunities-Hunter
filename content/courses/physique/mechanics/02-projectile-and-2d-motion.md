---
title: Projectile & 2D Motion
minutes: 10
---

## What you will learn

- the independence of horizontal and vertical motion;
- time of flight, maximum height and range;
- horizontal launches and relative motion (river crossing).

## 1. Independence of the two motions

Neglecting air resistance, the only force is gravity, so the horizontal motion has $a_x = 0$ and the vertical motion $a_y = -g$; the two are independent. For a launch at speed $v_0$ and angle $\theta$:

$$
v_{0x} = v_0\cos\theta, \quad v_{0y} = v_0\sin\theta, \qquad x = v_0\cos\theta\,t, \quad y = v_0\sin\theta\,t - \tfrac12gt^2.
$$

## 2. Launch from the ground

$$
T = \frac{2v_0\sin\theta}g, \qquad H = \frac{v_0^2\sin^2\theta}{2g}, \qquad R = \frac{v_0^2\sin2\theta}g.
$$

The range is maximum at $\theta = 45^\circ$; $\theta$ and $90^\circ - \theta$ give the same range. At the top $v_y = 0$ but $v_x \ne 0$, and the acceleration is still $g$.

**Example 1.** A ball kicked at $25\ \text{m/s}$ at $53^\circ$ ($\sin = 0.8$, $\cos = 0.6$, $g = 10$): $v_x = 15$, $v_y = 20$; $T = 4\ \text{s}$, $H = 20\ \text{m}$, $R = 60\ \text{m}$.

## 3. Horizontal launch from a height

A stone thrown horizontally at $v_0$ from height $h$: $t = \sqrt{\dfrac{2h}g}$, horizontal range $v_0t$, landing velocity components $(v_0, gt)$, angle $\tan\alpha = \dfrac{gt}{v_0}$.

**Example 2.** At $8\ \text{m/s}$ from a $45\ \text{m}$ cliff: $t = 3\ \text{s}$, range $24\ \text{m}$, landing speed $\sqrt{8^2 + 30^2} \approx 31\ \text{m/s}$.

**Example 3.** A ball rolls off a $0.8\ \text{m}$ table at $2\ \text{m/s}$: $t = 0.4\ \text{s}$, lands $0.8\ \text{m}$ from the edge.

## 4. Relative velocity and river crossing

$\vec v_{A/B} = \vec v_A - \vec v_B$. A boat heading due north at $5\ \text{m/s}$ relative to the water, crossing a $100\ \text{m}$ river flowing east at $3\ \text{m/s}$: crossing time $20\ \text{s}$ (the current does not affect it), drift $60\ \text{m}$, ground speed $\sqrt{34} \approx 5.83\ \text{m/s}$. To land directly opposite, aim upstream at $\theta$ with $\sin\theta = \dfrac35$.

## 5. Strategy

Split into components, treat each direction separately, link them by the common time $t$. Use the vertical motion for $t$ and the horizontal for range.

## Common mistakes

- Using $\sin$ for the horizontal component.
- Thinking the horizontal speed changes.
- Using the range formula for a launch from a height.

## Practice problems

1. Maximum height for $v_0 = 30\ \text{m/s}$ at $30^\circ$ ($g = 10$).
2. A ball is thrown horizontally at $10\ \text{m/s}$ from $20\ \text{m}$: range?
3. Range at $45^\circ$ with $v_0 = 20\ \text{m/s}$.

**Answers.** (1) $\dfrac{900 \cdot 0.25}{20} = 11.25\ \text{m}$. (2) $t = 2\ \text{s}$, range $20\ \text{m}$. (3) $\dfrac{400}{10} = 40\ \text{m}$.
