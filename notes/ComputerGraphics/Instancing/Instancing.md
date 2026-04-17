---
title: Instancing
date: 2026-04-17
tags: optimization
---

CPU와 GPU간의 병목 현상을 해결 하는 방법중 하나

### 기존 렝더링
1,000 개를 그릴때 CPU는 GPU에게 1,000 번 명령

### 원리
1. mesh (공통 데이터) / instance buffer (인스턴스 데이터 - trans, rot, scale ...) **데이터 분리**
2. 무거운 공통 메시 데이터는 GPU 메모리(VRAM)에 **한 번만 업로드**.
3. instance buffer 전달.
4. **GPU의 병렬 처리** (공통 메시 데이터를 instance buffer 와 조합)

### 결과
CPU의 작업 부하를 줄임 1,000 >>>> mesh,instance buffer

