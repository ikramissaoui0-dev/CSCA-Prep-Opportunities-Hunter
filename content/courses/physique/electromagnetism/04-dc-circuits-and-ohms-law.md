---
title: DC Circuits & Ohm's Law
minutes: 12
---

## What you will learn

- current, voltage, resistance and Ohm's law;
- series and parallel circuits, power and energy;
- internal resistance, maximum power and non-ohmic devices.

## 1. Basic quantities

- **Current** $I = \dfrac{\Delta q}{\Delta t}$ (A), conventionally the direction of positive charge flow.
- **Ohm's law**: $U = IR$ for an ohmic conductor.
- **Resistance** of a wire: $R = \dfrac{\rho L}A$ (rises with length and falls with cross-section); metals' resistance increases with temperature.
- **Power**: $P = UI = I^2R = \dfrac{U^2}R$; energy $E = Pt$ ($1\ \text{kWh} = 3.6 \times 10^6\ \text{J}$).

## 2. Series and parallel

| | Series | Parallel |
|---|---|---|
| Current | same | splits: $I = I_1 + I_2$ |
| Voltage | splits: $U = U_1 + U_2$ | same |
| Resistance | $R = R_1 + R_2$ | $\dfrac1R = \dfrac1{R_1} + \dfrac1{R_2}$ |
| Power | largest $R$ dissipates most | smallest $R$ dissipates most |

For two resistors in parallel $R = \dfrac{R_1R_2}{R_1 + R_2}$, always smaller than the smaller. Voltage divider (series): $U_1 = U\dfrac{R_1}{R_1 + R_2}$; current divider (parallel): $I_1 = I\dfrac{R_2}{R_1 + R_2}$.

**Example 1.** $12\ \text{V}$ across $4\ \Omega$: $I = 3\ \text{A}$, $P = 36\ \text{W}$.

**Example 2.** $6\ \Omega \parallel 3\ \Omega = 2\ \Omega$; with a $4\ \Omega$ in series: $6\ \Omega$; across $12\ \text{V}$: $I = 2\ \text{A}$.

**Example 3 (bulbs).** A $60\ \text{W}$ and a $100\ \text{W}$ bulb (both $220\ \text{V}$) in series: the $60\ \text{W}$ bulb has the larger resistance ($R = U^2/P$), the same current, so $I^2R$ is larger: it is brighter. In parallel the $100\ \text{W}$ bulb is brighter.

**Example 4.** A $220\ \text{V}$, $1100\ \text{W}$ heater: $I = 5\ \text{A}$, $R = 44\ \Omega$; at $110\ \text{V}$ it gives $\dfrac{110^2}{44} = 275\ \text{W}$.

## 3. Real sources

An EMF $\varepsilon$ with internal resistance $r$:

$$
I = \frac\varepsilon{R + r}, \qquad U_{\text{terminal}} = \varepsilon - Ir.
$$

Open circuit: $U = \varepsilon$; short circuit: $I = \dfrac\varepsilon r$. The output power $I^2R$ is maximal when $R = r$, and then the efficiency is only $\dfrac R{R + r} = 50\%$.

**Example 5.** $\varepsilon = 9\ \text{V}$, $r = 1\ \Omega$, $R = 8\ \Omega$: $I = 1\ \text{A}$, $U = 8\ \text{V}$, $P = 8\ \text{W}$.

**Example 6.** $\varepsilon = 12\ \text{V}$, $r = 2\ \Omega$ with a $4\ \Omega$ load: $I = 2\ \text{A}$, $U = 8\ \text{V}$.

## 4. Non-ohmic devices and meters

A **motor** is not a resistor: only $I^2R_{\text{coil}}$ is heat, the rest is mechanical, so $UI > I^2R$. Lamp filaments and diodes have curved $I$–$U$ graphs. **Ammeters** are in series (ideal: zero resistance); **voltmeters** in parallel (ideal: infinite resistance). A shunt resistor extends an ammeter; a series resistor makes a voltmeter.

## Common mistakes

- Using $P = I^2R$ for the whole circuit when the question asks about one component.
- Forgetting the internal resistance.
- Treating a motor as ohmic.

## Practice problems

1. $6\ \Omega$ and $12\ \Omega$ in parallel: resistance.
2. Power in $R = 4\ \Omega$ driven by $\varepsilon = 9\ \text{V}$, $r = 0.5\ \Omega$.
3. $I$ and the energy used by a $2\ \text{kW}$ heater on $220\ \text{V}$ in $3\ \text{h}$.

**Answers.** (1) $4\ \Omega$. (2) $I = 2\ \text{A}$, $P = 16\ \text{W}$. (3) $9.1\ \text{A}$; $6\ \text{kWh}$.
