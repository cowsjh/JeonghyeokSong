---
title: Chapter 15 — More on Classes (클래스 심화)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 15 — More on Classes (클래스 심화)

> 출처: [learncpp.com Chapter 15](https://www.learncpp.com/cpp-tutorial/chapter-15-summary-and-quiz/)
> 대상 독자: 기계공학 배경 C++ 입문자, ROS2 로보틱스 학습 목적. [Ch.14 클래스 입문](../chapter14IntroductionToClasses/main.md)에서 멤버 변수·함수·생성자까지 배웠고, 이 챕터는 클래스를 "실전에서 쓸 수 있는 크기"로 키우는 도구들 — `this`, 헤더 분리, 중첩 타입, 소멸자, static 멤버, friend — 를 다룬다.

---

## 목차

1. [this 포인터와 메서드 체이닝](#1-this-포인터와-메서드-체이닝)
2. [클래스와 헤더 파일 분리](#2-클래스와-헤더-파일-분리)
3. [중첩 타입 (member type)](#3-중첩-타입-member-type)
4. [소멸자 (destructor)](#4-소멸자-destructor)
5. [클래스 템플릿의 멤버 함수](#5-클래스-템플릿의-멤버-함수)
6. [static 멤버 변수](#6-static-멤버-변수)
7. [static 멤버 함수](#7-static-멤버-함수)
8. [friend 비멤버 함수](#8-friend-비멤버-함수)
9. [friend 클래스와 friend 멤버 함수](#9-friend-클래스와-friend-멤버-함수)
10. [Ref qualifier](#10-ref-qualifier)

---

## 1. this 포인터와 메서드 체이닝

### this는 왜 존재하는가

멤버 함수는 `m_value += 1;`처럼 멤버 변수를 마치 지역 변수인 것처럼 쓴다. 하지만 함수 코드는 클래스당 딱 한 벌만 존재하는데, 객체는 여러 개 만들 수 있다 — 그렇다면 `add()`를 호출했을 때 컴파일러는 *어느 객체의* `m_value`를 고쳐야 하는지 어떻게 알까?

답은 컴파일러가 멤버 함수 호출을 숨은 인자를 하나 추가한 일반 함수 호출로 바꿔치기하기 때문이다.

```cpp
simple.setID(2);
// 컴파일러 내부적으로는 ↓ 이렇게 변환
Simple::setID(&simple, 2);
```

그리고 함수 정의 쪽도 이 숨은 매개변수를 받도록 바뀐다. 이 숨은 매개변수의 이름이 바로 `this`다.

```cpp
void setID(int id) { m_id = id; }
// 컴파일러 내부적으로는 ↓
static void setID(Simple* const this, int id) { this->m_id = id; }
```

`this`는 **현재 객체의 주소를 가리키는 const 포인터**다 — 재대입은 불가능하고(`this = &other;`는 컴파일 에러), null 체크도 필요 없다(멤버 함수가 호출됐다는 것 자체가 유효한 객체가 있다는 뜻이므로).

> [!NOTE]
> **const 멤버 함수의 this**
> `const` 멤버 함수 안에서는 `this`가 "const를 가리키는 const 포인터"가 된다 — 그래서 const 함수 안에서 멤버를 수정하려 하면 컴파일 에러가 나는 것이다.

### 명시적으로 this를 써야 하는 경우

가장 흔한 경우는 매개변수 이름이 멤버 변수와 겹칠 때다.

```cpp
struct Something
{
    int data{};
    void setData(int data) { this->data = data; }  // this-> 없으면 매개변수를 매개변수에 대입하는 셈
};
```

### 메서드 체이닝 — *this를 참조로 반환하기

`*this`(포인터가 아니라 역참조된 객체 자체)를 참조로 반환하면, 반환값에 대고 다시 멤버 함수를 호출할 수 있다.

```cpp
class Calc
{
private:
    int m_value{};
public:
    Calc& add(int value) { m_value += value; return *this; }
    Calc& sub(int value) { m_value -= value; return *this; }
    Calc& mult(int value) { m_value *= value; return *this; }
};

Calc calc{};
calc.add(5).sub(3).mult(4);  // (5-3)*4 = 8, 한 줄에 연쇄 호출
```

동작 원리는 단순하다 — `add()`가 현재 객체 자신의 참조를 돌려주므로, 그 반환값에 `.sub()`를 호출하는 것은 결국 같은 객체에 대고 다시 호출하는 것과 같다. Jacobian·PID 게인처럼 여러 파라미터를 순차 설정하는 빌더 스타일 클래스에서 유용하다 — 실제로 `rclcpp::QoS(10).reliable().durability_volatile()`처럼 ROS2 QoS 설정 객체가 이 패턴을 그대로 쓴다.

> [!WARNING]
> **남용 주의**
> 체이닝이 필요 없는 함수까지 억지로 참조를 반환할 필요는 없다. 값을 조회만 하는 함수(getter)는 그대로 값을 반환하는 게 낫다.

---

## 2. 클래스와 헤더 파일 분리

### 왜 나누는가

클래스가 커지면 멤버 함수 구현 코드가 클래스 정의(인터페이스) 안에 뒤섞여서, "이 클래스를 어떻게 쓰는지"를 보려는 사람이 "내부에서 어떻게 동작하는지"까지 다 읽어야 한다. 헤더(.h)에는 **무엇을 할 수 있는지**(선언)만, 소스(.cpp)에는 **어떻게 하는지**(정의)를 두면 인터페이스가 깔끔해지고, 구현만 바뀔 때는 그 .cpp 파일만 재컴파일하면 된다.

```cpp
// Date.h — 선언만
class Date
{
private:
    int m_year{}, m_month{}, m_day{};
public:
    Date(int year, int month, int day);
    void print() const;
    int getYear() const { return m_year; }  // 한 줄짜리 getter는 그냥 헤더 안에 둬도 됨
};
```

```cpp
// Date.cpp — 정의는 범위 지정 연산자(::)로
#include "Date.h"

Date::Date(int year, int month, int day)
    : m_year{ year }, m_month{ month }, m_day{ day }
{
}

void Date::print() const
{
    std::cout << "Date(" << m_year << ", " << m_month << ", " << m_day << ")\n";
}
```

### 인라인과 ODR — 헤더에 정의를 쓰면 안 되는 이유

| 위치                            | 상태           | 여러 .cpp에서 `#include`해도 되는가 |
| ----------------------------- | ------------ | -------------------------- |
| 클래스 내부에서 정의                   | 암묵적으로 inline | 가능                         |
| 클래스 외부(.cpp)에서 정의             | inline 아님    | **불가** — 중복 정의 링커 에러       |
| 클래스 외부(.h)에서 정의 + `inline` 명시 | 명시적 inline   | 가능                         |

이건 One Definition Rule(ODR) 때문이다 — 함수 하나가 여러 번 정의되면 링커가 어느 걸 써야 할지 모른다. 클래스 안에서 정의한 함수는 컴파일러가 자동으로 inline 처리해서 이 문제를 피해가지만, 클래스 밖에서 .cpp에 정의한 함수는 그 .cpp 파일 하나에만 존재해야 한다 — 그래서 헤더가 아니라 .cpp에 둔다.

> ROS2 패키지 구조가 정확히 이 원칙을 그대로 쓴다 — `include/<pkg>/*.hpp`에 클래스 선언, `src/*.cpp`에 정의하는 관행이 여기서 배운 헤더/소스 분리 원칙 그대로다.

### 예외 — 템플릿 클래스는 헤더에 정의를 둬야 한다

컴파일러가 템플릿을 실제 타입으로 인스턴스화하려면 사용하는 시점에 전체 정의를 봐야 하므로, 템플릿 멤버 함수는 예외적으로 헤더에 정의한다 (자세한 내용은 [5절](#5-클래스-템플릿의-멤버-함수)).

---

## 3. 중첩 타입 (member type)

클래스 안에 `enum`이나 `using` 타입 별칭을 정의해서, 그 타입이 특정 클래스와만 강하게 연관되어 있다는 걸 이름으로 드러낼 수 있다.

```cpp
class Fruit
{
public:
    enum Type { apple, banana, cherry };  // public에 두면 상단에 배치 — 쓰이기 전에 정의돼야 하므로
private:
    Type m_type{};
public:
    Fruit(Type type) : m_type{ type } {}
    Type getType() { return m_type; }
    bool isCherry() { return m_type == cherry; }  // 클래스 내부에서는 접두사 없이 사용 가능
};

int main()
{
    Fruit apple{ Fruit::apple };  // 외부에서는 Fruit:: 접두사 필요
}
```

이걸 클래스 밖에 `enum class FruitType`으로 따로 두면 동작은 똑같지만, `Fruit apple{ FruitType::apple };`처럼 타입 이름과 클래스 이름이 계속 따로 놀아서 둘의 관계가 코드에 드러나지 않는다. 중첩시키면 `Fruit::apple`처럼 소속이 이름 자체에 박힌다 — `std::string::iterator`가 바로 이 패턴이다.

`using`으로 타입 별칭도 중첩할 수 있다.

```cpp
class Employee
{
public:
    using IDType = int;
private:
    IDType m_id{};
};
// 외부: Employee::IDType id{ ... };
```

> [!NOTE]
> **중첩 클래스와 this**
> 클래스 안에 클래스를 통째로 중첩시킬 수도 있다. 이때 중첩 클래스는 바깥 클래스의 `this`에는 접근할 수 없지만(별개의 객체이므로), 바깥 클래스의 private 멤버에는 접근할 수 있다.

---

## 4. 소멸자 (destructor)

### 자동 정리가 필요한 이유

[생성자](../chapter14IntroductionToClasses/main.md)가 객체를 만들 때 자동으로 호출되는 것처럼, **소멸자는 객체가 파괴될 때 자동으로 호출**된다. 이름 규칙은 `~ClassName()`이고, 매개변수를 받을 수 없고 반환형도 없으며(void조차 안 씀) 클래스당 하나만 존재한다.

정리 작업을 소멸자에 자동으로 걸어두는 이유는, 사람이 수동으로 정리 함수를 호출하게 두면 잊어버리기 쉽기 때문이다.

```cpp
bool someFunction()
{
    NetworkData n("서버주소");
    n.addData("데이터1");

    if (someCondition)
        return false;  // 여기서 리턴하면 sendData()가 영영 호출 안 됨

    n.sendData();
    return true;
}
```

소멸자에 정리 코드를 넣으면 함수가 어느 경로로 빠져나가든(조건 분기, 조기 return) 객체가 스코프를 벗어나는 순간 자동으로 실행된다 — 이 패턴을 RAII(Resource Acquisition Is Initialization)라고 부른다.

```cpp
class NetworkData
{
public:
    NetworkData(std::string_view serverName) { /* 리소스 획득 */ }
    ~NetworkData() { sendData(); }  // 리소스 반환 — 자동 보장
};
```

> ROS2 노드에서 소켓·GPIO 핸들·파일 디스크립터 같은 하드웨어 리소스를 다룰 때 이 패턴이 그대로 적용된다 — `rclcpp::Node`를 상속한 클래스가 소멸될 때 구독/퍼블리셔 정리, 시리얼 포트 닫기 등을 소멸자에 맡기면 노드 종료 경로가 여러 개(정상 종료·`Ctrl+C`·예외)여도 정리가 누락되지 않는다.

### 소멸자를 직접 호출하면 안 되는 이유

소멸자는 "객체가 파괴되는 시점"에만 호출되어야 한다는 게 컴파일러와 나머지 코드가 공유하는 약속이다. 직접 호출하면 객체가 파괴된 걸로 컴파일러는 모르는 상태에서 리소스만 먼저 정리돼버려서, 스코프가 끝날 때 소멸자가 또 호출되며 이중 정리(double free 등)가 발생할 수 있다.

### static/전역 객체의 소멸 순서 — 생성의 역순(LIFO)

```cpp
int main()
{
    Simple s1{ 1 };
    {
        Simple s2{ 2 };
    }  // s2가 먼저 소멸 (나중에 생성됐으므로)
    return 0;
}  // s1이 마지막에 소멸
```

출력: `생성 1 → 생성 2 → 소멸 2 → 소멸 1`. 나중에 만들어진 게 먼저 정리되는 이유는, 뒤에 생성된 객체가 앞서 생성된 객체에 의존하고 있을 가능성을 컴파일러가 배제할 수 없기 때문이다 — 의존 대상을 항상 나중에 치워야 안전하다.

> [!WARNING]
> **소멸자가 보장되지 않는 경우**
> `std::exit()`로 프로그램을 즉시 종료하면 지역 변수의 소멸자가 호출되지 않는다. 처리되지 않은 예외로 프로그램이 죽을 때도 스택 언와인딩이 일어나지 않으면 마찬가지다 — "정리는 항상 소멸자가 보장해준다"고 무조건 믿으면 안 된다.

---

## 5. 클래스 템플릿의 멤버 함수

[Ch.11](../chapter11FunctionOverloadingAndTemplates/main.md)에서 함수 템플릿을 배웠다면, 클래스 자체도 템플릿으로 만들 수 있다 — 타입 매개변수 `T`를 멤버 변수 타입과 멤버 함수 매개변수 타입 양쪽에 다 쓸 수 있다.

### 클래스 내부에서 정의 — template 선언 불필요

```cpp
template <typename T>
class Pair
{
private:
    T m_first{}, m_second{};
public:
    Pair(const T& first, const T& second) : m_first{ first }, m_second{ second } {}
};
```

### 클래스 외부에서 정의 — template 선언을 반드시 반복

```cpp
template <typename T>
bool Pair<T>::isEqual(const Pair<T>& pair)
{
    return m_first == pair.m_first && m_second == pair.m_second;
}
```

외부 정의에서는 `Pair::isEqual`이 아니라 `Pair<T>::isEqual`처럼 템플릿 인자까지 붙인 정규화된 이름을 써야 한다 — 컴파일러 입장에서 `Pair`라는 이름 자체는 아직 완전한 타입이 아니라 "타입을 만드는 틀"이기 때문이다. 다만 클래스 스코프 안에서는 `Pair`가 `Pair<T>`의 축약형(injected class name)으로 통하므로, 매개변수 타입 등에서는 `Pair<T>` 대신 `Pair`만 써도 된다.

> 헤더에 템플릿 멤버 함수 정의를 두는 게 [2절](#2-클래스와-헤더-파일-분리)의 일반 규칙과 어긋나 보이지만, 템플릿에서 암시적으로 인스턴스화된 함수는 자동으로 inline 취급되므로 여러 .cpp에 #include돼도 ODR 위반이 아니다.

rclcpp의 `create_publisher<std_msgs::msg::String>(...)`, `create_subscription<T>(...)`가 바로 이 클래스 템플릿 멤버 함수 패턴이다 — 지금까지는 관용구로 베껴 썼다면, 이제 `<T>` 자리에 왜 메시지 타입이 들어가는지 설명할 수 있다. 클래스 템플릿의 특수화·부분특수화 같은 심화 내용은 Ch.26에서 다룬다.

---

## 6. static 멤버 변수

일반 멤버 변수는 객체마다 따로 존재하지만, `static` 멤버 변수는 **그 클래스의 모든 객체가 공유하는 단 하나의 변수**다 — "클래스 스코프 안에 있는 전역 변수"에 가깝다. 프로그램 시작 시 생성되고 종료 시 소멸되며, 특정 객체에 속하지 않는다.

```cpp
class Something
{
public:
    static int s_value;  // 선언만 — 메모리 할당 없음
};
int Something::s_value{ 1 };  // 클래스 밖에서 정의 — 여기서 메모리 할당

Something first{}, second{};
first.s_value = 2;
std::cout << second.s_value;  // 2 — 공유되므로 second도 바뀜
```

### 왜 선언과 정의를 나누는가

클래스 내부의 `static int s_value;`는 "이런 멤버가 있다"는 선언일 뿐, 실제 메모리는 할당하지 않는다. 전역 변수와 똑같은 이유다 — 헤더에 정의까지 넣으면 그 헤더를 여러 .cpp가 #include할 때마다 같은 변수가 중복 정의되어 링커 에러가 난다.

### 예외 — 클래스 안에서 바로 초기화할 수 있는 경우

| 상황 | 방법 | 클래스 내부 초기화 가능한 이유 |
|---|---|---|
| static const 정수형 | `static const int s_value{ 4 };` | 컴파일 타임 상수라 별도 메모리 불필요 |
| static constexpr (C++17+) | `static constexpr double s_value{ 2.2 };` | constexpr은 암묵적으로 inline이라 ODR 위반 없음 |
| static inline (C++17+) | `static inline int s_value{ 4 };` | inline 변수는 여러 정의를 허용하도록 설계됨 |

### 사용 예 — 객체마다 고유 ID 부여

```cpp
class Something
{
private:
    static inline int s_idGenerator{ 1 };
    int m_id{};
public:
    Something() : m_id{ s_idGenerator++ } {}  // 모든 객체가 같은 카운터를 공유하며 증가시킴
    int getID() const { return m_id; }
};
```

`s_idGenerator`가 공유되기 때문에, 생성될 때마다 자동으로 겹치지 않는 ID가 부여된다 — 다중 로봇/다중 노드 시스템에서 로봇 인스턴스나 조인트에 고유 ID를 자동 부여하는 데 같은 패턴을 쓸 수 있다.

---

## 7. static 멤버 함수

`static` 멤버 함수는 특정 객체가 아니라 클래스 자체에 속하는 함수라, 객체를 만들지 않고도 `ClassName::functionName()`으로 바로 호출할 수 있다. 주로 private static 멤버 변수에 접근하기 위한 창구로 쓰인다.

```cpp
class IDGenerator
{
private:
    static inline int s_nextID{ 1 };
public:
    static int getNextID();
};
int IDGenerator::getNextID() { return s_nextID++; }  // 정의에는 static 키워드 반복 안 함

IDGenerator::getNextID();  // 객체 생성 없이 호출
```

### this가 없는 이유, non-static 멤버에 접근 못 하는 이유

이 둘은 같은 원인에서 나온다 — [1절](#1-this-포인터와-메서드-체이닝)에서 봤듯 `this`는 "현재 객체의 주소"인데, static 멤버 함수는 애초에 특정 객체와 엮여서 호출되지 않으므로 가리킬 객체가 없다. non-static 멤버는 객체마다 따로 존재하는 값이라 "어느 객체의 것"인지가 정해져야 하는데, static 함수 안에는 그 정보(=this)가 없어서 컴파일러가 접근을 막는다. 반대로 static 멤버끼리는 객체와 무관하게 클래스 레벨에 존재하므로 서로 자유롭게 접근 가능하다.

---

## 8. friend 비멤버 함수

`friend`로 선언된 함수는 멤버 함수가 아닌 일반 함수이면서도, 그 클래스의 private/protected 멤버에 접근할 수 있는 예외적인 권한을 가진다.

```cpp
class Accumulator
{
private:
    int m_value{ 0 };
public:
    void add(int value) { m_value += value; }
    friend void print(const Accumulator& accumulator);  // friend 선언
};

void print(const Accumulator& accumulator)
{
    std::cout << accumulator.m_value;  // private 접근 가능
}
```

friend 함수는 비멤버 함수이므로 암묵적 `this`가 없다 — 그래서 접근하려는 객체를 매개변수로 명시적으로 받는다. 두 객체를 비교하는 함수처럼 인자들 사이에 우열이 없는 경우, 멤버 함수(`a.isEqualTo(b)`, 비대칭)보다 friend 비멤버 함수(`isEqual(a, b)`, 대칭)가 더 자연스러운 문법이 된다.

### "캡슐화를 깨는 것 아닌가?"에 대한 답

흔한 오해와 달리, friend는 캡슐화 위반이 아니다 — **캡슐화는 클래스 자신이 누구에게 접근을 허용할지 스스로 결정하는 능력**이고, friend 선언은 그 클래스가 직접 "이 함수만은 내 속을 봐도 된다"고 명시적으로 허가하는 것이다. 통제권이 여전히 클래스 자신에게 있다는 게 핵심이다.

다만 friend는 구현 세부사항에 대한 결합도를 높이므로(멤버 이름이 바뀌면 friend 함수도 고쳐야 함), 우선순위는 **public 접근 함수 사용 → 일반 비멤버 함수 → friend** 순으로 두는 게 권장된다.

---

## 9. friend 클래스와 friend 멤버 함수

함수 하나가 아니라 클래스 전체를 friend로 선언할 수도 있다.
그 클래스에 속한 모든 멤버 함수가 접근 권한을 가진다.

```cpp
class Storage
{
private:
    int m_nValue{};
public:
    friend class Display;  // Display의 모든 멤버 함수가 Storage의 private에 접근 가능
};

class Display
{
public:
    void displayStorage(const Storage& storage) { std::cout << storage.m_nValue; }
};
```

### friend 관계가 갖지 않는 성질 세 가지

- **상호적이지 않다** — Display가 Storage의 friend라고 해서 Storage가 Display의 friend가 되는 건 아니다(양방향 원하면 양쪽 다 선언).
- **상속되지 않는다** — Storage가 Display를 friend로 선언해도, Display를 상속한 파생 클래스는 자동으로 friend가 아니다.
- **전이되지 않는다** — A가 B의 friend, B가 C의 friend여도 A는 C의 friend가 아니다.

이 세 성질이 없다면 friend 권한이 상속·연쇄를 타고 통제 불가능하게 퍼질 수 있기 때문에, 언어 차원에서 의도적으로 막아둔 것이다.

### 클래스 전체가 아니라 멤버 함수 하나만 friend로 만들기

전체 클래스를 열어주긴 부담스러울 때, 특정 멤버 함수 하나만 friend로 지정할 수 있다. 다만 컴파일러가 "그 멤버 함수가 속한 클래스의 완전한 정의"를 이미 봤어야 friend 선언을 이해할 수 있어서, 두 클래스가 서로를 참조하면 선언 순서 문제가 생긴다 — 전방 선언 + 멤버 함수 선언만 먼저 하고 정의는 뒤로 미루는 방식으로 푼다.

```cpp
class Vector3d;  // 전방 선언

class Point3d
{
public:
    void moveByVector(const Vector3d& v);  // 선언만, 정의는 나중에
};

class Vector3d
{
public:
    friend void Point3d::moveByVector(const Vector3d& v);  // Point3d는 이미 완전히 정의됨
};

void Point3d::moveByVector(const Vector3d& v) { /* Vector3d도 이제 완전히 정의됨 */ }
```

실전에서는 각 클래스를 별도 헤더/cpp로 분리하면 이런 순서 문제가 대부분 자연스럽게 해소된다.

---

## 10. Ref qualifier

C++11부터, 멤버 함수 뒤에 `&` 또는 `&&`를 붙여서 **그 함수가 lvalue 객체에 호출됐는지 rvalue(임시) 객체에 호출됐는지에 따라 다른 오버로드**를 고를 수 있다.

이게 필요한 이유는 dangling reference 문제 때문이다.

```cpp
Employee createEmployee(std::string_view name);  // 임시 Employee를 값으로 반환

const std::string& ref{ createEmployee("Garbo").getName() };
std::cout << ref;  // 정의되지 않은 동작 — createEmployee()가 반환한 임시 객체는 이미 소멸됨
```

`getName()`이 멤버 참조를 그대로 반환하면, 그 참조가 가리키던 임시 객체가 문장 끝에서 사라지면서 참조만 허공에 남는다. ref qualifier로 이 두 경우를 나눠서 처리할 수 있다.

```cpp
class Employee
{
private:
    std::string m_name{};
public:
    const std::string& getName() const &  { return m_name; }        // lvalue: 참조 반환 (복사 없음)
    std::string         getName() const && { return m_name; }        // rvalue: 값으로 복사해서 반환 (안전)
};
```

> [!NOTE]
> **실무에서는 잘 안 쓰인다**
> 이 문서 자체가 ref qualifier를 베스트 프랙티스로 권장하지 않는다 — 모든 getter에 rvalue 오버로드를 추가하면 클래스가 번잡해지고, 표준 라이브러리(STL)조차 이 기능을 쓰지 않는다. "존재를 알아두되, 반환된 참조는 즉시 쓰고 나중을 위해 저장해두지 않는" 습관으로 같은 문제를 피하는 쪽이 현실적이다.

---

## 핵심 요약 카드

| 개념            | 핵심 내용                                                                   |
| ------------- | ----------------------------------------------------------------------- |
| this 포인터      | 멤버 함수에 숨어서 전달되는, 현재 객체를 가리키는 const 포인터                                  |
| 메서드 체이닝       | `*this`를 참조로 반환 → 연속 호출 가능 (`rclcpp::QoS(10).reliable()...`)            |
| 헤더/소스 분리      | 선언(.h)과 정의(.cpp) 분리 → 인터페이스 명확화 + 재컴파일 최소화                              |
| 중첩 타입         | 클래스 안의 enum/using — `Fruit::apple`처럼 소속을 이름에 드러냄                        |
| 소멸자           | `~ClassName()`, 객체 파괴 시 자동 호출 → RAII로 리소스 정리 보장                         |
| 클래스 템플릿       | `template<typename T> class X {...}` — rclcpp의 `create_publisher<T>` 패턴 |
| static 멤버 변수  | 모든 객체가 공유하는 클래스 레벨 변수. 원칙상 클래스 밖에서 정의                                   |
| static 멤버 함수  | 객체 없이 `Class::func()` 호출. this 없음, non-static 멤버 접근 불가                  |
| friend 함수/클래스 | 클래스가 스스로 허가하는 private 접근권. 캡슐화 위반이 아니라 통제된 예외                           |
| ref qualifier | `&`/`&&`로 lvalue·rvalue 호출을 구분 — dangling 방지용, 실무에서는 드묾                 |

### 자주 하는 실수 TOP 5

1. **static 멤버 변수를 선언만 하고 클래스 밖 정의를 빼먹기** — 링커가 "undefined reference" 에러를 낸다.
2. **소멸자를 직접 호출하기** — 스코프 종료 시 다시 호출되어 이중 정리(double free)가 발생할 수 있다.
3. **체이닝용 함수가 `*this`가 아니라 `this`(포인터)를 반환** — 타입이 안 맞아 컴파일 에러가 나거나, 의도와 다르게 포인터 체이닝이 되어버린다.
4. **static 멤버 함수 안에서 non-static 멤버에 접근하려다 컴파일 에러** — this가 없다는 걸 잊고 마치 일반 멤버 함수처럼 작성하는 경우.
5. **friend를 "캡슐화가 필요 없다"는 신호로 오해해 남용** — friend는 예외적 허가이지 기본값이 아니다. public 접근 함수로 먼저 풀 수 있는지부터 검토해야 한다.
