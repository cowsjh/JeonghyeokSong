---
title: 머니퓰레이터 동역학 개요, 강체 가속도와 관성 텐서 (Manipulator Dynamics — Acceleration & Inertia Tensor)
date: 2026-08-08
tags: inertia-tensor, torque
order: 
featured: false
draft: false
---

# 머니퓰레이터 동역학 개요, 강체 가속도와 관성 텐서 (Manipulator Dynamics — Acceleration & Inertia Tensor)

> 출처: 로봇제어공학 — Introduction to Robotics 6장 "머니퓰레이터 동역학(dynamics)" (첫 강의)
> 영상: https://www.youtube.com/watch?v=91d3KbCRh9k&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=15
> 대상: [5장](../jacobian-static-forces-and-geometric-jacobian/main.md)에서 위치·속도·정적 힘까지 다뤘다면, 이 노트는 그 위에 **가속도와 토크**를 얹어 로봇 운동 전체를 아우르는 6장의 출발점이다 — 강체 가속도 유도, 관성 모멘트·관성 텐서 개념, 직육면체 예제까지.

---

## 1. 왜 다이나믹스인가 — 위치·속도의 다음 단계

지금까지 배운 세 가지를 한 줄씩 정리하면:

| 장 | 다루는 물리량 | 관절-손끝 관계 |
|---|---|---|
| 기구학 | 위치·각도 | 관절각 → 손끝 위치 |
| 자코비안 속도 | 각속도·선속도 | 관절 각속도 → 손끝 속도 |
| [static forces](../jacobian-static-forces-and-geometric-jacobian/main.md) | 힘·토크(정지 상태) | 손끝 힘 → 관절 토크 (가속도 없음) |
| 동역학 (6장) | **가속도 + 힘/토크 전부** | 위 세 가지를 전부 포함하는 상위 개념 |

동역학이 굳이 새로 필요한 이유는 뉴턴의 운동방정식 $F=MA$ 그 자체다. 힘을 알려면 가속도를 알아야 하는데, static forces에서는 로봇이 멈춰 있다고 가정했으므로 각가속도가 필요 없었다. 동역학은 그 가정을 걷어내고 **각도 $\theta$, 각속도 $\dot\theta$, 각가속도 $\ddot\theta$를 전부 알아야** 풀리는, static forces를 포함하는 더 큰 문제다.

또 하나 바뀌는 게 있다 — 지금까지 로봇 모터는 **위치 제어**(기구학) 아니면 **속도 제어**(자코비안)만 했는데, 가속도를 제어하려면 결국 힘, 회전에서는 **토크 제어**가 필요하다. 실제 모터 중 토크 제어가 가능한 모터는 많지 않다 — 토크 자체를 측정하는 것이 어렵기 때문이다.

**이해**: 위치 제어가 제일 쉽고, 속도·가속도(토크) 제어로 갈수록 어려워진다는 난이도 위계.

마지막으로 static forces에서 "중력은 6장에서 다룬다"고 미뤄뒀던 부분도 여기서 정식으로 들어온다 — 동역학은 액추에이터 토크 + 외력 + **중력**까지 전부 포함한다.

---

## 2. 순방향·역방향 다이나믹스 — 두 가지 문제

동역학이 푸는 문제는 [기구학·역기구학](../inverse-kinematics/main.md)과 똑같은 구조로 두 방향이 있다.

| | 알고 있는 것 | 구하는 것 | 강의에서 부르는 이름 |
|---|---|---|---|
| 문제 1 | 관절 각도 $\theta$, 각속도 $\dot\theta$, 각가속도 $\ddot\theta$ | 필요한 관절 토크 $\tau$ | 역동역학 (inverse dynamics) |
| 문제 2 | 관절 토크 $\tau$ | 결과로 나오는 $\theta,\dot\theta,\ddot\theta$ | 순동역학 (forward dynamics) |

두 문제의 쓰임새가 다르다: 순동역학은 로봇 팔이 특정 토크로 움직였을 때 실제로 어떻게 거동하는지 계산하는 것이라 **시뮬레이션**에 쓰이고, 역동역학은 "손끝을 이렇게 가속시키려면 각 모터에 얼마의 토크를 줘야 하나"를 구하는 것이라 **실제 제어**에 쓰인다. 강의는 실무에서 훨씬 많이 쓰이는 역동역학을 중심으로 진행한다.

**필요한 세 값은 이미 측정 가능하다**: 모터에 붙은 엔코더가 위치 $\theta$를 알려주고, 짧은 시간 간격으로 위치를 반복 측정하면 $\dot\theta$, 그 변화를 다시 측정하면 $\ddot\theta$가 나온다. 즉 $\theta,\dot\theta,\ddot\theta$는 "안다"고 가정하고 시작해도 되는 값이다.

**꼭 기억**: 역동역학 = $(\theta,\dot\theta,\ddot\theta) \to \tau$ (제어에 사용), 순동역학 = $\tau \to (\theta,\dot\theta,\ddot\theta)$ (시뮬레이션에 사용). 이 장은 대부분 역동역학을 다룬다.

---

## 3. 강체의 선가속도 유도

가속도는 속도의 시간 미분이다. [5장에서 정의한](../jacobian-velocity-kinematics/main.md) 좌표계 $\{B\}$ 기준 점 $Q$의 속도를 그대로 다시 가져와 미분만 취하면 된다.

$${}^B\dot V_Q = \lim_{\Delta t\to 0}\frac{{}^BV_Q(t+\Delta t)-{}^BV_Q(t)}{\Delta t}, \qquad {}^B\dot\Omega_Q = \lim_{\Delta t\to 0}\frac{{}^B\Omega_Q(t+\Delta t)-{}^B\Omega_Q(t)}{\Delta t}$$

고정된 우주 좌표계(universe frame) 기준일 때는 표기를 간단히 줄여 쓴다 — 이후 종종 섞여 나오므로 당황하지 말 것.

$$\dot V \equiv {}^{U}\dot V, \qquad \dot\Omega \equiv {}^{U}\dot\Omega$$

### 출발점 — 5장의 속도 합성 공식

[5장](../jacobian-velocity-kinematics/main.md)에서 좌표계 $\{B\}$ 기준 점 $Q$의 속도를 좌표계 $\{A\}$ 기준으로 바꾸는 식(식 5.12)은 두 항의 합이었다.

$${}^AV_Q = {}^A_BR\,{}^BV_Q + {}^A\Omega_B \times {}^A_BR\,{}^BQ$$

- 첫째 항: $Q$가 $\{B\}$ 기준으로 갖는 속도를 $\{A\}$로 회전변환만 한 것
- 둘째 항: $\{B\}$ 좌표계 자체가 $\{A\}$ 기준으로 통째로 회전하면서 생기는 속도($\omega\times r$)

이 두 항을 그대로 미분하면 가속도가 나온다. 미분할 때 곱의 미분법칙(product rule)을 그대로 적용하고, 회전행렬 ${}^A_BR$의 미분에는 [5장에서 유도한](../jacobian-velocity-kinematics/main.md) $\dot{}^A_BR = {}^A\Omega_B\times{}^A_BR$ 관계를 대입한다.

정리 결과, $\{B\}$ 좌표계의 원점이 $\{A\}$ 기준으로 고정되어 있고(회전만 함) $Q$가 $\{B\}$에 고정된 점이 아니라 그 안에서 자체 속도 ${}^BV_Q$를 가지고 움직이는 일반적인 경우:

$${}^A\dot V_Q = {}^A_BR\,{}^B\dot V_Q + 2\,{}^A\Omega_B\times{}^A_BR\,{}^BV_Q + {}^A\dot\Omega_B\times{}^A_BR\,{}^BQ + {}^A\Omega_B\times\left({}^A\Omega_B\times{}^A_BR\,{}^BQ\right)$$

가운데 $2{}^A\Omega_B\times\cdots$ 항이 바로 코리올리 가속도(Coriolis acceleration)에 해당하는 항이다 — $\{B\}$가 돌면서 동시에 $Q$가 그 안에서 움직이기 때문에 생기는 교차항이다.

### 원점이 움직이는 경우까지 일반화

지금까지는 $\{B\}$의 원점이 $\{A\}$ 기준으로 고정된 채 회전만 한다고 가정했다. 직동 관절(prismatic joint)처럼 두 좌표계의 원점 사이 거리 자체가 변할 수도 있으므로, $\{B\}$ 원점의 선가속도 항 ${}^A\dot V_{BORG}$를 하나 더 더해 완전히 일반화한다([5-4에서 원점 이동을 포함해 속도 변환을 일반화한 것](../jacobian-static-forces-and-geometric-jacobian/main.md)과 같은 방식):

$$\boxed{{}^A\dot V_Q = {}^A\dot V_{BORG} + {}^A_BR\,{}^B\dot V_Q + 2\,{}^A\Omega_B\times{}^A_BR\,{}^BV_Q + {}^A\dot\Omega_B\times{}^A_BR\,{}^BQ + {}^A\Omega_B\times\left({}^A\Omega_B\times{}^A_BR\,{}^BQ\right)}$$

이게 **일반적인 관절**(직동이든 회전이든)에 다 적용되는 식이다. 그런데 로봇의 관절 $i$와 $i+1$ 사이는 — 프리스매틱 조인트가 아닌 이상 — 서로 멀어지지 않는다. 회전 관절에서는 $Q$가 $\{B\}$에 완전히 고정된 점이므로 ${}^BV_Q = {}^B\dot V_Q = 0$이 되어 코리올리 항과 상대속도 항이 통째로 사라진다.

$$\boxed{{}^A\dot V_Q = {}^A\dot V_{BORG} + {}^A\dot\Omega_B\times{}^A_BR\,{}^BQ + {}^A\Omega_B\times\left({}^A\Omega_B\times{}^A_BR\,{}^BQ\right)}$$

**기억할 필요 없음**: 유도 과정 자체(곱의 미분, 회전행렬 미분 대입). **이해**: 두 갈래로 나뉘는 이유 — "원점이 멀어지는가"라는 관절 종류의 차이 하나가 식을 결정한다는 구조. **꼭 기억**: 회전 관절만 다룰 거라면 마지막 박스 식 하나만 있으면 된다.

실제 매니퓰레이터 체인 표기($i \to i+1$)로 바꿔 쓴, 다음 강의에서 바로 쓰게 될 **실전 형태**는 다음과 같다(Craig, *Introduction to Robotics* 식 6.8 — 회전 관절 전용):

$${}^{i+1}\dot v_{i+1} = {}^{i+1}_{i}R\left[{}^i\dot v_i + {}^i\dot\omega_i \times {}^iP_{i+1} + {}^i\omega_i \times\left({}^i\omega_i \times {}^iP_{i+1}\right)\right]$$

[5-2의 속도 전파식](../jacobian-velocity-kinematics-link-propagation/main.md)과 마찬가지로 ${}^0v_0=0$(베이스 고정)에서 출발해 $i=0,1,2,\dots$ 순서로 리커시브하게 계산한다.

---

## 4. 각가속도 유도와 회전 관절 단순화

각가속도도 같은 방식으로 유도한다. 출발점은 [5장에서 다룬](../jacobian-velocity-kinematics-link-propagation/main.md) 각속도 합성식이다 — $\{B\}$가 $\{A\}$ 기준으로 ${}^A\Omega_B$로, $\{C\}$가 $\{B\}$ 기준으로 ${}^B\Omega_C$로 회전하는 경우:

$${}^A\Omega_C = {}^A\Omega_B + {}^A_BR\,{}^B\Omega_C$$

이걸 미분하면(회전행렬 미분에 다시 ${}^A\Omega_B\times{}^A_BR$ 대입):

$$\boxed{{}^A\dot\Omega_C = {}^A\dot\Omega_B + {}^A_BR\,{}^B\dot\Omega_C + {}^A\Omega_B\times{}^A_BR\,{}^B\Omega_C}$$

선가속도 때와 달리 각가속도 식은 원점 이동 여부와 무관하게 하나의 형태로 바로 관절(회전이든 직동이든)에 적용된다 — 회전은 원점 사이 거리와 상관없는 양이기 때문이다. 실전 리커시브 형태(Craig 식 6.7, 회전 관절 — $\dot\theta_{i+1},\ddot\theta_{i+1}$는 관절 $i+1$ 자체의 회전 기여분):

$${}^{i+1}\dot\omega_{i+1} = {}^{i+1}_{i}R\,{}^i\dot\omega_i + {}^{i+1}_{i}R\,{}^i\omega_i\times\dot\theta_{i+1}\,{}^{i+1}\hat Z_{i+1} + \ddot\theta_{i+1}\,{}^{i+1}\hat Z_{i+1}$$

**이해**: 선가속도와 각가속도 유도가 완전히 같은 패턴(속도 합성식을 미분 + 회전행렬 미분 대입)을 두 번 반복한 것이라는 점. **기억할 필요 없음**: 두 식의 세부 전개.

---

## 5. 토크와 회전 — 관성 모멘트라는 개념

가속도를 구했으니 이제 $F=MA$로 힘을 구할 차례인데, 회전에는 아직 손대지 않은 부분이 있다 — 토크와 각가속도 사이를 연결하는 매개체다.

$$F = Ma \quad\longleftrightarrow\quad \tau = I\alpha$$

직선 운동에서 진량(質量, mass) $M$은 "같은 힘을 줬을 때 얼마나 가속이 안 되는가"의 척도였다. 회전에서 그 역할을 하는 게 관성 모멘트(moment of inertia) $I$(또는 $J$)다. 그런데 진량과 결정적으로 다른 점이 하나 있다 — **회전축의 위치**에 따라 같은 물체라도 관성이 달라진다.

막대 모양의 무게추를 가운데(무게중심)를 잡고 돌리면 잘 안 돌지만, 세워서(긴 축을 회전축으로) 돌리면 훨씬 쉽게 돈다 — 같은 진량인데 회전 중심의 위치와 방향만으로 필요한 토크가 달라진다는 뜻이다.

**이해**: 관성 모멘트는 "회전에 대한 진량"이라는 개념은 진량과 같지만, 축의 위치·방향에 의존한다는 근본적 차이가 있다. **꼭 기억**: 단위가 $\text{kg}\cdot\text{m}^2$로 진량(kg)과 다르다 — 질량 분포가 회전축에서 얼마나 떨어져 있는지(거리)가 반영되기 때문이다.

역사적으로 관성 모멘트라는 개념은 1730년, 오일러(Euler)가 처음 도입했다 — 역학·수학 전반에 이름을 남긴 바로 그 오일러다.

---

## 6. 관성 텐서 — 스칼라가 될 수 없는 이유

진량은 방향에 상관없이 하나의 숫자(스칼라)면 충분했다 — 어느 방향으로 밀든 같은 진량이면 같은 가속도가 나온다. 관성 모멘트는 그럴 수 없다 — 팽이를 세워 돌리면 잘 돌지만, 같은 팽이를 눕혀 돌리면(진량은 같은데) 회전이 달라진다.

즉 회전축의 방향에 따라 관성이 다르므로, **관성을 하나의 스칼라가 아니라 방향별 값을 모두 담은 행렬(텐서)로 표현**해야 한다. 이렇게 방향에 따라 값이 달라지는 양을 텐서(tensor)라 부른다 — 딥러닝의 텐서(TensorFlow의 그 텐서)와 같은 어원의 "다양한 값의 조합"이라는 개념이다. 3차원 공간에서는 보통 $3\times3$ 행렬로 표현하며, 이를 관성 텐서(inertia tensor)라 한다.

좌표계 $\{A\}$ 기준으로 정의된 관성 텐서:

$${}^AI = \begin{bmatrix}I_{xx} & -I_{xy} & -I_{xz}\\-I_{xy} & I_{yy} & -I_{yz}\\-I_{xz} & -I_{yz} & I_{zz}\end{bmatrix}$$

- 대각 성분($I_{xx}, I_{yy}, I_{zz}$): 각 축을 중심으로 회전할 때의 관성 모멘트(principal moments of inertia에 대응하는 개념)
- 비대각 성분($I_{xy}, I_{xz}, I_{yz}$): 관성 곱(product of inertia) — 축이 기울어진 방향으로 돌 때 관성이 얼마나 "섞이는지"를 나타낸다

기준계 방향을 잘 선택하면(강체의 무게중심을 지나는 주축, principal axes) 비대각 성분을 전부 0으로 만들 수 있다. 하지만 로봇 팔의 링크는 그런 편한 축을 골라 쓸 수 없는 경우가 많아 일반적으로는 $3\times3$ 전체가 필요하다.

**이해**: 관성이 텐서인 이유(축 방향 의존성). **기억할 필요 없음**: 텐서라는 이름 자체의 수학적 정의 — "방향별 관성 값의 모음" 정도로 충분하다.

---

## 7. 회전 운동 에너지로부터 관성 텐서 유도

관성 텐서가 왜 저런 형태인지 가장 직관적으로 보여주는 방법은 회전 운동 에너지를 통해서다.

강체를 아주 작은 질량 덩어리 $m_i$들로 쪼갠다고 하자(마인크래프트의 블록처럼). 각 조각이 속도 $\vec v_i$로 움직인다면 전체 운동 에너지는 직선 운동 에너지 공식 $\tfrac12mv^2$을 그대로 합산한 것이다 — 단 $v_i$가 벡터이므로 제곱 대신 내적을 쓴다.

$$T = \sum_i \frac12 m_i\left(\vec v_i\cdot\vec v_i\right)$$

이제 이 조각이 회전축을 중심으로 반지름 $r_i$의 원운동을 한다고 하면, 선속도는 $v_i = r_i\omega$(원운동의 기본 관계)이므로:

$$T = \sum_i \frac12 m_i r_i^2\omega^2 = \frac12\left(\sum_i m_i r_i^2\right)\omega^2$$

괄호 안의 항이 바로 관성 모멘트다.

$$\boxed{I = \sum_i m_i r_i^2 \quad\Longrightarrow\quad T_r = \frac12 I\omega^2}$$

직선 운동의 $T=\tfrac12mv^2$과 정확히 대응되는 회전판이며, $I$는 "질량 대신 회전에 쓰는 개념"이라는 게 다시 한번 확인된다.

여기서 $r_i$는 회전축으로부터의 수직 거리다. 회전축 방향을 단위벡터 $\hat n$(방향 코사인 $\cos\alpha,\cos\beta,\cos\gamma$로 표현되는, $X,Y,Z$ 축과 이루는 각도)이라 하면:

$$r_{\perp,i} = |\vec r_i\sin\theta_i| = |\vec r_i\times\hat n|$$

이 외적을 $x_i,y_i,z_i$ 성분으로 풀어 제곱하고 $\sum m_i(\cdot)$로 정리하면, 축 방향 코사인 $\cos\alpha,\cos\beta,\cos\gamma$의 계수로 각각 $I_{xx},I_{yy},I_{zz},I_{xy},I_{xz},I_{yz}$가 나뉘어 등장한다 — 이게 앞서 6절의 $3\times3$ 관성 텐서가 만들어지는 이유다. (참고 영상: [Rotation of a Rigid Body about an Arbitrary Axis: Moments of Inertia](https://www.youtube.com/watch?v=K1c92HKeGGk), Pearson Education)

**기억할 필요 없음**: 외적을 $x_i,y_i,z_i$로 전개해 $I_{xy}$ 등을 뽑아내는 대수 전개 과정. **이해**: "축이 기울어진 방향으로 돌 때 관성 텐서가 필요한 이유"를 에너지 관점에서 얻었다는 결론.

---

## 8. 관성 텐서의 6개 성분 공식

정의를 적분식으로 쓰면(밀도 $\rho$, 부피 요소 $dv$):

$$I_{xx}=\iiint_V\left(y^2+z^2\right)\rho\,dv, \qquad I_{yy}=\iiint_V\left(x^2+z^2\right)\rho\,dv, \qquad I_{zz}=\iiint_V\left(x^2+y^2\right)\rho\,dv$$

$$I_{xy}=\iiint_V xy\,\rho\,dv, \qquad I_{xz}=\iiint_V xz\,\rho\,dv, \qquad I_{yz}=\iiint_V yz\,\rho\,dv$$

$\rho\,dv$는 아주 작은 질량 조각이고, 앞에 곱해지는 거리 제곱(또는 좌표곱)이 "그 조각이 회전축에서 얼마나 떨어져 있는가"를 나타낸다는 점에서 [7절](#7-회전-운동-에너지로부터-관성-텐서-유도)의 $I=\sum m_ir_i^2$과 본질적으로 같은 식이다.

대각·비대각 성분이 각각 위·아래 텐서 행렬의 같은 자리 3개씩과 겹치므로($I_{xy}$가 두 자리에 나오는 식), 실제로 구해야 하는 건 이 **6개뿐**이다.

**이해**: $I=\sum m_ir_i^2$이라는 하나의 개념이 축 조합에 따라 6개 적분식으로 갈라진다는 구조. **기억할 필요 없음**: 적분식 자체 — 실무에서는 계산기·CAD가 대신 해준다([10절](#10-실무에서-관성-텐서를-구하는-법)).

---

## 9. 예제 6.1 — 직육면체의 관성 텐서

균일 밀도 $\rho$를 가진, 폭 $w$(X축) · 길이 $l$(Y축) · 높이 $h$(Z축)인 직육면체가 있고, 원점을 직육면체의 한 모서리에 둔다고 하자. 적분 범위는 각각 $x:0\to w$, $y:0\to l$, $z:0\to h$다.

$$I_{xx}=\int_0^h\!\!\int_0^l\!\!\int_0^w\left(y^2+z^2\right)\rho\,dx\,dy\,dz$$

$x$에 대한 적분은 피적분함수가 $x$와 무관하므로 단순히 $w$를 곱하는 것과 같다.

$$=\int_0^h\!\!\int_0^l\left(y^2+z^2\right)w\rho\,dy\,dz$$

$y$에 대해 적분하면 $y^2\to l^3/3$, $z^2\to z^2l$:

$$=\int_0^h\left(\frac{l^3}{3}+z^2l\right)w\rho\,dz = \left(\frac{hl^3}{3}+\frac{lh^3}{3}\right)w\rho$$

전체 질량 $m=\rho\,whl$(밀도 × 부피)로 치환하면 깔끔해진다:

$$\boxed{I_{xx}=\frac{m}{3}\left(l^2+h^2\right)}$$

직육면체는 세 축이 대칭이므로 나머지 두 대각 성분은 적분을 새로 할 필요 없이 문자만 바꿔주면 된다:

$$I_{yy}=\frac{m}{3}\left(w^2+h^2\right), \qquad I_{zz}=\frac{m}{3}\left(w^2+l^2\right)$$

비대각 성분($I_{xy}$)도 같은 순서로 적분하되 피적분함수가 $xy$라서 각 축 적분이 독립적으로 떨어진다:

$$I_{xy}=\int_0^h\!\!\int_0^l\!\!\int_0^w xy\,\rho\,dx\,dy\,dz = \int_0^h\frac{w^2l^2}{4}\rho\,dz = \frac{m}{4}wl$$

같은 방식으로:

$$I_{xz}=\frac{m}{4}hw, \qquad I_{yz}=\frac{m}{4}hl$$

최종 관성 텐서:

$${}^AI=\begin{bmatrix}\dfrac{m}{3}(l^2+h^2) & -\dfrac{m}{4}wl & -\dfrac{m}{4}hw\\[4pt] -\dfrac{m}{4}wl & \dfrac{m}{3}(w^2+h^2) & -\dfrac{m}{4}hl\\[4pt] -\dfrac{m}{4}hw & -\dfrac{m}{4}hl & \dfrac{m}{3}(w^2+l^2)\end{bmatrix}$$

**이해**: 대칭 형상(직육면체)에서는 하나의 적분 패턴을 문자만 바꿔 재사용할 수 있다는 실전 팁. **기억할 필요 없음**: 최종 수치식 자체 — 직육면체 이외의 형상은 적분 범위·피적분함수가 전부 달라지므로 이 결과를 암기해도 재사용 가치가 낮다.

---

## 10. 실무에서 관성 텐서를 구하는 법

실무에서는 위 예제처럼 손으로 적분하는 일이 없다. 관성 텐서를 얻는 두 가지 현실적인 방법:

1. **측정** — 관성진자(inertia pendulum) 방법처럼, 물체를 특정 축 기준으로 매달아 진동시켜 실측한다.
2. **CAD 툴** — 로봇을 설계할 때 재질(알루미늄 합금 등)과 형상·두께를 CAD에 입력하면 관성 텐서가 자동으로 계산되어 나온다.

구(sphere)처럼 대칭성이 완벽한 형상은 예외적으로 방향에 관계없이 관성이 같아 스칼라 하나로 충분하지만, 대부분의 로봇 링크는 형상이 복잡해 이런 단순 공식이 통하지 않는다.

**꼭 기억**: 관성 텐서 자체는 "회전에 대한 특성을 전부 담은 값"이라는 개념만 알면 되고, 계산은 CAD·측정이 대신한다.

---

## 11. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| ${}^A\dot V_Q$ | 좌표계 $\{A\}$ 기준 점 $Q$의 선가속도 | ${}^AV_Q$(5장 속도)의 시간 미분 |
| ${}^A\dot\Omega_C$ | 좌표계 $\{A\}$ 기준 $\{C\}$의 각가속도 | ${}^A\Omega_C$의 시간 미분 |
| ${}^{i+1}\dot v_{i+1}={}^{i+1}_iR\left[{}^i\dot v_i+{}^i\dot\omega_i\times{}^iP_{i+1}+{}^i\omega_i\times({}^i\omega_i\times{}^iP_{i+1})\right]$ | 회전 관절 선가속도 전파 (Craig 식 6.8) | 원점 사이 거리 불변 가정 |
| ${}^{i+1}\dot\omega_{i+1}={}^{i+1}_iR\,{}^i\dot\omega_i+{}^{i+1}_iR\,{}^i\omega_i\times\dot\theta_{i+1}{}^{i+1}\hat Z_{i+1}+\ddot\theta_{i+1}{}^{i+1}\hat Z_{i+1}$ | 회전 관절 각가속도 전파 (Craig 식 6.7) | 관절 자체 회전 기여분 두 항 추가 |
| $\tau=I\alpha$ | 토크-각가속도 관계 | $F=MA$의 회전판, $I$가 진량 $M$에 대응 |
| ${}^AI=\begin{bmatrix}I_{xx}&-I_{xy}&-I_{xz}\\-I_{xy}&I_{yy}&-I_{yz}\\-I_{xz}&-I_{yz}&I_{zz}\end{bmatrix}$ | 관성 텐서 ($3\times3$) | 대각: 모멘트, 비대각: 곱(product of inertia) |
| $T_r=\dfrac12I\omega^2$ | 회전 운동 에너지 | $T=\tfrac12mv^2$의 회전판, $I=\sum m_ir_i^2$ |
| 역동역학 / 순동역학 | $(\theta,\dot\theta,\ddot\theta)\to\tau$ / $\tau\to(\theta,\dot\theta,\ddot\theta)$ | 제어용 / 시뮬레이션용 |

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 동역학의 위치 | 위치(기구학) + 속도(자코비안) + 정적 힘(static forces)을 전부 포함하는 상위 개념 — 가속도·토크까지 다룸 |
| 역동역학 / 순동역학 | $(\theta,\dot\theta,\ddot\theta)\to\tau$(제어에 사용) / $\tau\to(\theta,\dot\theta,\ddot\theta)$(시뮬레이션에 사용) |
| 선가속도 전파 (회전 관절) | ${}^{i+1}\dot v_{i+1}={}^{i+1}_iR\left[{}^i\dot v_i+{}^i\dot\omega_i\times{}^iP_{i+1}+{}^i\omega_i\times({}^i\omega_i\times{}^iP_{i+1})\right]$ |
| 각가속도 전파 (회전 관절) | ${}^{i+1}\dot\omega_{i+1}={}^{i+1}_iR\,{}^i\dot\omega_i+{}^{i+1}_iR\,{}^i\omega_i\times\dot\theta_{i+1}{}^{i+1}\hat Z_{i+1}+\ddot\theta_{i+1}{}^{i+1}\hat Z_{i+1}$ |
| 관성 모멘트 $I$ | 회전에서 진량 $M$에 대응하는 개념. 회전축의 위치·방향에 따라 값이 달라짐 (단위 $\text{kg}\cdot\text{m}^2$) |
| 관성 텐서 | $3\times3$ 행렬, 대각=모멘트($I_{xx},I_{yy},I_{zz}$)·비대각=곱($I_{xy},I_{xz},I_{yz}$) — 축 방향 의존성 때문에 스칼라 불가 |
| 에너지 유도 | $T=\sum\tfrac12m_iv_i^2$에 $v_i=r_i\omega$ 대입 → $I=\sum m_ir_i^2$, $T_r=\tfrac12I\omega^2$ |
| 예제 6.1 (직육면체) | $I_{xx}=\tfrac{m}{3}(l^2+h^2)$ 등 대각 3개, $I_{xy}=\tfrac{m}{4}wl$ 등 비대각 3개 — 총 6개만 구하면 됨 |
| 실무 | 손 적분은 아무도 안 함 — 관성진자 측정 또는 CAD 툴이 자동 계산 |
| 이해 vs 암기 | 모든 유도 과정은 "외울 필요 없음" — 개념(왜 필요한지)과 최종 리커시브 공식·6개 적분식의 존재만 기억하면 됨 |
