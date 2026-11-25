---
title: Probability Distributions
minutes: 12
---

## What you will learn

- discrete random variables, expectation and variance;
- the binomial distribution;
- the normal distribution and the Poisson distribution (extension).

## 1. Discrete random variables

A **discrete random variable** $X$ takes values $x_i$ with probabilities $p_i$, where every $p_i \ge 0$ and $\sum p_i = 1$.

$$
E(X) = \sum x_ip_i, \qquad D(X) = \operatorname{Var}(X) = \sum\bigl(x_i - E(X)\bigr)^2p_i = E(X^2) - \bigl(E(X)\bigr)^2,
$$

$$
E(aX + b) = aE(X) + b, \qquad D(aX + b) = a^2D(X).
$$

**Example 1.** $X$ takes $1, 2, 3$ with probabilities $0.2, a, 0.5$: $a = 0.3$; $E(X) = 0.2 + 0.6 + 1.5 = 2.3$.

**Example 2.** A fair die: $E(X) = 3.5$, $D(X) = \dfrac{35}{12}$.

## 2. Binomial distribution

$X \sim B(n, p)$ counts successes in $n$ independent trials, each with probability $p$:

$$
P(X = k) = \binom nkp^k(1 - p)^{n-k}, \qquad E(X) = np, \qquad D(X) = np(1 - p).
$$

**Example 3.** $8$ trials with $p = 0.5$: $P(X = 3) = \binom83\left(\tfrac12\right)^8 = \dfrac{56}{256}$. $E = 4$, $D = 2$.

**Example 4.** A fair coin flipped $5$ times: $P(\text{exactly 2 heads}) = \dfrac{10}{32} = \dfrac5{16}$.

**Example 5.** $X \sim B(4, 0.5)$: $P(X \ge 3) = \dfrac{4 + 1}{16} = \dfrac5{16}$.

## 3. Normal distribution

$X \sim N(\mu, \sigma^2)$ has a bell-shaped, symmetric density with centre $\mu$ and spread $\sigma$. **Standardise**: $Z = \dfrac{X - \mu}\sigma \sim N(0, 1)$.

$$
P(\mu - \sigma \le X \le \mu + \sigma) \approx 0.683, \quad P(\mu \pm 2\sigma) \approx 0.954, \quad P(\mu \pm 3\sigma) \approx 0.997.
$$

By symmetry $P(X \le \mu) = 0.5$ and $P(X \ge \mu + a) = P(X \le \mu - a)$.

**Example 6.** $X \sim N(70, 10^2)$: $P(60 \le X \le 80) \approx 0.683$; $P(X > 90) \approx \dfrac{1 - 0.954}2 = 0.023$.

**Example 7.** $X \sim N(50, 4^2)$: $P(X \le 54) \approx 0.5 + \dfrac{0.683}2 = 0.841$.

## 4. Poisson distribution (extension)

For rare events with average rate $\lambda$ per interval: $P(X = k) = \dfrac{\lambda^ke^{-\lambda}}{k!}$, with $E(X) = D(X) = \lambda$. If a call centre receives $\lambda = 3$ calls per minute, $P(X = 0) = e^{-3} \approx 0.05$.

## Common mistakes

- Using $B(n, p)$ without independent trials.
- Forgetting the $a^2$ in $D(aX + b)$.
- Using $\sigma^2$ in place of $\sigma$ when standardising.

## Practice problems

1. $X$: values $0, 1, 2$ with probabilities $0.3, 0.5, 0.2$. Find $E$ and $D$.
2. $X \sim B(10, 0.3)$: $E$, $D$.
3. $X \sim N(100, 15^2)$: $P(X > 115)$.

**Answers.** (1) $E = 0.9$; $E(X^2) = 0.5 + 0.8 = 1.3$, $D = 1.3 - 0.81 = 0.49$. (2) $3$ and $2.1$. (3) $\dfrac{1 - 0.683}2 \approx 0.159$.
