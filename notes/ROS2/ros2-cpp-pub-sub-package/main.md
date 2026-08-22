---
title: ROS2 C++ Pub-Sub 패키지 만들기 (교안)
date: 2026-08-18
tags: 
order: 
featured: false
draft: false
---

# ROS2 C++ Pub-Sub 패키지 만들기 (교안)

강의 없이 혼자서 talker/listener 패키지를 처음부터 끝까지 만들어보는 절차. 각 단계의 문법 배경은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md), 빌드 시스템 원리는 [colcon build](../colcon-build/main.md) 참고 — 여기서는 "무엇을 어떤 순서로 하는지"만 절차형으로 정리한다.

## 0. 사전 준비

새 터미널을 열 때마다 ROS2 환경을 source 해야 명령어(`ros2`, `colcon`)를 인식한다.

```bash
source /opt/ros/humble/setup.bash   # 또는 워크스페이스에 맞는 setup 경로
cd <워크스페이스>/src
```

## 1. 패키지 생성

```bash
ros2 pkg create <pkg_name> --build-type ament_cmake --dependencies rclcpp std_msgs
```

`--dependencies`로 넘긴 라이브러리는 `package.xml`(`<depend>`)과 `CMakeLists.txt`(`find_package`)에 자동으로 등록된다.

## 2. Talker (Publisher) 노드

`src/<pkg_name>_talker.cpp`:

```cpp
#include <chrono>
#include <memory>
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;   // 500ms 같은 시간 리터럴 쓰려면 namespace 필수

class Talker : public rclcpp::Node
{
public:
  Talker() : Node("talker")
  {
    publisher_ = this->create_publisher<std_msgs::msg::String>("chatter", 10);
    timer_ = this->create_wall_timer(
      500ms,
      [this]() { this->publish_message(); });
  }

private:
  void publish_message()
  {
    auto message = std_msgs::msg::String();
    message.data = "hello " + std::to_string(count_++);
    RCLCPP_INFO(this->get_logger(), "발행: '%s'", message.data.c_str());
    publisher_->publish(message);
  }

  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
  size_t count_ = 0;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Talker>());
  rclcpp::shutdown();
  return 0;
}
```

## 3. Listener (Subscriber) 노드

`src/<pkg_name>_listener.cpp`:

```cpp
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

class Listener : public rclcpp::Node
{
public:
  Listener() : Node("listener")
  {
    subscription_ = this->create_subscription<std_msgs::msg::String>(
      "chatter", 10,
      [this](const std_msgs::msg::String & msg) {
        RCLCPP_INFO(this->get_logger(), "수신: '%s'", msg.data.c_str());
      });
  }

private:
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr subscription_;
};

int main(int argc, char * argv[])
{
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Listener>());
  rclcpp::shutdown();
  return 0;
}
```

## 4. `CMakeLists.txt` 등록

`find_package(std_msgs REQUIRED)` 아래, `ament_package()` 위에 실행 파일마다 3줄씩 추가:

```cmake
add_executable(talker src/<pkg_name>_talker.cpp)
ament_target_dependencies(talker rclcpp std_msgs)

add_executable(listener src/<pkg_name>_listener.cpp)
ament_target_dependencies(listener rclcpp std_msgs)

install(TARGETS
  talker
  listener
  DESTINATION lib/${PROJECT_NAME})
```

## 5. 빌드 및 실행

```bash
cd <워크스페이스>
colcon build --packages-select <pkg_name>
source install/setup.bash   # 새 터미널마다 반복

# 터미널 1
ros2 run <pkg_name> talker
# 터미널 2
ros2 run <pkg_name> listener
# 확인용 터미널
ros2 topic echo /chatter
```

## 6. 자주 걸리는 실수 체크리스트

- `using std::chrono_literals;` — `namespace` 키워드 빠뜨림 (`using namespace std::chrono_literals;`가 맞음)
- 생성자 초기화 리스트가 **삭제한 멤버 변수**를 여전히 참조 (예: `count_(0)`인데 `count_` 멤버 선언을 지움)
- 세미콜론 누락 — 특히 `rclcpp::init(argc, argv)` 다음 줄
- `create_publisher`/`create_subscription`의 반환값을 멤버 변수에 저장하지 않음 → 컴파일은 되지만 생성자 종료 즉시 소멸돼 런타임에 조용히 죽음 ([rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md)의 "실제로 겪은 버그" 항목 참고)
- `CMakeLists.txt`에 `add_executable`을 추가했는데 `colcon build`가 반영 안 될 때 → `install/`, `build/` 지우고 재빌드하거나 `--cmake-clean-cache` 시도
