---
title: udev port 관련 명령어
date: 2026-08-28
tags: udev, usb
order: 
featured: false
draft: false
---

# udev port 관련 명령어

## udev

```bash
ls -l <장치>
udevadm info --attribute-walk <장치>
udevadm info -a -n <장치>       # --attribute-walk과 동일, 짧은 표기
udevadm info -q path -n <장치>  # 장치 파일 → sysfs devpath만 바로 뽑기
```

## rules
### 경로
```bash
/etc/udev/rules.d/
```

### 재연결
``` bash
sudo udevadm control --reload-rules   # 룰 파일 재적재
sudo udevadm trigger                  # 이미 꽂혀있는 장치에 룰 재적용 (reload-rules만으론 안 먹음)
```

## 디버깅
```bash
udevadm test /sys/class/tty/ttyACM0   # 심링크 실제 생성 없이 룰 매칭 여부만 dry-run
udevadm monitor                       # 뽑고 꽂을 때 udev 이벤트 실시간 관찰
lsusb                                 # Bus/Device, idVendor:idProduct
lsusb -t                              # Bus-Port 트리 구조
ls -l /dev/serial/by-id/              # udev가 자동 생성한 고정 심링크 확인
```

## 관련 노트

- [USB 장치 식별과 udev 규칙 (USB Device Identification)](../usb-device-identification-udev-rules/main.md) — 여기 명령어들이 뽑아내는 값(idVendor, subsystem_vendor, devpath 등)의 의미
- [시리얼 통신과 UART (Serial Communication)](../serial-communication-uart/main.md) — `ttyACM0` 같은 장치 파일 자체에 대한 배경