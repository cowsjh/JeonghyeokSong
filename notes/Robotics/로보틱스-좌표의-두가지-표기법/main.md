---
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

- houdini 함수: `ident()`, `translate()`, `rotate()`, ...
- DH 파라미터
- URDF

**Houdini** 에서
어떤 지오메트리를 $O_{pos}$으로 보낼때  역행렬을 역순으로 곱해주는 방식을 많이 썼다.

`translate()`는 [전위 연산자](../transformation-matrix/main.md) 와 같다.
`rotate()` 는[회전 연산자](../transformation-matrix/main.md) 와 같다.
`ident()` 는 로보틱스에서 base_link로 사용 가능한 원점 단위 행렬과 동일 하다.

**Robotics** 에서도
완전히 같은 원리를 사용한다. 선형대수의 행렬곱을 베이스로 동차 행렬을 링크 별로 이어 나가는 4x4 행렬을 만들기 때문이다.
대신 표기는 DH 파라미터 ( $\theta$, d, a, $\alpha$ ) 로 간단 표기가 가능 하다. 

결국 두 환경에서 모두 같은 수학적 논리를 사용 하기 때문에 4x4 행렬이 나온다.