---
title: ROS 기초
date: 2026-08-08
tags: 
order: 
featured: false
draft: false
---

# ROS 기초

ROS2 작업 명령어 치트시트. 패키지 구조·빌드 시스템 원리(CMakeLists.txt·package.xml·build_type·ament index·빌드→설치→실행 흐름)는 [colcon build](../colcon-build/main.md), 노드/퍼블리셔/서브스크라이버 C++ 코드 패턴은 [rclcpp 핵심 패턴 (Node·Publisher·Subscriber 레퍼런스)](../rclcpp-core-patterns/main.md) 참고. 이 명령어들로 실제 패키지를 처음부터 만드는 절차는 [ROS2 C++ Pub-Sub 패키지 만들기 (교안)](../ros2-cpp-pub-sub-package/main.md) 참고.

### 워크 스페이스 생성
```bash
mkdir -p ~/ros_ws/src
cd ~/ros_ws
colcon build
source install/setup.bash
```

### 시작
```bash
#컨테이너 확인
docker ps
docker exec -it ros2_humble bash
```

### 진입 후
```bash
source /opt/ros/humble/setup.bash
cd ~/ros_ws
```

터미널을 열어줄 때마다 시스템을 적용 시켜 줘야 한다.
underlay - `rclcpp`,`example_interfaces`
```bash
source /opt/ros/humble/setup.bash # underlay - ROS2 자체가 설치된 시스템 경로
source install/setup.bash # overlay - 내가 만든 워크 스페이스
```

### 패키지 생성/빌드
```bash
cd ~/ros_ws
# --build type 패키지이름 --dependencies 참조/불러올 라이브러리
ros2 pkg create myPkg --build-type ament_cmake --dependencies rclcpp lib1 lib2 ... 

mkdir -p myPkg/launch #launch 경로 생성
colcon build --packages-select myPkg
source install/setup.bash
```

### 토픽
```bash
ros2 topic list
ros2 topic echo /토픽
```

### 실행
```bash
ros2 launch myPkg myPkg.launch.py
ros2 run myPkg 노드 +인풋
```

### 확인
```bash
ros2 service list # 현재 service
ros2 param get 토픽 파라미터
ros2 param set 토픽 파라미터
ros2 topic list # 현재 topic
```
