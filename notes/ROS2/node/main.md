---
title: Node
date: 2026-08-13
tags: 
order: 
featured: false
draft: false
---

# Node

subscriber, publisher, service, action등 구동체를 담고 있는 **실행 단위**.
한노드 안에는 많은 구동체들이 들어 있을 수 있다.

## node info
```bash
ros2 node list
ros2 node info 노드이름
```

예시: 각 subscriber, publisher , service, action을 볼 수 있다.
```bash
$ ros2 node info /my_turtle
/my_turtle
  Subscribers:
    ...
  Publishers:
    ...
  Service Servers:
    /clear: std_srvs/srv/Empty
    /kill: turtlesim/srv/Kill
    /my_turtle/describe_parameters: rcl_interfaces/srv/DescribeParameters
    /my_turtle/get_parameter_types: rcl_interfaces/srv/GetParameterTypes
    /reset: std_srvs/srv/Empty
    /spawn: turtlesim/srv/Spawn
    /turtle1/set_pen: turtlesim/srv/SetPen
    /turtle1/teleport_absolute: turtlesim/srv/TeleportAbsolute
    /turtle1/teleport_relative: turtlesim/srv/TeleportRelative
  Service Clients:

  Action Servers:
    /turtle1/rotate_absolute: turtlesim/action/RotateAbsolute
  Action Clients:
```

## remap

```bash
ros2 run 패키지 노드 --ros-args -- remap __node:=커스텀이름
```

---

노드가 발행/구독을 주고받는 통로는 [Topic](../topic/main.md) 참고. C++ 코드 레벨에서 노드·퍼블리셔·서브스크라이버를 실제로 구현하는 패턴은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고.