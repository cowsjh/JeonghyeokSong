---
title: 유리함수 Rational Function
date: 2026-08-22
tags: algebra, function
order: 
featured: false
draft: false
---

# 유리함수 Rational Function

$$f(x) = \frac{P(x)}{Q(x)}$$

분자 $P(x)$와 분모 $Q(x)$가 둘 다 다항식이면 $f(x)$는 유리함수다.

예: $f(x) = \dfrac{x+1}{x-2}$는 유리함수.
반면 $\sqrt{x}$나 $\sin x$는 다항식의 비율로 못 쓰니 유리함수가 아니다(각각 무리함수·초월함수).

## 행렬로 확장 — 나눗셈이 없는 곳에서

행렬에는 나눗셈 연산 자체가 없지만, 역행렬 $A^{-1}$을 곱하는 것이 그 역할을 대신한다(스칼라의 $1/a$에 대응). 그래서 $R=(I-K)(I+K)^{-1}$처럼 행렬을 "다항식/다항식" 꼴로 조합한 식도 유리함수라 부른다 — 지수함수($\exp$)의 무한급수 없이 사칙연산만으로 끝나서 "대수적(algebraic)"이라고도 한다. 실제 사용 예: 케일리 변환.

- 지수·로그와 짝을 이루는 다항식 계열 함수: [지수법칙 Laws of Exponents](../laws-of-exponents/main.md)
