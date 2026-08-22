// Auto-synced from blog/**/*.md — do not edit directly.
// Edit the corresponding .md file, then run: node blog-sync.js
window.BLOG = {
  'C++/chapter4FundamentalDataTypes': `---
title: Chapter 4 — Fundamental Data Types
date: 2026-06-29
tags: principle
featured: false
order: 
draft: false
series: Learn C++
---

# Chapter 4 — Fundamental Data Types (기본 데이터 타입)

> 출처: [learncpp.com](https://www.learncpp.com) Chapter 4  
> 대상: C++ 입문자 / 기계공학 배경 로보틱스 학습자

---

## 목차

1. [메모리와 데이터 타입 기초](#1-메모리와-데이터-타입-기초)
2. [void](#2-void)
3. [객체 크기와 sizeof](#3-객체-크기와-sizeof)
4. [정수형 (Signed Integer)](#4-정수형-signed-integer)
5. [부호 없는 정수형 (Unsigned Integer)](#5-부호-없는-정수형-unsigned-integer)
6. [고정 폭 정수 (Fixed-width Integer)](#6-고정-폭-정수-fixed-width-integer)
7. [과학적 표기법 (Scientific Notation)](#7-과학적-표기법-scientific-notation)
8. [부동소수점 (Floating Point)](#8-부동소수점-floating-point)
9. [Boolean](#9-boolean)
10. [if 문 기초](#10-if-문-기초)
11. [char (문자형)](#11-char-문자형)
12. [타입 변환과 static_cast](#12-타입-변환과-static_cast)
13. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 메모리와 데이터 타입 기초

### 메모리는 어떻게 생겼나?

RAM을 아파트에 비유하면, 각 호수(주소)에 정확히 **1바이트**짜리 방이 하나 있다.  
우리가 변수를 선언하면 CPU가 그 방 중 하나를 빌려서 값을 저장한다.

| 단위 | 설명 |
|------|------|
| **bit** | 메모리의 가장 작은 단위. 전기가 흐르면 1, 안 흐르면 0 |
| **byte** | 직접 주소로 접근 가능한 최소 단위. 현대 표준 = **8비트** |

### 비트만으로는 의미가 없다

메모리에 저장된 비트열 \`0100 0001\`을 꺼냈다고 하자.  
이게 정수 **65**인가? 문자 **'A'**인가? 아니면 완전히 다른 무언가인가?

비트열 자체는 의미가 없다. **데이터 타입(data type)** 이 "이 비트를 어떻게 해석할지"를 컴파일러에게 알려준다.  
\`int\`로 선언하면 65, \`char\`로 선언하면 'A'로 읽는다. 저장된 비트는 동일해도 타입이 해석 방법을 결정한다.

### C++ 기본 타입 분류

| 카테고리 | 타입 예시 | 예시 값 |
|---------|----------|---------|
| 정수형 | \`short\`, \`int\`, \`long\`, \`long long\` | \`42\`, \`-7\` |
| 부동소수점 | \`float\`, \`double\`, \`long double\` | \`3.14\` |
| 불린 | \`bool\` | \`true\`, \`false\` |
| 문자형 | \`char\` | \`'A'\`, \`'z'\` |
| void | \`void\` | (값 없음) |

---

## 2. void

### "타입이 없음"을 표현하는 방법

\`void\`는 **타입이 없음**을 뜻한다. 크기를 결정할 수 없기 때문에 \`void\` 변수는 만들 수 없다.

\`\`\`cpp
void x; // 컴파일 에러 — 크기를 알 수 없어서 메모리를 할당할 수 없음
\`\`\`

### 반환값이 없는 함수

함수가 계산 결과를 돌려줄 필요 없이 "동작만 수행"할 때 반환 타입으로 사용한다.

\`\`\`cpp
void printValue(int x)
{
    std::cout << "값: " << x << '\\n';
    // 아무것도 return 하지 않음
}
\`\`\`

함수를 호출하는 쪽에서 반환값을 쓸 수 없다는 것을 컴파일러에게 명시적으로 알리는 역할이다.  
반환 타입이 없는데 \`int\`를 써버리면 컴파일러가 "어떤 값을 반환해야 하지?"라며 오류를 낸다.

> ROS2에서 콜백 함수는 거의 전부 \`void\` 반환이다.
> \`\`\`cpp
> void callback(const geometry_msgs::msg::Point::SharedPtr msg) { ... }
> \`\`\`
> 메시지를 받아서 처리만 하고, 무언가를 "반환"할 대상이 없기 때문이다.

### C vs C++ 매개변수 없는 함수

\`\`\`cpp
int getValue(void); // C 스타일 — C++에서 비권장
int getValue();     // C++ 스타일 — 권장
\`\`\`

C에서는 빈 괄호 \`()\`가 "매개변수 개수 미정"을 뜻했기 때문에 \`void\`를 명시해야 했다.  
C++에서는 빈 괄호가 곧 "매개변수 없음"이므로 \`void\`를 쓸 필요가 없다.

---

## 3. 객체 크기와 sizeof

### 타입마다 차지하는 공간이 다르다

모든 변수는 메모리 공간을 차지한다. 타입에 따라 그 크기가 다르고, 크기가 클수록 더 넓은 범위의 값을 저장할 수 있다.

n비트짜리 변수는 **2ⁿ가지** 값을 저장할 수 있다.

| 크기 | 경우의 수 | 부호 있는 정수 범위 |
|------|----------|------------------|
| 8비트 (1바이트) | 256가지 | -128 ~ 127 |
| 16비트 (2바이트) | 65,536가지 | -32,768 ~ 32,767 |
| 32비트 (4바이트) | 약 42억 가지 | 약 ±21억 |
| 64비트 (8바이트) | 약 1.8 × 10¹⁹ 가지 | 약 ±9.2 × 10¹⁸ |

### 타입별 일반적인 크기

| 타입 | 크기 | 비고 |
|------|------|------|
| \`bool\` | 1바이트 | |
| \`char\` | 1바이트 | 항상 정확히 1바이트 |
| \`int\` | **4바이트** | 현대 시스템 기준 |
| \`long long\` | 8바이트 | |
| \`float\` | 4바이트 | |
| \`double\` | **8바이트** | |

> C++ 표준은 \`int\`의 크기를 "최소 16비트"만 보장한다.  
> 현대 PC에서는 32비트지만, 임베디드/마이크로컨트롤러에서는 다를 수 있다.  
> 크기를 정확히 보장해야 할 때는 6절의 고정 폭 정수를 써야 한다.

### sizeof 연산자

실행 중이 아닌 **컴파일 시점**에 타입 또는 변수의 바이트 크기를 반환한다.

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "bool:   " << sizeof(bool)   << " bytes\\n"; // 1
    std::cout << "int:    " << sizeof(int)    << " bytes\\n"; // 4
    std::cout << "double: " << sizeof(double) << " bytes\\n"; // 8

    int x{};
    std::cout << "x is " << sizeof(x) << " bytes\\n"; // 변수에도 사용 가능
    return 0;
}
\`\`\`

---

## 4. 정수형 (Signed Integer)

### 4가지 정수 타입

C++에서 기본으로 제공하는 정수 타입은 4가지다. 이름 차이가 곧 크기 차이이고, 크기 차이가 곧 표현 가능한 범위의 차이다.

| 타입 | 최소 보장 크기 | 일반적 범위 (32비트 시스템) |
|------|-------------|--------------------------|
| \`short\` | 16비트 | -32,768 ~ 32,767 |
| \`int\` | 16비트 (보통 32비트) | -2,147,483,648 ~ 2,147,483,647 |
| \`long\` | 32비트 | -2,147,483,648 ~ 2,147,483,647 |
| \`long long\` | 64비트 | ±약 9.2 × 10¹⁸ |

대부분의 경우 \`int\` 하나면 충분하다. 특별한 이유 없이 \`short\`나 \`long\`을 쓸 필요는 없다.

### 초기화 방법 3가지

\`\`\`cpp
int a = 5;  // copy initialization — C에서 넘어온 구식 방법
int b(5);   // direct initialization — 생성자처럼 초기화
int c{ 5 }; // brace initialization — C++11부터 권장
\`\`\`

**brace initialization을 권장하는 이유**는 **narrowing conversion(축소 변환)** 을 컴파일 오류로 잡아주기 때문이다.

\`\`\`cpp
int x = 3.9;  // 경고만 뜨고 컴파일됨 — x는 3 (0.9 소리 없이 사라짐)
int y{ 3.9 }; // 컴파일 에러 — "double을 int에 넣을 수 없다"고 바로 알려줌
\`\`\`

실수로 소수를 정수 변수에 넣어도 \`=\` 방식은 그냥 통과해버린다.  
\`{}\` 방식은 "이 변환이 정말 의도한 건가?"라고 컴파일 시점에 멈춰준다.

### 오버플로우 (Overflow)

범위를 초과한 값을 넣으면 어떻게 될까? C++ 표준은 **"정의되지 않은 동작(Undefined Behavior, UB)"** 이라고 명시한다.  
UB란 컴파일러가 무슨 결과를 만들어도 표준상 허용된다는 뜻이다 — 프로그램이 이상한 값을 출력하거나, 충돌하거나, 완전히 다른 코드를 실행할 수도 있다.

\`\`\`cpp
int x{ 2'147'483'647 }; // int 최댓값 (숫자 구분자 ' 사용 가능 — 가독성용)
x = x + 1;              // UB! 어떤 일이 벌어질지 보장 없음
\`\`\`

### 정수 나눗셈 — 반올림이 아니라 절삭

정수끼리 나누면 결과도 정수다. 소수점 이하는 버려지는데, **반올림(round)이 아니라 0 방향으로 절삭(truncate)** 한다.

\`\`\`cpp
int a{  8 /  5 };  //  1  (1.6  → 1)
int b{ -8 /  5 };  // -1  (-1.6 → -1, 반올림이라면 -2겠지만 아님)
int c{ -13 / 5 };  // -2  (-2.6 → -2)
\`\`\`

"0 방향으로 절삭"이란 수직선에서 결과를 0쪽으로 당겨버린다고 생각하면 된다.

---

## 5. 부호 없는 정수형 (Unsigned Integer)

### 음수를 포기하고 양수 범위를 2배로

\`unsigned\`는 음수를 표현하지 않는 대신, 같은 비트 수로 양수 범위를 두 배로 늘린다.  
부호 비트 1개를 크기 표현에 쓸 수 있기 때문이다.

| 크기 | signed 범위 | unsigned 범위 |
|------|------------|--------------|
| 8비트 | -128 ~ 127 | 0 ~ 255 |
| 16비트 | -32,768 ~ 32,767 | 0 ~ 65,535 |
| 32비트 | 약 ±21억 | 0 ~ 약 42억 |

### 왜 일반 코드에서 피해야 하나?

**이유 1: Wrap-around (언더플로우)**

자동차 주행거리계를 생각해보자. 최대값 999,999km에서 1km를 더 가면 000,000km로 돌아온다.  
\`unsigned\`도 똑같이 동작한다. 0에서 1을 빼면 최솟값(0)보다 작아지는 게 아니라 최댓값으로 **감싸 돌아간다(wrap around)**.

\`\`\`cpp
unsigned short x{ 0 };
x = x - 1; // 65535 (0 → 65535로 wrap-around)
\`\`\`

이 동작은 \`signed\`의 오버플로우(UB)와 달리 표준에서 **정의된 동작**이지만, 실수로 발생하면 찾기 매우 어려운 버그가 된다.

**이유 2: signed와 혼용 시 조용한 변환**

\`signed\`와 \`unsigned\`를 섞으면 C++은 \`signed\`를 \`unsigned\`로 조용히 변환한다.  
음수가 갑자기 거대한 양수로 바뀌어 완전히 틀린 결과가 나온다.

\`\`\`cpp
unsigned int u{ 2 };
signed int s{ 3 };
std::cout << u - s; // 4294967295 출력 (의도한 결과: -1)
// s가 unsigned로 변환된 뒤 2 - 3이 wrap-around됨

signed int a{ -1 };
unsigned int b{ 1 };
if (a < b)  // false! -1이 unsigned로 변환되면 4294967295가 되어 b보다 큼
\`\`\`

> **결론**: 수량 계산에는 항상 \`int\`(signed)를 써라. \`unsigned\`는 비트 조작처럼 음수가 원천적으로 없는 특수 용도에만 사용한다.

---

## 6. 고정 폭 정수 (Fixed-width Integer)

### int의 크기는 보장되지 않는다

\`int\`가 4바이트라는 건 "현대 PC에서 보통 그렇다"는 것이지 표준이 보장하는 게 아니다.  
임베디드 시스템이나 다른 아키텍처에서는 \`int\`가 2바이트일 수도 있다.

코드가 어느 플랫폼에서든 같은 크기의 정수를 쓰도록 보장하려면 \`<cstdint>\` 헤더의 **고정 폭 정수**를 사용한다.

### 주요 타입

| 타입 | 크기 | 범위 |
|------|------|------|
| \`std::int8_t\` | 1바이트 | -128 ~ 127 |
| \`std::int16_t\` | 2바이트 | -32,768 ~ 32,767 |
| \`std::int32_t\` | 4바이트 | ±약 21억 |
| \`std::int64_t\` | 8바이트 | ±약 9.2 × 10¹⁸ |
| \`std::uint32_t\` | 4바이트 | 0 ~ 약 42억 |

\`\`\`cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::int32_t x{ 32767 };
    x = x + 1; // PC든 임베디드든 동일하게 32768 보장
    std::cout << x << '\\n';
    return 0;
}
\`\`\`

### int8_t 함정 — 숫자인데 문자로 출력된다

\`std::int8_t\`는 내부적으로 \`char\`와 동일하게 구현되어 있다.  
그래서 정수를 넣어도 출력할 때 ASCII 문자로 해석해버린다.

\`\`\`cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::int8_t x{ 65 };
    std::cout << x << '\\n';                   // 'A' 출력 (65가 아님!)
    std::cout << static_cast<int>(x) << '\\n'; // 65 출력 (의도한 결과)
    return 0;
}
\`\`\`

8비트 정수가 필요하다면 출력 시 반드시 \`static_cast<int>\`를 쓰거나, 처음부터 \`std::int16_t\`를 쓰는 게 낫다.

### size_t

\`sizeof\`의 반환 타입이자, 배열 크기나 인덱스를 다룰 때 쓰는 부호 없는 정수 타입이다.  
"이 시스템에서 메모리 크기를 표현하기에 충분한 크기"로 자동 결정된다.

\`\`\`cpp
#include <cstddef>

int main()
{
    int x{ 5 };
    std::size_t s{ sizeof(x) }; // 4 (바이트)
    return 0;
}
\`\`\`

### 언제 무엇을 쓸까?

| 상황 | 추천 타입 |
|------|----------|
| 일반적인 정수 연산 | \`int\` |
| 크기 보장이 필요할 때 | \`std::int32_t\`, \`std::int64_t\` |
| 비트 조작, 래핑 동작 필요 | \`std::uint#_t\` |
| 객체 크기, 배열 인덱스 | \`std::size_t\` |

---

## 7. 과학적 표기법 (Scientific Notation)

### 기본 형식

아주 크거나 작은 수를 간결하게 표현하는 방법이다.

\`\`\`
significand × 10^exponent
\`\`\`

| 일반 표기 | 과학적 표기 | C++ 코드 |
|-----------|------------|---------|
| 5,972,200,000,000,000,000,000,000 | 5.9722 × 10²⁴ | \`5.9722e24\` |
| 0.00000000000000000000000000000091 | 9.1 × 10⁻³¹ | \`9.1e-31\` |
| 0.05 | 5 × 10⁻² | \`5e-2\` |

### 유효 숫자 (Significant Digits)

significand에 포함된 자릿수가 많을수록 정밀도가 높다.

- π ≈ \`3.14\` → 유효숫자 3개 (오차 약 0.0015)
- π ≈ \`3.14159\` → 유효숫자 6개 (오차 훨씬 작음)

### 왜 부동소수점 이해에 필요한가?

컴퓨터가 \`double\`을 저장할 때 내부적으로 이 과학적 표기법 구조를 사용한다.  
메모리를 \`significand 저장 공간\`과 \`exponent 저장 공간\`으로 나눠서 쓰는 방식이다.

- \`float\` (4바이트): significand에 할당된 비트 수가 적어 유효숫자 6~9개
- \`double\` (8바이트): 비트 수가 더 많아 유효숫자 15~18개

이게 바로 \`float\`보다 \`double\`이 더 정밀한 이유다.

\`\`\`cpp
double gravity{ 9.8e0 };        // 9.8 m/s²
double electronMass{ 9.1e-31 }; // 전자 질량 (kg)
double avogadro{ 6.02e23 };     // 아보가드로 수
\`\`\`

---

## 8. 부동소수점 (Floating Point)

### 3가지 타입

| 타입 | 크기 | 유효 자릿수 |
|------|------|------------|
| \`float\` | 4바이트 | 6 ~ 9자리 |
| \`double\` | 8바이트 | 15 ~ 18자리 |
| \`long double\` | 8 ~ 16바이트 | 가변 |

> **규칙**: 항상 \`double\`을 써라. \`float\`는 정밀도가 부족해서 미묘한 버그를 만든다.

### 리터럴 표기

\`\`\`cpp
double d{ 5.0 };     // double (소수점 있으면 기본이 double)
float f{ 5.0f };     // float (접미사 f 필수 — 없으면 double로 인식)
double e{ 6.02e23 }; // 과학 표기법
\`\`\`

### 왜 정밀도 오차가 생기나?

십진법에서 1/3 = 0.3333...처럼 무한 소수가 되는 수가 있다.  
이진법에서도 마찬가지다. **0.1은 이진법으로 0.00011001100110011...처럼 무한히 반복된다.**

컴퓨터는 무한한 비트를 쓸 수 없으니 어딘가에서 잘라내야 한다.  
그 잘린 부분이 바로 **반올림 오차(rounding error)** 다.

\`\`\`cpp
#include <iomanip>
#include <iostream>

int main()
{
    std::cout << std::setprecision(17); // 소수점 17자리까지 출력

    double d{ 0.1 };
    std::cout << d << '\\n'; // 0.10000000000000001 (0.1이 아님!)

    double sum{ 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 };
    std::cout << sum << '\\n'; // 0.99999999999999989 (1.0이 아님!)
    return 0;
}
\`\`\`

오차가 연산을 거칠수록 누적된다. 단순해 보이는 덧셈 10번이 1.0을 만들지 못한다.

### 부동소수점을 == 로 비교하면 안 된다

오차 때문에 수학적으로 같아야 할 두 값이 컴퓨터에서는 다를 수 있다.

\`\`\`cpp
double a{ 0.1 + 0.2 };
double b{ 0.3 };
if (a == b) // false! (0.30000000000000004 vs 0.29999999999999999)
    std::cout << "같다\\n";
\`\`\`

부동소수점 비교가 필요할 때는 **차이가 아주 작은지** 를 확인하는 방식을 쓴다 (6장에서 다룸).

### 특수값

\`\`\`cpp
double posinf{ 5.0 / 0.0 };  // inf (양의 무한대)
double nan{ 0.0 / 0.0 };     // nan (Not a Number)
\`\`\`

**NaN의 특이 동작**: NaN은 자기 자신과도 같지 않다.

\`\`\`cpp
double nan{ 0.0 / 0.0 };
std::cout << (nan == nan) << '\\n'; // false (!)
std::cout << (nan != nan) << '\\n'; // true

// NaN 여부 확인은 반드시 isnan() 사용
#include <cmath>
std::cout << std::isnan(nan) << '\\n'; // true
\`\`\`

NaN과의 모든 비교는 false를 반환한다. \`nan == nan\`조차 false다. 이를 이용해 NaN을 감지하는 \`isnan()\` 함수가 표준에 있다.

---

## 9. Boolean

### 참/거짓만 저장하는 타입

\`bool\`은 \`true\`(참, 내부적으로 1) 또는 \`false\`(거짓, 내부적으로 0) 두 값만 갖는다.  
조건 판단, 플래그 변수, 함수의 성공/실패 반환 등에 쓰인다.

\`\`\`cpp
bool b1{ true };
bool b2{ false };
bool b3{};        // false (값을 안 넣으면 false로 초기화)
bool b4{ !true }; // false (! 연산자가 참/거짓을 뒤집음)
\`\`\`

### 출력 — 기본은 0/1, boolalpha로 true/false

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << true  << '\\n'; // 1 (기본 출력)
    std::cout << false << '\\n'; // 0

    std::cout << std::boolalpha;  // 이 이후부터 문자열로 출력
    std::cout << true  << '\\n'; // "true"
    std::cout << false << '\\n'; // "false"
    return 0;
}
\`\`\`

### 조건식의 결과는 bool이다

\`if\` 문 안의 비교 연산은 자동으로 \`bool\`을 반환한다.  
이를 명시적으로 함수에서 반환할 수도 있다.

\`\`\`cpp
bool isEqual(int x, int y)
{
    return x == y; // == 비교의 결과가 true 또는 false
}

int main()
{
    std::cout << std::boolalpha;
    std::cout << isEqual(3, 3) << '\\n'; // true
    std::cout << isEqual(3, 4) << '\\n'; // false
    return 0;
}
\`\`\`

### 정수를 bool로 변환하면?

\`bool\` 이외의 값을 \`bool\`로 변환할 때: **0은 false, 0이 아닌 모든 값은 true**가 된다.

\`\`\`cpp
bool a{ 0 };    // false
bool b{ 1 };    // true
bool c{ -5 };   // true (0이 아니므로)
bool d{ 0.0 };  // false
\`\`\`

---

## 10. if 문 기초

### 조건에 따라 코드를 실행하거나 건너뛴다

프로그램이 항상 같은 순서로 실행된다면 아무 입력에나 동일한 결과만 낸다.  
\`if\` 문은 조건이 참일 때만 특정 코드를 실행해서 **상황에 따라 다르게 동작**하도록 한다.

\`\`\`cpp
if (조건)
    참일 때 실행;
else
    거짓일 때 실행;
\`\`\`

조건 자리에는 \`bool\`로 평가되는 어떤 표현식이든 들어갈 수 있다.

### 예제

\`\`\`cpp
#include <iostream>

int main()
{
    int x{};
    std::cin >> x;

    if (x > 0)
        std::cout << "양수\\n";
    else if (x < 0)
        std::cout << "음수\\n";
    else
        std::cout << "0\\n";

    return 0;
}
\`\`\`

\`else if\`를 연결해서 여러 조건을 순서대로 확인할 수 있다.  
위에서부터 차례로 평가해서 처음 참인 조건 하나만 실행하고 나머지는 건너뛴다.

### 비교 연산자

| 연산자 | 의미 | 예시 |
|--------|------|------|
| \`==\` | 같다 | \`x == 5\` |
| \`!=\` | 다르다 | \`x != 0\` |
| \`<\` | 미만 | \`x < 10\` |
| \`>\` | 초과 | \`x > 0\` |
| \`<=\` | 이하 | \`x <= 100\` |
| \`>=\` | 이상 | \`x >= 1\` |

> 주의: \`=\`(대입)과 \`==\`(비교)를 혼동하지 말 것. \`if (x = 5)\`는 x에 5를 대입하고 참으로 평가된다 — 버그다.

### Early Return 패턴

함수 중간에서 조건을 만족하면 즉시 반환해서 불필요한 코드 실행을 막는다.  
들여쓰기가 깊어지는 것을 방지하는 효과도 있다.

\`\`\`cpp
int abs(int x)
{
    if (x < 0)
        return -x; // 음수면 부호를 바꿔서 바로 반환
    return x;      // 양수면 그대로 반환
}
\`\`\`

---

## 11. char (문자형)

### 문자를 저장하는 방법 — 사실 정수다

컴퓨터는 문자를 그대로 저장할 수 없다. 대신 **문자마다 번호를 붙여서 그 번호를 저장**한다.  
이 번호 체계가 **ASCII(American Standard Code for Information Interchange)** 다.

\`char\`는 1바이트 정수 타입이고, 출력할 때 그 값을 ASCII 문자로 해석해서 보여준다.

\`\`\`cpp
char ch1{ 'a' };  // 문자 리터럴로 초기화 (권장) — 내부적으로 97 저장
char ch2{ 97 };   // 정수로 직접 초기화 (비권장) — 결과는 동일
\`\`\`

\`ch1\`과 \`ch2\`는 메모리에 똑같이 \`97\`이 들어있다. \`char\`로 출력하면 둘 다 \`'a'\`가 나온다.

### ASCII 주요 값

| 값 | 문자 | 패턴 |
|----|------|------|
| 48 ~ 57 | \`'0'\` ~ \`'9'\` | 숫자 문자 |
| 65 ~ 90 | \`'A'\` ~ \`'Z'\` | 대문자 |
| 97 ~ 122 | \`'a'\` ~ \`'z'\` | 소문자 (대문자 + 32) |
| 32 | 공백 | |

대문자 \`'A'\`(65)와 소문자 \`'a'\`(97)의 차이가 정확히 32다.  
이 관계를 이용하면 \`ch + 32\`로 대문자→소문자 변환 같은 연산이 가능하다.

### 이스케이프 시퀀스

\`\\n\`처럼 백슬래시로 시작하는 특수 문자들이다. 키보드로 직접 입력할 수 없는 문자를 표현한다.

| 시퀀스 | 의미 |
|--------|------|
| \`\\n\` | 줄바꿈 (newline) |
| \`\\t\` | 수평 탭 |
| \`\\\\\` | 백슬래시 자체 |
| \`\\'\` | 작은따옴표 |
| \`\\"\` | 큰따옴표 |

\`\`\`cpp
std::cout << "Line1\\nLine2\\n"; // 두 줄로 출력
std::cout << "Col1\\tCol2\\n";   // 탭으로 구분
\`\`\`

### char 입출력

\`\`\`cpp
#include <iostream>

int main()
{
    char ch{};
    std::cin >> ch;           // 앞의 공백(스페이스, 엔터)을 무시하고 첫 문자만 읽음
    std::cout << ch << '\\n';
    return 0;
}
\`\`\`

**공백 포함 입력이 필요할 때**는 \`std::cin.get()\` 사용:

\`\`\`cpp
char ch{};
std::cin.get(ch); // 공백, 엔터 포함해서 딱 한 글자 읽음
\`\`\`

\`std::cin >>\`는 공백을 구분자로 보고 건너뛴다. 공백 문자 자체를 읽어야 할 때는 \`cin.get()\`을 써야 한다.

---

## 12. 타입 변환과 static_cast

### 암묵적 변환 (Implicit Conversion) — 컴파일러가 자동으로

서로 다른 타입 사이에 대입이나 연산이 일어나면 컴파일러가 자동으로 변환을 수행한다.  
정보 손실 없이 더 큰 타입으로 가는 변환은 안전하다.

\`\`\`cpp
void print(double x) { std::cout << x << '\\n'; }

int main()
{
    print(5);    // int 5 → double 5.0으로 자동 변환 (정보 손실 없음, 안전)
    return 0;
}
\`\`\`

반대 방향(double → int)은 소수 부분이 사라지므로 **정보 손실**이 발생한다.  
컴파일러는 이 경우 경고를 내거나 아예 컴파일을 거부한다 (brace 초기화 시).

### 명시적 변환 — static_cast

"나는 이 변환이 정보를 잃는다는 걸 알고 있고, 그래도 의도적으로 하겠다"고 컴파일러에게 선언하는 방법이다.  
컴파일러 경고를 없애는 것뿐 아니라, 코드를 읽는 사람에게도 "여기서 타입 변환이 일어난다"고 명시한다.

\`\`\`cpp
static_cast<목표_타입>(표현식)
\`\`\`

\`\`\`cpp
#include <iostream>

int main()
{
    // 1. double → int (소수 제거)
    double d{ 9.8 };
    int i{ static_cast<int>(d) }; // 9 (0.8은 버려짐 — 반올림 아님)
    std::cout << i << '\\n';

    // 2. char → int (ASCII 번호 출력)
    char ch{ 'A' };
    std::cout << ch << '\\n';                   // 'A' 출력
    std::cout << static_cast<int>(ch) << '\\n'; // 65 출력

    // 3. int → double (정수 나눗셈 방지)
    int a{ 7 }, b{ 2 };
    double result{ static_cast<double>(a) / b }; // 3.5 (static_cast 없으면 3)
    std::cout << result << '\\n';

    return 0;
}
\`\`\`

### Narrowing Conversion — 왜 컴파일러가 경고하나?

큰 타입을 작은 타입에 넣을 때 값이 잘릴 수 있는 변환을 **narrowing conversion(축소 변환)** 이라 한다.

\`\`\`cpp
int x = 3.9;   // double → int, 0.9 소리 없이 사라짐 (컴파일러가 경고)
int y{ 3.9 };  // 컴파일 에러 — brace 초기화는 narrowing 변환 자체를 막음
\`\`\`

\`static_cast\`는 이 경고를 없애는 동시에 **"나는 이 손실을 알고 한다"는 의도를 코드에 남긴다**.  
경고를 그냥 무시하는 것과 \`static_cast\`를 쓰는 것은 결과는 같아도 의미가 다르다.

### 언제 static_cast를 써야 하나?

| 상황 | 예시 |
|------|------|
| \`double\` → \`int\` (소수 제거) | \`static_cast<int>(3.7)\` → 3 |
| \`char\` → \`int\` (ASCII 번호 보기) | \`static_cast<int>('A')\` → 65 |
| \`int\` → \`char\` | \`static_cast<char>(65)\` → 'A' |
| 정수 나눗셈 방지 | \`static_cast<double>(a) / b\` |
| \`int8_t\` 숫자로 출력 | \`static_cast<int>(myInt8)\` |

> **규칙**: 컴파일러 경고가 뜨는 변환은 반드시 \`static_cast\`로 의도를 명시하라.  
> 경고를 그냥 무시하는 것은 나중에 찾기 어려운 버그의 씨앗이다.

---

## 핵심 요약 카드

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                      Chapter 4 핵심 요약                            │
├──────────────────┬──────────────────────────────────────────────────┤
│ 메모리 단위      │ 1byte = 8bit, n비트 → 2ⁿ가지 값                 │
├──────────────────┼──────────────────────────────────────────────────┤
│ 데이터 타입      │ 같은 비트열도 타입에 따라 다르게 해석             │
├──────────────────┼──────────────────────────────────────────────────┤
│ void             │ "타입 없음" — 반환값 없는 함수, void 변수는 불가 │
├──────────────────┼──────────────────────────────────────────────────┤
│ brace 초기화     │ int x{5.0} → 컴파일 에러로 narrowing 조기 차단  │
├──────────────────┼──────────────────────────────────────────────────┤
│ 정수 오버플로우  │ 범위 초과 → Undefined Behavior (UB)              │
├──────────────────┼──────────────────────────────────────────────────┤
│ 정수 나눗셈      │ 반올림 X, 0 방향 절삭 (-1.6 → -1)               │
├──────────────────┼──────────────────────────────────────────────────┤
│ unsigned 주의    │ 0 - 1 = 65535 (wrap-around), signed 혼용 버그    │
├──────────────────┼──────────────────────────────────────────────────┤
│ int8_t 함정      │ char처럼 동작 → 숫자 출력 시 static_cast 필요    │
├──────────────────┼──────────────────────────────────────────────────┤
│ 과학적 표기법    │ 5.9e24, 9.1e-31 / float=6자리, double=15자리     │
├──────────────────┼──────────────────────────────────────────────────┤
│ 부동소수점       │ 근사값! 0.1은 이진법 무한소수 → 오차 누적        │
├──────────────────┼──────────────────────────────────────────────────┤
│ NaN              │ NaN == NaN → false, isnan()으로 확인             │
├──────────────────┼──────────────────────────────────────────────────┤
│ bool             │ true=1, false=0 / 0이 아닌 값은 모두 true        │
├──────────────────┼──────────────────────────────────────────────────┤
│ char             │ 1바이트 정수 = ASCII / 대문자 + 32 = 소문자      │
├──────────────────┼──────────────────────────────────────────────────┤
│ static_cast      │ 의도적 타입 변환 명시 — 경고 무시와 다름         │
├──────────────────┼──────────────────────────────────────────────────┤
│ 권장 타입        │ 정수→int, 실수→double, 크로스플랫폼→int32_t      │
└──────────────────┴──────────────────────────────────────────────────┘
\`\`\`

### 자주 하는 실수 TOP 5

1. \`float\` 사용 → 정밀도 부족. **\`double\` 써라**
2. \`unsigned int\`로 역방향 루프 → wrap-around. **\`int\` 써라**
3. \`int / int\` → 소수점 버림. **\`static_cast<double>(a) / b\` 써라**
4. \`double == double\` 비교 → 오차로 틀린 결과. **직접 비교 금지**
5. 정수 오버플로우 무시 → UB. **범위 확인 후 타입 선택**
`,

  'ComputerGraphics/3d-model-formats': `---
title:    3D Model Formats
date:     2026-05-19
tags:     3D
featured: false
draft:    false
---

[3D Model Formats: A Comprehensive Guide (VividWorks)](https://www.vividworks.com/blog/3d-model-formats-guide)

2025년 기준 주요 3D 모델 포맷 정리.

---

## glTF / GLB
KHRONOS 그룹이 정의한 개방형 표준. 웹 전송에 최적화되어 있으며 PBR 재질·애니메이션·텍스처를 모두 지원한다.

- 기하 — 정점, 노멀, 탄젠트, UV 좌표
- 재질 — PBR(base color, metallic, roughness, normal, occlusion)
- 애니메이션 — 키프레임, 스켈레탈
- 파일 구조 — \`.gltf\`(JSON 메타데이터) + \`.bin\`(메시 바이너리), GLB는 단일 바이너리로 묶은 버전

&nbsp;
- 장점 — 작은 파일 크기, 웹 환경 호환, 풍부한 기능
- 단점 — 비교적 신규 포맷이라 구형 소프트웨어 지원 부족

## OBJ
Wavefront에서 개발한 정적 메시 포맷. 거의 모든 3D 소프트웨어가 지원하는 사실상의 표준 교환 포맷.

- 기하 — 정점, 정점 노멀, UV, 면(폴리곤 + freeform/NURBS)
- 재질 — 별도 \`.mtl\`(Material Template Library) 파일로 정의
- 애니메이션 — 제한적 지원
- 파일 구조 — ASCII 텍스트 (사람이 읽을 수 있음)

&nbsp;
- 장점 — 폭넓은 호환성, 단순한 텍스트 구조
- 단점 — 애니메이션 미지원, 파일 용량이 큼

## FBX
Autodesk의 독점 포맷. 게임·영상 산업의 표준 교환 포맷으로 자리 잡았다.

- 기하 — 폴리곤, NURBS, 서브디비전 서피스
- 애니메이션 — 스켈레탈, 블렌드 셰이프, 정점 캐시
- 재질·텍스처 — 범프, 노멀, 스페큘러 등 종합 지원
- 카메라 — 카메라 데이터 포함
- 파일 구조 — 바이너리/ASCII 두 가지 버전

&nbsp;
- 장점 — 애니메이션·재질·리깅 등 폭넓은 기능, 주요 도구 지원
- 단점 — 독점 포맷, 내부 구조가 복잡함

## DAE (Collada)
XML 기반 개방형 교환 포맷.

- 기하 — 정점, 폴리곤, NURBS
- 애니메이션 — 스켈레탈, 모프 타깃
- 재질·셰이더 — 다양한 재질·셰이더 지원
- 파일 구조 — XML (사람이 읽을 수 있으나 장황함)

&nbsp;
- 장점 — 개방형, 텍스트 기반이라 디버깅이 쉬움
- 단점 — 신규 포맷에 비해 활용도 감소 추세

## STL
3D 프린팅 표준 포맷. 삼각형 메시로 표면 형상만 표현한다.

- 기하 — 삼각형 메시
- 재질·색상·텍스처 — 미지원
- 파일 구조 — ASCII / 바이너리 두 가지 버전

&nbsp;
- 장점 — 3D 프린팅 생태계의 표준
- 단점 — 색상·재질·텍스처 미지원

## PLY
3D 스캔·연구용 포맷. 요소별 속성을 자유롭게 정의할 수 있다.

- 기하 — 정점, 면, 엣지
- 추가 속성 — 정점 색상, 투명도, 사용자 정의 속성
- 파일 구조 — ASCII / 바이너리 두 가지 버전

&nbsp;
- 장점 — 스캔 데이터, 연구용 부가 정보 저장에 적합
- 단점 — 일반 3D 도구 지원 부족

## USD / USDC
Pixar가 개발한 장면 기술 포맷. 복잡한 장면을 레이어로 합성·관리하는 데 강하며 영화·애니메이션 산업 표준으로 자리 잡고 있다.

- 장면 구성 — 계층 구조, 레이어, 레퍼런스, 인스턴싱
- 기하 — 폴리곤, 서브디비전, 포인트 클라우드 등
- 재질 — 유연한 재질 정의, MaterialX 지원
- 애니메이션 — 스켈레탈 리깅, 디포메이션
- USDC — USD의 바이너리 버전. 무손실 압축으로 용량을 줄이고, 랜덤 액세스·스트리밍을 지원

&nbsp;
- 장점 — 대규모 장면 협업·합성에 최적, 효율적인 데이터 구조
- 단점 — 학습 난이도가 높고 지원 도구가 제한적

## USDZ
Apple과 Pixar가 함께 만든 USD의 AR 전용 패키지 포맷.

- 장면 구성 — USD와 동일한 계층 구조
- 기하·애니메이션 — 실시간 렌더링에 맞춰 최적화
- 텍스처 — 텍스처 압축 활용
- AR 속성 — 재질 반사, PBR 등 AR 전용 속성

&nbsp;
- 장점 — iOS AR(Quick Look) 기본 지원
- 단점 — Apple 생태계에 종속

## STEP
제품 데이터 교환용 CAD 표준 포맷.

- 확장자 — \`.stp\` / \`.step\`
- 데이터 구조 — ISO 표준 기반 중립 데이터 구조
- 파일 형식 — ASCII (사람이 읽을 수 있음)

&nbsp;
- 장점 — 엔지니어링·제조 분야의 국제 표준
- 단점 — 비주얼·렌더링 작업 흐름과는 거리가 멂

## DXF / DWG
AutoCAD 기반의 설계 도면 포맷. DXF는 개방형, DWG는 독점.

- DXF — ASCII 텍스트, 2D·3D 도형 데이터, 텍스트 에디터로 편집 가능
- DWG — 독점 인코딩 바이너리, 레이어·속성·관계·지능형 객체 등 DXF보다 풍부한 데이터 저장. AutoCAD의 네이티브 포맷

&nbsp;
- 장점 — 건축·설계 도면 호환성
- 단점 — DWG는 Autodesk에 종속

## 3DS
구형 3ds Max 포맷. 레거시 시스템 호환용으로만 쓰인다.

- 기하 — 정점, 면, 단순 재질
- 애니메이션 — 키프레임 제한적 지원
- 파일 구조 — 바이너리

&nbsp;
- 장점 — 오래된 작업 흐름과 호환, 작은 파일 크기
- 단점 — 정점·재질 수 제한, 사실상 폐기된 포맷

---

## 용도별 권장

| 용도 | 권장 포맷 |
| --- | --- |
| 웹 · VR · AR | **glTF / GLB**, USDZ |
| 게임 · 영상 | **FBX** |
| 3D 프린팅 | **STL** |
| 영화 · 애니메이션 | **USD** |
| CAD · 엔지니어링 | STEP, DXF |

>[!note]
>웹 인터랙티브 쇼케이스에는 **glTF/GLB**, Houdini → Unreal 작업 흐름에는 **FBX**, 3D 프린팅 출력은 **STL**. 용도와 소프트웨어 호환성을 기준으로 고르면 된다.
`,

  'ComputerGraphics/Batching': `---
title: Batching
date: 2026-04-17
tags: optimization, Rendering
---

CPU의 병목 현상을 해결하는 방법 중 하나.

동일한 재질의 메쉬를 병합하여 한 번의 드로우 콜로 렌더링하는 최적화 기법

### 원리
1. 동일한 재질의 메쉬 병합
2. 병합된 메쉬 한번에 드로우콜

### 결과
드로우콜 감소

### 단점
**렌더링은 빠르지만 VRAM 사용량 급증. 합쳐진 메쉬가 한 번에 메모리에 저장되기 때문.** 일반적인 드로우콜은 1번에 메쉬 한 개이기때문에 차이가 난다.

`,

  'ComputerGraphics/SSAO': `---
title: Screen Space Ambient Occlusion (SSAO)
date: 2026-05-20
tags: Rendering
draft: false
---

[A Comparative Study of Screen-Space Ambient Occlusion Methods](https://frederikaalund.com/a-comparative-study-of-screen-space-ambient-occlusion-methods/)

---

## Ambient Occlusion
기준이 되는 점에서 노멀 방향으로 반원을 그려 광선을 쏴 차폐되는 정도와 거리를 계산한다. 이 때문에 연산 비용이 커 최적화가 중요한 게임에서는 쓰기 힘들다. 그래서 나온 것이 SSAO다.

## SSAO
SSAO는 [Deferred Rendering](../../Game/game-optimization-02/main.md#deferred-rendering)의 G-buffer 단계에서 depth-buffer로 연산되기 때문에 씬의 복잡도에서 자유롭다.


### Unreal Engine 4
샘플을 단일 점으로 쓰지 않고, 두 점을 한 쌍으로 연산한다. 샘플을 실제 표면에 투영하여 기준 점에서부터 두 벡터의 각도를 계산한다.
적은 수의 샘플로 좋은 AO를 얻을 수 있다.
![alt text](image.webp)`,

  'ComputerGraphics/aboutDraw': `---
title: Draw Call
date: 2026-04-21
tags: optimization, Rendering
---
[Unreal Course - An In-Depth look at Real-Time Rendering](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/JEJ/geometry-rendering-part-1)

---

## Draw ?

Draw 는 CPU 가 GPU 에게 특정한 오브젝트를 화면에 렌더 하는것을 명령하고 그리는 것 언리얼은 기본적으로 수많은 렌더 패스를 수행한다. 지오메트리가 아니더라도 하늘, 대기 산란, post-processing, 에디터 UI 등 화면상 렌더되는 것은 전부 포함 된다.
![alt text](image.webp)

## Draw call ?
CPU가 GPU API에게 무엇을 어떻게 그릴지 알려주는 것. 각 드로우 콜에는 텍스쳐, 셰이더 및 버퍼에 대한 정보가 있음.
같은 속성을 공유하는 폴리곤 그룹이 하나의 드로우콜로 정의된다. (단일 메쉬에 여러개의 메테리얼이 존재하는 액터는 드로우콜에 영향을 미친다.)

 **대부분 draw call 자체 보다는 준비하는 과정에서 리소스가 더 많이 든다.**
또한 드로우콜은 렌더하고 마치면 완료했다고 말하고 다음 명령을 받아야하는 통신 과정이 이루어지기 때문에 단순 크기 보다 그 양이 많을 때 병목 현상이 일어나기 쉽다.
\`\`\`
1GB 파일 1개
vs
1KB 파일 100만개
\`\`\`
- 폴리곤 많을 때 : GPU 바쁨
- draw call 많을 때 : CPU bound, GPU 낭비
- 폴리곤이 많다고 Draw 시간이 비례하는 것은 아니다.
- 적은 큰 모델을 쓰는 것 < 작고 많은 모델을 쓰는 것

큰 모델을 쓸때는 아래 사항을 주의
- occlusion
- lightmapping
- collision calculation
- memory

## Merge Mesh
환경 배치 작업이 끝났다면 조건에 맞는 메쉬들 끼리 병합 하여 드로우콜을 줄일 수 있다.

**메시 병합 최적화 규칙**
\`\`\`
1. 사용 빈도가 높고 폴리곤수가 적을때
2. 동일한 구역 내에 있는 메시들
3. 동일한 메테리얼 을 공유하는 메시
4. 출돌 판정이 없거나 단순한 메시
5. 크기가 작은 메시, 다이내믹 라이틸만 받는 메시
6. 멀리있는 지형
\`\`\`

>[!important]
>모든 환경에서 병합이 최고의 방법은 아니다 물론 효율을 높일 순 있겠으나 충분히 잘 돌아간다면 다른 곳에 시간을 투자하는 것이 좋다.

## Instance Static Mesh Rendering
동일한 static mesh 그룹을 포함한 컴포넌트

크고 적은 메쉬를 인스턴스 하는것 보다 foliage 같은 작고 양이 많을 때 더 효과 적이다.

## LOD, HLOD

- 조건(거리)에 따라 로우 폴리로 교체되는 것.
- HLOD는 여러개의 메쉬가 조건에 따라 그룹핑 되어 하나의 메쉬로 교체 되는 것.
`,

  'ComputerGraphics/oklab': `---
title: OKLab
date: 2026-05-11
tags: color
draft: false
order: 1
---

https://bottosson.github.io/posts/oklab/

---

## Perceptually uniform color

$HSV$, $RGB$ 같은 기존의 색공간은 밝기를 유지한 채 색상을 바꾸는 것이 어렵고 인간의 시각과 거리감이 있는 그라데이션을 가진다.
$Lab$(CIELAB)은 이러한 문제점을 개선하여 만들어진 색공간이다.

gradient로 보면 색공간의 밝기 처리가 확연하게 차이 난다.
**RGB gradient**
![alt text](image-1.webp)
![alt text](image-2.webp)
**OKLab gradient**
![alt text](image.webp)

## $OKLab$, $OKLCh$

기존의 $Lab$의 단점을 보완하여 나온 것이 $OKLab$이다.

- $L$ = 지각적 밝기
- $a$ = 초록/빨강 축
- $b$ = 파랑/노랑 축

Lab는 바로 사용할 수도 있지만 a, b와 같은 축을 사람이 조절하기에는 어려움이 있기 때문에 사용하기 편리하게 치환하는 $LCh$가 필요하다.

- $L$ = 지각적 밝기
- $C$ = 채도
- $h$ = 색상

### $Lab$ $\\rightarrow$ $LCh$

$C = \\sqrt{a^2+b^2}$
$h = atan2(b,a)$


### $Lch$ $\\rightarrow$ $Lab$


$a = Ccos(h)$
$b = Csin(h)$


## Implementation to Unreal


$RGB$ $\\rightarrow$ $Linear$ $\\rightarrow$ $Lab$ $\\rightarrow$ **색조정** $\\rightarrow$ $LCh$ $\\rightarrow$ $Lab$ $\\rightarrow$ $Linear$ $\\rightarrow$ $RGB$

### $RGBs$ $\\rightarrow$ $Lab$ $\\rightarrow$ $RGBs$
\`\`\`
float3 linear_srgb_to_oklab(float3 c)                      
  {                                                                                                  
      float l = 0.4122214708f * c.r + 0.5363325363f * c.g + 0.0514459929f * c.b;
      float m = 0.2119034982f * c.r + 0.6806995451f * c.g + 0.1073969566f * c.b;
      float s = 0.0883024619f * c.r + 0.2817188376f * c.g + 0.6299787005f * c.b;                       
   
      float l_ = pow(abs(l), 1.0f / 3.0f);                                                             
      float m_ = pow(abs(m), 1.0f / 3.0f);     
      float s_ = pow(abs(s), 1.0f / 3.0f);

      return float3(
          0.2104542553f * l_ + 0.7936177850f * m_ - 0.0040720468f * s_,
          1.9779984951f * l_ - 2.4285922050f * m_ + 0.4505937099f * s_,
          0.0259040371f * l_ + 0.7827717662f * m_ - 0.8086757660f * s_
      );
  }

  float3 oklab_to_linear_srgb(float3 c)
  {
      float l_ = c.x + 0.3963377774f * c.y + 0.2158037573f * c.z;
      float m_ = c.x - 0.1055613458f * c.y - 0.0638541728f * c.z;
      float s_ = c.x - 0.0894841775f * c.y - 1.2914855480f * c.z;

      float l = l_ * l_ * l_;
      float m = m_ * m_ * m_;
      float s = s_ * s_ * s_;

      return float3(
          +4.0767416621f * l - 3.3077115913f * m + 0.2309699292f * s,
          -1.2684380046f * l + 2.6097574011f * m - 0.3413193965f * s,
          -0.0041960863f * l - 0.7034186147f * m + 1.7076147010f * s
      );
  }
\`\`\`

### Unreal
**Unreal**에서는 $Lab, LCh$을 통해서 **Tint color**를 크게 개선할 수 있다.
일단은 확인을 위해서 Custom 노드에 하드 코드를 적용시켜 보았다.
중간의 노드들은 TintColor의 채도를 구해 $LCh$의 chroma에 적용시켜 주는 수식이다.

$
C = 1 - Min(R,G,B)/Max(R,G,B)
$

![alt text](image-3.webp)
명도의 차이가 거의 없이 Tint color가 적용된 모습.
![alt text](image-6.webp) |![alt text](image-4.webp) |
--- | --- |
![alt text](image-7.webp) | ![alt text](image-7.webp) |

## Result

![alt text](image-10.webp)`,

  'ComputerGraphics/rasterizingandovershading': `---
title: Rasterizing and Overshading
date: 2026-04-21
tags: Rendering
---
[Rasterization, Overshading, and the GBuffer](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/aPo/rasterization-overshading-and-the-gbuffer)

---

## Overshading
### Rasterizing

- 픽셀 그리드로 버텍스 정보를 렌더링 하는것
- 1개의 픽셀에는 **무조건 1개의 polygon만 존재한다.**
- 100,000개의 폴리곤이 아주 멀리 있어 1픽셀 만큼의 크기로 보인다면 그 1픽셀엔 1개의 폴리곤만 렌더된다.

하드웨어는 렌더할때 항상 2x2 픽셀 쿼드 가 사용 된다. 아주 작은 1픽셀 짜리 오브젝트를 렌더링 한다고 해도 4개의 픽셀이 그룹으로 연산된다.
초록색 - 폴리곤 영역
주황색 - 연산되는 픽셀

이와 같은 원리로 근접한 폴리곤에서 overshading이 발생한다.
![alt text](image-2.webp)|![alt text](image-3.webp)
--- | --- |
추가 폴리곤 영역 | 빨간부분 - overshading |

## Visualize
\`\`\`
view mode - OptimizationViewMode - Quad Overdraw
\`\`\`
폴리곤이 작게 몰려있는 픽셀에서 overshading 이 많이 발생 한다.
![alt text](image-4.webp)

1. 밀도가 높은 곳이 높은 비용을 가진다.
2. 거리가 멀어지면 밀도가 높아진다.
3. 아주 얇거나 작은 트라이 폴리곤은 overshading을 유발한다.

3번의 이유로 이러한 폴리곤을 가진 모델링은 좋지 않다.
![alt text](image-5.webp)`,

  'ComputerGraphics/shapingFunctions': `---
title: Shaping Functions
date: 2026-05-09
tags: code
draft: false
order: 1
---

입력값 $t \\in [0, 1]$을 원하는 곡선 형태로 변환하는 함수들.

## Smoothstep

$$
S(t) = 3t^2 - 2t^3
$$

양 끝에서 $S'(0) = S'(1) = 0$이라 연결이 자연스럽다. 가장 많이 쓰이는 shaping function.

Smoother step (Ken Perlin):

$$
S(t) = 6t^5 - 15t^4 + 10t^3
$$

2차 미분까지 0이라 더 부드럽다.

\`\`\`hlsl
float t = saturate(t); // 0~1 클램프
float smooth  = t * t * (3.0 - 2.0 * t);
float smoother = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
\`\`\`

## Power (Bias)

$$
f(t) = t^n
$$

- $n < 1$: 초반에 빠르고 후반에 느림
- $n = 1$: 선형
- $n > 1$: 초반에 느리고 후반에 빠름

\`\`\`hlsl
float f = pow(t, n);
\`\`\`
---
## Parabola
![alt text](msedge_pVZy7sMLTk.webm)
$$
f(t) = \\left(4t(1-t)\\right)^n
$$

$t = 0$과 $t = 1$에서 $0$, $t = 0.5$에서 최대값 $1$. 펄스나 bump 형태를 만들 때 유용.

\`\`\`hlsl
float f = pow(4.0 * t * (1.0 - t), n);
\`\`\`
---
## Gain
![alt text](msedge_kTE391Qhhz.webm)
$$
g(t, k) =
\\begin{cases}
\\dfrac{f(2t,\\, k)}{2} & t < 0.5 \\\\[6pt]
1 - \\dfrac{f(2 - 2t,\\, k)}{2} & t \\geq 0.5
\\end{cases}
, \\quad f(t, k) = t^k
$$

$t = 0.5$를 기준으로 대칭인 S자 곡선. $k > 1$이면 중간이 급해지고, $k < 1$이면 중간이 평탄해진다.

\`\`\`hlsl
float gain(float t, float k)
{
    float a = 0.5 * pow(2.0 * (t < 0.5 ? t : 1.0 - t), k);
    return t < 0.5 ? a : 1.0 - a;
}
\`\`\`
---
## Triangle / Sawtooth Wave
![alt text](msedge_Ezt9ITFTnu.webm)
Sawtooth:

$$
f(t) = \\text{frac}(t \\cdot n)
$$

Triangle:

$$
f(t) = \\left| 2\\,\\text{frac}(t \\cdot n) - 1 \\right|
$$

반복 패턴 생성에 사용.

\`\`\`hlsl
float sawtooth = frac(t * freq);
float triangle = abs(frac(t * freq) * 2.0 - 1.0);
\`\`\`
---
## Sine-based
![alt text](image-1.webp)
$$
f(t) = \\sin(\\pi t)
$$

높이를 $[0, 1]$ 범위로:

$$
f(t) = \\frac{\\sin(2\\pi t) + 1}{2}
$$

\`\`\`hlsl
float bell       = sin(t * 3.14159265);
float oscillation = (sin(t * 6.28318530) + 1.0) * 0.5;
\`\`\`
---
## Exponential
![alt text](msedge_9KKgG539de.webm)
감쇠:

$$
f(t) = e^{-kt}
$$

점근 상승:

$$
f(t) = 1 - e^{-kt}
$$

$k$가 클수록 변화가 빠르다. 스프링, 물리 기반 이징에 자주 쓰임.

\`\`\`hlsl
float decay = exp(-k * t);
float rise  = 1.0 - exp(-k * t);
\`\`\`

>[!note]
>$e$는 자연상수($\\approx 2.71828$)로, $\\frac{d}{dt}e^t = e^t$인(미분해도 자기 자신인) 유일한 함수다. 변화율이 현재 값에 비례하는 현상을 자연스럽게 표현한다.
`,

  'ComputerGraphics/taa': `---
title: Anti Aliasing
date: 2026-05-20
tags: rendering, post processing
draft: false
---

[Tech Focus: TAA - Blessing Or Curse? Temporal Anti-Aliasing Deep Dive](https://www.youtube.com/watch?v=WG8w9Yg5B3g)

---

## Super Sample AA (SSAA)
더 높은 해상도의 이미지를 현재 해상도로 압축 하는 방식
- 해상도를 배로 늘리기 때문에 FPS 차이가 심하다.

## Multi-Sample AA (MSAA)
Forward Rendering 방식에서 기하학적 가장자리(폴리곤 엣지) 부분만 처리 하여 SSAA 의 절충안으로 사용 되었다.
![alt text](image.webp)
- 현대의 deferred rendering 에서는 호환 되지 않는다.
- 비에 젖거나 메탈 같은 특정한 쉐이딩에는 효과가 적다.

## Fast Approximate AA/Subpixel Morphological AA (FXAA/SMAA)
Deferred rendering 에 맞춰 개발된 포스트 프로세싱 단계의 안티 에일리어싱. 렌더된 씬에서 엣지를 찾아 적용하는 방식으로 속도가 빠르다.
- 화면이 움직일때는 가장자리를 잘 찾지 못한다.


## Temporal AA (TAA / Temporal Super Sampling AA)
슈퍼 샘플링을 시간축(temporal)으로 보정하여 적용 하는 방식. SSAA 와 유사한 효과를 내기 위해서 이전 프레임의 이미지를 지터링(jittering) 하여 여러 프레임에 걸쳐 픽셀 정보를 축적 한다.
기하학적 요소 뿐만아니라 셰이딩, 반사, 조명등 전반적인 이미지에 효과를 준다. 전통적인 슈퍼 샘플링은 GPU 자원을 막대하게 소모하지만, TAA는 프레임 데이터를 재활용하는 방식이라 성능 비용이 매우 낮다.


### 단점
높은 FPS 에서는 효과가 좋지만 낮은 FPS 에서는 고스팅 현상 및 지터링 오류가 쉽게 일어난다.
![alt text](image-4.webp)

해상도와 거리에 대한 의존성 - 저해상도로 플레이할 수록 블러링과 고스팅 현상이 심해짐
![alt text](image-1.webp)
![alt text](image-2.webp)
![alt text](image-3.webp)



사용자가 화면에 가까이서 플레이할 경우 알아차리기 쉽다.

## 렌더 파이프라인
\`\`\`                                                                             
  [1] Vertex Shader                                                                            
         ↓                                                                                     
  [2] Primitive Assembly (삼각형 조립)                                                         
         ↓                                                                                     
  [3] Rasterization  ←─────────── 🔵 MSAA / SSAA 가 여기서 작동                                
         ↓                          (어떤 픽셀/서브픽셀을 덮는지 결정)
  [4] Pixel/Fragment Shader  ←──── 🔵 SSAA N배 실행
         ↓                          (MSAA는 1번만 실행)
  [5] Depth/Stencil Test
         ↓
  [6] Blending → Framebuffer
         ↓
  [7] Resolve (MSAA → 1×)  ←────── 🔵 MSAA 다운샘플
         ↓
  [8] Post-processing  ←────────── 🟢 FXAA / SMAA 1x
         ↓                          🟡 TAA 
  [9] Tone mapping / UI
         ↓
  [10] Present (화면 출력)
\`\`\``,

  'Game/DitherTemporalAA': `---
title: DitherTemporalAA
date: 2026-04-16
tags: Unreal Engine, Material, optimization
---

DitherTemporalAA 노드는 픽셀 점묘 패턴을 생성하는 procedural meterial function 이다. **Opaque 나 Masked 같은 불투명 메테리얼을 블렌딩할 때 주로 사용된다.**

DitherTemporalAA 는 **시간적 데이터**를 기반으로 생성되고 패턴은 프레임마다 바뀐다.
- Frame 1 : 점 패턴 생성
- Frame 2 : 패턴 들의 사이 갭을 렌더
- result : 사람 눈에 더 부드럽게 보임 -> **플리커링 현상 없음**

![alt text](<2026-04-17 01-48-33_trimmed-1.webm>)

테스트 하는 법
\`\`\`
Detail -> Blend Node -> Masked
\`\`\`
![alt text](image.webp)

### Use case

- LOD 교체시 부드럽게 블렌딩 가능
- PDO 와 조합시 메쉬간의 부드러운 블렌딩 가능 - [참조](../Pixel-Depth-Offset-(PDO)/Pixel-Depth-Offset-(PDO).md)
- foliage 블렌딩.


## Pros & Cons

### Pros
- Translucency 보다 비용이 싸다.
- 순서대로 렌더 되는게 아닌 **depth-buffer을 사용** 하기 때문에 우선순위를 맞출 필요도 없고 플리커링이 생길 일도 없다.

### Cons
- 이전 프레임(시간적 데이터)에 의존하기 때문에, 움직이는 물체 뒤에 **잔상이 남을 수 있다.**
`,

  'Game/HoudiniEngineGroupAttribute': `---
title: Attribute, Group
date: 2026-05-12
tags: Unreal Engine, Houdini Engine
draft: false
---

https://www.sidefx.com/docs/houdini/unreal/attributes.html

---

Unreal에서 자동으로 인식되어 특정한 기능을 하는 attribute들

## Attribute

unreal_bake_folder | prim, detail | string
--- | --- | --- |
unreal_output_name | any | string

## Group

(rendered_)collision_geo_(simple,box,...) | collision |
--- | --- |
lod_* | LOD |`,

  'Game/HoudiniPlugin': `---
title: Houdini for Unreal
date: 2026-05-12
tags: Unreal Engine, Houdini Engine
---

## Houdini Engine install
**HoudiniEngine 폴더를 복사**
Houdini Engine : \`C:\\Program Files\\Side Effects Software\\Houdini Engine\\Unreal\\X.Y.Z\`

**언리얼 플러그인 경로에 붙여넣기**
Unreal Plugin : \`C:\\Program Files\\Epic Games\\UE_X.Y\\Engine\\Plugins\\Runtime\`

>[!note]
>5.7-PCG = 기존의 HDA지원 + PCG 그래프 워크플로우

## HoudiniEngineExamples

1. [HoudiniEngineForUnreal-ContentExamples](https://github.com/sideeffects/HoudiniEngineForUnreal-ContentExamples) zip 다운로드
2. unzip
3. \`HoudiniEngineForUnreal-ContentExamples\\Plugins\\Runtime\` HoudiniEngineExample 복사
4. \`C:\\Program Files\\Epic Games\\UE_X.Y\\Engine\\Plugins\\Runtime\` 또는 개인 프로젝트 \`Plugins\\Runtime\` 에 붙여 넣기
5.\`Menu\` > \`Edit\` > \`Plugins\` > \`HoudiniEngineExamples\` - 재시작
    ![alt text](image-1.webp)
6. \`Menu\` > \`Houdini Engine\` > \`Browse Contents Examples...\`

## Sync
실시간으로 HDA의 수정을 반영 하는 워크플로우
Unreal과 연동된 Houdini 실행
\`Menu\` > \`Houdini Engine\` > \`Open Houdini Session Sync...\`

HDA를 Rebuild 해주면 후디니창에서 해당 HDA를 수정할 수 있고 수정 하면 실시간으로 언리얼에 반영 된다.`,

  'Game/Pixel-Depth-Offset-(PDO)': `---
title: Pixel Depth Offset (PDO)
date: 2026-04-16
tags: Unreal Engine, Material
---

Pixel Depth Offset (PDO) 는 depth buffer 에 적용 되는 픽셀의 Depth 값을 조정하는 속성이다. 쉐이더를 통해서 카메라에 더 가까이 보내거나 더 멀리 보낼 수 있다.
![alt text](<2026-04-17 01-32-53_trimmed.webm>)

>[!important]
>vertex를 물리적으로 움직이는 WPO 와는 다르게 PDO 는 occlusion과 z-buffer 에 쓰이는 depth data 만 조작한다.


## Use Case

통상적으로 [DitherTemporalAA](../DitherTemporalAA/DitherTemporalAA.md) 노드와 함께 사용하며 겹쳐있는 메쉬를 블렌딩 할때 쓴다.
![alt text](UnrealEditor_mY40lC1jo5.webp)




`,

  'Game/Reflections': `---
title: Reflections
date: 2026-04-22
tags: Unreal Engine, rendering, shading
---

[An In-Depth look at Real-Time Rendering - Reflections](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/rEl/an-in-depth-look-at-real-time-rendering-reflections)

---

## Reflections

- Reflection 은 real-time 으로 렌더링 하기엔 비용이 크다.
- 3가지의 방법이 있으며 장단점이있다.
- 3가지 방식은 순차적으로 블렌딩된다.
- Lumen이 켜져 있다면 꺼야 적용 된다.

>[!note]
>PostProcessingVolume, Project Setting 에서 Lumen, SSR, none 을 선택 가능하다. Caputer 기능은 Lumen 환경에선 Lumen 이 오버 라이드 된다.

### Reflection Captures

- 액터 로케이션 기준으로 정적 큐브맵을 캡쳐하여 범위내 오브젝트에 블렌딩 하는 방식
- 여러 개 배치 가능
- 매우 빠르다
- 살짝 부정확

\`\`\`
place actor > Visual Effect > Sphere/Box Reflection Capture
Build > Build Reflections Capture
\`\`\`

캡쳐 Resolution 설정
\`\`\`
Project Setting > Reflection Capture Resolution
\`\`\`

기본적으로 큰 것들을 여러개 배치해 원하는 지역을 덮고 반사성이 높은 객체에 작은 것들을 배치한다.
겹치는 개수만큼 블렌딩 연산을 하기 때문에 염두해두고 배치 한다.

![alt text](image.webp)

### Planar Reflections

- 평면에 캡쳐
- 평면이 아니라면 제한적임
- 무거워질 수 있음
- 비교적 정확함
\`\`\`
place actor > Visual Effect > planar Reflection Capture
\`\`\`


### Screen Space Reflections (SSR)
1. 기본 reflection 시스템
2. real-time
3. 정확함
4. 노이즈가 끼고 조금 무겁다.
5. 현재 화면에 렌더링되어있는 것들만 반사한다.


reflection capture는 레벨을 로딩할 때 발생한다. 캡쳐할 것이 많다면 시간이 오래 걸릴 수 있다. - 패키징 하면 문제 해결 된다.


### Skylight

skylight 에도 reflection 캡쳐가 존재한다.
![alt text](image-1.webp)
150000 유닛 을 클립 하고 캡쳐 하기때문에 스카이 큐브맵만 캡쳐한다. 오브젝트 주위에 reflection capture 액터가 없다면 skylight의 큐브맵을 reflection으로 사용 하게 된다.`,

  'Game/ShadersAndMaterials': `---
title: Shaders and Materials
date: 2026-04-22
tags: Unreal Engine, Rendering, shading
---

[Shaders and Materials](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/j1v/shaders-and-materials)

---

## Pixel Shaders
- GPU 가 연산
- 픽셀에서 실행 되는 프로그램
- 모든 픽셀에서 연산
- 렌더링의 모든 단계, 모든 부분에 사용됨.
    - material 시스템
    - lighting
    - post process
    - color correction
    - ...
- 쉐이더 언어로 작동됨 - 플랫폼 마다 상이
    - \`DirectX\` > \`HLSL\`

Shader Complexity 뷰에서 봤을 때 하단 바를 보면 현재 십자선을 기준으로 PS(Pixel Shader) VS(Vertex Shader) 의 복잡도를 보여준다.
![alt text](image-3.webp)

복잡한 PS는 pixel 단계에서 연산이 되기 때문에 pixel 에 적게 노출 되는, 멀리 있는 오브젝트에 있는 편이 낫다.

### 작동 방식

#### 기존 쉐이더 방식
1. 쉐이더가 작성됨
2. 짜여진 쉐이더 코드에 변수나 텍스쳐가 더 추가됨
3. 모델링에 출력

#### Unreal 에서
1. HLSL 코드가 USF 파일로 저장됨
    - Material Editor의 그래픽 노드 인터페이스 에서 USF 템플릿을 노드로 변한하여 사용함
3. Editor에서 작업된 것들이 컴파일되어 새로운 셰이더로 작성됨
    - 셰이더가 컴파일되어 Material Instance를 생성
4. 모델에 적용

Material Editor 에서 작성된 메테리얼 HLSL 확인
\`\`\`
Window > Shader Code > HLSL Code
\`\`\`

USF 템플릿 경로 : \`C:\\Program Files\\Epic Games\\UE_5.6\\Engine\\Shaders\\Private\`

이것들이 전부 제공하는 템플릿이고 사용자가 원하는 쉐이딩 모델 템플릿을 추가 해서 늘릴 수도 있다.
![alt text](image-1.webp)

## Materials
머티리얼은 대부분 Physical Based Rendering (PBR) 기반의 통합된 쉐이딩 파이프라인을 가진다.

### 쉐이딩 통합의 이점
1. 단일화로 인한 효율
2. 일관적이고 예측 가능한 파이프 라인 구축 가능.
3. G-buffer 상속에 대한 제약
PBR은 거의 모든 재질이 roughness 와 metalic으로 조절이 가능하다.
![alt text](image-2.webp)


stats 창을 보면 shader 가 얼마나 연산하는지 알수 있다 보통 100~300
![alt text](image-4.webp)
`,

  'Game/culling': `---
title: Culling
date: 2026-04-17
tags: optimization
---
[Unreal Doc - Visibility and Occlusion Culling](https://dev.epicgames.com/documentation/unreal-engine/visibility-and-occlusion-culling-in-unreal-engine#cullingmethods)
[Unreal Doc - Cull Distance](https://dev.epicgames.com/documentation/unreal-engine/cull-distance-volumes-in-unreal-engine)
[Precomputed Visibility Volumes](https://dev.epicgames.com/documentation/unreal-engine/precomputed-visibility-volumes-in-unreal-engine)

---

>[!important]
>Culling은 Rendering 이전에 작동 한다.

보이지 않는 메쉬들을 제외시켜 드로우콜을 낮추는 방법

## Culling Methods

비용이 싼 culling 부터 아래의 순서대로 작동한다.

1. Distance Culling
2. Frustum Culling
3. Precomputed Visibility
4. Nanite Culling
5. Occlusion Culling




## Frunstum, Occlusion

![alt text](image.webp) | ![alt text](image-1.webp) |
--- | --- |
Frustum | Frustum + Occlusion

### 컬링 확인 하는법

\`\`\`
r.VisualizeOccludedPrimitives 1 
stat initviews
\`\`\`


## Distance Culling

화면에 1px 정도 차지하는 아주 작은 메쉬라도 엔진은 한번의 드로우 콜을 생성한다. 사실상 육안으로 보이지 않는 부분에서 CPU 비용을 사용 하는 것. Distance Culling 은 이런 것들을 강제적으로 Culling 해주는 기법이다.

### 사용법

\`\`\`
Volume -> Cull Distance Volume
\`\`\`

여러 Cull Distance Pair를 만들어 다양한 크기의 오브젝트를 컬링한다.
![alt text](examplescenecdvvalues.webp)

- 약 200 유닛 오브젝트 + 카메라 거리 1000 유닛 이상 컬링됩니다.
- 약 500 유닛 오브젝트 + 카메라 거리 2000 유닛 이상 컬링됩니다.
- 약 1000 유닛 오브젝트 컬링 X


## Precomputed Visibility Volumes

셀 단위에 가시성 데이터를 저장 하여 플레이어/카메라 의 위치에 따라 셀 안에 있는 오브젝트를 컬링 하는 기법. 매 프레임 계산하는 Occlusion Culling 보다 저렴하다.



가시성 데이터는 **라이팅 빌드**시 저장 된다. 이미 라이팅을 빌드 했다면 따로 빌드 할 수 도 있다.

\`\`\`
World Settings > Precompute Visibility 체크
Actor > Volume > precompute Visibility volume 배치
build > light

Show > Advanced > Precomputed Visibility 
\`\`\`
![alt text](image-2.webp)
>[!tip]
>r.ShowRelevantPrecomputedVisibilityCells 을 사용하면 카메라 가까이에 있는 셀만 표시된다.
`,

  'Game/drs': `---
title: Dynamic Resolution Scaling (DRS)
date: 2026-05-20
tags: optimization
draft: false
---

[Tech Focus - Dynamic Resolution Scaling: A Great Fit For PC Gaming?](https://www.youtube.com/watch?v=180nuQJccTA)
[Dynamic resolution scaling in Monogame/XNA](https://konradzaba.github.io/blog/tech/Dynamic-resolution-scaling-in-Monogame-XNA/)
[Dynamic Resolution](https://yggdrasil-917.github.io/posts/dynamic-resolution/dynamic-resolution/)

---

## DRS

GPU의 렌더링 시간은 해상도에 비례 하는 특성을 이용해 부하가 높은 장면에서 해상도를 동적으로 조절하여 프레임 레이트를 유지하는 방식.
- 해상도를 낮추는 방식이기 때문이 이미지의 퀄리티 저하는 어쩔 수 없다.
- CPU 병목 현상에 대한 큰 효과는 없다.
- 최저 해상도 제한, 타겟 프레임 레이트, 헤드룸 설정 등 매개변수가 존재한다.

### 구성
- Target Framerate - 기준이 되는 목표 프레임
- Updata Interval - 얼마나 자주 스케일링을 할 것 인지
- Minimum Height Resolution - 최저 해상도 한계 설정 통상적으로 50% 
- GPU Headroom Before Increasing - GPU 활용도 측정, 해상도 높일 수 있을지 결정
- Decrease Rate of Change - DRS 가 해상도를 낮추는 비율
- Increase Rate of Change - DRS 가 해상도를 올리는 비율

## 원리

1. 이전 프레임의 GPU 시간 측정
2. 비례 모델 설정 
3. 다음 프레임 시작시 새 스케일 반영.
4. TAA 적용


### 비례 모델
가로 세로 양축을 모두 줄이거나, 한쪽 축만 줄이는 방식이 있다. 영상은 때에 따라 한쪽 축만 조정하는 것이 시각적으로 덜 거슬릴 수 있기 때문이다.
- 가로 선의 패턴이 잘 보이는 씬의 경우 x축만 줄이는 방식은 눈에 띌 수 있다.

$S' = S × (T / t)^k$

$S =$ 현재 해상도 스케일
$S' =$ 새 해상도 스케일
$T =$ 목표 프레임 시간
$t =$ 측정된 현재 프레임 시간
$k =$ 변화율 상수

`,

  'Game/game-optimization-01': `---
title: "Game Optimization 01 - Introduction & General Principles"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[Game Optimization - Introduction & General Principles - Episode 1](https://www.youtube.com/watch?v=jt8b0cpjUVk&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD)

---

최적화는 성능을 측정하는 것에서 부터 시작 한다.

![](image-1.webp)

### 최적화에는 크게 두가지가 존재

1. **에셋 단계**에서의 최적화
    - 각 에셋들의 최적화
    - 폴리곤 수, 드로우콜, 텍스쳐 사이즈 등
    - 에셋이 생성 될때
2. **게임, 레벨** 최적화
    - 씬 전체 적인 분석
    - 병목현상 분석
    - 전체적인 성능 향상

![](image-2.webp)

최적화는 모든 과정에서 진행 되어야 한다.
`,

  'Game/game-optimization-02': `---
title: "Game Optimization 02 - The Graphics Pipeline and Rendering Types"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[The Graphics Pipeline and Rendering Types - Game Optimization - Episode 2](https://www.youtube.com/watch?v=27Am6QaH_Hc&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD&index=2)

[Forward and Deferred Rendering - Cambridge Computer Science Talks](https://www.youtube.com/watch?v=n5OiqJP2f7w)

[디퍼드 렌더링, 포워드 렌더링이란? 그리고 차이점에 대해서](https://hub1234.tistory.com/50)

[OpenGL - deferred rendering](https://www.youtube.com/watch?v=0ckE-CZpXAo)

---

![](image-3.webp)

병목 현상이 일어날 수 있는 단계:

- CPU → GPU
- 많은 vertex → Vertex Shader
- 복잡한 Shader → Pixel Shader

## Rendering Methods

### Forward

- 오브젝트 하나씩 연산
- 오브젝트당 모든 라이트를 연산
- Back to Front rendering - Transparent Surfaces
- 장점
    - 간단한 씬에는 좋음
    - 각 오브젝트당 유니크한 쉐이딩이 가능함 (라이팅을 다 따로 계산 하기 때문에)
    - 텍스처 메모리를 적게씀 (오브젝트는 하나씩 렌더링 되기 때문에)
- 단점
    - 라이트에 대한 비용이 비쌈
    - drawcall = meshes * lights → CPU 에도 부담

불투명 메쉬가 겹치는 방식에 사용되었던 Z-buffer를 더 응용하여 G-buffer를 사용하는 Deferred Rendering 이 나오게됨

### Deferred Rendering

- 모든 오브젝트의 텍스쳐 데이터(normal, worldposition, roughness, metal…)를 한장으로 합친다. - G-buffer
- G-buffer 데이터를 합친 후에 모든 라이트를 한번에 계산한다.
- 장점
    - 라이트가 많아도 렌더링이 빠르다
    - 비주얼적으로 뛰어남
- 단점
    - G-buffer 데이터를 축적해 놔야 하기 때문에 많은 memory 요구
    - No Transparent support
    - 다양한 쉐이더는 문제가 될 수 있다.

![엔진은 두 방법을 같이 쓴다. opaque - Deferred, transparent - Forward](image-4.webp)

![Shader Complexity 디버그 모드에서 Transparent 메테리얼을 가진 오브젝트가 분홍색으로 보이는 모습](image-5.webp)

엔진에서 Transparent 쉐이더는 라이트 까지 같이 계산 하기 때문에 비교적으로 비싸게 나오지만, 실제론 그렇지 않은 경우가 있다.
`,

  'Game/game-optimization-03': `---
title: "Game Optimization 03 - Preproduction Optimization Steps"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[Preproduction Optimization Steps - Game Optimization - Episode 3](https://www.youtube.com/watch?v=Q05R_UKhRo4&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD&index=4)

---

![](image-6.webp)

1. 하드웨어의 기준을 정하기
    - 타겟 기기 - 모바일, 콘솔, PC
    - 권장 사양, 최소 사양, 해상도, FPS 등의 기준이 되는 목표를 정하는것
2. 해당 사양의 기기가 어느정도의 퍼포먼스를 내는지 확인
    - Polygon, Drawcall, Memory
3. Budget 내에서 각 파트마다 사용할 수 있는 리소스를 배분
    - UI, 에셋, …
4. 실시간 Budget 추적 하기

![](image-7.webp)

## 퍼포먼스 측정

- 에디터 외부에서 측정 하기 (ex. 콘솔)
    - 에디터의 사용량을 제외한 게임 자체의 퍼포먼스를 확인
- 고정된 카메라나 경로를 이용
    - 가장 성능이 저조한 곳에 카메라 설정
    - 측정시 마다 카메라가 조금이라도 흔들린다면, 의도한 값이 왜곡되어 보일 수 있음
- Isolation
    - 환경 에셋을 확인 한다면, FX, PP 전부 off 시킨 상태에서 확인
- 엔진의 프레임률을 고정 하는 설정은 전부 끄기
    - UE - Frame smoothing 끄기
    - Vsync
- Tracking Results
    - 고정된 카메라에서의 초기 퍼포먼스와 실시간 변화율을 추적하기

### Unreal에서
프로젝트 스탯 확인
\`\`\`
stat Unit graph
\`\`\`
프로젝트 패키징
\`\`\`
Platforms -> Window -> Package Project
\`\`\`
`,

  'Game/game-optimization-04': `---
title: "Game Optimization 04 - Analyze First, Then Optimize"
date: 2026-04-16
tags: optimization
series: Game Optimization
---

[Game Optimization - Introduction & General Principles - Episode 4](https://www.youtube.com/watch?v=XgaEqRXVmO0)

---

>[!important]
>최적화 이전에 어느 곳에서 문제가 생기는지 파악 하고 분석하는것이 급선무.

**CPU, GPU bound**
- 퍼포먼스의 차이로 한쪽의 프로세서가 다른 한쪽의 진행을 기다리며 나타나는 병목 현상.
![alt text](image.webp)

GPU bound 확인 법
\`\`\`
1. editor 밖에서 게임을 실행한다.
2. framerate counter 를 실행
3. 창 해상도를 줄인다.
4. 성능이 향상된다면 GPU bound
\`\`\`
![alt text](msedge_RnoiCNYD0B.webp)

editor 밖에서 standalone 모드로 실행하는 법
\`\`\`
툴바에서 Platforms -> Window -> Package Project
\`\`\`

![alt text](msedge_BdaTdiTdet.webp)
\`\`\`
Frame : 전체 프레임 처리 시간.
Game : CPU의 게임 스레드 에서 게임 로직을 처리하는데 걸리는 시간
Draw : CPU 가 GPU로 보낼 Draw call 을 준비하고 처리하는 시간.

GPU Time: GPU 가 실제 화면을 렌더링 하는 시간. 
\`\`\`

### EvaluateWPO
shader 에서 적용 되는 **World Position Offset**
초록 부분 활성화, 빨간 부분 비활성화
\`\`\`
View mode -> Nanite Visulization -> EvaluateWPO
\`\`\`
![alt text](image-1.webp)

### pixel programing
빨간 색이 연산 많은 곳
\`\`\`
View mode -> Nanite Visulization -> Pixel Programmable
\`\`\`
![alt text](image-4.webp)


![alt text](UnrealEditor_UhOoaNTdPB.webp)|![alt text](UnrealEditor_QcnFdLc06o.webp) |![alt text](image-3.webp)|
--- | WPO 최적화 | PDO off |

쉐이더 단계 에서 최적화를 했는데 Draw 콜이 왜 낮아지나 싶지만,
WPO는 CPU가 Draw를 준비하는 과정에서 프레임마다 변하는 vertex의 위치를 계산하여 최신화 해야하기 때문
PDO 는 [여기로](../Pixel-Depth-Offset-(PDO)/Pixel-Depth-Offset-(PDO).md)
`,

  'Game/game-optimization-05': `---
title: "Game Optimization 05 - What to do if you're CPU Bound"
date: 2026-04-17
tags: optimization
series: Game Optimization
---

[What to do if you're CPU Bound - Game Optimization - Episode 5](https://www.youtube.com/watch?v=SwWW36mbDhU&list=PL78XDi0TS4lG4wvgfyGECmB8XiJLCgfFD&index=5)
[Visibility and Occlusion Culling](https://dev.epicgames.com/documentation/unreal-engine/visibility-and-occlusion-culling-in-unreal-engine)

---

## High Draw Calls
- Instancing / [Batching](../../ComputerGraphics/Batching/Batching.md)
- Occlusion Culling
- Level Layout
- Early Distance Culling
- HLODS


## Unreal에서 Occlusion Culling 확인하기


\`\`\`
콘솔 -> r.VisualizeOccludedPrimitives 1 
\`\`\`
![alt text](image.webp)

## Level Layout

레벨 단계에서 특정 위치에선 특정 레이아웃만 보이게 계획한다면 컬링 시 큰 도움이 된다. 큰 맵에선 단일 트리거로 한 번에 컬링할 수 있다.
![alt text](image-1.webp)

## Early Distance Culling
화면에 비치는 오브젝트가 얼마나 작은지, 또는 카메라와의 거리에 따라 컬링해 주는 기법. 한 화면상의 2픽셀 정도 오브젝트도 1의 드로우콜을 발생시키기 때문에 필터링해 주는 것이다.

\`\`\`
Volume -> Cull Distance Volume
\`\`\`
[Distance Culling](../culling/main.md#distance-culling)


## Hierarchical Level of Detail (HLODS)

1. 오브젝트를 그룹으로 묶는다.
2. 오브젝트들을 단일 메시로 베이크한다.
3. 거리에 따라 각 그룹의 오브젝트들은 단일 메시로 치환된다.
- 많은 양의 드로우콜을 절약할 수 있다.

## CPU Bound with Low Draw Calls
드로우콜이 낮음에도 CPU 연산 시간이 높다면 확인해야 할 것들이 있다. 오브젝트의 처리보다 보이지 않는 곳에서 연산을 많이 한다.
- Pathfinding
- NPC AI logic
- Complex collision or physics
- Game logic
- Other CPU-intensive task`,

  'Game/game-optimization-06': `---
title: "Game Optimization 06 - What to do if you're GPU Bound"
date: 2026-05-19
tags: optimization
series: Game Optimization
draft: flase
---

[What to do if you're GPU Bound](https://www.youtube.com/watch?v=hjjodpsZ70Q)
[When Optimisations Work, But for the Wrong Reasons](https://www.youtube.com/watch?v=hf27qsQPRLQ)

---
## GPU Bound
GPU 병목이 발견 될시 지오메트리 또는 쉐이더(포스트 프로세싱) 두가지의 방향을 잡을 수 있다. 먼저 현재 하드웨어가 처리 할 수 있는 폴리곤 카운트를 기준으로 둘중 하나를 확인해 보면 된다.
![alt text](image.webp)

## GPU Bound with High Polygon Count

### LODs - Level of Detail
- 200 폴리곤이 넘어가는 오브젝트는 LOD가 필요 하다.
- 각 LOD 는 이전 LOD 보다 50% 이하의 폴리곤을 가져야 한다.
- 마지막 LOD 는 100tri 보다 낮은 폴리곤 수를 가져야 한다.
- LOD 들은 카메라의 거리나 화면의 사이즈에 비례해서 스위치 되어야 한다.

### Quad Overdraw
Quad(2*2픽셀) 안에 여러개의 오브젝트가 겹쳐 있어 프로세싱이 중복 되는 경우 LODs 의 진정한 이유는 Quad Overdraw를 피하기 위해서 이다.

>[!note]
>[overshading](../../ComputerGraphics/rasterizingandovershading/main.md#Overshading)참조

### Light Optimization
- 라이트의 수와 크기는 퍼포먼스에 영향을 준다.
- Engine 에서 lighting complexity 를 확인 가능 하다.
- Deferred 렌더 에서는 라이트 비용은 라이트의 크기에 비례한다.
- **라이트를 제거 하거나 라이트의 크기, 감쇠, 콘 앵글을 작게 만드는 것으로 렌더링 비용을 줄일 수 있다.**

### Shadow Optimization
- 필수적인 영역을 제외한 **그림자는 끄는 것이 좋다.**
- 포인트 라이트의 그림자는 특히 조심할것
    - 씬을 육면체의 큐브로 다시 렌더한다.
- 포인트 라이트 대신 스팟 라이트로 바꾸는 것을 고려 해보자
    - 스팟 라이트는 한 방향으로만 다시 렌더 하기 때문

## Pixel Bound
GPU 는 씬을 렌더할떄 추가적인 작업들을 실행 한다.
- Anti-aliasing, SSAO, DOF< Subsurface Scattering, Motion Blur
- 불필요한 포스트 프로세싱 작업들은 비활성화 한다.

### Overdraw Optimization
- Opaque 메쉬는 앞에서 뒤로 렌더 된다.
- Transparent 오브젝트는 뒤에사 앞으로 렌더 된다.
$\\rightarrow$ 픽셀 중복 렌더 $\\rightarrow$ Overdraw

Pixel 단계의 Overdraw는 스크린을 차지하는 크기를 줄이거나 중첩되는 개수를 줄이는 것이 기본적은 최적화 방향이다.
- Transparent 오브젝트나 빌보드 파티클 레이어들이 많으면 많을 수록 Overdraw 된다.
- 빌보드의 크기를 줄이거나 파티클 개수를 줄이는 것이 좋다.
- 엔진의 Overdraw view 모드로 overdraw 가 몰린 지점을 찾을 수 있다.
- 폴리지 와 같은 경우 Transpereny 대신 alpha clipping opaque를 사용 하는 것이 좋다.(unreal - Masked) 클리핑 된 픽셀은 오버드로우 되지 않는다.

### Dynamic Resolution Scaling - DRS
자체적으로 FPS 를 모니터링 하다 렌더 시간이 오래 걸린다면 렌더 레졸루션을 줄이는 기능이다.
- 해상도를 줄이기 때문에 전체 이미지 품질이 저하 된다.
- 퍼포먼스 결과가 왜곡 될 수 있기 때문에 테스트 때에는 꺼놓는 것이 좋고 모든 최적화가 끝난 후 파이널 빌드에서 사용 하는 것을 권장 한다.

- FPS 가 튀는 현상을 잘 잡아주어 **안정적인 FPS 를 유지하는데에 도움**이 된다.

>[!note]
>자세한 내용은 [여기](../drs/main.md) 참조

### Shader Optimization
- 복잡한 쉐이더는 픽셀에 부하를 줄 수 있다.`,

  'Game/pcg-density-scaling': `---
title: PCG Scale by Density 가 느린 이유
date: 2026-05-30
tags: optimization, PCG, GPU
draft: false
---
[Unreal Doc - Using PCG with GPU Processing](https://dev.epicgames.com/documentation/unreal-engine/using-pcg-with-gpu-processing-in-unreal-engine)
[Unreal Engine 5.6 PCG - Ep 9 - Introduction to GPU](https://www.youtube.com/watch?v=0tXVLP3MWhE&t=434s)
---

>[!important]
>Density는 빠르다. 느린 건 attribute로 빼는 순간이다.

PCG에서 density 기반 스케일링이 느린 건 연산량이 아니라 **데이터 접근 방식** 때문이다.

## Density vs Attribute

\`Density\`는 \`FPCGPoint\` 구조체에 인라인으로 박혀 있다. \`Points[i].Density\` — 배열 인덱싱 한 번으로 끝난다.

반면 직접 만든 attribute는 점 안에 값이 없다. 점은 \`MetadataEntry\`라는 int64 키만 들고 있고, 실제 값은 별도 저장소에 있다.

\`\`\`
// native (빠름)
Points[i].Density

// attribute (느림)
Points[i].MetadataEntry → 매핑 조회 → ValueArray[...]
\`\`\`

둘 다 점마다 처리하는 건 같다. 차이는 그 한 번의 접근이 **배열 인덱싱이냐, 키를 거친 간접 조회냐**다.

## 왜 키를 거치나

값을 공유하기 위해서다. 점 100만 개가 같은 값이면 저장소엔 값 1개만 두고 모든 키가 그걸 가리킨다. 메모리를 아끼는 대신 접근 속도를 내준 구조.

>[!warning]
>점마다 값이 전부 다르면 공유 이득은 0인데 간접 비용만 그대로 낸다. metadata는 속도가 아니라 유연성을 위한 범용 컨테이너라, 점 수십만 개를 매 프레임 도는 무거운 반복 구간에서는 그 키 조회 비용이 횟수만큼 곱해져 치명적이 된다.

## 해결

- attribute 왕복을 없애고 **native property**(\`Transform.Scale\`)로 직접 처리한다.
- 무거우면 **GPU PCG (5.4+)** 의 Custom HLSL 노드로 빠진다. 키를 거치는 간접 조회 없이 GPU가 버퍼를 직접 읽으므로 우회된다.

## GPU PCG 예시

Kernel Type을 **Point Processor**로 둔다. 출력 점은 입력에서 자동 복사되므로 바꿀 속성만 \`Set\`하면 된다.

\`\`\`hlsl
float dens = In_GetDensity(In_DataIndex, ElementIndex);
float3 scale  = In_GetScale(In_DataIndex, ElementIndex);

float Mul = lerp(0.2, 1.5, saturate(dens));
Out_SetScale(Out_DataIndex, ElementIndex, scale * Mul);
\`\`\`

>[!warning]
>로컬 변수를 \`Density\`, \`Scale\`처럼 대문자로 쓰면 안 된다. PCG Custom HLSL에 사전 정의된 식별자와 충돌해 accessor 매크로가 깨지고, 엉뚱하게 \`In_DataIndex\`/\`ElementIndex\`가 undeclared라는 에러로 번진다. \`dens\`, \`scale\`처럼 겹치지 않는 이름을 쓴다.

>[!tip]
>accessor 함수의 정확한 이름은 Custom HLSL 노드 → \`Window > HLSL Source Editor\` → **Declarations 패널**에서 핀 설정 기준으로 자동 생성된다. 이게 버전별 정답 소스다.

GPU 스폰 인스턴스는 런타임 GPU 메모리에만 존재하고 저장되지 않으며, 충돌, 물리, 내비게이션은 지원하지 않는다.
`,

  'Game/profiling': `---
title: Profiling
date: 2026-04-22
tags: optimization, Unreal Engine
featured: false
order: 
draft: false
---

\`\`\`
stat unit gragh
stat RHI - 드로우 콜
\`\`\`

## GPU Visiualizer
드로우 시간 중 어떤 것들이 비중을 차지하는지 시각적으로 알려줌

**캡쳐**
\`ctrl\`+\`shift\`+\`,\`

GPU time
![alt text](image.webp)


## RenderDoc

RenderDoc 은 렌더뷰를 캡쳐해 화면에 그려지기 까지의 그 과정을 볼 수 있는 profiling 툴이다.
![alt text](image-copy.webp)

렌더링 패스를 크게 나누면 이와 같다.
![alt text](image-1-copy.webp)

### 설치

[RenderDoc 설치](https://renderdoc.org/builds)
\`\`\`
plugin setting - RenderDoc 체크
project setting - RenderDoc - auto attached 체크
\`\`\`

## PIX

### 설치
세팅
![](paste-20260601114410.webp)
[PIX 다운로드](https://devblogs.microsoft.com/pix/download/)`,

  'Game/textures,pixelsshadersandmaterials': `---
title: Rendering and Textures
date: 2026-04-22
tags: optimization, Unreal Engine
---

[Rendering and Textures](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/beV/rendering-and-textures)

---

## Texture
- 텍스쳐는 임포트될 때 압축된다. - 메모리와 대역폭 한계가 있기 때문
- 플랫폼마다 압축 방법이 다르며 PC 는 BC(DTXC)를 사용한다.
- UE5에서는 다양한 BC 압축 방법이 존재한다.
- 쉐이더는 조회할 수 있는 텍스쳐 제한이 있다.

### Texture Streaming
어느 시점에 어느 mipmap을 로드할지 결정하는 프로세스. 엔진은  텍스트를 위해 **Streaming Pool** 이라고 하는 VRAM의 일정량을 미리 할당한다.

### Mipmap
- 원본의 1/4 크기의 사본 이미지
- 모든 사본 이미지는 텍스쳐에 저장된다.

밉맵이 없다면 먼 거리의 텍스쳐는 노이즈 처럼 보이는 현상이 일어난다. 폴리곤의 오버쉐이딩 같은 느낌. 밉맵은 블렌딩되어 적용된다.
![alt text](image.webp) | ![alt text](msedge_5WwuiHeqQO.webp) |
--- | --- |
mipmap 적용, 미적용 | 블렌딩 적용 방식 |

>[!note]
>streaming, mipmap 은 2제곱 크기의 해상도 를 지원한다.
GPU는 메모리를 절약을 위해 4*4 픽셀 블록 단위로 묶어서 압축된다.
>(직사각형)32x16도 지원한다.`,

  'Game/최적화시유용한커멘드': `---
title: 최적화시 유용한 커멘드
date: 2026-06-08
tags: Unreal Engine, optimization
featured: false
order: 
draft: false
series: 
---

\`\`\`
stat Unit
stat FPS
\`\`\`

\`\`\`
FreezeRendering
r.VisualizePrimitives 1
profileGPU

abtest r.Nanite.MaxPixelsPerEdge 1 5
abtest stop
\`\`\``,

  'Houdini/control-smoke-by-max-density': `---
title: Control Smoke by Max Density
date: 2023-04-05
tags: Volume, node, DOP
---

[https://www.youtube.com/watch?v=Wm4uGBcuh5g](https://www.youtube.com/watch?v=Wm4uGBcuh5g)

[http://127.0.0.1:45025/nodes/dop/gasreduce](http://127.0.0.1:45025/nodes/dop/gasreduce)

gasreduce 노드로 source field 의 max값

Dest Option : density / ( 이름 )

density filed에 저장이 된다. geometry 의 detail 같은 느낌

max(dopfield("/obj/ground_destruction_rnd/smoke/pyrosolver2/dopnet1","pyro","density","Options",0,"max"), dopfield("/obj/ground_destruction_rnd/smoke/pyrosolver2/dopnet1","pyro","density","Options",0,"maxmax") )

새로운 데이터 필드를 만들고, max를 불러 온다

이때 계산되는 순서가 다르기 때문에 maxmax는 한프레임 낮은 값을 가져오며 서로 다른 값들을 max(a,b) 펑션으로 지속적인 max값을 찾아준다.
`,

  'Houdini/extract-point-from-curve': `---
title: Extract Point From Curve
date: 2022-04-08
tags: node, SOP
---

![](https://i.imgur.com/mrodZ6c.png)

커브 위의 포인트 어트리뷰트를 이용해서 값을 보간하여 그위치에 포인트를 만들어 준다

![](https://i.imgur.com/s9Rqgrm.png)

distance attribute는 보간에 쓰이는 포인트 어트리뷰트

Cut Value Attribute는 어떤값의 위치에 포인트를 만들 것인가.
`,

  'Houdini/for-each-loof': `---
title: For each loop
date: 2021-02-09
tags: node, SOP
---

> [!warning] ⚠️
> 명령을 반복하여 값을 도출하는 노드

기본적으로 tab을 누른 후 for each를 검색 하면 여러 가지 For each가 나오는데, 자주 사용 하는 설정을 후디니에서 정해놓은거라고 생각 하면 될거 같다.

그 설정 들은 항목 이름 처럼  attribute(name), class에 따라 알맞게 되어있다.

<!-- Column 1 -->

<!-- Column 2 -->


제일 기본적으로 For each point 를 꺼내면 노드가 2개 나온다.

위의 노드가 input 아래 노드가 output이고 그 중간에서 명령이 반복 된다.

> [!note]+ 🧱Block Begin
> > [!note] 👇
> > 반복문의 값을 도출 하는 Block begin 노드의 항목들을 살펴보자
>
> > [!note]+ **Method** : begin 노드에 input되는 값의 출처를 정한다.
> > - **Fetch feedback** : end 노드에서 나온 값이 들어 간다 , begin노드에 직접적으로 연결 되는 것이 없어도 기능 한다.
> > - **Fetch Piece or Point** : input에 들어오는 point,piece 가 차례대로 들어온다
> >
> >
>
> ---
>
>

> [!note]+ 🧱Block End
> > [!note] 👇
> > 반복문의 값을 도출 하는 Block End 노드의 항목들을 살펴보자
>
> > ---
>
> ### Iteration methhod
>
> - 반복 하는 방법을 결정 한다. input에 대입 되는 point의 갯수 대로 반복 할 수 도 있고, 원하는 만큼 반복 시킬 수 도 있다.
>
> ---
>
> ### Gather Method
>
> - 도출 되는 결과 값을 어떻게 출력 할것인가를 정한다. 각자 계산된 값들을 따로 보거나, 한꺼번에 merge해서 볼 수있다.
>
> ---
>
> ### Piece Attribute
>
> - 체크 하면 attribute를 기준으로 명령을 할 수 있다. (이건 아직 잘 모르겠다.)
>
> ---
>
> ### Max Iteration
>
> - 최대 반복을 정해줄 수 있다.
>
> ---
>
> End 블록에 single pass를 체크해주면 순서대로 값을 따로 볼 수가 있다. 실제로 각자 값이 도출되는 것은 아니고 시각적으로만 확인하는 용도로 생각하자.
>
> 위 사진처럼 single pass == 0 상태에서는 제일 첫번째(pt0) 값이 나온다.
>




# EX

---

grid를 연결 한 모습이다. 별거 없어 보이지만, 명령이 없다 뿐이지 작동 하는 중이다.
`,

  'Houdini/gpu-pyro': `---
title: GPU Pyro
date: 2021-11-01
tags: TIP, Volume
---

GPU로 빠른 계산을 하는 pyro 솔버 에셋 노드이다.

하지만 이노드는 3가지의 볼륨밖에 없고 모션 블러에 필요한 vel이 없다.

solver안으로 다이브 해서 switch 대신 dopimport를 연결해 준다.

Vel이 같이 들어온 모습

후에 vel만 따로 가공해 준다.
`,

  'Houdini/group-node-tip': `---
title: Group node tip
date: 2022-01-09
tags: node
---

> [!note]+ Group node
>
> 각 면의 **노말을 베이스** 로 각도에 따른 그룹 선택
>
> 면도 마찬가지
>
> 가장 테두리에 있는 엣지가 선택 됨

> [!note]+ Group Combine
>
> Group name : output 할 그룹
>

> [!note]+ Group Copy
>
> Prim 또는 PT의 수가 같아야 한다.
>
> 그룹의 이름이 같은 경우 처리 방법
>
> 1. 그냥 건너 뛰고 1번 인풋의 그룹을 유지한다.
> 2. 2번 인풋의 그룹으로 덮어 씌운다.
> 3. 넘버링을 붙여서 둘다 유지 한다.\\
>
> 접두사를 붙여 따로 관리할 수 있다.

> [!note]+ Group Promote
>
> group을 속성간 이동시켜준다.
>
> 포인트와 버텍스만 이용할 수 있는 바운딩 리전 그룹 을 prim으로 전환 시켜줄 수도 있다.
>
> Group을 어트리뷰트로 옮겨준다.
>
> point에서 prim으로 그룹을 옮겨줄때 보다 같은 모습으로 전환 해줄 수 있다.
`,

  'Houdini/half-edge': `---
title: half-edge
date: 2022-09-01
tags: VEX, GraphicTheory
---

[https://www.youtube.com/watch?v=FpfA1CkH18E](https://www.youtube.com/watch?v=FpfA1CkH18E)

[https://www.youtube.com/watch?v=x7s7pCPNojs](https://www.youtube.com/watch?v=x7s7pCPNojs)

[https://www.sidefx.com/docs/houdini/vex/halfedges](https://www.sidefx.com/docs/houdini/vex/halfedges)

<!-- Column 1 -->

<!-- Column 2 -->
half-edge는 각 primitive마다 normal 방향에 의하여 방향성을 가지는 엣지를 말한다.

두 면이 하나의 edge를 공유한다면 각 면에서의 half-edge는 서로 다른 방향을 가지고 있다.


<!-- Column 1 -->

<!-- Column 2 -->
이 사진에서는 세개의 prim이 동일한 엣지를 공유 하고 있고, 이때 같은 방향성을 가지거나 서로 반대 방향을 가지고 있는 half-edge를 가진다.

**방향성은 중요하지 않음**

---

srcpoint - 방향성이 시작 하는 포인트

dstpoint - 방향성이 끝나는 포인트

sourcepoint 는 각 포인트와 같다.

\`\`\`python
int hedge1 = pointhedge(0,0,1);
int hedge2 = pointhedge(0,1,3);
i@hedge1 = hedge1;
i@hedge2 = hedge2;
\`\`\`

<!-- Column 1 -->

<!-- Column 2 -->
\`pointhedge(geometry, sourcepoint,dstpoint)\`

펑션은 srcpt와 dstpt를 이용해 half-edge의 넘버를 가져온다.

srcpt와 dstpt가 올바른 순서나 짝을 이루지 못하면 -1을 출력한다.
`,

  'Houdini/hbatch-basic': `---
title: hbatch Basic
date: 2022-10-12
tags: code
---

$HPS/bin/당신이나 하세요

기본값(C:/Program Files/Side Effects Software/Houdini 18.5.421/bin)

경로에 있는 hcmd.exe 또는

Command Line Tool 에서 배치파일을 실행 시킬 수 있음

\`\`\`powershell
Y:

Y:\\>cd Y:\\FX_TEAM\\Test\\SJH\\RND\\SJHRND\\fx\\dev\\scenes\\

Y:\\FX_TEAM\\Test\\SJH\\RND\\SJHRND\\fx\\dev\\scenes>hbatch hbatch_test_scene.hip
\`\`\`

후디니 파일 경로로 열어 주는 코드

이 툴 안에서는 Hscript를 문법으로 사용하며

[https://www.sidefx.com/docs/houdini18.5/commands/index.html](https://www.sidefx.com/docs/houdini18.5/commands/index.html)

자세한 펑션은 여기 참조

툴안에서는 파이선을 사용할 수 있으며 파이선 파일을 실행 시키는 방법이 편리함.

\`\`\`powershell
python batch_deadline_test.py
python '경로/' + batch_deadline_test.py
## 같은 실행이다
\`\`\`

파이선 파일을 실행 시키는 코드

경로없이 이때 파이선 파일이름만 써준다면 hip파일과 같은 디렉토리에 존재해야 한다.

경로를 같이 적어주면 다른 경로에서 받아올 수 있다.
`,

  'Houdini/isosurface': `---
title: isosurface
date: 2022-10-31
tags: TIP, Volume, GraphicTheory
---

## Isosurface란?

볼륨 데이터 안에서 **동일한 값을 갖는 점들을 이어 만든 표면**이다.

2D에서의 등위선(Contour)을 3D로 확장한 개념으로, 예를 들어 밀도 필드에서 값이 \`0.5\`인 지점들만 이으면 하나의 곡면이 만들어진다.

> [!NOTE]
> VDB에서 SDF(Signed Distance Field)의 isosurface = 0 이 곧 오브젝트의 표면이다.

---

## Houdini에서의 사용

### VDB from Polygons → Convert VDB

폴리곤을 SDF 볼륨으로 만든 뒤 다시 메시로 추출하는 흐름이 기본이다.

\`\`\`
Geometry → VDB from Polygons → Convert VDB (Fog to Polygons / SDF to Polygons)
\`\`\`

### IsoOffset SOP

볼륨을 직접 생성하거나 기존 지오메트리에서 오프셋 표면을 만들 때 사용한다.

| 파라미터 | 설명 |
|---|---|
| Iso Value | 등위면을 추출할 기준값 |
| Offset | 표면에서의 거리 오프셋 |
| Output Type | Surface / Volume / SDF |

### Convert SOP

\`IsoOffset\`이나 볼륨 시뮬레이션 결과를 폴리곤 메시로 변환할 때 쓴다.

\`\`\`
Volume → Convert (Convert To: Polygon Soup)
\`\`\`

---

## SDF와의 관계

SDF(Signed Distance Field)는 isosurface의 대표적인 활용 사례다.

- 값 \`0\` = 표면
- 값 \`< 0\` = 오브젝트 내부
- 값 \`> 0\` = 오브젝트 외부

VDB SDF에서 \`Iso Value = 0\`으로 Convert하면 원본 표면을 복원할 수 있다.

> [!TIP]
> Pyro나 Fluid 시뮬레이션 결과의 \`density\` 필드에서 isosurface를 추출할 때는 Iso Value를 낮게 (0.01~0.1) 설정하면 더 얇고 깨끗한 표면이 나온다.

---

## Marching Cubes

Houdini 내부적으로 isosurface 추출에는 **Marching Cubes** 알고리즘이 사용된다.

복셀 그리드를 순회하며 각 셀의 꼭짓점 값이 임계값(iso value)을 기준으로 안/밖으로 나뉘는 지점에 삼각형을 생성하는 방식이다.

해상도가 높을수록 표면이 정밀해지지만 연산 비용도 증가한다.
`,

  'Houdini/keyframe-to-ramp': `---
title: KeyFrame To Ramp
date: 2022-10-10
tags: TIP, VEX
---

Curveu

Vex Code

\`\`\`python
float u = fit01(f@curveu,0,10000);
float ramp = chf('ramp',u*@TimeInc);
f@u = u;
@P += @N * ramp;
\`\`\`

chf의 두 번째 인풋에 프레임 * @TimeInc를 넣어주면 해당 프레임의 값을 받아 올 수 있는 특징을 이용하여 키프레임을 ramp처럼 이용 더욱 세밀한 값을 조절해줄 수 있다.
`,

  'Houdini/material-builder-occlusion': `---
title: Material Builder occlusion
date: 2021-08-05
tags: texturing, VOP, node
---

P의 거리를 기반으로 인접한 서페이스가 있을 경우 색을 눌러주는 용도로 이용된다.
`,

  'Houdini/nodeshape-setting': `---
title: Nodeshape setting
date: 2022-10-17
tags: ui, TIP
---

\`\`\`plain text
{
    "data": [
                ["Object/*", "squared"],
                ["*", "circle"],
                ["Sop/rop_geometry", "tabbed_right"],
                ["Sop/filecache", "tabbed_right"],
                ["Sop/object_merge", "camera"],
                ["Sop/file", "bone"],
                ["Sop/attribwrangle", "circle"],
                ["Sop/volumerasterizeattributes", "circle"]
            ],
    "name": "SJH"
}
\`\`\`

\`\`\`python
{
    "name": "Circle Theme",
    "data": [
	["*", "circle"]
	]
}
\`\`\`

경로

C:\\Users\\jeonghyeok.song\\Documents\\houdini18.5

파일이름.nodeshape으로 저장하면 됨.
`,

  'Houdini/particle-hit-attribute': `---
title: Particle Hit Attribute
date: 2021-05-25
tags: Particle, DOP
---

파티클 운용시 사용할 만한 attrib 중에서 hit 관련 attrib들이 있다.

popsolver 에서 Add Hit Attributes를 체크하면 관련 어트리뷰트를 사용 할 수 있다.

add impacts = hit와 유사한 정보들을 가짐

Response 에서는 v값의 변화를 선택 할 수 있다.

hitnml = 충돌 후 방향

hitnum = 충돌 시 1로 변환

hitpos = 충돌 위치

hit prim = 충돌한 primnum

hittime = 충돌 시간

hituv = 충돌한 prim의 uv
`,

  'Houdini/particle-popforce': `---
title: Particle_popforce
date: 2021-05-25
tags: Particle, DOP, node
---

swirl size, scale을 이용해 눈에 띄는 패턴을 만들 수 있음

Pulse Length = 노이즈 변화 속도

popforce에서 적용된 속도는 계속 누적이 되기 때문에 나중에 drag를 이용해서 속도를 잡아줄 필요가 있다.
`,

  'Houdini/pcopen': `---
title: pcopen / pcfilter
date: 2021-02-08
tags: VOP, node
---

어느 point의 attrib을 기준으로 하여 주변의 point들을 가져온다. pcfilter와 항상 같이 쓰인다.

## pcopen 파라미터

file : input

P : 기준이 되는 pt의 position값

radius : 탐색 범위

maxpoints : 탐색 최대 pt

handle : 찾은 pt 뭉치들을 다룬다.

## pcfilter 파라미터

pcopen의 handle을 받아 탐색한 pc의 attribute를 가져온다.

handle : 찾은 pt cloud를 뭉치로 가져온다.

signature : attribute의 type

Channel : 가져올 attribute

value : 출력
`,

  'Houdini/pcopen와-pcfind': `---
title: pcopen와 pcfind
date: 2022-06-28
tags: VEX
---

pcopen은 KD-tree ,pcfind는 BVH와 같은 가속 구조를 기본으로 한다.

[https://blog.hybrid3d.dev/2019-03-22-raytracing-kdtree-bvh](https://blog.hybrid3d.dev/2019-03-22-raytracing-kdtree-bvh)

위는 KD-tree와 BVH의 차이를 설명해준다.

결론은 KD-tree는 동적 움직임에 약하고, BVH는 성능이 조금 떨어지지만 동적 움직임에 좋다.

하지만 vex 안에서 의 차이도 존재 한다.

pcfind는 바로 array를 얻고, point.number, point.distance를 이용해서 정보들을 바로 사용 할 수 있다.

pcopen은 핸들을 반환하는 쿼리(Query)를 수행

pcopen은 메모리에 접근해 빠르지만, pcfind는 거리값이나 포인트 넘버를 즉시 어레이로 반환 하기 때문에 쓰기에 좀더 용이하다.

pcfind가 훨씬 빠르다?

100만개의 포인트에서 같은 처리를 해준 상태 pcfind가 2배정도 빠름

**pgfind **라는 것도 존재 한다.

# pcfind

---

pcfind 에서는 패턴 매칭을 사용할 수 있지만 이는 매우 느리다.

removeindex로대체

하지만 이 방법도 위험 할 수 있다. 같은 포지션에 여러개의 포인트가 겹쳐있다면 자신의 값을 먼저 받아온다는 확신이 없기 때문에, 아래와 같은 식으로 대체

value를 이용해서 값을 지워준다.

ptgroup, Pchannel, RadChannel 이 바뀔 때 마다 pcfind는 훨씬 느려진다, 많은 사람들이 radius를 변경해 보지만, 이는 오해이다. 저 채널들이 바꿔지면 가속 구조가 바뀌기 때문


# pcfilter

---

<!-- Column 1 -->

<!-- Column 2 -->

\`\`\`python
## 펑션을 만드는 코드.
function vector pcfilter2(int input; int pts[]; float dist []; string attrib)
{
    float    sum = 0, w, d;
    vector    value, result = 0;
    float maxd = dist[-1];
    int count = len(pts);

    for (int i = 0; i < count; ++i)
    {
        value = point(input,attrib,pts[i]);
        w = 1 - smooth(0, maxd * 1.1, dist[i]); ## pts와 거리가 멀수록 낮은 값의 Cd 를 가져옴
        sum += w;
        result += w * value;
    }
    result /= sum;
    return result;
}


float radius = ch('r');
int maxpts = chi('maxpts');
float dist[] = {};
int pts[] = pcfind(1,"P",@P, radius, maxpts,dist);

v@Cd = pcfilter2(1,pts,dist,"Cd");
\`\`\`


# pcfind로 min,maxpt 구하기

---

\`\`\`python
float radius = ch('radius');        ## 0.5
int minpts = chi('minpts');         ## 50
int maxpts = chi('maxpts');         ## 250

int pts[] = pcfind( 0 ,'P', @P, 1e15, minpts);               ## 주변 포인트 50개 수집
vector p = point(0,'P', pts[-1]);                            ## 제일 먼 포인트의 위치
float maxdist = distance(p,@P);                              ## 제일먼 포인트와의 거리
f@maxdist = maxdist;

if(maxdist < radius)                ## 0.5 범위 보다, 제일 먼 포인트와의 거리가 더 작다면
    pts = pcfind(0,"P",@P,radius,maxpts);      ##maxpts만큼 다시 수집, 0.5거리로


i@count = len(pts);                        ## 배열의 길이
\`\`\`

⇒ 밀집 되어 있는 곳의 pt는 많은 포인트의 배열을 가지고, 적은 분포를 가진 곳의 pt는 처음에 구한 배열을 가지고 있다.

그리고 길이 또는 거리 함수 대신 항상 제곱 버전을 사용해야 한다. 값의 제곱근을 계산하는것을 피하기 위함 ## pow함수를 쓰는것 보단 값을 직접 곱해주는 것이 빠르다. 이 두개를 적용해서 수정 하면

\`\`\`python
float radius = ch('radius');
int minpts = chi('minpts');
int maxpts = chi('maxpts');

int pts[] = pcfind( 0 ,'P', @P, 1e15, minpts);
vector p = point(0,'P', pts[-1]);
float maxdist = distance2(p,@P);                     ## distance2
f@maxdist = maxdist;

if(maxdist < radius * radius)                         ## radius * radius
    pts = pcfind(0,"P",@P,radius,maxpts);


i@count = len(pts);
\`\`\`

이와 같이 쓸 수 있다.

# pcfind_radius

---

[https://www.sidefx.com/docs/houdini/vex/functions/pcfind_radius.html](https://www.sidefx.com/docs/houdini/vex/functions/pcfind_radius.html)

pcfind에 부가적으로 radius가 달려있다. 찾는 대상의어트리뷰트를 이용해 찾을 수 있다.


# Unique Pair Matching

---

\`\`\`python

int count = findattribvalcount(1,"point",'match', @ptnum);
## 중복된 포인트를 잡은 pt들을 걸러 낸다.
if(count != 0)
    i@group_notfound = 0;

\`\`\`

\`\`\`python
int pts[] = pcfind(1,"notfound","P",@P,1e15,1);
i@match = pts[0];
\`\`\`

\`\`\`python
int index = findattribval(0,"point","match", i@match,0);
if ( index == @ptnum)
    i@group_notfound = 0;
\`\`\`

Stop Condition :  조건으로 반복을 멈춘다 ( 0이면 멈춤 )

pointlit : 포인트 그룹의 포인트들을 반환

argc : Hscript 타입의 리스트의 수를 반환

위의 코드는 notfound 그룹에 속해 있는 포인트 들이 없을때 반복을 중지 하겠다는 것.


# Camera Based Occlusion with Variable pscale

---

카메라 NDC를 이용하여 N방향을 정렬 시키거나, 겹쳐진 것들을 걸러낼 수 있다.

\`\`\`python
if( @uv.x > 1 || @uv.x < 0.000001 || @uv.y > 1 || @uv.y < 0.000001)
		removepoint(0,@ptnum);
\`\`\`

**uvtexture 노드를 카메라에 맵핑해서 uv값으로 카메라 밖의 포인트들을 지운다.**

\`\`\`python
string cam = chs('cam');
vector p0 = fromNDC(cam, set(0.5, 0.5, 0));
vector p1 = fromNDC(cam, set(0.5,0.5,-1));    ## 카메라 전방, 중앙에 벡터 위치 생성
vector n = normalize( p1 - p0);               ## 카메라 방향의 법선벡터 생성

vector q = dot(p0 - @P, n) *n;    ## 카메라의 원점 위치와 자신의 위치를 내적해서 방향을 얻고
	@dist = length(q);              ## 카메라 법선 벡터 값을 곱해서 수직 거리값을 얻을 수 있음.

v@Q = @P + q;
v@N = n;
\`\`\`

\`\`\`python
int pts[] = pcfind_radius(0,"Q","pscale",1,v@Q, @pscale, chi('maxpts'));

float dist [] = {};
foreach(int pt;pts)
{
    float d = point(0,'dist',pt);
    append(dist,d);
}

pts = reorder(pts,argsort(dist));    ### pts리스트를 argsort로 dist가 가까운 순서로 인덱스를
                                     ### 가져와서 다시 정렬 해준다.

if(@ptnum != pts[0])
    removepoint(0,@ptnum);

if(chi('preview'))
    @P = v@Q + @N + ch("s");
\`\`\`

reorder 쓰임

\`\`\`python
i[]@list = {4,3,5,6,2,1};
i[]@argsort = argsort(@list);
i[]@reorder = reorder(@list ,argsort(@list));
\`\`\`
`,

  'Houdini/pdg-시뮬레이션-셋업': `---
title: PDG 시뮬레이션 셋업
date: 2022-09-13
tags: TIP, DOP
---

pdg로 랜덤하게 바꿀 시드의 파라미터를 만들어줌

파라미터의 경로 이용할 어트리뷰트 작성

어트리뷰트는 바꿀 파라미터에 작성

아웃풋으로 받아올 노드 선택

뽑아지는 파일 이름 결정

시뮬레이션은 All Frame in One Batch 필수 시뮬레이션을 단위로 하나로 묶어줌

## deadlinescheduler 셋팅

환경 변수 설정

Priority는 두 자리 수로

Concurrent Tasks는 팜 하나에 얼마나 줄건지 (무조건 1 이상)
`,

  'Houdini/pop-replicate': `---
title: POP_Replicate
date: 2021-06-17
tags: DOP, Particle, node
---

impulse rate : 프레임당 파티클 생성 수

Birth Rate : 초당 파티클 생성 수

파티클을 생성하는 포인트는 랜덤으로 지정 되는듯 하다.

 Seed는 어느 점의 파티클이 생성되는 위치를 정한다.

attribute를 지정해주면 원하는 포인트에서 모두 파티클을 복사 해줄 수 있다. ( 1 = on, 0 = off )

Radial Velocity는 방사형으로 v를 추가해주는 옵션

inherit Vel이 낮고 Radial 이 높다면 180도 에 가까운 각도로 방출된다.

→ 적절히 섞어 주고== Birth의 Seed 도 $F로 다양성==을 주면서 다양한 각도로 퍼지게 할 수 있다.

Uniform Scale같은 경우 소스의 @pscale의 값을 따라간다.
`,

  'Houdini/rbd-attribute': `---
title: RBD attribute
date: 2021-07-18
tags: DOP, RBD, VEX
---

> [!note]+ f@speedmax
> v의 length(speed)를 가지고 객체의 최대 속력을 clamp 해준다

> [!note]+ v@w → anglea
>
> RBD Packed Object 에 Angular Velocity 에 해당 하는 attrib이다. 1초 동안 회전하는 값을 지정할 수 있음. v 처럼 매프레임마다 회전을 더해주게 된다.

> [!note]+ i@active
> dynamic의 활성 여부
>
> 0 = static

> [!note]+ i@animated
> 객체가 animated 되어 있는것을 반영 하느냐의 여부
>
> animated는 pack 된 후 transform과 같은 matrix가 통으로 움직이는것을 의미한다.
>
> pack이전의 움직임은, 각 포인트의 변환이며 deforming이라고 한다.
>

> [!note]+ i@deforming
>
> pack이전의 geo가 변화하는 상태는 각 포인트의 값들이 변하기 때문에 deforming상태라고 한다.
>
> 1 : 활성, 0 : 비활성
>

> [!note]+ f@bounce
> collision될때 튕기는 세기를 정한다.

> [!note]+ i@bullet_add_impact
> 해당 오브젝트에 impact정보를 추가해준다.
>
> RBD packed object 에도 포함 되어있는 설정

> [!note]+ i@bullet_ignore
> 0 일때 시뮬을 무시

> [!note]+ bullet_linear_angular_sleep
> f@bullet_linear_sleep_threshold
>
> f@bullet_angular_sleep_threshold
>
> active와는 조금 다르고, 동작을 멈출 뿐임
>
> 임계값 이하로 떨어지면 동작을 일시적으로 비활성화 해 준다.
>
> linear = 속력, angular = 회전력
>
`,

  'Houdini/remesh-와-uvr-original-geo': `---
title: remesh 와 UVR original GEO
date: 2023-05-11
tags: node, SOP, TIP, UV, RBD, texturing
---


fracture 단계에서 Noise 를 적용 하기 위해 remesh를 적용 할 때 inside 와 outside 모서리 부분 normal이나 uv 가 고르게 적용 되지 않는 문제가 발생 할 수 있다.

# UV

위의 문제를 labs fast remesh의 3D and UV Connectivity 옵션을 이용 해서 해결 할 수 있다.

fast remesh 노드 안에 들어가 보면 uv를 기반으로 geo를 한번 쪼개 주고  리메쉬 해주는 모습을 볼 수 있다.

# Geo


모서리 부분도 따로 잡아 리메쉬 해줌

Normal


remesh 하기 전의 N 를 가져와 transfer 해준다
`,

  'Houdini/screendoor-samples': `---
title: Screendoor Samples
date: 2024-04-02
tags: Render, Volume, Solaris
---

불투명한 오브젝트가 레이를 받게 될때 확률적 샘플링을 이용해서 오브젝트의 노이즈를 줄여준다.

단, 간접적인 소스에 대해서는 영향을 미치지 않는다. ( 간접광을 말하는 듯. )

불투명도에 대한 노이즈만 개선 가능.

<!-- Column 1 -->


<!-- Column 2 -->


제한적인 상황에서 Pixel samples, Volume Step Rate, or Min and Max ray samples 값들을 조정해주는 것보다 빠르고 좋은 결과를 보여 준다.
`,

  'Houdini/uv-정리': `---
title: UV 정리
date: 2021-10-22
tags: UV, node, TIP
---

> [!note]+ Vertex Split
>
> UV를 가지고 있는 객체를 remesh 할 때 UV가 정돈되지 않을 경우 vertexsplit 노드를 이용해서 정리해 줄 수 있다.
`,

  'Houdini/vellum-grain': `---
title: Vellum Grain
date: 2021-07-16
tags: vellum, DOP, node
---

> [!note] 🔥
> [vellum 의 기본 구성](/f9289a67b67342a6a4f0459e8155d9d2)을 먼저 알고 오자

<!-- Column 1 -->

<!-- Column 2 -->
Vellum grain의 기본 구조

vellum grain에서 포인트를 뿌려주고 glue로 붙여주는 과정이 있다.


기본적으로 solid 를 가져와 내부에 포인트를 뿌려주고 시작할수도 있지만, 직접 포인트를 이용할 수도 있다.

<!-- Column 1 -->

<!-- Column 2 -->
Vellume Grain Parameters

Constraint는 glue로 되어있다.

Type 은 point

Cluste Attrib을 통해 덩어리를 표현해줄 수 있다.

constraint 를 생성할때 적용시킬 수 있는 파라미터들

Detach Point Chance : 랜덤으로 constraint가 낮은 값

Damping 값은 낮으면 찰랑 거리거나 튕기는  고무물성을 나타내고, 높으면 모래, 흙덩어리 처럼 묵직하고 정적인 느낌을 준다.
`,

  'Houdini/vellum-rest-blend': `---
title: Vellum Rest Blend
date: 2021-07-16
tags: vellum, SOP, node
---

> [!note] 🔥
> [vellum 의 기본 구성](/f9289a67b67342a6a4f0459e8155d9d2)을 먼저 알고 오자

Vellum Rest Blend : pt정보가 같은 객체들의 모양을 blend 시켜주는 기능

<!-- Column 1 -->

<!-- Column 2 -->
rest blend의 기본 구성

두가지 객체를 준비한다.

하나는 목표가 되는 객체(A), 하나는 변하는 객체(B)

==A는 numpt가 B와 같아야 한다. ==

ray 노드를 쓰거나 vex를 이용해서 모양을 만들어내는것이 관건인듯 하다.

Vellum solver 안에서의 rest blend 사용

dopnet 에서도 처리해줄 수 있다.
`,

  'Houdini/vellum-strut-soft-body': `---
title: Vellum Strut Soft Body
date: 2021-07-15
tags: vellum, node, SOP
---

> [!note] 👇
> 후디니 내에서 옷, 고무, 등 유연성을 가진 개체를 표현할때 쓰이는 속성                                 vellume solver, constraint, cloth grain등 다양한 노드들이 있다

기본적인 Vellum Constraint 노드에서 시작.

Constraint  Type은 Struts

중간에 Strut Search 에서

---

<!-- Column 1 -->

<!-- Column 2 -->

max Strut Length : 왼) 100 / 오) 0

<!-- Column 1 -->

<!-- Column 2 -->
Pressure 은 안에서 바깥으로 기압을 주는듯한 팽창이 일어나는 모습에 적합
`,

  'Houdini/vex-include-경로': `---
title: VEX include 경로
date: 2022-04-05
tags: VEX, TIP
---

문서/houdini버전/vex/include

파일 유형 : .h (C++ / 내부에선 vex문법으로 작성)
`,

  'Houdini/vex-에서-vop-noise-쓰기': `---
title: VEX 에서 VOP noise 쓰기
date: 2022-08-11
tags: VOP, VEX, code, texturing, TIP
---

[https://mrkunz.com/blog/03-04-2017_Using-noise-in-VEX.html](https://mrkunz.com/blog/03-04-2017_Using-noise-in-VEX.html)

vop 헤더 파일을 불러와서 vop에서 사용하는 노드들의 펑션을 쓸 수 있게 해준다.
`,

  'Houdini/volume-collision-수정': `---
title: Volume Collision 수정
date: 2021-10-22
tags: node, DOP, Volume, TIP
---

Volume Source를 이용해서 collision을 불러올 때 이런식으로 구멍이 나면서 제대로 역할을 할 수 없을 때가 있다.

위의 방식처럼 collision의 fill interior와 레졸루션, smoke object의 레졸루션도 맞춰가는 방식이 필요하다.
`,

  'Houdini/volume-retime': `---
title: Volume Retime
date: 2022-09-06
tags: Volume, TIP
---

[https://youtu.be/m48ynuhEFKY](https://youtu.be/m48ynuhEFKY)

감속 후 $FF + 0.25 하면 프레임 중간중간에 생기는 플리커를 어느정도 보간이 가능 하다
`,

  'Houdini/경로-vex': `---
title: 경로 vex
date: 2022-09-02
tags: VEX, TIP
---

\`\`\`
python
v@Cd = point('op:../color1',"Cd",7);
\`\`\`

vex에서 경로를 바로 써주는 방법

\`\`\`python
string srcpath = chs('srcpath');
string destpath = chs('destpath');
s@path = relativepath(srcpath, destpath);
\`\`\`

srcpath 부터 destpath의 상대 경로를 알아냄.

\`\`\`python
s@fullpath = opfullpath(s@path);
\`\`\`

상대경로의 절대경로를 알아냄
`,

  'Houdini/볼륨-렌더': `---
title: 볼륨 렌더
date: 2022-05-18
tags: Volume, Render, DOP
---

메테리얼에 있는 자동 인풋 값을 확인해보자. SOP 단계에서 해당 어트리뷰트를 만들어 적용하면 자동으로 파라미터에 있는 값과 연동하여 보여진다.

## 볼륨 소스 name point attrib

포인트에 볼륨 네이밍처럼 string 타입 어트리뷰트로 네이밍을 해주고 그것을 소싱할 수 있다.
`,

  'Houdini/쓸만한-노드들': `---
title: 쓸만한 노드들
date: 2022-10-07
tags: node, TIP
---

> [!note]+ Point Relax
>
> > [!note]+ 스캐터된 포인트들을 서페이스에 붙여서 정리, 간격 조절
>

> [!note]+ enumerate
>
> 포인트, 프림 순서에 따른 integer나 string  값 부여
`,

  'Houdini/플립북에-정보-띄우는법': `---
title: 플립북에 정보 띄우는법
date: 2021-11-25
tags: TIP
---

파라미터 에서 Comment 를 추가 후 작성

줄을 많이 띄우면 글이 아래로 내려 온다.
`,

  'Markdown/Call-Out': `---
title: Call Out, Alert
date: 2026-04-16
tags: 
---


\`\`\`
> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
\`\`\`

**출력 결과**
> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.


`,

  'Markdown/문자열-강조': `---
title: 텍스트 강조
date: 2026-04-16
tags: 
---

### 기본 텍스트 강조 문법

\`\`\`
인라인 : \`텍스트\`
볼드 : **텍스트**
이탤릭 : *텍스트*
취소선 : ~~텍스트~~
마크 : <mark>텍스트</mark>
인라인 볼드 : **\`텍스트\`**
\`\`\`
인라인 : \`텍스트\`
볼드 : **텍스트**
이탤릭 : *텍스트*
취소선 : ~~텍스트~~
마크 : <mark>텍스트</mark>
인라인 볼드 : **\`텍스트\`**

---

### 글자 색상, $\\LaTeX$
\`\`\`
$\\color{red}{텍스트\\ Text}$
$\\color{blue}{텍스트\\ Text}$
$\\color{#58A6FF}{텍스트\\ Text}$
\`\`\`
$\\color{red}{텍스트\\ Text}$
$\\color{blue}{텍스트\\ Text}$
$\\color{#58A6FF}{텍스트\\ Text}$

---

### 코드 블록 색상 강조

diff 로 코드블럭을 시작.

\`\`\`diff
+ 이 줄은 초록색 배경으로 표시됩니다. (성공, 추가)
- 이 줄은 빨간색 배경으로 표시됩니다. (실패, 삭제)
\`\`\`
`,

  'Markdown/페이지-참조': `---
title: 페이지 참조
date: 2026-04-16
tags: 
---



## md 링크

### 상대 경로
\`\`\`
./ 현재 폴더
../ 상위 폴더
\`\`\`

\`\`\`
a/b/README.md 일때
README.md 에서
./ = d/
../ = c/
\`\`\`

-  뒤에 #h 를 붙이면 헤더로 이동 가능. 단 띄어쓰기는 \`-\` 로 대체
\`\`\`
[참조](../../Houdini/camera-ndc/camera-ndc.md#활용-예시)
\`\`\`
**출력 결과**

[참조](../../Houdini/camera-ndc/camera-ndc.md#활용-예시)

---

## 페이지 링크

### 기본 형식
\`\`\`
[Google](https://google.com)
[Naver](https://naver.com "링크 설명")
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

\`\`\`
**출력 결과**

[GOOGLE](https://google.com)
[NAVER](https://naver.com "링크 설명")
구글 홈페이지: https://google.com
네이버 홈페이지: <https://naver.com>

---

### [참조] 형식
\`\`\`
[Google][GOOGLE]
[Naver][1]

---

[GOOGLE]: https://google.com
[1]:<https://naver.com>
\`\`\`
**출력 결과**

[Google][GOOGLE]
[Naver][1]

[GOOGLE]: https://google.com
[1]:<https://naver.com>
`,

  'Math/삼각-함수': `---
title: 삼각 함수
date: 2021-07-17
---

후디니에서의 삼각함수는 패턴을 만들거나 움직임 또는 값을 자동화 시킬 수 있는 유용한 펑션으로 사용 된다.

위의 단위원과 그안에서의 직각삼각형으로 우리는 삼각함수를 이용해 그래프나 패턴을 구할 수 있다.

후디니 내에선 삼각함수값을 이용할때 [라디안](/cb8db1ed02fb44b88dca4ee88b2b8d27)을 사용한다.

---

> [!note]+ **Cos**
> 코사인 cos(radian) = 직각삼각형의 빗변과 밑변의 비율을 구한다.
>
> 위그림과 같을때
>
> cos(25) = 0.9... 이 나온다. 100m 와 밑변의 비율이 0.9라는 의미이므로 0.9 * 100 = 90 이라는 밑변의 길이도 구할 수 있는 식이 나온다.
>
> 식으로 표현하자면 ==cos(==$\\theta$==) = 빗변/밑변== 이 될 수 있다.
>
> 위와같은 단위원의 경우
>
> cos($\\theta$)
>
> ⇒ x/r = 밑변
>
> ⇒ x/1 = x
>
> ⇒ cos($\\theta$) = x가 성립 된다.
>
> 즉 P의 x값을 구할 수 있다는 이야기 이다.
>
> 이 값을 그래프로 적용 하자면,
>
> 여기서 세로축은 x를 뜻한다. x를 y값에 적용했다는 이야기
>
> 그래프 상에서 각도가 0( cos(0) )일때, y가 1 즉 x가 1이라는 말이고 시간에따라 각도가 변한다면 위와 같은 그래프가 그려진다.

> [!note]+ **Sin**
> 사인 sin(radian) = 직각삼각형의 빗변과 높이의 비율을 구한다.
>
> 위그림과 같을때
>
> 식으로 표현하자면 ==sin(==$\\theta$==) = 높이/빗변== 이 될 수 있다.
>
> 곧 sin($\\theta$) * 100 = $x$( 높이 ) 가 되는 것이다.
>
> ## 단위 원에서의 sin
>
> 위와같은 단위원의 경우
>
> sin($\\theta$)
>
> ⇒ y/r = 밑변
>
> ⇒ y/1 = x
>
> ⇒ sin($\\theta$) = x가 성립 된다.
>
> 즉 P의 Y값을 구할 수 있다는 이야기 이다.
>
> 이 값을 그래프로 적용 하자면,
>
> 그래프 상에서 각도가 0( sin(0)) )일때, y가 0 이라는 말이고 시간에따라 각도가 변한다면 위와 같은 그래프가 그려진다.

> [!note]+ **Tan**
> 탄젠트 tan($\\theta$) = 직각삼각형의 높이와 밑변의 비율을 구한다.
>
> 위그림과 같을때
>
> 식으로 표현하자면  ==tan(==$\\theta$==) = 높이/밑변== 이 될 수 있다.
>
> ## 단위 원에서의 sin
>
> 위와같은 단위원의 경우
>
> tan($\\theta$) = 1이 나오며
>
> tan($\\theta$) = y/x = y^/x^
>
> tan($\\theta$) = y/x = y^/1
>
> ⇒ y^이 나오게 된다.
>
> 곧
>
> 위의 값이 성립 된다.
>
> tan의 값이 커지면서 y의 값도 커지지만, 삼각비에서 나오듯이 tan90의 값은 측정 할 수 없게 된다.

---

> [!note]+ 참고 링크
> [https://mathbang.net/509](https://mathbang.net/509)
>
> [http://lab.gamecodi.com/board/zboard.php?id=GAMECODILAB_Lecture_series&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=127](http://lab.gamecodi.com/board/zboard.php?id=GAMECODILAB_Lecture_series&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=127)
`,

  'Math/정사영-othogonal-projection': `---
title: 정사영 (Othogonal Projection)
date: 2022-08-14
---

[https://mrw0119.tistory.com/94](https://mrw0119.tistory.com/94)

<!-- Column 1 -->

<!-- Column 2 -->

투영 벡터를 구하는 방법은 다음과 같다

**여기서 N은 normalized된 단위 벡터이다.**


$(|V| * cos\\theta)*N = Proj(V)$


내적 벡터로 구하기

$(V\\bullet N) * N = Proj(V)$

$(|V| * |N| * cos\\theta) * N = Proj(V)$ [******](/d2016b7c039448cdb2c09c809e1a1c3a)

$(|V| * cos\\theta) * N = Proj(V)$

$|N|$는 단위 벡터 이기 때문에 생략


후디니 에서의 사용

\`\`\`python
int npt = npoints(1);
vector pos0 = point(1,"P",0);
vector pos1 = point(1,"P",npt - 1);

vector N = pos1 - pos0;
vector V = @P - pos0;

vector N_norm = normalize(N);
vector V_norm = normalize(V);

@P = dot(V, N_norm) * N_norm;  ##내적 으로 구하는 프로젝트 값
\`\`\`

이때 우리가 사용할 수 있는 값들


> [!note]+ ### (응용) 평면 projection
>
> \`\`\`python
> vector  pos_0 = prim(1,"P",0) ;                      // "___" 에 들어갈 코드를 채워 넣으세요
> vector  vec_A = @P - pos_0 ;                            // "___" 에 들어갈 코드를 채워 넣으세요
> vector  vec_B_norm = prim(1, "N", 0) ;                  // vec_B_norm을 어떻게 구할 수 있는지 HINT node를 확인해 보세요.
> vector  vec_B =  dot(vec_A, vec_B_norm) * vec_B_norm;   // "___" 에 들어갈 코드를 채워 넣으세요
>
> @P -= lerp({0,0,0}, vec_B, bias) ;
> \`\`\`
>
> primitive 의 P, N attridute를 사용해서 같은 수식을 정해 준다.
`,

  'Math/허수와-복소수': `---
title: 허수와 복소수(imaginary number & complex number)
date: 2021-02-17
---

> [!note] 👇
> quarternion(사원수)의 계산 이해를 위한 허수와 복소수의 개념 정리

허수를 설명 하기 전에는 ==음수==와 ==곱셈==의 의의에 대해 재조명할 필요가 있다.

아래 설명에는** 수는 방향성을 가진다는 사실**이 바탕이 되어 있음을 알고 있자.

## 먼저 음수에 대한 이야기이다.

17세기 전까지만 해도 음수의 존재를 사람들은 이해하지 못했으며, 필요성 또한 느끼지 못했다. 왜냐하면 0 이라는 '없음'을 의미하는 수보다 아래에 있는 보이지 않는 수 이기 때문이다.

가령 사과 1개는 있어도 사과 -1개는 있을 수 없는 것 처럼 말이다.

또한 음수는 수를 스칼라에서 **1차원의 벡터로 확장** 시켰다. 즉 전에는 양수만 존재하여 양의 방향만 표현할 수 있었지만, 음수의 등장으로 그 반대값을 가지게 하며 수는 양방향성을 띄게 된것이다. 예를 들어 4 이라는 양의 방향이 있다면, -4는 그만큼의 **반대 방향**을 의미 하게 된다.



## 다음은 곱셈.

 곱셈은 기본적으로 양수의 배를 의미한다. 즉 1 * 3 은 1만큼의 수를 가진 양의 방향을 3배 만큼 커지게 한다는 의미를 가진다.


## 허수 ( i^ = -1 )

- **허수는 존재하지 않는 값이다.**

허수는 제곱을 해서 -1이 되는 값을 뜻한다. 허나 이러한 성질을 가진 수는 존재하지 않으므로 $i$를 통해 실수 체계를 복소수 체계로 확장 시킬 수 있다.

- **수는 회전한다.**

제곱의 의미를 다시 보자. "제곱 = 같은 값을 두번 곱하는 식." 이라고 했을 때,  2^ = 2 * 2 = 4 와같은 식을 가진다. 그렇다면 이식은 어떨까 :  2^ = 1 * 2 * 2 = 4 (1의 존재는 방향의 이해를 돕기 위한 것이며 1의 방향으로 4배가 커지게 된다는 의미이다.) 이또한 같은 값이 나온다. 우리는 이것으로 한 제곱에 음수가 있을 수도 양수가 있을 수도 있다는 것을 알게된다.  그리고 우리는 실수를 가지고는 허수의 식을 풀 수 없다는걸 알 수 있다.

그렇다면 x^ = 1 * x * x = -1이 될려면 어떻게 해야할까? 실수의 체계에서는 불가능 하다. 이부분에서 수는 2차원의 벡터로 확장하게 된다. 1을 -1로 만들기 위해선 수가 회전을 해야 한다는 이론이다.

### 1의 값이 ==가상의 축 i==를 통해 2차원 까지 확장되어 회전하게 된다면...

i^ = -1의 식이 성립되기 위해서는 가상의 i 축이 필요 하다.

2^ = 4를 다시보자, 4의 값을 가지기 위해서는 +1이 2만큼의 움직이고, 다시 2만큼 움직이게 되면 4의 값을 가지게 된다.

즉 허수의 식도 마찬가지이다.  +1이 i 만큼 움직이고 또다시 i 만큼 움직인다면, -1로 갈 수 있다는 것이다.

이것은 아까의 제곱으로 다시 풀 수 있다. +1 * i * i = -1 즉, i^ = -1이 되는 것이다.

---

> [!note]+ 참고 링크
> [https://www.youtube.com/watch?v=INxpcSwbKMo](https://www.youtube.com/watch?v=INxpcSwbKMo)
>
> [https://angeloyeo.github.io/2019/06/15/imaginary_number.html#1-수의-발견](https://angeloyeo.github.io/2019/06/15/imaginary_number.html#1-%EC%88%98%EC%9D%98-%EB%B0%9C%EA%B2%AC)
`,

  'Python/class-str': `---
title: Class, __str__
date: 2022-10-19
tags: class
---
https://goodthings4me.tistory.com/m/59

Class 사용시 \`__str__\`을 사용하게되면 인스턴스를 프린트 할때 바로 str의 반환을 출력한다.
`,

  'Python/houdini-widget-custom': `---
title: Houdini 에서 위젯 커스텀(stylesheet, QPixmap) 반영 하기
date: 2022-06-26
tags: PyQt
---
일반적인 Qt Designer의 사용으로는 후디니에서 반영이 안되는 것들이 종종 있다. hutil.Qt 라는 자체 내장 모듈에서 코드를 불러와서 그런게 아닌가 싶다.

https://doc.qt.io/qt-5/stylesheet-examples.html#customizing-qpushbutton

https://doc.qt.io/qt-5/stylesheet-reference.html#background-image-prop

# Style Sheet

stylesheet를 이용 해서 후디니에 반영 시키는 방법

\`\`\`python
QPushButton{
	border-radius : 10px;
	background-color : rgb(85,170,255);
}
\`\`\`

QPushButton 처럼 위젯 타입으로 한번 묶어 주고 코드를 작성해야 한다.

\`\`\`python
QPushButton{
	border-radius : 10px;
	background-color : rgb(85,170,255);
	color : rgb(200,200,200);
}

QPushButton:hover{
	background-color : rgb(85,255,80);
	color : rgb(200,0,0);
}

QPushButton:pressed{
	background-color : rgb(0,80,255);
	color : rgb(0,100,0);
}
\`\`\`

hover: 커서가 버튼 위에 올라갔을 때

pressed: 눌렸을 때

**':' 띄어쓰기하면 안 먹힘;;**

# QPixmap

https://doc.qt.io/qtforpython/PySide6/QtGui/QPixmap.html

이미지는 대충 label에 넣는 다는 것을 가정

\`\`\`python
self.logoimage = QtGui.QPixmap()                           ## 이미지객체를 만들어줌
self.logoimage.load(BASE_DIR + '/mantra.svg')              ## 이미지 경로로 불러옴
self.logoimage = self.logoimage.scaled(self.MW.logo.sizeHint())     ## 사이즈 설정
self.MW.logo.setPixmap(self.logoimage)                              ## 원하는 위젯에 이미지 적용
\`\`\`
`,

  'Python/list-sort-by-index': `---
title: index로 list 정렬 하기
date: 2023-01-09
tags: Tip, list
---
https://connectionism.tistory.com/55

\`\`\`python
def _setCacheNodeDict(lvList):

    OrderList = sorted(range(len(lvList)), key=lambda k: lvList[k])
    newList = []
    
    for i, lv in enumerate(OrderList):
        newList.insert(i, lvList[lv]) 

    return newList
\`\`\`

인덱스로 순서를 변환해서 for문으로 걸러 준다.
`,

  'Python/map': `---
title: map 함수
date: 2022-05-05
tags: function
---
https://blockdmask.tistory.com/531
`,

  'Python/padzero': `---
title: Padzero
date: 2022-05-05
tags: Tip, formatting
---
\`\`\`python
print("%.6f" %0.01)
>> 0.010000

print("%6.f" %1)
>>     1
( 앞에 6칸 뜀 )

print("%10.5f" %1.2)
>>    1.20000
(앞에 10칸 뛰고 뒤에서 5칸 앞으로)

"%앞의 공간.뒤 공간f" 이라고 생각 하면 될듯
\`\`\`

추가로 houdini 에서 패딩

\`\`\`python
s@a = sprintf("%*0d",4,57);
->0057
(맨뒤 숫자가 4번째에 있게 0을 앞에 붙임)

s@a = sprintf("%*d",4,57);
->  57
(맨뒤 숫자가 4번째에 있게 앞을 두칸 띄움)

s@a = sprintf("%.*d",6,5.7101345247);
->5.71013
(뒤 6자리 까지 표기)

d를 f 로바꾸면 5.7같은 딱떨어지는 숫자도 000 붙힐 수 있음
\`\`\`
`,

  'Python/python-basic-functions': `---
title: Python 기초 펑션
date: 2022-02-28
tags: function
---
https://www.sidefx.com/docs/houdini/hom/hou/index.html

\`\`\`python
.setInput()
.setDisplayFlag(0) = off
.setRenderFlag(1) = on
.name() -> 이름을 string으로 받아냄
.layoutChildren() -> 레이아웃 정리

.eval()
open()
.writelines()
.close()
.glob(pattern, ignore_case=False) = 해당 노드의 자식노드들을 튜플로 모두 불러옴( 패턴 매칭을 이용해서
원하는 결과를 도출 할 수 있다.)
.replace("find", "replaceswitch") = "find"를 찾아서 "replaceswitch"로 바꾼다.

for in 
----

노드 관련 ( = 타입은 hou.Objnode/Sopnode/... )

.createNode()
	- createNode('노드', node name = '노드 이름') 
.pwd() -> 현재 코드가 작동 되고 있는 장소(노드)
.node("경로") -> "경로" 노드 불러옴
.children() -> 해당 노드 안에 들어 있는 노드들을 리스트함
.inputs() -> 해당 노드의 인풋 노드들을 튜플로 불러옴
.setNextInput() -> merge같은 경우 순서대로 인풋을 정할 수 있음
.layoutChildren() -> 노드 레이아웃 정리
.moveToGoodPosition() -> 노드가 겹치지 않음
	:moveToGoodPosition(move_inputs=False) -> 인풋 노드는 움직이지 않음 ( 추측 )

----

파라미터 관련 명령어

.parms() -> 속해 있는 파라미터들을 list함
.parmInFolder(['폴더 이름']) -> '폴더 이름' 안에 있는 파라미터들을 list함
parm.deleteAllKeyframes() -> 파라미터에 걸려있는 키프레임을 전부 지운다.
.parm("파라미터 이름").set(X) -> "파라미터 이름"d 의 값을 X 로 set함
.setParms({'파라미터a' : 'a값', '파라미터b' : 'b값'}) -> 복수의 파라미터들을 동시에 설정
.isDisabled() -> 사용 불가 상태면 1 가능 상태면 0
.multiParmInstances() -> 멀티파라미터에서 생성된 파라미터들의 이름을 list함
.revertToDefaults() -> 해당 parm를 기본값으로 변경

.parm("이름").eval() -> "이름"parm의 값 불러옴
.evalParm("이름") -> "이름"parm의 값 불러옴 

---

지오메트리 

.inputGeometry(Index) -> Index의 인풋으로 들어오는 geo를 불러옴
.geometry() -> 하위 노드의 geo
.points() -> geo의 포인트정보를 불러옴
.pointAttribs() -> 해당 geo 포인트의 attrib들을 불러냄
.number() -> geo 넘버를 불러옴
.position() -> 위치값을 불러옴(벡터값으로)
.pos.x/y/z() -> x/y/z값을 불러냄 .position() 보다 좀 더 자세한 자릿수 까지 불러옴
.attribValue("어트리뷰트이름") -> "어트리뷰트이름" 의 값을 가져온다

-----

어트리뷰트

.addAttrib(hou.attribType.Point, 'pscale', 0.2) -> geo attrib추가 방법
.findPointAttrib()
.attribValue(attrib) -> 해당 geo의 어트리뷰트 값 불러옴

range(숫자) -> 숫자를 0부터 끝까지 리스트로 풀어 버린다.ex/ range(3) > [0,1,2]

import os
os.path.isdir("경로") -> "경로"와 같다면 1 아니면 0
os.listdir("경로") -> "경로"에 있는 파일 이름을 리스트화함

import json
\`\`\`

\`\`\`python
## 스트링 쪼개는 방법
path = "texture/glass/roughness/"
pathsplit = path.splite(glass)
print(pathsplit)
print(pathsplit[1])

=> ['texture/', 'roughness/']
=>/roughness/
## 중간의 동일한 스트링을 빼주고 각자 다른 개채로 이용 가능 하다.
\`\`\`

\`editor = hou.ui.paneTabOfType(hou.paneTabType.NetworkEditor)\`

\`editor.nodeShapes()\`

→ shape보는법
`,

  'Python/python-connected-nodes': `---
title: Python: make a list of all connected nodes to the node's inputs
date: 2022-12-21
tags: Tip, data
---
https://www.merlino3d.com/single-post/python-make-a-list-of-all-connected-nodes-to-the-node-s-inputs

\`\`\`python
#########################################################
# Recursive function to find all the inputs
def listInputs(node, nodeList):

    """
    node is class Node, nodeList is an empty list
    Take node object and an empty list and fill the list
    with all the node connected into the node's input
    """

    inputs = node.inputs()
    length = len(inputs)
    if lenght > 0:
        for input in inputs:
            nodeList.append(input)
            listInputs(input, list)
#########################################################

# select this node, can be any node
node = hou.pwd()
# declare the empty list we'll fill with all the input's nodes
list = []
# in houdini normally we have a touple with all the nodes as output so
# I declare a tuple and later I'll convert the list to tuple
tup = ()
# run the function, with a node (in this case this node itself)
# and an empyt list, can be a non-empty list but pay attention with that
listInputs(node, list)
tup = tuple(list)

#########################################################
# you can check the output uncommenting these lines

print('LIST: \\n' + str(list) + '\\n')
print('TUPLE \\n' + str(tup) + '\\n')
print('TOTAL NODES: ' + str(len(list)))
\`\`\`

def 펑션 안에 같은 펑션을 똑같이 씀..;; 심지어 마지막줄에 쓰인 list는 클래스로 쓰임 도대체 왜;

\`\`\`python
def treeList(node, nodeList):
    outputs = node.outputs()
    inputs = node.inputs()

    outputLen = len(outputs)
    inputLen = len(inputs)

    if inputLen > 0:
        for input in inputs:
            nodeList.append(input)
            treeList(input,list)

    if outputLen > 0:
        for output in outputs:
            if output in nodeList :
                nodeList.append(output)
                treeList(output,list)
\`\`\`

요거는 output까지 찾을 수 있나 한번 테스트 해본것인데 아웃풋의 아웃풋은 찾지 못한다.
`,

  'Python/python-formating': `---
title: Python formatting
date: 2022-04-16
tags: Tip, formatting, string
---
https://blockdmask.tistory.com/424

파이선 문자열 포매팅 하기

\`\`\`python
print("나는 %d살 입니다." %20)
>>> 나는 20살 입니다.
>>> %d - 정수, %s - 문자, 그외 모두, %c - 한글자

print("나는 %s색과 %s 색을 좋아해요." %("파란", "빨간"))
>>> 나는 파란색과 빨간 색을 좋아해요."
\`\`\`

\`\`\`python
print("나는 {}색과 {}색을 좋아해요.".format("파란", "빨간"))
>>> 나는 파란색과 빨간 색을 좋아해요.

print("나는 {0}색과 {1}색을 좋아해요.".format("파란", "빨간"))
print("나는 {1}색과 {0}색을 좋아해요.".format("빨간","파란"))
>>>나는 파란색과 빨간 색을 좋아해요.
>>>나는 파란색과 빨간 색을 좋아해요.

print("나는 {A}색과 {B}색을 좋아해요.".format(A = "파란", B = "빨간")
>>>나는 파란색과 빨간 색을 좋아해요.

A = "파란"
B = "빨간"
print(f"나는 {A}색과 {B}색을 좋아해요.")
>>>나는 파란색과 빨간 색을 좋아해요.
\`\`\`

문자열 포메팅시 r,f의 차이에 대해서 설명 되어 있다.

https://armin.tistory.com/entry/pythonstring
`,

  'Python/session-module': `---
title: Session Module
date: 2022-06-22
tags: HOM
---
https://www.sidefx.com/docs/houdini/hom/hou/session.html

파이선에서 후디니의 세션에 접근해 파일내에서 데이터를 저장 하거나. 가져와 사용할 수 있다.

이렇게 되면 만트라 매니저 처럼 각 hip파일 마다 생기게 되는 불필요한 데이터의 축적을 막을 수 있다.

\`\`\`python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
\`\`\`

hou.setSessionModuleSource 펑션을 이용해 hou.session module에 접근 하여 코드를 작성 할 수 있다.

이는 Reload를 눌러줘야만 적용이 된다. 하지만 Reload를 눌러주지 않는 다고 그값이 변하지 않은것은 아니다. 겉으로만 이전 데이터가 남아있을 뿐, 내부적으로 이미 적용 되어 있는 셈이다. 이것은 아래의 코드로 확인할 수 있다.

\`\`\`python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
>>> hou.sessionMouleSource()
'a = ["a","b","c"]'
\`\`\`

hou.sessionModuleSource()를 이용해서 모듈의 소스코드를 문자열 타입으로 받아올 수 있다.

다음은 변수를 가져오는 방법이다. 이로써 Reload 를 클릭 과 데이터는 무관하다고 볼 수 있다.

\`\`\`python
>>> hou.setSessionModuleSource('a = ["a","b","c"]')
>>> hou.sessionMouleSource()
'a = ["a","b","c"]'
>>> hou.session.a[2]
'c'
\`\`\`

hou.session모듈을 이용해 a라는 변수값을 가져왔다.

이외에도 hou.appendSessionModuleSource()를 이용해 모듈 전체를 바꾸지 않고 코드를 추가 할 수있다.
`,

  'Python/set': `---
title: Set 집합
date: 2022-10-20
tags: data, Tip, set
---
https://wikidocs.net/16044

set은 index가 존재 하지 않는 집합이며

교집합 합집합 등 다양한연산자들이 있다
`,

  'Python/tuple-unpacking': `---
title: Tuple Unpacking 튜플 언패킹
date: 2022-10-20
tags: Tip, Tuple
---
\`\`\`python
numbers = (1, 2, 3)
a, b, c = numbers
print(a)
print(b)
print(c)
\`\`\`

튜플의 인자를 언팩 하는법

\`\`\`python
a, b, *c, d = [1, 2, 3, 4, 5, 6, 7, 8, 9]

print(a)
print(b)
print(c)
print(d)
\`\`\`

\`*\`는 한번 밖에 쓸 수 없고 리스트를 반환한다.
`,

  'Python/weird-syntax': `---
title: 요상한 문법 모음
date: 2022-08-04
tags: Tip
---
## x := x/10 (walrus operator)

\`\`\`python
x = 24;
print(x := x/10);

>>> 2.4



x = 24;
print(x = x/10);

>>> 에러 출력
\`\`\`

\`:=\` 오른쪽을 왼쪽에 적용한 결과를 바로 출력할 수 있게 한다.

\`\`\`python
x = 24;
a = [x := x/10]
print(a)

>>> [2.4]


x = 24;
x := x/10

print(x)

>>> 에러 출력
\`\`\`

\`:=\` 문법은 단독으로 사용이 불가능 하고 값을 지정할 때만 쓰일 수 있는거 같다.
`,

  'Python/파이선 스크림트(.py) exe 파일 만들기': `---
title: 파이선 스크립트(.py) exe 변환
date: 2026-04-20
tags: 
---

\`\`\`
pip install pyinstaller
\`\`\`

\`\`\`
python -m PyInstaller --onefile --noconsole 스크립트.py
\`\`\`
--onefile : 하나의 파일로 만들기
--noconsole : 콘솔창 안뜨고 실행 `,

  'ROS2/callback': `---
title: Callback
date: 2026-08-11
tags: 
order: 
featured: false
draft: false
---

# Callback

ROS2 노드 코드는 위에서 아래로 순차 실행되는 스크립트가 아니라,
"어떤 일이 생기면 이 함수를 불러라"를 미리 등록해두는 **이벤트 구동(event-driven) 방식**이다. 이때 실행되는 함수가 콜백이다.

| 콜백 종류 | 실행 시점 | 예시 |
|---|---|---|
| 구독 콜백 | 구독 중인 토픽에 메시지 도착 | \`/scan\` 도착 시 장애물 계산 |
| 타이머 콜백 | 정해진 주기마다 | 20ms마다 제어 명령 발행 |
| 서비스 콜백 | 다른 노드의 요청 수신 시 (11강) | — |

## executor

대기열에 쌓여 있는 콜백을 불러내고 실행 시키는 주체
기본 값은 [단일 스레드](../단일-스레드-멀티-스레드/main.md) \`executor\`
노드에 있는 \`spin()\` 함수로 아래의 루프로 진입 한다.

1. 추가된 노드들의 구독,타이머,서비스,클라이언트를 전부 모아 **감시 해야할 목록**을 만든다.
2. 매 반복마다 \`rcl_wait()\` 로 대기
3. 이벤트 발생
4. 단일 스레드: **목록**에서 하나씩 전부 실행
5. 다시 \`rcl_wait()\`

기본값이 단일 프로세스 이기 때문에 하나씩 실행 시키며 **하나의 콜백이 밀리면 다른 콜백이 전부 밀린다.**

병렬로 실행 시키고 싶다면, \`MultiThreadedExecutor\` + \`callback groups\` 조합을 사용 한다.

## callback groups

멀티 스레드는 성능을 주지만 두 콜백이 동시에 같은 변수를 읽고 쓰면 값이 꼬이는 **race condition** 이 발생한다.

때문에

\`MultiThreadedExecutor\`를 사용 하는 executor 병렬 실행에는 \`callback groups\` 라는 제어 장치가 필요하다.

그렇기 때문에 
- \`MutuallyExclusive\`: 상호 베타적, 서로 동시에 실행 되지 않음
- \`Reentrant\`: 재진입, 자유롭게 병렬 실행 됨.

\`\`\`cpp
int main(int argc, char* argv[])
{
	rclcpp::init(argc, argv);
	auto node = std::make_shared<MyNode>();
	rclcpp::executor::MultiThreadedExecutor excutor( rclcpp::ExecutorOptions(),4 );
	executor.add_node(node);
	executor.spin();
	rclcpp::shutdown();
}

\`\`\`

---
콜백을 실제 C++ 코드로 등록하는 문법(퍼블리셔/서브스크라이버/타이머 콜백)은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고.
`,

  'ROS2/colcon-build': `---
title: colcon build
date: 2026-08-13
tags: 
order: 
featured: false
draft: false
---

# colcon build

## 명령어
\`\`\`bash
cd ~/ros_ws
colcon build
colcon build --packages-select <pkg>
colcon build --symlink-install   # launch/config/python 소스 수정시 재빌드 없이 반영
source install/setup.bash
\`\`\`
### \`install/setup.bash\`
빌드 후 현재 쉘에 그것을 등록 해 줘야 한다.
\`ros2 run\` \`ros2 launch\`이런 명령어 들이 빌드된 것들을 찾을 수 있게
**쉘에 경로를 등록 시켜 주는 것이다.**

## 빌드 순서
- 각 패키지 \`package.xml\`의 \`<depend>\`/\`<exec_depend>\`로 DAG 구성 → 위상정렬
- \`exec_depend\`(실행시점 의존)는 빌드 순서에 영향 없음

## build_type (\`package.xml\` → \`<export><build_type>\`)
- \`ament_cmake\` : \`CMakeLists.txt\`로 처리 (컴파일 있거나, 파일 설치 전용, C++)
- \`ament_python\` : \`setup.py\`로 처리 (컴파일 없음, 복사+스크립트 생성, python)

### ament_cmake \`CMakeLists.txt\`

구조
\`\`\`bash
cpp_pubsub/ #패키지 : 빌드,설치,의존성 관리의 최소단위
├── package.xml # 메타데이터: 이름, 버전, 의존성
├── CMakeLists.txt # 빌드 규칙: 뭘 컴파일해서 뭘 만들지
├── src/ # .cpp 소스 파일
├── include/cpp_pubsub/ # 헤더 파일
└── launch/ # .launch.py 파일 (있는 경우)
\`\`\`
패키지를 만들때 package.xml 과 CMakeLists.txt 2공간에 의존성을 부여 한다. 서로 다른 단계에서 읽히기 때문이다.

\`\`\`mermaid
graph LR
    A["package.xml<br/>&lt;depend&gt;rclcpp&lt;/depend&gt;"] -->|"colcon이 읽음"| B["빌드 순서 결정<br/>(rclcpp 먼저, cpp_pubsub 나중)"]
    C["CMakeLists.txt<br/>find_package + ament_target_dependencies"] -->|"cmake가 읽음"| D["실제 컴파일·링크"]
\`\`\`


\`\`\` CMakeLists.txt
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
...

#빌드 해야할 cpp
add_executable(노드이름 src/cpp)
#cpp를 위한 라이브러리
ament_target_dependencies(노드이름 rclcpp std_msgs ... ...)

add_executable(노드이름 src/cpp)
ament_target_dependencies(노드이름 rclcpp std_msgs ... ...)

#노드
install(
	TARGETS
	노드1
	노드2
	노드3
	DESTINATION lib/\${PROJECT_NAME}
)

install(
	DIRECTORY
	launch
	DESTINATION share/\${PROJECT_NAME}
)

ament_package() # 항상 마지막 호출, ament index 등록
\`\`\`

### package.xml (\`<depend>\`)
\`\`\`xml
<depend>rclcpp</depend>
<depend>std_msgs</depend>
<depend>example_interfaces</depend>
<depend>geometry_msgs</depend>
\`\`\`
CMakeLists.txt의 \`find_package\`와 짝을 이룬다 — 같은 라이브러리를 **두 곳**에 적는다: \`package.xml\`(colcon·rosdep이 읽음, 빌드 순서·설치 의존성용)과 \`CMakeLists.txt\`(컴파일러가 읽음, 실제 컴파일·링크용). 서로 다른 단계에서 읽히기 때문.

### ament_python \`setup.py\`
\`\`\`python
data_files=[
    ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
    ('share/' + package_name, ['package.xml']),
],
entry_points={'console_scripts': ['talker = pkg.talker:main']},
\`\`\`
- \`entry_points\` → 실행 스크립트 자동 생성: \`install/<pkg>/lib/<pkg>/talker\`

## ament index
- \`share/ament_index/resource_index/packages/<pkg>\` 마커 파일 유무로 \`ros2 pkg list\` / \`ros2 run\` / \`FindPackageShare\`가 패키지를 찾음
- 참조 경로는 항상 \`install/\`, \`src/\` 아님 → 소스 수정 후 재빌드(or \`--symlink-install\`) 필요

## 빌드→설치→실행 관계도
\`\`\`mermaid
graph LR
    P["package.xml<br/>depend/exec_depend"] -->|"colcon"| O["빌드 순서(DAG→위상정렬)"]
    C["CMakeLists.txt / setup.py<br/>build_type"] -->|"cmake / setuptools"| B["build/&lt;pkg&gt;"]
    B --> I["install/&lt;pkg&gt;<br/>lib/, share/"]
    I --> A["ament_index<br/>resource_index/packages"]
    A -->|"이름으로 탐색"| R["ros2 run / launch<br/>(런타임 spawn)"]
\`\`\`

### 패키지별 실제 처리

**A) demo_cpp_pkg — ament_cmake, 진짜 컴파일이 있는 케이스**

| 단계 | 파일/명령 | 결과 |
|---|---|---|
| 의존성 탐색 | \`find_package(rclcpp REQUIRED)\` \`find_package(std_msgs REQUIRED)\` | \`/opt/ros/humble\`(언더레이)에서 헤더·라이브러리 경로 확보 |
| 컴파일 | \`add_executable(listener src/listener.cpp)\` | \`build/demo_cpp_pkg/\`에서 g++ 컴파일 → 오브젝트파일 + 바이너리 |
| 링크 | \`ament_target_dependencies(listener rclcpp std_msgs)\` | rclcpp/std_msgs의 include 경로·링크 플래그 자동 연결(직접 \`-I\`, \`-l\` 안 써도 됨) |
| 설치 | \`install(TARGETS listener DESTINATION lib/\${PROJECT_NAME})\` | \`install/demo_cpp_pkg/lib/demo_cpp_pkg/listener\` 로 바이너리 복사 |
| 등록 | \`ament_package()\` | package.xml 복사, \`resource_index/packages/demo_cpp_pkg\` 마커 생성, \`local_setup.bash\` 등 환경훅 생성 |

→ \`install/demo_cpp_pkg/lib/demo_cpp_pkg/listener\` 가 \`ros2 run demo_cpp_pkg listener\`가 실행하는 실물.

**B) demo_py_pkg — ament_python, 컴파일 없이 "복사 + 스크립트 생성"만**

cmake 단계 자체가 없음 — \`setup.py\` + \`setup.cfg\`가 전부.

| setup.py 항목 | 하는 일 | install 결과 |
|---|---|---|
| \`packages=find_packages()\` | \`demo_py_pkg/\` 폴더(=\`__init__.py\` 있는 파이썬 패키지)를 통째로 site-packages로 설치 | \`install/demo_py_pkg/lib/python3.10/site-packages/demo_py_pkg/talker.py\` |
| \`entry_points\`의 \`console_scripts: 'talker = demo_py_pkg.talker:main'\` | setuptools가 \`talker\`라는 실행 가능 wrapper 스크립트를 자동 생성 | \`install/demo_py_pkg/lib/demo_py_pkg/talker\` ← \`setup.cfg\`의 \`install_scripts=$base/lib/demo_py_pkg\` 설정 때문에 이 위치로 옴(기본은 site-packages 옆이 아니라 관례상 \`lib/<pkg>/\`) |
| \`data_files\`의 \`resource/demo_py_pkg\` | 빈 마커 파일 하나를 복사 | \`install/demo_py_pkg/share/ament_index/resource_index/packages/demo_py_pkg\` — 이게 없으면 \`ros2 pkg list\`에 패키지가 안 잡힘 |

→ 파이썬 패키지는 "빌드"랄 게 사실상 없음. \`ros2 run demo_py_pkg talker\`가 실제로 실행하는 건 \`install/.../lib/demo_py_pkg/talker\`이고, 그 안에서 \`demo_py_pkg.talker:main\`을 import해서 호출.

**C) demo_bringup — ament_cmake인데 컴파일할 소스가 아예 없는 케이스**

\`\`\`cmake
find_package(ament_cmake REQUIRED)
install(DIRECTORY launch config DESTINATION share/\${PROJECT_NAME})
ament_package()
\`\`\`

\`add_executable\`이 없으니 cmake는 컴파일러를 한 번도 안 부르고, 디렉토리 통째 복사 + ament 등록만 함:
- \`src/demo_bringup/launch/demo.launch.py\` → \`install/demo_bringup/share/demo_bringup/launch/demo.launch.py\`
- \`src/demo_bringup/config/params.yaml\` → \`install/demo_bringup/share/demo_bringup/config/params.yaml\`

\`demo.launch.py\` 안의 \`FindPackageShare('demo_bringup')\`은 **install/ 쪽 share 경로만** 찾고 \`src/\`는 안 봄 → 소스 수정 후 \`colcon build\`(또는 \`--symlink-install\`) 없이는 launch에 반영 안 됨.

### 패키지 간 연결
- **빌드 타임 연결은 없음** — 셋은 완전히 독립적으로 컴파일/설치됨
- **런타임 연결은 이름 기반 탐색.** \`Node(package='demo_py_pkg', executable='talker', ...)\`는 컴파일 링크가 아니라, \`AMENT_PREFIX_PATH\` 아래 \`resource_index/packages/demo_py_pkg\`를 찾아서 그 패키지의 \`lib/demo_py_pkg/talker\`를 **프로세스로 spawn**하는 것 → \`package.xml\`엔 \`depend\` 대신 \`exec_depend\`만 있어도 충분(컴파일 의존이 아니니까)
- **토픽(\`chatter\`) 연결은 DDS 런타임에서 이뤄짐** — launch가 두 노드에 같은 \`remappings=[('chatter', topic)]\`을 넘겨줘야 실제로 같은 토픽 이름으로 만남

### \`source install/setup.bash\`가 필요한 이유
빌드 산출물이 \`install/<pkg>/lib\`, \`install/<pkg>/share\`에 흩어져 있는데, \`ros2 run\`/\`ros2 launch\`가 이걸 찾으려면 \`PATH\`, \`PYTHONPATH\`, \`AMENT_PREFIX_PATH\` 같은 환경변수에 그 경로들이 등록돼야 함. \`install/setup.bash\`는 각 패키지가 만든 \`local_setup.bash\`(각 \`install/<pkg>/share/<pkg>/local_setup.bash\`)를 체이닝해서 이 환경변수들을 한 번에 세팅해주는 진입점.

---
- 워크스페이스 생성·패키지 create·docker 진입 등 빌드 이전 단계의 ROS2 명령어 레퍼런스는 [ROS 기초](../ros-basics/main.md) 참고.
- CMakeLists.txt에 실제로 등록하는 노드/퍼블리셔/서브스크라이버 C++ 코드 패턴은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고.
- 패키지 생성부터 talker/listener 작성·빌드·실행까지 전 과정을 절차대로 따라가는 실습 교안은 [ROS2 C++ Pub-Sub 패키지 만들기 (교안)](../ros2-cpp-pub-sub-package/main.md) 참고.

참고: [About the Build System (ROS2 Humble Docs)](https://docs.ros.org/en/humble/Concepts/Advanced/About-Build-System.html)
`,

  'ROS2/composition': `---
title: Composition
date: 2026-08-13
tags: intra-process
order: 
featured: false
draft: false
---

# Composition

**노드를 한 프로세스에 합치기**

>독립된 노드들을 하나의 프로세스로 합치는 기법. 같은 프로세스 안의 노드끼리는 **메모리를 직접 공유**(intra-process communication)
>- 직렬화 없이 데이터를 주고받음 
>- 독립 프로세스 간 통신보다 빠름.

|       | 독립 프로세스 (기본)  | Composition (합성)    |
| ----- | ------------- | ------------------- |
| 견고성   | 높음(하나 죽어도 격리) | 낮음(같이 죽음)           |
| 통신 비용 | 복사·직렬화        | 메모리 공유(제로 카피)       |
| 적합    | 대부분의 노드       | 대용량 데이터를 주고받는 노드 묶음 |
- 견고성과 성능은 트레이드오프 관계
	- 큰 데이터가 오가고 성능이 중요한 노드들은 합성하고, 안전·독립성이 중요한 노드는 따로 둠.

---

같은 15강에서 다룬 [Lifecycle Node](../lifecycle-node/main.md)와는 다른 축의 설계 판단이다 — Composition은 노드를 **어느 프로세스에 배치할지**(합성 여부)를 다루고, Lifecycle Node는 노드가 **언제 활성화될지**(상태 전이)를 다룬다.`,

  'ROS2/dds': `---
title: DDS
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# DDS

## DDS (Data Distribution Service)
여러 대의 컴퓨터가 있을 때 ROS2가 자동으로 서로를 찾아 연결·통신시켜주는 미들웨어 계층이다.

- 발행/구독 통신을 실제로 네트워크 위에서 실어 나르는 역할을 한다 — [Loose Coupling](../loose-coupling/main.md)이 가능한 것도 결국 DDS가 노드 발견(discovery)과 메시지 전달을 대신 처리해주기 때문이다.
- 특정 주기나 IP를 설정해 불필요한 간섭을 막을 수 있다.
- 발행자·구독자마다 통신 품질을 다르게 지정할 수 있는데, 그 설정값이 [QoS](../qos/main.md)다.
- 여러 로봇을 컴퓨터 한 대로 제어하는 것도 이 계층 위에서 가능해진다.

![](Pasted image 20260811215721.png)


[ROS2와 DDS란?](https://ai-sinq.tistory.com/entry/ROS2%EC%99%80-DDS%EB%9E%80)
`,

  'ROS2/geometry-msgs-message-definitions': `---
title: geometry_msgs.msg-Message Definitions
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# geometry_msgs.msg-Message Definitions

## Point
자유공간에서 점의 위치를 나타낸다.
float64 x
float64 y
float64 z

---
## Point32
자유공간에서 점의 위치를 나타낸다(32비트 정밀도). 상호운용성을 위해 가능하면 Point32 대신 Point를 쓰는 게 권장되지만, PointCloud처럼 많은 점을 한 번에 보낼 때 용량을 줄이기 위해 이 메시지가 설계되었다.

float32 x
float32 y
float32 z

---
## PointStamped
기준 좌표계와 타임스탬프를 가진 Point를 나타낸다.

std_msgs/Header header
[Point](#point) point

---
## Vector3
자유공간에서의 벡터를 나타낸다. 점(Point)과는 의미상 다르며, 벡터는 항상 원점에 고정되어 있다. 변환을 적용할 때는 회전 성분만 적용된다.

float64 x
float64 y
float64 z

---
## Vector3Stamped
기준 좌표계와 타임스탬프를 가진 Vector3를 나타낸다. 벡터는 항상 원점에 고정되어 있으므로, 변환 시 회전 요소만 적용된다는 점에 유의한다.

std_msgs/Header header
[Vector3](#vector3) vector

---
## Quaternion
자유공간에서의 방향을 쿼터니언 형태로 나타낸다.

float64 x 0
float64 y 0
float64 z 0
float64 w 1

---
## QuaternionStamped
기준 좌표계와 타임스탬프를 가진 방향(orientation)을 나타낸다.

std_msgs/Header header
[Quaternion](#quaternion) quaternion

---
## Pose
위치와 방향으로 구성된, 자유공간에서의 pose를 나타낸다.

[Point](#point) position
[Quaternion](#quaternion) orientation

---
## Pose2D
Foxy부터 deprecated 되었으며 이후 릴리즈에서 제거될 수 있다. 3D pose를 사용할 것을 권장한다. 일반적으로 모든 것을 3D로 표현하고 2D 전용 애플리케이션에서는 계산에 필요한 평면으로만 적절히 투영하되, 처리 과정에서는 가급적 3D 정보를 보존하는 것이 좋다. 2D 자료형을 별도로 병행 유지하면 모든 UI와 파이프라인이 이중 인터페이스를 갖춰야 하고, 완전히 유효한 상황에서도 3D 도구를 2D 용도로 재사용하지 못하게 된다. 2D pose를 그리거나 yaw 오차를 계산하는 일은 어렵지 않고 이미 그런 도구/라이브러리가 있다.
2D 다양체 위의 위치와 방향을 나타낸다.

float64 x
float64 y
float64 theta

---
## PoseStamped
기준 좌표계와 타임스탬프를 가진 Pose를 나타낸다.

std_msgs/Header header
[Pose](#pose) pose

---
## PoseArray
전역 참조를 위한 헤더를 가진 pose 배열이다.

std_msgs/Header header
[Pose](#pose)[] poses

---
## PoseWithCovariance
불확실성을 포함한, 자유공간에서의 pose를 나타낸다.

[Pose](#pose) pose

6x6 공분산 행렬을 row-major로 표현한다. 방향 파라미터는 고정축 표현을 사용하며, 순서는 (x, y, z, X축 회전, Y축 회전, Z축 회전)이다.
float64[36] covariance

---
## PoseWithCovarianceStamped
기준 좌표계와 타임스탬프를 가진 추정 pose를 나타낸다.

std_msgs/Header header
[PoseWithCovariance](#posewithcovariance) pose

---
## Twist
자유공간에서의 속도를 선형/각속도 성분으로 나눠 나타낸다. 09~10강 복습의 \`create_publisher(Twist, '/cmd_vel', 10)\` 예제처럼 로봇 속도 명령(\`/cmd_vel\`)에 실제로 쓰인다.

[Vector3](#vector3)  linear
[Vector3](#vector3)  angular

---
## TwistStamped
기준 좌표계와 타임스탬프를 가진 twist다.

std_msgs/Header header
[Twist](#twist) twist

---
## TwistWithCovariance
불확실성을 포함한, 자유공간에서의 속도를 나타낸다.

[Twist](#twist) twist

6x6 공분산 행렬을 row-major로 표현한다. 방향 파라미터는 고정축 표현을 사용하며, 순서는 (x, y, z, X축 회전, Y축 회전, Z축 회전)이다.
float64[36] covariance

---
## TwistWithCovarianceStamped
기준 좌표계와 타임스탬프를 가진 추정 twist를 나타낸다.

std_msgs/Header header
[TwistWithCovariance](#twistwithcovariance) twist

---
## Accel
자유공간에서의 가속도를 선형/각가속도 성분으로 나눠 나타낸다.
[Vector3](#vector3)  linear
[Vector3](#vector3)  angular

---
## AccelStamped
기준 좌표계와 타임스탬프를 가진 accel이다.
std_msgs/Header header
[Accel](#accel) accel

---
## AccelWithCovariance
불확실성을 포함한, 자유공간에서의 가속도를 나타낸다.

[Accel](#accel) accel

6x6 공분산 행렬을 row-major로 표현한다. 방향 파라미터는 고정축 표현을 사용하며, 순서는 (x, y, z, X축 회전, Y축 회전, Z축 회전)이다.
float64[36] covariance

---
## AccelWithCovarianceStamped
기준 좌표계와 타임스탬프를 가진 추정 accel을 나타낸다.
std_msgs/Header header
[AccelWithCovariance](#accelwithcovariance) accel

---
## Transform
두 좌표계 사이의 변환을 자유공간에서 나타낸다.

[Vector3](#vector3) translation
[Quaternion](#quaternion) rotation

---
## TransformStamped
header.frame_id 좌표계에서 child_frame_id 좌표계로의, header.stamp 시점의 변환을 나타낸다. 주로 [tf2](../tf2/main.md) 패키지에서 사용되며 자세한 내용은 tf2 문서를 참고한다. 변환을 하나의 메시지 안에서 자기완결적으로 전달하기 위해 Header의 frame_id 외에 child_frame_id가 추가로 필요하다.

std_msgs/Header header
string child_frame_id
[Transform](#transform) transform

---
## Polygon
첫 점과 마지막 점이 연결되어 있다고 가정하는 다각형 정의다.
[Point32](#point32)[] points

---
## PolygonStamped
기준 좌표계와 타임스탬프를 가진 Polygon을 나타낸다.

std_msgs/Header header
[Polygon](#polygon) polygon

---
## PolygonInstance
첫 점과 마지막 점이 연결되어 있다고 가정하는 다각형 정의다. 여러 인스턴스를 구분하기 위한 고유 식별자 필드를 포함한다.

geometry_msgs/[Polygon](#polygon) polygon
int64 id

---
## PolygonInstanceStamped
기준 좌표계와 타임스탬프를 가진 Polygon을 나타낸다. 여러 인스턴스를 구분하기 위한 고유 식별자 필드를 포함한다.

std_msgs/Header header
geometry_msgs/[PolygonInstance](#polygoninstance) polygon

---
## Inertia
질량 [kg]
float64 m

무게중심 [m]
geometry_msgs/[Vector3](#vector3) com

무게중심 기준 관성 텐서 [kg·m^2]
    | ixx ixy ixz |
I = | ixy iyy iyz |
    | ixz iyz izz |
float64 ixx
float64 ixy
float64 ixz
float64 iyy
float64 iyz
float64 izz

---
## InertiaStamped
타임스탬프와 기준 좌표계를 가진 Inertia다.

std_msgs/Header header
[Inertia](#inertia) inertia

---
## Wrench
자유공간에서의 힘을 선형/각(토크) 성분으로 나눠 나타낸다.

[Vector3](#vector3)  force
[Vector3](#vector3)  torque

---
## WrenchStamped
기준 좌표계와 타임스탬프를 가진 wrench다.

std_msgs/Header header
[Wrench](#wrench) wrench

---
## VelocityStamped
임의의 관측 좌표계 header.frame_id에서 표현된, 기준 좌표계 reference_frame_id에 대한 body_frame_id 프레임의 타임스탬프가 있는 속도 벡터를 나타낸다. body 프레임과 기준 프레임이 같으면 body 프레임 기준 속도이며, 흔히 "body twist"라고 부른다.

std_msgs/Header header
string body_frame_id
string reference_frame_id
[Twist](#twist) velocity

---
## VelocityWithCovarianceStamped
임의의 관측 좌표계 header.frame_id에서 표현된, 기준 좌표계 reference_frame_id에 대한 body_frame_id 프레임의 추정 속도(타임스탬프 포함, 공분산 포함)를 나타낸다. body 프레임과 header 프레임이 같으면 body 프레임 기준 속도이며, 공분산이 추가된 geometry_msgs/TwistStamped와 유사하다.

std_msgs/Header header
string body_frame_id
string reference_frame_id
[TwistWithCovariance](#twistwithcovariance) velocity
`,

  'ROS2/lifecycle-node': `---
title: Lifecycle Node
date: 2026-08-13
tags: 
order: 
featured: false
draft: false
---

# Lifecycle Node

## ROS 2의 라이프사이클 노드는 미리 정의된 **상태 머신(STM)** 을 갖춘 **관리형 노드**.

> [!NOTE]
> **lifecycle은 하나의 중앙 관리자가 아니다 각 노드가 lifecycle을 상속하면 노드 하나하나가 각자 자기만의 상태 머신 + 콜백 호출 장치를 내장하게 된다.**

로봇 시스템은 준비 단계 가 필요하다. 
- 구동체들이 전부 준비 된 상태에서  active
- 구동체들이 전부 안전한 상태에서 shutdown

  ![](Pasted image 20260813105558.png)

\`Inactive\`:  센서,메모리 자원은 준비 됐지만 데이터를 발행,처리 하지 않는 대기 상태
- **시작 순서**:대기 $\\rightarrow$ 시작 $\\rightarrow$ 대기 $\\rightarrow$ 종료
	- \`Unconfigured\` $\\rightarrow$ \`Inactive\` $\\rightarrow$ \`Active\` $\\rightarrow$ \`inactive\` $\\rightarrow$ \`Finalized\`
	- 먼저 제어가 돌기 시작 하는 사고를 막음
- **안전한 정지, 재시작**: 문제가 생긴 노드를  \`deactivate()\` 로 대기 시키고 안전 하게 재시작
- **자원 관리**: configure에서 자원을 잡고, 각 상태 전이 콜백(on_configure, on_activate 등)에서 할 일을 명확히 나눔.
- **디버깅 개선**: 라이프사이클 상태는 노드의 동작 상태를 명확히 보여주어 디버깅 및 유지보수를 단순화합니다.

---

- **configure**: 노드를 \`Unconfigured\` 상태에서 \`Inactive\` 상태로 전환.
- **activate**: 노드를 \`Inactive\` 상태에서 \`Active\` 상태로 전환.
- **deactivate**: 노드를 \`Active\` 상태에서 \`Inactive\` 상태로 전환.
- **cleanup**: 노드를 \`Inactive\` 상태에서 \`Unconfigured\` 상태로 전환.
- **shutdown**: 노드를 모든 상태에서 \`Finalized\` 상태로 전환.

1. **Unconfigured**: 노드가 생성되었지만 아직 구성되지 않은 상태.
2. **Inactive**: 노드가 구성되었지만 주요 기능을 수행하지 않는 상태.
3. **Active**: 노드가 완전히 작동 중인 상태.
4. **Finalized**: 노드가 종료되고 리소스가 정리된 상태.

\`\`\`cpp
from rclpy.lifecycle import LifecycleNode
from rclpy.lifecycle import State
from rclpy.lifecycle import TransitionCallbackReturn
import rclpy

class MyLifecycleNode(LifecycleNode):
    def __init__(self):
        super().__init__('my_lifecycle_node')
        self.get_logger().info("Lifecycle Node created.")

    def on_configure(self, state: State):
        self.get_logger().info("Configuring node...")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: State):
        self.get_logger().info("Activating node...")
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state: State):
        self.get_logger().info("Deactivating node...")
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: State):
        self.get_logger().info("Cleaning up node...")
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state: State):
        self.get_logger().info("Shutting down node...")
        return TransitionCallbackReturn.SUCCESS

if __name__ == '__main__':
    rclpy.init()
    node = MyLifecycleNode()
    rclpy.spin(node)
    rclpy.shutdown()
\`\`\`


---

같은 15강에서 다룬 [Composition](../composition/main.md)과는 다른 축의 설계 판단이다 — Lifecycle Node는 노드가 **언제 활성화될지**(상태 전이)를 다루고, Composition은 노드를 **어느 프로세스에 배치할지**(합성 여부)를 다룬다.

---
[ROS2 LifecycleNode란? — Hoon's Blog](https://yhoons.tistory.com/109#ROS%---%--Lifecycle%-A%--%EB%--%B-%EB%--%-C%--%EA%B-%--%EB%A-%AC%--%EB%B-%-F%--%EC%-B%A-%EB%A-%B-%EC%--%B-%--%ED%--%A-%EC%--%--)`,

  'ROS2/loose-coupling': `---
title: Loose Coupling
date: 2026-08-11
tags: 
order: 
featured: false
draft: false
---

# Loose Coupling

발행자는 자신의 메시지를 누가, 몇 명이나 구독하는지 전혀 모른 채로 동작한다 — ROS2 노드 통신이 "느슨한 결합"이라 불리는 이유다.

- 각 노드는 독립된 프로세스로 동작한다.
- 프로그래밍 언어, 실행 위치(같은 컴퓨터/다른 컴퓨터)에 무관하게 통신할 수 있다.
- 간섭이 적은 만큼 노드 하나가 죽어도 전체 시스템에 미치는 영향이 작다.

이 특성을 실제로 가능하게 하는 통신 계층은 [DDS](../dds/main.md) — 노드들의 발견과 메시지 전달을 DDS가 대신 처리해주기 때문에 노드끼리 서로를 몰라도 통신이 성립한다.
`,

  'ROS2/map-odom-base-link-odom': `---
title: map-odom-base_link 에서의 odom
date: 2026-08-20
tags: coordinate-frame
order: 
featured: false
draft: false
---

# map-odom-base_link 에서의 odom

ROS2 프레임 트리가 \`base_link\` 하나로 끝나지 않고 왜 굳이 \`map → odom → base_link\`로 한 단계를 더 끼워 넣는지, 그리고 그 \`odom\`이 실제로 무슨 값을 들고 있는지 정리.

## 계층을 나누는 이유

로봇이 복도를 달리다 바퀴가 살짝 미끄러지면, 바퀴 회전수로 계산한 값은 실제 위치에서 **조금씩 어긋난다.** 그런데 몇 초 뒤 라이다가 벽 모양을 보고 위치를 정정해주면, 로봇의 위치 추정치는 한순간에 훅 튀어야 한다. 이런 오차 누적과 추정치의 노이즈는 하나의 좌표계로 동시에 만족시킬 수 없다.

| | \`odom → base_link\` | \`map → odom\` |
|---|---|---|
| 계산 방법 | 바퀴 엔코더/IMU 적분(추측항법) | 라이다 스캔매칭·AMCL 등 전역 위치추정 |
| 업데이트 방식 | 연속적, 매끄러움 | 이산적, 가끔 훅 튐 |
| 장기 정확도 | 드리프트(누적오차)로 서서히 틀어짐 | 절대 정확(지도 기준 재정렬) |

로봇 제어는 부드럽게 이어지는 좌표가 필요하다.
위치가 갑자기 5cm 튀면 순간 속도가 튀어 로봇이 덜컹거린다. 그래서 로컬 플래너는 \`odom\` 기준으로 동작하고, 전역 경로 계획은 드리프트 없는 \`map\` 기준으로 동작한다.
\`map → base_link\`를 누군가 직접 발행하지 않는 이유이다.
매끄러움과 절대 정확성을 한 발행자가 동시에 만족시킬 수 없기 때문에, \`map → odom\`(정정)과 \`odom → base_link\`(적분)를 따로 발행하고 실제 절대 위치는 [tf2](../tf2/main.md)가 둘을 곱해서(복합 변환) 구한다.

## odom은 스칼라가 아니라 pose다

자동차 계기판의 오도미터는 스칼라 하나(누적 주행거리)지만,
로봇의 \`odometry\`는 **위치(x, y, z) + 방향(쿼터니언)** 을 가진 완전한 pose다.

차동구동 로봇을 예로 들면, 매 스텝마다 엔코더에서 나온 값으로 먼저 스칼라 변위를 구한다.

$$\\Delta d = \\frac{\\Delta d_L + \\Delta d_R}{2}, \\qquad \\Delta\\theta = \\frac{\\Delta d_R - \\Delta d_L}{L}$$

여기서 끝나지 않고, 로봇이 현재 향한 방향 θ로 이 스칼라를 벡터 분해해서 누적한다.

$$x \\mathrel{+}= \\Delta d \\cos\\theta, \\qquad y \\mathrel{+}= \\Delta d \\sin\\theta, \\qquad \\theta \\mathrel{+}= \\Delta\\theta$$

방향으로 분해하지 않고 스칼라만 누적하면 "총 몇 m 굴러갔다"만 남고 어디로 굴러갔는지는 알 수 없다.때문에, 스칼라만으로는 애초에 위치 추정이 안 된다.

\`nav_msgs/Odometry\`가 담는 것도 이 누적 결과 그대로다:
pose(position + 쿼터니언 orientation — tf2가 발행하는 \`TransformStamped\`와 같은 구조)와 twist(선속도·각속도). "거리를 잰다"는 어원은 매 순간의 재료가 스칼라 변위라는 뜻이지, 최종 결과가 스칼라라는 뜻이 아니다.
`,

  'ROS2/node': `---
title: Node
date: 2026-08-13
tags: 
order: 
featured: false
draft: false
---

# Node

subscriber, publisher, service, action등 구동체를 담고 있는 **실행 단위**.
한노드 안에는 많은 구동체들이 들어 있을 수 있다.

## node info
\`\`\`bash
ros2 node list
ros2 node info 노드이름
\`\`\`

예시: 각 subscriber, publisher , service, action을 볼 수 있다.
\`\`\`bash
$ ros2 node info /my_turtle
/my_turtle
  Subscribers:
    ...
  Publishers:
    ...
  Service Servers:
    /clear: std_srvs/srv/Empty
    /kill: turtlesim/srv/Kill
    /my_turtle/describe_parameters: rcl_interfaces/srv/DescribeParameters
    /my_turtle/get_parameter_types: rcl_interfaces/srv/GetParameterTypes
    /reset: std_srvs/srv/Empty
    /spawn: turtlesim/srv/Spawn
    /turtle1/set_pen: turtlesim/srv/SetPen
    /turtle1/teleport_absolute: turtlesim/srv/TeleportAbsolute
    /turtle1/teleport_relative: turtlesim/srv/TeleportRelative
  Service Clients:

  Action Servers:
    /turtle1/rotate_absolute: turtlesim/action/RotateAbsolute
  Action Clients:
\`\`\`

## remap

\`\`\`bash
ros2 run 패키지 노드 --ros-args -- remap __node:=커스텀이름
\`\`\`

---

노드가 발행/구독을 주고받는 통로는 [Topic](../topic/main.md) 참고. C++ 코드 레벨에서 노드·퍼블리셔·서브스크라이버를 실제로 구현하는 패턴은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고.`,

  'ROS2/qos': `---
title: QoS
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# QoS

상황에 맞게 통신 품질을 조절하는 정책 — [DDS](../dds/main.md) 계층 위에서 발행자·구독자마다 지정한다.
>카메라 영상 데이터는 매 프레임마다 찍히지만 모두 중요한 정보는 아니다. 지연이 되거나 유실 되더라고 가장 최신의 것으로 데이터를 처리할 수 있기 때문이다.

## Reliable
- 놓치면 안되는 중요한
- 유실을 허용 하지 않는다.
- 유실시 재전송해 반드시 모든 데이터를 받을 수 있게 한다.
## Best-effort
- 최신이 중요한 데이터
- 유실을 허용한다.
	
## Durability
-  구독자가 늦게 접속 했을시 이전 데이터를 받을지
- \`Volatile\`: 접속 후 데이터만
- \`Transient Local\`: 발행자가 마지막 메시지 보관 → 늦은 구독자에게도 전달 (지도·로봇 설명처럼 늦어도 **중요한** 데이터)

| 프로파일            | 구성                                 | 용도            |
| --------------- | ---------------------------------- | ------------- |
| **Default**     | Reliable, Volatile, KeepLast(10)   | 일반 통신(명령 등)   |
| **Sensor Data** | Best-Effort, Volatile, KeepLast(5) | 카메라·LiDAR 스트림 |
| **Services**    | Reliable                           | 서비스 통신        |
| **Parameters**  | Reliable                           | 파라미터          |
|                 |                                    |               |


> **호환성 규칙**: 구독자 요구가 발행자보다 엄격하면 연결 안 됨. Reliable→Best-effort 구독은 OK(꽉 찬 데이터에서 최신만 뽑는 셈), 반대는 연결 안 됨(유실분까지 재전송을 요구하는 셈)`,

  'ROS2/rclcpp-core-patterns': `---
title: rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)
date: 2026-08-08
tags: 
order: 
featured: false
draft: false
---

# rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)

퍼블리셔·구독자 · 서비스·파라미터·launch · 패키지 통합 · FK+PID 미니 프로젝트 네 실습에서 나온 rclcpp 문법을 패턴별로 정리한다. 각 패턴은 LearnC++ Ch.14 클래스 문법 위에 얹힌 것이라, 낯선 문법이 나오면 먼저 "이거 순수 C++인가, rclcpp가 추가한 것인가"부터 구분한다. 여기 패턴들을 실제 패키지 생성→빌드→실행까지 절차대로 따라가려면 [ROS2 C++ Pub-Sub 패키지 만들기 (교안)](../ros2-cpp-pub-sub-package/main.md) 참고.

## 노드 클래스 기본 골격

\`\`\`cpp
class MyNode : public rclcpp::Node   // rclcpp::Node를 상속 → "이 클래스 = ROS2 노드"
{
public:
  MyNode() : Node("my_node") { ... }  // 부모(Node) 생성자 호출로 노드 이름 등록
private:
  // 멤버 변수(퍼블리셔/구독자/타이머)와 콜백 함수
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);              // ROS2 시스템 초기화 — 모든 ROS2 프로그램의 첫 줄
  rclcpp::spin(std::make_shared<MyNode>());  // 노드 생성 + 이벤트 루프 진입 (Ctrl+C 전까지 콜백 대기)
  rclcpp::shutdown();                     // ROS2 리소스 정리
}
\`\`\`

\`public\`(생성자)을 먼저, \`private\`(구현 디테일)을 나중에 쓰는 순서는 LearnC++ 스타일과 반대인데, ROS2·Google C++ 스타일 가이드가 권장하는 방식이다.

## Publisher / Subscriber / Timer 생성

| 패턴 | 문법 | 비고 |
|---|---|---|
| Publisher 생성 | \`this->create_publisher<MsgType>("topic", 큐사이즈)\` | \`Node\`의 템플릿 멤버 함수 |
| Subscriber 생성 | \`this->create_subscription<MsgType>("topic", 큐사이즈, 콜백)\` | 콜백은 인자 1개짜리여야 함 |
| Timer 생성 | \`this->create_wall_timer(500ms, std::bind(&MyNode::callback, this))\` | \`using namespace std::chrono_literals;\` 필요 |
| 발행 | \`publisher_->publish(message);\` | |
| 로깅 | \`RCLCPP_INFO(this->get_logger(), "형식 '%s'", value.c_str());\` | 매크로(함수 아님) — 가변인자·위치정보 자동삽입·로그레벨 최적화 때문 |

멤버 함수를 구독 콜백으로 넘길 때는 \`std::bind(&MyNode::topic_callback, this, _1)\`처럼 \`this\`와 \`std::placeholders::_1\`로 인자 개수를 맞춰야 한다 — 멤버 함수 혼자는 "객체+인자" 2개가 필요해서 \`create_subscription\`이 기대하는 인자 1개짜리 콜백 모양과 안 맞기 때문. 최근 C++이면 람다로 더 직관적으로 대체 가능하다:

\`\`\`cpp
subscription_ = this->create_subscription<MsgType>(
  "topic", 10,
  [this](const MsgType & msg) { topic_callback(msg); });
\`\`\`

## 핸들 타입 (전부 SharedPtr)

| 멤버 변수 타입 | 용도 |
|---|---|
| \`rclcpp::Publisher<MsgType>::SharedPtr\` | 퍼블리셔 핸들 |
| \`rclcpp::Subscription<MsgType>::SharedPtr\` | 구독 핸들 |
| \`rclcpp::TimerBase::SharedPtr\` | 타이머 핸들 |

노드·퍼블리셔·타이머 같은 객체는 여러 곳에서 동시에 참조될 수 있어, 참조 카운팅 기반의 \`std::shared_ptr\`(\`<memory>\` 헤더)로 생명주기를 자동 관리한다 — 수동 \`new\`/\`delete\`보다 안전하기 때문에 ROS2 전반에서 이 패턴을 쓴다.

## 자주 쓰는 include

| 헤더 | 용도 |
|---|---|
| \`"rclcpp/rclcpp.hpp"\` | \`Node\`, \`init\`, \`spin\`, \`RCLCPP_INFO\` 등 rclcpp 핵심 |
| \`"std_msgs/msg/string.hpp"\` | 메시지 타입마다 자기 헤더가 따로 있음 (\`.msg\` 정의로부터 자동 생성) |
| \`<chrono>\` + \`using namespace std::chrono_literals;\` | \`500ms\` 같은 시간 리터럴 |
| \`<functional>\` | \`std::bind\`, \`std::placeholders::_1\` |
| \`<memory>\` | \`std::shared_ptr\`, \`std::make_shared\` |

## CMakeLists.txt 보일러플레이트

패키지 생성(\`ros2 pkg create --build-type ament_cmake <name> --dependencies rclcpp std_msgs\`) 후, \`find_package(std_msgs REQUIRED)\` 아래·\`ament_package()\` 위에 실행 파일마다 추가:

\`\`\`cmake
add_executable(talker src/publisher_member_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

install(TARGETS
  talker
  DESTINATION lib/\${PROJECT_NAME})
\`\`\`

\`add_executable\`/\`ament_target_dependencies\`는 \`.cpp\` 파일이 아니라 **빌드 타겟 단위**로 적용된다 — 실행 파일마다 반복해서 선언해야 한다.

## 빌드 후 실행 흐름

\`\`\`bash
cd ~/ros_ws
colcon build --packages-select <pkg_name>
source install/setup.bash    # 방금 만든 패키지를 이 셸에 등록
ros2 run <pkg_name> <executable_name>
\`\`\`

\`source install/setup.bash\`는 새 터미널(셸 세션)을 열 때마다 다시 해야 한다 — 환경변수는 그 셸 프로세스가 살아있는 동안만 유지되기 때문. 자세한 배경은 워크스페이스 구축 노트와 퍼블리셔·구독자 실습 노트의 Q&A 참고.

---

## Service 서버 — 콜백 인자가 2개인 이유

Publisher/Subscriber는 콜백 인자가 0개(타이머) 또는 1개(구독 메시지)였지만, 서비스 콜백은 **인자가 2개**(\`request\`, \`response\`)다 — "요청을 받아 응답을 채워 돌려준다"는 서비스의 역할이 시그니처에 그대로 드러난다.

\`\`\`cpp
class AddTwoIntsServer : public rclcpp::Node
{
public:
  AddTwoIntsServer() : Node("add_two_ints_server")
  {
    // "log_requests" bool 파라미터를 기본값 true로 선언·등록.
    // 반환값(현재 값)을 캐싱해두지 않는다 — 콜백마다 get_parameter로 다시 조회해야
    // 실행 중 \`ros2 param set\`으로 바꾼 값이 즉시 반영된다.
    this->declare_parameter("log_requests", true);

    service_ = this->create_service<example_interfaces::srv::AddTwoInts>(
      "add_two_ints",
      // 멤버 함수를 콜백으로 넘기려면 std::bind로 인자 개수를 맞춰야 한다.
      // _1, _2는 "요청이 실제로 들어올 때 채워질 자리"를 표시하는 placeholder.
      std::bind(&AddTwoIntsServer::handle_add, this,
                std::placeholders::_1, std::placeholders::_2));
  }

private:
  void handle_add(
    const std::shared_ptr<example_interfaces::srv::AddTwoInts::Request> request,
    std::shared_ptr<example_interfaces::srv::AddTwoInts::Response> response)
  {
    response->sum = request->a + request->b;   // 요청 필드를 읽어 응답 필드에 채워 넣는다

    bool log_requests;
    this->get_parameter("log_requests", log_requests);  // 콜백마다 다시 조회 (캐싱 금지)
    if (log_requests) {
      RCLCPP_INFO(this->get_logger(), "a=%ld b=%ld -> sum=%ld",
        request->a, request->b, (long int)response->sum);
    }
  }

  rclcpp::Service<example_interfaces::srv::AddTwoInts>::SharedPtr service_;  // 지역변수 X — 멤버로 저장해야 생성자 종료 후에도 살아있음
};
\`\`\`

\`example_interfaces::srv::AddTwoInts\`처럼 이미 정의된 서비스 타입은 \`Request\`/\`Response\` 두 구조체를 자동으로 갖고 있다 — 직접 \`.srv\` 파일을 새로 정의하지 않아도 흔한 타입(정수 덧셈 등)은 재사용 가능.

## Service 클라이언트 — 요청 1번 보내고 응답 기다리기

클라이언트는 계속 살아있을 필요가 없으므로 노드 클래스를 따로 안 만들고 \`main()\` 안에서 한 번 요청→응답받고 끝낸다.

\`\`\`cpp
auto node = rclcpp::Node::make_shared("add_two_ints_client");
auto client = node->create_client<example_interfaces::srv::AddTwoInts>("add_two_ints");

auto request = std::make_shared<example_interfaces::srv::AddTwoInts::Request>();
request->a = atoll(argv[1]);
request->b = atoll(argv[2]);

// 토픽(Pub/Sub)은 순서 상관없지만(느슨한 결합), 서비스는 요청 시점에 서버가
// 반드시 떠 있어야 하므로 서버 등장을 폴링하며 기다려야 한다.
while (!client->wait_for_service(1s)) {
  if (!rclcpp::ok()) { return 0; }  // Ctrl+C 등으로 종료 신호가 오면 대기 중단
}

auto result = client->async_send_request(request);  // 비동기 전송 → std::future 즉시 반환(응답 아직 안 왔을 수 있음)
// spin() 대신 spin_until_future_complete: 이 future가 완료(=응답 도착)될 때까지만 spin
if (rclcpp::spin_until_future_complete(node, result) == rclcpp::FutureReturnCode::SUCCESS) {
  RCLCPP_INFO(rclcpp::get_logger("rclcpp"), "Sum: %ld", (long int)result.get()->sum);
}
\`\`\`

| 구분 | Publisher/Subscriber | Service 서버/클라이언트 |
|---|---|---|
| 콜백 인자 | 0개(타이머) / 1개(메시지) | 2개(request, response) |
| 결합도 | 느슨함 — 상대가 없어도 동작 | 강함 — 요청 시점에 서버가 반드시 떠 있어야 함 |
| 대기 방식 | 없음(발행은 그냥 발행) | \`wait_for_service\` 폴링 필요 |
| 노드 생존 | 보통 계속 \`spin()\` | 클라이언트는 \`spin_until_future_complete\`로 1회만 대기 |

## Parameter — 노드별 설정값

\`\`\`cpp
this->declare_parameter("log_requests", true);  // 이름+기본값 선언, launch의 parameters=[...]가 이 기본값을 덮어씀

bool log_requests;
this->get_parameter("log_requests", log_requests);  // 현재 값 조회
\`\`\`

\`declare_parameter\`가 반환하는 "선언 시점의 값"을 멤버 변수에 캐싱해두면, 실행 중 \`ros2 param set\`으로 값을 바꿔도 반영되지 않는다 — 값이 바뀔 수 있는 파라미터는 **쓰는 시점마다** \`get_parameter\`로 다시 조회해야 한다.

## Launch 파일 — 여러 노드를 한 번에

\`\`\`python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(package='arm_bringup', executable='talker', name='talker'),
        Node(package='arm_bringup', executable='listener', name='listener'),
        Node(
            package='arm_bringup',
            executable='server',
            name='add_two_ints_server',
            parameters=[{'log_requests': True}],  # 재빌드 없이 파라미터 초기값 주입
        ),
    ])
\`\`\`

\`package\`는 실행 파일이 속한 패키지, \`executable\`은 \`CMakeLists.txt\`의 \`add_executable\` 이름, \`name\`은 \`ros2 node list\`에 뜨는 실제 노드 이름이다 — \`name\`을 지정하면 launch가 \`-r __node:=name\` 리매핑을 걸어 코드 안의 \`Node("...")\` 이름을 덮어쓴다 (코드를 고친 게 아니라 런타임에 이름만 바뀐 것).

## 여러 노드를 한 패키지로 묶기

노드 4개(talker/listener/server/client)를 패키지 하나(\`arm_bringup\`)로 합칠 때 규칙:

- **package.xml 의존성 = 합집합**. 각 노드가 쓰던 의존성(\`rclcpp\`, \`std_msgs\`, \`example_interfaces\`, \`geometry_msgs\` ...)을 전부 모아 선언한다.
- **CMakeLists.txt는 실행 파일마다 반복**. \`add_executable\` + \`ament_target_dependencies\`를 노드 개수만큼 쓰고, \`install(TARGETS ...)\`에는 한꺼번에 나열한다.

\`\`\`cmake
add_executable(talker src/publisher_member_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

add_executable(server src/add_two_ints_server.cpp)
ament_target_dependencies(server rclcpp example_interfaces)

install(TARGETS
  talker
  server
  DESTINATION lib/\${PROJECT_NAME})

# 소스 트리 launch/ → 설치 경로 share/<pkg>/launch 로 복사.
# 이게 없으면 colcon build 후에도 ros2 launch가 launch 파일을 못 찾는다.
install(DIRECTORY
  launch
  DESTINATION share/\${PROJECT_NAME})
\`\`\`

\`.cpp\` 파일을 다른 패키지로 옮겨도 **코드 안 내용은 고칠 필요가 없다** — 노드 이름(\`Node("...")\`)이나 토픽/서비스 이름은 코드가 결정하지, 어느 패키지에 속하는지와는 무관하다.

| 이름 | 어디서 정해지나 | 예 |
|---|---|---|
| 실행 파일 이름 | \`CMakeLists.txt\`의 \`add_executable(이름 ...)\` | \`talker\` |
| 노드 이름(기본) | \`.cpp\` 안 \`Node("...")\` | \`minimal_publisher\` |
| 노드 이름(오버라이드) | launch의 \`name=\` (리매핑) | \`talker\` |

## 커스텀 헤더를 여러 노드가 공유하기

PID 컨트롤러처럼 여러 노드가 재사용할 로직은 헤더 하나로 빼서 include한다.

\`\`\`cpp
// include/arm_bringup/pid_controller.hpp
#ifndef ARM_BRINGUP__PID_CONTROLLER_HPP_
#define ARM_BRINGUP__PID_CONTROLLER_HPP_

class PIDController
{
public:
  PIDController(double kp, double ki = 0.0, double kd = 0.0)
  : kp_(kp), ki_(ki), kd_(kd), integral_(0.0), prev_error_(0.0), has_prev_(false) {}

  double compute(double error, double dt)
  {
    integral_ += error * dt;                                          // I항: 오차 누적
    double derivative = has_prev_ ? (error - prev_error_) / dt : 0.0;  // D항: 첫 스텝은 0
    prev_error_ = error;
    has_prev_ = true;
    return kp_ * error + ki_ * integral_ + kd_ * derivative;           // P+I+D 합산
  }

private:
  double kp_, ki_, kd_, integral_, prev_error_;
  bool has_prev_;
};
#endif
\`\`\`

\`#include "arm_bringup/pid_controller.hpp"\`로 노드(\`pid_node.cpp\`)에서 가져다 쓰려면, \`CMakeLists.txt\`에 include 경로를 등록해야 한다 — 안 하면 "no such file" 컴파일 에러:

\`\`\`cmake
target_include_directories(pid_node PUBLIC include)
\`\`\`

## 노드 간 콜백 체인으로 제어 루프 구성

메시지 발행 자체가 상대 노드의 콜백을 트리거하는 방식으로 두 노드를 엮으면, 별도 타이머 없이도 "메시지가 클럭 역할"을 하는 폐루프를 만들 수 있다 (FK 노드 ↔ PID 노드 예시).

\`\`\`cpp
// fk_node: /joint_cmd 수신 → 적분 → /joint_state 재발행 → pid_node의 콜백을 다시 트리거
void on_cmd(const std_msgs::msg::Float64MultiArray::SharedPtr msg)
{
  theta1_ = theta1_ + msg->data[0] * 1.0;   // theta_{k+1} = theta_k + u_k*dt
  theta2_ = theta2_ + msg->data[1] * 1.0;
  publish_state();                          // 이 publish가 pid_node의 on_state를 다시 부른다
}
\`\`\`

루프를 처음 시동할 한 번의 발행이 필요한데, \`create_wall_timer\`는 원샷이 아니라 **주기** 타이머다 — 콜백 안에서 스스로 \`cancel()\`하지 않으면 계속 재발행되어 콜백 체인과 경쟁한다.

\`\`\`cpp
init_timer_ = create_wall_timer(std::chrono::milliseconds(300),
  [this]() {
    publish_state();
    init_timer_->cancel();  // 한 번만 쏘고 스스로 정지
  });
\`\`\`

> [!WARNING]
> **실제로 겪은 버그 — publisher/subscriber 초기화 누락 → null 포인터 역참조**
> 생성자에서 \`create_publisher\`/\`create_subscription\`으로 만든 결과를 멤버 변수에 저장하는 걸 하나라도 빠뜨리면, 나중에 그 멤버로 \`->publish(...)\`를 호출하는 순간 **컴파일은 통과하지만 런타임에 크래시**한다.
>
> 증상: \`ros2 node list\`엔 두 노드 다 정상으로 뜨고 토픽도 목록엔 있는데, \`ros2 topic echo\`/\`hz\` 둘 다 아무 것도 안 뜬다 — 한쪽 노드가 첫 메시지를 받자마자 죽어서 상대쪽 콜백 체인이 시작도 못 하고 끊기기 때문이다. \`create_publisher\`/\`create_subscription\`은 반드시 생성자 안에서 직접 만들어 멤버에 저장해야 한다.
`,

  'ROS2/ros-basics': `---
title: ROS 기초
date: 2026-08-08
tags: 
order: 
featured: false
draft: false
---

# ROS 기초

ROS2 작업 명령어 치트시트. 패키지 구조·빌드 시스템 원리(CMakeLists.txt·package.xml·build_type·ament index·빌드→설치→실행 흐름)는 [colcon build](../colcon-build/main.md), 노드/퍼블리셔/서브스크라이버 C++ 코드 패턴은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고. 이 명령어들로 실제 패키지를 처음부터 만드는 절차는 [ROS2 C++ Pub-Sub 패키지 만들기 (교안)](../ros2-cpp-pub-sub-package/main.md) 참고.

### 워크 스페이스 생성
\`\`\`bash
mkdir -p ~/ros_ws/src
cd ~/ros_ws
colcon build
source install/setup.bash
\`\`\`

### 시작
\`\`\`bash
#컨테이너 확인
docker ps
docker exec -it ros2_humble bash
\`\`\`

### 진입 후
\`\`\`bash
source /opt/ros/humble/setup.bash
cd ~/ros_ws
\`\`\`

터미널을 열어줄 때마다 시스템을 적용 시켜 줘야 한다.
underlay - \`rclcpp\`,\`example_interfaces\`
\`\`\`bash
source /opt/ros/humble/setup.bash # underlay - ROS2 자체가 설치된 시스템 경로
source install/setup.bash # overlay - 내가 만든 워크 스페이스
\`\`\`

### 패키지 생성/빌드
\`\`\`bash
cd ~/ros_ws
# --build type 패키지이름 --dependencies 참조/불러올 라이브러리
ros2 pkg create myPkg --build-type ament_cmake --dependencies rclcpp lib1 lib2 ... 

mkdir -p myPkg/launch #launch 경로 생성
colcon build --packages-select myPkg
source install/setup.bash
\`\`\`

### 토픽
\`\`\`bash
ros2 topic list
ros2 topic echo /토픽
\`\`\`

### 실행
\`\`\`bash
ros2 launch myPkg myPkg.launch.py
ros2 run myPkg 노드 +인풋
\`\`\`

### 확인
\`\`\`bash
ros2 service list # 현재 service
ros2 param get 토픽 파라미터
ros2 param set 토픽 파라미터
ros2 topic list # 현재 topic
\`\`\`
`,

  'ROS2/ros2-cpp-pub-sub-package': `---
title: ROS2 C++ Pub-Sub 패키지 만들기 (교안)
date: 2026-08-18
tags: 
order: 
featured: false
draft: false
---

# ROS2 C++ Pub-Sub 패키지 만들기 (교안)

강의 없이 혼자서 talker/listener 패키지를 처음부터 끝까지 만들어보는 절차. 각 단계의 문법 배경은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md), 빌드 시스템 원리는 [colcon build](../colcon-build/main.md) 참고 — 여기서는 "무엇을 어떤 순서로 하는지"만 절차형으로 정리한다.

## 0. 사전 준비

새 터미널을 열 때마다 ROS2 환경을 source 해야 명령어(\`ros2\`, \`colcon\`)를 인식한다.

\`\`\`bash
source /opt/ros/humble/setup.bash   # 또는 워크스페이스에 맞는 setup 경로
cd <워크스페이스>/src
\`\`\`

## 1. 패키지 생성

\`\`\`bash
ros2 pkg create <pkg_name> --build-type ament_cmake --dependencies rclcpp std_msgs
\`\`\`

\`--dependencies\`로 넘긴 라이브러리는 \`package.xml\`(\`<depend>\`)과 \`CMakeLists.txt\`(\`find_package\`)에 자동으로 등록된다.

## 2. Talker (Publisher) 노드

\`src/<pkg_name>_talker.cpp\`:

\`\`\`cpp
#include <chrono>
#include <memory>
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;   // 500ms 같은 시간 리터럴 쓰려면 namespace 필수

class Talker : public rclcpp::Node
{
public:
  Talker() : Node("talker")
  {
    publisher_ = this->create_publisher<std_msgs::msg::String>("chatter", 10);
    timer_ = this->create_wall_timer(
      500ms,
      [this]() { this->publish_message(); });
  }

private:
  void publish_message()
  {
    auto message = std_msgs::msg::String();
    message.data = "hello " + std::to_string(count_++);
    RCLCPP_INFO(this->get_logger(), "발행: '%s'", message.data.c_str());
    publisher_->publish(message);
  }

  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
  size_t count_ = 0;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Talker>());
  rclcpp::shutdown();
  return 0;
}
\`\`\`

## 3. Listener (Subscriber) 노드

\`src/<pkg_name>_listener.cpp\`:

\`\`\`cpp
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

class Listener : public rclcpp::Node
{
public:
  Listener() : Node("listener")
  {
    subscription_ = this->create_subscription<std_msgs::msg::String>(
      "chatter", 10,
      [this](const std_msgs::msg::String & msg) {
        RCLCPP_INFO(this->get_logger(), "수신: '%s'", msg.data.c_str());
      });
  }

private:
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr subscription_;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Listener>());
  rclcpp::shutdown();
  return 0;
}
\`\`\`

## 4. \`CMakeLists.txt\` 등록

\`find_package(std_msgs REQUIRED)\` 아래, \`ament_package()\` 위에 실행 파일마다 3줄씩 추가:

\`\`\`cmake
add_executable(talker src/<pkg_name>_talker.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

add_executable(listener src/<pkg_name>_listener.cpp)
ament_target_dependencies(listener rclcpp std_msgs)

install(TARGETS
  talker
  listener
  DESTINATION lib/\${PROJECT_NAME})
\`\`\`

## 5. 빌드 및 실행

\`\`\`bash
cd <워크스페이스>
colcon build --packages-select <pkg_name>
source install/setup.bash   # 새 터미널마다 반복

# 터미널 1
ros2 run <pkg_name> talker
# 터미널 2
ros2 run <pkg_name> listener
# 확인용 터미널
ros2 topic echo /chatter
\`\`\`

## 6. 자주 걸리는 실수 체크리스트

- \`using std::chrono_literals;\` — \`namespace\` 키워드 빠뜨림 (\`using namespace std::chrono_literals;\`가 맞음)
- 생성자 초기화 리스트가 **삭제한 멤버 변수**를 여전히 참조 (예: \`count_(0)\`인데 \`count_\` 멤버 선언을 지움)
- 세미콜론 누락 — 특히 \`rclcpp::init(argc, argv)\` 다음 줄
- \`create_publisher\`/\`create_subscription\`의 반환값을 멤버 변수에 저장하지 않음 → 컴파일은 되지만 생성자 종료 즉시 소멸돼 런타임에 조용히 죽음 ([rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md)의 "실제로 겪은 버그" 항목 참고)
- \`CMakeLists.txt\`에 \`add_executable\`을 추가했는데 \`colcon build\`가 반영 안 될 때 → \`install/\`, \`build/\` 지우고 재빌드하거나 \`--cmake-clean-cache\` 시도
`,

  'ROS2/ros2-pub-sub-communication': `---
title: ROS2 발행-구독 통신
date: 2026-08-16
tags: pub-sub, loose-coupling, dds
order: 
featured: false
draft: false
---

# ROS2 발행-구독 통신

발행자는 **고독한 작가**다. 작가는 세상과 단절된 채 자신의 할 일을 묵묵히 한다. 일간지([토픽](../topic/main.md))에 계속 글을 발행하지만, 정작 바깥이 어떻게 돌아가는지는 모른다 — 누가, 몇 명이나 읽는지 신경 쓰지 않는다. 작가는 이걸 모른다, 그냥 일을 할 뿐이다. 이것이 [느슨한 결합](../loose-coupling/main.md)이다.

작가가 글을 올리면, 출판사([DDS](../dds/main.md))가 그 글을 구독자들에게 배달한다. 작가가 구독자를 몰라도 통신이 성립하는 건, 출판사가 노드 발견(discovery)과 배달을 대신 처리해주기 때문이다.

글이 도착하면, 구독자가 미리 걸어둔 [콜백](../callback/main.md)이 켜진다 — *"이 신문 오면 나 깨워줘"* 라고 등록해둔 반응이 도착을 신호로 스스로 발화하는 것이다(그래서 event-driven). 콜백은 출판사가 보내는 것이 아니라, 구독자 쪽에 걸려 있다가 배달을 계기로 켜진다.

## QoS는 취향이 아니라 계약이다

[QoS](../qos/main.md)를 "화질·알림 설정" 정도로 보면 약하다. 발행자와 구독자의 QoS가 맞지 않으면 통신이 아예 실패한다 — 데이터가 흐르긴커녕 둘이 **연결조차 안 된다.** 그래서 QoS는 선호를 고르는 다이얼이 아니라, **양쪽이 호환돼야 하는 계약**에 가깝다.

> 비유의 한계: 유튜브·출판사처럼 "중앙"이 있는 그림과 달리, 실제 DDS는 중앙 브로커가 없이 노드들이 서로 직접 발견한다(peer-to-peer).
`,

  'ROS2/ros2-urdf-syntax': `---
title: ROS2 URDF 문법 정리
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# ROS2 URDF 문법 정리

URDF(Unified Robot Description Format)는 로봇의 링크(부품)와 조인트(관절)를 XML 트리로 기술하는 포맷이다. ROS 2에서는 순수 URDF를 직접 쓰기보다 **xacro**로 매크로/변수를 섞어 쓰는 게 사실상 표준이다.
확인 명령:

\`\`\`bash
ros2 launch urdf_tutorial display.launch.py model:=절대경로/robot.urdf
\`\`\`

## 1. 최상위 구조

\`\`\`xml
<?xml version="1.0"?>
<robot name="my_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">
  <link name="..."/>
  <joint name="..." type="...">...</joint>
</robot>
\`\`\`

루트는 \`<robot>\` 태그이고 \`name\` 속성이 필수다. 그 안에 \`<link>\`와 \`<joint>\`를 나열해서 트리를 구성하는데, 링크가 노드, 조인트가 엣지 역할을 한다. 트리 구조이므로 부모가 없는 최상위 링크(보통 \`base_link\`)가 하나만 있어야 하고, 순환 구조는 만들 수 없다.

## 2. \`<link>\` — 물리적 부품

\`\`\`xml
<link name="wheel_left">
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry>
      <cylinder radius="0.05" length="0.02"/>
      <!-- box size="x y z" / sphere radius / mesh filename="package://.../a.dae" -->
    </geometry>
    <material name="black">
      <color rgba="0 0 0 1"/>
    </material>
  </visual>

  <collision>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry><cylinder radius="0.05" length="0.02"/></geometry>
  </collision>

  <inertial>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <mass value="0.5"/>
    <inertia ixx="0.001" ixy="0" ixz="0" iyy="0.001" iyz="0" izz="0.001"/>
  </inertial>
</link>
\`\`\`

하나의 링크 안에는 목적이 다른 세 블록이 들어간다.

| 태그 | 역할 |
|---|---|
| \`visual\` | RViz 등에서 그려지는 형상. mesh처럼 복잡한 모델도 가능 |
| \`collision\` | 충돌 계산용 형상. 연산량 때문에 visual보다 단순한 도형으로 근사하는 게 일반적 |
| \`inertial\` | 질량과 관성텐서. Gazebo 등 물리 시뮬레이션에는 필수지만, RViz로 시각화만 할 거면 생략해도 된다 |

\`geometry\`에 넣을 수 있는 형상은 \`box\`, \`cylinder\`, \`sphere\`, 그리고 \`.stl\`/\`.dae\` 같은 \`mesh\`(\`package://\` 경로로 참조)다.

## 3. \`<joint>\` — 링크 간 연결

\`\`\`xml
<joint name="wheel_left_joint" type="continuous">
  <parent link="base_link"/>
  <child link="wheel_left"/>
  <origin xyz="0 0.1 0" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
  <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
  <dynamics damping="0.1" friction="0.0"/>
</joint>
\`\`\`

\`type\` 속성은 필수이며 조인트의 자유도 성격을 결정한다.

| type | 설명 |
|---|---|
| \`fixed\` | 고정, 움직이지 않음 (센서 마운트 등) |
| \`revolute\` | 회전, 각도 제한 있음 (관절 로봇 팔) |
| \`continuous\` | 회전, 제한 없음 (바퀴) |
| \`prismatic\` | 직선 이동, 위치 제한 있음 (리니어 액추에이터) |
| \`floating\` | 6DOF 자유 이동 (거의 안 씀) |
| \`planar\` | 평면상 이동 |

나머지 하위 태그는 다음 역할을 한다.

- \`origin\`: child가 parent 좌표계 기준으로 어디에 붙는지 (\`xyz\` + \`rpy\`, 라디안 단위)
- \`axis\`: revolute/continuous/prismatic에서 실제로 움직이는 축
- \`limit\`: revolute/prismatic에는 필수 (\`lower\`, \`upper\`, \`effort\`, \`velocity\`)

## 4. ROS 2에서 같이 쓰는 확장들

### xacro — 매크로와 변수

\`\`\`xml
<xacro:property name="wheel_radius" value="0.05"/>

<xacro:macro name="wheel" params="prefix reflect">
  <link name="\${prefix}_wheel">
    ...
    <cylinder radius="\${wheel_radius}" length="0.02"/>
  </link>
</xacro:macro>

<xacro:wheel prefix="left" reflect="1"/>
<xacro:wheel prefix="right" reflect="-1"/>

<xacro:include filename="$(find my_pkg)/urdf/sensors.xacro"/>
\`\`\`

바퀴 4개, 손가락처럼 반복되는 구조를 매크로로 처리하지 않으면 URDF가 지나치게 길어지므로, ROS 2에서는 \`.urdf.xacro\` 파일로 작성한 뒤 \`xacro robot.urdf.xacro > robot.urdf\` 명령이나 launch 파일 안의 \`xacro.process_file()\`로 변환해서 쓰는 게 일반적이다.

### \`<ros2_control>\` — 하드웨어 인터페이스 선언

\`\`\`xml
<ros2_control name="MyRobotSystem" type="system">
  <hardware>
    <plugin>gazebo_ros2_control/GazeboSystem</plugin>
    <!-- 또는 실기체용 커스텀 hardware_interface 플러그인 -->
  </hardware>
  <joint name="wheel_left_joint">
    <command_interface name="velocity"/>
    <state_interface name="position"/>
    <state_interface name="velocity"/>
  </joint>
</ros2_control>
\`\`\`

이 태그는 어떤 조인트를 어떤 command/state 인터페이스로 제어할지 선언하는 부분이다. \`hardware/plugin\`에는 시뮬레이션용(\`gazebo_ros2_control/GazeboSystem\`)이나 실제 하드웨어 드라이버 플러그인을 지정한다. \`command_interface\`는 컨트롤러가 내려보내는 값(position/velocity/effort), \`state_interface\`는 컨트롤러가 읽어오는 값이다. 실제 제어 알고리즘(\`diff_drive_controller\`, \`joint_trajectory_controller\` 등)은 별도 \`controllers.yaml\`에 설정하고, 이를 \`ros2_control_node\`가 로드해서 구동한다.

### \`<gazebo>\` — 시뮬레이션 전용 설정

\`\`\`xml
<gazebo reference="wheel_left">
  <mu1>1.0</mu1>
  <mu2>1.0</mu2>
</gazebo>

<gazebo>
  <plugin filename="libgazebo_ros2_control.so" name="gazebo_ros2_control">
    <parameters>$(find my_pkg)/config/controllers.yaml</parameters>
  </plugin>
</gazebo>
\`\`\`

\`reference\` 속성을 주면 특정 링크에 마찰(\`mu1\`/\`mu2\`) 같은 Gazebo 전용 물리 속성을 부여하는 것이고, \`reference\` 없이 쓰면 로봇 전체에 적용되는 플러그인 선언(예: \`gazebo_ros2_control\` 로딩)이 된다.

## 5. 전체 흐름 (ROS 2 기준)

1. \`urdf/robot.urdf.xacro\` 작성 — link, joint, xacro 매크로 포함
2. \`ros2_control\` 태그로 제어 인터페이스 선언
3. \`robot_state_publisher\`가 URDF를 읽어서 \`/tf\`, \`/robot_description\`을 퍼블리시 — 이후 좌표 변환 계산은 [tf2](../tf2/main.md)가 이 트리를 참조해서 처리한다
4. \`joint_state_publisher\`(또는 실제 조인트 상태)를 통해 RViz에서 시각화
5. Gazebo 시뮬레이션에서는 \`<gazebo>\` 플러그인이 \`controllers.yaml\`을 로드해 \`ros2_control_node\`를 구동

## 6. 자주 하는 실수

- \`inertial\` 값이 0이거나 비현실적이면 Gazebo에서 로봇이 날아가거나 뒤집힌다.
- \`collision\` 형상을 mesh 그대로 쓰면 물리 연산이 무겁고 불안정해진다 → 단순 도형으로 근사하는 게 낫다.
- \`axis\`의 방향과 \`origin\`의 \`rpy\` 좌표계를 혼동하기 쉽다 — \`axis\`는 parent가 아니라 child 링크 좌표계 기준이다.
- xacro \`\${}\` 수식 안에서는 단위가 자동 변환되지 않으므로, 항상 SI 단위(m, rad, kg)로 통일해야 한다.
`,

  'ROS2/ros2bag': `---
title: ros2bag
date: 2026-08-14
tags: 
order: 
featured: false
draft: false
---

# ros2bag

- \`ros2 bag\`은 [토픽](../topic/main.md)으로 오가는 메세지를 파일로 **기록(녹화)**했다가 그대로 **재생**하는 도구 (\`rosbag2\` 패키지가 제공)
- 센서나 로봇 없이도 그때의 데이터를 반복 재현할 수 있어 디버깅·알고리즘 튜닝·데이터셋 수집에 쓴다.

\`\`\`
발행 중인 topic --record--> rosbag2_.../ (mcap + metadata.yaml) --play--> 다시 발행
\`\`\`

## bag record

토픽 메세지를 파일로 기록
\`\`\`bash
ros2 bag record /토픽이름        # 특정 토픽 하나
ros2 bag record /scan /odom /tf # 여러 토픽
ros2 bag record -a              # 발행 중인 모든 토픽
\`\`\`

\`Ctrl+C\`로 멈추면 현재 폴더에 \`rosbag2_YYYY_MM_DD-HH_MM_SS/\` 폴더가 생기고, 그 안에 \`.mcap\`(Humble 이후 기본, 예전은 \`.db3\`) 데이터 파일과 \`metadata.yaml\`이 저장된다.

### 자주 쓰는 옵션
\`\`\`bash
ros2 bag record -a -o my_data   # -o 출력 폴더 이름 지정 (기본은 타임스탬프)
ros2 bag record -e "/camera/.*" # -e 정규식에 맞는 토픽만
ros2 bag record -a -x "/tf.*"   # -x 정규식에 맞는 토픽 제외
# 압축 저장
ros2 bag record -a --compression-mode file --compression-format zstd
\`\`\`

| 옵션 | 설명 |
|------|------|
| \`-a\`, \`--all\` | 발행 중인 모든 토픽 기록 |
| \`-o\`, \`--output\` | 출력 폴더 이름 지정 |
| \`-e\`, \`--regex\` | 정규식에 맞는 토픽만 기록 |
| \`-x\`, \`--exclude\` | 정규식에 맞는 토픽 제외 |
| \`-d <초>\` | 지정 시간마다 파일 분할 |
| \`-b <바이트>\` | 지정 크기마다 파일 분할 |

> [!WARNING]
> 카메라/포인트클라우드 같은 토픽은 초당 수백 MB가 될 수 있어 \`-a\`로 전부 기록하면 디스크를 빠르게 채운다. 필요한 토픽만 지정하거나 압축을 쓰자.

## bag info

기록된 내용 요약 (토픽 목록/메세지 수/기간/크기)
\`\`\`bash
ros2 bag info <폴더>
\`\`\`

## bag play

기록한 데이터 재생
\`\`\`bash
ros2 bag play <폴더>
ros2 bag play <폴더> --loop     # 반복 재생
ros2 bag play <폴더> --rate 2.0 # 2배속 재생
\`\`\`

- 재생 시 [RViz2](../rviz2/main.md) 등에서 제대로 재현하려면 \`/tf\`, \`/clock\` 등이 함께 기록돼 있어야 한다.
- 시뮬레이션 데이터는 \`/clock\` 기록 여부와 \`--use-sim-time\` 설정을 신경 써야 한다.

---
[ROS 2 Documentation - Recording and playing back data](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html)
`,

  'ROS2/rviz2': `---
title: RViz2
date: 2026-08-14
tags: 
order: 
featured: false
draft: false
---

# RViz2

토픽 숫자를 3D 공간의 형상으로 그려주는 시각화 도구다.
- **센서 데이터**(LiDAR 점군·카메라·깊이)
- **TF 좌표계**, **로봇 모델**(URDF)
- **경로·마커**를 한 화면에 겹쳐 볼 수 있다는 게 핵심 

>"LiDAR가 본 장애물"과 "인지가 검출한 장애물"과 "TF상 센서 위치"를 동시에 겹치면 좌표 변환이 틀어졌는지 한눈에 드러난다. TF 디버깅에는 사실상 필수 도구.

\`\`\`bash
ros2 launch turtlebot3_bringup rviz2.launch.py       # RViz2 띄우기
ros2 launch turtlebot3_gazebo empty_world.launch.py  # Gazebo 빈 월드 시뮬
\`\`\`

## Marker

RViz2는 **토픽에 있는 것만** 그린다.
사용자가 계산한 결과는 \`visualization_msgs/Marker\`로 직접 **발행**해야만 화면에 나타난다.
RViz2에서는 \`Add → By topic\`으로 해당 토픽을 추가하고, 왼쪽 위 [Fixed Frame](#fixed-frame)을 마커의 \`frame_id\`와 일치시켜야 한다.
![](Pasted image 20260815003138.png)
> [!NOTE]
> **마커가 안 보이는 3대 원인**
> \`scale = 0\` · \`color.a\`(투명도) \`= 0\` · **Fixed Frame 불일치**

여러 점을 한 번에 그릴 때는 \`Marker.SPHERE_LIST\`나 \`MarkerArray\`를 쓴다.

### FIxed Frame
RViz2 가 모든걸 그릴때 기준으로 삼는 좌표계.
Marker는 자신의 \`frame_id\` 를 기준으로 좌표가 찍힌다. 그 좌표를 기준으로 **프레임 트리**가 만들어지기 때문에 

#### Frame Tree
로봇의 베이스, 조인트 좌표는 모두 하나의 root에서 시작 되어 연결 되어 있다
map $\\rightarrow$ odom $\\rightarrow$ base_link $\\rightarrow$ ...

---
녹화한 데이터를 RViz2로 재현하는 흐름은 [ros2bag](../ros2bag/main.md) 참고.
`,

  'ROS2/tf2-transform-computation': `---
title: tf2가 좌표를 계산하는 방식
date: 2026-08-20
tags: coordinate-frame, transformation-matrix
order: 
featured: false
draft: false
---

# tf2가 좌표를 계산하는 방식

## 모든 좌표는 링크

로봇에 라이다가 \`laser_frame\`으로 달려 있고,
\`map → odom → base_link → laser_frame\`일때. 각 \`broadcaster\`는
자기가 아는 **인접한 두 프레임 사이 변환만** 계산, 발행한다. \`map\`부터 \`laser_frame\`까지 한 번에 아는 노드는 없다


이걸 \`tf2_ros.Buffer\`가 edge마다 시간별 이력으로 쌓아둔다. 발행 주기가 서로 달라 정확히 그 timestamp의 값이 없으면 앞뒤 샘플을 보간하는데, 위치는 선형보간, 회전은 쿼터니언의 slerp(구면 선형보간)를 쓴다.

## 계산
최상위 까지 체인을 곱한다

\`map\`과 \`laser_frame\`은 트리 상 바로 안 붙어 있으니, [tf2](../tf2/main.md)는 \`laser_frame → base_link → odom → map\`으로 올라가며 각 구간의 변환을 순서대로 곱하고, 반대 방향이 필요하면 역행렬(쿼터니언은 conjugate)로 뒤집어 붙인다.

이건 새로운 계산법이 아니라, 변환 행렬 이론의 **변환 방정식(루프)** 그대로다. 두 프레임 사이에 공통 조상(map)이 있고, 그 조상까지 가는 두 체인을 곱했다 뺐다(역행렬) 하면 원하는 구간만 남는다:

$$^{map}_{base\\_link}T = {}^{map}_{odom}T \\; {}^{odom}_{base\\_link}T$$

tf2는 이 "루프 방정식 풀기"를 트리 탐색으로 자동화한 것뿐이다. 손으로 4×4 행렬을 곱하고 뒤집던 걸, 자료구조(트리 + 시간별 버퍼)로 대신해주는 셈.

## 바뀌는건 기준 좌표

"laser_frame 기준 점을 map 기준으로 바꾼다"는 표현은 오해를 부르기 쉽다. \`map\`은 트리의 뿌리라서 안 움직인다. 움직이는 건 로봇(\`base_link\`, \`laser_frame\`) 쪽이고, 그래서 \`map→odom→base_link\`의 변환값 자체가 시간마다 갱신되는 것이다.

라이다가 "내 앞 2m"라고 잰 값은 실제 세계에서 안 움직이는 벽일 수도 있다. 하지만 \`(2, 0, 0)\`이라는 숫자는 **laser_frame 기준으로 잰 좌표값**일 뿐이다.
로봇이 움직이면 벽은 그대로 있어도 "내 앞 2m"라는 숫자는 계속 바뀐다. 즉 \`lookupTransform("map", "laser_frame", t)\`가 구해주는 건 laser_frame 언어로 쓰인 좌표를 map 기준으로 **변환하는 행렬** 이다.

## 평행이동, 쿼터니언

\`tf2::Transform\`은 회전을 3×3 행렬이 아니라 쿼터니언으로 들고 있다. 짐벌락이 없고 삼각함수 없이 곱셈·덧셈뿐이라, 트리를 여러 단 타고 올라가는 반복 합성 연산에서 더 빠르고 안정적이기 때문이다. \`geometry_msgs/Quaternion\`이 \`(x, y, z, w)\` 4개 필드인 것도 이 오일러 파라미터 그대로다.
`,

  'ROS2/tf2': `---
title: tf2
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# tf2

[Introducing tf2 — ROS 2 Documentation](https://docs.ros.org/en/foxy/Tutorials/Intermediate/Tf2/Introduction-To-Tf2.html)

로봇은 이동할 때마다 자신의 base 좌표를 다시 계산해야 하는데, ROS2에서는 tf2가 [URDF](../ros2-urdf-syntax/main.md)를 참조해 이 좌표 변환을 자동으로 처리해준다.

> map - odom - baselink

튜토리얼 예제에서 tf2는 3개의 좌표 프레임(월드, 객체, 타겟)을 계산한다. broadcaster가 객체의 좌표값을 받아 두 객체의 좌표 차이를 계산하면, 객체가 타겟을 따라가게 된다.

![](Pasted image 20260811213316.png)

3개의 좌표는 아래와 같은 방식으로 연결된다.
![](Pasted image 20260811213611.png)
`,

  'ROS2/topic': `---
title: Topic
date: 2026-08-13
tags: 
order: 
featured: false
draft: false
---

# Topic

- 토픽은 [노드](../node/main.md)와 노드 사이 메세지가 통과하는 통로

\`publisher\` -msg-> \`topic\` -msg-> \`subscriber\`

![](Pasted image 20260813105008.png)

- 노드는 여러 토픽에 발행할 수 있다.
- 노드는 여러 토픽을 구독 할 수 있다.

## run rqt_gragh

노드, 토픽간의 **시각화**
\`\`\`bash
ros2 run rqt_gragh rqt_gragh
\`\`\`

\`teleop_turtle\` 과 \`turtlesim\` 은 각각 \`/turtle/cmd_vel \` 을 발행,구독 하는것을 볼 수 있다.
![](Pasted image 20260813214017.png)

## topic list

토픽 리스트
\`\`\`bash
ros2 topic list
ros2 topic list -t #같은 토픽 목록 [토픽유형]
\`\`\`

## topic echo

토픽에 발행 되는 데이터 보기
\`\`\`bash
ros2 topic echo /토픽이름 --once # 한번만
\`\`\`

\`/_ros2cli_26646\`는 \`echo\` 명령어를 실행한 후 생성된 노드이다. \`teleop_turtle\`가  \`cmd_vel\` 토픽을 통해 데이터를 발행하고 두 구독자가 이를 구독하고 있다는 것을 볼 수 있다.
![](Pasted image 20260813214354.png)

\`\`\`
ros2 topic info 토픽 --verbose
\`\`\`
- 발행자와 구독자의 노드이름, 네임스페이스
- 토픽 유형
- [QoS 프로필](../qos/main.md)

## interface show

토픽 유형의 요소를 보고 싶을때
\`\`\`bash
ros2 interface show 토픽유형(geometry_msgs/msg/Twist)
\`\`\`

\`\`\`bash
#geometry_msgs/msg/Twist 의 요소 
    Vector3  linear
            float64 x
            float64 y
            float64 z
    Vector3  angular
            float64 x
            float64 y
            float64 z
\`\`\`
같은 토픽을 발행, 구독 하는 노드는 같은 타입의 토픽 유형을 공유 한다.

## topic pub

토픽을 반환
\`'<args>'\`  인수는 토픽에 전달할 실제 데이터이며 이전 섹션에서 발견한 구조

\`\`\`bash
ros2 topic pub <topic_name> <msg_type> '<args>'

# 예시
# 옵션이 없으면 1Hz로 발행
ros2 topic pub /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 2.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 1.8}}"
# --once 는 단 한번만 
ros2 topic pub --once -w 2 /turtle1/cmd_vel geometry_msgs/msg/Twist "{linear: {x: 2.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 1.8}}"
\`\`\`

임시로 만든 \`topic pub\` 노드가 \`turtle1/cmd_vel\` 로 발행 하는 모습
![](Pasted image 20260813222214.png)


## topic hz

데이터가 발행 되는 속도
\`\`\`bash
ros2 topic hz 토픽
\`\`\`

## topic bw

토픽이 사용하는 대역폭
\`\`\`
ros2 topic bw 토픽
\`\`\`
> [!WARNING]
> 대역폭은 \`ros2 topic bw\` 명령어로 생성된 구독에서 수신된 속도를 반영하며 플랫폼 자원과 QoS 설정에 영향을 받아 발행자의 대역폭과 정확히 일치하지 않을 수 있다.

## ros2 topic find

주어진 유형의 사용 가능한 토픽 목록
\`\`\`bash
ros2 topic find <topic_type>
\`\`\`

예시
\`\`\`bash
#geometry_msgs/msg/Twist
ros2 topic find geometry_msgs/msg/Twist
/turtle1/cmd_vel
\`\`\`

---
[02-4. 토픽(Topics) 이해하기 - ROS 2 Humble 입문](https://wikidocs.net/333526)`,

  'ROS2/단일-스레드-멀티-스레드': `---
title: 단일 스레드, 멀티 스레드
date: 2026-08-12
tags: thread
order: 
featured: false
draft: false
---

# 단일 스레드, 멀티 스레드

스레드는 프로세스가 할당받은 자원을 이용하는 실행의 단위다.

- **단일 스레드**: 프로세스 안에서 실행 흐름이 하나뿐 — 콜백이든 뭐든 한 번에 하나씩만 처리된다.
- **멀티 스레드**: 같은 프로세스 자원을 공유하는 여러 실행 흐름이 동시에 돈다 — 병렬 처리가 가능해지지만 자원을 공유하는 만큼 경쟁 상태(race condition) 같은 문제가 생길 수 있다.

ROS2에서는 [기본 executor가 단일 스레드](../callback/main.md)라 콜백을 하나씩 순서대로 처리하고, 여러 콜백을 동시에 돌리려면 멀티 스레드 executor(\`MultithreadedExecutor\`)로 바꿔야 한다 — 이 노트의 단일/멀티 스레드 구분이 그 전제가 된다.

![](Pasted image 20260812091208.png)

[스레드란?](https://velog.io/@gil0127/%EC%8B%B1%EA%B8%80%EC%8A%A4%EB%A0%88%EB%93%9CSingle-thread-vs-%EB%A9%80%ED%8B%B0%EC%8A%A4%EB%A0%88%EB%93%9C-Multi-thread-t5gv4udj)`,

  'Robotics/cartesian-space-trajectory-generation': `---
title: 작업 공간 궤적 생성 — 특이점·도달불가공간·장애물 회피 (Cartesian-Space Trajectory Generation)
date: 2026-08-08
tags: task-space, singularity
order: 
featured: false
draft: false
---

# 작업 공간 궤적 생성 — 특이점·도달불가공간·장애물 회피 (Cartesian-Space Trajectory Generation)

> 출처: 로봇제어공학 — Introduction to Robotics 7장 "궤도 생성(Trajectory Generation)" 마무리 (작업 공간 궤적 생성)
> 영상: https://www.youtube.com/watch?v=1ZAGpiTyfEU&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=21
> 대상: [7-1·7-2](../cubic-spline-and-lspb/main.md)에서 **관절 공간(joint space)** 궤적 생성(3차/5차 다항식, LSPB)을 마친 상태를 전제로, 왜 그것만으로 부족한지 그리고 **작업 공간(task/Cartesian space)** 궤적 생성이 무엇을 대신 하는지를 다루는 노트.

---

## 목차
1. [관절 공간법의 한계 — 손끝 경로는 보장 안 된다](#1-관절-공간법의-한계--손끝-경로는-보장-안-된다)
2. [작업 공간 궤적 생성 — 손끝을 직접 변수로 잡기](#2-작업-공간-궤적-생성--손끝을-직접-변수로-잡기)
3. [방위(orientation) 표현 — RPY 대신 축·각으로](#3-방위orientation-표현--rpy-대신-축·각으로)
4. [장단점 비교 — 관절 공간 vs 작업 공간](#4-장단점-비교--관절-공간-vs-작업-공간)
5. [작업 공간에서만 생기는 함정 — 도달 불가 공간과 특이점](#5-작업-공간에서만-생기는-함정--도달-불가-공간과-특이점)
6. [동역학 기반 경로 제약과 장애물 회피](#6-동역학-기반-경로-제약과-장애물-회피)
7. [표현법 비교표](#7-표현법-비교표)
8. [Python 실습 코드](#8-python-실습-코드)

---

## 1. 관절 공간법의 한계 — 손끝 경로는 보장 안 된다

[7-1·7-2](../cubic-spline-and-lspb/main.md)에서 배운 방법은: 작업 공간의 목표점 몇 개를 [역기구학](../inverse-kinematics-algebraic-geometric-pieper/main.md)으로 관절각으로 바꾼 뒤, **관절 각도 θ(t)를 시간의 함수로** 부드럽게 이어 붙이는 것이었다. 이 방법이 가장 일반적이고 계산도 가볍다.

그런데 여기엔 숨은 함정이 있다. 시작점과 끝점(또는 경유점)에서의 **관절 각도만 보장**했지, 그 사이 **손끝이 어떤 경로로 움직이는지는 전혀 신경 쓰지 않았다.** 예를 들어 어깨 관절 각도가 1°→6°로 선형으로 곱게 변하더라도, 여러 관절의 움직임이 합쳐진 손끝은 직선이 아니라 휘어진 경로로 갈 수 있다 — 손끝 궤적의 모양은 결과로만 확인할 수 있다.

**이게 문제가 안 되는 경우**: 픽앤플레이스(pick-and-place)처럼 시작·끝 위치만 중요하고 중간 경로는 상관없는 작업에는 관절 공간법이 딱 맞는다.

**이게 문제가 되는 경우**: 용접·글씨쓰기처럼 손끝이 **정말로 정해진 선(용접 틈, 궤적)을 따라가야** 하는 작업. 경유점을 촘촘히 찍으면 근사적으로 직선에 가까워지긴 하지만, 그때마다 역기구학을 다시 풀어야 해서 계산량이 급격히 늘고 제어가 느려진다.

**실전 취급**: 목적에 따라 방법을 고른다 — 목표점만 중요하면 관절 공간, 경로 자체가 중요하면 다음 절의 작업 공간 궤적 생성으로 넘어간다.

## 2. 작업 공간 궤적 생성 — 손끝을 직접 변수로 잡기

발상은 간단하다. 관절 각 θ 대신 **손끝의 위치·방위를 직접 시간의 함수로 만든다.** 3차원 공간에서 표현이 단순한 도형(직선, 원, 사인) 위주로 목표 경로를 잡는다 — 그중 가장 쉬운 **직선**을 기준으로 설명한다.

직선은 시작점과 끝점만 알면 그 사이는 자동으로 정해지므로, [7-1](../trajectory-generation-and-cubic-polynomial-path/main.md)의 3차/5차 다항식·LSPB를 **관절 각 θ 대신 손끝 좌표 X, Y, Z, 그리고 방위** 각각에 그대로 적용하면 된다.

$$X(t),\\ Y(t),\\ Z(t),\\ \\text{방위}(t) \\quad \\leftarrow\\ \\text{3차/5차 다항식 또는 LSPB로 보간}$$

**이해**: X, Y, Z는 눈에 바로 보이는 값이라 시작·끝만 알면 끝이지만, **방위(회전)는 항상 골칫거리**였다 — [3D 회전 표현법 총정리](../orientation-representations/main.md)에서 배운 RPY·오일러 각의 표현 난이도 문제가 여기서도 그대로 반복된다.

**결과적으로 뭘 계산해야 하는가**: 목표 손끝 좌표가 시간에 따라 정해지면, 그 순간마다 로봇을 움직이려면 결국 **관절을 제어**해야 한다(모터는 관절에 달려 있으므로). 따라서 매 시점마다

$$X(t), Y(t), Z(t), \\text{방위}(t) \\ \\xrightarrow{\\text{역기구학}}\\ \\theta(t)$$

**역기구학을 반복해서 풀어야 한다.** 손끝은 정확한 경로로 움직이지만, 그 대가가 바로 이 반복 역기구학이며 작업 공간법의 근본적인 계산 비용이다.

**실전 취급**: 매 시점 실시간으로 풀거나, 전체 경로를 미리 다 풀어 룩업테이블로 저장해 두거나 둘 중 하나를 선택해야 한다. 후자는 저장 공간이 필요하고, 갱신 주기(1초·0.1초·0.01초 단위)가 촘촘할수록 계산량도 늘어난다.

## 3. 방위(orientation) 표현 — RPY 대신 축·각으로

방위를 RPY(roll·pitch·yaw)로 표현할 수도 있지만, 강의에서는 더 간단한 대안을 제안한다: **원점을 지나는 직선(축)과 그 축을 기준으로 회전하는 각도**로 표현하는 방법이다. [2-3](../orientation-representations/main.md)에서 다룬 등가 각-축(equivalent axis-angle) 표현과 같은 개념이다.

3차원 공간의 직선(축)은 원점을 지난다고 하면 $K_x, K_y, K_z$ 3개 변수로 표현되지만, 이 중 **2개만 알면 나머지 하나는 저절로 정해진다**(단위벡터 조건 때문에). 여기에 회전 각도 하나를 더해 **(A, B, θ)** 세 개 값으로 방위를 완전히 표현한다.

**왜 3개인가**: 3차원 공간에서 방위(orientation)를 표현하는 자유도는 항상 3이다 — RPY도 3개, ZYZ 오일러도 3개, 쿼터니언은 4개처럼 보이지만 크기 1 제약이 있어 사실상 자유도는 3개다.

**결국 손끝 상태 벡터는 6개 값**이다:

$$\\chi = [X,\\ Y,\\ Z,\\ A,\\ B,\\ \\theta]^T$$

**실전 취급**: 손끝 위치 XYZ는 직접 보간하고, 방위는 축-각 (A, B, θ)로 잡아 총 6개 값 각각에 다항식/LSPB 보간을 적용하면 작업 공간 궤적이 완성된다.

## 4. 장단점 비교 — 관절 공간 vs 작업 공간

| 구분 | 관절 공간(Joint Space) | 작업 공간(Task/Cartesian Space) |
|---|---|---|
| 보간 변수 | 관절각 θ (6개) | 손끝 좌표 X,Y,Z + 방위 A,B,θ (6개) |
| 손끝 경로 보장 | ✗ (양 끝점만 보장, 중간은 임의) | ✓ (경로 자체가 변수) |
| 역기구학 | 시작·끝점에서 딱 한 번 | 매 갱신 시점마다 반복 |
| 계산 비용 | 낮음 | 높음(반복 역기구학) 또는 사전 계산·저장 필요 |
| 적합한 작업 | 픽앤플레이스처럼 경로가 안 중요한 작업 | 용접·글씨쓰기처럼 경로 자체가 중요한 작업 |
| 도달 불가/특이점 문제 | 거의 없음(5절) | 자주 발생 |

## 5. 작업 공간에서만 생기는 함정 — 도달 불가 공간과 특이점

관절 공간법은 처음부터 **관절이 실제로 낼 수 있는 각도**를 기준으로 스플라인을 만들기 때문에, 이런 문제가 거의 발생하지 않는다. 반면 작업 공간법은 손끝 좌표 A와 B를 각각 "갈 수 있는 점"으로 확인했더라도, **그 사이를 잇는 직선이 실제로 로봇이 갈 수 있는 경로라는 보장이 없다.**

**도달 불가 공간(unreachable workspace)**: 로봇의 작업 공간은 도넛 모양처럼 안쪽에 구멍이 뚫려 있을 수 있다. A점도 갈 수 있고 B점도 갈 수 있지만, 그 사이 직선이 이 안쪽 구멍을 지나간다면 로봇은 도달할 수 없다 — 팔을 아무리 뻗어도 물리적으로 닿지 않는 영역이기 때문이다.

**관절 한계**: 궤적을 생성할 때 관절이 이론상 0°~360° 회전 가능하다고 가정하고 계산했더라도, 실제 로봇 관절(특히 팔꿈치 같은 관절)은 그렇게 넓게 돌지 못한다. 관절 공간에서는 이 문제가 세타 값의 범위만 관절 스펙과 비교하면 바로 드러나 눈에 띄기 쉽지만, 작업 공간에서는 궤적을 다 만들고 나서야 뒤늦게 발견되기 쉽다.

**특이점(singularity)**: [자코비안](../jacobian-singularity-and-static-forces/main.md)의 행렬식이 0이 되는 지점 근처에서는, 손끝을 아주 조금만 움직여도 특정 관절이 순간적으로 엄청난 각속도·각가속도를 내야 한다. A에서 B로 직선으로 가는 경로가 우연히 특이점 근처를 지난다면, 모터가 실제로 낼 수 없는 가속도가 요구되는 엉터리 궤적이 나와버린다.

**실전 취급**: 작업 공간 궤적을 설계할 때는 반드시 (1) 경로 전체가 도달 가능 작업 공간 안에 있는지, (2) 관절 한계를 벗어나지 않는지, (3) 자코비안 특이점 근처를 지나지 않는지 세 가지를 검사해야 한다. 이 검사가 없으면 계산상으로는 매끄러워 보이는 경로가 실제 로봇에서는 실행 불가능할 수 있다.

## 6. 동역학 기반 경로 제약과 장애물 회피

**토크 한계**: 궤적 계산 결과 특정 순간 관절에 요구되는 토크가 모터 최대 토크를 넘을 수 있다(예: 계산상 20 N·m 필요한데 모터는 5 N·m가 한계). 위치·속도는 매끄럽게 이어져도 **가속도가 급변**하는 구간에서 이런 토크 급증이 자주 발생한다 — 토크는 가속도에 비례하기 때문이다.

해결책은 궤적 생성 단계에서부터 관절이 실제로 낼 수 있는 최대 토크·가속도 스펙 이하로 목표 가속도를 낮춰 잡는 것이다 — [동역학](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)으로 미리 필요 토크를 계산해서 검증하는 셈이다.

**장애물 회피 — 포텐셜 필드(potential field)**: 갑자기 장애물이 나타나면 궤적을 그때그때 바꿔야 한다. 대표적인 방법이 포텐셜 필드로, 장애물과 로봇을 같은 극(자석의 N극)으로, 목표점을 반대 극(S극)으로 놓는다고 생각하면 된다.

- 로봇(N)은 목표점(S)에게 끌려간다.
- 로봇이 장애물(같은 N극)에 가까워지면 밀리는 힘이 생긴다.
- 두 힘을 벡터로 합성하면 로봇이 장애물을 자연스럽게 피해 가는 경로가 나온다.

목욕탕 바닥에 물을 부으면 하수구 쪽으로 흘러가지만 슬리퍼가 놓여 있으면 물이 슬리퍼를 피해 돌아가는 것과 같은 원리다 — 물길 = 손끝이 움직이는 경로, 하수구 = 목표점(인력), 슬리퍼 = 장애물이 밀어내는 힘(척력).

**실전 취급**: 포텐셜 필드는 개념만 알아두면 되는 수준(강의에서 세부 수식은 다루지 않음). 실제 ROS2 환경에서는 MoveIt의 충돌 회피(collision-aware planning)나 별도 로컬 플래너(예: DWA, TEB)가 유사한 인력·척력 아이디어를 더 정교하게 구현한다.

## 7. 표현법 비교표

| 기호/용어 | 의미 | 비고 |
|---|---|---|
| $\\theta(t)$ | 관절 공간 궤적 변수 | 7-1·7-2의 3차/5차 다항식·LSPB 그대로 사용 |
| $X(t),Y(t),Z(t)$ | 작업 공간에서 손끝 위치 궤적 | 직관적, 시작·끝만 알면 보간 쉬움 |
| $A, B, \\theta$ | 방위를 (축, 각도)로 표현 | 원점을 지나는 축은 2개 변수 + 회전각 1개 = 3자유도 |
| $\\chi$ (카이) | 손끝 상태 6벡터 $[X,Y,Z,A,B,\\theta]^T$ | X와 혼동하지 않도록 그리스 문자로 표기 |
| 도달 불가 공간 | 작업 공간 안의 도달 불가능한 빈 영역 | 작업 공간 궤적에서만 문제가 됨 |
| 특이점 | $\\det(J(\\Theta))=0$ 인 지점 | 5-3 참고, 근처에서 관절 속도 급증 |
| 포텐셜 필드 | 장애물=척력, 목표점=인력으로 모델링한 장애물 회피 기법 | 세부 수식은 이 강의 범위 밖 |

## 8. Python 실습 코드

\`\`\`python
import numpy as np

def cartesian_linear_trajectory(p0, p1, tf, dt):
    """직선 작업 공간 궤적: p0 -> p1 (XYZ 3벡터)를 tf초에 걸쳐 등속으로 잇는다."""
    p0, p1 = np.asarray(p0, dtype=float), np.asarray(p1, dtype=float)
    ts = np.arange(0, tf + dt, dt)
    return ts, np.array([p0 + (p1 - p0) * (t / tf) for t in ts])


def check_workspace(points, r_min, r_max):
    """도달 불가 공간(안쪽 구멍) 검사: 원점 기준 반경이 [r_min, r_max] 밖이면 도달 불가로 표시."""
    radii = np.linalg.norm(points, axis=1)
    return (radii >= r_min) & (radii <= r_max)


def check_singularity(jacobian_fn, thetas, tol=1e-3):
    """자코비안 det가 tol 이하로 작아지는(특이점 근접) 구간을 찾는다."""
    dets = [abs(np.linalg.det(jacobian_fn(th))) for th in thetas]
    return np.array(dets) < tol


if __name__ == "__main__":
    ts, path = cartesian_linear_trajectory([0.3, 0.0, 0.2], [0.1, 0.3, 0.4], tf=2.0, dt=0.5)
    for t, p in zip(ts, path):
        print(f"t={t:.1f}s -> XYZ={p}")

    reachable = check_workspace(path, r_min=0.15, r_max=0.6)
    print("도달 가능 여부:", reachable)
\`\`\`

**연습문제(TODO)**:

\`\`\`python
# TODO 1: 방위(축-각) 보간
#   시작 축-각 (A0, B0, theta0)과 끝 축-각 (A1, B1, theta1)이 주어졌을 때,
#   scipy.spatial.transform.Rotation과 Slerp를 이용해 방위를 부드럽게 보간하는
#   함수 interpolate_orientation(A0,B0,th0, A1,B1,th1, tf, dt)를 작성하라.
#   힌트: 축-각은 Rotation.from_rotvec(axis * angle)로 변환 가능.

# TODO 2: 특이점 회피 경로 검사
#   2-링크 평면 로봇의 자코비안 함수를 만들고(2-링크 예제, 자코비안 정의 (Jacobian Velocity Kinematics) 참고),
#   check_singularity로 직선 궤적 위 각 점의 관절각(역기구학으로 계산)이
#   특이점 근처를 지나는지 확인하라.

# TODO 3: 포텐셜 필드 간단 구현
#   목표점(인력)과 장애물 1개(척력)가 주어졌을 때,
#   현재 위치에서의 합력 벡터를 계산하는 potential_field_force(pos, goal, obstacle, k_att, k_rep)를
#   작성하고, 이 힘을 따라 한 스텝씩 이동시키며 목표점까지의 경로를 시뮬레이션하라.
\`\`\`

**실전 연결**:
- 작업 공간 직선 궤적 + 반복 역기구학은 ROS2 MoveIt의 \`computeCartesianPath()\`가 그대로 구현해 제공한다 — waypoint 사이를 일정 간격(\`eef_step\`)으로 나눠 매 지점 IK를 반복해서 푼다.
- 도달 불가/특이점 검사는 MoveIt의 planning scene 충돌 검사, \`moveit_msgs/GetCartesianPath\`의 \`fraction\`(경로 중 실제로 성공한 비율)으로 실전에서 확인할 수 있다.
- 포텐셜 필드류 장애물 회피는 \`costmap_2d\`, DWA/TEB 로컬 플래너 등 Nav2 계열에서 더 정교한 형태로 쓰인다.

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 관절 공간법의 한계 | 시작·끝(경유점) 관절각만 보장 — 손끝이 그 사이 어떤 경로로 가는지는 보장 안 함 |
| 작업 공간 궤적 생성 | X,Y,Z + 방위(A,B,θ) 총 6개 값에 3차/5차 다항식·LSPB를 그대로 적용, 매 시점 역기구학으로 θ(t) 역산 |
| 방위 표현 | RPY 대신 원점 지나는 축(2변수)+회전각(1변수) = 3자유도로 더 간단하게 표현 |
| 장단점 | 작업 공간: 손끝 경로 정확 보장, 대신 반복 역기구학으로 계산 비용 큼 |
| 작업 공간 전용 함정 | 도달 불가 공간(도넛 구멍), 관절 한계 초과, 특이점 근처 통과 — 관절 공간에서는 거의 안 생김 |
| 동역학 제약 | 가속도 급변 구간에서 필요 토크가 모터 최대 토크를 넘을 수 있음 → 목표 가속도를 스펙 이하로 낮춰 설계 |
| 장애물 회피 | 포텐셜 필드: 장애물=척력, 목표점=인력으로 모델링, 벡터 합성으로 회피 경로 생성 |
`,

  'Robotics/closed-form-dynamics-example-and-mass-coriolis-gravity-structure': `---
title: 폐형식 동역학 방정식 예제와 M-V-G 구조 (Closed-Form Dynamics Example & Mass-Coriolis-Gravity Structure)
date: 2026-08-08
tags: newton-euler, torque-control
order: 
featured: false
draft: false
---

# 폐형식 동역학 방정식 예제와 M-V-G 구조 (Closed-Form Dynamics Example & Mass-Coriolis-Gravity Structure)

> 출처: 로봇제어공학 — Introduction to Robotics 6장 "머니퓰레이터 동역학(dynamics) II"
> 영상: https://www.youtube.com/watch?v=PaFjc7u9elk&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=17
> 대상: [6-2에서 세운 반복 뉴턴-오일러 알고리즘](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)을 실제 2-링크 평면 매니퓰레이터에 대입해 손으로 끝까지 풀어보고, 그 결과를 $\\tau=M(\\theta)\\ddot\\theta+V(\\theta,\\dot\\theta)+G(\\theta)$라는 표준 형태로 정리하는 노트.

---

## 1. 왜 손으로 한 번은 풀어봐야 하는가

[6-2](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에서 세운 반복식은 기호($i, i+1, C_i$…)로만 존재했다. 기호 자체는 깔끔하지만, 실제로 숫자·구체적 벡터를 대입해 끝까지 풀어보지 않으면 "어디서 뭐가 사라지고 뭐가 남는지" 감이 오지 않는다.

그래서 이 노트는 교재에서 가장 단순한 예제 — 평면 2-링크 매니퓰레이터 — 를 골라 [1단계 외향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)과 [2단계 내향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)을 실제로 끝까지 대입한다.

---

## 2. 문제 설정 — 2-링크 평면 매니퓰레이터와 단순화 가정

교재 Figure 6.6은 두 링크가 모두 평면(같은 평면) 위에서 회전하는 로봇이다. 관절축은 둘 다 $\\hat Z_0$ 방향(지면과 수직, 그림 밖으로 나오는 방향)이고, $\\theta_1$은 지면(\${}^0\\hat X_0$)에서 링크 1까지의 각도, $\\theta_2$는 링크 1의 연장선(그림의 점선)에서 링크 2까지의 상대 각도다.

문제를 손으로 풀 수 있게 하려고 세 가지를 가정한다.

| 가정 | 식으로 표현 | 왜 필요한가 |
|---|---|---|
| **질량이 링크 끝(원단)에 점질량으로 몰려 있다** | \${}^1P_{C_1}=l_1\\hat X_1$, \${}^2P_{C_2}=l_2\\hat X_2$ | 실제로는 무게중심이 링크 중간 어딘가에 분포하지만, 그러면 무게중심 위치 계산이 훨씬 복잡해진다. 끝에 몰아두면 "무게중심까지의 거리 = 링크 길이"로 바로 쓸 수 있다. |
| **점질량이므로 관성 텐서가 0** | \${}^{C_1}I_1=0$, \${}^{C_2}I_2=0$ | 관성 텐서는 물체가 "퍼져 있는 정도"에서 나오는데, 점질량은 퍼짐이 없으므로 회전 관성 자체가 없다. |
| **손끝에 걸리는 외력·외토크가 없고, 베이스는 고정** | $f_3=0,\\ n_3=0,\\ \\omega_0=0,\\ \\dot\\omega_0=0$ | 순수하게 로봇 자신의 관성·중력만으로 필요한 토크를 구하는 문제로 단순화한다. |

여기에 [6-2의 중력 트릭](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)을 그대로 적용해 베이스 초기 가속도를 중력가속도로 둔다.

$\${}^0\\dot v_0 = g\\hat Y_0$$

**꼭 기억**: 이 세 가정(점질량 → 텐서 0, 손끝 힘 없음, 베이스 고정+중력 트릭) 덕분에 [6-2의 6개 재귀식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에서 살아남는 항이 크게 줄어든다. 실제 로봇에서는 이 가정 중 어느 것도 성립하지 않는다는 점도 함께 기억할 것.

---

## 3. 1단계 외향 반복 — 링크 1 계산

[6-2의 외향 반복식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에 $i=0$을 대입한다. 미리 로테이션 행렬을 써 두면 편하다.

$\${}^0_1R=\\begin{bmatrix}c_1&-s_1&0\\\\s_1&c_1&0\\\\0&0&1\\end{bmatrix}$$

**각속도·각가속도** — \${}^0\\omega_0=0,\\ {}^0\\dot\\omega_0=0$이므로 회전행렬이 곱해지는 항은 전부 사라지고, 관절 자체의 회전 기여분만 남는다.

$\${}^1\\omega_1=\\begin{bmatrix}0\\\\0\\\\\\dot\\theta_1\\end{bmatrix},\\qquad {}^1\\dot\\omega_1=\\begin{bmatrix}0\\\\0\\\\\\ddot\\theta_1\\end{bmatrix}$$

**관절 원점 선가속도** — $0$번과 $1$번 관절이 붙어 있어 \${}^0P_1=0$이므로, [재귀식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)의 앞 두 항이 자동으로 0이 되고 회전만 남는다.

$\${}^1\\dot v_1={}^1_0R\\,{}^0\\dot v_0={}^1_0R\\begin{bmatrix}0\\\\g\\\\0\\end{bmatrix}=\\begin{bmatrix}gs_1\\\\gc_1\\\\0\\end{bmatrix}$$

**무게중심 선가속도** — \${}^1P_{C_1}=[l_1,0,0]^T$를 대입해 외적을 두 번 전개한다.

$\${}^1\\dot\\omega_1\\times{}^1P_{C_1}=\\begin{bmatrix}0\\\\l_1\\ddot\\theta_1\\\\0\\end{bmatrix},\\qquad {}^1\\omega_1\\times\\left({}^1\\omega_1\\times{}^1P_{C_1}\\right)=\\begin{bmatrix}-l_1\\dot\\theta_1^2\\\\0\\\\0\\end{bmatrix}$$

세 항(위 둘 + \${}^1\\dot v_1$)을 더하면:

$$\\boxed{{}^1\\dot v_{C_1}=\\begin{bmatrix}gs_1-l_1\\dot\\theta_1^2\\\\ l_1\\ddot\\theta_1+gc_1\\\\0\\end{bmatrix}}$$

**힘·토크** — [6절의 $F=m\\dot v_C$, $N={}^CI\\dot\\omega+\\omega\\times{}^CI\\omega$](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)를 그대로 대입한다.

$\${}^1F_1=m_1\\begin{bmatrix}gs_1-l_1\\dot\\theta_1^2\\\\ l_1\\ddot\\theta_1+gc_1\\\\0\\end{bmatrix},\\qquad {}^1N_1=0$$

$N_1$이 통째로 0인 이유는 단 하나 — [2절의 점질량 가정](#2-문제-설정--2-링크-평면-매니퓰레이터와-단순화-가정) 때문에 \${}^{C_1}I_1=0$이라서, $\\dot\\omega$·$\\omega\\times{}^CI\\omega$ 두 항이 애초에 0을 곱하고 있기 때문이다. 실제 링크(퍼진 질량)라면 이 항이 절대 0이 될 수 없다.

**기억할 필요 없음**: 위 대수 전개 자체 — 회전행렬을 미리 구해두고 순서대로 대입하면 기계적으로 나온다는 흐름만 기억하면 된다.

---

## 4. 링크 2도 같은 절차 — 이해 vs 암기

링크 2는 $i=1$을 대입해 똑같은 6개 식($\\omega_2,\\dot\\omega_2,\\dot v_2,\\dot v_{C_2},F_2,N_2$)을 반복 계산한다.

**이해**: 링크 1과 링크 2의 계산 절차는 완전히 동일하다 — $i$만 하나씩 밀려서 대입될 뿐, 새로운 개념이 등장하지 않는다. **기억할 필요 없음**: 링크 2의 전개 과정 전체. 대신 [다음 절](#5-2단계-내향-반복--손끝에서-거꾸로)에서 이 결과를 바로 가져다 쓴다.

---

## 5. 2단계 내향 반복 — 손끝에서 거꾸로

[6-2의 내향 반복식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에 [2절의 가정](#2-문제-설정--2-링크-평면-매니퓰레이터와-단순화-가정)($f_3=n_3=0$)을 대입해 손끝(링크 2)부터 거슬러 올라간다.

**링크 2** — 다음 링크가 없으므로(손끝이 마지막) 전달받는 힘·토크가 0이고, 자기 자신의 관성력·관성토크만 남는다.

$\${}^2f_2={}^2F_2,\\qquad {}^2n_2=\\begin{bmatrix}0\\\\0\\\\m_2l_1l_2c_2\\ddot\\theta_1+m_2l_1l_2s_2\\dot\\theta_1^2+m_2l_2gc_{12}+m_2l_2^2(\\ddot\\theta_1+\\ddot\\theta_2)\\end{bmatrix}$$

**링크 1** — 링크 2가 전달하는 힘·토크(회전행렬로 좌표계만 맞춘 것)에 링크 1 자체의 관성력·관성토크, 그리고 힘이 무게중심·관절에서 떨어진 지점에 작용해서 생기는 모멘트 항들이 더해진다.

$\${}^1f_1=\\begin{bmatrix}c_2&-s_2&0\\\\s_2&c_2&0\\\\0&0&1\\end{bmatrix}\\begin{bmatrix}m_2l_1s_2\\ddot\\theta_1-m_2l_1c_2\\dot\\theta_1^2+m_2gs_{12}-m_2l_2(\\dot\\theta_1+\\dot\\theta_2)^2\\\\ m_2l_1c_2\\ddot\\theta_1+m_2l_1s_2\\dot\\theta_1^2+m_2gc_{12}+m_2l_2(\\ddot\\theta_1+\\ddot\\theta_2)\\\\0\\end{bmatrix}+\\begin{bmatrix}-m_1l_1\\dot\\theta_1^2+m_1gs_1\\\\ m_1l_1\\ddot\\theta_1+m_1gc_1\\\\0\\end{bmatrix}$$

$\${}^1n_1=\\begin{bmatrix}0\\\\0\\\\m_2l_1l_2c_2\\ddot\\theta_1+m_2l_1l_2s_2\\dot\\theta_1^2+m_2l_2gc_{12}+m_2l_2^2(\\ddot\\theta_1+\\ddot\\theta_2)\\end{bmatrix}+\\begin{bmatrix}0\\\\0\\\\m_1l_1^2\\ddot\\theta_1+m_1l_1gc_1\\end{bmatrix}+\\begin{bmatrix}0\\\\0\\\\m_2l_1^2\\ddot\\theta_1-m_2l_1l_2s_2(\\dot\\theta_1+\\dot\\theta_2)^2+m_2l_1gs_2s_{12}+m_2l_1l_2c_2(\\ddot\\theta_1+\\ddot\\theta_2)+m_2l_1gc_2c_{12}\\end{bmatrix}$$

각 식이 뜻하는 바는 [6-2 8절](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에서 이미 정리했다 — \${}^1f_1$은 "다음 링크가 미는 힘 + 자체 관성력", \${}^1n_1$은 "자체 관성 토크 + 다음 링크가 전달하는 토크 + 힘 때문에 생기는 모멘트 두 개"라는 구조 그대로다. 여기서는 그 구조에 숫자를 채워 넣은 것뿐이다.

**기억할 필요 없음**: 위 식들의 성분 하나하나. **꼭 기억**: \${}^1n_1$의 세 덩어리가 각각 "링크 2에서 넘어온 토크", "링크 1 자체 관성토크", "힘 때문에 생기는 모멘트"라는 것 — 이 구조는 관절이 몇 개든 항상 똑같다.

---

## 6. 관절 토크 추출 — 최종 폐형식 결과

[6-2에서 정한 규칙](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)대로, 회전 관절의 토크는 토크 벡터의 $z$ 성분이다 ($\\tau_i={}^in_i^T\\,{}^i\\hat Z_i$). [5절](#5-2단계-내향-반복--손끝에서-거꾸로)의 \${}^2n_2$, \${}^1n_1$은 애초에 $z$ 성분만 값이 있으므로 그 값을 그대로 읽으면 된다.

$$\\boxed{\\tau_1=m_2l_2^2(\\ddot\\theta_1+\\ddot\\theta_2)+m_2l_1l_2c_2(2\\ddot\\theta_1+\\ddot\\theta_2)+(m_1+m_2)l_1^2\\ddot\\theta_1-m_2l_1l_2s_2\\dot\\theta_2^2-2m_2l_1l_2s_2\\dot\\theta_1\\dot\\theta_2+m_2l_2gc_{12}+(m_1+m_2)l_1gc_1}$$

$$\\boxed{\\tau_2=m_2l_1l_2c_2\\ddot\\theta_1+m_2l_1l_2s_2\\dot\\theta_1^2+m_2l_2gc_{12}+m_2l_2^2(\\ddot\\theta_1+\\ddot\\theta_2)}$$

$\\tau_2$는 [5절](#5-2단계-내향-반복--손끝에서-거꾸로)의 \${}^2n_2$ z성분을 그대로 옮긴 것뿐이고, $\\tau_1$은 \${}^1n_1$ 세 덩어리의 $z$ 성분(\${}^1l_1l_2$ 항 + $m_1l_1^2\\ddot\\theta_1+m_1l_1gc_1$ + 마지막 덩어리)을 모두 더한 결과다. 이 $\\tau_1,\\tau_2$대로 각 관절에 토크를 가하면 손끝에 원하는 힘이 제어된다.

**이해**: 두 식 모두 $\\ddot\\theta_1,\\ddot\\theta_2$(가속도) · $\\dot\\theta_1^2,\\dot\\theta_1\\dot\\theta_2,\\dot\\theta_2^2$(속도 제곱·곱) · $c_1,c_{12}$(중력, 각도) 세 종류의 항으로만 이루어져 있다 — 이 패턴이 [다음 절](#7-동역학-방정식의-구조--τ--mθθ̈--vθθ̇--gθ)의 $M,V,G$ 분리로 바로 이어진다.

---

## 7. 동역학 방정식의 구조 — τ = M(θ)θ̈ + V(θ,θ̇) + G(θ)

관절이 몇 개든 매번 [6절](#6-관절-토크-추출--최종-폐형식-결과) 같은 긴 식을 그대로 쓰는 건 비효율적이다. [5장에서 속도들을 자코비안 행렬 하나로 묶었던 것](../jacobian-velocity-kinematics-link-propagation/main.md)과 똑같은 방식으로, $\\tau_1,\\tau_2$ 식의 각 항을 **무엇에 곱해져 있는가**(가속도 / 속도 제곱·곱 / 각도)를 기준으로 재배열한다.

$$\\boxed{\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)}$$

**1단계 — 가속도 항($\\ddot\\theta_1,\\ddot\\theta_2$) 계수를 모아 $M$을 만든다.** [6절](#6-관절-토크-추출--최종-폐형식-결과) 식에서 $\\ddot\\theta_1$ 앞에 붙은 계수들과 $\\ddot\\theta_2$ 앞에 붙은 계수들을 각각 걷어내 $2\\times2$ 행렬로 쓴다.

$$M(\\Theta)=\\begin{bmatrix}l_2^2m_2+2l_1l_2m_2c_2+l_1^2(m_1+m_2) & l_2^2m_2+l_1l_2m_2c_2\\\\ l_2^2m_2+l_1l_2m_2c_2 & l_2^2m_2\\end{bmatrix}$$

**2단계 — 속도 제곱·곱 항을 모아 $V$를 만든다.** $\\dot\\theta_1^2,\\dot\\theta_1\\dot\\theta_2,\\dot\\theta_2^2$가 곱해진 항만 골라낸다.

$$V(\\Theta,\\dot\\Theta)=\\begin{bmatrix}-m_2l_1l_2s_2\\dot\\theta_2^2-2m_2l_1l_2s_2\\dot\\theta_1\\dot\\theta_2\\\\ m_2l_1l_2s_2\\dot\\theta_1^2\\end{bmatrix}$$

**3단계 — 중력가속도 $g$가 들어간 항을 모아 $G$를 만든다.**

$$G(\\Theta)=\\begin{bmatrix}m_2l_2gc_{12}+(m_1+m_2)l_1gc_1\\\\ m_2l_2gc_{12}\\end{bmatrix}$$

세 행렬을 다시 곱하고 더하면 [6절의 $\\tau_1,\\tau_2$](#6-관절-토크-추출--최종-폐형식-결과)가 정확히 재현된다 — $M,V,G$는 새로운 계산이 아니라 **같은 답을 재포장한 것**이다.

**기억할 필요 없음**: $M,V,G$ 각 성분을 손으로 뽑아내는 계수 정리 과정. **꼭 기억**: $\\tau=M\\ddot\\Theta+V+G$라는 형태 자체와, $M$ = 가속도 계수(질량행렬) / $V$ = 속도 제곱·곱 계수(원심력·코리올리) / $G$ = 중력 계수라는 대응 관계.

---

## 8. M, V, G의 물리적 의미

| 행렬 | 이름 | 물리적 의미 |
|---|---|---|
| $M(\\Theta)$ | 질량 행렬(mass matrix) | $n\\times n$, 대칭(symmetric)이고 양의 정치(positive definite) — 그래서 역행렬이 항상 존재한다 |
| $V(\\Theta,\\dot\\Theta)$ | 원심력·코리올리 항 | $n\\times1$, 관절 속도의 영향을 받는 모든 항을 포함 |
| $G(\\Theta)$ | 중력 항 | $n\\times1$, 중력상수 $g$가 포함된 항만 모음 |

$V$ 안에서도 두 종류가 구분된다 — **관절 속도의 제곱**($\\dot\\theta_1^2,\\dot\\theta_2^2$)에 비례하는 항은 원심력(centrifugal force), **서로 다른 두 관절 속도의 곱**($\\dot\\theta_1\\dot\\theta_2$)에 비례하는 항은 코리올리 힘(Coriolis force)이다. [위 $V$ 행렬](#7-동역학-방정식의-구조--τ--mθθ̈--vθθ̇--gθ)의 $-m_2l_1l_2s_2\\dot\\theta_2^2$와 $m_2l_1l_2s_2\\dot\\theta_1^2$는 원심력, $-2m_2l_1l_2s_2\\dot\\theta_1\\dot\\theta_2$는 코리올리 항이다.

코리올리 힘의 물리적 직관은 회전판(LP판) 비유로 설명된다 — 회전하는 판 위에서 판 중심 방향으로 공을 던지면, 판 밖에서 보기엔 직선이어야 할 궤적이 휘어져 보인다. 판(회전 좌표계) 자체가 움직이면서 공의 운동에 간섭하기 때문이다.

**이해**: 로봇 팔에서 코리올리 항이 나오는 이유도 근본적으로 같다 — 링크 2가 링크 1이라는 "회전하는 좌표계" 위에서 또 회전하기 때문에, 두 회전이 상호작용해 $\\dot\\theta_1\\dot\\theta_2$ 형태의 항이 생긴다. **기억할 필요 없음**: 코리올리 항의 물리적 유도 과정 자체 — 완전히 직관적으로 이해하기 어려운 부분이다.

---

## 9. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| \${}^1P_{C_1}=l_1\\hat X_1$, \${}^2P_{C_2}=l_2\\hat X_2$ | 점질량 가정 하의 무게중심 위치 | 링크 원단(끝)에 질량이 몰려 있다고 가정 |
| \${}^{C_1}I_1=0$, \${}^{C_2}I_2=0$ | 점질량의 관성 텐서 | 퍼진 질량이 없으므로 회전 관성도 없음 |
| $f_3=0,\\ n_3=0$ | 손끝 외력·외토크 없음 | 로봇 자신의 관성·중력만으로 토크 계산 |
| \${}^1\\dot v_{C_1}=[gs_1-l_1\\dot\\theta_1^2,\\ l_1\\ddot\\theta_1+gc_1,\\ 0]^T$ | 링크 1 무게중심 가속도 | 3절 최종 결과 |
| \${}^1f_1,\\ {}^1n_1$ | 링크 1이 받는 힘·토크 | 내향 반복으로 손끝에서 거슬러 계산 |
| $\\tau_1,\\tau_2$ | 두 관절의 최종 토크 | 6절의 폐형식 |
| $\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$ | 상태공간 방정식(state space equation) | $M$: 질량행렬, $V$: 원심력·코리올리, $G$: 중력 |
| $M(\\Theta)$ | 질량 행렬 | $n\\times n$, 대칭·양의 정치 → 역행렬 항상 존재 |
| $\\dot\\theta_i^2$ 항 / $\\dot\\theta_i\\dot\\theta_j$($i\\ne j$) 항 | 원심력 / 코리올리 | $V(\\Theta,\\dot\\Theta)$ 안에서의 구분 기준 |

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 예제 설정 | 2-링크 평면 매니퓰레이터, 질량이 각 링크 원단에 점질량으로 집중 → \${}^CI=0$, 손끝 외력 없음, 베이스 고정+중력 트릭 |
| 1단계 외향 반복 결과 | \${}^1\\dot v_{C_1}=[gs_1-l_1\\dot\\theta_1^2,\\ l_1\\ddot\\theta_1+gc_1,\\ 0]^T$, $N_1=0$(점질량이라 관성 텐서가 0이라서) |
| 2단계 내향 반복 결과 | \${}^2n_2$(링크 2 자체 관성토크만) → \${}^1n_1$(링크 2 전달분 + 링크 1 자체분 + 모멘트 항) |
| 최종 폐형식 | $\\tau_1,\\tau_2$ — 가속도항·속도제곱곱항·중력항 세 종류로만 구성 |
| 동역학 방정식의 구조 | $\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$ — 반복 뉴턴-오일러로 구한 답을 계수별로 재포장한 것 |
| $M(\\Theta)$ | 질량 행렬, $n\\times n$, 대칭·양의 정치 → 역행렬 항상 존재 |
| $V(\\Theta,\\dot\\Theta)$ | $\\dot\\theta_i^2$항=원심력, $\\dot\\theta_i\\dot\\theta_j$($i\\ne j$)항=코리올리 |
| $G(\\Theta)$ | 중력상수 $g$가 포함된 항만 모음 |
| 이해 vs 암기 | 손 계산 과정 전체는 "외울 필요 없음" — $M,V,G$의 구조적 의미와 원심력·코리올리 구분 기준만 기억하면 됨 |
`,

  'Robotics/configuration-space-b-c-split-lagrangian-and-task-space-dynamics': `---
title: 자세공간 B·C 분리, 라그랑주 동역학과 작업공간 동역학 (Configuration-Space B-C Split, Lagrangian & Task-Space Dynamics)
date: 2026-08-08
tags: lagrangian, task-space
order: 
featured: false
draft: false
---

# 자세공간 B·C 분리, 라그랑주 동역학과 작업공간 동역학 (Configuration-Space B-C Split, Lagrangian & Task-Space Dynamics)

> 출처: 로봇제어공학 — Introduction to Robotics 6장 "머니퓰레이터 동역학(dynamics) III"
> 영상: https://www.youtube.com/watch?v=1bmS4wPRac0&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=18
> 대상: [6-3에서 정리한](../closed-form-dynamics-example-and-mass-coriolis-gravity-structure/main.md) $\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$ 구조를 출발점으로, $V$를 원심력·코리올리로 더 쪼개고(B·C 분리), 반복식이 아닌 에너지 기반의 라그랑주 방법으로 같은 답을 구하고, 마지막으로 관절공간 동역학을 손끝의 작업공간(task space) 동역학으로 옮기는 노트.

---

## 1. 자세공간 방정식 — V를 B·C로 더 쪼개기

[6-3에서 얻은](../closed-form-dynamics-example-and-mass-coriolis-gravity-structure/main.md) 2-링크 예제의 결과를 다시 가져온다.

$$\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$$

$$M(\\Theta)=\\begin{bmatrix}l_2^2m_2+2l_1l_2m_2c_2+l_1^2(m_1+m_2) & l_2^2m_2+l_1l_2m_2c_2\\\\ l_2^2m_2+l_1l_2m_2c_2 & l_2^2m_2\\end{bmatrix},\\quad V(\\Theta,\\dot\\Theta)=\\begin{bmatrix}-m_2l_1l_2s_2\\dot\\theta_2^2-2m_2l_1l_2s_2\\dot\\theta_1\\dot\\theta_2\\\\ m_2l_1l_2s_2\\dot\\theta_1^2\\end{bmatrix}$$

**예제 6.4**는 여기서 한 걸음 더 들어가, $V(\\Theta,\\dot\\Theta)$ 안에 섞여 있는 원심력 항(centrifugal, $\\dot\\theta_i^2$)과 코리올리 항(Coriolis, $\\dot\\theta_i\\dot\\theta_j,\\ i\\ne j$)을 완전히 분리한 **자세공간 방정식(configuration space equation)**을 만든다.

$$\\boxed{\\tau=M(\\Theta)\\ddot\\Theta+B(\\Theta)[\\dot\\Theta\\dot\\Theta]+C(\\Theta)[\\dot\\Theta^2]+G(\\Theta)}$$

- $B(\\Theta)$: $n\\times n(n-1)/2$ 코리올리 계수 행렬. $[\\dot\\Theta\\dot\\Theta]=[\\dot\\theta_1\\dot\\theta_2\\ \\dot\\theta_1\\dot\\theta_3\\ \\cdots\\ \\dot\\theta_{n-1}\\dot\\theta_n]^T$는 서로 다른 관절 속도끼리의 곱만 모은 $n(n-1)/2\\times1$ 벡터다.
- $C(\\Theta)$: $n\\times n$ 원심력 계수 행렬. $[\\dot\\Theta^2]=[\\dot\\theta_1^2\\ \\dot\\theta_2^2\\ \\cdots\\ \\dot\\theta_n^2]^T$는 각 관절 속도의 제곱만 모은 $n\\times1$ 벡터다.

$n=2$인 2-링크 예제에서는 $[\\dot\\Theta\\dot\\Theta]=[\\dot\\theta_1\\dot\\theta_2]$(스칼라 1개), $[\\dot\\Theta^2]=[\\dot\\theta_1^2\\ \\dot\\theta_2^2]^T$이고, $B,C$는 $V$를 계수별로 재정렬해서 그대로 뽑아낸다.

$$B(\\Theta)=\\begin{bmatrix}-2m_2l_1l_2s_2\\\\0\\end{bmatrix},\\qquad C(\\Theta)=\\begin{bmatrix}0 & -m_2l_1l_2s_2\\\\ m_2l_1l_2s_2 & 0\\end{bmatrix}$$

**검증**: $B[\\dot\\Theta\\dot\\Theta]+C[\\dot\\Theta^2]=\\begin{bmatrix}-2m_2l_1l_2s_2\\dot\\theta_1\\dot\\theta_2\\\\0\\end{bmatrix}+\\begin{bmatrix}-m_2l_1l_2s_2\\dot\\theta_2^2\\\\ m_2l_1l_2s_2\\dot\\theta_1^2\\end{bmatrix}=\\begin{bmatrix}-m_2l_1l_2s_2\\dot\\theta_2^2-2m_2l_1l_2s_2\\dot\\theta_1\\dot\\theta_2\\\\ m_2l_1l_2s_2\\dot\\theta_1^2\\end{bmatrix}$ — 위 $V(\\Theta,\\dot\\Theta)$와 정확히 일치한다. **새 계산이 아니라 $V$를 원심력/코리올리 두 덩어리로 재포장한 것**이다.

**이해**: $B$의 각 성분이 코리올리(서로 다른 두 관절이 만나서 생기는 힘), $C$의 각 성분이 원심력(관절 하나가 자기 속도의 제곱으로 밖으로 밀어내는 힘)이라는 대응은 [6-3에서 정리한 원심력·코리올리 구분](../closed-form-dynamics-example-and-mass-coriolis-gravity-structure/main.md)과 완전히 같다.

---

## 2. 왜 이렇게 다시 쓰나 — 모든 계수가 θ만의 함수라는 것

$M,B,C,G$를 나눠 쓰는 이유는 계산량을 줄이기 위해서가 아니라 — 오히려 항을 하나 더 쪼갰으니 표현은 더 복잡해 보인다 — **네 행렬 모두가 관절 각도 $\\Theta$만의 함수**라는 구조를 드러내기 위해서다.

- $M(\\Theta)$: 예제의 $l_2^2m_2+2l_1l_2m_2c_2+l_1^2(m_1+m_2)$ 등 → 전부 $\\cos\\theta_2, \\sin\\theta_2$ 형태, 상수, 길이·질량의 함수.
- $B(\\Theta), C(\\Theta)$: $-2m_2l_1l_2s_2$ 등 → 역시 $\\theta_2$의 함수. **관절 속도($\\dot\\theta$)는 전혀 안 들어있다** — 속도 항은 전부 $[\\dot\\Theta\\dot\\Theta],[\\dot\\Theta^2]$ 벡터 쪽으로 옮겨졌다.
- $G(\\Theta)$: 중력항도 원래부터 $\\theta$만의 함수였다.

이렇게 계수 행렬이 전부 $\\Theta$만의 함수가 되는 공간을 **자세공간(configuration space)**이라 부른다 — $\\theta_1$은 $0^\\circ\\sim360^\\circ$(또는 $-180^\\circ\\sim180^\\circ$), $\\theta_2$도 같은 범위로 변할 수 있고, 그 각각의 값의 조합이 만드는 공간이라는 뜻이다.

실제로 $M,B,C,G$를 구하는 방법은 [반복식(iterative)](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)으로 구한 뒤 계수를 정리하는 방법과, 지금부터 볼 라그랑주 방법처럼 $M,B,C,G$ 각각을 처음부터 직접 구하는 방법 두 가지가 있다.

---

## 3. 라그랑주 동역학 — 반복식 대신 에너지로 풀기

뉴턴-오일러 방법이 "힘 = 질량 × 가속도"를 관절마다 순차적으로 적용했다면, 라그랑주 방법은 **에너지의 변화가 곧 외부에서 가해준 힘**이라는 원리에서 출발한다 — 고등학교 때 배운 "위치에너지가 운동에너지로 바뀐다"는 에너지 보존 문제를 힘이 개입하는 경우로 확장한 것이다.

### 운동에너지 K와 위치에너지 U

$i$번째 링크는 무게중심이 병진운동(선속도 $v_{C_i}$)과 회전운동(각속도 \${}^i\\omega_i$)을 동시에 하므로, 운동에너지는 두 종류를 더한 값이다.

$$k_i=\\frac12 m_i v_{C_i}^Tv_{C_i}+\\frac12\\,{}^i\\omega_i^T\\,{}^{C_i}I_i\\,{}^i\\omega_i$$

벡터의 제곱은 자기 자신과의 내적($v^Tv$)으로 쓰고, 회전 관성에너지는 $\\frac12I\\omega^2$의 행렬 버전이다 — 직선운동의 $\\frac12mv^2$과 회전운동의 $\\frac12I\\omega^2$을 합친 꼴이라고 보면 된다. 전체 매니퓰레이터의 운동에너지는 각 링크의 운동에너지를 모두 더한 것이다.

$$k=\\sum_{i=1}^n k_i$$

위치에너지는 $i$번째 링크의 무게중심 높이에 $m_ig$를 곱한 값이다. 기준점에서 무게중심까지의 위치벡터 \${}^0P_{C_i}$와 중력가속도 벡터 \${}^0g$의 내적으로 표현한다.

$$u_i=-m_i\\,{}^0g^T\\,{}^0P_{C_i}+u_{ref_i}$$

$u_{ref_i}$는 기준(reference) 위치에너지다. 관절이 로봇 무게중심에 있으면 위치벡터가 0이 되어 위치에너지가 0이 되는데, 실제로는 베이스가 바닥에서 떨어져 있는 등 초기값이 존재할 수 있다. 하지만 나중에 미분할 것이므로 이 상수항은 값이 무엇이든 상관없이 사라진다 — 물리적으로 넣어준 것뿐, 계산에는 의미 없는 항이다.

### 라그랑지안과 오일러-라그랑주 방정식

운동에너지와 위치에너지의 차이를 **라그랑지안(Lagrangian)** $\\mathcal L$이라 정의한다.

$$\\mathcal L=K-U$$

외부에서 에너지를 가하지 않으면 에너지는 보존되므로 위치·운동 에너지가 서로 바뀔 뿐 그 합은 일정하다. 외부에서 힘(토크)을 가하면 그 차이만큼 라그랑지안이 변한다는 것이 라그랑주가 세운 운동방정식이다.

$$\\boxed{\\frac{d}{dt}\\frac{\\partial\\mathcal L}{\\partial\\dot\\Theta}-\\frac{\\partial\\mathcal L}{\\partial\\Theta}=\\tau}$$

매니퓰레이터에서는 $K$가 $\\Theta,\\dot\\Theta$ 둘 다의 함수, $U$는 $\\Theta$만의 함수라는 점을 이용해 정리할 수 있다.

- $\\dfrac{\\partial\\mathcal L}{\\partial\\dot\\Theta}=\\dfrac{\\partial(K-U)}{\\partial\\dot\\Theta}=\\dfrac{\\partial K}{\\partial\\dot\\Theta}$ — $U$는 $\\dot\\Theta$에 대해 편미분하면 무조건 0이므로 사라진다.
- $\\dfrac{\\partial\\mathcal L}{\\partial\\Theta}=\\dfrac{\\partial K}{\\partial\\Theta}-\\dfrac{\\partial U}{\\partial\\Theta}$ — $U$도 $\\Theta$에 대해서는 남는다.

두 식을 대입하면 매니퓰레이터 운동방정식이 최종 형태로 정리된다.

$$\\frac{d}{dt}\\frac{\\partial K}{\\partial\\dot\\Theta}-\\frac{\\partial K}{\\partial\\Theta}+\\frac{\\partial U}{\\partial\\Theta}=\\tau \\tag{6.77}$$

**이해**: 여기서 $\\tau$는 $n\\times1$ 액추에이터 토크 벡터다. 이 식을 풀고 나면 [1절](#1-자세공간-방정식--v를-b·c로-더-쪼개기)에서처럼 $\\ddot\\theta$ 계수를 모아 $M$, $\\dot\\theta$ 관련 항을 모아 $V$(또는 $B,C$), $g$가 포함된 항을 모아 $G$로 정리할 수 있다 — 반복식과 답은 같고 구하는 경로만 다르다.

**기억할 필요 없음**: $k_i,u_i$ 공식 자체를 외울 필요는 없다 — 이 뒤에서 예제에 바로 쓸 것이므로 흐름만 이해하면 된다. **꼭 기억**: $\\mathcal L=K-U$, 오일러-라그랑주 방정식의 형태, 그리고 $U$가 $\\dot\\Theta$의 함수가 아니라는 사실 덕분에 식이 단순해진다는 점.

---

## 4. 예제 6.5 — RP 매니퓰레이터를 라그랑주로 풀기

### 문제 설정

첫 번째 관절은 각도 $\\theta_1$으로 회전하는 **회전(R) 관절**, 두 번째 관절은 길이 $d_2$만큼 뻗는 **직동(P, prismatic) 관절**이다. 점질량 $m_1$은 링크 1의 무게중심(관절에서 $l_1$ 떨어진 고정 위치)에, 점질량 $m_2$는 링크 2의 무게중심(관절에서 $d_2$ 떨어진, 프리스메틱 관절이 움직이면 같이 변하는 위치)에 있다. 각 링크는 무게중심 기준 관성 텐서를 갖는다.

$\${}^{C_1}I_1=\\begin{bmatrix}I_{xx1}&0&0\\\\0&I_{yy1}&0\\\\0&0&I_{zz1}\\end{bmatrix},\\qquad {}^{C_2}I_2=\\begin{bmatrix}I_{xx2}&0&0\\\\0&I_{yy2}&0\\\\0&0&I_{zz2}\\end{bmatrix}$$

두 링크 모두 $\\hat Z$축(지면과 수직)으로만 회전하므로, 회전 운동에너지에는 $I_{zz}$ 성분만 살아남는다 — $X,Y$축 방향 회전은 애초에 존재하지 않기 때문이다.

### 각 링크의 운동에너지·위치에너지

**링크 1**(회전만, 선속도 없음 → $v=r\\omega=l_1\\dot\\theta_1$):

$$k_1=\\frac12m_1l_1^2\\dot\\theta_1^2+\\frac12I_{zz1}\\dot\\theta_1^2,\\qquad u_1=m_1l_1g\\sin\\theta_1+m_1l_1g$$

**링크 2**(회전 $+$ 프리스메틱 신장 — 두 방향 속도를 에너지로 그냥 더하면 됨. 에너지는 스칼라라서 방향별로 더해도 무방):

$$k_2=\\frac12m_2\\!\\left(d_2^2\\dot\\theta_1^2+\\dot d_2^2\\right)+\\frac12I_{zz2}\\dot\\theta_1^2,\\qquad u_2=m_2gd_2\\sin\\theta_1+m_2gd_{2max}$$

$u_1,u_2$의 뒤에 붙은 $m_1l_1g$, $m_2gd_{2max}$는 기준 위치에너지($u_{ref}$)일 뿐이다. 어차피 미분하면 사라지는 상수라서 값이 얼마든 상관없다.

### 합산과 라그랑지안

$$K(\\Theta,\\dot\\Theta)=\\frac12(m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2)\\dot\\theta_1^2+\\frac12m_2\\dot d_2^2$$

$$U(\\Theta)=g(m_1l_1+m_2d_2)\\sin\\theta_1+m_1l_1g+m_2gd_{2max}$$

### 편미분 — (6.77)에 대입

관절 1의 변수는 $\\theta_1$(회전 관절), 관절 2의 변수는 $d_2$(프리스메틱 관절)라는 점에 주의한다 — "$\\Theta$에 대해 미분"은 각 관절의 변수로 미분하라는 뜻이다.

$$\\frac{\\partial K}{\\partial\\dot\\Theta}=\\begin{bmatrix}(m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2)\\dot\\theta_1\\\\ m_2\\dot d_2\\end{bmatrix},\\quad \\frac{\\partial K}{\\partial\\Theta}=\\begin{bmatrix}0\\\\ m_2d_2\\dot\\theta_1^2\\end{bmatrix},\\quad \\frac{\\partial U}{\\partial\\Theta}=\\begin{bmatrix}g(m_1l_1+m_2d_2)\\cos\\theta_1\\\\ gm_2\\sin\\theta_1\\end{bmatrix}$$

$\\partial K/\\partial\\Theta$의 첫 성분이 0인 이유: $K$의 첫 항을 $\\theta_1$으로 미분하면 $\\theta_1$이 애초에 식에 없으므로(계수에만 $d_2$가 있음) 0이 된다. 둘째 성분은 $\\frac12m_2d_2^2\\dot\\theta_1^2$을 $d_2$로 미분해서 나온다.

### 최종 토크와 M·V·G

$$\\tau_1=(m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2)\\ddot\\theta_1+2m_2d_2\\dot\\theta_1\\dot d_2+(m_1l_1+m_2d_2)g\\cos\\theta_1$$

$$\\tau_2=m_2\\ddot d_2-m_2d_2\\dot\\theta_1^2+m_2g\\sin\\theta_1$$

정리하면 [1절과 같은 구조](#1-자세공간-방정식--v를-b·c로-더-쪼개기)로 바로 재포장된다.

$$M(\\Theta)=\\begin{bmatrix}m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2 & 0\\\\ 0 & m_2\\end{bmatrix},\\quad V(\\Theta,\\dot\\Theta)=\\begin{bmatrix}2m_2d_2\\dot\\theta_1\\dot d_2\\\\ -m_2d_2\\dot\\theta_1^2\\end{bmatrix},\\quad G(\\Theta)=\\begin{bmatrix}(m_1l_1+m_2d_2)g\\cos\\theta_1\\\\ m_2g\\sin\\theta_1\\end{bmatrix}$$

**이해**: [반복 뉴턴-오일러](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)로 이 문제를 풀려면 회전·프리스메틱이 섞인 관절, 무게중심에 있는 점질량, 0이 아닌 관성 텐서까지 다뤄야 해서 손으로 풀기 매우 번거롭다. 반면 라그랑주 방법은 각 링크의 운동·위치 에너지를 스칼라로 더하고 편미분 두 번만 하면 끝난다 — **에너지는 좌표계 변환·외적·행렬 곱셈이 필요 없는 스칼라**이기 때문이다.

---

## 5. 반복식 vs 라그랑주 — 언제 뭘 쓰나

| | 반복 뉴턴-오일러(iterative) | 라그랑주(closed-form) |
|---|---|---|
| 절차 | [외향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md) → [내향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md), 관절마다 힘·토크를 순차 전파 | 각 링크의 $K,U$를 스칼라로 더하고 $\\mathcal L$을 편미분 |
| 이해 난이도 | 단계별로 눈에 보여서 이해하기 쉬움 | 에너지 감각과 편미분에 익숙해야 함 |
| 계산량 | 관절 수만큼 단계가 늘어나고 계산이 많음, 하지만 절차가 기계적이라 프로그래밍하기 좋음 | 잘 풀리면 훨씬 짧고 빠름 — 하지만 로봇 형상이 복잡(둥근 디자인 등)하면 에너지 표현 자체가 어려워짐 |
| 실무 | 일반적인 모든 경우에 항상 적용 가능 | 잘 풀리면 계산량이 적어 실시간 제어에 유리, 막히면 매우 막힘 |

로봇을 잘 설계해서 관절이 직각으로 꺾이거나 일렬로 맞춰지는 형태면 라그랑주도 쉽게 구해지지만, 둥글둥글한 디자인이면 에너지 표현 자체가 어려워져 반복식으로 돌아가는 편이 낫다 — 라그랑주는 잘 풀리면 매우 간단하고 막히면 매우 막히는 양극단의 방법이다.

---

## 6. 작업공간(직교좌표) 동역학 — 자코비안으로 손끝 힘 구하기

지금까지 구한 $\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$는 "관절 각도·각속도·각가속도를 알 때 필요한 관절 토크"를 알려준다. 그런데 실제로 더 궁금한 것은 **손끝(작업공간, task space)의 가속도로 인해 손끝에 걸리는 힘**이다 — 골프채로 공을 칠 때, 관절 토크보다 "손끝이 공에 얼마의 힘을 주는가"가 직접적인 관심사이기 때문이다.

### 손끝 힘·가속도의 동역학 방정식

관절공간과 똑같은 형태로, 손끝(직교좌표) 공간에도 상태공간 방정식을 쓸 수 있다.

$$\\boxed{\\mathcal F=M_x(\\Theta)\\ddot\\chi+V_x(\\Theta,\\dot\\Theta)+G_x(\\Theta)}$$

- $\\mathcal F$: 손끝(말단 효과 장치)에 작용하는 $n\\times1$ 힘-토크 벡터.
- $\\chi$: 손끝의 위치·방위를 나타내는 직교좌표계 벡터.
- $M_x(\\Theta)$: 직교좌표 질량행렬(Cartesian mass matrix), $V_x,G_x$: 직교좌표 공간에서의 속도항·중력항.

### 유도 — 자코비안 전치와 미분

[5장에서 구한](../jacobian-static-forces-and-geometric-jacobian/main.md) $\\tau=J^T(\\Theta)\\mathcal F$에 관절공간 방정식을 대입한다.

$$J^T\\mathcal F=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$$

양변에 왼쪽부터 $J^{-T}$(자코비안 전치의 역)를 곱하면 $\\mathcal F$가 좌변에 남는다.

$$\\mathcal F=J^{-T}M(\\Theta)\\ddot\\Theta+J^{-T}V(\\Theta,\\dot\\Theta)+J^{-T}G(\\Theta)$$

여기에 [5장에서 정의한](../jacobian-velocity-kinematics-link-propagation/main.md) $\\dot\\chi=J(\\Theta)\\dot\\Theta$를 시간에 대해 한 번 더 미분하면 $\\ddot\\Theta$를 $\\ddot\\chi$로 바꿀 수 있다.

$$\\ddot\\chi=\\dot J\\dot\\Theta+J\\ddot\\Theta\\quad\\Longrightarrow\\quad \\ddot\\Theta=J^{-1}\\ddot\\chi-J^{-1}\\dot J\\dot\\Theta$$

이걸 대입해서 정리하면:

$$\\mathcal F=J^{-T}M(\\Theta)J^{-1}(\\Theta)\\,\\ddot\\chi\\;-\\;J^{-T}M(\\Theta)J^{-1}(\\Theta)\\dot J(\\Theta)\\dot\\Theta\\;+\\;J^{-T}V(\\Theta,\\dot\\Theta)\\;+\\;J^{-T}G(\\Theta)$$

맨 위 상태공간 방정식($\\mathcal F=M_x\\ddot\\chi+V_x+G_x$)과 계수를 하나씩 비교하면 세 행렬이 그대로 정의된다.

$$M_x(\\Theta)=J^{-T}(\\Theta)M(\\Theta)J^{-1}(\\Theta)$$

$$V_x(\\Theta,\\dot\\Theta)=J^{-T}(\\Theta)\\Big(V(\\Theta,\\dot\\Theta)-M(\\Theta)J^{-1}(\\Theta)\\dot J(\\Theta)\\dot\\Theta\\Big)$$

$$G_x(\\Theta)=J^{-T}(\\Theta)G(\\Theta)$$

두 식을 다시 합치면 관절 토크 → 손끝 가속도의 관계식 하나로 정리된다.

$$\\boxed{\\tau=J^T(\\Theta)\\Big(M_x(\\Theta)\\ddot\\chi+V_x(\\Theta,\\dot\\Theta)+G_x(\\Theta)\\Big)}$$

**이해**: 이 식은 방향이 두 가지로 다 쓰인다 — 손끝이 낼 가속도 $\\ddot\\chi$를 알면 필요한 관절 토크 $\\tau$가 나오고(순방향 제어), 반대로 원하는 손끝 힘 $\\mathcal F$가 정해져 있으면 $\\ddot\\chi=M_x^{-1}(\\mathcal F-V_x-G_x)$로 필요한 손끝 가속도를 역산할 수도 있다 — 골프스윙 로봇처럼 공에 맞는 순간 필요한 힘·토크를 역으로 계산하는 경우가 그 예다.

---

## 7. 비강체 효과 — 점성마찰과 쿨롱마찰

지금까지의 $\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)$는 마찰이 전혀 없는 이상적인 강체(rigid body) 가정이었다. 실제 구동기(모터, 기어)에는 마찰이 필연적으로 존재하고, 대표적으로 두 가지 모델이 쓰인다.

- **점성마찰(viscous friction)** — 자동차가 빠르게 달릴수록 바람저항이 커지는 것과 같은 원리로, 속도에 비례하는 마찰. $\\tau_{friction}=v\\dot\\theta$ ($v$는 점성 계수).
- **쿨롱마찰(Coulomb friction)** — 움직이기 시작하는 순간의 구름마찰. 속도의 크기가 아니라 **부호(방향)**에만 영향을 받고, 항상 속도 반대 방향으로 일정한 크기의 힘을 가한다. $\\tau_{friction}=c\\,\\text{sgn}(\\dot\\theta)$.

두 가지를 합치면 마찰 토크는 관절 각도·각속도의 함수가 된다.

$$\\tau_{friction}=c\\,\\text{sgn}(\\dot\\theta)+v\\dot\\theta=f(\\theta,\\dot\\theta)$$

최종적으로 마찰까지 포함한 완전한 매니퓰레이터 동역학 방정식은 다음과 같다.

$$\\boxed{\\tau=M(\\Theta)\\ddot\\Theta+V(\\Theta,\\dot\\Theta)+G(\\Theta)+F(\\Theta,\\dot\\Theta)}$$

---

## 8. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| $B(\\Theta),\\ [\\dot\\Theta\\dot\\Theta]$ | 코리올리 계수 행렬($n\\times n(n-1)/2$), 서로 다른 관절 속도곱 벡터 | 1절 |
| $C(\\Theta),\\ [\\dot\\Theta^2]$ | 원심력 계수 행렬($n\\times n$), 관절 속도 제곱 벡터 | 1절 |
| $\\mathcal L=K-U$ | 라그랑지안 | 3절 |
| $\\dfrac{d}{dt}\\dfrac{\\partial\\mathcal L}{\\partial\\dot\\Theta}-\\dfrac{\\partial\\mathcal L}{\\partial\\Theta}=\\tau$ | 오일러-라그랑주 운동방정식 | 매니퓰레이터에서는 (6.77)로 단순화 |
| $k_i,u_i$ | $i$번째 링크의 운동·위치 에너지 | $k_i=\\frac12m_iv_{C_i}^Tv_{C_i}+\\frac12{}^i\\omega_i^T{}^{C_i}I_i{}^i\\omega_i$ |
| $\\mathcal F,\\ \\chi$ | 손끝 힘-토크 벡터, 손끝 위치·방위 벡터 | 5-4의 $\\tau=J^T\\mathcal F$와 같은 표기 |
| $M_x,V_x,G_x$ | 직교좌표(작업공간) 질량행렬·속도항·중력항 | $M_x=J^{-T}MJ^{-1}$ 등 |
| $\\tau_{friction}=v\\dot\\theta$ | 점성마찰 | 속도에 비례 |
| $\\tau_{friction}=c\\,\\text{sgn}(\\dot\\theta)$ | 쿨롱마찰 | 속도 부호에만 의존 |

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| B·C 분리 | $\\tau=M\\ddot\\Theta+B[\\dot\\Theta\\dot\\Theta]+C[\\dot\\Theta^2]+G$ — $V$를 코리올리($B$)·원심력($C$)으로 재포장, $M,B,C,G$ 모두 $\\Theta$만의 함수(자세공간) |
| 라그랑지안 | $\\mathcal L=K-U$, $K=\\sum k_i$(병진+회전 에너지), $U=\\sum u_i$(무게중심 높이 기반) |
| 오일러-라그랑주 | $\\frac{d}{dt}\\frac{\\partial K}{\\partial\\dot\\Theta}-\\frac{\\partial K}{\\partial\\Theta}+\\frac{\\partial U}{\\partial\\Theta}=\\tau$ — $U$가 $\\dot\\Theta$의 함수가 아니라서 단순화됨 |
| 예제 6.5 (RP 매니퓰레이터) | 회전+프리스메틱 혼합, 무게중심 점질량+관성텐서 — 반복식은 번거롭지만 라그랑주는 $K,U$ 편미분 두 번으로 끝 |
| 반복식 vs 라그랑주 | 반복식=항상 적용 가능·이해 쉬움 / 라그랑주=잘 풀리면 훨씬 간단·형상이 복잡하면 막힘 |
| 작업공간 동역학 | $\\mathcal F=M_x\\ddot\\chi+V_x+G_x$, $M_x=J^{-T}MJ^{-1}$, $V_x=J^{-T}(V-MJ^{-1}\\dot J\\dot\\Theta)$, $G_x=J^{-T}G$ — $\\tau=J^T(M_x\\ddot\\chi+V_x+G_x)$로 관절·손끝 동역학이 하나로 연결됨 |
| 마찰 | $\\tau_{friction}=c\\,\\text{sgn}(\\dot\\theta)+v\\dot\\theta$ — 완전한 방정식은 $\\tau=M\\ddot\\Theta+V+G+F(\\Theta,\\dot\\Theta)$ |
`,

  'Robotics/cubic-spline-and-lspb': `---
title: 궤도 생성 II — 2구간 3차 스플라인과 LSPB (Trajectory Generation II — Cubic Spline & LSPB)
date: 2026-08-08
tags: lspb, joint-space
order: 
featured: false
draft: false
---

# 궤도 생성 II — 2구간 3차 스플라인과 LSPB (Trajectory Generation II — Cubic Spline & LSPB)

> 출처: 로봇제어공학 — Introduction to Robotics 7장 "궤도 생성(Trajectory Generation) II"
> 영상: https://www.youtube.com/watch?v=GGTM5y9Gvvg&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=20
> 대상: [1편](../trajectory-generation-and-cubic-polynomial-path/main.md)에서 3차 다항식과 경유점 속도를 정하는 세 가지 방법(자코비안·휴리스틱·5차 다항식)까지 학습한 상태를 전제로, 경유점에서 **가속도까지** 연속시키는 2구간 스플라인과 완전히 다른 접근인 **LSPB(직선+포물선)** 를 다루는 노트.

---

## 목차
1. [지난 시간 복습과 이번 시간의 문제](#1-지난-시간-복습과-이번-시간의-문제)
2. [경유점에서 가속도까지 연속시키는 2구간 3차 스플라인](#2-경유점에서-가속도까지-연속시키는-2구간-3차-스플라인)
3. [LSPB — 직선과 포물선을 섞는 이유](#3-lspb--직선과-포물선을-섞는-이유)
4. [LSPB 공식 유도 — 블렌드 구간](#4-lspb-공식-유도--블렌드-구간)
5. [가속도 선택과 판별식](#5-가속도-선택과-판별식)
6. [LSPB로 경유점 통과하기 — J, K, L 표기](#6-lspb로-경유점-통과하기--j-k-l-표기)
7. [가상 경유점(pseudo via point)](#7-가상-경유점pseudo-via-point)
8. [표현법 비교표](#8-표현법-비교표)
9. [Python 실습 코드](#9-python-실습-코드)

---

## 1. 지난 시간 복습과 이번 시간의 문제

[1편](../trajectory-generation-and-cubic-polynomial-path/main.md)에서 관절 공간 경로 생성의 큰 그림은: 작업공간의 경유점들을 [역기구학](../inverse-kinematics-algebraic-geometric-pieper/main.md)으로 딱 한 번씩 관절각으로 바꾼 뒤, 관절 하나하나를 시간-각도 함수 θ(t)로 독립적으로 설계하는 것이었다.

경유점의 **위치**는 역기구학으로 확정되지만 **속도**는 사용자가 정해야 했고, 그 방법이

① 자코비안(정확·번거로움)
② 휴리스틱(부호 바뀌면 0, 안 바뀌면 평균)
③ 위치·속도·가속도까지 양 끝에서 지정하는 5차 다항식

이렇게 세 가지였다.


- **(A) 2구간 스플라인**: 3차 다항식을 유지하되 경유점에서 **가속도까지** 연속시킨다.
- **(B) LSPB(Linear Segment with Parabolic Blend)**: 다항식을 버리고 **직선+포물선**으로 만든다.

## 2. 경유점에서 가속도까지 연속시키는 2구간 3차 스플라인

**문제 상황(예제 7.2)**: 시작 $\\theta_0$ → 경유점 $\\theta_v$ → 종료 $\\theta_g$를 지나는 경로를, 경유점에서 **속도뿐 아니라 가속도까지 연속**이 되도록 만들고 싶다. 3차 다항식 하나로는 미지수 4개(조건 4개)라 이미 다 써버렸으니, 구간을 둘로 나눠 3차 다항식을 두 개 쓴다.

$$\\theta(t) = a_{10}+a_{11}t+a_{12}t^2+a_{13}t^3 \\quad (\\text{구간 1: } 0 \\sim t_{f1})$$
$$\\theta(t) = a_{20}+a_{21}t+a_{22}t^2+a_{23}t^3 \\quad (\\text{구간 2: } 0 \\sim t_{f2},\\ \\text{자체 지역시간})$$

각 구간이 **자기 지역시간(local time)** 0부터 시작한다는 점이 핵심이다 — 구간 2의 $t$는 전체 시간이 아니라 경유점을 지난 뒤 다시 0부터 잰다.

**경계조건 6개**:

$$\\theta_0=a_{10},\\qquad \\theta_v=a_{10}+a_{11}t_{f1}+a_{12}t_{f1}^2+a_{13}t_{f1}^3,\\qquad \\theta_v=a_{20}$$
$$\\theta_g=a_{20}+a_{21}t_{f2}+a_{22}t_{f2}^2+a_{23}t_{f2}^3,\\qquad 0=a_{11},\\qquad 0=a_{21}+2a_{22}t_{f2}+3a_{23}t_{f2}^2$$

여기에 **경유점 속도·가속도 연속** 조건 2개가 더해져 총 8개 방정식, 미지수 8개(a₁₀~a₁₃, a₂₀~a₂₃):

$$a_{11}+2a_{12}t_{f1}+3a_{13}t_{f1}^2 = a_{21} \\quad(\\text{속도 연속}), \\qquad 2a_{12}+6a_{13}t_{f1} = 2a_{22} \\quad(\\text{가속도 연속})$$

계산을 쉽게 하려고 두 구간을 **동일한 시간**($t_{f1}=t_{f2}=t_f/2$)으로 나눈 경우, 풀면 다음 공식이 그대로 나온다.

**이해**: 슬라이드 원문은 "$t_f=t_{f1}=t_{f2}$"라고 적혀 있는데 이는 오타이며, 실제 의미는 $t_{f1}=t_{f2}=\\dfrac{t_f}{2}$(전체 시간의 절반씩 균등 분할)이다.

$$a_{10}=\\theta_0,\\quad a_{11}=0,\\quad a_{12}=\\frac{12\\theta_v-3\\theta_g-9\\theta_0}{4t_f^2},\\quad a_{13}=\\frac{-8\\theta_v+3\\theta_g+5\\theta_0}{4t_f^3}$$
$$a_{20}=\\theta_v,\\quad a_{21}=\\frac{3\\theta_g-3\\theta_0}{4t_f},\\quad a_{22}=\\frac{-12\\theta_v+6\\theta_g+6\\theta_0}{4t_f^2},\\quad a_{23}=\\frac{8\\theta_v-5\\theta_g-3\\theta_0}{4t_f^3}$$

![](7-2 예제7.2 2구간 스플라인 계수.jpg)

**암기 불필요**: 이 8개 공식 자체는 외울 필요 없다 — 대입만 하면 되는 결과식이다. **반드시 기억**할 것은 "조건의 개수 = 미지수의 개수"라는 원칙과, 구간을 나눌 때마다 지역시간이 다시 0에서 시작한다는 점이다.

**실전 취급**: 처음 위치·경유점 각도·최종 위치, 전체 시간 $t_f$만 알면 위 공식에 바로 대입해 두 다항식의 계수가 나온다.

## 3. LSPB — 직선과 포물선을 섞는 이유

3차·5차 다항식은 부드럽지만, 그림으로 그려보면 목표점 근처에서 곡선이 **불필요하게 휘어 도는 경향**이 있다.

그러면 차라리 중간 구간은 그냥 **직선**으로 가는 게 낫지 않을까? 문제는 순수 직선 보간(Figure 7.5)은 시작·끝에서 속도가 즉시 0→일정값으로 튀어 **무한 가속도**가 필요하다는 점이다.

![](7-2 Figure7.5-7.6 직선보간과 LSPB.jpg)

**해결책**: 시작·끝 구간만 **2차 포물선(등가속도)** 으로 완충하고, 중간은 그대로 직선으로 두자 — 이것이 **LSPB(Linear Segment with Parabolic Blend)**, 직선 구간과 포물선 블렌드를 섞은 방법이다.

$$\\theta(t) = \\begin{cases}\\theta_0+\\frac12\\ddot\\theta t^2 & 0\\le t\\le t_b \\ \\text{(가속 블렌드)}\\\\ \\text{직선} & t_b\\le t\\le t_f-t_b\\\\ \\theta_f-\\frac12\\ddot\\theta(t_f-t)^2 & t_f-t_b\\le t\\le t_f \\ \\text{(감속 블렌드)}\\end{cases}$$

**이해**: 다항식은 "무조건 그 경유점을 지나가는" 조건을 걸어서 곡선이 되고, LSPB는 "직선으로 빠르게 가되 양 끝만 봐준다"는 발상이다. 직선·2차 포물선은 이미 중·고등학교 수학이라 계산이 훨씬 쉽다.

블렌드(포물선) 구간이 짧으면 직선 구간이 길어져 급가속-급감속이 되고, 블렌드가 길면 직선 구간이 짧아져 완만한 가감속이 된다. 실제로 이 길이를 무엇으로 정하는지는 [5절](#5-가속도-선택과-판별식)에서 다룬다.

## 4. LSPB 공식 유도 — 블렌드 구간

가속·감속 블렌드는 대칭(원점 기준 점대칭)이므로 가속 구간 하나만 유도하면 감속 구간은 그대로 뒤집으면 된다.

![](7-2 Figure7.7 LSPB 블렌드 유도.jpg)

블렌드가 끝나는 시각을 $t_b$, 그때의 각도를 $\\theta_b$라 하자. 전체 궤적이 점대칭이므로 중간점은 정확히 $t_h=t_f/2$, $\\theta_h=(\\theta_0+\\theta_f)/2$이다.

**조건 1 — 속도 매칭**: 블렌드 구간 끝에서의 속도($\\ddot\\theta \\cdot t_b$, 등가속도 적분값)가 직선 구간의 기울기와 같아야 한다.

$$\\ddot\\theta\\, t_b = \\dot\\theta_h = \\frac{\\theta_h-\\theta_b}{t_h-t_b}$$

**조건 2 — 위치 매칭**: 가속도를 두 번 적분(한 번은 속도, 한 번 더는 위치)하고 초기값을 더하면 $\\theta_b$가 나온다.

$$\\theta_b = \\theta_0+\\frac12\\ddot\\theta t_b^2$$

두 식에서 $\\theta_h=(\\theta_0+\\theta_f)/2$, $t_h=t_f/2$를 대입해 정리하면:

$$\\ddot\\theta\\, t_b^2 - \\ddot\\theta\\, t_f\\, t_b + (\\theta_f-\\theta_0) = 0$$

$t_b$에 대한 **2차 방정식**이므로 근의 공식을 바로 쓸 수 있다.

$$t_b = \\frac{t_f}{2}-\\frac{\\sqrt{\\ddot\\theta^2 t_f^2-4\\ddot\\theta(\\theta_f-\\theta_0)}}{2\\ddot\\theta}$$

**이해**: 위 유도는 "속도가 맞아야 한다", "위치가 맞아야 한다"는 상식 두 줄에 대칭성만 더한 것으로, 고차원 수학이 아니다.

**암기 불필요**: 유도 과정을 통째로 외울 필요는 없고, 최종 $t_b$ 공식만 대입해 쓰면 된다.

## 5. 가속도 선택과 판별식

LSPB를 쓰려면 사용자가 **가속도 $\\ddot\\theta$의 절댓값**을 먼저 정해야 한다(로봇이 낼 수 있는 적당한 가속도). 가속도를 정하면 위 공식으로 **블렌드 시간 $t_b$가 자동으로 결정**된다. 스포츠카처럼 가속도가 크면 살짝만 밟아도 금방 목표 속도에 도달하니 블렌드 시간이 짧고, 버스처럼 가속도가 작으면 오래 밟아야 하니 블렌드 시간이 길어지는 것과 같은 이치다.

**판별식의 물리적 의미**: 근의 공식 안의 판별식 $\\ddot\\theta^2t_f^2-4\\ddot\\theta(\\theta_f-\\theta_0)$이 음수면 **허근**이 나온다. 수학적으로는 존재하지만 물리적으로는 불가능하다는 뜻이다 — 아무리 밟아도 40km/h까지밖에 못 내는 경운기에게 "정해진 시간 안에 50km/h를 내라"고 요구하는 상황과 같다. 목표 각도 변화를 그 시간 안에, 그 가속도로는 도저히 달성할 수 없다는 의미다.

정리하면 실현 가능 조건(**반드시 기억**)은:

$$|\\ddot\\theta| \\ge \\frac{4|\\theta_f-\\theta_0|}{t_f^2}$$

**실전 취급**: 정해진 시간 $t_f$ 안에 목표 각도 변화 $\\theta_f-\\theta_0$를 달성하려면, 관절이 낼 수 있는 최대 가속도가 이 하한값 이상이어야 한다 — 못 미치면 $t_f$를 늘리거나 가속도 스펙이 더 좋은 액추에이터가 필요하다는 뜻.

가속도 크기에 따른 실제 곡선 비교(예제 7.3, 15°→70°):

![](7-2 Figure7.8 가속도비교 3단그래프.jpg)

- 가속도를 크게(약 40°/s²) 잡으면 블렌드 구간이 짧고 직선(정속) 구간이 길다 — 속도 그래프가 사다리꼴에 가깝다.
- 가속도를 작게(약 26°/s²) 잡으면 블렌드 구간이 길어지고 직선 구간이 짧아진다 — 더 낮추면 아예 도달 전에 감속을 시작해야 해서 목표 시간 안에 도달이 불가능해진다(판별식 음수).

## 6. LSPB로 경유점 통과하기 — J, K, L 표기

여러 경유점을 지나는 LSPB는 3차 다항식보다 표기가 복잡하지만 아이디어는 같다: 인접한 세 경로점을 $J,K,L$이라 부른다.

![](7-2 Figure7.9 JKL 경유점.jpg)

| 기호 | 의미 |
|---|---|
| $\\theta_J,\\theta_K,\\theta_L$ | J, K, L점을 지날 때의 각도 |
| $\\dot\\theta_{JK}$ | J–K 사이 **직선 구간**의 기울기(속도) |
| $\\ddot\\theta_K$ | K점에서 블렌드하는 동안의 가속도 |
| $t_{JK}$ | J–K 사이 직선 구간의 경과 시간 |
| $t_K$ | K점 블렌드 구간의 경과 시간 |
| $t_{dJK}$ | J점에서 K점까지의 **전체** 경과 시간($t_{JK}$ + 양쪽 블렌드 절반) |

$$t_{dJK} = t_{JK} + \\tfrac12 t_J + \\tfrac12 t_K$$

풀어야 할 4개 공식(중간 경유점 K에 대해):

$$\\dot\\theta_{JK}=\\frac{\\theta_K-\\theta_J}{t_{dJK}},\\qquad \\ddot\\theta_K = \\mathrm{SGN}(\\dot\\theta_{KL}-\\dot\\theta_{JK})\\,|\\ddot\\theta_K|$$
$$t_K = \\frac{\\dot\\theta_{KL}-\\dot\\theta_{JK}}{\\ddot\\theta_K},\\qquad t_{JK}=t_{dJK}-\\tfrac12 t_J-\\tfrac12 t_K$$

**이해**: 두 번째 식의 $\\mathrm{SGN}$은 크기가 아니라 **부호만** 정하는 항이다 — 앞뒤 기울기가 같은 방향으로 커지면(가속) 양수, 방향이 바뀌면 음수가 되도록 만들 뿐, 가속도의 크기 $|\\ddot\\theta_K|$는 사용자가 이미 정한 값이다.

**시작점·끝점은 이웃이 하나뿐**이라 공식이 살짝 바뀐다(경유점이 아니라 시작/끝이므로 SGN 안의 기준이 인접한 한쪽 기울기뿐):

$$\\ddot\\theta_1=\\mathrm{SGN}(\\theta_2-\\theta_1)|\\ddot\\theta_1|,\\quad t_1=t_{d12}-\\sqrt{t_{d12}^2-\\frac{2(\\theta_2-\\theta_1)}{\\ddot\\theta_1}}$$
$$\\dot\\theta_{12}=\\frac{\\theta_2-\\theta_1}{t_{d12}-\\frac12 t_1},\\qquad t_{12}=t_{d12}-t_1-\\frac12 t_2$$

$$\\ddot\\theta_n=\\mathrm{SGN}(\\theta_{n-1}-\\theta_n)|\\ddot\\theta_n|,\\quad t_n=t_{d(n-1)n}-\\sqrt{t_{d(n-1)n}^2+\\frac{2(\\theta_n-\\theta_{n-1})}{\\ddot\\theta_n}}$$
$$\\dot\\theta_{(n-1)n}=\\frac{\\theta_n-\\theta_{n-1}}{t_{d(n-1)n}-\\frac12 t_n},\\qquad t_{(n-1)n}=t_{d(n-1)n}-t_n-\\frac12 t_{n-1}$$

**암기 불필요**: 이 8개 식 전부 외울 필요 없음 — 공식 형태를 갖고 있다가 대입만 하면 된다. **반드시 기억**: 중간 경유점용 4식과 시작/끝점용 4식이 서로 다르다는 것(이웃이 하나뿐이라 제곱근 안 부호가 다르다).

## 7. 가상 경유점(pseudo via point)

LSPB의 치명적인 단점: 중간 경유점을 **정확히 지나가지 않는다**. 블렌드 구간이 그 점을 감싸고 지나가버려 근처만 스칠 뿐이다.

다항식 방법은 경유점 통과를 조건으로 걸었기 때문에 반드시 지나가지만, 그 대신 구불거림이 생겼다. LSPB는 반대로 움직임은 깔끔하지만 **꼭 가야 하는 점을 놓친다**는 트레이드오프다.

![](7-2 Figure7.10 가상경유점.jpg)

**해결 트릭**: LSPB의 직선 구간은 반드시 그 구간의 두 끝점을 지난다는 성질을 역이용한다.

1. 진짜 지나가야 하는 경유점의 **양옆에 가상의 경유점 두 개**를 찍는다.
2. 가상 점들 사이의 **직선 구간이 원래 경유점을 지나가도록** 배치한다.
3. [6절](#6-lspb로-경유점-통과하기--j-k-l-표기)의 경유점 공식을 그대로 적용하면 원래 경유점을 100% 통과한다.

**이해**: "pseudo(수도)"는 "가짜의"라는 뜻 — pseudo code(수도 코드)가 진짜 코드는 아니지만 해석되는 것처럼, pseudo via point도 실제로 로봇이 멈추는 진짜 목표점은 아니고 LSPB 공식에 넣기 위한 보조 좌표다.

**대가**: 경유점 하나당 가상 점 2개가 추가되므로 계산량이 약 3배로 늘어난다.

**실전 취급**: 경유점이 많은 실제 궤적에서 "이 점만은 반드시 통과해야 한다"는 요구가 있을 때만 가상 경유점을 추가하고, 그 외에는 원래 LSPB 그대로 근사 통과시키는 것이 더 가볍다.

## 8. 표현법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| $t_{f1},t_{f2}$ | 2구간 스플라인의 각 구간 지역시간 | 2절, 균등분할 시 $t_{f1}=t_{f2}=t_f/2$ |
| $t_b$ | LSPB 블렌드(가속/감속) 구간 시간 | 4절, 2차 방정식으로 풀림 |
| $\\ddot\\theta$ | LSPB 블렌드 구간의 등가속도(사용자 지정) | 5절, $\\lvert\\ddot\\theta\\rvert\\ge 4\\lvert\\theta_f-\\theta_0\\rvert/t_f^2$ 필요 |
| $J,K,L$ | LSPB에서 인접한 세 경로점 표기 | 6절 |
| $t_{dJK}$ | J–K 전체 경과시간(직선+양쪽 블렌드 절반) | $t_{dJK}=t_{JK}+\\tfrac12t_J+\\tfrac12t_K$ |
| $\\mathrm{SGN}(\\cdot)$ | 부호만 결정하는 항 | 가속도 크기는 이미 지정, 방향만 결정 |
| pseudo via point (수도 비아 포인트) | LSPB가 경유점을 100% 지나가게 만드는 가상의 보조 점 | 7절 |

## 9. Python 실습 코드

\`\`\`python
import numpy as np

def cubic_via_spline(theta0, theta_v, theta_g, tf):
    """예제 7.2: 경유점에서 속도·가속도까지 연속인 2구간 3차 스플라인.
    두 구간을 tf/2씩 균등분할했다고 가정."""
    a10 = theta0
    a11 = 0.0
    a12 = (12*theta_v - 3*theta_g - 9*theta0) / (4*tf**2)
    a13 = (-8*theta_v + 3*theta_g + 5*theta0) / (4*tf**3)
    a20 = theta_v
    a21 = (3*theta_g - 3*theta0) / (4*tf)
    a22 = (-12*theta_v + 6*theta_g + 6*theta0) / (4*tf**2)
    a23 = (8*theta_v - 5*theta_g - 3*theta0) / (4*tf**3)
    return (a10, a11, a12, a13), (a20, a21, a22, a23)

def eval_cubic(coeffs, t):
    a0, a1, a2, a3 = coeffs
    return a0 + a1*t + a2*t**2 + a3*t**3


def lspb_blend_time(theta0, thetaf, tf, acc_mag):
    """LSPB 블렌드 시간 tb와 부호 있는 가속도를 구한다 (판별식 음수면 ValueError)."""
    delta = thetaf - theta0
    acc = np.sign(delta) * abs(acc_mag)
    disc = acc**2 * tf**2 - 4*acc*delta
    if disc < 0:
        raise ValueError("가속도가 부족합니다 — tf 안에 도달 불가 (판별식 음수)")
    tb = tf/2 - np.sqrt(disc) / (2*acc)
    return tb, acc

def lspb_eval(t, theta0, thetaf, tf, acc_mag):
    tb, acc = lspb_blend_time(theta0, thetaf, tf, acc_mag)
    if t <= tb:
        return theta0 + 0.5*acc*t**2
    elif t <= tf - tb:
        theta_b = theta0 + 0.5*acc*tb**2
        v = acc*tb
        return theta_b + v*(t - tb)
    else:
        return thetaf - 0.5*acc*(tf - t)**2


if __name__ == "__main__":
    # 예제 7.2 검증: 15deg -> 40deg(경유점) -> 75deg, tf=4s
    seg1, seg2 = cubic_via_spline(15, 40, 75, 4.0)
    print("구간1 계수:", seg1)
    print("구간2 계수:", seg2)

    # LSPB: 15deg -> 70deg, tf=3s, 가속도 40deg/s^2
    tb, acc = lspb_blend_time(15, 70, 3.0, 40.0)
    print(f"tb={tb:.3f}s, acc={acc:.1f}deg/s^2")
    for t in [0, tb, 1.5, 3-tb, 3]:
        print(f"t={t:.2f} -> theta={lspb_eval(t, 15, 70, 3.0, 40.0):.2f}deg")
\`\`\`

**연습문제(TODO)**:

\`\`\`python
# TODO 1: 2구간 스플라인의 속도·가속도 연속성 검증
#   cubic_via_spline(15, 40, 75, 4.0)의 두 다항식에 대해,
#   구간1의 t=tf/2 시점 속도·가속도와 구간2의 t=0 시점 속도·가속도가
#   각각 일치하는지 수치로 확인하라.
#   힌트: 미분 계수는 [a1, 2*a2, 6*a3] 형태로 직접 계산하거나 np.polyder 사용.

# TODO 2: 가속도 하한 검증
#   theta0=10, thetaf=70, tf=2.0 일 때 4*abs(thetaf-theta0)/tf**2 을 계산하고,
#   그보다 작은 가속도를 lspb_blend_time에 넣으면 실제로 ValueError가
#   발생하는지 확인하라.

# TODO 3: LSPB 경유점(J,K,L) 공식 구현
#   theta_J, theta_K, theta_L, t_dJK, t_dKL, acc_K(크기)가 주어졌을 때
#   6절의 4개 공식으로 t_JK, dtheta_JK, dtheta_KL, t_K을 구하는
#   함수 lspb_via_point(...)를 작성하라.
#   검증: 구해진 t_K, dtheta_JK로 만든 블렌드 구간 끝점 속도가
#   직선 구간 기울기 dtheta_JK와 실제로 같은지 확인.
\`\`\`

**실전 연결**:
- 경유점 속도·가속도 경계조건이 있는 3차 구간은 [\`scipy.interpolate.CubicHermiteSpline\`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.CubicHermiteSpline.html)로 그대로 대체 가능 — 직접 계수를 풀 필요 없이 위치·속도 배열만 넘기면 된다.
- LSPB(사다리꼴 속도 프로파일)는 \`roboticstoolbox-python\`의 \`trapezoidal()\` 함수가 동일한 개념을 구현해 제공한다.
- ROS2에서는 \`joint_trajectory_controller\`가 각 관절에 대해 이런 시간-각도(및 속도) 프로파일을 받아 실행하고, MoveIt의 시간 파라미터화 단계(TOPP-RA, Ruckig 등)가 실제로는 여기서 배운 것보다 일반화된 형태로 같은 문제(위치·속도·가속도 연속성, 가속도 한계)를 푼다.

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 2구간 3차 스플라인 | 경유점에서 위치·속도·가속도까지 연속시키려고 3차 다항식 2개(지역시간 각자 0부터) 사용. 균등분할 시 계수 공식 8개가 바로 나옴 |
| LSPB 아이디어 | 시작·끝만 등가속도 포물선으로 완충하고 중간은 직선 — 다항식보다 계산이 쉽고 불필요한 곡선을 줄임 |
| LSPB 블렌드 공식 | 속도 매칭 $\\ddot\\theta t_b=\\dot\\theta_h$ + 위치 매칭 $\\theta_b=\\theta_0+\\frac12\\ddot\\theta t_b^2$ + 대칭성 → $\\ddot\\theta t_b^2-\\ddot\\theta t_f t_b+(\\theta_f-\\theta_0)=0$의 근 |
| 실현 가능 조건 | $\\lvert\\ddot\\theta\\rvert \\ge 4\\lvert\\theta_f-\\theta_0\\rvert/t_f^2$ — 판별식이 음수면 그 시간 안에 도달 불가(허근) |
| LSPB 경유점(J,K,L) | 중간 경유점용 4식 + 시작점용 4식 + 끝점용 4식, 총 12식. SGN은 부호만 결정 |
| pseudo via point | LSPB가 경유점을 스치기만 하는 문제를, 진짜 점 양옆에 가상 점 2개를 찍어 직선 구간이 그 점을 지나가게 하는 우회 — 계산량 약 3배 |
| 다항식 vs LSPB | 다항식: 경유점 100% 통과·계산 복잡. LSPB: 계산 간단·직선 위주 움직임이지만 경유점은 근처만 통과(가상 경유점으로 보완 가능) |
`,

  'Robotics/denavit-hartenberg-parameters': `---
title: DH 파라미터 (Denavit-Hartenberg Parameters)
date: 2026-08-08
tags: forward-kinematics, dh-parameter
order: 
featured: false
draft: false
---

# DH 파라미터 (Denavit-Hartenberg Parameters)

> 출처: 로봇제어공학 — Introduction to Robotics 3장 / YouTube  
> https://www.youtube.com/watch?v=6z0YDb1ru1Q  
> 대상 독자: 변환행렬 T, [회전행렬 R](../orientation-representations/main.md) 개념을 익힌 상태. 기구학 첫 진입.

---

## 목차

1. [왜 DH 파라미터인가](#1-왜-dh-파라미터인가)
2. [기구학 vs 동력학](#2-기구학-vs-동력학)
3. [머니플레이터 구조 — 링크와 조인트](#3-머니플레이터-구조--링크와-조인트)
4. [왜 6관절이 필요한가](#4-왜-6관절이-필요한가)
5. [DH 4개 파라미터](#5-dh-4개-파라미터)
6. [레볼루트 vs 프리스메틱 — 변수 vs 상수](#6-레볼루트-vs-프리스메틱--변수-vs-상수)
7. [좌표계 부착 규칙](#7-좌표계-부착-규칙)
8. [PUMA 560 — 실제 로봇 DH 테이블](#8-puma-560--실제-로봇-dh-테이블)
9. [DH 변환행렬 공식](#9-dh-변환행렬-공식)
10. [Python 실습 코드](#10-python-실습-코드)
11. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 왜 DH 파라미터인가

**문제 상황**: 로봇 팔로 지우개를 집어서 칠판을 닦으려면 어떻게 명령을 줘야 하나?

- 손끝의 **위치** (XYZ) — 이건 쉬움, 점이니까
- 손끝의 **방향** (어느 쪽으로 향하는가) — 이게 어렵다

2장에서 배운 것: 방향은 3×3 회전행렬 R로 표현. 위치+방향을 합치면 4×4 변환행렬 T.

**이제 할 것**: T를 실제 로봇 팔에 적용 — "베이스에서 손끝까지" T를 구한다.

\`\`\`
T_0→n = T_1 · T_2 · T_3 · ... · T_n
        ↑                         ↑
     베이스                     손끝
\`\`\`

각 T_i를 어떻게 정의하느냐 → 그게 DH 파라미터.

**실용적 결론**: DH 파라미터 4개만 알면, 어떤 로봇 팔이든 수학적으로 완전히 기술할 수 있다.

---

## 2. 기구학 vs 동력학

| | 기구학 (Kinematics) | 동력학 (Dynamics) |
|---|---|---|
| 다루는 것 | 위치, 속도, 가속도 | + 힘(force), 토크(torque) |
| 질문 | "손끝이 어디 있나?" | "얼마나 세게 눌러야 하나?" |
| 이 강의 | ✅ 여기서 다룸 | 책 뒷부분 |

강의 예시: 칠판 닦기

- **기구학만**: 위치는 맞추지만 칠판을 안 누르면 안 닦임
- **동력학 필요**: 칠판을 적당한 힘으로 누르면서 이동해야 진짜로 닦힘

이 챕터는 기구학만. 힘 무시.

---

## 3. 머니플레이터 구조 — 링크와 조인트

### 링크 (Link)

딱딱한 막대기. 관절과 관절 사이를 연결하는 구조물.

**번호 약속**: 베이스 = 0번. 손끝 방향으로 1, 2, 3, ... N번.  
→ 링크 i-1은 관절축 i-1과 관절축 i 사이를 연결하는 링크.

### 조인트 종류 2가지

**① 레볼루트 조인트 (Revolute Joint, R)** — 회전관절

- 모터가 돌면서 관절이 회전
- 자유도: 회전 방향으로 1개
- 전체 관절의 ~80% 차지

**② 프리스메틱 조인트 (Prismatic Joint, P)** — 직선관절

- 서랍처럼 앞뒤로만 움직임
- 자유도: 직선 방향으로 1개
- 선형 액추에이터(linear actuator)로 구현

> 강의 표현 그대로: "레볼루트 조인트는 레볼루트 — 돈다는 얘기. 프리스메틱 조인트는 서랍 같은 느낌."

각 조인트 = **1 DOF (Degree of Freedom, 자유도)**  
→ 모터 3개 = 3 DOF

### 베이스와 엔드 이펙터

- **베이스 (Base)**: 0번, 절대 안 움직이는 고정 부분
- **엔드 이펙터 (End Effector)**: 손끝의 작업 장치 — 손일 수도, 드라이버일 수도, 진공 흡착기일 수도

> "굳이 손일 필요 뭐 있어? 나사 조이는 애면 그냥 전동 드라이버 붙이면 되잖아."

---

## 4. 왜 6관절이 필요한가

**유도 아이디어**: 방정식을 풀 때 미지수가 N개면 수식도 N개 필요.

3차원 공간에서 손끝을 완전히 지정하려면:

| 항목 | 변수 수 |
|---|---|
| 위치 (X, Y, Z) | 3개 |
| 방향 (Roll, Pitch, Yaw) | 3개 |
| **합계** | **6개** |

6개의 미지수를 결정하려면 → 수식 6개 필요 → **최소 6 DOF**

→ 각 관절이 1 DOF이므로 **최소 6관절**

### DOF가 달라지면?

| DOF | 이름 | 결과 |
|---|---|---|
| < 6 | 언더 액추에이티드 (Under-actuated) | 특정 자세 불가. 단, 단순 작업에는 충분 (3~5관절 로봇 많음) |
| = 6 | 딱 맞음 | 답이 하나 (역기구학 유일해) |
| > 6 | 오버 액추에이티드 | 같은 손끝 위치에 대해 답이 여러 개 → 선택지 많음, 계산 복잡 |

> "밥 먹으러 갈 때 학식이면 고민 없이 딱 가면 되는데, 앞에 식당 여러 개면 맨날 싸우잖아. DOF 많으면 똑같은 거야."

**실용적 결론**: 일반적으로 5~6관절 로봇이 가장 많이 쓰임. 7~8관절은 장애물 회피 등 특수 용도.

---

## 5. DH 4개 파라미터

> **이름의 유래**: Denavit(데나비트) + Hartenberg(하르텐버그) → **DH 파라미터**

어떤 로봇이든 이 4개로 완전히 기술할 수 있다.

### 링크(Link) 때문에 생기는 파라미터 2개

\`\`\`
관절축 i-1 ←─────── 링크 i-1 ───────→ 관절축 i
                  a_{i-1}, α_{i-1}
\`\`\`

**① a (링크 길이, Link Length)**

- 3차원 공간에서 두 관절축 사이의 **공동수선(common perpendicular) 길이**
- 롤케이크 비유: "이 축을 기준으로 롤케이크를 점점 키워. 어느 순간 저 축에 닿는다. 그때 반지름이 a."
- 팔 길이 — 로봇이 만들어지면 고정값

**② α (링크 뒤틀림, Link Twist)**

- 두 관절축이 얼마나 **꼬여있는가** (X축 기준 각도)
- 꼬이지 않으면 α = 0
- 90도 꼬여있으면 α = 90°

> "대부분 0도 아니면 90도야. 32도 꼬인 로봇? 설계하는 사람도 계산하기 너무 힘들어서 아무도 안 만들어."

### 조인트(Joint) 때문에 생기는 파라미터 2개

\`\`\`
링크 i-1 ──→ [조인트 i] ──→ 링크 i
                d_i, θ_i
\`\`\`

**③ d (링크 오프셋, Link Offset)**

- 관절축을 따라(Z방향) 두 링크 사이의 **거리**
- 두 링크가 같은 Z 위치에 있으면 d = 0
- 물리적으로 두 링크가 겹칠 수 없으니 보통 d > 0

**④ θ (관절각, Joint Angle)**

- Z축을 기준으로, 한 링크의 X축과 다음 링크의 X축 사이의 **각도**
- 모터가 돌면 이 값이 바뀜
- 레볼루트 조인트의 **변수**

### 파라미터 요약

| 파라미터 | 기호 | 원인 | 의미 | 레볼루트 | 프리스메틱 |
|---|---|---|---|---|---|
| 링크 길이 | a | 링크 | 두 축 사이 공동수선 길이 | 상수 | 상수 |
| 링크 뒤틀림 | α | 링크 | 두 축의 꼬임 각도 | 상수 | 상수 |
| 링크 오프셋 | d | 조인트 | 축 방향(Z) 링크 간 거리 | 상수 | **변수** |
| 관절각 | θ | 조인트 | X축과 X축 사이 각도 | **변수** | 상수 |

**이해 필수**: 4개 중 3개는 상수, 1개만 변수.

---

## 6. 레볼루트 vs 프리스메틱 — 변수 vs 상수

### 레볼루트 조인트 (회전)

\`\`\`
변수: θ
상수: a, α, d
\`\`\`

모터가 돌면 → 링크 X축이 회전 → θ만 바뀜.  
d는 두 링크가 축 방향으로 이동하지 않으므로 고정.

### 프리스메틱 조인트 (직선)

\`\`\`
변수: d
상수: a, α, θ
\`\`\`

서랍이 나오고 들어가면 → Z 방향 거리만 바뀜 → d만 바뀜.  
θ는 돌지 않으므로 고정.

### 6관절 로봇 파라미터 수

| | 개수 |
|---|---|
| 총 파라미터 | 4 × 6 = **24개** |
| 변수 | **6개** (각 관절당 1개) |
| 상수 | **18개** |

상수 18개는 로봇 설명서에 다 나와 있음. 직접 재지 않아도 됨.

> "로봇 살 때 DH 테이블이 설명서에 다 나와있어. 여러분은 그게 무슨 의미인지만 알면 돼."

---

## 7. 좌표계 부착 규칙

DH 파라미터를 쓰려면 각 링크에 좌표계를 붙여야 한다.  
**좌표계 붙이는 게 가장 어려운 부분.** 붙이고 나면 나머지는 자동으로 풀림.

### 규칙 3가지

**① Z축**: 관절축 i 방향과 일치

\`\`\`
조인트가 이 방향으로 돌면 → Z축을 그 회전축으로
\`\`\`

**② X축**: 링크 방향 (공동수선 방향)

\`\`\`
관절축 i와 관절축 i+1 사이의 공동수선 방향
\`\`\`

**③ Y축**: 오른손 법칙으로 자동 결정

\`\`\`
Y = Z × X
\`\`\`

Y는 신경 쓰지 않아도 됨.

### 원점 위치

좌표계 i의 원점 = 링크 a_i가 관절축 i를 **수직으로 교차하는 지점**

### 예외 처리

**a = 0인 경우** (두 축이 교차): 수선의 발을 내릴 수 없음.  
→ 두 축이 만드는 평면에 수직인 방향을 X로 잡는다.

**베이스 (0번)**: 이전 링크 없음 → a₀ = 0, α₀ = 0으로 설정.  
**끝단 (N번)**: 다음 링크 없음 → aₙ = 0, αₙ = 0으로 설정.  
이유: 정의할 수 없는 건 0으로 잡으면 계산이 제일 쉬움.

> "항상 쉬운 방향으로 값 잡아라. 0 아니면 알기 쉬운 값."

---

## 8. PUMA 560 — 실제 로봇 DH 테이블

PUMA 560 = 최초의 산업용 로봇(Unimate). 6축 레볼루트 관절 전부.  
DH 파라미터 공부할 때 전 세계 교과서에 나오는 표준 예제.

### DH 테이블

> 아래 값은 [강의 슬라이드(Craig 교재 Figure 3.18)](../forward-kinematics/main.md)에서 직접 확인한 값으로 정정함 — α의 부호가 이전 버전과 다르다.

| 조인트 i | α_{i-1} (°) | a_{i-1} | d_i | θ_i |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | **θ₁** |
| 2 | -90 | 0 | 0 | **θ₂** |
| 3 | 0 | a₂ | d₃ | **θ₃** |
| 4 | -90 | a₃ | d₄ | **θ₄** |
| 5 | 90 | 0 | 0 | **θ₅** |
| 6 | -90 | 0 | 0 | **θ₆** |

**읽는 법**:

- α는 전부 0° 또는 ±90° — 예외 없음
- θ 6개가 전부 변수 (레볼루트만 있으니까)
- a₂, a₃, d₃, d₄만 0이 아닌 상수값 (로봇 치수에 따라 다름, PUMA 560 실물 기준으로는 d₃=0)

---

## 9. DH 변환행렬 공식

하나의 관절 i에 대한 DH 변환행렬 T_i (프레임 i-1 → 프레임 i):

\`\`\`
T_i = Rot(z, θ) · Trans(z, d) · Trans(x, a) · Rot(x, α)
\`\`\`

전개하면:

\`\`\`
T_i = | cos θ   -sin θ·cos α    sin θ·sin α   a·cos θ |
      | sin θ    cos θ·cos α   -cos θ·sin α   a·sin θ |
      |   0         sin α          cos α          d    |
      |   0           0              0            1    |
\`\`\`

> **외울 필요 없음**: 공식 전개는 numpy로 계산. 구조만 이해하면 됨.

**이해 필수**: 이 T_i를 N개 곱하면 베이스→손끝 전체 변환행렬이 나옴.

\`\`\`
T_0→N = T_1 · T_2 · · · T_N
\`\`\`

이게 **순기구학 (Forward Kinematics, FK)** — 관절각 → 손끝 위치.

---

## 10. Python 실습 코드

### 완성 코드 — DH 행렬 계산

\`\`\`python
import numpy as np

def dh_matrix(theta_deg, d, a, alpha_deg):
    """
    단일 DH 변환행렬 T (프레임 i-1 → 프레임 i)
    표준 DH 규약: Rot(z,θ) · Trans(z,d) · Trans(x,a) · Rot(x,α)
    """
    theta = np.radians(theta_deg)
    alpha = np.radians(alpha_deg)

    ct, st = np.cos(theta), np.sin(theta)
    ca, sa = np.cos(alpha), np.sin(alpha)

    return np.array([
        [ct, -st * ca,  st * sa,  a * ct],
        [st,  ct * ca, -ct * sa,  a * st],
        [ 0,       sa,       ca,       d],
        [ 0,        0,        0,       1]
    ])


def forward_kinematics(dh_params):
    """
    DH 파라미터 리스트로 베이스→손끝 T 계산
    dh_params: [(θ_deg, d, a, α_deg), ...]
    """
    T = np.eye(4)
    for params in dh_params:
        T = T @ dh_matrix(*params)
    return T


# ── 예제: 2-DOF 평면 팔 (α = 0, d = 0) ──
L1, L2 = 1.0, 0.8   # 링크 길이 (m)
theta1, theta2 = 30, 45  # 관절각 (deg)

dh = [
    (theta1, 0, L1, 0),
    (theta2, 0, L2, 0),
]

T = forward_kinematics(dh)
print("베이스 → 손끝 변환행렬 T:")
print(np.round(T, 4))
print(f"\\n손끝 위치: x = {T[0, 3]:.4f} m, y = {T[1, 3]:.4f} m")

# 예상 출력:
# 손끝 위치: x = 1.2980, y = 0.9232
\`\`\`

### 연습문제

\`\`\`python
# ── 연습 1: dh_matrix 직접 구현 ──
def dh_matrix_manual(theta_deg, d, a, alpha_deg):
    # TODO: 위 공식대로 4x4 numpy 배열 반환
    pass

# 검증:
# dh_matrix_manual(30, 0, 1, 0)이 dh_matrix(30, 0, 1, 0)과 같아야 함
# np.allclose(dh_matrix_manual(30, 0, 1, 0), dh_matrix(30, 0, 1, 0))


# ── 연습 2: 3-DOF 평면 팔 손끝 위치 ──
# L1=1.0, L2=0.8, L3=0.5 (m)
# θ1=30°, θ2=45°, θ3=-30°  (모두 레볼루트, α=0, d=0)
# TODO: dh_params 완성 후 forward_kinematics 호출해서 손끝 XY 출력


# ── 연습 3: 레볼루트 vs 프리스메틱 구분 ──
# 아래 관절 중 변수인 파라미터를 찾아라:
# 관절 A: 레볼루트 (a=0.5, α=90, d=0.2, θ=?)  → 변수: ___
# 관절 B: 프리스메틱 (a=0, α=0, d=?, θ=0)     → 변수: ___
\`\`\`

---

## 핵심 요약 카드

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                   DH 파라미터 4총사                          │
├────────┬──────────┬───────────────────────┬─────────────────┤
│ 기호   │  원인    │  의미                 │ 레볼루트 / 프리  │
├────────┼──────────┼───────────────────────┼─────────────────┤
│   a    │  링크    │ 두 관절축 공동수선 길이│  상수   / 상수  │
│   α    │  링크    │ 두 관절축 꼬임 각도   │  상수   / 상수  │
│   d    │  조인트  │ Z축 방향 링크 간 거리 │  상수   / 변수  │
│   θ    │  조인트  │ X축 기준 관절 회전각  │  변수   / 상수  │
└────────┴──────────┴───────────────────────┴─────────────────┘

좌표계 부착 규칙
  Z_i  → 관절축 i 방향
  X_i  → 공동수선 방향 (링크 방향)
  Y_i  → 오른손 법칙 (자동)

DH 변환행렬 (외울 필요 없음, 구조만)
  T_i = Rot(z,θ) · Trans(z,d) · Trans(x,a) · Rot(x,α)

전체 FK
  T_0→N = T_1 · T_2 · ... · T_N    (행렬 곱)

실무 팁
  α는 거의 무조건 0° 또는 ±90°
  로봇 설명서에 DH 테이블이 항상 포함됨
  좌표계 붙이는 게 전부 — 붙이면 나머지는 계산
\`\`\`

---

*다음 단계*: 좌표계 부착 연습은 [DH 파라미터 연습 — 3링크 평면 팔·원통형 로봇 예제](../dh-parameters-practice/main.md)에서 3링크 평면 팔과 원통형(레볼루트-프리즈매틱-레볼루트) 로봇 두 예제로 직접 풀어본다 → 역기구학(IK) → ROS2 \`joint_states\` 퍼블리시
`,

  'Robotics/dh-parameters-practice': `---
title: DH 파라미터 연습 — 좌표계 부착과 DH 테이블 작성
date: 2026-08-08
tags: dh-parameter, forward-kinematics
order: 
featured: false
draft: false
---

# DH 파라미터 연습 — 좌표계 부착과 DH 테이블 작성

> 출처: 로봇제어공학 강의 (교재: Craig, *Introduction to Robotics* 3장 — Modified DH 표기)
> 대상 독자: [회전행렬](../orientation-representations/main.md)과 동차 변환(Homogeneous Transformation)을 배운 로봇공학 입문자

---

## 목차

1. [왜 DH 파라미터인가](#1-왜-dh-파라미터인가)
2. [DH 파라미터 4개의 정의 — 인덱스가 함정이다](#2-dh-파라미터-4개의-정의--인덱스가-함정이다)
3. [좌표계 부착 규칙 6단계](#3-좌표계-부착-규칙-6단계)
4. [예제 3.3 — RRR 평면 팔](#4-예제-33--rrr-평면-팔-3r-planar-arm)
5. [예제 3.4 — 프리즈매틱 조인트가 있는 원통형 로봇 (RPR)](#5-예제-34--프리즈매틱-조인트가-있는-원통형-로봇-rpr)
6. [예제 3.5 — 축 방향 선택에 따라 DH 값이 달라진다](#6-예제-35--축-방향-선택에-따라-dh-값이-달라진다)
7. [다음 단계 — DH 테이블에서 변환 행렬로](#7-다음-단계--dh-테이블에서-변환-행렬로)
8. [Python 실습 코드](#8-python-실습-코드)
9. [핵심 요약 카드](#9-핵심-요약-카드)

---

## 1. 왜 DH 파라미터인가

새 로봇이 주어졌고 "얘를 제어하고 싶다"면, 가장 먼저 할 일은 **모델링**이다.

- 제어를 위한 모델링의 제일 기초 = 로봇의 기구 구조를 숫자로 표현하기
- 그 표준 방법이 **DH 파라미터(Denavit-Hartenberg Parameters)**

> "팔만 잘 마스터하면 다리도 저절로 마스터가 된다. 팔하고 다리하고 똑같다. 이거 하나로 팔, 다리, 나중에 바퀴까지 다 된다."

핵심 규칙:

- DH 파라미터는 조인트당 **4개** — \`a, α, d, θ\`
- 이 중 **항상 하나만 변수**, 나머지 3개는 로봇을 만드는 순간 고정되는 상수
  - **레볼루트 조인트(Revolute, 회전)** → \`θ\`가 변수
  - **프리즈매틱 조인트(Prismatic, 직선)** → \`d\`가 변수 (리니어 모터, 랙 앤 피니언 등)
- 따라서 실제로 할 일 = **상수 3개 구하기 + 어느 것이 변수인지 표시하기**

> **실용적 결론:** 로봇 모델링 = 각 조인트마다 DH 파라미터 4개를 채운 **테이블 하나** 만들기. [PUMA 560](../denavit-hartenberg-parameters/main.md)처럼 유명한 로봇은 이미 다 풀려 있으므로 갖다 쓰면 된다.

---

## 2. DH 파라미터 4개의 정의 — 인덱스가 함정이다

3.4절 슬라이드("링크계를 부착시키는 규약")의 정의 박스다. 각 파라미터가 왜 생기는지에 대한 개념 설명은 [5. DH 4개 파라미터](../denavit-hartenberg-parameters/main.md)에 정리되어 있다:

| 파라미터 | 정의 | 이름 |
|---|---|---|
| \`aᵢ\` | **X̂ᵢ를 따라** 측정한 Ẑᵢ에서 Ẑᵢ₊₁까지의 거리 | 링크 길이 (link length) |
| \`αᵢ\` | **X̂ᵢ 주위로** 측정한 Ẑᵢ와 Ẑᵢ₊₁ 사이의 각도 | 링크 비틀림 (link twist) |
| \`dᵢ\` | **Ẑᵢ를 따라** 측정한 X̂ᵢ₋₁에서 X̂ᵢ까지의 거리 | 링크 오프셋 (link offset) |
| \`θᵢ\` | **Ẑᵢ 주위로** 측정한 X̂ᵢ₋₁에서 X̂ᵢ 사이의 각도 | 관절각 (joint angle) |

> "로봇을 설계하거나 제어할 때 이 표만 알면 된다. 인터넷에 너무 흔하니까 딱 갖다 놓고 보면 된다."

### 구조로 이해하기 (외우지 말고)

- **앞의 두 개 (\`a\`, \`α\`) — 링크 때문에 생긴다**
  - 링크는 X축을 따라감
  - X축 기준으로 "다음 Z축까지 얼마나 멀고(a), 얼마나 비틀렸는가(α)"
  - → 인덱스 \`(i, i+1)\`
- **뒤의 두 개 (\`d\`, \`θ\`) — 조인트 때문에 생긴다**
  - 조인트는 앞 링크와 뒤 링크 사이에 있음
  - Z축(관절 축) 기준으로 "앞 X축과 뒤 X축이 얼마나 떨어졌고(d), 얼마나 돌아갔는가(θ)"
  - → 인덱스 \`(i−1, i)\`

### ⚠ 인덱스 함정

> "나도 맨날 헷갈려. 지금도 쓰다 보면 가끔 헷갈려. 조심하세요. 중간고사 볼 때 분명히 나랑 똑같은 걸 겪는다."

정의는 \`aᵢ, αᵢ\`인데 **DH 테이블의 열 이름은 \`αᵢ₋₁, aᵢ₋₁, dᵢ, θᵢ\`** 다:

\`\`\`
i번째 행:  α(i-1)   a(i-1)   d(i)   θ(i)
1행이면:   α₀       a₀       d₁     θ₁
\`\`\`

- 앞 두 열 = **이전 링크** 번호 (i−1)
- 뒤 두 열 = **현재 조인트** 번호 (i)

해결책은 단순하다 — 정의 박스를 복사해서 **문제 페이지 위에 붙여놓고** 그대로 대입하며 읽는다.

> "이거 진짜 꿀팁이다. 이렇게 하면 절대 안 헷갈린다. 시험 볼 때만 외우면 되고, 사회에 나가서는 아무도 외워서 안 쓴다. 갖다 쓰는 거다."

**암기/이해 구분:**

| 구분 | 대상 |
|---|---|
| 이해할 것 | 정의 4개의 구조 (링크 쌍 \`a,α\` vs 조인트 쌍 \`d,θ\`) |
| 외울 것 | 레볼루트 → θ 변수, 프리즈매틱 → d 변수 |
| 외우지 말 것 | 인덱스 배치 — 표를 옆에 두고 보면서 쓴다 |

---

## 3. 좌표계 부착 규칙 6단계

> "구하는 게 아니고 잡는 거다. 책에서는 Attach, 붙인다는 표현도 쓴다. 여러분이 갖다 붙이는 거고, 정하는 거다."

어디에 붙여도 틀린 게 아니지만, 쉬운 선택이 있다. 슬라이드의 6단계 요약 (강의 약 12~24분 구간):

1. **관절 축을 정한 후, 축을 통과하는 무한 직선을 상상하라(혹은 그려라).** 서로 이웃하는 두 축 (i, i+1)을 고려한다.
2. **두 직선의 공통 법선(수선의 발) 혹은 교차점 → 계의 원점.** 3차원 공간의 두 직선 사이에는 양쪽 모두에 수직인 공통 법선을 세울 수 있다.
3. **Ẑᵢ축 = i번째 관절 축**
   - 레볼루트 조인트 → **회전축**이 Z
   - 프리즈매틱 조인트 → **이동(직선 운동) 방향**이 Z ← [예제 3.4](#5-예제-34--프리즈매틱-조인트가-있는-원통형-로봇-rpr)의 핵심
4. **X̂ᵢ축 = 공통 법선 방향.** 두 Z축이 교차(또는 중첩)하면 두 축을 포함하는 평면에 **수직**으로 잡는다. (PUMA 560의 4·5·6번 축처럼 한 점에서 만나는 경우에 쓰는 규칙)
5. **Ŷᵢ축 = 오른손 좌표계 완성.** 정의 박스에 Y는 아예 등장하지 않으므로 사실상 신경 쓸 일이 없다.
6. **첫 번째 관절 변수가 0일 때 {0}과 {1}이 겹치도록** 기준 좌표계 {0}을 잡는다. 가능한 한 많은 파라미터가 0이 되도록.

### 왜 {0}을 {1}에 겹치게 잡는가

- {0} = 베이스에 고정된 절대 기준 (안 움직임)
- {1} = 첫 관절과 함께 도는 좌표계
- 둘을 겹쳐 놓으면 → \`α₀ = a₀ = d₁ = 0\` → **테이블 첫 행이 \`0, 0, 0, θ₁\`**
- 모터 높이만큼 d₀를 만들어 봐야 계산에 의미가 없다
- 실제로 대부분의 DH 테이블 첫 행이 \`0 0 0 θ₁\`인 이유

θ = 0인 "원점 포즈"도 잡는 것이다:

- 예: 팔이 땅과 나란할 때를 0°로 잡으면 직관적
- 물체는 보통 땅 쪽에 있으므로 나중에 작업할 때도 편하다

> **실용적 결론:** Z축(관절 축) 먼저 → X축(링크 방향/공통 법선) → 원점은 계산이 편해지는 곳. "쉬운 방향으로 선택하라"가 공식 규칙이다.

---

## 4. 예제 3.3 — RRR 평면 팔 (3R Planar Arm)

교재 Figure 3.6/3.7 (강의 약 26~45분 구간).

**구조:**

- 레볼루트 조인트 3개, 회전축이 모두 화면에서 튀어나오는 방향(서로 평행) → 평면 매니퓰레이터
- 링크 길이 L₁, L₂
- 끝에 손가락 두 개짜리 **그리퍼(gripper)** — "손"이라고 부르지 않고 그리퍼라고 부른다

**좌표계 부착:**

- Ẑ₁, Ẑ₂, Ẑ₃ = 각 관절의 회전축 (모두 화면에서 튀어나오는 방향)
- Ẑ₀는 Ẑ₁과 겹치게
- X̂축들은 링크를 따라 잡는다

**DH 테이블 (판서로 완성한 결과):**

| i | αᵢ₋₁ | aᵢ₋₁ | dᵢ | θᵢ |
|---|------|------|-----|-----|
| 1 | 0 | 0 | 0 | **θ₁** |
| 2 | 0 | L₁ | 0 | **θ₂** |
| 3 | 0 | L₂ | 0 | **θ₃** |

**읽는 법 (2행을 예로):**

| 칸 | 정의 대입 | 값 | 이유 |
|---|---|---|---|
| \`α₁\` | X̂₁ 주위로 Ẑ₁ ↔ Ẑ₂ 각도 | 0° | 두 축이 평행 |
| \`a₁\` | X̂₁을 따라 Ẑ₁ → Ẑ₂ 거리 | L₁ | 링크 길이 |
| \`d₂\` | Ẑ₂를 따라 X̂₁ → X̂₂ 거리 | 0 | 평면 로봇, 높이 차 없음 |
| \`θ₂\` | Ẑ₂ 주위로 X̂₁ ↔ X̂₂ 각도 | **θ₂ (변수)** | 관절이 돌면 계속 변함 |

⚠ **θ₂의 기준 조심:** θ₂는 X̂₁(앞 링크의 X축)을 기준으로 X̂₂가 얼마나 돌아갔는지다. X̂₀ 기준이 아니다. 절대 각도가 아니라 **상대 각도**다.

**직관 검증:** 테이블을 채웠으면 머릿속으로 포즈를 시뮬레이션해서 말이 되는지 확인한다.

- θ₁=θ₂=θ₃=0 → 팔이 일자로 쭉 뻗은 포즈
- θ₁=90° → 팔 전체가 위로 들림
- 추가로 θ₂=90° → 팔꿈치가 90°로 꺾임

**실제 로봇에서는:** 모터 몸체 두께 때문에 링크가 같은 평면에 있지 않아 **d가 0이 아닌 값으로 생긴다**. 이 예제는 옆에서 본 그림을 평면으로 눌러 그렸기 때문에 d=0인 것.

---

## 5. 예제 3.4 — 프리즈매틱 조인트가 있는 원통형 로봇 (RPR)

교재 Figure 3.9/3.10 (강의 약 49~62분 구간). 자유도 3: 회전(J1) + 직선 왕복(J2, 프리즈매틱) + 끝단 회전(J3).

> "나도 솔직히 이렇게 배우고 나서 프리즈매틱 조인트 예제를 딱 만나니까 어떻게 해야 될지 감이 전혀 없더라. 근데 예제를 풀면 바로 된다."

**작업 공간 직관:**

- 몸통이 빙글 돈다(J1) + 팔이 앞뒤로 뻗는다(J2)
- → 손끝이 지나간 공간 = **원반**, 위아래까지 고려하면 **원통**
- 그래서 '원통형(cylindrical)' 로봇
- 대표 사례: 반도체 라인에서 웨이퍼(wafer)를 집어 나르는 로봇

**좌표계 부착 — 프리즈매틱은 이동 방향이 Z:**

- J1 (레볼루트): 회전축 → Ẑ₁ (수직 방향). Ẑ₀는 겹치게
- **J2 (프리즈매틱): 팔이 앞뒤로 미끄러지는 방향 → Ẑ₂** ← 이 예제의 전부
- J3 (레볼루트): 끝단이 드라이버처럼 도는 회전축 → Ẑ₃ (Ẑ₂와 같은 방향)
- 프리즈매틱의 원점(d₂=0 위치) = **팔이 끝까지 들어갔을 때** — 회전 예제에서 땅을 0°로 잡은 것과 같은 "편한 선택"
- X̂₁과 X̂₂는 **일부러 평행하게** — 그러면 θ₂(상수)가 0이 되어 테이블이 깨끗해진다. 비틀어 잡아도 틀린 건 아니지만 상수 하나가 쓸데없이 생긴다

**DH 테이블 (슬라이드 완성본):**

| i | αᵢ₋₁ | aᵢ₋₁ | dᵢ | θᵢ |
|---|------|------|-----|-----|
| 1 | 0 | 0 | 0 | **θ₁** |
| 2 | 90° | 0 | **d₂** | 0 |
| 3 | 0 | 0 | L₂ | θ₃ |

**읽는 법 (2행):**

| 칸 | 정의 대입 | 값 | 이유 |
|---|---|---|---|
| \`α₁\` | X̂₁ 주위로 Ẑ₁ ↔ Ẑ₂ 각도 | 90° | 수직 회전축과 수평 이동축이 직교 (부호는 오른손 법칙) |
| \`a₁\` | X̂₁을 따라 Ẑ₁ → Ẑ₂ 거리 | 0 | 두 축이 교차 |
| \`d₂\` | Ẑ₂를 따라 X̂₁ → X̂₂ 거리 | **d₂ (변수)** | 팔이 미끄러지면 계속 변함 |
| \`θ₂\` | Ẑ₂ 주위로 X̂₁ ↔ X̂₂ 각도 | 0 (상수) | 평행하게 잡았으므로 |

3행의 \`d₃ = L₂\`: Ẑ₃를 따라 X̂₂에서 X̂₃까지가 기구적으로 L₂만큼 떨어져 고정 (상수). 변수는 끝단 회전 θ₃.

> **실용적 결론:** 프리즈매틱 조인트를 만나면 ① Z축 = 이동 방향, ② d가 변수·θ는 상수, ③ 원점은 스트로크 끝단(들어간 위치)으로. 이 세 가지면 끝난다.

---

## 6. 예제 3.5 — 축 방향 선택에 따라 DH 값이 달라진다

교재 Figure 3.12/3.14 (강의 약 63~68분 구간). 레볼루트 3개인데 축 1·2는 교차하고 축 2·3은 평행한 **비평면(nonplanar)** 구조.

**핵심 메시지:**

- Ẑ₂의 +방향 → 두 가지 선택 가능
- X̂₁의 방향 → 두 가지 선택 가능
- 2 × 2 = **총 4가지 유효한 좌표계 배치**, 각각 DH 파라미터 값이 다르다

Figure 3.14의 두 배치 비교:

| | 배치 A | 배치 B |
|---|---|---|
| a₁ | 0 | 0 |
| α₁ | **+90°** | **−90°** |
| d₁ | 0 | 0 |
| a₂ | L₂ | L₂ |
| α₂ | 0 | 0 |
| d₂ | **L₁** | **−L₁** |
| θ₂ | **+90° 오프셋** | **−90° 오프셋** |

같은 로봇인데 부호가 뒤집힌다 = **DH 파라미터는 유일하지 않다 (not unique)**.

> "로봇은 똑같은데 관점을 어디로 보냐에 따라서 DH 파라미터가 달라진다. 그렇다고 제어가 완전히 달라지냐? 그건 아니다. 결국 똑같은 결과를 내지만 표현 방법이 달라질 수 있다는 거다."

> **실용적 결론:** 남이 만든 DH 테이블을 가져다 쓸 때는 **어떤 축 방향 규약으로 잡았는지**를 반드시 함께 확인해야 한다. 값만 보고 내 좌표계에 대입하면 부호가 틀어진다. 어느 배치든 하나를 골라 **일관되게** 쓰면 된다.

---

## 7. 다음 단계 — DH 테이블에서 변환 행렬로

DH 테이블 작성은 중간 단계다 (강의 마지막 68분~ 구간, 교재 3.5절 "머니퓰레이터 기구학").

**이걸 만든 진짜 목적:**

1. 각 행의 파라미터 4개(링크 길이 aᵢ₋₁, 링크 뒤틀림 αᵢ₋₁, 링크 오프셋 dᵢ, 관절각 θᵢ)로 **관절별 동차 변환 행렬** \`ⁱ⁻¹ᵢT\` (4×4 homogeneous transformation matrix)를 만든다
   - 변환은 1개의 변수와 3개의 상수의 함수
   - 행렬 공식 자체는 [9. DH 변환행렬 공식](../denavit-hartenberg-parameters/main.md)에 정리되어 있다
2. 체인으로 곱하면 **베이스 → 손끝** 변환:

\`\`\`
⁰ₙT = ⁰₁T · ¹₂T · ²₃T · … · ⁿ⁻¹ₙT
\`\`\`

3. **왜 필요한가 — 펜 잡기 시나리오:**
   - 베이스 → 책상: 고정되어 있으니 이미 앎
   - 책상 → 펜: 카메라로 앎
   - **베이스 → 손끝: 이게 필요함** ← DH 파라미터로 만드는 순기구학(Forward Kinematics, FK)
   - 손끝 좌표계를 펜 좌표계에 일치시키면 = 잡는 것

이 변환 행렬 유도가 다음 강의 내용이다.

---

## 8. Python 실습 코드

### 완성 코드 — Modified DH로 FK 계산

\`\`\`python
import numpy as np

def dh_transform(alpha_prev, a_prev, d, theta):
    """Craig의 Modified DH 규약: i-1 → i 동차 변환 행렬 (4x4).
    테이블의 한 행 (α_{i-1}, a_{i-1}, d_i, θ_i)을 그대로 넣으면 된다."""
    ca, sa = np.cos(alpha_prev), np.sin(alpha_prev)
    ct, st = np.cos(theta), np.sin(theta)
    return np.array([
        [ct,    -st,    0,   a_prev],
        [st*ca,  ct*ca, -sa, -sa*d ],
        [st*sa,  ct*sa,  ca,  ca*d ],
        [0,      0,      0,   1    ],
    ])

def fk(dh_rows):
    """DH 테이블(행 리스트)을 받아 베이스→손끝 변환을 반환."""
    T = np.eye(4)
    for row in dh_rows:
        T = T @ dh_transform(*row)
    return T

# ── 예제 3.3: RRR 평면 팔 (L1=1.0, L2=0.5) ──
L1, L2 = 1.0, 0.5
th1, th2, th3 = np.deg2rad([90, 90, 0])   # 팔을 들고 팔꿈치 90° 꺾기

table = [
    # (α_{i-1}, a_{i-1}, d_i, θ_i)
    (0, 0,  0, th1),
    (0, L1, 0, th2),
    (0, L2, 0, th3),
]
T = fk(table)
print("손끝 위치:", np.round(T[:3, 3], 4))   # 직관 검증: (-0.5, 1.0, 0) 근처가 나와야 함
\`\`\`

### 연습문제

\`\`\`python
# ── 연습 1: 예제 3.4 (RPR 원통형)의 DH 테이블을 코드로 옮겨라 ──
def rpr_fk(theta1, d2, theta3, L2=0.3):
    # TODO: 5절의 테이블 3행을 dh_transform으로 곱해서 반환
    #       힌트: 2행은 (np.pi/2, 0, d2, 0)
    pass

# 검증: theta1=0, d2=0.2일 때 손끝이 원통 좌표 (r, φ, z)로 말이 되는지 확인

# ── 연습 2: DH 파라미터의 비유일성 확인 (예제 3.5) ──
# TODO: 6절 배치 A와 배치 B의 파라미터로 각각 FK를 계산하고,
#       같은 관절값에서 손끝 "위치"가 동일하게 나오는지 비교하라.
#       (θ2에 ±90° 오프셋을 넣는 것을 잊지 말 것)

# ── 연습 3: 직관 시뮬레이션 ──
# TODO: 예제 3.3에서 θ=(0,0,0), (90°,0,0), (90°,90°,0)일 때
#       손끝 위치를 출력하고, 4절의 "포즈 상상"과 일치하는지 확인하라.
\`\`\`

**실무 연결:**

- ROS/MoveIt에서는 DH 대신 URDF(조인트별 원점+축 벡터)로 기구를 기술한다
- 하지만 로봇 제조사 매뉴얼과 논문은 여전히 DH 테이블로 사양을 준다
- **Standard DH**(Spong 계열)와 **Modified DH**(Craig 계열, 이 강의)가 공존 — 남의 테이블을 쓸 때는 어느 규약인지부터 확인할 것. [예제 3.5의 비유일성](#6-예제-35--축-방향-선택에-따라-dh-값이-달라진다) 문제가 규약 차원에서 한 번 더 발생하는 셈이다

---

## 9. 핵심 요약 카드

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ DH 파라미터 (조인트당 4개, 항상 1개만 변수)                    │
│   aᵢ  = X̂ᵢ 따라 잰 Ẑᵢ→Ẑᵢ₊₁ 거리   (링크 길이)   ┐ 링크 쌍     │
│   αᵢ  = X̂ᵢ 주위 Ẑᵢ↔Ẑᵢ₊₁ 각도      (링크 비틀림) ┘ (i, i+1)   │
│   dᵢ  = Ẑᵢ 따라 잰 X̂ᵢ₋₁→X̂ᵢ 거리   (링크 오프셋) ┐ 조인트 쌍   │
│   θᵢ  = Ẑᵢ 주위 X̂ᵢ₋₁↔X̂ᵢ 각도      (관절각)     ┘ (i-1, i)   │
│                                                             │
│ 변수 규칙:  레볼루트 → θ 변수  /  프리즈매틱 → d 변수          │
│ 테이블 열:  αᵢ₋₁  aᵢ₋₁  dᵢ  θᵢ   (앞 둘은 i-1, 뒤 둘은 i!)   │
│                                                             │
│ 좌표계 잡기 (구하는 게 아니라 "잡는" 것):                      │
│   Z = 관절 축 (회전축 / 프리즈매틱은 이동 방향)                │
│   X = 두 Z축의 공통 법선(수선의 발), 교차 시 평면에 수직        │
│   Y = 오른손 법칙 (정의에 안 나옴, 무시)                       │
│   {0} = {1}과 겹치게 → 첫 행은 대부분 0 0 0 θ₁               │
│                                                             │
│ 주의: DH 파라미터는 유일하지 않다 — 축 +방향 선택에 따라        │
│       부호가 바뀜. 남의 테이블은 축 규약부터 확인.              │
│                                                             │
│ 용도: 각 행 → 4×4 동차 변환 ⁱ⁻¹ᵢT → 체인 곱 = FK (다음 강의)  │
└─────────────────────────────────────────────────────────────┘
\`\`\`
`,

  'Robotics/forward-kinematics': `---
title: 정기구학과 PUMA 560 (Forward Kinematics)
date: 2026-08-08
tags: forward-kinematics, puma560
order: 
featured: false
draft: false
---

# 정기구학과 PUMA 560 (Forward Kinematics)

> 출처: 로봇제어공학 — Introduction to Robotics (Craig) 3장 예제설명
> 영상: https://www.youtube.com/watch?v=yWFbpumF4QM
> 대상: [DH 파라미터](../denavit-hartenberg-parameters/main.md)와 [좌표계 부착 연습](../dh-parameters-practice/main.md)을 마친 학습자. DH 테이블에서 출발해 링크 변환행렬을 유도하고, 실제 산업용 로봇(PUMA 560)의 정기구학까지 완성한다.

---

## 목차

1. [복습 — 애매한 축 부착은 '선택'의 문제](#1-복습--애매한-축-부착은-선택의-문제)
2. [링크 변환행렬 유도 — 중간 좌표계 {R}, {Q}, {P}](#2-링크-변환행렬-유도--중간-좌표계-r-q-p)
3. [DH 테이블 → 변환행렬 — 기계적 대입](#3-dh-테이블-→-변환행렬--기계적-대입)
4. [링크 변환 연결 — 정기구학의 완성](#4-링크-변환-연결--정기구학의-완성)
5. [세 가지 공간 — 액추에이터·조인트·직교좌표](#5-세-가지-공간--액추에이터·조인트·직교좌표)
6. [PUMA 560 ① — 좌표계 부착과 DH 테이블](#6-puma-560-①--좌표계-부착과-dh-테이블)
7. [PUMA 560 ② — 변환행렬 조합 전략](#7-puma-560-②--변환행렬-조합-전략)
8. [야스카와 모토맨 L-3 — 액추에이터 공간이 분리된 로봇](#8-야스카와-모토맨-l-3--액추에이터-공간이-분리된-로봇)
9. [표준 좌표계 이름 5가지](#9-표준-좌표계-이름-5가지)
10. [Python 실습 코드](#10-python-실습-코드)
11. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 복습 — 애매한 축 부착은 '선택'의 문제

[좌표계 부착 규칙](../dh-parameters-practice/main.md)대로 축을 붙이다 보면 "유일하게 정해지지 않는" 상황이 나온다. 이 강의는 그 두 가지 경우를 복습하며 시작한다.

### 두 Z축이 한 점에서 직교할 때 — X축은 둘 중 하나

- 두 직선(Zᵢ, Zᵢ₊₁)이 교차하면 하나의 **평면**이 만들어진다.
- X축은 이 평면에 **수직**으로 잡으면 되는데, 수직인 방향은 **두 가지**다 (이 방향 아니면 저 방향).
- 어느 쪽을 잡아도 규칙 위반이 아니다. 다만 X 방향 선택에 따라 뒤에서 구할 α의 **부호**가 달라진다.

### 두 Z축이 완전히 겹칠 때 — X축은 방사형 아무 방향

- Z₂와 Z₃가 겹쳐 있으면 두 축에 동시에 수직인 선은 방사형으로 무수히 많다.
- 아무거나 잡아도 되므로, 보통 **앞 좌표계의 X축과 평행하게** 잡아 계산을 단순화한다.

### Z축 방향 선택의 의미

Z축을 어느 쪽으로 잡아도 되는 이유는, 그 선택이 물리적 구조를 바꾸는 게 아니라 **회전의 + 방향 정의**를 바꾸는 것뿐이기 때문이다.

> 회전 방향을 Z축을 이쪽 방향이냐 이쪽 방향으로 잡는다는 의미는 그거예요. 시계 방향을 플러스로 할 거냐 반시계 방향을 플러스로 할 거냐, 그런 느낌이야.

**실무 한 줄**: 축 부착이 유일하지 않아도 당황하지 말 것 — 어떤 선택이든 일관되게만 쓰면 정기구학 결과(손끝 위치)는 같다. [축 선택에 따라 DH 값이 달라지는 예제](../dh-parameters-practice/main.md)에서 이미 확인한 내용이다.

---

## 2. 링크 변환행렬 유도 — 중간 좌표계 {R}, {Q}, {P}

### 왜 필요한가

[DH 파라미터 4개](../denavit-hartenberg-parameters/main.md) (a, α, d, θ)로 테이블을 만들었다. 3장의 제목이 기구학인 이유가 여기서 나온다.

> 이거 하려고 지금까지 그 고생을 한 거예요.

목표: 좌표계 {i−1}에서 표현된 점을 좌표계 {i}에서 표현하는 **변환행렬(transformation matrix)** ⁱ⁻¹ᵢT를 DH 파라미터 4개만으로 만들어내는 것.

### 유도 아이디어 — 연쇄 변환 (Figure 3.15)

2장에서 연습한 "A좌표계 → B좌표계 → C좌표계 → D좌표계" 연쇄 변환을 그대로 쓴다. {i−1}과 {i} 사이에 **중간 좌표계 3개** {R}, {Q}, {P}를 끼워 넣는다:

| 단계 | 중간 좌표계 | 무엇을 하나 | 왜 그 축인가 |
|---|---|---|---|
| 1 | {R} | Xᵢ₋₁축 기준으로 **αᵢ₋₁만큼 회전** | 링크 뒤틀림 α는 원래 X축 기준 비틀림으로 정의됐으므로 |
| 2 | {Q} | X축을 따라 **aᵢ₋₁만큼 이동** (회전 없음) | 링크 길이 a는 X축 방향 거리 |
| 3 | {P} | Z축 기준으로 **θᵢ만큼 회전** | 관절각 θ는 Z관절축 기준 회전 |
| 4 | {i} | Z축을 따라 **dᵢ만큼 이동** | 링크 오프셋 d는 Z축 방향 거리 |

4단계를 거치면 {i−1}이 {i}와 딱 일치한다. 즉:

$$
{}^{i-1}_{i}T = {}^{i-1}_{R}T \\; {}^{R}_{Q}T \\; {}^{Q}_{P}T \\; {}^{P}_{i}T = R_X(\\alpha_{i-1}) \\, D_X(a_{i-1}) \\, R_Z(\\theta_i) \\, D_Z(d_i)
$$

### 각 단계가 단순한 이유

4×4 변환행렬 4개의 곱이라 힘들어 보이지만, **각 단계가 회전 하나 또는 이동 하나뿐**이라 각 행렬은 아주 단순하다. 책 표기대로 cos = C, sin = S로 줄여 쓴다.

- **R_X(αᵢ₋₁)**: 원점이 겹친 채 X축으로 회전만 → 3×3 회전행렬 밑에 0 0 0, 옆에 이동 성분 0, 구석에 1을 붙여 4×4로.
  - 3차원 공간에서 꼬여 있어 보여도 결국 **한 축(X)으로만** 도는 것이라 식이 간단하다.
- **D_X(aᵢ₋₁)**: 회전 없음 → 3×3 자리는 단위행렬, 이동은 X방향 aᵢ₋₁만 (y, z 방향 0).
- **R_Z(θᵢ)**: Z축 회전행렬.

> 이거 구할 수 있겠지? 구해보라고, 여러분.

- **D_Z(dᵢ)**: 단위행렬 + Z방향 dᵢ 이동.

### 곱한 결과 — 링크 변환행렬 (Craig, Modified DH)

책에서 4개를 실제로 곱해준 결과:

$$
{}^{i-1}_{i}T =
\\begin{bmatrix}
C\\theta_i & -S\\theta_i & 0 & a_{i-1} \\\\
S\\theta_i \\, C\\alpha_{i-1} & C\\theta_i \\, C\\alpha_{i-1} & -S\\alpha_{i-1} & -S\\alpha_{i-1} \\, d_i \\\\
S\\theta_i \\, S\\alpha_{i-1} & C\\theta_i \\, S\\alpha_{i-1} & C\\alpha_{i-1} & C\\alpha_{i-1} \\, d_i \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

[이전 노트의 DH 변환행렬 공식](../denavit-hartenberg-parameters/main.md)과 같은 식이며, 이번 강의에서 그 유도 과정이 채워졌다.

**외울 것 / 이해할 것 / 도구가 할 것**:
- **이해**: 왜 R_X → D_X → R_Z → D_Z 순서인지 (중간 좌표계 4단계). 이 식이 왜 나왔는지만 이해하면 된다.
- **외울 필요 없음**: 중간 4개 행렬(R_X, D_X, R_Z, D_Z)의 전개와 최종 행렬의 각 항.
- **단, 이 최종 공식 자체는 계속 쓰게 된다**:

> 여러분은 나중에 로봇 설계할 때 이걸 기억을 해야지. 이거를 계속 쓸 거고요. (…) 얘는 갖다 쓸 일이 많아요, 여러분 앞으로.

### 조심할 점 — 넷 중 하나만 변수

행렬 안의 a, α, θ, d 네 기호 중 **하나만 변수, 나머지 셋은 상수**다 (로봇을 만들면 딱 정해진다).
- [레볼루트 조인트면 θ가 변수, 프리스메틱이면 d가 변수](../denavit-hartenberg-parameters/main.md).
- 변수 자리는 숫자가 아니라 **기호 그대로** 남는다 (\`3\`이 아니라 \`3·sinθ\`처럼). 링크가 여러 개면 이런 4×4가 링크 수만큼 있고 각 행렬마다 변수가 들어 있어 연산이 폭발적으로 복잡해진다.

**실무 한 줄**: 손 유도는 한 번이면 충분하고, 실전에서는 이 최종 공식에 DH 테이블 값을 대입만 한다.

---

## 3. DH 테이블 → 변환행렬 — 기계적 대입

[RPR 원통형 로봇 예제](../dh-parameters-practice/main.md)의 DH 테이블 (Figure 3.10)로 대입 연습:

| i | αᵢ₋₁ | aᵢ₋₁ | dᵢ | θᵢ |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | θ₁ |
| 2 | 90° | 0 | d₂ | 0 |
| 3 | 0 | 0 | L₂ | θ₃ |

1행 (0, 0, 0, θ₁)을 위 공식에 넣으면:
- α = 0 → Cα = 1, Sα = 0 → 2·3행의 Sα 항들이 전부 0, Cα 항은 1.
- d = 0 → 이동 성분 0.
- 남는 것은 Cθ₁, Sθ₁뿐 → 순수 Z축 회전행렬이 즉시 나온다.

2행은 α 자리에 90°, d 자리에 d₂, θ 자리에 0을 넣으면 끝.

> 계산을 해보세요. 넣어주면 이렇게 계산이 나온다고. 아, 이게 이 그림이구나 — 중간에 d가 있는 거 보니까.

**실무 한 줄**: DH 테이블만 정확하면 개별 변환행렬 생성은 완전히 기계적인 작업이다 — 사람이 하는 판단은 테이블 작성(축 부착)까지다.

---

## 4. 링크 변환 연결 — 정기구학의 완성

### 전부 곱하면 베이스 → 손끝

개별 링크 변환을 전부 곱하면 0번 좌표계(움직이지 않는 베이스)에서 맨 끝 좌표계(손끝)까지의 변환이 나온다:

$$
{}^{0}_{N}T = {}^{0}_{1}T \\; {}^{1}_{2}T \\; {}^{2}_{3}T \\cdots {}^{N-1}_{N}T
$$

이 행렬 안에는 관절 변수(θ 혹은 d)가 들어 있다. **관절을 바꾸면 손끝 위치가 바뀐다**는 사실이 수식 그대로 담겨 있는 것이다.

### 왜 이게 중요한가 — 작업 시나리오

로봇이 테이블 위의 펜을 잡으려면 세 가지 변환이 필요한데, 각각 구하는 방법이 다르다:

| 변환 | 어떻게 구하나 |
|---|---|
| 베이스 → 테이블 | **자로 잰다.** 로봇과 테이블은 공장에 고정 — "공장이 부서지지 않는 이상" 상수 |
| 테이블 → 작업물(펜) | **카메라·센서로 측정.** 작업물 위치는 계속 바뀌므로 |
| 베이스 → 손끝 | **방금 배운 DH 파라미터로 계산** |

그러면 남는 질문은 하나다: *손끝이 펜 위치에 도달하려면 각 관절의 θ를 얼마로 해야 하나?* — 이게 다음 장(역기구학)의 목표다.

### 이름 정리 — 정기구학과 역기구학

- **정기구학 (forward kinematics)**: θ를 이렇게 주면 손끝이 어디에 가 있나? (이번 강의 내용. 대입만 하면 바로 나온다)
- **역기구학 (inverse kinematics)**: 손끝이 여기에 가 있으려면 각도가 얼마여야 하나? (4장)

> 정기구학은 너무 당연해서 정 자 빼고 그냥 기구학이라고 하고, 역기구학을 4장에서 배워요. (…) 4장까지가 중간고사예요.

**실무 한 줄**: 정기구학은 항상 유일해가 바로 나오는 계산이고, 어려운 쪽(풀어야 하는 쪽)은 역기구학이다.

---

## 5. 세 가지 공간 — 액추에이터·조인트·직교좌표

### '공간(space)'이라는 말에 겁먹지 말 것

여기서 공간은 **변수가 변할 수 있는 범위**라는 뜻이다.

| 공간 | 벡터 | 예 |
|---|---|---|
| **조인트 공간 (joint space)** | 관절 벡터 (θ₁, θ₂, θ₃, …) | θ₁ ∈ [−180°, 180°], θ₂ ∈ [−90°, 90°] … |
| **직교좌표 공간 (cartesian space)** = 작업 공간(workspace), 조작 공간 | 손끝 포즈 (x, y, z, roll, pitch, …) | 손끝이 도달 가능한 3차원 범위 |
| **액추에이터 공간 (actuator space)** | 액추에이터 벡터 (φ₁, φ₂, …) | 모터가 실제로 도는 양 |

### 오늘 배운 것의 정체 — 조인트 공간 → 직교좌표 공간 매핑

관절 벡터의 θ 하나를 바꾸면 실제 결과물은 **작업 공간에서의 손끝 위치 변화**다. 그 매핑이 바로 변환행렬이고, 이 방향(조인트 → 직교좌표)의 매핑이 정기구학이다 (Figure 3.16).

### 액추에이터 공간은 왜 따로 있나 — 스크류 예시

지금까지는 솔직히 모터를 생각하지 않았다. 그런데 모터에 나사선(스크류) 축을 달고 너트 블록을 끼우면:

- 모터가 **회전(φ)** 하면 → 블록이 **직선(d)으로 전진/후진**한다 (나사를 돌리면 들어가고 나오는 것과 같은 원리).
- 리니어 모터를 만드는 제일 쉬운 방법이라 공장에서 직선 이동 장치에 많이 쓴다.
- 이때 d는 φ와 나사선 피치(간격)로 **계산해줘야** 하고, 모터 회전량과 관절 변수가 1:1이 아니다.

액추에이터 벡터와 관절 벡터가 조금이라도 다르면 둘 사이를 연결하는 행렬이 또 필요하다.

> 다행인 건, 이거는 안 한다 우리는. 여러분이 나중에 회사 가서 로봇을 만들거나 할 때는 이것도 신경 써줘야 된다 라는 얘기만 할게요.

**실무 한 줄**: 이 수업의 기구학은 조인트 공간 ↔ 직교좌표 공간만 다룬다. 액추에이터 매핑은 실무(로봇 제작) 단계의 몫.

---

## 6. PUMA 560 ① — 좌표계 부착과 DH 테이블

### 왜 PUMA 560인가

시험에 나올 로봇은 두 개 — PUMA 560과 야스카와 모토맨 L-3.

> 이것만 마스터하면 돼. 퓨마만 마스터해주면, 인터넷에 퓨마 관련된 유튜브 영상 되게 많거든요.

[이전 노트에서 소개된 PUMA 560](../denavit-hartenberg-parameters/main.md)을 이번에는 처음부터 끝까지 직접 부착·작성한다.

### 관절 구조 파악 (6 DOF, 전부 레볼루트)

1. **관절 1**: 몸통이 수직축 기준으로 회전
2. **관절 2**: 팔이 위아래로 움직임
3. **관절 3**: 팔꿈치 축
4. **관절 4·5·6**: 손끝(손목)에 3개 축이 몰려 있음 — 축 하나로 손목 통이 돌고(Z₄), 옆 방향 축으로 꺾이고(Z₅), 맨 끝이 다시 돎(Z₆)

손목 3축이 한 점에 모인 구조를 **구형 손목 (spherical wrist, 구 스피리컬 조인트)** 이라 부른다 (Figure 3.20).

### 축 부착 — 몸통 쪽 (1~3)

- **Z₀는 신경 쓰지 않는다** — Z₁과 겹치게 잡는 관례 그대로 ([이유는 연습 노트 참고](../dh-parameters-practice/main.md)).
- Z₁과 Z₂가 한 점에서 직교 → 원점을 그 교점에 잡는다. 교재 그림에서 원점이 떨어져 그려진 것은 "겹쳐 있다"는 뜻의 표기일 뿐이다.

> 그래서 이 원점이 여기에 겹쳐 있어요 라는 뜻으로 그림을 이렇게 한 거예요. 이런 표시는 없어 세상에.

- X₁·X₂는 [1절](#1-복습--애매한-축-부착은-선택의-문제)의 규칙대로 두 Z축 평면에 수직인 두 방향 중 하나 — 책은 팔 쪽 방향으로 잡았고 X₁ ∥ X₂.
- Z₂ ∥ Z₃ (팔꿈치도 같은 방향 회전) → X₃는 X₂와 평행하게, 원점도 편한 곳에.

### α의 부호 — 오른손 엄지손가락 법칙

α₁을 구할 때 방향이 중요하다. X₁축을 기준으로 Z₁에서 Z₂로 갈 때 **뒤로 젖혀지는** 방향이므로:

> 항상 오른손, 엄지손가락 법칙이에요. X₁이 이 방향인데 (…) 지금 뒤로 갔죠? 젖혀졌죠? 그래서 얘는 마이너스 90도인 거야.

> 나는 어떻게 된 게 몇십 년이 지나도 이렇게 헷갈리냐.

읽는 규칙 재확인: a와 α는 X축을 따라 **Zᵢ → Zᵢ₊₁**, d와 θ는 Z축을 따라 **Xᵢ₋₁ → Xᵢ**.

### 손목 쪽 (4~6) — 원점을 일부러 한 점에 겹치는 트릭

Z₄, Z₅, Z₆의 원점을 각자 자연스러운 위치에 두는 대신, **연장선을 따라 당겨 세 축이 한 점에서 교차하게** 잡는다 (축의 원점은 연장선 위 어디에 놓아도 되므로).

- 효과: 4·5·6행의 **a와 d가 전부 0**, α만 ±90°씩 남는다. 계산이 극적으로 편해진다.
- 대가: X₃와 X₄ 사이가 벌어져 **d₄** (손목까지 오프셋), **a₃** (작은 링크 길이)가 3·4행에 등장한다. 로봇 설계 시 고정되는 상수다.

### 완성된 DH 테이블

| i | αᵢ₋₁ | aᵢ₋₁ | dᵢ | θᵢ |
|---|---|---|---|---|
| 1 | 0 | 0 | 0 | θ₁ |
| 2 | −90° | 0 | 0 | θ₂ |
| 3 | 0 | a₂ | d₃ | θ₃ |
| 4 | −90° | a₃ | d₄ | θ₄ |
| 5 | 90° | 0 | 0 | θ₅ |
| 6 | −90° | 0 | 0 | θ₆ |

> 이 그림 보고 DH 파라미터 테이블을 만들 수 있다? 그러면 이번 학기 중간고사는 성공한 거야.

### 왜 산업용 로봇은 다 이렇게 생겼나 — 구형 손목의 의미

마지막 3축을 **상호 직교(mutually orthogonal)** 하는 레볼루트 3개로, 한 점에서 교차하게 만들면:

- 6자유도 로봇의 **역기구학이 (해석적으로) 풀린다는 것이 증명**되어 있다 (이 수업에서는 증명 생략).
- 구조 해석: 앞의 3축으로 **위치 (x, y, z)** 를 만들고, 손목 3축은 Z-Y-Z처럼 90°씩 틀어져 있어 [ZYZ 오일러 각도](../orientation-representations/main.md)를 기계 구조로 구현한 셈 — **어떤 방향(orientation)이든** 만들 수 있다.
- 위치 3 + 방향 3 = 세상 어디든 가서 어떤 자세든 잡을 수 있다. 그래서 산업용 로봇이 이 구조를 많이 쓰고 PUMA가 유명하다.

**실무 한 줄**: 6축 산업용 로봇 대부분이 "위치 담당 3축 + 구형 손목 3축" 구조다 — 새 로봇을 봐도 이 틀로 읽으면 된다.

---

## 7. PUMA 560 ② — 변환행렬 조합 전략

### 개별 행렬 생성

DH 테이블의 각 행을 [링크 변환행렬 공식](#2-링크-변환행렬-유도--중간-좌표계-r-q-p)에 순차적으로 대입하면 ⁰₁T부터 ⁵₆T까지 6개가 기계적으로 나온다.

### 순서대로 곱지 않는다 — 책의 부분곱 전략

왼쪽부터 차례로 곱하면 항이 걷잡을 수 없이 길어진다 ("A4 용지 한 장으로 부족해"). 책은 대신 이렇게 묶었다:

$$
{}^{4}_{6}T = {}^{4}_{5}T \\, {}^{5}_{6}T
\\quad\\rightarrow\\quad
{}^{3}_{6}T = {}^{3}_{4}T \\, {}^{4}_{6}T
\\quad\\rightarrow\\quad
{}^{1}_{3}T = {}^{1}_{2}T \\, {}^{2}_{3}T
\\quad\\rightarrow\\quad
{}^{1}_{6}T
\\quad\\rightarrow\\quad
{}^{0}_{6}T = {}^{0}_{1}T \\, {}^{1}_{6}T
$$

왜 이렇게 묶었나?

> 이렇게 하면 기구학, 역기구학이 편해. 답을 알고 있는 사람이 계산해 보니까 이걸 먼저 하는 게 더 쉬운 것 같아, 라고 해서 일부러 이렇게 해놓은 거야. 근데 여러분은 이걸 외울 필요는 없어요.

### C23 표기 — 삼각함수 덧셈정리의 축약

사인·코사인이 뒤섞이니 책은 축약 기호를 정의했다:

$$
c_{23} = c_2 c_3 - s_2 s_3 = \\cos(\\theta_2 + \\theta_3), \\qquad
s_{23} = c_2 s_3 + s_2 c_3 = \\sin(\\theta_2 + \\theta_3)
$$

"시코코시, 코코시시" 덧셈정리 그대로다. 부분곱의 대표 결과:

$$
{}^{1}_{3}T =
\\begin{bmatrix}
c_{23} & -s_{23} & 0 & a_2 c_2 \\\\
0 & 0 & 1 & d_3 \\\\
-s_{23} & -c_{23} & 0 & -a_2 s_2 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

y행이 통째로 (0, 0, 1, d₃)인 것에 주목 — 관절 2·3이 한 평면에서만 움직이므로 y 성분은 d₃ 상수 그대로다.

> 아우 이건 상대적으로 쉽다. 얘는 d₃ 그대로래? 좋죠?

### 최종 결과 ⁰₆T — 얼마나 복잡한가

회전 성분 9개(r₁₁ ~ r₃₃)는 각 항이 두세 줄짜리다. 맛보기로 첫 항 하나만:

$$
r_{11} = c_1[c_{23}(c_4 c_5 c_6 - s_4 s_6) - s_{23} s_5 c_6] + s_1(s_4 c_5 c_6 + c_4 s_6)
$$

위치 성분은 그나마 짧다:

$$
\\begin{aligned}
p_x &= c_1[a_2 c_2 + a_3 c_{23} - d_4 s_{23}] - d_3 s_1 \\\\
p_y &= s_1[a_2 c_2 + a_3 c_{23} - d_4 s_{23}] + d_3 c_1 \\\\
p_z &= -a_3 s_{23} - a_2 s_2 - d_4 c_{23}
\\end{aligned}
$$

여기에 θ₁ = 45°, θ₂ = 20° … 처럼 숫자를 넣으면 손끝의 위치(x, y, z)와 자세(회전행렬)가 값으로 나온다. 이것이 정기구학의 완성이다.

### 시험과 실무에서의 경계선

> 이거를 합치는 거는 오픈북이어도 못 해. 이거를 누가 해줘요? 매트랩에서 해줘요. 프로그램 한 몇 줄만 짜면 돼요.

- 사람이 하는 것: 그림 보고 축 부착 → **DH 테이블 작성** → 각 관절의 변환행렬까지 (시험 범위도 여기까지 — 스탠포드, 스카라 같은 유명 로봇이 나올 수 있다).
- 도구(MATLAB, Python)가 하는 것: 행렬 6개의 연쇄 곱셈과 수치 대입.

**실무 한 줄**: 정기구학 파이프라인에서 사람의 핵심 기여는 DH 테이블이고, 그 뒤는 [코드 몇 줄](#10-python-실습-코드)이다.

---

## 8. 야스카와 모토맨 L-3 — 액추에이터 공간이 분리된 로봇

### 어떤 회사, 어떤 로봇인가

야스카와(Yaskawa)는 로봇을 일반 소비자가 아니라 **공장에** 파는 회사라 낯설 수 있지만, 자동차 공장(테슬라, 현대자동차 등)에서 지금도 많이 쓰인다. 모토맨 L-3는 5자유도 회전 관절 머니퓰레이터다.

### 특이 구조 — 사절 링크 + 선형 액추에이터

교재 표현으로 "**사절 링크(4-bar linkage)와 2개의 선형 액추에이터의 혼합체**"다 (Figure 3.23):

- 모터가 돌면 → 나사선(스크류)을 통해 **막대 길이가 늘어나거나 줄어들고** → 그 길이 변화가 사절 링크를 통해 → **팔 기둥이 앞뒤로 기울어진다**.
- 즉 [5절의 스크류 예시](#5-세-가지-공간--액추에이터·조인트·직교좌표)가 실물로 들어간 로봇이다. **액추에이터 공간, 관절 공간, 작업 공간 세 개가 전부 다르다.**

### 기구학은 그래도 관절각으로

액추에이터가 어떻게 생겼든, 관절축 입장에서 보면 그냥 축 기준 각도 θ₂로 움직일 뿐이다. 그래서 DH 계산은 액추에이터를 신경 쓰지 않고 **관절각 기준으로** 한다.

- Z₀·Z₁·X₀·X₁은 처음에 다 겹치게 잡고 (회전하면 X₀와 X₁이 틀어지는 게 θ₁).
- Z₂의 원점도 일부러 Z₁ 선 위로 올려 겹치게 → 첫 행이 전부 0.
- Z₁ → Z₂가 뒤로 젖혀지므로 α₁ = **−90°** (PUMA와 같은 부호 논리).
- 이후 링크 길이 L₂, L₃가 a 자리에 들어가고, 끝의 4·5번 축은 서로 겹쳐 있다.

**실무 한 줄**: 로봇의 기계 구조(액추에이터)가 아무리 특이해도, 기구학 모델링의 출발점은 항상 "관절축이 어디서 어떻게 도는가"다.

---

## 9. 표준 좌표계 이름 5가지

교재(3.8절)는 자주 쓰는 좌표계에 표준 이름을 붙였다 (Figure 3.27). 이름만 알아두면 된다:

| 기호 | 이름 | 위치 |
|---|---|---|
| {B} | 기저계 (Base) | 로봇 베이스. '기저'가 곧 베이스라는 뜻 |
| {S} | 정지계 / 우주계 / 세계계 (Station) | 작업 기준점 — 예: 테이블의 끝점 |
| {W} | 손목계 (Wrist) | 손목 |
| {T} | 공구계 (Tool) | 엔드 이펙터(공구) 끝 |
| {G} | 목표계 (Goal) | 잡으려는 대상 |

[4절의 작업 시나리오](#4-링크-변환-연결--정기구학의-완성)를 이 이름으로 다시 쓰면: {B}→{S}는 자로 재고, {S}→{G}는 카메라로 재고, {B}→{W}는 DH로 계산한다.

---

## 10. Python 실습 코드

### 완성 코드 — PUMA 560 정기구학

\`\`\`python
import numpy as np

def dh_matrix(alpha, a, d, theta):
    """Modified DH (Craig) 링크 변환행렬 ^{i-1}_i T.
    alpha, theta: 도(deg) / a, d: 미터
    공식: Rx(alpha_{i-1}) @ Dx(a_{i-1}) @ Rz(theta_i) @ Dz(d_i)
    """
    al, th = np.radians(alpha), np.radians(theta)
    ca, sa = np.cos(al), np.sin(al)
    ct, st = np.cos(th), np.sin(th)
    return np.array([
        [ct,      -st,     0,   a],
        [st * ca,  ct * ca, -sa, -sa * d],
        [st * sa,  ct * sa,  ca,  ca * d],
        [0,        0,       0,   1],
    ])

# ── PUMA 560 링크 상수 (Craig 교재 값, 단위 m) ──
a2, a3 = 0.4318, 0.0203
d3, d4 = 0.1244, 0.4318

def puma560_fk(thetas):
    """관절각 6개(deg) → ^0_6 T"""
    t1, t2, t3, t4, t5, t6 = thetas
    # DH 테이블: (alpha_{i-1}, a_{i-1}, d_i, theta_i)
    rows = [
        (   0, 0,  0,  t1),
        ( -90, 0,  0,  t2),
        (   0, a2, d3, t3),
        ( -90, a3, d4, t4),
        (  90, 0,  0,  t5),
        ( -90, 0,  0,  t6),
    ]
    T = np.eye(4)
    for row in rows:
        T = T @ dh_matrix(*row)     # ^0_6 T = ^0_1 T ^1_2 T ... ^5_6 T
    return T

# ── 검증 1: 영점 자세 (모든 θ = 0) ──
T = puma560_fk([0, 0, 0, 0, 0, 0])
print(np.round(T[:3, 3], 4))
# p_x = a2 + a3 = 0.4521, p_y = d3 = 0.1244, p_z = -d4 = -0.4318
# (p 공식에 θ=0 대입: c1=c2=c23=1, s들=0 → px=a2+a3, py=d3, pz=-d4)

# ── 검증 2: 교재의 p 공식과 대조 ──
th = [45, 20, 10, 30, -15, 60]
t1, t2, t3 = np.radians(th[0]), np.radians(th[1]), np.radians(th[2])
c1, s1, c2, s2 = np.cos(t1), np.sin(t1), np.cos(t2), np.sin(t2)
c23, s23 = np.cos(t2 + t3), np.sin(t2 + t3)
px = c1 * (a2*c2 + a3*c23 - d4*s23) - d3*s1
py = s1 * (a2*c2 + a3*c23 - d4*s23) + d3*c1
pz = -a3*s23 - a2*s2 - d4*c23
print(np.allclose(puma560_fk(th)[:3, 3], [px, py, pz]))  # True
\`\`\`

### 연습문제

\`\`\`python
# ── 연습 1: ^1_3 T의 y행 확인 ──
# TODO: 2행(-90,0,0,θ2)과 3행(0,a2,d3,θ3)의 dh_matrix를 곱해 ^1_3 T를 만들고,
#       임의의 θ2, θ3에서 2행(y행)이 항상 (0, 0, 1, d3)인지 확인하라.
# 검증: 본문 7절의 ^1_3 T와 비교 — 관절 2·3이 한 평면에서 움직이는 구조적 이유를 말로 설명해 볼 것

# ── 연습 2: c23 축약의 정당성 ──
# TODO: 임의의 θ2, θ3에 대해 c2*c3 - s2*s3 == cos(θ2+θ3),
#       c2*s3 + s2*c3 == sin(θ2+θ3) 임을 np.allclose로 확인하라 (덧셈정리).

# ── 연습 3: 구형 손목의 성질 ──
# TODO: θ1~θ3를 고정하고 θ4, θ5, θ6만 바꿔가며 puma560_fk의 위치 성분 T[:3,3]을 출력하라.
# 검증: 손목 3축은 한 점에서 교차하므로... 위치가 변하는가, 변하지 않는가? 왜 그런가?
#       (힌트: 이 예제의 좌표계 {6}의 원점은 손목 교차점에 있다)

# ── 연습 4: RPR 원통형 로봇 (3절 테이블) ──
# TODO: 3절의 DH 테이블 (0,0,0,θ1), (90,0,d2,0), (0,0,L2,θ3)로 FK를 만들고
#       θ1=30°, d2=0.5, L2=0.2일 때 손끝 위치를 구하라.
# 검증: 손끝이 원통 좌표 (반지름, 방위각, 높이)로 해석되는지 확인
\`\`\`

### ROS2·라이브러리 연결

- 실무에서는 DH 테이블 대신 **URDF**(joint origin + axis)로 로봇을 기술하고, FK는 \`robot_state_publisher\`가 tf2 트리로 자동 계산해 준다. 개념은 동일 — 링크 변환의 연쇄 곱.
- ⁰₆T의 회전 성분을 ROS2로 보낼 때는 [쿼터니언](../orientation-representations/main.md)으로 변환한다: \`scipy.spatial.transform.Rotation.from_matrix(T[:3,:3]).as_quat()\` → \`geometry_msgs/Pose\`.
- Peter Corke의 \`roboticstoolbox-python\`에는 PUMA 560이 내장 모델(\`rtb.models.DH.Puma560()\`)로 들어 있어 이 노트의 결과를 교차 검증할 수 있다.

---

## 핵심 요약 카드

> **링크 변환행렬 (Modified DH, Craig)**
> ⁱ⁻¹ᵢT = R_X(αᵢ₋₁) · D_X(aᵢ₋₁) · R_Z(θᵢ) · D_Z(dᵢ)
> — 중간 좌표계 {R}(α회전) → {Q}(a이동) → {P}(θ회전) → dᵢ이동 = {i}
> — 각 단계가 회전 하나/이동 하나뿐이라 유도가 단순. 최종 행렬 각 항은 외울 필요 없음
>
> **정기구학 (Forward Kinematics)**
> ⁰ₙT = ⁰₁T ¹₂T ⋯ ᴺ⁻¹ₙT : 관절값(θ, d) → 손끝 포즈. 대입하면 바로 나온다
> 역방향(손끝 → 관절값)이 역기구학, 4장
>
> **세 가지 공간**
> 액추에이터(모터 φ) ↔ 조인트(관절 θ) ↔ 직교좌표(손끝 x,y,z,자세)
> 이 수업은 조인트 ↔ 직교좌표 매핑만. 스크류식 액추에이터는 φ ≠ θ
>
> **PUMA 560 요점**
> 위치 3축 + 구형 손목(spherical wrist) 3축 — Z₄·Z₅·Z₆를 한 점에 교차시키면
> 4·5·6행 a=d=0 (계산 단순), 역기구학 해석해 존재 증명됨, ZYZ 오일러의 기계적 구현
> α 부호는 오른손 엄지 법칙 — PUMA는 α₁ = −90°
>
> **사람 vs 도구의 경계**
> 축 부착 + DH 테이블 + 행별 변환행렬 = 사람 (시험 범위)
> 행렬 연쇄 곱셈 + 수치 대입 = MATLAB/Python
>
> **표준 좌표계**: {B}기저 {S}정지 {W}손목 {T}공구 {G}목표
`,

  'Robotics/frames-and-mapping': `---
title: 좌표계 표시와 매핑 (Frames & Mapping)
date: 2026-08-08
tags: robotics, kinematics, coordinate-frame
order: 
featured: false
draft: false
---

# 좌표계 표시와 매핑 (Frames & Mapping)

> 출처: 로봇제어공학 — Introduction to Robotics (Craig, 4th Ed.) 2장 공간 표시와 변환  
> 영상: [YouTube](https://www.youtube.com/watch?v=Zzk1ixSeO_c)  
> 대상: 기계공학 배경 / 행렬 곱·벡터 내적 기억이 가물가물해도 OK / Python 가능

---

## 목차

1. [왜 좌표계가 필요한가](#1-왜-좌표계가-필요한가--픽-앤-플레이스)
2. [직교좌표계 vs 극좌표계](#2-직교좌표계-vs-극좌표계)
3. [표기법 약속](#3-표기법-약속--왼쪽-위첨자에-당황하지-말-것)
4. [위치 표시](#4-위치-표시--3×1-위치-벡터)
5. [방위 표시 — 회전행렬](#5-방위-표시--왜-9개-숫자가-필요한가)
6. [역행렬 = 전치행렬](#6-회전행렬의-성질--역행렬--전치행렬)
7. [좌표계의 표시](#7-좌표계-하나를-완전히-표시하기--숫자-12개)
8. [매핑](#8-매핑--점은-그대로-표현만-바꾼다)
9. [Transformation Matrix](#9-transformation-matrix--두-단계를-곱셈-한-번으로)
10. [어디에 쓰는가](#10-이걸-어디에-쓰는가--눈과-손끝)
11. [개념 비교표](#11-개념-비교표)
12. [Python 실습 코드](#12-python-실습-코드)
13. [핵심 요약 카드](#13-핵심-요약-카드)

---

## 1. 왜 좌표계가 필요한가 — 픽 앤 플레이스

로봇팔을 제어하는 것을 **로봇 머니플레이션(manipulation)** 이라고 부른다. 그 실체는 대부분 **픽 앤 플레이스** — 공구 또는 부품을 옮기는 작업이다.

픽 앤 플레이스를 쪼개 보면:

1. 테이블 위 물건의 위치를 (카메라 등으로) 안다 — **로봇 기준으로**
2. 내 손을 거기까지 제어해서 잡는다
3. 3차원 공간의 다른 곳으로 옮겨 놓는다

이걸 하려면 공구·부품·로봇 자신의 **위치(position)와 방위(orientation)** 를 표시할 수 있어야 한다. 그래야 "어디로 가야 하는지"와 "어디로 옮겨야 하는지"를 알 수 있다. 그래서 이번 장에서 좌표계를 정의하고 표시하는 방법을 배우고, 그 다음에야 제어가 나온다.

**실무 한 줄**: 위치·방위 표현은 속도(선속도·각속도), 힘, 토크 등 로봇공학의 모든 물리량 표현의 기반이 된다.

## 2. 직교좌표계 vs 극좌표계

| | 직교좌표계 (Cartesian) | 극좌표계 (Polar) |
|---|---|---|
| 구성 요소 | X, Y, Z축 값 3개 | 거리 + 각도 |
| 직관 비유 | "동쪽으로 2km, 북쪽으로 10km 가면 광화문" (경도·위도) | "대충 저 방향으로 쭉 가면 광화문" |
| 강점 | 사람 머릿속에 편함 — 건물, 책상 등 세상이 다 직각 | 수학적 연산이 유리할 때가 있음 |
| 이 과목에서 | **주로 사용** | 가끔 사용 |

- "직교"인 이유: X·Y·Z축이 서로 **직각(90°)으로 교차**하며 원점에서 만난다.
- 수학적으로 극좌표계가 편한 경우 잠깐 변환해 쓰고 다시 직교좌표계로 돌아오는 패턴을 쓴다. 단, 어느 쪽이든 **원점(기준)** 은 반드시 정해줘야 한다.

## 3. 표기법 약속 — 왼쪽 위첨자에 당황하지 말 것

공학 책은 시작할 때 기호에 대한 약속을 한다. 이 책(Craig)의 약속:

| 기호 | 의미 |
|---|---|
| $\\{A\\}$ | 이름이 A인 **좌표계(frame)** |
| $\\hat{X}_A,\\ \\hat{Y}_A,\\ \\hat{Z}_A$ | {A}의 각 축 방향 **단위 벡터** (모자 기호 = 캐럿, hat) |
| $O_A$ | {A}의 원점 (Origin) |
| $^A P$ | **{A} 좌표계를 기준으로** 표현한 점 P — 왼쪽 위첨자가 기준 좌표계 |
| 대문자 ($P$, $R$) | 벡터·행렬 |
| 소문자 ($p_x$, $p_y$, $p_z$) | 스칼라 (값 하나) |

주의할 점:

- 이 책은 왼쪽 위첨자·왼쪽 아래첨자를 많이 활용한다. 글자 하나에 첨자가 사방으로 붙어도 당황하지 말 것.
- **책마다 첨자 의미가 다르다.** 어느 책이든 초반부나 부록에 첨자 약속이 정리되어 있으니 그걸 먼저 확인하는 습관을 들인다.

## 4. 위치 표시 — 3×1 위치 벡터

{A} 좌표계에서 점 P의 위치는 각 축을 따라 측정한 거리 3개로 표현한다:

$$^A P = \\begin{bmatrix} p_x \\\\ p_y \\\\ p_z \\end{bmatrix}$$

예를 들어 $^AP = (2, 3, 4)$이면 "{A}의 원점에서 X축으로 2, Y축으로 3, Z축으로 4 간 점"이다.

- 값이 하나면 **스칼라**, 값 3개를 묶어 가지면 **벡터** — 그래서 이걸 **위치 벡터(position vector)** 라고 부른다.
- 여기까지는 쉽다. **문제는 방위다.**

## 5. 방위 표시 — 왜 9개 숫자가 필요한가

### 문제 상황: 회전하면 3개로는 안 된다

위치는 점 하나의 이동이라 X·Y·Z 차이 3개만 알면 끝난다. 그런데 회전은 다르다:

- 좌표계를 Y축 기준으로 돌리면 → Y축은 그대로지만 **X축 끝점과 Z축 끝점이 3차원 공간에서 움직인다**
- 즉 회전 한 번에 X축 끝점(3개), Y축 끝점(3개), Z축 끝점(3개)이 제각기 이동
- 합쳐서 **9개의 값**이 바뀐다 → 벡터 하나로는 부족하고, 벡터 3개를 모은 **3×3 행렬**이 필요

벡터가 여러 개 모이면 행렬이라 부르고, 이 행렬을 **회전행렬(rotation matrix)** $R$이라고 쓴다.

### 회전행렬의 정의

$^A_B R$ = **{A} 좌표계를 기준으로 {B} 좌표계가 얼마만큼 회전되어 있는지**를 표현하는 행렬.

{B}의 세 축 단위 벡터를 {A} 기준으로 표현한 것을 열(column)로 쌓으면 된다:

$$^A_B R = \\begin{bmatrix} ^A\\hat{X}_B & ^A\\hat{Y}_B & ^A\\hat{Z}_B \\end{bmatrix} = \\begin{bmatrix} r_{11} & r_{12} & r_{13} \\\\ r_{21} & r_{22} & r_{23} \\\\ r_{31} & r_{32} & r_{33} \\end{bmatrix}$$

### 성분 하나의 의미 — 벡터 내적 = cos θ

각 성분은 두 단위 벡터의 **내적(dot product)** 이다. 예를 들어 $r_{11} = \\hat{X}_B \\cdot \\hat{X}_A$.

내적의 정의를 떠올리면:

$$\\hat{X}_B \\cdot \\hat{X}_A = |\\hat{X}_B|\\,|\\hat{X}_A|\\cos\\theta = 1 \\times 1 \\times \\cos\\theta = \\cos\\theta$$

축 벡터는 방향만 표시하는 **단위 벡터라 크기가 무조건 1**이므로, 각 성분은 그냥 **두 축 사이 각도의 코사인**이다. 즉 회전행렬은 "{B}의 X축이 {A}의 X·Y·Z축과 각각 몇 도 틀어져 있는지"를 축별로 하나씩 설명하는 표다.

3차원 공간에서 꼬여 있는 좌표계를 통째로 표현하려면 너무 어려우니, **X축 따로, Y축 따로, Z축 따로 설명하자**는 것이 핵심 아이디어다.

- **이해할 것**: 성분 = 단위 벡터 내적 = cos θ 라는 구조
- **외울 필요 없음**: 행렬 전개식 자체 — 시험도 오픈북이고, 도구가 계산해 준다

> [!TIP]
> 정말 일 잘하는 사람은 외워서 공식을 푸는 사람이 아니다. 인터넷을 찾든 책을 찾든 옆사람한테 물어보든 결과가 정확하게 나오는 게 중요하다 — 잘 찾는 것도 능력이다.

**실무 한 줄**: 이 식은 이 과목 내내 계속 돌아온다 — 회전 표현의 모든 변형(RPY, 오일러, 쿼터니언)이 이 3×3 행렬로 환원된다.

## 6. 회전행렬의 성질 — 역행렬 = 전치행렬

### 왜 역행렬이 필요한가

행렬 방정식 $AX = B$를 풀 때 양변에 $A^{-1}$을 곱하면 $X = A^{-1}B$로 바로 답이 나온다. 로봇에서는 특히 **역기구학(inverse kinematics)** — 어깨(베이스) 기준으로 손끝을 표현하는 기구학의 반대로, 손끝 위치에서 각 관절 값을 거꾸로 계산하는 문제 — 에서 인버스가 필수다.

그런데 역행렬 계산은 원래 어렵다:

- 위치 벡터의 역은 쉽다 — 값 3개짜리 벡터니까
- 2×2 역행렬도 행렬식(ad−bc) 나누고 자리 바꾸고… 복잡했는데, 3×3 역행렬은 손으로 풀면 악몽이다

### 전치행렬은 계산이 아니라 자리 바꾸기

**전치(transpose)** 는 대각선 성분은 그대로 두고 나머지를 대각선 건너편으로 **위치만 바꾸는 것**이다. 계산이 전혀 없다.

$$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^T = \\begin{bmatrix} a & c \\\\ b & d \\end{bmatrix}$$

보통의 행렬은 역행렬과 전치행렬이 전혀 다르다. 그런데 **회전행렬만은 둘이 같다**:

$$^B_A R = {}^A_B R^{-1} = {}^A_B R^{T}$$

### 유도 아이디어 (한 단계만)

$^A_B R$의 **열**은 {B}의 단위 벡터를 {A}에서 표현한 것인데, 같은 행렬의 **행**은 {A}의 단위 벡터를 {B}에서 표현한 것이 된다:

$$^A_B R = \\begin{bmatrix} ^B\\hat{X}_A^T \\\\ ^B\\hat{Y}_A^T \\\\ ^B\\hat{Z}_A^T \\end{bmatrix}$$

성분이 전부 "두 단위 벡터의 내적"이고 내적은 순서를 바꿔도 같기 때문($\\hat{X}_B \\cdot \\hat{X}_A = \\hat{X}_A \\cdot \\hat{X}_B$)이다. 그래서 $^A_B R^T\\,{}^A_B R$을 성분으로 두세 줄 써 보면 단위행렬 $I_3$이 나온다 — 즉 전치가 곧 역행렬이다.

- **이해할 것**: 왜 전치 = 역이 성립하는지 (열=B축을 A에서, 행=A축을 B에서)
- **외울 것**: $R^{-1} = R^T$ 라는 사실 자체 — 이건 계속 쓴다

**실무 한 줄**: 4×4 변환 행렬의 역을 손으로 구할 때도 이 성질이 핵심 재료다.

## 7. 좌표계 하나를 완전히 표시하기 — 숫자 12개

어깨(베이스)를 기준으로 손끝을 표현한다고 하자. "손끝이 지금 내 어깨 기준으로 어디에 있어?"라는 질문의 대답은 두 부분이다:

1. **위치**: 어깨 원점 기준으로 손끝 원점이 어디인가 → 벡터 3개 값
2. **방위**: 손끝의 X축·Y축·Z축이 어깨 좌표계 기준으로 각각 몇 도씩 돌아가 있는가 → 벡터 3개 × 3 = 9개 값

그래서 좌표계 {B}를 {A} 기준으로 완전히 표시하려면 **총 12개** 숫자가 필요하고, 책은 이를 이렇게 쓴다:

$$\\{B\\} = \\{^A_B R,\\ ^A P_{BORG}\\}$$

- $^A P_{BORG}$: {A} 기준으로 본 {B} **원점(origin)의 위치** (3×1). ORG는 origin의 약자
- $^A_B R$: {A} 기준 {B}의 회전 (3×3)

여러 좌표계가 있을 때 기준은 자유롭게 잡을 수 있다:

- 절대 변하지 않는 기준 좌표계는 보통 $\\{U\\}$ — **우주 좌표계(universe frame)** 라고 부른다
- {A}, {B}는 {U} 기준으로 표시하고, {C}는 {A} 기준으로 상대적으로 표시하는 식의 구성도 가능하다

## 8. 매핑 — 점은 그대로, 표현만 바꾼다

**매핑(mapping)** = 한 좌표계에서 다른 좌표계로 **표시를 바꾸는 것**. 점은 공간에 고정되어 있고 움직이지 않는다. 말하는 사람의 관점만 바뀐다.

> [!NOTE]
> 서울역에서 나는 "광화문은 저기야"라고 하고, 강원도 사는 친구는 "내 기준으로 광화문은 저쪽이야"라고 한다. 같은 광화문을 다르게 표현하는 것 — 그게 매핑이다.

### 8.1 전위(translation)만 있을 때 — 벡터 덧셈

두 좌표계의 방위가 같고 원점만 다르면, 고등학교 벡터 덧셈($\\vec{B} = \\vec{A} + \\vec{C}$) 그대로다:

$$^A P = {}^B P + {}^A P_{BORG}$$

점이니까 공간상에서 그냥 더하면 된다. 쉽다. **항상 문제는 회전이다.**

### 8.2 회전(rotation)만 있을 때 — 회전행렬 곱

원점이 처음부터 겹쳐 있고 방위만 틀어져 있으면:

$$^A P = {}^A_B R\\ {}^B P$$

$^AP$의 각 성분은 $^BP$를 {A}의 각 단위 축 방향으로 **투영(내적)** 한 것이므로, 행이 $^B\\hat{X}_A^T$ 등으로 구성된 $^A_B R$을 곱하는 것과 같다.

#### 예제 2.1 — Z축 30° 회전

{A}에 대해 Z축을 중심으로 30° 회전한 {B}가 있다. $^BP = (0,\\ 2,\\ 0)$을 {A}로 표현하면?

먼저 회전행렬을 내적으로 성분 하나씩 구한다:

- Z축은 두 좌표계가 **겹쳐 있다** → $\\hat{Z}_B \\cdot \\hat{Z}_A = \\cos 0° = 1$, Z가 들어간 나머지 내적은 전부 $\\cos 90° = 0$
- $r_{11} = \\hat{X}_B \\cdot \\hat{X}_A = \\cos(-30°) = 0.866$ — B에서 A로 재면 −30°지만 코사인이라 부호는 의미 없다
- $r_{12} = \\hat{Y}_B \\cdot \\hat{X}_A = \\cos(90° + 30°) = \\cos 120° = -0.5$

$$^A_B R = \\begin{bmatrix} 0.866 & -0.500 & 0 \\\\ 0.500 & 0.866 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}, \\qquad ^A P = {}^A_B R \\begin{bmatrix} 0 \\\\ 2 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} -1.000 \\\\ 1.732 \\\\ 0 \\end{bmatrix}$$

같은 점인데 {B}에서 보면 Y축 위 (0, 2, 0)이고, {A}에서 보면 (−1, 1.732, 0)이다.

- 회전 방향의 양(+)의 기준은 **오른손 법칙** — 축을 오른손 엄지로 잡았을 때 나머지 손가락이 감기는 방향이 +다. 전 세계적 약속이지 절대 원리가 아니다.

> [!NOTE]
> 회전행렬을 이해하기가 너무 어려워도 괜찮다. 여기서 말하는 회전행렬은 두 좌표계 사이의 각도의 관계다. 지금은 개념만 이해하면 되고, 실제 활용을 몇 번 하다 보면 "쓸모가 있네" 하고 감이 온다.

### 8.3 일반 매핑 — 전위 + 회전 동시

원점도 다르고 방위도 틀어진 일반적인 경우, 한 번에 생각하면 너무 어렵다. 그래서 **둘로 쪼갠다**:

1. 원점끼리의 차이($^AP_{BORG}$)를 먼저 계산하고, {B}를 평행이동해 원점을 {A}에 **겹친다**
2. 원점이 겹친 상태의 회전은 8.2에서 이미 풀었다 → 회전행렬 곱

$$^A P = {}^A_B R\\ {}^B P + {}^A P_{BORG}$$

이 식이 이번 장에서 **가장 중요한 식**이다. 두 좌표계 사이의 상대 위치와 상대 회전만 알아 놓으면, $^BP$를 알 때 $^AP$를 구하고 그 반대도 언제든 가능하다 — "하나를 알면 하나를 알 수 있다"는 컨셉.

## 9. Transformation Matrix — 두 단계를 곱셈 한 번으로

### 문제 상황: 곱하고 더하는 두 단계가 번거롭다

위 식은 "회전 곱하고, 위치 더하고" 두 연산이다. 점 하나에 행렬 **하나만 딱 곱하면** 변환이 끝나는 수학적 형태가 있으면 좋겠다:

$$^A P = T\\ {}^B P \\quad \\text{(이렇게 되면 좋겠다)}$$

그래서 정의한 것이 **변환 행렬(transformation matrix)** $T$다. 거의 모든 책에서 T라고 쓴다.

### 왜 4×4인가 — 억지로 채워서 정방행렬 만들기

회전 3×3 옆에 위치 3×1을 붙이면 3×4가 되는데, 3×4는 **역행렬을 구할 수 없다** (역행렬은 정방행렬만 가능). 그래서:

- 밑에 $[0\\ 0\\ 0]$ 행을 **아무 의미 없이 개수 맞추려고** 추가
- 대각선 자리에는 1 — 단위행렬처럼 대각선이 1이어야 인버스에 영향을 안 주니까
- 행이 4개가 됐으니 점 벡터에도 1을 억지로 붙여 $[{}^BP;\\ 1]$로 만든다. 이 1들은 연산에 아무 영향이 없다

$$\\begin{bmatrix} ^A P \\\\ 1 \\end{bmatrix} = \\underbrace{\\begin{bmatrix} ^A_B R & ^A P_{BORG} \\\\ 0\\ 0\\ 0 & 1 \\end{bmatrix}}_{^A_B T\\ (4\\times 4)} \\begin{bmatrix} ^B P \\\\ 1 \\end{bmatrix}$$

이렇게 만든 4×4를 **균질 변환(homogeneous transform)** 이라고 부른다. 실질적인 값은 회전 9개 + 위치 3개뿐이고 나머지는 0과 1로 고정이다.

### 예제 2.2 — 회전 + 전위 한 번에

{A}에 대해 Z축 중심 30° 회전하고 X축으로 10, Y축으로 5만큼 전위된 {B}. $^BP = (3,\\ 7,\\ 0)$을 {A}로 바꾸면?

예제 2.1의 회전행렬을 레고 블록 끼우듯 그대로 넣고, 위치 열에 (10, 5, 0)을 넣는다:

$$^A_B T = \\begin{bmatrix} 0.866 & -0.500 & 0 & 10.0 \\\\ 0.500 & 0.866 & 0 & 5.0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}, \\qquad ^A P = {}^A_B T\\ {}^B P = \\begin{bmatrix} 9.098 \\\\ 12.562 \\\\ 0.000 \\end{bmatrix}$$

**실무 한 줄**: T를 한 번 구해 놓으면 행렬 곱 한 번으로 어떤 점이든 좌표계를 넘나들며 표현할 수 있다.

## 10. 이걸 어디에 쓰는가 — 눈과 손끝

로봇이 물건을 잡는 상황으로 전체 그림을 그려 보자:

- **눈(카메라)**: 보통 베이스에 달려 있다 → 카메라와 물체의 관계는 **알고 있다** (고정, 상수)
- **손끝**: 로봇이 움직이니까 눈과 손끝의 관계는 **계속 변한다** (변수)
- **하고 싶은 것**: 손끝이 물체로 가는 것

눈↔물체를 알고 있으니, **눈↔손끝의 관계만 알면** 손끝↔물체가 계산된다. 그러면 "손끝아 저쪽으로 가"라는 플래닝과 제어가 가능해진다.

스토리는 이렇게 이어진다:

- 이번 장: 좌표계와 매핑 (좌표계 사이의 관계 표현)
- 3장: 눈과 손끝의 관계를 표현하는 방법 = 기구학 — DH 파라미터로 시작한다
- 그 뒤: 손끝 위치로부터 관절 값을 역산하는 역기구학 (인버스가 등장하는 이유)

## 11. 개념 비교표

| 개념 | 크기 | 의미 | 인버스 |
|---|---|---|---|
| 위치 벡터 $^AP$ | 3×1 | {A} 기준 점의 위치 | 부호 반전 (쉬움) |
| 회전행렬 $^A_BR$ | 3×3 | {A} 기준 {B}의 방위 (성분 = 축끼리 cos θ) | $R^{-1} = R^T$ (자리만 바꿈) |
| 좌표계 표시 $\\{B\\}$ | 12개 값 | $\\{^A_BR,\\ ^AP_{BORG}\\}$ — 방위 + 원점 | — |
| 변환 행렬 $^A_BT$ | 4×4 | 회전 + 전위를 곱셈 한 번으로 | 손으로 구하는 방법 있음 |

## 12. Python 실습 코드

### 완성 코드 — 예제 2.1, 2.2 재현

\`\`\`python
import numpy as np

def rot_z(deg):
    """Z축 중심 회전행렬 (오른손 법칙 기준 +방향)"""
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[c, -s, 0],
                     [s,  c, 0],
                     [0,  0, 1]])

# ── 예제 2.1: 회전만 있는 매핑 ──
R_AB = rot_z(30)
p_B = np.array([0, 2, 0])
p_A = R_AB @ p_B
print(p_A)                      # [-1.     1.732  0.   ]

# ── 회전행렬의 성질: 역행렬 = 전치행렬 ──
print(np.allclose(np.linalg.inv(R_AB), R_AB.T))   # True
print(np.allclose(R_AB.T @ R_AB, np.eye(3)))      # True (R^T R = I)

# ── 예제 2.2: 회전 + 전위 → 4×4 변환 행렬 ──
def make_T(R, p):
    """3×3 회전 + 3×1 위치 → 4×4 homogeneous transform"""
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = p
    return T

T_AB = make_T(rot_z(30), [10, 5, 0])
p_B_h = np.array([3, 7, 0, 1])          # 점에 1을 붙임 (homogeneous)
p_A_h = T_AB @ p_B_h
print(p_A_h[:3])                        # [ 9.098 12.562  0.   ]  ← 마지막 1은 버림

# ── scipy로 같은 계산 (실무에서는 이걸 씀) ──
from scipy.spatial.transform import Rotation
R = Rotation.from_euler('z', 30, degrees=True)
print(R.apply([0, 2, 0]))               # [-1.     1.732  0.   ]
print(R.inv().as_matrix())              # R_AB.T 와 동일
\`\`\`

### 연습 문제

\`\`\`python
# ── 연습 1: 내적으로 회전행렬 직접 구성 ──
# TODO: 예제 2.1의 상황에서 {B}의 세 축 단위 벡터를 {A} 기준 좌표로 직접 쓰고
#       (X_B = [cos30, sin30, 0] 등), 열로 쌓아 R을 만들어 rot_z(30)과 비교하라.
# 검증: np.allclose(R_manual, rot_z(30)) == True

# ── 연습 2: 역매핑 ──
# TODO: 예제 2.1의 결과 p_A = [-1, 1.732, 0]에서 거꾸로 p_B를 복원하라.
#       단, np.linalg.inv를 쓰지 말고 R_AB.T만 사용할 것.
# 검증: np.allclose(p_B_복원, [0, 2, 0]) == True

# ── 연습 3: 일반 매핑 두 가지 방법 ──
# TODO: 예제 2.2를 (1) R @ p + p_org 두 단계, (2) 4×4 T 곱 한 번
#       두 방법으로 계산하고 결과가 같은지 확인하라.
# 검증: 두 결과 모두 [9.098, 12.562, 0]
\`\`\`

## 13. 핵심 요약 카드

> [!IMPORTANT]
> **머니플레이션 = 픽 앤 플레이스** → 물체·로봇의 위치와 방위를 좌표계로 표시해야 한다
>
> **위치**: $^AP$ (3×1 벡터) — 원점 기준 각 축 거리. 쉽다.
>
> **방위**: 회전하면 세 축 끝점이 각각 3차원에서 움직여 **9개**가 바뀐다 → 3×3 **회전행렬** $^A_BR$
> - 열 = {B}의 축을 {A}에서 본 단위 벡터, 성분 = 축끼리의 내적 = **cos θ**
> - $R^{-1} = R^T$ — 이건 외운다.
>
> **좌표계 표시**: $\\{B\\} = \\{^A_BR,\\ ^AP_{BORG}\\}$ — 숫자 12개
>
> **매핑** (점은 그대로, 표현만 변경):
> - 전위만: $^AP = {}^BP + {}^AP_{BORG}$
> - 회전만: $^AP = {}^A_BR\\,{}^BP$
> - 일반: $^AP = {}^A_BR\\,{}^BP + {}^AP_{BORG}$ ← **이번 장 최중요 식**
>
> **변환 행렬 T (4×4)**: 위 식을 곱셈 한 번으로. 밑에 [0 0 0 1]과 점의 1은 개수 맞추려 억지로 넣은 것
`,

  'Robotics/inverse-kinematics-algebraic-geometric-pieper': `---
title: 역기구학 — 대수적·기하학적 풀이와 Pieper의 해 (Inverse Kinematics)
date: 2026-08-08
tags: inverse-kinematics, pieper
order: 
featured: false
draft: false
---

# 역기구학 — 대수적·기하학적 풀이와 Pieper의 해 (Inverse Kinematics)

> 출처: 로봇제어공학 — Introduction to Robotics (Craig) 4장 역기구학 (후반부)
> 영상: https://www.youtube.com/watch?v=ZrpgcDjJnxY&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=9
> 대상: [4-1](../inverse-kinematics/main.md)에서 3링크 평면 팔의 θ₂까지 구한 학습자. θ₁·θ₃ 완성, 같은 문제를 기하학적으로 재검증, 어디서나 쓰는 두 가지 대수 치환 기법, 6축 로봇 일반해(Pieper의 해)까지.

---

## 목차

1. [θ₁ 구하기 — K₁, K₂ 치환](#1-θ₁-구하기--치환으로-k₁-k₂를-r-γ로-바꾸기)
2. [θ₃ 구하기와 순서](#2-θ₃-구하기와-순서가-중요하다)
3. [기하학적으로 다시 풀기](#3-기하학적으로-다시-풀기--제2코사인-법칙)
4. [범용 기법 ① 탄젠트 반각 치환](#4-범용-기법-①--탄젠트-반각-치환)
5. [범용 기법 ② A cosθ + B sinθ = C](#5-범용-기법-②--a-cosθ--b-sinθ--c)
6. [왜 마지막 3축을 교차시키는가](#6-왜-마지막-3축을-한-점에서-교차시키는가--위치·방향-분리)
7. [Pieper의 해 ① 위치 방정식](#7-pieper의-해-①--위치-방정식을-θ₃만의-함수로)
8. [Pieper의 해 ② θ₃→θ₂→θ₁](#8-pieper의-해-②--θ₃-4차방정식-그리고-θ₂-θ₁-순서로)
9. [Python 실습 코드](#9-python-실습-코드)
10. [핵심 요약 카드](#핵심-요약-카드)

---

> [!NOTE]
> **4-1에서 가져오는 것 — 확보한 방정식과 θ₂**
> [4-1의 8절](../inverse-kinematics/main.md)에서 3링크 평면 팔의 FK 행렬과 목표 자세 행렬을 나란히 놓고 (표기: c₁ = cosθ₁, c₁₂ = cos(θ₁+θ₂), c₁₂₃ = cos(θ₁+θ₂+θ₃)):
>
> $$
> {}^B_W T = {}^0_3T =
> \\begin{bmatrix}
> c_{123} & -s_{123} & 0 & l_1 c_1 + l_2 c_{12} \\\\
> s_{123} & c_{123} & 0 & l_1 s_1 + l_2 s_{12} \\\\
> 0 & 0 & 1 & 0 \\\\
> 0 & 0 & 0 & 1
> \\end{bmatrix}
> \\qquad
> {}^B_W T_{goal} =
> \\begin{bmatrix}
> c_\\phi & -s_\\phi & 0 & x \\\\
> s_\\phi & c_\\phi & 0 & y \\\\
> 0 & 0 & 1 & 0 \\\\
> 0 & 0 & 0 & 1
> \\end{bmatrix}
> $$
>
> 두 행렬을 항별 비교해 유효한 방정식 4개를 얻었다:
>
> $$c_\\phi = c_{123}, \\quad s_\\phi = s_{123}, \\quad x = l_1 c_1 + l_2 c_{12}, \\quad y = l_1 s_1 + l_2 s_{12}$$
>
> 풀이 내내 쓰는 각 덧셈 공식 (코사인은 "코코시시", 사인은 "시코코시"):
>
> $$c_{12} = c_1 c_2 - s_1 s_2, \\qquad s_{12} = s_1 c_2 + c_1 s_2$$
>
> 그리고 x² + y²로 θ₁을 소거해 **θ₂를 이미 구했다**:
>
> $$c_2 = \\frac{x^2 + y^2 - l_1^2 - l_2^2}{2 l_1 l_2}, \\qquad s_2 = \\pm\\sqrt{1 - c_2^2}, \\qquad \\theta_2 = \\mathrm{Atan2}(s_2, c_2)$$
>
> 이번 노트는 여기서 출발해 [θ₁](#1-θ₁-구하기--치환으로-k₁-k₂를-r-γ로-바꾸기), [θ₃](#2-θ₃-구하기와-순서가-중요하다)를 마저 구한다.

## 1. θ₁ 구하기 — 치환으로 K₁, K₂를 R, γ로 바꾸기

[4-1에서](../inverse-kinematics/main.md) 남겨둔 두 방정식으로 돌아간다.

$$x = l_1 c_1 + l_2 c_{12}, \\qquad y = l_1 s_1 + l_2 s_{12}$$

**1단계 — c₁₂, s₁₂를 각 덧셈 공식으로 풀어헤친다** (코사인은 "코코시시": c₁₂ = c₁c₂ − s₁s₂, 사인은 "시코코시": s₁₂ = s₁c₂ + c₁s₂):

$$x = c_1(l_1 + l_2 c_2) - s_1(l_2 s_2), \\qquad y = s_1(l_1 + l_2 c_2) + c_1(l_2 s_2)$$

**2단계 — 반복되는 덩어리를 K₁, K₂로 이름 붙인다.** θ₂는 [이미 구했으므로](../inverse-kinematics/main.md) c₂, s₂는 앎 — 즉 K₁, K₂는 이미 아는 값이다.

$$K_1 = l_1 + l_2 c_2, \\qquad K_2 = l_2 s_2 \\qquad\\Rightarrow\\qquad x = K_1 c_1 - K_2 s_1,\\ \\ y = K_1 s_1 + K_2 c_1$$

**3단계 — 모양이 "코코시시/시코코시"와 닮았다는 게 힌트.** K₁, K₂가 혹시 어떤 반지름 R과 각 γ의 cos, sin이 아닐까 — 라는 발상을 그대로 치환에 쓴다:

$$R = \\sqrt{K_1^2 + K_2^2}, \\qquad \\gamma = \\mathrm{Atan2}(K_2, K_1)$$

그러면 $x = R\\cos(\\theta_1+\\gamma)$, $y = R\\sin(\\theta_1+\\gamma)$이 되고, R은 항상 양수이므로 양변을 R로 나누는 대신 그냥 atan2에 바로 넣어도 된다:

$$\\theta_1 = \\mathrm{Atan2}(y, x) - \\gamma$$

**이해할 것**: "미지수가 섞인 두 계수를 R, γ로 묶는" 치환 아이디어 자체 — [5절](#5-범용-기법-②--a-cosθ--b-sinθ--c)에서 똑같은 발상을 일반형으로 다시 쓴다.
**외울 필요 없는 것**: K₁, K₂의 구체적 전개식 — 로봇마다 달라진다.

**실무 포인트**: θ₂를 몰라도 되는 게 아니라 K₁, K₂ 자체가 θ₂로 정의되어 있다 — **θ₂를 먼저 구해야만 θ₁을 구할 수 있다.**

---

## 2. θ₃ 구하기와 "순서가 중요하다"

목표 방향 φ = θ₁ + θ₂ + θ₃는 [2단계에서 이미](../inverse-kinematics/main.md) 방정식으로 확보했다. θ₁, θ₂를 모두 구한 지금은 그냥 뺄셈이다.

$$\\theta_3 = \\phi - \\theta_1 - \\theta_2$$

> "이거는 순서가 중요하지 일반적인 방법이 아닌 거지. 이원일차방정식 풀 때는 X 먼저 구하든 Y 먼저 구하든 상관없이 풀리잖아요. 근데 여기는 세타2부터 먼저 꼭 구해야 해."

**연립방정식과 다른 점**: 보통 연립방정식은 어느 변수부터 풀어도 상관없지만, 이 문제는 θ₂ → θ₁ → θ₃ 순서를 지켜야만 풀린다 — K₁, K₂가 θ₂에 의존하기 때문. 강사는 이 지점에서 **"역기구학에는 일반적인 방법(알고리즘)이 없다"**는 [4-1의 결론](../inverse-kinematics/main.md)을 다시 강조한다 — 새 로봇을 만나면 이런저런 방법을 다 시도해봐야 하고, 그래서 PUMA 560처럼 이상한 구조를 처음 푼 사람은 **논문**을 썼다("발견했습니다"라고).

**실무 포인트**: 로봇을 쓰는 사람(엔지니어)은 이 유도 과정을 직접 할 필요가 없다 — 설계한 사람이 이미 고생해서 정리해 둔 수식을 갖다 쓰면 된다. 다만 "이 수식이 왜 이렇게 생겼는지" 짐작할 수 있으면 디버깅에 도움이 된다.

---

## 3. 기하학적으로 다시 풀기 — 제2코사인 법칙

같은 3링크 평면 팔을, 이번엔 수식 대신 **그림 + 삼각법**으로 푼다. 목표는 **대수적 방법과 정확히 같은 답**이 나오는 것을 확인하는 것.

### θ₂ — 팔꿈치 삼각형

어깨(원점) – 팔꿈치 – 손끝을 잇는 삼각형에서, 대각선(어깨-손끝 직선) 길이는 목표점 (x, y)로 이미 정해진다:

$$d = \\sqrt{x^2+y^2}$$

여기서 함정: θ₂는 "이전 링크를 얼마나 꺾었나"로 정의되어 팔이 완전히 펴진 상태가 0°다. 그런데 삼각형의 **내각**은 팔이 펴진 상태(180°)에서 꺾인 만큼을 **빼는** 방향으로 정의된다 — 그래서 삼각형 내각은 (180° + θ₂)가 된다. 제2코사인 법칙을 이 내각에 적용하면:

$$d^2 = l_1^2 + l_2^2 - 2l_1l_2\\cos(180°+\\theta_2) = l_1^2+l_2^2+2l_1l_2\\cos\\theta_2$$

cos(180°+θ₂) = −cosθ₂이므로 부호가 뒤집혀 **[1절과 정확히 같은 c₂ 공식](#1-θ₁-구하기--치환으로-k₁-k₂를-r-γ로-바꾸기)**이 나온다 — 대수적/기하학적 두 경로가 같은 답에 도달함을 확인하는 지점.

### θ₁ — 두 개의 각을 더하고 뺀다

- β = Atan2(y, x): x₀축에서 목표점 방향까지의 각 (이미 앎)
- ψ: 삼각형에서 어깨 꼭짓점의 내각. l₂를 마주보는 변으로 제2코사인 법칙을 다시 적용:

$$l_2^2 = l_1^2 + d^2 - 2l_1 d\\cos\\psi \\quad\\Rightarrow\\quad \\cos\\psi = \\frac{l_1^2+d^2-l_2^2}{2l_1 d}$$

$$\\theta_1 = \\beta \\pm \\psi$$

**±가 다시 다중해**: 어깨를 기준으로 팔꿈치가 위/아래 어느 쪽으로 꺾이느냐에 따라 θ₁이 β보다 크거나 작아진다 — [elbow-up/elbow-down](../inverse-kinematics/main.md)과 동일한 다중해가 그림에서도 그대로 보인다. θ₃는 앞과 동일하게 φ − θ₁ − θ₂.

> "어떤 로봇은 대수적인 게 편하고 어떤 로봇은 기하학적인 게 편하고. 이 문제는 내가 봤을 때는 기하학적인 게 조금 더 빨리 구할 수 있어. 근데 다음 문제(6축)는 기하학적으로 잘 안 돼."

**실무 포인트**: 두 방법 중 뭘 먼저 시도할지는 로봇 구조를 보고 감으로 판단하는 것 — 우열은 없다.

---

## 4. 범용 기법 ① — 탄젠트 반각 치환

지금까지는 sin, cos이 각각 따로 분리되는 운 좋은 경우였다. 하나의 미지수 θ가 sin과 cos에 **뒤섞여 있어 분리가 안 되는** 초월함수 방정식을 만나면 다음 치환을 쓴다:

$$u = \\tan\\frac{\\theta}{2} \\quad\\Rightarrow\\quad \\sin\\theta = \\frac{2u}{1+u^2}, \\qquad \\cos\\theta = \\frac{1-u^2}{1+u^2}$$

sin, cos을 전부 u의 유리식으로 바꾸면 방정식이 **다항식(대수) 방정식**이 되어 u를 풀 수 있고, u를 구하면:

$$\\theta = 2\\,\\mathrm{Atan2}(u, 1)$$

**이해할 것**: 목적은 "초월함수(sin, cos) → 유리함수(다항식)" 변환이다 — sin, cos 자체가 안 풀리는 게 아니라 각이 지수처럼 섞여 못 푸는 형태를 풀 수 있는 형태로 바꾸는 것.
**외워도 되는 것**: 위 치환 공식 세 개 — 워낙 자주 나온다.

**실무 포인트**: 뒤에서 다룰 Pieper의 해(θ₃의 4차방정식)에서 A₁ = 0(인접 축 간격 없음)인 특수 케이스가 바로 이 치환 하나로 풀리는 사례다.

---

## 5. 범용 기법 ② — A cosθ + B sinθ = C

> "이건 거의 외우다시피 하면 돼."

가장 많이 쓰는 형태: 미지수 θ가 $A\\cos\\theta + B\\sin\\theta = C$ 꼴로 나오고 A, B, C는 (숫자든 다른 변수든) **이미 아는 값**일 때. [4절의 치환](#4-범용-기법-①--탄젠트-반각-치환)을 그대로 적용한다.

$$A\\cdot\\frac{1-u^2}{1+u^2} + B\\cdot\\frac{2u}{1+u^2} = C$$

양변에 (1+u²)를 곱해 정리하면 u에 대한 **2차방정식**이 나온다:

$$(A+C)u^2 - 2Bu + (A-C) = 0$$

근의 공식으로 u를 구하고 $\\theta = 2\\,\\mathrm{Atan2}(u,1)$로 되돌린다. [1절의 K₁, K₂ → R, γ 치환](#1-θ₁-구하기--치환으로-k₁-k₂를-r-γ로-바꾸기)도 구조적으로는 같은 발상("θ가 섞인 두 계수를 하나의 각으로 묶는다")이지만, 이 기법은 **분리 안 되는 A cosθ + B sinθ = C** 형태 전반에 바로 쓸 수 있어 훨씬 범용적이다.

**외울 것**: 이 형태 자체("A cosθ + B sinθ = C를 보면 u-치환") — 뒤의 Pieper의 해에서 θ₂를 구할 때 그대로 재사용된다.

---

## 6. 왜 마지막 3축을 한 점에서 교차시키는가 — 위치·방향 분리

pick-and-place 로봇(수직으로 집었다 놓기만 하는 팔)은 손끝 각도를 신경 쓸 필요가 없어 3~4축으로 충분하다. 하지만 자동차 공장에서 차체를 이리저리 돌리는 로봇처럼 **3차원 공간 어디든 원하는 위치 + 방향으로** 가야 하면 [6축이 필요](../inverse-kinematics/main.md)하다 — PUMA 560이 그 전형이다.

PUMA 560의 4, 5, 6번 축은 [한 점에서 서로 교차](../denavit-hartenberg-parameters/main.md)하도록 설계돼 있다. 3-3의 [오일러 각](../orientation-representations/main.md) 논의를 그대로 하드웨어로 구현한 것 — Z-Y-Z를 3번 회전시키면 어떤 방향이든 표현 가능하다는 결과를 그대로 4·5·6축에 심어 놓았다.

**교차의 효과**: 세 축이 한 점에서 만나면 그 구간(3→4→5→6)의 DH 파라미터 중 위치 관련 항 A, D가 전부 0이 된다 — 축이 이동 없이 회전만 하기 때문. 그러면 문제가 완전히 둘로 나뉜다:

| 구간 | 담당 | 미지수 |
|---|---|---|
| 1→2→3축 | **위치** (손목 중심의 XYZ) | θ₁, θ₂, θ₃ |
| 4→5→6축 | **방향** (오일러 각 Z-Y-Z) | θ₄, θ₅, θ₆ |

원래는 A, D가 없어질수록 방정식이 12개 → 각각 3개+3개로 쪼개지는 셈. 이게 바로 [4-1에서 언급한 Pieper 조건](../inverse-kinematics/main.md)("이웃하는 3개의 관절축이 한 점에서 교차하면 폐형식 해가 존재")의 구체적 메커니즘이다.

**실무 포인트**: 손목(4·5·6축)의 방향 계산은 오일러 각 추출이라 이미 아는 방법으로 쉽게 풀린다. 어려운 건 1·2·3축의 **위치** 계산 — 다음 절의 주제.

---

## 7. Pieper의 해 ① — 위치 방정식을 θ₃만의 함수로

손목 중심(4번 좌표계 원점)의 위치를 베이스 기준으로 구하려면:

$\${}^0P_{4org} = {}^0_1T\\,{}^1_2T\\,{}^2_3T\\cdot {}^3P_{4org}$$

**핵심 관찰**: $^3P_{4org}$(3번 좌표계에서 본 4번 원점의 위치)는 이미 알고 있는 DH 상수 a₃, d₄, α₃와, **아직 모르는** θ₃(cosθ₃, sinθ₃)로만 이루어져 있다 — 3→4 구간은 축이 교차해서 A, D가 0이지만, **3번 관절 자체는 아직 팔의 위치를 결정하는 관절**이라 θ₃가 그대로 남아 있다.

이 곱셈을 끝까지 전개하면 $^0P_{4org}$의 x, y, z 성분이 나오는데, 그 안에는 오직 **θ₃만 모르는 변수**로 남는다(a₃, d₄, α₃, 그리고 이미 구해진 θ₁, θ₂ 이전 항들은 다 알기 때문). 그래서 이 세 성분을 그냥 이름 붙여 정리한다:

$$F_1(\\theta_3),\\quad F_2(\\theta_3),\\quad F_3(\\theta_3)$$

**이해할 것**: "θ₃ 하나만 모르는 함수로 정리된다"는 구조가 핵심이다 — F₁, F₂, F₃의 구체적 전개식은 로봇의 DH 파라미터(a₃, d₄, α₃)에 따라 달라지므로 암기 대상이 아니다.

> "이거 여러분 오픈북이니까 외울 필요 없다고 했지. 회사 가서도 외울 필요 없지."

---

## 8. Pieper의 해 ② — θ₃ 4차방정식, 그리고 θ₂, θ₁ 순서로

목표점 위치 x, y, z는 이미 안다 — 그래서 $R \\equiv x^2+y^2+z^2$로 정의하면, $F_1^2+F_2^2+F_3^2$도 (같은 벡터의 길이 제곱이므로) R과 같아야 한다. 이 등식을 정리하는 과정에서 F₁, F₂, F₃의 조합을 다시 $K_1(\\theta_3), K_2(\\theta_3), K_3(\\theta_3), K_4(\\theta_3)$로 치환하면서 정리하면, 최종적으로 **θ₃에 대한 4차방정식**이 나온다(일반적인 경우).

> "세타3의 4차식이 나오는데... 근데 4차식이 되면, 풀 수 있다. 정말 풀리는지는 참고자료를 확인해라."

4차방정식은 대수적으로 근의 공식이 존재해 원리상 풀리지만, 실제 전개는 로봇마다 달라 손으로 풀 일이 없다 — 강사도 "시험에 내기도 어렵다"고 못 박는다. 대신 **DH 파라미터를 어떻게 설계하느냐**에 따라 훨씬 쉬운 특수해로 떨어진다:

| 조건 | 결과 |
|---|---|
| a₁ = 0 (인접 두 축의 간격 없음) | 탄젠트 반각 치환 하나로 바로 θ₃ 계산 |
| sinα₁ = 0 (인접 두 축이 평행) | z = K₄(θ₃)로 바로 떨어져 **2차방정식**으로 θ₃ 계산 |
| a₁ ≠ 0, α₁ ≠ 0 | 진짜 4차방정식을 풀어야 함 (일반적인 경우) |

**실무 포인트**: [4-1에서 "IK가 쉽게 풀리도록 설계한다"](../inverse-kinematics/main.md)고 했던 말의 정체가 이거다 — DH 파라미터의 a, α를 0으로 잡도록 설계하면 4차방정식이 2차방정식으로 줄어든다.

θ₃를 구하고 나면 순서대로 나머지가 풀린다:

1. θ₃를 알면 K₁, K₂, K₃(모두 θ₃의 함수)를 안다
2. [5절의 A cosθ+B sinθ=C 기법](#5-범용-기법-②--a-cosθ--b-sinθ--c)으로 **θ₂**를 구한다
3. θ₂를 알면 [1절의 K₁, K₂ → R, γ 기법](#1-θ₁-구하기--치환으로-k₁-k₂를-r-γ로-바꾸기)으로 **θ₁**을 구한다
4. θ₁, θ₂, θ₃로 위치 문제 완료 → [4·5·6축의 오일러 각](#6-왜-마지막-3축을-한-점에서-교차시키는가--위치·방향-분리)으로 θ₄, θ₅, θ₆까지 구하면 6축 전부 완성

**여기서도 순서가 중요하다** — [2절](#2-θ₃-구하기와-순서가-중요하다)과 똑같은 이유로, θ₃ → θ₂ → θ₁ 순서를 어기면 못 푼다.

---

## 9. Python 실습 코드

강의에서 다룬 두 범용 치환 기법과, 완성된 3링크 평면 팔의 θ₁, θ₂, θ₃ 전체를 코드로 재현한다.

\`\`\`python
import numpy as np

def solve_A_cos_B_sin_eq_C(A, B, C):
    """A*cos(theta) + B*sin(theta) = C를 탄젠트 반각 치환으로 푼다.
    (A+C)u^2 - 2Bu + (A-C) = 0 의 실근을 찾아 theta = 2*atan2(u, 1)로 되돌린다."""
    a, b, c = (A + C), -2 * B, (A - C)
    disc = b**2 - 4 * a * c
    if disc < 0:
        return []
    roots_u = [(-b + s * np.sqrt(disc)) / (2 * a) for s in (+1, -1)] if a != 0 else [-c / b]
    return [2 * np.arctan2(u, 1) for u in roots_u]

# 검증: A cos(theta)+B sin(theta)=C를 만족하는 theta가 실제로 나오는지
A, B, C = 3.0, 4.0, 2.0
for theta in solve_A_cos_B_sin_eq_C(A, B, C):
    lhs = A * np.cos(theta) + B * np.sin(theta)
    print(f"theta={np.degrees(theta):.2f}도, 좌변={lhs:.6f} (목표 C={C})")


def ik_3link_planar(x, y, phi, l1, l2, elbow_up=True):
    """3링크 평면 팔 IK 완성본: theta2 -> theta1 -> theta3 순서."""
    c2 = (x**2 + y**2 - l1**2 - l2**2) / (2 * l1 * l2)
    if abs(c2) > 1:
        return None
    s2 = np.sqrt(1 - c2**2) * (1 if elbow_up else -1)
    theta2 = np.arctan2(s2, c2)

    K1 = l1 + l2 * c2          # theta2가 있어야 구할 수 있는 값 -> 순서 고정
    K2 = l2 * s2
    gamma = np.arctan2(K2, K1)
    theta1 = np.arctan2(y, x) - gamma

    theta3 = phi - theta1 - theta2   # phi = theta1+theta2+theta3
    return theta1, theta2, theta3


def fk_3link_planar(theta1, theta2, theta3, l1, l2):
    """검증용 FK: 관절각 -> 손끝 (x, y, phi)"""
    x = l1 * np.cos(theta1) + l2 * np.cos(theta1 + theta2)
    y = l1 * np.sin(theta1) + l2 * np.sin(theta1 + theta2)
    phi = theta1 + theta2 + theta3
    return x, y, phi


# --- 검증: IK -> FK 왕복이 목표로 돌아오는가 ---
l1, l2 = 1.0, 0.7
target = (1.2, 0.6, np.radians(45))
for elbow in (True, False):
    sol = ik_3link_planar(*target, l1, l2, elbow_up=elbow)
    if sol:
        back = fk_3link_planar(*sol, l1, l2)
        print(f"elbow_up={elbow}: theta(deg)={np.degrees(sol).round(2)}, "
              f"FK 복원=({back[0]:.6f}, {back[1]:.6f}, {np.degrees(back[2]):.2f}도)")
\`\`\`

### 연습 문제 (TODO)

\`\`\`python
# TODO 1: solve_A_cos_B_sin_eq_C가 반환한 theta 각각에 대해
#   A*cos(theta)+B*sin(theta)가 실제로 C와 일치하는지 np.isclose로 검증하는
#   테스트 함수를 작성하라. A,B,C를 무작위로 20세트 뽑아 전부 통과하는지 확인.

# TODO 2: ik_3link_planar의 3절(기하학적 방법)을 별도 함수
#   ik_3link_planar_geometric(x, y, phi, l1, l2, elbow_up)으로 구현하라.
#   beta = atan2(y, x), psi는 제2코사인 법칙으로 구하고 theta1 = beta +- psi.
#   검증: 같은 목표에 대해 대수적 방법과 각도가 (부동소수 오차 내에서) 일치해야 한다.

# TODO 3: elbow_up=True/False 두 해를 어깨-팔꿈치-손끝 선분으로 그려라
#   (plt.plot). 두 자세의 손끝이 같은 점에서 겹치는지 눈으로 확인.

# TODO 4 (심화): a1=0 특수 케이스를 흉내내라.
#   solve_A_cos_B_sin_eq_C에서 A=0인 경우(즉 B*sin(theta)=C 꼴)를 넣어
#   tan(theta/2) 치환 없이 바로 arcsin으로 푼 값과 결과가 같은지 비교하라.
#   (8절의 "a1=0이면 탄젠트 반각 치환 하나로 바로 풀린다"는 문장을 검증하는 셈)
\`\`\`

**실무 연결**: PUMA 560류의 6축 스퇴리컬 리스트(spherical wrist) 로봇은 ROS2 MoveIt에서 IKFast 같은 폐형식 solver를 자동 생성해 이 유도 과정을 대신해준다 — 사람이 손으로 4차방정식을 풀 필요가 없는 이유다. 반면 손목축이 교차하지 않는 로봇(비-spherical wrist)은 폐형식 해가 보장되지 않아 KDL 같은 수치해 solver로 가야 한다.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| θ₁ (대수적) | X=K₁c₁−K₂s₁, Y=K₁s₁+K₂c₁ → K₁,K₂를 R,γ로 치환 → θ₁=Atan2(y,x)−γ. **θ₂를 먼저 구해야 K₁,K₂를 안다** |
| θ₃ | φ − θ₁ − θ₂. 순서 고정(θ₂→θ₁→θ₃) — 연립방정식과 달리 임의 순서로 못 품 |
| 기하학적 재검증 | 제2코사인 법칙 두 번 — 팔꿈치 내각(180°+θ₂)으로 θ₂, 어깨 내각 ψ로 θ₁=β±ψ. **대수적 방법과 같은 답** |
| 탄젠트 반각 치환 | u=tan(θ/2) → sinθ=2u/(1+u²), cosθ=(1−u²)/(1+u²), θ=2Atan2(u,1). sin·cos 섞인 초월방정식 → 다항식으로 변환하는 범용 도구 |
| A cosθ+B sinθ=C | 위 치환으로 (A+C)u²−2Bu+(A−C)=0의 2차방정식이 됨. **가장 많이 쓰는 패턴, 거의 암기** |
| 스퇴리컬 리스트 | 4·5·6축이 한 점에서 교차 → A=D=0 → 위치(1·2·3축)와 방향(4·5·6축, ZYZ 오일러) 완전 분리 |
| Pieper의 해 | ⁰P₄org = F₁,F₂,F₃(모두 θ₃만의 함수) → 제곱합에서 K₁~K₄ 정리 → **θ₃의 4차방정식**(일반적 경우) |
| 특수해 | a₁=0 → 반각 치환으로 직접 풀림 / sinα₁=0 → 2차방정식 / 둘 다 아니면 진짜 4차방정식 |
| 풀이 순서 (6축) | θ₃(4차/2차) → θ₂(A cosθ+B sinθ=C) → θ₁(K₁,K₂→R,γ) → θ₄,θ₅,θ₆(오일러 각) |
| 설계 원칙 재확인 | DH의 a, α를 0으로 설계 → 4차방정식이 2차방정식으로 축소 — "쉽게 풀리도록 설계한다"의 정체 |
`,

  'Robotics/inverse-kinematics-puma560-closed-form': `---
title: PUMA 560 역기구학 완성 — 폐형식 풀이와 교시·재현 (Inverse Kinematics)
date: 2026-08-08
tags: inverse-kinematics, puma560
order: 
featured: false
draft: false
---

# PUMA 560 역기구학 완성 — 폐형식 풀이와 교시·재현 (Inverse Kinematics)

> 출처: 로봇제어공학 — Introduction to Robotics (Craig) 4.7절 "머니퓰레이터 역기구학의 예: PUMA 560"
> 영상: https://www.youtube.com/watch?v=xichlCmij0o&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=10
> 대상: [4-2](../inverse-kinematics-algebraic-geometric-pieper/main.md)에서 일반형(F₁,F₂,F₃, K₁~K₄, 4차방정식)으로 배운 Pieper의 해를, [3-3에서 구한](../forward-kinematics/main.md) PUMA 560의 실제 DH 상수(a₂, a₃, d₃, d₄)에 대입해 θ₁~θ₆ 전부를 손으로 끝까지 구한다.

---

## 목차

1. [왜 로봇마다 구조가 다른가](#1-왜-로봇마다-구조가-다른가--직렬-대-병렬)
2. [θ₁ 구하기](#2-θ₁-구하기--⁰₁t⁻¹를-왼쪽에-넘겨서-14-항-비교)
3. [θ₃ 구하기](#3-θ₃-구하기--세-방정식을-제곱해-더하면-4-2의-k가-숫자로-나온다)
4. [θ₂ 구하기](#4-θ₂-구하기--s₂₃-c₂₃의-2원-1차-연립방정식)
5. [θ₄, θ₅, θ₆ 구하기](#5-θ₄-θ₅-θ₆-구하기--손목-3축을-오일러-각처럼-벗겨낸다)
6. [짐벌락 — θ₅ = 0](#6-짐벌락--θ₅--0이면-4번·6번-축이-겹친다)
7. [다중해 8개](#7-다중해-8개--부호-조합과-손목-뒤집음)
8. [폐형식 해를 실무에 쓰는 법](#8-폐형식-해를-실무에-쓰는-법--대입만-하면-실시간)
9. [교시와 재현](#9-교시와-재현-teach--playback--ik-없이-로봇을-쓰는-현실)
10. [Python 실습 코드](#10-python-실습-코드)
11. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 왜 로봇마다 구조가 다른가 — 직렬 대 병렬

본론(θ₁~θ₆ 풀이)에 들어가기 전에, 강의는 실제 산업용 로봇들을 훑으며 "왜 하필 PUMA 560 같은 구조를 시험/실무에서 표준으로 쓰는가"를 짚는다.

| 구조 | 움직임 | 역기구학 난이도 | 비고 |
|---|---|---|---|
| **겐트리 (Gantry, X-Y-Z)** | 프리스메틱 3개, 직교 이동만 | 계산할 것도 없음 — 목표 좌표가 곧 관절값 | 회전이 없어 가장 쉽지만 차지하는 공간이 큼 |
| **스카라 (SCARA)** | 레볼루트-레볼루트-프리스메틱 | 로테이션 2개가 있어 겐트리보다 어려움 | 평면 작업(픽앤플레이스)에 널리 쓰임 |
| **PUMA 560 / 스탠포드 타입** | 레볼루트(스탠포드는 3번 축만 프리스메틱) 6개, 직렬 체인 | 폐형식으로 풀림 (이 노트의 주제) | 마지막 3축이 손목 한 점에서 교차하도록 설계 |
| **스튜어트 플랫폼 (병렬 로봇)** | 6개 선형 액추에이터가 상판을 동시에 떠받침 | 기구학이 완전히 다른 문제(병렬 기구학) | 페이로드를 6개가 나눠 짊 → **가반하중이 훨씬 큼** |

**직렬 로봇의 근본적 약점 — 토크가 누적된다.** PUMA 560처럼 링크가 체인으로 이어진 구조는 손끝의 무게뿐 아니라 **자기 자신의 링크·모터 무게까지 베이스 쪽 관절이 전부 들어야** 한다. 그래서 베이스에 가까운 관절일수록 토크(=힘×팔길이)가 크고 모터가 커진다.

> "얘는 얘도 들어야 되고, 얘도 들어야 되고, 얘도 들어야 되고, 끝에 물건도 들어야 돼. 그 와중에 또 멀어. 그러니까 굉장히 힘들어."

반대로 **스튜어트 플랫폼(병렬 구조)**은 상판의 하중을 6개 다리가 나눠서 받치므로 같은 무게 대비 훨씬 가볍게 설계할 수 있다 — 비행 시뮬레이터에 널리 쓰이는 이유다. 다만 병렬 구조는 기구학 자체가 이 노트의 방법(직렬 체인의 DH·역기구학)과 다른 별도 이론이라 이 수업(과 이 노트)의 범위 밖이다.

**실무 포인트**: 이 강의(와 시험)가 다루는 건 **직렬 체인 + 스퇴리컬 손목** 구조뿐이다 — [3-3에서 이미 DH 테이블을 완성한](../forward-kinematics/main.md) PUMA 560이 그 대표 사례다.

---

## 2. θ₁ 구하기 — ⁰₁T⁻¹를 왼쪽에 넘겨서 (1,4) 항 비교

### 문제를 세우는 방식 — 양변을 인버스로 밀어낸다

[3-3의 부분곱 전략](../forward-kinematics/main.md)대로 ⁰₆T = ⁰₁T·¹₆T로 놓고, 양변에 **⁰₁T⁻¹를 왼쪽에서 곱해** 미지수를 오른쪽으로 몰아낸다:

$$\\left[{}^0_1T(\\theta_1)\\right]^{-1} \\, {}^0_6T_{goal} = {}^1_2T(\\theta_2)\\,{}^2_3T(\\theta_3)\\,{}^3_4T(\\theta_4)\\,{}^4_5T(\\theta_5)\\,{}^5_6T(\\theta_6)$$

좌변은 **목표 자세(주어진 값)와 θ₁(미지수) 뿐**이고, 우변은 θ₂~θ₆로만 이루어져 아직 다 모른다. 그런데 [1↔3 구간이 통째로 (0,0,1,d₃)인 y행을 가졌던 것](../forward-kinematics/main.md)처럼, 우변에도 θ₁만으로 결정되는 **간단한 성분**이 하나 있다 — 바로 (2,4) 성분 = ¹pᵧ = d₃(상수). 그 항 하나만 골라 좌변과 비교하면 θ₂~θ₆ 없이 θ₁만 남는 식이 나온다.

### 좌변 (1,4) 성분

⁰₁T⁻¹는 [3-3에서 A=D=0인 구간](../inverse-kinematics-algebraic-geometric-pieper/main.md)과 달리 α, a가 0이라 회전행렬의 **전치 = 역행렬**로 바로 나온다(로테이션 인버스는 트랜스포즈):

$$
\\left[{}^0_1T\\right]^{-1} =
\\begin{bmatrix}
c_1 & s_1 & 0 & 0\\\\
-s_1 & c_1 & 0 & 0\\\\
0 & 0 & 1 & 0\\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

이 행렬을 목표 행렬 ⁰₆T_goal = [rᵢⱼ, pₓ, pᵧ, p_z]와 곱해 (2,4) 성분(²행 4열, 즉 y좌표 위치)을 뽑으면:

$$-s_1\\,p_x + c_1\\,p_y = d_3$$

### 삼각치환으로 풀기 — [4-2의 K₁,K₂→R,γ 치환](../inverse-kinematics-algebraic-geometric-pieper/main.md)과 같은 발상

pₓ, pᵧ를 극좌표로 치환한다: $p_x = \\rho\\cos\\phi,\\ p_y=\\rho\\sin\\phi$, 여기서 $\\rho=\\sqrt{p_x^2+p_y^2},\\ \\phi=\\mathrm{Atan2}(p_y,p_x)$ — 전부 목표점에서 바로 아는 값이다. 대입해 정리하면:

$$\\sin(\\phi-\\theta_1) = \\frac{d_3}{\\rho}, \\qquad \\cos(\\phi-\\theta_1) = \\pm\\sqrt{1-\\frac{d_3^2}{\\rho^2}}$$

두 식을 다시 atan2에 넣으면:

$$\\phi - \\theta_1 = \\mathrm{Atan2}\\!\\left(\\frac{d_3}{\\rho},\\ \\pm\\sqrt{1-\\frac{d_3^2}{\\rho^2}}\\right)$$

**최종 정리** — 분모 ρ²를 통분해 정리하면 교재 표기로 떨어진다:

$$\\boxed{\\theta_1 = \\mathrm{Atan2}(p_y,p_x) - \\mathrm{Atan2}\\!\\left(d_3,\\ \\pm\\sqrt{p_x^2+p_y^2-d_3^2}\\right)}$$

**±가 다중해**: 부호 하나로 θ₁의 두 해가 나온다. 이해할 것은 "치환으로 미지수 하나만 남기고 atan2로 되돌린다"는 절차 — 구체적 전개식(-s₁pₓ+c₁pᵧ=d₃)은 PUMA 560의 DH 값(d₃)에 딸린 것이라 로봇마다 다르다.

---

## 3. θ₃ 구하기 — 세 방정식을 제곱해 더하면 4-2의 K가 숫자로 나온다

### 같은 좌변, (1,4)·(2,4)·(3,4) 세 항 모두 사용

이번엔 θ₁을 이미 알고 있으므로 좌변(=⁰₁T⁻¹·⁰₆T_goal)의 (1,4), (2,4), (3,4) 세 항을 **전부** 계산할 수 있다. 우변과 비교하면 방정식 3개:

$$
\\begin{aligned}
c_1 p_x + s_1 p_y &= a_2 c_2 + a_3 c_{23} - d_4 s_{23} &(1)\\\\
-p_z &= a_2 s_2 + a_3 s_{23} + d_4 c_{23} &(2)\\\\
-s_1 p_x + c_1 p_y &= d_3 &(3)
\\end{aligned}
$$

(3)은 [2절에서 이미 쓴 식](#2-θ₁-구하기--⁰₁t⁻¹를-왼쪽에-넘겨서-14-항-비교) 그대로다.

### 제곱해서 더하면 θ₁, θ₂가 통째로 사라진다

[4-1의 "x²+y²로 θ₁ 소거"](../inverse-kinematics/main.md)와 같은 아이디어를 한 단계 더 세게 쓴다 — 세 식을 각각 제곱해서 더하면, sin²+cos²=1이 반복 적용되며 θ₂와 θ₁이 동시에 지워지고 **θ₃만** 남는다:

$$p_x^2+p_y^2+p_z^2 = a_2^2+a_3^2+d_3^2+d_4^2+2a_2(a_3c_3-d_4s_3)$$

좌변은 전부 목표점(아는 값), 우변의 a₂,a₃,d₃,d₄는 [DH 상수(아는 값)](../forward-kinematics/main.md) — 남는 미지수는 θ₃뿐이다. 정리하면 [4-2에서 추상적으로 "K"라 불렀던 값](../inverse-kinematics-algebraic-geometric-pieper/main.md)이 PUMA 560에서는 구체적인 숫자식으로 나온다:

$$K \\equiv \\frac{p_x^2+p_y^2+p_z^2-a_2^2-a_3^2-d_3^2-d_4^2}{2a_2}, \\qquad a_3\\cos\\theta_3 - d_4\\sin\\theta_3 = K$$

> 이 강의에서 4-2의 일반형이 왜 4차방정식까지 안 가고 여기서 끝나는지 확인할 수 있다: PUMA 560은 **sin α₁ = 0** (2번과 3번 축이 평행) 조건을 만족해서, [4-2 8절의 특수해 표](../inverse-kinematics-algebraic-geometric-pieper/main.md)대로 곧장 **A cosθ+B sinθ=C 형태(2차방정식)**로 떨어진다.

[4-2 5절의 범용 치환](../inverse-kinematics-algebraic-geometric-pieper/main.md)을 그대로 적용하면:

$$\\boxed{\\theta_3 = \\mathrm{Atan2}(a_3,d_4) - \\mathrm{Atan2}\\!\\left(K,\\ \\pm\\sqrt{a_3^2+d_4^2-K^2}\\right)}$$

**외울 필요 없는 것**: K의 구체적 전개(DH 상수 조합) — **외울 것**: "세제곱합으로 두 변수를 동시에 지운다"는 절차 자체, 그리고 그 결과가 항상 A cosθ+B sinθ=C 꼴로 정리된다는 패턴.

---

## 4. θ₂ 구하기 — s₂₃, c₂₃의 2원 1차 연립방정식

θ₁, θ₃를 모두 안 상태에서 [3절의 (1), (2)번 식](#3-θ₃-구하기--세-방정식을-제곱해-더하면-4-2의-k가-숫자로-나온다)을 다시 본다. c₂ = cos(θ₂₃−θ₃) = c₂₃c₃+s₂₃s₃, s₂ = sin(θ₂₃−θ₃) = s₂₃c₃−c₂₃s₃를 대입해 **θ₂ 자리를 전부 θ₂₃(=θ₂+θ₃)로 바꿔치기**하면:

$$
\\begin{aligned}
(a_2c_3+a_3)\\,c_{23} + (a_2s_3-d_4)\\,s_{23} &= c_1p_x+s_1p_y &(1')\\\\
-(a_2s_3-d_4)\\,c_{23} + (a_2c_3+a_3)\\,s_{23} &= -p_z &(2')
\\end{aligned}
$$

여기서 c₃, s₃(θ₃로 이미 앎), pₓ,pᵧ,p_z(목표점), a₂,a₃,d₄(DH 상수) 전부 **아는 값**이고, 모르는 건 s₂₃, c₂₃ 둘뿐이다 — [4-2에서 F₁(θ₃), F₂(θ₃), F₃(θ₃)라 불렀던 것](../inverse-kinematics-algebraic-geometric-pieper/main.md)이 여기서는 s₂₃, c₂₃라는 두 미지수의 계수로 등장하는 것이다.

> "여러분 2원 1차 방정식으로 생각합시다. 그냥 x, y라고 생각하고... 모르는 거 2개, 식 2개. 가감법이니 대입법이니 연립방정식 풀면 딱 나오지."

가감법으로 풀면(A ≡ a₂c₃+a₃, B ≡ a₂s₃−d₄, P ≡ c₁pₓ+s₁pᵧ로 줄여 쓰면 분모가 같은 2×2 선형계 A²+B²):

$$
c_{23} = \\frac{A\\,P + B\\,p_z}{A^2+B^2}, \\qquad
s_{23} = \\frac{B\\,P - A\\,p_z}{A^2+B^2}
$$

$$\\theta_{23} = \\mathrm{Atan2}(s_{23}, c_{23}) \\qquad\\Rightarrow\\qquad \\boxed{\\theta_2 = \\theta_{23} - \\theta_3}$$

**순서가 고정된다는 걸 다시 확인**: [4-2에서 강조한 순서 문제](../inverse-kinematics-algebraic-geometric-pieper/main.md) 그대로 — θ₃ → θ₂ 순서를 지켜야 한다. θ₁과 θ₃가 각각 ± 두 해를 가지므로, 이 시점에서 θ₂₃는 벌써 **네 가지 가능한 값**을 갖는다.

**실무 포인트**: 로봇을 쓰는 사람이 이 유도를 다시 할 필요는 없다 — 설계자가 미리 만들어 둔 위 세 공식(θ₁, θ₃, θ₂)에 DH 상수와 목표점만 넣으면 끝이다.

---

## 5. θ₄, θ₅, θ₆ 구하기 — 손목 3축을 오일러 각처럼 벗겨낸다

### 왜 손목만 따로 푸나 — [구형 손목](../forward-kinematics/main.md)의 효과가 여기서 실현된다

θ₁,θ₂,θ₃로 손목 중심(4번 좌표계 원점)의 **위치**는 이미 확정했다. 남은 θ₄,θ₅,θ₆은 순수하게 **방향(orientation)**만 담당한다 — [4·5·6축이 한 점에서 교차하도록 설계](../forward-kinematics/main.md)했기 때문에 가능한 분리다. 방법은 [2절과 완전히 같은 패턴](#2-θ₁-구하기--⁰₁t⁻¹를-왼쪽에-넘겨서-14-항-비교) — 이번엔 ³₆T = [³₁T]⁻¹·⁰₆T_goal로 미지수를 오른쪽에 남긴다.

$$\\left[{}^0_3T(\\theta_1,\\theta_2,\\theta_3)\\right]^{-1}{}^0_6T_{goal} = {}^3_4T(\\theta_4)\\,{}^4_5T(\\theta_5)\\,{}^5_6T(\\theta_6)$$

### θ₄ — (1,3), (3,3) 성분 비교

우변 ³₄T·⁴₅T·⁵₆T의 (1,3), (3,3) 성분을 비교하면:

$$r_{13}c_1c_{23}c_4 + r_{23}s_1c_{23}c_4 - r_{33}s_{23}c_4 = -c_4s_5, \\qquad -r_{13}s_1+r_{23}c_1 = s_4s_5$$

s₅ ≠ 0인 일반적인 경우, 두 식을 정리해:

$$\\boxed{\\theta_4 = \\mathrm{Atan2}(-r_{13}s_1+r_{23}c_1,\\ -r_{13}c_1c_{23}-r_{23}s_1c_{23}+r_{33}s_{23})}$$

### θ₅ — 다시 (1,3), (3,3) 비교 (한 단계 안쪽 ⁴₆T)

⁴₆T = ⁴₅T·⁵₆T까지 좁혀 같은 자리를 비교하면:

$$s_5 = -\\big[r_{13}(c_1c_{23}c_4+s_1s_4)+r_{23}(s_1c_{23}c_4-c_1s_4)-r_{33}(s_{23}c_4)\\big], \\qquad c_5 = -r_{13}c_1s_{23}-r_{23}s_1s_{23}-r_{33}c_{23}$$

$$\\boxed{\\theta_5 = \\mathrm{Atan2}(s_5, c_5)}$$

### θ₆ — 마지막으로 [⁰₅T]⁻¹⁰₆T_goal = ⁵₆T의 (3,1), (1,1) 비교

$$
\\begin{aligned}
s_6 &= -r_{11}(c_1c_{23}s_4-s_1c_4) - r_{21}(s_1c_{23}s_4+c_1c_4) + r_{31}(s_{23}s_4)\\\\
c_6 &= r_{11}\\big[(c_1c_{23}c_4+s_1s_4)c_5-c_1s_{23}s_5\\big] + r_{21}\\big[(s_1c_{23}c_4-c_1s_4)c_5-s_1s_{23}s_5\\big] - r_{31}\\big[s_{23}c_4c_5+c_{23}s_5\\big]
\\end{aligned}
$$

$$\\boxed{\\theta_6 = \\mathrm{Atan2}(s_6, c_6)}$$

**이해할 것 vs 외울 필요 없는 것**: θ₄,θ₅,θ₆이 전부 "행렬 인버스를 넘겨서 특정 항끼리 비교 → atan2"라는 **같은 절차의 3회 반복**이라는 구조가 핵심이다. 각 식의 구체적 전개(r₁₃, c₂₃ 조합)는 PUMA 560의 DH 값에 딸린 것이라 암기 대상이 아니다 — 실무에서는 이 공식들을 코드로 한 번 짜 두고 계속 재사용한다.

---

## 6. 짐벌락 — θ₅ = 0이면 4번·6번 축이 겹친다

θ₄ 계산식은 **s₅ ≠ 0**을 전제로 한다. s₅ = 0(θ₅ = 0)이면 [5절 θ₄ 식](#5-θ₄-θ₅-θ₆-구하기--손목-3축을-오일러-각처럼-벗겨낸다)의 우변도 좌변도 전부 0이 되어 "0 = 0"이라는 의미 없는 항등식만 남는다 — θ₄가 그 식으로는 안 풀린다.

**물리적 의미**: θ₅ = 0은 4번 축(Z₄)과 6번 축(Z₆)이 **일직선으로 정렬**된다는 뜻이다.

> "5번이 0이면 4번하고 6번하고 축이 나란히 있는 거야. 그러면 끝에 점이 이렇게 돌아가는 방법은, 세타4가 이렇게 돌아도 되고요, 세타6가 돌아도 되고요, 혹은 세타4랑 세타6랑 반반씩 나눠도 되고. 왜냐면 세타5가 0이면 세타4하고 세타6가 일렬로 딱 맞춰지니까 똑같은 역할을 한다고."

원래 4·5·6축은 자유도 3개(3차원 방향을 전부 표현)인데, θ₅=0이 되는 순간 4번·6번이 **같은 회전축을 공유**해 사실상 자유도 하나를 잃는다 — 손끝이 만들 수 있는 방향이 한 방향으로 줄어든다. 이것이 [오일러 각 표현](../orientation-representations/main.md)에서 이미 만났던 **짐벌락(gimbal lock)**의 로봇 팔 버전이다.

**실무 포인트**: θ₄, θ₆을 어떻게 나눠도 최종 방향은 같으므로, 이런 특이 자세에서는 θ₄를 (보통 현재값을 유지하도록) 임의로 고정하고 θ₆으로 나머지를 맞춘다. 시험/암기 대상이 아니라 **"이런 특이점이 있을 수 있다"는 주의사항**으로만 기억하면 된다.

---

## 7. 다중해 8개 — 부호 조합과 손목 뒤집음

[4-1에서 예고한 "PUMA는 해가 4개"](../inverse-kinematics/main.md)가 실제로 어디서 나오는지 이 노트에서 전부 확인된다:

| 다중해의 원천 | 개수 |
|---|---|
| θ₁의 ± ([2절](#2-θ₁-구하기--⁰₁t⁻¹를-왼쪽에-넘겨서-14-항-비교)) | ×2 |
| θ₃의 ± ([3절](#3-θ₃-구하기--세-방정식을-제곱해-더하면-4-2의-k가-숫자로-나온다)) | ×2 |
| **소계 (위치 3축)** | **4개** |
| 손목 뒤집음 (wrist flip) | ×2 |
| **전체 (6축)** | **8개** |

θ₁, θ₃가 부호 두 개씩을 가지므로 여기까지 이미 위치를 만드는 4가지 자세(θ₁,θ₂,θ₃)가 나온다. 여기에 더해 **손목 뒤집음**이라는 추가 자유도가 있다 — 손목을 "정자세"로 두거나 "180° 뒤집어" 두어도 손끝의 최종 방향은 같게 맞출 수 있다:

$$\\theta_4' = \\theta_4+180°,\\qquad \\theta_5' = -\\theta_5,\\qquad \\theta_6' = \\theta_6+180°$$

그래서 총 4×2 = **8개의 해**가 나온다. (해 선택 기준은 [4-1의 충돌 회피 → 최소 이동량 → 최소 가속도 우선순위](../inverse-kinematics/main.md) 그대로 적용한다.)

---

## 8. 폐형식 해를 실무에 쓰는 법 — 대입만 하면 실시간

강의는 이 절 전체를 "실제로 회사 가서 이걸 쓴다면"으로 마무리한다.

1. **DH 파라미터는 로봇을 설계/구매하는 순간 숫자로 고정**된다 (a₂, a₃, d₃, d₄ 전부 상수).
2. [2절](#2-θ₁-구하기--⁰₁t⁻¹를-왼쪽에-넘겨서-14-항-비교)~[5절](#5-θ₄-θ₅-θ₆-구하기--손목-3축을-오일러-각처럼-벗겨낸다)에서 유도한 θ₁~θ₆ 공식 6개를 **한 번만** 프로그램으로 짜 둔다.
3. 목표 자세(PX, PY, PZ + 롤·피치·요 → 회전행렬 r₁₁~r₃₃)가 주어지면, 그 값을 공식에 순서대로(θ₁ → θ₃ → θ₂ → θ₄ → θ₅ → θ₆) **대입만** 하면 된다.

> "탁 넣어주는 순간에 세타1 탁 구해지고, 세타1을 이용해서 세타3 구해지고, 세타3 이용해서 세타2 구하고요... 세사사삭 구해지는 거지. 순식간에. 실시간, 거의 실시간이죠. 뭐 0. 몇 밀이 언더로 탁 구해지는 거지."

이게 **폐형식(closed-form)**의 본질이다 — 반복 계산 없이 사칙연산 + sin/cos/atan2 몇 번으로 답이 바로 나온다. 강의는 이를 "대수적인 폐형식으로 풀었다"고 정리하며, [4-1의 폐형식 vs 수치해 비교](../inverse-kinematics/main.md)에서 폐형식이 "제일 좋은 솔루션"이라 했던 이유가 여기서 숫자로 확인된다.

**왜 이렇게 풀리는 로봇이 드문데도 다들 이 구조를 쓰나**: "솔루션 있는 게 누구든 편하니까 — 쓰는 사람도 편하고, 만든 사람도 편하고." 위치 3축 + 스퇴리컬 손목 3축이라는 설계 원칙([3-3](../forward-kinematics/main.md), [4-2](../inverse-kinematics-algebraic-geometric-pieper/main.md))을 지키면 스탠포드 타입(3번 관절만 프리스메틱)도 손목 부분은 PUMA와 완전히 동일하게 풀린다 — 4·5·6축 공식은 그대로 재사용된다.

---

## 9. 교시와 재현 (Teach & Playback) — IK 없이 로봇을 쓰는 현실

여기까지의 역기구학은 **"목표 좌표를 알고 있을 때"**를 전제로 한다. 그런데 공장에서 로봇을 다루는 사람 대부분은 로보틱스 전공자가 아니다.

> "지금 거기에서 트랜스포메이션 매트리스 계산하고 있겠냐고. 바로 당장 써야 되는데... 그래서 어떻게 해요? 제일 쉬운 방법이 교시라는 거예요."

**교시(teach)-재현(playback)** 방식은 계산을 아예 건너뛴다:

1. **교시 모드**를 켜면 로봇 팔이 중력을 이겨내며 가볍게 저항 없이 움직인다 — 사람이 손으로 팔을 잡고 원하는 경유점들로 직접 옮긴다.
2. [티치 펜던트](../forward-kinematics/main.md)(리모컨형 조작기)의 버튼으로 각 위치를 "0번 위치", "1번 위치"… 식으로 저장한다.
3. **재현** 버튼을 누르면 저장된 순서대로 그대로 반복한다.

이 방식에서는 DH 파라미터도, 역기구학도 필요 없다 — 순수하게 **반복 정확도(repeatability)**만 중요하다: "내가 가르쳐준 대로 얼마나 수만 번을 똑같이 재현할 수 있느냐."

### 리피터빌리티 대 어퀴러시 — 무엇이 다른가

| | 정의 | 언제 중요한가 |
|---|---|---|
| **리피터빌리티 (repeatability)** | 같은 명령을 반복했을 때 **같은 자리로 얼마나 정확히 돌아오는가** | 교시-재현. 사람 눈으로 대충 잡아준 위치를 계속 똑같이만 반복하면 됨 |
| **어퀴러시 (accuracy)** | 계산한 목표 위치에 **실제로 얼마나 정확히 도달하는가** | 이 노트처럼 기구학·역기구학으로 좌표를 계산해 명령할 때 |

> "아까 리피터빌리티 교시할 때는 여러분 이거 정확하게 안 해. 사람 손은 이쯤이라고 하지. 사람이 뭐 정확해? ... 여기서는 어퀴러시가 중요하다."

**표준 좌표계로 다시 정리**: [{B} 기저 · {S} 정지 · {W} 손목 · {T} 공구 · {G} 목표](../forward-kinematics/main.md) 다섯 좌표계 중, {B}↔{S}는 자로 재고, {S}↔{G}는 카메라·센서로 재고, {B}↔{W}는 이 노트에서 완성한 계산으로 얻는다. 세 조각을 다 알면 로봇이 목표 물건까지 자동으로 갈 수 있다 — 다만 그 계산이 부담스러운 현장에서는 교시-재현으로 통째로 우회한다.

**실무 포인트**: 예전 산업용 로봇이 잘 안 팔린 이유가 바로 이 계산 부담이었다. 교시-재현 모드가 보편화되고 반복 정확도가 좋아지면서 로봇 도입 장벽이 크게 낮아졌다 — 요즘은 두 방식(정밀한 어퀴러시 계산 + 편리한 교시-재현)을 섞고, 카메라·센서로 오차를 보정하는 캘리브레이션까지 함께 발전하고 있다.

---

## 10. Python 실습 코드

[3-3의 \`puma560_fk\`](../forward-kinematics/main.md)와 짝을 이루는 완전한 역기구학 함수. θ₃→θ₂→θ₁ 순서, 그리고 θ₄→θ₅→θ₆ 순서를 지킨다.

\`\`\`python
import numpy as np

# ── PUMA 560 DH 상수 (3-3과 동일, Craig 교재 값, 단위 m) ──
a2, a3 = 0.4318, 0.0203
d3, d4 = 0.1244, 0.4318


def puma560_ik(px, py, pz, R, elbow_sign=1, wrist_sign=1, flip=False):
    """PUMA 560 폐형식 역기구학.
    px,py,pz: 목표 위치 / R: 3x3 목표 회전행렬 (r11..r33)
    elbow_sign: theta1의 +-  / wrist_sign: theta3의 +-  / flip: 손목 뒤집음 여부
    반환: (theta1..theta6) in radians, 해가 없으면 None
    """
    r11, r12, r13 = R[0]
    r21, r22, r23 = R[1]
    r31, r32, r33 = R[2]

    # theta1 (2절)
    disc1 = px**2 + py**2 - d3**2
    if disc1 < 0:
        return None
    t1 = np.arctan2(py, px) - np.arctan2(d3, elbow_sign * np.sqrt(disc1))
    c1, s1 = np.cos(t1), np.sin(t1)

    # theta3 (3절)
    K = (px**2 + py**2 + pz**2 - a2**2 - a3**2 - d3**2 - d4**2) / (2 * a2)
    disc3 = a3**2 + d4**2 - K**2
    if disc3 < 0:
        return None
    t3 = np.arctan2(a3, d4) - np.arctan2(K, wrist_sign * np.sqrt(disc3))
    c3, s3 = np.cos(t3), np.sin(t3)

    # theta2 (4절) -- theta3 다음에만 구할 수 있다
    A = a2 * c3 + a3
    B = a2 * s3 - d4
    P = c1 * px + s1 * py
    denom = A**2 + B**2
    c23_ = (A * P + B * pz) / denom
    s23_ = (B * P - A * pz) / denom
    t23 = np.arctan2(s23_, c23_)
    t2 = t23 - t3

    # theta4, theta5, theta6 (5절)
    t4 = np.arctan2(-r13 * s1 + r23 * c1,
                     -r13 * c1 * c23_ - r23 * s1 * c23_ + r33 * s23_)
    c4, s4 = np.cos(t4), np.sin(t4)

    s5 = -(r13 * (c1 * c23_ * c4 + s1 * s4) + r23 * (s1 * c23_ * c4 - c1 * s4) - r33 * (s23_ * c4))
    c5 = -r13 * c1 * s23_ - r23 * s1 * s23_ - r33 * c23_
    t5 = np.arctan2(s5, c5)

    s6 = -r11 * (c1 * c23_ * s4 - s1 * c4) - r21 * (s1 * c23_ * s4 + c1 * c4) + r31 * (s23_ * s4)
    c6 = (r11 * ((c1 * c23_ * c4 + s1 * s4) * c5 - c1 * s23_ * s5)
          + r21 * ((s1 * c23_ * c4 - c1 * s4) * c5 - s1 * s23_ * s5)
          - r31 * (s23_ * c4 * c5 + c23_ * s5))
    t6 = np.arctan2(s6, c6)

    if flip:  # 6절: 손목 뒤집음 -- 같은 최종 방향을 만드는 대체해
        t4, t5, t6 = t4 + np.pi, -t5, t6 + np.pi

    return t1, t2, t3, t4, t5, t6


def dh_matrix(alpha, a, d, theta):
    """3-3과 동일한 Modified DH 링크 변환행렬."""
    ca, sa = np.cos(alpha), np.sin(alpha)
    ct, st = np.cos(theta), np.sin(theta)
    return np.array([
        [ct,      -st,     0,   a],
        [st * ca,  ct * ca, -sa, -sa * d],
        [st * sa,  ct * sa,  ca,  ca * d],
        [0,        0,       0,   1],
    ])


def puma560_fk(thetas):
    """검증용 FK (3-3 재사용, 라디안 입력)."""
    t1, t2, t3, t4, t5, t6 = thetas
    rows = [
        (0, 0, 0, t1), (-np.pi / 2, 0, 0, t2), (0, a2, d3, t3),
        (-np.pi / 2, a3, d4, t4), (np.pi / 2, 0, 0, t5), (-np.pi / 2, 0, 0, t6),
    ]
    T = np.eye(4)
    for row in rows:
        T = T @ dh_matrix(*row)
    return T


# ── 검증: 임의 자세에서 FK -> IK -> FK 왕복 ──
th_true = np.radians([30, -20, 15, 40, 25, -35])
T_goal = puma560_fk(th_true)
px, py, pz = T_goal[:3, 3]
R_goal = T_goal[:3, :3]

for e in (1, -1):
    for w in (1, -1):
        for f in (False, True):
            sol = puma560_ik(px, py, pz, R_goal, elbow_sign=e, wrist_sign=w, flip=f)
            if sol is None:
                continue
            T_back = puma560_fk(sol)
            ok = np.allclose(T_back, T_goal, atol=1e-6)
            print(f"elbow={e:+d} wrist={w:+d} flip={f}: FK 일치={ok}")
\`\`\`

### 연습 문제 (TODO)

\`\`\`python
# TODO 1: 위 검증 루프에서 8개 조합(2x2x2) 중 몇 개가 실제로 원래 목표와
#   일치하는지(ok=True) 세어라. 8개 전부 True가 나오는지, 혹시 안 나온다면
#   왜(수치적으로 두 조합이 우연히 같은 해로 겹치는 경우가 있는지) 생각해 볼 것.

# TODO 2: theta5 = 0(짐벌락)이 되도록 th_true를 설계하라
#   (theta4, theta6이 축 정렬되는 조합을 손으로 찾아본다).
#   puma560_ik가 이 경우 theta4를 어떻게 반환하는지 확인하고,
#   6절의 "theta4를 임의로 고정해도 된다"는 설명을 코드로 검증하라
#   (theta4를 강제로 다른 값으로 바꿔도 FK 결과가 같은지 비교).

# TODO 3: puma560_ik에 작업 공간 밖의 목표(예: px=py=pz=10)를 넣어
#   disc1 또는 disc3가 음수가 되어 None이 반환되는 것을 확인하라.
#   4-1의 "해의 존재 = 작업 공간" 체크가 여기서도 그대로 작동함을 보인 것.

# TODO 4 (심화): elbow_sign, wrist_sign, flip 8개 조합 중 현재 자세
#   th_true에서 가장 적게 움직이는 해를 고르는 select_nearest_solution()을
#   작성하라 (4-1 5절의 "최소 이동량" 기준, sum(|Δtheta_i|) 최소화).
\`\`\`

**실무 연결**: ROS2 MoveIt의 [IKFast](../inverse-kinematics-algebraic-geometric-pieper/main.md)는 바로 이런 폐형식 유도를 로봇 URDF로부터 자동 생성해 준다 — 사람이 이 노트의 8절을 손으로 반복할 필요가 없다. 교시-재현(9절)에 해당하는 기능은 UR 시리즈의 "Freedrive" 모드, 산업용 로봇의 "핸드 가이딩(hand guiding)"으로 이어진다.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| 로봇 구조 비교 | 겐트리(계산 불필요) < 스카라(회전 2개) < PUMA/스탠포드(직렬+스퇴리컬 손목, 폐형식) ≠ 스튜어트 플랫폼(병렬, 가반하중 큼, 별도 이론) |
| θ₁ | [⁰₁T]⁻¹⁰₆T_goal의 (2,4) 성분 비교 → −s₁pₓ+c₁pᵧ=d₃ → 극좌표 치환 → θ₁=Atan2(pᵧ,pₓ)−Atan2(d₃,±√(pₓ²+pᵧ²−d₃²)) |
| θ₃ | (1,4)(2,4)(3,4) 세 식을 제곱해 더함 → θ₁,θ₂ 소거, K=(pₓ²+pᵧ²+p_z²−a₂²−a₃²−d₃²−d₄²)/(2a₂) → a₃c₃−d₄s₃=K → 4-2의 A cosθ+B sinθ=C 치환으로 θ₃ |
| θ₂ | c₂,s₂를 θ₂₃−θ₃로 치환해 s₂₃,c₂₃에 대한 2×2 선형 연립방정식으로 정리 → θ₂₃=Atan2(s₂₃,c₂₃) → **θ₂=θ₂₃−θ₃** (순서 고정, θ₃ 먼저) |
| θ₄,θ₅,θ₆ | [⁰₃T]⁻¹⁰₆T_goal = ³₆T의 특정 성분을 3번 반복 비교 → 매번 Atan2. 손목 3축이 위치와 완전히 분리되어 계산됨 |
| 짐벌락 | θ₅=0 → 4번·6번 축이 일직선 → θ₄ 계산식이 0=0으로 무의미해짐 → θ₄ 임의 선택, θ₆으로 보정 |
| 다중해 8개 | θ₁의 ±(2) × θ₃의 ±(2) × 손목 뒤집음(2) = 8. 뒤집음: θ₄'=θ₄+180°, θ₅'=−θ₅, θ₆'=θ₆+180° |
| 폐형식의 실무 가치 | DH 상수는 설계 시 고정 → θ₁~θ₆ 공식만 한 번 코딩 → 목표점 대입만으로 실시간(0.몇 ms) 계산 |
| 교시-재현 | IK 계산 없이 사람이 팔을 직접 잡아 위치를 저장(교시)하고 그대로 반복(재현) — 비전공자도 즉시 사용 가능 |
| 리피터빌리티 vs 어퀴러시 | 반복 정확도(교시-재현에서 중요) vs 계산된 좌표 도달 정확도(IK 사용 시 중요) — 요구 성능에 따라 방식 선택 |
`,

  'Robotics/inverse-kinematics': `---
title: 역기구학 입문 — 해의 존재와 다중해 (Inverse Kinematics)
date: 2026-08-08
tags: inverse-kinematics, workspace
order: 
featured: false
draft: false
---

# 역기구학 입문 — 해의 존재와 다중해 (Inverse Kinematics)

> 출처: 로봇제어공학 — Introduction to Robotics (Craig) 4장 역기구학 (전반부)
> 영상: https://www.youtube.com/watch?v=uNsJVJlSRUk
> 대상: [정기구학(FK)](../forward-kinematics/main.md)까지 마친 학습자. IK가 왜 어려운지, 풀기 전 점검 사항(해의 존재·다중해), 3링크 평면 팔 대수적 풀이의 첫 단계(θ₂)까지.

---

## 목차

1. [역기구학이란 — FK를 거꾸로](#1-역기구학이란--fk를-거꾸로)
2. [왜 손목까지만 푸는가 — 공구계와 손목계](#2-왜-손목까지만-푸는가--공구계-t와-손목계-w)
3. [왜 어려운가 — 비선형 초월함수 방정식](#3-왜-어려운가--12개-방정식-6개-미지수-비선형)
4. [해의 존재 = 작업 공간](#4-해의-존재--작업-공간-workspace)
5. [다중해와 선택 기준](#5-다중해-multiple-solutions와-선택-기준)
6. [풀이 전략 — 폐형식 해 vs 수치해](#6-풀이-전략--폐형식-해-vs-수치해)
7. [예제 4.2 — 부분 공간](#7-예제-42--2자유도-극형-팔의-부분-공간)
8. [3링크 평면 팔의 대수적 해 ①](#8-3링크-평면-팔의-대수적-해-①--θ₂-구하기)
9. [Python 실습 코드](#9-python-실습-코드)
10. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 역기구학이란 — FK를 거꾸로

**역기구학(Inverse Kinematics, IK)**: 공구의 목표 위치·방향이 주어졌을 때 그것을 이루는 **관절각 조합을 계산**하는 것.

| | 입력 | 출력 | 난이도 |
|---|---|---|---|
| 정기구학 (FK) | 관절각 θ₁...θₙ | 손끝 위치·방향 (⁰T_N) | 대입만 하면 나옴 |
| 역기구학 (IK) | 손끝 위치·방향 | 관절각 θ₁...θₙ | **방정식을 풀어야 함** |

> "Inverse Kinematics는 '푼다'라고 해요. 방정식이 엄청나게 많아서 그걸 푸는 게 **IK Solver**."

FK는 "계산한다(compute)", IK는 "푼다(solve)" — 대입이 아니라 연립방정식 풀이이기 때문이다. MATLAB Robotics Toolbox(Peter Corke)에 IK Solver가 미리 들어 있는 것도 이 때문. 2장(좌표계·변환)과 3장(DH·FK)은 모두 이 역기구학의 전초 단계였다.

---

## 2. 왜 손목까지만 푸는가 — 공구계 {T}와 손목계 {W}

공구 끝의 좌표계가 **공구계(tool frame) {T}** 인데, 공구 기준으로 IK를 풀면 공구를 바꿀 때마다 전부 다시 계산해야 한다 — 정작 팔 자체는 안 바뀌는데. 그래서 문제를 2단계로 나눈다:

1. **좌표계 변환**: 기저계(base frame) {B} 기준 **손목계(wrist frame) {W}** 의 목표로 바꾼다 — 손끝↔손목 관계는 고정이므로 변환 한 번이면 된다
2. **역기구학 계산**: {B}→{W}까지만 관절각을 푼다

공구는 대부분 손목과 나란한 방향으로 거리만 떨어져 장착된다("드라이버를 굳이 꺾어서 장착하는 사람은 없다"). 이후 논의는 계속 ⁰T₆ — 베이스에서 손목까지 — 만 다룬다. 좌표계 표기는 [2-1 좌표계 표시와 매핑 (Frames & Mapping)](../frames-and-mapping/main.md) 참고.

---

## 3. 왜 어려운가 — 12개 방정식, 6개 미지수, 비선형

[PUMA 560의 FK](../forward-kinematics/main.md)에서 ⁰T₆는 4×4 행렬이었다. 맨 아랫줄 \`0 0 0 1\`을 빼면 회전 9개 + 위치 3개 = **방정식 12개**, 미지수는 θ₁~θ₆ **6개**. 문제는 방정식의 성질:

- **비선형(nonlinear)**: sin, cos이 곱해지고 제곱되어 섞여 있다
- **초월함수(transcendental function) 방정식**: "쉽게 안 뒤집어진다"

### 감 잡기 — 한 항짜리도 이렇다

FK 방향: \`y = sin²θ\`에 θ = 90°를 넣으면 y = 1, 암산으로 나온다. IK 방향: "y가 2.3이 되려면 θ는?" → 루트 씌우고 arcsin. **한 항짜리**가 이 정도인데 PUMA 560 FK의 한 항은 몇 줄짜리 수식이었다.

**실무 포인트**: 그래서 산업용 로봇은 **역기구학이 쉽게 풀리는 구조로 설계**한다. 제어가 쉽다 = IK가 잘 풀린다.

---

## 4. 해의 존재 = 작업 공간 (Workspace)

\`y = sin²θ\` (θ ∈ [0°, 180°])에서 y = 5나 y = 3은 나올 수 없다(최대 1). **IK는 풀기 전에 해가 있는지부터 고민해야 한다.**

> "해가 있으면 로봇이 거기 갈 수 있다. 해가 없으면 로봇이 거기 못 간다는 뜻이에요."

수식의 "해의 존재"는 로봇에서 "**목표점이 작업 공간(workspace) 안에 있는가**"로 번역된다. 사람도 팔이 안 닿는 등 한가운데는 못 긁는다.

**직관적으로 찾는 법**: 관절을 전부 돌려 보며 손끝이 지나는 자리를 색칠한다 — 허리 회전 + 프리즘 관절(prismatic joint)이면 원반, 무릎 방향 프리즘까지 있으면 원기둥.

### 두 종류의 작업 공간

| 용어 | 뜻 |
|---|---|
| **도달 가능 작업 공간** (reachable workspace) | 손끝이 **최소 한 방향으로라도** 닿는 영역 |
| **자유자재 작업 공간** (dexterous workspace) | 손끝이 **모든 방향에서** 접근 가능한 영역 |

팔을 쭉 뻗어야 겨우 닿는 경계점은 reachable일 뿐 dexterous가 아니다. dexterous 영역을 넓히려면 팔이 길고 모터가 세져야 해서 비싸진다 — **작업에 필요한 만큼만** 확보하면 된다(칠판만 쓸 거면 칠판 앞 reachable이면 충분).

### 2링크 평면 팔 예제

링크 길이 L₁, L₂인 2링크 매니퓰레이터(revolute 2개, 모든 관절 360° 회전 가정):

- **L₁ = L₂**: 도달 가능 영역은 반경 2L₁의 원 내부 전체. 자유자재 영역은 **원점 단 1개** — L₂를 완전히 접으면 손끝이 원점에 오고, L₁을 어느 방향으로 틀어도 손끝은 원점에 머물므로 모든 방향 접근이 가능하다. 다른 점은 접근 방향이 기껏해야 두 개(팔꿈치 상/하향)뿐
- **L₁ ≠ L₂**: 자유자재 영역 **없음**(교재가 증명 문제로 남김). 도달 가능 영역은 **외경 L₁+L₂, 내경 |L₁−L₂|인 도넛(annulus)** — 짧은 쪽을 아무리 접어도 원점까지 |L₁−L₂|만큼 못 들어간다

**현실 보정**: "각 관절의 회전이 360도일 가능성은 극히 드물다" — 관절 한계까지 감안하면 실제로는 반쪽·2/3 도넛 모양이 된다.

**실무 포인트**: 로봇 설치 위치 선정이 바로 이 문제다. 잡을 물건과 놓을 곳이 모두 작업 공간 안에 들어오도록 배치하고, 아무리 바꿔도 안 되면 "로봇을 잘못 산 것" — 사기 전에 알아야 한다.

---

## 5. 다중해 (Multiple Solutions)와 선택 기준

해가 존재해도 **하나가 아니다.** 3링크 평면 팔이 같은 손끝 위치·방향에 도달하는 자세는 평면에서도 이미 2개, 3차원 6관절이면 훨씬 많다.

- **일반적인 회전 관절 6자유도 매니퓰레이터: 해가 최대 16개**
- 해의 개수는 DH 파라미터 **aᵢ(이웃한 Z축 사이 거리)가 0이 아닌 개수**에 비례:

| aᵢ 조건 | 해의 개수 |
|---|---|
| a₁ = a₃ = a₅ = 0 | ≤ 4 |
| a₃ = a₅ = 0 | ≤ 8 |
| a₃ = 0 이거나 모든 aᵢ ≠ 0 | ≤ 16 |

[DH 파라미터](../denavit-hartenberg-parameters/main.md)에서 PUMA 560의 4·5·6번 관절축이 한 점에서 교차(a = 0)했던 게 바로 해 개수를 줄이는 설계다 — 그래도 PUMA는 해가 4개다.

### 여러 해 중 무엇을 고르나 — 우선순위

1. **충돌 회피 (collision avoidance)** — 가장 중요. 장애물이 있으면 가까운 해를 포기하고 돌아가는 해를 고른다
2. **최소 이동량** — 현재 자세에서 **가장 조금 움직이는 해**가 기본값. 펜 하나 잡는데 팔을 한 바퀴 꺾을 필요가 없다
3. **최소 에너지 소비** — 핵심은 **가속**: E = F·d에서 거리를 줄이는 게 최소 이동량이고, F = ma에서 질량은 고정이니 **가속도를 줄여야 힘이 준다**. 빠르게 가는 것 자체는 괜찮지만 방향·속도를 확 트는 순간 가속도가 생긴다. 이왕이면 짧은(끝 쪽) 관절을 움직이는 게 유리

**실무 포인트 — 협동 로봇(collaborative robot)**: 공장 로봇은 몇 톤을 휙휙 드는 기계라 충돌은 곧 인명사고다(폭스바겐 공장 사망 사고). 전통적 해법은 철망 + 문 열면 정지였지만, 요즘은 철망 없이 사람과 나란히 일하는 협동 로봇 추세 — 그만큼 충돌 회피가 해 선택의 최우선 기준이 된다.

---

## 6. 풀이 전략 — 폐형식 해 vs 수치해

**비선형 방정식을 푸는 일반적인 방법(알고리즘)은 없다.** 근의 공식 같은 만능 해법이 없으므로, 운 좋게 풀기 쉬운 형태여야 풀린다 — 문제를 그렇게 만들었기 때문에 풀리는 것.

| | 폐형식 해 (closed-form solution) | 수치해 (numerical solution) |
|---|---|---|
| 방법 | 방정식을 **직접 풀어** 답이 딱 나옴 | **반복 연산**으로 근사치에 수렴 |
| 적용 범위 | "풀리는 애만 풀려" | 회전/프리즘 관절 6자유도 연쇄면 **전부 풀 수 있음이 증명됨** |
| 속도 | 즉시 | 과거엔 너무 느렸음 (한 점에 10초 × 경로 50점) |
| 현재 | 산업용 로봇의 기본 | 컴퓨터 발전으로 **요즘 각광** |

수치해의 원리는 함수 최소점 찾기와 같다: 임의의 점에서 **미분해서 기울기**를 구하고, 낮은 쪽으로 조금 이동... 을 반복해 수렴시킨다(Newton법 계열, [3Blue1Brown 도함수의 역설](https://www.youtube.com/watch?v=9vKqVkMQHKk) 참고). 이것만 다루는 과목(수치해석)이 따로 있을 만큼 큰 분야다.

### 폐형식 해가 존재할 조건 — 설계로 보장한다

> 회전 관절 6개인 경우, 폐형식 해가 존재할 **충분조건**은 **이웃하는 3개의 관절축이 한 점에서 교차**하는 것 (PUMA 560의 4, 5, 6축)

이것이 Pieper의 조건이다. 설계 단계부터 이 조건을 만족시키는 것이 업계 관행 — PUMA 560이 정확히 그런 로봇이다. 참고로 관절이 6개 미만이면 3차원의 일반 목표(위치 3 + 방위 3)를 다 만들 수 없다 — n자유도의 작업 공간은 6자유도의 부분 집합이다.

### 폐형식 해의 두 가지 접근

이 강의(교재)는 폐형식만 다루며, 두 방법을 **섞어서** 쓴다:

- **대수적(algebraic)**: FK 변환행렬을 수식 대 수식으로 놓고 방정식처럼 조작
- **기하학적(geometric)**: 팔 그림을 그려 놓고 삼각법(sin, cos)을 반복 적용

> "뭐가 더 쉬운 거는 없어요. 운이 좋아서 대수적인 게 쉬우면 너무 땡큐고, 기하학적인 거로 풀리면 그것도 땡큐고."

---

## 7. 예제 4.2 — 2자유도 극형 팔의 부분 공간

**문제**: 2자유도 극형(polar) 매니퓰레이터 — 허리 회전(revolute) + 팔 뽑기(prismatic) — 의 ⁰₂T가 그리는 **부분 공간(subspace)을 기술하라.** 직관적으로는 **원반**임을 이미 안다; 그걸 수식으로 쓰는 연습이다.

**좌표계 설정** (Z₀ = Z₁ = 허리 회전축, Z₂ = 팔이 뻗는 방향):

- ⁰P₂ORG = (x, y, 0) — Z₀와 Z₂가 같은 높이라 z성분 0, top view 평면 문제
- ⁰Ẑ₂ = (x/√(x²+y²), y/√(x²+y²), 0) — 팔이 뻗는 방향의 단위 벡터
- ⁰Ŷ₂ = (0, 0, −1) — X₂를 X₁과 나란히 잡으면 자동으로 아래를 향한다
- ⁰X̂₂ = ⁰Ŷ₂ × ⁰Ẑ₂ = (y/√(x²+y²), −x/√(x²+y²), 0)

세 축 벡터를 열로 세우고([회전행렬 = 축 벡터 나열](../frames-and-mapping/main.md)) 위치를 붙이면:

$$
{}^0_2T =
\\begin{bmatrix}
\\frac{y}{\\sqrt{x^2+y^2}} & 0 & \\frac{x}{\\sqrt{x^2+y^2}} & x \\\\
\\frac{-x}{\\sqrt{x^2+y^2}} & 0 & \\frac{y}{\\sqrt{x^2+y^2}} & y \\\\
0 & -1 & 0 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

x, y를 자유롭게 바꾸면 이 ⁰₂T가 표현하는 자세 전체 = **z = 0 평면 위의 원반**. 핵심은 회전 부분이 x, y에 종속이라는 점 — 위치를 정하면 방위가 자동으로 정해진다(2자유도로는 6개 변수를 독립으로 못 정한다).

---

## 8. 3링크 평면 팔의 대수적 해 ① — θ₂ 구하기

**문제 설정**: 평면 3링크 매니퓰레이터(revolute 3개, 링크 길이 l₁, l₂). 평면이므로 목표는 **(x, y, φ)** — 손끝 위치와 방향각 — 로 충분하다.

### 1단계 — FK 행렬 두 개를 나란히 놓는다

DH 파라미터로 [링크 변환 3개를 곱하면](../forward-kinematics/main.md) (스스로 해볼 것):

$$
{}^B_W T = {}^0_3T =
\\begin{bmatrix}
c_{123} & -s_{123} & 0 & l_1 c_1 + l_2 c_{12} \\\\
s_{123} & c_{123} & 0 & l_1 s_1 + l_2 s_{12} \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

표기: c₁ = cosθ₁, c₁₂ = cos(θ₁+θ₂), **c₁₂₃ = cos(θ₁+θ₂+θ₃)** — 이 축약은 계속 쓴다.

목표 자세도 같은 형태로 쓴다:

$$
{}^B_W T_{goal} =
\\begin{bmatrix}
c_\\phi & -s_\\phi & 0 & x \\\\
s_\\phi & c_\\phi & 0 & y \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

### 2단계 — 항별 비교로 방정식 추출

두 행렬의 대응 항끼리 비교하면 유효한 방정식 4개:

$$c_\\phi = c_{123}, \\quad s_\\phi = s_{123}, \\quad x = l_1 c_1 + l_2 c_{12}, \\quad y = l_1 s_1 + l_2 s_{12}$$

### 3단계 — x² + y²로 θ₁을 소거한다 (핵심 아이디어)

x, y를 제곱해서 더하면 sin²+cos² = 1과 코사인 차 공식(c₁c₁₂ + s₁s₁₂ = c₂)이 작동해 **θ₁이 통째로 사라진다**:

$$x^2 + y^2 = l_1^2 + l_2^2 + 2 l_1 l_2 c_2
\\quad\\Rightarrow\\quad
c_2 = \\frac{x^2 + y^2 - l_1^2 - l_2^2}{2 l_1 l_2}$$

우변은 목표(x, y)와 링크 길이뿐 — **미지수 하나짜리 식**이 됐다.

### 4단계 — 해의 존재 조건이 공짜로 나온다

좌변이 코사인이므로 **우변이 [−1, +1] 안에 있어야만 해가 존재**한다. 알고리즘에서 반드시 먼저 체크해야 하며, 벗어나면 목표점이 도달 범위 밖이라는 뜻 — [4절의 작업 공간](#4-해의-존재--작업-공간-workspace) 논의가 수식 한 줄로 구현된 것.

### 5단계 — sin을 구하고 atan2로 θ₂를 결정

$$s_2 = \\pm\\sqrt{1 - c_2^2}, \\qquad \\theta_2 = \\mathrm{Atan2}(s_2, c_2)$$

- **±가 곧 다중해다**: **팔꿈치 상향(elbow-up) / 하향(elbow-down)** 두 해
- **arccos 대신 atan2를 쓰는 이유**: c₂만으로는 부호 정보가 부족하다. atan2는 s와 c의 부호를 각각 받아 사분면을 정확히 구분한다 ([atan2 논의](../orientation-representations/main.md)와 같은 이유)

θ₂를 x, y 방정식에 대입해 θ₁을 구하는 것은 **다음 강의에서 계속** (θ₃는 φ = θ₁+θ₂+θ₃에서 바로 나올 예정).

**외울 것 vs 이해할 것**: c₂ 공식 암기가 아니라 **"제곱해서 더하면 θ₁이 소거된다"는 전개 아이디어**와 **"cos 범위가 곧 도달 가능성 체크"**라는 구조가 핵심이다.

---

## 9. Python 실습 코드

강의의 2링크 부분(x, y 위치만)을 코드로 재현한다. 팔꿈치 상/하향 두 해와 작업 공간 체크가 핵심이다.

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

L1, L2 = 1.0, 0.7   # 링크 길이 (L1 != L2 → 도넛 작업 공간)

def ik_2link(x, y, l1=L1, l2=L2, elbow_up=True):
    """2링크 평면 팔 IK (폐형식). 해가 없으면 None."""
    c2 = (x**2 + y**2 - l1**2 - l2**2) / (2 * l1 * l2)
    if abs(c2) > 1:          # 해의 존재 조건 — 작업 공간 밖
        return None
    s2 = np.sqrt(1 - c2**2) * (1 if elbow_up else -1)  # ± = 팔꿈치 상/하향
    theta2 = np.arctan2(s2, c2)                        # arccos 대신 atan2
    # theta1: 유도는 다음 강의에서 — FK 검증을 위해 결과만 사용
    theta1 = np.arctan2(y, x) - np.arctan2(l2 * s2, l1 + l2 * c2)
    return theta1, theta2

def fk_2link(theta1, theta2, l1=L1, l2=L2):
    """검증용 FK: 관절각 → 손끝 위치"""
    x = l1 * np.cos(theta1) + l2 * np.cos(theta1 + theta2)
    y = l1 * np.sin(theta1) + l2 * np.sin(theta1 + theta2)
    return x, y

# --- 검증: IK → FK 왕복이 원래 목표로 돌아오는가 ---
target = (1.2, 0.6)
for elbow in (True, False):
    sol = ik_2link(*target, elbow_up=elbow)
    if sol:
        back = fk_2link(*sol)
        print(f"elbow_up={elbow}: theta={np.degrees(sol).round(2)}, "
              f"FK 복원={np.round(back, 6)}")

print(ik_2link(3.0, 0.0))   # None — 팔 길이(1.7) 밖
print(ik_2link(0.1, 0.0))   # None — 내경 |L1-L2|=0.3 안쪽 (도넛 구멍)
\`\`\`

### 연습 문제 (TODO)

\`\`\`python
# TODO 1: 강의의 "다 돌려보며 색칠하기"를 그대로 구현하라.
#   theta1, theta2를 0~360도에서 무작위로 5000쌍 샘플링해 fk_2link로
#   손끝 위치를 찍어라(plt.scatter). L1 == L2일 때와 L1 != L2일 때
#   각각 그려서 원판 vs 도넛이 나오는지 확인하라.
#   검증: 도넛의 내경이 |L1-L2|, 외경이 L1+L2와 일치하면 성공.

# TODO 2: 관절 한계를 넣어라. theta2를 [-150도, 150도]로 제한하고
#   TODO 1을 다시 그려 "완전한 도넛이 아닌" 작업 공간을 확인하라.
#   (강의: "모든 관절이 360도 돌 가능성은 극히 드물다")

# TODO 3: 같은 목표점에 대한 elbow-up / elbow-down 두 자세를
#   링크 선분으로 그려라(어깨-팔꿈치-손끝을 plt.plot으로 연결).
#   검증: 두 자세의 손끝이 같은 점에 겹치면 성공.

# TODO 4 (심화): "최소 이동량" 해 선택을 구현하라.
#   현재 관절각 (theta1, theta2)가 주어졌을 때, 두 해 중
#   |Δtheta1| + |Δtheta2| 가 작은 쪽을 반환하는 solve_nearest()를 작성하라.
\`\`\`

**실무 연결**: ROS2에서 IK는 MoveIt이 담당하며, 기본 solver(KDL)가 수치해 방식이고 TRAC-IK, IKFast(폐형식 자동 유도) 같은 대체 solver를 플러그인으로 갈아 끼운다. "폐형식은 빠르지만 풀리는 구조에서만, 수치해는 느리지만 범용" 트레이드오프가 solver 선택 기준 그대로다.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| 역기구학(IK) | 손끝 목표(위치+방향) → 관절각. FK의 역방향, "푼다(solve)"고 표현 |
| 공구계 {T} / 손목계 {W} | 공구는 바뀌므로 IK는 베이스→**손목까지만**(⁰T₆) 푼다 |
| 문제의 크기 | 방정식 12개(회전 9 + 위치 3), 미지수 6개, **비선형 초월함수** |
| 해의 존재 | = 목표점이 **작업 공간** 안에 있는가. **풀기 전에 반드시 확인** |
| reachable / dexterous | 한 방향으로라도 / 모든 방향에서 도달 가능. 2링크 L₁=L₂면 dexterous는 원점 1점, L₁≠L₂면 없음 |
| 2링크 작업 공간 | 외경 L₁+L₂, 내경 \\|L₁−L₂\\|의 도넛 (관절 한계로 실제는 부분 도넛) |
| 다중해 | 일반 6R은 최대 16개. aᵢ≠0이 많을수록 증가, 손목 3축 교차(PUMA)로 4개까지 감소. **해가 하나라고 가정하지 말 것** |
| 해 선택 기준 | ① 충돌 회피 ② 최소 이동량 ③ 최소 에너지(핵심은 **가속** 최소화, F=ma) |
| 폐형식 vs 수치해 | 폐형식: 즉시·풀리는 구조만 / 수치해: 반복 수렴·범용, 요즘 각광 |
| 폐형식 존재 충분조건 | 이웃한 **3개 관절축이 한 점에서 교차** (Pieper 조건, PUMA 4·5·6축) |
| 대수적 vs 기하학적 | 수식 조작 vs 그림+삼각법. 우열 없음, 섞어 쓴다 |
| 3링크 대수적 해 | FK 행렬 = 목표 행렬 → 항별 비교 → x²+y²로 θ₁ 소거 → c₂ = (x²+y²−l₁²−l₂²)/(2l₁l₂), **\\|c₂\\|≤1이 곧 도달 가능성 체크** |
| θ₂ | Atan2(±√(1−c₂²), c₂) — ±가 팔꿈치 상향/하향 두 해. **arccos 금지** — 사분면 정보가 사라진다, 항상 atan2(s, c) |
`,

  'Robotics/jacobian-singularity-and-static-forces': `---
title: 자코비안 — 좌표계 변환, 특이점, static forces 개관 (Jacobian Singularity & Static Forces)
date: 2026-08-08
tags: jacobian, singularity
order: 
featured: false
draft: false
---

# 자코비안 — 좌표계 변환, 특이점, static forces 개관 (Jacobian Singularity & Static Forces)

> 출처: 로봇제어공학 — Introduction to Robotics 5장 "자코비안: 속도와 static forces" (후반부)
> 영상: https://www.youtube.com/watch?v=P5eftUgO8zA&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=13
> 대상: [5-2](../jacobian-velocity-kinematics-link-propagation/main.md)에서 정의한 "로봇 자코비안"(관절 속도 → 손끝 속도 계수 행렬)을 아는 상태에서 이어본다. **이 노트는 자코비안의 좌표계 변환, 특이점(singularity), static forces(정적인 힘) 개념 도입까지 다룬다.** static forces의 실제 힘·토크 변환 공식은 이 영상에서 유도되지 않는다 — 영상은 static forces 계산 절차를 개관하는 데서 끝난다.

---

## 목차

1. [지난 시간 복습](#1-지난-시간-복습)
2. [자코비안의 좌표계 변환](#2-자코비안의-좌표계-변환)
3. [특이점이란 무엇인가](#3-특이점singularity이란-무엇인가)
4. [예제 5.5 — 역자코비안과 손 뻗은 자세](#4-예제-55--2-링크-로봇의-역자코비안과-손-뻗은-자세)
5. [특이점의 기하학적 직관](#5-특이점의-기하학적-직관)
6. [static forces 개관](#6-머니퓰레이터-내부에서의-static-forces)
7. [표기법 비교표](#7-표기법-비교표)
8. [Python 실습 코드](#8-python-실습-코드)
9. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 지난 시간 복습

[5-2](../jacobian-velocity-kinematics-link-propagation/main.md)에서 자코비안은 편미분 행렬 $J$로 정의됐고, 로봇에서는 관절 속도를 손끝의 직교좌표계 속도로 바꾸는 계수 행렬이었다.

$\${}^{0}v = {}^{0}J(\\Theta)\\,\\dot\\Theta$$

이 식을 실제로 손으로 구하려면 [링크 선속도 전파](../jacobian-velocity-kinematics-link-propagation/main.md)를 순차적으로 계산한 뒤, 결과식을 $\\dot\\theta_i$별로 묶어 계수 행렬 형태로 뽑아냈다. 이번 영상은 여기서 세 가지를 더 다룬다 — **자코비안도 좌표계를 바꿀 수 있다는 것**, **자코비안의 역행렬이 존재하지 않는 위치(특이점)가 있다는 것**, 그리고 **자코비안으로 속도뿐 아니라 힘도 다룰 수 있다는 것**(static forces의 도입부)이다.

---

## 2. 자코비안의 좌표계 변환

[5-2 6절](../jacobian-velocity-kinematics-link-propagation/main.md)에서 손끝 자신의 좌표계(3) 기준 속도를 베이스(0) 기준으로 바꿀 때 회전행렬을 곱했던 것과 같은 방식으로, 자코비안 자체도 기준 좌표계를 바꿀 수 있다.

계 $\\{B\\}$를 기준으로 정의된 자코비안이 있다고 하자.

$$\\begin{bmatrix}{}^{B}v\\\\{}^{B}\\omega\\end{bmatrix} = {}^{B}v = {}^{B}J(\\Theta)\\dot\\Theta$$

여기에 좌표계 $\\{A\\}$ 기준으로 옮기는 회전행렬을 곱하면, 선속도 부분과 각속도 부분이 각각 같은 회전행렬 \${}^A_BR$로 변환된다.

$$\\begin{bmatrix}{}^{A}v\\\\{}^{A}\\omega\\end{bmatrix} = \\begin{bmatrix}{}^{A}_{B}R & 0\\\\0 & {}^{A}_{B}R\\end{bmatrix}\\begin{bmatrix}{}^{B}v\\\\{}^{B}\\omega\\end{bmatrix}$$

이 블록 대각(block-diagonal) 행렬을 \${}^BJ(\\Theta)\\dot\\Theta$에 곱해서 $\\dot\\Theta$ 앞의 계수 행렬만 다시 묶으면 좌표계 $\\{A\\}$ 기준 자코비안이 나온다.

$$\\boxed{{}^{A}J(\\Theta) = \\begin{bmatrix}{}^{A}_{B}R & 0\\\\0 & {}^{A}_{B}R\\end{bmatrix}{}^{B}J(\\Theta)}$$

선속도와 각속도 블록이 각각 독립적으로 $3\\times3$ 회전행렬로 변환되고 교차항(off-diagonal)이 0인 이유는, 이 변환이 순수 회전(같은 원점을 공유하는 두 좌표계 사이의 방향 차이)만 반영하기 때문이다 — 선속도 벡터와 각속도 벡터는 서로 다른 물리량이라 회전만으로는 서로 섞이지 않는다.

> **이해 필요**: 두 속도 블록이 같은 회전행렬로 각각 변환된다는 구조. **기억할 필요 없음**: 강의도 "나도 저거 실제로 계산해서 써본 적은 없어"라고 짚었다 — 실무에서 자주 쓰이는 계산은 아니고, 개념적으로 자코비안도 다른 물리량처럼 좌표 변환 규칙을 그대로 따른다는 것만 알면 충분하다.

**실무 캐비앗**: 만약 두 좌표계의 원점이 다르다면(순수 회전이 아니라 이동까지 있다면), 일반적인 spatial velocity(twist) 변환에는 위치 차이에서 나오는 반대칭 행렬(skew-symmetric matrix) 항이 교차 블록에 추가된다. 이 슬라이드는 원점이 같은 경우의 단순화된 형태다.

---

## 3. 특이점(singularity)이란 무엇인가

관절 속도를 손끝 속도로 연결하는 자코비안이 있으면, **반대 방향 질문**도 자연스럽게 떠오른다 — "손끝을 이 속도로 움직이려면 관절은 얼마나 빨리 움직여야 하는가?" 이건 [역기구학](../inverse-kinematics/main.md)과 완전히 같은 구도다. 위치 문제에서 정기구학 ↔ 역기구학이었다면, 속도 문제에서는 자코비안 ↔ 자코비안의 역행렬이다.

$$\\dot\\Theta = J^{-1}(\\Theta)\\,v$$

그런데 [행렬의 역](../orientation-representations/main.md)은 행렬식(determinant)이 분모로 들어가기 때문에, 행렬식이 0인 위치에서는 역행렬이 존재하지 않는다. 자코비안이 정사각행렬이 아니거나 역행렬이 존재하지 않는 그 관절각 조합을 **특이점(singularity)** 이라 부른다.

- **관절 속도 → 손끝 속도로 연결시키는 선형 변환이 주어졌을 경우, "이 행렬의 역을 구할 수 있는가"라는 질문이 의미가 있다.** 행렬이 비특이적(non-singular)이면 그 역을 구해서 손끝 속도로부터 관절 속도의 변화율을 계산할 수 있다.
- 로봇 손을 직교좌표계 공간 안에서 주어진 속도 벡터를 갖고 운동하게 하고 싶다면, 위 식을 경로를 따라 매 순간 적용해서 관절의 변화율을 계산하며 제어할 수 있다.
- 그런데 **"모든 $\\Theta$의 값에 대해 자코비안의 역이 존재하는가?"** — 존재하지 않는다면, 역을 구할 수 없는 영역이 어디인지 알아야 한다.

대부분의 매니퓰레이터는 자코비안이 특이(역이 존재하지 않는) 값을 갖는 관절각 조합을 갖고 있다. 그런 위치를 기구의 특이점(singularities of the mechanism), 줄여서 특이점이라 한다.

- **모든 매니퓰레이터는 작업 공간의 경계(boundary)에서 특이점을 갖는다.** 팔을 최대한 뻗은 위치 같은 경우다.
- **대부분은 작업 영역 내부에서도 특이점의 궤적(loci)을 갖는다.** 점이 아니라 선·면 형태로 나타날 수 있다.
- 특이점 확인은 간단하다 — **자코비안의 행렬식이 0인 점, 선, 공간을 찾으면 된다**: $\\det[J]=0$.

> **꼭 기억**: 특이점의 물리적 의미. 수학적으로 역행렬이 없다는 건, **그 관절각 조합에서는 로봇이 특정 방향의 속도를 낼 수 없다**는 뜻이다 — 로봇이 고장 난 게 아니라 기구학적으로 원천 불가능한 방향이 존재한다는 뜻이다.
> **이해**: $\\det[J]=0$을 계산해서 특이점을 찾는 절차. **기억할 필요 없음**: 특정 로봇의 특이점 개수·위치를 암기하는 것 — 로봇마다 자코비안이 다르므로 매번 계산해야 한다.

**실무 포인트**: 특이점 근처에서는 $J^{-1}$의 성분이 발산하기 때문에, 실제 속도 제어(ROS2 \`moveit_servo\` 등)에서는 순수 역행렬 대신 **감쇠 최소제곱(damped least squares, DLS)** 역행렬을 쓴다. 특이값(singular value) $\\sigma_i$마다 $\\sigma_i \\to \\sigma_i/(\\sigma_i^2+\\lambda^2)$로 바꿔주는 감쇠항 $\\lambda$를 추가해서, 특이점 근처에서도 관절 속도가 무한대로 튀지 않고 유한한 값으로 제한되도록 만든다. (다만 감쇠를 세게 걸수록 정확도와 도달 가능 범위가 줄어드는 트레이드오프가 있다.)

Sources: [MoveIt Servo Singularity Avoidance Issue](https://github.com/ros-planning/moveit/issues/3155), [Robust Inverse Kinematics Using Damped Least Squares (NASA)](https://ntrs.nasa.gov/api/citations/19950005142/downloads/19950005142.pdf)

---

## 4. 예제 5.5 — 2-링크 로봇의 역자코비안과 손 뻗은 자세

> **예제 5.5**: 회전 관절을 갖는 2-링크 매니퓰레이터의 말단 효과 장치가 X축 방향으로 1.0 m/s로 움직이고 있다고 하자. 특이점에서 떨어져 있을 때는 이 속도가 적당하지만, 특이점에 접근하며 $\\theta_2 \\to 0$에 가까워지면 관절률(joint rate)이 어떻게 되는지 보여라.

[5-2 9절](../jacobian-velocity-kinematics-link-propagation/main.md)에서 구한 \${}^0J(\\Theta)$의 역행렬을 먼저 계산한다.

$\${}^{0}J^{-1}(\\Theta) = \\frac{1}{l_1 l_2 s_2}\\begin{bmatrix}l_2c_{12} & l_2s_{12}\\\\-l_1c_1-l_2c_{12} & -l_1s_1-l_2s_{12}\\end{bmatrix}$$

($2\\times2$ 행렬의 역은 행렬식(분모) 분의 1을 곱하고, 대각 성분끼리 자리를 바꾸고 비대각 성분의 부호를 바꾸는 표준 공식을 그대로 적용한 것이다 — 분모에 $s_2 = \\sin\\theta_2$가 들어간다는 점이 이 예제의 핵심이다.)

X축 방향 속도 1 m/s, Y축 속도 0을 대입한다.

$$\\begin{bmatrix}\\dot\\theta_1\\\\\\dot\\theta_2\\end{bmatrix} = \\frac{1}{l_1l_2s_2}\\begin{bmatrix}l_2c_{12} & l_2s_{12}\\\\-l_1c_1-l_2c_{12} & -l_1s_1-l_2s_{12}\\end{bmatrix}\\begin{bmatrix}1\\\\0\\end{bmatrix} = \\begin{bmatrix}\\dfrac{c_{12}}{l_1s_2}\\\\[4pt] -\\dfrac{c_1}{l_1s_2}-\\dfrac{c_{12}}{l_2s_2}\\end{bmatrix}$$

두 관절 속도 모두 분모에 $s_2=\\sin\\theta_2$를 갖고 있다. $\\theta_2\\to0$이면 $\\sin\\theta_2\\to0$이므로, 분자가 우연히 0이 되지 않는 한 **관절 속도가 무한대로 발산한다.** 즉 로봇이 팔을 완전히 뻗은 자세($\\theta_2=0$)에서는 X방향으로 1 m/s의 손끝 속도를 만들어내는 것이 물리적으로 불가능하다 — 아무리 관절을 빨리 돌려도 안 되는 방향이 생긴다는 뜻이다.

> **꼭 기억**: 역자코비안의 분모(행렬식)에 $\\sin\\theta_2$가 나타나고, $\\theta_2=0,\\ 180°$일 때 이 값이 0이 되어 발산한다는 결론. **이해**: 이게 왜 발산인지는 [다음 절](#5-특이점의-기하학적-직관)에서 기하학적으로 확인한다.

---

## 5. 특이점의 기하학적 직관

$\\theta_2=0$은 링크 1의 연장선 위에 링크 2가 그대로 놓인, **팔을 완전히 뻗은 자세**를 뜻한다.

> "손 뻗은 다음에 더 뻗을 수가 없는 거 아니야. 여기가 한계잖아. 안쪽으로는 나 만들어낼 수 있지, 이렇게 기울이면 되니까... 근데 저 방향으로는 못 내잖아. 더 갈 수가 없잖아."

이 상태에서 팔을 안쪽으로 굽히는 방향(관절을 굽혀 반경을 줄이는 방향)이나 위·아래로 흔드는 방향의 속도는 얼마든지 만들 수 있다. 하지만 **팔이 이미 최대로 뻗은 방향으로 더 뻗어나가는 속도**만큼은, 관절을 아무리 빨리 돌려도 만들어낼 수 없다 — 순간적으로 그 방향은 반지름이 최대인 원의 접선 방향과 직교하기 때문에, 어떤 관절 회전 조합으로도 그 방향 성분을 만들 수 없다.

이건 4장에서 [역기구학](../inverse-kinematics-puma560-closed-form/main.md)이 손끝의 도달 범위 경계에서 풀리지 않았던 것과 같은 종류의 한계다 — 위치 문제에서는 "그 위치에 갈 수 없다"였다면, 속도 문제에서는 "그 위치에서 그 방향의 속도를 낼 수 없다"로 나타난다.

> **실무 포인트**: 여러분 자신도 같은 한계를 갖고 있다 — 팔을 완전히 뻗은 상태에서는 손을 더 멀리 보낼 수 없고, 등을 손으로 긁지 못하는 것도 관절 구조상 도달 범위(역기구학 해)가 없는 경우다. 특이점은 로봇이 고장 난 게 아니라 기구학적으로 당연히 존재하는 한계다.

내부 특이점(workspace interior singularity)의 대표적인 예로는 PUMA 560의 $\\theta_3=-90°$(팔꿈치가 완전히 펴진 자세)와 $\\theta_5=0°$(4번·6번 축이 일직선으로 겹쳐 자유도 하나가 사라지는 자세, [역기구학에서 다뤘던 손목 정렬](../inverse-kinematics-puma560-closed-form/main.md) 문제와 동일한 원인)가 있다.

---

## 6. 머니퓰레이터 내부에서의 static forces

여기서부터는 완전히 새로운 주제다 — 자코비안을 **속도가 아니라 힘**에 적용하는 첫걸음이다.

> "로봇은 연쇄의 자유단(말단 효과 장치)을 갖고 주어진 환경에서 어떤 물체를 밀고 있거나, 또는 손에 어떤 부하를 지지하고 있는 것이 전형적인 상황이다. 시스템을 정적 평형에 유지시키기 위하여 작용해야 할 관절 토크에 대하여 풀기를 원한다."

### static forces vs dynamics — 뭐가 다른가

같은 힘·토크 얘기지만 정지 여부가 다르다.

| 구분 | 상태 | 예시 |
|---|---|---|
| static forces (5장, 이 절) | 손끝이 정지해 있음 — 속도·위치·가속도 변화 없음 | 벽을 세게 밀고 있는데 안 움직임, 아령을 들고 가만히 버팀 |
| dynamics (6장) | 손끝이 힘을 받아 실제로 움직임 | 아령을 들고 휘두름 — 가속도가 생기고 모멘텀 때문에 몸이 반대로 밀림 |

**정적인 힘을 낸다는 게 왜 특별한가**: 만약 힘을 하나도 안 주면 관절은 그 자리에 그냥 멈춰 있으면 된다(힘 뺀 채로). 그런데 벽을 밀고 있거나 무게를 지탱하고 있으려면 위치·속도는 변화가 없는데도 **각 관절이 특정 토크를 계속 내야 한다** — 이 토크를 구하는 게 static forces 문제의 목표다.

### 계산 절차 (3단계)

머니퓰레이터에서 static forces를 고려할 때:

1. **모든 관절을 고정시켜 매니퓰레이터 전체를 하나의 강체(구조물)로 취급한다.** 링크 1, 2, 3이 실제로는 연결되어 있지만, 움직이지 않는다고 가정하면 하나의 덩어리로 봐도 무방하다는 단순화다.
2. **각 링크를 고려하여 링크계를 써서 밸런스(힘의 평형) 관계를 기술한다.** 작용-반작용, 그리고 시계 방향·반시계 방향 모멘트가 서로 상쇄되어 정지 상태를 유지한다는 조건을 이용한다.
3. **매니퓰레이터가 정적 평형에 있기 위해 각 관절축 주위에 작용해야 할 토크를 계산한다.** 이 결과가 말단 효과 장치에 작용하는 하중을 지지하기 위해 필요한 관절 토크의 조합이다.

> **꼭 기억**: 이 3단계 절차의 논리 순서(전체를 강체로 → 링크별 힘 평형 → 관절 토크 역산). **기억할 필요 없음**: 아직 실제 힘-토크 변환 공식(자코비안의 전치를 힘에 곱하는 형태)이 이 영상에는 나오지 않았다 — 다음 영상에서 이어질 내용이다.

**중력은 여기서 고려하지 않는다.** 지구상의 모든 물체는 항상 중력을 버티기 위한 힘을 쓰고 있지만, 이 절에서는 순수하게 "말단에 가해진 외력에 대응하는 관절 토크"만 다룬다. 중력이 링크에 가하는 힘은 6장(동역학, dynamics)에서 다뤄진다.

**실무 포인트**: 이 정적 힘 계산은 로봇이 칠판에 글씨를 쓰거나(일정한 누르는 힘 유지), 물체를 조립하며 밀어 끼울 때(force control) 필요한 계산이다 — ROS2 \`ros2_control\`의 force/torque 제어 인터페이스나 힘 제어(compliance control) 알고리즘의 이론적 기반이 된다.

---

## 7. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| \${}^AJ(\\Theta) = \\begin{bmatrix}{}^A_BR&0\\\\0&{}^A_BR\\end{bmatrix}{}^BJ(\\Theta)$ | 자코비안의 좌표계 변환 | 원점이 같은 두 좌표계 사이의 순수 회전 변환 |
| $\\dot\\Theta = J^{-1}(\\Theta)v$ | 손끝 속도 → 관절 속도(역기구학의 속도 버전) | $J$가 정사각행렬이고 역이 존재해야 함 |
| $\\det[J]=0$ | 특이점(singularity) 조건 | 이 점에서 $J^{-1}$이 존재하지 않음 |
| workspace boundary singularity | 작업 공간 경계의 특이점 | 모든 매니퓰레이터가 가짐 (팔을 최대로 뻗은 자세 등) |
| workspace interior singularity | 작업 공간 내부의 특이점 | 대부분의 매니퓰레이터가 가짐, 점이 아니라 궤적(loci)일 수 있음 |
| static forces | 정지 상태에서 외력에 대응하는 관절 토크 | 6장 dynamics(움직이는 상태의 힘)와 대조됨 |

---

## 8. Python 실습 코드

\`\`\`python
import numpy as np

def two_link_jacobian(l1, l2, theta1, theta2):
    """5-2 9절의 2x2 자코비안(선속도만, 베이스 좌표계 0 기준)."""
    c1, s1 = np.cos(theta1), np.sin(theta1)
    c12, s12 = np.cos(theta1 + theta2), np.sin(theta1 + theta2)
    return np.array([
        [-l1 * s1 - l2 * s12, -l2 * s12],
        [ l1 * c1 + l2 * c12,  l2 * c12],
    ])


def two_link_jacobian_inverse(l1, l2, theta1, theta2):
    """예제 5.5의 역자코비안. det = l1*l2*sin(theta2) 이므로
    theta2 -> 0, 180deg 에서 특이점이 된다."""
    J = two_link_jacobian(l1, l2, theta1, theta2)
    det = np.linalg.det(J)
    return np.linalg.inv(J), det


l1, l2 = 1.0, 0.8
theta1 = np.deg2rad(30)

print(f"{'theta2(deg)':>12} | {'det(J)':>10} | {'theta1_dot':>12} | {'theta2_dot':>12}")
for theta2_deg in [30, 15, 5, 1, 0.1]:
    theta2 = np.deg2rad(theta2_deg)
    J_inv, det = two_link_jacobian_inverse(l1, l2, theta1, theta2)
    theta_dot = J_inv @ np.array([1.0, 0.0])  # X축 방향 1 m/s
    print(f"{theta2_deg:12.2f} | {det:10.5f} | {theta_dot[0]:12.3f} | {theta_dot[1]:12.3f}")

# theta2가 0에 가까워질수록 det(J) -> 0, 관절 속도는 발산한다.
\`\`\`

### 연습 문제 (TODO)

\`\`\`python
def is_near_singularity(l1, l2, theta1, theta2, det_threshold=1e-3):
    """주어진 관절각이 특이점 근처인지 판별하라.

    TODO:
    - two_link_jacobian으로 J를 구하라
    - det(J)의 절댓값이 det_threshold보다 작으면 True를 반환하라
    """
    J = None  # TODO
    det = None  # TODO
    return None  # TODO


# 검증: theta2가 0, 180도에 가까울 때만 True가 나와야 한다
for theta2_deg in [0.0, 5.0, 90.0, 179.5, 180.0]:
    theta2 = np.deg2rad(theta2_deg)
    # print(theta2_deg, is_near_singularity(l1, l2, theta1, theta2))
\`\`\`

> [!TIP]
> **연습 문제 정답 보기**
> \`\`\`python
> def is_near_singularity(l1, l2, theta1, theta2, det_threshold=1e-3):
>     J = two_link_jacobian(l1, l2, theta1, theta2)
>     det = np.linalg.det(J)
>     return abs(det) < det_threshold
>
>
> for theta2_deg in [0.0, 5.0, 90.0, 179.5, 180.0]:
>     theta2 = np.deg2rad(theta2_deg)
>     print(theta2_deg, is_near_singularity(l1, l2, theta1, theta2))
> # 0.0 True, 5.0 False, 90.0 False, 179.5 True, 180.0 True
> \`\`\`

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 자코비안 좌표계 변환 | \${}^AJ(\\Theta) = \\begin{bmatrix}{}^A_BR&0\\\\0&{}^A_BR\\end{bmatrix}{}^BJ(\\Theta)$ — 선속도·각속도 블록이 각각 같은 회전행렬로 변환됨 |
| 특이점의 수학적 정의 | $\\det[J(\\Theta)]=0$인 관절각 조합 — $J^{-1}$이 존재하지 않음 |
| 특이점의 물리적 의미 | 그 자세에서는 특정 방향의 손끝 속도를 관절이 아무리 빨리 움직여도 낼 수 없음 |
| 특이점의 종류 | 작업 공간 경계 특이점(모든 로봇이 가짐) + 작업 공간 내부 특이점(대부분이 가짐, 궤적일 수 있음) |
| 예제 5.5 결론 | 2-링크 로봇에서 $\\theta_2\\to0$(팔을 완전히 뻗음)이면 역자코비안의 분모($l_1l_2\\sin\\theta_2$)가 0이 되어 관절 속도가 발산 |
| 특이점 회피 실무 | 순수 역행렬 대신 damped least squares($\\sigma_i\\to\\sigma_i/(\\sigma_i^2+\\lambda^2)$) 역행렬 사용 |
| static forces | 손끝이 **정지한 채로** 외력을 내거나 버티는 상황의 관절 토크 계산 — 6장 dynamics(움직이며 힘을 내는 상황)와 대조 |
| static forces 계산 절차 | ① 전체를 하나의 강체로 고정 ② 링크별 힘의 평형(작용-반작용) 기술 ③ 관절 토크 역산. 중력은 6장에서 다룸 |
| 이 영상이 다루지 않은 것 | static forces의 실제 힘-토크 변환 공식(자코비안 전치 활용)은 유도되지 않음 — 절차 개관에서 영상이 끝남 |
`,

  'Robotics/jacobian-static-forces-and-geometric-jacobian': `---
title: 자코비안 — static forces와 자코비안 전치, 기하학적 자코비안 (Jacobian Static Forces & Geometric Jacobian)
date: 2026-08-08
tags: jacobian, static-forces
order: 
featured: false
draft: false
---

# 자코비안 — static forces와 자코비안 전치, 기하학적 자코비안 (Jacobian Static Forces & Geometric Jacobian)

> 출처: 로봇제어공학 — Introduction to Robotics 5장 "자코비안: 속도와 static forces" (마지막)
> 영상: https://www.youtube.com/watch?v=7MFWjavDqMs&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=14
> 대상: [5-3](../jacobian-singularity-and-static-forces/main.md)에서 static forces의 계산 절차(전체 강체화 → 링크별 힘 평형 → 관절 토크 역산)를 개관한 상태에서 이어본다. **이 노트로 5장이 완결된다** — 힘·토크 전파 공식, $\\tau = J^T\\mathcal{F}$의 발견과 유도, 기하학적 자코비안(Asada 방식), 속도·힘의 좌표계 변환까지.

---

## 목차

1. [복습 — 순차 전파와 자코비안](#1-복습--순차적-전파와-자코비안은-같은-것의-두-표현)
2. [static forces — 힘·토크 전파](#2-static-forces--힘과-토크의-링크-간-전파)
3. [관절이 낼 수 있는 것 — Z축 토크](#3-관절이-실제로-낼-수-있는-것--z축-토크만)
4. [예제 5.7 — 자코비안 전치의 발견](#4-예제-57--2-링크-관절-토크와-자코비안-전치의-발견)
5. [가상 일의 원리 — τ = Jᵀ𝓕 유도](#5-가상-일의-원리--τ--jᵀ𝓕-유도)
6. [기하학적 자코비안 (Asada 방식)](#6-기하학적-자코비안--자코비안을-직접-구하는-공식)
7. [ABB IRB140 예제](#7-abb-irb140-예제--자코비안은-매-순간-다시-계산한다)
8. [속도·힘의 좌표계 변환](#8-속도와-static-forces의-직교좌표계-변환)
9. [1~5장 큰 그림 정리](#9-15장-큰-그림-정리)
10. [표기법 비교표](#10-표기법-비교표)
11. [Python 실습 코드](#11-python-실습-코드)
12. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 복습 — 순차적 전파와 자코비안은 같은 것의 두 표현

[속도 전파 공식](../jacobian-velocity-kinematics-link-propagation/main.md)은 관절 $i$의 각속도·선속도를 알면 관절 $i+1$을 구하는 구조였다.

$\${}^{i+1}\\omega_{i+1} = {}^{i+1}_{i}R\\,{}^{i}\\omega_i + \\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$$
$\${}^{i+1}v_{i+1} = {}^{i+1}_{i}R\\left({}^{i}v_i + {}^{i}\\omega_i \\times {}^{i}P_{i+1}\\right)$$

- **다음 것을 구하려면 이전 것이 필요하다** → 체인 구조이므로 항상 0번(베이스) 관절부터 시작한다. \${}^0v_0 = {}^0\\omega_0 = 0$(바닥에 고정)임을 **알기 때문에** 아는 것에서 모르는 것으로 순차 진행이 가능하다.
- 이 식에 들어가는 재료는 전부 이미 아는 값이다 — $\\dot\\theta$는 우리가 조절하는 변수, \${}^iP_{i+1}$은 [DH 파라미터](../denavit-hartenberg-parameters/main.md)로 고정된 상수, 회전행렬은 변환행렬에서 읽으면 된다.

자코비안은 이 순차 계산의 결과를 **한 번에 쓴 것**이다. 손끝 위치·자세 $(x,y,z,R,P,Y)$가 관절각 6개의 함수 $f_1,\\dots,f_6$으로 주어질 때, 각 함수를 각 관절로 편미분해 행렬로 묶으면 자코비안이고([5-2의 정의](../jacobian-velocity-kinematics-link-propagation/main.md) 그대로), 미소 변화 $\\delta Y = J(X)\\,\\delta X$를 시간으로 나눠 극한을 취하면 속도 관계가 된다.

$$\\dot Y = J(X)\\,\\dot X \\quad\\Longleftrightarrow\\quad {}^0v = {}^0J(\\Theta)\\,\\dot\\Theta$$

> "이 수식은 순차적으로 쓴 거고, 자코비안은 그거를 한 번에 쓴 거의 차이잖아요. 그러니까 수식적으로는 자코비안이 훨씬 깔끔해."

원칙적으로는 2~3장에서 구한 기구학 식(\${}^0_6T$의 각 성분 = $f_1,\\dots,f_6$)을 $\\theta_1,\\dots,\\theta_6$로 직접 편미분하면 자코비안이 나온다. 그런데 실제 해보면 계산이 엄청나게 어렵고, 크레이그 책도 "다른 책을 참고해라" 하고 건너뛴다 — 그래서 이 강의는 [6절](#6-기하학적-자코비안--자코비안을-직접-구하는-공식)에서 다른 교재(Asada)의 실용적인 공식을 보충한다.

> **이해**: "순차 전파를 다 풀어서 $\\dot\\theta_i$별로 묶으면 자코비안"이라는 두 방법의 동등성. 자코비안을 한 번 구해 놓으면 $6\\times6$ 곱셈 한 번으로 끝나므로 순차 계산 6번을 반복할 필요가 없다.

---

## 2. static forces — 힘과 토크의 링크 간 전파

[5-3에서 개관한 static forces](../jacobian-singularity-and-static-forces/main.md)의 본론이다. 로봇이 **움직이지 않는 상태로** 벽을 밀거나 무게를 버틸 때, 각 링크 사이에 오가는 힘·토크를 수식으로 쓴다.

먼저 기호 정의:

| 기호 | 의미 |
|---|---|
| $f_i$ | 링크 $i-1$이 링크 $i$에 가하는 **힘** |
| $n_i$ | 링크 $i-1$이 링크 $i$에 가하는 **토크** |
| \${}^iP_{i+1}$ | 관절 $i$ 원점 → 관절 $i+1$ 원점의 위치 벡터 (DH로 고정된 상수) |

### 힘의 평형과 토크의 평형

정지해 있으므로 링크 $i$ 하나에 작용하는 힘의 합과, 좌표계 $\\{i\\}$ 원점 주위 토크의 합이 모두 0이어야 한다.

$\${}^if_i - {}^if_{i+1} = 0$$
$\${}^in_i - {}^in_{i+1} - {}^iP_{i+1} \\times {}^if_{i+1} = 0$$

두 식의 구조가 다른 이유가 핵심이다.

- **힘은 그대로 전달된다.** 힘에 차이가 있다는 건 관절이 옆으로 밀린다는 뜻인데, 관절은 축에 고정되어 있고 지금은 정적 상태라 움직이지 않는다. 내가 벽을 밀 때 벽도 나도 안 움직이지만 손과 벽 사이에는 큰 힘이 오가는 것과 같다 — 전달만 될 뿐 어디서도 새지 않는다.
- **토크는 모멘트 암 항이 추가된다.** 회전 관절은 고정된 채로도 돌 수 있으므로, 관절 $i+1$에 가해진 힘이 거리 \${}^iP_{i+1}$만큼 떨어진 곳에서 작용하면 관절 $i$ 원점 기준으로는 "회전 중심에서 떨어진 거리 × 힘"만큼의 토크(\${}^iP_{i+1} \\times {}^if_{i+1}$)가 더해진다.

### 전파 공식으로 정리

위 평형식을 이항하고, 관절 $i+1$ 기준으로 표현된 힘·토크를 회전행렬로 $\\{i\\}$ 기준으로 바꿔주면 (\${}^if_{i+1} = {}^i_{i+1}R\\,{}^{i+1}f_{i+1}$ — [좌표계 매핑](../frames-and-mapping/main.md) 그대로):

$$\\boxed{{}^if_i = {}^i_{i+1}R\\,{}^{i+1}f_{i+1}}$$
$$\\boxed{{}^in_i = {}^i_{i+1}R\\,{}^{i+1}n_{i+1} + {}^iP_{i+1} \\times {}^if_i}$$

토크 식의 마지막 항이 \${}^if_{i+1}$이 아니라 \${}^if_i$인 게 눈에 걸리는데, 힘의 평형에서 \${}^if_i = {}^if_{i+1}$이므로 그대로 바꿔 쓴 것이다.

### 속도와 순서가 반대다

이 전파식은 [속도 전파식](#1-복습--순차적-전파와-자코비안은-같은-것의-두-표현)과 모양이 거의 같지만, **아는 것의 위치가 반대**다.

| | 속도 전파 | 힘 전파 |
|---|---|---|
| 아는 것 | 베이스: \${}^0v_0 = {}^0\\omega_0 = 0$ (고정) | 손끝: \${}^6F_6$, \${}^6N_6$ (문제로 주어짐 — "몇 N으로 누르고 싶다") |
| 진행 방향 | 베이스 → 손끝 ($i$를 알아야 $i+1$) | 손끝 → 베이스 ($i+1$을 알아야 $i$) |

> **꼭 기억**: 속도는 베이스에서 손끝으로, 힘은 손끝에서 베이스로 전파된다. 두 경우 모두 "아는 쪽에서 모르는 쪽으로" 간다는 원리는 같다.
> **기억할 필요 없음**: 전파 공식 자체 — 구조(회전행렬 매핑 + 모멘트 암)만 이해하면 되고, 실무에선 라이브러리가 계산한다.

---

## 3. 관절이 실제로 낼 수 있는 것 — Z축 토크만

전파식으로 구한 \${}^in_i$는 3차원 벡터다 — X축 토크, Y축 토크, Z축 토크가 다 들어 있다. 그런데 회전 관절(revolute joint)에서 모터가 실제로 낼 수 있는 건 **관절 축(Z축) 주위의 토크뿐**이다. 내가 관절에 옆 방향 힘을 줄 방법은 없고, 유일하게 줄 수 있는 게 $\\theta$를 돌리는 것이며 그게 Z축 토크다.

나머지 X·Y 방향 성분은? **기구 자체의 구조(베어링, 링크 강성)가 지지한다.** 그래서 정적 평형에 필요한 관절 액추에이터 토크는 토크 벡터에서 Z 성분만 뽑으면 된다.

$$\\tau_i = {}^in_i^{\\,T}\\,{}^i\\hat Z_i \\qquad \\text{(회전 관절)}$$
$$\\tau_i = {}^if_i^{\\,T}\\,{}^i\\hat Z_i \\qquad \\text{(직동 관절 — 힘의 Z 성분)}$$

- \${}^i\\hat Z_i$는 특별한 게 아니라 좌표계 $\\{i\\}$의 Z축 방향 **단위 벡터** $(0,0,1)$이다.
- 전치(transpose)는 세로 벡터를 가로로 눕혀 내적이 되게 만드는 것뿐이다: $(n_x, n_y, n_z)\\cdot(0,0,1) = n_z$ — Z 성분만 남는다.

> **이해**: "관절이 낼 수 있는 건 Z축 토크뿐, 나머지는 구조가 버틴다"는 물리적 이유. 이게 [다음 절](#4-예제-57--2-링크-관절-토크와-자코비안-전치의-발견)에서 $\\tau$ 벡터가 만들어지는 근거다.

**실무 연결**: $\\tau_i$가 바로 모터 제어기에 내려보내는 전류/토크 지령의 이론값이다. ROS2 \`ros2_control\`의 effort interface로 관절에 주는 값이 이 $\\tau$에 해당한다.

---

## 4. 예제 5.7 — 2-링크 관절 토크와 자코비안 전치의 발견

> **예제 5.7**: 2-링크 매니퓰레이터가 말단효과장치로 힘 벡터 \${}^3F$를 계 $\\{3\\}$의 원점에 작용하고 있다. 필요한 관절 토크를 부가된 힘의 함수로 구하라.

손끝이 계 $\\{3\\}$ 기준으로 $F = (f_x, f_y, 0)$의 힘을 내야 한다고 하자(평면 로봇이라 Z 성분 없음). 마지막 링크부터 전파식을 역방향으로 적용한다.

**손끝 → 링크 2** (\${}^2_3R = I$, \${}^2P_3 = l_2\\hat X_2$):

$\${}^2f_2 = \\begin{bmatrix}f_x\\\\f_y\\\\0\\end{bmatrix}, \\qquad {}^2n_2 = l_2\\hat X_2 \\times \\begin{bmatrix}f_x\\\\f_y\\\\0\\end{bmatrix} = \\begin{bmatrix}0\\\\0\\\\l_2f_y\\end{bmatrix}$$

**링크 2 → 링크 1** (\${}^1_2R$은 $\\theta_2$ 회전):

$\${}^1f_1 = \\begin{bmatrix}c_2&-s_2&0\\\\s_2&c_2&0\\\\0&0&1\\end{bmatrix}\\begin{bmatrix}f_x\\\\f_y\\\\0\\end{bmatrix} = \\begin{bmatrix}c_2f_x-s_2f_y\\\\s_2f_x+c_2f_y\\\\0\\end{bmatrix}$$

$\${}^1n_1 = \\begin{bmatrix}0\\\\0\\\\l_2f_y\\end{bmatrix} + l_1\\hat X_1 \\times {}^1f_1 = \\begin{bmatrix}0\\\\0\\\\l_1s_2f_x + l_1c_2f_y + l_2f_y\\end{bmatrix}$$

**Z 성분만 읽으면** 각 관절이 내야 하는 토크가 나온다.

$$\\tau_1 = l_1s_2\\,f_x + (l_2+l_1c_2)\\,f_y, \\qquad \\tau_2 = l_2\\,f_y$$

이걸 행렬로 묶으면:

$$\\tau = \\begin{bmatrix}l_1s_2 & l_2+l_1c_2\\\\0 & l_2\\end{bmatrix}\\begin{bmatrix}f_x\\\\f_y\\end{bmatrix}$$

### 이 행렬, 어디서 봤더라

[5-2에서 구한](../jacobian-velocity-kinematics-link-propagation/main.md) 계 $\\{3\\}$ 기준 자코비안과 비교해 보면:

$\${}^3J(\\Theta) = \\begin{bmatrix}l_1s_2 & 0\\\\l_1c_2+l_2 & l_2\\end{bmatrix}$$

대각 성분은 같고 비대각(off-diagonal) 성분의 위치만 바뀌었다 — **자코비안의 전치(transpose)** 다.

$$\\boxed{\\tau = {}^3J^T(\\Theta)\\,{}^3F}$$

> "자코비안만 한번 구해놓으면 속도 구할 때도 써먹을 수 있고, 정적인 힘 구할 때, 토크 구할 때도 써먹을 수 있고. 오! 너무 좋다!"

속도 문제에서는 $v = J\\dot\\Theta$(자코비안 × 관절 속도 = 손끝 속도)였는데, 힘 문제에서는 $\\tau = J^T F$(자코비안 전치 × 손끝 힘 = 관절 토크)로, **같은 행렬 하나가 방향만 바꿔 두 문제를 다 푼다.** 내가 천장을 10 N으로 밀고 싶든 5 N으로 밀고 싶든, $F$만 바꿔 곱하면 필요한 관절 토크가 즉시 나온다.

> **꼭 기억**: $\\tau = J^T\\mathcal{F}$ — 속도는 $J$, 힘은 $J^T$. 그리고 힘 문제에서 관절 공간으로 갈 때 **역행렬이 아니라 전치**라는 것.
> **이해**: 예제의 전개 과정(전파 → Z 성분 추출 → 행렬로 묶기). **기억할 필요 없음**: 2-링크 결과식 자체.

---

## 5. 가상 일의 원리 — τ = Jᵀ𝓕 유도

예제에서 "해보니 전치가 나왔다"를 수식으로 증명하는 게 가상 일(virtual work)의 원리다. 에너지 보존과 비슷한 발상이다 — 내가 관절들을 돌려서 한 일의 총합은, 그 결과로 손끝이 어딘가에 힘을 가하며 한 일과 같아야 한다.

$$\\mathcal{F}\\cdot\\delta\\chi = \\tau\\cdot\\delta\\Theta$$

- $\\mathcal{F}$: 손끝에 작용하는 힘-모멘트 벡터($6\\times1$), $\\delta\\chi$: 손끝의 미소 변위($6\\times1$)
- $\\tau$: 관절 토크 벡터($6\\times1$), $\\delta\\Theta$: 관절의 미소 회전($6\\times1$)
- 일(work)은 스칼라이므로 어느 좌표계에서 측정해도 같다 — 그래서 직교좌표계의 일과 관절 공간의 일을 등호로 연결할 수 있다.

$6\\times1$ 세로 벡터끼리는 그대로 곱할 수 없으니 내적이 되도록 전치를 붙인다(수학적 형식일 뿐 의미는 없다).

$$\\mathcal{F}^T\\delta\\chi = \\tau^T\\delta\\Theta$$

여기에 자코비안의 정의 $\\delta\\chi = J\\,\\delta\\Theta$를 대입하면:

$$\\mathcal{F}^TJ\\,\\delta\\Theta = \\tau^T\\delta\\Theta \\;\\Longrightarrow\\; \\mathcal{F}^TJ = \\tau^T \\;\\Longrightarrow\\; \\boxed{\\tau = J^T\\mathcal{F}}$$

(책은 이 부분에서 $\\delta Y$와 $\\delta\\chi$, 대문자 $\\Theta$와 소문자 $\\theta$ 표기를 섞어 쓰는데, 전부 같은 것 — 손끝 좌표의 미소 변화와 관절각 벡터 — 을 뜻하는 오타 수준의 혼용이다.)

### 이 결과가 왜 대단한가 — 역기구학이 한 번도 안 나왔다

위치 제어를 하려면 [역기구학](../inverse-kinematics/main.md)을 풀어야 했다 — 연산이 많고 시간도 오래 걸리는 어려운 문제였다. 그런데 힘 제어는:

> "손끝에 원하는 토크든 힘이든 주어지면, 자코비안의 인버스도 아니고 그냥 트랜스포즈 한 번에 타우가 나와. 각 관절에. 너무 좋은 거야. 인버스를 한 번도 써본 적이 없어."

- 자코비안 구할 때: 변환행렬에서 **읽기**만 했다 (역행렬 없음)
- 힘 → 관절 토크: **전치**만 곱했다 (역행렬 없음)
- 직교좌표계 값을 관절 공간으로 바꾸는데 역기구학 함수를 하나도 계산하지 않았다

**특이점의 힘 해석**: 속도에서는 [특이점](../jacobian-singularity-and-static-forces/main.md)에서 관절 속도가 발산했지만, 힘에서는 반대 현상이 나타난다 — 팔을 거의 다 편 상태로 벽에 접촉하면, 임의의 커다란 손끝 힘이 아주 '작은' 관절 토크로 감당된다($J^T$가 특이하면 특정 방향 힘이 $\\tau$에 거의 반영되지 않는다). 팔을 쭉 펴고 벽을 밀면 어깨 힘이 거의 안 드는 것과 같은 원리로, 구조가 힘을 받아주기 때문이다.

> **꼭 기억**: 가상 일 유도의 논리 사슬 — "일은 스칼라 → 좌표계 무관 → $\\mathcal{F}^TJ = \\tau^T$". 면접·시험에서 "왜 전치인가"에 대한 표준 답이다.

---

## 6. 기하학적 자코비안 — 자코비안을 직접 구하는 공식

크레이그 책이 건너뛴 "자코비안을 직접 구하는 방법"을 다른 교재로 보충한 부분이다 — Asada & Slotine, *Robot Analysis and Control* (기계과 로봇공학 수업의 표준 교재; 크레이그 책과 함께 가장 많이 쓰이는 두 권이다. 슬라이드는 한국항공대 권상주 교수 강의자료에서 가져온 것).

핵심은 [1절](#1-복습--순차적-전파와-자코비안은-같은-것의-두-표현)의 $\\delta x = J\\,\\delta q$에서 출발해서, 자코비안을 위·아래 세 줄씩 쪼개는 것이다. (이 교재는 관절각을 $\\theta$ 대신 $q$로 쓴다 — 책마다 표기가 다르니 주의.)

$$J = \\begin{bmatrix}J_P\\ (3\\times n)\\\\ J_O\\ (3\\times n)\\end{bmatrix} \\qquad \\begin{aligned}v_e &= J_P\\,\\dot q \\quad\\text{(선속도)}\\\\ \\omega_e &= J_O\\,\\dot q \\quad\\text{(각속도)}\\end{aligned}$$

각 열(관절 하나당 한 열)은 다음 공식으로 **직접** 구해진다.

**회전 관절 $i$:**

$$\\begin{bmatrix}J_{Pi}\\\\J_{Oi}\\end{bmatrix} = \\begin{bmatrix}\\hat z_{i-1} \\times (\\hat p_e - \\hat p_{i-1})\\\\ \\hat z_{i-1}\\end{bmatrix}$$

**직동 관절 $i$:**

$$\\begin{bmatrix}J_{Pi}\\\\J_{Oi}\\end{bmatrix} = \\begin{bmatrix}\\hat z_{i-1}\\\\ 0\\end{bmatrix}$$

여기서 각 기호는 전부 **변환행렬에서 읽는 값**이다.

| 기호 | 의미 | 어디서 읽나 |
|---|---|---|
| $\\hat z_{i-1}$ | 관절 $i$의 회전축 방향 (베이스 기준) | \${}^0_{i-1}T$의 회전 부분 **3번째 열** |
| $\\hat p_{i-1}$ | 관절 $i$ 원점의 위치 (베이스 기준) | \${}^0_{i-1}T$의 **translation 열** |
| $\\hat p_e$ | 손끝의 위치 (베이스 기준) | \${}^0_nT$의 translation 열 |

공식이 말이 되는 이유를 뜯어보면:

- **아래 블록($J_{Oi} = \\hat z_{i-1}$)**: 회전 관절 $i$를 $\\dot q_i$로 돌리면 손끝의 각속도에는 그 회전축 방향으로 $\\dot q_i$가 그대로 더해진다 — 관절은 자기 Z축으로만 도니까.
- **위 블록($\\hat z_{i-1}\\times(\\hat p_e - \\hat p_{i-1})$)**: 관절 $i$가 돌 때 손끝은 관절 축을 중심으로 한 원운동을 한다. 원운동의 선속도는 [각속도 × 반지름 벡터](../jacobian-velocity-kinematics/main.md)($v = \\omega\\times r$)이고, 여기서 반지름 벡터가 관절 원점에서 손끝까지의 $(\\hat p_e - \\hat p_{i-1})$이다.
- **직동 관절**: 축 방향으로 밀기만 하므로 선속도에 $\\hat z_{i-1}$이 그대로 들어가고 회전은 만들지 않는다(0).

> "기구학 방정식, 트랜스포메이션 매트릭스를 각 항별로 관절각으로 다 미분해서 구할 수 있다 — 그게 원칙적인 의미고, 해보려고 하면 엄청 어려워."
> "이 식은 기계과 학생들은 아마 외우고 있을 거고, 우리는 외울 필요 전혀 없어요."

> **이해**: 두 블록의 물리적 의미($\\omega$는 축 방향 그대로, $v$는 $\\omega\\times r$). **기억할 필요 없음**: 공식 암기 — 변환행렬만 있으면 코드 몇 줄로 조립된다([실습](#11-python-실습-코드)에서 직접 확인).

**실무 연결**: 이 공식이 바로 대부분의 로봇 라이브러리가 자코비안을 계산하는 방식이다 — MoveIt의 \`RobotState::getJacobian()\`, KDL의 \`ChainJntToJacSolver\`가 내부에서 이 기하학적(geometric) 자코비안을 조립한다. 편미분을 기호로 푸는 게 아니라 FK 한 번 돌린 뒤 열별로 외적을 계산한다.

---

## 7. ABB IRB140 예제 — 자코비안은 매 순간 다시 계산한다

기하학적 자코비안을 실제 산업용 로봇에 적용한 예제다(유튜브 예제 영상 기반).

**IRB140**: ABB사의 대표적인 6축 산업용 로봇. 끝의 4·5·6번 축이 한 점에서 교차하고(손목), 1·2·3번 축 구조는 [PUMA](../forward-kinematics/main.md)와 거의 같다 — 대부분의 산업용 로봇 팔이 이런 구성이다.

> 산업용 로봇 회사들: ABB·KUKA(유럽), FANUC·가와사키(일본), 두산 로보틱스·현대 로보틱스(한국 — 현대중공업에서 로봇 부문을 분리).

예제의 절차:

1. **자세를 고정한다**: $\\theta_1 = 90°,\\ \\theta_2 = 0,\\ \\theta_3 = -90°,\\ \\theta_4 = \\theta_5 = \\theta_6 = 0$ — 로봇이 팔을 쭉 뻗은 자세. 각도가 숫자로 정해졌으므로 [DH 파라미터](../dh-parameters-practice/main.md)로 만든 변환행렬의 $c_i, s_i$에 값을 넣으면 \${}^0_1T,\\dots,{}^5_6T$가 전부 **숫자 행렬**이 된다.
2. **읽는다**: 각 누적 변환행렬 \${}^0_iT$에서 회전 부분 3번째 열($\\hat z_i$)과 translation 열($\\hat p_i$)을 읽는다. $\\hat z_0 = (0,0,1)$, $\\hat p_0 = (0,0,0)$부터 시작.
3. **조립한다**: 열마다 $\\hat z_{i-1}\\times(\\hat p_6-\\hat p_{i-1})$과 $\\hat z_{i-1}$을 쌓으면 $6\\times6$ 자코비안 숫자 행렬 완성.

이 자세에서 자코비안을 알았으니, 이제 손끝에 원하는 선속도·각속도를 넣으면 필요한 관절 속도가, 원하는 힘을 $J^T$에 넣으면 필요한 관절 토크가 바로 나온다.

(슬라이드에 인용된 변환행렬 캡처에는 IRB140의 팔뚝 링크 380 mm가 빠져 있어, 그 행렬들만으로 재계산하면 슬라이드의 최종 $J$ 숫자와 일치하지 않는다. 절차를 따라가는 데는 지장이 없고, 방법 자체는 [실습](#11-python-실습-코드)에서 2-링크 로봇으로 완전하게 검증한다.)

### 그럼 자코비안은 쉬운 건가? — 함정

> "여기서 쉬운 이유가 뭐예요? 이걸 고정시켜버렸잖아. 이 위치에서의 자코비안 딱 하나 구한 거죠. 근데 로봇이 딱 여기만 있어요?"

자코비안을 $J(\\Theta)$라고 쓰는 이유가 바로 이것이다 — **관절각이 바뀌면 자코비안의 모든 성분이 바뀐다.** 로봇이 움직이는 동안:

1. 현재 $\\Theta$로 자코비안을 다시 계산하고
2. 그걸로 필요한 관절 속도(또는 토크)를 계산하고
3. 다음 순간 또 반복한다

> "이건 손으로 하는 게 아니야. 수식으로 미리 만들어 놓고 프로그램을 만들어 놓은 다음에 계속 연산을 해야 돼요. 그때그때 필요한 자코비안은."

**실무 연결**: 실시간 제어 루프(보통 100 Hz~1 kHz)마다 자코비안을 재계산하는 게 로봇 제어기의 일상이다. ROS2 \`moveit_servo\`가 조이스틱 명령을 관절 속도로 바꿀 때 매 주기 이 계산을 한다.

> **꼭 기억**: 자코비안은 상수 행렬이 아니라 $\\Theta$의 함수 — 자세가 바뀌면 매번 다시 계산해야 한다.

---

## 8. 속도와 static forces의 직교좌표계 변환

마지막 주제. [5-3의 자코비안 좌표계 변환](../jacobian-singularity-and-static-forces/main.md)은 **원점이 같은** 두 좌표계 사이의 순수 회전이었는데, 이번엔 **원점이 다른** 두 좌표계 사이에서 속도·힘 6차원 벡터를 통째로 옮기는 $6\\times6$ 변환을 만든다.

일반화된 속도와 힘을 $6\\times1$로 묶어 쓰면:

$$\\nu = \\begin{bmatrix}v\\\\\\omega\\end{bmatrix} = J\\dot\\Theta, \\qquad \\mathcal{F} = \\begin{bmatrix}F\\\\N\\end{bmatrix} = \\text{힘 3개 + 토크 3개}$$

### 속도 변환 (velocity transformation)

출발점은 [속도 전파 공식](#1-복습--순차적-전파와-자코비안은-같은-것의-두-표현)이다. $i \\to A$, $i+1 \\to B$로 바꾸고, 두 좌표계가 한 강체 위에 있다고 보고 $\\dot\\theta_{i+1} = 0$(두 계 사이에 관절 회전 없음)을 가정하면 행렬-벡터 형태로 묶인다.

$$\\begin{bmatrix}{}^Bv_B\\\\{}^B\\omega_B\\end{bmatrix} = \\begin{bmatrix}{}^B_AR & -{}^B_AR\\,({}^AP_{BORG}\\times)\\\\ 0 & {}^B_AR\\end{bmatrix}\\begin{bmatrix}{}^Av_A\\\\{}^A\\omega_A\\end{bmatrix} = {}^B_AT_v\\,{}^A\\nu_A$$

여기서 나오는 수학적 트릭 하나 — $\\omega \\times P$처럼 외적이 행렬 곱 중간에 끼어 있으면 벡터를 밖으로 뽑아낼 수 없다. 그래서 외적을 **반대칭 행렬(skew-symmetric matrix)** 과의 곱으로 바꾼다.

$$P\\times = \\begin{bmatrix}0 & -p_z & p_y\\\\ p_z & 0 & -p_x\\\\ -p_y & p_x & 0\\end{bmatrix} \\qquad (P\\times)\\,\\omega = P \\times \\omega$$

이렇게 하면 외적이 평범한 행렬 곱이 되어 $\\omega$를 오른쪽 벡터로 빼낼 수 있고, 전체가 $6\\times6$ 행렬 하나로 정리된다. (이 반대칭 행렬 꼴은 [회전 표현](../orientation-representations/main.md)에서 본 그 형태다.)

역방향(B에서의 값 → A에서의 표현)은:

$$\\begin{bmatrix}{}^Av_A\\\\{}^A\\omega_A\\end{bmatrix} = \\begin{bmatrix}{}^A_BR & ({}^AP_{BORG}\\times)\\,{}^A_BR\\\\ 0 & {}^A_BR\\end{bmatrix}\\begin{bmatrix}{}^Bv_B\\\\{}^B\\omega_B\\end{bmatrix} = {}^A_BT_v\\,{}^B\\nu_B$$

### 힘-모멘트 변환 (force-moment transformation)과 전치 관계

같은 작업을 [힘 전파 공식](#2-static-forces--힘과-토크의-링크-간-전파)으로 하면:

$$\\begin{bmatrix}{}^AF_A\\\\{}^AN_A\\end{bmatrix} = \\begin{bmatrix}{}^A_BR & 0\\\\ ({}^AP_{BORG}\\times)\\,{}^A_BR & {}^A_BR\\end{bmatrix}\\begin{bmatrix}{}^BF_B\\\\{}^BN_B\\end{bmatrix} = {}^A_BT_f\\,{}^B\\mathcal{F}_B$$

그리고 속도 변환과 힘 변환을 나란히 놓고 비교하면:

$$\\boxed{{}^A_BT_f = {}^A_BT_v^{\\,T}}$$

$\\tau = J^T\\mathcal{F}$에서 자코비안과 그 전치가 속도/힘을 각각 담당했던 것의 **확장판**이다 — 좌표계 변환에서도 속도 변환 행렬과 힘 변환 행렬이 전치 관계를 이룬다.

> "이 파트는 굳이 기억할 필요가 없어요. ... 만약에 쓴다면 이때 딱 한번 써요."

### 딱 한 번 쓰이는 곳 — 힘/토크 센서 (예제 5.8)

로봇 손끝에 펜(툴)을 쥐고 칠판에 글씨를 쓴다고 하자. 궁금한 건 **펜 끝이 칠판을 누르는 힘**인데, 펜 끝에는 센서를 달 수 없다(글씨를 써야 하니까). 그래서 힘/토크 센서는 보통 **손목과 툴 사이**에 단다.

- 센서 좌표계 $\\{S\\}$에서 측정된 힘 \${}^S\\mathcal{F}_S$를, 툴 끝 좌표계 $\\{T\\}$에서의 힘으로 변환:

$\${}^T\\mathcal{F}_T = {}^T_ST_f\\,{}^S\\mathcal{F}_S, \\qquad {}^T_ST_f = \\begin{bmatrix}{}^T_SR & 0\\\\ ({}^TP_{SORG}\\times)\\,{}^T_SR & {}^T_SR\\end{bmatrix}$$

- 이 변환에 필요한 회전행렬과 원점 사이 거리는 **내가 설계해서 단 것이니 전부 아는 값**이다.
- 툴을 다르게 쥐면? 센서는 그대로 두고 **변환행렬만 바꾸면** 정확한 툴 끝 힘을 계속 얻는다.

**실무 연결**: 이게 F/T 센서(ATI, Robotiq 등)를 쓰는 모든 힘 제어의 표준 전처리다. ROS2에서 \`geometry_msgs/WrenchStamped\`로 들어온 센서값을 툴 프레임으로 옮길 때 정확히 이 변환을 한다(tf2의 wrench 변환).

> **기억할 필요 없음**: $T_v$, $T_f$의 성분 — 강의 스스로 "거의 쓸 일 없다"고 못박았다. **이해**: 힘 센서 상황에서 왜 필요한지 + $T_f = T_v^T$라는 구조.

---

## 9. 1~5장 큰 그림 정리

강의가 5장을 마치며 1~5장 전체를 하나의 흐름으로 정리했다.

| 단계 | 배운 것 | 할 수 있게 된 것 |
|---|---|---|
| 로봇이 주어짐 | 링크 길이·모양새 파악 | — |
| [DH 파라미터](../denavit-hartenberg-parameters/main.md) | 좌표계 붙이고 파라미터 표 작성 | 변환행렬을 공식에 넣어 바로 생성 |
| [정기구학](../forward-kinematics/main.md) | \${}^0_6T$ 연산 | 관절각 → 손끝 위치 (알고는 있어야 하지만 그 자체론 쓸모 적음) |
| [역기구학](../inverse-kinematics-puma560-closed-form/main.md) | 폐형식 풀이 | 손끝 목표 위치 → 관절각: **위치 제어** |
| 자코비안 (5장) | $v = J\\dot\\Theta$, $\\tau = J^T\\mathcal{F}$ | 손끝 속도 제어 + 정적 **힘 제어** |

마지막 줄이 이 장의 성과다. 로봇을 사서 매뉴얼의 DH 파라미터만 있으면 — 어디로 가라(위치 제어), 이 속도로 움직여라(속도 제어), 이 힘으로 눌러라(힘 제어)를 전부 계산할 수 있다. 벽을 누르면서 옆으로 문지르는 동작은 위치 제어와 힘 제어를 **동시에** 하는 것이고, 그때 모터 토크가 얼마여야 하는지까지 구할 수 있게 됐다.

> "기구학은 결국 각 관절의 각도가 몇 도면 손끝이 어디입니다, 위치만 알려주는데, 자코비안 하나 알아놨더니 손끝의 속도도 할 수 있어, 손끝의 힘도 할 수 있다. 자코비안이 쓸모가 제일 많아요. 여러분이 많이 쓸 거예요, 회사 가면."

---

## 10. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| \${}^if_i = {}^i_{i+1}R\\,{}^{i+1}f_{i+1}$ | 힘 전파 | 힘은 그대로 전달 (정적 평형) |
| \${}^in_i = {}^i_{i+1}R\\,{}^{i+1}n_{i+1} + {}^iP_{i+1}\\times{}^if_i$ | 토크 전파 | 모멘트 암 항 추가 |
| $\\tau_i = {}^in_i^{\\,T}\\,{}^i\\hat Z_i$ | 관절 액추에이터 토크 (회전 관절) | Z 성분만 모터가 담당, 나머지는 구조가 지지 |
| $\\tau = J^T\\mathcal{F}$ | 손끝 힘 → 관절 토크 | 역행렬·역기구학 불필요, 가상 일로 유도 |
| $J_{Pi} = \\hat z_{i-1}\\times(\\hat p_e-\\hat p_{i-1})$, $J_{Oi} = \\hat z_{i-1}$ | 기하학적 자코비안 열 (회전 관절) | $\\hat z, \\hat p$는 변환행렬에서 읽음 |
| $\\nu = \\begin{bmatrix}v\\\\\\omega\\end{bmatrix}$, $\\mathcal{F} = \\begin{bmatrix}F\\\\N\\end{bmatrix}$ | 일반화 속도/힘 ($6\\times1$) | 선속도+각속도 / 힘+토크 |
| \${}^B_AT_v$ | 속도 변환 ($6\\times6$, 원점 이동 포함) | $P\\times$ 반대칭 행렬 트릭 사용 |
| \${}^A_BT_f = {}^A_BT_v^{\\,T}$ | 힘-모멘트 변환 | 힘 센서 → 툴 끝 변환에서 사용 |

---

## 11. Python 실습 코드

기하학적 자코비안 공식을 2-링크 로봇에 적용해서, [5-2에서 유도한 해석적 자코비안](../jacobian-velocity-kinematics-link-propagation/main.md)과 일치하는지, 그리고 $\\tau = J^TF$가 [예제 5.7](#4-예제-57--2-링크-관절-토크와-자코비안-전치의-발견)의 폐형식과 일치하는지 확인한다.

\`\`\`python
import numpy as np

def dh_T(theta, l_prev):
    """2-링크 평면 로봇의 (i-1) -> (i) 변환: x방향 l_prev 이동 후 z축 theta 회전."""
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [c, -s, 0, l_prev],
        [s,  c, 0, 0],
        [0,  0, 1, 0],
        [0,  0, 0, 1],
    ])

def geometric_jacobian(l1, l2, th1, th2):
    """z x (p_e - p) 공식으로 기하학적 자코비안(선속도 3x2 부분) 조립."""
    T01 = dh_T(th1, 0.0)
    T02 = T01 @ dh_T(th2, l1)
    T03 = T02 @ dh_T(0.0, l2)       # 계 {3} = 손끝
    zs = [T01[:3, 2], T02[:3, 2]]   # 관절 1, 2의 회전축 (베이스 기준)
    ps = [T01[:3, 3], T02[:3, 3]]   # 관절 1, 2의 원점 (베이스 기준)
    pe = T03[:3, 3]                 # 손끝 위치
    return np.column_stack([np.cross(z, pe - p) for z, p in zip(zs, ps)])

def analytic_jacobian_0(l1, l2, th1, th2):
    """5-2에서 유도한 베이스 기준 2x2 자코비안 (비교용 정답)."""
    s1, c1 = np.sin(th1), np.cos(th1)
    s12, c12 = np.sin(th1 + th2), np.cos(th1 + th2)
    return np.array([
        [-l1*s1 - l2*s12, -l2*s12],
        [ l1*c1 + l2*c12,  l2*c12],
    ])

l1, l2 = 1.0, 0.8
th1, th2 = np.deg2rad(30), np.deg2rad(45)

# 1) 기하학적 조립 == 해석적 유도 확인 (x, y 행만 비교 — 평면 로봇)
Jg = geometric_jacobian(l1, l2, th1, th2)[:2]
Ja = analytic_jacobian_0(l1, l2, th1, th2)
print(np.allclose(Jg, Ja))   # True

# 2) tau = J^T F 가 예제 5.7 폐형식과 같은지 확인 (계 {3} 기준)
s2, c2 = np.sin(th2), np.cos(th2)
J3 = np.array([[l1*s2, 0.0], [l1*c2 + l2, l2]])
F3 = np.array([2.0, 5.0])                       # 손끝이 내야 하는 힘 (fx, fy)
tau = J3.T @ F3
tau_closed = np.array([l1*s2*F3[0] + (l2 + l1*c2)*F3[1], l2*F3[1]])
print(tau, np.allclose(tau, tau_closed))        # [8.9497... 4.] True
\`\`\`

주의할 점 하나 — 기하학적 공식의 $\\hat z_{i-1}, \\hat p_{i-1}$에서 첨자는 "관절 $i$의 축이 지나는 좌표계"를 뜻한다. 위 코드처럼 크레이그 관례(계 $\\{i\\}$가 관절 $i$에 붙음)로 프레임을 잡았다면 관절 $i$의 축·원점은 \${}^0_iT$에서 읽어야 한다. 프레임 관례가 어긋나면 회전 중심이 밀려서 자코비안이 통째로 틀린다.

### 연습 문제 (TODO)

\`\`\`python
def joint_torques_for_push(l1, l2, th1, th2, fx, fy):
    """손끝이 계 {3} 기준으로 (fx, fy) 힘을 내야 할 때 필요한 관절 토크를 구하라.

    TODO:
    - 계 {3} 기준 자코비안 J3를 만들어라 (위의 J3 참고)
    - tau = J3^T @ F 로 계산해서 반환하라
    """
    return None  # TODO


# 검증 1: th2=90도, l1=l2=1이면 J3=[[1,0],[1,1]] 이므로
#         F=(1,0) -> tau=(1,0), F=(0,1) -> tau=(1,1)이 나와야 한다
# 검증 2: 팔을 완전히 편 자세(th2=0)에서 F=(fx,0)이면 tau=(0,0) —
#         구조가 힘을 다 받아서 모터 토크가 필요 없다 (특이점의 힘 해석)
for F in [(1.0, 0.0), (0.0, 1.0)]:
    print(joint_torques_for_push(1.0, 1.0, 0.3, np.pi/2, *F))
print(joint_torques_for_push(1.0, 1.0, 0.3, 0.0, 1.0, 0.0))
\`\`\`

> [!TIP]
> **연습 문제 정답 보기**
> \`\`\`python
> def joint_torques_for_push(l1, l2, th1, th2, fx, fy):
>     s2, c2 = np.sin(th2), np.cos(th2)
>     J3 = np.array([[l1*s2, 0.0], [l1*c2 + l2, l2]])
>     return J3.T @ np.array([fx, fy])
>
>
> for F in [(1.0, 0.0), (0.0, 1.0)]:
>     print(joint_torques_for_push(1.0, 1.0, 0.3, np.pi/2, *F))
> print(joint_torques_for_push(1.0, 1.0, 0.3, 0.0, 1.0, 0.0))
> # [1. 0.]  /  [1. 1.]  /  [0. 0.]  <- 팔을 편 자세에선 x방향 힘에 토크가 안 든다
> \`\`\`

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 힘·토크 전파 | \${}^if_i = {}^i_{i+1}R\\,{}^{i+1}f_{i+1}$, \${}^in_i = {}^i_{i+1}R\\,{}^{i+1}n_{i+1} + {}^iP_{i+1}\\times{}^if_i$ — **손끝에서 베이스 방향으로** 순차 계산 (속도와 반대: 아는 쪽이 손끝이므로) |
| 관절 토크 추출 | $\\tau_i = {}^in_i^{\\,T}\\,{}^i\\hat Z_i$ — 모터는 Z축 토크만 내고, X·Y 성분은 기구 구조가 지지 |
| 예제 5.7의 발견 | 2-링크에서 $\\tau$ 계수 행렬 = \${}^3J^T(\\Theta)$ — 속도의 자코비안과 전치 관계 |
| 가상 일 유도 | 일은 스칼라(좌표계 무관): $\\mathcal{F}^T\\delta\\chi = \\tau^T\\delta\\Theta$, $\\delta\\chi = J\\delta\\Theta$ 대입 → $\\tau = J^T\\mathcal{F}$ |
| 힘 제어의 미덕 | 역행렬도 역기구학도 없이 전치 한 번 — 연산이 압도적으로 싸다 |
| 특이점의 힘 해석 | 특이 자세 근처에선 큰 손끝 힘이 '작은' 관절 토크로 나타남 (구조가 받아줌) |
| 기하학적 자코비안 | 회전 관절: $J_{Pi} = \\hat z_{i-1}\\times(\\hat p_e-\\hat p_{i-1})$, $J_{Oi} = \\hat z_{i-1}$ / 직동: $(\\hat z_{i-1}, 0)$ — 전부 변환행렬에서 **읽어서** 조립 |
| 자코비안의 본질 | $J(\\Theta)$는 자세의 함수 — 로봇이 움직이면 제어 주기마다 재계산 (프로그램으로) |
| 속도/힘 좌표 변환 | \${}^B_AT_v$ ($6\\times6$, $P\\times$ 반대칭 행렬 트릭), \${}^A_BT_f = {}^A_BT_v^{\\,T}$ — 힘 센서(손목) → 툴 끝 변환에서만 실질 사용 |
| 5장 총결 | 자코비안 하나로: 속도 제어($v = J\\dot\\Theta$) + 정적 힘 제어($\\tau = J^T\\mathcal{F}$) — "여러분이 많이 쓸 거예요, 회사 가면" |
`,

  'Robotics/jacobian-velocity-kinematics-link-propagation': `---
title: 자코비안 속도 — 링크 선속도 전파와 2-링크 예제, 자코비안 정의 (Jacobian Velocity Kinematics)
date: 2026-08-08
tags: jacobian, velocity
order: 
featured: false
draft: false
---

# 자코비안 속도 — 링크 선속도 전파와 2-링크 예제, 자코비안 정의 (Jacobian Velocity Kinematics)

> 출처: 로봇제어공학 — Introduction to Robotics 5장 "자코비안: 속도와 static forces" (중반부)
> 영상: https://www.youtube.com/watch?v=OdND4ML0WtY&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=12
> 대상: [5-1](../jacobian-velocity-kinematics/main.md)에서 유도한 "두 좌표계 사이 점의 속도 공식"과 "링크 각속도 전파 공식"을 알고 있는 상태에서 이어본다. **이 노트는 링크 선속도 전파 → 2-링크 평면 로봇 예제 → 자코비안의 일반적 정의까지 다룬다.** static forces(정적인 힘, 6장)는 이 영상에서도 다뤄지지 않는다 — 영상은 자코비안 정의 도입부(관절 속도 → 손끝 속도의 계수 행렬을 뽑아내는 과정)에서 끝난다.

---

## 목차

1. [지난 시간 복습](#1-지난-시간-복습--점의-속도-공식과-각속도-전파)
2. [링크 선속도 전파 공식](#2-링크에서-링크로--선속도-전파-공식)
3. [프리즘 관절의 경우](#3-프리즘-관절prismatic-joint의-경우)
4. [왜 순차적으로 계산하는가](#4-왜-베이스부터-순차적으로-계산하는가)
5. [2-링크 평면 로봇 예제](#5-2-링크-평면-로봇-예제--손끝-속도-구하기)
6. [좌표계 3 → 베이스(0) 변환](#6-좌표계-3-기준을-베이스0-기준으로-변환)
7. [자코비안의 일반적 정의](#7-자코비안이란-무엇인가--일반적-정의)
8. [로봇 자코비안](#8-로봇-자코비안--관절-속도에서-손끝-속도로)
9. [2-링크 예제의 자코비안 완성](#9-2-링크-예제의-자코비안-완성)
10. [표기법 비교표](#10-표기법-비교표)
11. [Python 실습 코드](#11-python-실습-코드)
12. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 지난 시간 복습 — 점의 속도 공식과 각속도 전파

[5-1](../jacobian-velocity-kinematics/main.md)에서 두 좌표계 A, B와 B에 속한 점 Q에 대해 다음 공식을 유도했다.

$\${}^{A}v_{Q} = {}^{A}v_{B_{org}} + {}^{A}_{B}R\\cdot{}^{B}v_{Q} + {}^{A}\\omega_{B} \\times {}^{A}_{B}R\\cdot{}^{B}Q$$

기차(B) 안에서 사람(Q)이 걸어 다니는 예시로 설명했던 식이다 — 기차 원점 자체의 이동(1항) + 기차 안에서 사람이 걷는 속도(2항) + 기차가 돌아서 사람이 함께 도는 것처럼 보이는 효과(3항)를 더한 것.

이 식을 로봇 팔의 **인접한 두 링크(i, i+1)** 사이에 적용하면 [5-1 9절](../jacobian-velocity-kinematics/main.md)에서 각속도 전파 공식이 나왔다.

$$\\boxed{{}^{i+1}\\omega_{i+1} = {}^{i+1}_{i}R \\cdot {}^{i}\\omega_{i} + \\dot\\theta_{i+1}\\cdot {}^{i+1}\\hat{Z}_{i+1}}$$

- \${}^{i}\\omega_{i}$, \${}^{i}v_{i}$: [DH 컨벤션](../denavit-hartenberg-parameters/main.md)으로 정의된 좌표계 i(=관절 i에 붙은 좌표계) 원점의, **좌표계 i 자신을 기준으로 표현한** 각속도·선속도.
- \${}^{i+1}_{i}R$: 좌표계 i에서 좌표계 i+1로의 회전행렬 — [정기구학 변환 행렬](../forward-kinematics/main.md)에서 이미 구해 놓은 값을 그대로 재사용한다.
- \${}^{i+1}\\hat{Z}_{i+1}$: 좌표계 i+1의 Z축 방향 단위벡터. DH 컨벤션이 항상 관절 회전축을 Z축으로 잡기 때문에, 새 관절이 만드는 회전은 항상 $\\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1} = {}^{i+1}\\begin{bmatrix}0\\\\0\\\\\\dot\\theta_{i+1}\\end{bmatrix}$로 간단히 쓸 수 있다.

**유도 아이디어(복습)**: 먼저 좌표계 i 기준으로 "i의 각속도 + i+1 관절이 새로 만드는 회전을 i 기준으로 옮긴 것"을 더해 \${}^i\\omega_{i+1} = {}^i\\omega_i + {}^i_{i+1}R\\,\\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$을 쓴 다음, 양변에 \${}^{i+1}_iR$을 곱하면 우변 첫 항의 \${}^{i+1}_iR\\cdot{}^i_{i+1}R$이 서로 상쇄되어(회전을 갔다가 다시 반대로 온 것과 같음) 위 박스 식이 남는다.

> **기억**: 박스 공식 자체(꼭 암기). **이해**: 회전행렬 두 개가 서로 역행렬 관계라서 상쇄된다는 것.

---

## 2. 링크에서 링크로 — 선속도 전파 공식

각속도를 끝냈으니 이번 영상의 핵심인 **선속도 전파**로 넘어간다. 접근 방식은 각속도 때와 완전히 같다 — [1절](#1-지난-시간-복습--점의-속도-공식과-각속도-전파)의 일반 점 속도 공식을 다시 쓰되, 이번엔 Q 자리에 "좌표계 i+1의 원점"을 넣는다.

### 왜 항이 하나 줄어드는가

일반 공식의 2항 \${}^{A}_{B}R\\cdot{}^{B}v_{Q}$는 "Q가 B 좌표계 안에서도 스스로 움직이는 속도"였다. 그런데 좌표계 i+1의 원점은 **좌표계 i 안에서 위치가 고정된 점**이다 — 링크 길이·비틀림 각도(DH 파라미터의 a, α, d)는 죄다 상수이고, 유일하게 변하는 건 관절 각도 θ뿐이기 때문이다. 즉 \${}^{i}P_{i+1}$은 좌표계 i 기준에서 절대 변하지 않는 상수 벡터이므로, 그 항은 0이 되어 사라진다.

$\${}^{i}v_{i+1} = {}^{i}v_{i} + {}^{i}\\omega_{i} \\times {}^{i}P_{i+1}$$

| 항 | 의미 |
|---|---|
| \${}^{i}v_{i}$ | 이전 링크(i) 원점 자체의 이동 속도 — 그대로 물려받음 |
| \${}^{i}\\omega_{i} \\times {}^{i}P_{i+1}$ | 링크 i가 회전하고 있어서, 그 위에 고정된 점(i+1 원점)이 함께 원운동하며 생기는 속도. 반지름 × 각속도 형태의 외적(cross product) |

이 외적 항의 형태는 원운동의 기본식 $v = R\\omega$(반지름 × 각속도)를 3차원 벡터로 확장한 것과 같다. 다만 왜 **정확히 외적**이어야 하는지는 [5-1 5절](../jacobian-velocity-kinematics/main.md)의 기하학적 유도(부채꼴·호의 길이)에서 이미 다뤘다 — 회전축에서 벗어난 수직 성분만 원운동에 기여하기 때문에 $|a||b|\\sin\\theta$ 형태가 나오고, 이게 곧 외적의 정의다.

### 좌표계 i+1 기준으로 옮기기

각속도 때와 똑같이 양변에 \${}^{i+1}_iR$을 곱한다. 이번엔 우변에 인버스로 상쇄되는 항이 없어서(좌변 전체에 그냥 곱해질 뿐) 각속도 유도처럼 깔끔하게 정리되지는 않지만, 결과식 자체는 그대로 유효하다.

$$\\boxed{{}^{i+1}v_{i+1} = {}^{i+1}_{i}R\\,\\bigl({}^{i}v_{i} + {}^{i}\\omega_{i} \\times {}^{i}P_{i+1}\\bigr)}$$

> **기억할 필요 없음**: 굳이 우변을 항별로 다시 전개하는 것. **꼭 기억**: 위 박스 공식 하나로 끝난다는 것.

> 이 두 박스 공식(각속도·선속도 전파)이 **5장 앞부분(위치·속도의 좌표 변환 이론)이 왜 필요했는지의 최종 결론**이다 — 실제 로봇 팔 계산에 쓰이는 건 결국 이 두 줄이다.

**실무 포인트**: 이 두 공식이 바로 \`KDL\`, \`MoveIt\` 같은 로봇 미들웨어가 자코비안을 수치적으로 계산할 때 관절마다 순서대로 적용하는 재귀식이다.

---

## 3. 프리즘 관절(prismatic joint)의 경우

지금까지는 [회전 관절(revolute joint)](../denavit-hartenberg-parameters/main.md)만 다뤘다. 프리즘 관절(관절이 미끄러지며 늘어나는 경우, θ 대신 d가 변수)은 별도 유도 없이 결과만 제시된다 — 회전 관절과 달리 자체 회전이 없으므로 각속도 식에는 항이 추가되지 않고, 선속도 식에만 관절이 뻗어나가는 속도 항이 더해진다.

$\${}^{i+1}\\omega_{i+1} = {}^{i+1}_{i}R\\,{}^{i}\\omega_{i}$$
$\${}^{i+1}v_{i+1} = {}^{i+1}_{i}R\\,\\bigl({}^{i}v_{i} + {}^{i}\\omega_{i} \\times {}^{i}P_{i+1}\\bigr) + \\dot d_{i+1}\\,{}^{i+1}\\hat{Z}_{i+1}$$

> **이해**: 프리즘 관절은 "돌지 않고 밀려나기만" 하므로, 각속도 전파에는 기여가 없고(회전 관절의 $\\dot\\theta_{i+1}\\hat Z_{i+1}$ 항이 통째로 빠짐) 선속도 전파에만 $\\dot d_{i+1}\\hat Z_{i+1}$가 그대로 더해진다.
> **기억할 필요 없음**: 이 절 자체 — 강의도 유도 없이 결과만 제시했고, 대부분의 로봇은 회전 관절 위주라 이후 예제에서도 회전 관절만 다룬다.

---

## 4. 왜 베이스부터 순차적으로 계산하는가

매니퓰레이터는 링크-조인트-링크로 이어진 **체인(chain)** 구조다. 각 링크는 바로 이웃한 링크에 대해서만 상대운동을 할 수 있고, 베이스(고정된 좌표계 0, 속도는 항상 0)부터 손끝(N)까지 속도가 **순차적으로 누적 전파**된다.

막대기 하나(링크 1개, 관절 1개)로 단순화해서 생각해보면 직관적이다 — 손끝 선속도는 그냥 $v = r\\omega$이고, 여기서 $\\omega$는 관절이 도는 각속도(θ̇)다. 관절이 여러 개로 늘어나면, 손끝은 "모든 이전 관절이 만든 속도"에 "자신이 회전해서 추가하는 속도"를 계속 더해가는 구조가 된다.

- **각속도**: 다음 관절 각속도는 이전 관절 각속도 + 자신의 회전속도(회전 관절만 해당) — 항상 더해진다.
- **선속도**: 다음 관절 선속도는 이전 관절 선속도 + 이전 링크가 회전하며 만드는 추가 속도(외적 항) — 프리즘 관절이면 자신의 뻗어나가는 속도까지 더해진다.

> "머니플레이터는 물체의 연쇄로 되어 있다 ... 링크가 이렇게 쭉 ... 체인처럼 되어 있다. ... 이러한 구조 때문에 ... 순차적으로 그 속도가 그 다음 링크에게 영향을 줘요."

**실무 포인트**: [4장까지의 역기구학](../inverse-kinematics-puma560-closed-form/main.md)은 폐형식(closed-form)으로 한 번에 풀렸지만, 속도는 링크 간 관계로만 순차적으로 풀 수 있다 — 이게 [5-1 1절](../jacobian-velocity-kinematics/main.md)에서 예고했던 "5·6장부터는 폐형식이 거의 불가능하다"는 말의 구체적인 이유다.

---

## 5. 2-링크 평면 로봇 예제 — 손끝 속도 구하기

> **예제 5.3**: 회전 관절을 갖는 2-링크 매니퓰레이터. 관절 1(θ₁)이 길이 $l_1$인 링크 1을 돌리고, 관절 2(θ₂)가 링크 1 끝에서 길이 $l_2$인 링크 2를 돌린다. 손끝(좌표계 3)은 관절이 아니라 그냥 링크 2 끝에 붙인 표시 좌표계 — 스스로 회전하지 않는다($\\dot\\theta_3 = 0$). 좌표계는 [DH 컨벤션](../denavit-hartenberg-parameters/main.md) 그대로 배치: 각 좌표계의 Z축은 지면에서 튀어나오는 방향(회전축), X축은 다음 링크 방향.

DH 파라미터에서 나오는 변환 행렬의 회전·병진 성분을 그대로 재사용한다.

| 구간 | 회전행렬 \${}^{i}_{i+1}R$ | 병진벡터 \${}^{i}P_{i+1}$ |
|---|---|---|
| 0→1 | $\\begin{bmatrix}c_1&-s_1&0\\\\s_1&c_1&0\\\\0&0&1\\end{bmatrix}$ | $(0,0,0)$ |
| 1→2 | $\\begin{bmatrix}c_2&-s_2&0\\\\s_2&c_2&0\\\\0&0&1\\end{bmatrix}$ | $(l_1,0,0)$ |
| 2→3 | $I$ (회전 없음) | $(l_2,0,0)$ |

($c_i=\\cos\\theta_i$, $s_i=\\sin\\theta_i$ 표기. 좌표계 3은 회전이 없으므로 \${}^2_3R=I$.)

### 관절 1 → 좌표계 1

베이스는 고정(\${}^0\\omega_0={}^0v_0=0$)이므로 [각속도 전파식](#1-지난-시간-복습--점의-속도-공식과-각속도-전파)에 바로 대입한다.

$\${}^{1}\\omega_{1} = {}^{1}_{0}R\\cdot{}^{0}\\omega_{0} + \\dot\\theta_1\\,{}^1\\hat Z_1 = (0,0,\\dot\\theta_1)$$
$\${}^{1}v_{1} = {}^{1}_{0}R\\,({}^{0}v_{0} + {}^{0}\\omega_{0}\\times{}^{0}P_{1}) = 0$$

### 관절 2 → 좌표계 2

$\${}^{2}\\omega_{2} = {}^{2}_{1}R\\cdot{}^{1}\\omega_{1} + \\dot\\theta_2\\,{}^2\\hat Z_2 = (0,0,\\dot\\theta_1) + (0,0,\\dot\\theta_2) = (0,0,\\dot\\theta_1+\\dot\\theta_2)$$

(Z축 기준 회전행렬을 Z축 성분에 곱해도 값이 바뀌지 않으므로 \${}^2_1R\\cdot(0,0,\\dot\\theta_1)^T = (0,0,\\dot\\theta_1)^T$ — 여기서부터 θ̇1과 θ̇2가 그냥 더해지기 시작한다.)

선속도는 [외적 항](#2-링크에서-링크로--선속도-전파-공식)을 실제로 계산해야 한다. \${}^1\\omega_1\\times{}^1P_2$를 행렬식(determinant) 형태로 풀면:

$\${}^1\\omega_1\\times{}^1P_2=\\begin{vmatrix}\\hat x&\\hat y&\\hat z\\\\0&0&\\dot\\theta_1\\\\l_1&0&0\\end{vmatrix} = \\hat x(0\\cdot0-\\dot\\theta_1\\cdot0) - \\hat y(0\\cdot0-\\dot\\theta_1\\cdot l_1) + \\hat z(0\\cdot0-0\\cdot l_1) = (0,\\ l_1\\dot\\theta_1,\\ 0)$$

$\${}^{2}v_{2} = {}^{2}_{1}R\\,({}^{1}v_{1} + {}^{1}\\omega_{1}\\times{}^{1}P_{2}) = {}^2_1R\\cdot(0,l_1\\dot\\theta_1,0) = (l_1s_2\\dot\\theta_1,\\ l_1c_2\\dot\\theta_1,\\ 0)$$

> 강의에서는 이 외적 계산을 왜 정확히 이 형태(행렬식으로 전개하는 방식)로 하는지 "그 자체가 왜 벡터 외적인지는 솔직히 말해서 나도 디테일하게 보지는 않아... 조금 유도를 한번 해봐야 되겠어"라고 짚었다 — [2절](#2-링크에서-링크로--선속도-전파-공식)에서 설명했듯 기하학적 유도(반지름 × 각속도)로 이미 답은 알고 있지만, 행렬식 표현 자체의 정당성은 넘어간 부분이다. **결과 공식은 신뢰하고 쓰되, 계산 방법(행렬식 전개)은 외적의 정의 그 자체이므로 도구(NumPy \`np.cross\`)에 맡기면 된다.**

### 관절 3(가상) → 좌표계 3 (손끝)

좌표계 3은 회전하지 않으므로($\\dot\\theta_3=0$, \${}^2_3R=I$):

$\${}^{3}\\omega_{3} = {}^{3}_{2}R\\cdot{}^{2}\\omega_{2} = (0,0,\\dot\\theta_1+\\dot\\theta_2)$$

$\${}^2\\omega_2\\times{}^2P_3 = (0,0,\\dot\\theta_1+\\dot\\theta_2)\\times(l_2,0,0) = (0,\\ l_2(\\dot\\theta_1+\\dot\\theta_2),\\ 0)$$

$$\\boxed{{}^{3}v_{3} = \\begin{bmatrix}l_1s_2\\dot\\theta_1\\\\ l_1c_2\\dot\\theta_1+l_2(\\dot\\theta_1+\\dot\\theta_2)\\\\ 0\\end{bmatrix}}$$

여기까지가 [1·2절](#1-지난-시간-복습--점의-속도-공식과-각속도-전파)의 전파 공식 두 줄만으로 손끝(좌표계 3 자신 기준) 속도를 구한 것이다.

---

## 6. 좌표계 3 기준을 베이스(0) 기준으로 변환

\${}^3\\omega_3$, \${}^3v_3$은 **좌표계 3 자신을 기준으로 본** 값이다. 하지만 실제로 궁금한 건 로봇 밖에서(고정된 베이스 좌표계 0 기준으로) 손끝이 얼마나 빠르게 움직이는가다.

> "실제 궁금한 건 내가 여러분 밖에서 볼 거 아니야. 어떻게 움직이냐, 손끝이. ... 여러분은 기저에 가깝지. 여러분 밖에 있으니까."

다행히 이건 새로운 유도가 필요 없다 — [기존 좌표 변환 규칙](../transformation-matrix/main.md)대로 회전행렬만 곱하면 된다.

$\${}^{0}v_{3} = {}^{0}_{3}R\\cdot{}^{3}v_{3}, \\qquad {}^{0}\\omega_{3} = {}^{0}_{3}R\\cdot{}^{3}\\omega_{3}$$

\${}^0_3R$은 세 구간의 회전행렬을 순서대로 곱해서 구한다: \${}^0_3R = {}^0_1R\\cdot{}^1_2R\\cdot{}^2_3R$. 세 회전 모두 Z축 기준 회전이므로 합성하면 그냥 $(\\theta_1+\\theta_2)$만큼 Z축으로 돈 회전행렬이 된다. $c_{12}=\\cos(\\theta_1+\\theta_2)$, $s_{12}=\\sin(\\theta_1+\\theta_2)$로 표기하면:

$$\\boxed{{}^{0}v_{3} = \\begin{bmatrix}-l_1s_1\\dot\\theta_1-l_2s_{12}(\\dot\\theta_1+\\dot\\theta_2)\\\\ l_1c_1\\dot\\theta_1+l_2c_{12}(\\dot\\theta_1+\\dot\\theta_2)\\\\ 0\\end{bmatrix}}$$

x, y 각 성분은 "베이스 좌표계에서 본, 손끝이 x방향/y방향으로 움직이는 속도"라는 물리적 의미를 그대로 갖는다 — 평면 로봇이라 z방향 속도는 항상 0이다.

**실무 포인트**: 좌표계 3(엔드이펙터) 기준 속도와 좌표계 0(베이스) 기준 속도 중, 로봇 밖의 관찰자·제어 시스템이 실제로 쓰는 값은 거의 항상 \${}^0v_3$, \${}^0\\omega_3$ 쪽이다 — ROS2에서 \`base_link\` 프레임 기준 \`geometry_msgs/Twist\`를 다루는 것과 같은 이유다.

---

## 7. 자코비안이란 무엇인가 — 일반적 정의

> "자코비안은 로봇공학에만 쓰는 거 아니에요. 이거 수학에서 엄청 많이 쓰는 거야. 다른 분야, 여러 분야에 다 써요."

여기서부터는 로봇과 무관하게 **일반적인 수학 개념**으로 시작한다. 6개의 함수 $y_1,\\dots,y_6$이 각각 6개의 독립변수 $x_1,\\dots,x_6$의 함수라고 하자.

$$y_1=f_1(x_1,\\dots,x_6),\\ \\ y_2=f_2(x_1,\\dots,x_6),\\ \\dots,\\ y_6=f_6(x_1,\\dots,x_6)$$

벡터로 묶어서 표현하면 $Y=F(X)$. 이렇게 벡터 표기로 쓰면 함수·변수 개수가 6개가 아니라 몇 개든 상관없이 일반적으로 쓸 수 있다는 장점이 있다.

### 미소 변화의 관계 — 편미분 행렬

1변수 함수 $y=f(x)$에서 $x$가 아주 조금($\\Delta x$) 바뀔 때 $y$의 변화량은 기울기(미분값) × $\\Delta x$였다: $\\Delta y \\approx \\frac{df}{dx}\\Delta x$. 변수와 함수가 여러 개로 늘어나면, $y_1$의 변화는 "$x_1$ 방향 기울기 × $x_1$의 변화 + $x_2$ 방향 기울기 × $x_2$의 변화 + ..."를 다 더한 것이 된다 — 이게 **편미분(partial derivative)** 이다.

$$\\delta y_1 = \\frac{\\partial f_1}{\\partial x_1}\\delta x_1 + \\frac{\\partial f_1}{\\partial x_2}\\delta x_2 + \\cdots + \\frac{\\partial f_1}{\\partial x_6}\\delta x_6$$

이런 식이 $y_1$부터 $y_6$까지 6개가 생기고, 이를 행렬-벡터 곱으로 묶으면:

$$\\delta Y = \\begin{bmatrix}\\frac{\\partial f_1}{\\partial x_1}&\\cdots&\\frac{\\partial f_1}{\\partial x_6}\\\\ \\vdots&\\ddots&\\vdots\\\\ \\frac{\\partial f_6}{\\partial x_1}&\\cdots&\\frac{\\partial f_6}{\\partial x_6}\\end{bmatrix}\\delta X$$

$$\\boxed{\\delta Y = J\\,\\delta X}$$

이 편미분들로 이루어진 행렬 $J$가 바로 **자코비안(Jacobian)** 이다. $\\delta$를 극한으로 보내면 $\\dot Y = J\\dot X$로도 쓸 수 있다.

### 자코비안도 X의 함수다

편미분을 해도 나머지 변수들은 그대로 남아있다 (예: $y=x^2$이면 $y'=2x$ — 기울기 자체가 $x$의 함수). 마찬가지로 $J$의 각 성분도 $X$(다른 변수들)의 함수로 남아있다. 즉 **자코비안은 상수 행렬이 아니라 현재 위치(X)에 따라 값이 달라지는 행렬**이다 — 로봇 팔이면 "현재 관절 각도"에 따라 자코비안 값 자체가 바뀐다는 뜻이다.

> **이해**: 편미분 행렬이라는 정의, 그리고 $J$가 $X$에 종속된다는 것. **기억할 필요 없음**: 이 절 자체는 순수 수학 정의라 로봇과 직접 연결되는 부분(다음 절)만 기억하면 된다.

---

## 8. 로봇 자코비안 — 관절 속도에서 손끝 속도로

[일반 자코비안](#7-자코비안이란-무엇인가--일반적-정의)의 $\\dot Y = J\\dot X$ 형태를, 우리가 [6절](#6-좌표계-3-기준을-베이스0-기준으로-변환)까지 구한 결과에 그대로 대응시킨다.

- $\\dot X$ 자리 → 관절 각속도 벡터 $\\dot\\Theta = (\\dot\\theta_1,\\dots,\\dot\\theta_n)$ (내가 조절하는 변수)
- $\\dot Y$ 자리 → 손끝의 직교좌표계 속도 $v$ (내가 알고 싶은 결과)

$$\\boxed{{}^{0}v = {}^{0}J(\\Theta)\\,\\dot\\Theta}$$

로봇공학 분야에서 자코비안은 일반적으로 **관절 속도를 직교좌표계(엔드이펙터) 속도로 표현시키는 행렬**을 말한다. 6관절 로봇이면 자코비안은 6×6, $\\Theta$는 6×1, $v$도 6×1이다. 이 6×1 속도벡터는 3×1 선속도 벡터와 3×1 각속도 벡터를 위아래로 합친 것이다.

$\${}^{0}v = \\begin{bmatrix}{}^{0}v\\\\{}^{0}\\omega\\end{bmatrix}$$

**자코비안의 행렬 크기(shape)는 로봇 구조에 따라 임의로 정해질 수 있다.**

- **행(row) 수** = 고려 중인 직교좌표 공간의 자유도 수. 평면 팔이라 z방향 속도·롤·피치가 의미 없으면 행을 줄일 수 있다(x, y, 그리고 필요하면 z축 각속도만).
- **열(column) 수** = 매니퓰레이터 관절 수. 평면 팔은 3행이면 충분하지만, 과다구동(redundant) 평면 매니퓰레이터라면 관절마다 1개씩 임의의 열 수를 가질 수 있다.

> "자코비안만 알면 ... 여기서부터 순차적으로 구해야 된다고 했잖아요. 자코비안을 구하면 한 번에 구할 수 있어요. 물론 웃긴 게 자코비안도 그것도 순차적으로 구하긴 하지만."

즉 [4절](#4-왜-베이스부터-순차적으로-계산하는가)에서 본 순차적 전파(\${}^i\\omega_i, {}^iv_i$를 링크마다 계산)의 최종 결과물을 정리한 것이 자코비안이다 — 계산 방식 자체가 사라지는 게 아니라, **결과를 관절 속도의 계수 행렬 형태로 깔끔하게 담아내는 것**이 자코비안 개념의 가치다.

**실무 포인트**: \`pytorch_kinematics\`, \`KDL\` 같은 라이브러리의 \`jacobian()\` 함수가 정확히 이 계산(관절별 전파 → 계수 행렬 추출)을 자동화한 것이다. ROS2에서 자코비안은 힘 제어·특이점(singularity) 판별·역기구학의 뉴턴-랩슨 반복 등에 광범위하게 쓰인다.

---

## 9. 2-링크 예제의 자코비안 완성

[5절](#5-2-링크-평면-로봇-예제--손끝-속도-구하기)에서 구한 \${}^3v_3$, [6절](#6-좌표계-3-기준을-베이스0-기준으로-변환)의 \${}^0v_3$은 $\\dot\\theta_1, \\dot\\theta_2$가 뒤섞여 있는 형태다. 이걸 계수별로 묶어서 행렬-벡터 곱 형태로 쪼개면 자코비안이 나온다.

$\${}^3v_3=\\begin{bmatrix}l_1s_2\\dot\\theta_1\\\\ l_1c_2\\dot\\theta_1+l_2(\\dot\\theta_1+\\dot\\theta_2)\\\\0\\end{bmatrix}$$을 $\\dot\\theta_1$, $\\dot\\theta_2$ 항으로 묶으면:

- 1행: $l_1s_2\\dot\\theta_1 + 0\\cdot\\dot\\theta_2$
- 2행: $(l_1c_2+l_2)\\dot\\theta_1 + l_2\\dot\\theta_2$

z 성분(항상 0, 평면 로봇이라 의미 없음)을 빼고 x, y 성분만 남기면 2×2 자코비안:

$\${}^3v_3 = {}^3J(\\Theta)\\,\\dot\\Theta, \\qquad {}^{3}J(\\Theta) = \\begin{bmatrix}l_1s_2 & 0\\\\ l_1c_2+l_2 & l_2\\end{bmatrix}$$

같은 방식으로 \${}^0v_3$도 묶으면:

$\${}^{0}J(\\Theta) = \\begin{bmatrix}-l_1s_1-l_2s_{12} & -l_2s_{12}\\\\ l_1c_1+l_2c_{12} & l_2c_{12}\\end{bmatrix}$$

이 2×2 자코비안은 각속도를 빼고 x, y 방향 선속도만 고려한 것이다. 각속도(\${}^3\\omega_3=\\dot\\theta_1+\\dot\\theta_2$)까지 포함하면 3행짜리 자코비안이 된다 — 세 번째 행은 그냥 $[1,\\ 1]$이다(θ̇1, θ̇2 둘 다 계수 1로 그대로 더해지므로).

$\${}^3v_3 = {}^3J(\\Theta)\\dot\\Theta,\\qquad \\begin{bmatrix}l_1s_2\\dot\\theta_1\\\\ l_1c_2\\dot\\theta_1+l_2(\\dot\\theta_1+\\dot\\theta_2)\\\\ \\dot\\theta_1+\\dot\\theta_2\\end{bmatrix} = \\begin{bmatrix}l_1s_2 & 0\\\\ l_1c_2+l_2 & l_2\\\\ 1 & 1\\end{bmatrix}\\begin{bmatrix}\\dot\\theta_1\\\\\\dot\\theta_2\\end{bmatrix}$$

> **기억할 필요 없음**: $l_1, l_2, \\theta_1, \\theta_2$가 구체적으로 어떻게 배열되는지 암기하는 것 — 예제마다 로봇 형태가 다르므로 매번 [5·6절](#5-2-링크-평면-로봇-예제--손끝-속도-구하기)의 전파 과정을 거쳐 유도해야 한다.
> **꼭 기억**: 자코비안은 "속도 공식에서 θ̇ 항들을 계수별로 묶어낸 행렬"이라는 절차 자체.

---

## 10. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| \${}^{i+1}\\omega_{i+1} = {}^{i+1}_iR\\,{}^i\\omega_i + \\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$ | 링크 각속도 전파 (복습) | 회전 관절 기준 |
| \${}^{i+1}v_{i+1} = {}^{i+1}_iR\\,({}^iv_i + {}^i\\omega_i\\times{}^iP_{i+1})$ | 링크 선속도 전파 (신규) | 회전 관절 기준, \${}^iP_{i+1}$은 프레임 i에서 상수 |
| $\\dot d_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$ | 프리즘 관절이 선속도 식에 추가하는 항 | 각속도 식에는 추가 항 없음 |
| \${}^iP_{i+1}$ | \${}^i_{i+1}T$의 병진 성분 | DH 변환 행렬에서 그대로 재사용 |
| $Y=F(X)$, $\\delta Y = J\\,\\delta X$ | 자코비안의 일반(수학적) 정의 | $J$는 편미분 행렬, $X$의 함수 |
| \${}^0v = {}^0J(\\Theta)\\,\\dot\\Theta$ | 로봇 자코비안 | 행 = 직교좌표 자유도, 열 = 관절 수 |
| \${}^0v = \\begin{bmatrix}{}^0v\\\\{}^0\\omega\\end{bmatrix}$ | 6×1 속도 벡터 | 선속도 3 + 각속도 3 |

---

## 11. Python 실습 코드

\`\`\`python
import numpy as np

def rot_z(theta):
    """Z축 기준 회전행렬. DH 컨벤션에서 관절 회전축은 항상 Z축이므로
    인접 좌표계 사이의 i_R_{i+1} 은 항상 이 형태다."""
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [c, -s, 0.0],
        [s,  c, 0.0],
        [0.0, 0.0, 1.0],
    ])


def propagate_2link_velocity(theta1, theta2, theta1_dot, theta2_dot, l1, l2):
    """2-링크 평면 RR 로봇의 속도를 베이스(0)에서 손끝(3)까지 5-2 1·2절의
    전파 공식으로 순차 계산한다. 좌표계 3은 회전하지 않는 가상 손끝 프레임.

    반환: omega_list, v_list — 인덱스 0~3, 각각 "자기 자신의 프레임" 기준 표현.
    """
    R01 = rot_z(theta1)
    R12 = rot_z(theta2)
    R23 = np.eye(3)

    # i+1_i R = (i_{i+1}R)^T  (회전행렬의 인버스 = 트랜스포즈)
    R10, R21, R32 = R01.T, R12.T, R23.T

    P01 = np.array([0.0, 0.0, 0.0])   # 0P1
    P12 = np.array([l1, 0.0, 0.0])    # 1P2
    P23 = np.array([l2, 0.0, 0.0])    # 2P3

    Rs = [R10, R21, R32]
    Ps = [P01, P12, P23]
    theta_dots = [theta1_dot, theta2_dot, 0.0]  # 손끝(가상 관절 3)은 회전 안 함

    omega = [np.zeros(3)]  # 0omega0 (베이스 고정)
    v = [np.zeros(3)]      # 0v0

    for i in range(3):
        R_next_i = Rs[i]
        P_i_next = Ps[i]
        thd = theta_dots[i]
        Z_next = np.array([0.0, 0.0, 1.0])

        w_i, v_i = omega[i], v[i]

        w_next = R_next_i @ w_i + thd * Z_next
        v_next = R_next_i @ (v_i + np.cross(w_i, P_i_next))

        omega.append(w_next)
        v.append(v_next)

    return omega, v  # [0], [1], [2], [3]


# --- 검증: 5절에서 손으로 구한 3v3, 3omega3와 비교 ---
l1, l2 = 1.0, 0.8
th1, th2 = np.deg2rad(30), np.deg2rad(45)
thd1, thd2 = 0.5, 0.3  # rad/s

omega, v = propagate_2link_velocity(th1, th2, thd1, thd2, l1, l2)
omega_3, v_3 = omega[3], v[3]

# 손으로 구한 닫힌 형태(5절)와 비교
c2, s2 = np.cos(th2), np.sin(th2)
v3_closed = np.array([
    l1 * s2 * thd1,
    l1 * c2 * thd1 + l2 * (thd1 + thd2),
    0.0,
])
omega3_closed = np.array([0.0, 0.0, thd1 + thd2])

print("3v3 (전파):", v_3, " | (닫힌 형태):", v3_closed)
print("3omega3 (전파):", omega_3, " | (닫힌 형태):", omega3_closed)
assert np.allclose(v_3, v3_closed)
assert np.allclose(omega_3, omega3_closed)
\`\`\`

### 연습 문제 (TODO)

\`\`\`python
def base_frame_velocity(theta1, theta2, omega_3, v_3):
    """6절: 좌표계 3 기준 속도를 베이스(0) 기준으로 변환하라.

    TODO:
    - R03: 0_1R @ 1_2R @ 2_3R 을 구하라 (rot_z 재사용, 2_3R은 항등행렬)
    - 0v3 = R03 @ v_3,  0omega3 = R03 @ omega_3 을 반환하라
    """
    R01 = rot_z(theta1)
    R12 = rot_z(theta2)
    R23 = np.eye(3)
    R03 = None  # TODO

    v0 = None      # TODO
    omega0 = None  # TODO
    return omega0, v0


# 검증: 6절에서 손으로 구한 0v3 닫힌 형태와 비교
# 0v3 = [-l1*s1*thd1 - l2*s12*(thd1+thd2),
#         l1*c1*thd1 + l2*c12*(thd1+thd2), 0]
# (s12 = sin(th1+th2), c12 = cos(th1+th2))
\`\`\`

> [!TIP]
> **연습 문제 정답 보기**
> \`\`\`python
> def base_frame_velocity(theta1, theta2, omega_3, v_3):
>     R01 = rot_z(theta1)
>     R12 = rot_z(theta2)
>     R23 = np.eye(3)
>     R03 = R01 @ R12 @ R23
>
>     v0 = R03 @ v_3
>     omega0 = R03 @ omega_3
>     return omega0, v0
>
> omega0, v0 = base_frame_velocity(th1, th2, omega_3, v_3)
>
> s1, c1 = np.sin(th1), np.cos(th1)
> s12, c12 = np.sin(th1 + th2), np.cos(th1 + th2)
> v0_closed = np.array([
>     -l1 * s1 * thd1 - l2 * s12 * (thd1 + thd2),
>      l1 * c1 * thd1 + l2 * c12 * (thd1 + thd2),
>     0.0,
> ])
> print("0v3 (변환):", v0, " | (닫힌 형태):", v0_closed)
> assert np.allclose(v0, v0_closed)  # 검증 통과
> \`\`\`

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 선속도 전파 (필수 암기) | \${}^{i+1}v_{i+1} = {}^{i+1}_iR\\,({}^iv_i + {}^i\\omega_i\\times{}^iP_{i+1})$ — 각속도 전파와 짝을 이루는 5장의 핵심 결과 |
| 항이 줄어드는 이유 | \${}^iP_{i+1}$이 DH 파라미터(상수)로 고정되어 있어, [일반 점 속도 공식](../jacobian-velocity-kinematics/main.md)의 "스스로 움직이는 속도" 항이 사라짐 |
| 프리즘 관절 | 각속도 식은 그대로, 선속도 식에 $\\dot d_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$ 만 추가 |
| 순차 전파의 이유 | 로봇 팔은 체인 구조라 폐형식이 안 되고, 베이스→손끝으로 링크 간 관계만 순차적으로 풀 수 있음 |
| 좌표계 3 vs 좌표계 0 | \${}^3v_3$은 손끝 자신 기준, \${}^0v_3={}^0_3R\\cdot{}^3v_3$이 로봇 밖(베이스) 관찰자가 보는 실제 값 |
| 자코비안의 일반 정의 | $\\delta Y = J\\,\\delta X$ — $J$는 편미분 행렬이며 $X$(현재 위치)의 함수 |
| 로봇 자코비안 | \${}^0v = {}^0J(\\Theta)\\dot\\Theta$ — 관절 속도를 손끝 직교좌표 속도로 바꾸는 행렬. 행=작업공간 자유도, 열=관절 수(항상 정사각형일 필요 없음) |
| 자코비안 만드는 법 | 순차 전파로 구한 속도식을 $\\dot\\theta_i$별로 묶어 계수 행렬로 뽑아냄 |
| 이 영상이 다루지 않은 것 | static forces(6장)는 등장하지 않음 — 영상은 2-링크 예제의 자코비안을 완성한 직후, θ̇1·θ̇2 계수를 정리하는 장면에서 끝남 |
`,

  'Robotics/jacobian-velocity-kinematics': `---
title: 자코비안 속도 — 위치·각속도의 좌표 변환과 강체 속도 유도 (Jacobian Velocity Kinematics)
date: 2026-08-08
tags: jacobian, velocity
order: 
featured: false
draft: false
---

# 자코비안 속도 — 위치·각속도의 좌표 변환과 강체 속도 유도 (Jacobian Velocity Kinematics)

> 출처: 로봇제어공학 — Introduction to Robotics 5장 "자코비안: 속도와 static forces" (앞부분)
> 영상: https://www.youtube.com/watch?v=O1saBbqTx5Q&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=11
> 대상: [4장까지](../inverse-kinematics-puma560-closed-form/main.md) 기구학·역기구학(각도·위치)을 배운 상태에서, 그 값들이 "시간에 따라 변하면" 어떻게 되는지(속도)로 넘어가는 도입부다. **이 노트는 5장의 속도 파트만 다룬다** — static forces(정적인 힘)는 이 영상 마지막에 다음 시간으로 미뤄졌고, 그 내용은 6장에서 다룬다.

---

## 목차

1. [왜 이 장이 필요한가](#1-왜-이-장이-필요한가--위치에서-속도·힘으로)
2. [위치 벡터의 미분과 좌표계 표기법](#2-위치-벡터의-미분과-좌표계-표기법)
3. [기차·자동차 예제](#3-기차·자동차-예제--표기법을-실전에-써보기)
4. [각속도란 무엇인가](#4-각속도란-무엇인가--두-좌표계가-상대적으로-돈다)
5. [강체의 선속도 유도](#5-강체의-선속도-유도--각속도가-만드는-점의-속도)
6. [반대칭 행렬로 다시 증명하기 (optional)](#6-optional--반대칭-행렬skew-symmetric-matrix로-다시-증명하기)
7. [축-각 표현으로 회전행렬 미분하기 (optional)](#7-optional--축-각-표현으로-회전행렬-미분하기)
8. [각속도 벡터의 물리적 의미](#8-각속도-벡터의-물리적-의미--왜-이걸-쓰면-쉬워지는가)
9. [링크에서 링크로의 속도 전파](#9-링크에서-링크로의-속도-전파)
10. [표기법 비교표](#10-표기법-비교표)
11. [Python 실습 코드](#11-python-실습-코드)
12. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 왜 이 장이 필요한가 — 위치에서 속도·힘으로

4장까지 배운 기구학·역기구학은 전부 **"위치"** 이야기였다. 관절 각도(혹은 프리스매틱 조인트의 길이)를 알면 손끝 위치·방위가 정해지고(정기구학), 손끝 위치·방위를 알면 관절 각도가 정해진다(역기구학). 각도든 길이든 결국 다 **위치의 한 형태**라는 것이 핵심 전제다.

5장부터는 이 위치가 **시간에 따라 변할 때** 이야기로 넘어간다.

- **5장 (이 노트)**: 각 관절을 특정 각속도로 움직이면 손끝은 얼마의 속도로 움직이는가?
- **6장 (동력학)**: 각 관절에 특정 토크를 가하면 손끝은 얼마의 토크·힘을 낼 수 있는가?

> "내가 여기다가 손을 대는 거는 기구학, 역기구학에서 다 할 수 있어요. 그런데 내가 여기다 글씨를 쓰고 싶어. 그러면 내가 눌러야 되잖아요. 몇 뉴튼으로 이 방향으로 힘을 가야만 의미가 있잖아."

칠판에 붓펜으로 글씨를 쓰는 예시가 이 구분을 잘 보여준다.

- 펜 끝을 칠판의 특정 위치·각도에 갖다 대는 것까지는 **순수한 기구학 문제**다.
- 하지만 실제로 글씨가 써지려면 **칠판 방향으로 일정한 힘을 유지**해야 한다 — 너무 세게 누르면 굵게, 너무 약하면 흐릿하게 나온다.
- 이 "가만히 붙어서 누르는 힘"이 바로 **static force(정적인 힘)** 이고, 6장의 주제다.

**실무 포인트**: 5·6장은 책 스스로도 "여기서는 간단한 개념과 용어만 설명하고, 더 깊이 들어가려면 전문 서적을 보라"고 밝힐 만큼 어려운 챕터다. 그래서 예제도 3차원 전체가 아니라 2~3축짜리 평면 로봇으로 단순화된다.

> "실제 사회에 나가면 3축, 4축, 5축, 6축, 3차원 공간에서 움직이는 건데 그건 어떻게 해요? 그거는 여기서 나온 방법을 프로그램으로 다 구현을 해서, 그다음부터는 프로그램으로 다 해결을 하는 거예요. 실제 손으로 푸는 경우는 드물어요."

또 하나 중요한 구조적 차이가 있다.

- 4장까지의 역기구학은 어려운 경우도 있었지만 **폐형식(closed-form)**으로 한 번에 풀 수 있었다.
- 5·6장부터는 폐형식이 거의 불가능해서, **관절과 관절의 관계를 이용해 순차적(반복적)으로 계산**해야 한다 — 베이스 좌표계부터 손끝까지, 혹은 손끝부터 베이스까지 링크 하나씩 넘어가며 푼다.
- 이 순차적 구조가 [9절](#9-링크에서-링크로의-속도-전파)에서 그대로 등장한다.

**강체(rigid body)** 정의도 짚고 넘어간다 — 단순히 "딱딱해서 안 휘는 물체"가 아니라, **힘을 가했을 때 물체를 이루는 모든 점이 같은 속도로 움직이는 물체**다. 휘는 물체는 부위마다 다른 방향·크기의 속도로 움직이기 때문에 휘는 것이다.

---

## 2. 위치 벡터의 미분과 좌표계 표기법

### 왜 위치부터 다시 시작하는가

트랜스포메이션 매트릭스를 배울 때도 트랜슬레이션(위치)을 먼저 쉽게 풀고, 그다음 로테이션(방위)을 따로 풀고, 나중에 합쳤다. 속도도 똑같은 순서를 따른다 — **위치의 속도(선속도)를 먼저, 방위의 속도(각속도)를 나중에** 다룬다.

### 표기법

B 좌표계에서 표현한 위치 벡터 Q를 시간으로 미분하면 그게 곧 B 좌표계 기준에서 본 Q의 속도다:

$\${}^{B}v_{Q} = \\frac{d}{dt}\\,{}^{B}Q = \\lim_{\\Delta t \\to 0}\\frac{{}^{B}Q(t+\\Delta t) - {}^{B}Q(t)}{\\Delta t}$$

미분의 정의를 그대로 가져다 쓴 것뿐이다 — 위치의 변화량을 시간의 변화량으로 나누고 극한을 취하면 속도.

> **이해**: 이 미분 정의 자체는 이해할 필요도 없을 만큼 당연하다 — 위치를 시간으로 나눈 게 속도.
> **기억할 필요 없음**: 아래 나올 기호는 억지로 만든 표기라 외울 필요는 없지만, 뒤에서 계속 쓰이니 의미는 이해해 둔다.

### 다른 좌표계로 옮겨보기

B 좌표계에서 표현한 속도 \${}^{B}v_{Q}$를 A 좌표계로 보고 싶다면? 좋은 소식은 **기구학에서 배운 회전행렬(rotation matrix)을 그대로 곱해주면 된다**는 것이다:

$\${}^{A}[{}^{B}v_{Q}] = {}^{A}_{B}R \\cdot {}^{B}v_{Q}$$

위치 좌표를 회전행렬로 변환하던 방법을 속도 벡터에도 똑같이 적용한 것 — 새로운 개념이 아니라 [기존에 배운 매핑 규칙](../transformation-matrix/main.md)의 재사용이다.

### 우주 좌표계(Universe frame) 축약 표기

기준 좌표계가 **U (Universe, 절대 변화하지 않는 우주 좌표계)** 일 때는 표기를 간단히 한다. 원래는 \${}^{U}v_{C}$(우주계 기준 C 좌표계 원점의 속도)라고 써야 하지만, U는 관례상 생략하고 그냥 **$v_{C}$**로 쓴다.

> "너무 어렵게 생각하지 마세요. 결국 U가 왼쪽에 있으면 그냥 생략하고 $v_{C}$라고 쓰자는 거예요."

**실무 포인트**: 어떤 수식에서 좌상단 위첨자가 갑자기 없는 v가 나오면, "우주(절대) 좌표계 기준"이라는 뜻으로 읽으면 된다.

---

## 3. 기차·자동차 예제 — 표기법을 실전에 써보기

> **Figure 5.1 (교재, 예제 5.1)**: 고정된 우주 좌표계 {U}, 100 mph로 달리는 기차에 고정된 좌표계 {T}, 30 mph로 달리는 승용차에 고정된 좌표계 {C}. 두 차량 모두 {U}의 X축 방향을 향한다. 회전행렬 \${}^{U}_{T}R$과 \${}^{U}_{C}R$은 이미 알고 있는 상수다.

> 참고로 교재의 원래 그림은 두 차량이 Y방향으로 달리는 것처럼 그려져 있는데, 본문 설명과 어긋나는 오기(誤記)다 — X축 방향이 맞다.

### ① 자동차 원점의 속도

우주계(U) 기준이므로 좌상단 위첨자 U는 관례상 생략한다:

$$\\frac{{}^{U}d}{dt}\\,{}^{U}P_{C_{org}} = {}^{U}V_{C_{org}} = v_{C} = 30\\hat X$$

### ② 기차의 속도를 자동차 좌표계로 변환

기차의 속도(우주계 기준 $100\\hat X$)를 [2절의 변환 규칙](#2-위치-벡터의-미분과-좌표계-표기법)대로 자동차 좌표계로 옮긴다:

$\${}^{C}({}^{U}V_{T_{org}}) = {}^{C}v_{T} = {}^{C}_{U}R\\,v_{T} = {}^{C}_{U}R\\,(100\\hat X) = {}^{U}_{C}R^{-1}\\,100\\hat X$$

마지막 등호가 핵심이다 — 문제에서 실제로 주어진 건 **U→C 방향** 회전행렬 \${}^{U}_{C}R$이지 그 반대(\${}^{C}_{U}R$)가 아니다. 회전행렬의 인버스 성질(\${}^{C}_{U}R = ({}^{U}_{C}R)^{-1}$)을 이용해 아는 값으로 바꿔 쓴 것.

> "C하고 U 사이의 로테이션 매트리스를 아는 게 아니라, U에서 C 사이의 로테이션 매트리스를 알았네요. 그러면 얘는 어떻게 구해요? 인버스를 해주면 되겠지."

### ③ 대칭 확인 — 반대 방향으로도 같은 결론

자동차의 속도를 기차 좌표계로 봤다가, 다시 자동차 좌표계 표현으로 옮기면:

$\${}^{C}({}^{T}V_{C_{org}}) = {}^{C}_{T}R\\,{}^{T}V_{C_{org}} = -{}^{U}_{C}R^{-1}\\,{}^{U}_{T}R\\,70\\hat X$$

기차 입장에서 보면 자동차는 자기보다 느리므로 **-70 (뒤로 멀어지는 방향)** 으로 보인다 — 그 값을 다시 자동차 좌표계 표현으로 옮긴 식이다. ②와 ③은 서로 다른 경로로 계산했지만 둘 다 **"상대 속도 70"** 이라는 같은 결론에 도달한다.

**검산(상식 체크)**: 두 차가 같은 방향으로 각각 100, 30으로 달리고 있으니, 자동차 안에서 보면 기차는 상식적으로 70의 속도로 멀어지는 것처럼 보여야 한다. ②, ③ 두 식 모두 이 직관과 일치한다 — 수학적으로 새로 유도한 게 아니라 표기법을 연습한 예제다.

**실무 포인트**: 이 "기준 좌표계 바꿔치기"는 ROS2의 \`tf2\`가 하는 일과 정확히 같은 개념이다 — 서로 다른 프레임(frame_id)에서 표현된 속도(\`geometry_msgs/TwistStamped\`)를 다른 프레임으로 변환할 때 내부적으로 회전행렬(쿼터니언)을 곱한다.

---

## 4. 각속도란 무엇인가 — 두 좌표계가 상대적으로 돈다

> **Figure 5.2 (교재)**: 원점이 겹쳐있는 A, B 두 좌표계 중 B가 A를 기준으로 각속도 \${}^{A}\\omega_{B}$로 돌고 있는 그림.

선속도를 다뤘으니 이제 방위(각도)의 변화, 즉 **각속도**로 넘어간다. 표기는 대문자·소문자 오메가(Ω, ω)로 헷갈리기 쉬우니 주의: 여기서는 소문자 ω를 각속도로 쓴다.

$\${}^{A}\\omega_{B}$$

= **A 좌표계를 기준으로 본 B 좌표계의 회전 각속도**. 선속도 표기(\${}^{A}v_{B}$)와 구조가 똑같다.

### 왜 회전행렬이 9개 요소를 갖는지 복습

각속도를 유도하기 전에, 회전행렬이 왜 3×3(9개 요소)인지 다시 짚는다. B 좌표계의 X축이 A 좌표계의 X·Y·Z축 각각과 이루는 내적(벡터 내적)이 3개, 이걸 B의 Y축, Z축에 대해서도 반복하면 3×3 = 9개 요소가 나온다. 이게 곧 로테이션 매트릭스였다.

기구학에서는 이 "꼬여있는 정도(회전행렬)"가 **고정된 값**이었다. 여기서는 A, B 두 좌표계의 상대적 각도가 **시간에 따라 변한다** — A가 고정되어 있어도 B가 회전하고 있으면 상대적인 각속도 \${}^{A}\\omega_{B}$가 생긴다는 뜻이다.

> 이 절까지는 계산이 아니라 **기호 정의만** 한 것이다 — 다음 절부터 본격적으로 계산이 시작된다.

---

## 5. 강체의 선속도 유도 — 각속도가 만드는 점의 속도

> **Figure 5.4 (교재)**: B 좌표계에 고정된 벡터 Q가 각속도 \${}^{A}\\omega_{B}$로 회전하는 그림.
> **Figure 5.5 (교재)**: 회전축과 Q 사이 각도 θ, 미소 이동량 δQ를 보여주는 기하학적 삼각형/부채꼴 그림 — 아래 유도의 근거.

### 문제 설정

두 좌표계 A, B의 **원점이 겹쳐있다**고 가정한다(단순화). B 좌표계에 점 Q가 **고정**되어 있다면(B 기준으로는 회전하지 않음), B 좌표계 자체가 A를 기준으로 \${}^{A}\\omega_{B}$로 돌고 있을 때 A 좌표계 입장에서 Q는 어떤 속도로 움직이는 것처럼 보일까?

### 기하학적 유도

1. 회전축(\${}^{A}\\omega_{B}$ 방향)과 벡터 \${}^{A}Q$ 사이의 각도를 θ라 하면, 회전축에서 Q까지의 **수직 거리(반지름)** 는 $|{}^{A}Q|\\sin\\theta$다 (회전축·Q·수직선이 이루는 직각삼각형에서).
2. 아주 짧은 시간 $\\Delta t$ 동안 각속도 \${}^{A}\\omega_{B}$로 회전하면, 회전한 각도는 $\\Delta\\theta = |{}^{A}\\omega_{B}|\\Delta t$.
3. Q가 그리는 원호(arc)의 길이 $\\delta Q$ = 반지름 × 각도 = $|{}^{A}Q|\\sin\\theta \\cdot |{}^{A}\\omega_{B}|\\Delta t$.
4. 양변을 $\\Delta t$로 나누고 극한을 취하면:
   $$\\left|\\frac{d Q}{dt}\\right| = |{}^{A}Q|\\,|{}^{A}\\omega_{B}|\\sin\\theta$$
5. $|a||b|\\sin\\theta$는 벡터 외적(cross product)의 크기와 정확히 같은 형태다. 그러므로:
   $\${}^{A}v_{Q} = {}^{A}\\omega_{B} \\times {}^{A}Q$$

> **이해**: sinθ가 나오는 건 회전축에서 벗어난 성분(수직 성분)만 원운동에 기여하기 때문이다 — 이게 외적의 기하학적 정의와 정확히 같다는 걸 알아채는 게 핵심.
> **기억할 필요 없음**: 삼각형·부채꼴 유도 과정 자체는 몰라도 된다.
> **꼭 기억**: 결과 공식 \${}^{A}\\omega_{B} \\times {}^{A}Q$ 자체.

### 원점이 겹쳐있는 경우의 결합형

Q가 B 안에서도 스스로 움직일 수 있다면(더 이상 고정이 아니면), 그 속도(\${}^{B}v_{Q}$)를 A로 변환한 항을 더한다. 이때 \${}^{A}Q$는 정의상 \${}^{A}Q = {}^{A}_{B}R\\cdot {}^{B}Q$이므로, 교재는 회전 항을 이 형태로 그대로 풀어서 쓴다:

$\${}^{A}v_{Q} = {}^{A}_{B}R\\cdot{}^{B}v_{Q} + {}^{A}\\omega_{B} \\times {}^{A}_{B}R\\cdot{}^{B}Q$$

### 일반형으로 확장 (원점도 떨어져 있는 경우)

지금까지는 원점이 겹쳐있는 경우만 다뤘다. 원점이 떨어져 있는 일반적인 경우로 확장하면, B 원점 자체의 이동 속도 항이 하나 더 더해진다 — **이 노트의 핵심, 꼭 암기**:

$$\\boxed{{}^{A}v_{Q} = {}^{A}v_{B_{org}} + {}^{A}_{B}R\\cdot{}^{B}v_{Q} + {}^{A}\\omega_{B} \\times {}^{A}_{B}R\\cdot{}^{B}Q}$$

| 항                                                      | 의미                                                                                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| \${}^{A}v_{B_{org}}$                                  | B 좌표계 원점 자체가 A 기준으로 이동하는 속도 (원점이 떨어져 있을 때 추가)                                                                                           |
| \${}^{A}_{B}R\\cdot {}^{B}v_{Q}$                       | Q가 B 좌표계 안에서도 스스로 움직이고 있다면 그 속도(B 기준)를 A로 변환한 것                                                                                         |
| \${}^{A}\\omega_{B} \\times ({}^{A}_{B}R\\cdot {}^{B}Q)$ | B가 회전하기 때문에 Q가 A 입장에서 함께 도는 것처럼 보이는 속도. \${}^{A}_{B}R\\cdot {}^{B}Q$ 는 곧 \${}^{A}Q$ 이므로 \${}^{A}\\omega_{B} \\times {}^{A}Q$ 로 줄여 써도 같다 |

> "내가 이렇게 기차를 보고 있는데, 기차 안에 어떤 사람이 뛰어다니고 있어. 그러면 어떻게 표현할 수 있어요?" — 기차 원점의 이동(1항) + 기차 안 사람이 기차 기준으로 걷는 속도(2항) + 기차가 도는 효과(3항, 이 예시에선 0)를 다 더한 게 이 공식이다.

**꼭 기억해야 하는 식** — 강사가 빨간색으로 강조한 이 박스 공식이 5장 선속도 파트의 핵심 결론이다. 유도 과정은 몰라도 되지만 이 결과식은 외워야 한다.

**실무 포인트**: 이 공식은 로봇 팔의 각 링크가 이전 링크에 대해 회전+병진하며 손끝까지 속도를 누적 전달하는 원리 그 자체다 — [9절](#9-링크에서-링크로의-속도-전파)에서 그대로 재사용된다.

---

## 6. optional — 반대칭 행렬(Skew-Symmetric Matrix)로 다시 증명하기

> 강의에서 "optional"이라고 명시한 파트. [5절](#5-강체의-선속도-유도--각속도가-만드는-점의-속도)의 결론(\${}^{A}v_{Q} = {}^{A}\\omega_{B} \\times {}^{A}Q$)을 그림이 아니라 **수식으로만** 다시 증명한다. 결과는 같으므로 그림 유도를 이해했다면 건너뛰어도 된다.

### 정규직교행렬의 성질에서 출발

회전행렬은 **정규직교행렬(orthonormal matrix)** 이라, $R^{-1} = R^{T}$ (인버스 = 트랜스포즈)라는 성질을 갖는다. 즉:

$$R\\,R^{T} = I_n$$

양변을 시간으로 미분한다(곱미분: 앞의 것 미분×뒤 그대로 + 앞 그대로×뒤의 것 미분). 우변 I는 상수 행렬이라 미분하면 0:

$$\\dot{R}R^{T} + R\\dot{R}^{T} = 0_n \\;\\;\\Longrightarrow\\;\\; \\dot{R}R^{T} + (\\dot{R}R^{T})^{T} = 0_n$$

(두 번째 등호는 $R\\dot{R}^{T} = (\\dot{R}R^{T})^{T}$이기 때문 — 전치 성질을 이용해 같은 항 $\\dot{R}R^{T}$로 정리한 것.)

### 반대칭 행렬의 정의

$S := \\dot{R} R^{T}$(회전행렬의 미분 × 트랜스포즈)로 정의하면, 위 식은 $S + S^{T} = 0$이 된다. 어떤 행렬이든 자기 자신과 자신의 트랜스포즈를 더했을 때 0이 되면 이를 **반대칭 행렬(skew-symmetric matrix)** 이라 부른다. 이 관계로부터:

$$S = \\dot{R}R^{-1}$$

> 반대칭 행렬은 대각선이 항상 0이고, 대각선 밖 성분은 부호가 반대인 대칭 형태를 갖는다 — 그래야 더했을 때 서로 상쇄되어 0이 된다.

### 점 P의 속도에 적용

B 좌표계에서 변화하지 않는 고정 벡터 \${}^{B}P$를 A로 표현: \${}^{A}P = {}^{A}_{B}R \\cdot {}^{B}P$. B 좌표계 자체가 회전하면 \${}^{B}P$는 그대로여도 \${}^{A}P$는 시간에 따라 변한다. 양변을 미분하면(\${}^{B}P$는 상수):

$\${}^{A}v_{P} = {}^{A}_{B}\\dot{R}\\cdot {}^{B}P$$

여기서 \${}^{B}P = ({}^{A}_{B}R)^{-1} {}^{A}P$를 대입하면:

$\${}^{A}v_{P} = {}^{A}_{B}\\dot{R}\\;({}^{A}_{B}R)^{-1}\\,{}^{A}P = {}^{A}_{B}S\\cdot {}^{A}P, \\qquad {}^{A}_{B}S := {}^{A}_{B}\\dot{R}\\,({}^{A}_{B}R)^{-1}$$

즉 **\${}^{A}v_{P} = {}^{A}_{B}S\\cdot {}^{A}P$** — S를 **각속도행렬**이라 부를 수 있다. 이 결과가 [5절](#5-강체의-선속도-유도--각속도가-만드는-점의-속도)에서 구한 \${}^{A}\\omega_{B} \\times {}^{A}P$와 같은 연산인지는, 반대칭 행렬 S의 성분을 각속도 벡터 $\\Omega = (\\Omega_x, \\Omega_y, \\Omega_z)$로 할당하면 확인된다:

$$S = \\begin{bmatrix} 0 & -\\Omega_z & \\Omega_y \\\\ \\Omega_z & 0 & -\\Omega_x \\\\ -\\Omega_y & \\Omega_x & 0 \\end{bmatrix}, \\quad \\Omega = \\begin{bmatrix}\\Omega_x\\\\\\Omega_y\\\\\\Omega_z\\end{bmatrix}, \\qquad S\\cdot P = \\Omega \\times P$$

> 교재 슬라이드의 이 행렬 표기에는 오타가 있다 — (2,1), (2,3) 성분이 둘 다 $\\Omega_x$로 찍혀 있다(원래는 $\\Omega_z$, $-\\Omega_x$가 맞다). 강의에서도 "여기 다 XXY라고 써있네요, 그건 좀 다시 한번 봅시다"라며 직접 짚었던 부분이다. 위 식은 오타를 바로잡은 올바른 형태다.

**이해**: 외적(cross product)을 행렬-벡터 곱셈으로 바꿔 쓴 것뿐이다 — 두 표현은 완전히 같은 연산이다.
**기억할 필요 없음**: 이 절 전체(반대칭 행렬 유도)는 그림으로 이미 이해했다면 몰라도 된다.

**실무 포인트**: 이 $S(\\Omega)$ 행렬은 로보틱스/컴퓨터 그래픽스에서 **"hat 연산자" $\\hat\\omega$** 라는 이름으로 아주 자주 쓰인다. NumPy로 구현해 두면 [11절 실습 코드](#11-python-실습-코드)처럼 외적을 행렬곱으로 바로 계산할 수 있다.

---

## 7. optional — 축-각 표현으로 회전행렬 미분하기

> 이 절도 "optional"이다. 회전행렬을 미분하는 또 다른 접근 — [2-3에서 배운 등가 각-축(axis-angle) 표현](../orientation-representations/main.md)을 이용한다.

미분의 정의 $\\dot{R} = \\lim_{\\Delta t \\to 0} \\frac{R(t+\\Delta t) - R(t)}{\\Delta t}$ 에서 시작한다. $\\Delta t$ 시간 뒤의 회전행렬 $R(t+\\Delta t)$는, 시각 t의 회전 $R(t)$에 **아주 작은 추가 회전**을 합성한 것으로 쓸 수 있다:

$$R(t+\\Delta t) = R_{K}(\\Delta\\theta)\\cdot R(t)$$

즉 $\\Delta t$ 시간 동안 축 $\\hat K$를 기준으로 작은 회전 $\\Delta\\theta$가 추가로 발생했다는 뜻이다. $R_K(\\Delta\\theta)$는 [2-3에서 배운 로드리게스(Rodrigues) 등가 각-축 공식](../orientation-representations/main.md) 그대로다. 대입해 정리하면:

$$\\dot{R} = \\lim_{\\Delta t \\to 0}\\left(\\frac{R_K(\\Delta\\theta) - I_3}{\\Delta t}\\right) R(t)$$

$\\Delta\\theta$가 매우 작으므로 $\\sin\\Delta\\theta \\approx \\Delta\\theta$, $\\cos\\Delta\\theta \\approx 1$, $(1-\\cos\\Delta\\theta) \\approx 0$으로 소각 근사하면 로드리게스 공식이 확 단순해진다:

$$R_K(\\Delta\\theta) \\approx \\begin{bmatrix} 1 & -k_z\\Delta\\theta & k_y\\Delta\\theta \\\\ k_z\\Delta\\theta & 1 & -k_x\\Delta\\theta \\\\ -k_y\\Delta\\theta & k_x\\Delta\\theta & 1 \\end{bmatrix}$$

이를 극한식에 대입하고 Δt로 나눈 뒤 극한을 취하면:

$$\\dot{R} = \\begin{bmatrix} 0 & -k_z\\dot\\theta & k_y\\dot\\theta \\\\ k_z\\dot\\theta & 0 & -k_x\\dot\\theta \\\\ -k_y\\dot\\theta & k_x\\dot\\theta & 0 \\end{bmatrix} R(t)$$

[6절](#6-optional--반대칭-행렬skew-symmetric-matrix로-다시-증명하기)에서 얻은 $\\dot{R}R^{-1} = S(\\Omega)$와 항끼리 1대1로 비교하면:

$$\\Omega = \\begin{bmatrix}\\Omega_x\\\\\\Omega_y\\\\\\Omega_z\\end{bmatrix} = \\begin{bmatrix}k_x\\dot\\theta\\\\k_y\\dot\\theta\\\\k_z\\dot\\theta\\end{bmatrix} = \\dot\\theta\\,\\hat K$$

**의미**: 각속도 벡터 Ω는 **"어떤 고정된 축 K를 기준으로 θ̇ 라는 속력으로 돈다"** 는 뜻이다 — 축 방향 벡터에 스칼라 회전 속력을 곱한 것.

**기억할 필요 없음**: 이 절의 수식 전개 전부. **꼭 기억**: 결론 $\\Omega = \\dot\\theta K$ 하나.

---

## 8. 각속도 벡터의 물리적 의미 — 왜 이걸 쓰면 쉬워지는가

정리하면, 어느 순간 회전하는 좌표계의 방위 변화는 **항상 어떤 축 K를 기준으로 한 회전으로 표현할 수 있다.** 이건 정적인 회전을 롤·피치·요(RPY) 대신 [축-각(axis-angle)](../orientation-representations/main.md)으로 표현할 수 있다고 배웠던 것과 완전히 같은 개념을 각속도에 적용한 것이다.

**왜 중요한가**: 로봇 팔이 3차원 공간에서 아무리 복잡하게 꺾이며 움직여도, 임의의 순간 그 회전은 "어떤 축을 기준으로 얼마의 각속도로 돈다"는 단 하나의 벡터로 표현된다. 그리고 [DH 컨벤션](../denavit-hartenberg-parameters/main.md)에서 모든 관절 회전축을 항상 **Z축**으로 잡기로 정의했기 때문에, 실제로는 매 관절마다 "Z축 기준 θ̇" 라는 스칼라 하나만 알면 그 관절의 각속도 기여분이 전부 결정된다.

> "얘가 뭐 3차원 공간에서 회전하고 움직이고 있을 테니까 X축으로 얼마나 복잡하게 돌 거 아니에요? 근데 그럴 필요 없다. 벡터 하나 딱 있고, 걔를 기준으로 몇 도로 돌고 있다, 이렇게 표현할 수 있다는 얘기잖아요."

**실무 연결**: \`scipy.spatial.transform.Rotation\`이 정적 회전을 축-각(rotvec)으로 다루듯, 로봇 각속도도 \`angular velocity vector\`(ROS2 \`geometry_msgs/Twist.angular\`, \`x,y,z\` 성분)로 표현된다 — 별도로 축과 속력을 나눠 저장하지 않고, 벡터의 **방향이 축**, **크기가 각속력**이라는 하나의 벡터에 다 담는다.

---

## 9. 링크에서 링크로의 속도 전파

> **Figure 5.6 (교재)**: 링크 i의 속도, 조인트 i 좌표계(Z축=회전축)와 그 위에 붙어 함께 움직이는 링크 그림.
> **Figure 5.7 (교재)**: 이웃한 링크 i, i+1 사이의 속도 벡터가 순차적으로 전파되는 로봇 팔 그림.

로봇 팔(manipulator)은 링크-조인트-링크-조인트로 이어진 **연속된 체인**이다. 각 링크는 이웃 링크에 대해서만 상대운동을 할 수 있다 — 손끝까지 한 번에 상대속도를 구하는 게 아니라, **이웃한 두 링크 사이의 관계를 순차적으로** 풀어나간다. [1절](#1-왜-이-장이-필요한가--위치에서-속도·힘으로)에서 예고했던 "폐형식이 안 통해서 반복적으로 풀어야 한다"는 말이 여기서 구체화된다.

### 표기법

- \${}^{i}v_{i}$: i 좌표계(=조인트 i에 붙은 좌표계) 기준으로, i 좌표계 원점의 선속도
- \${}^{i}\\omega_{i}$: i 좌표계 기준으로, i 좌표계의 각속도

### 각속도 전파 공식

먼저 새 관절(i+1)의 회전 기여분을 **i 좌표계 기준**으로 표현해 이전 링크의 각속도에 더한다:

$\${}^{i}\\omega_{i+1} = {}^{i}\\omega_{i} + {}^{i}_{i+1}R\\,\\dot\\theta_{i+1}\\,{}^{i+1}\\hat{Z}_{i+1}$$

양변에 \${}^{i+1}_{i}R$을 곱해 **i+1 좌표계 기준**으로 옮기면(오른쪽 항의 회전행렬 두 개가 서로 상쇄되어 사라진다), 최종 결과가 나온다 — **꼭 기억**:

$$\\boxed{{}^{i+1}\\omega_{i+1} = {}^{i+1}_{i}R \\cdot {}^{i}\\omega_{i} + \\dot\\theta_{i+1}\\cdot {}^{i+1}\\hat{Z}_{i+1}}$$

| 항 | 의미 |
|---|---|
| \${}^{i+1}_{i}R \\cdot {}^{i}\\omega_{i}$ | 이전 링크(i)가 갖고 있던 각속도를, 다음 좌표계(i+1) 기준으로 회전 변환한 것 |
| $\\dot\\theta_{i+1}\\cdot {}^{i+1}\\hat{Z}_{i+1}$ | 관절 i+1 자체가 새로 만들어내는 회전 속도 — [8절](#8-각속도-벡터의-물리적-의미--왜-이걸-쓰면-쉬워지는가)에서 본 것처럼 항상 Z축 기준이라 스칼라 θ̇ 하나로 끝난다 |

**이해**: 두 각속도를 그냥 더하는 것뿐이다 — "링크가 어떻게 움직이는지(이전 항)" + "여기 조인트가 어떻게 도는지(새 항)"를 합치면 다음 링크의 움직임이 보인다.

> "얘를 기준으로 얘의 상대 속도, 얘를 기준으로 얘의 상대 속도를 순차적으로 하겠다는 거야. 왜? 어차피 링크가 연쇄적으로 연결되어 있으니까."

선속도 전파 공식은 강의에서 다음 시간으로 미뤄졌다("선속도는 조금 유도를 해야 해서, 그거는 다음 시간에 제대로 할게요") — 후속 노트에서 다룰 예정이다.

**실무 포인트**: 이 재귀적(recursive) 전파 방식이 바로 로봇 미들웨어(\`KDL\`, \`MoveIt\`, \`pytorch_kinematics\` 등)가 실제로 **자코비안 행렬을 수치적으로 계산**할 때 쓰는 방법이다 — 사람이 손으로 폐형식을 풀지 않고, 프로그램이 관절마다 이 재귀식을 순서대로 적용한다.

---

## 10. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| \${}^{B}v_{Q}$ | B 좌표계 기준, Q의 선속도 | $= \\frac{d}{dt}\\,{}^{B}Q$ |
| \${}^{A}[{}^{B}v_{Q}]$ | \${}^{B}v_{Q}$ 를 A 좌표계로 변환 | $= {}^{A}_{B}R \\cdot {}^{B}v_{Q}$ |
| $v_{C}$ (U 생략) | 우주계(U) 기준 C 원점 속도 | U는 관례상 생략 |
| \${}^{A}\\omega_{B}$ | A 기준, B 좌표계의 각속도 | 대문자 Ω와 헷갈리지 말 것 |
| $S(\\omega)$ | ω의 반대칭 행렬 | $S(\\omega)\\cdot P = \\omega \\times P$ |
| $\\omega = \\dot\\theta K$ | 각속도 = 회전속력 × 축벡터 | 축-각 표현의 속도 버전 |
| \${}^{i}v_{i}$, \${}^{i}\\omega_{i}$ | 링크 i 좌표계 기준, i 원점의 선·각속도 | 링크 전파식에서 사용 |

---

## 11. Python 실습 코드

\`\`\`python
import numpy as np

def skew(w):
    """각속도 벡터 w=(wx,wy,wz)를 반대칭 행렬 S(w)로 변환.
    S(w) @ P == np.cross(w, P) 와 동일해야 한다 (5-1 6절)."""
    wx, wy, wz = w
    return np.array([
        [0, -wz, wy],
        [wz, 0, -wx],
        [-wy, wx, 0],
    ])

# --- 검증: S(w)·P == w × P ---
w = np.array([0.0, 0.0, 2.0])   # Z축 기준 2 rad/s로 회전
P = np.array([1.0, 0.0, 0.0])   # 회전축에서 반지름 1 떨어진 점

v_cross = np.cross(w, P)
v_skew = skew(w) @ P
print("cross :", v_cross)
print("skew  :", v_skew)
assert np.allclose(v_cross, v_skew)

# --- 기차·자동차 예제 (3절) 재현 ---
# 두 좌표계 모두 우주계와 회전은 없다고 가정(회전행렬 = I)하면
# C_U_R = I, 그대로 계산해도 결과가 같아야 한다.
v_T_universe = np.array([100.0, 0.0, 0.0])
R_U_to_C = np.eye(3)          # 실제로는 문제에서 주어지는 회전행렬
R_C_to_U = R_U_to_C.T         # 회전행렬의 인버스 = 트랜스포즈

v_T_in_C = R_C_to_U @ v_T_universe - R_C_to_U @ np.array([0, 0, 0])
# 자동차 자신의 속도(30)를 빼줘야 "자동차 기준 상대속도"가 된다
v_C_universe = np.array([30.0, 0.0, 0.0])
v_T_relative_to_C = v_T_in_C - v_C_universe
print("기차가 자동차 기준으로 보이는 속도:", v_T_relative_to_C)  # [70, 0, 0] 기대
\`\`\`

### 연습 문제 (TODO)

\`\`\`python
def point_velocity(v_B_origin, omega_A_B, A_Q, R_A_B, B_v_Q):
    """5절의 일반 공식을 구현하라:
    A_v_Q = v_B_origin + omega_A_B x A_Q + R_A_B @ B_v_Q

    TODO: 아래 세 항을 각각 구해 더한 뒤 반환하라.
    - term1: B 좌표계 원점 자체의 이동 속도 (그대로 사용)
    - term2: omega_A_B 와 A_Q 의 외적 (np.cross 사용)
    - term3: R_A_B 를 B_v_Q 에 곱한 것 (행렬-벡터 곱)
    """
    term1 = v_B_origin
    term2 = None  # TODO
    term3 = None  # TODO
    return term1 + term2 + term3

# 검증: B 원점이 정지, Q가 B 안에서도 고정(B_v_Q=0)인 단순한 경우
# omega_A_B = [0,0,1] (Z축 1 rad/s), A_Q = [1,0,0] 이면
# 결과는 [0,1,0] 이 나와야 한다 (Z축 기준 반시계 회전이므로 +Y 방향 속도).
\`\`\`

> [!TIP]
> **연습 문제 정답 보기**
> \`\`\`python
> def point_velocity(v_B_origin, omega_A_B, A_Q, R_A_B, B_v_Q):
>     term1 = v_B_origin
>     term2 = np.cross(omega_A_B, A_Q)
>     term3 = R_A_B @ B_v_Q
>     return term1 + term2 + term3
>
> result = point_velocity(
>     v_B_origin=np.array([0.0, 0.0, 0.0]),
>     omega_A_B=np.array([0.0, 0.0, 1.0]),
>     A_Q=np.array([1.0, 0.0, 0.0]),
>     R_A_B=np.eye(3),
>     B_v_Q=np.array([0.0, 0.0, 0.0]),
> )
> print(result)  # [0. 1. 0.] — 검증 통과
> \`\`\`

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 5장 vs 6장 | 5장 = 속도(관절 각속도 → 손끝 속도), 6장 = 정적인 힘/토크(static forces, 동력학) |
| 선속도 정의 | \${}^{B}v_{Q} = \\frac{d}{dt}{}^{B}Q$, 좌표계 변환은 \${}^{A}[{}^{B}v_{Q}] = {}^{A}_{B}R\\cdot {}^{B}v_{Q}$ (회전행렬 그대로 재사용) |
| U(우주계) 표기 | 좌상단 위첨자가 없으면 우주계(절대) 기준 |
| 각속도 정의 | \${}^{A}\\omega_{B}$ = A 기준 B의 회전 각속도 (아직 기호만) |
| **점의 속도 (필수 암기)** | \${}^{A}v_{Q} = {}^{A}v_{B_{org}} + {}^{A}_{B}R\\cdot {}^{B}v_{Q} + {}^{A}\\omega_{B} \\times {}^{A}Q$ |
| 반대칭 행렬 (optional) | $S(\\omega)\\cdot P = \\omega \\times P$, $S = \\dot{R}R^{-1}$, $S+S^{T}=0$ |
| 각속도의 물리적 의미 | $\\omega = \\dot\\theta K$ — 항상 "축 K 기준 회전속력 θ̇" 하나로 표현 가능 |
| 링크 각속도 전파 | \${}^{i+1}\\omega_{i+1} = {}^{i+1}_{i}R\\cdot {}^{i}\\omega_{i} + \\dot\\theta_{i+1}\\cdot {}^{i+1}\\hat{Z}_{i+1}$ (선속도 전파는 다음 시간) |
| 왜 폐형식이 안 되는가 | 링크가 체인으로 연결돼 있어 이웃 링크 관계로만 순차적(재귀적)으로 풀 수 있다 — 실무에선 프로그램(수치 자코비안)이 담당 |
`,

  'Robotics/manipulator-dynamics-acceleration-and-inertia-tensor': `---
title: 머니퓰레이터 동역학 개요, 강체 가속도와 관성 텐서 (Manipulator Dynamics — Acceleration & Inertia Tensor)
date: 2026-08-08
tags: inertia-tensor, torque
order: 
featured: false
draft: false
---

# 머니퓰레이터 동역학 개요, 강체 가속도와 관성 텐서 (Manipulator Dynamics — Acceleration & Inertia Tensor)

> 출처: 로봇제어공학 — Introduction to Robotics 6장 "머니퓰레이터 동역학(dynamics)" (첫 강의)
> 영상: https://www.youtube.com/watch?v=91d3KbCRh9k&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=15
> 대상: [5장](../jacobian-static-forces-and-geometric-jacobian/main.md)에서 위치·속도·정적 힘까지 다뤘다면, 이 노트는 그 위에 **가속도와 토크**를 얹어 로봇 운동 전체를 아우르는 6장의 출발점이다 — 강체 가속도 유도, 관성 모멘트·관성 텐서 개념, 직육면체 예제까지.

---

## 1. 왜 다이나믹스인가 — 위치·속도의 다음 단계

지금까지 배운 세 가지를 한 줄씩 정리하면:

| 장 | 다루는 물리량 | 관절-손끝 관계 |
|---|---|---|
| 기구학 | 위치·각도 | 관절각 → 손끝 위치 |
| 자코비안 속도 | 각속도·선속도 | 관절 각속도 → 손끝 속도 |
| [static forces](../jacobian-static-forces-and-geometric-jacobian/main.md) | 힘·토크(정지 상태) | 손끝 힘 → 관절 토크 (가속도 없음) |
| 동역학 (6장) | **가속도 + 힘/토크 전부** | 위 세 가지를 전부 포함하는 상위 개념 |

동역학이 굳이 새로 필요한 이유는 뉴턴의 운동방정식 $F=MA$ 그 자체다. 힘을 알려면 가속도를 알아야 하는데, static forces에서는 로봇이 멈춰 있다고 가정했으므로 각가속도가 필요 없었다. 동역학은 그 가정을 걷어내고 **각도 $\\theta$, 각속도 $\\dot\\theta$, 각가속도 $\\ddot\\theta$를 전부 알아야** 풀리는, static forces를 포함하는 더 큰 문제다.

또 하나 바뀌는 게 있다 — 지금까지 로봇 모터는 **위치 제어**(기구학) 아니면 **속도 제어**(자코비안)만 했는데, 가속도를 제어하려면 결국 힘, 회전에서는 **토크 제어**가 필요하다. 실제 모터 중 토크 제어가 가능한 모터는 많지 않다 — 토크 자체를 측정하는 것이 어렵기 때문이다.

**이해**: 위치 제어가 제일 쉽고, 속도·가속도(토크) 제어로 갈수록 어려워진다는 난이도 위계.

마지막으로 static forces에서 "중력은 6장에서 다룬다"고 미뤄뒀던 부분도 여기서 정식으로 들어온다 — 동역학은 액추에이터 토크 + 외력 + **중력**까지 전부 포함한다.

---

## 2. 순방향·역방향 다이나믹스 — 두 가지 문제

동역학이 푸는 문제는 [기구학·역기구학](../inverse-kinematics/main.md)과 똑같은 구조로 두 방향이 있다.

| | 알고 있는 것 | 구하는 것 | 강의에서 부르는 이름 |
|---|---|---|---|
| 문제 1 | 관절 각도 $\\theta$, 각속도 $\\dot\\theta$, 각가속도 $\\ddot\\theta$ | 필요한 관절 토크 $\\tau$ | 역동역학 (inverse dynamics) |
| 문제 2 | 관절 토크 $\\tau$ | 결과로 나오는 $\\theta,\\dot\\theta,\\ddot\\theta$ | 순동역학 (forward dynamics) |

두 문제의 쓰임새가 다르다: 순동역학은 로봇 팔이 특정 토크로 움직였을 때 실제로 어떻게 거동하는지 계산하는 것이라 **시뮬레이션**에 쓰이고, 역동역학은 "손끝을 이렇게 가속시키려면 각 모터에 얼마의 토크를 줘야 하나"를 구하는 것이라 **실제 제어**에 쓰인다. 강의는 실무에서 훨씬 많이 쓰이는 역동역학을 중심으로 진행한다.

**필요한 세 값은 이미 측정 가능하다**: 모터에 붙은 엔코더가 위치 $\\theta$를 알려주고, 짧은 시간 간격으로 위치를 반복 측정하면 $\\dot\\theta$, 그 변화를 다시 측정하면 $\\ddot\\theta$가 나온다. 즉 $\\theta,\\dot\\theta,\\ddot\\theta$는 "안다"고 가정하고 시작해도 되는 값이다.

**꼭 기억**: 역동역학 = $(\\theta,\\dot\\theta,\\ddot\\theta) \\to \\tau$ (제어에 사용), 순동역학 = $\\tau \\to (\\theta,\\dot\\theta,\\ddot\\theta)$ (시뮬레이션에 사용). 이 장은 대부분 역동역학을 다룬다.

---

## 3. 강체의 선가속도 유도

가속도는 속도의 시간 미분이다. [5장에서 정의한](../jacobian-velocity-kinematics/main.md) 좌표계 $\\{B\\}$ 기준 점 $Q$의 속도를 그대로 다시 가져와 미분만 취하면 된다.

$\${}^B\\dot V_Q = \\lim_{\\Delta t\\to 0}\\frac{{}^BV_Q(t+\\Delta t)-{}^BV_Q(t)}{\\Delta t}, \\qquad {}^B\\dot\\Omega_Q = \\lim_{\\Delta t\\to 0}\\frac{{}^B\\Omega_Q(t+\\Delta t)-{}^B\\Omega_Q(t)}{\\Delta t}$$

고정된 우주 좌표계(universe frame) 기준일 때는 표기를 간단히 줄여 쓴다 — 이후 종종 섞여 나오므로 당황하지 말 것.

$$\\dot V \\equiv {}^{U}\\dot V, \\qquad \\dot\\Omega \\equiv {}^{U}\\dot\\Omega$$

### 출발점 — 5장의 속도 합성 공식

[5장](../jacobian-velocity-kinematics/main.md)에서 좌표계 $\\{B\\}$ 기준 점 $Q$의 속도를 좌표계 $\\{A\\}$ 기준으로 바꾸는 식(식 5.12)은 두 항의 합이었다.

$\${}^AV_Q = {}^A_BR\\,{}^BV_Q + {}^A\\Omega_B \\times {}^A_BR\\,{}^BQ$$

- 첫째 항: $Q$가 $\\{B\\}$ 기준으로 갖는 속도를 $\\{A\\}$로 회전변환만 한 것
- 둘째 항: $\\{B\\}$ 좌표계 자체가 $\\{A\\}$ 기준으로 통째로 회전하면서 생기는 속도($\\omega\\times r$)

이 두 항을 그대로 미분하면 가속도가 나온다. 미분할 때 곱의 미분법칙(product rule)을 그대로 적용하고, 회전행렬 \${}^A_BR$의 미분에는 [5장에서 유도한](../jacobian-velocity-kinematics/main.md) $\\dot{}^A_BR = {}^A\\Omega_B\\times{}^A_BR$ 관계를 대입한다.

정리 결과, $\\{B\\}$ 좌표계의 원점이 $\\{A\\}$ 기준으로 고정되어 있고(회전만 함) $Q$가 $\\{B\\}$에 고정된 점이 아니라 그 안에서 자체 속도 \${}^BV_Q$를 가지고 움직이는 일반적인 경우:

$\${}^A\\dot V_Q = {}^A_BR\\,{}^B\\dot V_Q + 2\\,{}^A\\Omega_B\\times{}^A_BR\\,{}^BV_Q + {}^A\\dot\\Omega_B\\times{}^A_BR\\,{}^BQ + {}^A\\Omega_B\\times\\left({}^A\\Omega_B\\times{}^A_BR\\,{}^BQ\\right)$$

가운데 $2{}^A\\Omega_B\\times\\cdots$ 항이 바로 코리올리 가속도(Coriolis acceleration)에 해당하는 항이다 — $\\{B\\}$가 돌면서 동시에 $Q$가 그 안에서 움직이기 때문에 생기는 교차항이다.

### 원점이 움직이는 경우까지 일반화

지금까지는 $\\{B\\}$의 원점이 $\\{A\\}$ 기준으로 고정된 채 회전만 한다고 가정했다. 직동 관절(prismatic joint)처럼 두 좌표계의 원점 사이 거리 자체가 변할 수도 있으므로, $\\{B\\}$ 원점의 선가속도 항 \${}^A\\dot V_{BORG}$를 하나 더 더해 완전히 일반화한다([5-4에서 원점 이동을 포함해 속도 변환을 일반화한 것](../jacobian-static-forces-and-geometric-jacobian/main.md)과 같은 방식):

$$\\boxed{{}^A\\dot V_Q = {}^A\\dot V_{BORG} + {}^A_BR\\,{}^B\\dot V_Q + 2\\,{}^A\\Omega_B\\times{}^A_BR\\,{}^BV_Q + {}^A\\dot\\Omega_B\\times{}^A_BR\\,{}^BQ + {}^A\\Omega_B\\times\\left({}^A\\Omega_B\\times{}^A_BR\\,{}^BQ\\right)}$$

이게 **일반적인 관절**(직동이든 회전이든)에 다 적용되는 식이다. 그런데 로봇의 관절 $i$와 $i+1$ 사이는 — 프리스매틱 조인트가 아닌 이상 — 서로 멀어지지 않는다. 회전 관절에서는 $Q$가 $\\{B\\}$에 완전히 고정된 점이므로 \${}^BV_Q = {}^B\\dot V_Q = 0$이 되어 코리올리 항과 상대속도 항이 통째로 사라진다.

$$\\boxed{{}^A\\dot V_Q = {}^A\\dot V_{BORG} + {}^A\\dot\\Omega_B\\times{}^A_BR\\,{}^BQ + {}^A\\Omega_B\\times\\left({}^A\\Omega_B\\times{}^A_BR\\,{}^BQ\\right)}$$

**기억할 필요 없음**: 유도 과정 자체(곱의 미분, 회전행렬 미분 대입). **이해**: 두 갈래로 나뉘는 이유 — "원점이 멀어지는가"라는 관절 종류의 차이 하나가 식을 결정한다는 구조. **꼭 기억**: 회전 관절만 다룰 거라면 마지막 박스 식 하나만 있으면 된다.

실제 매니퓰레이터 체인 표기($i \\to i+1$)로 바꿔 쓴, 다음 강의에서 바로 쓰게 될 **실전 형태**는 다음과 같다(Craig, *Introduction to Robotics* 식 6.8 — 회전 관절 전용):

$\${}^{i+1}\\dot v_{i+1} = {}^{i+1}_{i}R\\left[{}^i\\dot v_i + {}^i\\dot\\omega_i \\times {}^iP_{i+1} + {}^i\\omega_i \\times\\left({}^i\\omega_i \\times {}^iP_{i+1}\\right)\\right]$$

[5-2의 속도 전파식](../jacobian-velocity-kinematics-link-propagation/main.md)과 마찬가지로 \${}^0v_0=0$(베이스 고정)에서 출발해 $i=0,1,2,\\dots$ 순서로 리커시브하게 계산한다.

---

## 4. 각가속도 유도와 회전 관절 단순화

각가속도도 같은 방식으로 유도한다. 출발점은 [5장에서 다룬](../jacobian-velocity-kinematics-link-propagation/main.md) 각속도 합성식이다 — $\\{B\\}$가 $\\{A\\}$ 기준으로 \${}^A\\Omega_B$로, $\\{C\\}$가 $\\{B\\}$ 기준으로 \${}^B\\Omega_C$로 회전하는 경우:

$\${}^A\\Omega_C = {}^A\\Omega_B + {}^A_BR\\,{}^B\\Omega_C$$

이걸 미분하면(회전행렬 미분에 다시 \${}^A\\Omega_B\\times{}^A_BR$ 대입):

$$\\boxed{{}^A\\dot\\Omega_C = {}^A\\dot\\Omega_B + {}^A_BR\\,{}^B\\dot\\Omega_C + {}^A\\Omega_B\\times{}^A_BR\\,{}^B\\Omega_C}$$

선가속도 때와 달리 각가속도 식은 원점 이동 여부와 무관하게 하나의 형태로 바로 관절(회전이든 직동이든)에 적용된다 — 회전은 원점 사이 거리와 상관없는 양이기 때문이다. 실전 리커시브 형태(Craig 식 6.7, 회전 관절 — $\\dot\\theta_{i+1},\\ddot\\theta_{i+1}$는 관절 $i+1$ 자체의 회전 기여분):

$\${}^{i+1}\\dot\\omega_{i+1} = {}^{i+1}_{i}R\\,{}^i\\dot\\omega_i + {}^{i+1}_{i}R\\,{}^i\\omega_i\\times\\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1} + \\ddot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$$

**이해**: 선가속도와 각가속도 유도가 완전히 같은 패턴(속도 합성식을 미분 + 회전행렬 미분 대입)을 두 번 반복한 것이라는 점. **기억할 필요 없음**: 두 식의 세부 전개.

---

## 5. 토크와 회전 — 관성 모멘트라는 개념

가속도를 구했으니 이제 $F=MA$로 힘을 구할 차례인데, 회전에는 아직 손대지 않은 부분이 있다 — 토크와 각가속도 사이를 연결하는 매개체다.

$$F = Ma \\quad\\longleftrightarrow\\quad \\tau = I\\alpha$$

직선 운동에서 진량(質量, mass) $M$은 "같은 힘을 줬을 때 얼마나 가속이 안 되는가"의 척도였다. 회전에서 그 역할을 하는 게 관성 모멘트(moment of inertia) $I$(또는 $J$)다. 그런데 진량과 결정적으로 다른 점이 하나 있다 — **회전축의 위치**에 따라 같은 물체라도 관성이 달라진다.

막대 모양의 무게추를 가운데(무게중심)를 잡고 돌리면 잘 안 돌지만, 세워서(긴 축을 회전축으로) 돌리면 훨씬 쉽게 돈다 — 같은 진량인데 회전 중심의 위치와 방향만으로 필요한 토크가 달라진다는 뜻이다.

**이해**: 관성 모멘트는 "회전에 대한 진량"이라는 개념은 진량과 같지만, 축의 위치·방향에 의존한다는 근본적 차이가 있다. **꼭 기억**: 단위가 $\\text{kg}\\cdot\\text{m}^2$로 진량(kg)과 다르다 — 질량 분포가 회전축에서 얼마나 떨어져 있는지(거리)가 반영되기 때문이다.

역사적으로 관성 모멘트라는 개념은 1730년, 오일러(Euler)가 처음 도입했다 — 역학·수학 전반에 이름을 남긴 바로 그 오일러다.

---

## 6. 관성 텐서 — 스칼라가 될 수 없는 이유

진량은 방향에 상관없이 하나의 숫자(스칼라)면 충분했다 — 어느 방향으로 밀든 같은 진량이면 같은 가속도가 나온다. 관성 모멘트는 그럴 수 없다 — 팽이를 세워 돌리면 잘 돌지만, 같은 팽이를 눕혀 돌리면(진량은 같은데) 회전이 달라진다.

즉 회전축의 방향에 따라 관성이 다르므로, **관성을 하나의 스칼라가 아니라 방향별 값을 모두 담은 행렬(텐서)로 표현**해야 한다. 이렇게 방향에 따라 값이 달라지는 양을 텐서(tensor)라 부른다 — 딥러닝의 텐서(TensorFlow의 그 텐서)와 같은 어원의 "다양한 값의 조합"이라는 개념이다. 3차원 공간에서는 보통 $3\\times3$ 행렬로 표현하며, 이를 관성 텐서(inertia tensor)라 한다.

좌표계 $\\{A\\}$ 기준으로 정의된 관성 텐서:

$\${}^AI = \\begin{bmatrix}I_{xx} & -I_{xy} & -I_{xz}\\\\-I_{xy} & I_{yy} & -I_{yz}\\\\-I_{xz} & -I_{yz} & I_{zz}\\end{bmatrix}$$

- 대각 성분($I_{xx}, I_{yy}, I_{zz}$): 각 축을 중심으로 회전할 때의 관성 모멘트(principal moments of inertia에 대응하는 개념)
- 비대각 성분($I_{xy}, I_{xz}, I_{yz}$): 관성 곱(product of inertia) — 축이 기울어진 방향으로 돌 때 관성이 얼마나 "섞이는지"를 나타낸다

기준계 방향을 잘 선택하면(강체의 무게중심을 지나는 주축, principal axes) 비대각 성분을 전부 0으로 만들 수 있다. 하지만 로봇 팔의 링크는 그런 편한 축을 골라 쓸 수 없는 경우가 많아 일반적으로는 $3\\times3$ 전체가 필요하다.

**이해**: 관성이 텐서인 이유(축 방향 의존성). **기억할 필요 없음**: 텐서라는 이름 자체의 수학적 정의 — "방향별 관성 값의 모음" 정도로 충분하다.

---

## 7. 회전 운동 에너지로부터 관성 텐서 유도

관성 텐서가 왜 저런 형태인지 가장 직관적으로 보여주는 방법은 회전 운동 에너지를 통해서다.

강체를 아주 작은 질량 덩어리 $m_i$들로 쪼갠다고 하자(마인크래프트의 블록처럼). 각 조각이 속도 $\\vec v_i$로 움직인다면 전체 운동 에너지는 직선 운동 에너지 공식 $\\tfrac12mv^2$을 그대로 합산한 것이다 — 단 $v_i$가 벡터이므로 제곱 대신 내적을 쓴다.

$$T = \\sum_i \\frac12 m_i\\left(\\vec v_i\\cdot\\vec v_i\\right)$$

이제 이 조각이 회전축을 중심으로 반지름 $r_i$의 원운동을 한다고 하면, 선속도는 $v_i = r_i\\omega$(원운동의 기본 관계)이므로:

$$T = \\sum_i \\frac12 m_i r_i^2\\omega^2 = \\frac12\\left(\\sum_i m_i r_i^2\\right)\\omega^2$$

괄호 안의 항이 바로 관성 모멘트다.

$$\\boxed{I = \\sum_i m_i r_i^2 \\quad\\Longrightarrow\\quad T_r = \\frac12 I\\omega^2}$$

직선 운동의 $T=\\tfrac12mv^2$과 정확히 대응되는 회전판이며, $I$는 "질량 대신 회전에 쓰는 개념"이라는 게 다시 한번 확인된다.

여기서 $r_i$는 회전축으로부터의 수직 거리다. 회전축 방향을 단위벡터 $\\hat n$(방향 코사인 $\\cos\\alpha,\\cos\\beta,\\cos\\gamma$로 표현되는, $X,Y,Z$ 축과 이루는 각도)이라 하면:

$$r_{\\perp,i} = |\\vec r_i\\sin\\theta_i| = |\\vec r_i\\times\\hat n|$$

이 외적을 $x_i,y_i,z_i$ 성분으로 풀어 제곱하고 $\\sum m_i(\\cdot)$로 정리하면, 축 방향 코사인 $\\cos\\alpha,\\cos\\beta,\\cos\\gamma$의 계수로 각각 $I_{xx},I_{yy},I_{zz},I_{xy},I_{xz},I_{yz}$가 나뉘어 등장한다 — 이게 앞서 6절의 $3\\times3$ 관성 텐서가 만들어지는 이유다. (참고 영상: [Rotation of a Rigid Body about an Arbitrary Axis: Moments of Inertia](https://www.youtube.com/watch?v=K1c92HKeGGk), Pearson Education)

**기억할 필요 없음**: 외적을 $x_i,y_i,z_i$로 전개해 $I_{xy}$ 등을 뽑아내는 대수 전개 과정. **이해**: "축이 기울어진 방향으로 돌 때 관성 텐서가 필요한 이유"를 에너지 관점에서 얻었다는 결론.

---

## 8. 관성 텐서의 6개 성분 공식

정의를 적분식으로 쓰면(밀도 $\\rho$, 부피 요소 $dv$):

$$I_{xx}=\\iiint_V\\left(y^2+z^2\\right)\\rho\\,dv, \\qquad I_{yy}=\\iiint_V\\left(x^2+z^2\\right)\\rho\\,dv, \\qquad I_{zz}=\\iiint_V\\left(x^2+y^2\\right)\\rho\\,dv$$

$$I_{xy}=\\iiint_V xy\\,\\rho\\,dv, \\qquad I_{xz}=\\iiint_V xz\\,\\rho\\,dv, \\qquad I_{yz}=\\iiint_V yz\\,\\rho\\,dv$$

$\\rho\\,dv$는 아주 작은 질량 조각이고, 앞에 곱해지는 거리 제곱(또는 좌표곱)이 "그 조각이 회전축에서 얼마나 떨어져 있는가"를 나타낸다는 점에서 [7절](#7-회전-운동-에너지로부터-관성-텐서-유도)의 $I=\\sum m_ir_i^2$과 본질적으로 같은 식이다.

대각·비대각 성분이 각각 위·아래 텐서 행렬의 같은 자리 3개씩과 겹치므로($I_{xy}$가 두 자리에 나오는 식), 실제로 구해야 하는 건 이 **6개뿐**이다.

**이해**: $I=\\sum m_ir_i^2$이라는 하나의 개념이 축 조합에 따라 6개 적분식으로 갈라진다는 구조. **기억할 필요 없음**: 적분식 자체 — 실무에서는 계산기·CAD가 대신 해준다([10절](#10-실무에서-관성-텐서를-구하는-법)).

---

## 9. 예제 6.1 — 직육면체의 관성 텐서

균일 밀도 $\\rho$를 가진, 폭 $w$(X축) · 길이 $l$(Y축) · 높이 $h$(Z축)인 직육면체가 있고, 원점을 직육면체의 한 모서리에 둔다고 하자. 적분 범위는 각각 $x:0\\to w$, $y:0\\to l$, $z:0\\to h$다.

$$I_{xx}=\\int_0^h\\!\\!\\int_0^l\\!\\!\\int_0^w\\left(y^2+z^2\\right)\\rho\\,dx\\,dy\\,dz$$

$x$에 대한 적분은 피적분함수가 $x$와 무관하므로 단순히 $w$를 곱하는 것과 같다.

$$=\\int_0^h\\!\\!\\int_0^l\\left(y^2+z^2\\right)w\\rho\\,dy\\,dz$$

$y$에 대해 적분하면 $y^2\\to l^3/3$, $z^2\\to z^2l$:

$$=\\int_0^h\\left(\\frac{l^3}{3}+z^2l\\right)w\\rho\\,dz = \\left(\\frac{hl^3}{3}+\\frac{lh^3}{3}\\right)w\\rho$$

전체 질량 $m=\\rho\\,whl$(밀도 × 부피)로 치환하면 깔끔해진다:

$$\\boxed{I_{xx}=\\frac{m}{3}\\left(l^2+h^2\\right)}$$

직육면체는 세 축이 대칭이므로 나머지 두 대각 성분은 적분을 새로 할 필요 없이 문자만 바꿔주면 된다:

$$I_{yy}=\\frac{m}{3}\\left(w^2+h^2\\right), \\qquad I_{zz}=\\frac{m}{3}\\left(w^2+l^2\\right)$$

비대각 성분($I_{xy}$)도 같은 순서로 적분하되 피적분함수가 $xy$라서 각 축 적분이 독립적으로 떨어진다:

$$I_{xy}=\\int_0^h\\!\\!\\int_0^l\\!\\!\\int_0^w xy\\,\\rho\\,dx\\,dy\\,dz = \\int_0^h\\frac{w^2l^2}{4}\\rho\\,dz = \\frac{m}{4}wl$$

같은 방식으로:

$$I_{xz}=\\frac{m}{4}hw, \\qquad I_{yz}=\\frac{m}{4}hl$$

최종 관성 텐서:

$\${}^AI=\\begin{bmatrix}\\dfrac{m}{3}(l^2+h^2) & -\\dfrac{m}{4}wl & -\\dfrac{m}{4}hw\\\\[4pt] -\\dfrac{m}{4}wl & \\dfrac{m}{3}(w^2+h^2) & -\\dfrac{m}{4}hl\\\\[4pt] -\\dfrac{m}{4}hw & -\\dfrac{m}{4}hl & \\dfrac{m}{3}(w^2+l^2)\\end{bmatrix}$$

**이해**: 대칭 형상(직육면체)에서는 하나의 적분 패턴을 문자만 바꿔 재사용할 수 있다는 실전 팁. **기억할 필요 없음**: 최종 수치식 자체 — 직육면체 이외의 형상은 적분 범위·피적분함수가 전부 달라지므로 이 결과를 암기해도 재사용 가치가 낮다.

---

## 10. 실무에서 관성 텐서를 구하는 법

실무에서는 위 예제처럼 손으로 적분하는 일이 없다. 관성 텐서를 얻는 두 가지 현실적인 방법:

1. **측정** — 관성진자(inertia pendulum) 방법처럼, 물체를 특정 축 기준으로 매달아 진동시켜 실측한다.
2. **CAD 툴** — 로봇을 설계할 때 재질(알루미늄 합금 등)과 형상·두께를 CAD에 입력하면 관성 텐서가 자동으로 계산되어 나온다.

구(sphere)처럼 대칭성이 완벽한 형상은 예외적으로 방향에 관계없이 관성이 같아 스칼라 하나로 충분하지만, 대부분의 로봇 링크는 형상이 복잡해 이런 단순 공식이 통하지 않는다.

**꼭 기억**: 관성 텐서 자체는 "회전에 대한 특성을 전부 담은 값"이라는 개념만 알면 되고, 계산은 CAD·측정이 대신한다.

---

## 11. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| \${}^A\\dot V_Q$ | 좌표계 $\\{A\\}$ 기준 점 $Q$의 선가속도 | \${}^AV_Q$(5장 속도)의 시간 미분 |
| \${}^A\\dot\\Omega_C$ | 좌표계 $\\{A\\}$ 기준 $\\{C\\}$의 각가속도 | \${}^A\\Omega_C$의 시간 미분 |
| \${}^{i+1}\\dot v_{i+1}={}^{i+1}_iR\\left[{}^i\\dot v_i+{}^i\\dot\\omega_i\\times{}^iP_{i+1}+{}^i\\omega_i\\times({}^i\\omega_i\\times{}^iP_{i+1})\\right]$ | 회전 관절 선가속도 전파 (Craig 식 6.8) | 원점 사이 거리 불변 가정 |
| \${}^{i+1}\\dot\\omega_{i+1}={}^{i+1}_iR\\,{}^i\\dot\\omega_i+{}^{i+1}_iR\\,{}^i\\omega_i\\times\\dot\\theta_{i+1}{}^{i+1}\\hat Z_{i+1}+\\ddot\\theta_{i+1}{}^{i+1}\\hat Z_{i+1}$ | 회전 관절 각가속도 전파 (Craig 식 6.7) | 관절 자체 회전 기여분 두 항 추가 |
| $\\tau=I\\alpha$ | 토크-각가속도 관계 | $F=MA$의 회전판, $I$가 진량 $M$에 대응 |
| \${}^AI=\\begin{bmatrix}I_{xx}&-I_{xy}&-I_{xz}\\\\-I_{xy}&I_{yy}&-I_{yz}\\\\-I_{xz}&-I_{yz}&I_{zz}\\end{bmatrix}$ | 관성 텐서 ($3\\times3$) | 대각: 모멘트, 비대각: 곱(product of inertia) |
| $T_r=\\dfrac12I\\omega^2$ | 회전 운동 에너지 | $T=\\tfrac12mv^2$의 회전판, $I=\\sum m_ir_i^2$ |
| 역동역학 / 순동역학 | $(\\theta,\\dot\\theta,\\ddot\\theta)\\to\\tau$ / $\\tau\\to(\\theta,\\dot\\theta,\\ddot\\theta)$ | 제어용 / 시뮬레이션용 |

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 동역학의 위치 | 위치(기구학) + 속도(자코비안) + 정적 힘(static forces)을 전부 포함하는 상위 개념 — 가속도·토크까지 다룸 |
| 역동역학 / 순동역학 | $(\\theta,\\dot\\theta,\\ddot\\theta)\\to\\tau$(제어에 사용) / $\\tau\\to(\\theta,\\dot\\theta,\\ddot\\theta)$(시뮬레이션에 사용) |
| 선가속도 전파 (회전 관절) | \${}^{i+1}\\dot v_{i+1}={}^{i+1}_iR\\left[{}^i\\dot v_i+{}^i\\dot\\omega_i\\times{}^iP_{i+1}+{}^i\\omega_i\\times({}^i\\omega_i\\times{}^iP_{i+1})\\right]$ |
| 각가속도 전파 (회전 관절) | \${}^{i+1}\\dot\\omega_{i+1}={}^{i+1}_iR\\,{}^i\\dot\\omega_i+{}^{i+1}_iR\\,{}^i\\omega_i\\times\\dot\\theta_{i+1}{}^{i+1}\\hat Z_{i+1}+\\ddot\\theta_{i+1}{}^{i+1}\\hat Z_{i+1}$ |
| 관성 모멘트 $I$ | 회전에서 진량 $M$에 대응하는 개념. 회전축의 위치·방향에 따라 값이 달라짐 (단위 $\\text{kg}\\cdot\\text{m}^2$) |
| 관성 텐서 | $3\\times3$ 행렬, 대각=모멘트($I_{xx},I_{yy},I_{zz}$)·비대각=곱($I_{xy},I_{xz},I_{yz}$) — 축 방향 의존성 때문에 스칼라 불가 |
| 에너지 유도 | $T=\\sum\\tfrac12m_iv_i^2$에 $v_i=r_i\\omega$ 대입 → $I=\\sum m_ir_i^2$, $T_r=\\tfrac12I\\omega^2$ |
| 예제 6.1 (직육면체) | $I_{xx}=\\tfrac{m}{3}(l^2+h^2)$ 등 대각 3개, $I_{xy}=\\tfrac{m}{4}wl$ 등 비대각 3개 — 총 6개만 구하면 됨 |
| 실무 | 손 적분은 아무도 안 함 — 관성진자 측정 또는 CAD 툴이 자동 계산 |
| 이해 vs 암기 | 모든 유도 과정은 "외울 필요 없음" — 개념(왜 필요한지)과 최종 리커시브 공식·6개 적분식의 존재만 기억하면 됨 |
`,

  'Robotics/manipulator-mechanical-design': `---
title: 매니퓰레이터 기구 설계 — 센서·자유도·로봇 유형과 설계 지표 (Manipulator Mechanical Design)
date: 2026-08-08
tags: manipulator-design, degrees-of-freedom, workspace
order: 
featured: false
draft: false
---

# 매니퓰레이터 기구 설계 — 센서·자유도·로봇 유형과 설계 지표 (Manipulator Mechanical Design)

> 출처: 로봇제어공학 — Introduction to Robotics 8장 "매니퓰레이터 기구 설계(Manipulator Mechanical Design)"
> 영상: https://www.youtube.com/watch?v=1ZAGpiTyfEU&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=21
> 대상: [7장](../cartesian-space-trajectory-generation/main.md)까지 기구학·동역학·궤적 생성을 배운 상태에서, "그럼 실제로 로봇 팔을 어떻게 설계하는가"를 다루는 개론 성격의 장.

> [!NOTE]
> **이 장의 성격**
> 강의에서 이 장을 정독보다 가볍게 훑도록 안내했다.
> > 8장은 교양처럼 들으라고 했죠. 8장은 매니퓰레이터 기구 설계예요.
> 수식보다 개념·용어·설계 시 고려사항이 중심이며, 이후 9~10장(제어) 진입 전 배경지식에 해당한다.

---

## 목차
1. [로봇 시스템을 이루는 4가지 요소](#1-로봇-시스템을-이루는-4가지-요소)
2. [센서 — 엔코더·토크 센서·전류 센서](#2-센서--엔코더·토크-센서·전류-센서)
3. [말단 효과 장치(End Effector)](#3-말단-효과-장치end-effector)
4. [자유도(DOF) 결정 — 작업에 맞춰 줄이거나 늘리기](#4-자유도dof-결정--작업에-맞춰-줄이거나-늘리기)
5. [설계 시 고려 요소 — 작업 공간·하중·속도·반복성·정밀성](#5-설계-시-고려-요소--작업-공간·하중·속도·반복성·정밀성)
6. [산업용 로봇의 기하학적 유형](#6-산업용-로봇의-기하학적-유형)
7. [손목(wrist) 설계 — 4·5·6축을 한 점에 모으기](#7-손목wrist-설계--4·5·6축을-한-점에-모으기)
8. [설계 평가 지표 — 구조 길이 지수와 조작성 지수](#8-설계-평가-지표--구조-길이-지수와-조작성-지수)
9. [과다 자유도와 폐루프(닫힌 사슬) 구조 — 스튜어트 플랫폼](#9-과다-자유도와-폐루프닫힌-사슬-구조--스튜어트-플랫폼)
10. [액추에이터 종류](#10-액추에이터-종류)
11. [표현법 비교표](#11-표현법-비교표)
12. [Python 실습 코드](#12-python-실습-코드)

---

## 1. 로봇 시스템을 이루는 4가지 요소

로봇 팔을 만들려면 링크·관절·DH 파라미터만으로는 부족하다. 교재는 로봇 시스템의 구성 요소를 4가지로 정리한다.

1. **내부·자체(proprioceptive) 센서를 포함한 머니퓰레이터** — 관절 각도·속도·가속도, 토크를 측정
2. **말단 효과 장치(end effector)** — 팔 끝의 공구(그리퍼, 드라이버 등)
3. **비전 시스템, 부품 공급 장치 같은 외부 센서(external sensor)**
4. **제어기(controller)**

> 여러분 로봇을 만들려고 하면 뭐뭐가 필요해요? 당연히 센서가 들어있어야 돼요.

**이해**: 그동안 강의에서는 링크 길이·A·D 같은 DH 파라미터만 다뤘지만, 실제 로봇은 여기에 센서·엔드 이펙터·제어기가 더해져야 완성된다는 걸 짚고 넘어가는 절이다.

**"proprioceptive"라는 용어에 대해**:
> 프로프리오셉티브 센서다 이렇게 불렀는데, 이건 나도 처음 듣는 단어고, 안 쓰는 단어고.
실제로는 로봇 자체의 내부 상태(관절 각도 등)를 측정하는 센서를 가리키는 표준 용어이며, 외부 환경을 보는 외부(exteroceptive) 센서와 대비된다 — 강의에서는 생소하다고 했지만 로보틱스 문헌에서는 일반적으로 쓰인다.

## 2. 센서 — 엔코더·토크 센서·전류 센서

**엔코더(encoder)**: 가장 널리 쓰이는 내부 센서. 원래는 **위치만** 측정하지만, 위치를 미분하면 속도, 한 번 더 미분하면 가속도가 나온다.

> 원래 엔코더는 위치만 아는 건데, 위치를 미분하면 속도가 나오고, 한번 더 미분하면 가속도니까. 그래서 유추해내는 거고.

**토크 센서(torque sensor)**: 모터 축과 링크 사이에 끼워, 축이 비틀리는 정도(strain)로 전달 토크를 직접 측정한다.

![](8-1 토크 센서 구조.jpg)

모터축 — 토크 센서 — 링크 순으로 이어지며, 모터가 돌면서 토크 센서에 미세한 비틀림이 생기고 그 비틀림 양으로 토크를 역산한다.

> 저 토크 센서가 겁나 비싸요. 모터보다 더 비싸, 정확한 토크 센서는.

**전류 기반 토크 추정(실전에서 더 많이 쓰는 대안)**: 정밀 토크 센서가 비싸므로, 대신 모터에 흐르는 전류를 측정해 토크를 간접 추정하는 방법을 많이 쓴다.

$$I = \\frac{V}{R} \\quad(\\text{저항 } R \\text{은 고정}) \\qquad \\tau \\propto I$$

전압(PWM 제어값)을 바꾸면 저항이 일정하므로 전류가 바뀌고, 모터 특성상 **토크는 전류에 비례**한다. 그래서 전압·전류를 측정해 토크를 유추한다.

> 정확한 건 이거고(토크 센서), 이거 너무 비싸고, 이게 싸니까, 추가해야 할 게 별로 없으니까 이걸 많이 써요.

**실전 취급**: 정밀도가 꼭 필요한 협동로봇 손목 등에는 토크 센서를 쓰지만, 대부분의 관절에는 엔코더 + 전류 기반 토크 추정 조합이 비용 대비 실용적인 선택이다.

## 3. 말단 효과 장치(End Effector)

로봇의 손끝에 달려 작업을 실제로 수행하는 부분. 픽앤플레이스면 그리퍼, 드라이빙 작업이면 드라이버 형태 등 작업에 맞춰 다양하게 설계된다.

**사람 손과의 대비**: 사람은 엔드 이펙터가 손 하나뿐이라 대신 다양한 도구(드라이버, 드릴, 핀셋 등)를 갈아 끼우며 쓴다. 로봇은 도구를 쓸 필요 없이 작업 전용 엔드 이펙터를 바로 만들면 된다.

**사람 손을 그대로 흉내 낸 다관절 로봇 손이 실용적이지 않은 이유**: 손가락 관절 수가 팔 관절 수보다 훨씬 많아 만들기가 극도로 어렵고 비싸다.

> 저 시판되고 있는, 진짜 팔고 있는 손 중에 최고가는 1억이 넘어요. 손만. 팔은 뭐 몇천인데, 손이 1억이에요.

**실전 취급**: 범용성이 필요 없는 산업 현장에서는 작업 전용 그리퍼/공구를 쓰는 게 훨씬 경제적이다. 범용 다지 그리퍼(사람 손 모사)는 연구용·특수 목적에 주로 쓰인다.

## 4. 자유도(DOF) 결정 — 작업에 맞춰 줄이거나 늘리기

사람 팔은 6자유도이고, 손끝 위치·방위를 완전히 표현하려면 $X, Y, Z, R, P, Y$ 6개 변수가 필요하므로 **6관절이면 이론적으로 정확히 맞는다.**

하지만 항상 6관절이 필요한 건 아니다.

**예: 픽앤플레이스 → 4자유도로 충분**
위치는 $X, Y, Z$ 3개가 필요하지만, 잡은 물건을 손끝 각도까지 바꿔가며 옮길 필요는 없다 — 그냥 잡고 옮기기만 하면 되므로 회전은 1개(예: 위아래로 놓는 방향)면 충분하다.

**예: 용접 → 특정 각도 자유도를 없앨 수 있다**
항상 같은 방향으로 용접선을 따라가는 작업이라면, 그 방향을 결정하는 자유도 하나는 로봇이 아니라 **작업물(지그) 쪽을 회전시켜서** 대신할 수 있다.

> 그 용접하는 작업물을 이쪽으로 옮기면 되는 거 아니야. 후지 로봇이 거기 가서 각도를 틀어서 할 필요가 뭐 있어? 아까운 거지.

**예: 드라이버 작업 → 엔드 이펙터에 이미 회전 자유도가 내장**
드라이버는 그 자체로 계속 회전하는 도구이므로, Z축 회전 자유도가 엔드 이펙터에 이미 들어 있는 셈이다 — 로봇 팔에 별도로 그 회전 자유도를 추가할 필요가 없다.

**7자유도 이상 — 여유 자유도(redundant DOF)**
필요한 변수(6개)보다 관절이 많으면 남는 관절을 **여유 자유도**라 부른다.

$$\\text{관절 수} > 6 \\ \\Rightarrow\\ \\text{여유 자유도} = \\text{관절 수} - 6$$

여유 자유도는 사람이 하지 못하는 동작(예: 좁은 틈으로 팔꿈치를 굽혀 접근)을 가능하게 하지만, 관절 하나마다 모터·토크 센서·제어기·기구가 추가되어 **비용이 계속 올라간다.**

**저자유도 설계 — 팔은 단순하게, 작업물을 움직인다**
자유도를 높이는 건 설계·역기구학 난이도·비용이 모두 크게 늘어나는 일이다. 그래서 팔은 낮은 자유도(예: 4자유도)로 단순하게 만들고, 대신 **작업대(작업물)를 움직이는 축을 따로 추가**하는 설계도 흔하다.

> 여러분이 혼자 일할 거를 옆에 있는 친구한테 도와달라고 하는 거야. 야 옆으로 좀 움직여봐. 그러면 친구가 이렇게 돌려주면 나는 이것만 계속하면 되고.

예: 팔 4자유도 + 작업대 회전축 → 손끝은 가만히 있고 작업물이 돌면서 원 궤적을 만들어낼 수 있다(로봇이 굳이 원을 그릴 필요 없이).

**실전 취급**: 자유도는 "사람처럼 6개"가 기본값이 아니라 **작업이 실제로 요구하는 최소 자유도**를 먼저 분석하고 결정한다. 여유 자유도는 특수한 회피/접근 동작이 필요할 때만 비용을 감수하고 추가한다.

## 5. 설계 시 고려 요소 — 작업 공간·하중·속도·반복성·정밀성

| 요소 | 의미 | 비고 |
|---|---|---|
| **작업 공간(workspace)** | 팔 길이에 따라 결정되는 도달 가능 범위 | 팔이 짧으면 필요한 곳에 손이 안 닿는다(강의 예: UR3는 6축이지만 팔이 짧아 엘리베이터 버튼을 못 누름) |
| **하중(payload)** | 들 수 있는 최대 물체 무게 | UR3(3kg)·UR5(5kg)·UR10(10kg)처럼 제품명에 하중 스펙이 직접 붙기도 함 |
| **속도(speed)** | 관절이 움직일 수 있는 최대 속도 | 빠를수록, 하중이 클수록 가격 상승 |
| **반복성(repeatability)** | 같은 목표점을 반복해서 갈 때 도달 위치가 얼마나 일정한가 | 탄착군이 몰려 있음(정확도는 낮아도 됨) |
| **정밀성(accuracy)** | 지시한 목표점과 실제 도달점이 얼마나 가까운가 | 탄착군이 목표(10점)에 가까움 |

> 탄착군이 몰려있으면 반복성이 뛰어난 거야. 근데 그게 가운데 명중한 거에서 멀리 있어. 그래도 탄착군이 계속 거기에 잘 모여있으면 반복성은 뛰어난 거야. 정밀성은 떨어져.

**이해**: 반복성과 정밀성은 독립적인 지표다 — 반복성이 뛰어나도(항상 같은 곳에 도달) 정밀성은 나쁠 수 있다(그 위치가 목표와 떨어져 있음). 둘 다 좋은 로봇이 이상적이지만, 반복성만 좋아도 캘리브레이션으로 정밀성을 어느 정도 보정할 수 있다.

**DH 파라미터 설계 원칙(복습)**: [3-1](../denavit-hartenberg-parameters/main.md)에서 다룬 대로, $A, D$ 값을 가능하면 0 또는 90°로 단순하게 설계하면 정기구학·역기구학·자코비안이 모두 간단해진다.

**산업용 로봇의 전형적인 축 배치**: 밑에서부터 1~3축은 $X, Y, Z$ 위치를 담당하고, 손목 쪽 4~6축은 방위(orientation)를 담당하도록 설계하는 경우가 많다([PUMA 560](../forward-kinematics/main.md)도 이 구조).

## 6. 산업용 로봇의 기하학적 유형

### 6.1 갠트리(직교좌표) 로봇 — Cartesian/Gantry manipulator

![](8-1 Figure8.3 갠트리-직교좌표 로봇.jpg)

세 관절이 모두 **직선(프리즘) 관절**로 X, Y, Z를 각각 담당한다.

- **장점**: 제어가 매우 간단하다 — 목표 XYZ가 정해지면 해당 축 담당 모터에 바로 명령을 보내면 되고, 역기구학·기구학을 풀 필요가 없다.
- **단점**: 작업 공간이 딱 직육면체 박스 모양으로 제한되고, 로봇 구조물 자체가 작업 대상보다 커야 한다.

> 로봇이 작업물보다 더 커야 돼. 이만해야 돼. 작업물은 그 안에 들어와 있어야 돼.

### 6.2 다관절형 로봇 — Articulated manipulator

![](8-1 Figure8.4 다관절형 로봇.jpg)

우리가 지금까지 강의에서 다룬 것도 대부분 이 형태다. 회전 관절 위주라 작업장을 가장 적게 침입하는 구조(직교좌표 로봇보다 훨씬 작은 설치 공간으로 큰 작업 공간을 커버).

작업 공간 모양은 어깨 관절의 회전 범위 등 **DH 파라미터(링크 길이)에 따라 달라지는 부채꼴/초승달 모양**이며, 사람 팔처럼 안쪽 일부는 도달하지 못하는 빈 영역이 생긴다(예: 어깨가 뒤로 완전히 젖혀지지 않으므로). 가장 많이 쓰이지만, 그만큼 제어(역기구학·특이점 등)가 갠트리형보다 어렵다.

### 6.3 스카라(SCARA) 로봇

![](8-1 Figure8.5 SCARA 로봇.jpg)

Selective Compliance Assembly Robot Arm의 약자. 평행한 두 회전 관절($\\theta_1, \\theta_2$)로 XY 평면을 커버하고, 세 번째 프리즘 관절($d_3$)이 위아래(Z)를 담당하며, 마지막에 손끝 회전 관절 하나가 붙는다 — **3개의 평행 회전 관절 + 프리즘 관절** 구성.

> 다관절형 로봇보다 약 10배 정도 빠름. 평면 작업에 가장 적당하다.

픽앤플레이스처럼 손끝 각도가 중요하지 않고 XYZ + 회전 1개만 있으면 되는 작업에 최적화되어 있다 — [4절](#4-자유도dof-결정--작업에-맞춰-줄이거나-늘리기)에서 다룬 "4자유도로 충분한 작업"의 대표 사례.

> 이거는 너무 파퓰러해서 이게 진짜 제일 파퓰러하고 많이 쓰이는 로봇이에요.

### 6.4 구형(spherical)·원통형(cylindrical) 로봇

![](8-1 Figure8.6-8.7 구형·원통형 로봇.jpg)

- **구형(spherical) 매니퓰레이터**: 회전 2개 + 프리즘 1개(뻗는 축)로 대포(포신)처럼 움직인다. 데이터센터 등에서 보이는 형태.
- **원통형(cylindrical) 매니퓰레이터**: 회전 1개 + 프리즘 2개(위아래 + 뻗는 축)로 원통 좌표계를 그대로 따른다.

두 형태 모두 잘 쓰이지는 않지만, 좌표계 이름 그대로의 기하학적 직관을 준다는 점에서 개념적으로 이해해 둘 가치가 있다.

## 7. 손목(wrist) 설계 — 4·5·6축을 한 점에 모으기

![](8-1 Figure8.8 손목 구조.jpg)

4·5·6번 축을 **한 점에서 만나도록(orthogonal-axis, 나란히 한 축의 모임)** 설계하면 손목 부분의 기구학이 훨씬 단순해진다(축이 한 점에서 교차하면 [Pieper의 해](../inverse-kinematics-algebraic-geometric-pieper/main.md)가 적용 가능해져 역기구학이 폐형식으로 풀린다).

이를 기계적으로 구현하는 대표적인 방법이 **원격 위치 액추에이터 + 3중 동심축(concentric shaft)** 구조다 — 모터 3개($A_4, A_5, A_6$)를 손목에서 떨어진 곳에 두고, 속이 빈 동심 축 3개를 통해 회전을 전달해 $\\theta_4, \\theta_5, \\theta_6$을 만든다. 이렇게 하면 무거운 모터를 손목 끝이 아니라 팔 안쪽(무게 중심에 가까운 곳)에 배치할 수 있어, 손목 관성을 줄이고 팔 끝을 가볍게 만들 수 있다.

**실전 취급**: 이 동심축 구조는 협동로봇·산업로봇 손목의 실제 설계에서 흔히 쓰이는 패턴이며, "손목 자유도는 모터를 손목에 직접 달 필요가 없다"는 설계 아이디어의 핵심 사례다.

## 8. 설계 평가 지표 — 구조 길이 지수와 조작성 지수

![](8-1 구조길이지수·조작성지수 공식.jpg)

**구조 길이 지수(structural length index) $Q_L$** — 설계 효율성 지표: 팔을 얼마나 짧게 만들면서 작업 공간을 얼마나 크게 확보했는지 측정한다.

$$L = \\sum_{i=1}^{N}(a_{i-1}+d_i) \\qquad Q_L = \\frac{L}{\\sqrt[3]{w}}$$

$L$은 모든 관절의 DH 파라미터 $a, d$(길이 성분)를 합한 값이다. $w$(작업 공간 부피)는 길이의 세제곱 차원이므로, $L$과 차원을 맞추기 위해 세제곱근을 취한다.

> 팔을 짧게 만들었는데 작업 공간이 이렇게 많이 나와요, 좋은 거 아니야?

**낮은 $Q_L$일수록** 같은 팔 길이로 더 넓은 작업 공간을 확보했다는 뜻이므로 설계가 더 효율적이다.

**조작성 지수(manipulability measure) $w$** — 특이점에서 얼마나 멀리 떨어져 있는지를 측정하는 지표:

$$w = \\sqrt{\\det\\big(J(\\Theta)\\,J^T(\\Theta)\\big)}$$

관절 수와 작업 공간 자유도가 같은 정방(square) 자코비안의 경우 다음처럼 단순화된다:

$$w = |\\det(J(\\Theta))|$$

특이점은 $\\det(J(\\Theta))=0$인 지점이므로, **$w$가 클수록 특이점에서 멀리 떨어진 좋은 자세**라는 뜻이 된다.

**이해**: 여유 자유도가 있어 자코비안이 정방행렬이 아닌 경우엔 $J J^T$ 형태의 일반식을 쓰고, 정방행렬인 일반적인 경우엔 $|\\det(J)|$로 바로 계산할 수 있다 — $\\sqrt{\\det(J)\\det(J^T)} = \\sqrt{\\det(J)^2} = |\\det(J)|$이기 때문이다.

**아사다(Asada)의 조작성 지표 — 관성 타원체(inertia ellipsoid)**:

![](8-1 Figure8.12 관성타원체-Asada.jpg)

$$M_x(\\Theta) = J^{-T}(\\Theta)\\,M(\\Theta)\\,J^{-1}(\\Theta) \\qquad X^T M_x(\\Theta) X = 1$$

$M_x$는 [작업공간 질량행렬](../configuration-space-b-c-split-lagrangian-and-task-space-dynamics/main.md)이며, 이 식이 그리는 타원체가 그 위치에서 **작업 공간 방향별로 얼마나 잘 가속할 수 있는지**를 시각화한다. 타원체가 길쭉한 방향일수록 그 방향으로는 가속이 자유롭고, 짧은 방향일수록 가속이 제한된다 — 그림에서 팔 끝(작업 공간 경계)에 가까워질수록 타원체가 한쪽으로 눌리는 걸 볼 수 있다(더 멀리 뻗지 못하므로).

**실전 취급**: 조작성 지수·관성 타원체는 로봇 두 설계안을 비교하거나, 궤적이 특이점 근처를 지나는지 정량적으로 판단할 때 쓰는 지표다. 값을 외울 필요는 없고, "크면 좋은 것"이라는 방향성과 자코비안 행렬식과의 관계만 기억하면 된다.

## 9. 과다 자유도와 폐루프(닫힌 사슬) 구조 — 스튜어트 플랫폼

지금까지 다룬 로봇은 모두 **열린 사슬(open-loop/open-chain)** 구조 — 베이스에서 손끝까지 링크가 한 줄로 이어진다. 이와 대비되는 **폐루프(closed-loop/closed-chain)** 구조의 대표 예가 스튜어트 플랫폼(Stewart platform)이다.

![](8-1 Figure8.14 스튜어트 플랫폼.jpg)

베이스와 엔드 이펙터(윗판) 사이를 프리즘 액추에이터 6개($d_1$~$d_6$)가 병렬로 직접 연결하는 **6자유도 완전 병렬 머니퓰레이터(fully parallel manipulator)**다. 비행 시뮬레이터, 놀이공원 체험 기구 등에 쓰인다.

**폐루프 구조의 특징**:

| 항목 | 내용 |
|---|---|
| 강성(stiffness) | 증가함 — 여러 액추에이터가 하중을 나눠 받쳐 뻣뻣함 |
| 관절 운동 범위·작업 공간 | 축소됨 — 서로 묶여 있어 움직일 수 있는 범위가 좁음 |
| 역기구학 | 매우 간단함 |
| 정기구학 | 매우 복잡함 |

> 이 정도밖에 못 움직이고... 작업 범위가 되게 좁아. 좌우 공간이 되게 조그맣고 각도도 많이 안 변하거든요. 그럼 저걸 왜 써?

**왜 쓰는가 — 고하중(high payload)**: 엔드 이펙터를 액추에이터 6개가 동시에 떠받치므로, 무게가 6분의 1씩 나눠 실린다. 열린 사슬 로봇 팔은 끝에 무거운 물체를 달면 처지지만, 스튜어트 플랫폼은 훨씬 큰 하중을 버틸 수 있다.

**이해**: 역기구학이 간단한 이유는, 엔드 이펙터 자세가 정해지면 각 액추에이터의 길이가 기하학적으로 바로 계산되기 때문이다. 반대로 정기구학(6개 액추에이터 길이 → 엔드 이펙터 자세)은 6개의 비선형 연립방정식을 풀어야 해서 훨씬 어렵다 — 열린 사슬 로봇의 역기구학이 어려웠던 것과 정반대 구도다.

**여유 자유도·미소머니퓰레이터(micromanipulator)**: 과다 자유도(redundancy)와 함께, 큰 팔 끝에 작은 정밀 조작 장치(micromanipulator)를 추가로 다는 설계도 이 절에서 함께 언급된다 — 큰 팔이 대략적인 위치까지 이동하고, 손끝의 작은 장치가 정밀 보정을 담당하는 역할 분담이다.

## 10. 액추에이터 종류

| 종류 | 장점 | 단점 |
|---|---|---|
| **모터(전기)** | 제어가 쉽고 정밀함 — 로보틱스에서 기본 선택 | 회전 속도가 너무 빨라 감속(기어)이 필요, 백래시·마찰 발생 |
| **유압(hydraulic)** | 작은 에너지로 큰 힘을 낼 수 있음(예: 자동차 브레이크, 포크레인) | 제어가 어려움(유체 특성) |
| **공압(pneumatic)** | 구조 단순, 저렴 | 정밀 제어가 어려움 |

> 유압이 좋은 장점이 뭐예요? 아주 작은 에너지로 큰 힘을 다룰 수 있어요. 근데 뭐가 문제예요? 유압은 제어가 잘 안 돼요.

**모터 세부 종류**:

| 종류 | 특징 |
|---|---|
| **브러시(brush) DC 모터** | 전극을 기계적으로 바꿔주는 브러시 존재 — 마모되어 수명이 짧음 |
| **BLDC(Brushless DC) 모터** | 브러시 없음 — 마찰이 적어 더 오래, 더 고속으로 회전 가능. 현재 가장 많이 쓰임 |
| **AC 모터** | 힘은 좋지만 덩치가 크고 제어가 어려워 엘리베이터 등 제한적 용도에만 사용 |

**감속 필요성**: 모터는 회전 속도가 사람 관절 움직임보다 훨씬 빠르므로 기어로 감속해야 하고, 기어를 추가하면 백래시(backlash, 기어 간 유격에 의한 미세 오차)와 마찰이 함께 생긴다.

**강성(compliance)**: 모든 기계 부품은 어느 정도 휜다 — 아무리 튼튼하게 설계해도 무거운 물체를 잡으면 팔이 처지므로, 설계 단계에서 이를 감안해야 한다.

## 11. 표현법 비교표

| 기호/용어 | 의미 | 비고 |
|---|---|---|
| proprioceptive 센서 | 로봇 내부 상태(관절각·속도 등)를 측정하는 센서 | 엔코더가 대표적 |
| $\\tau \\propto I$ | 모터 토크는 전류에 비례 | 전압→전류→토크 순으로 간접 추정, 토크 센서 대체용 |
| 여유 자유도(redundant DOF) | 필요 변수(보통 6개)보다 많은 관절 수 | 특수 회피 동작 가능, 비용 증가 |
| 반복성 vs 정밀성 | 같은 곳에 도달하는 일관성 vs 목표와의 근접성 | 서로 독립적인 지표 |
| $Q_L = L/\\sqrt[3]{w}$ | 구조 길이 지수 — 팔 길이 대비 작업 공간 효율 | 낮을수록 효율적 설계 |
| $w=\\sqrt{\\det(JJ^T)}=\\lvert\\det(J)\\rvert$ | 조작성 지수 — 특이점과의 거리 | 클수록 특이점에서 멀다(좋음) |
| $M_x(\\Theta)=J^{-T}MJ^{-1}$ | 아사다 관성 타원체(작업공간 질량행렬) | 방향별 가속 능력을 타원체로 시각화 |
| 열린 사슬 vs 폐루프 | 링크가 일렬 vs 액추에이터가 병렬로 엔드 이펙터를 지지 | 폐루프: 역기구학 쉬움·정기구학 어려움·강성 높음·작업 공간 좁음 |
| BLDC | 브러시리스 DC 모터 | 현재 로봇 관절에 가장 널리 쓰이는 액추에이터 |

## 12. Python 실습 코드

\`\`\`python
import numpy as np

def torque_from_current(current, kt):
    """전류 -> 토크 추정 (토크 상수 kt 사용, tau = kt * I)."""
    return kt * current


def structural_length_index(a_list, d_list, workspace_volume):
    """구조 길이 지수 Q_L = L / w^(1/3)."""
    L = sum(a + d for a, d in zip(a_list, d_list))
    return L / (workspace_volume ** (1 / 3))


def manipulability(J):
    """조작성 지수 w = sqrt(det(J J^T)); 정방행렬이면 |det(J)|와 같다."""
    JJt = J @ J.T
    return np.sqrt(max(np.linalg.det(JJt), 0.0))


if __name__ == "__main__":
    # 전류 기반 토크 추정 예시
    print("추정 토크:", torque_from_current(current=2.0, kt=0.15), "N*m")

    # 2-링크 평면 로봇 자코비안 예시 (5-2절 정의 재사용)
    theta1, theta2 = np.radians(30), np.radians(45)
    l1, l2 = 0.3, 0.25
    J = np.array([
        [-l1*np.sin(theta1) - l2*np.sin(theta1+theta2), -l2*np.sin(theta1+theta2)],
        [ l1*np.cos(theta1) + l2*np.cos(theta1+theta2),  l2*np.cos(theta1+theta2)],
    ])
    print("조작성 지수 w:", manipulability(J))
    print("정방행렬이므로 |det(J)| =", abs(np.linalg.det(J)))
\`\`\`

**연습문제(TODO)**:

\`\`\`python
# TODO 1: 구조 길이 지수 비교
#   설계안 A: a_list=[0.3,0.3,0.1], d_list=[0.1,0,0.1], workspace_volume=0.5
#   설계안 B: a_list=[0.4,0.4,0.15], d_list=[0.1,0,0.1], workspace_volume=0.55
#   structural_length_index로 둘을 계산해 어느 쪽이 더 효율적인 설계인지 판단하라.

# TODO 2: 특이점 근접도 스캔
#   theta1을 0~180도로 스캔하며(theta2=45도 고정) manipulability(J) 값을 계산하고,
#   w가 0에 가까워지는(특이점에 가까운) theta1 구간을 찾아라.
#   힌트: 완전히 뻗은 자세(theta2=0 또는 180)에서 특이점이 발생하는지 확인.

# TODO 3: 반복성 vs 정밀성 시뮬레이션
#   목표점 (1.0, 1.0) 주변에 노이즈를 준 도달점 샘플 100개를 두 세트 생성하라:
#   세트 A(반복성 좋음, 정밀성 나쁨): 평균이 (1.1, 1.1)이고 표준편차가 작은 분포
#   세트 B(반복성 나쁨, 정밀성 좋음): 평균이 (1.0, 1.0)이고 표준편차가 큰 분포
#   각 세트의 평균(정밀성 지표)과 표준편차(반복성 지표)를 계산해 비교하라.
\`\`\`

**실전 연결**:
- ROS2 \`ros2_control\`의 하드웨어 인터페이스는 관절마다 \`position\`, \`velocity\`, \`effort\`(토크) 상태를 노출하는데, \`effort\`가 바로 이 장에서 다룬 토크 센서/전류 추정값이 흘러 들어오는 자리다.
- URDF의 \`<joint>\` 태그에서 \`type="prismatic"\`은 갠트리/스카라형 축, \`type="revolute"\`는 다관절형 회전 축을 표현한다 — 이 장에서 본 로봇 유형이 그대로 URDF 관절 타입 선택으로 이어진다.
- 조작성 지수·특이점 근접도는 MoveIt의 IK 솔버가 다중해 중 하나를 고를 때 내부적으로 참고하는 개념과 같은 뿌리다.

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 로봇 시스템 4요소 | 내부 센서 포함 머니퓰레이터, 엔드 이펙터, 외부 센서(비전 등), 제어기 |
| 센서 | 엔코더(위치→미분으로 속도·가속도), 토크 센서(비싸서 실전은 전류 기반 추정 선호) |
| 자유도 | 사람=6, 하지만 작업(픽앤플레이스=4, 용접=작업물 회전으로 대체 등)에 맞춰 조정. 초과분은 여유 자유도 |
| 설계 고려 요소 | 작업 공간(팔 길이), 하중, 속도, 반복성(일관성) vs 정밀성(정확도) |
| 로봇 유형 | 갠트리(제어 쉬움·공간 큼), 다관절형(작업장 침입 적음·제어 어려움), SCARA(평면 작업 특화·10배 빠름), 구형/원통형(대포형, 잘 안 씀) |
| 손목 설계 | 4·5·6축을 한 점에서 교차 + 동심축으로 모터를 원격 배치 → 손목 관성 감소, Pieper 해 적용 가능 |
| 설계 지표 | $Q_L=L/\\sqrt[3]{w}$(짧은 팔로 넓은 작업공간=효율적), $w=\\lvert\\det J\\rvert$(특이점과의 거리), Asada 관성 타원체(방향별 가속 능력) |
| 폐루프 구조 | 스튜어트 플랫폼 = 6축 완전 병렬. 역기구학 쉬움·정기구학 어려움, 고강성·고하중, 작업 공간은 좁음 |
| 액추에이터 | 모터(제어 쉬움, 기본 선택) > 유압(힘은 크지만 제어 어려움) > 공압. 모터 중 BLDC가 현재 표준 |
`,

  'Robotics/orientation-representations': `---
title: 3D 회전 표현법 총정리 (Orientation Representations)
date: 2026-08-08
tags: rotation, euler-angles
order: 
featured: false
draft: false
---

# 3D 회전 표현법 총정리 (Orientation Representations)

> 출처: 로봇제어공학 — Introduction to Robotics (Craig) 2장 2.8~2.10절 "방위에 관한 더 많은 표현"
> 영상: https://www.youtube.com/watch?v=PhpB9liQE00&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=4
> 대상: [회전행렬·매핑](../frames-and-mapping/main.md)과 [변환 행렬](../transformation-matrix/main.md)을 아는 사람. 이번 강의에서 방위 표현법 5가지를 배운다.

---

## 목차
1. [왜 여러 표현법이 필요한가](#1-왜-여러-표현법이-필요한가)
2. [X-Y-Z 고정각 (Roll-Pitch-Yaw)](#2-x-y-z-고정각-roll-pitch-yaw)
3. [역문제 — 회전행렬에서 RPY 꺼내기와 atan2](#3-역문제--회전행렬에서-rpy-꺼내기와-atan2)
4. [Z-Y-X 오일러 각](#4-z-y-x-오일러-각--움직이는-축-반대-순서-같은-결과)
5. [Z-Y-Z 오일러 각과 24가지 조합](#5-z-y-z-오일러-각과-24가지-조합)
6. [등가 각-축 (Equivalent Angle-Axis)](#6-등가-각-축-equivalent-angle-axis)
7. [오일러 파라미터와 쿼터니언](#7-오일러-파라미터와-쿼터니언-quaternion)
8. [짐벌락 (Gimbal Lock)](#8-짐벌락-gimbal-lock)
9. [교시(Teaching)와 계산 효율](#9-교시teaching와-계산-효율)
10. [표현법 비교표](#10-표현법-비교표)
11. [Python 실습 코드](#11-python-실습-코드)
12. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 왜 여러 표현법이 필요한가

로봇 제어의 본질은 딱 두 가지 대화다.

- **"너 지금 어떤 자세야?"** — 로봇의 3차원 위치와 방위를 **알아내기**
- **"앞으로 이런 자세를 해."** — 로봇에게 위치와 방위를 **지시하기**

> "그게 다예요. 제어는 끝이야, 그게."

위치는 쉽다. X, Y, Z 세 숫자면 끝이라 변환이랄 것도 없이 벡터 하나로 표현된다([위치 벡터](../frames-and-mapping/main.md)). 문제는 **방위(orientation)** 다. [방위를 표현하려면 3×3 회전행렬, 즉 숫자 9개가 필요하다](../frames-and-mapping/main.md).

그런데 [회전행렬은 수학적 성질(정규직교) 덕분에 사실 3개의 변수로 충분히 표현 가능하고, 거꾸로도 된다](../transformation-matrix/main.md). 사람이 로봇에게 "롤 얼마, 피치 얼마, 요 얼마"라고 각도 3개만 말해주면 서로 통한다는 뜻이다. 9개짜리 행렬을 불러주는 것보다 압도적으로 편하다.

### 롤·피치·요의 직관 — 비행기와 자동차

3차원 공간을 움직이는 비행기로 감을 잡는다 (모바일 로봇은 Z방향 움직임이 없어 잘 안 따지지만, 이번 학기의 로봇 매니퓰레이터는 3차원에서 움직이므로 셋 다 중요하다).

| 각도 | 축 | 비행기 | 자동차로 치면 |
|---|---|---|---|
| **롤 (Roll)** | X (진행 방향) | 날개가 좌우로 기우뚱 | 핸들을 급하게 좌우로 꺾을 때 차체가 좌우로 기우뚱거림 |
| **피치 (Pitch)** | Y (어깨 방향) | 기수가 위아래로 | 급브레이크에 앞으로 확 숙여짐, 급가속에 앞이 들림 |
| **요 (Yaw)** | Z (하늘 방향) | 기수가 좌우로 회전 | 코너를 돌 때 위(Z축)에서 보면 차가 돌아가는 것 |

이번 강의에서 배우는 방위 표현은 총 5가지다: ① X-Y-Z 고정각(RPY) ② Z-Y-X 오일러 각 ③ Z-Y-Z 오일러 각 ④ 등가 각-축 ⑤ 오일러 파라미터(쿼터니언).

> "결국 이 중에서 쓰는 건 롤피치요를 주로 많이 쓰고요, 좀 이따 쿼터니언이라고 그런 거 가끔 쓰고, 대부분 나머지는 그냥 이런 성질이 있다 정도만 이해하면 돼요."

---

## 2. X-Y-Z 고정각 (Roll-Pitch-Yaw)

### 정의

기준계 {A}와 일치하는 상태에서 시작해, {B}를 **고정된 {A}의 축 주위로** 세 번 회전시킨다.

1. $X_A$ 주위로 각도 $\\gamma$ (roll)만큼
2. $Y_A$ 주위로 각도 $\\beta$ (pitch)만큼
3. $Z_A$ 주위로 각도 $\\alpha$ (yaw)만큼

세 회전 모두 **고정된 기준계 {A}의 축** 주위로 행해진다는 것이 "고정각(fixed angles)"이라는 이름의 이유다. 변수는 그리스 문자 $\\gamma, \\beta, \\alpha$로 쓰지만 롤, 피치, 요라고 읽으면 된다.

### 행렬 순서 — 오른쪽부터 읽는다

$$
{}^{A}_{B}R_{XYZ}(\\gamma, \\beta, \\alpha) = R_Z(\\alpha)\\, R_Y(\\beta)\\, R_X(\\gamma)
$$

**가장 먼저 하는 회전(roll)이 가장 오른쪽**에 온다. [회전은 교환법칙이 성립하지 않으므로](../transformation-matrix/main.md) 순서가 결정적이다. 이 행렬 뒤에 벡터가 붙어 연산될 것을 생각하면, 오른쪽 끝에 있는 행렬이 제일 먼저 그 벡터와 곱해진다 — 그래서 첫 회전을 오른쪽 끝에 놓는 것이다.

> "각도가 어? 순서가 안 맞는데요? — 나도 그랬고 많은 로봇 하는 학생들이 이것 때문에 처음에 좀 헷갈렸어요."

각 축 회전행렬을 약자로 쓰면 ($c\\alpha = \\cos\\alpha$, $s\\alpha = \\sin\\alpha$ — 공학자들이 매번 cos, sin 쓰기 귀찮아서 만든 표기다):

$$
R_Z(\\alpha)R_Y(\\beta)R_X(\\gamma) =
\\begin{bmatrix} c\\alpha & -s\\alpha & 0 \\\\ s\\alpha & c\\alpha & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}
\\begin{bmatrix} c\\beta & 0 & s\\beta \\\\ 0 & 1 & 0 \\\\ -s\\beta & 0 & c\\beta \\end{bmatrix}
\\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & c\\gamma & -s\\gamma \\\\ 0 & s\\gamma & c\\gamma \\end{bmatrix}
$$

각 행렬의 구조는 [회전 행렬 빨리 쓰는 노하우](../transformation-matrix/main.md) 그대로다: 회전축에 해당하는 행·열은 0과 1, 나머지 네 칸이 $c, -s, s, c$.

### 전개 결과 — 외우지 말 것

3×3 곱셈 두 번(항 9개짜리 연산 × 2)을 다 해보면:

$$
{}^{A}_{B}R_{XYZ}(\\gamma, \\beta, \\alpha) =
\\begin{bmatrix}
c\\alpha c\\beta & c\\alpha s\\beta s\\gamma - s\\alpha c\\gamma & c\\alpha s\\beta c\\gamma + s\\alpha s\\gamma \\\\
s\\alpha c\\beta & s\\alpha s\\beta s\\gamma + c\\alpha c\\gamma & s\\alpha s\\beta c\\gamma - c\\alpha s\\gamma \\\\
-s\\beta & c\\beta s\\gamma & c\\beta c\\gamma
\\end{bmatrix}
$$

> "이걸 외워야 되냐? 회사 가서는 외울 필요는 없어. 그래도 이게 연산이 쉽지 않다는 게 딱 눈에 보이잖아요."

- **이해할 것**: 롤·피치·요 3개 각도 → 9개짜리 회전행렬이 만들어진다는 사실과 곱셈 순서(오른쪽부터).
- **외울 필요 없음**: 전개된 9개 항. 도구(scipy 등, [실습 코드](#11-python-실습-코드) 참고)가 해준다. 단, **이런 수식이 있다는 것은 기억해야** 나중에 구글에 검색이라도 할 수 있다.

### 기하학적 그림 (Figure 2.17)

처음에 {A}와 {B}가 겹쳐 있다가:

1. 겹친 X축을 기준으로 $\\gamma$만큼 돌리면 — X축은 그대로, Z축과 Y축이 같은 각도로 돌아간다. 여기까지는 머리에 그려진다.
2. 그 틀어진 상태에서 **{A}의 Y축** 기준으로 $\\beta$만큼 돌리면 — 이상하게 꼬이기 시작한다.
3. 다시 **{A}의 Z축** 기준으로 $\\alpha$만큼 돌리면 — 상상을 뛰어넘게 꼬인다. 그렇지만 계산으로는 된다.

> "여기서부터는 사람 머리에는 3차원 공간에 대한 회전이 잘 안 들어오게 되어 있어요. 머릿속에서 상상이 안 되는 게 정상이야. 그러니까 너무 걱정하지 마세요."

**실무 정리**: 사람↔로봇 사이의 방위 대화는 대부분 RPY 3개 각도로 한다. 행렬 전개는 도구에 맡긴다.

---

## 3. 역문제 — 회전행렬에서 RPY 꺼내기와 atan2

### 문제 상황

RPY → 회전행렬 방향은 됐다. 그런데 **반대**가 더 중요할 수 있다. 누군가(예: 센서, 다른 프로그램)가 9개짜리 회전행렬 $r_{11} \\dots r_{33}$을 알려줬을 때, "이 행렬을 만들려면 롤·피치·요가 각각 얼마죠?"를 거꾸로 알아낼 수 있는가?

> "원래라면 되게 어려워야 되는데, 알고 봤더니 되게 쉬워."

### 먼저 도구부터 — atan2는 왜 필요한가

일반 아크탄젠트는 **부호를 잃어버린다**. 점 $(x_1, y_1)$의 각도는 $\\theta_1 = \\tan^{-1}(y_1/x_1)$로 구해진다(중·고등학교 방식). 그런데 정반대 방향의 점 $(-x_1, -y_1)$을 넣으면:

$$
\\tan^{-1}\\!\\left(\\frac{-y_1}{-x_1}\\right) = \\tan^{-1}\\!\\left(\\frac{y_1}{x_1}\\right) = \\theta_1
$$

마이너스끼리 약분되어 **180° 차이 나는 완전히 다른 두 방향이 같은 값으로 나온다**. 수학처럼 값만 중요하면 상관없지만, 공간에서 방향을 표현할 때는 치명적이다.

그래서 만든 것이 **Atan2** — "아크탄젠트 업그레이드 버전"이다. 분자·분모를 나눠버리지 않고 **인수 2개를 따로 받아** 각 부호로 사분면을 판정한다.

| 입력 | 일반 arctan | Atan2 |
|---|---|---|
| $(2, 2)$ 방향 | 45° | Atan2(2.0, 2.0) = **45°** |
| $(-2, -2)$ 방향 | 45° (같아져 버림!) | Atan2(−2.0, −2.0) = **−135°** |

출력 범위가 4분면 전체(−180°~+180°)라 "4-사분면 arc tangent"라고도 부른다. Python(\`math.atan2(y, x)\` — **y가 먼저**), MATLAB(\`atan2\`), 대부분의 공학용 언어에 내장되어 있다. 로봇 코드에서 \`atan2\`가 툭 튀어나오면 바로 이 용도다.

### β 유도 — 항 비교 한 단계

[전개 행렬](#2-x-y-z-고정각-roll-pitch-yaw)의 1열을 보면 $r_{11} = c\\alpha c\\beta$, $r_{21} = s\\alpha c\\beta$, $r_{31} = -s\\beta$. 여기서 $r_{11}$과 $r_{21}$을 **제곱해서 더하면**:

$$
r_{11}^2 + r_{21}^2 = c^2\\alpha\\, c^2\\beta + s^2\\alpha\\, c^2\\beta = c^2\\beta\\,(c^2\\alpha + s^2\\alpha) = c^2\\beta
$$

피타고라스 항등식($\\cos^2 + \\sin^2 = 1$)이 $\\alpha$를 지워버린다. 루트를 씌우면 $c\\beta$가 남고, $s\\beta = -r_{31}$이므로:

$$
\\beta = \\text{Atan2}\\left(-r_{31},\\ \\sqrt{r_{11}^2 + r_{21}^2}\\right)
$$

같은 요령으로 나머지도 (β를 먼저 구한 뒤 $c\\beta$로 나눠서):

$$
\\alpha = \\text{Atan2}(r_{21}/c\\beta,\\ r_{11}/c\\beta), \\qquad
\\gamma = \\text{Atan2}(r_{32}/c\\beta,\\ r_{33}/c\\beta)
$$

### β의 범위 약속 — 제곱근의 부호 문제

위에서 $\\sqrt{c^2\\beta}$에 **양의 제곱근만** 썼다. 제곱은 $\\pm c\\beta$를 모두 품고 있으므로 원래는 해가 2개다. 마이너스를 빼먹으면 안 되지만, 넣자니 값이 2개 존재하게 된다. 그래서 **약속**을 했다:

$$
\\boxed{\\beta \\in [-90°, +90°]\\ \\text{범위에서만 계산한다}}
$$

이건 **외워야 하는 약속**이다 (수식이 아니라 컨벤션이므로).

### β = ±90°일 때 — 특이점

$\\beta = \\pm 90°$면 $c\\beta = 0$이라 α, γ 공식의 분모가 죽는다. 이때는 α와 γ가 따로 정해지지 않아(자유도 하나를 잃음 — [짐벌락](#8-짐벌락-gimbal-lock)의 수식 버전) 관례상 $\\alpha = 0$으로 놓고 구한다:

- $\\beta = +90°$: $\\alpha = 0,\\ \\gamma = \\text{Atan2}(r_{12}, r_{22})$
- $\\beta = -90°$: $\\alpha = 0,\\ \\gamma = -\\text{Atan2}(r_{12}, r_{22})$

**실무 정리**: 회전행렬 ↔ RPY는 양방향 모두 된다. 역방향의 핵심 도구는 atan2 하나뿐이고, "제곱해서 더해 피타고라스로 지운다"는 아이디어만 기억하면 된다.

---

## 4. Z-Y-X 오일러 각 — 움직이는 축, 반대 순서, 같은 결과

### RPY와 무엇이 다른가

이번엔 수학자 오일러(Euler)의 이름이 붙은 **오일러 각도**다. 똑같이 {A}, {B}가 겹친 상태에서 시작하지만 두 가지가 반대다:

| | X-Y-Z 고정각 (RPY) | Z-Y-X 오일러 각 |
|---|---|---|
| **회전 기준축** | 고정된 **{A}** 의 축 | 돌아가고 있는 **{B}** 의 축 |
| **회전 순서** | X → Y → Z | Z → Y → X |

1. {B}의 $Z_B$축 주위로 $\\alpha$만큼 회전
2. (돌아간) $Y_B$축 주위로 $\\beta$만큼 회전
3. (또 돌아간) $X_B$축 주위로 $\\gamma$만큼 회전

각 회전이 **그 전의 회전에 의해 주어진 위치에 놓인 축** 주위로 행해진다는 게 핵심이다. 여기의 α, β, γ는 롤·피치·요라고 부르지 않는다 — RPY는 워낙 많이 쓰여 사실상 고유명사가 됐지만, 오일러 각의 α, β, γ는 특별한 이름 없이 그냥 알파·베타·감마다.

> "나도 지금 뭐 20년 동안 했지만, 아직도 이게 머릿속에서 안 들어와요. 이미 돌아가 있는 애를 기준으로 또 돌리는 거야. 근데 그렇다고 이해를 하세요."

### 수식 유도 — 프라임 좌표계 체인

고정각 때는 모든 회전이 {A} 기준이라 직관적으로 바로 쓸 수 있었지만, 여기는 기준이 계속 변하므로 중간 좌표계에 이름을 붙인다: 첫 회전 후를 {B′}, 둘째 후를 {B″}, 셋째 후를 {B}. 그러면 [복합 변환](../transformation-matrix/main.md)처럼 체인으로 이어 쓴다:

$$
{}^{A}_{B}R = {}^{A}_{B'}R\\ {}^{B'}_{B''}R\\ {}^{B''}_{B}R = R_Z(\\alpha)\\,R_Y(\\beta)\\,R_X(\\gamma)
$$

### 신기한 결론 — RPY와 수식이 완전히 같다

전개해 보면 [X-Y-Z 고정각의 전개 행렬](#2-x-y-z-고정각-roll-pitch-yaw)과 **완전히 동일**하다:

$$
{}^{A}_{B}R_{Z'Y'X'}(\\alpha, \\beta, \\gamma) =
\\begin{bmatrix}
c\\alpha c\\beta & c\\alpha s\\beta s\\gamma - s\\alpha c\\gamma & c\\alpha s\\beta c\\gamma + s\\alpha s\\gamma \\\\
s\\alpha c\\beta & s\\alpha s\\beta s\\gamma + c\\alpha c\\gamma & s\\alpha s\\beta c\\gamma - c\\alpha s\\gamma \\\\
-s\\beta & c\\beta s\\gamma & c\\beta c\\gamma
\\end{bmatrix}
$$

교재도 이 점을 강조한다:

> "고정축 주위로 세 번 회전하여 얻은 결과는, 움직이는 축 주위로 **반대 순서로** 세 번의 같은 회전을 하여 얻은 결과와 똑같은 것에 주목하라."

상식적으로는 도저히 아닌 것 같은데 계산해 보면 나온다. 결과가 같으므로 Z-Y-X 오일러 각용 공식을 따로 외울 필요가 전혀 없다.

**실무 정리**: ZYX 오일러(움직이는 축) = XYZ 고정각(RPY)이므로, RPY 수식(정방향·역방향 모두)을 그대로 쓰면 된다. scipy에서는 소문자 \`'xyz'\`가 고정축(extrinsic), 대문자 \`'ZYX'\`가 움직이는 축(intrinsic)인데 둘이 같은 회전이다.

---

## 5. Z-Y-Z 오일러 각과 24가지 조합

### 같은 축을 두 번 써도 된다

오일러 각의 두 번째 버전. Z축으로 $\\alpha$, (돌아간) Y축으로 $\\beta$까지는 앞과 같은데, 마지막으로 X축이 아니라 **다시 (돌아간) Z축**으로 $\\gamma$만큼 돌린다. 이번엔 순서 자체가 다르므로 행렬도 처음부터 다르다:

$$
{}^{A}_{B}R_{Z'Y'Z'}(\\alpha, \\beta, \\gamma) = R_Z(\\alpha)\\,R_Y(\\beta)\\,R_Z(\\gamma) =
\\begin{bmatrix}
c\\alpha c\\beta c\\gamma - s\\alpha s\\gamma & -c\\alpha c\\beta s\\gamma - s\\alpha c\\gamma & c\\alpha s\\beta \\\\
s\\alpha c\\beta c\\gamma + c\\alpha s\\gamma & -s\\alpha c\\beta s\\gamma + c\\alpha c\\gamma & s\\alpha s\\beta \\\\
-s\\beta c\\gamma & s\\beta s\\gamma & c\\beta
\\end{bmatrix}
$$

역문제도 같은 요령이다 — 3열에서 $r_{13} = c\\alpha s\\beta$, $r_{23} = s\\alpha s\\beta$를 제곱해 더하면 $s\\beta$가 나오고, $r_{33} = c\\beta$와 atan2를 취하면 β가 나온다. β를 이용해 다른 항과 연동하면 α, γ도 구해진다.

### 24가지 표현법 — 유일한 금지 규칙

Z-Y-Z가 성립한다는 건 놀라운 일반 법칙의 한 예다. 세 번의 축 회전을 **순서에 상관없이 마음껏 섞어도** 3차원 공간의 어떤 방위든 표현할 수 있다는 것이 수학적으로 증명되어 있다 (X→Y→X도 되고, Z→X→Y도 되고, Z→Y→Z도 된다).

**딱 하나 안 되는 것**: 같은 축을 **연달아** 돌리는 것 (X→X→Y 등). 같은 축을 연속으로 두 번 돌리면 사실상 한 번 돌린 것과 같아 변수(기회) 하나를 잃어버리기 때문이다 — 이 "잃어버림"의 감각이 [짐벌락](#8-짐벌락-gimbal-lock)으로 이어진다.

조합을 세어 보면 **고정각으로 12가지 + 오일러 각으로 12가지 = 총 24가지**. 고정각 쪽은 수학자 카르다노(Cardano)의 이름을 따 **카르다노 각도**라고도 부른다 (교재 부록에 정리되어 있다).

> "20년 넘게 이걸 했지만 나도 관심이 안 생겨. 걱정하지 말고 꼭 기억해야 되는 거 이거다: 롤피치요 3가지 각도로 로테이션 매트릭스 만들 수 있다, 반대로도 구할 수 있다, 이때 atan2가 쓰인다. 그것만 기억하면 되고."

**실무 정리**: X-Z-Y니 Z-Y-Z니 하는 나머지 조합은 실무에서 거의 안 쓴다. "24가지가 존재하고, 같은 축 연속만 금지"라는 성질만 이해하면 된다.

---

## 6. 등가 각-축 (Equivalent Angle-Axis)

### 발상의 전환 — 직각좌표계에서 극좌표계로

지금까지의 표현(카르다노든 오일러든)은 전부 축을 **직각좌표계**(X·Y·Z축)로 본 것이다. 등가 각-축은 완전히 다른, [극좌표계](../frames-and-mapping/main.md)의 발상이다. 극좌표계에서 점을 "원점에서의 거리 + 각도"로 나타내듯, 회전을 이렇게 나타낸다:

> {A}와 일치하는 좌표계에서 시작해, {B}를 (원점을 지나는) **임의의 벡터 \${}^A\\hat{K}$ 주위로** 오른손 법칙에 따라 각 $\\theta$만큼 회전한다.

축이 X, Y, Z 단위축일 필요가 없다. 필요한 정보는:

- 벡터 $\\hat{K} = [k_x\\ k_y\\ k_z]^T$ — 스칼라 3개 (책에서 종벡터를 $[\\ \\cdot\\ ]^T$로 쓰는 건 지면 절약용 transpose 표기)
- 회전각 $\\theta$ — 스칼라 1개

즉 **스칼라 4개로 임의의 회전행렬을 표현**할 수 있다. 회전 방향은 [오른손 법칙](../transformation-matrix/main.md): 엄지를 $\\hat{K}$ 방향으로 두면 감기는 방향이 +각도다.

### 회전행렬 공식

$$
R_K(\\theta) =
\\begin{bmatrix}
k_x k_x v\\theta + c\\theta & k_x k_y v\\theta - k_z s\\theta & k_x k_z v\\theta + k_y s\\theta \\\\
k_x k_y v\\theta + k_z s\\theta & k_y k_y v\\theta + c\\theta & k_y k_z v\\theta - k_x s\\theta \\\\
k_x k_z v\\theta - k_y s\\theta & k_y k_z v\\theta + k_x s\\theta & k_z k_z v\\theta + c\\theta
\\end{bmatrix}
$$

여기서 $c\\theta = \\cos\\theta,\\ s\\theta = \\sin\\theta,\\ v\\theta = 1 - \\cos\\theta$. 임의의 벡터 기준 회전이라 $R_X R_Y R_Z$처럼 축별로 나눠 쓸 수 없고 이런 통짜 식이 된다. 이 공식이 바로 [회전 연산자 $R_K(\\theta)$](../transformation-matrix/main.md)에서 예고했던 그 행렬이며, 문헌에서는 **로드리게스 회전 공식(Rodrigues' rotation formula)** 이라고 부른다.

> "교수님은 이거 증명 안 했다. 그러면 여러분도 안 해도 된다. 그렇지만 어디에 있고, 이게 무슨 의미라는 건 알아야 된다."

역방향(회전행렬 → $\\hat{K}, \\theta$)도 당연히 구할 수 있다 (교재의 결과만):

$$
\\theta = \\text{Acos}\\!\\left(\\frac{r_{11}+r_{22}+r_{33}-1}{2}\\right), \\qquad
\\hat{K} = \\frac{1}{2\\sin\\theta}\\begin{bmatrix} r_{32}-r_{23} \\\\ r_{13}-r_{31} \\\\ r_{21}-r_{12} \\end{bmatrix}
$$

### 예제 2.8 — 축이 원점을 지날 때

$\\hat{K} = [0.707\\ 0.707\\ 0]^T$ (원점을 통과) 주위로 30° 회전. 회전만 했고 원점은 계속 겹쳐 있으므로 위치 변화가 없다. 그래서 회전행렬이 그대로 [변환 행렬](../frames-and-mapping/main.md)의 3×3 자리에 들어가고 위치 열은 0:

$$
{}^{A}_{B}T =
\\begin{bmatrix}
0.933 & 0.067 & 0.354 & 0.0 \\\\
0.067 & 0.933 & -0.354 & 0.0 \\\\
-0.354 & 0.354 & 0.866 & 0.0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

### 예제 2.9 — 축이 원점을 지나지 않을 때 (중요)

이번에는 같은 $\\hat{K}$가 원점이 아니라 **점 \${}^AP = [1.0\\ 2.0\\ 3.0]$을 통과**한다. 위 공식은 {A}, {B}, $\\hat{K}$가 전부 원점에서 만날 때만 맞는다. 원점이 떨어진 상태에서 회전시키면 {B}가 공간에서 크게 휩쓸려 움직이기 때문이다.

해결 아이디어 — **"일단 겹치게 옮기고, 돌리고, 다시 옮긴다"**:

1. {A}를 회전축 위의 점으로 평행이동한 새 좌표계 {A′}를 가정 → \${}^{A}_{A'}T$: 회전 없음(R = I), 위치만 $[1, 2, 3]$
2. 이제 모든 원점이 $\\hat{K}$ 위에 겹쳤으므로 예제 2.8의 회전 결과를 그대로 사용 → \${}^{A'}_{B'}T$
3. {B′}를 원래 자리로 되돌림 → \${}^{B'}_{B}T$: 위치만 $[-1, -2, -3]$ (기준이 B′이므로 부호가 반대)

[변환 행렬이 연달아 있으면 중간 첨자가 대각선으로 지워지므로](../transformation-matrix/main.md):

$$
{}^{A}_{B}T = {}^{A}_{A'}T\\ {}^{A'}_{B'}T\\ {}^{B'}_{B}T =
\\begin{bmatrix}
0.933 & 0.067 & 0.354 & -1.13 \\\\
0.067 & 0.933 & -0.354 & 1.13 \\\\
-0.354 & 0.354 & 0.866 & 0.05 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
$$

> "사람들 진짜 머리 엄청 좋지 않아요? 원점 좌표 변환 두 번 하고, 로테이션 한 번 돌렸더니 딱 이렇게 만들어진다."

4×4 행렬 세 개 연달아 손 계산은 10분쯤 걸리지만 MATLAB/Python이면 금방이다.

**실무 정리**: 등가 각-축은 "회전축이 어디에 있든 회전을 기술할 수 있다"는 도구이고, 원점을 안 지나는 축은 평행이동으로 원점 문제로 환원한다. 이 4개 스칼라 표현이 다음 절 쿼터니언의 재료가 된다.

---

## 7. 오일러 파라미터와 쿼터니언 (Quaternion)

### 정의 — 각-축의 재포장

[등가축 $\\hat{K}$와 등가각 $\\theta$](#6-등가-각-축-equivalent-angle-axis)라는 4개의 값을, 아무렇게나 쓰지 않고 **다음 룰에 따라** 재조합한 것이 **오일러 파라미터(Euler parameters)** 다 (오일러가 또 나온다 — "진짜 천재야, 천재"):

$$
\\epsilon_1 = k_x \\sin\\frac{\\theta}{2}, \\quad
\\epsilon_2 = k_y \\sin\\frac{\\theta}{2}, \\quad
\\epsilon_3 = k_z \\sin\\frac{\\theta}{2}, \\quad
\\epsilon_4 = \\cos\\frac{\\theta}{2}
$$

이 4개는 자동으로 $\\epsilon_1^2 + \\epsilon_2^2 + \\epsilon_3^2 + \\epsilon_4^2 = 1$을 만족한다. 오일러 파라미터를 4×1 벡터로 취급하는 방법이 바로 **유닛 쿼터니언(unit quaternion)** — 방위 표현의 다섯 번째이자 마지막 방법이고, 실무에서 RPY와 함께 가장 많이 쓰인다.

### 쿼터니언 ↔ 회전행렬

쿼터니언이 주어지면 (예: 누가 로봇에게 $\\epsilon_1 \\dots \\epsilon_4$를 알려주면) 회전행렬로 바꿀 수 있다:

$$
R =
\\begin{bmatrix}
1 - 2\\epsilon_2^2 - 2\\epsilon_3^2 & 2(\\epsilon_1\\epsilon_2 - \\epsilon_3\\epsilon_4) & 2(\\epsilon_1\\epsilon_3 + \\epsilon_2\\epsilon_4) \\\\
2(\\epsilon_1\\epsilon_2 + \\epsilon_3\\epsilon_4) & 1 - 2\\epsilon_1^2 - 2\\epsilon_3^2 & 2(\\epsilon_2\\epsilon_3 - \\epsilon_1\\epsilon_4) \\\\
2(\\epsilon_1\\epsilon_3 - \\epsilon_2\\epsilon_4) & 2(\\epsilon_2\\epsilon_3 + \\epsilon_1\\epsilon_4) & 1 - 2\\epsilon_1^2 - 2\\epsilon_2^2
\\end{bmatrix}
$$

거꾸로 회전행렬에서 쿼터니언도 구해진다:

$$
\\epsilon_4 = \\frac{1}{2}\\sqrt{1 + r_{11} + r_{22} + r_{33}}, \\qquad
\\epsilon_1 = \\frac{r_{32}-r_{23}}{4\\epsilon_4}, \\quad
\\epsilon_2 = \\frac{r_{13}-r_{31}}{4\\epsilon_4}, \\quad
\\epsilon_3 = \\frac{r_{21}-r_{12}}{4\\epsilon_4}
$$

결국 **RPY ↔ 회전행렬 ↔ 쿼터니언이 전부 양방향으로 변환된다**. 직각좌표계 스타일로는 RPY, 극좌표계 스타일로는 쿼터니언 — 이 두 가지가 표준이고, 워낙 많이 쓰여서 MATLAB·Python에 상호 변환이 내장함수로 다 들어 있다.

### 장단점 — 왜 둘 다 쓰는가

| | 장점 | 단점 |
|---|---|---|
| **오일러/RPY** | **직관적** — 사용자가 입력을 줄 수 있다 | 짐벌락 문제가 나타난다. 연산 속도가 느리다 |
| **쿼터니언** | **짐벌락이 없다. 연산 속도가 빠르다** | 직관적이지 않아 사용자 입력을 받을 수 없다 |

- **직관성**: 세상은 직각으로 되어 있다(중력 = Z축, 진행 방향 = X축, 어깨 방향 = Y축). "요를 30° 돌려"는 머리에 바로 그려지지만, "$\\epsilon_1$이 줄었어요"가 무슨 자세 변화인지는 사람 머리로 보이지 않는다. 그래서 쿼터니언으로는 로봇에 직접 명령을 줄 수가 없다.
- **연산 속도**: 위 쿼터니언 행렬식을 보라 — cos, sin이 없고 **제곱과 더하기·곱하기뿐**이다. 삼각함수를 계속 평가해야 하는 RPY보다 훨씬 빠르다.
- **짐벌락**: 아래 절 참고. RPY는 수식적으로도 짐벌락이 생기지만([β=±90° 특이점](#3-역문제--회전행렬에서-rpy-꺼내기와-atan2)) 쿼터니언은 수학적으로 이상한 값이 나올 기회가 아예 없다.

**실무 정리**: 사람이 읽고 쓰는 인터페이스는 RPY, 내부 연산·저장은 쿼터니언 — 컴퓨터/게임/ROS가 다 이 조합을 쓴다. ROS2의 \`geometry_msgs/Quaternion\`도 $(x, y, z, w)$ 4개 필드다 ($w$가 스칼라 $\\epsilon_4$). **라이브러리마다 성분 순서가 다르니(스칼라가 앞인지 뒤인지) 반드시 확인할 것.**

---

## 8. 짐벌락 (Gimbal Lock)

### 축을 하나 잃어버리는 현상

["같은 축을 연달아 돌리면 안 된다"](#5-z-y-z-오일러-각과-24가지-조합)고 했다 — X축 돌리고 또 X축 돌리고 Y축 돌리면, 세 번의 기회 중 하나를 날려서 방향을 전부 표현할 수 없게 된다. 짐벌락은 이 "변수 하나 잃어버림"이 **운동 중에 실제로 발생**하는 현상이다.

### 기관총 사수의 예

1차 대전 때 기관총 사수를 생각하자. 기관총은 두 축으로 움직인다: 좌우 회전(방위각) + 위아래(고도각).

- 평소: 왼쪽 목표든 오른쪽 목표든 좌우로 돌려서 조준하면 된다.
- 적기가 **바로 머리 위**로 오면: 총을 수직으로 들어 올리는 순간, 좌우 회전축과 총신 방향 축이 **겹쳐버린다**. 이 상태에서 옆 방향으로 조금만 틀고 싶어도 그 방향으로 갈 수가 없다 — 좌우 회전을 해봤자 총신이 제자리에서 빙글 돌 뿐이다. 다시 총을 내려서 돌린 후 올려야 한다.

게임(FPS에서 수직으로 위를 볼 때), 로켓 발사, 기관포 제어에서 실제로 생기는 심각한 문제다. RPY/오일러 각은 β = ±90°에서 이 문제가 **수식으로도** 나타나지만(분모의 $c\\beta = 0$), 쿼터니언은 짐벌락이 없다.

> "이해가 잘 안 되지? 유튜브에 짐벌락 동영상이 있으니까 다시 보여줄게. 게임을 하면 알아."

---

## 9. 교시(Teaching)와 계산 효율

### 교시 — 수식 없이 자세를 알려주는 방법

"로봇아, 이 방위로 가라"를 수식으로 일일이 표현하는 건 너무 어렵다 (줄자로 잴 수도 없다). 그래서 요즘 많이 쓰는 방법이 **교시(teach, 敎示)** — 사람이 로봇 팔 끝을 **직접 잡고** 원하는 위치·자세로 움직여서 시범으로 가르치는 것이다. "로봇아, 내 손끝 잡고 나를 따라오세요."

리모컨이나 손으로 직접 매니퓰레이터의 방위와 위치를 지정하는 이 방식이 산업 현장에서 널리 쓰이지만, 그럼에도 많은 경우 코딩이 필요하므로 회전행렬·변환 행렬·translate는 여전히 많이 쓴다.

### 계산 시 고려 사항 (2.10절)

같은 결과를 내는 계산도 **순서에 따라 연산 횟수가 다르다**. 예를 들어 세 번의 회전 \${}^AP = {}^A_BR\\,{}^B_CR\\,{}^C_DR\\,{}^DP$를 계산할 때:

- 회전행렬 3개를 먼저 다 곱하고 나서 $^DP$를 곱하면: 곱셈 63번 + 덧셈 42번
- **오른쪽부터** (행렬×벡터를 세 번) 계산하면: 곱셈 27번 + 덧셈 18번 (효율적)

사람 입장에선 덧셈 세 번이나 다섯 번이나 차이 없지만, 이걸 수백만 번 돌리면 몇 초를 절약하거나 낭비한다. 프로그램 짤 때 연산 순서를 고민하라는 것이 교재 마지막 페이지의 메시지다.

---

## 10. 표현법 비교표

| 표현법 | 변수 개수 | 기준 | 회전 순서/축 | 실무 사용 |
|---|---|---|---|---|
| 회전행렬 | 9 | — | — | 모든 표현의 공통 허브 (변환은 전부 이것을 경유) |
| **X-Y-Z 고정각 (RPY)** | 3 | 고정된 {A}의 축 | X→Y→Z | **주력.** 사람 입출력용 |
| Z-Y-X 오일러 각 | 3 | 움직이는 {B}의 축 | Z→Y→X | RPY와 수식이 같아 별도 취급 불필요 |
| Z-Y-Z 오일러 각 | 3 | 움직이는 {B}의 축 | Z→Y→Z | 거의 안 씀. 24가지 조합의 존재만 기억 |
| 등가 각-축 | 4 ($\\hat{K}, \\theta$) | 임의의 벡터 | 한 번의 회전 | 개념적 기반 (쿼터니언의 재료) |
| **쿼터니언** | 4 ($\\epsilon_{1..4}$, 단위 구속) | 극좌표 스타일 | — | **주력.** 내부 연산용 (빠름, 짐벌락 없음) |

---

## 11. Python 실습 코드

### 완성 코드 — 이 노트의 수식 전부 재현

\`\`\`python
import numpy as np
from scipy.spatial.transform import Rotation

d2r = np.deg2rad

# ── 기본 축 회전행렬 ──
def rot_x(deg):
    c, s = np.cos(d2r(deg)), np.sin(d2r(deg))
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

def rot_y(deg):
    c, s = np.cos(d2r(deg)), np.sin(d2r(deg))
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])

def rot_z(deg):
    c, s = np.cos(d2r(deg)), np.sin(d2r(deg))
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

# ── RPY → 회전행렬 (순서 주의: 첫 회전 roll이 가장 오른쪽) ──
def rpy_to_R(roll, pitch, yaw):
    return rot_z(yaw) @ rot_y(pitch) @ rot_x(roll)

# ── 회전행렬 → RPY (atan2 사용, beta ∈ [-90, +90] 약속) ──
def R_to_rpy(R):
    beta = np.arctan2(-R[2, 0], np.sqrt(R[0, 0]**2 + R[1, 0]**2))
    cb = np.cos(beta)
    alpha = np.arctan2(R[1, 0] / cb, R[0, 0] / cb)   # yaw
    gamma = np.arctan2(R[2, 1] / cb, R[2, 2] / cb)   # roll
    return np.rad2deg([gamma, beta, alpha])           # [roll, pitch, yaw]

R = rpy_to_R(10, 20, 30)
print(R_to_rpy(R))          # → [10, 20, 30] 복원 확인

# ── atan2 vs arctan: 부호 손실 확인 ──
print(np.rad2deg(np.arctan(-2 / -2)))      #  45.0  (방향 정보 소실!)
print(np.rad2deg(np.arctan2(-2, -2)))      # -135.0 (4분면 구별됨)

# ── scipy로 같은 계산 (실무에서는 이걸 씀) ──
# 소문자 'xyz' = 고정축(extrinsic) = RPY, 대문자 'ZYX' = 움직이는 축(intrinsic) 오일러
r1 = Rotation.from_euler('xyz', [10, 20, 30], degrees=True)
r2 = Rotation.from_euler('ZYX', [30, 20, 10], degrees=True)
print(np.allclose(r1.as_matrix(), r2.as_matrix()))   # True — 4절의 "같은 결과"

# ── 등가 각-축 (로드리게스): 예제 2.8 재현 ──
k = np.array([0.7070, 0.7070, 0.0])
k = k / np.linalg.norm(k)
R_28 = Rotation.from_rotvec(d2r(30) * k).as_matrix()
print(np.round(R_28, 3))    # → [[0.933 0.067 0.354] [0.067 0.933 -0.354] [-0.354 0.354 0.866]]

# ── 예제 2.9: 원점을 안 지나는 축 → T 세 개의 곱 ──
def make_T(R, p):
    T = np.eye(4); T[:3, :3] = R; T[:3, 3] = p
    return T

T_AAp = make_T(np.eye(3), [1, 2, 3])     # {A} → {A'}: 이동만
T_ApBp = make_T(R_28, [0, 0, 0])         # 원점 겹친 상태의 회전 (예제 2.8)
T_BpB = make_T(np.eye(3), [-1, -2, -3])  # {B'} → {B}: 반대 부호 이동
T_AB = T_AAp @ T_ApBp @ T_BpB
print(np.round(T_AB, 2))    # 위치 열 → [-1.13, 1.13, 0.05]

# ── 쿼터니언 ↔ 회전행렬 ──
# scipy .as_quat()는 [x, y, z, w] 순서 = [eps1, eps2, eps3, eps4] (스칼라가 뒤)
q = Rotation.from_matrix(R_28).as_quat()
print(q, np.sum(q**2))      # 단위 구속: 제곱합 = 1
print(np.allclose(Rotation.from_quat(q).as_matrix(), R_28))  # True
\`\`\`

### 연습 문제

\`\`\`python
# ── 연습 1: 역공식 직접 구현 (7절 검증) ──
# TODO: 회전행렬 R에서 eps4 = 0.5*sqrt(1+r11+r22+r33), eps1..3 = (r32-r23)/(4*eps4) 등을
#       직접 계산하는 R_to_quat(R)을 만들고, scipy .as_quat() 결과와 비교하라.
# 검증: np.allclose(R_to_quat(R_28), Rotation.from_matrix(R_28).as_quat())

# ── 연습 2: 짐벌락 관찰 (8절) ──
# TODO: pitch = 90도인 R = rpy_to_R(10, 90, 30)을 만들고 R_to_rpy(R)에 넣어보라.
#       cb = 0으로 무슨 일이 생기는가? scipy의 from_matrix(...).as_euler('xyz')는
#       어떤 경고를 내는가? (roll, yaw 중 하나가 임의로 정해짐을 확인)
# 검증: rpy_to_R(10, 90, 30)과 rpy_to_R(0, 90, 20)의 행렬이 같은지 np.allclose로 확인
#       (roll-yaw 차이 -20이 같으면 같은 자세 → 자유도 하나 상실)

# ── 연습 3: Z-Y-Z 오일러 각 (5절) ──
# TODO: R_zyz(alpha, beta, gamma) = rot_z(alpha) @ rot_y(beta) @ rot_z(gamma)를 만들고,
#       역문제 beta = atan2(sqrt(r13^2 + r23^2), r33)를 구현해 (40, 50, 60)을 복원하라.
# 검증: scipy Rotation.from_euler('ZYZ', [40, 50, 60], degrees=True).as_matrix()와 비교

# ── 연습 4: 연산 횟수 비교 (9절) ──
# TODO: R1 @ R2 @ R3 @ p를 (1) 행렬 먼저 다 곱하기 (2) 오른쪽부터 벡터 곱
#       두 방식으로 각각 100만 번 돌려 시간을 재라 (time.perf_counter).
# 검증: 결과 벡터는 동일, 오른쪽부터가 더 빠름
\`\`\`

---

## 핵심 요약 카드

> **방위 표현법 5가지** — 쓰는 건 RPY와 쿼터니언 두 개다.
>
> 1. **X-Y-Z 고정각 (RPY)**: 고정된 {A}축 기준 X→Y→Z 순서 회전. $R = R_Z(\\alpha)R_Y(\\beta)R_X(\\gamma)$ — **첫 회전이 가장 오른쪽**.
> 2. **Z-Y-X 오일러**: 움직이는 {B}축 기준, 반대 순서 — **RPY와 수식이 완전히 같다**. 따로 외울 것 없음.
> 3. **Z-Y-Z 오일러**: 같은 축도 연달아만 아니면 재사용 가능. 총 **24가지 조합** (카르다노 12 + 오일러 12).
> 4. **등가 각-축**: 임의의 축 $\\hat{K}$ + 각 $\\theta$, 스칼라 4개. 축이 원점을 안 지나면 **이동→회전→역이동** 세 개의 T로 분해.
> 5. **쿼터니언**: $\\epsilon_{1,2,3} = k_{x,y,z}\\sin\\frac{\\theta}{2}$, $\\epsilon_4 = \\cos\\frac{\\theta}{2}$, 제곱합 = 1.
>
> **역문제의 핵심 도구는 atan2** — 인수 2개의 부호로 4분면을 구별한다 (arctan은 180° 정보를 잃는다). β는 $[-90°, +90°]$ 약속.
>
> **RPY vs 쿼터니언**: 직관적·사람 입력용 = RPY (단, 짐벌락 있음) / 빠르고 짐벌락 없음·내부 연산용 = 쿼터니언 (단, 사람이 못 읽음).
>
> **외울 것**: 곱셈 순서 규칙, β 범위 약속, 장단점. **외우지 말 것**: 전개 행렬들 — scipy \`Rotation\`이 전부 해준다 (\`from_euler\`, \`from_rotvec\`, \`as_quat\`; 쿼터니언 성분 순서는 라이브러리마다 다르니 확인).
`,

  'Robotics/parallel-axis-theorem-and-newton-euler-algorithm': `---
title: 평행축 정리와 반복 뉴턴-오일러 알고리즘 — 핵심 정리본
date: 2026-08-08
tags: newton-euler, inertia-tensor
order: 
featured: false
draft: false
---

# 평행축 정리와 반복 뉴턴-오일러 알고리즘 — 핵심 정리본

> 코드·강사 인용구·실무 연결을 뺀 축약본. 수식과 "왜" 설명만 남긴다.

---

## 1. 왜 두 단계로 나뉘는가

[5장의 자코비안](../jacobian-velocity-kinematics-link-propagation/main.md)도, [6-1의 가속도 유도](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)도 링크 1번에서 손끝까지 한 방향으로만 순차 계산하면 끝났다. 반복 뉴턴-오일러 알고리즘은 여기서 한 단계 더 나아가 **왕복** 구조를 가진다.

| 단계 | 방향 | 무엇을 구하나 | 시작점 |
|---|---|---|---|
| 1단계 — 외향 반복(outward) | 링크 1 → 손끝 | 각속도·각가속도·선가속도(무게중심 포함) | 베이스(0번 관절)는 정지 — $\\omega,\\dot\\omega,\\dot v$ 모두 0 |
| 2단계 — 내향 반복(inward) | 손끝 → 링크 1 | 각 관절에 필요한 힘·토크 | 손끝에 원하는 외력/토크를 대입 |

왜 왕복이 필요한지는 [6절](#6-뉴턴의-운동방정식과-오일러의-운동방정식)에서 분명해진다 — 힘과 토크는 무게중심 기준 가속도·각가속도가 있어야 계산되는데, 그 가속도는 베이스에서부터 순서대로 쌓아 올려야만 나오기 때문이다. 그렇게 다 쌓은 다음에야 손끝의 요구사항(원하는 힘·토크)을 반영해 거꾸로 관절 토크를 끌어낼 수 있다.

---

## 2. 평행축 정리 — 문제 상황

[6-1 예제 6.1](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)에서 직육면체의 관성 텐서를 구했을 때, 원점을 직육면체의 한 모서리에 두고 적분했다. 그런데 회전 중심을 모서리가 아니라 무게중심으로 바꾸고 싶다면?

가장 단순한 해법은 적분 범위를 $0\\to w$ 대신 $-\\tfrac{w}{2}\\to\\tfrac{w}{2}$로 바꿔 처음부터 다시 삼중적분하는 것이다. 하지만 형상이 직육면체보다 복잡해지면(사다리꼴, 곡면 등) 이 재적분 자체가 비현실적으로 어려워진다.

평행축 정리(parallel-axis theorem)는 이 문제를 "적분을 처음부터 다시" 대신 "이미 구해놓은 값에 몇 개 항만 더하기"로 바꿔준다 — 단, 두 회전축이 서로 평행할 때만 성립한다.

---

## 3. 스칼라 형태 유도

물체가 원래 무게중심을 지나는 축을 기준으로 관성 모멘트 $I_{CM}=\\sum_i m_i r_i'^2$를 이미 알고 있다고 하자($r_i'$는 무게중심에서 측정한 거리). 이제 그 축과 거리 $a$만큼 평행이동한 새 축 $P$를 기준으로 하면, 새 축에서 질점 $m_i$까지의 거리 벡터는 $\\vec r_i = \\vec r_i' - \\vec a$ 로 쓸 수 있다.

$$I_P = \\sum_{i=1}^n m_i r_i'^2 + \\sum_{i=1}^n m_i a^2 - 2\\vec a\\cdot\\sum_{i=1}^n m_i \\vec r_i'$$

이 식은 $r_i = r_i' - a$를 제곱해서 각 항끼리 곱한 것과 같다 — [6-1 7절](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)에서 $I=\\sum m_ir_i^2$이 이미 나왔으므로 구조는 낯설지 않다.

여기서 세 번째 항이 마법처럼 사라진다: $\\vec a$는 상수 벡터이므로 시그마 밖으로 나올 수 있고, 남은 $\\sum m_i\\vec r_i'$는 **무게중심에서 측정한 위치의 질량 가중합**이라 정의상 0이다(무게중심 자신이 원점이므로).

$$I_P = \\underbrace{\\sum_{i=1}^n m_i r_i'^2}_{=\\,I_{CM}} + \\underbrace{\\sum_{i=1}^n m_i}_{=\\,M}a^2$$

$$\\boxed{I_P = I_{CM} + Ma^2}$$

**기억할 필요 없음**: $\\vec r_i=\\vec r_i'-\\vec a$ 대입 후 전개하는 대수 과정 자체 — 결론인 $I_P=I_{CM}+Ma^2$와, 반드시 $I_{CM}$에서 출발해야 한다는 방향성만 기억하면 된다.

---

## 4. 관성 텐서(행렬) 형태로 확장

3절은 스칼라(한 축에 대한 관성 모멘트) 버전이었다. 로봇 링크는 $3\\times3$ 관성 텐서 전체가 필요하므로, 좌표계 $\\{A\\}$로 표현된 관성 텐서를 무게중심 좌표계 $\\{C\\}$의 값으로부터 구하는 행렬 버전이 필요하다.

$$\\boxed{{}^AI = {}^CI + m\\left[P_c^TP_c\\,I_3 - P_cP_c^T\\right]}$$

- \${}^CI$: 무게중심을 원점으로 해서 이미 구해놓은 관성 텐서
- $P_c=[x_c,y_c,z_c]^T$: $\\{A\\}$ 기준으로 측정한 무게중심의 위치(3절의 $a$에 대응하는 벡터)

각 성분을 풀어 쓰면 3절의 스칼라 결과와 정확히 대응한다.

$\${}^AI_{zz} = {}^CI_{zz} + m(x_c^2+y_c^2), \\qquad {}^AI_{xy} = {}^CI_{xy} - mx_cy_c$$

### 왜 $P_c^TP_c\\,I_3 - P_cP_c^T$ 형태인가

$P_c$는 벡터라서 3절의 $a^2$처럼 단순히 "제곱"할 수 없다 — 벡터를 제곱하려면 방향을 맞춰 내적/외적으로 처리해야 한다.

- $P_c^TP_c$: $[1\\times3]\\cdot[3\\times1]$ 내적이라 **스칼라 하나**($x_c^2+y_c^2+z_c^2$)가 나온다. 이걸 $3\\times3$ 대각 형태로 쓰려고 $I_3$를 곱해준 것 — 3절의 $a^2$ 항에 대응.
- $P_cP_c^T$: $[3\\times1]\\cdot[1\\times3]$ 외적(outer product)이라 **$3\\times3$ 행렬**이 나온다(각 성분이 $x_c^2,x_cy_c,\\dots$).

두 항을 빼면 대각에는 $(x_c^2+y_c^2+z_c^2)-x_c^2 = y_c^2+z_c^2$ 같은 조합이, 비대각에는 $-x_cy_c$ 같은 곱항이 남아 위 성분별 공식이 정확히 재현된다.

**꼭 기억**: 성분별 전개 과정은 몰라도 되지만, 반드시 \${}^CI$(무게중심 기준)에서 출발해 $P_c$만큼 이동해야 한다는 순서는 거꾸로 쓰면 안 된다.

---

## 5. 예제 6.2 — 직육면체를 무게중심 기준으로

[6-1 예제 6.1](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)에서 모서리를 원점으로 구한 직육면체(폭 $w$·길이 $l$·높이 $h$) 텐서를, 이번엔 평행축 정리로 무게중심 기준으로 옮겨본다. 모서리에서 무게중심까지의 이동 벡터는 각 축 길이의 절반이다.

$$P_c = \\begin{bmatrix}x_c\\\\y_c\\\\z_c\\end{bmatrix} = \\frac12\\begin{bmatrix}w\\\\l\\\\h\\end{bmatrix}$$

이를 [4절 공식](#4-관성-텐서행렬-형태로-확장)에 대입하면(비대각 성분은 6-1 예제 6.1의 값 $-\\tfrac{m}{4}wl$ 등에서 정확히 $-m x_cy_c=-\\tfrac{m}{4}wl$이 상쇄되어 사라진다):

$\${}^CI_{zz} = \\frac{m}{12}(w^2+l^2), \\qquad {}^CI_{xy}=0$$

$\${}^CI = \\begin{bmatrix}\\dfrac{m}{12}(h^2+l^2) & 0 & 0\\\\[4pt] 0 & \\dfrac{m}{12}(w^2+h^2) & 0\\\\[4pt] 0 & 0 & \\dfrac{m}{12}(l^2+w^2)\\end{bmatrix}$$

[6-1](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)에서 이미 확인했던 관찰 — "회전축이 무게중심에 있으면 관성 텐서가 대각선만 존재한다" — 이 여기서 숫자로 검증된다.

- 모서리 기준이었던 6-1의 계수 $\\tfrac{m}{3}(\\cdots)$가 무게중심 기준에서는 $\\tfrac{m}{12}(\\cdots)$로, 정확히 4배 줄어든다.
- 이 감소는 평행축 정리 자체로 설명된다: $I_P=I_{CM}+Ma^2$이므로 $I_{CM}=I_P-Ma^2$는 항상 원래 값보다 작다.

**이해**: 평행축 정리를 거꾸로 써서(모서리 기준 → 무게중심 기준) "왜 무게중심 기준 텐서가 항상 더 작고 더 단순한(대각뿐인) 형태인지"를 숫자로 확인.

---

## 6. 뉴턴의 운동방정식과 오일러의 운동방정식

가속도([6-1](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md))와 관성 텐서(위 절들)를 모두 갖췄으니, 이제 힘·토크로 연결할 두 공식만 남았다.

$$\\boxed{F = m\\,\\dot v_C} \\qquad\\qquad \\boxed{N = {}^CI\\,\\dot\\omega + \\omega\\times {}^CI\\,\\omega}$$

- **뉴턴의 운동방정식**: 무게중심에 힘 $F$를 가하면 무게중심이 그 방향으로 가속도 $\\dot v_C$로 움직인다. $F=Ma$ 그대로다.
- **오일러의 운동방정식(Euler's equation of motion)**: 무게중심에 토크(모멘트) $N$을 가하면 물체가 회전한다. $\\tau=I\\alpha$와 비슷해 보이지만 $\\omega\\times {}^CI\\omega$라는 추가 항이 붙는다 — 회전에서만 나타나는 항이다.

- $N$에 위 첨자 $C$가 붙는 이유: 관성 텐서 \${}^CI$처럼 항상 무게중심 기준으로 계산되기 때문.
- $\\omega\\times{}^CI\\omega$ 항이 추가되는 이유: 관성 텐서 자체가 물체 좌표계에 고정되어 물체와 함께 회전한다. 그래서 회전 중에는 물체 자신의 각속도 $\\omega$가 관성 텐서와 상호작용해 추가 토크가 필요해진다 — 자이로스코프 세차운동을 일으키는 것과 같은 구조.

**기억할 필요 없음**: $\\omega\\times{}^CI\\omega$ 항이 유도되는 세부 과정. **꼭 기억**: 두 공식의 형태 — $F=m\\dot v_C$, $N={}^CI\\dot\\omega+\\omega\\times{}^CI\\omega$ — 다음 절의 반복 알고리즘에 그대로 들어간다.

---

## 7. 1단계 외향 반복

이제 [6-1의 가속도 전파식](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)에 $\\dot v_C$(무게중심 가속도)를 구하는 식, $F,N$을 구하는 식까지 더해 링크 $i:0\\to n-1$ 순서로($i+1$번째 값을 구하는 식) 계산한다.

$\${}^{i+1}\\omega_{i+1} = {}^{i+1}_iR\\,{}^i\\omega_i + \\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$$

$\${}^{i+1}\\dot\\omega_{i+1} = {}^{i+1}_iR\\,{}^i\\dot\\omega_i + {}^{i+1}_iR\\,{}^i\\omega_i\\times\\dot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1} + \\ddot\\theta_{i+1}\\,{}^{i+1}\\hat Z_{i+1}$$

$\${}^{i+1}\\dot v_{i+1} = {}^{i+1}_iR\\left({}^i\\dot\\omega_i\\times{}^iP_{i+1} + {}^i\\omega_i\\times({}^i\\omega_i\\times{}^iP_{i+1}) + {}^i\\dot v_i\\right)$$

$\${}^{i+1}\\dot v_{C_{i+1}} = {}^{i+1}\\dot\\omega_{i+1}\\times{}^{i+1}P_{C_{i+1}} + {}^{i+1}\\omega_{i+1}\\times\\left({}^{i+1}\\omega_{i+1}\\times{}^{i+1}P_{C_{i+1}}\\right) + {}^{i+1}\\dot v_{i+1}$$

$\${}^{i+1}F_{i+1} = m_{i+1}\\,{}^{i+1}\\dot v_{C_{i+1}}$$

$\${}^{i+1}N_{i+1} = {}^{C_{i+1}}I_{i+1}\\,{}^{i+1}\\dot\\omega_{i+1} + {}^{i+1}\\omega_{i+1}\\times{}^{C_{i+1}}I_{i+1}\\,{}^{i+1}\\omega_{i+1}$$

여섯 식은 딱 세 갈래로 이해하면 된다.

| 식 | 정체 | 어디서 왔나 |
|---|---|---|
| \${}^{i+1}\\omega_{i+1}$, \${}^{i+1}\\dot\\omega_{i+1}$ | 각속도·각가속도 전파 | 5장 각속도 합성식을 미분한 것([6-1 4절](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md) 그대로) |
| \${}^{i+1}\\dot v_{i+1}$, \${}^{i+1}\\dot v_{C_{i+1}}$ | 관절 원점 선가속도, 무게중심 선가속도 | [6-1 3절](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md) 그대로 + 평행축 정리 아이디어(관절 원점→무게중심으로 옮김) |
| \${}^{i+1}F_{i+1}$, \${}^{i+1}N_{i+1}$ | 무게중심에 작용하는 관성력·관성 토크 | 6절의 $F=m\\dot v_C$, $N={}^CI\\dot\\omega+\\omega\\times{}^CI\\omega$를 그대로 대입 |

베이스는 움직이지 않으므로 초기값이 전부 0이다.

$\${}^0\\omega_0 = 0, \\qquad {}^0\\dot\\omega_0 = 0, \\qquad {}^0\\dot v_0 = 0$$

여기서부터 $i=0\\to1\\to2\\to\\cdots$ 순서로 대입해 나가면 모든 링크의 각속도·각가속도·선가속도·무게중심 가속도·$F,N$이 차례로 구해진다.

**기억할 필요 없음**: 6개 식 전체를 암기하는 것 — 위 표의 인과 사슬 구조와, 시작 조건이 전부 0이라는 것(베이스 고정)만 기억하면 된다.

---

## 8. 2단계 내향 반복

7절에서 모든 링크의 $F_i, N_i$(무게중심 기준 관성력·관성 토크)를 구했다면, 이제 반대 방향으로 손끝($i=n$)에서 베이스($i=1$)까지 거슬러 올라가며 각 관절이 실제로 받는 힘·토크를 구한다.

$\${}^if_i = {}^i_{i+1}R\\,{}^{i+1}f_{i+1} + {}^iF_i$$

$\${}^in_i = {}^iN_i + {}^i_{i+1}R\\,{}^{i+1}n_{i+1} + {}^iP_{C_i}\\times{}^iF_i + {}^iP_{i+1}\\times{}^i_{i+1}R\\,{}^{i+1}f_{i+1}$$

$$\\tau_i = {}^in_i^T\\,{}^i\\hat Z_i$$

각 식이 뜻하는 바:

- \${}^if_i$ (링크 $i$가 받는 힘):
  - 다음 링크가 이쪽으로 밀어주는 힘 \${}^i_{i+1}R\\,{}^{i+1}f_{i+1}$ (회전행렬로 좌표계만 맞춰 옮긴 것)
  - \\+ 이 링크 자체의 관성력 $F_i$
  - 정지 상태였다면 정적힘 평형과 똑같은 구조다.
- \${}^in_i$ (링크 $i$가 받는 토크):
  - 자체 관성 토크 $N_i$
  - \\+ 다음 링크가 전달하는 토크
  - \\+ 힘 때문에 생기는 모멘트 두 개 ($P_{C_i}\\times F_i$, $P_{i+1}\\times f_{i+1}$)
  - 힘이 무게중심이나 관절에서 떨어진 지점에 작용하면 그 자체로 토크(모멘트팔 × 힘)가 생긴다는, 정역학과 동일한 원리다.

마지막 줄 $\\tau_i = {}^in_i^T\\,{}^i\\hat Z_i$이 알고리즘의 최종 결과다 — 토크 벡터 \${}^in_i$의 세 성분 중 **z축 성분만** 읽으면, 그게 모터가 실제로 내야 하는 관절 토크다.

**DH 파라미터**([DH 컨벤션](../denavit-hartenberg-parameters/main.md))로 각 관절 z축을 항상 회전축 방향으로 두기로 약속했기 때문에 이 "z 성분만 읽기"가 가능하다 — 직동 관절(prismatic joint)이라면 대신 힘 벡터 $f_i$의 z 성분을 읽는다($\\tau_i = {}^if_i^T\\,{}^i\\hat Z_i$).

**기억할 필요 없음**: 세 식의 세부 유도(첨자 정리·회전행렬 위치) — 관절 토크가 토크 벡터의 z 성분이라는 결론만 기억하면 된다.

---

## 9. 중력을 포함시키는 트릭

[5장 static forces](../jacobian-static-forces-and-geometric-jacobian/main.md)에서는 중력을 다루지 않았지만, 반복 뉴턴-오일러 알고리즘은 아주 단순한 트릭으로 중력까지 통째로 포함시킨다.

베이스는 원래 정지해 있으므로 \${}^0\\dot v_0=0$이었다. 이 초기값을 중력가속도 벡터 $G$로 바꾸기만 하면 된다.

$$\\boxed{{}^0\\dot v_0 = G}$$

베이스가 위쪽으로 $1g$만큼 가속하고 있다고 "가정"하면, [1단계](#7-1단계-외향-반복)의 재귀식이 이 값을 링크 1, 2, …로 그대로 전파시킨다. 등가원리(equivalence principle)에 의해, 이는 실제 중력이 아래로 당기는 것과 수학적으로 완전히 동일한 효과를 모든 링크에 자동으로 반영한다.

**이해**: 중력을 별도의 항으로 추가하는 게 아니라 "베이스가 가속하고 있다"는 가짜 초기조건 하나로 흡수시키는 아이디어 — 등가원리를 그대로 이용한 트릭.

---

## 10. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| $I_P = I_{CM}+Ma^2$ | 평행축 정리(스칼라) | $a$: 두 평행축 사이 거리, $I_{CM}$은 반드시 무게중심 기준 |
| \${}^AI = {}^CI + m[P_c^TP_cI_3 - P_cP_c^T]$ | 평행축 정리(관성 텐서) | $P_c$: $\\{A\\}$에서 본 무게중심 위치 |
| $F=m\\dot v_C$ | 뉴턴의 운동방정식 | 무게중심에 작용하는 관성력 |
| $N={}^CI\\dot\\omega+\\omega\\times{}^CI\\omega$ | 오일러의 운동방정식 | 무게중심에 작용하는 관성 토크, $\\omega\\times{}^CI\\omega$는 회전에서만 나오는 항 |
| \${}^{i+1}F_{i+1}=m_{i+1}{}^{i+1}\\dot v_{C_{i+1}}$, \${}^{i+1}N_{i+1}={}^{C_{i+1}}I_{i+1}{}^{i+1}\\dot\\omega_{i+1}+{}^{i+1}\\omega_{i+1}\\times{}^{C_{i+1}}I_{i+1}{}^{i+1}\\omega_{i+1}$ | 1단계 외향 반복 마지막 두 식 | $i:0\\to n-1$, 베이스 초기값 0(또는 중력 포함 시 $G$) |
| \${}^if_i={}^i_{i+1}R\\,{}^{i+1}f_{i+1}+{}^iF_i$, \${}^in_i={}^iN_i+{}^i_{i+1}R\\,{}^{i+1}n_{i+1}+{}^iP_{C_i}\\times{}^iF_i+{}^iP_{i+1}\\times{}^i_{i+1}R\\,{}^{i+1}f_{i+1}$ | 2단계 내향 반복 | $i:n\\to1$, 손끝 요구 힘/토크가 초기값 |
| $\\tau_i={}^in_i^T{}^i\\hat Z_i$ | 관절 토크 | 회전 관절: 토크 벡터의 z 성분, 직동 관절: 힘 벡터의 z 성분 |
| \${}^0\\dot v_0=G$ | 중력 포함 트릭 | 베이스가 $1g$로 가속한다고 가정 |
`,

  'Robotics/physical-ai-hardware-architecture': `---
title: 피지컬 AI 하드웨어 아키텍처 — 센서부터 실제 플랫폼까지
date: 2026-08-08
tags: physical-ai, sensor, actuator
order: 
featured: false
draft: false
---

# 피지컬 AI 하드웨어 아키텍처 — 센서부터 실제 플랫폼까지

> 출처: \`physical_ai_hardware_curriculum.md\` (자체 학습 계획 — 로봇 하드웨어가 왜 그렇게 설계되는지 이해하는 것이 목표)
> 대상: [8장](../manipulator-mechanical-design/main.md)에서 산업용 로봇 팔의 센서·자유도·액추에이터 기초를 익힌 뒤, 이를 휴머노이드/모바일 로봇 중심의 피지컬 AI 하드웨어 전반(고유수용감각, SEA/QDD, 실시간 제어, 온보드 컴퓨트, ROS, 실제 플랫폼 비교)으로 확장하는 자료.
> 관련 노트: [8-1 매니퓰레이터 기구 설계 — 센서·자유도·로봇 유형과 설계 지표 (Manipulator Mechanical Design)](../manipulator-mechanical-design/main.md) · [ROS 기초](../../ROS2/ros-basics/main.md) · [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../../ROS2/rclcpp-core-patterns/main.md) · [5-4 자코비안 — static forces와 자코비안 전치, 기하학적 자코비안 (Jacobian Static Forces & Geometric Jacobian)](../jacobian-static-forces-and-geometric-jacobian/main.md)

---

## 목차

1. [센서 — Perception Hardware](#1-센서--perception-hardware)
2. [액추에이터 — Actuation](#2-액추에이터--actuation)
3. [기구학 ↔ 하드웨어 연결](#3-기구학-↔-하드웨어-연결)
4. [실시간 제어 시스템](#4-실시간-제어-시스템)
5. [온보드 컴퓨트](#5-온보드-컴퓨트)
6. [소프트웨어 통합 기초 — ROS](#6-소프트웨어-통합-기초--ros)
7. [실제 플랫폼 통합 사례 분석](#7-실제-플랫폼-통합-사례-분석)
8. [설계 원칙 — 왜 이 순서인가](#설계-원칙--왜-이-순서인가)

---

## 1. 센서 — Perception Hardware

8장에서는 엔코더와 토크 센서를 "산업용 로봇 팔의 관절 센서"로만 다뤘다. 피지컬 AI(특히 보행 로봇·휴머노이드)에서는 여기에 IMU와 힘/토크 센서가 더해지고, 이 셋을 합쳐 **고유수용감각(proprioception)**이라 부른다 — 로봇이 외부 카메라 없이도 "지금 내 몸이 어떤 상태인가"를 아는 능력이다.

### 1.1 Encoder — 위치를 재는 두 가지 방식

| 종류 | 방식 | 특징 |
|---|---|---|
| **Incremental encoder** | 회전할 때마다 펄스를 세어 상대 위치를 누적 | 저렴하고 정밀하지만, 전원이 꺼지면 "몇 펄스를 셌는지"가 사라진다 |
| **Absolute encoder** | 회전각마다 고유한 코드(그레이 코드 등)를 광학/자기 방식으로 직접 읽음 | 전원을 껐다 켜도 각도를 즉시 알 수 있다 |

**왜 absolute encoder가 재시작 시 중요한가**: incremental encoder만 쓴 관절은 전원이 나갔다 들어오면 "지금 관절이 몇 도인지"를 모른다 — 반드시 한쪽 끝까지 움직여 기준점을 다시 찾는 **호밍(homing)** 과정이 필요하다. 사람이 서 있는 자세 그대로 전원을 켜야 하는 휴머노이드는 호밍할 여유가 없으므로, 관절마다 absolute encoder(또는 배터리 백업이 있는 encoder)를 쓰는 이유가 여기 있다.

### 1.2 IMU — 관성 측정 장치

- **자이로스코프**: 각속도(회전 속도)를 측정
- **가속도계**: 선형 가속도(중력 포함)를 측정
- 이 둘을 합쳐 **자세 추정(orientation estimation)**을 한다 — 몸통이 얼마나 기울었는지, 얼마나 빠르게 기울고 있는지를 안다.

**센서 퓨전 맛보기**: 가속도계는 정지 상태에서 "중력 방향"으로 기울기를 정확히 알 수 있지만 진동에 약하고, 자이로는 순간적인 회전은 정확하지만 적분을 계속하면 오차가 누적(drift)된다. **칼만 필터(Kalman filter)** 같은 센서 퓨전은 이 둘의 장단점을 상호 보완해 — 짧은 시간은 자이로를, 긴 시간의 기준은 가속도계를 신뢰하는 식으로 — 더 안정적인 자세 추정치를 만든다. (수식 유도는 이후 별도 노트에서 다룰 예정.)

### 1.3 Force/Torque 센서

관절 축이나 발끝(족저, foot sole)에 부착해 그 지점에 걸리는 힘·토크를 직접 측정한다. 8장에서 다룬 관절 토크 센서(축 비틀림 측정)와 원리는 같지만, 위치가 발끝으로 오면 "지금 발이 지면에 얼마나 세게, 어느 방향으로 닿아 있는가"를 알 수 있어 **보행 중 접지 판단(contact detection)**과 균형 제어의 핵심 입력이 된다.

### 1.4 Proprioception — 세 센서의 통합 개념

| 센서 | 답하는 질문 |
|---|---|
| Encoder | 관절이 지금 몇 도인가? (미분하면 속도·가속도) |
| IMU | 몸통이 어느 방향으로, 얼마나 빠르게 기울고 있는가? |
| F/T 센서 | 발/손에 지금 얼마의 힘이 걸리고 있는가? |

세 가지를 합치면 로봇은 카메라 없이도 "내 관절 각도 + 내 몸통 자세 + 내 발에 걸린 힘"만으로 자기 몸 상태를 안다 — 이것이 고유수용감각이며, 4단계(실시간 제어)와 7단계(플랫폼 사례)에서 다루는 균형 제어 루프의 핵심 입력이 된다. (외부 환경을 보는 카메라·라이다는 exteroceptive 센서로, proprioception과 대비되는 개념 — [8-1 1절](../manipulator-mechanical-design/main.md) 참고.)

---

## 2. 액추에이터 — Actuation

1단계(입력)와 짝을 이루는 출력 쪽. 8장의 액추에이터 종류 비교표를 휴머노이드 관점에서 확장한다.

### 2.1 전기모터 vs 유압 vs 공압

| 구동 방식 | 힘 대 무게 비율 | 정밀도 | 유지보수 | 발열 |
|---|---|---|---|---|
| 전기모터 (BLDC/서보) | 중간 | 높음 (전류 제어로 정밀) | 쉬움 | 낮음~중간 |
| 유압(hydraulic) | 매우 높음 | 낮음 (유체 특성상 제어 어려움) | 어려움 (누유, 펌프 마모) | 높음 |
| 공압(pneumatic) | 낮음 | 매우 낮음 (공기 압축성 때문) | 쉬움, 저렴 | 낮음 |

Boston Dynamics의 구형 Atlas가 유압을 택했던 이유는 "힘 대 무게 비율"이 압도적이었기 때문이고, 최근 전기 구동으로 전환한 이유는 정밀도·유지보수·효율 쪽이 무게중심을 옮겼기 때문이다 (7단계에서 다시 다룸).

### 2.2 기어비와 백드라이버빌리티

**물리적 직관 — 자전거 기어**: 낮은 기어(페달을 많이 돌려야 조금 감)로는 오르막을 오르기 쉽지만, 반대로 뒷바퀴를 손으로 돌려 페달을 역으로 움직이려면 훨씬 힘이 든다. 기어비가 높을수록 모터 쪽 힘은 증폭되지만, 반대로 **외부에서 관절을 밀었을 때 그 힘이 모터까지 전달되기 어려워진다** — 이 "외력에 얼마나 순응하는가"가 백드라이버빌리티(backdrivability)다.

- **높은 기어비**: 토크 증폭 ↑, 백드라이버빌리티 ↓ (외력을 못 느낌, 충돌 시 딱딱하게 부딪힘)
- **낮은 기어비**: 토크 증폭 ↓, 백드라이버빌리티 ↑ (외력을 잘 느낌, 순응적·안전함)

### 2.3 SEA (Series Elastic Actuator)

모터와 링크 사이에 **의도적으로 탄성 요소(스프링)**를 직렬로 끼운 구조.

- 충격을 스프링이 먼저 흡수 → 기어·모터 보호
- 스프링의 변형량(변위)으로 힘을 역산할 수 있어 **힘 제어(force control)**가 쉬워짐 — 8장의 "전류 기반 토크 추정"보다 훨씬 직접적인 힘 측정 수단
- 단점: 스프링이 있는 만큼 위치 제어의 정확도·대역폭(반응 속도)은 떨어짐

### 2.4 QDD (Quasi-Direct Drive)

기어비를 낮게(보통 10:1 이하) 유지해 모터를 거의 직결(direct drive)에 가깝게 사용하는 방식. 기어비를 낮추면 토크가 줄어드는 문제를, 애초에 **토크 밀도가 높은 대구경·저속 BLDC 모터**를 써서 상쇄한다.

**왜 Unitree, MIT Cheetah 계열이 QDD를 선호하는가**: 다리 로봇은 착지 순간 충격을 관절이 유연하게 흡수해야 하고(백드라이버빌리티 필요), 동시에 빠른 힘 제어 반응(SEA보다 빠른 대역폭)이 필요하다. QDD는 낮은 기어비로 백드라이버빌리티를 확보하면서도 스프링 같은 유연 요소 없이 힘 제어가 가능해, 다리 로봇의 요구사항(충격 흡수 + 빠른 반응)을 동시에 만족시킨다.

| 방식 | 백드라이버빌리티 | 힘 제어 대역폭 | 대표 사례 |
|---|---|---|---|
| 고기어비 서보 (산업용 팔) | 낮음 | 낮음 (위치 제어 위주) | 대부분의 산업용 매니퓰레이터 |
| SEA | 높음 (스프링 유연성) | 중간 (스프링이 대역폭 제한) | 초기 보행 로봇 다수 |
| QDD | 높음 (낮은 기어비 자체) | 높음 | Unitree, MIT Cheetah, 다수 최신 휴머노이드 다리 |

---

## 3. 기구학 ↔ 하드웨어 연결

[DH 파라미터](../denavit-hartenberg-parameters/main.md)·[역기구학](../inverse-kinematics/main.md)·[자코비안](../jacobian-velocity-kinematics-link-propagation/main.md) 개념은 기존 지식이 탄탄하므로, 여기서는 "그 지식이 왜 하드웨어 선택으로 이어지는가"만 응용 관점으로 정리한다.

- **DOF 증가 → 트레이드오프**: 자유도가 늘어날수록 필요 액추에이터 수·배선·제어 채널이 늘어나 무게·전력·제어 복잡도가 함께 증가한다 — [8-1 4절](../manipulator-mechanical-design/main.md)의 "작업에 필요한 최소 DOF" 원칙이 휴머노이드에서는 "다리당 몇 DOF를 줄 것인가"의 설계 논쟁으로 이어진다.
- **자코비안으로 토크 요구량 역산**: $\\tau = J^T \\mathcal{F}$ ([5-4](../jacobian-static-forces-and-geometric-jacobian/main.md)) — 손끝(또는 발끝)에 필요한 힘 $\\mathcal{F}$가 정해지면, 자코비안 전치를 곱해 각 관절이 내야 할 토크를 거꾸로 계산할 수 있다. 이 값이 곧 액추에이터 사양(모터 토크·기어비)을 정하는 입력이 된다.
- **근위부 vs 원위부 액추에이터 선택**: 몸통에 가까운(근위부) 관절은 몸 전체 하중을 지지해야 해 강한 토크(고기어비 서보)가 유리하고, 발끝에 가까운(원위부) 관절은 가벼움과 백드라이버빌리티(QDD)가 더 중요해진다 — 링크 배치가 곧 2단계의 액추에이터 선택으로 직결된다.

---

## 4. 실시간 제어 시스템

**오개념 교정**: "실시간(real-time) = 빠른 연산"이 아니다. **정해진 시간 안에 응답이 100% 보장됨**이 실시간의 정의다.

> 평균 처리 속도가 아무리 빨라도, 어쩌다 한 번이라도 마감(deadline)을 놓치면 그 시스템은 실시간이 아니다.

로봇 균형 제어에서 이게 왜 치명적인가: 넘어지려는 로봇이 100번 중 99번은 1ms 안에 반응해도, 단 한 번 10ms가 걸리면 그 한 번에 넘어진다. "평균적으로 빠름"은 balance control에서 의미가 없고, "최악의 경우에도 보장된 응답 시간"만이 의미가 있다.

### 4.1 제어 계층 구조

| 계층 | 주기 | 담당 |
|---|---|---|
| 저수준 실시간 루프 | 수백~수천 Hz | 균형, 안전, 관절 토크/위치 제어 |
| 고수준 정책 (VLA 등) | 수 Hz | 작업 계획, 목표 지점 결정 |

고수준 정책이 "컵을 잡아라" 같은 목표를 몇 Hz로 던지면, 저수준 루프가 그 사이 수백~수천 번 관절을 미세 조정해 실제로 몸을 움직이고 넘어지지 않게 버틴다 — 느린 두뇌와 빠른 반사 신경의 관계와 비슷하다.

### 4.2 PID 제어 — 저수준 루프의 기본기

$$u(t) = K_p e(t) + K_i \\int e(t)\\,dt + K_d \\frac{de(t)}{dt}$$

- **P (비례)**: 현재 오차에 비례해 반응 — 크면 빠르지만 진동 위험
- **I (적분)**: 누적된 오차를 없애 정상상태 오차 제거 — 너무 크면 overshoot
- **D (미분)**: 오차 변화율을 보고 미리 제동 — 진동 억제

저수준 실시간 루프에서 관절 위치·힘 제어의 대부분은 이 PID(또는 그 변형)로 구현된다.

### 4.3 RTOS — 왜 일반 Linux만으로는 부족한가

일반 Linux는 여러 프로세스를 "공평하게 나눠 쓰게" 스케줄링한다 — 평균 응답은 빠르지만, 다른 프로세스 때문에 특정 작업이 예상보다 늦게 실행되는 경우(지터, jitter)를 완전히 막지 못한다. **RTOS(Real-Time Operating System)**는 우선순위가 가장 높은 실시간 작업이 마감 시간 안에 반드시 실행되도록 스케줄링을 보장한다. 실전에서는 \`PREEMPT_RT\` 패치를 적용한 Linux나 별도 RTOS를 저수준 제어 루프 전용으로 돌리고, 고수준 정책(VLA 추론 등)은 일반 Linux에서 돌리는 이원화 구조가 흔하다.

---

## 5. 온보드 컴퓨트

### 5.1 CPU vs GPU 역할 분리

| 프로세서 | 역할 |
|---|---|
| CPU | 순차적 로직, 제어 루프, ROS 노드 실행 등 범용 연산 |
| GPU | 신경망 추론(VLA 모델 등) — 대량의 병렬 행렬 연산 |

### 5.2 ARM vs x86 — 전력 효율

ARM은 x86보다 명령어 세트가 단순(RISC)해 같은 연산량 대비 전력 소비가 낮다. 배터리로 구동하며 발열 관리가 어려운 이동형 로봇에서는 전력 효율이 곧 가동 시간·발열·무게(배터리 크기)로 직결되므로, 온보드 컴퓨트는 ARM 기반(Jetson 등)이 x86보다 선호된다.

### 5.3 Jetson 계열 스펙 읽는 법

| 모델 | 대략적 포지션 |
|---|---|
| Orin Nano | 저전력, 소형 로봇/엣지 추론용 |
| Orin NX | 중간급, 다중 카메라·중간 규모 모델 |
| AGX Orin | 최고 성능, 대형 VLA 모델 온보드 추론용 |

스펙을 읽을 때 핵심 비교 축은 **AI TOPS(추론 성능), GPU 코어 수, 메모리 대역폭, 전력(W)** — 특히 "TOPS당 전력(W)" 비율이 로봇 선택에서 CPU 클럭보다 더 중요하게 다뤄진다.

### 5.4 온보드 추론 vs 클라우드 추론

| 기준 | 온보드 | 클라우드 |
|---|---|---|
| Latency | 낮음 (네트워크 왕복 없음) | 높음 (네트워크 지연 포함) |
| 안전(safety-critical) | 네트워크 끊겨도 동작 | 연결 끊기면 정지 위험 |
| 모델 크기/성능 | 하드웨어 제약 있음 | 대형 모델 가능 |
| 네트워크 의존성 | 없음 | 있음 |

균형 제어처럼 안전이 걸린 저수준 루프는 반드시 온보드(4단계의 실시간 루프와 같은 이유)에서 돌아야 하고, 무거운 VLA 추론은 온보드 GPU 한도 내에서 처리하거나 지연이 허용되는 작업에 한해 클라우드를 보조로 쓴다.

---

## 6. 소프트웨어 통합 기초 — ROS

topic 실습 경험을 node/service 개념으로 확장한다. 세부 문법은 [ROS 기초](../../ROS2/ros-basics/main.md), [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../../ROS2/rclcpp-core-patterns/main.md) 참고.

- **Node**: 하나의 독립된 실행 단위(예: IMU 드라이버 노드, 컨트롤러 노드, 모터 드라이버 노드) — 기능별로 나누는 이유는 한 노드가 죽어도 다른 노드는 계속 살아있고, 각 기능을 독립적으로 교체·테스트할 수 있기 때문이다.
- **Topic**: 노드 간 비동기 데이터 스트림(예: \`/imu/data\`, \`/joint_states\`) — 발행자와 구독자가 서로 몰라도 되는 느슨한 결합.
- **Service**: 요청-응답이 필요한 일회성 호출(예: "그리퍼 열어") — topic과 달리 응답을 기다린다.

**데이터 흐름 예시**: IMU 노드가 \`/imu/data\`를 publish → 균형 제어 노드가 이를 subscribe해 자세 오차 계산 → 목표 토크를 \`/joint_commands\` topic으로 publish → 모터 드라이버 노드가 이를 subscribe해 실제 전류 명령으로 변환. 이렇게 센서→컨트롤러→액추에이터가 각각 독립 노드로 나뉘고 topic으로 연결되는 구조 자체가, 1~2단계에서 다룬 물리적 센서/액추에이터 파이프라인의 소프트웨어 판본이다.

---

## 7. 실제 플랫폼 통합 사례 분석

1~6단계 지식을 총동원해 실제 로봇의 하드웨어 조합을 "해석"한다.

| 로봇 | 액추에이터 | 특징적 선택 이유 |
|---|---|---|
| **Unitree G1/H1** | QDD 전기모터 | 저비용·고가성비 노선. 낮은 기어비로 백드라이버빌리티 확보, 동적 보행에 최적화 |
| **Tesla Optimus** | QDD + 전기모터 위주 | 대량생산·표준화 지향. 유압 대비 유지보수 부담이 적은 전기 구동으로 통일 |
| **Boston Dynamics Atlas (구형)** | 유압 | 압도적 힘 대 무게 비율로 격렬한 동작(파쿠르 등) 구현 — 대신 유지보수·효율 부담 큼 |
| **Boston Dynamics Atlas (신형, 전동)** | 전기 구동 전환 | 유압의 유지보수·효율 문제를 해결하고, QDD류 설계로 정밀 제어와 힘 제어 동시 확보 |
| **Figure 02** | 전기모터(일부 SEA/QDD 혼합 알려짐) | 상용 작업(매니퓰레이션) 비중이 높아 손·팔 정밀도에 무게 |

**넘어짐 대응 시나리오 — 하드웨어 스택 전체 재구성**:

\`\`\`
IMU 감지 (몸통 기울기 급변, 자이로+가속도계)
   ↓ (센서 퓨전으로 자세 추정)
저수준 실시간 컨트롤러 (수백~수천 Hz, RTOS/PREEMPT_RT)
   ↓ (PID 또는 더 복잡한 균형 제어 알고리즘이 목표 토크 계산)
모터 드라이버 (전류 명령으로 변환, 토크 ∝ 전류)
   ↓
액추에이터 응답 (QDD/SEA 등 — 낮은 기어비로 빠르고 유연하게 반응)
   ↓
발끝 F/T 센서로 접지 확인 → 다시 IMU 루프로 피드백
\`\`\`

이 파이프라인 각 단계가 정확히 1단계(센서)→4단계(실시간 제어)→2단계(액추에이터)→1단계(F/T 센서 피드백)로 이어지며, 5단계(온보드 컴퓨트)가 이 전체 루프가 도는 하드웨어, 6단계(ROS)가 각 단계를 노드로 잇는 소프트웨어 틀이다.

---

## 설계 원칙 — 왜 이 순서인가

\`\`\`
센서(입력) → 액추에이터(출력) → 기구학 연결(기존 지식 레버리지)
→ 실시간 제어(입출력을 잇는 소프트웨어) → 온보드 컴퓨트(그 소프트웨어가 도는 하드웨어)
→ ROS(실제 구현 틀) → 실제 플랫폼(종합 적용)
\`\`\`

각 단계에서 배운 내용이 다음 단계의 재료가 되도록 구성했다 — 넘어짐 시나리오(7단계)는 사실상 1~6단계 전부를 순서대로 통과하는 하나의 사례다.

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| Encoder | Incremental(상대, 저렴) vs Absolute(절대, 재시작 시 즉시 위치 파악) |
| IMU | 자이로(각속도)+가속도계(중력방향) → 센서 퓨전(칼만 필터)으로 자세 추정 |
| F/T 센서 | 관절/발끝 힘·토크 직접 측정 → 접지 판단·균형 제어 입력 |
| Proprioception | Encoder+IMU+F/T = 로봇이 자기 몸 상태를 아는 능력 (exteroceptive와 대비) |
| 백드라이버빌리티 | 기어비 ↑ → 토크 ↑, 외력 반응성 ↓ (자전거 기어 비유) |
| SEA | 직렬 스프링으로 충격 흡수 + 변위 기반 힘 제어, 대역폭은 낮음 |
| QDD | 낮은 기어비 + 고토크밀도 모터로 백드라이버빌리티와 빠른 힘 제어 동시 확보 |
| 실시간(Real-time) | "빠름"이 아니라 "최악의 경우에도 마감 시간 보장" |
| 제어 계층 | 저수준(수백~수천 Hz, 균형/안전) vs 고수준(VLA, 수 Hz, 정책) |
| RTOS | 우선순위 기반 스케줄링으로 지터 없는 응답 보장, 일반 Linux는 평균은 빨라도 최악 보장 없음 |
| 온보드 vs 클라우드 | 안전-critical 저수준 루프는 반드시 온보드, 무거운 추론은 온보드 한도 내 또는 지연 허용 작업만 클라우드 |
| ROS 구조 | Node(독립 실행 단위)·Topic(비동기 스트림)·Service(요청-응답) — 센서→컨트롤러→액추에이터를 노드로 분리 |
| 플랫폼 트렌드 | 유압(고힘, 고유지보수) → 전기 QDD(저유지보수, 백드라이버빌리티) 전환이 최근 휴머노이드의 공통 방향 |

## 향후 확장 예정

- 시스템 아키텍처 (Perception → High-level Policy → Low-level Controller 전체 파이프라인)
- 모델 아키텍처 (VLA 내부 구조: RT-2, OpenVLA, π0 등)
- Sim-to-Real (Isaac Sim, MuJoCo, 도메인 갭)
`,

  'Robotics/trajectory-generation-and-cubic-polynomial-path': `---
title: 궤적 생성과 3차 다항식 경로 (Trajectory Generation & Cubic Polynomial Path)
date: 2026-08-08
tags: cubic-polynomial, joint-space
order: 
featured: false
draft: false
---

# 궤적 생성과 3차 다항식 경로 (Trajectory Generation & Cubic Polynomial Path)

> 출처: 로봇제어공학 — Introduction to Robotics 7장 "궤적 생성(Trajectory Generation)"
> 영상: https://www.youtube.com/watch?v=d2LBmF4BAvc&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=19
> 대상: [역기구학(IK)](../inverse-kinematics/main.md)과 [자코비안](../jacobian-velocity-kinematics-link-propagation/main.md)까지 학습한 상태를 전제로, 초기 위치에서 목표 위치까지 손끝을 "부드럽게" 움직이는 관절 각도 함수 θ(t)를 실제로 만드는 방법(3차 다항식)을 다루는 노트.

---

## 1. 왜 궤적 생성이 필요한가

초기 위치와 최종 위치를 잇는 경로는 무한히 많고, 그중 계산이 쉽고 로봇에 무리 없는 경로를 골라야 한다. 또한 로봇은 관절 각도만 이해하므로, 손끝의 작업공간 지시를 매 순간 [역기구학(IK)](../inverse-kinematics-algebraic-geometric-pieper/main.md)으로 풀면 부담이 크다.

사용자는 작업공간에서 목표 위치·자세·속도 프로파일 정도만 지정하고, 세부 경로는 시스템이 채우게 하는 것이 목표다. 그 표준 방법이 **3차 다항식**이다.

## 2. 정지계(S)와 공구계(T)

- **S**: 고정된 기준 좌표계 (예: 작업 테이블).
- **T**: 손끝(공구)에 붙인 좌표계.

경로를 "S 기준 T의 운동"으로 정의하면 로봇의 팔 길이·형상 정보 없이 목표 궤적만 따라가면 된다.

## 3. 작업공간 vs 관절공간

- **작업공간(work space)**: 손끝이 움직이는 공간.
- **관절공간(joint space)**: 각 관절 각도(θ₁, θ₂, …)의 조합이 만드는 공간.

문제를 단순화하는 순서:

1. 초기·경유·최종 위치를 작업공간에서 지정.
2. 각 지점에 대해 역기구학을 **한 번씩만** 풀어 관절각 세트로 변환.
3. 이후 관절 하나씩 떼어 관절공간의 시간-각도 문제(θ(t))로 처리 — 관절마다 독립적으로 [3차 다항식](#6-3차-다항식-경로--정지-정지-구간의-유도)으로 설계.

**타이밍 조건**: 관절이 여러 개면 모든 관절이 같은 시간에 같은 경유점을 지나야 손끝이 실제 원했던 경유점을 통과한다.

## 4. 부드러운 운동의 조건

- **1차 도함수(속도) 연속** 필수.
- **2차 도함수(가속도) 연속**이면 더 좋다. 가속도가 불연속으로 튀는 현상이 **저크(jerk)**.

저크가 크면 로봇 몸체가 덜컹거리고 기어·모터가 손상되며 에너지 소모도 커진다.

## 5. 경로 갱신율(path update rate)

경로를 초당 몇 번 재계산하느냐가 부드러움을 결정한다. 촘촘할수록 부드럽지만 계산 자원 소모가 커지는 트레이드오프가 있다.

- 경로 갱신율: 20~200Hz
- 실시간 관절 제어: ~1kHz

핵심은 정확한 수치보다 **제어 루프 > 경로 갱신** 이라는 상대적 크기 관계.

## 6. 3차 다항식 경로 — 정지-정지 구간의 유도

시작 시간 0, 종료 시간 $t_f$일 때 정지-정지 조건 4가지:

$$\\theta(0)=\\theta_0,\\qquad \\theta(t_f)=\\theta_f,\\qquad \\dot\\theta(0)=0,\\qquad \\dot\\theta(t_f)=0$$

**왜 직선이 아니라 곡선인가**: 직선은 시작·끝에서 속도가 0→일정값, 일정값→0으로 튀어 속도 불연속이 생긴다. 조건이 4개(위치 2개 + 속도 2개)이므로 미지수도 4개여야 한다. 2차식은 미지수가 3개뿐이라 부족하고, 3차식이 미지수 4개(a₀~a₃)로 정확히 맞아떨어진다.

$$\\theta(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3$$

$$\\dot\\theta(t) = a_1 + 2a_2 t + 3a_3 t^2, \\qquad \\ddot\\theta(t) = 2a_2 + 6a_3 t$$

네 조건을 대입해 풀면:

$$a_0=\\theta_0,\\qquad a_1=0,\\qquad a_2=\\frac{3}{t_f^2}(\\theta_f-\\theta_0),\\qquad a_3=-\\frac{2}{t_f^3}(\\theta_f-\\theta_0)$$

**꼭 기억**: 조건의 개수 = 미지수의 개수라는 원칙. 실전에서는 공식에 숫자만 대입하면 된다.

## 7. 예제 7.1 — 15°→75°, 3초 검증

$$\\theta_0=15,\\quad \\theta_f=75,\\quad t_f=3$$

$$a_0=15.0,\\quad a_1=0.0,\\quad a_2=\\frac{3}{3^2}(75-15)=20.0,\\quad a_3=-\\frac{2}{3^3}(75-15)=-4.44$$

$$\\theta(t)=15.0+20.0t^2-4.44t^3,\\qquad \\dot\\theta(t)=40.0t-13.33t^2,\\qquad \\ddot\\theta(t)=40.0-26.66t$$

- **위치**: 15°에서 75°까지 S자 곡선으로 상승.
- **속도**: 0에서 시작해 포물선 모양으로 증가(가속) 후 다시 0으로 감소(감속). 중간 지점에서 최대 속도.
- **가속도**: t=0에서 +40(°/s²)로 시작해 선형으로 감소, t=3에서 −40(°/s²)에 도달 — 시작에 크게 가속하고 끝에서 그만큼 감속해 정확히 멈춘다.

**이해**: 다만 정지-정지 구간을 그대로 이어 붙이면 경유점마다 속도가 0으로 끊겨 "가다 서다"를 반복하고, 앞뒤 구간의 가속도가 불연속으로 튀며 저크가 발생한다 — 그래서 경유점 속도를 0이 아닌 값으로 유지하는 확장이 필요하다.

## 8. 경유점을 지나는 일반 3차 다항식

시작·끝 속도 조건을 임의의 값 $\\dot\\theta_0,\\dot\\theta_f$로 바꾼다.

$$\\theta(0)=\\theta_0,\\qquad \\theta(t_f)=\\theta_f,\\qquad \\dot\\theta(0)=\\dot\\theta_0,\\qquad \\dot\\theta(t_f)=\\dot\\theta_f$$

여전히 미지수 4개·조건 4개이며, $\\dot\\theta_0=\\dot\\theta_f=0$을 대입하면 [정지-정지 특수해](#6-3차-다항식-경로--정지-정지-구간의-유도)로 되돌아간다.

$$a_0=\\theta_0,\\qquad a_1=\\dot\\theta_0$$

$$a_2=\\frac{3}{t_f^2}(\\theta_f-\\theta_0)-\\frac{2}{t_f}\\dot\\theta_0-\\frac{1}{t_f}\\dot\\theta_f$$

$$a_3=-\\frac{2}{t_f^3}(\\theta_f-\\theta_0)+\\frac{1}{t_f^2}(\\dot\\theta_f+\\dot\\theta_0)$$

**이해**: $a_0,a_1$은 초기 위치·속도를 그대로 대입한 값이라 즉시 구해지고, 남은 두 조건($\\theta(t_f)=\\theta_f$, $\\dot\\theta(t_f)=\\dot\\theta_f$)만 풀면 $a_2,a_3$가 나온다.

## 9. 경유점 속도를 정하는 세 가지 방법

경유점의 **위치**는 사용자가 정하지만 **속도**는 별도로 정해야 한다.

| 방법 | 아이디어 | 특징 |
|---|---|---|
| ① 자코비안 | 손끝의 선속도·각속도를 지정 → 자코비안으로 관절 속도 계산 | 정확하지만 경유점마다 반복 계산이 번거로움 |
| ② 발견적(heuristic) 방법 | 작업공간·관절공간에서 규칙으로 자동 선택 | 가장 쉬운 방법 |
| ③ 가속도 지정 | 위치·속도에 가속도까지 양 끝에서 지정 → 조건 6개 → 5차 다항식 필요 | 직관적이지만 차수 증가 |

휴리스틱(②) 규칙: 관절 하나의 시간-각도 그래프 기울기(=속도)를 볼 때,

- 경유점 전후로 기울기 **부호가 바뀌면** 그 경유점의 속도를 **0**으로 놓는다.
- 기울기 **부호가 같으면** 그 경유점의 속도를 **양쪽 두 구간 기울기의 평균값**으로 놓는다.

**이해**: 이 규칙은 시작·끝 경유점(정지가 기본)에는 적용하지 않고, **중간 경유점**에만 적용한다.

## 10. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| $\\theta_0,\\theta_f$ | 시작·종료 위치(관절각) | 6절 |
| $\\dot\\theta_0,\\dot\\theta_f$ | 시작·종료 속도 | 정지-정지 구간에서는 0, 경유점 통과 시엔 임의값 — 8절 |
| $t_f$ | 구간 소요 시간 | 경유점 사이 각 구간마다 독립적으로 지정 |
| $a_0,a_1,a_2,a_3$ | 3차 다항식 계수 | 조건 4개 ↔ 미지수 4개로 유일하게 결정 |
| S, T | 정지계(stationary), 공구계(tool) | 2절 |
| 경로점(path point), 경유점(via point) | 궤적이 지나가는 전체 점들 / 그중 중간 통과점 | 3절 |
| jerk | 가속도의 시간 변화율(3차 도함수) | 불연속이면 로봇 진동·부품 손상 — 4절 |

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 문제 정의 | 사용자는 작업공간에서 목표점만 지정, 로봇이 관절공간에서 부드러운 θ(t)를 알아서 채움 |
| S/T 프레임 | 정지계(S) 기준 공구계(T)의 운동으로만 기술 — 로봇 형상과 무관하게 경로 정의 가능 |
| 부드러움의 정의 | 속도(1차 도함수) 연속 필수, 가속도(2차 도함수) 연속이면 더 좋음 — 불연속이면 저크(jerk) 발생 |
| 경로 갱신율 | 20~200Hz (경로) < 1kHz (실시간 관절 제어) |
| 정지-정지 3차 다항식 | 조건 4개($\\theta_0,\\theta_f,\\dot\\theta_0=0,\\dot\\theta_f=0$) = 미지수 4개 → $a_0=\\theta_0,\\ a_1=0,\\ a_2=\\frac{3}{t_f^2}(\\theta_f-\\theta_0),\\ a_3=-\\frac{2}{t_f^3}(\\theta_f-\\theta_0)$ |
| 일반 3차 다항식 | 임의 속도 경계조건 → $a_0=\\theta_0,\\ a_1=\\dot\\theta_0,\\ a_2=\\frac{3}{t_f^2}(\\theta_f-\\theta_0)-\\frac{2}{t_f}\\dot\\theta_0-\\frac{1}{t_f}\\dot\\theta_f,\\ a_3=-\\frac{2}{t_f^3}(\\theta_f-\\theta_0)+\\frac{1}{t_f^2}(\\dot\\theta_f+\\dot\\theta_0)$ |
| 경유점 속도 지정 | ① 자코비안(정확·번거로움) ② 휴리스틱(부호 바뀌면 0, 안 바뀌면 평균 — 가장 쉬움) ③ 가속도까지 지정(5차 다항식) |
`,

  'Robotics/transformation-matrix': `---
title: 변환 행렬과 연산자 (Transformation Matrix)
date: 2026-08-08
tags: transformation-matrix
order: 
featured: false
draft: false
---

# 변환 행렬과 연산자 (Transformation Matrix)

> 출처: 로봇제어공학 — Introduction to Robotics 2장 Transformation Matrix
> 영상: https://www.youtube.com/watch?v=7zr0uC_QsU4
> 대상: 기계공학 배경 / 행렬 곱 개념 수준 / Python 가능

---

## 목차

1. [리캡 — 매핑과 동차 변환 행렬](#1-리캡--매핑과-동차-변환-행렬)
2. [연산자 — 점을 실제로 움직이기](#2-연산자--점을-실제로-움직이기)
3. [매핑과 연산자는 같은 행렬이다](#3-매핑과-연산자는-같은-행렬이다)
4. [복합 변환](#4-복합-변환--r은-곱해지고-p는-그냥-더해지지-않는다)
5. [역변환](#5-역변환--4×4-인버스를-손으로-구하는-방법)
6. [변환 방정식](#6-변환-방정식--로봇이-볼트를-잡으려면)
7. [회전 행렬은 사실 3개 숫자다](#7-회전-행렬은-사실-3개-숫자다)
8. [교환법칙은 성립하지 않는다](#8-교환법칙은-성립하지-않는다)
9. [다음 단계 — 24가지 표현법과 RPY](#9-다음-단계--24가지-표현법과-roll-pitch-yaw)
10. [Python 실습 코드](#10-python-실습-코드)
11. [핵심 요약 카드](#11-핵심-요약-카드)

---

## 1. 리캡 — 매핑과 동차 변환 행렬

### 문제 상황: 같은 점, 다른 좌표계

3차원 공간에 점이 하나 있다. 점은 **그대로 있다**.

- 처음에는 {B} 좌표계 기준으로 표현했다 → $^B P$
- 이걸 {A} 좌표계 기준으로 다시 표현하고 싶다 → $^A P$ = ?

이렇게 **표시(표현)만 바꾸는 것**을 **매핑(mapping)** 이라고 부른다 — 개념 도입과 유도 과정은 [앞 강의 노트](../frames-and-mapping/main.md)에 있다. 매핑에 필요한 재료는 딱 두 개다.

| 재료 | 의미 |
|------|------|
| $^A_B R$ (3×3) | {A} 기준으로 {B}가 얼마나 **돌아가** 있는가 |
| $^A P_{BORG}$ (3×1) | {A} 기준으로 {B}의 **원점**이 어디에 있는가 |

$$^A P = {}^A_B R \\; {}^B P + {}^A P_{BORG}$$

### 하나의 행렬로 합치기 — 동차 변환 행렬

회전은 곱하고 위치는 더하는 두 단계가 번거로우니, **하나의 행렬 곱**으로 만들고 싶다. 그런데 3×3 회전 행렬 옆에 3×1 벡터를 붙이면 3×4 — 정방행렬이 아니라서 연산이 어색하다. 그래서 **줄을 맞추려고 밑에 $[0\\;0\\;0\\;1]$ 한 줄을 강제로 추가**해 4×4를 만든다.

$$
\\begin{bmatrix} ^A P \\\\ 1 \\end{bmatrix}
=
\\underbrace{\\begin{bmatrix} {}^A_B R & {}^A P_{BORG} \\\\ 0\\;0\\;0 & 1 \\end{bmatrix}}_{^A_B T}
\\begin{bmatrix} ^B P \\\\ 1 \\end{bmatrix}
$$

이 4×4 행렬 $^A_B T$가 **변환 행렬(transformation matrix)** 이고, 책에서는 이를 **균질 변환(homogeneous transform)** 이라고 부른다.

> "정방행렬, 호머지니어스 같은 얘기예요."

(보충: 정방행렬이라서가 아니라, 점에 1을 덧붙인 **동차 좌표(homogeneous coordinates)** 를 쓰기 때문에 붙은 이름이다. 결과 벡터의 마지막 1은 의미 없이 버리는 값이다.)

### 예제 2.2 — 숫자로 확인

{A}에 대해 Z축 중심으로 30° 회전하고, X축으로 10, Y축으로 5만큼 전위된 좌표계 {B}가 있다. {B}에서 $(3, 7, 0)$으로 표현된 점을 {A}로 바꾸면?

$$
^A_B T = \\begin{bmatrix}
0.866 & -0.500 & 0 & 10.0 \\\\
0.500 & 0.866 & 0 & 5.0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix},
\\qquad
^B P = \\begin{bmatrix} 3.0 \\\\ 7.0 \\\\ 0.0 \\end{bmatrix}
$$

$^B P$에 1을 붙여 $(3, 7, 0, 1)$로 만들고 곱한다. 첫 성분만 손으로 따라가 보면:

$$0.866 \\times 3 + (-0.500) \\times 7 + 0 + 10 \\times 1 = 2.598 - 3.5 + 10 = 9.098$$

$$^A P = \\begin{bmatrix} 9.098 \\\\ 12.562 \\\\ 0.000 \\end{bmatrix}$$

네 번째로 나오는 1은 버린다. 원래 없던 걸 줄 맞추려고 넣었을 뿐이다.

### 팁: 오른손 법칙으로 +30°의 방향 찾기

"Z축으로 +30°"가 어느 방향인지 헷갈릴 때의 판별법:

1. **Z축 방향 찾기**: 오른손 손끝을 X축 방향으로 두고 Y축 쪽으로 감아쥐면, 엄지가 Z축의 + 방향이다. 화면에 X→오른쪽, Y→위로 그려져 있다면 Z는 화면 밖으로 튀어나온다.
2. **회전의 + 방향**: 엄지를 회전축(+Z)에 맞추고 나머지 손가락이 감기는 방향이 + 회전이다.

---

## 2. 연산자 — 점을 실제로 움직이기

지금까지의 매핑은 "점은 그대로, 좌표계 표현만 변경"이었다. 그런데 **똑같은 행렬**을 전혀 다른 관점으로도 쓸 수 있다: **점을 실제로 옮기고 돌리는 연산자(operator)** 로.

> "하나 배웠더니 좌표 변환 맵핑에도 쓸 수 있고, 또 다른 실제 움직이고 돌리고 하는, 점을 진짜 움직이게 하는 연산자로도 쓸 수 있네?"

연산자는 세 가지다: **전위(translate)**, **회전(rotate)**, 둘을 합친 **변환(transformation)**.

### 전위 연산자 $D_Q$

좌표계는 {A} **하나뿐**이다. {A} 안의 점 $P_1$을 벡터 $^A Q$만큼 옮겨 $P_2$로 보내고 싶다. 고등학교 벡터 합 그대로다:

$$^A P_2 = {}^A P_1 + {}^A Q$$

이걸 행렬 연산 형태로 바꾸면:

$$^A P_2 = D_Q(q) \\; {}^A P_1,
\\qquad
D_Q(q) = \\begin{bmatrix}
1 & 0 & 0 & q_x \\\\
0 & 1 & 0 & q_y \\\\
0 & 0 & 1 & q_z \\\\
0 & 0 & 0 & 1
\\end{bmatrix}$$

뜯어보면 그냥 변환 행렬 $T$에서 **회전 부분이 단위행렬 $I$** (회전 안 함)이고, 위치 칸에 이동량 $(q_x, q_y, q_z)$만 쓴 것이다.

> "여러분 이거 외울 필요 전혀 없어요. 결국엔 맨 마지막에 이거 하나만 딱 알면 되거든. 근데 이거 이름이 T야. 그래서 똑같아. 단지 관점만 달라지는 거야."

### 회전 연산자 $R_K(\\theta)$

{A} 원점에서 점 $P_1$까지 향하는 벡터 $^A P_1$ 자체를 회전시켜 새 점 $P_2$를 얻는다.

$$^A P_2 = R_K(\\theta) \\; {}^A P_1$$

어느 축으로 몇 도 돌렸는지 명시하려고 아래첨자 $K$(회전축)와 $\\theta$(각도)를 쓴다. 예를 들어 Z축 주위로 $\\theta$만큼 돌리는 연산자는:

$$R_z(\\theta) = \\begin{bmatrix}
\\cos\\theta & -\\sin\\theta & 0 & 0 \\\\
\\sin\\theta & \\cos\\theta & 0 & 0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}$$

회전만 했으니 위치 칸은 $(0,0,0)$이다. Z행·Z열이 $(0,0,1)$인 이유는 회전 행렬의 원소가 축끼리의 내적(코사인)이기 때문 — Z축은 다른 축과 90°(cos 90° = 0)이고 자기 자신과 0°(cos 0° = 1)이다.

### 회전 행렬 빨리 쓰는 노하우

3×3 회전 부분을 축별로 빨리 쓰는 요령. 행·열 순서는 위에서부터/왼쪽부터 X, Y, Z다.

1. **회전축에 해당하는 행과 열**: 대각 원소에 1, 나머지는 0
2. **남은 2×2 네 칸**: 대각선 두 칸은 $\\cos\\theta$, 나머지 두 칸은 $\\sin\\theta$와 $-\\sin\\theta$

$$R_x(\\theta) = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & c\\theta & -s\\theta \\\\ 0 & s\\theta & c\\theta \\end{bmatrix}
\\quad
R_y(\\theta) = \\begin{bmatrix} c\\theta & 0 & s\\theta \\\\ 0 & 1 & 0 \\\\ -s\\theta & 0 & c\\theta \\end{bmatrix}
\\quad
R_z(\\theta) = \\begin{bmatrix} c\\theta & -s\\theta & 0 \\\\ s\\theta & c\\theta & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$$

> "그래서 이렇게 외웠어, 학부 때. 여러분도 그렇게 외워서 쓰면 돼요. 물론 계속 얘기했지만 외울 필요는 전혀 없다고. 시험만 보고 나면 사회에 나가서는 외울 필요 없어요."

세 행렬의 유도와 성질은 [RPY — 롤·피치·요](../orientation-representations/main.md)에서 자세히 다룬다.

### 예제 2.3 — 벡터를 Z축 주위로 30° 회전

점 $^A P_1 = (0, 2, 0)$을 Z축 주위로 30° 회전시키면:

$$R_z(30°) = \\begin{bmatrix}
0.866 & -0.500 & 0 \\\\
0.500 & 0.866 & 0 \\\\
0 & 0 & 1
\\end{bmatrix},
\\qquad
^A P_2 = R_z(30.0)\\,{}^A P_1 = \\begin{bmatrix} -1.000 \\\\ 1.732 \\\\ 0.000 \\end{bmatrix}$$

검산: $(-0.5)\\times 2 = -1.0$, $0.866 \\times 2 = 1.732$. **좌표계는 그대로 있고 점이 움직였다** — 이게 매핑과의 차이다.

---

## 3. 매핑과 연산자는 같은 행렬이다

### 변환 연산자

전위와 회전을 합치면 변환 연산자다. "$R$만큼 회전하고 $Q$만큼 전위하는 변환"은 "기준 좌표계에 대해 $R$만큼 회전하고 $Q$만큼 전위한 **좌표계를 표시하는** 변환"과 완전히 같다:

$$^A P_2 = T \\; {}^A P_1$$

### 예제 2.4 vs 예제 2.2 — 숫자가 완전히 똑같다

점 $(3, 7, 0)$을 Z축으로 30° 돌리고 X로 10, Y로 5 옮기면(예제 2.4), 사용하는 $T$도, 결과 $(9.098, 12.562, 0.000)$도 [예제 2.2](#1-리캡--매핑과-동차-변환-행렬)와 **완전히 동일**하다.

| | 매핑 (예제 2.2) | 연산자 (예제 2.4) |
|---|---|---|
| 좌표계 | {A}, {B} 두 개 | {A} 하나 |
| 점 | 그대로 있음 | 실제로 움직임 |
| 행렬 $T$ | $^A_B T$ (첨자를 씀) | $T$ (첨자 없이 씀) |
| 계산·결과 | 동일 | 동일 |

> "결과 값은 똑같아요. 그런데 이걸 관점을 뭘로 보느냐는 거지. 그 차이야. 하나는 맵핑이고 하나는 연산자라고 봐요."

**책 읽는 요령**: $T$ 왼쪽 위·아래에 좌표계 첨자($^A_B T$)가 잔뜩 붙어 있으면 매핑(좌표계 변환), 첨자 없이 $T$만 딱 나오면 연산자(점 이동)로 읽으면 된다. 기준 좌표계가 하나뿐이라 첨자를 쓸 필요가 없기 때문이다.

**실전 한 줄**: 매핑이냐 연산자냐 고민할 필요 없다 — 구성도, 계산도, 코드도 똑같고 해석만 다르다.

---

## 4. 복합 변환 — R은 곱해지고, P는 그냥 더해지지 않는다

### 문제 상황

{C} 기준으로 표현된 점 $^C P$가 있고, $^B_C T$와 $^A_B T$를 알고 있다. 그러면 {A} 기준 표현도 알 수 있어야 한다:

$$^B P = {}^B_C T \\; {}^C P, \\qquad {}^A P = {}^A_B T \\; {}^B P = {}^A_B T \\; {}^B_C T \\; {}^C P$$

즉 한 번에 건너뛰는 변환 행렬은 두 행렬의 곱이다:

$$^A_C T = {}^A_B T \\; {}^B_C T$$

첨자를 보면 가운데 B끼리 **대각선으로 지워지고** A와 C만 남는 모양이라 외우기 쉽다.

### 내용을 뜯어보면 (식 2.17)

블록 단위로 곱해 보면:

$$^A_C T = \\begin{bmatrix}
{}^A_B R \\; {}^B_C R & \\quad {}^A_B R \\; {}^B P_{CORG} + {}^A P_{BORG} \\\\
0\\;0\\;0 & 1
\\end{bmatrix}$$

- **회전 블록**: $^A_B R \\, {}^B_C R$ — 회전 행렬끼리 그냥 곱하면 된다. 아름답다.
- **위치 블록**: $^A_B R \\, {}^B P_{CORG} + {}^A P_{BORG}$ — 원점 이동량이 **그냥 더해지지 않는다.** {B} 기준으로 잰 {C}의 원점 위치에 $^A_B R$이 먼저 곱해진 다음에야 더해진다.

유도 아이디어(블록 곱 한 스텝): 위치 열은 [첫 행렬의 R]×[둘째 행렬의 P열] + [첫 행렬의 P열]×1 로 나온다. 둘째 행렬의 위치는 {B} 좌표계 언어로 쓰여 있으니, {A} 언어로 번역($^A_B R$을 곱함)한 뒤에야 {A} 기준 위치와 더할 수 있는 것이다.

**실전 한 줄**: 손으로는 이 전개를 쓸 일이 없다 — 4×4 행렬 두 개를 프로그램으로 곱하면 끝이다. 다만 "위치는 단순 합이 아니다"라는 사실은 직관 검증용으로 기억해 둘 것.

> "매트랩이 왜 매트랩이냐면 앞에 매트가 매트릭스야. 매트릭스 연산이 너무 쉬워."

> "C뿔뿔이 훨씬 빨라요. 훨씬 빨라. 그런데도 편리함을 못 이겨. 그래서 다 파이선으로 가고 있어요."

---

## 5. 역변환 — 4×4 인버스를 손으로 구하는 방법

### 문제 상황

$^A_B T$를 알 때 반대 방향 $^B_A T$가 필요하다. 정의상:

$$^B_A T = \\left({}^A_B T\\right)^{-1}$$

첨자 위·아래를 서로 바꾸면 역행렬이다. 그런데 일반적인 4×4 역행렬을 손으로 구하는 건(여인수 전개 — "플러스 마이너스 플러스 마이너스" 하던 그 방법) 사실상 불가능할 만큼 고생스럽다.

### 변환 행렬의 특징을 이용하면 손으로도 된다

회전 행렬은 $R^{-1} = R^T$ (역행렬 = 전치)라는 강력한 성질이 있었다. 이걸 이용해 유도한다.

**유도 (2줄)**: $^A P = R\\,{}^B P + P_{BORG}$ 를 $^B P$에 대해 풀면

$$^B P = R^T \\, {}^A P - R^T P_{BORG}$$

즉 역변환의 회전 블록은 $R^T$, 위치 블록은 $-R^T P_{BORG}$:

$$\\left({}^A_B T\\right)^{-1} = \\begin{bmatrix}
{}^A_B R^T & \\; -{}^A_B R^T \\; {}^A P_{BORG} \\\\
0\\;0\\;0 & 1
\\end{bmatrix}$$

암산 절차:

1. 맨 아랫줄은 볼 것도 없이 $[0\\;0\\;0\\;1]$
2. 3×3 블록은 원래 $R$의 **전치** (대각선 기준으로 뒤집기)
3. 위치 열만 계산이 필요: $-R^T P$ (3×3 곱 한 번 + 부호 반전)

### 예제 2.5 — 숫자로 확인

{A}에 대해 Z축 주위로 30° 회전하고 X로 4, Y로 3만큼 전위한 {B}:

$$^A_B T = \\begin{bmatrix}
0.866 & -0.500 & 0 & 4.0 \\\\
0.500 & 0.866 & 0 & 3.0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}
\\;\\Rightarrow\\;
^B_A T = \\begin{bmatrix}
0.866 & 0.500 & 0 & -4.964 \\\\
-0.500 & 0.866 & 0 & -0.598 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & 0 & 1
\\end{bmatrix}$$

위치 열 검산:
- $-(0.866 \\times 4 + 0.500 \\times 3) = -(3.464 + 1.5) = -4.964$
- $-(-0.500 \\times 4 + 0.866 \\times 3) = -(-2 + 2.598) = -0.598$

**실전 한 줄**: 프로그램에서도 범용 \`np.linalg.inv\` 대신 이 공식을 쓰면 빠르고 수치적으로 안정적이다.

---

## 6. 변환 방정식 — 로봇이 볼트를 잡으려면

### 루프가 만들어지면 모르는 것 하나를 구할 수 있다

같은 목적지로 가는 경로가 두 개면 두 변환 곱은 같아야 한다:

$$^U_D T = {}^U_A T \\; {}^A_D T = {}^U_B T \\; {}^B_C T \\; {}^C_D T$$

여기서 $^B_C T$ 하나만 모른다면? 행렬 방정식이니 **양변 왼쪽·오른쪽에 인버스를 곱해서** 소거하면 된다:

$$^B_C T = \\left({}^U_B T\\right)^{-1} \\; {}^U_A T \\; {}^A_D T \\; \\left({}^C_D T\\right)^{-1}$$

읽는 요령: 인버스는 첨자 위·아래가 뒤집힌 것과 같으므로($^U_B T^{-1} = {}^B_U T$), 늘어놓고 보면 이웃한 첨자끼리 대각선으로 지워지면서 B에서 C로 가는 변환만 남는다. 변환들이 루프(chain)를 구성하면, 그 안에 모르는 게 하나 껴 있어도 나머지 연산으로 구할 수 있다.

### 예제 2.6 — 이번 학기의 최종 목표

로봇 작업 현장의 좌표계 네 개 (Figure 2.16):

| 좌표계 | 위치 | 어떻게 아는가 |
|--------|------|---------------|
| {B} (Base) | 로봇 받침 | 설치 후 고정 |
| {T} (Tool) | 로봇 손끝 | $^B_T T$ — 링크 길이 + 조인트 각도로 계산 (3장 정기구학) |
| {S} (Station) | 작업 테이블 | $^B_S T$ — 로봇·테이블 배치 시 결정 |
| {G} (Goal) | 테이블 위 볼트 | $^S_G T$ — 천장 카메라로 측정 |

궁금한 것은 단 하나 — **손끝이 볼트까지 어떻게 가야 하는가**, 즉 $^T_G T$:

$$^T_G T = \\left({}^B_T T\\right)^{-1} \\; {}^B_S T \\; {}^S_G T$$

$^B_T T$는 화살표 방향이 반대라서 인버스로 뒤집어 쓴 것이다.

> "그 트랜스포메이션 매트릭스를 뭘로 만들면 돼요? 영으로 만들면. 어떻게든 움직여서 그걸 영으로 만들어버리면, 볼트하고 딱 각도도 맞고 위치도 딱 맞아. 그럼 그 상태에서 손끝을 조이면 되는 거야. 그럼 볼트를 딱 잡는 거야. 끝이야 끝. 그게 이번 학기 계속 하려고 하는 거예요."

($^T_G T$를 단위행렬 $I$로 만든다 = 손끝 좌표계와 볼트 좌표계가 완전히 일치한다는 뜻.)

베이스→손끝의 $^B_T T$를 링크별 변환의 곱으로 실제로 구하는 과정이 [링크 변환 연결 — 정기구학의 완성](../forward-kinematics/main.md)이고, 각 링크 변환을 4개 파라미터로 정의하는 방법이 [DH 파라미터](../denavit-hartenberg-parameters/main.md)다.

---

## 7. 회전 행렬은 사실 3개 숫자다

### 문제 상황: 각도 하나 표현하는 데 9개가 필요한가?

변환 행렬은 좋은데, 방위를 나타내는 데 3×3 = 9개 숫자는 아무리 생각해도 과하다. 이 고민을 수학자들이 이미 풀어놨다.

> "그걸 누가 풀어요? 수학자들이 다 풀어요, 여러분. 우리 공학자들은 갖다 써. 수학자들 대단한 거야. 여러분 수학을 사랑해야 돼."

### 회전 행렬의 수학적 성질 — 고유 정규직교 행렬

회전 행렬의 각 열은 기준 좌표계에서 본 X, Y, Z축이다. 그래서:

- **각 열이 서로 수직** (축끼리 90°) → 직교(orthogonal)
- **각 열의 크기가 1** → 정규(normal). $R_z$의 첫 열로 확인: $\\cos^2\\theta + \\sin^2\\theta + 0^2 = 1$
- 행렬식이 1

이런 행렬을 **고유 정규직교 행렬**(proper orthonormal matrix)이라고 부른다.

### Cayley 공식 — 9개를 3개로 (식 2.56, 2.57)

Cayley의 공식에 의해, 어떤 회전 행렬 $R$도 **3개의 인자만 갖는 비대칭 행렬(skew-symmetric matrix)** $S$로 만들 수 있다:

$$R = (I_3 - S)^{-1}(I_3 + S)$$

$$S = \\begin{bmatrix}
0 & -s_z & s_y \\\\
s_z & 0 & -s_x \\\\
-s_y & s_x & 0
\\end{bmatrix}$$

$S$는 3×3, 9칸이지만 실질 정보는 $(s_x, s_y, s_z)$ **3개뿐**이다 — 대각선은 전부 0이고, 대각선 반대편은 부호만 뒤집힌 값이니까.

**의미**: 친구에게 방위를 알려줄 때 숫자 9개를 부를 필요가 없다. 3개만 알려주면 위 공식으로 $R$을 복원할 수 있고, 반대로 $R$에서 3개 인자를 뽑아낼 수도 있다. "3개 숫자 ↔ 회전 행렬"의 구체적인 왕복 방법들(RPY, 오일러, [등가축·각도](../orientation-representations/main.md))이 여기서 출발한다.

**구분**: 이해할 것 — "방위의 자유도는 3"이라는 사실과 그 근거. 외울 필요 없는 것 — Cayley 공식 자체 (라이브러리가 해준다).

---

## 8. 교환법칙은 성립하지 않는다

### 예제 2.7 — 순서를 바꾸면 답이 다르다

Z축 주위로 30° 돌린 뒤 X축 주위로 30° 돌리는 것과, 그 반대 순서는 결과가 다르다:

$$R_z(30°)\\,R_x(30°) = \\begin{bmatrix}
0.87 & -0.43 & 0.25 \\\\
0.50 & 0.75 & -0.43 \\\\
0.00 & 0.50 & 0.87
\\end{bmatrix}
\\;\\ne\\;
R_x(30°)\\,R_z(30°) = \\begin{bmatrix}
0.87 & -0.50 & 0.00 \\\\
0.43 & 0.75 & -0.50 \\\\
0.25 & 0.43 & 0.87
\\end{bmatrix}$$

직관: 손에 든 물체를 "Z로 30° → X로 30°" 돌려본 결과와 "X로 30° → Z로 30°" 돌려본 결과는 실제로 다른 자세다. 행렬 곱의 교환법칙이 성립하지 않는 게 당연하다.

**실전 한 줄**: 회전 연산자는 **순서가 스펙의 일부**다. 라이브러리에 회전을 넘길 때 순서 규약(\`"xyz"\` vs \`"zyx"\` 등)을 반드시 확인할 것.

---

## 9. 다음 단계 — 24가지 표현법과 Roll-Pitch-Yaw

3개 값으로 방위를 표현하는 구체적 방법은 한 가지가 아니다 — **24가지**나 된다. 카르다노(Cardano)의 좌표 변환 12가지 + 오일러(Euler)의 12가지. 그중 가장 유명한 것이 **X-Y-Z 고정각**, 즉 **롤·피치·요(Roll-Pitch-Yaw, RPY)** 다:

$$^A_B R_{XYZ}(\\gamma, \\beta, \\alpha) = R_z(\\alpha)\\,R_y(\\beta)\\,R_x(\\gamma)$$

세 회전 모두 **고정된 기준계 {A}의 축** 주위로 행해지며, [교환법칙이 성립하지 않으므로](#8-교환법칙은-성립하지-않는다) 곱하는 순서에 주의해야 한다.

비행기가 이 표현의 고향이다. 3차원에서 움직이는 자세를 서로 소통해야 했던 건 전쟁 중의 항공 분야였고, 관례는:

- **X축** = 진행 방향 → 이 축 주위 회전이 **롤(Roll)**
- **Z축** = 중력 방향 기준 (위로 잡는 사람도, 아래로 잡는 사람도 있다 — 선택의 문제)
- **Y축** = 오른손 법칙으로 자동 결정 → 이 축 주위 회전이 **피치(Pitch)**, Z축 주위가 **요(Yaw)**

RPY의 상세(역변환, atan2, 짐벌락, 쿼터니언과의 비교)는 다음 강의 노트인 [2-3 3D 회전 표현법 총정리](../orientation-representations/main.md)에서 다룬다. 특히 [오일러 각도](../orientation-representations/main.md) 절에 24가지 표현법의 일반화가 정리되어 있다.

---

## 10. Python 실습 코드

### 완성 코드 — 이 노트의 모든 예제 재현

\`\`\`python
import numpy as np

def rot_z(deg):
    """Z축 회전 행렬 (3x3)"""
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[c, -s, 0],
                     [s,  c, 0],
                     [0,  0, 1]])

def make_T(R, p):
    """3x3 회전 R + 3x1 위치 p → 4x4 동차 변환 행렬"""
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = p
    return T

def inv_T(T):
    """변환 행렬 전용 역변환: [R^T | -R^T p] — np.linalg.inv보다 빠르고 안정적"""
    R, p = T[:3, :3], T[:3, 3]
    Ti = np.eye(4)
    Ti[:3, :3] = R.T
    Ti[:3, 3] = -R.T @ p
    return Ti

def apply_T(T, p):
    """점 p(3,)에 T 적용 — 1을 붙였다가 떼는 과정을 감춰준다"""
    return (T @ np.append(p, 1.0))[:3]

# ── 예제 2.2 / 2.4: 매핑 = 연산자 (같은 계산) ──
T = make_T(rot_z(30), [10, 5, 0])
print(apply_T(T, [3, 7, 0]))          # [ 9.098 12.562  0.   ]

# ── 예제 2.3: 회전 연산자 ──
print(rot_z(30) @ np.array([0, 2, 0]))  # [-1.     1.732  0.   ]

# ── 예제 2.5: 역변환 ──
T25 = make_T(rot_z(30), [4, 3, 0])
print(inv_T(T25))                     # 위치 열: [-4.964 -0.598  0.   ]
assert np.allclose(inv_T(T25), np.linalg.inv(T25))  # 범용 인버스와 일치 확인

# ── 예제 2.7: 교환법칙 불성립 ──
def rot_x(deg):
    c, s = np.cos(np.radians(deg)), np.sin(np.radians(deg))
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])

print(np.allclose(rot_z(30) @ rot_x(30), rot_x(30) @ rot_z(30)))  # False
\`\`\`

scipy를 쓰면 회전 표현 간 변환은 한 줄이다 (\`Rotation.from_euler("xyz", ...)\`, \`.as_matrix()\` — [2-1의 실습 코드](../orientation-representations/main.md) 참고). ROS2에서는 이 노트의 변환 방정식·루프 관리를 **tf2**가 대신 해준다 — \`geometry_msgs/TransformStamped\`로 좌표계 쌍마다 $T$를 발행하면, 임의의 두 좌표계 사이 변환을 tf2가 체인을 따라 곱하고 뒤집어서 구해준다.

### 연습문제

\`\`\`python
# ── 연습 1: 복합 변환 (식 2.17 검증) ──
# TODO: T_AB = make_T(rot_z(30), [10, 5, 0]), T_BC = make_T(rot_x(20), [0, 0, 2])를 만들고
#       T_AC = T_AB @ T_BC 의 위치 열이
#       "R_AB @ p_C_in_B + p_B_in_A" 와 같은지 np.allclose로 확인하라.
#       (위치가 단순 합 [10, 5, 2]가 아님을 눈으로 볼 것)

# ── 연습 2: 예제 2.6 로봇·테이블·볼트 ──
# TODO: 임의의 T_BT(베이스→손끝), T_BS(베이스→테이블), T_SG(테이블→볼트)를 만들고
#       T_TG = inv_T(T_BT) @ T_BS @ T_SG 를 계산하라.
# 검증: T_BT @ T_TG 와 T_BS @ T_SG 가 같아야 한다 (둘 다 베이스→볼트).

# ── 연습 3: 루프 방정식 풀기 (2.7절) ──
# TODO: 네 좌표계 U, A, D와 B, C, D 경로를 임의로 구성해 T_BC를 "모르는 값"으로 두고,
#       T_BC = inv_T(T_UB) @ T_UA @ T_AD @ inv_T(T_CD) 로 복원한 뒤 원본과 비교하라.
\`\`\`

---

## 11. 핵심 요약 카드

> **변환 행렬(균질 변환) $T$ — 2장에서 반드시 기억할 하나**
>
> $$^A_B T = \\begin{bmatrix} {}^A_B R_{3\\times3} & {}^A P_{BORG} \\\\ 0\\;0\\;0 & 1 \\end{bmatrix}$$
>
> | 주제 | 핵심 |
> |------|------|
> | 매핑 vs 연산자 | 같은 행렬, 같은 계산, 관점만 다름. 첨자 있으면 매핑, 없으면 연산자 |
> | 복합 변환 | $^A_C T = {}^A_B T\\,{}^B_C T$ — 가운데 첨자가 대각선으로 지워짐. 위치는 단순 합이 아님 |
> | 역변환 | $T^{-1} = [\\,R^T \\mid -R^T P\\,]$ — 손으로도 가능. 첨자 위아래 뒤집기 |
> | 변환 방정식 | 루프에서 모르는 변환 하나는 양변에 인버스를 곱해 소거하며 구함 |
> | 로봇 응용 | $^T_G T = ({}^B_T T)^{-1}\\,{}^B_S T\\,{}^S_G T$ → 이걸 $I$로 만들면 잡기 성공 |
> | 회전의 자유도 | $R$은 9칸이지만 실질 3개 (Cayley: $R = (I-S)^{-1}(I+S)$) |
> | 주의 | 회전은 교환법칙 불성립 — 순서가 스펙이다 |
`,

  'Robotics/로보틱스-좌표의-두가지-표기법': `---
title: 로보틱스 좌표의 두가지 표기법
date: 2026-08-18
tags: 
order: 
featured: false
draft: false
---

# 로보틱스 좌표의 두가지 표기법

[DH 파라미터](../denavit-hartenberg-parameters/main.md) 나 [URDF](../../ROS2/ros2-urdf-syntax/main.md) 는 방식은 다르지만 전부 로봇의 기구 좌표를 표기 하는 것을 목표로 한다.
3D의 에서 사용하는 리깅, matrix같은 행렬 곱이나 로봇의 순기구학 에서 사용하는 행렬 곱이나 결국 수학적으로 동일한 구조라는 것을 알 수 있다.

- houdini 함수: \`ident()\`, \`translate()\`, \`rotate()\`, ...
- DH 파라미터
- URDF

**Houdini** 에서
어떤 지오메트리를 $O_{pos}$으로 보낼때  역행렬을 역순으로 곱해주는 방식을 많이 썼다.

\`translate()\`는 [전위 연산자](../transformation-matrix/main.md) 와 같다.
\`rotate()\` 는[회전 연산자](../transformation-matrix/main.md) 와 같다.
\`ident()\` 는 로보틱스에서 base_link로 사용 가능한 원점 단위 행렬과 동일 하다.

**Robotics** 에서도
완전히 같은 원리를 사용한다. 선형대수의 행렬곱을 베이스로 동차 행렬을 링크 별로 이어 나가는 4x4 행렬을 만들기 때문이다.
대신 표기는 DH 파라미터 ( $\\theta$, d, a, $\\alpha$ ) 로 간단 표기가 가능 하다. 

결국 두 환경에서 모두 같은 수학적 논리를 사용 하기 때문에 4x4 행렬이 나온다.`,

  'log/darkRuinOptimization': `---
title: DarkRuin Optimization
date: 2026-06-01
tags: optimization, Unreal Engine
featured: false
order: 
draft: false
---

---
## Overview
Unreal 라이브러리에서 얻을 수 있는 DarkRuin 씬을 최적화해 보았다.
![](paste-20260609051458.webp)

**하드웨어**
GPU | RTX 2070 SUPER |
--- | --- |
CPU | Ryzen9 3900X | 
RAM | 64GB |

**목표**
60fps


## Workflow

### Drawcall
#### 메쉬 정리

레벨 배치가 모두 완료된 씬이니 계단 같은 작은 메쉬들이 뭉쳐 있는 것들을 병합해 주었다.
RenderDoc에서 튀는 메쉬들 HDA로 데시메이션, LOD 정리 및 최적화 진행.
Opaque 머티리얼 동일 Master로 단일화 
![](paste-20260615102329.webp)


#### 머티리얼 최적화
Opaque 머티리얼은 직접 제작한 [Bakerst](../../../works/bakerst/main.md) 플러그인을 사용하여 텍스처 기반 단순 머티리얼로 변환.
일괄적으로 최대 2K로 사용하게 리밋을 잡아 주었다. 디테일이 떨어지는 부분은 추후에 재조정.

\`\`\`compare
![](paste-20260617071714.webp)
![](UnrealEditor_wW6Que9X1d.webp) 
\`\`\`

### Light
- 무드용 라이트 \`shadow cast\` off
- static, stationary 로 변경
- 라이트 반경 조절
- 불필요한 라이트 제거
- 촛불 라이트  -> spot 라이트 교체
씬의 무드를 위한 라이트는 shadow를 전부 꺼 주었다. 작은 촛불 하나씩 있던 라이트를 전부 지우고 스포트 라이트로 표현해 주었다.

![](paste-20260601133247.webp) |![](paste-20260611015459.webp)|
--- | --- |

### PostProcessing

포스트 프로세싱 중 연산 효율이 좋지 않고 변화가 거의 없는 것들은 수정을 해 주었다.

![](qrenderdoc_8D5m2riMwB.webp)

\`\`\`
r.BloomQuality 0
r.AntiAliasingMethod 2
sg.AntiAliasingQuality 2
r.LensFlareQuality 0
\`\`\`


![](paste-20260617083354.webp)
\`\`\`compare
![](paste-20260617085152.webp)
![](paste-20260617085810.webp)
\`\`\`

## Result
빌드 후 프레임
![](paste-20260618025750.webp)

`
};
