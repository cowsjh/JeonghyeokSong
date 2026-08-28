---
title: 파일 권한과 sudo (File Permissions)
date: 2026-08-08
tags: permissions, sudo
order: 
featured: false
draft: false
---

# 파일 권한과 sudo (File Permissions)

리눅스는 **다중 사용자 시스템**이라 파일 하나에도 세 부류의 접근 권한이 따로 매겨진다.

## rwx 읽는 법

```
-rwxr-xr-- 1 robot dialout 5820 Jul 7 10:30 motor_test.py
```

| 조각 | 의미 |
|---|---|
| `-` | 종류 (`-` 파일, `d` 디렉터리, `c` 문자 장치) |
| `rwx` | **소유자**(robot) — 읽기+쓰기+실행 |
| `r-x` | **그룹**(dialout) — 읽기+실행 |
| `r--` | **그 외** — 읽기만 |

- 소유자(u) = 집주인, 그룹(g) = 등록된 가족 구성원, 그 외(o) = 방문객
- 권한 변경: `chmod`(권한), `chown`(소유자) — 예: `chmod +x run.sh`

## 로봇 개발에서 흔한 이슈 — 시리얼 포트

`/dev/ttyUSB0`은 보통 `dialout` 그룹 소유라, 내 계정이 그 그룹에 없으면 `Permission denied`가 난다.

```bash
sudo usermod -aG dialout $USER   # 계정을 dialout 그룹에 추가
# 로그아웃 후 재로그인해야 적용됨
```

그룹을 새로 만드는 게 아니라, 이미 있는 그룹에 내 계정을 넣어 그 그룹 권한(`r-x`)을 받는 것.

## sudo — 관리자 권한의 양날

`sudo`는 명령을 **root 권한**으로 실행한다. 시스템 설정 변경, 패키지 설치, 서비스 제어에 필요하다.

> "에러가 나서 그냥 sudo를 붙였다"는 습관은 금물. 원인(그룹 미소속, 소유자 문제)을 바로잡는 게 정석이고, sudo는 시스템 수준 변경이 정말 필요할 때만.

예: `sudo colcon build`로 빌드하면 산출물이 root 소유가 돼 이후 일반 권한 빌드가 계속 깨지는 대표적 자충수.

## 관련 노트

- [커널과 프로세스 (Kernel & Process)](../kernel-and-process/main.md)
- [시리얼 통신과 UART (Serial Communication)](../serial-communication-uart/main.md)
