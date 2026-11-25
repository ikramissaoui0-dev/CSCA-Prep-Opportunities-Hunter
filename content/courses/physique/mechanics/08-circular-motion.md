---
title: Circular Motion
minutes: 12
---

## What you will learn

- uniform circular motion: $v$, $\omega$, $T$, $a_c$;
- the centripetal force and what provides it;
- banked curves, conical pendulum, vertical circles and transmission problems.

## 1. Quantities

For radius $r$ and period $T$ (frequency $f = 1/T$):

$$
v = \frac{2\pi r}T = \omega r, \qquad \omega = \frac{2\pi}T = 2\pi f, \qquad a_c = \frac{v^2}r = \omega^2r.
$$

The speed is constant but the velocity changes direction: the acceleration $a_c$ points **toward the centre**. The required net inward force is

$$
F_c = \frac{mv^2}r = m\omega^2r.
$$

$F_c$ is not a new force: it is the *net* force toward the centre, supplied by tension, friction, gravity, a normal force or a combination. It does no work.

**Example 1.** A ball of $0.2\ \text{kg}$ on a $0.5\ \text{m}$ string moves at $2\ \text{m/s}$: $F_c = 1.6\ \text{N}$. A wheel at $120\ \text{rev/min}$: $f = 2\ \text{Hz}$, $T = 0.5\ \text{s}$, $\omega = 4\pi\ \text{rad/s}$.

## 2. Standard situations

- **Flat curve**: friction provides $F_c$: $v_{\max} = \sqrt{\mu gr}$. With $\mu = 0.5$, $r = 40\ \text{m}$: $14.1\ \text{m/s}$.
- **Banked curve** (no friction needed): $\tan\theta = \dfrac{v^2}{gr}$. For $r = 100\ \text{m}$, $\theta = 20^\circ$: $v = \sqrt{gr\tan\theta} \approx 18.9\ \text{m/s}$. Faster: friction acts down the slope; slower: up the slope.
- **Conical pendulum**: $T\cos\theta = mg$, $T\sin\theta = m\omega^2r$ with $r = L\sin\theta$, so $\omega^2 = \dfrac g{L\cos\theta}$.
- **Convex bridge** (radius $R$): $mg - N = \dfrac{mv^2}R$; the apparent weight is smaller. **Dip**: $N - mg = \dfrac{mv^2}R$, larger.
- **Vertical circle**: top: $T + mg = \dfrac{mv^2}r$ with minimum $v = \sqrt{gr}$; bottom: $T - mg = \dfrac{mv^2}r$.

**Example 2.** A $1000\ \text{kg}$ car on a hump-backed bridge of radius $40\ \text{m}$ at $10\ \text{m/s}$: $N = 10\,000 - \dfrac{1000 \cdot 100}{40} = 7500\ \text{N}$.

**Example 3.** A $1000\ \text{kg}$ car on a circle of $r = 50\ \text{m}$ at $20\ \text{m/s}$ needs $F = \dfrac{1000 \cdot 400}{50} = 8000\ \text{N}$ of friction.

## 3. Transmission problems (传动问题)

- Points on the **same belt** (or touching gears) have the **same linear speed** $v$.
- Points on the **same rotating body** (same axis) have the **same angular velocity** $\omega$.

**Example 4.** Wheels $A$ ($r = 10\ \text{cm}$) and $B$ ($r = 30\ \text{cm}$) joined by a belt; $A$ turns at $6\ \text{rev/s}$: $\omega_Ar_A = \omega_Br_B$, so $B$ turns at $2\ \text{rev/s}$; the rim acceleration of $B$ is $\omega^2r = (4\pi)^2(0.3) \approx 47\ \text{m/s}^2$.

## 4. Units

$1\ \text{rev/min} = \dfrac{2\pi}{60}\ \text{rad/s}$; $300\ \text{rev/min} = 10\pi \approx 31.4\ \text{rad/s}$.

## Common mistakes

- Adding a centrifugal force to the free-body diagram.
- Using $v$ and $\omega$ interchangeably.
- Forgetting that a larger radius at the same $\omega$ means a larger $v$.

## Practice problems

1. A stone on a $0.4\ \text{m}$ string makes $5$ rev/s: $v$ and $a_c$.
2. Maximum speed on a flat $50\ \text{m}$-radius curve with $\mu = 0.4$ ($g = 10$).
3. Tension at the bottom of a vertical circle with $m = 0.5\ \text{kg}$, $r = 1\ \text{m}$, $v = 6\ \text{m/s}$.

**Answers.** (1) $v = 2\pi \cdot 5 \cdot 0.4 = 12.6\ \text{m/s}$; $a_c = \dfrac{v^2}r \approx 395\ \text{m/s}^2$. (2) $\sqrt{0.4 \cdot 10 \cdot 50} = 14.1\ \text{m/s}$. (3) $T = mg + \dfrac{mv^2}r = 5 + 18 = 23\ \text{N}$.
