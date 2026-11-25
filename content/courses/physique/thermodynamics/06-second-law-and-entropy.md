---
title: Second Law & Entropy
minutes: 10
---

## What you will learn

- the Clausius and Kelvin–Planck statements;
- entropy and how to compute entropy changes;
- reversible and irreversible processes.

## 1. Statements of the second law

- **Clausius**: heat does not flow spontaneously from a colder to a hotter body.
- **Kelvin–Planck**: no cyclic engine can convert heat from a single reservoir entirely into work.
- **Entropy form**: the entropy of an isolated system never decreases: $\Delta S_{\text{universe}} \ge 0$, with equality only for reversible processes.

The second law gives the arrow of time: heat flow, free expansion, mixing, friction are **irreversible**. No heat engine can have $100\%$ efficiency, and a refrigerator needs work.

## 2. Entropy

Entropy $S$ measures disorder (the number of microscopic arrangements). For heat $Q$ exchanged reversibly at temperature $T$: $\Delta S = \dfrac QT$.

- Heat $Q$ flowing from a reservoir at $T_h$ to one at $T_c$: $\Delta S = \dfrac Q{T_c} - \dfrac Q{T_h} > 0$.
- Heating a mass $m$ from $T_1$ to $T_2$: $\Delta S = mc\ln\dfrac{T_2}{T_1}$.
- Phase change: $\Delta S = \dfrac{mL}T$.
- Ideal gas, isothermal: $\Delta S = nR\ln\dfrac{V_2}{V_1}$.

**Example 1.** $1000\ \text{J}$ flows from $500\ \text{K}$ to $300\ \text{K}$: $\Delta S = \dfrac{1000}{300} - \dfrac{1000}{500} = +1.33\ \text{J/K}$.

**Example 2 (free expansion).** $2\ \text{mol}$ of ideal gas expands into a vacuum from $5$ to $15\ \text{L}$: $Q = 0$, but $\Delta S = 2 \cdot 8.31 \cdot \ln3 \approx 18.3\ \text{J/K} > 0$ (entropy is a state function; use a reversible path to compute it).

**Example 3.** Melting $100\ \text{g}$ of ice at $0\ ^\circ\text{C}$: $\Delta S = \dfrac{0.1 \cdot 334\,000}{273} \approx 122\ \text{J/K}$.

## 3. Reversible and irreversible

A **reversible** process passes through equilibrium states and could be undone without trace; real processes (friction, heat flow across a finite temperature difference, mixing) are irreversible and generate entropy.

**The third law**: absolute zero cannot be reached in a finite number of steps.

## 4. Exam checks

When asked whether a process is allowed, test $\Delta S_{\text{total}} \ge 0$ and the Clausius/Kelvin–Planck statements. A device that takes heat from a cold body to a hot body with no work violates the second law.

## Common mistakes

- Thinking entropy of a system cannot decrease (only the isolated total cannot).
- Using $^\circ\text{C}$ in $\Delta S = Q/T$.
- Believing a refrigerator violates the second law (it uses work).

## Practice problems

1. $2000\ \text{J}$ flows from $400\ \text{K}$ to $300\ \text{K}$: $\Delta S$.
2. Is it possible for $500\ \text{J}$ to flow spontaneously from $300\ \text{K}$ to $400\ \text{K}$?

**Answers.** (1) $\dfrac{2000}{300} - \dfrac{2000}{400} = 1.67\ \text{J/K}$. (2) No: $\Delta S = \dfrac{500}{400} - \dfrac{500}{300} < 0$.
