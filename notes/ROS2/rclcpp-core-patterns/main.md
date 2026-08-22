---
title: rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)
date: 2026-08-08
tags: 
order: 
featured: false
draft: false
---

# rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)

퍼블리셔·구독자 · 서비스·파라미터·launch · 패키지 통합 · FK+PID 미니 프로젝트 네 실습에서 나온 rclcpp 문법을 패턴별로 정리한다. 각 패턴은 LearnC++ Ch.14 클래스 문법 위에 얹힌 것이라, 낯선 문법이 나오면 먼저 "이거 순수 C++인가, rclcpp가 추가한 것인가"부터 구분한다. 여기 패턴들을 실제 패키지 생성→빌드→실행까지 절차대로 따라가려면 [ROS2 C++ Pub-Sub 패키지 만들기 (교안)](../ros2-cpp-pub-sub-package/main.md) 참고.

## 노드 클래스 기본 골격

```cpp
class MyNode : public rclcpp::Node   // rclcpp::Node를 상속 → "이 클래스 = ROS2 노드"
{
public:
  MyNode() : Node("my_node") { ... }  // 부모(Node) 생성자 호출로 노드 이름 등록
private:
  // 멤버 변수(퍼블리셔/구독자/타이머)와 콜백 함수
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);              // ROS2 시스템 초기화 — 모든 ROS2 프로그램의 첫 줄
  rclcpp::spin(std::make_shared<MyNode>());  // 노드 생성 + 이벤트 루프 진입 (Ctrl+C 전까지 콜백 대기)
  rclcpp::shutdown();                     // ROS2 리소스 정리
}
```

`public`(생성자)을 먼저, `private`(구현 디테일)을 나중에 쓰는 순서는 LearnC++ 스타일과 반대인데, ROS2·Google C++ 스타일 가이드가 권장하는 방식이다.

## Publisher / Subscriber / Timer 생성

| 패턴 | 문법 | 비고 |
|---|---|---|
| Publisher 생성 | `this->create_publisher<MsgType>("topic", 큐사이즈)` | `Node`의 템플릿 멤버 함수 |
| Subscriber 생성 | `this->create_subscription<MsgType>("topic", 큐사이즈, 콜백)` | 콜백은 인자 1개짜리여야 함 |
| Timer 생성 | `this->create_wall_timer(500ms, std::bind(&MyNode::callback, this))` | `using namespace std::chrono_literals;` 필요 |
| 발행 | `publisher_->publish(message);` | |
| 로깅 | `RCLCPP_INFO(this->get_logger(), "형식 '%s'", value.c_str());` | 매크로(함수 아님) — 가변인자·위치정보 자동삽입·로그레벨 최적화 때문 |

멤버 함수를 구독 콜백으로 넘길 때는 `std::bind(&MyNode::topic_callback, this, _1)`처럼 `this`와 `std::placeholders::_1`로 인자 개수를 맞춰야 한다 — 멤버 함수 혼자는 "객체+인자" 2개가 필요해서 `create_subscription`이 기대하는 인자 1개짜리 콜백 모양과 안 맞기 때문. 최근 C++이면 람다로 더 직관적으로 대체 가능하다:

```cpp
subscription_ = this->create_subscription<MsgType>(
  "topic", 10,
  [this](const MsgType & msg) { topic_callback(msg); });
```

## 핸들 타입 (전부 SharedPtr)

| 멤버 변수 타입 | 용도 |
|---|---|
| `rclcpp::Publisher<MsgType>::SharedPtr` | 퍼블리셔 핸들 |
| `rclcpp::Subscription<MsgType>::SharedPtr` | 구독 핸들 |
| `rclcpp::TimerBase::SharedPtr` | 타이머 핸들 |

노드·퍼블리셔·타이머 같은 객체는 여러 곳에서 동시에 참조될 수 있어, 참조 카운팅 기반의 `std::shared_ptr`(`<memory>` 헤더)로 생명주기를 자동 관리한다 — 수동 `new`/`delete`보다 안전하기 때문에 ROS2 전반에서 이 패턴을 쓴다.

## 자주 쓰는 include

| 헤더 | 용도 |
|---|---|
| `"rclcpp/rclcpp.hpp"` | `Node`, `init`, `spin`, `RCLCPP_INFO` 등 rclcpp 핵심 |
| `"std_msgs/msg/string.hpp"` | 메시지 타입마다 자기 헤더가 따로 있음 (`.msg` 정의로부터 자동 생성) |
| `<chrono>` + `using namespace std::chrono_literals;` | `500ms` 같은 시간 리터럴 |
| `<functional>` | `std::bind`, `std::placeholders::_1` |
| `<memory>` | `std::shared_ptr`, `std::make_shared` |

## CMakeLists.txt 보일러플레이트

패키지 생성(`ros2 pkg create --build-type ament_cmake <name> --dependencies rclcpp std_msgs`) 후, `find_package(std_msgs REQUIRED)` 아래·`ament_package()` 위에 실행 파일마다 추가:

```cmake
add_executable(talker src/publisher_member_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

install(TARGETS
  talker
  DESTINATION lib/${PROJECT_NAME})
```

`add_executable`/`ament_target_dependencies`는 `.cpp` 파일이 아니라 **빌드 타겟 단위**로 적용된다 — 실행 파일마다 반복해서 선언해야 한다.

## 빌드 후 실행 흐름

```bash
cd ~/ros_ws
colcon build --packages-select <pkg_name>
source install/setup.bash    # 방금 만든 패키지를 이 셸에 등록
ros2 run <pkg_name> <executable_name>
```

`source install/setup.bash`는 새 터미널(셸 세션)을 열 때마다 다시 해야 한다 — 환경변수는 그 셸 프로세스가 살아있는 동안만 유지되기 때문. 자세한 배경은 워크스페이스 구축 노트와 퍼블리셔·구독자 실습 노트의 Q&A 참고.

---

## Service 서버 — 콜백 인자가 2개인 이유

Publisher/Subscriber는 콜백 인자가 0개(타이머) 또는 1개(구독 메시지)였지만, 서비스 콜백은 **인자가 2개**(`request`, `response`)다 — "요청을 받아 응답을 채워 돌려준다"는 서비스의 역할이 시그니처에 그대로 드러난다.

```cpp
class AddTwoIntsServer : public rclcpp::Node
{
public:
  AddTwoIntsServer() : Node("add_two_ints_server")
  {
    // "log_requests" bool 파라미터를 기본값 true로 선언·등록.
    // 반환값(현재 값)을 캐싱해두지 않는다 — 콜백마다 get_parameter로 다시 조회해야
    // 실행 중 `ros2 param set`으로 바꾼 값이 즉시 반영된다.
    this->declare_parameter("log_requests", true);

    service_ = this->create_service<example_interfaces::srv::AddTwoInts>(
      "add_two_ints",
      // 멤버 함수를 콜백으로 넘기려면 std::bind로 인자 개수를 맞춰야 한다.
      // _1, _2는 "요청이 실제로 들어올 때 채워질 자리"를 표시하는 placeholder.
      std::bind(&AddTwoIntsServer::handle_add, this,
                std::placeholders::_1, std::placeholders::_2));
  }

private:
  void handle_add(
    const std::shared_ptr<example_interfaces::srv::AddTwoInts::Request> request,
    std::shared_ptr<example_interfaces::srv::AddTwoInts::Response> response)
  {
    response->sum = request->a + request->b;   // 요청 필드를 읽어 응답 필드에 채워 넣는다

    bool log_requests;
    this->get_parameter("log_requests", log_requests);  // 콜백마다 다시 조회 (캐싱 금지)
    if (log_requests) {
      RCLCPP_INFO(this->get_logger(), "a=%ld b=%ld -> sum=%ld",
        request->a, request->b, (long int)response->sum);
    }
  }

  rclcpp::Service<example_interfaces::srv::AddTwoInts>::SharedPtr service_;  // 지역변수 X — 멤버로 저장해야 생성자 종료 후에도 살아있음
};
```

`example_interfaces::srv::AddTwoInts`처럼 이미 정의된 서비스 타입은 `Request`/`Response` 두 구조체를 자동으로 갖고 있다 — 직접 `.srv` 파일을 새로 정의하지 않아도 흔한 타입(정수 덧셈 등)은 재사용 가능.

## Service 클라이언트 — 요청 1번 보내고 응답 기다리기

클라이언트는 계속 살아있을 필요가 없으므로 노드 클래스를 따로 안 만들고 `main()` 안에서 한 번 요청→응답받고 끝낸다.

```cpp
auto node = rclcpp::Node::make_shared("add_two_ints_client");
auto client = node->create_client<example_interfaces::srv::AddTwoInts>("add_two_ints");

auto request = std::make_shared<example_interfaces::srv::AddTwoInts::Request>();
request->a = atoll(argv[1]);
request->b = atoll(argv[2]);

// 토픽(Pub/Sub)은 순서 상관없지만(느슨한 결합), 서비스는 요청 시점에 서버가
// 반드시 떠 있어야 하므로 서버 등장을 폴링하며 기다려야 한다.
while (!client->wait_for_service(1s)) {
  if (!rclcpp::ok()) { return 0; }  // Ctrl+C 등으로 종료 신호가 오면 대기 중단
}

auto result = client->async_send_request(request);  // 비동기 전송 → std::future 즉시 반환(응답 아직 안 왔을 수 있음)
// spin() 대신 spin_until_future_complete: 이 future가 완료(=응답 도착)될 때까지만 spin
if (rclcpp::spin_until_future_complete(node, result) == rclcpp::FutureReturnCode::SUCCESS) {
  RCLCPP_INFO(rclcpp::get_logger("rclcpp"), "Sum: %ld", (long int)result.get()->sum);
}
```

| 구분 | Publisher/Subscriber | Service 서버/클라이언트 |
|---|---|---|
| 콜백 인자 | 0개(타이머) / 1개(메시지) | 2개(request, response) |
| 결합도 | 느슨함 — 상대가 없어도 동작 | 강함 — 요청 시점에 서버가 반드시 떠 있어야 함 |
| 대기 방식 | 없음(발행은 그냥 발행) | `wait_for_service` 폴링 필요 |
| 노드 생존 | 보통 계속 `spin()` | 클라이언트는 `spin_until_future_complete`로 1회만 대기 |

## Parameter — 노드별 설정값

```cpp
this->declare_parameter("log_requests", true);  // 이름+기본값 선언, launch의 parameters=[...]가 이 기본값을 덮어씀

bool log_requests;
this->get_parameter("log_requests", log_requests);  // 현재 값 조회
```

`declare_parameter`가 반환하는 "선언 시점의 값"을 멤버 변수에 캐싱해두면, 실행 중 `ros2 param set`으로 값을 바꿔도 반영되지 않는다 — 값이 바뀔 수 있는 파라미터는 **쓰는 시점마다** `get_parameter`로 다시 조회해야 한다.

## Launch 파일 — 여러 노드를 한 번에

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(package='arm_bringup', executable='talker', name='talker'),
        Node(package='arm_bringup', executable='listener', name='listener'),
        Node(
            package='arm_bringup',
            executable='server',
            name='add_two_ints_server',
            parameters=[{'log_requests': True}],  # 재빌드 없이 파라미터 초기값 주입
        ),
    ])
```

`package`는 실행 파일이 속한 패키지, `executable`은 `CMakeLists.txt`의 `add_executable` 이름, `name`은 `ros2 node list`에 뜨는 실제 노드 이름이다 — `name`을 지정하면 launch가 `-r __node:=name` 리매핑을 걸어 코드 안의 `Node("...")` 이름을 덮어쓴다 (코드를 고친 게 아니라 런타임에 이름만 바뀐 것).

## 여러 노드를 한 패키지로 묶기

노드 4개(talker/listener/server/client)를 패키지 하나(`arm_bringup`)로 합칠 때 규칙:

- **package.xml 의존성 = 합집합**. 각 노드가 쓰던 의존성(`rclcpp`, `std_msgs`, `example_interfaces`, `geometry_msgs` ...)을 전부 모아 선언한다.
- **CMakeLists.txt는 실행 파일마다 반복**. `add_executable` + `ament_target_dependencies`를 노드 개수만큼 쓰고, `install(TARGETS ...)`에는 한꺼번에 나열한다.

```cmake
add_executable(talker src/publisher_member_function.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

add_executable(server src/add_two_ints_server.cpp)
ament_target_dependencies(server rclcpp example_interfaces)

install(TARGETS
  talker
  server
  DESTINATION lib/${PROJECT_NAME})

# 소스 트리 launch/ → 설치 경로 share/<pkg>/launch 로 복사.
# 이게 없으면 colcon build 후에도 ros2 launch가 launch 파일을 못 찾는다.
install(DIRECTORY
  launch
  DESTINATION share/${PROJECT_NAME})
```

`.cpp` 파일을 다른 패키지로 옮겨도 **코드 안 내용은 고칠 필요가 없다** — 노드 이름(`Node("...")`)이나 토픽/서비스 이름은 코드가 결정하지, 어느 패키지에 속하는지와는 무관하다.

| 이름 | 어디서 정해지나 | 예 |
|---|---|---|
| 실행 파일 이름 | `CMakeLists.txt`의 `add_executable(이름 ...)` | `talker` |
| 노드 이름(기본) | `.cpp` 안 `Node("...")` | `minimal_publisher` |
| 노드 이름(오버라이드) | launch의 `name=` (리매핑) | `talker` |

## 커스텀 헤더를 여러 노드가 공유하기

PID 컨트롤러처럼 여러 노드가 재사용할 로직은 헤더 하나로 빼서 include한다.

```cpp
// include/arm_bringup/pid_controller.hpp
#ifndef ARM_BRINGUP__PID_CONTROLLER_HPP_
#define ARM_BRINGUP__PID_CONTROLLER_HPP_

class PIDController
{
public:
  PIDController(double kp, double ki = 0.0, double kd = 0.0)
  : kp_(kp), ki_(ki), kd_(kd), integral_(0.0), prev_error_(0.0), has_prev_(false) {}

  double compute(double error, double dt)
  {
    integral_ += error * dt;                                          // I항: 오차 누적
    double derivative = has_prev_ ? (error - prev_error_) / dt : 0.0;  // D항: 첫 스텝은 0
    prev_error_ = error;
    has_prev_ = true;
    return kp_ * error + ki_ * integral_ + kd_ * derivative;           // P+I+D 합산
  }

private:
  double kp_, ki_, kd_, integral_, prev_error_;
  bool has_prev_;
};
#endif
```

`#include "arm_bringup/pid_controller.hpp"`로 노드(`pid_node.cpp`)에서 가져다 쓰려면, `CMakeLists.txt`에 include 경로를 등록해야 한다 — 안 하면 "no such file" 컴파일 에러:

```cmake
target_include_directories(pid_node PUBLIC include)
```

## 노드 간 콜백 체인으로 제어 루프 구성

메시지 발행 자체가 상대 노드의 콜백을 트리거하는 방식으로 두 노드를 엮으면, 별도 타이머 없이도 "메시지가 클럭 역할"을 하는 폐루프를 만들 수 있다 (FK 노드 ↔ PID 노드 예시).

```cpp
// fk_node: /joint_cmd 수신 → 적분 → /joint_state 재발행 → pid_node의 콜백을 다시 트리거
void on_cmd(const std_msgs::msg::Float64MultiArray::SharedPtr msg)
{
  theta1_ = theta1_ + msg->data[0] * 1.0;   // theta_{k+1} = theta_k + u_k*dt
  theta2_ = theta2_ + msg->data[1] * 1.0;
  publish_state();                          // 이 publish가 pid_node의 on_state를 다시 부른다
}
```

루프를 처음 시동할 한 번의 발행이 필요한데, `create_wall_timer`는 원샷이 아니라 **주기** 타이머다 — 콜백 안에서 스스로 `cancel()`하지 않으면 계속 재발행되어 콜백 체인과 경쟁한다.

```cpp
init_timer_ = create_wall_timer(std::chrono::milliseconds(300),
  [this]() {
    publish_state();
    init_timer_->cancel();  // 한 번만 쏘고 스스로 정지
  });
```

> [!WARNING]
> **실제로 겪은 버그 — publisher/subscriber 초기화 누락 → null 포인터 역참조**
> 생성자에서 `create_publisher`/`create_subscription`으로 만든 결과를 멤버 변수에 저장하는 걸 하나라도 빠뜨리면, 나중에 그 멤버로 `->publish(...)`를 호출하는 순간 **컴파일은 통과하지만 런타임에 크래시**한다.
>
> 증상: `ros2 node list`엔 두 노드 다 정상으로 뜨고 토픽도 목록엔 있는데, `ros2 topic echo`/`hz` 둘 다 아무 것도 안 뜬다 — 한쪽 노드가 첫 메시지를 받자마자 죽어서 상대쪽 콜백 체인이 시작도 못 하고 끊기기 때문이다. `create_publisher`/`create_subscription`은 반드시 생성자 안에서 직접 만들어 멤버에 저장해야 한다.
