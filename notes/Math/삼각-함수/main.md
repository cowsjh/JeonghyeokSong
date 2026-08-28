---
title: 삼각함수와 단위원
date: 2026-08-11
tags: trigonometry
order: 
featured: false
draft: false
---

# 삼각함수와 단위원

참고: https://mathbang.net/509

단위원(반지름 1인 원) 위의 점 P(x, y)와 각도 $\theta$를 이용해 삼각함수를 정의하면 이해가 쉬워진다.

## 정의

직각삼각형에서 빗변을 $r$, 밑변을 $x$, 높이를 $y$라 하면

- $\cos\theta = x/r$ — 빗변 대비 밑변의 비율
- $\sin\theta = y/r$ — 빗변 대비 높이의 비율
- $\tan\theta = y/x$ — 밑변 대비 높이의 비율

단위원에서는 $r=1$이므로 식이 단순해진다.

- $\cos\theta = x$ → 점 P의 x좌표
- $\sin\theta = y$ → 점 P의 y좌표
- $\tan\theta = y/x$, 단 $x=0$(=90°)일 때는 정의되지 않는다

## 그래프와의 연결

$\theta$가 0부터 커지면서 P가 단위원을 따라 회전하면, 그때그때의 x좌표를 세로축에 옮긴 것이 $\cos$ 그래프, y좌표를 옮긴 것이 $\sin$ 그래프다. $\theta=0$일 때 $\cos(0)=1$, $\sin(0)=0$인 이유가 여기서 나온다.

## 활용

각도(회전)를 주기적인 값이나 패턴, 파형으로 바꾸고 싶을 때 쓴다. 예를 들어 시간에 따라 변하는 회전각을 $\sin/\cos$에 넣으면 진동·순환 움직임이나 반복 패턴을 만들 수 있다. 각도 입력은 라디안 단위를 쓰는 경우가 많다.

공업수학에서는 각도를 거의 항상 라디안으로 다룸 ($180^\circ = \pi$). $\dfrac{d}{dx}\sin x=\cos x$
같은 미분 공식도 $x$가 라디안일 때만 성립하므로 도(degree) 습관을 버릴 것.

관련: [오일러 공식](../euler-formula/main.md), [삼각함수 덧셈정리와 반각공식](../trig-addition-and-half-angle-formulas/main.md)
