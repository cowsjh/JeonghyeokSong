---
title: 시간 복잡도
date: 2026-08-08
tags: algorism
order: 
featured: false
draft: false
---

# 시간 복잡도

알고리즘이 실행되는데 걸리는 시간, 주요 로직의 반복횟수를 중점으로 측정 된다.

```cpp
for ( int i = 0; i < n; ++i )
{
	//n
	for ( int j = 0; j < n; ++ j)
	{
		//n^2
	}
}
```
n번 반복되는 반복문이 중복 되면 차수가 늘어 나게 되고
간단히 표현 하기 위해 시간 복잡도의 최고 차수를 이용해 Big-O 표기법을 쓴다.

$$
O(1)
$$
$$O(n)$$
자료의 순서와 크기에 따라 시간 복잡도는 다양하게 나오며, 그차이를 `worstcase` `averagecase` `bestcase` 로 나눌 수 있다. 

> [!NOTE]
> **알고리즘의 시간 복잡도는 대부분 average case 를 말하지만 구하기 어려워 비슷한 worst case로 취급한다.**

예시로 [정렬](../../Python/list-sort-by-index/main.md)에서 쓰는 파이썬의 `sorted()`는 팀소트(Timsort) 알고리즘이라 O(n log n)의 시간 복잡도를 갖는다.

