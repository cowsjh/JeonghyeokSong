---
title: 지수법칙 Laws of Exponents
date: 2026-08-18
tags: algebra, function
order: 
featured: false
draft: false
---

# 지수법칙 Laws of Exponents

## 지수 법칙

$$a^m \cdot a^n = a^{m+n}, \qquad \frac{a^m}{a^n} = a^{m-n}, \qquad (a^m)^n = a^{mn}$$

$$(ab)^n = a^n b^n, \qquad a^{1/n} = \sqrt[n]{a}$$

## $a^0=1$, $a^{-n}$

$2^3=8,\ 2^2=4,\ 2^1=2$ — 지수가 1씩 줄 때마다 값은 계속 반으로 준다. 이 패턴을
0 밑으로 그대로 이어가면:

$$2^0 = 1, \qquad 2^{-1}=\frac12, \qquad 2^{-2}=\frac14$$

즉 $a^0=1$, $a^{-n}=\dfrac{1}{a^n}$은 규칙을 새로 만든 게 아니라 곱셈 패턴을
음의 지수까지 **일관되게 연장**한 결과다.

## 왜 지수를 더하기만 하면 되는가

$2^3 \cdot 2^2$를 풀어 쓰면 $(2\cdot2\cdot2)\cdot(2\cdot2) = 2^5$. 그냥 2를 3번 곱하고
2번 더 곱한 것 = 2를 총 5번 곱한 것. 그래서 밑이 같은 곱셈은 지수의 **덧셈**으로
바뀐다 — 아래 법칙들은 전부 이 패턴의 확장이다.


- 로그는 이 법칙을 정확히 거꾸로 뒤집은 것 — [로그법칙 Laws of Logarithms](../laws-of-logarithms/main.md)
- $e^{-x}$ 형태의 지수가 그대로 등장하는 예: 시그모이드 함수 Sigmoid Function
