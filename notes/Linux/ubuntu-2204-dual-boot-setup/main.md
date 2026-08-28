---
title: Ubuntu 22.04 듀얼부팅 설치 가이드
date: 2026-08-14
tags: ubuntu, dual-boot
order: 
featured: false
draft: false
---

# Ubuntu 22.04 듀얼부팅 설치 가이드

Windows 11 + Ubuntu 22.04 LTS 듀얼부팅. [ROS2 Humble](../../ROS2/ros-basics/main.md) 개발 목적. 재부팅하며 진행하므로 폰/다른 기기에서 이 노트를 보며 따라간다.

## 이 기기 사양 (호환성 걱정 0)

| 부품 | 모델 | 22.04 지원 |
|---|---|---|
| CPU | AMD Ryzen 9 3900X (Zen2, 12코어) | 완벽 |
| GPU | NVIDIA RTX 2070 SUPER | 완벽 (드라이버 + CUDA) |
| 메인보드 | ASUS PRIME X570-P | 완벽 (UEFI) |
| 유선랜 | Realtek PCIe GbE | 설치 직후 인터넷 됨 |
| RAM | 64GB | 넉넉 |

부품이 전부 2019년산이라 22.04(2022 출시)가 드라이버를 다 잡는다. ASUS 데스크탑 기준 **부팅메뉴 = F8, BIOS = Delete**.

## 최종 디스크 레이아웃

**NVMe SSD (512GB) — 속도 담당**

| 파티션 | 크기 | 용도 |
|---|---|---|
| Windows C: (NTFS) | ~356GB | Windows 그대로 (476GB − 120GB) |
| 리눅스 `/` (ext4) | ~120GB | 시스템 + 도커/빌드 캐시 |

**WD HDD (1863GB) — 용량 담당**

| 파티션 | 크기 | 용도 |
|---|---|---|
| Windows S: (NTFS) | ~1363GB | Windows·Linux 공용 창고 (1863GB − 500GB) |
| 리눅스 데이터 (ext4) | ~500GB | `/mnt/data` (데이터셋·rosbag) |

- swap 별도 파티션 불필요 → Ubuntu가 `/` 안에 swapfile 자동 생성.
- `/mnt/data`는 폴더처럼 보이지만 내용물은 HDD에 저장된다. **코드·설정은 홈(`~`, SSD), 무거운 데이터는 `/mnt/data`(HDD)** 규칙만 기억.

## 준비물
- USB 8GB 이상
- Ubuntu 22.04 LTS ISO (ubuntu.com/download)
- Rufus (rufus.ie)

---

## 1단계 · Windows 안전장치 끄기 (제일 중요)
1. **BitLocker 해제**: 설정 → 개인정보 및 보안 → 장치 암호화 → 꺼짐 확인 (Windows 11 Home은 "장치 암호화" 명칭)
2. **빠른 시작 + 최대절전 끄기**: 관리자 PowerShell에서 `powercfg /h off` 한 줄. (빠른 시작이 꺼지고 hiberfil.sys도 삭제돼 3단계 파티션 축소가 잘 된다.)
3. 완전 종료 후 재부팅 1회

> 빠른 시작 안 끄면 리눅스가 Windows 파티션을 못 건드리거나 데이터가 깨질 수 있다. 무조건 먼저.

## 2단계 · Windows에서 빈 공간 만들기 — **드라이브별로 방법이 다르다**

> **이 기기 실제 확인 결과 (2026-08-16):** C:는 Windows 내장 축소로 **17GB밖에 안 잘린다.** 볼륨 끝(459GB 지점)에 `$Mft`(마스터 파일 테이블)가 박혀 있는데, Windows 내장 "볼륨 축소"는 MFT를 못 옮기기 때문. 페이지파일·최대절전·시스템 보호를 다 꺼도 소용없다(이건 다른 종류의 이동불가 파일이라 이 경우엔 해결책이 아님). → **C:는 디스크 관리 말고 USB의 GParted로 줄인다(4단계 이후).**

**S: (HDD, 500GB) → 지금 Windows 디스크 관리로 OK ✅**
`Win + X` → **디스크 관리**
4. `S:` 우클릭 → 볼륨 축소 → **512000 MB (500GB)** → 축소 → "할당되지 않음"으로 둔다.
   - S:는 여유 1.6TB짜리 순수 데이터 드라이브라 끝에 이동불가 파일이 걸릴 일이 거의 없어 정상적으로 잘린다.
   - (혹시 S:도 축소량이 500GB보다 적게 뜨면, S: 끝에도 이동불가 파일이 있는 것 → 이것도 C:처럼 GParted로 넘긴다.)

**C: (SSD, 120GB) → 디스크 관리로 하지 말 것. 5단계(USB의 GParted)에서 처리한다.**

> 새 볼륨 만들지 말 것. "할당되지 않음"인 채로 둔다. 포맷은 리눅스가 한다.

## 3단계 · 설치 USB 만들기
6. Rufus → 장치=USB, 부팅선택=Ubuntu ISO
7. 파티션 방식 = **GPT**, 대상 시스템 = **UEFI** 확인 → 시작

## 4단계 · USB로 부팅 → GParted로 C: 먼저 축소
8. USB 꽂고 재부팅 → 로고 뜰 때 **F8** 연타 → 부팅메뉴에서 USB 선택
9. **"Try Ubuntu"** 선택 (아직 설치 X — 라이브 환경으로 진입)
10. **GParted 실행** (좌상단 Activities에서 "gparted" 검색) → 우상단에서 **SSD 디스크(`/dev/nvme0n1`, 512GB)** 선택
11. **C: NTFS 파티션** 우클릭 → **Resize/Move** → 뒤쪽에서 **120GB(122880MB)** 만큼 줄여 뒤에 "unallocated" 공간 만들기 → 초록 체크(Apply)로 적용.
    - GParted는 Windows와 달리 MFT를 재배치할 수 있어 여기선 120GB가 문제없이 잘린다.
    - **전제:** 1단계(BitLocker 해제 + `powercfg /h off` + 완전 종료)를 안 했으면 GParted가 C:를 잠긴 상태로 보고 리사이즈를 거부한다. 그럴 땐 취소하고 Windows로 돌아가 1단계부터.
12. GParted 닫기 → 바탕화면의 **"Install Ubuntu 22.04 LTS"** 더블클릭 → 설치 시작
13. **서드파티 드라이버 체크박스 켜기** (그래픽·Wi-Fi 하드웨어용 소프트웨어 설치) → NVIDIA 드라이버 자동 설치
14. 설치 유형 → **"Something else / 기타"** 선택 (자동 옵션 X)

## 5단계 · 수동 파티션 (핵심)
파티션 표에 "여유 공간(free space)" 2개가 보인다 (SSD 120GB = 4단계 GParted로 만든 것, HDD 500GB = 2단계 디스크 관리로 만든 것):
15. **SSD 여유 120GB** → `+` → 크기 전부, 종류 **Ext4**, 마운트 **`/`** → OK
16. **HDD 여유 500GB** → `+` → 크기 전부, 종류 **Ext4**, 마운트 **`/mnt/data`** → OK
17. 맨 아래 **"부트로더 설치할 장치"** → **SSD (`/dev/nvme0n1`, WD 아님!)** 선택
18. **"지금 설치"** → 검토 → 계속

> - **EFI 파티션 새로 만들지 말 것.** Windows가 이미 SSD에 만들어둔 EFI 파티션에 Ubuntu가 알아서 GRUB을 넣는다. (`/`와 `/mnt/data`만 만들면 됨)
> - 부트로더를 USB나 HDD에 두는 게 초보 실수 1순위. 꼭 Windows가 깔린 SSD로.
> - SSD = `/dev/nvme0n1`, HDD = `/dev/sda`. 헷갈리면 용량(512GB=SSD)으로 구분.

## 6단계 · 마무리
19. 시간대(서울) → 계정/비밀번호 → 설치 완료 → **USB 뽑고 재부팅**
20. **(Secure Boot 켜져 있으면) 파란 MOK 화면 처리 — 중요**:
    - 설치 중 서드파티 드라이버를 켰다면, 설치 막판에 "Secure Boot 비밀번호"를 정하라고 한다 → 아무 임시 비번 입력.
    - 첫 재부팅 시 파란 화면(**MOK Manager**)이 뜨면 → **Enroll MOK → Continue → Yes → 방금 정한 비번 입력 → Reboot**.
    - 이걸 안 하고 그냥 부팅하면 NVIDIA 드라이버가 서명 검증 실패로 안 올라온다. (놓쳤으면 7단계 22번으로 복구)
21. 재부팅하면 **GRUB 메뉴** 등장: `Ubuntu`(리눅스) / `Windows Boot Manager`(윈도우) 방향키로 선택.
    - Windows가 목록에 안 뜨면: Ubuntu 부팅 후 `sudo os-prober` 확인 → `sudo update-grub`.

## 7단계 · 설치 후
19. `/mnt/data` 소유권을 내 계정으로 (터미널):
```bash
sudo chown -R $USER:$USER /mnt/data
```
23. (화면 저해상도/NVIDIA 안 잡힐 때) 드라이버 설치·검증:
```bash
sudo ubuntu-drivers autoinstall   # 드라이버 설치
sudo reboot
nvidia-smi                        # 재부팅 후 GPU 인식되면 성공
```

## 실사용 규칙 요약
| 종류 | 위치 | 이유 |
|---|---|---|
| 코드·설정·ROS2 워크스페이스 | `~` (SSD) | 빠름 |
| 데이터셋·rosbag·큰 파일 | `/mnt/data` (HDD) | 용량 |

예:
```bash
cd ~/ros2_ws && colcon build                    # 홈(SSD)에서 빌드
ros2 bag record -o /mnt/data/rosbags/test1 ...   # rosbag은 HDD로
```
