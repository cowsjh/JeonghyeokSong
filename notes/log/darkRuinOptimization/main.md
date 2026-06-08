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
![alt text](image.webp)

**하드웨어**
GPU | RTX 2070 SUPER |
--- | --- |
CPU | Ryzen9 3900X | 
RAM | 64GB |
scalability | Epic |

**목표**
90fps




## Workflow
### Analyze
GPU 병목이 일어나고 있고 Draw call 도 큰 모습이다.
![alt text](image-1.webp)
현재로서 크게 보이는 문제로는 라이트와 드로우콜이 있다.
![](paste-20260602032841.png)

### Drawcall
#### Actor Merge

레벨 배치가 모두 완료된 씬이니 계단 같은 작은 메쉬 들이 뭉쳐 있는 것들을 병합해 주었다.
![](paste-20260602064940.png)


### Material
기둥에도 4K를 쓰는 모습
![alt text](image-2.webp)
일괄적으로 최대 2K로 사용하게 리밋을 잡아 주었다. 디테일이 떨어지는 부분은 추후에 재조정. 또한 메테리얼에서 커스텀 노이즈와 
![](paste-20260601123854.webp)

### Light
작은 촛불 하나씩 있던 라이트를 전부 지우고 포인트 라이트로 표현해 주었다.

![](paste-20260601133247.webp) | ![](paste-20260601135417.webp) |
--- | --- |

