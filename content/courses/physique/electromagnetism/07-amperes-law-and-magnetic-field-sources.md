---
title: Ampère's Law & Magnetic Field Sources
minutes: 12
---

## What you will learn

- the field of a straight wire, a loop and a solenoid;
- Ampère's law;
- forces between parallel currents and equilibrium problems.

## 1. Sources of magnetic fields

Moving charges (currents) produce magnetic fields. Use the **right-hand grip rule** (右手螺旋定则): for a straight wire, the thumb points along $I$ and the fingers curl in the direction of $\vec B$; for a coil, the fingers curl along $I$ and the thumb points to the north pole (the direction of $\vec B$ inside).

$$
B_{\text{wire}} = \frac{\mu_0I}{2\pi r}, \qquad B_{\text{centre of loop}} = \frac{\mu_0I}{2R} \ (\times N), \qquad B_{\text{solenoid}} = \mu_0nI,
$$

with $\mu_0 = 4\pi \times 10^{-7}\ \text{T m/A}$ and $n$ the turns per metre. The field is roughly uniform inside a long solenoid and almost zero outside.

**Example 1.** $5\ \text{cm}$ from a straight wire carrying $10\ \text{A}$: $B = \dfrac{4\pi \times 10^{-7} \cdot 10}{2\pi \cdot 0.05} = 4 \times 10^{-5}\ \text{T}$.

**Example 2.** A solenoid with $1000$ turns/m and $2\ \text{A}$: $B = 4\pi \times 10^{-7} \cdot 1000 \cdot 2 = 2.5 \times 10^{-3}\ \text{T}$.

## 2. Ampère's law

$$
\oint\vec B\cdot d\vec l = \mu_0I_{\text{enc}},
$$

the line integral of $B$ around a closed path equals $\mu_0$ times the current through it. It gives the fields above by symmetry.

## 3. Force between parallel wires

Currents in the **same direction attract**; opposite directions repel. For long parallel wires separated by $d$:

$$
\frac FL = \frac{\mu_0I_1I_2}{2\pi d}.
$$

Two wires $0.1\ \text{m}$ apart, each with $5\ \text{A}$: $\dfrac FL = \dfrac{2 \times 10^{-7} \cdot 25}{0.1} = 5 \times 10^{-5}\ \text{N/m}$. This defines the ampere.

## 4. Equilibrium and applications

**Example 3 (rod on an incline).** A rod of mass $m$ and length $L$ on a smooth incline of angle $\theta$ carries a current $I$ in a vertical field $B$; the magnetic force is horizontal. Balance along the slope: $BIL\cos\theta = mg\sin\theta$, so $B = \dfrac{mg\tan\theta}{IL}$.

**Example 4 (suspended wire).** A wire hangs from two threads in a horizontal perpendicular field; it tilts until $\tan\theta = \dfrac{BIL}{mg}$.

Applications: electromagnets (a soft-iron core strengthens the field), loudspeakers, relays, MRI, maglev trains, galvanometers.

**Field direction summary**: field of a current — right-hand grip; force on a current or moving charge — left-hand rule; induced current direction — right-hand rule (see Lenz's law).

## Common mistakes

- Using $B = \mu_0nI$ outside a solenoid.
- Mixing the left-hand and right-hand rules.
- Treating the attraction between parallel currents as repulsion.

## Practice problems

1. Field at $0.2\ \text{m}$ from a wire with $20\ \text{A}$.
2. Force per unit length between wires with $10\ \text{A}$ and $20\ \text{A}$, $0.05\ \text{m}$ apart.

**Answers.** (1) $2 \times 10^{-5}\ \text{T}$. (2) $\dfrac{2 \times 10^{-7} \cdot 200}{0.05} = 8 \times 10^{-4}\ \text{N/m}$.
