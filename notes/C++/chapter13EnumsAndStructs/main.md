---
title: Chapter 13 — Compound Types: Enums and Structs (열거형과 구조체)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 13 — Compound Types: Enums and Structs (열거형과 구조체)

> 출처: learncpp.com Chapter 13, 대상: 기계공학 배경 C++ 입문자 (ROS2 학습 목적)

---

## 목차
1. [프로그램 정의 타입](#1-프로그램-정의-타입-program-defined-types)
2. [범위 없는 열거형](#2-범위-없는-열거형-unscoped-enumerations)
3. [열거자-정수 변환 규칙](#3-열거자-정수-변환-규칙)
4. [열거형 ↔ 문자열 변환](#4-열거형을-문자열로문자열에서-변환)
5. [입출력 연산자 오버로딩 입문](#5-입출력-연산자-오버로딩-입문)
6. [범위 있는 열거형 (enum class)](#6-범위-있는-열거형-enum-class)
7. [구조체, 멤버, 멤버 선택](#7-구조체-멤버-멤버-선택)
8. [구조체 집합체 초기화](#8-구조체-집합체-초기화)
9. [기본 멤버 초기화자](#9-기본-멤버-초기화자)
10. [구조체 전달과 반환](#10-구조체-전달과-반환)
11. [구조체 잡학 — 크기와 패딩](#11-구조체-잡학--크기와-패딩)
12. [포인터·참조를 통한 멤버 선택](#12-포인터·참조를-통한-멤버-선택)
13. [클래스 템플릿](#13-클래스-템플릿)
14. [클래스 템플릿 인수 추론 (CTAD)](#14-클래스-템플릿-인수-추론-ctad)
15. [별칭 템플릿](#15-별칭-템플릿)

---

## 1. 프로그램 정의 타입 (Program-Defined Types)

C++가 제공하는 기본 타입(`int`, `double` 등)과 컴파운드 타입([참조·포인터](../chapter07ScopeDurationAndLinkage/main.md) 등)만으로는 도메인 개념을 표현하기 부족할 때가 많다. 분수(fraction) 하나만 봐도 분자와 분모는 개념적으로 하나로 묶여야 하는데, `int` 두 개를 따로 선언하면 이 관계가 코드에 드러나지 않는다. **프로그램 정의 타입**은 이런 도메인 개념을 언어에 직접 새겨 넣는 수단이다.

C++는 두 갈래로 프로그램 정의 타입을 제공한다.

| 구분 | 종류 |
|---|---|
| 열거형 타입 | unscoped enum, scoped enum (enum class) |
| 클래스 타입 | struct, class, union |

**정의 규칙(중요)**: 프로그램 정의 타입은 각 번역 단위(translation unit)에서 사용되기 *전에* 완전히 정의되어 있어야 한다 — 전방 선언만으로는 부족하다. <mark style="background: #ADCCFFA6;">컴파일러가 객체를 위한 메모리 크기를 결정하려면 타입의 완전한 정의가 필요하기 때문이다.</mark> 함수는 시그니처만 알아도 호출 코드를 생성할 수 있지만, 타입은 "이 타입이 몇 바이트를 차지하고 멤버가 무엇인지" 없이는 변수를 만들 수조차 없다.

```cpp
struct Fraction {
    int numerator {};
    int denominator {};
};  // 세미콜론 필수 — 빼먹으면 알아채기 힘든 에러가 남

int main() {
    Fraction f { 3, 4 };
    return 0;
}
```

타입 정의는 [One Definition Rule](../chapter07ScopeDurationAndLinkage/main.md)에서 부분적으로 예외를 인정받는다 — 여러 번역 단위에 동일한 정의가 중복 등장하는 것은 허용되지만, 모든 정의가 완전히 일치해야 한다(그렇지 않으면 미정의 동작).

**배치 지침**:
- 한 파일에서만 쓰는 타입 → 그 파일의 첫 사용처 근처에 정의
- 여러 파일에서 쓰는 타입 → 타입 이름과 같은 헤더 파일(예: `Fraction.h`)에 정의하고 `#include`

**네이밍**: 타입 이름은 대문자로 시작하고 접미사 없이 쓴다 (`Fraction`, `fraction`이나 `Fraction_t` 아님).

---

## 2. 범위 없는 열거형 (Unscoped Enumerations)

관련된 값들의 작은 집합을 표현해야 할 때(색상, 요일, 상태 코드 등), 매직 넘버(`0`, `1`, `2`)를 쓰면 의도가 코드에서 사라진다. **열거형(enumeration)**은 변수를 미리 정의된 기호 상수 집합으로 제한해 의미를 코드에 남긴다.

```cpp
enum Color
{
    red,
    green,
    blue,
};

int main()
{
    Color apple { red };
    return 0;
}
```

- `enum` 키워드로 새 타입을 선언
- 열거자(enumerator)는 <mark style="background: #ADCCFFA6;">쉼표로 구분</mark> (세미콜론 아님)
- 정의 전체는 <mark style="background: #ADCCFFA6;">세미콜론으로 종료</mark>
- 각 열거자는 암묵적으로 [constexpr](../chapter05ConstantsAndStrings/main.md) 값

**네이밍 컨벤션**: 열거형 타입 이름은 대문자로, 열거자는 소문자로 시작한다. 이렇게 하면 프로그램 정의 타입과 그 값을 구분하기 쉽고, 전처리기 매크로(관례상 `ALL_CAPS`)와도 헷갈리지 않는다.

### 스코프 오염 문제

범위 없는 열거형의 치명적 한계: **열거자 이름이 열거형 정의 자체와 같은 스코프에 들어간다.** 그래서 서로 다른 열거형이 같은 이름의 열거자를 가지면 충돌한다.

```cpp
enum Color { blue };
enum Feeling { blue };  // 에러: 이름 충돌
```

**해결책**:
- 열거자에 접두어 붙이기 (`color_blue`, `feeling_blue`)
- 네임스페이스로 감싸기

> [!NOTE]
> **네임스페이스로 감싸는 예시**
> ```cpp
> namespace Color
> {
>     enum Color { red, green, blue };
> }
> 
> namespace Feeling
> {
>     enum Feeling { happy, sad, blue };
> }
> 
> int main()
> {
>     Color::Color paint { Color::blue };
>     Feeling::Feeling mood { Feeling::blue };
>     return 0;
> }
> ```
> 각 `enum`을 자신만의 `namespace`로 감싸면 `blue`라는 열거자 이름이 `Color::blue`와 `Feeling::blue`로 분리되어 전역 스코프를 오염시키지 않는다. 접근할 때는 스코프 해석 연산자(`::`)로 네임스페이스를 명시해야 한다.
> 
> 문법상 나중에 배울 `enum class`의 `Color::red` 접근 방식과 비슷해 보이지만 원리는 다르다 — `enum class`는 언어 차원에서 스코프를 강제하는 반면, 이 방법은 네임스페이스라는 별도 도구를 빌려 비슷한 효과를 흉내 낸 것뿐이다. `enum class`가 나온 이후로는 이 패턴을 잘 쓰지 않는다.

- [범위 있는 열거형](#6-범위-있는-열거형-enum-class) 사용

열거형 타입은 타입 별칭과 달리 다른 타입과 **구별되는 별개의 타입**이다. 이 덕분에 오버로딩이 가능하고, 한 열거형의 값을 다른 열거형 변수에 실수로 대입하는 사고를 막는다.

---

## 3. 열거자-정수 변환 규칙

### 열거자 → 정수 (암묵적, 한 방향)

범위 없는 열거형은 **자신의 기저 정수 타입으로 암묵적 변환**된다. 열거자는 컴파일 타임 상수이므로 이 변환은 `constexpr` 변환이다.

```cpp
Color apple { blue };  // blue = 2
std::cout << apple;    // 2 출력
```

### 정수 → 열거자는 암묵적으로 안 됨

반대 방향은 **암묵적으로 동작하지 않는다.**

```cpp
enum Pet { cat = 0, dog = 1, pig = 2 };
Pet pet = 2;  // 컴파일 에러
```

이 제약은 잘못된 값이 실수로 대입되는 것을 막기 위한 안전장치다. 정수는 열거형이 정의하지 않은 값(예: `99`)도 자유롭게 가질 수 있는데, 이를 그대로 받아들이면 열거형이 "제한된 값 집합"이라는 존재 의미를 잃는다.

[static_cast](../chapter10TypeConversionAndDeduction/main.md)로 명시적 변환은 가능하다.

```cpp
Pet pet = static_cast<Pet>(2);  // OK
```

### C++17 예외 — 기저 타입을 명시한 경우

열거형이 기저 타입을 명시하면, **중괄호 초기화**에 한해 정수 대입이 허용된다.

```cpp
enum Pet: int { cat = 0, dog = 1 };
Pet pet1 { 2 };  // C++17+에서 OK
pet1 = 2;        // 이건 여전히 에러
```

---

## 4. 열거형을 문자열로/문자열에서 변환

### 문제 상황

열거형 값을 그냥 출력하면 열거자 이름이 아니라 **기저 정수값**이 찍힌다. `Color::blue`를 출력하면 `"blue"`가 아니라 `2`가 나온다 — 디버깅이나 사용자 출력에는 쓸모가 없다.

### 열거형 → 문자열: switch 문

가장 표준적인 방법은 각 열거자를 문자열로 매핑하는 함수를 `switch`로 작성하는 것이다.

```cpp
constexpr std::string_view getColorName(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}
```

- [std::string_view](../chapter05ConstantsAndStrings/main.md) 반환 → 문자열 복사 없이 효율적
- `constexpr`로 표시 → 컴파일 타임 사용 가능
- 문자열 리터럴은 프로그램 실행 내내 살아있으므로 안전
- `default`로 예상 밖의 값도 처리

> [!NOTE]
> **Q&A: default 없이 컴파일해도 괜찮은 이유**
> **Q. switch에 case가 3개, enum 열거자도 3개인데 default 없이도 에러가 안 나던데?**
> GCC/Clang은 `switch`가 `enum` 타입 하나를 대상으로 할 때 **선언된 열거자를 전부 case로 처리했는지** 특별히 검사한다. 다 처리했으면 "값 없이 함수가 끝날 일은 없다"고 정적으로 증명되어 `-Wreturn-type` 경고 자체가 안 뜬다.
>
> 단, 이건 컴파일러의 배려일 뿐 언어 차원의 보장은 아니다. `static_cast<Color>(99)`처럼 범위 밖 값을 억지로 넣으면 여전히 값 없이 함수가 끝나는 미정의 동작(UB)이 발생할 수 있다. 그래서 `default`는 "경고를 없애려고"가 아니라 **이런 방어적 상황까지 안전하게 처리하려고** 붙인다.

### 문자열 → 열거형: std::optional + if문

C++는 문자열로 `switch`를 할 수 없으므로 `if` 연쇄로 처리한다.

```cpp
constexpr std::optional<Pet> getPetFromString(std::string_view sv)
{
    if (sv == "cat")   return cat;
    if (sv == "dog")   return dog;
    if (sv == "pig")   return pig;
    if (sv == "whale") return whale;
    return {};  // 매칭 실패 → 빈 optional
}
```

[std::optional](../chapter12ReferencesAndPointers/main.md)로 "값 없음"을 표현하는 것은 잘못된 입력에 대해 억지 sentinel 열거자를 만들지 않고도 실패를 자연스럽게 나타낼 수 있게 한다. 사용자 입력을 받을 때는 소문자로 변환 후 비교하면 대소문자 구분 없이 매칭할 수 있다.

> [다음 절](#5-입출력-연산자-오버로딩-입문)에서 `operator<<`를 오버로딩하면 `std::cout << getColorName(shirt)` 대신 `std::cout << shirt`처럼 더 자연스럽게 쓸 수 있다.

---

## 5. 입출력 연산자 오버로딩 입문

**연산자 오버로딩**은 기존 연산자를 사용자 정의 타입(열거형, 클래스 등)에서 동작하도록 재정의하는 것이다.

**규칙**:
1. 연산자 기호로 함수 이름을 짓는다 (예: `operator<<`)
2. 왼쪽부터 순서대로 각 피연산자에 대응하는 매개변수를 둔다
3. 매개변수 중 최소 하나는 사용자 정의 타입이어야 한다
4. 연산 결과를 적절히 반영하는 타입을 반환한다

### operator<< (출력)

```cpp
std::ostream& operator<<(std::ostream& out, const Color& color)
{
    out << getColorName(color);
    return out;
}
```

- 왼쪽 매개변수: `std::ostream&` (수정되는 출력 스트림)
- 오른쪽 매개변수: 사용자 정의 타입 (출력할 값)
- 반환 타입: `std::ostream&` — 체이닝(`std::cout << a << b`)을 가능하게 함
- 참조 매개변수 → 불필요한 복사 방지

### operator>> (입력)

```cpp
std::istream& operator>>(std::istream& in, Pet& pet)
{
    std::string s{};
    in >> s;
    // s를 파싱해 pet에 대입
    return in;
}
```

**핵심 설계 원칙**: 오른쪽 피연산자는 반드시 **참조 매개변수**여야 한다. 만약 `pet`이 값 매개변수였다면, `operator>>`는 원본이 아니라 오른쪽 피연산자의 *복사본*에 값을 대입하게 되어 호출자가 전달한 실제 변수는 전혀 바뀌지 않는다 — 참조가 아니면 입력 결과가 사라진다.

입력 검증 실패 시 `in.setstate(std::ios_base::failbit)`로 스트림을 실패 상태로 만들면, 호출자가 표준 스트림 상태 검사로 추출 실패를 감지할 수 있다.

> [!NOTE]
> **Q&A: operator<<, operator>> 실전 사용법과 흔한 실수**
> **Q. operator<<를 만들어놓고 어떻게 써?**
> `std::cout << color`라고 쓰면 `<<`는 `operator<<(std::cout, color)`를 호출하는 문법 설탕(syntactic sugar)일 뿐이라, 컴파일러가 `color`의 타입(`Color`)에 맞는 오버로드를 자동으로 찾아 호출한다. 단, 이 함수는 **사용하는 지점(`main`)보다 위에 정의**돼 있어야 한다.
>
> **Q. operator>>도 마찬가지로 std::cin >> pet만 쓰면 돼?**
> 맞다. 다만 예시 코드의 `// s를 파싱해 pet에 대입` 자리를 실제로 채워야 의미가 있다. `getPetFromString`(4절) 같은 문자열→열거형 변환 함수를 활용:
> ```cpp
> std::istream& operator>>(std::istream& in, Pet& pet)
> {
>     std::string s{};
>     in >> s;
>     if (auto p{ getPetFromString(s) })
>         pet = *p;                              // 파싱 성공
>     else
>         in.setstate(std::ios_base::failbit);   // 파싱 실패
>     return in;
> }
> ```
> `auto p`로 받는 이유: `getPetFromString`의 반환 타입은 `Pet`이 아니라 `std::optional<Pet>`이다. `Pet p{ getPetFromString(s) };`라고 쓰면 `optional<Pet>`→`Pet` 암묵 변환이 없어 에러가 난다. `auto`로 받아야 실제 타입(`optional<Pet>`) 그대로 추론되고, `if (auto p{...})`는 `optional`의 `operator bool()`(값이 있으면 true)을 이용한 관용구다. 값을 꺼낼 땐 `*p`(역참조)를 쓴다.
>
> **실전에서 겪기 쉬운 버그 3가지**
> 1. **`std::istream&`을 `std::ostream&`로 오타** — 반환 타입은 `istream&`인데 매개변수를 `ostream& in`으로 잘못 쓰면, 함수 본문의 `in >> s`에서 "출력 스트림엔 `>>`가 없다"는 에러가 난다.
> 2. **파싱 결과를 실제로 대입하지 않음** — `in >> s`로 문자열만 읽고 `color = *c` 같은 대입을 빼먹으면, 매개변수는 항상 호출 전 초기값(보통 열거자 0번째, 예: `red`)에 머물러서 "뭘 입력해도 결과가 똑같다"는 증상이 생긴다.
> 3. **정작 파싱된 변수를 출력 안 함** — `std::cout << Color::red;`처럼 고정값을 출력해놓고, 입력받은 변수(`ccolor`)는 따로 출력을 안 하면 입력과 무관하게 항상 같은 값이 화면에 찍힌다. 반드시 `std::cout << ccolor;`처럼 실제로 채워진 변수를 출력해야 한다.
> 4. **`std::cin`을 `std::in`으로 오타** — `std::in`이라는 건 없다. 표준 입력은 `std::cin`.

> [!NOTE]
> **Q&A: "can be made static" 린터 제안과 constexpr의 관계**
> **Q. 함수에 "Function can be made static"이라는 메시지가 뜨는데 에러야?**
> 컴파일 에러가 아니라 clang-tidy 같은 린터의 제안이다. 이 함수가 같은 `.cpp` 파일 안에서만 쓰이고 다른 번역 단위에서 호출되지 않는다면, `static`을 붙여 **내부 연결(internal linkage)**을 주라는 뜻 — 다른 파일에서 같은 이름 함수를 정의해도 링크 충돌이 안 나고, 컴파일러가 인라이닝 등 최적화를 더 적극적으로 할 수 있다.
> ```cpp
> static std::string_view getColorName(Color color) { /* ... */ }
> ```
> **Q. constexpr을 붙이면 이 경고가 해결돼?**
> 아니다, 목적이 다른 별개의 속성이다. `constexpr`은 암묵적으로 `inline`이 되어 "여러 번역 단위에 같은 정의가 있어도 ODR 위반이 아니다"를 보장한다 — 즉 **헤더에 정의해서 여러 파일에서 공유**하기 위한 것이다. 반대로 `static`은 **이 파일 밖에서는 아예 안 보이게 감추는 것**이다. 목적이 반대이므로 필요하면 `static constexpr`처럼 같이 쓸 수도 있다.
>
> | 상황 | 선택 |
> |---|---|
> | 이 파일 안에서만 쓴다 | `static` |
> | 헤더에 정의해 여러 파일에서 공유한다 | `inline` / `constexpr` |
> | 둘 다 원한다 | `static constexpr` |

---

## 6. 범위 있는 열거형 (enum class)

### 범위 없는 열거형의 두 가지 문제

**1) 타입 안전성 부재** — 서로 무관한 두 열거형의 값이 정수로 변환되어 비교가 성립해버린다.

```cpp
enum Color { red, blue };
enum Fruit { banana, apple };
if (color == fruit) // 컴파일됨! 둘 다 int로 변환돼 비교
```

**2) 네임스페이스 오염** — 전역에서 정의된 범위 없는 열거자는 전역 네임스페이스를 차지해 이름 충돌 위험이 있다.

`enum class`(scoped enumeration)는 이 두 문제를 해결하기 위해 도입됐다.

### 범위 없는 열거형과의 차이

**1) 정수로 암묵적 변환되지 않음** — `red + 5` 같은 의미 없는 연산이 원천 차단된다.

**2) 스코프가 열거형 이름에 강제로 귀속** — 열거자는 열거형의 스코프 안에만 존재하므로 `Color::red`처럼 접근해야 한다.

```cpp
enum class Color { red, blue };
Color c { Color::red };
```

### 명시적 변환이 필요할 때

- `static_cast<int>(color)`
- `std::to_underlying(color)` (C++23) — 캐스팅 없이 기저 타입 반환
- 단항 `operator+` 오버로드 — 변환을 자주 쓸 때 캐스팅을 줄이는 트릭

### C++20: using enum

```cpp
constexpr std::string_view getColor(Color color) {
    using enum Color;
    switch (color) {
        case red: return "red"; // Color:: 접두어 불필요
    }
}
```

**모범 사례**: "특별한 이유가 없다면 범위 없는 열거형보다 범위 있는 열거형을 선호하라." 타입 안전성과 코드 정리 면에서 명확히 우월하다.

---

## 7. 구조체, 멤버, 멤버 선택

**구조체(struct)**는 서로 관련된 여러 변수를 하나의 타입으로 묶는 프로그램 정의 데이터 타입이다. 사원 정보(id, age, wage 등) 12개를 따로따로 변수로 관리하는 대신 구조체로 묶으면 관계가 코드에 드러나고, 함수 매개변수도 줄고, 여러 인스턴스(여러 사원)를 다루기도 쉬워진다.

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

`struct` 키워드로 새 타입을 선언한다. 중괄호 안의 변수는 **데이터 멤버(멤버 변수)**라 부르며, 빈 중괄호 `{}`는 각 멤버를 값 초기화한다.

```cpp
Employee joe {}; // Employee 객체 생성
```

**멤버 선택 연산자**(`.`)로 개별 멤버에 접근한다.

```cpp
joe.age = 32;
std::cout << joe.age; // 32
```

---

## 8. 구조체 집합체 초기화

### 집합체(aggregate)의 조건

다음을 모두 만족하는 클래스 타입(구조체, 클래스, 유니온)이나 C 스타일 배열이 집합체다.

- 사용자가 선언한 생성자 없음
- private/protected 비정적 데이터 멤버 없음
- 가상 함수 없음

데이터 멤버만 있는 구조체는 대부분 집합체다.

### 초기화 문법

**집합체 초기화**는 중괄호로 감싼, 쉼표로 구분된 값 목록을 멤버 선언 순서대로 대응시킨다.

```cpp
Employee frank = { 1, 32, 60000.0 }; // 복사 리스트 초기화
Employee joe { 2, 28, 45000.0 };     // 선호되는 형태
```

**모범 사례**: 집합체를 초기화할 때는 (복사가 아닌) 중괄호 리스트 형태를 선호한다.

### 초기화자가 부족할 때

```cpp
struct Employee {
    int id {};
    double wage { 76000.0 };
    double whatever;
};

Employee joe { 2, 28 }; // whatever는 값 초기화되어 0.0
```

값이 멤버 수보다 적으면, 기본 멤버 초기화자가 있는 멤버는 그 기본값을, 없는 멤버는 값 초기화(대개 0)를 받는다. 빈 리스트 `{}`는 모든 멤버를 값 초기화한다.

### C++20 지정 초기화자 (Designated Initializers)

```cpp
Foo f1{ .a{ 1 }, .c{ 3 } }; // f1.b는 값 초기화되어 0
Foo f2{ .a = 1, .c = 3 };   // 대체 문법
```

멤버는 선언 순서대로 초기화해야 하며, 지정하지 않은 멤버는 값 초기화된다.

### const 구조체

```cpp
const Rectangle unit { 1.0, 1.0 };
const Rectangle zero { };
```

const 구조체 변수는 반드시 초기화해야 한다 — 나중에 대입으로 값을 채울 수 없기 때문이다.

### 초기화자 리스트로 재대입

```cpp
joe = { joe.id, 33, 66000.0 };                       // 멤버별 대입
joe = { .id = joe.id, .age = 33, .wage = 66000.0 };  // C++20
```

---

## 9. 기본 멤버 초기화자

**기본 멤버 초기화자**(non-static member initialization, NSDMI)는 구조체/클래스 정의 안에서 직접 초기값을 지정하는 기능이다. 객체가 명시적 초기화자 없이 생성될 때 이 값이 자동 적용된다.

```cpp
struct Something
{
    int x;       // 기본값 없음
    int y {};    // 값 초기화 → 0
    int z { 2 }; // 명시적 기본값 2
};
```

### 우선순위

1. **명시적 초기화자** (가장 우선) — 인스턴스 생성 시 제공된 값이 모든 걸 덮어씀
2. **기본 멤버 초기화자** — 구조체 정의에서 지정한 값
3. **값 초기화** — `{}`를 썼지만 그 멤버에 기본값이 없을 때
4. **초기화 안 됨** (가장 낮음) — 초기화 리스트도 없고 기본값도 없을 때

### 집합체 초기화와의 상호작용

```cpp
Something s3 {}; // 기본값 있는 멤버는 기본값, 없는 멤버는 값 초기화
```

<mark style="background: #ADCCFFA6;">초기화자가 없고 기본 멤버 초기화자가 있으면 기본값이 쓰인다.</mark>

**모범 사례**: 모든 멤버에 기본값을 지정해두면 어떤 상황에서도 초기화가 보장돼, 초기화되지 않은 멤버 변수라는 흔한 버그 원인을 차단한다. 집합체라면 기본 초기화(중괄호 없음)보다 값 초기화(`{}`)를 선호한다 — 더 안전하고 표준 초기화 패턴과 일관적이다.

---

## 10. 구조체 전달과 반환

### 참조로 전달

구조체를 쓰는 주된 이점은 <mark style="background: #ADCCFFA6;">여러 관련 변수를 하나로 묶는 것</mark>인데, 함수에 넘길 때 값으로 전달하면 이 이점이 복사 비용으로 상쇄된다. <mark style="background: #ADCCFFA6;">**구조체는 일반적으로 [(주로 const) 참조로 전달](../chapter12ReferencesAndPointers/main.md)**해 복사를 피한다.</mark>

```cpp
void printEmployee(const Employee& employee) {
    std::cout << "ID:   " << employee.id << '\n';
    std::cout << "Age:  " << employee.age << '\n';
    std::cout << "Wage: " << employee.wage << '\n';
}
```

이렇게 하면 멤버가 몇 개든 매개변수 하나로 처리되고, 멤버가 추가돼도 함수 시그니처를 바꿀 필요가 없으며, 불필요한 객체 복제를 피한다.

### 임시 구조체 전달

```cpp
printEmployee(Employee { 14, 32, 24.15 }); // 명시적 타입 (선호)
printEmployee({ 15, 28, 18.27 });          // 암묵적 타입 추론
```

임시 객체는 [rvalue](../chapter12ReferencesAndPointers/main.md)를 받는 매개변수(값 전달 또는 const 참조 전달)에만 바인딩된다.

### 반환은 값으로

함수는 구조체를 **값으로** 반환한다 — 참조로 반환하지 않는다.

```cpp
Point3d getZeroPoint() {
    return Point3d { 0.0, 0.0, 0.0 };
}
```

지역 변수를 [참조로 반환](../chapter12ReferencesAndPointers/main.md)하면 댕글링 참조가 되므로 값 반환이 필수다. 컴파일러는 가능하면 이동 시맨틱으로 이 비용을 최적화한다. 반환문에서 타입을 생략(`return { 0.0, 0.0, 0.0 };`)하거나 빈 중괄호로 값 초기화(`return {};`)할 수도 있다.

---

## 11. 구조체 잡학 — 크기와 패딩

### 중첩 구조체

프로그램 정의 타입은 다른 프로그램 정의 타입을 멤버로 가질 수 있다.

1. **전역 정의**: 타입을 따로 정의하고 멤버로 사용
2. **중첩 정의**: 타입 안에 타입을 정의 (스코프 해석 연산자로 접근, 예: `Company::Employee`) — 클래스에서 더 자주 쓰이며 이후 챕터에서 다룸

### 구조체 크기 계산

구조체 크기는 **멤버 크기 합 이상**이지만 종종 더 크다. 컴파일러가 성능 최적화를 위해 보이지 않는 여백인 **패딩(padding)**을 추가하기 때문이다.

예: `short`(2바이트) + `int`(4바이트) + `double`(8바이트) = 이론상 14바이트지만 실제로는 패딩 2바이트가 붙어 16바이트가 된다.

### 멤버 선언 순서의 영향

멤버 선언 순서가 패딩 위치에 영향을 주므로 구조체 크기에 큰 영향을 미친다 — 같은 멤버라도 순서만 바꾸면 크기가 50% 이상 차이날 수 있다. 컴파일러는 멤버 순서를 재배치할 수 없으므로, <mark style="background: #ADCCFFA6;">큰 타입부터 작은 타입 순으로 선언하면 패딩을 최소화할 수 있다.</mark>

패딩이 존재하는 이유는 **데이터 구조 정렬(data structure alignment)** — 프로세서가 메모리에 효율적으로 접근하기 위한 저수준 최적화다.

> [!NOTE]
> **Q&A: "큰 것부터 작은 것 순" 규칙, 항상 성립하나?**
> **Q. `int id; int age; double wage;` 순서인데 패딩 규칙 위반 아니야?**
> 계산해보면 이 경우는 우연히 문제없다.
> ```cpp
> struct Employee
> {
>     int id{};      // 4바이트, offset 0
>     int age{};     // 4바이트, offset 4
>     double wage{}; // 8바이트, offset 8 (이미 8의 배수라 정렬 요구치 만족)
> };
> // sizeof(Employee) == 16, 패딩 없음
> ```
> `int` 두 개(4+4=8바이트)가 `double`의 8바이트 정렬 요구치와 정확히 맞아떨어져서 패딩이 낄 자리가 없다. 순서를 뒤집어도(`wage, id, age`) 마찬가지로 16바이트, 패딩 없음 — **"큰 것부터"는 일반적인 휴리스틱**일 뿐, 작은 멤버들의 합이 큰 멤버의 정렬 요구치와 우연히 맞아떨어지면 순서 무관하게 이미 최적이다.
>
> 실제로 순서가 크기를 좌우하는 예:
> ```cpp
> struct Bad  { short a; double b; short c; };  // sizeof == 24
> struct Good { double b; short a; short c; };  // sizeof == 16
> ```

> [!NOTE]
> **패딩 심화: 정렬(alignment), 꼬리 패딩, #pragma pack**
> **왜 정렬이 필요한가**: CPU는 정렬된 주소(타입 크기의 배수)에서 데이터를 읽어야 한 번의 메모리 접근으로 값을 가져올 수 있다. 안 맞으면 성능이 떨어지거나(x86), 일부 임베디드/구형 ARM에서는 하드웨어 예외로 크래시한다. `alignof(T)`로 각 타입의 정렬 요구치를 확인할 수 있다 (`alignof(int) == 4`, `alignof(double) == 8`).
>
> **배치 규칙**: ① 각 멤버는 자신의 `alignof(T)` 배수인 offset에 배치, 안 맞으면 그 앞에 패딩 삽입 ② 구조체 전체의 정렬 요구치 = 멤버 중 가장 큰 정렬 요구치 ③ 구조체 크기는 그 정렬 요구치의 배수여야 하므로 **마지막 멤버 뒤에도 "꼬리 패딩(tail padding)"**이 붙을 수 있다 — 배열로 만들었을 때 두 번째 원소도 정렬이 유지되게 하기 위함이다.
>
> ```cpp
> #include <cstddef> // offsetof
> struct Example { char a; int b; char c; };
> // offsetof(Example, a) == 0
> // offsetof(Example, b) == 4  (앞에 패딩 3바이트)
> // offsetof(Example, c) == 8
> // sizeof(Example) == 12     (꼬리 패딩 3바이트 포함)
> ```
>
> **패딩을 강제로 없애기**: `#pragma pack(push, 1)` / `__attribute__((packed))`로 패딩을 없앨 수 있지만, 이건 네트워크 프로토콜 헤더나 파일 포맷처럼 바이트 단위로 레이아웃이 고정돼야 하는 특수한 경우에만 쓴다. 일반 코드에 함부로 쓰면 정렬 안 된 접근으로 성능이 떨어지거나 일부 플랫폼에서 크래시할 수 있고, 컴파일러마다 문법도 다르다.
>
> **ROS2 관점**: 센서 드라이버 등에서 raw 바이트 버퍼를 구조체로 `reinterpret_cast`해서 읽는 경우, 패딩을 모르면 필드가 엉뚱한 위치에서 읽혀 값이 깨진다. 외부에서 정해진 프로토콜이면 `#pragma pack(1)`로 레이아웃을 고정하고, 직접 설계하는 구조체라면 큰 타입 → 작은 타입 순으로 선언하는 게 실용적인 기본 전략이다.

### 소유 원칙

구조체는 가능하면 데이터 멤버를 직접 **소유**해야 한다 (`std::string_view` 같은 뷰 타입보다 `std::string` 같은 소유 타입 사용) — 그래야 댕글링 멤버와 미정의 동작을 피할 수 있다.

---

## 12. 포인터·참조를 통한 멤버 선택

### 참조 vs 직접 객체

구조체 참조는 객체 자체처럼 동작하므로 표준 멤버 선택 연산자(`.`)를 그대로 쓴다.

```cpp
Employee joe{ 1, 34, 65000.0 };
++joe.age; // 직접 접근

void printEmployee(const Employee& e) {
    std::cout << e.id << '\n'; // 참조도 . 로 접근
}
```

### 포인터는 문법이 다르다

점 연산자는 [포인터](../chapter12ReferencesAndPointers/main.md)를 통해 직접 멤버에 접근할 수 없다. 역참조는 가능하지만 문법이 번거롭다.

```cpp
Employee* ptr{ &joe };
std::cout << (*ptr).id << '\n'; // 동작은 하지만 번거로움
```

### 화살표 연산자 (->)

C++는 더 깔끔한 대안으로 **포인터를 통한 멤버 선택 연산자**(화살표 연산자)를 제공한다.

```cpp
std::cout << ptr->id << '\n'; // 선호되는 방식
```

암묵적으로 역참조를 수행해 `ptr->id`는 `(*ptr).id`와 동등하지만 연산자 우선순위 문제를 신경 쓸 필요가 없다.

**모범 사례**: 포인터로 멤버에 접근할 때는 점 연산자 대신 화살표 연산자를 쓴다.

### 화살표 체이닝

구조체 멤버 자체가 포인터라면 화살표를 연이어 쓸 수 있다.

```cpp
Triangle* ptr{ &tr };
std::cout << ptr->c->y << '\n'; // 중첩 포인터 멤버 접근
```

이는 장황한 `(*(*ptr).c).y` 문법을 대체한다.

### 혼합 접근

포인터 멤버와 비포인터 멤버가 섞여 있으면 두 연산자를 함께 쓴다.

```cpp
Animal* ptr{ &puma };
std::cout << (ptr->paw).claws << '\n'; // 포인터엔 ->, 비포인터 멤버엔 .
```

---

## 13. 클래스 템플릿

### 왜 필요한가

`PairInt`, `PairDouble`처럼 타입마다 별도 구조체를 만들면 거의 동일한 코드가 반복된다. [함수 템플릿](../chapter11FunctionOverloadingAndTemplates/main.md)이 함수의 중복을 없앴듯, **클래스 템플릿**은 하나의 정의로 필요한 타입 변형을 자동 생성해 타입의 중복을 없앤다.

### 기본 문법

```cpp
template <typename T>
struct Pair
{
    T first{};
    T second{};
};
```

`template <typename T>` 선언이 구조체 정의 앞에 붙고, `T`는 실제 타입을 위한 자리표시자가 된다.

### 인스턴스화

```cpp
Pair<int> p1{ 5, 6 };        // Pair<int> 생성
Pair<double> p2{ 1.2, 3.4 }; // Pair<double> 생성
```

컴파일러는 각 [템플릿 인스턴스화](../chapter11FunctionOverloadingAndTemplates/main.md)마다 별도의 타입 정의를 생성한다 — `Pair<int>`와 `Pair<double>`은 서로 다른 타입으로 취급된다.

### 다중 템플릿 매개변수

```cpp
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

Pair<int, double> p{ 1, 2.3 }; // 서로 다른 타입 혼합
```

함수 템플릿에서 [템플릿 타입을 여러 개](../chapter11FunctionOverloadingAndTemplates/main.md) 쓰던 것과 같은 원리가 클래스 템플릿에도 그대로 적용된다.

### 함수 템플릿과의 연동

함수 템플릿은 `Pair<T>` 매개변수를 받아 클래스 템플릿과 함께 동작할 수 있다.

```cpp
template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first < p.second ? p.second : p.first);
}
```

클래스 템플릿과 그 인스턴스화 결과 모두 One Definition Rule에서 면제되므로, 헤더 파일에 정의해 여러 번역 단위에서 `#include`해 쓰는 것이 표준적이다.

---

## 14. 클래스 템플릿 인수 추론 (CTAD)

### CTAD란

C++17부터 컴파일러는 초기화자의 타입을 보고 클래스 템플릿의 타입 매개변수를 **자동으로 추론**할 수 있다. `std::pair<int, int> p{1, 2};` 대신 `std::pair p{1, 2};`로 충분하다.

### 자동으로 동작하는 경우

표준 라이브러리는 `std::pair` 같은 타입에 미리 만들어진 추론 가이드를 제공하므로 대부분 별다른 도움 없이 동작한다. 리터럴 접미사로 추론에 힌트를 줄 수도 있다.

```cpp
std::pair p1{3.4f, 5.6f}; // pair<float, float>로 추론
std::pair p2{1u, 2u};     // pair<unsigned int, unsigned int>로 추론
```

### 추론 가이드가 필요한 경우

C++17에서는 사용자 정의 집합체 클래스 템플릿에 명시적 가이드가 필요하다. 아래 코드는 컴파일되지 않는다.

```cpp
template <typename T, typename U>
struct Pair { T first{}; U second{}; };

Pair p{1, 2}; // C++17에서 에러
```

### 추론 가이드 문법

```cpp
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;
```

"`Pair`가 T, U 타입의 인수 두 개로 초기화되면 템플릿 매개변수를 `Pair<T, U>`로 추론하라"는 뜻이다.

**참고**: C++20은 집합체에 대해 추론 가이드를 자동 생성하므로 최신 표준에서는 이 작업이 필요 없어진다.

### 한계

- 비정적 멤버 초기화와는 함께 동작하지 않음
- 함수 매개변수에는 CTAD를 쓸 수 없음(대신 함수 템플릿 사용)
- 명시적 템플릿 인수를 지정하면 추론이 일어나지 않음

> [!NOTE]
> **Q&A: 추론 가이드 작성 위치와 흔한 실수 2가지**
> **Q1. 추론 가이드는 어디에 쓰는 건가?**
> 클래스 템플릿 정의 **바로 다음, 전역(또는 네임스페이스) 스코프**에 쓴다. 클래스 본문 안이 아니라 밖에 나란히 둔다.
> ```cpp
> template <typename T, typename U>
> struct Pair { T first{}; U second{}; };
>
> template <typename T, typename U>  // 정의 바로 다음, 같은 스코프
> Pair(T, U) -> Pair<T, U>;
> ```
>
> **Q2. 멤버가 3개, 템플릿 매개변수가 2개인 집합체의 추론 가이드가 왜 에러 나는가?**
> ```cpp
> template <typename T, typename U>
> struct Employee { T id{}; T age{}; U wage{}; };
>
> template <typename T, typename U>
> Employee(T, T, U) -> Employee<T, T, U>;  // 에러
> ```
> `Employee`는 템플릿 매개변수가 2개(`T`, `U`)뿐인데 `Employee<T, T, U>`는 인수를 3개 넘긴다. 화살표 왼쪽(생성자 인자 패턴)의 인수 개수와 오른쪽(실제 클래스 템플릿의 매개변수 개수)은 별개 — 오른쪽은 반드시 `Employee<T, U>`로 써야 한다.
>
> **Q3. CTAD로 만든 객체의 포인터를 선언할 때 왜 `ClassName* ptr{ &obj };`가 안 되는가?**
> ```cpp
> Employee joe{ 3, 42, 200.0 };  // OK — joe 초기화라 CTAD 적용
> Employee* ptr{ &joe };         // 에러
> ```
> CTAD는 **템플릿 이름으로 객체를 직접 초기화할 때만** 동작한다. `joe`의 타입은 이미 `Employee<int, double>`로 확정됐지만, `Employee* ptr`은 포인터 타입 선언이라 CTAD 적용 대상이 아니다. `auto* ptr{ &joe };`(선호) 또는 `Employee<int, double>* ptr{ &joe };`로 명시해야 한다.

---

## 15. 별칭 템플릿

**별칭 템플릿**은 매개변수화된 타입 별칭을 만드는 템플릿이다. 일반 타입 별칭이 구체적인 타입 하나의 동의어라면, 별칭 템플릿은 템플릿 매개변수를 그대로 유지한 채 동작한다.

```cpp
template <typename T>
using AliasName = TemplateClass<T>;
```

예:

```cpp
template <typename T>
using Coord = Pair<T>;
```

`Coord`는 `Pair<T>`의 별칭 템플릿이 되고, 사용자가 타입 매개변수를 채워 넣는다.

**스코프 요구사항**: 별칭 템플릿은 반드시 전역 스코프에서 정의해야 한다 — 함수나 블록 안에서는 선언할 수 없다(템플릿 전반의 규칙과 일치).

**타입 구분**: 일반 타입 별칭과 마찬가지로 별칭 템플릿은 **구별되는 새 타입을 만들지 않는다** — 기존 템플릿 패턴의 편의상 이름일 뿐이다.

### 함수 매개변수에서 사용

별칭 템플릿을 함수 매개변수로 쓸 때는 템플릿 인수를 명시해야 한다.

```cpp
template <typename T>
void print(const Coord<T>& c) { }  // 올바름
// void print(const Coord& c) { }  // 동작하지 않음
```

### C++20: 별칭 템플릿 추론

C++20부터는 초기화자로부터 자동 추론이 가능해 `Coord<int> p { 1, 2 };` 대신 `Coord p { 1, 2 };`로 쓸 수 있다.

별칭 템플릿은 일부 템플릿 인수가 고정되거나 유연한 템플릿 타입이 필요할 때 코드 반복을 줄여 가독성과 유지보수성을 높인다.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|------|----------|
| 프로그램 정의 타입 | 사용 전 완전 정의 필수, 파일당 한 번씩 중복 정의는 ODR 예외로 허용 |
| unscoped enum | 값 집합에 이름 부여, 전역 스코프 오염 위험 |
| enum → int | 암묵적(constexpr) 변환 가능 |
| int → enum | 암묵적 불가, `static_cast` 필요 (C++17 기저타입+중괄호는 예외) |
| enum ↔ string | switch 문(enum→string) / `optional` + if 연쇄(string→enum) |
| 연산자 오버로딩 | `operator<<`/`operator>>`, 오른쪽 피연산자는 반드시 참조 |
| enum class | 암묵적 int 변환 차단 + 스코프 강제, 기본 선호 대상 |
| aggregate 초기화 | 생성자 없는 struct/class/union, 선언 순서대로 중괄호 리스트 |
| 기본 멤버 초기화자 | 명시값 > 기본 멤버 초기화자 > 값 초기화 > 미초기화 |
| 구조체 전달/반환 | 전달은 const 참조, 반환은 값(댕글링 방지) |
| 패딩 | 정렬을 위한 여백, 멤버 순서(큰→작은)로 최소화 가능 |
| `->` 연산자 | 포인터 멤버 접근의 표준, `(*ptr).x`보다 선호 |
| 클래스 템플릿 | `template <typename T> struct` 로 타입별 중복 제거 |
| CTAD | 초기화자로 템플릿 인수 자동 추론, 집합체는 C++17에 가이드 필요 |
| 별칭 템플릿 | 매개변수화된 `using`, 전역 스코프 필수 |

### 자주 하는 실수 TOP 5

1. **구조체/열거형 정의 끝에 세미콜론을 빼먹는다** — 다음 줄과 얽혀 알아보기 힘든 에러 발생
2. **정수를 unscoped enum 변수에 직접 대입** — 암묵적 변환은 enum→int 한 방향뿐, 역방향은 `static_cast` 필요
3. **`operator>>`에서 오른쪽 매개변수를 값으로 받기** — 참조가 아니면 입력값이 호출자에게 반영되지 않음
4. **구조체를 값으로 함수에 전달** — 멤버가 많을수록 복사 비용 커짐, const 참조가 기본
5. **구조체 멤버를 크기 순서 없이 아무렇게나 선언** — 패딩이 늘어나 예상보다 구조체가 커짐
