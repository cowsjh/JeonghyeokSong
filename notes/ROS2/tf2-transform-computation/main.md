---
title: tf2가 좌표를 계산하는 방식
date: 2026-08-20
tags: coordinate-frame, transformation-matrix
order: 
featured: false
draft: false
---

# tf2가 좌표를 계산하는 방식

## 모든 좌표는 링크

로봇에 라이다가 `laser_frame`으로 달려 있고,
`map → odom → base_link → laser_frame`일때. 각 `broadcaster`는
자기가 아는 **인접한 두 프레임 사이 변환만** 계산, 발행한다. `map`부터 `laser_frame`까지 한 번에 아는 노드는 없다


이걸 `tf2_ros.Buffer`가 edge마다 시간별 이력으로 쌓아둔다. 발행 주기가 서로 달라 정확히 그 timestamp의 값이 없으면 앞뒤 샘플을 보간하는데, 위치는 선형보간, 회전은 쿼터니언의 slerp(구면 선형보간)를 쓴다.

## 계산
최상위 까지 체인을 곱한다

`map`과 `laser_frame`은 트리 상 바로 안 붙어 있으니, [tf2](../tf2/main.md)는 `laser_frame → base_link → odom → map`으로 올라가며 각 구간의 변환을 순서대로 곱하고, 반대 방향이 필요하면 역행렬(쿼터니언은 conjugate)로 뒤집어 붙인다.

이건 새로운 계산법이 아니라, 변환 행렬 이론의 **변환 방정식(루프)** 그대로다. 두 프레임 사이에 공통 조상(map)이 있고, 그 조상까지 가는 두 체인을 곱했다 뺐다(역행렬) 하면 원하는 구간만 남는다:

$$^{map}_{base\_link}T = {}^{map}_{odom}T \; {}^{odom}_{base\_link}T$$

tf2는 이 "루프 방정식 풀기"를 트리 탐색으로 자동화한 것뿐이다. 손으로 4×4 행렬을 곱하고 뒤집던 걸, 자료구조(트리 + 시간별 버퍼)로 대신해주는 셈.

## 바뀌는건 기준 좌표

"laser_frame 기준 점을 map 기준으로 바꾼다"는 표현은 오해를 부르기 쉽다. `map`은 트리의 뿌리라서 안 움직인다. 움직이는 건 로봇(`base_link`, `laser_frame`) 쪽이고, 그래서 `map→odom→base_link`의 변환값 자체가 시간마다 갱신되는 것이다.

라이다가 "내 앞 2m"라고 잰 값은 실제 세계에서 안 움직이는 벽일 수도 있다. 하지만 `(2, 0, 0)`이라는 숫자는 **laser_frame 기준으로 잰 좌표값**일 뿐이다.
로봇이 움직이면 벽은 그대로 있어도 "내 앞 2m"라는 숫자는 계속 바뀐다. 즉 `lookupTransform("map", "laser_frame", t)`가 구해주는 건 laser_frame 언어로 쓰인 좌표를 map 기준으로 **변환하는 행렬** 이다.

## 평행이동, 쿼터니언

`tf2::Transform`은 회전을 3×3 행렬이 아니라 쿼터니언으로 들고 있다. 짐벌락이 없고 삼각함수 없이 곱셈·덧셈뿐이라, 트리를 여러 단 타고 올라가는 반복 합성 연산에서 더 빠르고 안정적이기 때문이다. `geometry_msgs/Quaternion`이 `(x, y, z, w)` 4개 필드인 것도 이 오일러 파라미터 그대로다.
