---
title: for 문 사용법
date: 2026-08-08
tags: control-flow
order: 
featured: false
draft: false
---

# for 문 사용법

## 기본 순회

- `for x in range(n)` — 0~n-1 정수 순회
  ```python
  for i in range(5):
      print(i)
  # 0 1 2 3 4 (줄마다)
  ```
- `for x in range(a, b, step)` — 시작/끝/증분 지정
  ```python
  for i in range(10, 0, -2):
      print(i)
  # 10 8 6 4 2 (줄마다)
  ```
- `for x in 리스트` — 원소 직접 순회
  ```python
  for name in ["Ann", "Bob"]:
      print(name)
  # Ann / Bob
  ```
- `for ch in 문자열` — 문자 단위 순회
  ```python
  for ch in "abc":
      print(ch)
  # a / b / c
  ```

## 인덱스 + 값 동시에

- `enumerate(iterable)` — (인덱스, 값) 튜플 생성
  ```python
  for i, v in enumerate(["a", "b"]):
      print(i, v)
  # 0 a / 1 b
  ```
- `enumerate(iterable, start=n)` — 인덱스 시작값 지정
  ```python
  for i, v in enumerate(["a", "b"], start=1):
      print(i, v)
  # 1 a / 2 b
  ```

## 여러 시퀀스 동시 순회

- `zip(a, b)` — 여러 iterable을 짝지어 튜플로 순회
  ```python
  for x, y in zip([1, 2], ["a", "b"]):
      print(x, y)
  # 1 a / 2 b
  ```
- `zip(a, b, c)` — 3개 이상도 가능
  ```python
  for x, y, z in zip([1], [2], [3]):
      print(x, y, z)
  # 1 2 3
  ```

> `zip()`은 가장 짧은 iterable 길이에 맞춰 멈춘다 — 길이가 다르면 남는 원소는 조용히 버려진다.

## 딕셔너리 순회

- `for k in d` — 키만 순회 (기본값)
  ```python
  for k in {"a": 1, "b": 2}:
      print(k)
  # a / b
  ```
- `for k in d.keys()` — 키만 순회 (명시적)
  ```python
  for k in {"a": 1, "b": 2}.keys():
      print(k)
  # a / b
  ```
- `for v in d.values()` — 값만 순회
  ```python
  for v in {"a": 1, "b": 2}.values():
      print(v)
  # 1 / 2
  ```
- `for k, v in d.items()` — 키-값 쌍 동시 순회
  ```python
  for k, v in {"a": 1, "b": 2}.items():
      print(k, v)
  # a 1 / b 2
  ```

## 중첩 반복문 제어

- `break` — 현재 반복문 즉시 종료
  ```python
  for x in [1, 2, 3, 4]:
      if x == 3:
          break
      print(x)
  # 1 / 2
  ```
- `continue` — 현재 회차만 건너뛰고 다음 회차로
  ```python
  for x in [1, 2, 3, 4]:
      if x % 2 == 0:
          continue
      print(x)
  # 1 / 3
  ```
- `for ... else` — break 없이 반복문이 끝까지 실행되면 `else` 블록 실행
  ```python
  target = 5
  lst = [1, 2, 3]
  for x in lst:
      if x == target:
          found = True
          break
  else:
      found = False  # break 없이 끝까지 돌면 실행됨

  print(found)
  # False (target=5가 lst에 없어 else까지 실행됨)
  ```

> `for-else`는 "찾으면 즉시 멈추고, 못 찾고 끝까지 돌면 처리"하는 탐색 패턴에 유용하다. `break`로 빠져나오면 `else`는 건너뛴다.

## 컴프리헨션 (for문의 축약형)

- 리스트 컴프리헨션 — `[표현식 for x in iterable]`
  ```python
  [x**2 for x in range(5)]
  # [0, 1, 4, 9, 16]
  ```
- 조건 필터링 — `[표현식 for x in iterable if 조건]`
  ```python
  [x for x in [-2, -1, 0, 1, 2] if x > 0]
  # [1, 2]
  ```
- 조건부 표현식 포함 — `[A if 조건 else B for x in iterable]`
  ```python
  ["짝" if x % 2 == 0 else "홀" for x in [1, 2, 3]]
  # ['홀', '짝', '홀']
  ```
- 딕셔너리 컴프리헨션 — `{k: v for x in iterable}`
  ```python
  {x: x**2 for x in range(3)}
  # {0: 0, 1: 1, 2: 4}
  ```
- 중첩 반복 — `[표현식 for x in a for y in b]`
  ```python
  [(x, y) for x in range(2) for y in range(2)]
  # [(0,0), (0,1), (1,0), (1,1)]
  ```

> 조건 필터링(`if`)은 `for` 뒤에, 조건부 표현식(`if-else`)은 표현식 앞에 온다 — 위치가 다르면 의미도 다르다.

## 관용 표현 (idioms)

- `reversed(iterable)` — 역순 순회
  ```python
  for x in reversed([1, 2, 3]):
      print(x)
  # 3 / 2 / 1
  ```
- `sorted(iterable)` — 정렬된 순서로 순회
  ```python
  for x in sorted([3, 1, 2]):
      print(x)
  # 1 / 2 / 3
  ```
- `_`를 변수명으로 사용 — 값을 안 쓸 때 관례적 표기
  ```python
  for _ in range(3):
      print("hi")
  # hi / hi / hi
  ```
- 언패킹 순회 — 튜플/리스트를 바로 분해
  ```python
  for x, y in [(1, 2), (3, 4)]:
      print(x + y)
  # 3 / 7
  ```
- 언패킹 순회 (의미 있는 변수명) — 튜플 원소마다 이름을 붙여 가독성 확보. 관절 각도 쌍 순회 예시
  ```python
  for th1_deg, th2_deg in [(30, 45), (90, -60), (0, 120)]:
      print(th1_deg, th2_deg)
  # 30 45 / 90 -60 / 0 120
  ```

> 언패킹 변수명을 `x, y` 대신 `th1_deg, th2_deg`처럼 의미가 드러나게 지으면, 각 원소가 무엇을 뜻하는지(여기서는 관절 1·2의 각도, 단위 deg) 코드만 보고도 알 수 있다.

관련: [Tuple Unpacking 튜플 언패킹](../tuple-unpacking/main.md)
