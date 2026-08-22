---
title: geometry_msgs.msg-Message Definitions
date: 2026-08-12
tags: 
order: 
featured: false
draft: false
---

# geometry_msgs.msg-Message Definitions

## Point
자유공간에서 점의 위치를 나타낸다.
float64 x
float64 y
float64 z

---
## Point32
자유공간에서 점의 위치를 나타낸다(32비트 정밀도). 상호운용성을 위해 가능하면 Point32 대신 Point를 쓰는 게 권장되지만, PointCloud처럼 많은 점을 한 번에 보낼 때 용량을 줄이기 위해 이 메시지가 설계되었다.

float32 x
float32 y
float32 z

---
## PointStamped
기준 좌표계와 타임스탬프를 가진 Point를 나타낸다.

std_msgs/Header header
[Point](#point) point

---
## Vector3
자유공간에서의 벡터를 나타낸다. 점(Point)과는 의미상 다르며, 벡터는 항상 원점에 고정되어 있다. 변환을 적용할 때는 회전 성분만 적용된다.

float64 x
float64 y
float64 z

---
## Vector3Stamped
기준 좌표계와 타임스탬프를 가진 Vector3를 나타낸다. 벡터는 항상 원점에 고정되어 있으므로, 변환 시 회전 요소만 적용된다는 점에 유의한다.

std_msgs/Header header
[Vector3](#vector3) vector

---
## Quaternion
자유공간에서의 방향을 쿼터니언 형태로 나타낸다.

float64 x 0
float64 y 0
float64 z 0
float64 w 1

---
## QuaternionStamped
기준 좌표계와 타임스탬프를 가진 방향(orientation)을 나타낸다.

std_msgs/Header header
[Quaternion](#quaternion) quaternion

---
## Pose
위치와 방향으로 구성된, 자유공간에서의 pose를 나타낸다.

[Point](#point) position
[Quaternion](#quaternion) orientation

---
## Pose2D
Foxy부터 deprecated 되었으며 이후 릴리즈에서 제거될 수 있다. 3D pose를 사용할 것을 권장한다. 일반적으로 모든 것을 3D로 표현하고 2D 전용 애플리케이션에서는 계산에 필요한 평면으로만 적절히 투영하되, 처리 과정에서는 가급적 3D 정보를 보존하는 것이 좋다. 2D 자료형을 별도로 병행 유지하면 모든 UI와 파이프라인이 이중 인터페이스를 갖춰야 하고, 완전히 유효한 상황에서도 3D 도구를 2D 용도로 재사용하지 못하게 된다. 2D pose를 그리거나 yaw 오차를 계산하는 일은 어렵지 않고 이미 그런 도구/라이브러리가 있다.
2D 다양체 위의 위치와 방향을 나타낸다.

float64 x
float64 y
float64 theta

---
## PoseStamped
기준 좌표계와 타임스탬프를 가진 Pose를 나타낸다.

std_msgs/Header header
[Pose](#pose) pose

---
## PoseArray
전역 참조를 위한 헤더를 가진 pose 배열이다.

std_msgs/Header header
[Pose](#pose)[] poses

---
## PoseWithCovariance
불확실성을 포함한, 자유공간에서의 pose를 나타낸다.

[Pose](#pose) pose

6x6 공분산 행렬을 row-major로 표현한다. 방향 파라미터는 고정축 표현을 사용하며, 순서는 (x, y, z, X축 회전, Y축 회전, Z축 회전)이다.
float64[36] covariance

---
## PoseWithCovarianceStamped
기준 좌표계와 타임스탬프를 가진 추정 pose를 나타낸다.

std_msgs/Header header
[PoseWithCovariance](#posewithcovariance) pose

---
## Twist
자유공간에서의 속도를 선형/각속도 성분으로 나눠 나타낸다. 09~10강 복습의 `create_publisher(Twist, '/cmd_vel', 10)` 예제처럼 로봇 속도 명령(`/cmd_vel`)에 실제로 쓰인다.

[Vector3](#vector3)  linear
[Vector3](#vector3)  angular

---
## TwistStamped
기준 좌표계와 타임스탬프를 가진 twist다.

std_msgs/Header header
[Twist](#twist) twist

---
## TwistWithCovariance
불확실성을 포함한, 자유공간에서의 속도를 나타낸다.

[Twist](#twist) twist

6x6 공분산 행렬을 row-major로 표현한다. 방향 파라미터는 고정축 표현을 사용하며, 순서는 (x, y, z, X축 회전, Y축 회전, Z축 회전)이다.
float64[36] covariance

---
## TwistWithCovarianceStamped
기준 좌표계와 타임스탬프를 가진 추정 twist를 나타낸다.

std_msgs/Header header
[TwistWithCovariance](#twistwithcovariance) twist

---
## Accel
자유공간에서의 가속도를 선형/각가속도 성분으로 나눠 나타낸다.
[Vector3](#vector3)  linear
[Vector3](#vector3)  angular

---
## AccelStamped
기준 좌표계와 타임스탬프를 가진 accel이다.
std_msgs/Header header
[Accel](#accel) accel

---
## AccelWithCovariance
불확실성을 포함한, 자유공간에서의 가속도를 나타낸다.

[Accel](#accel) accel

6x6 공분산 행렬을 row-major로 표현한다. 방향 파라미터는 고정축 표현을 사용하며, 순서는 (x, y, z, X축 회전, Y축 회전, Z축 회전)이다.
float64[36] covariance

---
## AccelWithCovarianceStamped
기준 좌표계와 타임스탬프를 가진 추정 accel을 나타낸다.
std_msgs/Header header
[AccelWithCovariance](#accelwithcovariance) accel

---
## Transform
두 좌표계 사이의 변환을 자유공간에서 나타낸다.

[Vector3](#vector3) translation
[Quaternion](#quaternion) rotation

---
## TransformStamped
header.frame_id 좌표계에서 child_frame_id 좌표계로의, header.stamp 시점의 변환을 나타낸다. 주로 [tf2](../tf2/main.md) 패키지에서 사용되며 자세한 내용은 tf2 문서를 참고한다. 변환을 하나의 메시지 안에서 자기완결적으로 전달하기 위해 Header의 frame_id 외에 child_frame_id가 추가로 필요하다.

std_msgs/Header header
string child_frame_id
[Transform](#transform) transform

---
## Polygon
첫 점과 마지막 점이 연결되어 있다고 가정하는 다각형 정의다.
[Point32](#point32)[] points

---
## PolygonStamped
기준 좌표계와 타임스탬프를 가진 Polygon을 나타낸다.

std_msgs/Header header
[Polygon](#polygon) polygon

---
## PolygonInstance
첫 점과 마지막 점이 연결되어 있다고 가정하는 다각형 정의다. 여러 인스턴스를 구분하기 위한 고유 식별자 필드를 포함한다.

geometry_msgs/[Polygon](#polygon) polygon
int64 id

---
## PolygonInstanceStamped
기준 좌표계와 타임스탬프를 가진 Polygon을 나타낸다. 여러 인스턴스를 구분하기 위한 고유 식별자 필드를 포함한다.

std_msgs/Header header
geometry_msgs/[PolygonInstance](#polygoninstance) polygon

---
## Inertia
질량 [kg]
float64 m

무게중심 [m]
geometry_msgs/[Vector3](#vector3) com

무게중심 기준 관성 텐서 [kg·m^2]
    | ixx ixy ixz |
I = | ixy iyy iyz |
    | ixz iyz izz |
float64 ixx
float64 ixy
float64 ixz
float64 iyy
float64 iyz
float64 izz

---
## InertiaStamped
타임스탬프와 기준 좌표계를 가진 Inertia다.

std_msgs/Header header
[Inertia](#inertia) inertia

---
## Wrench
자유공간에서의 힘을 선형/각(토크) 성분으로 나눠 나타낸다.

[Vector3](#vector3)  force
[Vector3](#vector3)  torque

---
## WrenchStamped
기준 좌표계와 타임스탬프를 가진 wrench다.

std_msgs/Header header
[Wrench](#wrench) wrench

---
## VelocityStamped
임의의 관측 좌표계 header.frame_id에서 표현된, 기준 좌표계 reference_frame_id에 대한 body_frame_id 프레임의 타임스탬프가 있는 속도 벡터를 나타낸다. body 프레임과 기준 프레임이 같으면 body 프레임 기준 속도이며, 흔히 "body twist"라고 부른다.

std_msgs/Header header
string body_frame_id
string reference_frame_id
[Twist](#twist) velocity

---
## VelocityWithCovarianceStamped
임의의 관측 좌표계 header.frame_id에서 표현된, 기준 좌표계 reference_frame_id에 대한 body_frame_id 프레임의 추정 속도(타임스탬프 포함, 공분산 포함)를 나타낸다. body 프레임과 header 프레임이 같으면 body 프레임 기준 속도이며, 공분산이 추가된 geometry_msgs/TwistStamped와 유사하다.

std_msgs/Header header
string body_frame_id
string reference_frame_id
[TwistWithCovariance](#twistwithcovariance) velocity
