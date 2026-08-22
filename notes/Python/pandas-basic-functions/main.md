---
title: 탐색 함수
date: 2026-08-08
tags: data-cleaning, cheat-sheet
order: 
featured: false
draft: false
---

# 탐색 함수

```python

# 기본
df["새 컬럼"] = 원하는 값
df.head(n) / df.tail(n)
df.shape
df.columns
df.info()
df.describe()
df["컬럼"].unique()    # 고유값 목록
df["컬럼"].nunique()   # 고유값 개수
df["컬럼"].value_counts()
df["컬럼"].sample(샘플 개수) # numpy 의 전역 랜덤 상태를 사용 한다.

# 집계
df.groupby("기준 컬럼")["컬럼"].집계함수()
pd.qcut() # 원하는 만큼 분할
pd.loc() #행을 특정함
df.corr()
df.select_dtypes(include="number")
x = df.drop(columns=["컬럼"]) # "컬럼" 제외 하고 모두 x 로

# 정렬
df.sort_vaules("컬럼명", ascending = False)
df.sort_values(["컬럼1", "컬럼2"], ascending = [False, True])
df.nlargest[5, "컬럼명"]
df.set_index("컬럼")
  .resample("1h")
  .sum(min_count=1)
df.tolist()
```

# 수치 변화

```python

df.astype(str)

# 병합
pd.merge(left_df, right_df, on = "공통컬럼", how = "inner" )

# 삭제
df.dropna()
df['컬럼'].fillna(0)
df["컬럼"].fillna(df["col"].mean())
df["컬럼"].interpolate()

# 날짜, 시간, 숫자
pd.to_datetime(df["날짜 컬럼"], errors="coerce")
pd.to_timedelta(df["hour"], unit="h") # 시간의 간격을 출력함
pd.to_numeric(df["숫자 문자열 컬럼"], errors="coerce") # -> 문자열을 숫자로 변환
df["year"] = df["datatime"].dt.year #year, month, day, hour, minute, second



```

# 수치 해석

```python
df["컬럼"].mean() # ... 더 많다.
df["컬럼"].rolling(window, min_periods = n).mean() # 이동 평균
pd.pct_change() # 이전시점 대비 증감률
pd.isin()
df.agg(
	spend_sum =("rpt_time_cost", "sum"),
    earn_sum = ("rpt_time_earn", "sum"),
    clk_sum = ("rpt_time_turn", "sum"),
    turn_sum = ("rpt_time_turn", "sum")
    )



```

---

정리된 형태의 pandas 전처리 레퍼런스는 [Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)](../pandas-data-preprocessing-reference/main.md) 참고.
