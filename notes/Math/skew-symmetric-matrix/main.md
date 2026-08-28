---
title: 반대칭 행렬
date: 2026-08-18
tags: matrix
order: 
featured: false
draft: false
---

# 반대칭 행렬

## 정의

정방행렬 $A$가 **반대칭행렬(skew-symmetric matrix, anti-symmetric matrix)**이라는 건, 전치를 취했을 때 부호만 뒤집힌 자기 자신이 나온다는 뜻이다.

$$A = -A^T \quad \Longleftrightarrow \quad A + A^T = 0$$

원소 단위로 풀면 $a_{ij} = -a_{ji}$ — (i,j) 자리와 (j,i) 자리가 서로 부호만 반대다. 대각 원소는 i=j를 대입한 $a_{ii} = -a_{ii}$가 성립해야 하므로 항상 $a_{ii} = 0$이다. 즉 **대각선은 전부 0, 대각선을 기준으로 위·아래가 부호만 반대인 거울상**인 행렬.

## 외적 → 반대칭행렬 변환 공식

벡터 $a=(a_1,a_2,a_3)$와 $b=(b_1,b_2,b_3)$의 외적은 정의상:

$$a \times b = (a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1)$$

$a$를 고정해두고 보면 이 식은 $b_1, b_2, b_3$에 대한 1차식, 즉 선형이다. 선형이면 항상 행렬 곱으로 옮길 수 있으니, 각 성분에서 $b_1, b_2, b_3$의 계수를 그대로 뽑아 행에 나열한다.

- 1행($a_2b_3-a_3b_2$): $b_1$ 계수 0, $b_2$ 계수 $-a_3$, $b_3$ 계수 $a_2$
- 2행($a_3b_1-a_1b_3$): $b_1$ 계수 $a_3$, $b_2$ 계수 0, $b_3$ 계수 $-a_1$
- 3행($a_1b_2-a_2b_1$): $b_1$ 계수 $-a_2$, $b_2$ 계수 $a_1$, $b_3$ 계수 0

이 계수표를 그대로 행렬로 옮긴 것이 $[a]_\times$ 다 — 즉 반대칭행렬은 "$a\times(\,)$라는 선형 연산의 계수를 적어놓은 표"일 뿐이다.

$$[a]_\times = \begin{bmatrix} 0 & -a_3 & a_2 \\ a_3 & 0 & -a_1 \\ -a_2 & a_1 & 0 \end{bmatrix}, \qquad [a]_\times b = a \times b$$

예를 들어 $a = (2, -1, 3)$이면:

$$[a]_\times = \begin{bmatrix} 0 & -3 & -1 \\ 3 & 0 & -2 \\ 1 & 2 & 0 \end{bmatrix}$$

$b=(1,0,1)$로 검산해보면, 외적으로 직접 계산한 $a\times b = (-1,1,1)$과 행렬 곱 $[a]_\times b$가 똑같이 $(-1,1,1)$로 나온다.

## 아무 정방행렬이나 반대칭행렬로 쪼갤 수 있다

임의의 정방행렬 $A$는 항상 대칭 부분과 반대칭 부분의 합으로 분해된다:

$$A = \underbrace{\tfrac{1}{2}(A + A^T)}_{\text{대칭}} + \underbrace{\tfrac{1}{2}(A - A^T)}_{\text{반대칭}}$$

**왜 되는지** — 대칭 부분 $S = \tfrac{1}{2}(A+A^T)$은 $S^T = \tfrac{1}{2}(A^T+A) = S$ 그대로라 대칭이고, 반대칭 부분 $K = \tfrac{1}{2}(A-A^T)$은 $K^T = \tfrac{1}{2}(A^T-A) = -K$라 반대칭이다. 둘을 더하면 $S+K = \tfrac{1}{2}(A+A^T) + \tfrac{1}{2}(A-A^T) = A$로 원래 행렬이 그대로 복원된다. 즉 대칭·반대칭이라는 두 성질이 각 원소를 $\tfrac{1}{2}(a_{ij}+a_{ji})$와 $\tfrac{1}{2}(a_{ij}-a_{ji})$로 쪼개는 것과 같다 — 짝수함수/홀수함수로 함수를 쪼개는 것과 똑같은 발상.

**직접 계산해보기** — $A = \begin{bmatrix} 1 & 4 \\ 2 & 3 \end{bmatrix}$ 이라 하면:

$$A^T = \begin{bmatrix} 1 & 2 \\ 4 & 3 \end{bmatrix}$$

대칭 부분:

$$S = \tfrac{1}{2}(A+A^T) = \tfrac{1}{2}\begin{bmatrix} 2 & 6 \\ 6 & 6 \end{bmatrix} = \begin{bmatrix} 1 & 3 \\ 3 & 3 \end{bmatrix}$$

반대칭 부분:

$$K = \tfrac{1}{2}(A-A^T) = \tfrac{1}{2}\begin{bmatrix} 0 & 2 \\ -2 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$

검산 — 다시 더하면 $A$로 돌아온다:

$$S+K = \begin{bmatrix} 1 & 3 \\ 3 & 3 \end{bmatrix} + \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 4 \\ 2 & 3 \end{bmatrix} = A$$

$K$의 대각선이 0이고 $k_{12} = -k_{21}$인 것도 확인된다 — 정의 그대로다.

## 관련 노트

- 17강 벡터·행렬 연산과 내적·외적 복습 — 외적·대칭/반대칭 분해를 처음 정리한 강의 복습 노트, 이 노트가 채워야 할 "모름" 문항이 여기서 나옴
