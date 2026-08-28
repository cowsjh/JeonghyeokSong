---
title: 등차수열과 등비수열
date: 2026-08-27
tags: algebra, sequence
order: 
featured: false
draft: false
---

# 등차수열과 등비수열

## 등차수열 (공차 $d$만큼 계속 더하는 수열) 

$$a_n = a_1+(n-1)d$$
  $$S_n = \dfrac{n(a_1+a_n)}{2}$$
## 등비수열 (공비 $r$만큼 계속 곱하는 수열): 

$$a_n = a_1 r^{n-1}$$
  $$S_n = \dfrac{a_1(1-r^n)}{1-r}\ (r\ne1)$$

응용: 이 두 공식이 [수열의 극한과 무한급수](../sequence-limits-and-infinite-series/main.md)로
넘어가는 출발점 — 등비수열의 부분합 $S_n$에서 $n\to\infty$ 극한을 취하면
등비급수의 수렴 공식이 나온다.
