---
title: The Photoelectric Effect
minutes: 12
---

## What you will learn

- the experimental facts and why wave theory fails;
- Einstein's equation, threshold frequency and stopping voltage;
- graph reading and typical questions.

## 1. The experimental facts

When light falls on a metal, **photoelectrons** are emitted. Observations:

1. Emission needs $f \ge f_0$, the **threshold frequency**, however intense the light.
2. The maximum kinetic energy of the electrons depends on $f$, not on intensity.
3. Emission is practically instantaneous (no delay).
4. For $f > f_0$, the number of electrons per second (the saturation photocurrent) is proportional to the intensity.

Classical wave theory predicts the opposite of (1)–(3), so it fails. Einstein (1905): light consists of **photons**, each of energy

$$
E = hf = \frac{hc}\lambda, \qquad h = 6.63 \times 10^{-34}\ \text{J s}, \quad hc \approx 1240\ \text{eV nm}.
$$

One photon gives all its energy to one electron.

## 2. Einstein's equation

$$
hf = W_0 + E_{k,\max}, \qquad W_0 = hf_0, \qquad eU_c = E_{k,\max}.
$$

$W_0$ is the **work function**; $U_c$ the **stopping (cutoff) voltage**.

**Example 1.** Light of $300\ \text{nm}$ on potassium with $W_0 = 2.3\ \text{eV}$: $E = 4.13\ \text{eV}$, $E_{k,\max} = 1.83\ \text{eV}$, $U_c = 1.83\ \text{V}$; threshold wavelength $\dfrac{1240}{2.3} = 539\ \text{nm}$.

**Example 2.** A metal with $W_0 = 2.2\ \text{eV}$: $f_0 = \dfrac{2.2 \cdot 1.6 \times 10^{-19}}{6.63 \times 10^{-34}} = 5.3 \times 10^{14}\ \text{Hz}$. UV of $200\ \text{nm}$ ($6.2\ \text{eV}$): $U_c = 4.0\ \text{V}$.

## 3. Graphs

- **$E_{k,\max}$ against $f$**: a straight line with **slope $h$** (the same for all metals), intercept on the $f$-axis $f_0$ and on the energy axis $-W_0$. Different metals give parallel lines.
- **$U_c$ against $f$**: slope $\dfrac he$ (Millikan's measurement of $h$).
- **Photocurrent against voltage**: nonzero at $0\ \text{V}$, falls to zero at $-U_c$, saturates at large positive voltage; the saturation current is proportional to the intensity.

## 4. Typical questions

- Same metal, same frequency, **twice the intensity**: $E_{k,\max}$ and $U_c$ unchanged; the saturation current doubles.
- Frequency below $f_0$: no emission at all, however bright.
- Doubling a frequency above threshold: $E_{k,\max}$ increases by *more* than a factor of $2$ ($E_k = hf - W_0$).
- A higher temperature or a different surface changes $W_0$ but not $h$.

**Photon momentum**: $p = \dfrac h\lambda = \dfrac Ec$ (Compton effect confirms it).

## Common mistakes

- Believing brighter light increases the electrons' maximum energy.
- Forgetting to convert between eV and J.
- Treating a photon as having rest mass.

## Practice problems

1. Photon energy ($\text{eV}$) for $400\ \text{nm}$.
2. A metal has $W_0 = 3.0\ \text{eV}$: will $350\ \text{nm}$ light eject electrons, and with what maximum energy?

**Answers.** (1) $3.1\ \text{eV}$. (2) $E = 3.54\ \text{eV} > 3.0$: yes; $0.54\ \text{eV}$.
