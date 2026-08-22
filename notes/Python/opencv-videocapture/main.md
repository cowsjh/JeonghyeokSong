---
title: VideoCapture 메서드와 속성
date: 2026-08-08
tags: video, cheat-sheet
order: 
featured: false
draft: false
---

# VideoCapture 메서드와 속성

`cv2.VideoCapture`로 동영상 파일이나 카메라를 다룰 때 쓰는 메서드와 속성 정리.

## VideoCapture 메서드

| 메서드 | 의미 |
| --- | --- |
| `capture.isOpened()` | 동영상 파일 열기 성공 여부 확인 |
| `capture.open(filename)` | 동영상 파일 열기 |
| `capture.set(propid, value)` | 동영상 속성 설정 |
| `capture.get(propid)` | 동영상 속성 반환 |
| `capture.release()` | 동영상 파일을 닫고 메모리 해제 |

## VideoCapture 속성

`capture.set()` / `capture.get()`의 `propid`로 넘기는 값들.

| 속성 | 의미 | 비고 |
| --- | --- | --- |
| `cv2.CAP_PROP_FRAME_WIDTH` | 프레임의 너비 | - |
| `cv2.CAP_PROP_FRAME_HEIGHT` | 프레임의 높이 | - |
| `cv2.CAP_PROP_FRAME_COUNT` | 총 프레임 수 | - |
| `cv2.CAP_PROP_FPS` | 프레임 속도 | - |
| `cv2.CAP_PROP_FOURCC` | 코덱 코드 | - |
| `cv2.CAP_PROP_BRIGHTNESS` | 이미지 밝기 | 카메라만 해당 |
| `cv2.CAP_PROP_CONTRAST` | 이미지 대비 | 카메라만 해당 |
| `cv2.CAP_PROP_SATURATION` | 이미지 채도 | 카메라만 해당 |
| `cv2.CAP_PROP_HUE` | 이미지 색상 | 카메라만 해당 |
| `cv2.CAP_PROP_GAIN` | 이미지 게인 | 카메라만 해당 |
| `cv2.CAP_PROP_EXPOSURE` | 이미지 노출 | 카메라만 해당 |
| `cv2.CAP_PROP_POS_MSEC` | 프레임 재생 시간 | ms 반환 |
| `cv2.CAP_PROP_POS_FRAMES` | 현재 프레임 | 프레임의 총 개수 미만 |
| `cv2.CAP_PROP_POS_AVI_RATIO` | 비디오 파일 상대 위치 | 0 = 시작, 1 = 끝 |

---

VideoCapture로 받은 프레임에 실제로 적용하는 처리 예시는 [색상 기반 물체 검출 (Color Detection)](../opencv-color-detection/main.md) 참고.
