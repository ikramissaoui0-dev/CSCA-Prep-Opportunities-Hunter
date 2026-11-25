---
title: First Law of Thermodynamics
minutes: 12
---

## What you will learn

- $\Delta U = Q + W$ and the sign conventions;
- the first law for the four gas processes;
- internal energy and molar heat capacities.

## 1. The law

Energy is conserved. The change of internal energy equals the heat added plus the work done **on** the system:

$$
\Delta U = Q + W_{\text{on}} \qquad \text{or equivalently} \qquad \Delta U = Q - W_{\text{by}}.
$$

Check which convention a problem uses. Here: $Q > 0$ heat absorbed by the gas; $W_{\text{by}} > 0$ the gas expands (does work). In a vacuum (free expansion) $W = 0$.

**Example 1.** A gas absorbs $500\ \text{J}$ while doing $200\ \text{J}$ of work: $\Delta U = 300\ \text{J}$. If $350\ \text{J}$ of work is done on it adiabatically: $\Delta U = +350\ \text{J}$.

## 2. Internal energy and heat capacities

For an ideal gas $U$ depends only on $T$: $U = \dfrac f2nRT$ with $f = 3$ (monatomic), $5$ (diatomic at ordinary temperatures), $6$ (polyatomic). So

$$
\Delta U = nC_V\Delta T, \qquad C_V = \frac f2R, \qquad C_p = C_V + R, \qquad \gamma = \frac{C_p}{C_V}.
$$

**Example 2.** $2\ \text{mol}$ of monatomic gas heated from $300$ to $500\ \text{K}$ at constant volume: $Q = \Delta U = \tfrac32 \cdot 2 \cdot 8.31 \cdot 200 = 4.99\ \text{kJ}$.

## 3. The four processes

| Process | $\Delta U$ | Work by gas | Heat |
|---|---|---|---|
| Isothermal | $0$ | $W = nRT\ln\dfrac{V_2}{V_1}$ | $Q = W$ |
| Isochoric | $nC_V\Delta T$ | $0$ | $Q = \Delta U$ |
| Isobaric | $nC_V\Delta T$ | $p\Delta V$ | $nC_p\Delta T$ |
| Adiabatic | $nC_V\Delta T$ | $-\Delta U$ | $0$ |

**Adiabatic**: no heat exchange (insulated, or too fast for heat to flow). A quick *compression* heats the gas ($W_{\text{on}} > 0$, $\Delta U > 0$): diesel ignition, a bicycle pump. A quick *expansion* cools it ($pV^\gamma = $ const). **Free expansion** into a vacuum: $Q = W = \Delta U = 0$.

**Example 3.** A monatomic gas at constant pressure absorbs $500\ \text{J}$: $Q = nC_p\Delta T$ and $\Delta U = \dfrac35Q = 300\ \text{J}$, $W = 200\ \text{J}$.

**Example 4.** An ideal gas in an insulated cylinder is quickly compressed: $Q = 0$, $W_{\text{on}} > 0$, so $\Delta U > 0$ and the temperature rises.

## 4. Cycles

For a complete cycle $\Delta U = 0$, so $W_{\text{net}} = Q_{\text{net}}$; the net work equals the area of the loop on the $p$–$V$ diagram.

## Common mistakes

- Mixing the sign conventions for $W$.
- Saying $\Delta U = 0$ for an adiabatic process (it is $Q = 0$).
- Using $C_V$ with an isobaric $Q$.

## Practice problems

1. A gas receives $800\ \text{J}$ of heat while $300\ \text{J}$ of work is done on it: $\Delta U$.
2. $1\ \text{mol}$ of a diatomic gas is heated $50\ \text{K}$ at constant volume: heat needed.
3. For an isothermal expansion absorbing $400\ \text{J}$: work done by the gas.

**Answers.** (1) $1100\ \text{J}$. (2) $\tfrac52 \cdot 8.31 \cdot 50 = 1039\ \text{J}$. (3) $400\ \text{J}$.
