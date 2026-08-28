---
title: 1단계 — 극한과 연속
date: 2026-08-06
tags: limit, continuity
order: 
featured: false
draft: false
---

# 1단계 — 극한과 연속

## 1. 극한의 직관적 개념

$$\lim_{x\to a} f(x) = L$$

"$x$가 $a$에 한없이 가까워질 때 $f(x)$는 $L$에 한없이 가까워진다"는 뜻.
$x=a$에서 $f$가 실제로 정의되어 있는지, $f(a)$가 $L$과 같은지는 상관없이,
**$a$ 근처에서 $f$가 어디로 향하는지**만 보는 개념입니다.

예: $f(x)=\dfrac{x^2-1}{x-1}$은 $x=1$에서 정의되지 않지만
($0/0$ 꼴), $x=1$ 근처에서 $f(x)$는 $2$에 한없이 가까워지므로
$\lim_{x\to1}f(x)=2$.

**좌극한/우극한**: $x$가 $a$보다 작은 쪽에서 다가가는 극한 $\lim_{x\to a^-}f(x)$와
큰 쪽에서 다가가는 극한 $\lim_{x\to a^+}f(x)$이 서로 같아야 (양쪽 극한이
일치해야) 극한 $\lim_{x\to a}f(x)$가 존재합니다. 이 개념은 3절
**단위계단함수** 같은 구간별 함수의 불연속점을 판단할 때 그대로 쓰입니다.

공업수학 수준에서는 $\epsilon$-$\delta$ 엄밀한 정의보다 **계산 능력**이 중요합니다.

## 2. 극한 계산 기법

먼저 **"부정형(indeterminate form)"**이 뭔지부터: $x\to a$일 때 분자·분모가
동시에 $0$이 되거나($0/0$) 동시에 무한대로 발산하면($\infty/\infty$),
그냥 대입해서는 답이 정해지지 않습니다 — 식을 변형해서 그 원인이 되는
공통 인수(또는 발산 속도)를 없애야 진짜 극한값이 보입니다. 아래 (2)~(4)가
그 변형 기법들입니다.

### (1) 대입이 되는 경우
분모가 0이 되지 않으면 그냥 대입. 예: $\lim_{x\to 3}(x^2+1) = 10$.

### (2) 부정형 $\frac{0}{0}$ — 인수분해로 처리

분자·분모가 공통으로 갖는 $(x-2)$ 인수를 약분해서 $0/0$의 원인을 제거합니다.

$$\lim_{x\to 2}\frac{x^2-4}{x-2} = \lim_{x\to 2}\frac{(x-2)(x+2)}{x-2} = \lim_{x\to 2}(x+2) = 4$$

### (3) 무리식 — 유리화

근호가 있는 $0/0$ 꼴은 인수분해가 안 되므로, **켤레식**(부호만 반대인 식)을
분자·분모에 곱해 근호를 없앱니다. $(\sqrt{x+1}-1)(\sqrt{x+1}+1) = (x+1)-1 = x$가
되어 분모의 $x$와 약분되는 원리.

$$\lim_{x\to 0}\frac{\sqrt{x+1}-1}{x} = \lim_{x\to 0}\frac{(\sqrt{x+1}-1)(\sqrt{x+1}+1)}{x(\sqrt{x+1}+1)} = \lim_{x\to 0}\frac{1}{\sqrt{x+1}+1} = \frac12$$

### (4) $x\to\infty$ 극한 — 최고차항으로 나누기

분자·분모를 **가장 차수가 높은 항**(여기선 $x^2$)으로 나누면, $1/x, 1/x^2$
같은 항들은 $x\to\infty$일 때 $0$으로 사라지고 상수항만 남습니다.

$$\lim_{x\to\infty}\frac{3x^2+1}{2x^2-x} = \lim_{x\to\infty}\frac{3+1/x^2}{2-1/x} = \frac32$$

> 참고: 분자·분모 차수가 같으면 최고차항 계수의 비가 극한값, 분자 차수가
> 더 높으면 $\pm\infty$로 발산, 분모 차수가 더 높으면 극한값은 $0$.

### (5) 중요 극한 (반드시 암기)

$$\lim_{x\to 0}\frac{\sin x}{x} = 1, \qquad \lim_{x\to 0}\frac{1-\cos x}{x} = 0, \qquad \lim_{x\to\infty}\left(1+\frac1x\right)^x = e$$

첫 번째는 $\sin x$와 $x$가 $0$ 근처에서 거의 같은 속도로 $0$에 다가간다는
뜻(그래프상 $y=x$와 $y=\sin x$가 원점 근처에서 거의 겹침). 세 번째는
자연상수 $e$의 **정의 그 자체**이며, 복리 계산·인구 성장 모델 등 "연속적으로
쌓이는 변화"를 나타낼 때 반복적으로 등장합니다.

> **$e$란?** $\pi$처럼 수학에 반복적으로 등장하는 고유한 무리수
> ($e\approx2.71828\ldots$)로, 위 극한 $\lim_{x\to\infty}(1+1/x)^x$이 바로
> $e$의 정의 중 하나입니다 (급수 $\sum_{n=0}^\infty 1/n!$로 정의하기도 함).
> $e$가 특별한 이유는 **미분해도 자기 자신이 그대로 나오는 유일한 지수함수의
> 밑**이기 때문 ($\dfrac{d}{dx}e^x=e^x$, 2단계 미분에서 다룸). 그래서
> "변화율이 자기 자신에 비례하는 현상"(인구 증가, 방사성 붕괴, RC회로의
> 충·방전 등)을 수식으로 쓰면 자연스럽게 $e^x$가 나오고, ODE의 해도 거의
> 항상 $e^{\lambda x}$ 꼴로 나옵니다.

### (6) 로피탈의 정리 (미분을 배운 후 사용 가능)

$\frac{0}{0}$ 또는 $\frac{\infty}{\infty}$ 꼴이면 분자·분모를 각각
**따로** 미분한 다음 다시 극한을 취해도 같은 값이 나옵니다. (분자와 분모를
통째로 미분하는 몫의 미분법과 혼동하지 말 것 — 로피탈은 분자, 분모를
독립적으로 미분합니다.)

$$\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}$$

예: $\lim_{x\to 0}\dfrac{\sin x}{x}$를 (5)의 암기 없이도 로피탈로 구하면
$\lim_{x\to0}\dfrac{\cos x}{1} = 1$로 바로 확인됩니다. 여전히 $0/0$ 또는
$\infty/\infty$ 꼴이면 한 번 더 적용할 수 있습니다.

> 강의노트 6.4절(Dirac 델타함수 라플라스 변환 증명)에서 실제로 사용됩니다.

## 3. 함수의 연속

$f(x)$가 $x=a$에서 연속이려면:

1. $f(a)$가 정의됨 (구멍이 없어야 함)
2. $\lim_{x\to a} f(x)$가 존재함 (좌극한 = 우극한)
3. $\lim_{x\to a} f(x) = f(a)$ (극한값과 함숫값이 일치)

직관적으로는 **그래프를 연필을 떼지 않고 그릴 수 있는지**로 판단하면 됩니다.
셋 중 하나라도 깨지면 $x=a$에서 불연속:

- **제거 가능한 불연속(removable)**: 극한은 존재하는데 $f(a)$가 없거나
  극한값과 다른 경우 (예: 앞의 $f(x)=(x^2-1)/(x-1)$은 $x=1$에서 극한은
  $2$지만 $f(1)$이 정의되지 않아 불연속 — 구멍 하나만 메우면 연속이 됨)
- **점프 불연속(jump)**: 좌극한 ≠ 우극한이라 극한 자체가 없는 경우
  (예: 단위계단함수는 뛰어오르는 지점에서 좌·우극한이 다름)
- **무한 불연속(infinite)**: $x\to a$에서 $f(x)\to\pm\infty$로 발산하는 경우
  (예: $f(x)=1/x$는 $x=0$에서)

**구분적 연속(piecewise continuous)** 개념도 알아둘 것 — 구간을 유한하게
나눴을 때 각 구간에서는 연속이고 경계에서 점프 불연속만 있는 함수를 말함.
6장 라플라스 변환의 존재 조건과 6.3절 단위계단함수(구간별로 정의된 함수)에서
등장합니다.

## 예제

### 극한값 구하기(직관)

**1)** $f(x)=\dfrac{x^3-1}{x-1}$은 $x=1$에서 정의되지 않는다. $x=0.9,\ 0.99,\ 1.01,\ 1.1$일 때
$f(x)$ 값의 경향을 이용해 $\lim_{x\to1}f(x)$를 직관적으로 추정하라.

<details>
<summary>정답 보기</summary>

$x$가 $1$보다 작은 쪽/큰 쪽에서 다가갈 때 $f(x)$는 모두 $3$에 한없이 가까워진다.
실제로 $f(x)=\dfrac{x^3-1}{x-1}=x^2+x+1$ ($x\ne1$)이므로

$$\lim_{x\to1}f(x)=1^2+1+1=3$$

**답: $3$**

</details>

**2)** $f(x)=\dfrac{x^2-5x+6}{x-2}$일 때 $\lim_{x\to2}f(x)$를 직관적으로(값의 경향으로) 추정하라.

<details>
<summary>정답 보기</summary>

$x^2-5x+6=(x-2)(x-3)$이므로 $x\ne2$에서 $f(x)=x-3$이고, $x$가 $2$에 가까워질수록
$f(x)$는 $-1$에 가까워진다.

$$\lim_{x\to2}f(x)=2-3=-1$$

**답: $-1$**

</details>

### 좌극한·우극한

**1)** $f(x)=\dfrac{|x-3|}{x-3}$일 때 $\lim_{x\to3^-}f(x)$와 $\lim_{x\to3^+}f(x)$를 각각 구하고,
$\lim_{x\to3}f(x)$가 존재하는지 판단하라.

<details>
<summary>정답 보기</summary>

$x<3$이면 $|x-3|=3-x$이므로

$$\lim_{x\to3^-}f(x)=\lim_{x\to3^-}\frac{3-x}{x-3}=-1$$

$x>3$이면 $|x-3|=x-3$이므로

$$\lim_{x\to3^+}f(x)=\lim_{x\to3^+}\frac{x-3}{x-3}=1$$

좌극한 $\ne$ 우극한이므로 **$\lim_{x\to3}f(x)$는 존재하지 않는다.**

</details>

**2)** $g(x)=\begin{cases}2x-1 & x<1\\x^2 & x\ge1\end{cases}$일 때 $x=1$에서의 좌극한과 우극한을 구하고,
$\lim_{x\to1}g(x)$가 존재하는지 판단하라.

<details>
<summary>정답 보기</summary>

$$\lim_{x\to1^-}g(x)=2(1)-1=1,\qquad \lim_{x\to1^+}g(x)=1^2=1$$

좌극한 $=$ 우극한 $=1$이므로 극한이 존재한다.

**답: $\lim_{x\to1}g(x)=1$**

</details>

### 대입

**1)** $\lim_{x\to2}(3x^2-5x+4)$를 구하라.

<details>
<summary>정답 보기</summary>

분모가 없는 다항함수이므로 그대로 대입한다.

$$3(2)^2-5(2)+4=12-10+4=6$$

**답: $6$**

</details>

**2)** $\lim_{x\to-1}\dfrac{x^3-2x^2+5}{x+3}$를 구하라.

<details>
<summary>정답 보기</summary>

$x=-1$을 분모에 대입하면 $-1+3=2\ne0$이므로 그냥 대입 가능.

$$\frac{(-1)^3-2(-1)^2+5}{-1+3}=\frac{-1-2+5}{2}=\frac{2}{2}=1$$

**답: $1$**

</details>

### 0/0 인수분해

**1)** $\lim_{x\to5}\dfrac{x^2-25}{x-5}$를 구하라.

<details>
<summary>정답 보기</summary>

$$\lim_{x\to5}\frac{(x-5)(x+5)}{x-5}=\lim_{x\to5}(x+5)=10$$

**답: $10$**

</details>

**2)** $\lim_{x\to-2}\dfrac{x^2+3x+2}{x^2-4}$를 구하라.

<details>
<summary>정답 보기</summary>

분자, 분모를 각각 인수분해한다.

$$\lim_{x\to-2}\frac{(x+1)(x+2)}{(x-2)(x+2)}=\lim_{x\to-2}\frac{x+1}{x-2}=\frac{-1}{-4}=\frac14$$

**답: $\dfrac14$**

</details>

### 무리식 유리화

**1)** $\lim_{x\to0}\dfrac{\sqrt{x+9}-3}{x}$를 구하라.

<details>
<summary>정답 보기</summary>

켤레식 $(\sqrt{x+9}+3)$을 분자·분모에 곱한다.

$$\lim_{x\to0}\frac{(x+9)-9}{x(\sqrt{x+9}+3)}=\lim_{x\to0}\frac{1}{\sqrt{x+9}+3}=\frac16$$

**답: $\dfrac16$**

</details>

**2)** $\lim_{x\to3}\dfrac{x-3}{\sqrt{x+1}-2}$를 구하라. (이번엔 근호가 분모에 있음에 주의)

<details>
<summary>정답 보기</summary>

분모의 켤레식 $(\sqrt{x+1}+2)$를 분자·분모에 곱해 분모의 근호를 없앤다.

$$\lim_{x\to3}\frac{(x-3)(\sqrt{x+1}+2)}{(x+1)-4}=\lim_{x\to3}\frac{(x-3)(\sqrt{x+1}+2)}{x-3}=\lim_{x\to3}(\sqrt{x+1}+2)$$

$$=\sqrt4+2=4$$

**답: $4$**

</details>

### x→∞ 최고차항

**1)** $\lim_{x\to\infty}\dfrac{4x^2-x+1}{2x^2+3}$를 구하라.

<details>
<summary>정답 보기</summary>

분자·분모를 $x^2$으로 나눈다.

$$\lim_{x\to\infty}\frac{4-1/x+1/x^2}{2+3/x^2}=\frac42=2$$

**답: $2$**

</details>

**2)** $\lim_{x\to\infty}\dfrac{2x^3+5x}{4x^4-x^2+1}$를 구하라.

<details>
<summary>정답 보기</summary>

분모의 차수($4$차)가 분자의 차수($3$차)보다 높은 경우다. $x^4$으로 나누면

$$\lim_{x\to\infty}\frac{2/x+5/x^3}{4-1/x^2+1/x^4}=\frac{0}{4}=0$$

분모 차수가 더 높으면 극한값은 항상 $0$이 된다는 사실과 일치한다.

**답: $0$**

</details>

### 중요극한(sin x/x 등)

**1)** $\lim_{x\to0}\dfrac{\sin5x}{x}$를 구하라.

<details>
<summary>정답 보기</summary>

$5x\to0$이 되도록 분모·분자를 맞춰준다.

$$\frac{\sin5x}{x}=5\cdot\frac{\sin5x}{5x}\ \longrightarrow\ 5\times1=5$$

**답: $5$**

</details>

**2)** $\lim_{x\to0}\dfrac{\sin3x}{\sin5x}$를 구하라.

<details>
<summary>정답 보기</summary>

분자·분모를 각각 $\sin u/u\to1$ 꼴로 만든다.

$$\frac{\sin3x}{\sin5x}=\frac{3\cdot\dfrac{\sin3x}{3x}}{5\cdot\dfrac{\sin5x}{5x}}\ \longrightarrow\ \frac{3\times1}{5\times1}=\frac35$$

**답: $\dfrac35$**

</details>

### 로피탈 정리

**1)** $\lim_{x\to0}\dfrac{e^{2x}-1}{x}$를 로피탈 정리로 구하라.

<details>
<summary>정답 보기</summary>

$0/0$ 꼴이므로 분자·분모를 각각 미분한다.

$$\lim_{x\to0}\frac{e^{2x}-1}{x}=\lim_{x\to0}\frac{2e^{2x}}{1}=2e^0=2$$

**답: $2$**

</details>

**2)** $\lim_{x\to\pi}\dfrac{\sin x}{x-\pi}$를 로피탈 정리로 구하라.

<details>
<summary>정답 보기</summary>

$x=\pi$를 대입하면 $\sin\pi=0$, $\pi-\pi=0$이므로 $0/0$ 꼴. 분자·분모를 각각 미분.

$$\lim_{x\to\pi}\frac{\sin x}{x-\pi}=\lim_{x\to\pi}\frac{\cos x}{1}=\cos\pi=-1$$

**답: $-1$**

</details>

### 연속 판정(3조건)

**1)** $f(x)=\dfrac{x^2-16}{x-4}\ (x\ne4)$, $f(4)=8$로 정의된 함수가 $x=4$에서 연속인지 판별하라.

<details>
<summary>정답 보기</summary>

① $f(4)=8$로 정의되어 있음.
② 극한: $\displaystyle\lim_{x\to4}\frac{x^2-16}{x-4}=\lim_{x\to4}(x+4)=8$ (존재함)
③ $\displaystyle\lim_{x\to4}f(x)=8=f(4)$ (일치함)

세 조건을 모두 만족하므로 **$x=4$에서 연속이다.**

</details>

**2)** $h(x)=\begin{cases}x+2 & x<1\\5 & x=1\\3x & x>1\end{cases}$가 $x=1$에서 연속인지 3조건을 이용해 판별하라.

<details>
<summary>정답 보기</summary>

① $h(1)=5$로 정의되어 있음 (조건 1 만족).
② 좌극한: $\lim_{x\to1^-}h(x)=1+2=3$, 우극한: $\lim_{x\to1^+}h(x)=3(1)=3$이므로
극한 $\lim_{x\to1}h(x)=3$이 존재함 (조건 2 만족).
③ 그런데 $\lim_{x\to1}h(x)=3\ne h(1)=5$이므로 조건 3이 깨진다.

극한은 존재하지만 함숫값과 일치하지 않으므로 **$x=1$에서 불연속이다.**

</details>

### 불연속의 종류(제거가능/점프/무한)

**1)** $f(x)=\dfrac{x-5}{x^2-25}$의 $x=5$에서의 불연속을 분류하라.

<details>
<summary>정답 보기</summary>

$$f(x)=\frac{x-5}{(x-5)(x+5)}=\frac{1}{x+5}\quad(x\ne5)$$

$$\lim_{x\to5}f(x)=\frac{1}{10}$$

극한값은 존재하지만 $f(5)$는 정의되지 않는다(분모가 $0$). 구멍만 메우면 연속이 되는 경우이므로
**제거 가능한 불연속(removable)** 이다.

</details>

**2)** 다음 두 함수의 $x=0$에서의 불연속 종류를 각각 판별하라.

(a) $g(x)=\begin{cases}2x-1 & x<0\\x+4 & x\ge0\end{cases}$

(b) $h(x)=\dfrac{1}{x^2}$

<details>
<summary>정답 보기</summary>

**(a)** 좌극한 $\lim_{x\to0^-}g(x)=2(0)-1=-1$, 우극한 $\lim_{x\to0^+}g(x)=0+4=4$.
좌극한 $\ne$ 우극한이므로 극한 자체가 존재하지 않는다 → **점프 불연속(jump)**.

**(b)** $x\to0$일 때 $h(x)=1/x^2\to+\infty$ (좌우 모두 발산). → **무한 불연속(infinite)**.

</details>

## 체크리스트

- [ ] $0/0$ 꼴 극한을 인수분해로 처리할 수 있음
- [ ] $\lim \sin x / x = 1$ 등 중요 극한을 암기하고 있음
- [ ] 로피탈 정리를 언제 쓸 수 있는지 판단 가능
- [ ] 연속의 정의 3조건을 설명할 수 있음

---

**이전**: [함수의 기본 성질](../basic-properties-of-functions/main.md) · [다항식의 전개와 인수분해](../polynomial-expansion-and-factoring/main.md) · [삼각함수 덧셈정리와 반각공식](../trig-addition-and-half-angle-formulas/main.md) · [등차수열과 등비수열](../arithmetic-and-geometric-sequences/main.md) (0단계 대수 기초) · **다음**: [미분](../differentiation/main.md) — 극한의 정의가 도함수 정의(순간변화율)로 직결된다.
