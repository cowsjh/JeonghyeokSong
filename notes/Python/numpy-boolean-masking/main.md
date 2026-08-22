---
title: 불리언 마스킹
date: 2026-08-08
tags: boolean-mask
order: 
featured: false
draft: false
---

# 불리언 마스킹

벡터화의 큰 강점을 여기서 볼 수 있다.

```python
scan = np.array([3, 4, 2, 6, 1,10])
near = scan<5
middle = near & (scan > 2)
valid = scan[near]
```

조건문으로 반복문 없이 자료에서 bool을 자료형을 만들어낼 수 있다. 그후 그것을 이용하여 True 만 걸러 낼 수 있다.
또한, 이중 조건문으로 도 사용 가능하다.

---

다른 NumPy 함수들은 [NumPy 기본 함수](../numpy-basic-functions/main.md) 참고.
