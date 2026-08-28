---
title: 대각화 (Diagonalization)
date: 2026-08-24
tags: matrix, eigenvalue
order: 
featured: false
draft: false
---

# 대각화 (Diagonalization)

$$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$$

이 행렬을 몇 번이고 곱해야 한다고 해보자($A^{10}$ 같은 걸 손으로 계산하면 지옥이다). 그런데 [고유벡터](../eigenvalues-and-eigenvectors/main.md)로 기저를 바꾸면 이야기가 완전히 달라진다.

[특성방정식](../characteristic-equation/main.md) $\det(A-\lambda I)=0$을 풀면(대각합 $=4$, 행렬식 $=3$이니 검산까지 맞아떨어짐) $\lambda=3, 1$. 각각의 고유벡터는 $v_1=(1,1)$, $v_2=(1,-1)$.

이 고유벡터들을 **열로 나란히 세운 행렬** $P$와, **고유값을 대각선에 얹은 행렬** $D$를 만들면:

$$P=\begin{bmatrix}1&1\\1&-1\end{bmatrix},\quad D=\begin{bmatrix}3&0\\0&1\end{bmatrix}$$

$$A = P D P^{-1}$$

이 관계가 성립한다. 즉 "$A$라는 애매한 변환"을 "고유벡터 기저로 갈아타기($P^{-1}$) → 그 기저에서는 그냥 축마다 늘이기만 하면 됨($D$) → 원래 기저로 돌아오기($P$)"로 쪼갠 것. 이게 **대각화**다.

$A^n = PD^nP^{-1}$이고, $D$는 대각행렬이라 $D^n$은 그냥 대각원소들을 각각 $n$제곱하면 끝($D^{10}=\begin{bmatrix}3^{10}&0 \\ 0&1\end{bmatrix}$). 
반복 행렬곱이 스칼라 거듭제곱으로 붕괴한다. 로봇공학에서 선형 상태공간 시스템($\dot x = Ax$)의 해를 구하거나 마르코프 체인의 장기 거동을 볼 때 정확히 이 트릭을 쓴다.

## 대각화의 조건

모든 행렬이 대각화가 가능한건 아니다. $n \times n$  행렬이 대각화가 가능하려면, 선형 독립인 고유 벡터가 $n$ 개 있어야 한다.
고유값에 중복이 있는데 고유벡터가 그만큼 안 나오는 경우  "결함이 있는(**defective**) 행렬"이라고 한다.