---
title: Half-Life & Decay Curves
minutes: 10
---

## What you will learn

- the half-life and the exponential decay law;
- decay curves, activity and background;
- radiocarbon dating and other applications.

## 1. Half-life

Radioactive decay is **random**: for a single nucleus we cannot say when it will decay, but for a large number the behaviour is statistical. The **half-life** $T_{1/2}$ is the time for half of the nuclei (or half the activity) to decay:

$$
N = N_0\left(\tfrac12\right)^{t/T_{1/2}}, \qquad m = m_0\left(\tfrac12\right)^{t/T_{1/2}}, \qquad A = A_0\left(\tfrac12\right)^{t/T_{1/2}}.
$$

After $n$ half-lives the fraction left is $\dfrac1{2^n}$. The activity $A = \lambda N$ is measured in becquerels (decays per second); $T_{1/2} = \dfrac{\ln2}\lambda$.

**Example 1.** Iodine-131 ($T_{1/2} = 8$ days): after $24$ days, $\left(\tfrac12\right)^3 = \tfrac18$ remains; from $32\ \text{mg}$, $4\ \text{mg}$ remain.

**Example 2.** A sample with $T_{1/2} = 6\ \text{h}$ and initial activity $800\ \text{Bq}$: after $24\ \text{h}$ ($4$ half-lives) it is $50\ \text{Bq}$.

**Example 3.** A sample's activity falls to $\tfrac1{16}$ of its initial value in $20$ days: $4$ half-lives, so $T_{1/2} = 5$ days.

## 2. Decay curves

A graph of $N$ (or count rate) against time is an **exponential decay curve**: the time for the value to drop from $400$ to $200$ counts per second is the half-life (read it from any starting point; the next halving takes the same time). Always **subtract the background count rate** before using the curve.

**Example 4.** A count rate falls from $400$ to $200$ in $2\ \text{h}$: $T_{1/2} = 2\ \text{h}$; the rate after $6\ \text{h}$ is $50$.

## 3. Radiocarbon dating

Living organisms contain a constant fraction of ${}^{14}\text{C}$ (from the atmosphere); after death it decays with $T_{1/2} = 5730$ years. A sample with $25\%$ of the original ${}^{14}\text{C}$ is $2 \times 5730 = 11\,460$ years old; wood with $\tfrac18$ of the living level is $3 \times 5730 = 17\,190$ years old.

**Other uses.** Medical tracers (short half-lives so patients are not exposed long: ${}^{99m}\text{Tc}$, $6\ \text{h}$), radiotherapy (${}^{60}\text{Co}$), thickness gauges, smoke detectors, dating of rocks (uranium–lead). **Waste**: long half-lives mean long storage times.

## 4. Unequal times

For times that are not whole numbers of half-lives, use the formula: after $10$ days with $T_{1/2} = 4$ days, the fraction is $2^{-2.5} \approx 0.177$.

## Common mistakes

- Treating half-life as "half the time to disappear".
- Applying the half-life to a single nucleus.
- Forgetting to subtract the background.

## Practice problems

1. A $64\ \text{g}$ sample with $T_{1/2} = 3$ days: mass after $12$ days.
2. A rock has $\tfrac1{16}$ of the original ${}^{14}\text{C}$: age.

**Answers.** (1) $64/16 = 4\ \text{g}$. (2) $4 \cdot 5730 = 22\,920$ years.
