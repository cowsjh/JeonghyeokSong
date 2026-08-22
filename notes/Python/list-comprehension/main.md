---
title: List Comprehension
date: 2026-08-08
tags: tip, functional
order: 
featured: false
draft: false
---

# List Comprehension

`[표현식 for 변수 in iterable if 조건]` : 반복문 + 조건문을 한 줄로 표현해 새 컬렉션을 만든다.

## 1. List Comprehension
```python
squares = [x**2 for x in range(5)]
print(squares)
>>> [0, 1, 4, 9, 16]

evens = [x for x in range(10) if x % 2 == 0]
print(evens)
>>> [0, 2, 4, 6, 8]

labels = ["even" if x % 2 == 0 else "odd" for x in range(4)]
print(labels)
>>> ['even', 'odd', 'even', 'odd']
```
`for` 뒤 `if`는 필터(값 걸러내기), `for` 앞 `if...else`는 값 변환(삼항 표현식) — 위치가 다르면 역할도 다르다. [map 함수](../map/main.md)와 비슷한 일을 하지만, `map`은 기존 함수를 그대로 적용할 때, comprehension은 조건 필터링이나 값 변환이 섞일 때 더 간결하다.

## 2. Dict Comprehension
```python
squares_dict = {x: x**2 for x in range(4)}
print(squares_dict)
>>> {0: 0, 1: 1, 2: 4, 3: 9}

original = {"a": 1, "b": 2}
inverted = {v: k for k, v in original.items()}
print(inverted)
>>> {1: 'a', 2: 'b'}
```

## 3. Set Comprehension
```python
words = ["cat", "dog", "owl", "ant"]
unique_lengths = {len(w) for w in words}
print(unique_lengths)
>>> {3}
```

## 4. Generator Expression
```python
gen = (x**2 for x in range(5))
print(sum(gen))
>>> 30
```
`[]` 대신 `()`를 쓰면 리스트를 한 번에 만들지 않고 값을 하나씩 계산한다 — 큰 데이터를 순회만 할 때 메모리를 아낀다.

## 5. Nested Comprehension
```python
matrix = [[1, 2, 3], [4, 5, 6]]
flat = [x for row in matrix for x in row]
print(flat) 
>>> [1, 2, 3, 4, 5, 6]
```
바깥 `for`부터 안쪽 `for` 순서로 읽는다 (일반 for-loop를 그대로 풀어 쓴 순서와 동일).

중첩이 2단계를 넘어가면 가독성이 떨어지므로 일반 for-loop를 쓰는 게 낫다.
