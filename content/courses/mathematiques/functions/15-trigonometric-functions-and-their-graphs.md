---
title: Trigonometric Functions & Their Graphs
minutes: 14
---

## What you will learn

- the graphs, periods and symmetries of $\sin$, $\cos$, $\tan$;
- the function $y = A\sin(\omega x + \varphi) + b$: period, range, monotonic intervals;
- the five-point method, reading a graph, and solving trigonometric equations.

## 1. Basic functions

| Function | Domain | Range | Period | Parity |
|---|---|---|---|---|
| $\sin x$ | $\mathbb{R}$ | $[-1, 1]$ | $2\pi$ | odd |
| $\cos x$ | $\mathbb{R}$ | $[-1, 1]$ | $2\pi$ | even |
| $\tan x$ | $x \ne \dfrac\pi2 + k\pi$ | $\mathbb{R}$ | $\pi$ | odd |

$\sin x$ is increasing on $\left[-\tfrac\pi2 + 2k\pi, \tfrac\pi2 + 2k\pi\right]$ and decreasing on $\left[\tfrac\pi2 + 2k\pi, \tfrac{3\pi}2 + 2k\pi\right]$; $\cos x$ is decreasing on $[2k\pi, \pi + 2k\pi]$; $\tan x$ is increasing on every interval of its domain. Symmetry: $\sin$ has centres $(k\pi, 0)$ and axes $x = \tfrac\pi2 + k\pi$; $\cos$ has axes $x = k\pi$ and centres $\left(\tfrac\pi2 + k\pi, 0\right)$.

## 2. The function $y = A\sin(\omega x + \varphi) + b$ ($A, \omega > 0$)

- **Amplitude** $A$; **midline** $y = b$; **range** $[b - A, b + A]$.
- **Period** $T = \dfrac{2\pi}\omega$ (for $\tan$: $\dfrac\pi\omega$); **frequency** $\dfrac1T$.
- **Phase shift**: the graph of $\sin(\omega x)$ shifted by $-\dfrac\varphi\omega$ (left if positive). **Note**: shift by $\dfrac\varphi\omega$, not $\varphi$.
- Maximum where $\omega x + \varphi = \dfrac\pi2 + 2k\pi$; minimum where $= -\dfrac\pi2 + 2k\pi$.

**Example 1.** $y = 3\sin\left(2x - \dfrac\pi4\right) + 1$: period $\pi$, range $[-2, 4]$. Increasing when $-\dfrac\pi2 + 2k\pi \le 2x - \dfrac\pi4 \le \dfrac\pi2 + 2k\pi$, i.e. $x \in \left[-\dfrac\pi8 + k\pi, \dfrac{3\pi}8 + k\pi\right]$; for $k = 0$ the interval is $\left[-\dfrac\pi8, \dfrac{3\pi}8\right]$.

**Example 2.** Maximum of $f(x) = \sin\left(2x + \dfrac\pi6\right)$: $2x + \dfrac\pi6 = \dfrac\pi2 \Rightarrow x = \dfrac\pi6$ (plus multiples of $\pi$).

## 3. The five-point method

To sketch one period of $y = A\sin(\omega x + \varphi) + b$, let $\omega x + \varphi$ take the values $0, \dfrac\pi2, \pi, \dfrac{3\pi}2, 2\pi$; solve for $x$; the five points are (midline, max, midline, min, midline).

## 4. Finding $A$, $\omega$, $\varphi$ from a graph

Use the maximum and minimum for $A$ and $b$; use the distance between two consecutive maxima (or half the distance from a maximum to the next minimum) for the period, hence $\omega$; then use the maximum point for $\varphi$.

**Example 3.** Maximum $3$ at $x = \dfrac\pi6$ and the next minimum $-3$ at $x = \dfrac{2\pi}3$. Half period $= \dfrac{2\pi}3 - \dfrac\pi6 = \dfrac\pi2$, so $T = \pi$, $\omega = 2$, $A = 3$. At the maximum $2 \cdot \dfrac\pi6 + \varphi = \dfrac\pi2 \Rightarrow \varphi = \dfrac\pi6$: $y = 3\sin\left(2x + \dfrac\pi6\right)$.

## 5. Equations

$$
\sin x = \sin\alpha \iff x = \alpha + 2k\pi \ \text{or}\ \pi - \alpha + 2k\pi; \quad \cos x = \cos\alpha \iff x = \pm\alpha + 2k\pi; \quad \tan x = \tan\alpha \iff x = \alpha + k\pi.
$$

**Example 4.** $\sin2x = \sin x$ on $[0, 2\pi)$: $\sin x(2\cos x - 1) = 0$. $\sin x = 0 \Rightarrow x = 0, \pi$; $\cos x = \tfrac12 \Rightarrow x = \dfrac\pi3, \dfrac{5\pi}3$. Do **not** divide by $\sin x$.

**Example 5.** $2\sin^2x - \sin x - 1 = 0$: $t = \sin x$, $(2t + 1)(t - 1) = 0$, $t = -\tfrac12$ or $1$; $x = -\dfrac\pi6 + 2k\pi,\ \dfrac{7\pi}6 + 2k\pi,\ \dfrac\pi2 + 2k\pi$.

**Example 6.** Range of $y = \sin x + \cos x = \sqrt2\sin\left(x + \dfrac\pi4\right)$: $[-\sqrt2, \sqrt2]$.

## Common mistakes

- Shifting by $\varphi$ instead of $\dfrac\varphi\omega$.
- Using period $2\pi$ for $\tan$.
- Dividing by $\sin x$ or $\cos x$ and losing solutions.

## Practice problems

1. Period and range of $y = -2\cos\dfrac x2 + 1$.
2. Solve $2\cos x = \sqrt3$ on $[0, 2\pi]$.
3. Increasing interval of $\sin\left(x - \dfrac\pi3\right)$ containing $\dfrac\pi3$.

**Answers.** (1) $4\pi$ and $[-1, 3]$. (2) $\dfrac\pi6$, $\dfrac{11\pi}6$. (3) $-\dfrac\pi2 \le x - \dfrac\pi3 \le \dfrac\pi2 \Rightarrow \left[-\dfrac\pi6, \dfrac{5\pi}6\right]$.
