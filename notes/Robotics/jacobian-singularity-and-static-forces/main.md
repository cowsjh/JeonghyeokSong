---
title: 자코비안 — 좌표계 변환, 특이점, static forces 개관 (Jacobian Singularity & Static Forces)
date: 2026-08-08
tags: jacobian, singularity
order: 
featured: false
draft: false
---

# 자코비안 — 좌표계 변환, 특이점, static forces 개관 (Jacobian Singularity & Static Forces)

> 출처: 로봇제어공학 — Introduction to Robotics 5장 "자코비안: 속도와 static forces" (후반부)
> 영상: https://www.youtube.com/watch?v=P5eftUgO8zA&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=13
> 대상: [5-2](../jacobian-velocity-kinematics-link-propagation/main.md)에서 정의한 "로봇 자코비안"(관절 속도 → 손끝 속도 계수 행렬)을 아는 상태에서 이어본다. **이 노트는 자코비안의 좌표계 변환, 특이점(singularity), static forces(정적인 힘) 개념 도입까지 다룬다.** static forces의 실제 힘·토크 변환 공식은 이 영상에서 유도되지 않는다 — 영상은 static forces 계산 절차를 개관하는 데서 끝난다.

---

## 목차

1. [지난 시간 복습](#1-지난-시간-복습)
2. [자코비안의 좌표계 변환](#2-자코비안의-좌표계-변환)
3. [특이점이란 무엇인가](#3-특이점singularity이란-무엇인가)
4. [예제 5.5 — 역자코비안과 손 뻗은 자세](#4-예제-55--2-링크-로봇의-역자코비안과-손-뻗은-자세)
5. [특이점의 기하학적 직관](#5-특이점의-기하학적-직관)
6. [static forces 개관](#6-머니퓰레이터-내부에서의-static-forces)
7. [표기법 비교표](#7-표기법-비교표)
8. [Python 실습 코드](#8-python-실습-코드)
9. [핵심 요약 카드](#핵심-요약-카드)

---

## 1. 지난 시간 복습

[5-2](../jacobian-velocity-kinematics-link-propagation/main.md)에서 자코비안은 편미분 행렬 $J$로 정의됐고, 로봇에서는 관절 속도를 손끝의 직교좌표계 속도로 바꾸는 계수 행렬이었다.

$${}^{0}v = {}^{0}J(\Theta)\,\dot\Theta$$

이 식을 실제로 손으로 구하려면 [링크 선속도 전파](../jacobian-velocity-kinematics-link-propagation/main.md)를 순차적으로 계산한 뒤, 결과식을 $\dot\theta_i$별로 묶어 계수 행렬 형태로 뽑아냈다. 이번 영상은 여기서 세 가지를 더 다룬다 — **자코비안도 좌표계를 바꿀 수 있다는 것**, **자코비안의 역행렬이 존재하지 않는 위치(특이점)가 있다는 것**, 그리고 **자코비안으로 속도뿐 아니라 힘도 다룰 수 있다는 것**(static forces의 도입부)이다.

---

## 2. 자코비안의 좌표계 변환

[5-2 6절](../jacobian-velocity-kinematics-link-propagation/main.md)에서 손끝 자신의 좌표계(3) 기준 속도를 베이스(0) 기준으로 바꿀 때 회전행렬을 곱했던 것과 같은 방식으로, 자코비안 자체도 기준 좌표계를 바꿀 수 있다.

계 $\{B\}$를 기준으로 정의된 자코비안이 있다고 하자.

$$\begin{bmatrix}{}^{B}v\\{}^{B}\omega\end{bmatrix} = {}^{B}v = {}^{B}J(\Theta)\dot\Theta$$

여기에 좌표계 $\{A\}$ 기준으로 옮기는 회전행렬을 곱하면, 선속도 부분과 각속도 부분이 각각 같은 회전행렬 ${}^A_BR$로 변환된다.

$$\begin{bmatrix}{}^{A}v\\{}^{A}\omega\end{bmatrix} = \begin{bmatrix}{}^{A}_{B}R & 0\\0 & {}^{A}_{B}R\end{bmatrix}\begin{bmatrix}{}^{B}v\\{}^{B}\omega\end{bmatrix}$$

이 블록 대각(block-diagonal) 행렬을 ${}^BJ(\Theta)\dot\Theta$에 곱해서 $\dot\Theta$ 앞의 계수 행렬만 다시 묶으면 좌표계 $\{A\}$ 기준 자코비안이 나온다.

$$\boxed{{}^{A}J(\Theta) = \begin{bmatrix}{}^{A}_{B}R & 0\\0 & {}^{A}_{B}R\end{bmatrix}{}^{B}J(\Theta)}$$

선속도와 각속도 블록이 각각 독립적으로 $3\times3$ 회전행렬로 변환되고 교차항(off-diagonal)이 0인 이유는, 이 변환이 순수 회전(같은 원점을 공유하는 두 좌표계 사이의 방향 차이)만 반영하기 때문이다 — 선속도 벡터와 각속도 벡터는 서로 다른 물리량이라 회전만으로는 서로 섞이지 않는다.

> **이해 필요**: 두 속도 블록이 같은 회전행렬로 각각 변환된다는 구조. **기억할 필요 없음**: 강의도 "나도 저거 실제로 계산해서 써본 적은 없어"라고 짚었다 — 실무에서 자주 쓰이는 계산은 아니고, 개념적으로 자코비안도 다른 물리량처럼 좌표 변환 규칙을 그대로 따른다는 것만 알면 충분하다.

**실무 캐비앗**: 만약 두 좌표계의 원점이 다르다면(순수 회전이 아니라 이동까지 있다면), 일반적인 spatial velocity(twist) 변환에는 위치 차이에서 나오는 반대칭 행렬(skew-symmetric matrix) 항이 교차 블록에 추가된다. 이 슬라이드는 원점이 같은 경우의 단순화된 형태다.

---

## 3. 특이점(singularity)이란 무엇인가

관절 속도를 손끝 속도로 연결하는 자코비안이 있으면, **반대 방향 질문**도 자연스럽게 떠오른다 — "손끝을 이 속도로 움직이려면 관절은 얼마나 빨리 움직여야 하는가?" 이건 [역기구학](../inverse-kinematics/main.md)과 완전히 같은 구도다. 위치 문제에서 정기구학 ↔ 역기구학이었다면, 속도 문제에서는 자코비안 ↔ 자코비안의 역행렬이다.

$$\dot\Theta = J^{-1}(\Theta)\,v$$

그런데 [행렬의 역](../orientation-representations/main.md)은 행렬식(determinant)이 분모로 들어가기 때문에, 행렬식이 0인 위치에서는 역행렬이 존재하지 않는다. 자코비안이 정사각행렬이 아니거나 역행렬이 존재하지 않는 그 관절각 조합을 **특이점(singularity)** 이라 부른다.

- **관절 속도 → 손끝 속도로 연결시키는 선형 변환이 주어졌을 경우, "이 행렬의 역을 구할 수 있는가"라는 질문이 의미가 있다.** 행렬이 비특이적(non-singular)이면 그 역을 구해서 손끝 속도로부터 관절 속도의 변화율을 계산할 수 있다.
- 로봇 손을 직교좌표계 공간 안에서 주어진 속도 벡터를 갖고 운동하게 하고 싶다면, 위 식을 경로를 따라 매 순간 적용해서 관절의 변화율을 계산하며 제어할 수 있다.
- 그런데 **"모든 $\Theta$의 값에 대해 자코비안의 역이 존재하는가?"** — 존재하지 않는다면, 역을 구할 수 없는 영역이 어디인지 알아야 한다.

대부분의 매니퓰레이터는 자코비안이 특이(역이 존재하지 않는) 값을 갖는 관절각 조합을 갖고 있다. 그런 위치를 기구의 특이점(singularities of the mechanism), 줄여서 특이점이라 한다.

- **모든 매니퓰레이터는 작업 공간의 경계(boundary)에서 특이점을 갖는다.** 팔을 최대한 뻗은 위치 같은 경우다.
- **대부분은 작업 영역 내부에서도 특이점의 궤적(loci)을 갖는다.** 점이 아니라 선·면 형태로 나타날 수 있다.
- 특이점 확인은 간단하다 — **자코비안의 행렬식이 0인 점, 선, 공간을 찾으면 된다**: $\det[J]=0$.

> **꼭 기억**: 특이점의 물리적 의미. 수학적으로 역행렬이 없다는 건, **그 관절각 조합에서는 로봇이 특정 방향의 속도를 낼 수 없다**는 뜻이다 — 로봇이 고장 난 게 아니라 기구학적으로 원천 불가능한 방향이 존재한다는 뜻이다.
> **이해**: $\det[J]=0$을 계산해서 특이점을 찾는 절차. **기억할 필요 없음**: 특정 로봇의 특이점 개수·위치를 암기하는 것 — 로봇마다 자코비안이 다르므로 매번 계산해야 한다.

**실무 포인트**: 특이점 근처에서는 $J^{-1}$의 성분이 발산하기 때문에, 실제 속도 제어(ROS2 `moveit_servo` 등)에서는 순수 역행렬 대신 **감쇠 최소제곱(damped least squares, DLS)** 역행렬을 쓴다. 특이값(singular value) $\sigma_i$마다 $\sigma_i \to \sigma_i/(\sigma_i^2+\lambda^2)$로 바꿔주는 감쇠항 $\lambda$를 추가해서, 특이점 근처에서도 관절 속도가 무한대로 튀지 않고 유한한 값으로 제한되도록 만든다. (다만 감쇠를 세게 걸수록 정확도와 도달 가능 범위가 줄어드는 트레이드오프가 있다.)

Sources: [MoveIt Servo Singularity Avoidance Issue](https://github.com/ros-planning/moveit/issues/3155), [Robust Inverse Kinematics Using Damped Least Squares (NASA)](https://ntrs.nasa.gov/api/citations/19950005142/downloads/19950005142.pdf)

---

## 4. 예제 5.5 — 2-링크 로봇의 역자코비안과 손 뻗은 자세

> **예제 5.5**: 회전 관절을 갖는 2-링크 매니퓰레이터의 말단 효과 장치가 X축 방향으로 1.0 m/s로 움직이고 있다고 하자. 특이점에서 떨어져 있을 때는 이 속도가 적당하지만, 특이점에 접근하며 $\theta_2 \to 0$에 가까워지면 관절률(joint rate)이 어떻게 되는지 보여라.

[5-2 9절](../jacobian-velocity-kinematics-link-propagation/main.md)에서 구한 ${}^0J(\Theta)$의 역행렬을 먼저 계산한다.

$${}^{0}J^{-1}(\Theta) = \frac{1}{l_1 l_2 s_2}\begin{bmatrix}l_2c_{12} & l_2s_{12}\\-l_1c_1-l_2c_{12} & -l_1s_1-l_2s_{12}\end{bmatrix}$$

($2\times2$ 행렬의 역은 행렬식(분모) 분의 1을 곱하고, 대각 성분끼리 자리를 바꾸고 비대각 성분의 부호를 바꾸는 표준 공식을 그대로 적용한 것이다 — 분모에 $s_2 = \sin\theta_2$가 들어간다는 점이 이 예제의 핵심이다.)

X축 방향 속도 1 m/s, Y축 속도 0을 대입한다.

$$\begin{bmatrix}\dot\theta_1\\\dot\theta_2\end{bmatrix} = \frac{1}{l_1l_2s_2}\begin{bmatrix}l_2c_{12} & l_2s_{12}\\-l_1c_1-l_2c_{12} & -l_1s_1-l_2s_{12}\end{bmatrix}\begin{bmatrix}1\\0\end{bmatrix} = \begin{bmatrix}\dfrac{c_{12}}{l_1s_2}\\[4pt] -\dfrac{c_1}{l_1s_2}-\dfrac{c_{12}}{l_2s_2}\end{bmatrix}$$

두 관절 속도 모두 분모에 $s_2=\sin\theta_2$를 갖고 있다. $\theta_2\to0$이면 $\sin\theta_2\to0$이므로, 분자가 우연히 0이 되지 않는 한 **관절 속도가 무한대로 발산한다.** 즉 로봇이 팔을 완전히 뻗은 자세($\theta_2=0$)에서는 X방향으로 1 m/s의 손끝 속도를 만들어내는 것이 물리적으로 불가능하다 — 아무리 관절을 빨리 돌려도 안 되는 방향이 생긴다는 뜻이다.

> **꼭 기억**: 역자코비안의 분모(행렬식)에 $\sin\theta_2$가 나타나고, $\theta_2=0,\ 180°$일 때 이 값이 0이 되어 발산한다는 결론. **이해**: 이게 왜 발산인지는 [다음 절](#5-특이점의-기하학적-직관)에서 기하학적으로 확인한다.

---

## 5. 특이점의 기하학적 직관

$\theta_2=0$은 링크 1의 연장선 위에 링크 2가 그대로 놓인, **팔을 완전히 뻗은 자세**를 뜻한다.

> "손 뻗은 다음에 더 뻗을 수가 없는 거 아니야. 여기가 한계잖아. 안쪽으로는 나 만들어낼 수 있지, 이렇게 기울이면 되니까... 근데 저 방향으로는 못 내잖아. 더 갈 수가 없잖아."

이 상태에서 팔을 안쪽으로 굽히는 방향(관절을 굽혀 반경을 줄이는 방향)이나 위·아래로 흔드는 방향의 속도는 얼마든지 만들 수 있다. 하지만 **팔이 이미 최대로 뻗은 방향으로 더 뻗어나가는 속도**만큼은, 관절을 아무리 빨리 돌려도 만들어낼 수 없다 — 순간적으로 그 방향은 반지름이 최대인 원의 접선 방향과 직교하기 때문에, 어떤 관절 회전 조합으로도 그 방향 성분을 만들 수 없다.

이건 4장에서 [역기구학](../inverse-kinematics-puma560-closed-form/main.md)이 손끝의 도달 범위 경계에서 풀리지 않았던 것과 같은 종류의 한계다 — 위치 문제에서는 "그 위치에 갈 수 없다"였다면, 속도 문제에서는 "그 위치에서 그 방향의 속도를 낼 수 없다"로 나타난다.

> **실무 포인트**: 여러분 자신도 같은 한계를 갖고 있다 — 팔을 완전히 뻗은 상태에서는 손을 더 멀리 보낼 수 없고, 등을 손으로 긁지 못하는 것도 관절 구조상 도달 범위(역기구학 해)가 없는 경우다. 특이점은 로봇이 고장 난 게 아니라 기구학적으로 당연히 존재하는 한계다.

내부 특이점(workspace interior singularity)의 대표적인 예로는 PUMA 560의 $\theta_3=-90°$(팔꿈치가 완전히 펴진 자세)와 $\theta_5=0°$(4번·6번 축이 일직선으로 겹쳐 자유도 하나가 사라지는 자세, [역기구학에서 다뤘던 손목 정렬](../inverse-kinematics-puma560-closed-form/main.md) 문제와 동일한 원인)가 있다.

---

## 6. 머니퓰레이터 내부에서의 static forces

여기서부터는 완전히 새로운 주제다 — 자코비안을 **속도가 아니라 힘**에 적용하는 첫걸음이다.

> "로봇은 연쇄의 자유단(말단 효과 장치)을 갖고 주어진 환경에서 어떤 물체를 밀고 있거나, 또는 손에 어떤 부하를 지지하고 있는 것이 전형적인 상황이다. 시스템을 정적 평형에 유지시키기 위하여 작용해야 할 관절 토크에 대하여 풀기를 원한다."

### static forces vs dynamics — 뭐가 다른가

같은 힘·토크 얘기지만 정지 여부가 다르다.

| 구분 | 상태 | 예시 |
|---|---|---|
| static forces (5장, 이 절) | 손끝이 정지해 있음 — 속도·위치·가속도 변화 없음 | 벽을 세게 밀고 있는데 안 움직임, 아령을 들고 가만히 버팀 |
| dynamics (6장) | 손끝이 힘을 받아 실제로 움직임 | 아령을 들고 휘두름 — 가속도가 생기고 모멘텀 때문에 몸이 반대로 밀림 |

**정적인 힘을 낸다는 게 왜 특별한가**: 만약 힘을 하나도 안 주면 관절은 그 자리에 그냥 멈춰 있으면 된다(힘 뺀 채로). 그런데 벽을 밀고 있거나 무게를 지탱하고 있으려면 위치·속도는 변화가 없는데도 **각 관절이 특정 토크를 계속 내야 한다** — 이 토크를 구하는 게 static forces 문제의 목표다.

### 계산 절차 (3단계)

머니퓰레이터에서 static forces를 고려할 때:

1. **모든 관절을 고정시켜 매니퓰레이터 전체를 하나의 강체(구조물)로 취급한다.** 링크 1, 2, 3이 실제로는 연결되어 있지만, 움직이지 않는다고 가정하면 하나의 덩어리로 봐도 무방하다는 단순화다.
2. **각 링크를 고려하여 링크계를 써서 밸런스(힘의 평형) 관계를 기술한다.** 작용-반작용, 그리고 시계 방향·반시계 방향 모멘트가 서로 상쇄되어 정지 상태를 유지한다는 조건을 이용한다.
3. **매니퓰레이터가 정적 평형에 있기 위해 각 관절축 주위에 작용해야 할 토크를 계산한다.** 이 결과가 말단 효과 장치에 작용하는 하중을 지지하기 위해 필요한 관절 토크의 조합이다.

> **꼭 기억**: 이 3단계 절차의 논리 순서(전체를 강체로 → 링크별 힘 평형 → 관절 토크 역산). **기억할 필요 없음**: 아직 실제 힘-토크 변환 공식(자코비안의 전치를 힘에 곱하는 형태)이 이 영상에는 나오지 않았다 — 다음 영상에서 이어질 내용이다.

**중력은 여기서 고려하지 않는다.** 지구상의 모든 물체는 항상 중력을 버티기 위한 힘을 쓰고 있지만, 이 절에서는 순수하게 "말단에 가해진 외력에 대응하는 관절 토크"만 다룬다. 중력이 링크에 가하는 힘은 6장(동역학, dynamics)에서 다뤄진다.

**실무 포인트**: 이 정적 힘 계산은 로봇이 칠판에 글씨를 쓰거나(일정한 누르는 힘 유지), 물체를 조립하며 밀어 끼울 때(force control) 필요한 계산이다 — ROS2 `ros2_control`의 force/torque 제어 인터페이스나 힘 제어(compliance control) 알고리즘의 이론적 기반이 된다.

---

## 7. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| ${}^AJ(\Theta) = \begin{bmatrix}{}^A_BR&0\\0&{}^A_BR\end{bmatrix}{}^BJ(\Theta)$ | 자코비안의 좌표계 변환 | 원점이 같은 두 좌표계 사이의 순수 회전 변환 |
| $\dot\Theta = J^{-1}(\Theta)v$ | 손끝 속도 → 관절 속도(역기구학의 속도 버전) | $J$가 정사각행렬이고 역이 존재해야 함 |
| $\det[J]=0$ | 특이점(singularity) 조건 | 이 점에서 $J^{-1}$이 존재하지 않음 |
| workspace boundary singularity | 작업 공간 경계의 특이점 | 모든 매니퓰레이터가 가짐 (팔을 최대로 뻗은 자세 등) |
| workspace interior singularity | 작업 공간 내부의 특이점 | 대부분의 매니퓰레이터가 가짐, 점이 아니라 궤적(loci)일 수 있음 |
| static forces | 정지 상태에서 외력에 대응하는 관절 토크 | 6장 dynamics(움직이는 상태의 힘)와 대조됨 |

---

## 8. Python 실습 코드

```python
import numpy as np

def two_link_jacobian(l1, l2, theta1, theta2):
    """5-2 9절의 2x2 자코비안(선속도만, 베이스 좌표계 0 기준)."""
    c1, s1 = np.cos(theta1), np.sin(theta1)
    c12, s12 = np.cos(theta1 + theta2), np.sin(theta1 + theta2)
    return np.array([
        [-l1 * s1 - l2 * s12, -l2 * s12],
        [ l1 * c1 + l2 * c12,  l2 * c12],
    ])


def two_link_jacobian_inverse(l1, l2, theta1, theta2):
    """예제 5.5의 역자코비안. det = l1*l2*sin(theta2) 이므로
    theta2 -> 0, 180deg 에서 특이점이 된다."""
    J = two_link_jacobian(l1, l2, theta1, theta2)
    det = np.linalg.det(J)
    return np.linalg.inv(J), det


l1, l2 = 1.0, 0.8
theta1 = np.deg2rad(30)

print(f"{'theta2(deg)':>12} | {'det(J)':>10} | {'theta1_dot':>12} | {'theta2_dot':>12}")
for theta2_deg in [30, 15, 5, 1, 0.1]:
    theta2 = np.deg2rad(theta2_deg)
    J_inv, det = two_link_jacobian_inverse(l1, l2, theta1, theta2)
    theta_dot = J_inv @ np.array([1.0, 0.0])  # X축 방향 1 m/s
    print(f"{theta2_deg:12.2f} | {det:10.5f} | {theta_dot[0]:12.3f} | {theta_dot[1]:12.3f}")

# theta2가 0에 가까워질수록 det(J) -> 0, 관절 속도는 발산한다.
```

### 연습 문제 (TODO)

```python
def is_near_singularity(l1, l2, theta1, theta2, det_threshold=1e-3):
    """주어진 관절각이 특이점 근처인지 판별하라.

    TODO:
    - two_link_jacobian으로 J를 구하라
    - det(J)의 절댓값이 det_threshold보다 작으면 True를 반환하라
    """
    J = None  # TODO
    det = None  # TODO
    return None  # TODO


# 검증: theta2가 0, 180도에 가까울 때만 True가 나와야 한다
for theta2_deg in [0.0, 5.0, 90.0, 179.5, 180.0]:
    theta2 = np.deg2rad(theta2_deg)
    # print(theta2_deg, is_near_singularity(l1, l2, theta1, theta2))
```

> [!TIP]
> **연습 문제 정답 보기**
> ```python
> def is_near_singularity(l1, l2, theta1, theta2, det_threshold=1e-3):
>     J = two_link_jacobian(l1, l2, theta1, theta2)
>     det = np.linalg.det(J)
>     return abs(det) < det_threshold
>
>
> for theta2_deg in [0.0, 5.0, 90.0, 179.5, 180.0]:
>     theta2 = np.deg2rad(theta2_deg)
>     print(theta2_deg, is_near_singularity(l1, l2, theta1, theta2))
> # 0.0 True, 5.0 False, 90.0 False, 179.5 True, 180.0 True
> ```

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 자코비안 좌표계 변환 | ${}^AJ(\Theta) = \begin{bmatrix}{}^A_BR&0\\0&{}^A_BR\end{bmatrix}{}^BJ(\Theta)$ — 선속도·각속도 블록이 각각 같은 회전행렬로 변환됨 |
| 특이점의 수학적 정의 | $\det[J(\Theta)]=0$인 관절각 조합 — $J^{-1}$이 존재하지 않음 |
| 특이점의 물리적 의미 | 그 자세에서는 특정 방향의 손끝 속도를 관절이 아무리 빨리 움직여도 낼 수 없음 |
| 특이점의 종류 | 작업 공간 경계 특이점(모든 로봇이 가짐) + 작업 공간 내부 특이점(대부분이 가짐, 궤적일 수 있음) |
| 예제 5.5 결론 | 2-링크 로봇에서 $\theta_2\to0$(팔을 완전히 뻗음)이면 역자코비안의 분모($l_1l_2\sin\theta_2$)가 0이 되어 관절 속도가 발산 |
| 특이점 회피 실무 | 순수 역행렬 대신 damped least squares($\sigma_i\to\sigma_i/(\sigma_i^2+\lambda^2)$) 역행렬 사용 |
| static forces | 손끝이 **정지한 채로** 외력을 내거나 버티는 상황의 관절 토크 계산 — 6장 dynamics(움직이며 힘을 내는 상황)와 대조 |
| static forces 계산 절차 | ① 전체를 하나의 강체로 고정 ② 링크별 힘의 평형(작용-반작용) 기술 ③ 관절 토크 역산. 중력은 6장에서 다룸 |
| 이 영상이 다루지 않은 것 | static forces의 실제 힘-토크 변환 공식(자코비안 전치 활용)은 유도되지 않음 — 절차 개관에서 영상이 끝남 |
