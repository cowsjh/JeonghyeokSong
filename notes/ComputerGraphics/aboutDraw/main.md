---
title: Draw Call
date: 2026-04-21
tags: optimization, Rendering
---
[Unreal Course - An In-Depth look at Real-Time Rendering](https://dev.epicgames.com/community/learning/courses/EGR/unreal-engine-an-in-depth-look-at-real-time-rendering/JEJ/geometry-rendering-part-1)

---

## Draw ?

Draw 는 CPU 가 GPU 에게 특정한 오브젝트를 화면에 렌더 하는것을 명령하고 그리는 것 언리얼은 기본적으로 수많은 렌더 패스를 수행한다. 지오메트리가 아니더라도 하늘, 대기 산란, post-processing, 에디터 UI 등 화면상 렌더되는 것은 전부 포함 된다.
![alt text](image.png)

## Draw call ?
CPU가 CPU API 에게 무엇을 어떻게 그릴지 알려주는 것. 각 드로 콜에넌 텍스쳐, 셰이더 및 버퍼 에대 한 정보가 있음.
같은 속성을 공유하는 폴리곤 그룹이 하나의 드로우콜로 정의 된다. (단일 메쉬에 여러개의 메테리얼이 존재하는 액터는 드로우콜에 영향을 미친다.)

 **대부분 draw call 자체 보다는 준비하는 과정에서 리소스가 더 많이 든다.**
또한 드로우콜은 렌더하고 마치면 완료했다고 말하고 다음 명령을 받아야하는 통신 과정이 이루어지기 때문에 단순 크기 보다 그 양이 많을 때 병목 현상이 일어나기 쉽다.
```
1GB 파일 1개
vs
1KB 파일 100만개
```
- 폴리곤 많을 때 : GPU 바쁨
- draw call 많을 때 : CPU bound, GPU 낭비
- 폴리곤이 많다고 Draw 시간이 비례하는 것은 아니다.
- 적은 큰 모델을 쓰는 것 < 작고 많은 모델을 쓰는 것

큰 모델을 쓸때는 아래 사항을 주의
- occlusion
- lightmapping
- collision calculation
- memory

## Merge Mesh
환경 배치 작업이 끝났다면 조건에 맞는 메쉬들 끼리 병합 하여 드로우콜을 줄일 수 있다.

**메시 병합 최적화 규칙**
```
1. 사용 빈도가 높고 폴리곤수가 적을때
2. 동일한 구역 내에 있는 메시들
3. 동일한 메테리얼 을 공유하는 메시
4. 출돌 판정이 없거나 단순한 메시
5. 크기가 작은 메시, 다이내믹 라이틸만 받는 메시
6. 멀리있는 지형
```

>[!important]
>모든 환경에서 병합이 최고의 방법은 아니다 물론 효율을 높일 순 있겠으나 충분히 잘 돌아간다면 다른 곳에 시간을 투자하는 것이 좋다.

## Instance Static Mesh Rendering
동일한 static mesh 그룹을 포함한 컴포넌트

크고 적은 메쉬를 인스턴스 하는것 보다 foliage 같은 작고 양이 많을 때 더 효과 적이다.

## LOD, HLOD

- 조건(거리)에 따라 로우 폴리로 교체되는 것.
- HLOD는 여러개의 메쉬가 조건에 따라 그룹핑 되어 하나의 메쉬로 교체 되는 것.
