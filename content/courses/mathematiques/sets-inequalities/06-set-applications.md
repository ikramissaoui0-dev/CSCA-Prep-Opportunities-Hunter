---
title: Set Applications
minutes: 10
---

## What you will learn

- how to translate a word problem into set language;
- survey, classification and divisibility counting problems;
- "at least / exactly / at most" language.

## 1. Translating words into sets

| In words | In sets |
|---|---|
| at least one | $A \cup B$ |
| both / and | $A \cap B$ |
| either ... or (inclusive) | $A \cup B$ |
| exactly one | $(A \cup B) \setminus (A \cap B)$ |
| neither / none | $(A \cup B)'$ |
| only $A$ | $A \setminus B$ |
| at most one | everything except $A \cap B$ |

Strategy: (1) name the sets; (2) draw a Venn diagram; (3) fill the intersection first; (4) answer the question that was asked, and check that the pieces add up to the total.

## 2. Survey problems

**Example 1.** 200 students: 120 study Biology, 100 study Chemistry, 50 study both. Exactly one subject: $(120 - 50) + (100 - 50) = 120$. At least one: $120 + 100 - 50 = 170$. Neither: $200 - 170 = 30$.

**Example 2.** In a class of 60, 35 play music, 28 play sport and 12 do both: $35 + 28 - 12 = 51$ play at least one, so $9$ do neither.

**Example 3 (three sets).** In a group of 100, 45 like football, 40 like tennis, 30 like swimming; 15 like football and tennis, 10 football and swimming, 12 tennis and swimming; 6 like all three. At least one: $45 + 40 + 30 - 15 - 10 - 12 + 6 = 84$; so $16$ like none.

## 3. Classification and divisibility

The number of multiples of $k$ in $\{1, \dots, N\}$ is $\left\lfloor \dfrac Nk \right\rfloor$. Numbers divisible by both $a$ and $b$ are the multiples of $\operatorname{lcm}(a, b)$ — **not** of the gcd.

**Example 4.** From $\{1, \dots, 50\}$, how many are divisible by $2$ or $3$? Multiples of 2: $25$; of 3: $16$; of 6: $8$. Answer: $25 + 16 - 8 = 33$. Divisible by neither: $17$.

**Example 5.** How many integers from 1 to 100 are divisible by 3 but not by 5? Multiples of $3$: $33$; of $15$: $6$. Answer: $33 - 6 = 27$.

## 4. "At least / exactly / at most" with numbers

If $x_k$ is the number of people in exactly $k$ of three sets, then the people counted by the sum $|A| + |B| + |C|$ satisfy $|A| + |B| + |C| = x_1 + 2x_2 + 3x_3$. This lets you recover a missing value.

## Common mistakes

- Using the gcd instead of the lcm when counting common multiples.
- Counting "exactly one" as "at least one".
- Forgetting the people who belong to none of the sets.

## Practice problems

1. Of 80 people, 50 drink tea, 40 drink coffee and 15 drink neither. How many drink both?
2. How many integers from 1 to 60 are divisible by 4 or 6?

**Answers.** (1) $80 - 15 = 65$ drink at least one: $50 + 40 - x = 65$, so $x = 25$. (2) $15 + 10 - 5 = 20$ (lcm of 4 and 6 is $12$, with $5$ multiples).
