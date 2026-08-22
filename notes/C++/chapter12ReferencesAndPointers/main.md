---
title: Chapter 12 — Compound Types: References and Pointers (참조와 포인터)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 12 — Compound Types: References and Pointers (참조와 포인터)

> 출처: [learncpp.com Chapter 12](https://www.learncpp.com/) (12.1 ~ 12.15)
> **정독 챕터** — 커리큘럼 선별 기준상 rclcpp(ROS2 C++ 클라이언트 라이브러리)를 다루기 전 반드시 정독해야 하는 챕터. ROS2 콜백 시그니처(`const msg::SharedPtr&`), 노드 핸들 전달 등이 전부 이 챕터의 참조/포인터 규칙 위에 있다.
> 이 챕터의 질문 하나: **"같은 객체를 별명(참조)으로 다룰지, 주소(포인터)로 다룰지 — 언제 뭘 써야 하는가?"**

---

## 목차

1. [1. 복합 타입 소개 (12.1)](#1-복합-타입-소개-121)
2. [2. 값 카테고리 — lvalue와 rvalue (12.2)](#2-값-카테고리--lvalue와-rvalue-122)
3. [3. lvalue 참조 (12.3)](#3-lvalue-참조-123)
4. [4. const에 대한 lvalue 참조 (12.4)](#4-const에-대한-lvalue-참조-124)
5. [5. 참조로 전달하기 (12.5)](#5-참조로-전달하기-125)
6. [6. const 참조로 전달하기 (12.6)](#6-const-참조로-전달하기-126)
7. [7. 포인터 소개 (12.7)](#7-포인터-소개-127)
8. [8. 널 포인터 (12.8)](#8-널-포인터-128)
9. [9. 포인터와 const (12.9)](#9-포인터와-const-129)
10. [10. 주소로 전달하기 (12.10)](#10-주소로-전달하기-1210)
11. [11. 주소로 전달하기 — 심화 (12.11)](#11-주소로-전달하기--심화-1211)
12. [12. 참조/주소로 반환하기 (12.12)](#12-참조주소로-반환하기-1212)
13. [13. in/out 매개변수 (12.13)](#13-inout-매개변수-1213)
14. [14. auto와 포인터·참조·const의 타입 추론 (12.14)](#14-auto와-포인터·참조·const의-타입-추론-1214)
15. [15. std::optional (12.15)](#15-stdoptional-1215)

---

## 1. 복합 타입 소개 (12.1)

**복합 타입(compound type)**은 기본 타입을 조합해서 만든 타입이다 — 함수, 배열, 포인터, 참조, enum, 클래스/구조체가 전부 여기 속한다.

**왜 필요한가**: 분수 하나를 표현하려면 분자·분모 두 정수가 항상 짝을 이뤄야 하는데, `int num, den`처럼 따로 선언하면 코드만 봐서는 이 둘이 한 쌍이라는 걸 알 수 없다. 학생 100명의 ID도 변수 100개로는 관리가 안 된다(DRY 위반). 복합 타입은 "여러 값이 하나의 개념"이라는 관계 자체를 타입 시스템에 새겨 넣는다.

```cpp
int num1{}, den1{}, num2{}, den2{};
char ignore{};
std::cin >> num1 >> ignore >> den1;   // "1/2" 입력
std::cin >> num2 >> ignore >> den2;   // "3/4" 입력
std::cout << num1*num2 << '/' << den1*den2;  // 3/8
```

이 장은 그 중에서도 **참조(reference)**와 **포인터(pointer)** — 기존 객체를 "별명"으로 다룰지 "주소"로 다룰지의 두 축을 다룬다.

---

## 2. 값 카테고리 — lvalue와 rvalue (12.2)

모든 C++ 표현식은 **타입**과 **값 카테고리**를 갖는다. 참조·포인터가 "무엇에 바인딩될 수 있는가"는 전부 이 카테고리로 결정되므로, 이 절이 이후 13절 전체의 문법 근거다.

- **lvalue**: 식별 가능한 객체나 함수로 평가되는 표현식. 이름·참조·포인터로 다시 접근할 수 있고, 표현식이 끝나도 살아남는다.
- **rvalue**: lvalue가 아닌 표현식. 정체성이 없는 임시값 — 리터럴(문자열 리터럴 제외), 함수의 반환값 등. 자신을 만든 표현식이 끝나면 사라진다.

```cpp
int x{5};   // x는 수정 가능한 lvalue
5;          // rvalue (리터럴)
return5();  // rvalue (함수 반환값, 임시)
x + 1;      // rvalue (연산 결과, 임시)
++x;        // lvalue (전위 증가는 x 자신을 반환)
x++;        // rvalue (후위 증가는 증가 전 값의 복사본을 반환)
"Hello";    // lvalue (C 스타일 문자열 리터럴은 예외적으로 lvalue)
```

**왜 이름이 헷갈리는가**: "왼쪽/오른쪽 값"이라는 이름 때문에 대입식에서의 위치로 착각하기 쉽지만, 실제 기준은 위치가 아니라 **"지속되는 정체성이 있는가"**다. `x = 5`는 되는데 `5 = x`는 안 되는 이유도 "대입 연산자는 <mark style="background: #ADCCFFA6;">왼쪽에 수정 가능한 lvalue, 오른쪽에 rvalue</mark>를 요구한다"는 규칙 때문이지, 단순히 위치 때문이 아니다.

**암묵적 변환**: lvalue는 필요하면 자동으로 rvalue로 변환된다(그 반대는 불가) — `x = y`에서 `y`(lvalue)가 저장된 값(rvalue)으로 변환되어 `x`에 대입된다.

---

## 3. lvalue 참조 (12.3)

**참조는 이미 존재하는 객체의 별명이다.** 참조에 가하는 모든 연산은 그대로 원본 객체에 적용된다.

```cpp
int x{5};
int& ref{x};   // ref는 x의 별명
ref = 10;      // x가 10이 됨
std::cout << ref;  // x를 읽음
```

**문법**: `&`를 타입 쪽에 붙인다(`int& ref`). 참조는 **선언과 동시에 반드시 초기화**해야 한다 — 초기화 없는 참조는 컴파일 에러다.

**바인딩 규칙과 그 이유**:
- non-const lvalue 참조는 **수정 가능한 lvalue에만** 바인딩된다.
- const 객체나 rvalue에는 바인딩할 수 없다 — 만약 된다면 `const`로 선언한 값을 참조를 통해 몰래 바꿀 수 있게 되어 const-correctness가 깨진다.
- 타입이 다르면 암묵적 변환이 일어나는데, 그 변환 결과는 **임시 rvalue**라서 non-const 참조에 바인딩할 수 없다(4절에서 이어짐).

**재바인딩(reseat) 불가**: `ref = y`는 참조 대상을 바꾸는 게 아니라 **원본 객체의 값을 y로 덮어쓰는** 대입이다. 참조는 한 번 묶이면 평생 그 객체만 가리킨다 — 포인터와 가장 크게 다른 지점.

**댕글링 참조**: 참조와 참조 대상의 수명은 별개다. 참조 대상이 먼저 파괴되면 **댕글링 참조**가 되고, 이를 사용하면 undefined behavior다.

> [!NOTE]
> **참조는 객체가 아니다**
> 컴파일러가 통째로 최적화해서 없앨 수도 있는, 기존 객체를 가리키는 문법적 장치일 뿐이다. 그래서 "참조에 대한 참조" 같은 것도 만들 수 없다.

---

## 4. const에 대한 lvalue 참조 (12.4)

3절 규칙대로면 `const int x{5}; int& ref{x};`는 non-const 참조로 const 값을 바꿀 수 있게 되므로 금지된다. **const 참조**는 참조 대상의 원래 const 여부와 무관하게 "이 참조를 통해서는 읽기만 가능"을 강제해서 이 문제를 해결한다.

```cpp
const int& ref{x};
```

**const 참조가 훨씬 유연한 이유**: 다음 세 가지 전부에 바인딩된다.
1. non-modifiable lvalue (const 객체)
2. modifiable lvalue (non-const 객체 — 참조를 통해서만 const 취급)
3. **rvalue** (임시값)

```cpp
const int& ref{5};   // 리터럴(rvalue)에 직접 바인딩 가능
```

**수명 연장(lifetime extension)**: const lvalue 참조가 임시 객체(rvalue)에 **직접** 바인딩되면, 그 임시 객체의 수명이 **참조의 수명만큼 연장**된다. 그렇지 않으면 바로 다음 줄에서 댕글링 참조가 될 것이기 때문에, 언어 차원에서 이를 막아준다.

```cpp
const int& ref{5};  // 임시 int(5)가 생성되고, 수명이 ref만큼 연장
std::cout << ref;    // 안전
// ref와 임시 객체가 함께 소멸
```

**베스트 프랙티스**: 수정할 필요가 없으면 항상 non-const보다 **const 참조를 우선**한다 — 더 많은 것에 바인딩되고, 실수로 값을 바꿀 위험도 없다.

---

## 5. 참조로 전달하기 (12.5)

값 전달(pass by value)은 인자를 매개변수로 **복사**한다. `int`처럼 값이 작으면 문제없지만, `std::string`처럼 비용이 큰 클래스 타입을 값으로 넘기면 불필요한 복사가 매번 발생한다.

```cpp
void printValue(std::string y) { ... }   // 호출마다 std::string 전체 복사
void printValue(std::string& y) { ... }  // 복사 없음 — y는 인자의 별명
```

**성능 이점**: 참조 매개변수는 인자와 **동일한 주소**를 갖는다(주소 비교로 직접 확인 가능) — 복사가 아예 일어나지 않았다는 뜻.

**부가 효과 — 인자 수정**: <mark style="background: #ADCCFFA6;">참조 매개변수에 가한 변경은 원본 인자에도 그대로 반영</mark>된다. 몬스터 데미지 함수가 플레이어 체력을 직접 깎는 식의 패턴이 가능해진다.

**한계**: non-const 참조는 **수정 가능한 lvalue에만** 바인딩되므로, const 변수나 리터럴을 인자로 넘길 수 없다 — 실용성을 크게 제한한다. 이 한계가 다음 절(const 참조 전달)로 이어진다.

---

## 6. const 참조로 전달하기 (12.6)

**왜 const 참조를 선호하는가**: non-const 참조와 달리 수정 가능/불가능 lvalue, rvalue **전부**에 바인딩된다 — 리터럴이나 임시 객체도 인자로 넘길 수 있다. 게다가 <mark style="background: #ADCCFFA6;">함수가 원본을 바꾸지 않는다는 안전성까지 보장</mark>한다.

> **베스트 프랙티스**: "특별한 이유가 없다면 non-const 참조보다 const 참조로 전달하는 것을 선호하라."

**값 전달 vs 참조 전달 선택 기준**:

| 타입         | 전달 방식       | 이유      |
| ---------- | ----------- | ------- |
| 기본 타입·enum | 값 전달        | 복사가 저렴함 |
| 클래스 타입     | const 참조 전달 | 복사가 비쌈  |

셋을 따지는 비용 요소:
1. 초기화 비용(복사 크기·설정 비용 vs 참조 바인딩은 항상 저렴)
2. 접근 비용(값은 1회 접근, 참조는 간접 참조 한 단계 추가)
3. 컴파일러 최적화 여지(값 전달은 aliasing이 없어 더 공격적으로 최적화 가능). 대략 `sizeof(T) <= 2 * sizeof(void*)`이고 추가 설정 비용이 없으면 "복사가 싸다"고 본다.

**문자열의 특수 사례**: 최신 C++에서는 `const std::string&`보다 `std::string_view`가 더 넓은 인자 타입을 비용 없이 받을 수 있어 선호된다(단, C++14 타겟이거나 C 스타일 문자열 함수를 호출해야 하면 `const std::string&` 유지).

---

## 7. 포인터 소개 (12.7)

**포인터**는 다른 객체의 **메모리 주소**를 저장하는 객체 자체다. 참조와 달리 포인터는 진짜 객체이므로 재대입(reseat)이 가능하고, 크기를 갖고, 널 상태를 가질 수 있다.

**핵심 연산자 두 개**:
- **주소 연산자 `&`**: `&x`는 x의 메모리 주소를 반환.
- **역참조 연산자 `*`**: `*(&x)`는 그 주소에 저장된 값을 반환 — 서로 반대 동작.

```cpp
int x{5};
int* ptr{&x};   // ptr은 x의 주소를 저장하는 포인터
std::cout << *ptr;  // 5 (역참조)
```

**초기화 규칙**: <mark style="background: #ADCCFFA6;">반드시 초기화한다</mark> — 초기화하지 않으면 쓰레기 주소를 가리키는 **wild pointer**가 되어 역참조 시 undefined behavior다. 타입도 반드시 맞춰야 한다(`int*`가 `double`을 가리킬 수 없음).

**참조 vs 포인터 비교**:

| 항목    | 포인터            | 참조               |
| ----- | -------------- | ---------------- |
| 초기화   | 선택(하지만 항상 할 것) | 필수               |
| 객체 여부 | 그 자체가 객체       | 객체가 아님           |
| 재대입   | 가능             | 불가               |
| 널 상태  | 가능(아무것도 안 가리킴) | 불가(반드시 무언가에 바인딩) |
| 안전성   | 상대적으로 위험       | 상대적으로 안전         |

**댕글링 포인터**: 이미 파괴된 객체를 가리키는 포인터. 역참조하면 undefined behavior — 크래시로 이어질 수 있다.

**크기**: 포인터 크기는 가리키는 대상과 무관하게 시스템 아키텍처로 정해진다(32비트=4바이트, 64비트=8바이트).

> [!NOTE]
> **ROS2 연결**
> ROS2 콜백은 대부분 `const MsgType::SharedPtr& msg` 형태로 메시지를 받는다 — `SharedPtr`는 스마트 포인터(참조 카운팅 포인터)라 이 절의 raw pointer와는 다르지만, "주소를 통해 간접 접근한다"는 원리는 동일하다. raw pointer/reference의 규칙을 여기서 확실히 잡아야 스마트 포인터가 왜 그렇게 설계됐는지 이해할 수 있다.

---

## 8. 널 포인터 (12.8)

**널 포인터**는 유효한 객체를 가리키지 않는 특수한 상태의 포인터다. 값 초기화로 가장 쉽게 만든다.

```cpp
int* ptr{};       // 널 포인터
int* ptr2{nullptr};  // 명시적 널 리터럴
ptr2 = nullptr;      // 대입
someFunction(nullptr);  // 함수 인자로 전달
```

**`nullptr` 키워드**: `bool`의 `true`/`false`처럼 널 포인터 전용 리터럴이다. `std::nullptr_t`라는 고유 타입을 가져서, 오버로드 해석에서 정수(`0`)와 절대 헷갈리지 않는다 — 이게 레거시 `0`/`NULL`이 비추천되는 핵심 이유(11절에서 오버로딩 모호성으로 다시 등장).

**역참조의 위험**: 널 포인터를 역참조하면 undefined behavior, 대부분 즉시 크래시한다 — 가장 흔한 C++ 실수 중 하나.

```cpp
int* ptr{};
std::cout << *ptr;   // 크래시
```

**널 체크**:

```cpp
if (ptr == nullptr) ...   // 명시적 비교
if (ptr) ...               // 암묵적 bool 변환 (널이 아니면 true)
```

**널 vs 댕글링의 결정적 차이**: 널 포인터는 "명시적으로 아무것도 안 가리키는 상태"라 체크가 가능하지만, **댕글링 포인터는 안전하게 감지할 방법이 없다**. 그래서 실무 원칙은 "포인터는 항상 유효한 객체를 가리키거나, `nullptr`이거나 둘 중 하나여야 한다" — 감지가 안 되는 상태(댕글링)를 애초에 만들지 않는 게 유일한 방어책이다.

> **베스트 프랙티스**: 추가 기능(재대입, 널 상태)이 필요 없다면 포인터보다 참조를 선호한다 — 참조는 애초에 널이 될 수도, 댕글링을 만들기도(비교적) 어렵다.

---

## 9. 포인터와 const (12.9)

`const`가 `*`의 **왼쪽**에 오면 가리키는 값이, **오른쪽**에 오면 포인터 자신이 const가 된다.

**① 포인터 투 const (pointer to const value)** — `const int* ptr`

```cpp
const int* ptr{&x};
*ptr = 6;   // 컴파일 에러 — 값 수정 불가
ptr = &y;   // OK — 대상 재지정 가능
```
const 객체·non-const 객체 모두 가리킬 수 있다. **왜 필요한가**: 값을 실수로 바꾸는 걸 막으면서도 포인터 자체는 이곳저곳 재사용하고 싶을 때.

**② const 포인터 (const pointer)** — `int* const ptr`

```cpp
int* const ptr{&x};
*ptr = 6;   // OK — 값 수정 가능
ptr = &y;   // 컴파일 에러 — 재지정 불가
```
선언 시 반드시 초기화해야 한다. **왜 필요한가**: 포인터가 항상 같은 대상을 가리킨다는 걸 보장하고 싶을 때(참조와 비슷한 안전성 + 포인터의 널 가능성).

**③ const 포인터 투 const** — `const int* const ptr`

```cpp
const int* const ptr{&x};   // 값도, 대상도 둘 다 수정 불가
```

**문법 암기 규칙**: "`const`가 `*` 왼쪽이면 값을, 오른쪽이면 포인터 자신을 수식한다." 3가지 조합은 12·13절(전달·반환)에서 그대로 재사용되므로 여기서 확실히 암기해야 한다.

---

## 10. 주소로 전달하기 (12.10)

**주소로 전달(pass by address)**은 값 전달·참조 전달에 이은 세 번째 매개변수 전달 방식이다. 객체 자체가 아니라 그 객체의 **주소**(포인터)를 넘긴다.

```cpp
void printByAddress(const std::string* ptr)
{
    std::cout << *ptr << '\n';  // 역참조해서 사용
}
printByAddress(&str);   // & 로 주소를 얻어 전달
```

**성능**: `std::string`을 주소로 전달하면 실제 객체가 아니라 포인터(보통 4~8바이트)만 복사된다 — 참조 전달과 성능이 동등하다.

**수정 가능성**: 포인터-투-non-const 매개변수면 함수가 원본을 바꿀 수 있다. 수정을 막으려면 포인터-투-const를 쓴다(9절 ①).

**참조에는 없는 위험 — 널 포인터**: 포인터는 널일 수 있으므로 방어적으로 체크해야 한다.

```cpp
void print(int* ptr)
{
    if (!ptr) return;   // 조기 반환
    std::cout << *ptr << '\n';
}
```
널이 절대 들어올 수 없는 상황이면 `assert()`로 그 가정을 코드에 명시한다.

**참조 전달이 대체로 더 나은 이유**: lvalue와 임시 rvalue를 모두 받고(`&`/`*` 문법이 없어 더 간결하고), 애초에 널이 될 수 없다.

> **베스트 프랙티스**: 특별한 이유가 없다면 주소 전달보다 참조 전달을 선호한다.

---

## 11. 주소로 전달하기 — 심화 (12.11)

**선택적(optional) 포인터 매개변수**: `nullptr`을 기본값으로 둬서 "인자가 없었다"를 표현할 수 있다.

```cpp
void printIDNumber(const int* id = nullptr)
{
    if (id) std::cout << "ID: " << *id << ".\n";
    else    std::cout << "ID 없음.\n";
}
```
다만 [함수 오버로딩](../chapter11FunctionOverloadingAndTemplates/main.md)이 널 포인터 역참조 위험도 없고 리터럴/rvalue 인자도 받을 수 있어 더 나은 대안인 경우가 많다.

**포인터가 가리키는 대상 자체를 바꾸기**: 포인터를 값으로 넘기면 함수 안에서 그 지역 사본만 바뀐다.

```cpp
void nullify(int* ptr2) { ptr2 = nullptr; }  // 호출자의 포인터는 그대로
```
함수가 **호출자의 포인터 자체**를 바꾸게 하려면 "포인터에 대한 참조"(`int*&`)가 필요하다.

```cpp
void nullify(int*& refptr) { refptr = nullptr; }  // 원본 포인터가 바뀜
```

**`nullptr` vs `0`/`NULL`**: 리터럴 `0`은 오버로드 해석에서 정수로 해석될지 널 포인터로 해석될지 모호해질 수 있다. `nullptr`은 `std::nullptr_t`라는 고유 타입을 가져서 이 모호성을 원천 차단한다(8절에서 예고된 내용).

**근본 원리**: "C++은 사실 모든 것을 값으로 전달한다." 참조는 컴파일러가 최적화해 구현한 포인터일 뿐이고, 주소 전달도 결국 주소값 자체를 복사하는 것 — 세 가지 전달 방식이 근본적으로는 하나의 메커니즘 위에 있다는 뜻이다.

---

## 12. 참조/주소로 반환하기 (12.12)

**참조로 반환**: 기존 객체에 바인딩된 참조를 반환해서 클래스 타입의 비싼 복사를 피한다.

```cpp
const std::string& returnByReferenceToConst();
```

**결정적 함정 — 댕글링 참조**: 반환되는 객체는 함수 스코프보다 **더 오래 살아야** 한다.

```cpp
const std::string& getProgramName()
{
    const std::string programName{"Calculator"};  // 함수 끝나면 파괴
    return programName;   // 댕글링 참조!
}
```
안전하게 만들려면 [static 지속 기간](../chapter07ScopeDurationAndLinkage/main.md) 객체를 반환한다.

```cpp
const std::string& getProgramName()
{
    static const std::string s_programName{"Calculator"};
    return s_programName;   // 안전
}
```

**수명 연장은 함수 경계를 넘지 못한다**: 4절의 수명 연장은 "직접 바인딩"에만 적용되는데, 함수를 거쳐서 반환된 임시값은 이미 함수가 끝나는 시점에 파괴 대상이 되어 연장 규칙이 적용되지 않는다.

```cpp
const int& ref2{ returnByConstReference(5) };  // 위험 — 임시가 이미 파괴됨
```

**주소로 반환**: 참조 반환과 비슷하지만 포인터를 반환한다. `nullptr`로 "유효한 객체 없음"을 표현할 수 있다는 게 핵심 이점(예: `findStudent()`가 못 찾으면 `nullptr`). 대신 호출자가 역참조 전 반드시 널 체크를 해야 한다.

**베스트 프랙티스 요약**:
1. non-const static <mark style="background: #ADCCFFA6;">지역 변수를 참조로 반환하지 않는다</mark> — 모든 참조가 같은 객체를 공유해 예측 못 한 수정이 퍼진다.
2. "객체 없음"을 표현할 필요가 없다면 주소 반환보다 참조 반환을 우선한다.
3. 매개변수로 받은 참조를 그대로 반환하는 건 안전하다(그 인자는 호출자 스코프에 살아있으므로).
4. 지역 변수의 참조는 절대 반환하지 않는다 — 최신 컴파일러는 경고를 띄운다.

---

## 13. in/out 매개변수 (12.13)

**in 매개변수**: 호출자로부터 입력만 받는 매개변수. 보통 값 전달이나 const 참조로 받는다.

```cpp
void print(int x);                  // x는 in 매개변수
void print(const std::string& s);   // s도 in 매개변수
```

**out 매개변수**: non-const 참조나 포인터로 받아서, 함수가 그 안에 결과를 덮어써 호출자에게 "돌려주는" 매개변수.

```cpp
void getSinCos(double degrees, double& sinOut, double& cosOut)
{
    double radians = degrees * pi / 180.0;
    sinOut = std::sin(radians);
    cosOut = std::cos(radians);
}
```
관례상 이름 끝에 `Out`을 붙이고 매개변수 목록의 오른쪽에 배치해서 "이건 덮어써진다"는 신호를 준다.

**in-out 매개변수**: 들어온 값을 먼저 쓴 다음 덮어쓰는 매개변수. 문법적으로는 out과 동일하다.

**왜 out 매개변수를 꺼리는가**:
1. **문법이 부자연스럽다**: 호출자가 미리 대입 가능한 객체를 만들어 넘겨야 해서, 표현식 중간에 임시값으로 못 쓴다.
2. **가독성이 떨어진다**: `x = getValue()`는 x가 바뀐다는 게 명백하지만, `getSinCos(degrees, sin, cos)`만 봐서는 `sin`, `cos`가 바뀐다는 걸 호출부에서 짐작하기 어렵다.

주소 전달(`foo3(&i)`)로 바꾸면 `&`가 "이 인자는 변경될 수 있다"는 시각적 신호가 되어 조금 낫지만, 널 처리 부담이 생긴다.

**선호되는 대안**: 값으로 반환한다.

```cpp
Foo someFcn(const Foo& in)
{
    Foo foo{in};
    // foo 수정
    return foo;
}
Foo result = someFcn(original);   // 변경이 명백함
```
추가 복사가 생기지만 현대 컴파일러가 대부분 최적화(RVO)로 없앤다.

---

## 14. auto와 포인터·참조·const의 타입 추론 (12.14)

**top-level const vs low-level const**: 이 구분이 이 절 전체의 열쇠다.
- **top-level const**: 객체 자신에 적용 — `const int x;`, `int* const ptr;`(포인터 자신이 const)
- **low-level const**: 참조·역참조 대상에 적용 — `const int& ref;`, `const int* ptr;`(가리키는 값이 const)

**`auto`는 참조를 떼어낸다**:

```cpp
std::string& getRef();
auto ref{getRef()};    // std::string (참조 아님, 복사됨)
auto& ref2{getRef()};  // std::string& (& 를 다시 붙여야 참조 유지)
```

**참조가 떨어지면 low-level const가 top-level이 되어 함께 사라진다**:

```cpp
const std::string& getConstRef();
auto ref1{getConstRef()};   // std::string (참조도, const도 사라짐)
auto& ref3{getConstRef()};  // const std::string& (참조를 되살리면 low-level const는 유지)
```
**왜 const까지 같이 사라지는가**: 참조를 떼면 `ref1`은 원본과 무관한 **새 복사본**이 된다. 복사본 자체를 const로 만들지 말지는 온전히 이 지역 변수의 새로운 선택이지, 원본이 const였다는 사실과는 무관하다 — 그래서 top-level const는 항상 재적용해야 명시적으로 살아난다.

**포인터는 auto로도 떨어지지 않는다**:

```cpp
std::string* getPtr();
auto ptr1{getPtr()};   // std::string* (포인터 유지)
auto* ptr2{getPtr()};  // std::string* (대안 문법 — 포인터 추론임을 명시)
```

**const + auto + 포인터 조합** — `const std::string* const ptr`에서 추론하면:

```cpp
auto ptr1{ptr};         // const std::string* (top-level const만 탈락)
const auto ptr3{ptr};   // const std::string* const (top-level const 재적용)
const auto* ptr6{ptr};  // const std::string* (low-level const는 원래도 유지되던 것)
const auto* const ptr8{ptr}; // const std::string* const (양쪽 다 명시)
```

**베스트 프랙티스**:
1. const/참조가 필요하면 결과가 같더라도 **항상 명시적으로 재적용**한다 — 의도를 코드에 남기기 위해.
2. 포인터를 추론할 땐 `auto`보다 **`auto*`**를 선호한다 — 포인터 추론임이 분명해지고, 실수로 값 타입을 추론하는 걸 막는다.
3. 포인터-투-const는 `const auto*`, const 포인터는 `auto* const`로 구분해서 쓴다.

---

## 15. std::optional (12.15)

함수가 실패할 수 있을 때, 실패를 표현하는 전통적 방법(**sentinel 값**)은 문제가 있다: 어떤 값이 "실패"를 뜻하는지 함수마다 기억해야 하고, 정수 나눗셈처럼 **모든 값이 유효한 결과일 수 있는 경우**엔 sentinel로 쓸 값이 아예 없다(semipredicate problem).

`std::optional<T>`(C++17)는 "타입 T의 값을 가지거나, 아무것도 안 가지거나" 둘 중 하나를 표현하는 컨테이너다.

```cpp
std::optional<int> o1{5};             // 값 있음
std::optional<int> o2{};              // 비어있음
std::optional<int> o3{std::nullopt};  // 명시적으로 비어있음

if (o1.has_value()) ...   // 명시적 체크
if (o1) ...                // 암묵적 bool 변환

*o1;              // 역참조 (비어있으면 undefined behavior)
o2.value();       // 비어있으면 std::bad_optional_access 예외
o3.value_or(42);  // 비어있으면 42 반환
```

**핵심 예제**:

```cpp
std::optional<int> doIntDivision(int x, int y)
{
    if (y == 0) return {};   // 빈 optional 반환
    return x / y;
}
```

**포인터 기반 optional 반환과의 차이**:

| 항목 | 포인터 | std::optional |
|---|---|---|
| 의미 | 참조(다른 곳을 가리킴) | 값(직접 보유) |
| 반환 동작 | 주소만 복사 | 값을 복사 |
| 안전성 | 댕글링 가능 | 지역 변수를 반환해도 안전 |

**장점**: 함수가 실패할 수 있음을 타입으로 문서화, sentinel 관례를 기억할 필요 없음, 포인터와 비슷한 직관적 문법, 리터럴/rvalue도 인자로 받을 수 있음.

**한계**: 사용 전 값 존재 여부를 반드시 확인해야 하고, **실패 이유**까지는 담지 못하며(C++23 기준 참조 타입은 지원 안 함).

> **베스트 프랙티스**: 실패할 수 있는 함수는 sentinel 값 대신 `std::optional`을 반환하라(단, 실패 이유까지 반환해야 한다면 별도 설계 필요). 선택적 매개변수는 가능하면 [오버로딩](../chapter11FunctionOverloadingAndTemplates/main.md)을 우선하고, `T`가 원래 값 전달 대상일 때만 `std::optional<T>`를 쓰고 아니면 `const T*`를 쓴다.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| lvalue / rvalue | 정체성이 지속되면 lvalue, 임시면 rvalue — 참조·포인터 바인딩 규칙의 기반 |
| lvalue 참조 | 기존 객체의 별명, 재바인딩 불가, 반드시 초기화, 수정 가능한 lvalue에만 바인딩 |
| const lvalue 참조 | modifiable/non-modifiable lvalue + rvalue 전부 바인딩 가능, 직접 바인딩 시 임시 수명 연장 |
| 참조 전달 | 복사 없이 인자와 동일 주소 공유, non-const는 lvalue만 받음 |
| const 참조 전달 | 클래스 타입 기본 전달 방식, 기본 타입은 값 전달이 더 저렴 |
| 포인터 | 주소를 저장하는 객체 자체, 재대입·널 가능, 참조보다 위험함 |
| nullptr | 아무것도 안 가리킴을 명시, `std::nullptr_t`로 오버로드 모호성 차단 |
| 포인터 const 3종 | `const T*`(값 고정) / `T* const`(대상 고정) / `const T* const`(둘 다) |
| 주소 전달 | 포인터 크기만 복사, 참조보다 위험(널 체크 필요)하지만 재지정 가능 |
| 참조 반환 | 함수보다 오래 사는 객체만 반환 가능 — 지역 변수 반환은 댕글링 |
| 주소 반환 | "객체 없음"을 nullptr로 표현 가능, 호출자가 널 체크 책임 |
| out 매개변수 | 비추천 — 호출부에서 변경 의도가 안 보임, 값 반환이 대안 |
| auto 추론 | 참조·top-level const는 탈락, 포인터·low-level const는 유지 |
| std::optional | sentinel 값의 대안, 실패 가능성을 타입으로 문서화 |

### 자주 하는 실수 TOP 5

1. **지역 변수를 참조/포인터로 반환** — 함수가 끝나면 파괴된 객체를 가리키는 댕글링 참조/포인터가 된다. static이나 인자로 받은 참조만 안전하게 반환 가능.
2. **널 포인터 체크 없이 역참조** — `if (!ptr) return;` 습관화. 특히 12.11의 선택적 포인터 매개변수에서 흔하다.
3. **함수 반환값을 const 참조로 받으면서 수명 연장을 기대** — 수명 연장은 직접 바인딩에만 적용되고 함수 경계를 넘지 않는다. `const int& ref{ f(5) };`가 f 내부에서 임시를 만들어 반환하면 위험.
4. **`auto`로 참조를 받으려다 복사본을 만듦** — `auto ref{getRef()};`는 참조가 아니라 복사다. 참조를 유지하려면 `auto&`.
5. **out 매개변수를 값 전달로 선언** — `void getSinCos(double degrees, double sinOut, double cosOut)`처럼 참조/포인터를 빼먹으면 함수 안에서만 바뀌고 호출자에겐 반영되지 않는다.
