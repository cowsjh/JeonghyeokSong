---
title: DarkRuin Optimization
date: 2026-06-01
tags: optimization, Unreal Engine
featured: false
order: 
draft: true
---

---
## Overview
Unreal 라이브러리에서 얻을 수 있는 DarkRuin 씬을 최적화해 보았다. QAcamera를 기준으로 최대한 룩을 보존하는 선에서 작업을 진행했다.
![](paste-20260609051458.png)

**하드웨어**
GPU | RTX 2070 SUPER |
--- | --- |
CPU | Ryzen9 3900X | 
RAM | 64GB |

**목표**
90fps


## Workflow

### Drawcall
#### 메쉬 정리

레벨 배치가 모두 완료된 씬이니 계단 같은 작은 메쉬 들이 뭉쳐 있는 것들을 병합해 주었다.
RederDoc에서 튀는 메쉬들 HDA 로 데시메이션, LOD 정리 및 최적화 진행.
Qpaque 머티리얼 동일 Master 단일화 
![](paste-20260615102329.png)


#### 머티리얼 최적화
Opaque 머티리얼 Bakerst 플러그인 사용하여 텍스처 기반 단순 머티리얼로 변환.
일괄적으로 최대 2K로 사용하게 리밋을 잡아 주었다. 디테일이 떨어지는 부분은 추후에 재조정.

```compare
![](paste-20260617071714.png)
![](UnrealEditor_wW6Que9X1d.png) 
```

### Light
- 무드용 라이트 `shadow cast` off
- 불 필요한 라이트 제거
- 촛불 라이트  -> spot 라이트 교체
씬의 무드를 위한 라이트는 shadow를 전부 꺼주었다. 작은 촛불 하나씩 있던 라이트를 전부 지우고 스포트 라이트로 표현해 주었다.

![](paste-20260601133247.webp) |![](paste-20260611015459.png)|
--- | --- |

