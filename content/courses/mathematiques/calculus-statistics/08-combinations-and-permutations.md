---
title: Combinations & Permutations
minutes: 12
---

## What you will learn

- the addition and multiplication principles;
- permutations, combinations and when to use each;
- classic techniques (adjacent, non-adjacent, groups) and the binomial theorem.

## 1. Two counting principles

- **Addition principle**: if a task can be done in $m$ ways **or** in $n$ ways (no overlap), there are $m + n$ ways.
- **Multiplication principle**: if a task has step 1 in $m$ ways **and then** step 2 in $n$ ways, there are $mn$ ways.

**Factorial**: $n! = n(n - 1)\cdots2\cdot1$, with $0! = 1$.

## 2. Permutations and combinations

$$
P(n, k) = \frac{n!}{(n - k)!}, \qquad C(n, k) = \binom nk = \frac{n!}{k!\,(n - k)!}, \qquad \binom nk = \binom n{n-k}, \qquad \binom{n+1}k = \binom nk + \binom n{k-1}.
$$

**When to use which?** Order matters (arrangements, rankings, codes): permutations. Order does not matter (committees, hands, subsets): combinations.

**Example 1.** Arrange $4$ books from $7$ on a shelf: $P(7, 4) = 840$. Choose $5$ students from $12$: $\binom{12}5 = 792$. A pizza with $3$ toppings out of $8$: $\binom83 = 56$.

## 3. Techniques

- **Adjacent items**: glue them into one block, then multiply by the internal arrangements.
- **Non-adjacent items**: arrange the others first, then place the items in the gaps.
- **Restrictions**: handle the special position first.
- **Identical objects**: $\dfrac{n!}{n_1!\,n_2!\cdots}$ (letters of "BANANA": $\dfrac{6!}{3!\,2!} = 60$).
- **Circular arrangements** of $n$ distinct objects: $(n - 1)!$.
- **"At least"**: use the complement.

**Example 2.** Five people in a row with $A$, $B$ adjacent: $2 \cdot 4! = 48$; not adjacent: $5! - 48 = 72$.

**Example 3.** Choose $3$ from $4$ boys and $2$ girls with at least one girl: $\binom63 - \binom43 = 16$.

**Example 4.** Four-digit numbers from digits $1$–$5$ (no repetition) that are even: last digit $2$ or $4$ ($2$ ways), then $4 \cdot 3 \cdot 2 = 24$: total $48$.

**Example 5.** Splitting $6$ people into two groups of $3$: $\dfrac{\binom63}2 = 10$ (divide by the number of equal groups' orderings).

## 4. The binomial theorem

$$
(a + b)^n = \sum_{k=0}^n\binom nka^{n-k}b^k, \qquad T_{k+1} = \binom nka^{n-k}b^k, \qquad \sum_{k=0}^n\binom nk = 2^n.
$$

**Example 6.** Coefficient of $x^3$ in $(1 + 2x)^5$: $\binom53 2^3 = 80$.

**Example 7.** Constant term of $\left(x + \dfrac1x\right)^6$: $T_{k+1} = \binom6kx^{6-2k}$, $6 - 2k = 0$, $k = 3$: $20$.

## Common mistakes

- Using permutations when order does not matter.
- Double counting in "at least" problems.
- Forgetting $0! = 1$.

## Practice problems

1. Three-letter arrangements from $5$ distinct letters.
2. Number of ways to choose a committee of $4$ from $9$ people.
3. Coefficient of $x^2$ in $(x - 2)^4$.

**Answers.** (1) $60$. (2) $126$. (3) $\binom42(-2)^2 = 24$.
