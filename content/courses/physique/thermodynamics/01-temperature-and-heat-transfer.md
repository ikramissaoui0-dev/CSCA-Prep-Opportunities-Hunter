---
title: Temperature & Heat Transfer
minutes: 10
---

## What you will learn

- temperature scales and the meaning of heat and thermal equilibrium;
- conduction, convection and radiation;
- the formulas for conduction rate and radiated power.

## 1. Temperature and heat

**Temperature** measures the average random kinetic energy of molecules. **Heat** $Q$ is energy transferred because of a temperature difference, flowing from hot to cold until **thermal equilibrium** (the zeroth law: bodies in equilibrium with a third are in equilibrium with each other).

$$
T(\text{K}) = t(^\circ\text{C}) + 273.15, \qquad \Delta T(\text{K}) = \Delta t(^\circ\text{C}), \qquad t(^\circ\text{C}) = \tfrac59\bigl(t(^\circ\text{F}) - 32\bigr).
$$

In Chinese terms: 热力学温度 $T$ (kelvin) and 摄氏温度 $t$. $68\ ^\circ\text{F} = 20\ ^\circ\text{C} = 293\ \text{K}$. Absolute zero is $0\ \text{K}$, the lowest possible temperature.

## 2. Modes of heat transfer

- **Conduction**: through matter by molecular collisions and free electrons, no bulk motion. Metals are good conductors; air and wool are insulators. Rate:

$$
\frac Qt = \frac{kA\,\Delta T}L \qquad (k \text{ conductivity}, A \text{ area}, L \text{ thickness}).
$$

- **Convection**: by the motion of a fluid (warm air rises, sea breezes).
- **Radiation**: by electromagnetic waves, needing no medium. Power from a body at absolute temperature $T$: $P = \varepsilon\sigma AT^4$ ($\sigma = 5.67 \times 10^{-8}\ \text{W/m}^2\text{K}^4$, emissivity $\varepsilon \le 1$). **Wien's law**: $\lambda_{\max} = \dfrac bT$ ($b = 2.90 \times 10^{-3}\ \text{m K}$): hotter bodies glow bluer. Dark surfaces absorb and emit best; shiny surfaces reflect.

**Example 1.** A window pane with $k = 0.8\ \text{W/m K}$, $A = 1\ \text{m}^2$, $L = 5\ \text{mm}$ and $\Delta T = 20\ \text{K}$: $\dfrac Qt = \dfrac{0.8 \cdot 1 \cdot 20}{0.005} = 3200\ \text{W}$.

**Example 2.** Doubling the absolute temperature multiplies the radiated power by $2^4 = 16$. A body at $600\ \text{K}$ radiates $\dfrac{600^4}{300^4} = 16$ times as much as at $300\ \text{K}$.

**Example 3.** The Sun at $5800\ \text{K}$ peaks near $\dfrac{2.9 \times 10^{-3}}{5800} = 500\ \text{nm}$.

## 3. Everyday applications

A thermos flask minimises all three: a vacuum gap (no conduction/convection) and silvered walls (low radiation). Double glazing traps still air. Layered clothing traps air (insulation). A radiator heats a room mainly by convection.

## Common mistakes

- Mixing Celsius and kelvin in $T^4$ or gas laws.
- Thinking cold flows into a body (heat flows out).
- Confusing temperature with heat.

## Practice problems

1. Convert $68\ ^\circ\text{F}$ to $^\circ\text{C}$ and K.
2. A wall $0.2\ \text{m}$ thick, $k = 0.5$, $A = 10\ \text{m}^2$, $\Delta T = 15\ \text{K}$: heat flow.
3. By what factor does the radiated power change when $T$ goes from $300$ to $450\ \text{K}$?

**Answers.** (1) $20\ ^\circ\text{C}$, $293\ \text{K}$. (2) $375\ \text{W}$. (3) $(1.5)^4 \approx 5.06$.
