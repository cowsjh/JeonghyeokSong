---
title: 로그법칙 Laws of Logarithms
date: 2026-08-18
tags: algebra, function
order: 
featured: false
draft: false
---

# 로그법칙 Laws of Logarithms

$\log_a x$ = "a를 몇 제곱해야 $X$가 되는가?"

$$\log_a x = y \iff a^y = x$$

로그와 지수는 서로 역함수 관계 — [지수법칙 Laws of Exponents](../laws-of-exponents/main.md)를 뒤집은 것뿐이다.

## 로그 법칙

지수법칙에서 곱셈이 덧셈으로 바뀌었듯, 로그법칙에서는 **곱셈이 덧셈으로 "내려온다"**:

$$\log_a(xy) = \log_a x + \log_a y, \qquad \log_a\frac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^n = n\log_a x$$

$$\log_a a = 1, \qquad \log_a 1 = 0$$

## 밑변환 공식

$$\log_a x = \frac{\ln x}{\ln a}$$

계산기·프로그램은 대부분 자연로그($\ln$)나 상용로그($\log_{10}$)만 지원하므로,
임의의 밑을 계산할 때 이 공식으로 바꿔서 쓴다.

## 자연로그와 $e$

$\ln x = \log_e x$, $e \approx 2.71828\ldots$. $e$가 특별한 이유는
$\dfrac{d}{dx}e^x=e^x$
미분해도 자기 자신이 나오는 유일한 지수함수의 밑이기 때문


- $e^{-x}$가 실제로 쓰이는 예: 시그모이드 함수 Sigmoid Function
