---
title: Capacitors
minutes: 12
---

## What you will learn

- capacitance and the stored energy;
- parallel-plate capacitors and dielectrics;
- series/parallel combinations and the two classic cases (connected or isolated).

## 1. Capacitance

A **capacitor** stores charge: it charges when connected to a source and discharges through a circuit. Its capacitance is

$$
C = \frac QU = \frac{\Delta Q}{\Delta U} \quad (\text{farads; it does not depend on } Q \text{ or } U),
$$

and the energy stored is $E = \tfrac12CU^2 = \tfrac12QU = \dfrac{Q^2}{2C}$.

**Parallel-plate capacitor**: $C = \dfrac{\varepsilon_rS}{4\pi kd} = \dfrac{\varepsilon_0\varepsilon_rS}d$, with $E = \dfrac Ud$ between the plates. A **dielectric** ($\varepsilon_r > 1$) between the plates increases $C$ by the factor $\varepsilon_r$.

**Example 1.** A capacitor storing $6 \times 10^{-4}\ \text{C}$ at $12\ \text{V}$: $C = 50\ \mu\text{F}$; at $30\ \text{V}$ it stores $1.5 \times 10^{-3}\ \text{C}$ and $E = \tfrac12 \cdot 50 \times 10^{-6} \cdot 900 = 22.5\ \text{mJ}$.

## 2. Combinations

- **Parallel** (same $U$): $C = C_1 + C_2$; charges add.
- **Series** (same $Q$): $\dfrac1C = \dfrac1{C_1} + \dfrac1{C_2}$; voltages add.

(These are the *reverse* of the rules for resistors.)

**Example 2.** $2\ \mu\text{F}$ and $3\ \mu\text{F}$: parallel $5\ \mu\text{F}$; series $1.2\ \mu\text{F}$.

**Example 3.** A $12\ \text{V}$ battery charges $2\ \mu\text{F}$ and $4\ \mu\text{F}$ in series: $C = \tfrac43\ \mu\text{F}$, $Q = 16\ \mu\text{C}$ on each; voltages $8\ \text{V}$ and $4\ \text{V}$.

## 3. The two classic cases

When a parameter of a parallel-plate capacitor changes, decide first which quantity stays constant:

| | Stays connected to the battery | Disconnected (isolated) |
|---|---|---|
| Constant | $U$ | $Q$ |
| Plates moved apart ($d \to 2d$) | $C$ halves, $Q$ halves, $E$ halves | $C$ halves, $U$ doubles, $E$ unchanged |
| Dielectric inserted | $C \uparrow$, $Q \uparrow$ | $C \uparrow$, $U \downarrow$ |

**Example 4.** An air-filled capacitor charged to $100\ \text{V}$ and disconnected; the plate spacing is doubled: $Q$ is constant, $C \to \tfrac C2$, so $U \to 200\ \text{V}$, and the field $E = \dfrac{4\pi kQ}{\varepsilon_rS}$ is unchanged.

**Example 5 (equilibrium).** Horizontal plates $1\ \text{cm}$ apart with $500\ \text{V}$: $E = 5 \times 10^4\ \text{V/m}$; a droplet with $qE = mg$ floats.

## 4. Charging and discharging

Through a resistor the current is largest at the start and decays to zero as the capacitor fills (the voltage across it rises toward the source voltage). In steady DC a capacitor acts as an open circuit. The area under the $I$–$t$ graph equals the charge.

## Common mistakes

- Using the resistor rule for capacitors.
- Forgetting to decide connected vs isolated.
- Using $E = \tfrac12CU$.

## Practice problems

1. Energy stored in $10\ \mu\text{F}$ at $200\ \text{V}$.
2. $6\ \mu\text{F}$ and $3\ \mu\text{F}$ in series across $9\ \text{V}$: charge.
3. An isolated capacitor with $Q = 2\ \mu\text{C}$ and $C = 1\ \mu\text{F}$ gets a dielectric $\varepsilon_r = 4$: new voltage.

**Answers.** (1) $0.2\ \text{J}$. (2) $C = 2\ \mu\text{F}$, $Q = 18\ \mu\text{C}$. (3) $U = \dfrac2{4} = 0.5\ \text{V}$ (it was $2\ \text{V}$).
