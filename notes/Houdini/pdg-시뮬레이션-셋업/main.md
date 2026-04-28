---
title: PDG 시뮬레이션 셋업
date: 2022-09-13
tags: TIP, DOP
---

pdg로 랜덤하게 바꿀 시드의 파라미터를 만들어줌

파라미터의 경로 이용할 어트리뷰트 작성

어트리뷰트는 바꿀 파라미터에 작성

아웃풋으로 받아올 노드 선택

뽑아지는 파일 이름 결정

시뮬레이션은 All Frame in One Batch 필수 시뮬레이션을 단위로 하나로 묶어줌

## deadlinescheduler 셋팅

환경 변수 설정

Priority는 두 자리 수로

Concurrent Tasks는 팜 하나에 얼마나 줄건지 (무조건 1 이상)
