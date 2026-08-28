---
title: 시리얼 통신과 UART (Serial Communication)
date: 2026-08-08
tags: serial, uart
order: 
featured: false
draft: false
---

# 시리얼 통신과 UART (Serial Communication)

## 시리얼(직렬) vs 병렬

"직렬"은 포트 개수가 아니라 **한 통신선 안에서 데이터가 흐르는 순서**를 뜻한다.

- 병렬: 여러 비트를 동시에 나란히 전송 (빠르지만 배선 복잡)
- 직렬: 비트를 한 줄로 세워 하나씩 전송 (배선 단순)

리눅스는 이를 `/dev/ttyUSB0`, `/dev/ttyACM0` 같은 **장치 파일**로 인식한다(`tty` = teletype 줄임말). "모든 것은 파일" 철학 덕분에 `open('/dev/ttyUSB0')`처럼 파일 다루듯 하드웨어와 통신 가능.

## USB와 시리얼의 관계

USB(Universal **Serial** Bus)도 물리 계층에서는 직렬 전송이다. 다만 리눅스의 장치 파일 이름은 **USB 위에서 어떤 프로토콜을 쓰느냐**로 갈린다.

| 장치 | USB 위 프로토콜 | 장치 파일 | 서브시스템 |
|---|---|---|---|
| 모터 컨트롤러 (Arduino, STM32) | UART 흉내 | `/dev/ttyUSB0`, `ttyACM0` | tty |
| USB 카메라 | UVC | `/dev/video0` | V4L2 |

## 시리얼 포트(tty)의 대표 예

모터 드라이버 보드 · GPS 모듈(NMEA) · IMU 센서 · 저가형 2D 라이다(RPLiDAR) · 3D 프린터/CNC(G-code)

| 장치 파일 패턴 | 의미 |
|---|---|
| `/dev/ttyUSB0` | USB-to-Serial 칩 (FTDI, CP2102 등) |
| `/dev/ttyACM0` | USB CDC-ACM (Arduino Uno 등) |
| `/dev/ttyS0` | 내장 물리 RS-232 포트 |
| `/dev/ttyAMA0` | 라즈베리파이 GPIO UART 핀 |

`ls -l /dev/tty*`의 종류 문자는 `c`(문자 장치) — 한 번에 한 바이트씩 주고받는다.

## UART (Universal Asynchronous Receiver/Transmitter)

시작비트-데이터-정지비트 방식으로 통신하는 하드웨어 회로 겸 규격.

- **비동기식**: 클럭 신호선 없이, 속도(baud rate, 예: 9600bps)만 미리 약속
- 송신: 바이트 → 비트로 풀어 순서대로 전송 / 수신: 비트를 모아 바이트로 재조립

**전송 구조** — 예: 거리값 250(`11111010`) 전송 시

```
[시작비트] [데이터 8비트]  [정지비트]
   0        11111010          1
```

여러 바이트가 모여 라이다 패킷(`[헤더][각도][거리]...[체크섬]`)이나 GPS NMEA 문자열(`$GPGGA,...`) 구조를 이룬다.

**시작/정지 비트 구별법**: 값(0/1)이 아니라 **타이밍**으로 구별한다.

- 평소 회선은 항상 **1(idle)** 유지
- 0으로 뚝 떨어지는 순간 = 시작비트
- 이후 약속된 속도로 정해진 개수(보통 8개)만 세어 데이터로 읽고, 다음 1비트는 정지비트

```
1111111111 [0] 1 1 1 1 1 0 1 0 [1] 1111111111
   idle    시작  ---데이터 8비트---  정지  다시 idle
```

값이 아니라 순서(타이밍)로 구분하므로, 데이터 안 0/1 패턴이 시작/정지비트와 같아 보여도 안 헷갈린다.

## 관련 노트

- [커널과 프로세스 (Kernel & Process)](../kernel-and-process/main.md)
- [파일 권한과 sudo (File Permissions)](../file-permissions-and-sudo/main.md)
- [USB 장치 식별과 udev 규칙 (USB Device Identification)](../usb-device-identification-udev-rules/main.md) — `/dev/ttyACM0` 같은 장치 파일이 실제로 어떤 vendor/product·경로로 식별되는지
- [udev port 관련 명령어](../udev-port-commands/main.md) — 위 식별 값들을 직접 조회·고정하는 명령어 모음
