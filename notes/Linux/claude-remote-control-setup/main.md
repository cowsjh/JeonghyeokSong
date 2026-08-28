---
title: 노트북 Claude 원격 머신 셋업 (Claude Remote Control Setup)
date: 2026-08-10
tags: ssh, tailscale
order: 
featured: false
draft: false
---

# 노트북 Claude 원격 머신 셋업 (Claude Remote Control Setup)

새 노트북을 Claude Code 원격 제어(Remote Control)용 머신으로 세팅하는 절차. **처음 셋업할 때**와 **연결이 끊겨서 다시 붙을 때**를 나눠서 정리.

관련: Claude Code statusline 커스텀 설정 — 같은 리눅스 원격 기기에서 Claude Code를 세팅한 또 다른 기록(상태줄 커스터마이징).

---

## A. 첫 연결

## 1. 폰 준비물
- Tailscale 앱 설치 (노트북과 같은 계정으로 로그인)
- Claude 앱 설치 (원격 QR 스캔용)
- termux : 원격 ssh 재접속시 필요
## 2. 노트북 기본 설정

*노트북 터미널에서 직접 실행, sudo 필요.*

```bash
# 1. 패키지 설치
sudo apt update
sudo apt install -y tmux openssh-server

# 2. Tailscale 설치
curl -fsSL https://tailscale.com/install.sh | sh

# 3. 뚜껑 닫아도 절전 안 되게 설정
sudo sed -i 's/^#\?HandleLidSwitch=.*/HandleLidSwitch=ignore/' /etc/systemd/logind.conf
sudo sed -i 's/^#\?HandleLidSwitchDocked=.*/HandleLidSwitchDocked=ignore/' /etc/systemd/logind.conf
sudo sed -i 's/^#\?HandleLidSwitchExternalPower=.*/HandleLidSwitchExternalPower=ignore/' /etc/systemd/logind.conf
grep -qE '^HandleLidSwitch=ignore' /etc/systemd/logind.conf || echo "HandleLidSwitch=ignore" | sudo tee -a /etc/systemd/logind.conf
grep -qE '^HandleLidSwitchDocked=ignore' /etc/systemd/logind.conf || echo "HandleLidSwitchDocked=ignore" | sudo tee -a /etc/systemd/logind.conf
grep -qE '^HandleLidSwitchExternalPower=ignore' /etc/systemd/logind.conf || echo "HandleLidSwitchExternalPower=ignore" | sudo tee -a /etc/systemd/logind.conf
sudo systemctl restart systemd-logind

# 4. 모든 절전 경로 완전 차단
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

# 5. SSH 서버 활성화
sudo systemctl enable --now ssh

# 6. Tailscale 연결 (브라우저 로그인 창 뜸)
sudo tailscale up

echo "=== 설정 완료 ==="
```

`sudo tailscale up` 실행 시 출력되는 링크를 브라우저에서 열어 구글/깃허브 계정으로 로그인.

## 3. Claude Remote Control 시작

*tmux 세션 안에서 실행.*

```bash
tmux new -s claude
claude remote-control
```

- `claude remote-control` 실행하면 세션 URL과 QR코드가 뜸 (스페이스바로 QR 토글)
- 폰 Claude 앱으로 QR 스캔하면 연결
- `Ctrl-b` 다음 `d` 로 detach해도 세션은 계속 살아있음

## 4. 푸시 알림 켜기

*Claude Code 안에서 실행.*

```
/config
```
→ "Push when Claude decides" / "Push when actions required" 켜기

---

## B. 재연결 시 방법

핸드폰으로 ssh 연결 후 컴퓨터 터미널을 원격으로 조작 하는 방법으로 재연결을 한다.

필요 어플리케이션
1. termux
2. tailscale

### termux 터미널 에서

```bash
ssh 컴퓨터사용자명@tailscale-ip #어플 목록에서 100.xxx.xx... 로 시작 하는 ip
cd 디렉토리
tmux attach -t claude
```

최근 세션이 없다면
```bash
tmux new -s claude
claude remote-control
```

### ssh 다운로드

termux 접속
```bash
pkg update && pkg install openssh 
```
