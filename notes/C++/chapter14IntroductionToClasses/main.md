---
title: Chapter 14 — Introduction to Classes (클래스 입문)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 14 — Introduction to Classes (클래스 입문)

> 출처: learncpp.com Chapter 14, 대상: 기계공학 배경 C++ 입문자 (ROS2 학습 목적)

---

## 목차
1. [객체지향 프로그래밍 입문](#1-객체지향-프로그래밍-입문)
2. [클래스 입문](#2-클래스-입문)
3. [멤버 함수](#3-멤버-함수)
4. [const 클래스 객체와 const 멤버 함수](#4-const-클래스-객체와-const-멤버-함수)
5. [public·private 멤버와 접근 지정자](#5-public·private-멤버와-접근-지정자)
6. [접근 함수 (getter·setter)](#6-접근-함수-getter·setter)
7. [데이터 멤버 참조를 반환하는 멤버 함수](#7-데이터-멤버-참조를-반환하는-멤버-함수)
8. [데이터 은닉(캡슐화)의 이점](#8-데이터-은닉캡슐화의-이점)
9. [생성자 입문](#9-생성자-입문)
10. [생성자 멤버 초기화 리스트](#10-생성자-멤버-초기화-리스트)
11. [기본 생성자와 기본 인수](#11-기본-생성자와-기본-인수)
12. [위임 생성자](#12-위임-생성자)
13. [임시 클래스 객체](#13-임시-클래스-객체)
14. [복사 생성자 입문](#14-복사-생성자-입문)
15. [클래스 초기화와 복사 생략](#15-클래스-초기화와-복사-생략)
16. [변환 생성자와 explicit 키워드](#16-변환-생성자와-explicit-키워드)
17. [constexpr 집합체와 클래스](#17-constexpr-집합체와-클래스)

---

## 1. 객체지향 프로그래밍 입문

### 절차적 프로그래밍의 한계

지금까지 써온 방식은 **절차적 프로그래밍(procedural programming)**이다 — 데이터([구조체](../chapter13EnumsAndStructs/main.md) 등)와 그 데이터를 다루는 함수가 서로 별개의 존재로 흩어져 있다. `eat(you, apple)`처럼 "누가 무엇을 하는지"를 함수 인자 순서로만 표현하다 보니, 코드를 읽는 사람이 주어·행동·대상의 관계를 함수 시그니처에서 역으로 추론해야 한다.

현실의 사물은 속성(property)과 행동(behavior)이 애초에 분리되지 않는다. 로봇 팔의 "현재 관절 각도"와 "관절을 움직이는 동작"은 개념적으로 하나의 단위다. 절차적 프로그래밍은 이 결합을 코드에 반영하지 못하고, **객체지향 프로그래밍(Object-Oriented Programming, OOP)**은 프로그램 정의 타입 안에 속성(데이터 멤버)과 행동(멤버 함수)을 함께 묶어 이 간극을 없앤다.

```cpp
// 절차적: 함수가 데이터를 외부에서 조작
eat(you, apple);

// OOP: 객체 스스로 행동을 수행
you.eat(apple);
```

`you.eat(apple)` 쪽이 "누가(you) 무엇을(apple) 하는지(eat)"를 문장처럼 그대로 드러낸다.

### 유지보수성 비교

동물 종류(cat, dog, chicken)를 다루는 프로그램을 예로 들면 차이가 분명해진다.

**절차적 방식** — enum과 그 값을 해석하는 함수들로 구성:

```cpp
enum AnimalType { cat, dog, chicken };

constexpr std::string_view animalName(AnimalType type)
{
    switch (type)
    {
    case cat: return "cat";
    case dog: return "dog";
    case chicken: return "chicken";
    default:  return "";
    }
}

constexpr int numLegs(AnimalType type)
{
    switch (type)
    {
    case cat: return 4;
    case dog: return 4;
    case chicken: return 2;
    default:  return 0;
    }
}
```

새 동물(snake)을 추가하려면 `enum`에 값을 넣고, `animalName`과 `numLegs` 등 관련된 **모든** `switch`문을 찾아 case를 추가해야 한다. 함수가 늘어날수록 빠뜨릴 위험도 커진다.

**OOP 방식** — 동물마다 자신의 속성을 담은 타입:

```cpp
struct Cat { std::string_view name{ "cat" }; int numLegs{ 4 }; };
struct Dog { std::string_view name{ "dog" }; int numLegs{ 4 }; };
struct Chicken { std::string_view name{ "chicken" }; int numLegs{ 2 }; };

int main()
{
    constexpr Cat animal;
    std::cout << "a " << animal.name << " has " << animal.numLegs << " legs\n";
}
```

새 동물을 추가할 때는 새 타입 하나만 만들면 되고, 기존 타입·함수는 전혀 건드릴 필요가 없다. 이것이 OOP가 주는 실질적 이점이다 — 기능 추가가 기존 코드 수정이 아니라 **새 코드 작성**으로 끝난다.

### OOP를 뒷받침하는 4대 개념

| 개념 | 역할 |
|---|---|
| 캡슐화(encapsulation) | 내부 구현을 감춰 인터페이스와 분리 |
| 상속(inheritance) | 타입 계층을 통한 코드 재사용 |
| 추상화(abstraction) | 복잡한 세부사항을 단순한 인터페이스로 축약 |
| 다형성(polymorphism) | 하나의 인터페이스로 여러 구현을 유연하게 다룸 |

이 챕터는 캡슐화를 중심으로 다루고, 나머지는 이후 챕터에서 각각 심화된다.

**주의**: OOP는 절차적 프로그래밍을 대체하는 게 아니라 복잡도를 관리하는 도구를 하나 더 얹는 것이다. 실전 코드는 대개 두 패러다임을 섞어 쓴다.

---

## 2. 클래스 입문

### struct로는 부족한 이유 — 클래스 불변식

**클래스 불변식(class invariant)**은 객체가 유효한 상태를 유지하려면 생애주기 내내 참이어야 하는 조건이다. 예를 들어 분수(Fraction)는 분모가 0이 되면 수학적으로 의미가 깨진다.

```cpp
struct Fraction
{
    int numerator {};
    int denominator {};
};

Fraction f { 3, 0 }; // 컴파일은 되지만 불변식 위반 — 분모 0
```

`struct`는 모든 멤버가 public이라 사용자가 언제든 `f.denominator = 0;`처럼 불변식을 깰 수 있다. <mark style="background: #ADCCFFA6;">불변식 유지를 객체 사용자의 선의에 맡기면 결국 문제가 생긴다</mark> — 사용자는 그 타입의 내부 규칙을 알 필요도, 지킬 의무도 없기 때문이다. 불변식이 깨진 객체를 사용하면 예상치 못한 동작이나 미정의 동작으로 이어질 수 있다.

### class 키워드

`class`는 `struct`와 문법적으로 거의 동일하지만, 멤버의 **기본 접근 수준**이 다르다 — `struct`는 기본 public, `class`는 기본 private다.

```cpp
class Employee
{
    int m_id {};
    int m_age {};
    double m_wage {};
    // 여기까지는 암묵적으로 private
};
```

private 멤버는 클래스 외부에서 접근할 수 없으므로, 사용자가 마음대로 불변식을 깰 수 없다. (접근 제어의 구체적 규칙은 [5절](#5-public·private-멤버와-접근-지정자)에서 다룬다.)

```cpp
class Date
{
public:                 // 명시적으로 public 지정해야 접근 가능
    int m_day{};
    int m_month{};
    int m_year{};
};

void printDate(const Date& date)
{
    std::cout << date.m_day << '/' << date.m_month << '/' << date.m_year;
}
```

**네이밍 컨벤션**: private(또는 이후 public이라도 관례상) 멤버 변수는 `m_` 접두어를 붙인다 — 지역 변수·매개변수와 구분되고, 멤버 변수끼리 이름이 겹치는 것도 막아준다.

`struct`와 `class`는 기술적으로 이 접근 수준 기본값 하나만 다르지만, **관례적 쓰임**은 뚜렷이 갈린다 — 불변식이 필요 없는 순수 데이터 묶음은 `struct`, 불변식 보호나 초기화 제어가 필요하면 `class`.

---

## 3. 멤버 함수

### 정의와 존재 이유

**멤버 함수**는 클래스 타입(struct, class, union)에 속한 함수다. [1절](#1-객체지향-프로그래밍-입문)에서 본 "속성+행동을 함께 묶는다"는 목표를 실현하는 수단이 바로 멤버 함수다.

| 구분 | 비멤버 함수 | 멤버 함수 |
|---|---|---|
| 선언 위치 | 클래스 밖 | 클래스 안 |
| 대상 객체 전달 | 명시적 매개변수 | 암묵적 객체(implicit object) |
| 멤버 접근 | `date.year`처럼 명시 | `year`처럼 그냥 이름 |
| 호출 문법 | `print(today)` | `today.print()` |

```cpp
// 비멤버 함수
void print(const Date& date)
{
    std::cout << date.year << '/' << date.month << '/' << date.day;
}

// 멤버 함수
struct Date
{
    int year {};
    int month {};
    int day {};

    void print()
    {
        std::cout << year << '/' << month << '/' << day; // year는 곧 this->year
    }
};
```

### 암묵적 객체 매개변수

`today.print()`를 호출하면 `today`가 **암묵적 객체(implicit object)**로 함수에 전달된다. 매개변수 목록엔 나타나지 않지만, 함수 본문 안에서 접두어 없이 쓰인 멤버 이름은 모두 이 암묵적 객체를 가리킨다.

```cpp
struct Person
{
    std::string name{};
    int age{};

    void kisses(const Person& person)
    {
        std::cout << name << " kisses " << person.name << '\n'; // name = 암묵적 객체(this), person.name = 매개변수
    }
};

Person joe{ "Joe", 29 };
Person kate{ "Kate", 27 };
joe.kisses(kate); // "Joe kisses Kate"
```

`joe.kisses(kate)`를 호출하면, 접두어 없는 `name`은 `joe.name`으로, `person.name`은 명시적으로 전달된 `kate.name`으로 해석된다.

### 멤버 순서는 자유롭다 — 단, 초기화 순서는 아니다

비멤버 함수와 달리, 멤버 함수는 클래스 안에서 나중에 선언된 멤버도 미리 참조할 수 있다. 컴파일러가 클래스 정의를 먼저 한 번 훑어 모든 멤버를 파악한 뒤 함수 본문을 컴파일하기 때문이다.

```cpp
struct Foo
{
    int z() { return m_data; } // m_data가 아래에 있어도 OK
    int m_data {};
};
```

**주의 — 이건 초기화 순서와는 별개다.** 데이터 멤버는 항상 **선언 순서대로** 초기화되므로, 기본 멤버 초기화자 안에서 아직 초기화되지 않은 다른 멤버를 참조하면 미정의 동작이다.

```cpp
struct Bad
{
    int m_bad1 { m_data }; // 미정의 동작: m_data는 아직 초기화 전
    int m_data { 5 };
};
```

이 구분(함수 본문에서의 자유로운 순서 vs 멤버 초기화의 엄격한 선언 순서)은 [10절](#10-생성자-멤버-초기화-리스트)에서 다시 등장한다.

### struct에 멤버 함수를 넣어도 되는가

가능하다 — 단, 생성자를 넣으면 [집합체(aggregate)](../chapter13EnumsAndStructs/main.md) 자격을 잃으므로, 집합체 초기화의 이점을 유지하려면 struct에는 생성자를 넣지 않는 게 일반적이다.

**모범 사례**: 데이터 멤버 없이 멤버 함수만 있는 클래스라면, 객체를 만들 이유가 없으므로 네임스페이스를 대신 쓰는 게 낫다.

---

## 4. const 클래스 객체와 const 멤버 함수

### const 객체는 왜 non-const 멤버 함수조차 호출하지 못하는가

```cpp
struct Date { int year{}, month{}, day{}; void print() { /* 아무것도 수정 안 함 */ } };

const Date today { 2020, 10, 14 };
today.day += 1;   // 에러: 멤버 수정 불가
today.print();    // 에러: 컴파일러가 이 함수가 실제로 수정을 안 하는지 알 방법이 없다
```

`print()`는 실제로는 아무 멤버도 바꾸지 않는데도 에러가 난다. **컴파일러는 함수 시그니처만 보고 호출 가능 여부를 판단**하며, 함수 본문을 분석해서 "이 함수는 안전하다"고 판단해주지 않는다. 시그니처에 아무 표시가 없으면 컴파일러는 "이 함수가 멤버를 바꿀 수도 있다"고 보수적으로 가정하고, `const` 객체에 대한 호출을 원천 차단한다.

### const 멤버 함수

함수 시그니처에 이 함수가 "객체를 바꾸지 않겠다"는 약속을 명시하는 것이<mark style="background: #ADCCFFA6;"> **const 멤버 함수**다. 매개변수 목록 뒤에 `const`를 붙인다.</mark>

```cpp
void print() const // const 멤버 함수
{
    std::cout << year << '/' << month << '/' << day;
}
```

이 약속은 컴파일러가 강제한다 — const 멤버 함수 안에서 멤버를 수정하려 하면 컴파일 에러가 난다.

```cpp
void incrementDay() const
{
    ++day; // 컴파일 에러: const 함수가 멤버를 수정하려 함
}
```

| const 멤버 함수 안에서 | 가능 여부 |
|---|---|
| 암묵적 객체의 멤버 수정 | 불가 |
| non-const 멤버 함수 호출 | 불가 (그 함수가 뭘 할지 보장 못 하므로) |
| const 멤버 함수 호출 | 가능 |
| 비멤버 객체 수정 | 가능 |
| 비멤버 함수 호출 | 가능 |

**모범 사례**: "객체 상태를 수정하지 않는(그리고 앞으로도 하지 않을) 멤버 함수는 항상 const로 선언하라" — 그래야 const/non-const 객체 양쪽에서 호출 가능한, 더 재사용성 높은 함수가 된다.

### const로 오버로딩

`const` 여부는 함수 시그니처의 일부이므로, 같은 이름에 const 버전과 non-const 버전을 함께 둘 수 있다.

```cpp
void print() { std::cout << "non-const\n"; }
void print() const { std::cout << "const\n"; }
```

컴파일러는 호출하는 객체가 <mark style="background: #ADCCFFA6;">const인지 아닌지에 따라 알맞은 오버로드를 자동 선택한다.</mark>

> ROS2 맥락: 센서 상태를 담은 클래스(`JointState` 등)를 콜백에서 `const JointState&`로 받는 일이 흔한데, 이때 값을 읽는 getter들이 const로 선언돼 있지 않으면 그 콜백 안에서 아예 호출조차 못 한다. const 정확성은 "습관"이 아니라 실제로 코드가 컴파일되느냐를 가르는 조건이다.

---

## 5. public·private 멤버와 접근 지정자

### public vs private

- **public 멤버**: 클래스 내부·외부 어디서든 제약 없이 접근 가능
- **private 멤버**: 같은 클래스의 다른 멤버만 접근 가능

```
class = 기본 private
struct = 기본 public
```

이 한 가지 기본값 차이가 `struct`와 `class`의 유일한 기술적 차이다.

### 접근 지정자

`public:`, `private:`, `protected:`(상속에서 다룸) 세 지정자로 이후 나오는 멤버들의 접근 수준을 명시적으로 바꿀 수 있다. 한 클래스 안에 여러 번 등장해도 된다.

| 수준 | 지정자 | 같은 클래스 멤버 | 파생 클래스 | 외부(public) |
|---|---|---|---|---|
| public | `public:` | 가능 | 가능 | 가능 |
| protected | `protected:` | 가능 | 가능 | 불가 |
| private | `private:` | 가능 | 불가 | 불가 |

### 접근 제어는 객체 단위가 아니라 클래스 단위

직관적으로는 "내 멤버만 내가 접근 가능"이라 생각하기 쉽지만, 실제로는 **같은 클래스의 다른 객체**의 private 멤버에도 접근할 수 있다.

```cpp
class Person
{
private:
    std::string m_name{};

public:
    void kisses(const Person& p) const
    {
        std::cout << m_name << " kisses " << p.m_name << '\n'; // p는 다른 객체지만 p.m_name 접근 OK
    }
};
```

접근 제어의 단위는 "이 코드가 어느 클래스에 속해 있는가"이지 "이 코드가 어느 객체 안에 있는가"가 아니기 때문이다. 이 점은 [3절](#3-멤버-함수)의 `kisses` 예제(암묵적 객체 vs 매개변수 객체)와 함께 이해하면 자연스럽다.

### private 멤버가 있으면 집합체 초기화가 막힌다

[집합체(aggregate)](../chapter13EnumsAndStructs/main.md)의 조건 중 하나가 "private/protected 비정적 데이터 멤버 없음"이었다 — private 멤버를 가진 클래스는 자동으로 집합체 자격을 잃는다. 그래서 private 멤버가 있는 타입은 `Employee e { 1, 2, 3.0 };` 같은 집합체 초기화를 쓸 수 없고, [생성자](#9-생성자-입문)로 초기화해야 한다.

### 모범 사례

| 타입 | 데이터 멤버 | 멤버 함수 |
|---|---|---|
| class | private(또는 protected) | public (의도적으로 제한하는 경우 제외) |
| struct | public, 접근 지정자 안 씀 | (되도록 생성자 없이) |

**struct를 쓸 때**: 단순 데이터 묶음이고, 불변식이 없고, 집합체 초기화의 이점이 필요할 때.
**class를 쓸 때**: 캡슐화·초기화 제어·정리(cleanup) 로직이 필요할 때.

---

## 6. 접근 함수 (getter·setter)

### 정의

**접근 함수(access function)**는 private 멤버 변수 하나의 값을 읽거나 쓰는, 그 자체로는 별다른 로직이 없는 public 멤버 함수다.

- **getter(접근자)**: private 멤버 값을 반환. 객체를 바꾸지 않으므로 항상 `const`.
- **setter(변경자)**: private 멤버 값을 바꿈. 상태를 바꾸므로 `const`가 아님.

### 네이밍 방식 3가지

| 방식 | 예시 | 특징 |
|---|---|---|
| get/set 접두어 | `getDay()` / `setDay()` | 접근 함수임이 명확, 저비용 연산임을 암시 |
| 접두어 없음(오버로딩) | `day()` (양쪽 다) | 간결, 표준 라이브러리 스타일이지만 `d.day(5)`만 보면 조회인지 변경인지 헷갈림 |
| set만 접두어 | `day()` / `setDay()` | 명료함과 간결함의 절충, 이 챕터의 권장 방식 |

```cpp
class Date
{
private:
    int m_year { 2020 };
    int m_month { 10 };
    int m_day { 14 };

public:
    int getYear() const { return m_year; }
    void setYear(int year) { m_year = year; }
    // ...
};
```

### 반환 방식

getter는 값이 저렴하면 **값으로**, 복사 비용이 크면 **const lvalue 참조로** 반환한다 (구체적 위험은 [7절](#7-데이터-멤버-참조를-반환하는-멤버-함수) 참고).

### 접근 함수가 만능은 아니다

모든 멤버마다 getter/setter를 기계적으로 뚫어주는 것은 **캡슐화를 사실상 무력화**시킨다 — private로 감춰봤자 외부에서 값을 자유롭게 읽고 쓸 수 있다면 [struct](../chapter13EnumsAndStructs/main.md)와 다를 게 없어진다. 그래서:

- 접근 함수 대신 **행동(behavior)**으로 인터페이스를 설계하는 편이 낫다. 예: `setAlive(false)` 대신 `kill()`.
- 사용자가 실제로 개별 멤버 값을 필요로 하는 경우에만 접근 함수를 제공한다.
- 불변식 보호나 접근 함수가 굳이 필요 없다면 애초에 `struct`로 충분할 수도 있다 — 이건 다음 절([8절](#8-데이터-은닉캡슐화의-이점))에서 "왜 캡슐화가 가치 있는가"로 이어진다.

---

## 7. 데이터 멤버 참조를 반환하는 멤버 함수

### 왜 참조로 반환하나

멤버 함수가 값을 반환하면 복사가 발생한다. 자주 호출되는 getter라면 이 복사 비용이 누적될 수 있다. 데이터 멤버는 **자신을 담고 있는 객체와 수명이 같으므로**, 그 객체가 호출자 스코프에 살아있는 한 데이터 멤버를 (const) 참조로 반환해도 안전하다.

```cpp
const std::string& getName() const { return m_name; }
```

**모범 사례**: 반환 타입은 실제 멤버 타입과 일치시킨다 — 불필요한 변환을 막기 위해서다. `auto`로 추론할 수도 있지만, 시그니처만 보고 반환 타입을 알 수 없게 돼 문서화 가치가 떨어진다.

### 반직관적 위험 — 암묵적 객체가 rvalue일 때

암묵적 객체가 **[rvalue](../chapter12ReferencesAndPointers/main.md)**(예: 값으로 반환된 임시 객체)라면, 그 객체는 전체 표현식이 끝나는 시점에 파괴된다. 이때 멤버에 대한 참조를 저장해두면 댕글링 참조가 된다.

```cpp
// 안전: 참조를 즉시 사용
std::cout << createEmployee("Frank").getName();

// 미정의 동작: 참조를 나중까지 들고 있음
const std::string& ref { createEmployee("Garbo").getName() };
std::cout << ref; // Garbo 임시 객체는 이미 파괴됨 — ref는 댕글링

// 안전: 참조가 아니라 복사본을 저장
std::string val { createEmployee("Hans").getName() };
std::cout << val;
```

세 경우가 겉보기엔 비슷해 보이지만, **참조를 저장하느냐 값을 복사하느냐**가 안전성을 가른다. 이는 [참조로 반환하기](../chapter12ReferencesAndPointers/main.md)에서 배운 "지역 변수를 참조로 반환하면 댕글링"과 본질적으로 같은 함정이 멤버 함수 반환에도 그대로 적용된 것이다.

### 캡슐화와의 충돌 방지

private 멤버에 대한 **non-const 참조**는 절대 반환하지 않는다 — 반환받은 쪽이 그 참조를 통해 private 멤버를 자유롭게 수정할 수 있게 되어, 캡슐화가 무의미해진다. const 멤버 함수는 애초에 non-const 참조를 반환할 수 없다(자기 자신도 못 바꾸는데 남에게 바꿀 권한을 줄 수 없다).

**모범 사례**: 참조를 반환하는 멤버 함수의 결과는 저장하지 말고 즉시 사용하라.

---

## 8. 데이터 은닉(캡슐화)의 이점

### 정의

**데이터 은닉(data hiding, information hiding)**은 타입의 구현을 사용자로부터 감춰 인터페이스와 구현을 분리하는 기법이다. C++에서 **캡슐화(encapsulation)**란 보통 데이터 멤버는 private, 멤버 함수는 public으로 두어 데이터와 함수를 하나로 묶는 것을 가리킨다.

### 캡슐화가 주는 5가지 이점

**1) 복잡도 감소** — 사용자는 public 인터페이스만 알면 된다. [std::string_view](../chapter05ConstantsAndStrings/main.md)를 쓸 때 내부 구현을 몰라도 되는 것과 같은 원리다.

**2) 불변식 유지** — private로 막아두면 여러 멤버가 얽힌 규칙을 setter 하나로 강제할 수 있다.

```cpp
// 문제: public 멤버라 name만 바꾸면 firstInitial과 어긋남
struct Employee
{
    std::string name{ "John" };
    char firstInitial{ 'J' };
};
Employee e{};
e.name = "Mark"; // firstInitial은 여전히 'J' — 불변식 붕괴

// 해결: setter가 두 멤버를 함께 갱신
class Employee
{
    std::string m_name{};
    char m_firstInitial{};
public:
    void setName(std::string_view name)
    {
        m_name = name;
        m_firstInitial = name.front();
    }
};
```

**3) 오류 감지** — setter는 입력을 검증할 수 있다. 빈 문자열처럼 잘못된 입력이 들어오면 무시하거나, assert하거나, 예외를 던질 수 있다 — public 멤버 직접 대입으로는 이런 검증이 불가능하다.

**4) 구현 변경의 자유** — public 인터페이스가 안정적이면 내부 구현은 언제든 바꿀 수 있다.

```cpp
// 원래 구현
class Something
{
    int m_value1{};
public:
    void setValue1(int value) { m_value1 = value; }
    int getValue1() const { return m_value1; }
};

// 내부를 배열로 바꿔도 인터페이스는 그대로 — 사용자 코드는 무영향
class Something
{
    int m_value[3];
public:
    void setValue1(int value) { m_value[0] = value; }
    int getValue1() const { return m_value[0]; }
};
```

**5) 디버깅 용이성** — 값이 어디서 잘못 바뀌는지 추적할 때, 대입문이 코드 여기저기 흩어져 있으면 일일이 찾아야 하지만, setter 함수 하나에만 중단점을 걸면 모든 변경 지점을 잡아낼 수 있다.

### 비멤버 함수를 우선하라

private 멤버 접근이 필요 없는 기능은 **비멤버 함수**로 만드는 편이 낫다.

```cpp
class Yogurt
{
    std::string m_flavor{ "vanilla" };
public:
    void setFlavor(std::string_view flavor) { m_flavor = flavor; }
    const std::string& getFlavor() const { return m_flavor; }
};

void print(const Yogurt& y) // 멤버로 안 만들고 비멤버로
{
    std::cout << "The yogurt has flavor " << y.getFlavor() << '\n';
}
```

이렇게 하면 클래스 인터페이스가 작아지고, 캡슐화가 더 엄격히 지켜지며, 응용 로직(print 방식 등)과 재사용 가능한 핵심 로직이 분리된다.

**멤버 vs 비멤버 판단 기준**:
- 생성자·소멸자·가상 함수처럼 반드시 멤버여야 하는 경우 → 멤버
- private 데이터 접근이 필요한 경우 → 멤버
- 그 외 → 비멤버 선호

**선언 순서 권장**: public 멤버를 먼저, 그다음 protected, 마지막에 private. 인터페이스(무엇을 할 수 있는가)를 먼저 보여주고 구현 세부사항은 뒤로 미루는 것이 읽는 사람 입장에서 자연스럽다.

> ROS2 맥락: 로봇 상태를 표현하는 클래스(`RobotState` 등)에서 관절 각도·속도 같은 멤버를 private로 감추고 `setJointPosition()` 같은 setter로만 접근하게 하면, 관절 한계값 초과 같은 위험한 값이 들어오는 것을 그 한 지점에서 검증할 수 있다. public 멤버로 노출했다면 코드베이스 어디서든 값이 바뀔 수 있어 원인 추적이 훨씬 어려워진다.

---

## 9. 생성자 입문

### 생성자란

**생성자(constructor)**는 non-aggregate 클래스 객체가 생성된 직후 자동으로 호출되는 특수 멤버 함수다. 컴파일러가 먼저 메모리를 확보한 뒤 생성자를 호출해 그 메모리를 초기화한다.

<mark style="background: #ADCCFFA6;">생성자가 객체를 "만드는" 것이 아니라 이미 확보된 메모리를 "초기화"한다</mark>는 점이 이름과 달리 반직관적이다 — 다만 일치하는 생성자가 없으면 애초에 객체 생성 자체가 불가능하므로, 실질적으로는 "생성자 없이는 객체를 만들 수 없다."

### 왜 필요한가

private 멤버가 있는 클래스는 [집합체 초기화](../chapter13EnumsAndStructs/main.md)를 쓸 수 없다(집합체 조건 위반, [5절](#5-public·private-멤버와-접근-지정자) 참고). 생성자는 이 문제를 해결하면서 동시에:

- private 멤버의 초기화를 통제하고
- 클래스 불변식을 강제하고
- 생성 시점에 필요한 추가 설정을 수행할 수 있다

### 생성자 이름 규칙

- 클래스 이름과 대소문자까지 정확히 일치
- 반환 타입 없음 (`void`조차 안 씀)
- 보통 인터페이스의 일부로 public

### 실행 흐름

`Foo foo{ 6, 7 };`를 실행하면:
1. 컴파일러가 인수와 맞는, 접근 가능한 생성자를 탐색
2. 객체를 위한 메모리 확보
3. 찾은 생성자를 인수와 함께 실행
4. 객체가 "일관되고 사용 가능한 상태"에 진입

```cpp
class Foo
{
private:
    int m_x {};
    int m_y {};
public:
	//생성자
    Foo(int x, int y)
    {
        std::cout << "Foo(" << x << ", " << y << ") constructed\n";
    }
    void print() const { std::cout << "Foo(" << m_x << ", " << m_y << ")\n"; }
};

Foo foo{ 6, 7 };
foo.print();
```

출력:
```
Foo(6, 7) constructed
Foo(0, 0)
```

**함정**: `x`, `y`를 매개변수로 받았을 뿐 `m_x`, `m_y`에 실제로 대입하는 코드가 없다 — 매개변수와 멤버 변수는 별개다. 그래서 멤버는 기본 멤버 초기화자 값(`{}` → 0)에 머문다. 매개변수 값을 멤버로 옮기려면 [10절](#10-생성자-멤버-초기화-리스트)의 멤버 초기화 리스트가 필요하다.

### 암묵적 타입 변환도 그대로 적용

생성자의 매개변수는 일반 함수와 같은 규칙으로 암묵적 변환을 받아들인다.

```cpp
class Foo { public: Foo(int x, int y) {} };
Foo foo{ 'a', true }; // 'a'→int, true→int 로 암묵 변환되어 Foo(int, int) 매칭
```

### 생성자는 항상 non-const다

객체를 초기화하려면 멤버를 수정해야 하므로 생성자는 non-const여야 한다. 다만 이는 `const` 객체를 생성할 수 없다는 뜻이 아니다 — C++은 "생성이 끝나기 전까지는 아직 const가 적용되지 않는다"고 보고, const 객체라도 non-const 생성자로 초기화하는 것을 허용한다.

```cpp
class Something
{
    int m_x{};
public:
    Something() { m_x = 5; } // non-const 생성자
    int getX() const { return m_x; }
};

const Something s{}; // OK — 생성 시점엔 아직 const 제약 적용 전
std::cout << s.getX(); // 5
```

### 생성자 vs setter

생성자는 객체 전체를 **생성 시점에** 초기화하고, setter는 이미 존재하는 객체의 **멤버 하나**를 나중에 바꾼다. 역할이 다르므로 혼동하지 않는다.

---

## 10. 생성자 멤버 초기화 리스트

### 문법

생성자 매개변수 목록 뒤에 콜론을 붙이고, 본문 실행 전에 멤버를 초기화한다.

```cpp
Foo(int x, int y)
    : m_x { x }
    , m_y { y }
{
}
```

**중요한 문법 제약**: 반드시 직접 초기화 형태(중괄호 권장, 괄호도 허용)를 써야 한다. `=`를 쓰는 복사 초기화는 여기서 동작하지 않는다.

### 왜 필요한가 — 초기화 vs 대입

[9절](#9-생성자-입문)에서 본 것처럼 생성자 본문 안의 `m_x = x;`는 **초기화가 아니라 대입**이다. 이 구분이 사소해 보이지만, `const` 멤버나 참조 멤버는 애초에 대입 자체가 불가능하므로 반드시 초기화 리스트를 써야만 값을 넣을 수 있다. 멤버 초기화 리스트가 다 실행되고 나면 그 시점에 비로소 "객체가 초기화됐다"고 간주된다.

### 반직관적 함정 — 초기화 순서는 리스트 순서가 아니라 선언 순서

멤버는 **클래스 안에서 선언된 순서**대로 초기화된다. 초기화 리스트에 적은 순서와는 무관하다.

```cpp
class Foo
{
private:
    int m_x{};
    int m_y{};
public:
    Foo(int x, int y)
        : m_y { std::max(x, y) }, m_x { m_y } // 문제: m_x가 m_y보다 먼저 선언됐으므로 m_x가 먼저 초기화됨
    {
    }
};
```

리스트에는 `m_y`가 먼저 적혀 있지만, 실제 실행 순서는 선언 순서인 `m_x` → `m_y`다. 즉 `m_x`는 **아직 초기화되지 않은** `m_y` 값을 읽어버려 미정의 동작이 된다. 이는 [3절](#3-멤버-함수)에서 본 "기본 멤버 초기화자가 선언 순서를 따른다"는 규칙과 정확히 같은 원리가 생성자에도 적용된 것이다.

**모범 사례**: 멤버 초기화 리스트는 클래스에 선언된 순서와 동일한 순서로 적는다 — 그래야 실제 실행 순서와 코드 순서가 일치해 헷갈릴 여지가 없다. 가능하면 한 멤버를 다른 멤버의 값으로 초기화하는 것 자체를 피한다.

### 초기화 우선순위

1. 멤버 초기화 리스트에 지정한 값 (최우선)
2. 기본 멤버 초기화자
3. 기본 초기화 (기본 타입은 값 없음)

### 정리

- 멤버 초기화 리스트를 생성자 본문의 대입보다 우선 사용한다
- 리스트는 선언 순서대로 적는다
- 검증 로직(assert, 예외)은 생성자 본문에 둔다 — 초기화 자체는 리스트가, 부가 검증은 본문이 담당하는 역할 분담이다

---

## 11. 기본 생성자와 기본 인수

### 기본 생성자

인수를 받지 않는 생성자를 **기본 생성자(default constructor)**라 한다. 사용자가 생성자를 하나도 선언하지 않으면 컴파일러가 자동으로 public 기본 생성자를 만들어준다 — 본문이 비어 있는 것과 동등하다.

### 값 초기화를 기본 초기화보다 선호하라

클래스 타입에 기본 생성자가 있으면 `Foo f;`(기본 초기화)와 `Foo f{};`(값 초기화) 둘 다 같은 기본 생성자를 호출한다. 그런데도 **모범 사례는 항상 값 초기화 `{}`를 쓰는 것**이다 — 어떤 타입이 [집합체](../chapter13EnumsAndStructs/main.md)인지 아닌지 코드만 보고 구분하기 어려운 경우가 많은데, 집합체는 `{}`가 있어야 멤버가 값 초기화(0 등)되고 빈 괄호 없는 기본 초기화는 멤버를 미초기화 상태로 남기기 때문이다. `{}`를 습관화하면 이 구분을 신경 쓸 필요가 없어진다.

### 기본 인수가 있는 생성자

```cpp
class Foo
{
private:
    int m_x { }, m_y { };
public:
    Foo(int x = 0, int y = 0)
        : m_x { x }, m_y { y } { }
};

Foo foo1{};       // 기본값 사용
Foo foo2{6, 7};   // 명시적 값
```

모든 매개변수가 기본값을 가지면, 인수 없이도 호출 가능하므로 이 생성자 자체가 기본 생성자로 취급된다.

### 반직관적 함정 — 기본 생성자는 클래스당 딱 하나

"기본 인수 있는 생성자"와 "인수 없는 생성자"를 동시에 두면, 인수 없이 호출할 방법이 두 가지가 되어 **모호성 에러**가 난다.

```cpp
class Foo
{
public:
    Foo() { }               // 기본 생성자 #1
    Foo(int x=1, int y=2) { } // 사실상 기본 생성자 #2
};

Foo foo{}; // 컴파일 에러: 어느 쪽을 호출해야 할지 모호
```

겉보기엔 "생성자 두 개"지만, 컴파일러 관점에서는 "인수 없이 호출 가능한 생성자가 두 개"라는 뜻이라 바로 충돌한다.

### 명시적으로 defaulted 기본 생성자

```cpp
class Foo
{
public:
    Foo() = default; // 컴파일러가 만드는 기본 생성자를 명시적으로 요청
    Foo(int x, int y) { }
};
```

**모범 사례**: 본문이 빈 사용자 정의 기본 생성자보다 `= default`를 선호한다. 이유는 미묘하다 — 값 초기화 시 `= default`로 생성된 기본 생성자는 초기화 전에 **제로 초기화**를 거치지만, 사용자가 직접 쓴 빈 본문 생성자는 이 단계를 거치지 않는다. 결과적으로 `= default` 쪽이 멤버가 우연히 초기화 안 된 채 남는 경우를 줄여준다.

### 기본 생성자를 항상 제공해야 하는가

아니다. **의미상 타당할 때만** 제공한다. `Fraction`이 0/1로 기본값을 갖는 건 자연스럽지만, `Employee`가 이름·ID 없이 기본 생성되는 건 그 자체로 불완전한 상태를 허용하는 셈이라 부적절할 수 있다.

**모범 사례 요약**:
1. 클래스 타입은 항상 `{}`로 값 초기화한다
2. 빈 본문보다 `= default`
3. 모든 데이터 멤버에 기본 멤버 초기화자를 둬서 미정의 동작을 방지한다

---

## 12. 위임 생성자

### 문제 — 생성자 본문에서 다른 생성자를 부르면 안 된다

직관적으로 생성자 본문 안에서 다른 생성자를 호출하면 "그 생성자로 지금 객체를 다시 초기화"할 것 같지만, 실제로는 **완전히 별개의 임시 객체**를 만들고 버릴 뿐이다.

멤버 초기화는 생성자 본문이 실행되기 **전에** 이미 끝난다. 본문 안에서 또 다른 생성자를 "호출하는 것처럼 보이는" 코드는 사실 함수 호출 문법으로 새 임시 객체를 직접 초기화하는 것과 같다 — 현재 객체의 멤버는 전혀 건드리지 못한다.

### 해결책 — 위임 생성자

멤버 초기화 리스트 위치에서 **같은 클래스의 다른 생성자**를 호출하면, 그 생성자가 대신 초기화를 수행하도록 위임할 수 있다.

```cpp
class Employee
{
public:
    Employee(std::string_view name)
        : Employee{ name, 0 } // 다른 생성자로 위임 (본문이 아니라 초기화 리스트 위치)
    {
    }

    Employee(std::string_view name, int id)
        : m_name{ name }, m_id{ id }
    {
        std::cout << "Employee " << m_name << " created\n";
    }
};
```

### 제약 사항

1. **위임과 멤버 초기화 리스트는 함께 쓸 수 없다** — 한 생성자는 다른 생성자에 위임하거나, 자기 멤버를 직접 초기화하거나 둘 중 하나만 해야 한다.
2. **순환 위임 금지** — A가 B에, B가 다시 A에 위임하면 무한 루프가 된다.
3. 위임할 때 넘기는 인수는 **하드코딩된 값**이어야 한다 — 위임받는 생성자 쪽의 기본 멤버 초기화자를 그대로 참조할 수 없다.

### 대안과 병행 전략

- 오버로드 수를 줄이고 싶다면 [기본 인수](#11-기본-생성자와-기본-인수)도 대안이 될 수 있다.
- 여러 곳에서 같은 기본값을 반복해서 하드코딩해야 한다면, `static constexpr` 멤버로 값을 한 곳에 모아두고 참조하는 편이 유지보수에 유리하다.

---

## 13. 임시 클래스 객체

### 생성 문법 3가지

```cpp
print(IntPair { 5, 6 });  // 1) 명시적 타입 + 리스트 초기화 (선호)
print({ 7, 8 });          // 2) 문맥으로부터 타입 암묵 추론
Foo(1, 2);                // 3) 직접 초기화 스타일 — narrowing 변환까지 허용되어 덜 안전
```

### 이름 있는 객체 vs 임시 객체

```cpp
IntPair p { 1, 2 };  // 이름 있는 객체
IntPair { 1, 2 };    // 임시(익명) 객체
{ 1, 2 };            // 문맥에 따라 임시 객체로 암묵 변환
```

### 수명 규칙

임시 객체는 **자신이 속한 전체 표현식(full expression)이 끝나는 시점**에 파괴된다. [7절](#7-데이터-멤버-참조를-반환하는-멤버-함수)에서 다룬 "rvalue 객체의 멤버 참조가 댕글링되는" 문제의 근본 원인이 바로 이 수명 규칙이다.

임시 객체는 [rvalue](../chapter12ReferencesAndPointers/main.md)이므로 lvalue 참조가 필요한 자리에는 쓸 수 없다.

```cpp
void addOne(int& value) { ++value; }
addOne(5 + 3); // 컴파일 에러: 5 + 3의 결과는 rvalue
```

### 값으로 반환하면 자동으로 임시가 된다

```cpp
IntPair ret2()
{
    return IntPair { 5, 6 }; // 반환된 객체는 호출자 쪽에서 임시로 취급
}
```

### 타입 변환에서의 선택

- 기본 타입 변환: `static_cast<int>(c)`처럼 `static_cast` 사용
- 클래스 타입 변환: `std::string { sv }`처럼 리스트 초기화된 임시 객체 생성을 캐스팅 문법보다 선호 — 생성자 선택이 명확하고, 이후 나올 [explicit](#16-변환-생성자와-explicit-키워드) 규칙과도 자연스럽게 맞물린다.

---

## 14. 복사 생성자 입문

### 정의

**복사 생성자(copy constructor)**는 같은 타입의 기존 객체로부터 새 객체를 초기화하는 생성자다.

### 암묵적 복사 생성자

직접 정의하지 않으면 컴파일러가 자동으로 public 복사 생성자를 만들어준다. 이 암묵적 버전은 **멤버별 초기화(memberwise initialization)**를 수행한다 — 각 멤버를 원본 객체의 대응 멤버 값으로 그대로 초기화한다.

```cpp
Fraction fCopy { f }; // 암묵적 복사 생성자 호출
```

### 직접 정의하기

```cpp
class Fraction
{
private:
    int m_numerator{ 0 };
    int m_denominator{ 1 };
public:
    Fraction(const Fraction& fraction)
        : m_numerator{ fraction.m_numerator }
        , m_denominator{ fraction.m_denominator }
    {
        std::cout << "Copy constructor called\n";
    }
};
```

### 복사 생성자가 호출되는 세 가지 상황

```cpp
Fraction fCopy { f };              // 1) 직접 초기화

void printFraction(Fraction f) {}  // 2) 값으로 전달 → 매개변수가 복사 생성자로 초기화
printFraction(f);

Fraction generateFraction(int n, int d) // 3) 값으로 반환 → 반환되는 임시 객체가 복사 생성자로 생성
{
    Fraction f{ n, d };
    return f;
}
```

### 반직관적 제약 — 매개변수가 반드시 참조여야 하는 이유

복사 생성자의 매개변수를 값으로 받으면 어떻게 될까: 그 매개변수 자체를 초기화하려면 인수를 복사해야 하는데, 그 복사는 다시 복사 생성자를 호출해야 하고, 그 호출은 또 매개변수를 복사해야 한다 — **무한 재귀**다.

```cpp
Fraction(const Fraction& fraction) // 올바름 — 참조라 복사가 필요 없음
Fraction(Fraction fraction)        // 잘못됨 — 무한 재귀
```

그래서 복사 생성자의 매개변수는 반드시 (const) lvalue 참조여야 한다. **모범 사례**: `const` lvalue 참조를 쓴다 — 원본을 실수로 수정하지 않도록 보장하고, rvalue 인수도 받을 수 있다.

### = default, = delete

```cpp
Fraction(const Fraction& fraction) = default; // 컴파일러 기본 버전을 명시적으로 요청
Fraction(const Fraction& fraction) = delete;  // 복사 자체를 금지
```

`= delete`를 쓰면 `Fraction fCopy { f };`가 컴파일 에러가 된다 — 복사가 의미 없거나 위험한 타입(예: 동적 자원을 유일하게 소유하는 타입)에서 실수로 복사되는 것을 원천 차단한다.

### 모범 사례

- 복사 생성자는 "복사" 이외의 부수 효과가 없어야 한다 — [15절](#15-클래스-초기화와-복사-생략)에서 보듯 컴파일러가 복사 생성자 호출 자체를 최적화로 생략할 수 있기 때문이다.
- 특별한 이유가 없다면 암묵적 복사 생성자를 그대로 쓴다.
- 동적 메모리를 다루는 클래스(얕은 복사 vs 깊은 복사 문제)에서는 직접 정의가 필수가 된다 — 추후 챕터에서 다룸.
- **Rule of Three/Five**: 복사 생성자·소멸자·복사 대입 연산자 중 하나라도 직접 정의해야 한다면, 나머지도 대개 함께 정의해야 한다(C++11부터는 이동 생성자·이동 대입 연산자까지 포함해 Rule of Five).

---

## 15. 클래스 초기화와 복사 생략

### 초기화 문법 6가지

클래스 타입에도 기본 타입과 동일한 초기화 문법들이 적용된다.

```cpp
Foo f1;           // 기본 초기화
Foo f2{};         // 값 초기화 (선호)
Foo f3 = 3;       // 복사 초기화
Foo f4(4);        // 직접 초기화
Foo f5{ 5 };      // 직접 리스트 초기화 (선호)
Foo f6 = { 6 };   // 복사 리스트 초기화
```

세 가지 실질적 차이:

| 차이점 | 내용 |
|---|---|
| narrowing 변환 | 리스트 초기화 계열은 명시적으로 금지 |
| 생성자 접근성 | 복사 초기화 계열은 `explicit` 생성자를 후보에서 제외 (16절 참고) |
| 생성자 우선순위 | 리스트 초기화는 (있다면) 리스트 생성자를 다른 생성자보다 우선 |

### 복사 생략 — 컴파일러가 복사를 통째로 없앨 수 있다

**복사 생략(copy elision)**은 불필요한 객체 복사를 컴파일러가 제거하는 최적화다. 생략되면 원래 실행됐어야 할 복사/이동 생성자 호출이 **완전히 건너뛰어진다** — 그 생성자에 `std::cout` 출력 같은 부수 효과가 있어도 실행되지 않는다.

### 반직관적인 이유 — as-if 규칙의 예외

일반적인 컴파일러 최적화는 "프로그램이 관찰 가능한 동작을 바꾸지 않는 한도 내에서"만 허용된다(as-if 규칙). 그런데 복사 생략은 이 규칙에서 **예외**로 취급된다 — 복사 생성자가 부수 효과(출력 등)를 갖고 있어도, 컴파일러는 그 호출 자체를 없애 관찰 가능한 동작을 바꿔도 된다. 그래서 "복사 생성자가 몇 번 호출됐는지" 콘솔 출력으로 세는 방식의 실험은 컴파일러·최적화 수준에 따라 결과가 달라질 수 있다.

### 필수 생략 vs 선택적 생략

| 구분 | 시점 | 조건 |
|---|---|---|
| 선택적 생략 | C++17 이전 전반 | 컴파일러 재량, 단 접근 가능한 복사 생성자가 (호출되지 않더라도) 존재해야 함 |
| 필수 생략 | C++17부터 특정 상황(임시 객체를 변수로 바로 초기화하는 경우 등) | 반드시 생략됨, 복사 생성자가 `= delete`라도 문제없음 |

### 모범 사례

- 복사 생성자에 부수 효과를 넣지 않는다 — 생략으로 인해 실행이 보장되지 않는다.
- 리스트 초기화 문법(`Foo f{ 5 };`)을 기본으로 쓴다 — narrowing 방지와 명확성 때문.
- 생성자 호출 횟수를 세어 프로그램 로직을 만들지 않는다 — 복사 생략 때문에 예측이 어긋난다.

---

## 16. 변환 생성자와 explicit 키워드

### 변환 생성자란

인수 하나를 받는 생성자는 기본적으로 **암묵적 타입 변환** 통로가 된다 — 이런 생성자를 **변환 생성자(converting constructor)**라 부른다.

```cpp
class Foo
{
public:
    Foo(int x) : m_x{ x } {}
};

void printFoo(Foo f) { std::cout << f.getX(); }
printFoo(5); // int 5가 암묵적으로 Foo로 변환됨
```

함수가 `Foo`를 기대하는데 `int`가 들어오면, 컴파일러는 `int` → `Foo` 변환을 제공하는 생성자를 찾아 임시 `Foo` 객체를 만들어 넘긴다.

### 반직관적 위험 — 의도치 않은 변환

```cpp
class Dollars
{
public:
    Dollars(int d) : m_dollars{ d } {}
};

void print(Dollars d) { std::cout << "$" << d.getDollars(); }
print(5); // 컴파일되고 "$5" 출력 — 그런데 호출자가 진짜 이걸 의도했나?
```

이 코드는 아무 경고 없이 컴파일되지만, `5`라는 순수한 정수가 아무 신호도 없이 `Dollars`로 둔갑한다. 타입이 우연히 맞아떨어지는 다른 곳(예: `Cents`)에서도 같은 방식으로 암묵 변환이 일어나면, 단위가 다른 값이 섞여도 컴파일러가 잡아주지 못한다.

### 해결책 — explicit 키워드

`explicit`을 붙이면 그 생성자를 통한 **암묵적** 변환이 차단되고, 직접 초기화 형태만 허용된다.

```cpp
class Dollars
{
public:
    explicit Dollars(int d) : m_dollars{ d } {}
};

void print(Dollars d) { std::cout << "$" << d.getDollars(); }

print(5);                          // 에러: 암묵적 변환 차단
print(Dollars{5});                 // OK: 명시적 생성
print(static_cast<Dollars>(5));    // OK: static_cast는 explicit 생성자도 사용 가능
```

| `explicit`이 막는 것 | `explicit`이 허용하는 것 |
|---|---|
| 복사 초기화 `Dollars d = 5;` | 직접 초기화 `Dollars d(5);` |
| 복사 리스트 초기화 `Dollars d = {5};` | 직접 리스트 초기화 `Dollars d{5};` |
| 함수 호출 시 암묵 변환 | 인자 자리에서 명시적으로 생성 `print(Dollars{5})` |

이 표는 [15절](#15-클래스-초기화와-복사-생략)에서 본 "복사 초기화는 explicit 생성자를 후보에서 제외한다"는 규칙이 실제로 어떻게 동작하는지 보여준다.

### 사용자 정의 변환은 한 번만 연쇄된다

컴파일러는 타입 불일치를 해소하기 위해 **사용자 정의 변환을 최대 한 번**만 적용한다. 두 단계 이상 필요하면 에러다.

```cpp
class Employee
{
public:
    Employee(std::string_view name) {}
};
void printEmployee(Employee e) {}

printEmployee("Joe");     // 에러: const char* → string_view → Employee, 두 단계 필요
using namespace std::literals;
printEmployee("Joe"sv);   // OK: string_view → Employee, 한 단계만
```

### 언제 explicit을 붙일까

| 생성자 종류 | explicit 권장 |
|---|---|
| 인수 1개짜리 생성자 | 원칙적으로 붙인다 |
| 복사·이동 생성자 | 붙이지 않는다 (변환이 아니라 복사이므로) |
| 인수 없는 기본 생성자 | 보통 안 붙임 |
| 인수 2개 이상 생성자 | 보통 안 붙임 (암묵 변환 자체가 성립 안 함) |

**예외**: 변환 결과가 인수 값과 "의미상 동등"하고 변환 비용이 저렴하면 굳이 explicit을 붙이지 않기도 한다. `std::string_view`가 C 스타일 문자열을 암묵적으로 받아들이는 것이 그 예다 — `"hello"`와 `std::string_view{"hello"}`는 의미상 같은 값을 가리키므로 변환을 막을 이유가 적다.

**핵심**: `explicit`은 "이 변환이 안전하다"는 확신이 없는 한 기본값으로 붙이는 안전장치에 가깝다. 필요하면 호출부에서 리스트 초기화(`Dollars{5}`)로 명시적으로 풀어주면 그만이므로, 안전 쪽을 기본값으로 삼는 데 큰 비용이 들지 않는다.

---

## 17. constexpr 집합체와 클래스

### constexpr 멤버 함수

멤버 함수도 일반 함수처럼 `constexpr`로 선언해 컴파일 타임/런타임 양쪽에서 평가되게 할 수 있다.

```cpp
struct Pair
{
    int m_x {};
    int m_y {};
    constexpr int greater() const
    {
        return (m_x > m_y ? m_x : m_y);
    }
};
```

### 리터럴 타입 조건

클래스 객체를 `constexpr`로 만들려면 그 클래스가 **리터럴 타입(literal type)** — 상수 표현식 안에서 객체를 만들어낼 수 있는 타입 — 이어야 한다.

- [집합체](../chapter13EnumsAndStructs/main.md)는 별도 조치 없이도 암묵적으로 리터럴 타입이다.
- non-aggregate 클래스는 **constexpr 생성자**가 있어야 리터럴 타입이 된다.

```cpp
// 집합체: 그냥 동작
struct Pair
{
    int m_x {}; int m_y {};
    constexpr int greater() const { return (m_x > m_y ? m_x : m_y); }
};
constexpr Pair p { 5, 6 };
constexpr int g { p.greater() };

// non-aggregate: constexpr 생성자 필수
class Pair
{
private:
    int m_x {}; int m_y {};
public:
    constexpr Pair(int x, int y): m_x { x }, m_y { y } {}
    constexpr int greater() const { return (m_x > m_y ? m_x : m_y); }
};
```

constexpr 생성자가 없으면 컴파일러는 "not a literal type" 에러를 낸다.

### 반직관적 전파 규칙 — compile-time 평가에는 constexpr 함수만 호출 가능

`constexpr` 함수가 실제로 컴파일 타임에 평가되는 문맥에서는, 그 안에서 호출하는 모든 함수(생성자 포함)도 `constexpr`이어야 한다.

```cpp
constexpr int init()
{
    Pair p { 5, 6 };     // 생성자가 constexpr이어야 함
    return p.greater();   // greater()도 constexpr이어야 함
}
constexpr int g { init() }; // 컴파일 타임 평가를 강제
```

### C++14에서 바뀐 점 — const 암묵 적용 폐지

C++11에서는 non-static constexpr 멤버 함수가 암묵적으로 `const`였다. C++14부터 이 암묵 규칙이 사라졌으므로, const가 필요하면 **명시적으로** 붙여야 한다.

```cpp
constexpr int greater() const { ... } // C++14+: const를 직접 써야 함
```

### non-const constexpr 멤버 함수는 멤버를 바꿀 수 있다

`const`와 `constexpr`은 서로 독립된 속성이다 — `constexpr` 변수가 반드시 `const` 값으로 초기화돼야 한다는 규칙은 없다.

```cpp
class Pair
{
private:
    int m_x {}; int m_y {};
public:
    constexpr Pair(int x, int y): m_x { x }, m_y { y } {}
    constexpr void reset() { m_x = m_y = 0; } // non-const: 멤버 수정 가능
};

constexpr Pair zero()
{
    Pair p { 1, 2 };
    p.reset();      // OK: non-const 객체에 non-const 함수 호출
    return p;
}
```

### constexpr과 참조/포인터 반환

```cpp
constexpr const int& getX() const { return m_x; }
constexpr const int* const getXPtr() const { return &m_x; }
```

여러 `const`가 겹쳐 보이지만 각자 역할이 다르다 — 앞의 `const`는 반환 타입(참조/포인터가 가리키는 대상)을 잠그고, 뒤의 `const`는 멤버 함수 자체(포인터 변수 자체 등)를 잠근다.

### 왜 신경 써야 하는가

`constexpr`은 함수 인터페이스의 일부다. 나중에 이 키워드를 빼면, 그 함수를 상수 표현식 문맥에서 호출하던 기존 코드가 모두 깨진다. 컴파일 타임 계산이 필요할 가능성이 있는 클래스(좌표, 변환 행렬 등 로보틱스 수학 유틸리티)라면 처음부터 생성자와 관련 멤버 함수를 `constexpr`로 설계해두는 편이 유리하다.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|------|----------|
| OOP vs 절차적 | 속성+행동을 하나의 타입으로 묶어 확장 시 기존 코드 수정 최소화 |
| 클래스 불변식 | 객체가 항상 만족해야 하는 조건, struct의 public 멤버로는 보호 불가 |
| class vs struct | 기본 접근 수준만 다름(class=private, struct=public), 관례상 쓰임은 다름 |
| 멤버 함수 | 암묵적 객체 매개변수를 통해 접두어 없이 멤버 접근, 초기화는 선언 순서 |
| const 멤버 함수 | 시그니처의 약속, const 객체도 호출 가능하게 함, 컴파일러가 강제 |
| public/private | 클래스 단위 접근 제어(객체 단위 아님), private는 집합체 자격 박탈 |
| 접근 함수 | getter는 const, setter는 non-const, 남발하면 캡슐화 무의미 |
| 참조 반환 멤버 함수 | 데이터 멤버는 안전, 단 rvalue 암묵 객체의 멤버 참조는 댕글링 위험 |
| 캡슐화 이점 | 복잡도 감소, 불변식 유지, 오류 검증, 구현 교체 자유, 디버깅 용이 |
| 생성자 | 이미 확보된 메모리를 초기화, non-const, 이름=클래스명, 반환타입 없음 |
| 멤버 초기화 리스트 | 초기화 vs 대입 구분, 실행 순서는 선언 순서(리스트 작성 순서 아님) |
| 기본 생성자 | 클래스당 하나만 존재 가능, `= default` 선호, `{}` 값 초기화 선호 |
| 위임 생성자 | 초기화 리스트에서만 가능(본문 호출은 임시객체 생성), 위임과 멤버초기화 동시 불가 |
| 임시 객체 | 전체 표현식 끝에 파괴, rvalue라 lvalue 참조에 못 묶임 |
| 복사 생성자 | 매개변수는 반드시 const 참조(값이면 무한 재귀), 부수 효과 없어야 함 |
| 복사 생략 | as-if 규칙의 예외, 부수 효과 있는 복사 생성자도 호출이 생략될 수 있음 |
| explicit | 인수 1개 생성자의 암묵 변환 차단, 직접/리스트 초기화는 여전히 허용 |
| constexpr 클래스 | 집합체는 자동 지원, non-aggregate는 constexpr 생성자 필요 |

### 자주 하는 실수 TOP 5

1. **생성자 매개변수를 멤버 초기화 리스트 없이 본문에서만 대입** — const/참조 멤버는 애초에 불가능하고, 대입은 초기화가 아니라는 개념 자체를 놓치게 됨
2. **멤버 초기화 리스트를 선언 순서와 다르게 작성** — 실제 실행은 항상 선언 순서라서 다른 멤버 값을 참조하면 미정의 동작
3. **생성자 본문 안에서 다른 생성자를 호출해 "위임"했다고 착각** — 실제로는 임시 객체만 만들고 버려짐, 위임은 반드시 초기화 리스트 위치에서
4. **복사 생성자 매개변수를 값으로 선언** — 무한 재귀로 이어짐, 반드시 (const) 참조
5. **인수 1개 생성자에 `explicit`을 깜빡함** — 의도치 않은 암묵적 타입 변환이 조용히 컴파일되어 버그로 이어짐
