---
title: 미분
date: 2026-08-06
tags: differentiation
order: 
featured: false
draft: false
---

# 미분

## 도함수의 정의

$$f'(x) = \lim_{h\to 0}\frac{f(x+\Delta)-f(x)}{\Delta}$$

평균변화율(기울기)의 [극한](../limits-and-continuity/main.md) = 순간변화율. 정의를 외우기보다는 "왜 이렇게 정의하는가"를
한 번은 그래프로 이해해둘 것.

## 기본 미분법칙

$$(f\pm g)' = f'\pm g'$$
$$(fg)' = f'g + fg' \quad \text{(곱의 미분법)}$$
$$\left(\frac{f}{g}\right)' = \frac{f'g-fg'}{g^2} \quad \text{(몫의 미분법)}$$

## 연쇄법칙 (Chain Rule) — 가장 중요

$$\{f(g(x))\}' = f'(g(x))\cdot g'(x)$$

**공업수학 전체에서 가장 많이 쓰이는 미분 기법입니다.**

$$\frac{d}{dx} e^{-3x} = e^{-3x}\cdot(-3) = -3e^{-3x}$$
$$\frac{d}{dx} \sin(\omega x) = \omega\cos(\omega x)$$
$$\frac{d}{dx} \ln(x^2+1) = \frac{2x}{x^2+1}$$

라플라스 변환의 $e^{-st}f(t)$, ODE의 $e^{\lambda x}$ 등 지수함수 안에 변수가 곱해진
형태를 미분/[적분](../integration/main.md)할 때마다 연쇄법칙이 자동으로 들어갑니다.

## 기본함수의 도함수 (암기)

| $f(x)$ | $f'(x)$ |
|---|---|
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \ln a$ |
| $\ln x$ | $1/x$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2 x$ |
| $\sinh x$ | $\cosh x$ |
| $\cosh x$ | $\sinh x$ |
| $\tan^{-1}x$ | $\dfrac{1}{1+x^2}$ |

마지막 두 줄(쌍곡선함수, 역삼각함수)은 강의노트 1장 예비자료에 그대로 나오는
내용이니 꼭 챙길 것.

## 음함수의 미분 

$x^2+y^2=1$처럼 $y$가 $x$에 대해 음함수로 주어질 때 양변을 $x$로 미분하고
$y' $에 대해 정리하는 방법. 공업수학에서 자주 쓰이진 않지만 알아두면 좋음.

