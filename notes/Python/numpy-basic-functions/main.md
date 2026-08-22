---
title: NumPy 기본 함수
date: 2026-08-08
tags: cheat-sheet
order: 
featured: false
draft: false
---

# NumPy 기본 함수

## 배열 생성

| 함수 | 기능 | 예시 |
|---|---|---|
| `np.array()` | 리스트/튜플 → ndarray 변환 | `np.array([1, 2, 3])` |
| `np.arange()` | 범위 기반 배열 (`range()`의 numpy 버전) | `np.arange(0, 10, 2)` → `[0 2 4 6 8]` |
| `np.linspace()` | 시작~끝을 n등분한 배열 (끝값 포함) | `np.linspace(0, 1, 5)` → `[0. 0.25 0.5 0.75 1.]` |
| `np.zeros()` | 0으로 채운 배열 | `np.zeros((2, 3))` |
| `np.ones()` | 1로 채운 배열 | `np.ones((2, 3))` |
| `np.eye()` | 단위행렬 | `np.eye(3)` |
| `np.full()` | 지정 값으로 채운 배열 | `np.full((2, 2), 7)` |

## 배열 속성

| 속성/함수 | 기능 | 예시 |
|---|---|---|
| `arr.shape` | 각 축의 크기 (행, 열, ...) | `arr.shape` → `(3, 4)` |
| `arr.ndim` | 차원 수 | `arr.ndim` → `2` |
| `arr.size` | 전체 원소 개수 | `arr.size` → `12` |
| `arr.dtype` | 원소 자료형 | `arr.dtype` → `dtype('int64')` |
| `arr.astype()` | 자료형 변환 | `arr.astype(np.float32)` |

## 인덱싱 / 슬라이싱

| 문법 | 기능 | 예시 |
|---|---|---|
| `arr[i, j]` | 특정 원소 접근 (콤마로 축 구분) | `arr[1, 2]` |
| `arr[i, :]` | i번째 행 전체 | `arr[1, :]` |
| `arr[:, j]` | j번째 열 전체 | `arr[:, 0]` |
| `arr[a:b]` | 슬라이싱 (원본과 메모리 공유 — 뷰) | `arr[1:3]` |
| `arr[조건식]` | 불리언 마스크 인덱싱 | `arr[arr > 5]` |
| `arr[[i, j, k]]` | 팬시 인덱싱 (리스트로 여러 인덱스 선택) | `arr[[0, 2]]` |

> 슬라이싱은 원본 배열과 메모리를 공유하는 **뷰(view)**를 반환한다. 슬라이스를 수정하면 원본도 바뀐다 — 독립된 복사본이 필요하면 `.copy()`를 명시해야 한다.

## 형태 변경

| 함수 | 기능 | 예시 |
|---|---|---|
| `arr.reshape()` | 형태 변경 (원소 총개수 유지) | `arr.reshape(3, 4)` |
| `arr.flatten()` | 1차원으로 평탄화 (복사본 반환) | `arr.flatten()` |
| `arr.T` | 전치(transpose) | `arr.T` |
| `np.concatenate()` | 배열 이어붙이기 | `np.concatenate([a, b], axis=0)` |
| `np.stack()` | 새 축을 만들어 배열들을 쌓기 | `np.stack([a, b], axis=0)` |
| `np.vstack()` / `np.hstack()` | 수직/수평 방향으로 쌓기 | `np.vstack([a, b])` |

## 수학 / 통계 연산

| 함수                            | 기능                         | 예시                    |
| ----------------------------- | -------------------------- | --------------------- |
| `np.sum()`                    | 합계 (`axis` 지정 시 행/열 단위)    | `np.sum(arr, axis=0)` |
| `np.mean()`                   | 평균                         | `np.mean(arr)`        |
| `np.std()`                    | 표준편차 (기본 `ddof=0`, 모집단 기준) | `np.std(arr, ddof=1)` |
| `np.min()` / `np.max()`       | 최솟값/최댓값                    | `np.max(arr, axis=1)` |
| `np.argmin()` / `np.argmax()` | 최솟값/최댓값의 인덱스               | `np.argmax(arr)`      |
| `np.dot()`                    | 내적/행렬곱                     | `np.dot(a, b)`        |
| `np.sqrt()`                   | 제곱근 (원소별)                  | `np.sqrt(arr)`        |
| `np.abs()`                    | 절댓값 (원소별)                  | `np.abs(arr)`         |
| `np.clip()`                   | 범위를 벗어난 값을 경계값으로 자르기       | `np.clip(arr, 0, 1)`  |
| `np.hypot()`                  | $\sqrt{x^2+y^2}$           | `np.hypot(x,y)`       |

## 조건 / 정렬

| 함수 | 기능 | 예시 |
|---|---|---|
| `np.where()` | 조건에 따라 값 선택 (삼항연산자의 벡터 버전) | `np.where(arr > 0, 1, -1)` |
| `np.sort()` | 정렬 (오름차순, 새 배열 반환) | `np.sort(arr)` |
| `np.argsort()` | 정렬했을 때의 인덱스 순서 | `np.argsort(arr)` |
| `np.unique()` | 중복 제거 후 정렬된 고유값 | `np.unique(arr)` |

## 난수

| 함수 | 기능 | 예시 |
|---|---|---|
| `np.random.seed()` | 난수 시드 고정 (재현성) | `np.random.seed(42)` |
| `np.random.rand()` | 0~1 균등분포 난수 | `np.random.rand(3, 2)` |
| `np.random.randn()` | 표준정규분포 난수 | `np.random.randn(3, 2)` |
| `np.random.randint()` | 정수 난수 | `np.random.randint(0, 10, size=5)` |

관련: [NumPy - Pandas 통계 함수](../numpy-pandas-statistics/main.md)
