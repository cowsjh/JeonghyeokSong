---
title: Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)
date: 2026-08-08
tags: cheat-sheet, data-cleaning
order: 
featured: false
draft: false
---

# Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)

"비 오는 날 카페 매출이 떨어질까?"라는 하나의 질문을 처음부터 끝까지 따라가며 Pandas 데이터 핸들링을 압축한 노트다. 개념 설명은 최소화하고, 실무에서 반복적으로 쓰는 함수와 코드 패턴 위주로 정리했다.

## 목차

- [1. 왜 전처리가 필요한가](#1-왜-전처리가-필요한가-개념-압축)
- [2. 데이터 불러오기 & 탐색](#2-pandas로-데이터-불러오기--탐색)
- [3. 결측치 처리](#3-결측치-처리)
- [4. 조건 필터링](#4-조건-필터링-불리언-인덱싱)
- [5. 병합](#5-병합-merge)
- [6. 집계](#6-집계-groupby)
- [7. 정렬](#7-정렬-sort_values)
- [8. 시각화](#8-시각화-matplotlib)
- [9. AI 활용 윤리 및 거버넌스](#9-ai-활용-윤리-및-거버넌스-요약)
- [10. 핵심 요약 카드](#10-핵심-요약-카드)

---

## 1. 왜 전처리가 필요한가 (개념 압축)

**데이터 리터러시**의 3단계: 읽기 → 해석 → 활용. 실제 공공데이터(CSV)를 열어보면 대부분 아래 문제를 갖고 있다.

| 문제 | 증상 | 해결 |
|---|---|---|
| 결측치 (빈 값) | `""`, `NaN` | 채우기(fillna) 또는 삭제(dropna) |
| 문자열 타입 | 숫자인데 `"0.6"`처럼 텍스트로 저장됨 | `float()`/`pd.to_numeric` 등으로 변환 |
| 인코딩 불일치 | 한글이 깨지거나 `UnicodeDecodeError` | 파일에 맞는 인코딩 지정 |

> 전처리하지 않으면 `sum()`, `mean()` 같은 계산에서 에러가 나거나, 결측치를 없는 셈 치고 계산해 잘못된 결론에 도달한다.

**인코딩 팁** — 파일마다 인코딩이 다를 수 있으니 에러가 나면 바꿔가며 시도한다.

```python
df = pd.read_csv('파일.csv', encoding='cp949')   # 공공데이터 한글 CSV (Windows)
df = pd.read_csv('파일.csv', encoding='utf-8')    # 웹/최신 프로그램 기본
df = pd.read_csv('파일.csv', encoding='latin-1')  # 해외 데이터셋(Kaggle 등)에서 자주 필요
```

---

## 2. Pandas로 데이터 불러오기 & 탐색

```python
import pandas as pd

df = pd.read_csv('data.csv', encoding='cp949')
```

| 파라미터 | 설명 |
|---|---|
| `sep` | 구분자 (기본값 쉼표, 탭이면 `sep='\t'`) |
| `header=None` | 헤더(컬럼명)가 없는 파일일 때 |
| `index_col=0` | 특정 열을 인덱스로 사용 |

### 탐색 함수

| 함수 | 역할 |
|---|---|
| `df.head(n)` / `df.tail(n)` | 처음/마지막 n줄 (기본 5줄) |
| `df.shape` | `(행 수, 열 수)` — 속성이라 괄호 없음 |
| `df.columns` | 컬럼명 목록 (`list(df.columns)`로 리스트 변환) |
| `df.info()` | 컬럼별 타입 + 결측치 아닌 값 개수 (Non-Null Count) |
| `df.describe()` | 수치형 컬럼의 count/mean/std/min/25%/50%/75%/max |
| `df['컬럼'].unique()` | 해당 열의 고유값 목록 |
| `df['컬럼'].nunique()` | 고유값 개수 |
| `df['컬럼'].value_counts()` | 값별 등장 횟수 |

```python
df.info()
# RangeIndex, Non-Null Count, Dtype 확인 → 결측치 = 전체 행수 - Non-Null Count

df.describe()
#        지점    강수량(mm)
# count  366.0  160.000000
# mean   108.0    8.196250
# std      0.0   17.687642   ← 표준편차: 데이터가 얼마나 퍼져있는지
# ...
```

**왜 표준편차까지 보나?** 평균만 같아도 분포는 전혀 다를 수 있다 (반 A `[50,50,50,50,50]` vs 반 B `[0,20,50,80,100]`, 둘 다 평균 50). 표준편차가 크면 이상치(outlier) 탐지, 데이터 표준화(`(x - mean) / std`) 같은 후속 작업에서 중요해진다 — 나중에 머신러닝 전처리에서 다시 만나는 개념이다.

### 특정 열 선택

```python
df['컬럼명']                    # 한 개 열 (Series)
df[['컬럼1', '컬럼2']]           # 여러 개 열 (DataFrame, 대괄호 두 번)
df['강수량(mm)'].mean()          # 열에서 바로 통계 계산 (.max(), .sum(), .std() 등)
```

> 컬럼명에 괄호·공백·특수문자가 있으면 `df.컬럼명` 점 표기법은 못 쓰고 `df['컬럼명']`만 가능하다.

---

## 3. 결측치 처리

Pandas에서 빈 값은 `NaN`(Not a Number)으로 표시된다.

```python
df['col'].isnull()          # 값마다 True/False
df['col'].isnull().sum()    # 결측치 개수
df.isnull().sum()           # 컬럼별 결측치 개수 한눈에
(df['col'].isnull().sum() / len(df) * 100)   # 결측치 비율(%)
```

### 삭제 vs 채우기

| 방법 | 코드 | 장점 | 단점 | 언제 |
|---|---|---|---|---|
| 삭제 | `df.dropna()` | 간단, 왜곡 없음 | 데이터 손실 | 결측 비율 5~10% 이하 |
| 고정값 채우기 | `df['col'].fillna(0)` | 의미 명확할 때 간단 | 분포 왜곡 가능 | "빈칸 = 0"처럼 뜻이 분명할 때 |
| 평균 채우기 | `df['col'].fillna(df['col'].mean())` | 분산 유지 | 이상치에 민감 | 정규분포에 가까운 데이터 |
| 중앙값 채우기 | `df['col'].fillna(df['col'].median())` | 이상치에 강건 | 분산 다소 감소 | 이상치가 있는 데이터 |
| 최빈값 채우기 | `df['col'].fillna(df['col'].mode()[0])` | 범주형에 적합 | 다양성 감소 | 범주형 컬럼 |
| 시계열 채우기 | `df['col'].fillna(method='ffill')` (이전값) / `'bfill'` (다음값) | 시간 연속성 유지 | 변화 시점 놓침 | 센서/시계열 데이터 |
| 보간법 | `df['col'].interpolate()` | 자연스러운 변화 | 급격한 변화 놓침 | 연속적 시계열 |

```python
# dropna() 주요 옵션
df.dropna()                          # NaN 있는 행 삭제 (기본)
df.dropna(subset=['강수량(mm)'])      # 특정 컬럼 기준으로만 삭제
df.dropna(axis=1)                    # 결측치 있는 열 삭제 axis = 0 -> 행 삭제

# fillna()는 원본을 바꾸지 않는다 — 재할당 필요
df['강수량(mm)'] = df['강수량(mm)'].fillna(0)
```

> **평균으로 채울 때 주의 (Data Leakage):** 머신러닝 학습/테스트를 나눌 경우, 전체 데이터의 평균이 아니라 **학습 데이터의 평균만**으로 채워야 한다. 테스트 데이터 정보가 새는(leakage) 실수를 피하기 위함이다.

---

## 4. 조건 필터링 (불리언 인덱싱)

```python
condition = df['강수량(mm)'] > 0      # True/False Series
rainy_days = df[condition]           # True인 행만 추출
rainy_days = df[df['강수량(mm)'] > 0] # 한 줄로 축약 (실전에서 이 형태로 씀)
```

| 연산자 | 의미 |
|---|---|
| `==`, `!=` | 같다 / 다르다 |
| `>`, `>=`, `<`, `<=` | 크다/이상/작다/이하 |
| `&` | AND (그리고) — **각 조건을 괄호로 감싸야 함** |
| `\|` | OR (또는) |
| `~` | NOT (아니다) |

```python
df[(df['월'] == 7) & (df['강수량(mm)'] > 50)]   # 7월이면서 폭우
df[(df['월'] == 1) | (df['월'] == 12)]          # 1월 또는 12월
df[~(df['강수량(mm)'] > 0)]                     # 비 안 온 날 (반대)
```

> `df[df['a'] == 1 & df['b'] == 2]` 처럼 괄호를 빼먹으면 연산자 우선순위 때문에 에러가 난다.

**임계값 설정이 결과를 바꾼다** — "비 온 주"를 `강수량 > 0`으로 정의하면 서울은 거의 모든 주가 "비 온 주"가 되어 그룹 크기가 44:8처럼 불균형해진다. `>= 10mm`처럼 의미 있는 기준을 잡아야 27:25 같은 균형 잡힌 비교가 가능하다. 분석 목적에 맞는 합리적인 기준(threshold)을 정하는 것이 데이터 자체보다 중요할 때가 많다.

---

## 5. 병합 (merge)

두 표를 공통 컬럼(키) 기준으로 연결한다. SQL의 `JOIN`, 엑셀의 `VLOOKUP`과 같은 개념이다 — SQL을 함께 배운다면 [SQL 노트](../../SQL/sql-core-query-reference/main.md)의 JOIN 절과 나란히 비교해보면 이해가 빠르다.

```python
pd.merge(left, right, on='공통컬럼', how='inner')
```

| how | 결과 |
|---|---|
| `inner` (기본값) | 양쪽 모두에 있는 키만 남음 |
| `left` | 왼쪽 기준, 오른쪽에 없으면 `NaN` |
| `right` | 오른쪽 기준, 왼쪽에 없으면 `NaN` |
| `outer` | 양쪽 모두 포함, 없는 쪽은 `NaN` |

```python
merged = pd.merge(weekly_rainfall, weekly_sales, on='주')
```

병합 전에 **두 데이터의 단위를 맞춰야** 한다 (예: 강수량은 일별, 매출은 주별 → 강수량을 주별로 집계 후 병합). 이 집계 단계가 [groupby](#6-집계-groupby)다.

---

## 6. 집계 (groupby)

여러 행을 하나로 합쳐서 요약하는 것. 엑셀 피벗 테이블과 같은 역할이며, SQL의 `GROUP BY`와 정확히 대응된다.

```python
df.groupby('기준컬럼')['대상컬럼'].집계함수()

weekly_sales = sales.groupby('주')['매출'].sum().reset_index()
```

| 집계 함수 | 설명 |
|---|---|
| `.sum()` | 합계 |
| `.mean()` | 평균 |
| `.count()` | 개수 |
| `.min()` / `.max()` | 최솟값 / 최댓값 |
| `.std()` | 표준편차 |

```python
# 여러 통계를 한번에
sales.groupby('카테고리')['매출'].agg(['sum', 'mean', 'count'])

# 여러 컬럼으로 그룹화
sales.groupby(['매장', '카테고리'])['매출'].sum()
```

> `.reset_index()`: `groupby()` 결과는 Series라서 병합하려면 DataFrame으로 바꿔야 한다. `.reset_index()`가 그 변환을 해준다.

**날짜에서 주차 만들기** (일별 → 주별 집계 전처리):

```python
df['날짜'] = pd.to_datetime(df['날짜'])
df['주'] = 'W' + df['날짜'].dt.isocalendar().week.astype(str).str.zfill(2)
```

---

## 7. 정렬 (sort_values)

```python
df.sort_values('컬럼명', ascending=False)                 # 내림차순 (기본은 오름차순)
df.sort_values(['컬럼1', '컬럼2'], ascending=[False, True]) # 여러 컬럼 정렬
df.nlargest(5, '컬럼명')                                    # 상위 5개만 바로 뽑기
```

`groupby()`와 `merge()`는 헷갈리기 쉬운데, "하나의 데이터 안에서 그룹으로 요약"하면 groupby, "서로 다른 두 데이터를 연결"하면 merge다.

---

## 8. 시각화 (Matplotlib)

```python
import matplotlib.pyplot as plt

# Colab 한글 폰트 (최초 1회, 이후 런타임 재시작)
plt.rc('font', family='NanumGothic')
plt.rc('axes', unicode_minus=False)
```

| 그래프 | 함수 | 용도 |
|---|---|---|
| 막대 그래프 | `plt.bar(x, height)` | 범주별 크기 비교 |
| 선 그래프 | `plt.plot(x, y)` | 시간에 따른 변화 추이 |
| 산점도 | `plt.scatter(x, y)` | 두 변수의 관계(상관관계) |
| 파이 차트 | `plt.pie(values, labels=labels, autopct='%1.1f%%')` | 전체 대비 비율 |

```python
plt.figure(figsize=(8, 5))
plt.bar(categories, values, color=['#3498db', '#e74c3c'])
plt.title('제목', fontsize=14)
plt.xlabel('X축'); plt.ylabel('Y축')
plt.ylim(30000000, 40000000)   # Y축 범위 조정 (차이를 강조, 단 값 왜곡 주의)
for i, v in enumerate(values):
    plt.text(i, v, f'{v:,.0f}', ha='center')  # 막대 위 값 표시
plt.legend()
plt.tight_layout()   # 여백 자동 조정 (레이블 잘림 방지)
plt.show()
plt.savefig('결과.png', dpi=150, bbox_inches='tight')  # show() 이전에 호출해야 저장됨
```

**상관관계 읽기** — `df['x'].corr(df['y'])`로 계산, 범위는 -1~+1.

| 절대값 | 해석 |
|---|---|
| 0.0 ~ 0.3 | 약한 상관 |
| 0.3 ~ 0.7 | 중간 상관 |
| 0.7 ~ 1.0 | 강한 상관 |

```python
import numpy as np
z = np.polyfit(df['x'], df['y'], 1)   # 1차 회귀(추세선) 계수
p = np.poly1d(z)
plt.plot(x_line, p(x_line), '--', color='red', label='추세선')
```

**여러 그래프 한 화면에 배치**: `fig, axes = plt.subplots(1, 3, figsize=(18, 5))` 후 `axes[0].bar(...)`, `axes[1].plot(...)` 식으로 각 축에 그린다.

**주의 (시각화 윤리)**: `plt.ylim()`으로 Y축 범위를 좁히면 차이가 실제보다 과장되어 보일 수 있다. 막대 위에 정확한 숫자를 함께 표시해 오해를 방지해야 한다.

---

## 9. AI 활용 윤리 및 거버넌스 (요약)

> "AI가 그랬어요"는 면책이 안 된다 — 법과 제도는 AI를 도구로, 책임은 사용자/기업에 있는 것으로 본다.

**핵심 축 3가지**

| 축 | 리스크 |
|---|---|
| 데이터 보안 | 회사 내부 정보·개인정보를 프롬프트에 그대로 입력 → 외부 서버 전송, NDA 위반 |
| 저작권 | AI 생성물을 저작권 확인 없이 상업적으로 바로 사용 → 침해 분쟁 |
| 책임 소재 | AI 결과를 검증 없이 채용/평가 등 의사결정에 반영 → 차별, 책임 불분명 |

**안전한 활용 원칙**: 데이터는 비식별화/가상 데이터로 대체하고, 생성물은 초안 용도로만 쓰며 사람이 최종 검증하고, AI는 의사결정 보조 도구로만 사용한다(최종 판단은 사람).

**AI 사용 전 체크리스트**
- 내부/개인정보 포함 여부 확인
- 외부 전송 가능한 데이터인지 확인
- 저작권·라이선스 이슈 없는지 확인
- 결과를 그대로 쓰는지 참고용인지 구분
- 최종 책임자가 누구인지 명확히 함

---

## 10. 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| 데이터 리터러시 | 읽기 → 해석 → 활용의 3단계. 전처리 없이는 분석 자체가 불가능 |
| `read_csv()` | CSV 불러오기, 인코딩(cp949/utf-8/latin-1) 확인이 첫 관문 |
| 탐색 4종 | `head/tail`, `shape`, `info()`, `describe()` — 데이터 감 잡기 |
| 결측치 | `isnull().sum()`으로 확인 → `fillna()`(채우기) or `dropna()`(삭제), 상황에 맞는 전략 선택 |
| 필터링 | `df[조건]` 불리언 인덱싱, `&`/`\|`/`~`로 조건 조합, 임계값 설정이 결과를 좌우 |
| 병합 | `pd.merge(a, b, on='키', how=...)`, SQL JOIN과 동일 개념 |
| 집계 | `groupby('기준')['대상'].sum()`, SQL GROUP BY와 대응, `.reset_index()` 필수 |
| 정렬 | `sort_values()` / `nlargest()`로 Top N 추출 |
| 시각화 | bar(비교) / plot(추이) / scatter(관계), `corr()`로 상관계수 확인 |
| AI 윤리 | 보안·저작권·책임 3축, "AI는 도구, 책임은 사람" |
