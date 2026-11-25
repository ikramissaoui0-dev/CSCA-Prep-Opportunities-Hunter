---
title: Probability Basics
minutes: 12
---

## What you will learn

- sample spaces, events and the classical model;
- the addition, complement and multiplication rules;
- conditional probability, independence and Bayes' theorem.

## 1. Definitions

An **experiment** has a **sample space** $\Omega$ (all outcomes); an **event** is a subset of $\Omega$. In the **classical model** with equally likely outcomes:

$$
P(A) = \frac{|A|}{|\Omega|}, \qquad 0 \le P(A) \le 1, \quad P(\Omega) = 1, \quad P(\varnothing) = 0.
$$

Two events are **mutually exclusive** if $A \cap B = \varnothing$; **complementary** if they are exclusive and together fill $\Omega$.

**Example 1.** A die is rolled: $P(\text{even}) = \dfrac36 = \dfrac12$. Two coins: $\Omega = \{HH, HT, TH, TT\}$, $P(\text{exactly one head}) = \dfrac12$. Two dice ($36$ outcomes): $P(\text{sum} = 7) = \dfrac6{36} = \dfrac16$, $P(\text{sum} = 9) = \dfrac4{36}$.

## 2. Rules

- **Complement**: $P(\bar A) = 1 - P(A)$ (use for "at least one").
- **Addition**: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$; for mutually exclusive events, $P(A \cup B) = P(A) + P(B)$.
- **Conditional probability**: $P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}$.
- **Multiplication**: $P(A \cap B) = P(A)P(B \mid A)$.
- **Independence**: $P(A \cap B) = P(A)P(B)$; then $P(B \mid A) = P(B)$.

**Example 2.** At least one six in two dice: $1 - \left(\dfrac56\right)^2 = \dfrac{11}{36}$.

**Example 3.** A card from $52$: $P(\text{heart or king}) = \dfrac{13}{52} + \dfrac4{52} - \dfrac1{52} = \dfrac4{13}$.

**Example 4.** Two balls drawn without replacement from $3$ red and $2$ blue: $P(\text{both red}) = \dfrac35\cdot\dfrac24 = \dfrac3{10}$ (or $\dfrac{\binom32}{\binom52}$).

## 3. Total probability and Bayes

If $A_1, \dots, A_n$ partition $\Omega$:

$$
P(B) = \sum P(A_i)P(B \mid A_i), \qquad P(A_i \mid B) = \frac{P(A_i)P(B \mid A_i)}{P(B)}.
$$

**Example 5.** Machine $M_1$ makes $60\%$ of the items ($2\%$ defective) and $M_2$ the other $40\%$ ($5\%$ defective). $P(\text{defective}) = 0.012 + 0.020 = 0.032$; given a defective item, $P(M_1) = \dfrac{0.012}{0.032} = \dfrac38$.

## 4. Geometric probability

For outcomes uniformly spread over a length/area: $P(A) = \dfrac{\text{measure}(A)}{\text{measure}(\Omega)}$. A point chosen at random on a segment of length $10$ falls in a given $4$-unit subsegment with probability $0.4$.

## Common mistakes

- Assuming events are independent without justification.
- Mixing up $P(B \mid A)$ and $P(A \mid B)$.
- Forgetting the intersection term in $P(A \cup B)$.

## Practice problems

1. A die is rolled twice. $P(\text{both even})$?
2. $P(A) = 0.5$, $P(B) = 0.4$, $P(A \cap B) = 0.2$. Are $A$, $B$ independent? Find $P(A \cup B)$.
3. A fair coin is flipped three times: $P(\text{at least one head})$.

**Answers.** (1) $\dfrac14$. (2) Yes ($0.5 \cdot 0.4 = 0.2$); $P(A \cup B) = 0.7$. (3) $1 - \dfrac18 = \dfrac78$.
