---
title: OpenCV 기본 함수
date: 2026-08-08
tags: cheat-sheet
order: 
featured: false
draft: false
---

# OpenCV 기본 함수

## 영상 입출력 / 윈도우

| 함수 | 기능 | 예시 |
|---|---|---|
| `cv2.VideoCapture()` | 카메라/동영상 열기 (메서드·속성은 [VideoCapture 메서드와 속성](../opencv-videocapture/main.md) 참고) | `cv2.VideoCapture(0, cv2.CAP_DSHOW)` |
| `cv2.imshow()` | 윈도우에 이미지 표시 | `cv2.imshow('Result', frame)` |
| `cv2.waitKey()` | 키 입력 대기 (ms), 반환값은 키코드 | `cv2.waitKey(1) & 0xFF == ord('q')` |
| `cv2.destroyAllWindows()` | 열린 윈도우 전부 닫기 | `cv2.destroyAllWindows()` |
| `cv2.namedWindow()` | 이름 붙인 윈도우 생성 (트랙바 붙일 때 필요) | `cv2.namedWindow('Parameters')` |
| `cv2.createTrackbar()` | 윈도우에 슬라이더(트랙바) 추가 | `cv2.createTrackbar('th1', 'Parameters', 50, 200, lambda x: None)` |
| `cv2.getTrackbarPos()` | 트랙바 현재 값 읽기 | `cv2.getTrackbarPos('th1', 'Parameters')` |

## 색공간 변환

| 함수 | 기능 | 예시 |
|---|---|---|
| `cv2.cvtColor()` | 색공간 변환 | `cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)` |

자주 쓰는 변환 코드:

| 코드 | 의미 |
|---|---|
| `cv2.COLOR_BGR2GRAY` | BGR → 그레이스케일 |
| `cv2.COLOR_BGR2HSV` | BGR → HSV (색상 threshold 잡을 때) |
| `cv2.COLOR_GRAY2BGR` | 그레이스케일 → BGR (흑백 이미지를 컬러 이미지와 나란히 합칠 때) |

## 필터 / 전처리

| 함수 | 기능 | 예시 |
|---|---|---|
| `cv2.GaussianBlur()` | 가우시안 블러 (노이즈 제거), 커널 크기 `(0,0)`이면 sigma로 자동 계산 | `cv2.GaussianBlur(frame, (0,0), sigma)` |
| `cv2.Canny()` | 캐니 엣지 검출, threshold 2개 기반 | `cv2.Canny(gray, th1, th2)` |
| `cv2.morphologyEx()` | 모폴로지 연산 (마스크 노이즈 제거 등) | `cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)` |

## 색상 기반 물체 검출

자세한 설명·워크플로는 [색상 기반 물체 검출 (Color Detection)](../opencv-color-detection/main.md) 참고.

| 함수 | 기능 | 예시 |
|---|---|---|
| `cv2.inRange()` | HSV(또는 다른) 범위 안의 픽셀만 흰색인 이진 마스크 생성 | `cv2.inRange(hsv, lower, upper)` |
| `cv2.bitwise_or()` | 두 마스크를 OR로 합침 | `cv2.bitwise_or(mask1, mask2)` |
| `cv2.bitwise_and()` | 두 마스크가 둘 다 흰색일 때만 흰색 (마스크로 원본 이미지 잘라낼 때) | `cv2.bitwise_and(img, img, mask=mask)` |
| `cv2.bitwise_not()` | 마스크 반전 (0 ↔ 255) | `cv2.bitwise_not(mask)` |

## 윤곽선 / 도형 분석

| 함수 | 기능 | 예시 |
|---|---|---|
| `cv2.findContours()` | 이진 마스크에서 윤곽선 찾기 | `cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)` |
| `cv2.contourArea()` | 윤곽선 면적 계산 (크기 필터링용) | `cv2.contourArea(c)` |
| `cv2.boundingRect()` | 윤곽선을 감싸는 축-정렬 사각형 `(x, y, w, h)` 반환 | `cv2.boundingRect(c)` |
| `cv2.minAreaRect()` | 윤곽선을 감싸는 최소 회전 사각형 (기울어진 물체용) | `cv2.minAreaRect(c)` |

## 그리기

| 함수 | 기능 | 예시 |
|---|---|---|
| `cv2.rectangle()` | 사각형 그리기 | `cv2.rectangle(frame, pt1, pt2, color, 2)` |
| `cv2.circle()` | 원 그리기 | `cv2.circle(frame, (cx, cy), 2, color)` |
| `cv2.putText()` | 텍스트 오버레이 | `cv2.putText(frame, "text", (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, color)` |

관련: [VideoCapture 메서드와 속성](../opencv-videocapture/main.md) · [색상 기반 물체 검출 (Color Detection)](../opencv-color-detection/main.md)
