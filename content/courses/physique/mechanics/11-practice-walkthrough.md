---
title: Practice Walkthrough
minutes: 12
---

## What you will learn

- how to break a long problem into stages;
- a full worked example that combines kinematics, forces, energy and momentum.

## Method for multi-stage problems

1. **Split the motion into stages** (each with constant forces or a single physical principle).
2. Find a **linking quantity** between stages: usually the speed at the boundary.
3. Choose the right tool for each stage and write one equation per unknown.
4. Check units and limiting cases.

## Worked problem

A $2\ \text{kg}$ block is released from rest at the top of a smooth ramp inclined at $30^\circ$ and of length $4\ \text{m}$. At the bottom it slides onto a horizontal floor with $\mu = 0.2$ for $3\ \text{m}$, then hits and sticks to a stationary $2\ \text{kg}$ block. Take $g = 10$.

**Stage 1 (ramp, no friction).** Height $h = 4\sin30^\circ = 2\ \text{m}$. Energy: $v_1 = \sqrt{2gh} = \sqrt{40} \approx 6.32\ \text{m/s}$. (Check by kinematics: $a = g\sin30^\circ = 5$, $v^2 = 2 \cdot 5 \cdot 4 = 40$ ✓.)

**Stage 2 (rough floor).** Deceleration $a = \mu g = 2\ \text{m/s}^2$ over $3\ \text{m}$: $v_2^2 = 40 - 2 \cdot 2 \cdot 3 = 28$, $v_2 \approx 5.29\ \text{m/s}$. Energy lost to heat: $\mu mg \cdot s = 0.2 \cdot 20 \cdot 3 = 12\ \text{J}$.

**Stage 3 (perfectly inelastic collision).** $2v_2 = 4v_3$, so $v_3 = \dfrac{v_2}2 \approx 2.65\ \text{m/s}$. Kinetic energy before: $\tfrac12 \cdot 2 \cdot 28 = 28\ \text{J}$; after: $\tfrac12 \cdot 4 \cdot 7 = 14\ \text{J}$; so $14\ \text{J}$ is lost in the collision.

**Stage 4 (the combined $4\ \text{kg}$ block slides on the same rough floor until it stops).** Deceleration $2\ \text{m/s}^2$; distance $\dfrac{v_3^2}{2a} = \dfrac7{4} = 1.75\ \text{m}$. Check by energy: $\mu mg\,s = 0.2 \cdot 40 \cdot s = 14\ \text{J} \Rightarrow s = 1.75\ \text{m}$ ✓.

**Total energy account**: initial $mgh = 40\ \text{J}$; friction in stage 2: $12\ \text{J}$; collision loss: $14\ \text{J}$; friction in stage 4: $14\ \text{J}$; total $40\ \text{J}$ ✓.

## Another example: ball and table

A ball rolls off a table of height $0.8\ \text{m}$ at $2\ \text{m/s}$: fall time $t = \sqrt{\dfrac{2 \cdot 0.8}{10}} = 0.4\ \text{s}$, range $0.8\ \text{m}$, landing speed $\sqrt{4 + 16} = 4.5\ \text{m/s}$ at an angle $\arctan\dfrac42 \approx 63^\circ$ below the horizontal.

## Lessons from these problems

- Energy accounting is a powerful check: initial energy = remaining energy + heat.
- Use momentum only for the collision, not for the whole path.
- Each stage uses one principle; the link is a speed.

## Practice problem

A $1\ \text{kg}$ block slides from rest down a smooth $5\ \text{m}$-high slide onto a rough floor ($\mu = 0.5$). How far does it travel on the floor?

**Answer.** $mgh = \mu mg\,s \Rightarrow s = \dfrac h\mu = 10\ \text{m}$.
