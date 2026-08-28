---
title: 3단계 — 적분
date: 2026-08-06
tags: integration
order: 
featured: false
draft: false
---

# 3단계 — 적분

## 1. 부정적분 = 미분의 역연산

$$\int f'(x)\,dx = f(x) + C$$

## 2. 기본 적분공식

$$\int x^n dx = \frac{x^{n+1}}{n+1}+C \ (n\neq -1), \qquad \int \frac1x dx = \ln|x|+C$$
$$\int e^x dx = e^x + C, \qquad \int \sin x\,dx = -\cos x + C, \qquad \int \cos x\,dx=\sin x+C$$

강의노트 1장 예비자료 공식도 챙길 것:

$$\int \tan x\,dx = -\ln|\cos x|+C = \ln|\sec x|+C, \qquad \int \cot x\,dx=\ln|\sin x|+C$$
$$\int \tanh x\,dx = \ln|\cosh x|+C, \qquad \int \coth x\,dx = \ln|\sinh x|+C$$

## 3. 정적분과 미적분의 기본정리

$$\int_a^b f(x)\,dx = F(b)-F(a) \quad (F'=f)$$

정적분은 "넓이"의 극한(리만합)으로 정의되지만, 실전에서는 부정적분을 구해서
양 끝값을 대입하는 것으로 계산합니다. **이상적분**(적분 구간이 무한대)도 중요합니다:

$$\int_0^\infty e^{-st}\,dt = \lim_{B\to\infty}\int_0^B e^{-st}\,dt = \frac1s \quad (s>0)$$

이 계산이 바로 **라플라스 변환의 정의 그 자체**입니다 (6장 첫 페이지).

## 4. 치환적분

$$\int f(g(x))g'(x)\,dx = \int f(u)\,du \quad (u=g(x))$$

예: $\int 2x\,e^{x^2}dx$ → $u=x^2, du=2x\,dx$ → $\int e^u du = e^{x^2}+C$

## 5. 부분적분 — 매우 중요

$$\int u\,v'\,dx = uv - \int u'v\,dx \qquad \text{(강의노트 표기: } \int uv'\,dx=uv-\int u'v\,dx\text{)}$$

**적용 우선순위(LIATE)**: 로그(L) → 역삼각(I) → 다항식(A) → 삼각(T) → 지수(E) 순으로
$u$를 선택하면 대체로 계산이 쉬워집니다.

예: $\int x e^x dx$ — $u=x, v'=e^x$ → $u'=1, v=e^x$
$$\int x e^x dx = xe^x - \int e^x dx = xe^x - e^x + C$$

**2계 ODE 미정계수법, 라플라스 역변환($t^n e^{at}$ 형태)에서 반복 등장**하므로
여러 번 반복해서 손에 익힐 것.

## 6. 부분분수 분해 — 라플라스 변환의 핵심 도구

분자의 차수가 분모보다 낮은 유리함수를 간단한 항의 합으로 쪼개는 기법.
(분자 차수가 분모 이상이면 먼저 나눗셈을 해서 낮출 것.)

$$\frac{x-3}{(2x+3)(x-2)} = \frac{A}{2x+3}+\frac{B}{x-2}$$

$$\frac{3x+5}{(2x+3)(x^2-2)} = \frac{A}{2x+3}+\frac{Bx+C}{x^2-2} \quad (\text{분자를 분모보다 한 차수 낮게})$$

분모가 $(\ )^n$ 거듭제곱이면:

$$\frac{x-1}{(x^2+3x+3)(2x+1)^3} = \frac{Ax+B}{x^2+3x+3}+\frac{C}{2x+1}+\frac{D}{(2x+1)^2}+\frac{E}{(2x+1)^3}$$

### 도포법 (Cover-up Method) — 계산 지름길

분모가 일차식들의 곱일 때, 예를 들어

$$\frac{s^2+6s+9}{(s-1)(s-2)(s+4)}=\frac{A}{s-1}+\frac{B}{s-2}+\frac{C}{s+4}$$

에서 $A$를 구하려면 양변에 $(s-1)$을 곱하고 $s=1$을 대입:

$$A = \frac{s^2+6s+9}{(s-2)(s+4)}\bigg|_{s=1}$$

같은 방법으로 $B, C$도 각각 $s=2, s=-4$ 대입해서 구함. **라플라스 역변환 문제
대부분이 이 기법으로 풀립니다.**

## 7. 삼각치환 (참고, 필요할 때 찾아서 사용)

- $\sqrt{a^2-x^2}$ 꼴 → $x=a\sin\theta$
- $\sqrt{a^2+x^2}$ 꼴 → $x=a\tan\theta$
- $\sqrt{x^2-a^2}$ 꼴 → $x=a\sec\theta$

## 예제

### 1. 부정적분 = 미분의 역연산

#### 기본 역연산 확인

**1)** 어떤 함수 $f(x)$가 $f'(x) = 5x^4 - 3x^2$을 만족한다. $\displaystyle\int f'(x)\,dx$를 구하라.

<details>
<summary>정답 보기</summary>

부정적분은 미분의 역연산이므로 항별로 적분하면 된다.
$$\int (5x^4-3x^2)\,dx = x^5 - x^3 + C$$

**$x^5-x^3+C$**

</details>

**2)** $\dfrac{d}{dx}\left[x^2\sin x\right] = 2x\sin x + x^2\cos x$ 임을 이용하여 $\displaystyle\int (2x\sin x + x^2\cos x)\,dx$를 구하라.

<details>
<summary>정답 보기</summary>

피적분함수가 정확히 $x^2\sin x$의 도함수이므로, 별도의 계산 없이 미분의 역연산으로 바로 답을 얻는다.
$$\int (2x\sin x + x^2\cos x)\,dx = x^2\sin x + C$$

**$x^2\sin x+C$**

</details>

### 2. 기본 적분공식

#### 다항식 적분

**1)** $\displaystyle\int (4x^3 - 6x^2 + 2x - 5)\,dx$

<details>
<summary>정답 보기</summary>

항별로 거듭제곱 공식 $\int x^n dx=\frac{x^{n+1}}{n+1}+C$ 적용.
$$\int (4x^3-6x^2+2x-5)\,dx = x^4-2x^3+x^2-5x+C$$

**$x^4-2x^3+x^2-5x+C$**

</details>

**2)** $\displaystyle\int \left(3\sqrt{x} - \frac{2}{x^3}\right)dx$

<details>
<summary>정답 보기</summary>

지수 형태로 바꾸면 $3x^{1/2}-2x^{-3}$.
$$\int 3x^{1/2}dx = 3\cdot\frac{x^{3/2}}{3/2}=2x^{3/2}$$
$$\int (-2x^{-3})dx = -2\cdot\frac{x^{-2}}{-2}=x^{-2}$$

**$2x^{3/2}+x^{-2}+C$**

</details>

#### 지수/삼각함수 적분

**1)** $\displaystyle\int \left(4e^x + \frac{3}{x}\right)dx$

<details>
<summary>정답 보기</summary>

$\int e^x dx=e^x+C$, $\int \frac1x dx=\ln|x|+C$ 를 그대로 적용.
$$\int \left(4e^x+\frac3x\right)dx = 4e^x+3\ln|x|+C$$

**$4e^x+3\ln|x|+C$**

</details>

**2)** $\displaystyle\int (2\tan x + 3\cot x)\,dx$

<details>
<summary>정답 보기</summary>

강의노트 공식 $\int\tan x\,dx=\ln|\sec x|+C$, $\int\cot x\,dx=\ln|\sin x|+C$ 를 사용.
$$\int (2\tan x+3\cot x)\,dx = 2\ln|\sec x|+3\ln|\sin x|+C$$

**$2\ln|\sec x|+3\ln|\sin x|+C$**

</details>

### 3. 정적분과 미적분의 기본정리

#### 정적분 계산

**1)** $\displaystyle\int_0^2 (3x^2-4x+1)\,dx$

<details>
<summary>정답 보기</summary>

부정적분: $F(x)=x^3-2x^2+x$.
$$F(2)-F(0) = (8-8+2)-(0-0+0) = 2$$

**$2$**

</details>

**2)** $\displaystyle\int_1^e \frac{1}{x}\,dx$

<details>
<summary>정답 보기</summary>

$F(x)=\ln|x|$.
$$F(e)-F(1) = \ln e - \ln 1 = 1-0=1$$

**$1$**

</details>

#### 이상적분

**1)** $\displaystyle\int_0^\infty e^{-3t}\,dt$

<details>
<summary>정답 보기</summary>

라플라스 변환의 기본 형태 $\int_0^\infty e^{-st}dt=\frac1s\ (s>0)$에 $s=3$ 대입.

$$\int_0^\infty e^{-3t}\,dt=\lim_{B\to\infty}\left[-\frac13e^{-3t}\right]_0^B=\lim_{B\to\infty}\left(-\frac13e^{-3B}+\frac13\right)=\frac13$$

**$\dfrac13$**

</details>

**2)** $\displaystyle\int_1^\infty \frac{1}{x^2}\,dx$

<details>
<summary>정답 보기</summary>

$\int x^{-2}dx=-x^{-1}+C$ 이므로

$$\int_1^\infty \frac1{x^2}dx=\lim_{B\to\infty}\left[-\frac1x\right]_1^B=\lim_{B\to\infty}\left(-\frac1B+1\right)=1$$

**$1$** (수렴)

</details>

### 4. 치환적분

#### 치환적분

**1)** $\displaystyle\int 6x^2 e^{x^3}\,dx$

<details>
<summary>정답 보기</summary>

$u=x^3,\ du=3x^2dx$ 로 치환하면 $6x^2dx=2\,du$.
$$\int 6x^2e^{x^3}dx = 2\int e^u du = 2e^u+C = 2e^{x^3}+C$$

**$2e^{x^3}+C$**

</details>

**2)** $\displaystyle\int \frac{\ln x}{x}\,dx$

<details>
<summary>정답 보기</summary>

$u=\ln x,\ du=\frac1x dx$ 로 치환.
$$\int \frac{\ln x}{x}dx = \int u\,du = \frac{u^2}{2}+C = \frac{(\ln x)^2}{2}+C$$

**$\dfrac{(\ln x)^2}{2}+C$**

</details>

### 5. 부분적분

#### 부분적분 1회

**1)** $\displaystyle\int x e^{-x}\,dx$

<details>
<summary>정답 보기</summary>

$u=x,\ v'=e^{-x}\Rightarrow u'=1,\ v=-e^{-x}$
$$\int xe^{-x}dx = -xe^{-x}-\int(-e^{-x})dx = -xe^{-x}-e^{-x}+C$$

**$-e^{-x}(x+1)+C$**

</details>

**2)** $\displaystyle\int \ln x\,dx$

<details>
<summary>정답 보기</summary>

LIATE 순서상 로그가 최우선이므로 $u=\ln x,\ v'=1\Rightarrow u'=\frac1x,\ v=x$
$$\int \ln x\,dx = x\ln x-\int x\cdot\frac1x dx = x\ln x-\int 1\,dx = x\ln x-x+C$$

**$x\ln x-x+C$**

</details>

#### 부분적분 반복

**1)** $\displaystyle\int x^2\cos x\,dx$

<details>
<summary>정답 보기</summary>

1차: $u=x^2,\ v'=\cos x\Rightarrow u'=2x,\ v=\sin x$
$$\int x^2\cos x\,dx = x^2\sin x-\int 2x\sin x\,dx$$
2차: $u=2x,\ v'=\sin x\Rightarrow u'=2,\ v=-\cos x$
$$\int 2x\sin x\,dx = -2x\cos x+\int 2\cos x\,dx=-2x\cos x+2\sin x$$
$$\therefore \int x^2\cos x\,dx = x^2\sin x-(-2x\cos x+2\sin x)=x^2\sin x+2x\cos x-2\sin x+C$$

**$x^2\sin x+2x\cos x-2\sin x+C$**

</details>

**2)** $\displaystyle\int x^2 e^{-x}\,dx$

<details>
<summary>정답 보기</summary>

1차: $u=x^2,\ v'=e^{-x}\Rightarrow u'=2x,\ v=-e^{-x}$
$$\int x^2e^{-x}dx = -x^2e^{-x}+\int 2xe^{-x}dx$$
2차: $u=2x,\ v'=e^{-x}\Rightarrow u'=2,\ v=-e^{-x}$
$$\int 2xe^{-x}dx = -2xe^{-x}+\int 2e^{-x}dx = -2xe^{-x}-2e^{-x}$$
$$\therefore \int x^2e^{-x}dx = -x^2e^{-x}-2xe^{-x}-2e^{-x}+C = -e^{-x}(x^2+2x+2)+C$$

**$-e^{-x}(x^2+2x+2)+C$**

</details>

### 6. 부분분수 분해

#### 일차식 분모(도포법)

**1)** $\dfrac{3x-1}{(x-2)(x+1)}$을 부분분수로 분해하고 적분하라.

<details>
<summary>정답 보기</summary>

$$\frac{3x-1}{(x-2)(x+1)}=\frac{A}{x-2}+\frac{B}{x+1}$$
도포법: $A=\dfrac{3(2)-1}{2+1}=\dfrac53$, $\ B=\dfrac{3(-1)-1}{-1-2}=\dfrac{-4}{-3}=\dfrac43$
$$\int\left(\frac{5/3}{x-2}+\frac{4/3}{x+1}\right)dx = \frac53\ln|x-2|+\frac43\ln|x+1|+C$$

**$\dfrac53\ln|x-2|+\dfrac43\ln|x+1|+C$**

</details>

**2)** $\dfrac{4s-1}{(s-1)(s+1)(s-3)}$을 부분분수로 분해하고 적분하라.

<details>
<summary>정답 보기</summary>

$$\frac{4s-1}{(s-1)(s+1)(s-3)}=\frac{A}{s-1}+\frac{B}{s+1}+\frac{C}{s-3}$$
도포법:
$$A=\frac{4(1)-1}{(1+1)(1-3)}=\frac{3}{-4}=-\frac34,\quad B=\frac{4(-1)-1}{(-1-1)(-1-3)}=\frac{-5}{8}=-\frac58$$
$$C=\frac{4(3)-1}{(3-1)(3+1)}=\frac{11}{8}$$
$$\int\left(\frac{-3/4}{s-1}+\frac{-5/8}{s+1}+\frac{11/8}{s-3}\right)ds=-\frac34\ln|s-1|-\frac58\ln|s+1|+\frac{11}{8}\ln|s-3|+C$$

**$-\dfrac34\ln|s-1|-\dfrac58\ln|s+1|+\dfrac{11}{8}\ln|s-3|+C$**

</details>

#### 이차식/거듭제곱 분모

**1)** $\dfrac{x+1}{(x-1)(x^2+1)}$을 부분분수로 분해하라.

<details>
<summary>정답 보기</summary>

$$\frac{x+1}{(x-1)(x^2+1)}=\frac{A}{x-1}+\frac{Bx+C}{x^2+1}$$
도포법으로 $A$ 먼저: $A=\dfrac{1+1}{1^2+1}=1$
양변에 $(x-1)(x^2+1)$을 곱하면
$$x+1 = A(x^2+1)+(Bx+C)(x-1)$$
$x^2$ 계수 비교: $A+B=0\Rightarrow B=-1$. 상수항 비교: $A-C=1\Rightarrow C=0$.

**$\dfrac{1}{x-1}-\dfrac{x}{x^2+1}$**

</details>

**2)** $\dfrac{2x}{(x+1)^2}$을 부분분수로 분해하고 적분하라.

<details>
<summary>정답 보기</summary>

$$\frac{2x}{(x+1)^2}=\frac{A}{x+1}+\frac{B}{(x+1)^2}$$
양변에 $(x+1)^2$을 곱하면 $2x=A(x+1)+B$.
$x=-1$ 대입: $-2=B$. $x$의 계수 비교: $A=2$.
$$\int\left(\frac{2}{x+1}-\frac{2}{(x+1)^2}\right)dx = 2\ln|x+1|+\frac{2}{x+1}+C$$

**$2\ln|x+1|+\dfrac{2}{x+1}+C$**

</details>

### 7. 삼각치환

#### 삼각치환

**1)** $\displaystyle\int \frac{dx}{\sqrt{9-x^2}}$

<details>
<summary>정답 보기</summary>

$\sqrt{a^2-x^2}$ 꼴이므로 $x=3\sin\theta,\ dx=3\cos\theta\,d\theta$, $\sqrt{9-x^2}=3\cos\theta$.
$$\int \frac{3\cos\theta\,d\theta}{3\cos\theta}=\int d\theta=\theta+C$$
$\theta=\arcsin(x/3)$이므로

**$\arcsin(x/3)+C$**

</details>

**2)** $\displaystyle\int \frac{dx}{16+x^2}$

<details>
<summary>정답 보기</summary>

$\sqrt{a^2+x^2}$ 꼴(제곱근은 없지만 같은 치환)이므로 $x=4\tan\theta,\ dx=4\sec^2\theta\,d\theta$, $16+x^2=16\sec^2\theta$.
$$\int \frac{4\sec^2\theta\,d\theta}{16\sec^2\theta}=\int \frac14 d\theta=\frac14\theta+C$$
$\theta=\arctan(x/4)$이므로

**$\dfrac14\arctan(x/4)+C$**

</details>

## 체크리스트

- [ ] 이상적분 $\int_0^\infty e^{-st}dt$ 를 스스로 계산 가능
- [ ] 부분적분을 두 번 이상 반복 적용하는 문제(예: $\int x^2 e^x dx$)를 풀 수 있음
- [ ] 분모의 형태(일차식/이차식/거듭제곱)에 따라 부분분수 형태를 바로 세팅 가능
- [ ] 도포법으로 계수를 빠르게 계산 가능

---

**이전**: [미분](../differentiation/main.md) · **다음**: [04_오일러_공식](../euler-formula/main.md) — 2계 ODE 특성방정식의 복소근을 처리하려면 오일러 공식이 필요하다.
