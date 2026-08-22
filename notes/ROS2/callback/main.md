---
title: Callback
date: 2026-08-11
tags: 
order: 
featured: false
draft: false
---

# Callback

ROS2 노드 코드는 위에서 아래로 순차 실행되는 스크립트가 아니라,
"어떤 일이 생기면 이 함수를 불러라"를 미리 등록해두는 **이벤트 구동(event-driven) 방식**이다. 이때 실행되는 함수가 콜백이다.

| 콜백 종류 | 실행 시점 | 예시 |
|---|---|---|
| 구독 콜백 | 구독 중인 토픽에 메시지 도착 | `/scan` 도착 시 장애물 계산 |
| 타이머 콜백 | 정해진 주기마다 | 20ms마다 제어 명령 발행 |
| 서비스 콜백 | 다른 노드의 요청 수신 시 (11강) | — |

## executor

대기열에 쌓여 있는 콜백을 불러내고 실행 시키는 주체
기본 값은 [단일 스레드](../단일-스레드-멀티-스레드/main.md) `executor`
노드에 있는 `spin()` 함수로 아래의 루프로 진입 한다.

1. 추가된 노드들의 구독,타이머,서비스,클라이언트를 전부 모아 **감시 해야할 목록**을 만든다.
2. 매 반복마다 `rcl_wait()` 로 대기
3. 이벤트 발생
4. 단일 스레드: **목록**에서 하나씩 전부 실행
5. 다시 `rcl_wait()`

기본값이 단일 프로세스 이기 때문에 하나씩 실행 시키며 **하나의 콜백이 밀리면 다른 콜백이 전부 밀린다.**

병렬로 실행 시키고 싶다면, `MultiThreadedExecutor` + `callback groups` 조합을 사용 한다.

## callback groups

멀티 스레드는 성능을 주지만 두 콜백이 동시에 같은 변수를 읽고 쓰면 값이 꼬이는 **race condition** 이 발생한다.

때문에

`MultiThreadedExecutor`를 사용 하는 executor 병렬 실행에는 `callback groups` 라는 제어 장치가 필요하다.

그렇기 때문에 
- `MutuallyExclusive`: 상호 베타적, 서로 동시에 실행 되지 않음
- `Reentrant`: 재진입, 자유롭게 병렬 실행 됨.

```cpp
int main(int argc, char* argv[])
{
	rclcpp::init(argc, argv);
	auto node = std::make_shared<MyNode>();
	rclcpp::executor::MultiThreadedExecutor excutor( rclcpp::ExecutorOptions(),4 );
	executor.add_node(node);
	executor.spin();
	rclcpp::shutdown();
}

```

---
콜백을 실제 C++ 코드로 등록하는 문법(퍼블리셔/서브스크라이버/타이머 콜백)은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고.
