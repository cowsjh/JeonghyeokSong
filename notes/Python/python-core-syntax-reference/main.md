---
title: Python 핵심 문법 레퍼런스 (Step1 챕터1 압축노트)
date: 2026-08-08
tags: cheat-sheet, 기초
order: 
featured: false
draft: false
---

# Python 핵심 문법 레퍼런스 (Step1 챕터1 압축노트)

데이터 핸들링에 자주 쓰는 Python 핵심 문법만 압축한 cheat-sheet다. 변수 선언, 기본 print, 기본 for/if 같은 완전 왕기초는 한 줄로 스킵하고, 실무에서 반복적으로 쓰는 부분(문자열 가공, 컬렉션 다루기, 함수/모듈, 정렬·탐색)을 코드 위주로 정리했다.

## 목차

- [1. 기초 스킵 구간](#1-기초-스킵-구간)
- [2. print 실전 옵션](#2-print-실전-옵션)
- [3. 숫자 연산](#3-숫자-연산)
- [4. 문자열 메서드 실전 모음](#4-문자열-메서드-실전-모음)
- [5. 리스트](#5-리스트)
- [6. 딕셔너리](#6-딕셔너리)
- [7. 함수](#7-함수)
- [8. 모듈 · 객체 · 메서드](#8-모듈-·-객체-·-메서드)
- [9. 조건문 조합](#9-조건문-조합)
- [10. for 반복문](#10-for-반복문)
- [11. while 반복문과 흐름 제어](#11-while-반복문과-흐름-제어)
- [12. 정렬 · 탐색 알고리즘](#12-정렬-·-탐색-알고리즘)
- [핵심 요약 카드](#핵심-요약-카드)

## 1. 기초 스킵 구간

이미 아는 내용이므로 표로 압축.

| 주제 | 한 줄 요약 |
|---|---|
| 프로그램 구조 | 데이터 처리 프로그램은 입력(Input) → 처리(Process) → 출력(Output) 3단계로 짜고, 역할별로 함수를 분리하면 디버깅·재사용·테스트가 쉬워진다. `main()`이 전체 흐름의 엔트리 포인트 역할을 한다. |
| 개발 환경 | Cursor(IDE) + Jupyter Notebook(`.ipynb`) + Python 조합. 셀 실행은 `Shift + Enter`. |
| 변수·기본 연산 | `x = 10`, `print(1 + 1)` 등 이미 숙지. |
| 기본 print | `print("Hello")`, `print(123)` 처럼 값 하나 출력하는 수준은 생략. |
| 기본 if/for | 문법 자체는 알고 있다고 가정하고, 아래 [9. 조건문 조합](#9-조건문-조합)·[10. for 반복문](#10-for-반복문)에서는 실전 조합 패턴 위주로 다룸. |

실무형 습관으로 강조된 것: 계산 중간중간 `print`로 확인하기, 에러를 "정보"로 받아들이기, 재현 가능성(같은 입력 → 같은 출력) 챙기기.

## 2. print 실전 옵션

```python
print("A", "B", "C", sep=" | ")   # A | B | C
print("끝", end="...")             # 줄바꿈 대신 "..." 를 붙임
print("다음")
```

- `sep`: 값 사이 구분자 지정
- `end`: 출력 끝에 줄바꿈 대신 붙일 문자 지정 (로그를 한 줄에 이어붙일 때 유용)

## 3. 숫자 연산

```python
print(10 // 3)   # 3  (몫)
print(10 % 3)    # 1  (나머지, 짝/홀수 판별에 자주 씀)
print(2 ** 3)    # 8  (거듭제곱)
```

사칙연산(`+ - * /`)은 왕기초라 생략. `//`, `%`, `**` 세 개가 실전에서 반복적으로 쓰인다.

## 4. 문자열 메서드 실전 모음

텍스트 정리에서 가장 자주 쓰는 5가지 패턴이다. 핵심은 **원본을 바꾸는 게 아니라 새 문자열을 반환**한다는 점(문자열은 불변).

```python
# 1) 공백 정리
raw = "  사과  "
raw.strip()    # 양쪽 공백 제거 (lstrip/rstrip은 한쪽만)

# 2) 치환 - 쉼표·하이픈 제거에 자주 씀
price = "12,300"
int(price.replace(",", ""))        # 12300 (숫자로 쓰려면 int 변환 필수)
phone = "010-1234-5678"
phone.replace("-", "")             # "01012345678"

# 3) 대소문자 통일 - 이메일/코드값 비교 전 정규화
email = "User@Example.Com"
email.lower()                      # "user@example.com"

# 4) 분리 - split은 결과가 리스트
line = "사과,바나나,딸기"
parts = line.split(",")            # ["사과", "바나나", "딸기"]
email.split("@")[1]                # 도메인만 뽑기 같은 관용구

# 5) 합치기 - join은 split의 반대
words = ["데이터", "핸들링", "시작"]
" ".join(words)                    # "데이터 핸들링 시작"
```

실전 조합 예시(객단가 계산): 문자열에서 쉼표 제거 → `int()` 변환 → 숫자 계산 → 다시 문자열로 조립해 출력하는 흐름이 실무 데이터 정리의 기본 패턴이다.

```python
total_sales = int("123,000".replace(",", ""))
order_count = 12
aov = total_sales / order_count
print("객단가:", aov, "원")
```

## 5. 리스트

인덱싱/슬라이싱은 자료구조 다룰 때 기본기라 짧게, 내장 함수는 실전에서 계속 쓰이므로 자세히.

```python
prices = [10000, 30000, 15000, 25000, 20000]

prices[0]        # 인덱싱: 0부터 시작
prices[0:3]      # 슬라이싱: end는 미포함
prices[-1]       # 음수 인덱스 = 뒤에서부터

len(prices)      # 5   원소 개수
sum(prices)      # 총합
min(prices)      # 최솟값
max(prices)      # 최댓값
sorted(prices)   # 정렬된 새 리스트 반환 (원본 안 바뀜)

prices.append(18000)   # 원본 리스트에 직접 추가 (반환값 없음)
```

`sorted()`는 함수(원본 유지), `.append()`는 메서드(원본 변경) — 이 구분은 [8. 모듈 · 객체 · 메서드](#8-모듈-·-객체-·-메서드)에서 이어서 다룬다.

## 6. 딕셔너리

리스트 두 개를 인덱스로 대응시키는 방식은 순서가 깨질 위험이 있다. 이름(키)으로 값을 직접 짝지어 저장하는 딕셔너리가 더 안전하다.

```python
price_by_event = {
    "이벤트A": 10000,
    "이벤트B": 30000,
}

price_by_event["이벤트A"]        # 10000, 없는 키면 KeyError
price_by_event.get("없는키")      # None (에러 안 남)
price_by_event.get("없는키", 0)   # 0 (기본값 지정)
```

`딕셔너리[키]`는 값이 반드시 있다고 확신할 때, `.get()`은 값이 없을 수도 있을 때 안전하게 쓴다. 리스트 안에 딕셔너리를 넣으면(`[{...}, {...}]`) 표(row 단위 레코드) 형태의 데이터를 다룰 수 있는데, 이 구조는 나중에 `Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)`의 DataFrame 한 행 개념과 그대로 이어진다.

## 7. 함수

```python
def add_numbers(a, b):
    result = a + b
    return result

total = add_numbers(3, 5)
```

- 함수를 쓰는 이유는 **재사용성** 하나다. 반복되는 로직만 함수로 뺀다.
- `return`은 결과를 함수 밖으로 돌려주는 것. `return`이 없으면 결과를 다른 코드에서 쓸 수 없다.

## 8. 모듈 · 객체 · 메서드

```python
import random
import time
from datetime import datetime

today = datetime.now()
today.strftime("%Y/%m/%d")     # 날짜 → 문자열
random.choice(events)           # 리스트에서 무작위 원소 하나
start = time.time()
# ... 작업 ...
elapsed = time.time() - start   # 실행 시간 측정
```

**함수 vs 메서드** 구분이 헷갈리기 쉬운데:

| 구분 | 호출 방식 | 예시 |
|---|---|---|
| 함수(function) | 객체에 안 붙음, 값을 인자로 전달 | `sorted(prices)` |
| 메서드(method) | 특정 객체에 붙어 점(`.`)으로 호출 | `prices.append(18000)` |

파이썬에서는 모든 값이 객체이고(`10` → int 객체, `"a"` → str 객체), 객체마다 쓸 수 있는 메서드 종류가 다르다(`type()`으로 자료형 확인 가능). 지금 단계에서는 "메서드는 점으로 호출한다"는 감각만 있으면 충분하다.

## 9. 조건문 조합

관계 연산자와 불린 연산자로 실무 분류 조건을 조합하는 패턴.

```python
text = "가족 관람 가능"
"가족" in text          # True — 문자열 포함 검사
"청소년" not in text     # True

kid = ("어린이" in text) or ("가족" in text) or ("유아" in text)
free = ("무료" in fee_text)
```

- `and`: 둘 다 True여야 True / `or`: 하나만 True여도 True / `not`: 뒤집기
- 실무 분류 로직은 대부분 `in` + `or`/`and` 조합으로 "키워드가 여러 개 중 하나라도 포함되는가"를 판별하는 형태다.

## 10. for 반복문

```python
for row in events:
    text = row["이용대상"]
    if "어린이" in text:
        kid_events.append(row["공연/행사명"])
```

- `for 변수 in 반복가능한_대상:` — 리스트, 문자열, `range()` 모두 순회 가능
- **for + if + 딕셔너리 키 접근 + append** 조합이 "조건에 맞는 데이터만 걸러서 새 리스트에 모으기"의 기본형이다. 이 패턴은 나중에 리스트 컴프리헨션(`[row["공연/행사명"] for row in events if "어린이" in row["이용대상"]]`)으로 한 줄로 줄일 수 있다.
- `range(1, 6)` → 1~5, `range(3)` → 0~2. 값 자체보다 반복 횟수가 중요할 때 사용.

## 11. while 반복문과 흐름 제어

```python
i = 1
while i <= 5:
    print(i)
    i += 1
```

조건이 True인 동안 반복. **종료 조건을 반드시 코드 안에서 갱신**해야 하며, 안 하면 무한 루프에 빠진다.

| 제어문 | 동작 |
|---|---|
| `break` | 반복문 즉시 종료 |
| `continue` | 이번 반복만 건너뛰고 다음 반복으로 |
| `pass` | 아무것도 안 함 (문법상 코드 블록이 필요한데 채울 게 없을 때 자리 채우기용) |

```python
count = 1
while True:
    if count == 5:
        break
    count += 1
```

## 12. 정렬 · 탐색 알고리즘

**날짜 문자열 비교**: `"YYYY-MM-DD"` 형식은 사전식(lexicographic) 비교가 날짜 순서와 일치한다.

```python
print("2025-12-01" < "2026-01-01")   # True — 문자 단위로 왼쪽부터 비교
```

**튜플로 정렬 키 묶기** — `(정렬기준, 원본데이터)` 형태로 묶으면 `.sort()`가 첫 번째 요소 기준으로 정렬해준다.

```python
pairs = [(row["시작일"], row) for row in events]
pairs.sort()
sorted_events = [item[1] for item in pairs]
```

튜플은 리스트와 달리 한 번 만들면 값을 바꿀 수 없는 자료형이다(`(a, b)` vs `[a, b]`).

**선형 탐색(linear search)**: 처음부터 끝까지 하나씩 확인. 데이터가 많으면 최악의 경우 끝까지 다 봐야 한다 — O(n).

```python
for row in sorted_events:
    if row["시작일"] >= target_date:
        print(row)
        break
```

**이진 탐색(binary search)**: <mark style="background: #ADCCFFA6;">정렬된 데이터에서만 가능.</mark> 중간값과 비교해 탐색 범위를 절반씩 버려나간다 — O(log n).

```python
left, right = 0, len(sorted_events) - 1
result_index = None
while left <= right:
    mid = (left + right) // 2
    if sorted_events[mid]["시작일"] >= target_date:
        result_index = mid
        right = mid - 1
    else:
        left = mid + 1
```

데이터가 100만 개여도 이진 탐색은 약 20번(`2^20 > 1,000,000`) 비교면 충분하다. 단, **정렬되어 있지 않으면 이진 탐색은 아예 성립하지 않는다** — 정렬(`sort()`)이 선행 조건이다.

---

이 챕터 1(Python 기초)에서 다진 리스트/딕셔너리 다루는 감각은 곧 `Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)`의 DataFrame 조작(필터링, 컬럼 선택, groupby)으로 바로 확장된다. 딕셔너리를 원소로 갖는 리스트(`[{...}, {...}]`) 구조 자체가 Pandas DataFrame이 내부적으로 표현하는 "행(row) 단위 레코드" 개념과 동일하다.

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| 프로그램 구조 | 입력 → 처리 → 출력, 역할별 함수 분리로 재사용성·디버깅 용이성 확보 |
| 문자열 정리 | `strip`(공백) · `replace`(치환) · `lower/upper`(대소문자) · `split`(분리) · `join`(합치기) |
| 숫자 연산 | `//`(몫) · `%`(나머지) · `**`(거듭제곱) |
| 리스트 | 인덱싱/슬라이싱으로 위치 접근, `len/sum/min/max/sorted`로 지표 계산, `append`로 추가 |
| 딕셔너리 | 키로 값 조회, 안전 조회는 `.get(키, 기본값)` |
| 함수 | 재사용성이 목적, `return`으로 결과 반환 |
| 함수 vs 메서드 | 함수는 `func(obj)`, 메서드는 `obj.method()` (점으로 호출, 객체 종속) |
| 모듈 | `import`로 기능 가져오기 (`random`, `time`, `datetime` 등 표준 라이브러리) |
| 조건 조합 | `in`/`not in` + `and`/`or`/`not`으로 다중 키워드 분류 로직 구성 |
| for 반복 | `for + if + append` 조합으로 조건에 맞는 데이터만 필터링 |
| while 반복 | 종료 조건 갱신 필수, `break`(종료)/`continue`(건너뛰기)/`pass`(자리채우기) |
| 정렬·탐색 | 정렬은 `(키, 데이터)` 튜플 묶어서 `.sort()`, 정렬된 데이터는 이진 탐색(O(log n))으로 선형 탐색(O(n))보다 압도적으로 빠르게 검색 가능 |
