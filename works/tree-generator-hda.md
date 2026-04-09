---
title: Tree Generator HDA
category: Game Art
thumbnail: assets/images/TreeGenHDA01.jpg
date: 2026.01
tools: Houdini21.0, Unreal Engine5.6, test
link: https://www.artstation.com/artwork/x3k13R
---

## Overview
---
**Houdini** 를 활용해 제작한 절차적 나무 생성 HDA(Houdini Digital Asset)입니다.
파라미터 조정만으로 다양한 수종과 계절감을 표현할 수 있도록 설계했습니다.

## Features

- 가지 분기 각도, 굵기, 밀도를 파라미터로 제어
- 잎사귀 클러스터 자동 배치 및 LOD 자동 생성
- Unreal Engine 5 임포트 파이프라인 지원

## Process

레퍼런스 수집 및 실제 나무의 성장 패턴 분석에서 시작했습니다.
L-System 기반의 알고리즘을 직접 구현하고, Houdini VOP 네트워크로
텍스처 마스킹과 버텍스 컬러를 자동화했습니다.

![작업 노드 네트워크](assets/images/TreeGenHDA01.jpg)

최종적으로 Substance Painter에서 바크(bark) 텍스처를 제작하고
언리얼 엔진에서 Wind 셰이더와 연동했습니다.
