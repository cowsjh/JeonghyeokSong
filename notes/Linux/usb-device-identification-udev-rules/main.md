---
title: USB 장치 식별과 udev 규칙 (USB Device Identification)
date: 2026-08-28
tags: usb, udev
order: 
featured: false
draft: false
---

# USB 장치 식별과 udev 규칙 (USB Device Identification)

## Vendor ID / Product ID

| 필드 | 의미 | 예시 (`1a86:55d3`) |
|---|---|---|
| `idVendor` | 칩을 만든 회사. USB-IF가 회사마다 발급하는 고유번호 | `1a86` = QinHeng Electronics(WCH) |
| `idProduct` | 그 회사가 자기 제품 라인 안에서 매기는 모델 구분값 | `55d3` = USB Single Serial 칩 |

같은 회사(vendor)라도 칩 모델(product)이 다르면 값이 다르다. vendor+product는 **전세계에 그 칩을 쓰는 모든 보드가 공유**하는 값이라, 개별 장치를 구분하려면 `ATTRS{serial}`(생산 단위별 일련번호)까지 필요하다.

## PCI의 이중 구조 — vendor vs subsystem_vendor

USB에는 없고 PCI 장치에만 있는 구조.

- `vendor` — 칩 자체를 만든 회사
- `subsystem_vendor` — 그 칩을 얹어 완제품 보드로 조립·판매한 회사

```
ATTRS{vendor}=="0x8086"            # Intel — USB 컨트롤러 칩 제조사
ATTRS{subsystem_vendor}=="0x17aa"  # Lenovo — 그 칩을 얹은 노트북 제조사
```

**같은 칩이어도 완제품 회사는 다를 수 있다** — GPU에 비유하면 "NVIDIA 칩 + ASUS가 만든 카드"와 같은 구조.

## Bus/Device 번호는 계층이 아니라 주소

`lsusb` 출력:

```
Bus 003 Device 015: ID 1a86:55d3 QinHeng Electronics USB Single Serial
```

- **Bus**: 이 컴퓨터에 물린 USB 컨트롤러(루트허브) 중 몇 번째인가
- **Device**: 그 버스 안에서 부팅(또는 마지막 리셋) 후 몇 번째로 주소를 받았는가 — 그냥 누적 카운터, 계층 깊이가 아니다

뽑았다 다시 꽂으면 Device 번호가 바뀐다 — 코드에 하드코딩하기엔 불안정한 이름.

## sysfs devpath — 실제 계층 구조

```
/devices/pci0000:80/0000:80:14.0/usb3/3-10/3-10:1.0/tty/ttyACM0
```

| 조각 | 의미 |
|---|---|
| `pci0000:80` | PCI 도메인 0, 버스 80 |
| `0000:80:14.0` | 그 버스의 특정 PCI 장치(Intel USB 컨트롤러 칩) |
| `usb3` | 그 컨트롤러가 만든 USB 루트허브 — `lsusb`의 **Bus 03**과 동일 |
| `3-10` | 버스 3의 **포트 10** — `lsusb -t`의 **Port 10**과 동일 |
| `3-10:1.0` | 그 장치의 config 1·interface 0 (인터페이스가 여러 개면 `:1.1`처럼 늘어남) |
| `tty` | 이 인터페이스를 처리하는 커널 서브시스템 |
| `ttyACM0` | 최종 `/dev/` 장치 파일 이름 |

`udevadm info -a -n /dev/ttyACM0`은 이 경로를 자식(`ttyACM0`)→부모(`pci...`) 방향으로 훑으며, 각 조각(레벨)의 속성을 블록 단위로 보여준다.

## udev rule 매칭 함정 — 블록을 섞으면 영영 안 걸림

한 rule의 `ATTRS{}` 조건은 전부 **같은 하나의 부모 장치 블록**에서 나온 값이어야 매칭된다. 서로 다른 블록의 값을 섞으면, 그 조건들을 동시에 만족하는 단일 장치가 애초에 존재하지 않아 rule이 절대 안 걸린다.

실제로 걸렸던 사례:

```
# /etc/udev/rules.d/80-so-101.rules — 문제 있던 버전
ATTRS{subsystem_device}=="0x3d73", ATTRS{subsystem_vendor}=="0x17aa", ATTRS{serial}=="5B8E114947", SYMLINK+="ws-servo-board"
```

`subsystem_vendor`/`subsystem_device`는 PCI 컨트롤러 블록(`0000:80:14.0`) 값인데 `serial`은 서보 보드 블록(`3-10:1.0`) 값이다 — 서로 다른 블록. `udevadm test`와 `ls /dev/ws-servo-board`로 심링크가 안 생겼음을 확인. 올바른 방향은 서보 보드 블록 안의 값끼리만(`idVendor`/`idProduct`/`serial`) 조합하는 것.

## 이름 고정이 필요한 이유

`/dev/ttyACM0`은 커널이 USB 장치를 인식한 순서에 매기는 번호라, 다른 USB-시리얼 장치가 얽히면 흔들린다.

```
$ ls -l /dev/serial/by-id/
usb-1a86_USB_Single_Serial_5B8E114947-if00 -> ../../ttyACM0
```

`/dev/serial/by-id/`는 udev가 vendor+product+serial로 자동 생성하는 고정 심볼릭 링크. 커스텀 이름이 필요하면 위 규칙처럼 `SYMLINK+=`을 쓰되, 조건은 같은 블록 값으로만 구성한다.

---

[시리얼 통신과 UART (Serial Communication)](../serial-communication-uart/main.md)에서 다룬 `/dev/ttyACM0` 같은 tty 장치 파일이, 실제로는 이 노트의 vendor/product·devpath 체계로 식별된 결과물이다.

여기 나온 값들을 직접 뽑아보는 명령어는 [udev port 관련 명령어](../udev-port-commands/main.md) 참고.
