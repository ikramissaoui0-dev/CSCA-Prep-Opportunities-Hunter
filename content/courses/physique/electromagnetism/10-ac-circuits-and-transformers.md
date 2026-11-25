---
title: AC Circuits & Transformers
minutes: 12
---

## What you will learn

- the sinusoidal AC and its rms values;
- reactance of capacitors and inductors;
- transformers and power transmission.

## 1. Alternating current

A coil rotating in a uniform field produces a sinusoidal EMF:

$$
e = E_m\sin\omega t, \qquad E_m = NBA\omega, \qquad \omega = 2\pi f.
$$

The **effective (rms)** values describe the heating effect and are what meters read:

$$
U_{\text{rms}} = \frac{U_0}{\sqrt2}, \qquad I_{\text{rms}} = \frac{I_0}{\sqrt2}, \qquad P = U_{\text{rms}}I_{\text{rms}} = \frac{U_0I_0}2 \ (\text{resistor}).
$$

China's mains: $220\ \text{V}$ rms, $50\ \text{Hz}$ (peak $311\ \text{V}$, period $0.02\ \text{s}$).

**Example 1.** $U_0 = 340\ \text{V}$: $U_{\text{rms}} = 240\ \text{V}$; across a $48\ \Omega$ resistor $I_{\text{rms}} = 5\ \text{A}$ and $P = 1200\ \text{W}$.

**Example 2.** An AC source with $U_0 = 311\ \text{V}$ across a $44\ \Omega$ heater: $I_{\text{rms}} = 5\ \text{A}$, $P = 1100\ \text{W}$.

## 2. Reactance

- A **capacitor** passes AC but blocks DC: $X_C = \dfrac1{\omega C}$ (lower at high frequency).
- An **inductor** opposes changes in current: $X_L = \omega L$ (zero for DC, large at high frequency).
- Phase: **CIVIL** — in a capacitor the current leads the voltage; in an inductor the voltage leads the current; in a resistor they are in phase.

Applications: a capacitor in series blocks DC but passes AC signals; an inductor (choke) blocks high frequencies; combined in filters and radios.

## 3. Transformers

An ideal transformer (primary $N_1$, secondary $N_2$) works only with AC:

$$
\frac{U_1}{U_2} = \frac{N_1}{N_2}, \qquad U_1I_1 = U_2I_2, \qquad \frac{I_1}{I_2} = \frac{N_2}{N_1}.
$$

A step-up transformer raises the voltage and lowers the current; it **never raises the power**.

**Example 3.** A $100 : 500$ step-up transformer with $20\ \text{V}$ in: $U_2 = 100\ \text{V}$; a $50\ \text{W}$ load draws $0.5\ \text{A}$ from the secondary and $2.5\ \text{A}$ from the primary.

**Example 4.** A $1000 : 100$ step-down with $2200\ \text{V}$ in: $220\ \text{V}$ out; a $5\ \text{A}$ load needs $0.5\ \text{A}$ at the primary.

## 4. Power transmission

For power $P$ sent along a line of resistance $R_{\text{line}}$, the current is $I = \dfrac PU$ and the loss $I^2R_{\text{line}} = \dfrac{P^2R_{\text{line}}}{U^2}$. Raising the transmission voltage by a factor $k$ cuts the loss by $k^2$, hence high-voltage lines.

**Example 5.** A station outputs $10\ \text{MW}$ through lines of resistance $5\ \Omega$. At $10\ \text{kV}$: $I = 1000\ \text{A}$, loss $5\ \text{MW}$ ($50\%$). At $100\ \text{kV}$: $I = 100\ \text{A}$, loss $50\ \text{kW}$ ($0.5\%$).

## Common mistakes

- Using peak values for power.
- Using a transformer with DC.
- Believing a step-up transformer increases power.

## Practice problems

1. $U_0 = 311\ \text{V}$: $U_{\text{rms}}$.
2. A $50 : 1000$ transformer, $10\ \text{V}$ input: output.
3. Loss in a line of $2\ \Omega$ carrying $50\ \text{A}$.

**Answers.** (1) $220\ \text{V}$. (2) $200\ \text{V}$. (3) $5\ \text{kW}$.
