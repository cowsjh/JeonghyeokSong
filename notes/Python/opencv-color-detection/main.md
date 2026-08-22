---
title: 색상 기반 물체 검출 (Color Detection)
date: 2026-08-08
tags: color-detection
order: 
featured: false
draft: false
---

# 색상 기반 물체 검출 (Color Detection)

HSV 색공간에서 특정 색을 threshold로 걸러 마스크를 만들고, 그 마스크에서 물체의 윤곽선·중심좌표·박스를 뽑아내는 파이프라인 정리.

## 전체 흐름

```
frame → HSV 변환 → inRange (마스크 생성) → findContours (덩어리 윤곽 찾기) → contourArea/boundingRect (물체 위치·크기 판단)
```

## [cv2.inRange](../opencv-basic-functions/main.md) — HSV 범위로 이진 마스크 생성

```python
mask = cv2.inRange(hsv, lower, upper)
```

- `src`: 입력 이미지 (HSV 변환한 이미지를 씀 — RGB보다 색상 범위 지정이 직관적)
- `lowerb`, `upperb`: 각 채널의 하한/상한 값
- 반환값: 조건을 만족하는 픽셀은 255(흰색), 아니면 0(검은색)인 이진 이미지

**왜 HSV를 쓰는지**: RGB는 조명 변화에 따라 R, G, B 세 값이 다 같이 흔들려서 "빨간색"을 범위로 잡기 어렵다. HSV는 색상(Hue)이 밝기(Value)와 분리돼 있어서 색 자체를 기준으로 threshold 잡기가 훨씬 안정적이다.

### 빨간색은 구간이 두 개 필요

HSV의 Hue는 0~179 범위인데, 빨간색은 색상환에서 0도 근처에 걸쳐 있어서 `0~10`뿐 아니라 `170~179`쪽도 빨간색이다. 한 구간만 쓰면 진한 빨강을 놓친다.

| 색상 | Lower | Upper |
| --- | --- | --- |
| 빨강 | `[0, 120, 70]` | `[10, 255, 255]` (+ `[170,120,70]` ~ `[180,255,255]`) |
| 파랑 | `[100, 150, 50]` | `[130, 255, 255]` |
| 초록 | `[40, 70, 70]` | `[80, 255, 255]` |
| 노랑 | `[20, 100, 100]` | `[40, 255, 255]` |

## cv2.bitwise_or — 마스크 합치기 (OR 조건)

픽셀 단위 OR 연산. 마스크(0/255)에서는 "둘 중 하나라도 흰색이면 흰색"으로 이해하면 된다. 빨간색처럼 구간이 두 개인 색은 각 구간의 마스크를 만든 뒤 OR로 합쳐야 완전한 빨강이 된다.

```python
lower, upper = TARGET_COLOR  # 구간 여러 개를 담은 튜플

mask = None
for lower, upper in TARGET_COLOR:
    lower = np.array(lower, dtype=np.uint8)
    upper = np.array(upper, dtype=np.uint8)
    sample = cv2.inRange(hsv, lower, upper)
    mask = sample if mask is None else cv2.bitwise_or(mask, sample)
```

> [!TIP]
> **np.array의 dtype=np.uint8은 왜 붙이는지**
> `np.array`는 dtype을 생략하면 입력값에 따라 자동 추론된다(정수면 int64, 실수면 float64). `dtype=np.uint8`을 안 붙여도 `cv2.inRange`는 내부적으로 처리해서 대부분 문제없이 동작하지만, 값이 0~255(HSV는 0~179) 범위를 벗어나지 않는 걸 코드에 명시해두는 안전장치 역할을 한다. 나중에 다른 uint8 배열과 연산할 때 타입 불일치로 인한 오버플로우를 예방하는 방어적 프로그래밍 습관.

## cv2.findContours — 마스크에서 윤곽선 찾기

```python
contours, hierarchy = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
```

- `mask`: 반드시 이진 이미지(0/255) — `cv2.inRange`의 결과물이 딱 맞는 입력
- 반환값: `contours`(윤곽선 리스트, 각각 `(N,1,2)` 좌표 배열), `hierarchy`(윤곽선 간 부모/자식 관계)

**검색 모드** (retrieval mode)

| 모드 | 의미 |
| --- | --- |
| `cv2.RETR_EXTERNAL` | 가장 바깥 윤곽선만 (구멍·안쪽 윤곽선 무시) |
| `cv2.RETR_TREE` | 모든 윤곽선 + 부모-자식 계층 구조까지 |

**근사 방법** (approximation method)

| 방법 | 의미 |
| --- | --- |
| `cv2.CHAIN_APPROX_SIMPLE` | 직선 구간은 끝점 두 개만 저장 (메모리 절약) |
| `cv2.CHAIN_APPROX_NONE` | 윤곽선의 모든 점을 저장 |

`findContours` 자체에는 크기로 걸러내는 기능이 없다. `cv2.contourArea()`로 면적을 구해서 직접 필터링해야 한다 — 조명 노이즈나 배경의 비슷한 색 조각도 다 윤곽선으로 잡히기 때문.

```python
MIN_AREA = 500
objects = []
for c in contours:
    area = cv2.contourArea(c)
    if area < MIN_AREA:
        continue
    x, y, w, h = cv2.boundingRect(c)
    cx = x + w // 2
    cy = y + h // 2
    objects.append((cx, cy, area, (x, y, w, h)))
```

> [!TIP]
> **w // 2를 쓰는 이유 (w / 2가 아니라)**
> 파이썬 3에서 `/`는 항상 float를 반환한다(`100/2` → `50.0`). 이미지 좌표나 픽셀 인덱스는 정수여야 하는데 float 좌표를 `cv2.circle` 등에 넘기면 에러가 나거나 지저분한 캐스팅이 필요해진다. `//`(정수 나눗셈, floor division)를 쓰면 처음부터 int로 딱 떨어진다.

## cv2.boundingRect — 윤곽선을 감싸는 사각형

```python
x, y, w, h = cv2.boundingRect(c)
```

윤곽선을 감싸는 가장 작은 축-정렬(axis-aligned) 직사각형을 반환. 반환값은 `(x, y, w, h)` 튜플:

| 값 | 의미 |
| --- | --- |
| `x` | 사각형 왼쪽 위 꼭짓점 x좌표 |
| `y` | 사각형 왼쪽 위 꼭짓점 y좌표 |
| `w` | 너비 |
| `h` | 높이 |

이미지 좌표계는 원점(0,0)이 왼쪽 위이고 y는 아래로 갈수록 커진다 (수학 그래프와 반대).

물체가 기울어져 있어도 축에 맞춰 감싸는 사각형만 주기 때문에, 회전한 최소 사각형이 필요하면 `cv2.minAreaRect`를 대신 써야 한다.

## 여러 물체 동시 검출

윤곽선 필터링 루프에서 매번 `x, y, w, h`를 덮어쓰면 마지막으로 통과한 윤곽선 하나만 남는 버그가 생긴다. 리스트에 `append`로 누적해야 여러 개를 동시에 검출할 수 있다.

```python
def find_objects(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    objects = []
    for c in contours:
        area = cv2.contourArea(c)
        if area < MIN_AREA:
            continue
        x, y, w, h = cv2.boundingRect(c)
        cx, cy = x + w // 2, y + h // 2
        objects.append((cx, cy, area, (x, y, w, h)))
    return objects

def draw_detection(frame, objects):
    color = (50, 50, 255)
    for cx, cy, area, rec in objects:
        pt1 = (rec[0], rec[1])
        pt2 = (rec[0] + rec[2], rec[1] + rec[3])
        cv2.rectangle(frame, pt1, pt2, color)
        cv2.circle(frame, (cx, cy), 2, color)
        cv2.putText(frame, f"{cx}, {cy}", (rec[0], rec[1]), cv2.FONT_HERSHEY_SIMPLEX, 1, color)
    return frame
```

## 참고: 실제 구현 위치

물리 AI 부트캠프 예습 진행 중 작성한 색상 검출 코드는 `week2/main.py`(`physical-ai-project`)에 있다.
