---
title: 근의 공식
date: 2026-08-24
tags: algebra
order: 
featured: false
draft: false
---

# 근의 공식

## 기본 공식
$$ ax² + bx + c = 0$$
$$(x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a})$$

## 짝수 공식

$$ ax² + 2b'x + c = 0$$
$x$ 앞의 계수 $b$가 짝수일 때,
$$(x = \frac{-b' \pm \sqrt{{b'}^2 - ac}}{a})$$
으로 나타낼 수 있다.

## 판별식 (Discriminant)

$$D = b^2-4ac$$

근호 안의 부호를 결정하는 값:

- $D>0$: 서로 다른 두 실근
- $D=0$: 중근
- $D<0$: 서로 다른 두 허근

이 판별이 2계 ODE의 특성방정식에서 그대로 재사용됨 (감쇠 진동 문제에서
$D<0$이면 진동하는 해, $D\ge 0$이면 진동 없이 감쇠하는 해가 나옴) — 행렬
고유값을 구할 때 등장하는 [특성방정식](../characteristic-equation/main.md)도 결국 같은 이차방정식 판별 구조다.