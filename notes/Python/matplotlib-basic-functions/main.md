---
title: Matplotlib 기본 함수
date: 2026-08-08
tags: matplotlib, cheat-sheet
order: 
featured: false
draft: false
---

# Matplotlib 기본 함수

`matplotlib.pyplot`(관례상 `plt`) 시각화 함수 스니펫 모음. 데이터 준비(집계·병합) 단계는 [Pandas 노트의 groupby](../pandas-data-preprocessing-reference/main.md)를 참고하고, 이 노트는 "만들어진 데이터를 그리는" 단계만 다룬다.

```python
import matplotlib.pyplot as plt
```

## 그래프 종류 선택

어떤 질문에 답하려는지에 따라 그래프가 정해진다.

| 질문 | 그래프 | 함수 |
|---|---|---|
| 범주별 크기 비교 ("A vs B 어느 쪽이 큰가?") | 막대 그래프 (Bar) | `plt.bar(x, height)` |
| 시간에 따른 변화 추이 ("추세가 어떤가?") | 선 그래프 (Line) | `plt.plot(x, y)` |
| 두 변수의 관계 ("x가 크면 y도 큰가?") | 산점도 (Scatter) | `plt.scatter(x, y)` |
| 전체 대비 비율 ("비중이 얼마나 되나?") | 파이 차트 (Pie) | `plt.pie(values, labels=...)` |
| 분포 확인 ("값이 어디에 몰려 있나?") | 히스토그램 | `plt.hist(values)` |

> 시각화는 데이터를 "이해 가능한 형태"로 바꾸는 것입니다.

## 막대 그래프 (Bar Chart)

```python
plt.figure(figsize=(8, 5))                       # 크기 (가로, 세로 인치)
plt.bar(categories, values, color=['#3498db', '#e74c3c'])
plt.title('비 온 주 vs 비 안 온 주 평균 매출 비교', fontsize=14)
plt.xlabel('날씨 조건', fontsize=12)
plt.ylabel('평균 매출 (원)', fontsize=12)
plt.ylim(30000000, 40000000)                     # Y축 범위 (차이 강조)
for i, v in enumerate(values):
    plt.text(i, v + 200000, f'{v:,.0f}원', ha='center', fontsize=11)  # 막대 위 값
plt.tight_layout()
plt.show()
```

**`plt.ylim()`을 쓰는 이유와 위험** — 기본 막대 그래프는 Y축이 0부터 시작해서, 3,400만 vs 3,600만처럼 값이 비슷하면 차이가 거의 안 보인다. 범위를 좁히면 차이가 명확해지지만 **실제보다 과장되어 보이는 왜곡**이 생긴다. 그래서 Y축을 조정할 때는 `plt.text()`로 막대 위에 정확한 숫자를 함께 표시하는 것이 시각화 윤리다.

## 선 그래프 (Line Plot)

```python
plt.figure(figsize=(14, 5))
plt.plot(merged_sorted['주'], merged_sorted['주간매출'], marker='o', markersize=4)
plt.title('주별 매출 추이', fontsize=14)
plt.xticks(rotation=45)          # X축 레이블 회전 (겹침 방지)
plt.tight_layout()
plt.show()
```

| 옵션 | 설명 | 예시 |
|---|---|---|
| `marker` | 데이터 점 모양 | `'o'` (원), `'s'` (사각), `'^'` (삼각) |
| `markersize` | 점 크기 | `4`, `8` |
| `linestyle` | 선 스타일 | `'-'` (실선), `'--'` (점선) |
| `linewidth` | 선 두께 | `2` |
| `color` | 색상 | `'blue'`, `'#3498db'`, `'lightgray'` |

X축이 `'W01', 'W02', ...` 같은 문자열이면 정렬 순서가 보장되지 않으므로, 그리기 전에 숫자 컬럼을 만들어 [sort_values](../pandas-data-preprocessing-reference/main.md)로 정렬해 둔다.

**선 위에 특정 점 강조하기** — 전체 추이는 회색 선으로 깔고, 강조할 그룹만 `scatter`로 색을 입힌다. `zorder`가 클수록 위에 그려진다(선을 1, 점을 2로 두면 점이 선을 덮음).

```python
plt.plot(merged_sorted['주'], merged_sorted['주간매출'],
         color='lightgray', linewidth=1, zorder=1)          # 전체 추이 (배경)
plt.scatter(dry['주'], dry['주간매출'],
            color='#3498db', s=50, label='비 안 온 주', zorder=2)
plt.scatter(rainy['주'], rainy['주간매출'],
            color='#e74c3c', s=50, label='비 온 주', zorder=2)
plt.legend()   # label을 지정했으면 legend()를 호출해야 범례가 보인다
```

> [!WARNING]
> **그룹이 44:8로 쏠려 보인다면 — 임계값(threshold)을 의심할 것**
> `강수량 > 0`은 일주일에 0.1mm만 와도 "비 온 주"로 분류해서, 서울 데이터에선 52주 중 44주가 비 온 주가 된다. `>= 10mm`처럼 의미 있는 기준으로 바꾸면 27:25로 균형 잡힌 비교가 된다. **기준을 어떻게 설정하느냐에 따라 분석 결과가 달라진다** — 그래프가 이상하면 코드보다 기준부터 점검한다. 임계값 재분류 후에는 정렬본(`merged_sorted`)도 다시 만들어야 한다.

## 산점도 (Scatter Plot) + 상관관계

```python
plt.figure(figsize=(10, 6))
plt.scatter(merged['주간강수량'], merged['주간매출'],
            color='#3498db', alpha=0.6, s=80)   # alpha: 투명도 (점 겹침 확인용), s: 점 크기
plt.show()
```

점들의 모양으로 관계를 읽는다: 오른쪽 위로 갈수록 올라가면 양의 상관, 내려가면 음의 상관, 흩어져 있으면 무상관.

**상관계수(Correlation Coefficient)** — 두 변수가 함께 움직이는 정도를 -1 ~ +1 숫자로 표현한다.

```python
correlation = merged['주간강수량'].corr(merged['주간매출'])   # 예: -0.156
```

| 상관계수 | 의미 |
|---|---|
| +1 | 완벽한 양의 상관 (X↑ → Y↑) |
| 0 | 상관관계 없음 |
| -1 | 완벽한 음의 상관 (X↑ → Y↓) |

| 절대값 | 해석 |
|---|---|
| 0.0 ~ 0.3 | 약한 상관 |
| 0.3 ~ 0.7 | 중간 상관 |
| 0.7 ~ 1.0 | 강한 상관 |

예: -0.156이면 "비가 오면 매출이 조금 떨어지는 경향이 있지만, 강한 관계는 아니다" — 상관계수가 낮으면 그 변수를 주요 원인이라고 단정하면 안 된다.

**추세선(trend line) 추가** — [NumPy](../numpy-basic-functions/main.md)의 `polyfit`으로 1차 회귀 계수를 구해 선으로 그린다.

```python
import numpy as np

z = np.polyfit(merged['주간강수량'], merged['주간매출'], 1)   # 1차 회귀 계수
p = np.poly1d(z)                                             # 계수 → 함수화
x_line = np.linspace(merged['주간강수량'].min(), merged['주간강수량'].max(), 100)
plt.plot(x_line, p(x_line), color='#e74c3c', linewidth=2, linestyle='--', label='추세선')

# 그래프 안에 상관계수 박스 표시 (transAxes: 좌표를 0~1 비율로 지정)
plt.text(0.05, 0.95, f'상관계수: {correlation:.3f}',
         transform=plt.gca().transAxes, fontsize=11,
         verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat'))
```

이익(Profit)처럼 음수가 나올 수 있는 산점도에는 `plt.axhline(y=0, color='gray', linewidth=0.5)`로 0 기준선을 그어 주면 손익 경계가 한눈에 보인다.

## 파이 차트 (Pie Chart)

```python
plt.figure(figsize=(8, 8))
plt.pie(category_sales.values,
        labels=category_sales.index,
        autopct='%1.1f%%',              # 조각 위 퍼센트 표시
        colors=['#3498db', '#2ecc71', '#e74c3c'],
        explode=[0, 0, 0.05],           # 특정 조각만 밖으로 빼서 강조
        startangle=90)                  # 첫 조각 시작 각도
plt.title('Category별 매출 비중', fontsize=14)
plt.show()
```

## 꾸미기 함수 정리

| 함수 | 역할 | 예시 |
|---|---|---|
| `plt.rc('font', family=...)` | 폰트 지정 (한글 깨짐 방지) | `plt.rc('font', family='NanumGothic')` |
| `plt.rc('axes', unicode_minus=False)` | 마이너스 기호 깨짐 방지 | 한글 폰트 사용 시 함께 지정 |
| `plt.figure(figsize=(w, h))` | 그래프 크기 (가로, 세로 인치) | `figsize=(8, 5)` |
| `plt.title()` | 제목 | `plt.title('매출 비교', fontsize=14)` |
| `plt.xlabel()` / `plt.ylabel()` | 축 레이블 | `plt.ylabel('평균 매출 (원)')` |
| `plt.ylim(min, max)` | Y축 범위 | `plt.ylim(30000000, 40000000)` |
| `plt.xticks(rotation=45)` | X축 레이블 회전 | 레이블 겹침 방지 |
| `plt.text(x, y, 텍스트)` | 그래프에 텍스트 추가 | 막대 위 값 표시 |
| `plt.legend()` | 범례 표시 | `label=` 지정한 요소들 표시 |
| `plt.axhline(y=...)` | 수평 기준선 | `plt.axhline(y=0)` — 손익 경계 |
| `plt.tight_layout()` | 여백 자동 조정 | 글자 잘림 방지 |
| `plt.show()` | 그래프 출력 | 필수! |

## subplot — 여러 그래프 한 화면에

하나의 figure 안에 여러 축(axes)을 배치한다. 보고서용 대시보드를 만들 때 쓴다.

```python
fig, axes = plt.subplots(1, 3, figsize=(18, 5))   # 1행 3열
axes[0].bar(...)                                   # 1차원 인덱싱

fig, axes = plt.subplots(2, 2, figsize=(14, 10))  # 2행 2열
axes[0, 0].bar(...)                                # [행, 열] 인덱싱
```

`plt.함수()` 대신 각 축 객체의 메서드를 쓰며, 꾸미기 함수 이름에 `set_`이 붙는 것에 주의:

| plt 방식 | axes 방식 |
|---|---|
| `plt.title()` | `ax.set_title()` |
| `plt.xlabel()` / `plt.ylabel()` | `ax.set_xlabel()` / `ax.set_ylabel()` |
| `plt.ylim()` | `ax.set_ylim()` |
| `plt.xticks()` | `ax.set_xticks()` |
| (전체 제목 없음) | `plt.suptitle('대시보드 제목', fontsize=16, fontweight='bold')` |

```python
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

ax1 = axes[0]
bars = ax1.bar(categories, values, color=['#3498db', '#e74c3c'])
ax1.set_title('비 온 주 vs 안 온 주 평균 매출', fontsize=12)
ax1.set_ylim(30000000, 40000000)
for bar, val in zip(bars, values):                # 막대 객체로 정확한 x 위치 계산
    ax1.text(bar.get_x() + bar.get_width()/2, val + 200000,
             f'{val:,.0f}', ha='center', fontsize=10)

plt.suptitle('비 오는 날 매출이 떨어질까? - 분석 결과', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()
```

## 그래프 저장 — savefig()

```python
plt.savefig('분석결과.png', dpi=150, bbox_inches='tight')   # show() 이전에 호출
plt.show()
```

| 파라미터 | 설명 | 권장값 |
|---|---|---|
| `dpi` | 해상도 (dots per inch) | 150 (화면용), 300 (인쇄용) |
| `bbox_inches` | 여백 처리 | `'tight'` (자동 여백 조정) |

`plt.show()`가 그리기 버퍼를 비우기 때문에, `show()` 뒤에 `savefig()`를 부르면 빈 이미지가 저장된다 — 저장은 항상 `show()` 이전에.

| 확장자 | 용도 |
|---|---|
| `.png` | 일반 이미지 (투명 배경 가능) |
| `.jpg` | 사진용 (파일 크기 작음) |
| `.pdf` | 문서용 (벡터, 고품질) |
| `.svg` | 웹용 (벡터, 확대해도 안 깨짐) |
