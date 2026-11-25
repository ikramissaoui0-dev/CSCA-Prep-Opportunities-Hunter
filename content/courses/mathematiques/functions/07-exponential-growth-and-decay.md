---
title: Exponential Growth & Decay
minutes: 8
---

## What you will learn

- the growth and decay models;
- half-life, doubling time and continuous growth;
- how to solve for the time or the rate with logarithms.

## 1. Models

**Constant percentage change per period**: $A(t) = A_0(1 + r)^t$, with $r > 0$ for growth, $r < 0$ for decay. The **multiplier** is $1 + r$ (growth of $5\%$ means multiplier $1.05$; decay of $20\%$ means $0.8$). Do not confuse the *rate* with the *multiplier*.

**Continuous growth/decay**: $A(t) = A_0e^{kt}$ ($k > 0$ growth, $k < 0$ decay).

**Half-life** $T$: $A(t) = A_0\left(\tfrac12\right)^{t/T}$, equivalent to $k = -\dfrac{\ln 2}{T}$.

**Doubling time** at rate $r$: $t = \dfrac{\ln 2}{\ln(1 + r)}$ (or $\dfrac{\ln 2}{k}$ for continuous growth); a rough rule: $t \approx \dfrac{70}{r\%}$ years.

## 2. Worked examples

**Example 1.** An amount of $1000$ dollars grows at $5$ percent per year. After 10 years: $1000 \cdot 1.05^{10} \approx 1628.89$.

**Example 2.** A substance has half-life $4$ years. From $100\ \text{g}$, after $12$ years: $100 \cdot \left(\tfrac12\right)^3 = 12.5\ \text{g}$. After $10$ years the fraction left is $2^{-2.5} \approx 0.177$.

**Example 3.** A population of $10\,000$ grows continuously at $3$ percent per year: $P(t) = 10\,000e^{0.03t}$. After $20$ years: $10\,000e^{0.6} \approx 18\,221$. Doubling time: $\dfrac{\ln2}{0.03} \approx 23.1$ years.

**Example 4 (solving for time).** When does $1000 \cdot 1.05^t$ reach $2000$? $1.05^t = 2 \Rightarrow t = \dfrac{\ln 2}{\ln 1.05} \approx 14.2$ years.

**Example 5 (solving for the rate).** An investment doubles in $8$ years. $(1 + r)^8 = 2 \Rightarrow 1 + r = 2^{1/8} \approx 1.0905$, so $r \approx 9.05\%$.

**Example 6 (decay).** A car loses $15$ percent of its value each year; the multiplier is $0.85$. From $20\,000$, after 3 years: $20\,000 \cdot 0.85^3 \approx 12\,283$.

## 3. Method for "find $t$"

Isolate the exponential, then take $\ln$ (or $\log$) of both sides and use $\ln a^t = t\ln a$.

## Common mistakes

- Using the rate ($0.05$) as the multiplier instead of $1.05$.
- Using half-life formulas with the wrong exponent $t/T$.
- Rounding intermediate values too early.

## Practice problems

1. A bacteria culture of $500$ doubles every $3$ hours. How many after $9$ hours?
2. A radioactive sample has $25\%$ left after $10$ days. What is its half-life?
3. How long for $2000$ at $4\%$ yearly to reach $3000$?

**Answers.** (1) $500 \cdot 2^3 = 4000$. (2) Two half-lives: $5$ days. (3) $t = \dfrac{\ln1.5}{\ln1.04} \approx 10.3$ years.
