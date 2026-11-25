---
title: Electromagnetic Induction (Faraday's Law)
minutes: 12
---

## What you will learn

- magnetic flux;
- Faraday's law and motional EMF;
- self- and mutual inductance.

## 1. Magnetic flux

For a uniform field and a plane surface of area $A$ at angle $\theta$ between $\vec B$ and the normal:

$$
\Phi = BA\cos\theta \quad (\text{weber}, \ 1\ \text{Wb} = 1\ \text{T m}^2).
$$

Flux can change if $B$ changes, if the area changes, or if the orientation changes.

## 2. Faraday's law

A changing flux through a **closed** loop induces an EMF:

$$
\varepsilon = -N\frac{\Delta\Phi}{\Delta t}.
$$

The induced current is $I = \dfrac\varepsilon R$ and the charge that flows is $q = \dfrac{N\Delta\Phi}R$ (independent of how fast the change is). The minus sign is Lenz's law (next lesson).

**Example 1.** A coil of $100$ turns and area $0.02\ \text{m}^2$ in a field rising from $0$ to $0.5\ \text{T}$ in $0.1\ \text{s}$: $|\varepsilon| = 100 \cdot \dfrac{0.5 \cdot 0.02}{0.1} = 10\ \text{V}$.

**Example 2.** A $200$-turn coil sees its flux change from $0.01$ to $0.05\ \text{Wb}$ in $0.4\ \text{s}$: $\varepsilon = 200 \cdot \dfrac{0.04}{0.4} = 20\ \text{V}$.

## 3. Motional EMF

A rod of length $L$ moving with velocity $v$ perpendicular to a field $B$ (and to itself):

$$
\varepsilon = BLv.
$$

On rails closing a circuit of resistance $R$: $I = \dfrac{BLv}R$, the opposing magnetic force $F = BIL = \dfrac{B^2L^2v}R$, and the power needed to keep a constant speed is $Fv = \dfrac{(BLv)^2}R$ (all converted to heat).

**Example 3.** A rod of $0.5\ \text{m}$ at $4\ \text{m/s}$ in $0.2\ \text{T}$: $\varepsilon = 0.4\ \text{V}$; with $R = 2\ \Omega$: $I = 0.2\ \text{A}$, $F = 0.02\ \text{N}$, power $0.08\ \text{W}$.

**Example 4 (terminal velocity).** A rod falling on vertical rails reaches a constant speed when $mg = \dfrac{B^2L^2v}R$.

**Generators**: a coil rotating at angular speed $\omega$ in a field produces $e = NBA\omega\sin\omega t$.

## 4. Inductance

**Self-inductance** (自感): a coil opposes changes in its own current: $\varepsilon = -L\dfrac{\Delta I}{\Delta t}$ ($L$ in henries); energy stored $\tfrac12LI^2$. When a circuit with a large coil is opened, the collapsing current can produce a large EMF (spark). **Mutual inductance**: a changing current in one coil induces an EMF in a nearby coil, $\varepsilon_2 = -M\dfrac{\Delta I_1}{\Delta t}$ (transformers, wireless charging).

## Common mistakes

- Forgetting the factor $N$.
- Using $\theta$ as the angle with the surface rather than with the normal in $\Phi = BA\cos\theta$.
- Using $\varepsilon = BLv$ when $v$, $B$ and $L$ are not mutually perpendicular.

## Practice problems

1. A loop of area $0.05\ \text{m}^2$ in a field changing from $0.4$ to $0$ in $0.2\ \text{s}$: $\varepsilon$.
2. A $1\ \text{m}$ rod moves at $5\ \text{m/s}$ perpendicular to $0.1\ \text{T}$: $\varepsilon$.

**Answers.** (1) $0.1\ \text{V}$. (2) $0.5\ \text{V}$.
