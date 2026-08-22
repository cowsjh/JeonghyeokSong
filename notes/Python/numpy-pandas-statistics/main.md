---
title: NumPy - Pandas 통계 함수
date: 2026-08-08
tags: pandas, statistics
order: 
featured: false
draft: false
---

# NumPy - Pandas 통계 함수

## Pandas 함수

| 함수 | 역할 | 예시 |
|---|---|---|
| `pd.read_csv()` | CSV → DataFrame 로드 | `pd.read_csv("data/student_habits.csv", encoding="utf-8-sig")` |
| `pd.to_numeric()` | 값을 수치형으로 강제 변환 | `pd.to_numeric(df["score"], errors="coerce")` |
| `df.shape` | (행 수, 열 수) | `df.shape` → `(200, 9)` |
| `df.columns` | 컬럼명 목록 | `df.columns` |
| `df.dtypes` | 컬럼별 자료형 | `df.dtypes` |
| `df.head()` | 상위 n행 | `df.head(5)` |
| `df.info()` | 컬럼/자료형/결측치 요약 | `df.info()` |
| `df.describe()` | 기술통계 (평균, std, min/max, 사분위수). 결측치는 기본적으로 제외하고 계산됨 | `df.describe()` |
| `df.select_dtypes()` | 특정 자료형 컬럼만 선택 | `df.select_dtypes(include="number")` |
| `df[col].mean()` / `.std()` | 컬럼 평균/표준편차 (**기본 ddof=1**, 표본 표준편차) | `df["study_hours"].mean()` |
| `df.isnull()` | 결측치 여부 True/False | `df.isnull().sum()` |
| `df.dropna()` | 결측치 제거 | `df["study_hours"].dropna().values` |

## NumPy 함수

| 함수 | 역할 | 예시 |
|---|---|---|
| `np.mean()` | 평균 | `np.mean(arr)` |
| `np.std()` | 표준편차 (**기본 ddof=0**, 모집단 표준편차 — pandas와 맞추려면 `ddof=1` 지정) | `np.std(arr, ddof=1)` |
| `np.median()` | 중앙값 | `np.median(arr)` |
| `np.min()` / `np.max()` | 최솟값/최댓값 | `np.min(arr)` |

> `np.std`와 `df[col].std()`는 기본 ddof 값이 달라(0 vs 1) 결과가 다르게 나올 수 있음. numpy를 pandas 결과와 일치시키려면 `ddof=1`을 명시.

## Python 내장 / OS 함수

| 함수 | 역할 | 예시 |
|---|---|---|
| `os.path.exists()` | 파일 존재 확인 | `os.path.exists("data/file.csv")` |
| `os.getcwd()` | 현재 작업 디렉토리 | `os.getcwd()` |
| `os.listdir()` | 폴더 내 파일 목록 | `os.listdir("data")` |
| `len()` | 길이/행 수 | `len(df)` |
| `round()` | 반올림 | `round(값, 자릿수)` |

출처: https://nbc-precamp-venture7.oopy.io/38d2dc3e-f514-8015-8990-d286db57874a

---

함수 자체의 사용법은 [NumPy 기본 함수](../numpy-basic-functions/main.md), [Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)](../pandas-data-preprocessing-reference/main.md) 참고.
