---
title: SQL 핵심 쿼리 레퍼런스 (Step1 챕터2 압축노트)
date: 2026-08-08
tags: cheat-sheet, 기초
order: 
featured: false
draft: false
---

# SQL 핵심 쿼리 레퍼런스 (Step1 챕터2 압축노트)

SQL은 데이터베이스에 저장된 데이터를 조건에 맞게 조회·정리해서 분석/모델링에 쓸 수 있는 형태로 꺼내오는 언어다. 분석가는 주로 조회(SELECT) 계열을 쓰고, 데이터 추가·수정·권한은 협업 맥락 이해 수준이면 충분하다. 아래는 실무에서 자주 쓰고 자주 헷갈리는 문법 위주의 압축 레퍼런스다.

## 목차

- [1. 테이블 기본](#1-테이블-기본-한-줄-압축)
- [2. DML·DCL](#2-데이터-추가·수정·권한-dml·dcl)
- [3. 조건 검색](#3-조건-검색-select--where--null)
- [4. 집계와 정렬](#4-집계와-정렬-group-by--order-by--having)
- [5. 조인](#5-조인-join)
- [6. 서브쿼리와 CTE](#6-서브쿼리와-cte-with)
- [7. 피벗](#7-피벗-case-when)
- [핵심 요약 카드](#핵심-요약-카드)

## 1. 테이블 기본 (한 줄 압축)

데이터베이스는 폴더, 테이블은 그 안의 엑셀 파일 같은 구조다. SQL은 이 데이터베이스에 질문(Query)을 던지는 언어다.

```sql
CREATE TABLE team_members (
  member_id INTEGER PRIMARY KEY,   -- 각 행을 구분하는 고유값, 중복/NULL 불가
  name VARCHAR(50) NOT NULL,       -- 반드시 값이 있어야 하는 컬럼
  role VARCHAR(50) NOT NULL,
  join_date DATE,
  email VARCHAR(100)
);
```

- **PRIMARY KEY (PK)**: 각 행을 구분하는 유일값. 중복/NULL 불가.
- **NOT NULL**: 값이 비어있으면 안 되는 컬럼에 지정.

## 2. 데이터 추가·수정·권한 (DML·DCL)

**DML**: Data **Manipulation** Language

**DCL**: Data **Control** Language

| 구분 | 명령어 | 역할 |
|---|---|---|
| DML (데이터 조작) | `INSERT` / `UPDATE` / `DELETE` | 테이블 **안의 데이터**를 추가·수정·삭제 |
| DCL (권한 제어) | `GRANT` / `REVOKE` | 데이터베이스 **접근 권한**을 부여·회수 |

```sql
INSERT INTO team_members (member_id, name, role, join_date, email)
VALUES (1, '팀스파르타', '데이터 분석가', DATE '2024-03-01', 'team.sparta@example.com');

UPDATE team_members
SET phone = '010-9999-8888'
WHERE member_id = 1;          -- WHERE 없으면 전체 행이 수정됨

DELETE FROM team_members
WHERE member_id = 1;          -- WHERE 없으면 전체 행 삭제

GRANT SELECT, INSERT ON team_members TO some_user;   -- 권한 부여
REVOKE INSERT ON team_members FROM some_user;        -- 권한 회수
```

> `UPDATE`/`DELETE`는 `WHERE` 조건을 반드시 먼저 확인한다 — 조건이 없으면 전체 행이 대상이 된다.

분석가는 INSERT/UPDATE/DELETE를 직접 자주 쓰기보다, 테스트 데이터 입력이나 잘못된 값 수정처럼 협업 상황에서 "가볍게 읽고 이해"하는 수준이면 충분하다. GRANT/REVOKE도 실제로는 데이터 엔지니어·플랫폼 담당자가 관리하는 경우가 많다.

## 3. 조건 검색 (SELECT / WHERE / NULL)

```sql
SELECT id, name, region, degree_type, establishment_type
FROM schools
WHERE region = '서울'
  AND degree_type = '유치원'
  AND establishment_type IN ('공립', '사립')   -- OR 여러 개 대신 IN
  AND name IS NOT NULL;                        -- NULL은 = 로 비교 불가
```

- `SELECT *`는 컬럼 전체 확인용, 실무에서는 필요한 컬럼만 명시해서 조회한다.
- `OR`로 조건 여러 개를 나열하는 대신 `IN ('공립', '사립')`으로 축약할 수 있다.
- **NULL 비교 주의**: `WHERE region = NULL`은 항상 거짓이다. `IS NULL` / `IS NOT NULL`을 써야 한다.

이 필터링 결과가 그대로 분석·통계·AI 모델의 입력 데이터(모집단)가 되므로, "어떤 조건으로 모집단을 정의했는가"가 곧 분석의 전제가 된다.

## 4. 집계와 정렬 (GROUP BY / ORDER BY / HAVING)

```sql
SELECT
  region,
  establishment_type,
  COUNT(*) AS kindergarten_count       -- ALIAS로 컬럼명 지정
FROM schools
WHERE degree_type = '유치원'
GROUP BY region, establishment_type    -- 같은 값끼리 묶기
ORDER BY kindergarten_count DESC;      -- DESC: 큰→작은, ASC: 작은→큰(기본값)
```

- `COUNT(*)`: 행 개수 자체를 센다. `COUNT(컬럼)`: 해당 컬럼이 NULL이 아닌 행만 센다.
- `GROUP BY`에 나열한 컬럼 조합이 같은 행끼리 하나의 그룹으로 묶인다.

**WHERE vs HAVING** — 둘 다 필터링이지만 적용 시점이 다르다.

| 구분 | 적용 대상 | 적용 시점 |
|---|---|---|
| `WHERE` | 개별 행 | `GROUP BY` **이전** — 그룹으로 묶기 전에 행을 거른다 |
| `HAVING` | 그룹(집계 결과) | `GROUP BY` **이후** — 집계값(예: `COUNT(*) > 10`) 기준으로 그룹을 거른다 |

```sql
-- "유치원이 10개 이상인 지역만" 보고 싶을 때
SELECT region, COUNT(*) AS cnt
FROM schools
WHERE degree_type = '유치원'   -- 행 필터: 유치원만 대상으로
GROUP BY region
HAVING COUNT(*) >= 10;         -- 그룹 필터: 집계값 기준
```

`GROUP BY` + `COUNT`/`AVG`/`SUM` 흐름은 Pandas의 `groupby().agg()`와 정확히 대응된다. Pandas 쪽 전처리는 [Pandas 데이터 전처리 레퍼런스 (Step1 챕터3 압축노트)](../../Python/pandas-data-preprocessing-reference/main.md)에서 다룬다.

## 5. 조인 (JOIN)

JOIN은 엑셀의 VLOOKUP과 같은 원리다 — 공통 키(컬럼)를 기준으로 서로 다른 테이블의 값을 가져와 하나로 합친다. 두 테이블의 키 컬럼명이 달라도 무방하다.

```sql
SELECT
  s.id, t.year, s.name, t.department_name, t.tuition_grad_lecture_fee
FROM school_tuitions t
LEFT JOIN schools s
  ON t.school_id = s.id
LIMIT 20;
```

| 종류 | 살아남는 행 | 언제 쓰나 |
|---|---|---|
| `INNER JOIN` | 두 테이블 **모두**에 키가 있는 행만 | 양쪽 다 매칭되는 데이터만 필요할 때 |
| `LEFT JOIN` | **왼쪽(FROM)** 테이블 행은 전부, 오른쪽은 매칭 안 되면 NULL | 기준 테이블은 유지하고 다른 테이블 정보를 "덧붙일" 때 (실무 기본값) |
| `RIGHT JOIN` | LEFT JOIN의 반대 (오른쪽 기준) | LEFT JOIN으로 테이블 순서만 바꿔도 대체 가능해 실무에서 잘 안 씀 |
| `FULL JOIN` | 양쪽 테이블 행을 모두 포함, 매칭 안 되면 NULL | 양쪽 모두의 결측을 확인하고 싶을 때 |

> 등록금 테이블(`school_tuitions`)에는 학교명이 없고, 학교 테이블(`schools`)에는 등록금이 없다 — 이렇게 한 테이블에 모든 정보가 없는 것이 실무 데이터의 기본값이다. 그래서 분석 전 JOIN으로 하나의 데이터셋을 먼저 만드는 과정이 필요하다.

Pandas의 `merge()`가 SQL JOIN에 대응한다 (`how='inner'`/`'left'`/`'right'`/`'outer'`).

## 6. 서브쿼리와 CTE (WITH)

**서브쿼리**: 쿼리 안에 들어가는 또 다른 쿼리. 중간 결과를 임시 테이블처럼 두고 그 결과를 다시 조회한다.

```sql
SELECT *
FROM (
  SELECT year, school_id, AVG(tuition_grad_lecture_fee) AS avg_fee
  FROM school_tuitions
  GROUP BY year, school_id
) t;   -- FROM 절 안 서브쿼리는 별칭(alias) 필수
```

서브쿼리가 길어지면 가독성이 떨어진다. **CTE(Common Table Expression, `WITH` 절)**는 쿼리 안에서만 쓰는 임시 이름 있는 중간 결과다 — 실제 테이블을 만들지 않고 쿼리가 끝나면 사라진다.

```sql
WITH tuition AS (                              -- 1단계: 학교별·연도별 평균 등록금
  SELECT year, school_id, AVG(tuition_grad_lecture_fee) AS avg_fee
  FROM school_tuitions
  GROUP BY year, school_id
),
tuition_with_school AS (                       -- 2단계: 학교 정보 JOIN
  SELECT t.year, t.school_id, s.name, t.avg_fee
  FROM tuition t
  LEFT JOIN schools s ON t.school_id = s.id
  WHERE s.name IS NOT NULL AND t.avg_fee > 0
)
SELECT name, year, avg_fee                     -- 3단계: 최종 조회
FROM tuition_with_school
ORDER BY name, year;
```

CTE는 여러 개를 쉼표로 이어 단계별 분석을 쌓아올릴 수 있다 (`cte1` 결과를 `cte2`가 참조하는 식).

**서브쿼리/CTE vs JOIN, 언제 쓸까**

| 상황 | 선택 |
|---|---|
| 단순히 다른 테이블의 컬럼 값을 "붙이기"만 하면 될 때 | `JOIN` |
| 집계·필터링한 **중간 결과**를 먼저 만들고, 그 결과를 다시 조회/조인해야 할 때 | 서브쿼리 또는 `WITH`(CTE) |
| 여러 단계를 거치는 복잡한 분석이라 가독성이 중요할 때 | `WITH`로 단계별 이름을 붙여 순서대로 쌓기 |

## 7. 피벗 (CASE WHEN)

세로로 긴 집계 결과(연도가 행으로 나열)를 보고서용 가로형 표(연도가 컬럼)로 바꾸는 패턴이다. 표준 SQL에는 `PIVOT` 문법이 없는 DB가 많아, `CASE WHEN` + 집계함수 조합이 가장 범용적이다.

```sql
-- 세로형: name, year, avg_fee (행이 연도별로 나열됨)
-- 가로형으로 변환:
SELECT
  name,
  AVG(CASE WHEN year = 2021 THEN avg_fee END) AS y2021,
  AVG(CASE WHEN year = 2022 THEN avg_fee END) AS y2022,
  AVG(CASE WHEN year = 2023 THEN avg_fee END) AS y2023
FROM tuition_with_school
GROUP BY name;
```

- `CASE WHEN 조건 THEN 값 END`가 조건에 안 맞으면 `NULL`을 반환하고, 바깥의 `AVG()`/`SUM()`이 그 NULL을 무시하고 값 하나만 골라 집계하는 구조다.
- 패턴: **집계 기준(행) × 구분 컬럼(가로로 펼칠 값) → `GROUP BY` 기준 + `CASE WHEN`으로 구분값마다 컬럼 하나씩 생성**.

## 핵심 요약 카드

| 개념 | 핵심 내용 |
|---|---|
| 테이블 설계 | `CREATE TABLE` + `PRIMARY KEY`(유일·NOT NULL) + `NOT NULL` 제약 |
| DML / DCL | `INSERT`/`UPDATE`/`DELETE`는 데이터 조작, `GRANT`/`REVOKE`는 권한 제어. `UPDATE`/`DELETE`는 `WHERE` 필수 확인 |
| 조건 검색 | `SELECT` 필요 컬럼만, `WHERE`로 필터, `IN`으로 `OR` 축약, NULL은 `IS NULL`/`IS NOT NULL` |
| 집계·정렬 | `GROUP BY`로 묶고 `COUNT`/`AVG` 등으로 집계, `ORDER BY`로 정렬, `HAVING`은 그룹 필터(WHERE는 행 필터) |
| 조인 | 공통 키로 테이블 결합(VLOOKUP과 동일 원리). `LEFT JOIN`이 실무 기본값, `INNER JOIN`은 양쪽 매칭만 |
| 서브쿼리·CTE | 쿼리 안의 쿼리로 중간 결과 재사용. `WITH`로 여러 단계를 이름 붙여 순서대로 쌓기 |
| 피벗 | `CASE WHEN` + 집계함수로 세로형 데이터를 가로형 보고서 표로 변환 |

SQL은 특정 직무 전유물이 아니라 데이터를 다루는 모든 직군의 공통 언어다 — 분석가·데이터 사이언티스트는 조회·집계·조인 중심으로, 백엔드/데이터 엔지니어는 조작·설계·권한까지 깊게 쓴다. 이 레퍼런스는 그중 분석 실무에서 가장 자주 쓰이는 영역이다.
