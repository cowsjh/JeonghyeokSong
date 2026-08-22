---
title: Chapter 7 — Scope, Duration, and Linkage (스코프, 수명, 링키지)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 7 — Scope, Duration, and Linkage (스코프, 수명, 링키지)

> 출처: [learncpp.com Chapter 7](https://www.learncpp.com/) (7.1 ~ 7.14, 7.x)
> 대상: 기계공학 배경, ROS2 로보틱스 목적의 C++ 입문자
> 이 챕터의 질문 하나: **"이 이름(변수/함수)은 어디서 보이고, 언제까지 살아 있고, 다른 파일과 같은 놈인가?"** — 이 세 가지가 각각 Scope, Duration, Linkage다.

---

## 목차

1. [1. 블록 (Compound Statement)](#1-블록-compound-statement)
2. [2. 사용자 정의 Namespace와 :: 연산자](#2-사용자-정의-namespace와--연산자)
3. [3. 지역 변수 (Local Variable)](#3-지역-변수-local-variable)
4. [4. 전역 변수 (Global Variable) 입문](#4-전역-변수-global-variable-입문)
5. [5. 변수 섀도잉 (Shadowing)](#5-변수-섀도잉-shadowing)
6. [6. Internal Linkage](#6-internal-linkage)
7. [7. External Linkage와 변수 전방 선언](#7-external-linkage와-변수-전방-선언)
8. [8. non-const global variable이 위험한 이유](#8-non-const-global-variable이-위험한-이유)
9. [9. Inline 함수와 Inline 변수](#9-inline-함수와-inline-변수)
10. [10. 여러 파일에서 전역 상수 공유하기](#10-여러-파일에서-전역-상수-공유하기)
11. [11. Static 지역 변수](#11-static-지역-변수)
12. [12. Scope / Duration / Linkage 총정리 표](#12-scope--duration--linkage-총정리-표)
13. [13. using 선언과 using 지시문](#13-using-선언과-using-지시문)
14. [14. 익명 Namespace와 Inline Namespace](#14-익명-namespace와-inline-namespace)

---

## 1. 블록 (Compound Statement)

### 개념 — 왜 필요한가

`if`문은 문법적으로 **문장(statement) 하나**만 실행할 수 있다. 그런데 조건이 참일 때 할 일이 두 개 이상이라면? 여러 문장을 `{ }`로 묶어 **컴파일러가 문장 하나처럼 취급하게** 만드는 것이 블록(block, compound statement)이다.

```cpp
if (value >= 0)
{                                    // 블록 시작 — 이 전체가 "문장 하나"
    std::cout << "positive\n";
    std::cout << value * 2 << '\n';
}                                    // 세미콜론 불필요
```

- 함수 본문도 블록이다.
- 블록은 블록 안에 중첩(nesting)할 수 있다 (함수는 함수 안에 정의 못 하는 것과 대조).
- 빈 블록 `{}`도 유효하다.

### 중첩 깊이 규칙

**중첩 레벨은 3 이하로 유지하라.** 이 규칙이 존재하는 이유: 중첩이 깊어질수록 "지금 어떤 조건들이 동시에 참인 상태인가"를 머리로 추적해야 하는 부담이 기하급수로 늘어난다. 4단 이상 중첩이 필요해지면 안쪽 로직을 **별도 함수로 추출**하는 것이 정답이다.

> 로보틱스 연결: 제어 루프 안에서 "센서 유효 → 목표 수신됨 → 안전 범위 내 → ..." 식으로 조건이 쌓이기 쉽다. `isJointSafe()` 같은 검사 함수로 추출하면 중첩도 줄고 테스트도 가능해진다 (Chapter 6 — Operators 코드문제의 Q12에서 이미 해봤다).

---

## 2. 사용자 정의 Namespace와 :: 연산자

### 왜 존재하는가 — 이름 충돌 (Naming Collision)

두 파일에 각각 `doSomething()`이라는 같은 이름의 함수가 있으면, 각 파일은 문제없이 컴파일되지만 **[링커가 두 정의를 합칠 때](../chapter02FunctionsAndFiles/main.md) 충돌**한다. 프로그램이 커질수록(특히 남의 라이브러리를 쓸수록) 이름 개수가 폭발하므로 충돌 확률도 커진다. Namespace는 이름들을 **서로 다른 영역으로 격리**해서 이 문제를 구조적으로 없앤다. 표준 라이브러리가 전부 `std` 안에 있는 이유가 정확히 이것이다.

### 문법

```cpp
namespace BasicMath
{
    constexpr double pi { 3.14159 };
    int add(int x, int y) { return x + y; }
}

int main()
{
    std::cout << BasicMath::pi << '\n';       // :: — scope resolution operator
    std::cout << BasicMath::add(4, 3) << '\n';
}
```

### :: 연산자의 두 가지 사용법

```cpp
Foo::doSomething();   // ① Foo namespace 안의 것을 지목
::doSomething();      // ② 접두어 없이 — 전역(global) namespace의 것을 지목
```

②는 지역 이름이 전역 이름을 가렸을 때([섹션 5](#5-변수-섀도잉-shadowing)) 전역 쪽을 꺼내는 용도로 쓰인다.

### 이름 탐색 규칙 (반직관 주의)

Namespace 안에서 접두어 없이 이름을 쓰면 컴파일러는 **현재 namespace → 감싸는 namespace → 전역** 순서로 밖을 향해 찾아 나간다. "안에서 밖으로"라는 방향을 기억할 것.

### 여러 블록으로 나눠 정의 가능

같은 이름의 namespace 블록은 여러 파일/여러 위치에 나눠 써도 **전부 하나의 namespace로 합쳐진다**. 표준 라이브러리가 수십 개 헤더에 나뉘어 있어도 전부 `std`인 이유다.

> **경고**: `std` namespace에 내 코드를 추가하는 것은 undefined behavior다. 절대 금지.

### 전방 선언도 namespace 안에

[전방 선언](../chapter02FunctionsAndFiles/main.md)도 정의와 같은 namespace 안에 두어야 한다:

```cpp
// add.h
namespace BasicMath { int add(int x, int y); }   // 선언도 같은 namespace 안에
// add.cpp
namespace BasicMath { int add(int x, int y) { return x + y; } }
```

선언과 정의의 namespace가 어긋나면 **컴파일은 되는데 링커 에러**가 난다 — 링커는 `BasicMath::add`를 찾는데 정의는 전역 `add`로 존재하기 때문.

### 중첩과 별칭 (alias)

```cpp
namespace Foo::Goo { int add(int x, int y) { return x + y; } }  // C++17 문법

namespace Active = Foo::Goo;   // 별칭 — 긴 경로를 짧게
Active::add(1, 2);
```

별칭의 장점: 나중에 `Foo::Goo`가 `Foo::V2`로 바뀌어도 별칭 한 줄만 고치면 된다.

### 실무 지침

- 혼자 쓰는 연습 코드: namespace 없어도 됨
- **배포할 코드: 반드시 namespace로 감싸라** — 최상위 하나면 충분
- 3단 초과 중첩은 사용성이 급격히 나빠짐

> 로보틱스 연결: ROS2도 같은 문제를 같은 방식으로 푼다 — 노드/토픽에 namespace를 붙여 `/robot1/joint_states`, `/robot2/joint_states`처럼 로봇 여러 대의 이름 충돌을 격리한다. C++ namespace와 개념이 정확히 대응된다.

---

## 3. 지역 변수 (Local Variable)

Chapter 2에서 맛봤던 [지역 변수와 스코프](../chapter02FunctionsAndFiles/main.md)를 이제 정식으로 해부한다. 지역 변수의 성질은 세 가지 속성의 조합이며, 이 셋을 분리해서 이해하는 것이 이 챕터 전체의 뼈대다.

| 속성 | 지역 변수의 값 | 의미 |
|---|---|---|
| Scope (어디서 보이나) | Block scope | 정의 지점부터 블록 끝 `}`까지만 보임 |
| Duration (언제까지 사나) | Automatic | 정의 지점에 생성, 블록 끝에서 자동 파괴 |
| Linkage (다른 선언과 같은 놈인가) | None | 같은 이름이라도 선언마다 **별개 객체** |

### Scope vs Duration — 헷갈리기 쉬운 구분

- **Scope**: 코드의 어느 **위치**에서 그 이름을 쓸 수 있는가 (컴파일 타임 개념)
- **Duration**: 프로그램 실행 중 어느 **시점**에 객체가 존재하는가 (런타임 개념)

지역 변수는 둘이 일치해서 구분의 필요를 못 느끼지만, 곧 나올 static 지역 변수([섹션 11](#11-static-지역-변수))는 **scope는 블록인데 duration은 프로그램 전체**라서 이 구분 없이는 이해할 수 없다.

### 중첩 블록에서의 가시성

```cpp
int main()
{
    int x { 5 };
    {                       // 중첩 블록
        int y { 7 };
        std::cout << x + y; // 바깥 x는 안에서 보임 (안→밖 탐색)
    }                       // y 파괴
    // 여기서 y 사용 불가 — 안쪽 것은 밖에서 안 보임
    return 0;
}
```

### 규칙: 가장 좁은 scope에 정의하라

**왜**: 동시에 "살아 있는" 변수 수가 줄어들수록 코드를 읽을 때 추적할 상태가 줄어든다. 단, **scope를 좁히려는 목적만으로 인위적 블록을 만들지는 말 것** — 그 정도로 변수가 많다면 함수 분리가 정답이다.

---

## 4. 전역 변수 (Global Variable) 입문

함수 밖에 선언한 변수는 전역 변수다.

| 속성 | 전역 변수의 값 |
|---|---|
| Scope | Global (file) scope — 선언 지점부터 파일 끝까지 |
| Duration | **Static** — `main()` 시작 전에 생성, 프로그램 종료 시 파괴 |
| Linkage | const 여부에 따라 다름 ([섹션 6](#6-internal-linkage)~[7](#7-external-linkage와-변수-전방-선언)) |

### 반직관 포인트: 전역은 zero-initialization 된다

```cpp
int g_x;         // 자동으로 0 — 지역 변수라면 쓰레기값이었을 것
int g_z { 1 };   // 명시적 초기화 (권장)
```

지역 변수는 초기화 안 하면 쓰레기값인데 전역은 0이 된다. 이유: static duration 객체는 프로그램 시작 시 OS가 메모리를 통째로 0으로 깔고 시작하기 때문. **그래도 명시적으로 초기화하는 습관을 들일 것** — "0이길 의도했다"와 "깜빡했다"를 코드만 보고 구분할 수 있어야 한다.

### 네이밍 규칙 — `g_` 접두어

`g_x`처럼 쓰는 이유 세 가지: ① 전역 namespace 안에서의 이름 충돌 예방, ② 실수로 섀도잉하는 사고 예방, ③ "이 변수는 함수가 끝나도 상태가 유지된다"는 경고 신호. namespace 안에 넣은 전역은 `Foo::x`처럼 이미 출신이 드러나므로 접두어를 생략하기도 한다.

### const 전역은 반드시 초기화

```cpp
const int g_y { 1 };       // OK
constexpr int g_z { 2 };   // OK
const int g_w;             // 컴파일 에러 — const는 정의 시 초기화 필수 (Ch.5)
```

[const](../chapter05ConstantsAndStrings/main.md)가 정의 시 초기화를 강제하는 이유는 Chapter 5에서 다뤘다. non-const global이 왜 위험한지는 [섹션 8](#8-non-const-global-variable이-위험한-이유)에서 본격적으로 다룬다.

---

## 5. 변수 섀도잉 (Shadowing)

중첩 블록에서 바깥과 **같은 이름**의 변수를 선언하면, 안쪽 블록에서는 안쪽 변수가 바깥 것을 **가린다(shadowing, name hiding)**.

```cpp
int main()
{
    int apples { 5 };
    {
        int apples { 0 };   // 바깥 apples를 가림 — 별개의 새 객체
        apples = 10;        // 안쪽 것만 10이 됨
    }
    std::cout << apples;    // 5 — 바깥 것은 무사
    return 0;
}
```

핵심: 두 변수는 **메모리상 완전히 별개**다 (linkage가 none이므로). 안쪽을 아무리 바꿔도 바깥은 그대로 — 이게 버그의 온상이다. "분명히 10을 넣었는데 5가 나온다"는 상황.

### 전역 섀도잉은 복구 수단이 있다

```cpp
int value { 5 };            // 전역

int main()
{
    int value { 7 };        // 전역을 가림
    ++value;                // 지역: 8
    --(::value);            // :: 로 전역 접근: 4
}
```

지역끼리의 섀도잉은 가려진 바깥 변수에 접근할 방법이 **없지만**, 전역은 `::`로 꺼낼 수 있다. 그래도 이런 코드를 써야 하는 상황 자체를 만들지 말 것.

### 예방

- 전역에 `g_` 접두어를 쓰면 지역과 이름이 겹칠 일 자체가 없어진다 — 네이밍 규칙이 문법 기능보다 나은 예방책인 사례
- 컴파일러 경고 활용: GCC/Clang `-Wshadow`, Visual Studio는 기본 활성화

---

## 6. Internal Linkage

여기서부터 세 번째 속성 linkage가 본격 등장한다. **Internal linkage = 그 이름이 자기 번역 단위(translation unit, 대략 ".cpp 파일 하나") 안에서만 보이고, 다른 파일에서는 접근 불가.**

### 만드는 방법

```cpp
static int g_x {};             // non-const global: static 키워드 필요
const int g_y { 1 };           // const 전역: 기본이 internal
constexpr int g_z { 2 };       // constexpr 전역: 기본이 internal

static int add(int x, int y)   // 함수도 static을 붙이면 internal
{ return x + y; }
```

### 반직관 포인트: 왜 const 전역은 기본이 internal인가

const/constexpr는 [컴파일 타임 식](../chapter05ConstantsAndStrings/main.md)에 쓰일 수 있어야 하는데, 그러려면 **각 번역 단위가 그 값을 직접 볼 수 있어야** 한다. 헤더에 넣어 여러 파일에 `#include`해도 각 파일이 "자기만의 복사본"을 갖게 internal로 설계한 것 — 그래야 ODR(One Definition Rule) 위반이 안 된다. internal끼리는 이름이 같아도 **서로 독립된 존재**로 취급되기 때문이다.

### 언제 쓰나

- 다른 파일이 건드리면 안 되는 **파일 내부 헬퍼 함수/상태**를 보호할 때
- 프로그램 전체의 이름 충돌 가능성을 줄일 때

`static` 키워드는 여기서 "internal linkage 부여"라는 뜻인데, [섹션 11의 static 지역 변수](#11-static-지역-변수)에서는 "duration 변경"이라는 **전혀 다른 뜻**으로 쓰인다. 같은 키워드의 재활용이라 혼동 주의. 현대 C++에서는 static 대신 [익명 namespace(섹션 14)](#14-익명-namespace와-inline-namespace)를 선호한다.

---

## 7. External Linkage와 변수 전방 선언

**External linkage = 정의된 파일 밖에서도 (전방 선언을 통해) 접근 가능.** 링커가 "A 파일의 사용처"와 "B 파일의 정의"를 연결해준다.

### 함수는 기본이 external

```cpp
// a.cpp
void sayHi() { std::cout << "Hi!\n"; }

// main.cpp
void sayHi();      // 전방 선언 — "다른 어딘가에 정의가 있다"는 약속
int main() { sayHi(); }   // 링커가 a.cpp의 정의와 연결
```

지금까지 여러 파일 프로젝트에서 [헤더 파일](../chapter02FunctionsAndFiles/main.md)의 함수 선언이 동작했던 원리가 바로 이것이다.

### 변수의 external linkage

```cpp
int g_x { 2 };                  // non-const global: 기본이 external
extern const int g_y { 3 };     // const 전역을 external로 만들려면 extern 필요
```

### 변수 전방 선언 — extern + 초기화 없음

```cpp
// main.cpp
extern int g_x;         // "정의는 딴 데 있음" — 초기화하지 않는 것이 신호
extern const int g_y;
```

### 함정 3가지

1. **`extern int g_x { 1 };`처럼 extern + 초기화를 같이 쓰지 말 것** — 초기화가 있으면 정의, extern만 있으면 선언인데 둘을 섞으면 의도가 모호해진다 (컴파일러 경고).
2. **[constexpr](../chapter05ConstantsAndStrings/main.md)는 전방 선언이 불가능하다.** 컴파일러가 컴파일 타임에 값을 직접 봐야 하는데, "값은 딴 파일에 있음"이라는 선언은 그 목적과 모순이기 때문.
3. `extern`과 `static`은 서로 반대 방향의 linkage 지정자다. 헷갈리면 [섹션 12 표](#12-scope--duration--linkage-총정리-표)를 볼 것.

---

## 8. non-const global variable이 위험한 이유

이 섹션은 문법이 아니라 **설계 원칙**이다. 그리고 로보틱스 코드에서 특히 중요하다.

### 핵심 문제: 예측 불가능성

전역 변수는 **어떤 함수라도 바꿀 수 있다**. 함수 하나를 읽을 때 "이 함수가 어딘가의 전역 상태를 바꾸지 않을까"를 항상 의심해야 한다면:

- **디버깅 지옥**: 값이 언제 어디서 바뀌었는지 찾으려면 코드베이스 전체를 뒤져야 함
- **재사용 불가**: 전역에 의존하는 함수는 그 전역이 있는 프로그램에서만 동작
- **테스트 불가**: 함수 입력이 인자만이 아니라 "보이지 않는 전역 상태"까지 포함되므로

### Static Initialization Order Fiasco

전역 변수들은 `main()` 이전에 초기화되는데, **파일이 다르면 초기화 순서가 보장되지 않는다**. file1.cpp의 전역 A가 file2.cpp의 전역 B 값으로 초기화된다면, B가 아직 초기화 전일 수 있다 — 실행할 때마다 결과가 달라질 수 있는 최악의 버그 유형.

### 그래도 써야 한다면

정당화되는 경우는 "프로그램 전체에 **정확히 하나**만 존재하고 + 어디서나 필요한 것" (로그 파일, 난수 생성기 정도)뿐이다. 그때도:

1. namespace 안에 넣기
2. 직접 노출 대신 **접근 함수(getter/setter)** 로 감싸기 — 나중에 검증 로직 추가나 내부 구현 변경 가능
3. 함수가 전역을 직접 읽게 하지 말고 **인자로 전달**받게 하기 — 테스트 가능성 유지

> 로보틱스 연결: "현재 관절 각도"를 전역 변수로 두고 콜백과 제어 루프가 같이 읽고 쓰는 설계를 흔히 저지른다. ROS2에서는 이것을 **노드 클래스의 멤버 변수**로 두는 것이 정답이다 — scope가 클래스로 제한되고, 어떤 콜백이 접근하는지 클래스 안만 보면 된다. rclcpp 노드 예제에서 subscription·timer가 항상 `sub_`, `timer_` 같은 멤버 변수인 이유다.

---

## 9. Inline 함수와 Inline 변수

### Inline expansion — 원래 의미

함수 호출에는 오버헤드(인자 전달, 점프, 복귀)가 있다. 아주 작은 함수는 호출 비용이 본체 실행 비용보다 클 수 있어서, 컴파일러가 **호출 지점에 함수 본문을 직접 박아넣는** 최적화를 한다:

```cpp
std::cout << min(5, 6);          // 호출 →
std::cout << ((5 < 6) ? 5 : 6);  // 이렇게 치환 (inline expansion)
```

### 반직관 포인트: 현대의 inline 키워드는 최적화와 무관하다

- **과거**: `inline` = "이 함수를 expansion 해달라"는 힌트
- **현재**: 컴파일러가 사람보다 판단을 잘하므로 힌트는 무시됨. 현대의 `inline`은 **"이 정의가 여러 번역 단위에 중복 등장해도 ODR 위반이 아님"** 이라는 뜻

즉 이름과 실제 의미가 완전히 어긋난 키워드다. "헤더에 정의를 넣을 수 있게 해주는 키워드"로 기억할 것.

### 규칙

- 모든 번역 단위의 inline 정의는 **완전히 동일**해야 함 (다르면 undefined behavior) → 그래서 **헤더 파일에 정의**하는 것이 사실상 유일한 안전한 방법. [Chapter 2의 "헤더에 정의를 넣지 말라"](../chapter02FunctionsAndFiles/main.md)는 규칙의 공식 예외가 바로 inline이다
- 링커가 중복 정의들을 하나로 합쳐준다(deduplication)

### Inline 변수 (C++17)

변수에도 같은 원리가 적용된다. 이것이 다음 섹션의 열쇠다.

```cpp
// constants.h
inline constexpr double pi { 3.14159 };   // 여러 파일에 include 되어도 하나로 합쳐짐
```

---

## 10. 여러 파일에서 전역 상수 공유하기

로봇 프로젝트라면 링크 길이, 관절 한계, PI 같은 상수를 모든 파일이 공유해야 한다. 세 가지 방법의 진화 과정:

### 방법 ① — 헤더에 constexpr (internal linkage 이용)

```cpp
// constants.h
namespace constants
{
    constexpr double pi { 3.14159 };
}
```

- 장점: 구식 컴파일러 호환, 컴파일 타임 사용 가능
- 단점: **include하는 파일마다 복사본이 생김** (20개 파일 = 20개 사본), 값 변경 시 전체 재컴파일

### 방법 ② — cpp에 정의 + 헤더에 extern 선언 (external linkage 이용)

```cpp
// constants.h
namespace constants { extern const double pi; }
// constants.cpp
namespace constants { extern const double pi { 3.14159 }; }
```

- 장점: 사본이 하나뿐, 값 변경 시 constants.cpp만 재컴파일
- 단점: **전방 선언은 constexpr가 될 수 없으므로**([섹션 7](#7-external-linkage와-변수-전방-선언)) 다른 파일에서 컴파일 타임 상수로 못 씀 — 배열 크기 지정 등에 사용 불가

### 방법 ③ — inline constexpr (C++17, 권장)

```cpp
// constants.h
namespace constants
{
    inline constexpr double pi { 3.14159 };
    inline constexpr double link1_length { 0.5 };   // 로봇 파라미터도 이렇게
    inline constexpr double joint_limit_deg { 180.0 };
}
```

①의 장점(컴파일 타임 사용)과 ②의 장점(프로그램 전체에 사본 하나)을 **둘 다** 가진다. inline이 "중복 정의 허용 + 링커가 하나로 합침"이므로([섹션 9](#9-inline-함수와-inline-변수)) 헤더에 넣어도 사본이 안 늘어나는 것. **C++17 이상이면 무조건 이 방법을 쓰면 된다.**

---

## 11. Static 지역 변수

지역 변수에 `static`을 붙이면 **duration만 automatic → static으로 바뀐다**. scope는 여전히 블록이다.

```cpp
int generateID()
{
    static int s_itemID { 0 };   // 프로그램 시작~종료까지 생존, 초기화는 최초 1회만
    return s_itemID++;           // 호출할 때마다 0, 1, 2, ... 반환
}
```

| 속성 | 값 | 비고 |
|---|---|---|
| Scope | Block | 함수 밖에서는 접근 불가 |
| Duration | Static | 함수가 끝나도 값 유지 |
| Linkage | None | — |

**"전역 변수의 수명 + 지역 변수의 가시성"** 조합. 전역처럼 상태를 유지하면서도 노출 범위는 함수 하나로 제한되므로, [섹션 8의 위험](#8-non-const-global-variable이-위험한-이유)을 대부분 피한다. 네이밍은 `s_` 접두어.

### 초기화 규칙 (반직관 주의)

- constexpr 초기화값 → 프로그램 시작 시 초기화
- 그 외 → 시작 시 0으로 깔린 뒤, **함수가 최초 호출될 때** 초기화 코드가 딱 한 번 실행. 이후 호출에서는 초기화 줄이 **통째로 건너뛰어진다** — `static int s_x { 0 };`이 매번 0으로 리셋하는 게 아니다. 이 착각이 제일 흔한 오해.

### 사용 지침

- **좋은 용도**: ID 생성기, 비용 큰 초기화의 1회 캐싱(const static)
- **나쁜 용도**: 프로그램 흐름을 바꾸는 상태 저장 — "같은 인자로 불렀는데 지난번엔 됐고 이번엔 안 됨" 류의 숨은 상태 버그를 만든다. 그런 상태는 인자나 클래스 멤버로 명시화할 것.

---

## 12. Scope / Duration / Linkage 총정리 표

이 챕터 전체가 이 표 하나로 압축된다. 헷갈릴 때마다 돌아올 것.

| 종류 | 예시 | Scope | Duration | Linkage |
|---|---|---|---|---|
| 지역 변수 | `int x;` | Block | Automatic | None |
| Static 지역 변수 | `static int s_x;` | Block | Static | None |
| 함수 매개변수 | `void foo(int x)` | Block | Automatic | None |
| Internal non-const global | `static int g_x;` | Global | Static | **Internal** |
| External non-const global | `int g_x;` | Global | Static | **External** |
| Internal 상수 전역 | `constexpr int g_x{1};` | Global | Static | **Internal** |
| External 상수 전역 | `extern const int g_x{1};` | Global | Static | **External** |
| Inline 상수 전역 (C++17) | `inline constexpr int g_x{1};` | Global | Static | **External** |

### 전방 선언 정리

| 종류 | 예시 | 비고 |
|---|---|---|
| 함수 | `void foo(int x);` | 본문 없음 |
| non-const 변수 | `extern int g_x;` | 초기화 금지 |
| const 변수 | `extern const int g_x;` | 초기화 금지 |
| constexpr 변수 | — | **불가능** ([섹션 7](#7-external-linkage와-변수-전방-선언)) |

### 저장 지정자(storage class specifier) 요약

| 지정자 | 의미 |
|---|---|
| `extern` | static duration + external linkage |
| `static` | (전역에서) internal linkage / (지역에서) static duration — **위치에 따라 뜻이 다름** |
| `thread_local` | 스레드별 저장 (추후 다룸) |
| `mutable` | const 클래스 안에서 수정 허용 (추후 다룸) |

---

## 13. using 선언과 using 지시문

### Qualified vs Unqualified

- Qualified name: `std::cout` — scope가 명시됨
- Unqualified name: `cout` — 명시 안 됨

### using 선언 (using declaration) — 조건부 허용

```cpp
using std::cout;    // "이 scope에서 cout은 std::cout이다" — 이름 하나씩
cout << "hi\n";
```

.cpp 파일 안, 좁은 scope에서 쓰는 것은 허용되는 편.

### using 지시문 (using directive) — 사실상 금지

```cpp
using namespace std;   // std의 수백 개 이름이 전부 unqualified로 쏟아짐
```

**왜 나쁜가** — [Chapter 2에서 예고했던 이유](../chapter02FunctionsAndFiles/main.md)를 구체적 시나리오로:

1. **충돌**: 내가 `cout`이라는 함수를 만들었다면 `using namespace std;` 순간 컴파일러가 어느 cout인지 결정 불가
2. **조용한 동작 변경**: 라이브러리 업데이트로 내 호출에 "더 잘 맞는" 오버로드가 std에 새로 생기면, **컴파일 에러 없이** 호출 대상이 바뀔 수 있다. 에러라도 나면 다행인데 조용히 바뀌는 것이 최악

### 절대 규칙

**헤더 파일에 using 문을 쓰지 말 것.** 그 헤더를 include하는 모든 파일에 강제로 퍼지고, include 순서에 따라 동작이 달라지는 시한폭탄이 된다.

### 예외 — `std::literals`

```cpp
using namespace std::chrono_literals;   // 이것만은 관용적으로 허용
timer_ = create_wall_timer(1ms, ...);   // 1ms 리터럴이 바로 이것
```

> 로보틱스 연결: rclcpp 노드에서 `create_wall_timer(1ms, ...)`처럼 쓰는 `1ms`가 바로 chrono literal이다. rclcpp 예제 코드에 `using namespace std::chrono_literals;`가 거의 항상 등장하는 이유 — using 지시문의 유일한 표준 예외 관용구다.

---

## 14. 익명 Namespace와 Inline Namespace

### 익명(unnamed) namespace — internal linkage의 현대적 방법

```cpp
namespace   // 이름 없음
{
    void helper() { /* ... */ }    // 이 파일 안에서만 보임
    int localState {};
}

int main() { helper(); }   // 같은 파일에서는 접두어 없이 접근
```

효과: 안의 모든 식별자가 **internal linkage를 가진 것처럼** 동작한다. `static`을 하나하나 붙이는 것과 같지만:

- 여러 개를 한 블록에 묶을 수 있고
- `static`을 붙일 수 없는 **사용자 정의 타입(struct/class)** 에도 적용된다는 점에서 우월

**규칙**: 헤더 파일에는 쓰지 말 것 (include하는 파일마다 별개 사본이 생겨 혼란). "이 .cpp의 내부 구현"을 묶는 용도로만.

### inline namespace — 버전 관리용

```cpp
namespace V1 { void doSomething() { /* 구버전 */ } }
inline namespace V2 { void doSomething() { /* 신버전 */ } }

doSomething();       // V2가 호출됨 — inline이 "기본 버전" 지정
V1::doSomething();   // 구버전을 명시적으로 호출
```

익명 namespace와 달리 **linkage에는 영향 없음**. "접두어 없이 부르면 이 버전"을 지정하는 도구다. 라이브러리가 하위 호환을 유지하며 기본 동작을 교체할 때 쓴다. 입문 단계에서는 "읽을 줄 알면 충분"한 기능.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| Scope | 이름이 **어디서** 보이는가 — Block / Global |
| Duration | 객체가 **언제까지** 존재하는가 — Automatic / Static / Dynamic |
| Linkage | 다른 선언과 **같은 객체인가** — None / Internal / External |
| 블록 중첩 | 3단 이하로; 깊어지면 함수 추출 |
| Namespace | 이름 충돌 방지가 목적; 배포 코드는 필수; `std` 수정 금지 |
| 섀도잉 | 안쪽 이름이 바깥을 가림; 별개 객체; `-Wshadow`로 감지 |
| const 전역 | 기본 internal linkage (컴파일 타임 사용을 위한 설계) |
| extern | 변수 전방 선언(초기화 없음) 또는 const 전역의 external화 |
| constexpr | 전방 선언 불가 — 값이 보여야 하므로 |
| non-const global | 원칙적으로 금지; 필요 시 namespace + 접근 함수 + 인자 전달 |
| inline (현대) | "중복 정의 허용" 표시 — 최적화 힌트 아님 |
| 전역 상수 공유 | **`inline constexpr` in header** (C++17) 가 정답 |
| static 지역 변수 | Block scope + Static duration; 초기화는 최초 1회만 |
| using namespace | 금지 (단 `std::literals`는 예외 — `1ms` 등) |
| 익명 namespace | 파일 내부 전용(internal); static보다 우선 권장 |

### 자주 하는 실수 TOP 5

1. **`static int s_x { 0 };`이 매 호출마다 0으로 리셋된다고 착각** — 초기화는 최초 1회만, 이후 호출에서는 그 줄이 건너뛰어진다
2. **섀도잉 버그**: 중첩 블록에서 같은 이름을 재선언해놓고 바깥 변수가 안 바뀐다고 헤맴 — 별개 객체다
3. **헤더에 `using namespace std;`** — include하는 모든 파일에 전염되는 최악의 습관
4. **constexpr 전역을 extern으로 전방 선언 시도** — 불가능; 공유하려면 `inline constexpr`로 헤더에 정의
5. **`static`의 두 가지 의미 혼동** — 전역에 붙이면 internal linkage, 지역에 붙이면 static duration; 위치가 뜻을 결정한다
