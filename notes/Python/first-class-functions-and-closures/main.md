---
title: 일급 함수와 클로저 (First-Class Functions & Closures)
date: 2026-08-08
tags: functional, closure
order: 
featured: false
draft: false
---

# 일급 함수와 클로저 (First-Class Functions & Closures)

파이썬에서 함수는 숫자·문자열과 똑같이 변수에 담거나, 다른 함수의 인자로 넘기거나, 함수의 반환값으로 쓸 수 있는 **1급 객체(first-class object)**다. `simulate(controller, ...)`가 `controller` 자리에 함수 객체를 통째로 받아 나중에 자기가 원하는 시점에 실행하는 것이 이 성질을 쓴 것이다.

## 함수를 인자로 넘기기 ([콜백](../../ROS2/callback/main.md) 패턴)

```python
def apply_twice(f, x):
    return f(f(x))

def add_one(x):
    return x + 1

apply_twice(add_one, 5)   # 11
```

`add_one`을 괄호 없이 넘기면 "이 함수 자체(레시피)를 넘겨라, 실행은 네가 알아서 해라"는 뜻이 된다. 반대로 `add_one(5)`처럼 괄호를 붙이면 그 자리에서 즉시 실행되어, 넘어가는 것은 함수가 아니라 **실행 결과값**이 된다. 이 둘을 헷갈리는 것이 가장 흔한 실수다.

## 클로저로 상태를 기억하는 함수 만들기 (팩토리 패턴)

바깥 함수의 매개변수를 안쪽 함수가 기억한 채로 반환되는 것을 **클로저(closure)**라 한다.

```python
def p_controller(Kp):
    return lambda e, dt: Kp * e

ctrl = p_controller(0.5)   # Kp=0.5가 "박힌" 함수 객체가 만들어짐 (아직 미실행)
ctrl(90, 0.1)                # 45.0 — 여기서 비로소 e, dt가 채워짐
```

여기서 헷갈리기 쉬운 지점: `p_controller`는 매개변수가 `Kp` 하나뿐인데, 나중에 `ctrl(e, dt)`처럼 인자 2개로 호출된다. 이건 `p_controller`가 `e`, `dt`까지 받게 된 게 아니다 — `p_controller`와 `lambda e, dt: ...`는 **서로 다른 두 개의 함수**이고, `e`, `dt`는 처음부터 안쪽 lambda 자신의 매개변수다. `p_controller(Kp)` 호출은 이 lambda를 "만들기만" 하고 끝나며, `ctrl(e, dt)`는 그 lambda를 나중에 별도로 호출하는 완전히 다른 이벤트다.

```python
def p_controller(Kp):        # 함수 A: 매개변수는 Kp 하나
    def inner(e, dt):        # 함수 B: 매개변수는 e, dt (A와 무관, 별개의 함수)
        return Kp * e         #   B는 자기 스코프 밖의 Kp를 클로저로 "참조"만 함
    return inner              # A는 B를 실행하지 않고 B라는 객체를 반환
```