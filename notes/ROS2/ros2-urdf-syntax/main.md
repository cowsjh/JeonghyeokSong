---
title: ROS2 URDF 문법 정리
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# ROS2 URDF 문법 정리

URDF(Unified Robot Description Format)는 로봇의 링크(부품)와 조인트(관절)를 XML 트리로 기술하는 포맷이다. ROS 2에서는 순수 URDF를 직접 쓰기보다 **xacro**로 매크로/변수를 섞어 쓰는 게 사실상 표준이다.
확인 명령:

```bash
ros2 launch urdf_tutorial display.launch.py model:=절대경로/robot.urdf
```

## 1. 최상위 구조

```xml
<?xml version="1.0"?>
<robot name="my_robot" xmlns:xacro="http://www.ros.org/wiki/xacro">
  <link name="..."/>
  <joint name="..." type="...">...</joint>
</robot>
```

루트는 `<robot>` 태그이고 `name` 속성이 필수다. 그 안에 `<link>`와 `<joint>`를 나열해서 트리를 구성하는데, 링크가 노드, 조인트가 엣지 역할을 한다. 트리 구조이므로 부모가 없는 최상위 링크(보통 `base_link`)가 하나만 있어야 하고, 순환 구조는 만들 수 없다.

## 2. `<link>` — 물리적 부품

```xml
<link name="wheel_left">
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry>
      <cylinder radius="0.05" length="0.02"/>
      <!-- box size="x y z" / sphere radius / mesh filename="package://.../a.dae" -->
    </geometry>
    <material name="black">
      <color rgba="0 0 0 1"/>
    </material>
  </visual>

  <collision>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <geometry><cylinder radius="0.05" length="0.02"/></geometry>
  </collision>

  <inertial>
    <origin xyz="0 0 0" rpy="0 0 0"/>
    <mass value="0.5"/>
    <inertia ixx="0.001" ixy="0" ixz="0" iyy="0.001" iyz="0" izz="0.001"/>
  </inertial>
</link>
```

하나의 링크 안에는 목적이 다른 세 블록이 들어간다.

| 태그 | 역할 |
|---|---|
| `visual` | RViz 등에서 그려지는 형상. mesh처럼 복잡한 모델도 가능 |
| `collision` | 충돌 계산용 형상. 연산량 때문에 visual보다 단순한 도형으로 근사하는 게 일반적 |
| `inertial` | 질량과 관성텐서. Gazebo 등 물리 시뮬레이션에는 필수지만, RViz로 시각화만 할 거면 생략해도 된다 |

`geometry`에 넣을 수 있는 형상은 `box`, `cylinder`, `sphere`, 그리고 `.stl`/`.dae` 같은 `mesh`(`package://` 경로로 참조)다.

## 3. `<joint>` — 링크 간 연결

```xml
<joint name="wheel_left_joint" type="continuous">
  <parent link="base_link"/>
  <child link="wheel_left"/>
  <origin xyz="0 0.1 0" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
  <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
  <dynamics damping="0.1" friction="0.0"/>
</joint>
```

`type` 속성은 필수이며 조인트의 자유도 성격을 결정한다.

| type | 설명 |
|---|---|
| `fixed` | 고정, 움직이지 않음 (센서 마운트 등) |
| `revolute` | 회전, 각도 제한 있음 (관절 로봇 팔) |
| `continuous` | 회전, 제한 없음 (바퀴) |
| `prismatic` | 직선 이동, 위치 제한 있음 (리니어 액추에이터) |
| `floating` | 6DOF 자유 이동 (거의 안 씀) |
| `planar` | 평면상 이동 |

나머지 하위 태그는 다음 역할을 한다.

- `origin`: child가 parent 좌표계 기준으로 어디에 붙는지 (`xyz` + `rpy`, 라디안 단위)
- `axis`: revolute/continuous/prismatic에서 실제로 움직이는 축
- `limit`: revolute/prismatic에는 필수 (`lower`, `upper`, `effort`, `velocity`)

## 4. ROS 2에서 같이 쓰는 확장들

### xacro — 매크로와 변수

```xml
<xacro:property name="wheel_radius" value="0.05"/>

<xacro:macro name="wheel" params="prefix reflect">
  <link name="${prefix}_wheel">
    ...
    <cylinder radius="${wheel_radius}" length="0.02"/>
  </link>
</xacro:macro>

<xacro:wheel prefix="left" reflect="1"/>
<xacro:wheel prefix="right" reflect="-1"/>

<xacro:include filename="$(find my_pkg)/urdf/sensors.xacro"/>
```

바퀴 4개, 손가락처럼 반복되는 구조를 매크로로 처리하지 않으면 URDF가 지나치게 길어지므로, ROS 2에서는 `.urdf.xacro` 파일로 작성한 뒤 `xacro robot.urdf.xacro > robot.urdf` 명령이나 launch 파일 안의 `xacro.process_file()`로 변환해서 쓰는 게 일반적이다.

### `<ros2_control>` — 하드웨어 인터페이스 선언

```xml
<ros2_control name="MyRobotSystem" type="system">
  <hardware>
    <plugin>gazebo_ros2_control/GazeboSystem</plugin>
    <!-- 또는 실기체용 커스텀 hardware_interface 플러그인 -->
  </hardware>
  <joint name="wheel_left_joint">
    <command_interface name="velocity"/>
    <state_interface name="position"/>
    <state_interface name="velocity"/>
  </joint>
</ros2_control>
```

이 태그는 어떤 조인트를 어떤 command/state 인터페이스로 제어할지 선언하는 부분이다. `hardware/plugin`에는 시뮬레이션용(`gazebo_ros2_control/GazeboSystem`)이나 실제 하드웨어 드라이버 플러그인을 지정한다. `command_interface`는 컨트롤러가 내려보내는 값(position/velocity/effort), `state_interface`는 컨트롤러가 읽어오는 값이다. 실제 제어 알고리즘(`diff_drive_controller`, `joint_trajectory_controller` 등)은 별도 `controllers.yaml`에 설정하고, 이를 `ros2_control_node`가 로드해서 구동한다.

### `<gazebo>` — 시뮬레이션 전용 설정

```xml
<gazebo reference="wheel_left">
  <mu1>1.0</mu1>
  <mu2>1.0</mu2>
</gazebo>

<gazebo>
  <plugin filename="libgazebo_ros2_control.so" name="gazebo_ros2_control">
    <parameters>$(find my_pkg)/config/controllers.yaml</parameters>
  </plugin>
</gazebo>
```

`reference` 속성을 주면 특정 링크에 마찰(`mu1`/`mu2`) 같은 Gazebo 전용 물리 속성을 부여하는 것이고, `reference` 없이 쓰면 로봇 전체에 적용되는 플러그인 선언(예: `gazebo_ros2_control` 로딩)이 된다.

## 5. 전체 흐름 (ROS 2 기준)

1. `urdf/robot.urdf.xacro` 작성 — link, joint, xacro 매크로 포함
2. `ros2_control` 태그로 제어 인터페이스 선언
3. `robot_state_publisher`가 URDF를 읽어서 `/tf`, `/robot_description`을 퍼블리시 — 이후 좌표 변환 계산은 [tf2](../tf2/main.md)가 이 트리를 참조해서 처리한다
4. `joint_state_publisher`(또는 실제 조인트 상태)를 통해 RViz에서 시각화
5. Gazebo 시뮬레이션에서는 `<gazebo>` 플러그인이 `controllers.yaml`을 로드해 `ros2_control_node`를 구동

## 6. 자주 하는 실수

- `inertial` 값이 0이거나 비현실적이면 Gazebo에서 로봇이 날아가거나 뒤집힌다.
- `collision` 형상을 mesh 그대로 쓰면 물리 연산이 무겁고 불안정해진다 → 단순 도형으로 근사하는 게 낫다.
- `axis`의 방향과 `origin`의 `rpy` 좌표계를 혼동하기 쉽다 — `axis`는 parent가 아니라 child 링크 좌표계 기준이다.
- xacro `${}` 수식 안에서는 단위가 자동 변환되지 않으므로, 항상 SI 단위(m, rad, kg)로 통일해야 한다.
