---
title: Chapter 8 — Control Flow (제어 흐름)
date: 2026-08-08
tags: cpp
order: 
featured: false
draft: false
series: Learn C++
---

# Chapter 8 — Control Flow (제어 흐름)

> 출처: [learncpp.com Chapter 8](https://www.learncpp.com/) (8.1 ~ 8.15, 8.x)
> 대상: 기계공학 배경, ROS2 로보틱스 목적의 C++ 입문자
> 이 챕터의 질문 하나: **"CPU가 다음에 실행할 문장을 어떻게 내가 정하는가?"** — 조건(if/switch), 반복(while/for), 점프(break/continue/goto), 종료(halt)가 그 도구이고, 마지막에 이 모두를 쓰는 응용으로 난수 생성이 나온다.

---

## 목차

1. [1. 제어 흐름 개요 (Control Flow Introduction)](#1-제어-흐름-개요-control-flow-introduction)
2. [2. if문과 블록](#2-if문과-블록)
3. [3. if문의 흔한 문제 3가지](#3-if문의-흔한-문제-3가지)
4. [4. constexpr if문 (C++17)](#4-constexpr-if문-c17)
5. [5. switch문 기본](#5-switch문-기본)
6. [6. switch의 Fallthrough와 스코프](#6-switch의-fallthrough와-스코프)
7. [7. goto문 — 알고만 있을 것](#7-goto문--알고만-있을-것)
8. [8. 루프 입문과 while문](#8-루프-입문과-while문)
9. [9. do-while문](#9-do-while문)
10. [10. for문](#10-for문)
11. [11. break와 continue](#11-break와-continue)
12. [12. 할트 (Halts) — 프로그램 조기 종료](#12-할트-halts--프로그램-조기-종료)
13. [13. 난수 생성 입문 — 알고리즘과 상태](#13-난수-생성-입문--알고리즘과-상태)
14. [14. Mersenne Twister로 난수 생성하기](#14-mersenne-twister로-난수-생성하기)
15. [15. 전역 난수 — Random.h](#15-전역-난수--randomh)

---

## 1. 제어 흐름 개요 (Control Flow Introduction)

### 개념 — 실행 경로 (Execution Path)

CPU가 실제로 실행하는 문장들의 순서를 <mark style="background: #FFB86CA6;">**실행 경로**</mark>라 한다. 기본값은 `main()` 위에서 아래로 순차 실행 — 매번 같은 경로를 도는 프로그램을 <mark style="background: #ADCCFFA6;">**straight-line program**</mark>이라 하는데, 이런 프로그램은 조건이나 입력에 반응할 수 없다. **제어 흐름 문(control flow statement)** 은 이 순차 경로를 프로그래머가 바꾸는 도구이며, <mark style="background: #ADCCFFA6;">경로가 비순차 위치로 튀는 것을 **분기(branching)** 라 한다.</mark>

### 제어 흐름 문의 6가지 범주

| 범주 | 목적 | C++ 구현 |
|---|---|---|
| 조건문 | 조건이 참일 때만 실행 | `if`, `else`, `switch` |
| 점프 | 다른 위치의 코드로 이동 | `goto`, `break`, `continue` |
| 함수 호출 | 다른 위치로 갔다가 돌아옴 | 함수 호출, `return` |
| 루프 | 조건을 만족할 동안 반복 | `while`, `do-while`, `for`, ranged-`for` |
| 할트 | 프로그램 종료 | `std::exit()`, `std::abort()` |
| 예외 | 에러 처리 전용 흐름 | `try`, `throw`, `catch` (추후 다룸) |

> 로보틱스 연결: 로봇 제어 코드는 사실상 제어 흐름 그 자체다 — "센서 읽기 → 상태 판단(조건) → 명령 계산 → 반복(루프)"이 제어 루프의 뼈대. 이 챕터가 끝나면 제어 루프의 문법 재료가 전부 갖춰진다.

---

## 2. if문과 블록

if문 자체는 Ch.6까지 계속 써왔다. 이 섹션의 핵심은 문법이 아니라 **"단일 문장이어도 블록을 써라"는 규칙이 왜 존재하는가**다.

### 왜 블록을 쓰는가 — 세 가지 사고 예방

**① 나중에 문장 추가 사고.** 급하게 한 줄을 추가하면 들여쓰기 때문에 조건부로 보이지만 실제로는 무조건 실행된다:

```cpp
if (x >= minHeight)
    std::cout << "Tall enough.\n";
else
    std::cout << "Too short.\n";
    std::cout << "Too bad!\n";   // 들여쓰기와 무관 — 항상 실행됨!
```

컴파일러는 들여쓰기를 완전히 무시한다. else에 붙은 문장은 첫 번째 하나뿐이다.

**② 디버깅 중 주석 처리 사고.** 블록 없이 단일 문장을 주석 처리하면, 그 **다음 줄**이 조건문에 붙어버린다.

**③ 일관성.** [constexpr if](#4-constexpr-if문-c17)는 사실상 블록이 필수라서, 처음부터 블록 습관을 들이면 스타일이 통일된다.

### 절충안

한 줄짜리는 조건과 같은 줄에 쓰는 스타일도 허용된다: `if (age >= 21) purchaseBeer();` — 세로 공간을 아끼면서 "문장 하나"임이 시각적으로 명확하다.

### if-else vs if-if

- **if-else 체인**: 참인 첫 조건 **하나만** 실행되어야 할 때
- **독립 if 나열**: 참인 조건 **모두** 실행되어야 할 때
- 각 분기가 전부 `return`으로 끝나면 if만 나열해도 된다 — 먼저 return되면 뒤는 어차피 평가 안 되므로

---

## 3. if문의 흔한 문제 3가지

### ① Dangling else — else는 가장 가까운 if에 붙는다

```cpp
if (x >= 0)
    if (x <= 20)
        std::cout << "between 0 and 20\n";
else                            // 들여쓰기상 바깥 if 같지만...
    std::cout << "negative\n";  // 실제로는 안쪽 if의 else!
```

`x = 21`을 넣으면 "negative"가 출력된다 — else가 **가장 가까운 짝 없는 if**(안쪽)에 붙기 때문. 들여쓰기는 컴파일러에게 아무 의미가 없다는 점이 여기서 또 문제를 만든다. 해결: **중첩 if의 안쪽을 블록으로 감싸거나**, 애초에 else-if 체인이나 논리 연산자로 평탄화한다. [중첩 3단 이하 규칙](../chapter07ScopeDurationAndLinkage/main.md)과 같은 정신이다.

### ② Null statement — 세미콜론 하나가 문장이다

`;` 하나는 "아무것도 안 하는 문장(null statement)"으로 유효한 문법이다. 그래서 이 코드는 컴파일이 잘 된다:

```cpp
if (nuclearCodesActivated());   // ← 이 세미콜론이 if의 본문 (null statement)
    blowUpTheWorld();           // if와 무관 — 무조건 실행!
```

습관적으로 줄 끝에 `;`를 붙이다가 생기는 사고. 컴파일 에러가 안 나므로 발견이 어렵다.

### ③ `=` vs `==` — 조건 안의 대입

```cpp
if (x = 0)      // 비교가 아니라 대입 — x는 0이 되고, 0은 false
    std::cout << "You entered 0\n";   // 절대 실행 안 됨
else
    std::cout << "You entered 1\n";   // 항상 실행
```

`x = 0`은 대입식이고 그 값(0)이 조건으로 쓰인다 — 항상 false. 반대로 `x = 5`였다면 항상 true. 컴파일러 경고를 켜두면 대부분 잡아준다.

---

## 4. constexpr if문 (C++17)

### 왜 존재하는가

조건이 [상수 표현식](../chapter05ConstantsAndStrings/main.md)이면 결과는 절대 변하지 않는데, 일반 if는 ① 그 조건을 **런타임에 매번 평가**하고 ② 절대 실행될 리 없는 반대쪽 분기까지 **실행 파일에 포함**시킨다. 둘 다 낭비다.

```cpp
constexpr double gravity { 9.8 };

if constexpr (gravity == 9.8)        // 컴파일 타임에 평가
    std::cout << "Gravity is normal.\n";
else
    std::cout << "We are not on Earth.\n";   // 기계어에서 통째로 제거됨
```

`if constexpr`은 컴파일러가 조건을 **컴파일 중에** 판정하고, 죽은 분기를 결과물에서 완전히 제거한다.

### 규칙

**조건이 상수 표현식이면 `if constexpr`을 써라.** 이유: 최적화 옵션이 꺼져 있어도 컴파일 타임 평가가 **보장**되고, "상수 조건" 컴파일러 경고도 사라진다. 일반 if + 상수 조건은 컴파일러가 알아서 최적화해줄 수도 있지만 보장이 아니다.

---

## 5. switch문 기본

### 왜 존재하는가 — if-else 체인의 약점

하나의 변수를 여러 값과 **동등 비교**하는 if-else 체인은 ① 같은 변수를 반복해서 평가하고 ② "전부 같은 변수를 검사 중"이라는 의도가 코드에 드러나지 않는다. switch는 식을 **한 번만 평가**하고 값에 따라 점프한다.

```cpp
switch (mode)           // 식을 한 번만 평가
{
case 0:
    std::cout << "IDLE\n";
    break;
case 1:
    std::cout << "MANUAL\n";
    break;
default:                // 어느 case에도 안 걸리면
    std::cout << "UNKNOWN\n";
    break;
}
```

### 반직관 포인트: 왜 정수/열거형만 되는가

switch의 조건은 **정수형(int, char 등)과 열거형만** 허용된다 — 부동소수점, 문자열 불가. 이유: 컴파일러가 switch를 **jump table**(값을 배열 인덱스처럼 써서 목적지로 직행)로 최적화하는 전통 때문이다. 배열 인덱스가 될 수 있는 타입만 이 최적화가 가능하다. 부동소수점은 어차피 `==` 비교 자체가 위험하므로 배제가 자연스럽다. 열거형이 허용되는 이유도 같다 — 열거자(enumerator) 하나하나가 결국 컴파일 타임에 정해지는 정수값이라 int와 동일하게 jump table을 만들 수 있다.

> [!NOTE]
> **열거형(enum)과 switch 예시**
> ```cpp
> #include <iostream>
>
> enum class Season
> {
>     Spring,
>     Summer,
>     Fall,
>     Winter
> };
>
> int main()
> {
>     Season s = Season::Summer;
>
>     switch (s)
>     {
>         case Season::Spring: std::cout << "봄\n"; break;
>         case Season::Summer: std::cout << "여름\n"; break;
>         case Season::Fall:   std::cout << "가을\n"; break;
>         case Season::Winter: std::cout << "겨울\n"; break;
>     }
>
>     return 0;
> }
> ```
> 출력: `여름`

### 규칙들

- 모든 case 값은 **유일한 상수**여야 한다 (중복 불가)
- `default`는 관례상 마지막에, 선택 사항
- **각 case는 `break` 또는 `return`으로 끝내라** — 이유는 [다음 섹션](#6-switch의-fallthrough와-스코프)
- `break`는 switch 블록만 탈출, `return`은 함수 전체 탈출
- <mark style="background: #ADCCFFA6;">case 라벨은 들여쓰지 않는 관례</mark> — 라벨은 스코프를 만들지 않기 때문
- **switch를 쓸 때**: 변수 하나 vs 적은 수의 값들 동등 비교. **if-else를 쓸 때**: 대소 비교·범위·복합 조건·비정수 타입

> 로보틱스 연결: 로봇 상태 머신(IDLE/MANUAL/AUTO/ESTOP...)이 switch의 대표 사용처다. Ch.13에서 배울 enum과 switch를 결합하면 "정의 안 한 상태가 들어오면 default에서 에러 처리"라는 안전한 패턴이 된다.

---

## 6. switch의 Fallthrough와 스코프

### Fallthrough — break를 빼먹으면 생기는 일

case에 매칭되면 실행이 그 지점에서 **시작**될 뿐, 다음 case 라벨을 만나도 **멈추지 않는다**. 라벨은 "입구"이지 "벽"이 아니기 때문이다. `break`/`return` 없이 다음 case로 흘러 내려가는 것을 **fallthrough**라 한다: (값의 위치로 점프해 그 아래로 지나간다.)

```cpp
switch (2)
{
case 1:
    std::cout << 1 << '\n';
case 2:
    std::cout << 2 << '\n';   // 여기서 시작해서
case 3:
    std::cout << 3 << '\n';   // 여기도,
case 4:
    std::cout << 4 << '\n';   // 여기도 실행 — 2 3 4 전부 출력
}
```

### 의도적 fallthrough — `[[fallthrough]]` (C++17)

드물게 fallthrough가 의도인 경우, 컴파일러 경고를 잠재우고 "실수 아님"을 문서화하는 <mark style="background: #ADCCFFA6;">attribute</mark>를 쓴다:

```cpp
case 2:
    doSomething();
    [[fallthrough]];   // 의도적 — null statement에 붙는 attribute
case 3:
    doMore();
    break;
```

### 연속 case 라벨 — fallthrough가 아니다

```cpp
case 'a':
case 'e':
case 'i':
case 'o':
case 'u':
    return true;   // 모음이면 전부 여기로 — 라벨을 겹쳐 세운 것
```

라벨 사이에 문장이 없으므로 fallthrough로 치지 않는다 — `[[fallthrough]]` 불필요.

### 반직관 포인트: case 안에서 변수 초기화 금지

switch 전체가 **하나의 스코프**다 (case마다 암묵적 블록이 생기지 않음). 그래서:

- 변수 **선언**은 case 안에서 가능하고, 뒤쪽 case에서도 그 변수가 보인다
- 그러나 마지막 case가 아닌 곳에서의 **초기화는 컴파일 에러**

이유: switch가 초기화 문장을 **뛰어넘어** 뒤쪽 case로 점프할 수 있는데, 그러면 "선언은 됐지만 초기화는 안 된" 변수를 쓰게 된다 — undefined behavior의 문. 해결책은 명시적 블록:

```cpp
case 1:
{                       // 명시적 블록 — 스코프를 직접 만든다
    int x { 4 };        // 이제 초기화 OK
    std::cout << x;
    break;
}
```

---

## 7. goto문 — 알고만 있을 것

### 문법

```cpp
tryAgain:                  // statement label — 함수 스코프
    std::cin >> x;
if (x < 0)
    goto tryAgain;         // 뒤로 점프 — 무조건 이동
```

라벨은 **함수 스코프**를 가진다 (선언 전에도 보임 — 전방 선언 불필요). 앞으로도 뒤로도 점프 가능하다.

### 제약 2가지

1. **함수 사이를 점프할 수 없다**
2. **앞으로 점프할 때 변수 초기화를 건너뛸 수 없다** — 목적지에서 그 변수가 아직 스코프에 있다면 컴파일 에러. [switch의 초기화 금지](#6-switch의-fallthrough와-스코프)와 정확히 같은 이유다 (초기화 안 된 변수 사용 방지). 뒤로 점프는 허용 — 다시 내려오면서 재초기화되므로

### 왜 쓰지 말라는가

goto가 많은 코드는 실행 경로가 실타래처럼 얽힌 **스파게티 코드**가 된다. Dijkstra의 유명한 논지: 코드 품질은 goto 밀도에 반비례한다. 유일하게 용인되는 경우 — **중첩 루프 전체를 한 번에 탈출**할 때 (`break`는 한 겹만 벗기므로). 그 외에는 루프/함수로 항상 대체 가능하다.

---

## 8. 루프 입문과 while문

### 문법과 동작

```cpp
while (condition)
    statement;
```

조건 평가 → 참이면 본문 실행 → 다시 조건 평가 → ... 조건이 처음부터 거짓이면 **한 번도 실행 안 됨**.

### 의도적 무한 루프 — `while (true)`

탈출 수단은 `return`, `break`, `std::exit()`, 예외뿐. 요청을 계속 처리하는 서버류 프로그램의 표준 패턴이다.

> 로보틱스 연결: 로봇 제어 루프가 정확히 이 패턴이다 — `while (rclcpp::ok())`로 도는 ROS2 노드의 spin 루프. "무한 루프 + 명시적 종료 조건"은 버그가 아니라 설계다.

### 실수: 조건 뒤의 세미콜론

```cpp
while (count <= 10);   // null statement가 본문 — count가 안 변해서 무한 루프
{
    std::cout << count;
    ++count;
}
```

[if의 null statement 사고](#3-if문의-흔한-문제-3가지)와 동일 패턴 — 루프에서는 무한 루프라는 더 화려한 증상으로 나타난다.

### 반직관 포인트: unsigned 루프 변수의 함정

```cpp
unsigned int count { 5 };
while (count >= 0)    // unsigned는 음수가 될 수 없다 — 항상 참!
{
    std::cout << count << ' ';
    --count;          // 0에서 --하면 4294967295로 랩어라운드
}
```

`count`가 0일 때 `0 >= 0`은 참, `--count`는 **4294967295로 되돌아간다**. 조건이 영원히 참인 무한 루프. **루프 변수는 signed 정수형을 써라** — Ch.4에서 배운 unsigned 랩어라운드가 실전에서 무는 대표 지점이다.

### 기타 규칙

- 루프 변수 이름: `i`, `j`, `k`가 관례지만 검색이 안 되는 이름이다 — `count`, `index`처럼 서술적 이름 권장
- N번마다 한 번 실행: `if (count % 10 == 0)` — 나머지 연산자 활용
- 중첩 루프: 바깥 1회전마다 안쪽이 완주한다. 안쪽 변수는 안쪽에 선언해 매회 재초기화되게 할 것

---

## 9. do-while문

### 문법 — "일단 한 번 실행, 조건은 나중에"

```cpp
int selection {};
do
{
    std::cout << "1) Addition\n2) Subtraction\n...\n";
    std::cin >> selection;
}
while (selection < 1 || selection > 4);   // 끝의 세미콜론 주의
```

본문을 먼저 실행하고 조건을 검사하므로 **최소 1회 실행이 보장**된다. 대표 용례가 위의 메뉴 — "일단 보여주고, 입력이 무효면 다시".

주의: `selection`은 조건에서 써야 하므로 루프 **밖**에 선언해야 한다 — ["가장 좁은 스코프" 규칙](../chapter07ScopeDurationAndLinkage/main.md)이 문법 제약으로 한발 물러나는 경우.

### 규칙: 그래도 while을 우선하라

같은 일을 둘 다 할 수 있다면 while을 써라. 이유: 조건이 루프 **끝**에 있으면 "이 루프가 언제 도는가"를 알기 위해 본문을 다 읽고 내려가야 한다 — 조건이 위에 보이는 while이 읽기 비용이 낮다.

---

## 10. for문

### 문법 — while의 3요소를 한 줄에

```cpp
for (int i { 0 }; i < 10; ++i)   // 초기화; 조건; 끝-식
    std::cout << i << ' ';
```

실행 순서: **① 초기화(1회) → ② 조건 검사 → ③ 본문 → ④ 끝-식 → ②로 복귀**. ④가 본문 **뒤**라는 것이 continue와 얽힐 때 중요해진다 ([섹션 11](#11-break와-continue)).

루프 변수는 **루프 스코프** — for문이 끝나면 파괴된다. 루프 안에서만 쓰는 변수는 루프 안에(init-statement에) 선언하라. "변수 생성 비용" 걱정은 근거 없다 — 오히려 컴파일러 최적화에 유리하다.

### Off-by-one 에러

한 번 더 돌거나 덜 도는 에러. `i < 5`(0~4, 5회)와 `i <= 5`(0~5, 6회)의 선택을 매번 의식할 것. **`!=` 대신 `<`/`<=`를 써라** — 카운터가 목표값을 건너뛰는 사고가 나도 `<`는 루프가 끝나지만 `!=`는 무한 루프가 된다 (한 단계 방어).

### 생략과 다중 카운터

```cpp
for (;;)   // 전부 생략 = 무한 루프 — 다만 while (true)가 관례
```

```cpp
for (int x { 0 }, y { 9 }; x < 10; ++x, --y)   // 다중 카운터
```

콤마 연산자가 용인되는 몇 안 되는 자리다.

### 규칙: for vs while 선택

**명백한 루프 변수가 있으면 for, 없으면 while.** for는 루프 변수의 생성·검사·갱신이 한 줄에 모여 있어 "루프 관리 코드"와 "하는 일"이 분리되기 때문이다.

> 로보틱스 연결: 관절 배열 순회(`for`), 수렴할 때까지 반복하는 IK 솔버(`while`) — 두 패턴의 구분 기준이 그대로 적용된다.

---

## 11. break와 continue

### break — 루프/switch 한 겹 탈출

```cpp
while (true)
{
    std::cin >> num;
    if (num == 0)
        break;        // 루프 탈출 — 실행은 루프 다음 문장으로
    sum += num;
}
// break 후 여기로
```

- switch에서: fallthrough 방지 / 루프에서: 조기 탈출
- **break vs return**: break는 루프/switch만 벗어남, return은 **함수 전체** 종료

### continue — 이번 회차만 건너뛰기

현재 회차의 남은 본문을 건너뛰고 루프 끝으로 점프한다 (루프 탈출 아님).

### 반직관 포인트: while + continue의 무한 루프

```cpp
int count { 0 };
while (count < 10)
{
    if (count == 5)
        continue;    // ++count를 건너뜀 — count가 5에서 영원히 고정!
    std::cout << count;
    ++count;
}
```

while에서는 증가문이 본문 안에 있어서 continue가 증가문까지 건너뛸 수 있다. **for문은 안전하다** — 끝-식(`++count`)이 continue의 착지점 **뒤에서** 항상 실행되기 때문 ([for의 실행 순서 ④](#10-for문)). continue를 쓰려면 for가 구조적으로 유리한 이유.

### 규칙: 써도 되는가?

**루프 로직을 단순하게 만들면 써라.** break/continue로 중첩 블록을 줄이고 플래그 변수를 없앨 수 있다면 그쪽이 더 읽기 좋다. early return(함수 초반의 조기 반환)도 같은 논리 — 중첩된 조건보다 "아니면 바로 나가기"가 명확하다. 남용해서 탈출 지점이 사방에 흩어지면 역효과.

---

## 12. 할트 (Halts) — 프로그램 조기 종료

### std::exit() — 정상 종료

`main()`이 return할 때 암묵적으로 호출되는 함수. <mark style="background: #ADCCFFA6;">`<cstdlib>`을 include</mark>하면 직접 호출해 조기 종료할 수 있다 — 상태 코드를 OS에 반환하고, static 객체 파괴와 파일 정리를 수행한다.

### 반직관 포인트: 지역 변수는 정리되지 않는다

**`std::exit()`는 현재 함수와 콜 스택의 지역 변수를 소멸시키지 않는다.** 소멸자(destructor, Ch.14 이후)로 자원을 정리하는 C++ 프로그램에서 이것은 자원 누수를 뜻한다 — 파일이 저장 안 된 채 닫히거나, 하드웨어 연결이 정리 안 될 수 있다.

### 나머지 셋

| 함수 | 역할 |
|---|---|
| `std::atexit(fn)` | 종료 시 자동 실행할 정리 함수 등록 — 여러 개 등록하면 역순 실행 |
| `std::abort()` | **비정상** 종료 — 정리를 일절 하지 않음 (atexit 핸들러도 무시) |
| `std::terminate()` | 처리 안 된 예외 발생 시 암묵 호출 — 기본 동작은 abort 호출 |

### 규칙

**main에서 정상적으로 return할 방법이 없을 때만 할트를 써라.** 에러 상황은 (추후 배울) 예외가 지역 변수 정리를 보장하므로 더 안전하다.

> 로보틱스 연결: 모터가 도는 중에 `std::abort()`류로 죽는 프로그램은 로봇을 위험 상태로 방치한다. 로봇 소프트웨어에서 "정리 없는 종료"가 특히 금기인 이유 — ROS2의 shutdown 훅이 정리 기회를 보장하는 구조인 것과 대비해 기억할 것.

---

## 13. 난수 생성 입문 — 알고리즘과 상태

### 상태(state)라는 관점

- **Stateful 알고리즘**: 호출 사이에 정보를 유지 ([static 지역 변수](../chapter07ScopeDurationAndLinkage/main.md)가 바로 그 도구)
- **Stateless 알고리즘**: 기억 없음 — 필요한 것을 매번 인자로 받음
- **결정론적(deterministic)**: 같은 입력이면 항상 같은 출력 순서

### PRNG — 컴퓨터는 진짜 난수를 못 만든다

컴퓨터는 결정론적 기계라서 소프트웨어만으로는 진짜 난수가 불가능하다. 대신 **의사 난수 생성기(PRNG)** 가 내부 상태에 수학 연산을 반복해 "난수처럼 보이는" 수열을 만든다:

```cpp
unsigned int g_state {};

void seedPRNG(unsigned int seed) { g_state = seed; }   // 초기 상태 = seed

unsigned int LCG16()
{
    g_state = 8253729 * g_state + 2396403;   // 상태를 굴리고
    return g_state % 32768;                   // 상태에서 출력을 뽑는다
}
```

### 핵심: 시드(seed)가 모든 것을 결정한다

PRNG의 초기 상태를 정하는 값이 **시드**다. 모든 출력이 시드로부터 결정론적으로 계산되므로 — **같은 시드 = 완전히 같은 수열**. 이것은 버그가 아니라 기능이다: 디버깅 시 고정 시드를 쓰면 "랜덤 버그"를 매번 똑같이 재현할 수 있다.

**Underseeding**: 시드가 내부 상태 크기보다 부족하면 실행마다 비슷한 수열, 예측 가능한 패턴 등 품질이 떨어진다 — [다음 섹션](#14-mersenne-twister로-난수-생성하기)에서 해결법.

### 좋은 PRNG의 조건

균등한 분포, 예측 불가능성, 전 범위 커버, 긴 주기(반복까지의 길이), 효율. C++ `<random>`에는 PRNG 계열이 6개 있지만 **품질과 성능을 다 갖춘 것은 Mersenne Twister뿐**이다 (단, 출력 624개를 보면 이후가 예측 가능해지므로 암호학 용도는 불가).

> 로보틱스 연결: 난수는 게임만의 것이 아니다 — 센서 노이즈 시뮬레이션, particle filter(위치 추정), RRT 같은 샘플링 기반 경로 계획이 전부 PRNG 위에 서 있다. "고정 시드로 재현 가능한 실험"은 로봇 시뮬레이션의 기본기다.

---

## 14. Mersenne Twister로 난수 생성하기

### 기본 사용

```cpp
#include <random>

std::mt19937 mt{ std::random_device{}() };   // 생성 + 시드

std::uniform_int_distribution die6{ 1, 6 };  // [1, 6] 균등 분포
int roll { die6(mt) };                       // 주사위 굴리기
```

- `std::mt19937`: 32비트 Mersenne Twister (64비트는 `mt19937_64`)
- `std::uniform_int_distribution`: PRNG의 생(raw) 출력을 **원하는 범위의 균등 분포**로 변환 — `mt() % 6 + 1` 같은 수동 변환은 분포가 미세하게 치우치므로 distribution 객체를 쓴다

### 시딩 전략 2가지

| 방법 | 코드 | 비고 |
|---|---|---|
| 시스템 클록 | `std::chrono::steady_clock::now().time_since_epoch().count()` | 실행마다 다른 시드 보장. `steady_clock`을 쓰는 이유: 사용자가 시계를 되돌릴 수 없는 클록이므로 |
| `std::random_device` | `std::random_device{}()` | OS에 난수를 요청 — **기본 권장** (구현이 부실한 플랫폼이 아니라면) |

### Underseeding 해결 — std::seed_seq

mt19937의 내부 상태는 **19,937비트(32비트 값 624개)** 인데 시드 하나(32비트)만 주면 나머지 623개가 부실하게 채워진다. `std::seed_seq`에 random_device를 여러 번 넣어 시드 데이터를 증폭한다:

```cpp
std::random_device rd{};
std::seed_seq ss{ rd(), rd(), rd(), rd(), rd(), rd(), rd(), rd() };
std::mt19937 mt{ ss };
```

> [!NOTE]
> **"부실하게 채워진다"가 무슨 뜻인가**
> 시드 하나를 주면 `state[0] = seed`로 두고, 나머지 623칸은 `state[i] = 1812433253 * (state[i-1] ^ (state[i-1] >> 30)) + i` 같은 단순 점화식으로 **기계적으로 파생**시킨다. 즉 624칸 중 진짜 무작위 정보는 32비트(1칸 분량)뿐이다.
>
> - **시딩은 딱 1회.** 이후 `mt()` 호출마다 상태에서 값을 꺼내 출력하고, 624개를 다 쓰면 **직전 상태 전체를 재료로** 새 테이블을 재생성한다(twist). 시드 이후의 모든 것이 결정론적 — 상태₀이 정해지는 순간 수열 전체가 확정된다.
> - **문제 1**: 32비트 시드로 만들 수 있는 초기 상태는 2^32가지뿐 — 이론상 가능한 ~2^19937가지의 극히 일부.
> - **문제 2**: 파생 공식이 단순해서 **비슷한 시드 → 비슷한 초반 출력**. 시간 시드로 연속 실행하거나 시뮬레이션을 시드 1, 2, 3, …으로 돌리면 수열들이 서로 상관되어 독립 시행 가정이 깨진다 — "매번 다른 시드를 쓰니까 괜찮다"가 성립하지 않는 이유.

### 규칙들

- **PRNG는 프로그램에서 딱 한 번만 시드하라** — 재시딩은 품질을 떨어뜨린다
- **난수가 필요할 때마다 생성기를 새로 만들지 말라** — 비효율 + 품질 저하. 하나를 만들어 계속 쓸 것 → 그 "하나를 어디에 두는가"가 [다음 섹션](#15-전역-난수--randomh)
- 디버깅 시엔 고정 시드로 바꿔 동작을 재현하라
- 구식 `rand()` 대신 `<random>`을 쓸 것

---

## 15. 전역 난수 — Random.h

### non-const global 금지 규칙의 공인된 예외

["non-const global을 피하라"](../chapter07ScopeDurationAndLinkage/main.md)고 배웠지만 PRNG는 예외 후보의 조건에 정확히 부합한다 — "프로그램 전체에 **정확히 하나**만 있어야 하고(재시딩 금지) + **어디서나** 필요한 것". 대안들이 전부 나쁘다:

- 함수마다 인자로 전달 → 모든 시그니처가 지저분해짐
- 함수마다 static local 생성기 → 생성기가 여러 개 = 비효율 + 품질 저하

### learncpp의 Random.h 구조

```cpp
// Random.h (요지)
namespace Random
{
    inline std::mt19937 generate()          // 제대로 시드된 mt를 만들어 반환
    {
        std::random_device rd{};
        std::seed_seq ss{ /* 클록 + rd() 여러 개 */ };
        return std::mt19937{ ss };
    }

    inline std::mt19937 mt{ generate() };   // 전역 PRNG — 초기화는 함수로 위임

    inline int get(int min, int max)        // 이것만 부르면 됨
    {
        return std::uniform_int_distribution{ min, max }(mt);
    }
}
```

설계 포인트 세 가지:

1. **`inline`**: 헤더에 정의를 두고 여러 파일에 include해도 [링커가 하나로 합쳐준다](../chapter07ScopeDurationAndLinkage/main.md) — Ch.7의 inline이 실전에서 쓰이는 모습
2. **`generate()` 헬퍼**: 변수 초기화 자리에는 문장이 아니라 **식**만 올 수 있으므로, 여러 단계의 시딩 절차를 함수로 포장해 초기화식 하나로 만든 것
3. **namespace + 접근 함수**: 전역이지만 `Random::get(1, 6)`으로만 쓰게 유도 — Ch.7의 "전역을 써야 한다면" 3원칙 그대로

사용법: Random.h를 프로젝트에 복사 → include → `Random::get(min, max)`. 별도 초기화 코드 불필요.

---

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| 제어 흐름 | 조건 / 점프 / 함수 호출 / 루프 / 할트 / 예외 — 6범주 |
| if + 블록 | 단일 문장도 블록 권장 — 추가·주석 사고 예방; 들여쓰기는 컴파일러에 무의미 |
| dangling else | else는 **가장 가까운 짝 없는 if**에 붙는다 — 블록으로 명시 |
| `if (x = 0)` | 대입이지 비교가 아님 — 항상 같은 분기 |
| constexpr if | 조건이 상수 표현식이면 사용 — 컴파일 타임 평가 보장 + 죽은 분기 제거 |
| switch | 정수/열거형 동등 비교 전용 (jump table 최적화 때문); case마다 break/return |
| fallthrough | 라벨은 입구지 벽이 아님; 의도적이면 `[[fallthrough]]` |
| switch 스코프 | 암묵 블록 없음 — case 안 초기화는 명시적 블록 `{ }` 안에서 |
| goto | 스파게티 코드 — 중첩 루프 탈출 외에는 금지 |
| while (true) | 의도적 무한 루프 — 서버/제어 루프의 표준 패턴 |
| unsigned 루프 변수 | `>= 0`은 항상 참 (랩어라운드) — 루프 변수는 signed로 |
| do-while | 최소 1회 실행 (메뉴) — 하지만 동급이면 while 우선 |
| for | 명백한 루프 변수가 있으면 for; `!=` 대신 `<`/`<=` |
| continue | while에서는 증가문을 건너뛰어 무한 루프 위험 — for는 구조적으로 안전 |
| std::exit | **지역 변수를 정리하지 않는다** — 할트는 최후 수단 |
| PRNG | 같은 시드 = 같은 수열 (결정론적); 시드는 1회만 |
| Mersenne Twister | `std::mt19937` + `uniform_int_distribution` + `seed_seq`(underseeding 방지) |
| Random.h | non-const global 금지의 공인 예외 — inline + namespace + 접근 함수 |

### 자주 하는 실수 TOP 5

1. **`if (조건);` / `while (조건);`의 세미콜론** — null statement가 본문이 되어 if는 무조건 실행, while은 무한 루프
2. **switch의 break 누락** — fallthrough로 아래 case까지 줄줄이 실행된다
3. **unsigned 루프 변수로 `>= 0` 검사** — 0에서 `--`하면 최댓값으로 랩어라운드, 무한 루프
4. **while 루프에서 continue가 증가문을 건너뜀** — 루프 변수가 고정되어 무한 루프; 증가가 보장되는 for로 바꿀 것
5. **난수가 필요할 때마다 mt19937을 새로 생성/재시딩** — 품질과 성능 모두 저하; 프로그램에 생성기 하나, 시드 한 번
