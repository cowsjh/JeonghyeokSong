---
title: PCG Scale by Density 가 느린 이유
date: 2026-05-30
tags: optimization, PCG, GPU
draft: false
---
[Unreal Doc - Using PCG with GPU Processing](https://dev.epicgames.com/documentation/unreal-engine/using-pcg-with-gpu-processing-in-unreal-engine)

---

>[!important]
>Density는 빠르다. 느린 건 attribute로 빼는 순간이다.

PCG에서 density 기반 스케일링이 느린 건 연산량이 아니라 **데이터 접근 방식** 때문이다.

## Density vs Attribute

`Density`는 `FPCGPoint` 구조체에 인라인으로 박혀 있다. `Points[i].Density` — 배열 인덱싱 한 번으로 끝난다.

반면 직접 만든 attribute는 점 안에 값이 없다. 점은 `MetadataEntry`라는 int64 키만 들고 있고, 실제 값은 별도 저장소에 있다.

```
// native (빠름)
Points[i].Density

// attribute (느림)
Points[i].MetadataEntry → 매핑 조회 → ValueArray[...]
```

둘 다 점마다 처리하는 건 같다. 차이는 그 한 번의 접근이 **배열 인덱싱이냐, 키를 거친 간접 조회냐**다.

## 왜 키를 거치나

값을 공유하기 위해서다. 점 100만 개가 같은 값이면 저장소엔 값 1개만 두고 모든 키가 그걸 가리킨다. 메모리를 아끼는 대신 접근 속도를 내준 구조.

>[!warning]
>점마다 값이 전부 다르면 공유 이득은 0인데 간접 비용만 그대로 낸다. metadata는 속도가 아니라 유연성을 위한 범용 컨테이너라, 점 수십만 개를 매 프레임 도는 무거운 반복 구간에서는 그 키 조회 비용이 횟수만큼 곱해져 치명적이 된다.

## 해결

- attribute 왕복을 없애고 **native property**(`Transform.Scale`)로 직접 처리한다.
- 무거우면 **GPU PCG (5.4+)** 의 Custom HLSL 노드로 빠진다. 키를 거치는 간접 조회 없이 GPU가 버퍼를 직접 읽으므로 우회된다.

## GPU PCG 예시

Kernel Type을 **Point Processor**로 둔다. 출력 점은 입력에서 자동 복사되므로 바꿀 속성만 `Set`하면 된다.

```hlsl
float Density = In_GetDensity(In_DataIndex, ElementIndex);
float3 Scale  = In_GetScale(In_DataIndex, ElementIndex);

float Mul = lerp(0.2, 1.5, saturate(Density));
Out_SetScale(Out_DataIndex, ElementIndex, Scale * Mul);
```

>[!tip]
>accessor 함수의 정확한 이름은 Custom HLSL 노드 → `Window > HLSL Source Editor` → **Declarations 패널**에서 핀 설정 기준으로 자동 생성된다. 이게 버전별 정답 소스다.

GPU 스폰 인스턴스는 런타임 GPU 메모리에만 존재하고 저장되지 않으며, 충돌, 물리, 내비게이션은 지원하지 않는다.
