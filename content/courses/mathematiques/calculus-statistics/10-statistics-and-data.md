---
title: Statistics & Data
minutes: 12
---

## What you will learn

- measures of centre and spread, quartiles and outliers;
- the effect of linear transformations;
- histograms, grouped data, regression and correlation.

## 1. Centre

For data $x_1, \dots, x_n$: **mean** $\bar x = \dfrac{\sum x_i}n$; **median** = middle value of the sorted data (average of the two middle values if $n$ is even); **mode** = most frequent. The mean is sensitive to outliers; the median is not. **Weighted mean**: $\dfrac{\sum f_ix_i}{\sum f_i}$.

**Example 1.** Data $3, 5, 7, 7, 9$: mean $6.2$, median $7$, mode $7$.

## 2. Spread

$$
s^2 = \frac1n\sum(x_i - \bar x)^2 = \frac1n\sum x_i^2 - \bar x^2, \qquad s = \sqrt{s^2}.
$$

(The *sample* variance uses $n - 1$; follow the convention stated in the question.) **Range** $= \max - \min$. **Quartiles**: $Q_2$ = median; $Q_1$, $Q_3$ = medians of the lower/upper halves; $\text{IQR} = Q_3 - Q_1$.

**Example 2.** Data $2, 4, 6, 8, 10, 12$: $Q_2 = 7$, $Q_1 = 4$, $Q_3 = 10$, IQR $= 6$.

**Example 3 (population variance).** Data $4, 6, 8$: $\bar x = 6$, $s^2 = \dfrac{4 + 0 + 4}3 = \dfrac83$.

**Outliers**: values below $Q_1 - 1.5\,\text{IQR}$ or above $Q_3 + 1.5\,\text{IQR}$.

## 3. Linear transformations

If $y_i = ax_i + b$: $\bar y = a\bar x + b$, $s_y^2 = a^2s_x^2$, $s_y = |a|s_x$. Adding a constant shifts the mean but leaves the spread unchanged.

**Example 4.** Data $1, 2, 3, 4, 5$: $\bar x = 3$, $s^2 = 2$. Doubling and adding $1$: mean $7$, variance $8$.

## 4. Histograms and grouped data

In a histogram the **area** of each bar represents frequency, so the height is $\dfrac{\text{frequency}}{\text{class width}}$. For grouped data use class midpoints $m_i$: $\bar x = \dfrac{\sum f_im_i}{\sum f_i}$. The median splits the total area in half.

**Example 5.** Classes $[0, 10)$, $[10, 20)$, $[20, 30)$ with relative frequencies $0.2, 0.5, 0.3$: estimated mean $0.2 \cdot 5 + 0.5 \cdot 15 + 0.3 \cdot 25 = 16$; median $10 + \dfrac{0.5 - 0.2}{0.5}\cdot10 = 16$.

**Skewness**: mean $>$ median means right-skewed (long right tail).

## 5. Regression and correlation

The least-squares line $\hat y = \hat bx + \hat a$ has

$$
\hat b = \frac{\sum x_iy_i - n\bar x\bar y}{\sum x_i^2 - n\bar x^2}, \qquad \hat a = \bar y - \hat b\bar x,
$$

so it always passes through $(\bar x, \bar y)$. The correlation coefficient $r \in [-1, 1]$: $|r|$ near $1$ means a strong linear relationship; its sign matches the slope. **Correlation is not causation.**

**Example 6.** Points $(1, 2), (2, 3), (3, 5)$: $\bar x = 2$, $\bar y = \tfrac{10}3$, $\sum xy = 23$, $\sum x^2 = 14$; $\hat b = \dfrac{23 - 20}{14 - 12} = \dfrac32$, $\hat a = \dfrac13$.

## Common mistakes

- Reading histogram heights as frequencies when class widths differ.
- Forgetting that variance scales by $a^2$.
- Confusing mean and median for skewed data.

## Practice problems

1. Mean and variance of $4, 6, 8, 10$.
2. $x_i$ have mean $3$ and variance $2$. Mean and variance of $2x_i - 1$.
3. Find $Q_1$, $Q_3$ for $2, 4, 6, 8, 10$ (exclude the median).

**Answers.** (1) $7$ and $5$. (2) $5$ and $8$. (3) $Q_1 = 3$, $Q_3 = 9$.
