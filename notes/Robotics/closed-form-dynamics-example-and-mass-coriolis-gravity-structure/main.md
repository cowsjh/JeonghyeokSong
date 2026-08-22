---
title: 폐형식 동역학 방정식 예제와 M-V-G 구조 (Closed-Form Dynamics Example & Mass-Coriolis-Gravity Structure)
date: 2026-08-08
tags: newton-euler, torque-control
order: 
featured: false
draft: false
---

# 폐형식 동역학 방정식 예제와 M-V-G 구조 (Closed-Form Dynamics Example & Mass-Coriolis-Gravity Structure)

> 출처: 로봇제어공학 — Introduction to Robotics 6장 "머니퓰레이터 동역학(dynamics) II"
> 영상: https://www.youtube.com/watch?v=PaFjc7u9elk&list=PLP4rlEcTzeFIvgNQD8M1T7_PzxO3JNK5Z&index=17
> 대상: [6-2에서 세운 반복 뉴턴-오일러 알고리즘](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)을 실제 2-링크 평면 매니퓰레이터에 대입해 손으로 끝까지 풀어보고, 그 결과를 $\tau=M(\theta)\ddot\theta+V(\theta,\dot\theta)+G(\theta)$라는 표준 형태로 정리하는 노트.

---

## 1. 왜 손으로 한 번은 풀어봐야 하는가

[6-2](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에서 세운 반복식은 기호($i, i+1, C_i$…)로만 존재했다. 기호 자체는 깔끔하지만, 실제로 숫자·구체적 벡터를 대입해 끝까지 풀어보지 않으면 "어디서 뭐가 사라지고 뭐가 남는지" 감이 오지 않는다.

그래서 이 노트는 교재에서 가장 단순한 예제 — 평면 2-링크 매니퓰레이터 — 를 골라 [1단계 외향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)과 [2단계 내향 반복](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)을 실제로 끝까지 대입한다.

---

## 2. 문제 설정 — 2-링크 평면 매니퓰레이터와 단순화 가정

교재 Figure 6.6은 두 링크가 모두 평면(같은 평면) 위에서 회전하는 로봇이다. 관절축은 둘 다 $\hat Z_0$ 방향(지면과 수직, 그림 밖으로 나오는 방향)이고, $\theta_1$은 지면(${}^0\hat X_0$)에서 링크 1까지의 각도, $\theta_2$는 링크 1의 연장선(그림의 점선)에서 링크 2까지의 상대 각도다.

문제를 손으로 풀 수 있게 하려고 세 가지를 가정한다.

| 가정 | 식으로 표현 | 왜 필요한가 |
|---|---|---|
| **질량이 링크 끝(원단)에 점질량으로 몰려 있다** | ${}^1P_{C_1}=l_1\hat X_1$, ${}^2P_{C_2}=l_2\hat X_2$ | 실제로는 무게중심이 링크 중간 어딘가에 분포하지만, 그러면 무게중심 위치 계산이 훨씬 복잡해진다. 끝에 몰아두면 "무게중심까지의 거리 = 링크 길이"로 바로 쓸 수 있다. |
| **점질량이므로 관성 텐서가 0** | ${}^{C_1}I_1=0$, ${}^{C_2}I_2=0$ | 관성 텐서는 물체가 "퍼져 있는 정도"에서 나오는데, 점질량은 퍼짐이 없으므로 회전 관성 자체가 없다. |
| **손끝에 걸리는 외력·외토크가 없고, 베이스는 고정** | $f_3=0,\ n_3=0,\ \omega_0=0,\ \dot\omega_0=0$ | 순수하게 로봇 자신의 관성·중력만으로 필요한 토크를 구하는 문제로 단순화한다. |

여기에 [6-2의 중력 트릭](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)을 그대로 적용해 베이스 초기 가속도를 중력가속도로 둔다.

$${}^0\dot v_0 = g\hat Y_0$$

**꼭 기억**: 이 세 가정(점질량 → 텐서 0, 손끝 힘 없음, 베이스 고정+중력 트릭) 덕분에 [6-2의 6개 재귀식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에서 살아남는 항이 크게 줄어든다. 실제 로봇에서는 이 가정 중 어느 것도 성립하지 않는다는 점도 함께 기억할 것.

---

## 3. 1단계 외향 반복 — 링크 1 계산

[6-2의 외향 반복식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에 $i=0$을 대입한다. 미리 로테이션 행렬을 써 두면 편하다.

$${}^0_1R=\begin{bmatrix}c_1&-s_1&0\\s_1&c_1&0\\0&0&1\end{bmatrix}$$

**각속도·각가속도** — ${}^0\omega_0=0,\ {}^0\dot\omega_0=0$이므로 회전행렬이 곱해지는 항은 전부 사라지고, 관절 자체의 회전 기여분만 남는다.

$${}^1\omega_1=\begin{bmatrix}0\\0\\\dot\theta_1\end{bmatrix},\qquad {}^1\dot\omega_1=\begin{bmatrix}0\\0\\\ddot\theta_1\end{bmatrix}$$

**관절 원점 선가속도** — $0$번과 $1$번 관절이 붙어 있어 ${}^0P_1=0$이므로, [재귀식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)의 앞 두 항이 자동으로 0이 되고 회전만 남는다.

$${}^1\dot v_1={}^1_0R\,{}^0\dot v_0={}^1_0R\begin{bmatrix}0\\g\\0\end{bmatrix}=\begin{bmatrix}gs_1\\gc_1\\0\end{bmatrix}$$

**무게중심 선가속도** — ${}^1P_{C_1}=[l_1,0,0]^T$를 대입해 외적을 두 번 전개한다.

$${}^1\dot\omega_1\times{}^1P_{C_1}=\begin{bmatrix}0\\l_1\ddot\theta_1\\0\end{bmatrix},\qquad {}^1\omega_1\times\left({}^1\omega_1\times{}^1P_{C_1}\right)=\begin{bmatrix}-l_1\dot\theta_1^2\\0\\0\end{bmatrix}$$

세 항(위 둘 + ${}^1\dot v_1$)을 더하면:

$$\boxed{{}^1\dot v_{C_1}=\begin{bmatrix}gs_1-l_1\dot\theta_1^2\\ l_1\ddot\theta_1+gc_1\\0\end{bmatrix}}$$

**힘·토크** — [6절의 $F=m\dot v_C$, $N={}^CI\dot\omega+\omega\times{}^CI\omega$](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)를 그대로 대입한다.

$${}^1F_1=m_1\begin{bmatrix}gs_1-l_1\dot\theta_1^2\\ l_1\ddot\theta_1+gc_1\\0\end{bmatrix},\qquad {}^1N_1=0$$

$N_1$이 통째로 0인 이유는 단 하나 — [2절의 점질량 가정](#2-문제-설정--2-링크-평면-매니퓰레이터와-단순화-가정) 때문에 ${}^{C_1}I_1=0$이라서, $\dot\omega$·$\omega\times{}^CI\omega$ 두 항이 애초에 0을 곱하고 있기 때문이다. 실제 링크(퍼진 질량)라면 이 항이 절대 0이 될 수 없다.

**기억할 필요 없음**: 위 대수 전개 자체 — 회전행렬을 미리 구해두고 순서대로 대입하면 기계적으로 나온다는 흐름만 기억하면 된다.

---

## 4. 링크 2도 같은 절차 — 이해 vs 암기

링크 2는 $i=1$을 대입해 똑같은 6개 식($\omega_2,\dot\omega_2,\dot v_2,\dot v_{C_2},F_2,N_2$)을 반복 계산한다.

**이해**: 링크 1과 링크 2의 계산 절차는 완전히 동일하다 — $i$만 하나씩 밀려서 대입될 뿐, 새로운 개념이 등장하지 않는다. **기억할 필요 없음**: 링크 2의 전개 과정 전체. 대신 [다음 절](#5-2단계-내향-반복--손끝에서-거꾸로)에서 이 결과를 바로 가져다 쓴다.

---

## 5. 2단계 내향 반복 — 손끝에서 거꾸로

[6-2의 내향 반복식](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에 [2절의 가정](#2-문제-설정--2-링크-평면-매니퓰레이터와-단순화-가정)($f_3=n_3=0$)을 대입해 손끝(링크 2)부터 거슬러 올라간다.

**링크 2** — 다음 링크가 없으므로(손끝이 마지막) 전달받는 힘·토크가 0이고, 자기 자신의 관성력·관성토크만 남는다.

$${}^2f_2={}^2F_2,\qquad {}^2n_2=\begin{bmatrix}0\\0\\m_2l_1l_2c_2\ddot\theta_1+m_2l_1l_2s_2\dot\theta_1^2+m_2l_2gc_{12}+m_2l_2^2(\ddot\theta_1+\ddot\theta_2)\end{bmatrix}$$

**링크 1** — 링크 2가 전달하는 힘·토크(회전행렬로 좌표계만 맞춘 것)에 링크 1 자체의 관성력·관성토크, 그리고 힘이 무게중심·관절에서 떨어진 지점에 작용해서 생기는 모멘트 항들이 더해진다.

$${}^1f_1=\begin{bmatrix}c_2&-s_2&0\\s_2&c_2&0\\0&0&1\end{bmatrix}\begin{bmatrix}m_2l_1s_2\ddot\theta_1-m_2l_1c_2\dot\theta_1^2+m_2gs_{12}-m_2l_2(\dot\theta_1+\dot\theta_2)^2\\ m_2l_1c_2\ddot\theta_1+m_2l_1s_2\dot\theta_1^2+m_2gc_{12}+m_2l_2(\ddot\theta_1+\ddot\theta_2)\\0\end{bmatrix}+\begin{bmatrix}-m_1l_1\dot\theta_1^2+m_1gs_1\\ m_1l_1\ddot\theta_1+m_1gc_1\\0\end{bmatrix}$$

$${}^1n_1=\begin{bmatrix}0\\0\\m_2l_1l_2c_2\ddot\theta_1+m_2l_1l_2s_2\dot\theta_1^2+m_2l_2gc_{12}+m_2l_2^2(\ddot\theta_1+\ddot\theta_2)\end{bmatrix}+\begin{bmatrix}0\\0\\m_1l_1^2\ddot\theta_1+m_1l_1gc_1\end{bmatrix}+\begin{bmatrix}0\\0\\m_2l_1^2\ddot\theta_1-m_2l_1l_2s_2(\dot\theta_1+\dot\theta_2)^2+m_2l_1gs_2s_{12}+m_2l_1l_2c_2(\ddot\theta_1+\ddot\theta_2)+m_2l_1gc_2c_{12}\end{bmatrix}$$

각 식이 뜻하는 바는 [6-2 8절](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)에서 이미 정리했다 — ${}^1f_1$은 "다음 링크가 미는 힘 + 자체 관성력", ${}^1n_1$은 "자체 관성 토크 + 다음 링크가 전달하는 토크 + 힘 때문에 생기는 모멘트 두 개"라는 구조 그대로다. 여기서는 그 구조에 숫자를 채워 넣은 것뿐이다.

**기억할 필요 없음**: 위 식들의 성분 하나하나. **꼭 기억**: ${}^1n_1$의 세 덩어리가 각각 "링크 2에서 넘어온 토크", "링크 1 자체 관성토크", "힘 때문에 생기는 모멘트"라는 것 — 이 구조는 관절이 몇 개든 항상 똑같다.

---

## 6. 관절 토크 추출 — 최종 폐형식 결과

[6-2에서 정한 규칙](../parallel-axis-theorem-and-newton-euler-algorithm/main.md)대로, 회전 관절의 토크는 토크 벡터의 $z$ 성분이다 ($\tau_i={}^in_i^T\,{}^i\hat Z_i$). [5절](#5-2단계-내향-반복--손끝에서-거꾸로)의 ${}^2n_2$, ${}^1n_1$은 애초에 $z$ 성분만 값이 있으므로 그 값을 그대로 읽으면 된다.

$$\boxed{\tau_1=m_2l_2^2(\ddot\theta_1+\ddot\theta_2)+m_2l_1l_2c_2(2\ddot\theta_1+\ddot\theta_2)+(m_1+m_2)l_1^2\ddot\theta_1-m_2l_1l_2s_2\dot\theta_2^2-2m_2l_1l_2s_2\dot\theta_1\dot\theta_2+m_2l_2gc_{12}+(m_1+m_2)l_1gc_1}$$

$$\boxed{\tau_2=m_2l_1l_2c_2\ddot\theta_1+m_2l_1l_2s_2\dot\theta_1^2+m_2l_2gc_{12}+m_2l_2^2(\ddot\theta_1+\ddot\theta_2)}$$

$\tau_2$는 [5절](#5-2단계-내향-반복--손끝에서-거꾸로)의 ${}^2n_2$ z성분을 그대로 옮긴 것뿐이고, $\tau_1$은 ${}^1n_1$ 세 덩어리의 $z$ 성분(${}^1l_1l_2$ 항 + $m_1l_1^2\ddot\theta_1+m_1l_1gc_1$ + 마지막 덩어리)을 모두 더한 결과다. 이 $\tau_1,\tau_2$대로 각 관절에 토크를 가하면 손끝에 원하는 힘이 제어된다.

**이해**: 두 식 모두 $\ddot\theta_1,\ddot\theta_2$(가속도) · $\dot\theta_1^2,\dot\theta_1\dot\theta_2,\dot\theta_2^2$(속도 제곱·곱) · $c_1,c_{12}$(중력, 각도) 세 종류의 항으로만 이루어져 있다 — 이 패턴이 [다음 절](#7-동역학-방정식의-구조--τ--mθθ̈--vθθ̇--gθ)의 $M,V,G$ 분리로 바로 이어진다.

---

## 7. 동역학 방정식의 구조 — τ = M(θ)θ̈ + V(θ,θ̇) + G(θ)

관절이 몇 개든 매번 [6절](#6-관절-토크-추출--최종-폐형식-결과) 같은 긴 식을 그대로 쓰는 건 비효율적이다. [5장에서 속도들을 자코비안 행렬 하나로 묶었던 것](../jacobian-velocity-kinematics-link-propagation/main.md)과 똑같은 방식으로, $\tau_1,\tau_2$ 식의 각 항을 **무엇에 곱해져 있는가**(가속도 / 속도 제곱·곱 / 각도)를 기준으로 재배열한다.

$$\boxed{\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)}$$

**1단계 — 가속도 항($\ddot\theta_1,\ddot\theta_2$) 계수를 모아 $M$을 만든다.** [6절](#6-관절-토크-추출--최종-폐형식-결과) 식에서 $\ddot\theta_1$ 앞에 붙은 계수들과 $\ddot\theta_2$ 앞에 붙은 계수들을 각각 걷어내 $2\times2$ 행렬로 쓴다.

$$M(\Theta)=\begin{bmatrix}l_2^2m_2+2l_1l_2m_2c_2+l_1^2(m_1+m_2) & l_2^2m_2+l_1l_2m_2c_2\\ l_2^2m_2+l_1l_2m_2c_2 & l_2^2m_2\end{bmatrix}$$

**2단계 — 속도 제곱·곱 항을 모아 $V$를 만든다.** $\dot\theta_1^2,\dot\theta_1\dot\theta_2,\dot\theta_2^2$가 곱해진 항만 골라낸다.

$$V(\Theta,\dot\Theta)=\begin{bmatrix}-m_2l_1l_2s_2\dot\theta_2^2-2m_2l_1l_2s_2\dot\theta_1\dot\theta_2\\ m_2l_1l_2s_2\dot\theta_1^2\end{bmatrix}$$

**3단계 — 중력가속도 $g$가 들어간 항을 모아 $G$를 만든다.**

$$G(\Theta)=\begin{bmatrix}m_2l_2gc_{12}+(m_1+m_2)l_1gc_1\\ m_2l_2gc_{12}\end{bmatrix}$$

세 행렬을 다시 곱하고 더하면 [6절의 $\tau_1,\tau_2$](#6-관절-토크-추출--최종-폐형식-결과)가 정확히 재현된다 — $M,V,G$는 새로운 계산이 아니라 **같은 답을 재포장한 것**이다.

**기억할 필요 없음**: $M,V,G$ 각 성분을 손으로 뽑아내는 계수 정리 과정. **꼭 기억**: $\tau=M\ddot\Theta+V+G$라는 형태 자체와, $M$ = 가속도 계수(질량행렬) / $V$ = 속도 제곱·곱 계수(원심력·코리올리) / $G$ = 중력 계수라는 대응 관계.

---

## 8. M, V, G의 물리적 의미

| 행렬 | 이름 | 물리적 의미 |
|---|---|---|
| $M(\Theta)$ | 질량 행렬(mass matrix) | $n\times n$, 대칭(symmetric)이고 양의 정치(positive definite) — 그래서 역행렬이 항상 존재한다 |
| $V(\Theta,\dot\Theta)$ | 원심력·코리올리 항 | $n\times1$, 관절 속도의 영향을 받는 모든 항을 포함 |
| $G(\Theta)$ | 중력 항 | $n\times1$, 중력상수 $g$가 포함된 항만 모음 |

$V$ 안에서도 두 종류가 구분된다 — **관절 속도의 제곱**($\dot\theta_1^2,\dot\theta_2^2$)에 비례하는 항은 원심력(centrifugal force), **서로 다른 두 관절 속도의 곱**($\dot\theta_1\dot\theta_2$)에 비례하는 항은 코리올리 힘(Coriolis force)이다. [위 $V$ 행렬](#7-동역학-방정식의-구조--τ--mθθ̈--vθθ̇--gθ)의 $-m_2l_1l_2s_2\dot\theta_2^2$와 $m_2l_1l_2s_2\dot\theta_1^2$는 원심력, $-2m_2l_1l_2s_2\dot\theta_1\dot\theta_2$는 코리올리 항이다.

코리올리 힘의 물리적 직관은 회전판(LP판) 비유로 설명된다 — 회전하는 판 위에서 판 중심 방향으로 공을 던지면, 판 밖에서 보기엔 직선이어야 할 궤적이 휘어져 보인다. 판(회전 좌표계) 자체가 움직이면서 공의 운동에 간섭하기 때문이다.

**이해**: 로봇 팔에서 코리올리 항이 나오는 이유도 근본적으로 같다 — 링크 2가 링크 1이라는 "회전하는 좌표계" 위에서 또 회전하기 때문에, 두 회전이 상호작용해 $\dot\theta_1\dot\theta_2$ 형태의 항이 생긴다. **기억할 필요 없음**: 코리올리 항의 물리적 유도 과정 자체 — 완전히 직관적으로 이해하기 어려운 부분이다.

---

## 9. 표기법 비교표

| 기호 | 의미 | 비고 |
|---|---|---|
| ${}^1P_{C_1}=l_1\hat X_1$, ${}^2P_{C_2}=l_2\hat X_2$ | 점질량 가정 하의 무게중심 위치 | 링크 원단(끝)에 질량이 몰려 있다고 가정 |
| ${}^{C_1}I_1=0$, ${}^{C_2}I_2=0$ | 점질량의 관성 텐서 | 퍼진 질량이 없으므로 회전 관성도 없음 |
| $f_3=0,\ n_3=0$ | 손끝 외력·외토크 없음 | 로봇 자신의 관성·중력만으로 토크 계산 |
| ${}^1\dot v_{C_1}=[gs_1-l_1\dot\theta_1^2,\ l_1\ddot\theta_1+gc_1,\ 0]^T$ | 링크 1 무게중심 가속도 | 3절 최종 결과 |
| ${}^1f_1,\ {}^1n_1$ | 링크 1이 받는 힘·토크 | 내향 반복으로 손끝에서 거슬러 계산 |
| $\tau_1,\tau_2$ | 두 관절의 최종 토크 | 6절의 폐형식 |
| $\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$ | 상태공간 방정식(state space equation) | $M$: 질량행렬, $V$: 원심력·코리올리, $G$: 중력 |
| $M(\Theta)$ | 질량 행렬 | $n\times n$, 대칭·양의 정치 → 역행렬 항상 존재 |
| $\dot\theta_i^2$ 항 / $\dot\theta_i\dot\theta_j$($i\ne j$) 항 | 원심력 / 코리올리 | $V(\Theta,\dot\Theta)$ 안에서의 구분 기준 |

---

## 핵심 요약 카드

| 구분 | 핵심 내용 |
|---|---|
| 예제 설정 | 2-링크 평면 매니퓰레이터, 질량이 각 링크 원단에 점질량으로 집중 → ${}^CI=0$, 손끝 외력 없음, 베이스 고정+중력 트릭 |
| 1단계 외향 반복 결과 | ${}^1\dot v_{C_1}=[gs_1-l_1\dot\theta_1^2,\ l_1\ddot\theta_1+gc_1,\ 0]^T$, $N_1=0$(점질량이라 관성 텐서가 0이라서) |
| 2단계 내향 반복 결과 | ${}^2n_2$(링크 2 자체 관성토크만) → ${}^1n_1$(링크 2 전달분 + 링크 1 자체분 + 모멘트 항) |
| 최종 폐형식 | $\tau_1,\tau_2$ — 가속도항·속도제곱곱항·중력항 세 종류로만 구성 |
| 동역학 방정식의 구조 | $\tau=M(\Theta)\ddot\Theta+V(\Theta,\dot\Theta)+G(\Theta)$ — 반복 뉴턴-오일러로 구한 답을 계수별로 재포장한 것 |
| $M(\Theta)$ | 질량 행렬, $n\times n$, 대칭·양의 정치 → 역행렬 항상 존재 |
| $V(\Theta,\dot\Theta)$ | $\dot\theta_i^2$항=원심력, $\dot\theta_i\dot\theta_j$($i\ne j$)항=코리올리 |
| $G(\Theta)$ | 중력상수 $g$가 포함된 항만 모음 |
| 이해 vs 암기 | 손 계산 과정 전체는 "외울 필요 없음" — $M,V,G$의 구조적 의미와 원심력·코리올리 구분 기준만 기억하면 됨 |
