---
title: QoS
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# QoS

상황에 맞게 통신 품질을 조절하는 정책 — [DDS](../dds/main.md) 계층 위에서 발행자·구독자마다 지정한다.
>카메라 영상 데이터는 매 프레임마다 찍히지만 모두 중요한 정보는 아니다. 지연이 되거나 유실 되더라고 가장 최신의 것으로 데이터를 처리할 수 있기 때문이다.

## Reliable
- 놓치면 안되는 중요한
- 유실을 허용 하지 않는다.
- 유실시 재전송해 반드시 모든 데이터를 받을 수 있게 한다.
## Best-effort
- 최신이 중요한 데이터
- 유실을 허용한다.
	
## Durability
-  구독자가 늦게 접속 했을시 이전 데이터를 받을지
- `Volatile`: 접속 후 데이터만
- `Transient Local`: 발행자가 마지막 메시지 보관 → 늦은 구독자에게도 전달 (지도·로봇 설명처럼 늦어도 **중요한** 데이터)

| 프로파일            | 구성                                 | 용도            |
| --------------- | ---------------------------------- | ------------- |
| **Default**     | Reliable, Volatile, KeepLast(10)   | 일반 통신(명령 등)   |
| **Sensor Data** | Best-Effort, Volatile, KeepLast(5) | 카메라·LiDAR 스트림 |
| **Services**    | Reliable                           | 서비스 통신        |
| **Parameters**  | Reliable                           | 파라미터          |
|                 |                                    |               |


> **호환성 규칙**: 구독자 요구가 발행자보다 엄격하면 연결 안 됨. Reliable→Best-effort 구독은 OK(꽉 찬 데이터에서 최신만 뽑는 셈), 반대는 연결 안 됨(유실분까지 재전송을 요구하는 셈)