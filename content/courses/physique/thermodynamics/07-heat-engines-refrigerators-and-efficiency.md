---
title: Heat Engines, Refrigerators & Efficiency
minutes: 12
---

## What you will learn

- efficiency of heat engines and the Carnot limit;
- refrigerators and heat pumps (coefficient of performance);
- real cycles: Otto and Diesel.

## 1. Heat engines

A heat engine takes heat $Q_H$ from a hot reservoir, converts part into work $W$, and rejects $Q_C$ to a cold reservoir:

$$
W = Q_H - Q_C, \qquad \eta = \frac W{Q_H} = 1 - \frac{Q_C}{Q_H} < 1.
$$

**Carnot engine** (reversible: two isotherms and two adiabats) has the maximum possible efficiency between $T_H$ and $T_C$ (in kelvin):

$$
\eta_{\text{Carnot}} = 1 - \frac{T_C}{T_H}.
$$

No real engine can exceed it. Raising $T_H$ or lowering $T_C$ improves efficiency.

**Example 1.** Between $600\ \text{K}$ and $300\ \text{K}$: $\eta_{\max} = 0.5$. An engine taking in $2000\ \text{J}$ and rejecting $1200\ \text{J}$ has $W = 800\ \text{J}$, $\eta = 0.4 < 0.5$: allowed.

**Example 2.** A Carnot engine between $800\ \text{K}$ and $200\ \text{K}$ absorbs $5000\ \text{J}$: $\eta = 0.75$, $W = 3750\ \text{J}$, $Q_C = 1250\ \text{J}$.

**Example 3 (a claim to test).** An inventor claims an engine with $\eta = 0.6$ between $500\ \text{K}$ and $300\ \text{K}$: Carnot limit $0.4$, so the claim is impossible.

## 2. Refrigerators and heat pumps

They run the cycle backwards, using work to move heat from cold to hot:

$$
\text{COP}_{\text{fridge}} = \frac{Q_C}W, \qquad \text{COP}_{\text{pump}} = \frac{Q_H}W = \text{COP}_{\text{fridge}} + 1,
$$

and for Carnot devices $\text{COP}_{\text{fridge}} = \dfrac{T_C}{T_H - T_C}$, $\text{COP}_{\text{pump}} = \dfrac{T_H}{T_H - T_C}$.

**Example 4.** A refrigerator with $\text{COP} = 4$ removes $800\ \text{J}$ from the interior: $W = 200\ \text{J}$ and $1000\ \text{J}$ is rejected to the room.

## 3. Real cycles

- **Otto cycle** (petrol engine): adiabatic compression, isochoric heating (spark), adiabatic expansion, isochoric cooling; $\eta = 1 - \dfrac1{r^{\gamma - 1}}$ with compression ratio $r$.
- **Diesel cycle**: heat added at constant pressure; higher compression ratio.
- Both have efficiencies below the Carnot value between the same extreme temperatures.
- Steam turbines, refrigerators and air conditioners follow Rankine/vapour-compression cycles.

## Common mistakes

- Using $^\circ\text{C}$ in the Carnot formula.
- Forgetting that $W = Q_H - Q_C$ is for a complete cycle.
- Assuming a refrigerator violates the second law.

## Practice problems

1. Carnot efficiency between $400\ \text{K}$ and $300\ \text{K}$.
2. An engine absorbs $1000\ \text{J}$ and does $300\ \text{J}$ of work: $\eta$ and $Q_C$.
3. COP of a Carnot refrigerator between $270\ \text{K}$ and $300\ \text{K}$.

**Answers.** (1) $25\%$. (2) $30\%$, $700\ \text{J}$. (3) $\dfrac{270}{30} = 9$.
