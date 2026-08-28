---
title: 가우스 소거법 (Gaussian Elimination)
date: 2026-08-20
tags: matrix, linear-algebra
order: 
featured: false
draft: false
---

# 가우스 소거법 (Gaussian Elimination)

$Ax=v$의 해는 이론상 $x=A^{-1}v$지만, 행렬이 커질수록 [역행렬](../determinant-column-space-null-space/main.md)을 직접 구하는 건 비효율적이다. **가우스 소거법**은 역행렬을 계산하지 않고도 연립방정식을 바로 푸는 절차다 — 방정식을 하나씩 이용해 미지수를 순서대로 지워나간다(消去, elimination).

## 예시로 먼저

```
 x + y + z = 6
2x + y - z = 1
 x - y + z = 2
```

1. 첫 방정식을 이용해 아래 두 식에서 $x$를 지운다 (행끼리 빼서 계수를 0으로 만듦)
2. 남은 두 식으로 이번엔 $y$를 지운다
3. 맨 아래엔 미지수가 하나만 남은 식이 남는다 → $z$ 값이 바로 나옴
4. 구한 $z$를 위 식에 대입(**후진대입, back substitution**)해서 $y$, 그다음 $x$ 순으로 구한다

위→아래로 지우고(forward elimination), 아래→위로 대입하는(back substitution) 이 두 단계가 가우스 소거법의 전부다.

## 행렬로 보면 — row echelon form

계수와 우변을 하나로 붙인 **첨가행렬(augmented matrix)** $[A\,|\,v]$에 아래 세 가지 **행 연산**만 반복해서 위쪽이 계단 모양이 되게 만드는 것과, 위 과정은 완전히 같다:

- 두 행을 교환한다
- 한 행에 0이 아닌 상수를 곱한다
- 한 행에 다른 행의 배수를 더하거나 뺀다

이 세 연산은 방정식이 나타내는 관계 자체는 바꾸지 않고 표현만 정리하는 것이므로 **해를 바꾸지 않는다.** 이렇게 만들어진 계단 모양을 **row echelon form**이라 부르고, 그 안에서 완전히 0으로만 채워지지 않은 행의 개수가 곧 그 행렬의 **rank**다.
