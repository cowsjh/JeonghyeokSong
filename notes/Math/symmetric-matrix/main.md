---
title: 대칭 행렬 - Symmetric Matrix
date: 2026-08-24
tags: matrix, eigenvalue
order: 
featured: false
draft: false
---

# 대칭 행렬 - Symmetric Matrix

$$A^T = A$$를 만족하는 **정사각행렬**.
즉 $(i,j)$ 성분과 $(j,i)$ 성분이 항상 같아서, **대각선을 기준으로 좌우 대칭이다**.

$$A = \begin{pmatrix}2&5&1 \\ 5&3&4 \\ 1&4&7\end{pmatrix}$$

## 스펙 트럴 정리 - Spectral Theorem

일반 정사각 행렬은 대각화가 [조건에 따라](../diagonalization/main.md) 안될 수도 있고, 되더라도 고유 벡터가 직교 하지 않을 수 있다. 하지만 실수 대칭 행렬은 항상 다음 두 성질을 보장한다.

1. [모든 고유값이 실수다.](#1-모든-고유값이-실수다)(복소수 x)
2. 2. 모든 고유 벡터들이 직교한다.
덕분에 대각화가 훨씬 간단해진다.

$$A = P D P^{-1}$$
에서
$$A = P D P^{T}$$
이렇게 바뀔 수 있다.

$P$ 는 직교 행렬 이기 때문에 $P^{-1}=P^T$ 를 만족한다

## 1. 모든 고유값이 실수다.

$$Ax = \lambda x$$
에서 양변의 왼쪽에서 $x^T$ 를 곱하면
$$x^TAx=x^T\lambda x$$
$$x^TAx=\lambda x^Tx$$
실수 벡터 라면 $x^Tx$ 는 항상 양수이다.
따라서
$$\lambda = \frac{x^TAx}{x^Tx}$$
가 된다.
$A$ 는 대칭 행렬 이므로 $x^TAx$ 는 항상 실수가 된다.
예를 들이 $A = \begin{pmatrix} a&b \\ b&d \end{pmatrix}$ , $x = \begin{pmatrix} x_1 \\ x_2 \end{pmatrix}$  이라면
$$x^TAx = ax^2_1 + 2bx_1x_2 + dx^2_2$$
가 된다.
전부 실수니까 $\lambda = \frac{x^TAx}{x^Tx}$ 도 실수가 될수 밖에 없다.

하지만 고유값이 복소수일 수도 있다. 때문에 좀더 정확한 증명에서는 $x^T$ 대신 $x^*$ 켤레전치(**conjugate transpose**) 를 쓴다.

## 2. 모든 고유 벡터들이 직교한다.(실수 대칭 행렬)

행렬($A^T = A$)이고, $\lambda_1 \ne \lambda_2$가 서로 다른 두 고유값이라고 할때.
각각에 대응하는 고유벡터를 $v_1, v_2$라 하면:

$$ Av_1 = \lambda_1 v_1 \qquad (1)$$
$$ Av_2 = \lambda_2 v_2 \qquad (2)$$


1. 식 (1)의 양변에 왼쪽에서 $v_2^T$를 곱한다
$$ v_2^T A v_1 = v_2^T (\lambda_1 v_1) = \lambda_1 (v_2^T v_1) \qquad (3) $$

2. 좌변 $v_2^T A v_1$을 전치 한다.
스칼라는 전치해도 자기 자신과 같으므로:

$$ v_2^T A v_1 = (v_2^T A v_1)^T = v_1^T A^T v_2 $$
3. 대칭성 $A^T = A$를 대입
$$= v_1^T A v_2 $$

4. 식 (2)를 대입

$$ v_1^T A v_2 = v_1^T (\lambda_2 v_2) = \lambda_2 (v_1^T v_2) $$
1~4 를 합치면
$$ v_2^T A v_1 = v_1^T A v_2 $$

였으므로, (3)과 4단계 결과를 등호로 연결하면:

$$ \lambda_1 (v_2^T v_1) = \lambda_2 (v_1^T v_2) $$

$v_1^T v_2 = v_2^T v_1$ (둘 다 스칼라이므로):

$$ \lambda_1 (v_1^T v_2) = \lambda_2 (v_1^T v_2) $$

$$ (\lambda_1 - \lambda_2)(v_1^T v_2) = 0 $$
가정에서 $\lambda_1 \ne \lambda_2$이므로 $(\lambda_1 - \lambda_2) \ne 0$. 따라서:

$$ v_1^T v_2 = 0 $$

즉 $v_1$과 $v_2$는 직교한다.