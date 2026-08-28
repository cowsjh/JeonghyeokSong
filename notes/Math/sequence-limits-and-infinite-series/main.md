---
title: 수열의 극한과 무한급수
date: 2026-08-27
tags: sequence, limit
order: 
featured: false
draft: false
---

# 수열의 극한과 무한급수

- **수열의 극한** $\lim_{n\to\infty} a_n$: $n$을 한없이 키울 때 $a_n$이
  다가가는 값. 존재하면 수렴, 없으면 발산.
- **무한급수** $\sum_{n=0}^\infty a_n$의 수렴/발산: 부분합 $S_n$의 극한이
  존재하는지로 판단. 특히 $|r|<1$인 등비급수([등비수열](../arithmetic-and-geometric-sequences/main.md)의
  부분합에서 $n\to\infty$ 극한을 취한 형태)는
  $$\sum_{n=0}^\infty a_1 r^n = \frac{a_1}{1-r}$$
  로 수렴 — 이 형태가 **거듭제곱급수(power series)**와 **테일러 급수**의
  가장 단순한 예이며, 5장 급수해법에서 ODE의 해를 급수 형태로 가정할 때
  바로 이 수렴 개념이 필요함.
- 실제 응용으로 [오일러 공식](../euler-formula/main.md)이 $e^x$의 매클로린 급수(테일러 급수의
  특수형)를 $\cos\theta$·$\sin\theta$ 급수로 재조립해 유도되며, 거기서 항을 더할수록
  급수가 수렴하는 걸 직접 확인한다 — 여기 수렴 개념이 그대로 쓰이는 대표 사례다.
