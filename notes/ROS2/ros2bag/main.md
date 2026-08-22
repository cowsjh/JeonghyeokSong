---
title: ros2bag
date: 2026-08-14
tags: 
order: 
featured: false
draft: false
---

# ros2bag

- `ros2 bag`은 [토픽](../topic/main.md)으로 오가는 메세지를 파일로 **기록(녹화)**했다가 그대로 **재생**하는 도구 (`rosbag2` 패키지가 제공)
- 센서나 로봇 없이도 그때의 데이터를 반복 재현할 수 있어 디버깅·알고리즘 튜닝·데이터셋 수집에 쓴다.

```
발행 중인 topic --record--> rosbag2_.../ (mcap + metadata.yaml) --play--> 다시 발행
```

## bag record

토픽 메세지를 파일로 기록
```bash
ros2 bag record /토픽이름        # 특정 토픽 하나
ros2 bag record /scan /odom /tf # 여러 토픽
ros2 bag record -a              # 발행 중인 모든 토픽
```

`Ctrl+C`로 멈추면 현재 폴더에 `rosbag2_YYYY_MM_DD-HH_MM_SS/` 폴더가 생기고, 그 안에 `.mcap`(Humble 이후 기본, 예전은 `.db3`) 데이터 파일과 `metadata.yaml`이 저장된다.

### 자주 쓰는 옵션
```bash
ros2 bag record -a -o my_data   # -o 출력 폴더 이름 지정 (기본은 타임스탬프)
ros2 bag record -e "/camera/.*" # -e 정규식에 맞는 토픽만
ros2 bag record -a -x "/tf.*"   # -x 정규식에 맞는 토픽 제외
# 압축 저장
ros2 bag record -a --compression-mode file --compression-format zstd
```

| 옵션 | 설명 |
|------|------|
| `-a`, `--all` | 발행 중인 모든 토픽 기록 |
| `-o`, `--output` | 출력 폴더 이름 지정 |
| `-e`, `--regex` | 정규식에 맞는 토픽만 기록 |
| `-x`, `--exclude` | 정규식에 맞는 토픽 제외 |
| `-d <초>` | 지정 시간마다 파일 분할 |
| `-b <바이트>` | 지정 크기마다 파일 분할 |

> [!WARNING]
> 카메라/포인트클라우드 같은 토픽은 초당 수백 MB가 될 수 있어 `-a`로 전부 기록하면 디스크를 빠르게 채운다. 필요한 토픽만 지정하거나 압축을 쓰자.

## bag info

기록된 내용 요약 (토픽 목록/메세지 수/기간/크기)
```bash
ros2 bag info <폴더>
```

## bag play

기록한 데이터 재생
```bash
ros2 bag play <폴더>
ros2 bag play <폴더> --loop     # 반복 재생
ros2 bag play <폴더> --rate 2.0 # 2배속 재생
```

- 재생 시 [RViz2](../rviz2/main.md) 등에서 제대로 재현하려면 `/tf`, `/clock` 등이 함께 기록돼 있어야 한다.
- 시뮬레이션 데이터는 `/clock` 기록 여부와 `--use-sim-time` 설정을 신경 써야 한다.

---
[ROS 2 Documentation - Recording and playing back data](https://docs.ros.org/en/humble/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html)
