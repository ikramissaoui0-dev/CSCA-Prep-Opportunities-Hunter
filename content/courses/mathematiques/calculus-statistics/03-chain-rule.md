---
title: Chain Rule
minutes: 8
---

## What you will learn

- the chain rule for composite functions;
- how to recognise when to use it;
- combinations with the product and quotient rules.

## 1. The rule

If $y = f(g(x))$ then

$$
\frac{dy}{dx} = f'(g(x))\cdot g'(x).
$$

In Leibniz notation: if $y = f(u)$ and $u = g(x)$, then $\dfrac{dy}{dx} = \dfrac{dy}{du}\cdot\dfrac{du}{dx}$. In words: **differentiate the outside, keep the inside, multiply by the derivative of the inside.**

## 2. Recognising when to use it

Whenever a function is applied to something other than plain $x$: $(\ldots)^n$, $\sin(\ldots)$, $e^{(\ldots)}$, $\ln(\ldots)$, $\sqrt{\ldots}$.

**Example 1.** $y = (2x - 5)^7$: $y' = 7(2x - 5)^6 \cdot 2 = 14(2x - 5)^6$.

**Example 2.** $y = \cos(3x^2)$: $y' = -\sin(3x^2) \cdot 6x = -6x\sin(3x^2)$.

**Example 3.** $y = e^{x^2 + 1}$: $y' = 2xe^{x^2 + 1}$.

**Example 4.** $y = \ln(\sin x)$: $y' = \dfrac{\cos x}{\sin x} = \cot x$.

**Example 5.** $y = \sqrt{x^2 + 1}$: $y' = \dfrac{2x}{2\sqrt{x^2 + 1}} = \dfrac x{\sqrt{x^2 + 1}}$.

**Example 6.** $y = \sin^2x = (\sin x)^2$: $y' = 2\sin x\cos x = \sin2x$.

**Example 7.** $y = \ln(3x + 1)$: $y' = \dfrac3{3x + 1}$. In general $(\ln u)' = \dfrac{u'}u$ and $(e^u)' = u'e^u$.

## 3. Nested and combined

Apply the rule repeatedly from the outside in.

**Example 8.** $y = e^{\sin 2x}$: $y' = e^{\sin2x}\cdot\cos2x\cdot2$.

**Example 9 (with the product rule).** $y = x\sqrt{1 - x^2}$: $y' = \sqrt{1 - x^2} + x\cdot\dfrac{-2x}{2\sqrt{1 - x^2}} = \dfrac{1 - 2x^2}{\sqrt{1 - x^2}}$.

## Common mistakes

- Forgetting to multiply by the inner derivative.
- Applying the chain rule when it is not needed ($(x^2)' = 2x$ has an inner $x$ with derivative $1$).
- Mixing up the order of differentiation in nested functions.

## Practice problems

1. $y = (x^2 + 3)^5$.
2. $y = \sin(2x + 1)$.
3. $y = \ln(x^2 + 1)$.

**Answers.** (1) $10x(x^2 + 3)^4$. (2) $2\cos(2x + 1)$. (3) $\dfrac{2x}{x^2 + 1}$.
