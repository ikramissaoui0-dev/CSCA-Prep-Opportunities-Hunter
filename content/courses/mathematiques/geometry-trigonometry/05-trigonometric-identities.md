---
title: Trigonometric Identities
minutes: 12
---

## What you will learn

- the Pythagorean, sum/difference and double-angle identities;
- how to simplify, evaluate and prove with them;
- the auxiliary-angle form $a\sin x + b\cos x$.

## 1. Pythagorean and quotient identities

$$
\sin^2x + \cos^2x = 1, \qquad 1 + \tan^2x = \frac1{\cos^2x}, \qquad \tan x = \frac{\sin x}{\cos x}.
$$

If you know one ratio and the quadrant, you can find the others. Trick: from $\sin x + \cos x = t$ we get $\sin x\cos x = \dfrac{t^2 - 1}2$.

**Example 1.** Simplify $\sin^2\theta + \cos^2\theta + \tan^2\theta = 1 + \tan^2\theta = \dfrac1{\cos^2\theta}$.

## 2. Sum and difference

$$
\sin(\alpha \pm \beta) = \sin\alpha\cos\beta \pm \cos\alpha\sin\beta, \qquad \cos(\alpha \pm \beta) = \cos\alpha\cos\beta \mp \sin\alpha\sin\beta,
$$

$$
\tan(\alpha \pm \beta) = \frac{\tan\alpha \pm \tan\beta}{1 \mp \tan\alpha\tan\beta}.
$$

**Example 2.** $\sin75^\circ = \sin(45^\circ + 30^\circ) = \dfrac{\sqrt2}2\cdot\dfrac{\sqrt3}2 + \dfrac{\sqrt2}2\cdot\dfrac12 = \dfrac{\sqrt6 + \sqrt2}4$.

**Example 3.** If $\tan\alpha = 2$ and $\tan\beta = 3$: $\tan(\alpha + \beta) = \dfrac{5}{1 - 6} = -1$.

**Example 4.** $\cos\left(x + \dfrac\pi3\right) + \cos\left(x - \dfrac\pi3\right) = 2\cos x\cos\dfrac\pi3 = \cos x$.

## 3. Double angle and power reduction

$$
\sin2x = 2\sin x\cos x, \qquad \cos2x = \cos^2x - \sin^2x = 2\cos^2x - 1 = 1 - 2\sin^2x, \qquad \tan2x = \frac{2\tan x}{1 - \tan^2x},
$$

$$
\sin^2x = \frac{1 - \cos2x}2, \qquad \cos^2x = \frac{1 + \cos2x}2.
$$

**Example 5 (prove).** $\dfrac{1 - \cos2\theta}{\sin2\theta} = \dfrac{2\sin^2\theta}{2\sin\theta\cos\theta} = \tan\theta$.

**Example 6.** $\cos15^\circ\cos75^\circ = \cos15^\circ\sin15^\circ = \tfrac12\sin30^\circ = \dfrac14$.

**Example 7.** If $\sin x = \dfrac35$ in QII: $\cos x = -\dfrac45$, so $\sin2x = -\dfrac{24}{25}$ and $\cos2x = \dfrac7{25}$.

## 4. Auxiliary angle

$a\sin x + b\cos x = \sqrt{a^2 + b^2}\,\sin(x + \varphi)$ with $\tan\varphi = \dfrac ba$ (quadrant of $(a, b)$). So the range is $\left[-\sqrt{a^2 + b^2}, \sqrt{a^2 + b^2}\right]$.

**Example 8.** $\sqrt3\sin x + \cos x = 2\sin\left(x + \dfrac\pi6\right)$, range $[-2, 2]$.

## 5. How to use identities

- **Simplification**: convert everything to $\sin$ and $\cos$.
- **Evaluation of special angles**: write $15^\circ = 45^\circ - 30^\circ$, $75^\circ = 45^\circ + 30^\circ$.
- **Proofs**: work on the more complicated side; use only equivalences.
- **Equations**: reduce to a single function (factor, substitute $t$).

## Common mistakes

- Writing $\sin(\alpha + \beta) = \sin\alpha + \sin\beta$.
- Forgetting that $\cos2x$ has three forms and choosing the unhelpful one.
- Dividing by $\cos x$ without checking it is non-zero.

## Practice problems

1. Evaluate $\cos75^\circ$.
2. Simplify $\dfrac{\sin2x}{1 + \cos2x}$.
3. If $\tan x = 3$, find $\tan2x$.

**Answers.** (1) $\dfrac{\sqrt6 - \sqrt2}4$. (2) $\tan x$. (3) $\dfrac6{1 - 9} = -\dfrac34$.
