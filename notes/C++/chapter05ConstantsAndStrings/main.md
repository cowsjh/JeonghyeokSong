---
title: Chapter 5 — Constants and Strings (상수와 문자열)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 5 — Constants and Strings (상수와 문자열)

> 출처: [learncpp.com](https://www.learncpp.com) Chapter 5  
> 대상: C++ 입문자 / 기계공학 배경 로보틱스 학습자

---

## 목차

1. [const — Named Constant (명명된 상수)](#1-const--named-constant-명명된-상수)
2. [Literal (리터럴)과 Magic Number (매직 넘버)](#2-literal-리터럴과-magic-number-매직-넘버)
3. [Numeral System (진법 체계) — 2진법, 8진법, 16진법](#3-numeral-system-진법-체계--2진법-8진법-16진법)
4. [Constant Expression (상수 표현식)과 컴파일 타임 최적화](#4-constant-expression-상수-표현식과-컴파일-타임-최적화)
5. [constexpr](#5-constexpr)
6. [std::string](#6-stdstring)
7. [std::string_view](#7-stdstring_view)
8. [std::string_view 주의사항 — Dangling View (댕글링 뷰)](#8-stdstring_view-주의사항--dangling-view-댕글링-뷰)
9. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. const — Named Constant (명명된 상수)

### 왜 상수가 필요한가?

아래 코드를 보자.

```cpp
double circumference { 2 * 3.14159 * radius };
```

`3.14159`가 뭘 뜻하는지 한눈에 알 수 있다. 하지만 6개월 뒤에 다시 보거나, 다른 사람이 보면?  
더 나쁜 경우 — 같은 값이 코드 30군데에 흩어져 있고 나중에 정밀도를 바꿔야 한다면?

**Named Constant(명명된 상수)** 는 이 문제를 해결한다.

```cpp
const double pi { 3.14159 };
double circumference { 2 * pi * radius };
```

- 의미가 이름으로 명확해진다
- 값을 바꿀 때 한 곳만 수정하면 된다
- 실수로 값을 바꾸는 버그를 컴파일러가 막아준다
- 값이 변하지 않음을 컴파일러가 알아서 최적화에 활용한다

### 선언 방법

```cpp
const double gravity { 9.8 };   // 권장 — const를 타입 앞에
int const sidesInSquare { 4 };  // 문법상 허용되지만 비권장
```

`const`는 반드시 **정의 시 초기화**해야 한다. 나중에 값을 넣을 수 없다.

```cpp
const int x;     // 컴파일 에러 — 초기화 없음
const int y{};   // OK — 0으로 초기화
```

### Runtime Constant(런타임 상수) vs Compile-time Constant(컴파일타임 상수)

`const`는 두 종류로 나뉜다.

```cpp
const int maxJoints { 6 };     // Compile-time Constant(컴파일타임 상수) — 정수형 + 리터럴로 초기화, 값이 컴파일 시점에 확정됨

int age{};
std::cin >> age;
const int userAge { age };     // Runtime Constant(런타임 상수) — 실행 중에 값이 결정됨, 그 이후로는 변경 불가
```

Runtime Constant(런타임 상수)도 유용하다. 한 번 읽은 센서값을 이후로 절대 바꾸지 않겠다는 의도를 표현할 수 있다.

> **주의**: `const double gravity { 9.8 }`처럼 **비정수형(double, float)은 리터럴로 초기화해도 Compile-time Constant(컴파일타임 상수)로 취급되지 않는다** — 항상 Runtime Constant(런타임 상수)다.  
> `const`가 보장하는 건 "초기화 후 변경 불가"뿐이지, "컴파일 타임에 값이 확정됨"은 별개의 이야기다.  
> 비정수형 값을 확실히 Compile-time Constant(컴파일타임 상수)로 만들고 싶다면 `constexpr`을 써야 한다 (5번 섹션 참고).

> ROS2에서 노드 이름, 토픽 이름 같이 프로그램 실행 중 바뀌면 안 되는 값에 `const`를 쓴다.

---

## 2. Literal (리터럴)과 Magic Number (매직 넘버)

### 리터럴이란?

소스코드에 직접 쓰인 값 자체를 **Literal(리터럴)** 이라 한다.

```cpp
int x { 5 };        // 5가 리터럴
double d { 3.14 };  // 3.14가 리터럴
bool b { true };    // true가 리터럴
char c { 'A' };     // 'A'가 리터럴
```

리터럴은 타입이 있고, 접미사로 타입을 명시할 수 있다.

### 리터럴 접미사

기본 타입과 다른 타입의 리터럴을 쓸 때 접미사를 붙인다.  
**안 붙이면 컴파일러가 기본 타입으로 해석한다.**

| 접미사 | 타입 | 예시 |
|--------|------|------|
| 없음 | `int` | `5` |
| `u` / `U` | `unsigned int` | `5u` |
| `l` / `L` | `long` | `5L` |
| `ll` / `LL` | `long long` | `5LL` |
| 없음 | `double` | `3.14` |
| `f` / `F` | `float` | `3.14f` |
| `s` | `std::string` | `"hello"s` |
| `sv` | `std::string_view` | `"hello"sv` |

```cpp
float f { 3.14f };   // f 없으면 double → float 축소 변환 경고

// LL이 중요해지는 건 "값 하나"가 아니라 "연산" 상황
long long result { 1000000 * 1000000 };   // 오버플로우! int * int로 먼저 계산되어 버림
long long result2 { 1000000LL * 1000000 }; // OK — 한쪽만 LL이어도 long long 연산으로 승격됨
```

> `1000000`, `1000000` 둘 다 `int` 범위 안의 값이라 리터럴 자체는 문제없어 보인다.  
> 하지만 곱셈이 **먼저 `int * int`로 수행**되고, 그 결과(10^12)가 `int` 최댓값(약 21억)을 넘어 **계산 도중에 오버플로우**가 난다.  
> 그 틀어진 값이 그제서야 `long long`에 대입되므로, 최종 변수 타입이 `long long`이어도 이미 늦다.  
> 피연산자 중 하나만 `LL`을 붙이면 다른 쪽도 `long long`으로 승격되어 연산 자체가 안전해진다.

### Magic Number(매직 넘버) — 가장 흔한 나쁜 습관

```cpp
// 나쁜 코드 — 30이 무엇인지 알 수 없음
int totalStudents { numClassrooms * 30 };
setMax(30);  // 이 30이 위의 30과 같은 건가? 다른 건가?
```

`30`이라는 숫자는 **Magic Number(매직 넘버)** — 문맥 없이 홀로 등장하는 리터럴.  
문제는 두 가지다.

1. **의미 불명확** — 읽는 사람이 30이 뭔지 추론해야 한다
2. **변경 위험** — "반 최대 인원"을 35로 바꾸면 모든 `30`을 찾아서 바꿔야 한다. 누락하면 버그.

```cpp
// 좋은 코드
const int maxStudentsPerClass { 30 };
const int maxNameLength { 30 };  // 같은 30이어도 의미가 다름을 명확히

int totalStudents { numClassrooms * maxStudentsPerClass };
setMax(maxNameLength);
```

> **규칙**: 0과 1을 제외한 리터럴이 코드에 직접 등장하면 상수로 이름을 붙여라.

---

## 3. Numeral System (진법 체계) — 2진법, 8진법, 16진법

> 2진법 = Binary, 8진법 = Octal, 10진법 = Decimal, 16진법 = Hexadecimal (아래 본문에서는 한글 표기를 그대로 사용)

### 왜 다른 진법이 필요한가?

우리가 쓰는 10진법은 사람에게 자연스럽지만, 컴퓨터는 2진법으로 동작한다.  
특히 하드웨어 레지스터, 메모리 주소, 비트 플래그를 다룰 때는 16진법이 훨씬 직관적이다.

**16진법 한 자리 = 4비트, 두 자리 = 1바이트.**  
`0xFF`가 `255`보다 "8비트 전부 1"이라는 의미를 훨씬 명확하게 전달한다.

### C++ 진법 접두사

| 진법 | 접두사 | 예시 | 10진법 값 |
|------|--------|------|----------|
| 10진법 | 없음 | `12` | 12 |
| 2진법 (C++14+) | `0b` | `0b1100` | 12 |
| 8진법 | `0` | `014` | 12 |
| 16진법 | `0x` | `0xC` | 12 |

### 8진법 함정 — 앞의 0이 진법을 바꾼다

```cpp
int x { 012 }; // 10이 아니라 8진법 12 = 10진법 10!
```

숫자 앞에 `0`을 붙이면 8진법이 된다. 실수로 `0`을 붙이면 완전히 다른 값이 된다.  
오늘날 8진법을 쓸 일은 거의 없으므로, **정수 앞에 의미 없는 0을 쓰지 마라.**

### 2진법과 16진법 활용

```cpp
#include <bitset>
#include <iostream>

int main()
{
    // 자리 구분자 ' 로 가독성 향상
    int flags { 0b1011'0010 };      // 비트 플래그 표현 — 각 비트의 의미가 보임
    int address { 0xFF'A0'13 };     // 메모리 주소 표현 — 바이트 단위가 보임

    // 출력 형식 변경
    int x { 255 };
    std::cout << std::hex << x << '\n';  // ff
    std::cout << std::oct << x << '\n';  // 377
    std::cout << std::dec << x << '\n';  // 255 (원래대로)

    // 2진법 출력 — std::bitset 사용
    std::bitset<8> bits{ x };
    std::cout << bits << '\n';  // 11111111
    return 0;
}
```

> ROS2에서 QoS 설정, 하드웨어 드라이버 레지스터 조작 시 16진법과 비트 플래그가 자주 등장한다.

### Bit Flag(비트 플래그)란?

**정수 하나의 각 비트를 독립적인 on/off 스위치로 쓰는 기법**이다.

```cpp
//        비트 위치: 7 6 5 4 3 2 1 0
int flags { 0b0000'0101 };
//                      ↑     ↑
//               비트2 켜짐  비트0 켜짐
```

`bool` 변수를 여러 개 따로 두는 대신, `int` 하나의 비트들에 여러 상태를 한 번에 담는다.  
`bool` N개는 각각 최소 1바이트씩 차지하지만, `int` 하나면 32개까지 스위치를 담을 수 있다 — **메모리 절약 + 여러 상태를 값 하나로 전달** 가능.

### 비트 연산자로 조작하기

```cpp
constexpr int FLAG_A { 0b0001 };  // 비트0
constexpr int FLAG_B { 0b0010 };  // 비트1
constexpr int FLAG_C { 0b0100 };  // 비트2

int flags { 0 };

flags |= FLAG_A;        // 켜기: OR로 해당 비트만 1로 만듦
flags |= FLAG_C;        // flags = 0b0101

bool isASet { (flags & FLAG_A) != 0 };  // 확인: AND로 해당 비트만 뽑아봄 → true

flags &= ~FLAG_A;       // 끄기: NOT으로 뒤집은 뒤 AND → 비트0만 0으로
```

| 연산 | 목적 |
|------|------|
| `flags \| FLAG` | 특정 비트 켜기 (set) |
| `flags & FLAG` | 특정 비트가 켜져 있는지 확인 (check) |
| `flags & ~FLAG` | 특정 비트 끄기 (clear) |
| `flags ^ FLAG` | 특정 비트 반전 (toggle) |

### 역할 정리 — 대입(변경) vs 비교(확인)

| 목적 | 연산 | flags 변경? |
|------|------|------------|
| 켜기 (set) | `flags \|= FLAG` | **예** |
| 끄기 (clear) | `flags &= ~FLAG` | **예** |
| 확인 (check) | `(flags & FLAG) != 0` | **아니오** |

`\|=`, `&=`는 결과를 flags 자신에게 다시 저장하므로 상태가 실제로 바뀐다.  
반면 확인할 땐 대입 없이 `& ... != 0`으로만 써야 한다 — `flags &= FLAG`처럼 대입을 쓰면 확인하려던 flags 자체가 망가진다.

### 왜 로보틱스/ROS2에서 자주 나오나

센서 드라이버에서 "READY / ERROR / CALIBRATING / DATA_VALID" 같은 여러 상태를 레지스터 하나(예: 8비트)로 한 번에 주고받을 때, 각 비트가 각각의 상태를 의미하는 식이다.  
`0xFF`(전부 1)처럼 16진법으로 표기하면 8비트 전체 상태가 한눈에 들어오는 게 이 때문이다.

> 직접 비트 연산하는 대신 `std::bitset<8>`을 쓰면 실수를 줄일 수 있다.
> ```cpp
> std::bitset<8> bits { 0b0000'0101 };
> bits.set(2);             // 비트2 켜기
> bool b0 = bits.test(0);  // 비트0 확인
> ```

### 진법 일반화 — N진법 공통 규칙

C++이 지원하는 건 2, 8, 10, 16진법뿐이지만, **모든 진법은 같은 원리로 동작**한다.

**규칙 1 — N진법은 자릿수 하나에 0 ~ (N-1)까지, 총 N개의 서로 다른 기호가 필요하다.**  
10개(0~9)를 넘는 기호가 필요하면 알파벳을 빌려 쓴다.

| 진법 | 필요한 기호 개수 | 기호 목록 |
|------|----------------|----------|
| 2진법 | 2개 | `0, 1` |
| 8진법 | 8개 | `0~7` |
| 10진법 | 10개 | `0~9` |
| 12진법 (참고, C++ 미지원) | 12개 | `0~9, A(10), B(11)` |
| 16진법 | 16개 | `0~9, A(10)~F(15)` |

**규칙 2 — 자릿값은 오른쪽부터 N의 거듭제곱으로 커진다.** (밑수만 N으로 바뀔 뿐 계산 절차는 동일)

```
자릿값 = N^0, N^1, N^2, N^3 ...  (오른쪽부터)
```

16진법 `0xC2'50` 계산과 완전히 같은 절차로, 12진법 `A2`를 계산하면:

```
자릿수:   A       2
자릿값: 12^1    12^0

= A(10) × 12^1 + 2 × 12^0
= 10 × 12 + 2 × 1
= 122
```

> **주의**: C++ 코드에서 `0x`(16진법), `0b`(2진법), 앞자리 `0`(8진법) 접두사는 문법으로 존재하지만, 12진법용 접두사는 없다. 12진법은 "진법 원리가 N에 상관없이 일반화된다"는 걸 보여주기 위한 개념 정리일 뿐, 실제 C++ 코드에는 쓸 수 없다.

### "N진법"의 N ≠ 자릿수 개수

**N진법의 N**은 자릿수 한 자리에 들어갈 수 있는 기호 종류의 개수일 뿐, **자릿수를 N개 써야 한다는 뜻이 아니다.** 자릿수는 표현하려는 값의 크기에 따라 결정된다.

```
10진법 255 → 3자리면 충분 (10자리 다 안 씀)
16진법 0xFF → 2자리면 충분 (16자리 다 안 씀)
```

| 진법 | 한 자리 최댓값 | 두 자리 최댓값 |
|------|---------------|---------------|
| 10진법 | 9 | 99 |
| 16진법 | F (15) | FF (255) |

한 자리가 담을 수 있는 정보량이 클수록(16진법 > 10진법), 같은 값을 **더 적은 자릿수**로 표현할 수 있다 — 16진법이 큰 값을 짧게 쓸 수 있어 실무에서 선호되는 이유.

---

## 4. Constant Expression (상수 표현식)과 컴파일 타임 최적화

### 컴파일 타임 vs 런타임

프로그램의 계산은 두 시점 중 하나에 일어난다.

- **컴파일 타임**: 소스코드를 실행 파일로 변환하는 단계. 컴파일러가 계산.
- **런타임**: 실행 파일을 실제로 실행하는 단계. CPU가 계산.

컴파일 타임에 계산된 것은 실행 파일에 결과값으로 박혀있다. 런타임에 다시 계산할 필요가 없으므로 **빠르고 메모리를 덜 쓴다.**

### Constant Expression(상수 표현식)이란?

**컴파일 타임에 완전히 계산 가능한 표현식**을 Constant Expression(상수 표현식)이라 한다.  
구성 요소 전부가 컴파일 타임에 알 수 있는 값이어야 한다.

```cpp
const int a { 5 };       // Constant Expression(상수 표현식)
const int b { a + 3 };   // Constant Expression(상수 표현식) (a가 컴파일 타임에 알려짐)

int age{};
std::cin >> age;
const int c { age };     // Constant Expression(상수 표현식) 아님 (age가 런타임에 결정됨)
```

### 함정 — const double은 Constant Expression(상수 표현식)이 아니다

```cpp
const int x { 5 };      // Constant Expression(상수 표현식) O (정수형 const)
const double d { 1.2 }; // Constant Expression(상수 표현식) X (비정수형 const)
```

`const`가 붙어도 **정수형(int, short, long 등)이 아니면 Constant Expression(상수 표현식)으로 쓸 수 없다.**  
`double`처럼 부동소수점 타입의 Compile-time Constant(컴파일 타임 상수)가 필요하면 `constexpr`을 써야 한다.

---

## 5. constexpr

### const의 문제 — 컴파일 타임임을 보장할 수 없다

`const`는 값을 못 바꾼다는 것만 보장한다. 컴파일 타임 상수인지 런타임 상수인지는 초기화 방식에 따라 달라지는데, 코드만 봐서는 구분하기 어렵다.

**`constexpr`은 "이 변수는 반드시 컴파일 타임 상수여야 한다"는 것을 컴파일러에게 강제한다.**  
조건을 만족 못 하면 컴파일 에러로 즉시 알려준다.

```cpp
constexpr double gravity { 9.8 };  // OK — 9.8은 컴파일 타임에 알 수 있음
constexpr int sum { 4 + 5 };       // OK — 4+5도 컴파일 타임 계산 가능

int age{};
std::cin >> age;
constexpr int myAge { age };       // 컴파일 에러 — age는 런타임에 결정됨
```

### const vs constexpr 비교

| 항목 | `const` | `constexpr` |
|------|---------|-------------|
| 값 변경 | 불가 | 불가 |
| 컴파일 타임 보장 | 경우에 따라 다름 | **항상 보장** |
| 비정수형 지원 | Constant Expression(상수 표현식)으로 못 씀 | 완전 지원 |
| 초기화 실패 시 | 런타임 상수로 처리 | **컴파일 에러** |

### 언제 무엇을 쓸까?

```
초기화 값이 컴파일 타임에 알 수 있는가?
    YES → constexpr
    NO  → const (런타임 값으로 초기화, 이후 변경 불가)
    변경 필요 → 일반 변수
```

```cpp
constexpr double pi { 3.14159 };        // 상수, 컴파일 타임 확정
constexpr int maxJoints { 6 };          // 6축 로봇팔 관절 수

int userInput{};
std::cin >> userInput;
const int clampedValue { userInput };   // 런타임에 결정되므로 const
```

> ROS2 노드에서 `constexpr`은 타임아웃 값, 최대 큐 사이즈, 물리 상수 등 프로그램 전체에서 고정된 값에 적합하다.

---

## 6. std::string

### C 스타일 문자열의 문제

C++에서 문자열을 다루는 방법은 크게 두 가지다.  
하나는 C에서 물려받은 방식, 다른 하나는 C++이 제공하는 방식이다.

C 스타일 문자열은 내부적으로 **문자 배열 + 끝을 알리는 null 문자(`\0`)** 다.

```cpp
const char* name { "Alice" };  // A, l, i, c, e, \0 — 6개 char
```

문제는 이 방식이 다루기 매우 불편하고 위험하다는 것이다.
- 길이를 알려면 직접 세야 한다
- 두 문자열을 합치려면 수동으로 메모리를 할당해야 한다
- 범위를 벗어나 쓰면 메모리 오염 버그가 생긴다 (버퍼 오버플로우)

### std::string — 안전하고 편리한 문자열

`std::string`은 이 모든 불편함을 해결한 클래스 기반 타입이다.  
메모리 관리를 내부에서 자동으로 처리하고, 문자열 조작 기능을 풍부하게 제공한다.

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string name { "Alice" };
    name = "Bob";                     // 재대입 가능 (C 스타일은 불가)
    std::string greeting { "Hello, " + name }; // 이어붙이기

    std::cout << greeting << '\n';    // Hello, Bob
    std::cout << name.length() << '\n'; // 3

    return 0;
}
```

### 공백 포함 입력 — getline

`std::cin >>`은 공백에서 멈추기 때문에 공백이 포함된 문자열을 읽을 수 없다.

```cpp
std::string fullName{};
std::cin >> fullName;           // "John Doe"를 입력해도 "John"만 읽힘

std::getline(std::cin, fullName); // 한 줄 전체를 읽음 — "John Doe" 가능
```

`>>` 직후에 `getline`을 쓰면 앞의 `>>`가 남긴 개행 문자(`\n`)를 getline이 바로 읽어버리는 문제가 생긴다.  
이 경우 `std::cin >> std::ws`로 선행 공백/개행을 먼저 제거한다.

```cpp
int age{};
std::cin >> age;

std::string name{};
std::cin >> std::ws;            // 앞의 >> 가 남긴 \n 제거
std::getline(std::cin, name);   // 이제 정상 작동
```

### std::string은 복사 비용이 크다

`std::string`을 함수에 값으로 전달하면 **전체 문자열이 복사**된다.  
문자열이 길수록 복사 비용이 커진다.

```cpp
void print(std::string str) { ... }  // 복사 발생 — 나쁨

print("Hello, world!"); // "Hello, world!" 전체 복사
```

읽기만 하는 함수라면 복사가 필요 없다. 이때 `std::string_view`를 쓴다 (다음 섹션).

---

## 7. std::string_view

### 복사 없이 문자열을 읽는 방법

함수가 문자열을 **읽기만** 한다면, 굳이 문자열을 통째로 복사할 필요가 없다.  
원본 데이터를 그대로 가리키는 "창문(view)"을 넘기면 된다.

`std::string_view`는 기존 문자열 데이터를 가리키는 **읽기 전용 포인터 + 길이** 쌍이다.  
복사 없이 원본을 참조하므로 매우 가볍다.

```
원본 문자열:  [ H e l l o ,   w o r l d ! ]
string_view:           ↑_________________↑  (포인터 + 길이만 저장)
```

### std::string vs std::string_view

| 항목 | `std::string` | `std::string_view` |
|------|--------------|-------------------|
| 데이터 소유 | 직접 소유 (복사) | 원본 참조 (포인터) |
| 수정 가능 | 가능 | **불가 (읽기 전용)** |
| 복사 비용 | 문자열 길이에 비례 | 항상 O(1) (포인터 복사) |
| constexpr 지원 | 불가 | 가능 |

### 함수 매개변수로 쓰는 방법

```cpp
#include <iostream>
#include <string>
#include <string_view>

void print(std::string_view str)  // 어떤 문자열 타입도 복사 없이 받음
{
    std::cout << str << '\n';
}

int main()
{
    print("Hello, world!");           // C 스타일 문자열 OK
    
    std::string s { "Hello, world!" };
    print(s);                         // std::string OK
    
    std::string_view sv { s };
    print(sv);                        // std::string_view OK

    return 0;
}
```

읽기 전용 문자열 매개변수는 항상 `std::string` 대신 `std::string_view`를 써라.

### constexpr 문자열 상수

`std::string`은 `constexpr`을 지원하지 않는다. 문자열 상수가 필요하면 `std::string_view`를 써라.

```cpp
constexpr std::string_view appName { "ArmController" };  // OK
constexpr std::string appName2 { "ArmController" };      // 컴파일 에러
```

### 명시적 변환이 필요한 경우

`std::string_view`에서 `std::string`으로는 **자동 변환이 안 된다.**  
의도치 않은 복사를 막기 위한 설계다. 필요하면 명시적으로 변환한다.

```cpp
std::string_view sv { "Hello" };
std::string s { sv };                       // 명시적 초기화 OK
std::string s2 { static_cast<std::string>(sv) }; // static_cast OK
```

---

## 8. std::string_view 주의사항 — Dangling View (댕글링 뷰)

### string_view는 데이터를 소유하지 않는다

`std::string_view`는 원본 데이터를 가리키는 포인터일 뿐이다.  
**원본이 사라지면, 뷰는 사라진 메모리를 가리키는 위험한 포인터가 된다.**  
이를 **Dangling View(댕글링 뷰)** 라고 한다.

### 발생 상황 1 — 임시 문자열

```cpp
std::string_view sv { std::string{"Hello"} }; // 임시 std::string 생성
// 이 줄이 끝나는 순간 임시 std::string 소멸
std::cout << sv << '\n'; // UB! 사라진 메모리 접근
```

`std::string` 리터럴 (`"Hello"s`)을 `string_view`에 바로 대입해도 같은 문제가 생긴다.

### 발생 상황 2 — 함수에서 지역 string 반환

```cpp
std::string_view getName()
{
    std::string name { "Alice" };  // 지역 변수
    return name;                   // name은 함수가 끝나면 소멸
}                                  // string_view가 소멸된 name을 가리킴 → UB

std::string_view sv { getName() }; // 댕글링 뷰
std::cout << sv;                   // UB!
```

### 발생 상황 3 — 원본 string 수정

`std::string`이 수정되면 내부 메모리가 재할당될 수 있다.  
그러면 기존 `string_view`가 가리키던 주소가 무효화된다.

```cpp
std::string s { "Hello" };
std::string_view sv { s };   // sv가 s의 내부 데이터를 가리킴

s += ", world!";             // s 내부 메모리 재할당 가능
std::cout << sv;             // UB! sv가 가리키는 곳이 바뀌었을 수 있음
```

### 안전한 사용 규칙

| 상황 | 안전 여부 |
|------|---------|
| C 스타일 문자열 리터럴 참조 | 안전 (프로그램 종료까지 유효) |
| 함수 매개변수로 받아 그 안에서만 사용 | 안전 |
| `std::string` 변수 참조 (수정 없이) | 안전 |
| 임시 `std::string` 참조 | **위험** |
| 함수에서 지역 `std::string`의 view 반환 | **위험** |
| 원본 `std::string` 수정 후 사용 | **위험** |

> **결론**: `std::string_view`는 함수 매개변수로 받아 그 함수 내에서만 쓰는 것이 가장 안전하다.  
> 원본보다 오래 살아야 하는 상황이라면 `std::string`으로 복사해서 소유권을 가져가라.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|------|----------|
| `const` | 초기화 후 변경 불가. 컴파일/런타임 상수 모두 가능 |
| `constexpr` | 반드시 컴파일 타임 상수. 조건 불만족 시 컴파일 에러 |
| `const double` | Constant Expression(상수 표현식) 아님 — `constexpr double`을 써라 |
| Magic Number(매직 넘버) | 0, 1 제외한 리터럴은 `const`/`constexpr`로 이름 붙여라 |
| 8진법 함정 | 앞의 0이 진법을 바꿈 — `012` ≠ `12` |
| 16진법 | 1자리 = 4비트, 2자리 = 1바이트 — 비트 표현에 적합 |
| `std::string` | 안전하고 편리. 복사 비용 큼 — 함수엔 값으로 넘기지 말 것 |
| `std::string_view` | 읽기 전용, 복사 없음. 원본 소멸 시 댕글링 위험 |
| `getline` 주의 | `>>` 이후엔 `std::ws`로 개행 제거 후 `getline` 호출 |
| constexpr 문자열 | `std::string` 불가 — `std::string_view` 사용 |

### 자주 하는 실수 TOP 5

1. `const double pi { 3.14 }`을 Constant Expression(상수 표현식)으로 쓰려 함 → **`constexpr double pi`를 써라**
2. 숫자 앞에 실수로 `0` 붙임 → `014`가 12임을 모르고 버그 발생. **앞에 0 붙이지 마라**
3. 함수 매개변수에 `std::string` 값 전달 → 복사 발생. **`std::string_view`로 바꿔라**
4. 지역 `std::string`의 `string_view`를 함수 밖으로 반환 → 댕글링 UB. **`std::string`을 반환해라**
5. `>>` 이후 `getline` 사용 → 개행 문자가 남아 빈 문자열 읽힘. **`std::cin >> std::ws` 먼저**

다음 장인 [06_Operators](../chapter06Operators/main.md)에서는 산술·비교·논리 연산자와 연산자 우선순위를 다룬다.
