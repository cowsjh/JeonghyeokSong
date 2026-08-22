---
title: map-odom-base_link 에서의 odom
date: 2026-08-20
tags: coordinate-frame
order: 
featured: false
draft: false
---

# map-odom-base_link 에서의 odom

ROS2 프레임 트리가 `base_link` 하나로 끝나지 않고 왜 굳이 `map → odom → base_link`로 한 단계를 더 끼워 넣는지, 그리고 그 `odom`이 실제로 무슨 값을 들고 있는지 정리.

## 계층을 나누는 이유

로봇이 복도를 달리다 바퀴가 살짝 미끄러지면, 바퀴 회전수로 계산한 값은 실제 위치에서 **조금씩 어긋난다.** 그런데 몇 초 뒤 라이다가 벽 모양을 보고 위치를 정정해주면, 로봇의 위치 추정치는 한순간에 훅 튀어야 한다. 이런 오차 누적과 추정치의 노이즈는 하나의 좌표계로 동시에 만족시킬 수 없다.

| | `odom → base_link` | `map → odom` |
|---|---|---|
| 계산 방법 | 바퀴 엔코더/IMU 적분(추측항법) | 라이다 스캔매칭·AMCL 등 전역 위치추정 |
| 업데이트 방식 | 연속적, 매끄러움 | 이산적, 가끔 훅 튐 |
| 장기 정확도 | 드리프트(누적오차)로 서서히 틀어짐 | 절대 정확(지도 기준 재정렬) |

로봇 제어는 부드럽게 이어지는 좌표가 필요하다.
위치가 갑자기 5cm 튀면 순간 속도가 튀어 로봇이 덜컹거린다. 그래서 로컬 플래너는 `odom` 기준으로 동작하고, 전역 경로 계획은 드리프트 없는 `map` 기준으로 동작한다.
`map → base_link`를 누군가 직접 발행하지 않는 이유이다.
매끄러움과 절대 정확성을 한 발행자가 동시에 만족시킬 수 없기 때문에, `map → odom`(정정)과 `odom → base_link`(적분)를 따로 발행하고 실제 절대 위치는 [tf2](../tf2/main.md)가 둘을 곱해서(복합 변환) 구한다.

## odom은 스칼라가 아니라 pose다

자동차 계기판의 오도미터는 스칼라 하나(누적 주행거리)지만,
로봇의 `odometry`는 **위치(x, y, z) + 방향(쿼터니언)** 을 가진 완전한 pose다.

차동구동 로봇을 예로 들면, 매 스텝마다 엔코더에서 나온 값으로 먼저 스칼라 변위를 구한다.

$$\Delta d = \frac{\Delta d_L + \Delta d_R}{2}, \qquad \Delta\theta = \frac{\Delta d_R - \Delta d_L}{L}$$

여기서 끝나지 않고, 로봇이 현재 향한 방향 θ로 이 스칼라를 벡터 분해해서 누적한다.

$$x \mathrel{+}= \Delta d \cos\theta, \qquad y \mathrel{+}= \Delta d \sin\theta, \qquad \theta \mathrel{+}= \Delta\theta$$

방향으로 분해하지 않고 스칼라만 누적하면 "총 몇 m 굴러갔다"만 남고 어디로 굴러갔는지는 알 수 없다.때문에, 스칼라만으로는 애초에 위치 추정이 안 된다.

`nav_msgs/Odometry`가 담는 것도 이 누적 결과 그대로다:
pose(position + 쿼터니언 orientation — tf2가 발행하는 `TransformStamped`와 같은 구조)와 twist(선속도·각속도). "거리를 잰다"는 어원은 매 순간의 재료가 스칼라 변위라는 뜻이지, 최종 결과가 스칼라라는 뜻이 아니다.
