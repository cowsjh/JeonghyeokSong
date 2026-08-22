---
title: Chapter 10 — Type Conversion, Type Aliases, and Type Deduction
date: 2026-08-08
tags: cpp, skim
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 10 — Type Conversion, Type Aliases, and Type Deduction

> 출처: [learncpp.com Chapter 10](https://www.learncpp.com/) (10.1 ~ 10.8)
> **훑기 챕터** — 커리큘럼 선별 기준상 정독 대상이 아니라 개념만 압축 정리. 복습 문제는 있음(사용자 요청으로 예외 적용).
> 이 챕터의 질문 하나: **"C++는 타입이 다른 값끼리 연산할 때 뭘 기준으로 어느 쪽을 바꾸는가, 그리고 언제 그 자동 변환을 신뢰하면 안 되는가?"**

---

## 목차

1. [1. 암시적 변환 (10.1)](#1-암시적-변환-101)
2. [2. 승격(promotion) (10.2)](#2-승격promotion-102)
3. [3. 수치 변환 (10.3)](#3-수치-변환-103)
4. [4. 좁히는 변환과 narrowing (10.4)](#4-좁히는-변환과-narrowing-104)
5. [5. 산술 변환 규칙 (10.5)](#5-산술-변환-규칙-105)
6. [6. 명시적 변환 — static_cast (10.6)](#6-명시적-변환--static_cast-106)
7. [7. 타입 별칭 — typedef, using (10.7)](#7-타입-별칭--typedef-using-107)
8. [8. auto 타입 추론 (10.8)](#8-auto-타입-추론-108)

---

## 1. 암시적 변환 (10.1)

값이 기대되는 타입과 실제 타입이 다르면, 컴파일러가 **표준 변환(standard conversion)**을 자동으로 끼워 넣는다. 함수 인자 전달, 초기화, 산술 연산 모두에서 일어난다.

```cpp
void print(double d) { std::cout << d; }
print(5);   // int 5 → double 5.0 암시적 변환
```

**왜 필요한가**: 모든 오버로드를 손으로 다 만들 수 없으니, 컴파일러가 "이 정도 변환은 안전하다"고 판단되는 범위 안에서 대신 맞춰준다.

---

## 2. 승격(promotion) (10.2)

**정수 승격(integral promotion)**과 **부동소수점 승격(floating-point promotion)**은 "더 작은 타입 → 더 큰 동족 타입"으로 가는 특수한 변환이다: `bool/char/short → int`, `float → double`.

- 항상 **값 손실이 없는(value-preserving)** 방향이라 안전하다고 간주된다.
- 연산자가 `int`/`double` 단위로만 구현돼 있어도, 작은 타입 피연산자를 자동으로 승격시켜 그 연산자를 재사용할 수 있게 하는 게 목적이다.

> [!TIP]
> **참고**
> 승격은 numeric conversion의 부분집합이 아니라 **별도 카테고리**다. 오버로드 해석에서 승격이 다른 수치 변환보다 우선순위가 높다는 게 [나중 절](#5-산술-변환-규칙-105)과 연결된다.

---

## 3. 수치 변환 (10.3)

승격이 아닌 나머지 숫자 타입 변환 전부 — `int → double`, `double → int`, `long → short` 등. 다섯 가지로 분류되지만 실무에서 중요한 건 하나: **값 손실 가능성**이다.

| 변환 방향 | 손실 여부 |
|---|---|
| `int → double` | 안전(대부분) |
| `double → int` | 소수부 손실 |
| `long → short`, `int → char` | 범위를 넘으면 값이 깨짐 |

---

## 4. 좁히는 변환과 narrowing (10.4)

**Narrowing conversion**: 대상 타입이 원본 값을 온전히 표현하지 못할 수 있는 변환 (`double → int`, `int → char` 등).

```cpp
int x { 3.5 };     // 컴파일 에러 — narrowing, list init은 이걸 막아준다
int y = 3.5;        // 경고만 뜨고 컴파일은 됨 — y = 3 (소수부 손실)
```

**왜 중요한가**: `{ }`(list initialization)로 초기화하면 narrowing이 **컴파일 에러**로 막힌다. `=`나 `( )` 초기화는 조용히 값이 깨진 채로 넘어간다 — 이게 [Ch.6](../chapter06Operators/main.md)에서 이미 "`{ }` 초기화를 기본으로 쓰라"고 한 이유 중 하나다. 단, `constexpr`처럼 컴파일 타임에 값이 실제로 손실 없이 들어가는 게 증명되면 narrowing 취급하지 않는다.

---

## 5. 산술 변환 규칙 (10.5)

이항 연산자(`+`, `==` 등)의 두 피연산자 타입이 다르면, C++는 **usual arithmetic conversions** 규칙표를 따라 **둘 중 <mark style="background: #ADCCFFA6;">"더 넓은" 타입으로 양쪽을 통일**</mark>한 뒤 연산한다.

```cpp
int a { 5 };
double b { 2.5 };
auto result = a + b;   // a가 double로 변환된 뒤 덧셈 → double
```

우선순위는 대략: `long double > double > float > (승격 적용 후) 정수형 순위표`. 서명(signed) vs 부호 없음(unsigned) 타입이 섞이면 **unsigned 쪽으로 변환**되는 게 함정 — signed 값이 음수면 거대한 양수로 랩어라운드된다 ([Ch.8에서 본 unsigned 함정](../chapter08ControlFlow/main.md)과 같은 뿌리).

---

## 6. 명시적 변환 — static_cast (10.6)

암시적 변환에 기대지 않고 **의도를 코드에 명시**하고 싶을 때 `static_cast<타입>(값)`을 쓴다.

```cpp
int a { 7 }, b { 2 };
double result { static_cast<double>(a) / b };   // 정수 나눗셈 방지 — 3.5
```

**왜 C 스타일 캐스트 `(double)a` 대신 `static_cast`인가**: C 스타일은 컴파일러가 상황에 따라 다른 종류의 캐스트(값 변환/포인터 재해석/const 제거 등)를 조용히 섞어서 처리해 실수해도 티가 안 난다. `static_cast`는 "값을 다른 타입으로 바꾼다"는 딱 그 의미로만 동작해 실수 시 컴파일 에러로 드러난다.

---

## 7. 타입 별칭 — typedef, using (10.7)

```cpp
using Distance = double;   // 권장 문법 (현대 C++)
typedef double Distance;   // 옛 문법, 동일한 의미
```

**왜 쓰는가**: 긴 템플릿 타입(`std::vector<std::pair<int,int>>`)에 짧은 이름을 붙이거나, 단위/의도를 타입 이름에 드러낼 수 있다(`using Meters = double;`). 단, 별칭은 **새 타입을 만드는 게 아니라 기존 타입의 다른 이름일 뿐**이라 타입 안전성을 강제하지는 않는다 — `Meters`와 `double`을 실수로 섞어 써도 컴파일러는 못 잡는다.

```cpp
using Meters = double;
using VectPairSI = std::vector<std::pair<std::string, int>>;

Meters distance { 42.0 };
double raw { distance };   // Meters는 그냥 double, 섞어써도 컴파일 통과 (안전성 없음 확인용)

// 함수 반환 타입도 짧게
using Pair = std::pair<int, int>;
Pair getCoord() { return { 3, 4 }; }
```

---

## 8. auto 타입 추론 (10.8)

```cpp
auto x { 5 };        // int
auto y { 5.0 };       // double
auto z { getValue() }; // getValue()의 반환 타입 그대로
```

**왜 쓰는가**: 초기화 값이 이미 타입 정보를 담고 있는데 타입을 또 손으로 적는 건 중복이다. 특히 반환 타입이 길거나 나중에 바뀔 수 있는 함수 호출 결과를 받을 때 유지보수가 쉬워진다.

**주의**: `auto`는 초기화 값의 타입을 그대로 베끼므로, **narrowing이 필요한 초기화에는 못 쓴다** (애초에 타입을 정해서 좁힐 필요가 없어짐) — 대신 원래 의도와 다른 타입이 조용히 굳어질 수 있다는 반대 방향의 함정이 생긴다: `auto x { 5 / 2 };`는 `2.5`가 아니라 `int` 2로 굳어진다.

---

## 핵심 요약 카드

| 개념            | 한 줄                                                 |
| ------------- | --------------------------------------------------- |
| 승격            | 손실 없는 확대 변환(char→int, float→double)                 |
| 수치 변환         | 손실 가능한 나머지 변환 전부                                    |
| narrowing     | `{ }` 초기화에서만 컴파일 에러로 막힘                             |
| 산술 변환         | 이항 연산 시 더 넓은 타입으로 통일, signed/unsigned 섞이면 unsigned로 |
| static_cast   | 의도가 드러나는 명시적 변환, C 스타일 캐스트보다 안전                     |
| using/typedef | 타입에 별명만 붙임, 새 타입 아님                                 |
| auto          | 초기화 값 타입을 그대로 추론                                    |
|               |                                                     |
