---
title: Log Rules & Equations
minutes: 12
---

## What you will learn

- the product, quotient, power and change-of-base rules;
- how to solve exponential equations with logarithms;
- how to solve logarithmic equations and inequalities (and always check the domain).

## 1. The rules (for $M, N > 0$)

$$
\log_a(MN) = \log_aM + \log_aN, \quad \log_a\frac MN = \log_aM - \log_aN, \quad \log_aM^k = k\log_aM.
$$

**Change of base**: $\log_ab = \dfrac{\log_cb}{\log_ca}$ for any valid base $c$; special cases $\log_{a^m}b^n = \dfrac nm\log_ab$ and $\log_ab\cdot\log_ba = 1$.

**Warning**: $\log(M + N)$ does **not** equal $\log M + \log N$. The *product* becomes a sum.

**Example 1.** Expand $\log_2(8x^3) = \log_28 + 3\log_2x = 3 + 3\log_2x$.

**Example 2.** $\log_212 - \log_23 = \log_24 = 2$.

**Example 3.** Given $\lg2 \approx 0.301$: $\lg5 = \lg\dfrac{10}2 = 1 - 0.301 = 0.699$; $\lg 8 = 3(0.301) = 0.903$.

## 2. Exponential equations

If the bases cannot be matched, take $\log$ of both sides.

**Example 4.** $3^{2x} = 7 \Rightarrow 2x\ln3 = \ln7 \Rightarrow x = \dfrac{\ln7}{2\ln3} \approx 0.886$.

**Example 5.** $2^x = 3^{x - 1} \Rightarrow x\ln2 = (x - 1)\ln3 \Rightarrow x(\ln3 - \ln2) = \ln3 \Rightarrow x = \dfrac{\ln3}{\ln1.5} \approx 2.71$.

## 3. Logarithmic equations

1. **Find the domain first**: every logarithm's argument must be positive.
2. Combine logs into a single log on each side (or isolate one log).
3. Use $\log_af = \log_ag \iff f = g$, or convert to exponential form $\log_af = c \iff f = a^c$.
4. **Reject** solutions outside the domain.

**Example 6.** $\lg x + \lg(x - 3) = 1$ (Chinese textbooks write $\lg$ for $\log_{10}$). Domain: $x > 3$. Then $x(x - 3) = 10 \Rightarrow x^2 - 3x - 10 = 0 \Rightarrow x = 5$ or $x = -2$; reject $-2$. Answer $x = 5$.

**Example 7.** $\log_2(x + 1) + \log_2(x - 1) = 3$: domain $x > 1$; $x^2 - 1 = 8 \Rightarrow x = 3$ (and $-3$ rejected).

**Example 8.** $(\log_2x)^2 - 3\log_2x + 2 = 0$: put $t = \log_2x$: $t = 1$ or $2$, so $x = 2$ or $4$.

## 4. Logarithmic inequalities

$\log_af < \log_ag$: for $a > 1$, $0 < f < g$; for $0 < a < 1$, $f > g > 0$ (flip). Always include the domain conditions.

**Example 9.** $\log_{1/2}(x - 1) > -2$: domain $x > 1$; since the base is below 1: $x - 1 < \left(\tfrac12\right)^{-2} = 4$, so $1 < x < 5$.

## Common mistakes

- Not checking the domain, so extraneous roots stay.
- Writing $\log(M \pm N)$ as a sum or difference of logs.
- Forgetting to flip the inequality when the base is below $1$.

## Practice problems

1. Simplify $\log_3 18 - \log_3 2$.
2. Solve $\log_3(2x - 1) = 2$.
3. Solve $5^x = 20$.

**Answers.** (1) $\log_39 = 2$. (2) $2x - 1 = 9$, $x = 5$. (3) $x = \dfrac{\ln20}{\ln5} \approx 1.86$.
