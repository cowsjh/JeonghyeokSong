---
title: Tuple Unpacking 튜플 언패킹
date: 2022-10-20
tags: Tip, Tuple
---
```python
numbers = (1, 2, 3)
a, b, c = numbers
print(a)
print(b)
print(c)
```

튜플의 인자를 언팩 하는법

```python
a, b, *c, d = [1, 2, 3, 4, 5, 6, 7, 8, 9]

print(a)
print(b)
print(c)
print(d)
```

`*`는 한번 밖에 쓸 수 없고 리스트를 반환한다.
