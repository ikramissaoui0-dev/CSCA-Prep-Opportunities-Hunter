---
title: Quick Review & Formulas
minutes: 8
---

## One-page summary

**Sets.** A set is a collection of distinct, unordered elements: roster $\{1, 2, 3\}$, set-builder $\{x \mid P(x)\}$, interval $[a, b]$. $\mathbb{N}$ includes $0$ in the Chinese convention.

**Operations.** $A \cup B$ (or), $A \cap B$ (and), $A \setminus B$ (in $A$ not $B$), $A'$ (complement).

**Key formulas.**

- $|A \cup B| = |A| + |B| - |A \cap B|$.
- $|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |B \cap C| - |A \cap C| + |A \cap B \cap C|$.
- A set with $n$ elements has $2^n$ subsets, $2^n - 1$ proper subsets, $2^n - 2$ non-empty proper subsets.
- De Morgan: $(A \cup B)' = A' \cap B'$, $(A \cap B)' = A' \cup B'$.
- $A \subseteq B \iff A \cap B = A \iff A \cup B = B$.

**Inequalities.**

| Type | Rule |
|---|---|
| Linear | flip the sign when multiplying/dividing by a negative |
| Quadratic ($a > 0$) | $f > 0$ outside the roots, $f < 0$ between them |
| Always true | $a > 0$ and $\Delta < 0$ |
| $\lvert f\rvert < a$ | $-a < f < a$ |
| $\lvert f\rvert > a$ | $f < -a$ or $f > a$ |
| Rational | $\dfrac fg > 0 \iff fg > 0$; never multiply by $g$ |
| Vieta | $x_1 + x_2 = -\dfrac ba$, $x_1x_2 = \dfrac ca$ |

**Interval notation.** $[a, b]$ closed, $(a, b)$ open, $\infty$ always with a round bracket.

## Common slips

- Mixing up $\cup$ and $\cap$.
- Forgetting to flip the inequality sign.
- Forgetting $\varnothing$ or $\mathbb{N}$ containing $0$.
- Including a zero of the denominator.

## Quick check

1. $|A| = 12$, $|B| = 9$, $|A \cap B| = 4$. Find $|A \cup B|$.
2. Solve $x^2 - 3x - 4 < 0$.
3. Solve $|x - 1| \ge 2$.

**Answers.** (1) $17$. (2) $(-1, 4)$. (3) $x \le -1$ or $x \ge 3$.
