---
title: 자세공간 B·C 분리, 라그랑주 동역학과 작업공간 동역학 (Configuration-Space B-C Split, Lagrangian & Task-Space Dynamics)
date: 2026-08-08
tags: lagrangian, task-space
order: 
featured: false
draft: false
---

# 자세공간 B·C 분리, 라그랑주 동역학과 작업공간 동역학 (Configuration-Space B-C Split, Lagrangian & Task-Space Dynamics)

> 출처: 로봇제어공학 — Introduction to Robotics 6장 "머니퓰레이터 동역학(dynamics) III"
> 영상: https://www.youtube.com/watch?v=1bmS4wPRac0&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=18
> 대상: [6-3에서 정리한](../closed-form-dynamics-example-and-mass-coriolis-gravity-structure/main.md) $\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$ 구조를 출발점으로, $V$를 원심력·코리올리로 더 쪼개고(B·C 분리), 반복식이 아닌 에너지 기반의 라그랑주 방법으로 같은 답을 구하고, 마지막으로 관절공간 동역학을 손끝의 작업공간(task space) 동역학으로 옮기는 노트.

---

## 1. 자세공간 방정식 — V를 B·C로 더 쪼개기

[6-3에서 얻은](../closed-form-dynamics-example-and-mass-coriolis-gravity-structure/main.md) 2-링크 예제의 결과를 다시 가져온다.

$$\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$$

$$M(\Theta)=\begin{bmatrix}l_2^2m_2+2l_1l_2m_2c_2+l_1^2(m_1+m_2) & l_2^2m_2+l_1l_2m_2c_2\\ l_2^2m_2+l_1l_2m_2c_2 & l_2^2m_2\end{bmatrix},\quad V(\Theta,\dot\Theta)=\begin{bmatrix}-m_2l_1l_2s_2\dot\theta_2^2-2m_2l_1l_2s_2\dot\theta_1\dot\theta_2\\ m_2l_1l_2s_2\dot\theta_1^2\end{bmatrix}$$

**예제 6.4**는 여기서 한 걸음 더 들어가, $V(\Theta,\dot\Theta)$ 안에 섞여 있는 원심력 항(centrifugal, $\dot\theta_i^2$)과 코리올리 항(Coriolis, $\dot\theta_i\dot\theta_j,\ i\ne j$)을 완전히 분리한 **자세공간 방정식(configuration space equation)**을 만든다.

$$\boxed{\tau=M(\Theta)\ddot\Theta+B(\Theta)[\dot\Theta\dot\Theta]+C(\Theta)[\dot\Theta^2]+G(\Theta)}$$

- $B(\Theta)$: $n\times n(n-1)/2$ 코리올리 계수 행렬. $[\dot\Theta\dot\Theta]=[\dot\theta_1\dot\theta_2\ \dot\theta_1\dot\theta_3\ \cdots\ \dot\theta_{n-1}\dot\theta_n]^T$는 서로 다른 관절 속도끼리의 곱만 모은 $n(n-1)/2\times1$ 벡터다.
- $C(\Theta)$: $n\times n$ 원심력 계수 행렬. $[\dot\Theta^2]=[\dot\theta_1^2\ \dot\theta_2^2\ \cdots\ \dot\theta_n^2]^T$는 각 관절 속도의 제곱만 모은 $n\times1$ 벡터다.

$n=2$인 2-링크 예제에서는 $[\dot\Theta\dot\Theta]=[\dot\theta_1\dot\theta_2]$(스칼라 1개), $[\dot\Theta^2]=[\dot\theta_1^2\ \dot\theta_2^2]^T$이고, $B,C$는 $V$를 계수별로 재정렬해서 그대로 뽑아낸다.

$$B(\Theta)=\begin{bmatrix}-2m_2l_1l_2s_2\\0\end{bmatrix},\qquad C(\Theta)=\begin{bmatrix}0 & -m_2l_1l_2s_2\\ m_2l_1l_2s_2 & 0\end{bmatrix}$$

**검증**: $B[\dot\Theta\dot\Theta]+C[\dot\Theta^2]=\begin{bmatrix}-2m_2l_1l_2s_2\dot\theta_1\dot\theta_2\\0\end{bmatrix}+\begin{bmatrix}-m_2l_1l_2s_2\dot\theta_2^2\\ m_2l_1l_2s_2\dot\theta_1^2\end{bmatrix}=\begin{bmatrix}-m_2l_1l_2s_2\dot\theta_2^2-2m_2l_1l_2s_2\dot\theta_1\dot\theta_2\\ m_2l_1l_2s_2\dot\theta_1^2\end{bmatrix}$ — 위 $V(\Theta,\dot\Theta)$와 정확히 일치한다. **새 계산이 아니라 $V$를 원심력/코리올리 두 덩어리로 재포장한 것**이다.

**이해**: $B$의 각 성분이 코리올리(서로 다른 두 관절이 만나서 생기는 힘), $C$의 각 성분이 원심력(관절 하나가 자기 속도의 제곱으로 밖으로 밀어내는 힘)이라는 대응은 [6-3에서 정리한 원심력·코리올리 구분](../closed-form-dynamics-example-and-mass-coriolis-gravity-structure/main.md)과 완전히 같다.

---

## 2. 왜 이렇게 다시 쓰나 — 모든 계수가 θ만의 함수라는 것

$M,B,C,G$를 나눠 쓰는 이유는 계산량을 줄이기 위해서가 아니라 — 오히려 항을 하나 더 쪼갰으니 표현은 더 복잡해 보인다 — **네 행렬 모두가 관절 각도 $\Theta$만의 함수**라는 구조를 드러내기 위해서다.

- $M(\Theta)$: 예제의 $l_2^2m_2+2l_1l_2m_2c_2+l_1^2(m_1+m_2)$ 등 → 전부 $\cos\theta_2, \sin\theta_2$ 형태, 상수, 길이·질량의 함수.
- $B(\Theta), C(\Theta)$: $-2m_2l_1l_2s_2$ 등 → 역시 $\theta_2$의 함수. **관절 속도($\dot\theta$)는 전혀 안 들어있다** — 속도 항은 전부 $[\dot\Theta\dot\Theta],[\dot\Theta^2]$ 벡터 쪽으로 옮겨졌다.
- $G(\Theta)$: 중력항도 원래부터 $\theta$만의 함수였다.

이렇게 계수 행렬이 전부 $\Theta$만의 함수가 되는 공간을 **자세공간(configuration space)**이라 부른다 — $\theta_1$은 $0^\circ\sim360^\circ$(또는 $-180^\circ\sim180^\circ$), $\theta_2$도 같은 범위로 변할 수 있고, 그 각각의 값의 조합이 만드는 공간이라는 뜻이다.

실제로 $M,B,C,G$를 구하는 방법은 [반복식(iterative)](../manipulator-dynamics-acceleration-and-inertia-tensor/main.md)으로 구한 뒤 계수를 정리하는 방법과, 지금부터 볼 라그랑주 방법처럼 $M,B,C,G$ 각각을 처음부터 직접 구하는 방법 두 가지가 있다.

---

## 3. 라그랑주 동역학 — 반복식 대신 에너지로 풀기

뉴턴-오일러 방법이 "힘 = 질량 × 가속도"를 관절마다 순차적으로 적용했다면, 라그랑주 방법은 **에너지의 변화가 곧 외부에서 가해준 힘**이라는 원리에서 출발한다 — 고등학교 때 배운 "위치에너지가 운동에너지로 바뀐다"는 에너지 보존 문제를 힘이 개입하는 경우로 확장한 것이다.

### 운동에너지 K와 위치에너지 U

$i$번째 링크는 무게중심이 병진운동(선속도 $v_{C_i}$)과 회전운동(각속도 ${}^i\omega_i$)을 동시에 하므로, 운동에너지는 두 종류를 더한 값이다.

$$k_i=\frac12 m_i v_{C_i}^Tv_{C_i}+\frac12\,{}^i\omega_i^T\,{}^{C_i}I_i\,{}^i\omega_i$$

벡터의 제곱은 자기 자신과의 내적($v^Tv$)으로 쓰고, 회전 관성에너지는 $\frac12I\omega^2$의 행렬 버전이다 — 직선운동의 $\frac12mv^2$과 회전운동의 $\frac12I\omega^2$을 합친 꼴이라고 보면 된다. 전체 매니퓰레이터의 운동에너지는 각 링크의 운동에너지를 모두 더한 것이다.

$$k=\sum_{i=1}^n k_i$$

위치에너지는 $i$번째 링크의 무게중심 높이에 $m_ig$를 곱한 값이다. 기준점에서 무게중심까지의 위치벡터 ${}^0P_{C_i}$와 중력가속도 벡터 ${}^0g$의 내적으로 표현한다.

$$u_i=-m_i\,{}^0g^T\,{}^0P_{C_i}+u_{ref_i}$$

$u_{ref_i}$는 기준(reference) 위치에너지다. 관절이 로봇 무게중심에 있으면 위치벡터가 0이 되어 위치에너지가 0이 되는데, 실제로는 베이스가 바닥에서 떨어져 있는 등 초기값이 존재할 수 있다. 하지만 나중에 미분할 것이므로 이 상수항은 값이 무엇이든 상관없이 사라진다 — 물리적으로 넣어준 것뿐, 계산에는 의미 없는 항이다.

### 라그랑지안과 오일러-라그랑주 방정식

운동에너지와 위치에너지의 차이를 **라그랑지안(Lagrangian)** $\mathcal L$이라 정의한다.

$$\mathcal L=K-U$$

외부에서 에너지를 가하지 않으면 에너지는 보존되므로 위치·운동 에너지가 서로 바뀔 뿐 그 합은 일정하다. 외부에서 힘(토크)을 가하면 그 차이만큼 라그랑지안이 변한다는 것이 라그랑주가 세운 운동방정식이다.

$$\boxed{\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot\Theta}-\frac{\partial\mathcal L}{\partial\Theta}=\tau}$$

매니퓰레이터에서는 $K$가 $\Theta,\dot\Theta$ 둘 다의 함수, $U$는 $\Theta$만의 함수라는 점을 이용해 정리할 수 있다.

- $\dfrac{\partial\mathcal L}{\partial\dot\Theta}=\dfrac{\partial(K-U)}{\partial\dot\Theta}=\dfrac{\partial K}{\partial\dot\Theta}$ — $U$는 $\dot\Theta$에 대해 편미분하면 무조건 0이므로 사라진다.
- $\dfrac{\partial\mathcal L}{\partial\Theta}=\dfrac{\partial K}{\partial\Theta}-\dfrac{\partial U}{\partial\Theta}$ — $U$도 $\Theta$에 대해서는 남는다.

두 식을 대입하면 매니퓰레이터 운동방정식이 최종 형태로 정리된다.

$$\frac{d}{dt}\frac{\partial K}{\partial\dot\Theta}-\frac{\partial K}{\partial\Theta}+\frac{\partial U}{\partial\Theta}=\tau \tag{6.77}$$

**이해**: 여기서 $\tau$는 $n\times1$ 액추에이터 토크 벡터다. 이 식을 풀고 나면 [1절](#1-자세공간-방정식--v를-b·c로-더-쪼개기)에서처럼 $\ddot\theta$ 계수를 모아 $M$, $\dot\theta$ 관련 항을 모아 $V$(또는 $B,C$), $g$가 포함된 항을 모아 $G$로 정리할 수 있다 — 반복식과 답은 같고 구하는 경로만 다르다.

**기억할 필요 없음**: $k_i,u_i$ 공식 자체를 외울 필요는 없다 — 이 뒤에서 예제에 바로 쓸 것이므로 흐름만 이해하면 된다. **꼭 기억**: $\mathcal L=K-U$, 오일러-라그랑주 방정식의 형태, 그리고 $U$가 $\dot\Theta$의 함수가 아니라는 사실 덕분에 식이 단순해진다는 점.

---

## 4. 예제 6.5 — RP 매니퓰레이터를 라그랑주로 풀기

### 문제 설정

첫 번째 관절은 각도 $\theta_1$으로 회전하는 **회전(R) 관절**, 두 번째 관절은 길이 $d_2$만큼 뻗는 **직동(P, prismatic) 관절**이다. 점질량 $m_1$은 링크 1의 무게중심(관절에서 $l_1$ 떨어진 고정 위치)에, 점질량 $m_2$는 링크 2의 무게중심(관절에서 $d_2$ 떨어진, 프리스메틱 관절이 움직이면 같이 변하는 위치)에 있다. 각 링크는 무게중심 기준 관성 텐서를 갖는다.

$${}^{C_1}I_1=\begin{bmatrix}I_{xx1}&0&0\\0&I_{yy1}&0\\0&0&I_{zz1}\end{bmatrix},\qquad {}^{C_2}I_2=\begin{bmatrix}I_{xx2}&0&0\\0&I_{yy2}&0\\0&0&I_{zz2}\end{bmatrix}$$

두 링크 모두 $\hat Z$축(지면과 수직)으로만 회전하므로, 회전 운동에너지에는 $I_{zz}$ 성분만 살아남는다 — $X,Y$축 방향 회전은 애초에 존재하지 않기 때문이다.

### 각 링크의 운동에너지·위치에너지

**링크 1**(회전만, 선속도 없음 → $v=r\omega=l_1\dot\theta_1$):

$$k_1=\frac12m_1l_1^2\dot\theta_1^2+\frac12I_{zz1}\dot\theta_1^2,\qquad u_1=m_1l_1g\sin\theta_1+m_1l_1g$$

**링크 2**(회전 $+$ 프리스메틱 신장 — 두 방향 속도를 에너지로 그냥 더하면 됨. 에너지는 스칼라라서 방향별로 더해도 무방):

$$k_2=\frac12m_2\!\left(d_2^2\dot\theta_1^2+\dot d_2^2\right)+\frac12I_{zz2}\dot\theta_1^2,\qquad u_2=m_2gd_2\sin\theta_1+m_2gd_{2max}$$

$u_1,u_2$의 뒤에 붙은 $m_1l_1g$, $m_2gd_{2max}$는 기준 위치에너지($u_{ref}$)일 뿐이다. 어차피 미분하면 사라지는 상수라서 값이 얼마든 상관없다.

### 합산과 라그랑지안

$$K(\Theta,\dot\Theta)=\frac12(m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2)\dot\theta_1^2+\frac12m_2\dot d_2^2$$

$$U(\Theta)=g(m_1l_1+m_2d_2)\sin\theta_1+m_1l_1g+m_2gd_{2max}$$

### 편미분 — (6.77)에 대입

관절 1의 변수는 $\theta_1$(회전 관절), 관절 2의 변수는 $d_2$(프리스메틱 관절)라는 점에 주의한다 — "$\Theta$에 대해 미분"은 각 관절의 변수로 미분하라는 뜻이다.

$$\frac{\partial K}{\partial\dot\Theta}=\begin{bmatrix}(m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2)\dot\theta_1\\ m_2\dot d_2\end{bmatrix},\quad \frac{\partial K}{\partial\Theta}=\begin{bmatrix}0\\ m_2d_2\dot\theta_1^2\end{bmatrix},\quad \frac{\partial U}{\partial\Theta}=\begin{bmatrix}g(m_1l_1+m_2d_2)\cos\theta_1\\ gm_2\sin\theta_1\end{bmatrix}$$

$\partial K/\partial\Theta$의 첫 성분이 0인 이유: $K$의 첫 항을 $\theta_1$으로 미분하면 $\theta_1$이 애초에 식에 없으므로(계수에만 $d_2$가 있음) 0이 된다. 둘째 성분은 $\frac12m_2d_2^2\dot\theta_1^2$을 $d_2$로 미분해서 나온다.

### 최종 토크와 M·V·G

$$\tau_1=(m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2)\ddot\theta_1+2m_2d_2\dot\theta_1\dot d_2+(m_1l_1+m_2d_2)g\cos\theta_1$$

$$\tau_2=m_2\ddot d_2-m_2d_2\dot\theta_1^2+m_2g\sin\theta_1$$

정리하면 [1절과 같은 구조](#1-자세공간-방정식--v를-b·c로-더-쪼개기)로 바로 재포장된다.

$$M(\Theta)=\begin{bmatrix}m_1l_1^2+I_{zz1}+I_{zz2}+m_2d_2^2 & 0\\ 0 & m_2\end{bmatrix},\quad V(\Theta,\dot\Theta)=\begin{bmatrix}2m_2d_2\dot\theta_1\dot d_2\\ -m_2d_2\dot\theta_1^2\end{bmatrix},\quad G(\Theta)=\begin{bmatrix}(m_1l_1+m_2d_2)g\cos\theta_1\\ m_2g\sin\theta_1\end{bmatrix}$$

**이해**: [반복 뉴턴-오일러](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)로 이 문제를 풀려면 회전·프리스메틱이 섞인 관절, 무게중심에 있는 점질량, 0이 아닌 관성 텐서까지 다뤄야 해서 손으로 풀기 매우 번거롭다. 반면 라그랑주 방법은 각 링크의 운동·위치 에너지를 스칼라로 더하고 편미분 두 번만 하면 끝난다 — **에너지는 좌표계 변환·외적·행렬 곱셈이 필요 없는 스칼라**이기 때문이다.

---

## 5. 반복식 vs 라그랑주 — 언제 뭘 쓰나

| | 반복 뉴턴-오일러(iterative) | 라그랑주(closed-form) |
|---|---|---|
| 절차 | [외향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md) → [내향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md), 관절마다 힘·토크를 순차 전파 | 각 링크의 $K,U$를 스칼라로 더하고 $\mathcal L$을 편미분 |
| 이해 난이도 | 단계별로 눈에 보여서 이해하기 쉬움 | 에너지 감각과 편미분에 익숙해야 함 |
| 계산량 | 관절 수만큼 단계가 늘어나고 계산이 많음, 하지만 절차가 기계적이라 프로그래밍하기 좋음 | 잘 풀리면 훨씬 짧고 빠름 — 하지만 로봇 형상이 복잡(둥근 디자인 등)하면 에너지 표현 자체가 어려워짐 |
| 실무 | 일반적인 모든 경우에 항상 적용 가능 | 잘 풀리면 계산량이 적어 실시간 제어에 유리, 막히면 매우 막힘 |

로봇을 잘 설계해서 관절이 직각으로 꺾이거나 일렬로 맞춰지는 형태면 라그랑주도 쉽게 구해지지만, 둥글둥글한 디자인이면 에너지 표현 자체가 어려워져 반복식으로 돌아가는 편이 낫다 — 라그랑주는 잘 풀리면 매우 간단하고 막히면 매우 막히는 양극단의 방법이다.

---

## 6. 작업공간(직교좌표) 동역학 — 자코비안으로 손끝 힘 구하기

지금까지 구한 $\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$는 "관절 각도·각속도·각가속도를 알 때 필요한 관절 토크"를 알려준다. 그런데 실제로 더 궁금한 것은 **손끝(작업공간, task space)의 가속도로 인해 손끝에 걸리는 힘**이다 — 골프채로 공을 칠 때, 관절 토크보다 "손끝이 공에 얼마의 힘을 주는가"가 직접적인 관심사이기 때문이다.

### 손끝 힘·가속도의 동역학 방정식

관절공간과 똑같은 형태로, 손끝(직교좌표) 공간에도 상태공간 방정식을 쓸 수 있다.

$$\boxed{\mathcal F=M_x(\Theta)\ddot\chi+V_x(\Theta,\dot\Theta)+G_x(\Theta)}$$

- $\mathcal F$: 손끝(말단 효과 장치)에 작용하는 $n\times1$ 힘-토크 벡터.
- $\chi$: 손끝의 위치·방위를 나타내는 직교좌표계 벡터.
- $M_x(\Theta)$: 직교좌표 질량행렬(Cartesian mass matrix), $V_x,G_x$: 직교좌표 공간에서의 속도항·중력항.

### 유도 — 자코비안 전치와 미분

[5장에서 구한](../jacobian-static-forces-and-geometric-jacobian/main.md) $\tau=J^T(\Theta)\mathcal F$에 관절공간 방정식을 대입한다.

$$J^T\mathcal F=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$$

양변에 왼쪽부터 $J^{-T}$(자코비안 전치의 역)를 곱하면 $\mathcal F$가 좌변에 남는다.

$$\mathcal F=J^{-T}M(\Theta)\ddot\Theta+J^{-T}V(\Theta,\dot\Theta)+J^{-T}G(\Theta)$$

여기에 [5장에서 정의한](../jacobian-velocity-kinematics-link-propagation/main.md) $\dot\chi=J(\Theta)\dot\Theta$를 시간에 대해 한 번 더 미분하면 $\ddot\Theta$를 $\ddot\chi$로 바꿀 수 있다.

$$\ddot\chi=\dot J\dot\Theta+J\ddot\Theta\quad\Longrightarrow\quad \ddot\Theta=J^{-1}\ddot\chi-J^{-1}\dot J\dot\Theta$$

이걸 대입해서 정리하면:

$$\mathcal F=J^{-T}M(\Theta)J^{-1}(\Theta)\,\ddot\chi\;-\;J^{-T}M(\Theta)J^{-1}(\Theta)\dot J(\Theta)\dot\Theta\;+\;J^{-T}V(\Theta,\dot\Theta)\;+\;J^{-T}G(\Theta)$$

맨 위 상태공간 방정식($\mathcal F=M_x\ddot\chi+V_x+G_x$)과 계수를 하나씩 비교하면 세 행렬이 그대로 정의된다.

$$M_x(\Theta)=J^{-T}(\Theta)M(\Theta)J^{-1}(\Theta)$$

$$V_x(\Theta,\dot\Theta)=J^{-T}(\Theta)\Big(V(\Theta,\dot\Theta)-M(\Theta)J^{-1}(\Theta)\dot J(\Theta)\dot\Theta\Big)$$

$$G_x(\Theta)=J^{-T}(\Theta)G(\Theta)$$

두 식을 다시 합치면 관절 토크 → 손끝 가속도의 관계식 하나로 정리된다.

$$\boxed{\tau=J^T(\Theta)\Big(M_x(\Theta)\ddot\chi+V_x(\Theta,\dot\Theta)+G_x(\Theta)\Big)}$$

**이해**: 이 식은 방향이 두 가지로 다 쓰인다 — 손끝이 낼 가속도 $\ddot\chi$를 알면 필요한 관절 토크 $\tau$가 나오고(순방향 제어), 반대로 원하는 손끝 힘 $\mathcal F$가 정해져 있으면 $\ddot\chi=M_x^{-1}(\mathcal F-V_x-G_x)$로 필요한 손끝 가속도를 역산할 수도 있다 — 골프스윙 로봇처럼 공에 맞는 순간 필요한 힘·토크를 역으로 계산하는 경우가 그 예다.

---

## 7. 비강체 효과 — 점성마찰과 쿨롱마찰

지금까지의 $\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$는 마찰이 전혀 없는 이상적인 강체(rigid body) 가정이었다. 실제 구동기(모터, 기어)에는 마찰이 필연적으로 존재하고, 대표적으로 두 가지 모델이 쓰인다.

- **점성마찰(viscous friction)** — 자동차가 빠르게 달릴수록 바람저항이 커지는 것과 같은 원리로, 속도에 비례하는 마찰. $\tau_{friction}=v\dot\theta$ ($v$는 점성 계수).
- **쿨롱마찰(Coulomb friction)** — 움직이기 시작하는 순간의 구름마찰. 속도의 크기가 아니라 **부호(방향)**에만 영향을 받고, 항상 속도 반대 방향으로 일정한 크기의 힘을 가한다. $\tau_{friction}=c\,\text{sgn}(\dot\theta)$.

두 가지를 합치면 마찰 토크는 관절 각도·각속도의 함수가 된다.

$$\tau_{friction}=c\,\text{sgn}(\dot\theta)+v\dot\theta=f(\theta,\dot\theta)$$

최종적으로 마찰까지 포함한 완전한 매니퓰레이터 동역학 방정식은 다음과 같다.

$$\boxed{\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)+F(\Theta,\dot\Theta)}$$

---

## 8. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| $B(\Theta),\ [\dot\Theta\dot\Theta]$ | 코리올리 계수 행렬($n\times n(n-1)/2$), 서로 다른 관절 속도곱 벡터 | 1절 |
| $C(\Theta),\ [\dot\Theta^2]$ | 원심력 계수 행렬($n\times n$), 관절 속도 제곱 벡터 | 1절 |
| $\mathcal L=K-U$ | 라그랑지안 | 3절 |
| $\dfrac{d}{dt}\dfrac{\partial\mathcal L}{\partial\dot\Theta}-\dfrac{\partial\mathcal L}{\partial\Theta}=\tau$ | 오일러-라그랑주 운동방정식 | 매니퓰레이터에서는 (6.77)로 단순화 |
| $k_i,u_i$ | $i$번째 링크의 운동·위치 에너지 | $k_i=\frac12m_iv_{C_i}^Tv_{C_i}+\frac12{}^i\omega_i^T{}^{C_i}I_i{}^i\omega_i$ |
| $\mathcal F,\ \chi$ | 손끝 힘-토크 벡터, 손끝 위치·방위 벡터 | 5-4의 $\tau=J^T\mathcal F$와 같은 표기 |
| $M_x,V_x,G_x$ | 직교좌표(작업공간) 질량행렬·속도항·중력항 | $M_x=J^{-T}MJ^{-1}$ 등 |
| $\tau_{friction}=v\dot\theta$ | 점성마찰 | 속도에 비례 |
| $\tau_{friction}=c\,\text{sgn}(\dot\theta)$ | 쿨롱마찰 | 속도 부호에만 의존 |

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| B·C 분리 | $\tau=M\ddot\Theta+B[\dot\Theta\dot\Theta]+C[\dot\Theta^2]+G$ — $V$를 코리올리($B$)·원심력($C$)으로 재포장, $M,B,C,G$ 모두 $\Theta$만의 함수(자세공간) |
| 라그랑지안 | $\mathcal L=K-U$, $K=\sum k_i$(병진+회전 에너지), $U=\sum u_i$(무게중심 높이 기반) |
| 오일러-라그랑주 | $\frac{d}{dt}\frac{\partial K}{\partial\dot\Theta}-\frac{\partial K}{\partial\Theta}+\frac{\partial U}{\partial\Theta}=\tau$ — $U$가 $\dot\Theta$의 함수가 아니라서 단순화됨 |
| 예제 6.5 (RP 매니퓰레이터) | 회전+프리스메틱 혼합, 무게중심 점질량+관성텐서 — 반복식은 번거롭지만 라그랑주는 $K,U$ 편미분 두 번으로 끝 |
| 반복식 vs 라그랑주 | 반복식=항상 적용 가능·이해 쉬움 / 라그랑주=잘 풀리면 훨씬 간단·형상이 복잡하면 막힘 |
| 작업공간 동역학 | $\mathcal F=M_x\ddot\chi+V_x+G_x$, $M_x=J^{-T}MJ^{-1}$, $V_x=J^{-T}(V-MJ^{-1}\dot J\dot\Theta)$, $G_x=J^{-T}G$ — $\tau=J^T(M_x\ddot\chi+V_x+G_x)$로 관절·손끝 동역학이 하나로 연결됨 |
| 마찰 | $\tau_{friction}=c\,\text{sgn}(\dot\theta)+v\dot\theta$ — 완전한 방정식은 $\tau=M\ddot\Theta+V+G+F(\Theta,\dot\Theta)$ |
