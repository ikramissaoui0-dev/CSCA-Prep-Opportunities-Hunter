---
title: Kirchhoff's Rules
minutes: 12
---

## What you will learn

- the junction and loop rules;
- how to apply them step by step to multi-loop circuits;
- internal resistance experiments and dynamic circuits.

## 1. The two rules

1. **Junction rule** (charge conservation): the sum of currents entering a junction equals the sum leaving: $\sum I_{\text{in}} = \sum I_{\text{out}}$.
2. **Loop rule** (energy conservation): the algebraic sum of potential changes around any closed loop is zero: $\sum\Delta U = 0$.

## 2. Method

1. Assign a current direction to each branch (a wrong guess just gives a negative result).
2. Write the junction equation(s).
3. Choose a direction around each loop and write the loop equation: going through a resistor **along** the current is a drop ($-IR$), **against** it a rise ($+IR$); through a battery from $-$ to $+$ is a rise ($+\varepsilon$).
4. Solve the system; check the number of equations equals the number of unknowns.

**Example 1.** One loop: $\varepsilon = 10\ \text{V}$, $r = 1\ \Omega$ and $R = 4\ \Omega$: $\varepsilon - Ir - IR = 0 \Rightarrow I = 2\ \text{A}$; terminal voltage $U = 8\ \text{V}$.

**Example 2 (two batteries in series opposition).** $\varepsilon_1 = 12\ \text{V}$, $\varepsilon_2 = 6\ \text{V}$, total resistance $3\ \Omega$: $I = \dfrac{12 - 6}3 = 2\ \text{A}$.

**Example 3 (two loops).** Batteries $\varepsilon_1 = 6\ \text{V}$ and $\varepsilon_2 = 12\ \text{V}$ with $R_1 = 2\ \Omega$, $R_2 = 4\ \Omega$ in separate branches and a shared $R_3 = 3\ \Omega$: with unknown currents $I_1$, $I_2$ in the outer branches and $I_3 = I_1 + I_2$ in the shared one, the loop equations are $6 - 2I_1 - 3(I_1 + I_2) = 0$ and $12 - 4I_2 - 3(I_1 + I_2) = 0$. Simplifying: $5I_1 + 3I_2 = 6$ and $3I_1 + 7I_2 = 12$. Eliminating $I_2$ (multiply the first by $7$, the second by $3$ and subtract): $26I_1 = 6$, so $I_1 = 0.23\ \text{A}$; then $I_2 = \dfrac{12 - 3(0.23)}{7} = 1.62\ \text{A}$ and the shared branch carries $I_3 = 1.85\ \text{A}$.

## 3. Source with internal resistance

$\varepsilon = U + Ir$, $I = \dfrac\varepsilon{R + r}$.

**Measuring $\varepsilon$ and $r$.** From two readings: $\varepsilon = I_1(R_1 + r) = I_2(R_2 + r)$. If a source gives $2\ \text{A}$ with $2\ \Omega$ and $1\ \text{A}$ with $5\ \Omega$: $2(2 + r) = 1(5 + r) \Rightarrow r = 1\ \Omega$, $\varepsilon = 6\ \text{V}$. On a $U$–$I$ graph, the intercept is $\varepsilon$ and the slope magnitude is $r$.

**Example 4 (series–parallel).** $\varepsilon = 18\ \text{V}$, $r = 1\ \Omega$ drives $R_1 = 3\ \Omega$ in series with a parallel pair $R_2 = 6\ \Omega$ and $R_3 = 3\ \Omega$: pair $2\ \Omega$; $R_{\text{total}} = 6\ \Omega$ including $r$; $I = 3\ \text{A}$; terminal voltage $15\ \text{V}$; pair voltage $6\ \text{V}$, so $1\ \text{A}$ through $R_2$ and $2\ \text{A}$ through $R_3$.

## 4. Dynamic circuits

When one resistance changes (a slider moves) reason in order: total resistance $\to$ total current $I = \dfrac\varepsilon{R + r}$ $\to$ terminal voltage $U = \varepsilon - Ir$ $\to$ the branch currents/voltages. A capacitor in a DC steady state carries no current: remove it for the current analysis and give it the voltage of the branch it is in parallel with.

## Common mistakes

- Sign errors in the loop rule.
- Writing more or fewer equations than unknowns.
- Forgetting that a capacitor blocks DC.

## Practice problems

1. A battery with $\varepsilon = 10\ \text{V}$, $r = 1\ \Omega$ drives $4\ \Omega$: $I$ and terminal voltage.
2. A source gives $2\ \text{A}$ through $2\ \Omega$ and $1\ \text{A}$ through $5\ \Omega$: $r$.

**Answers.** (1) $2\ \text{A}$, $8\ \text{V}$. (2) $r = 1\ \Omega$ (and $\varepsilon = 6\ \text{V}$).
