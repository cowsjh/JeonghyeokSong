---
title: SSH 공개키 인증 방식
date: 2026-08-26
tags: ssh, 암호화
order: 
featured: false
draft: false
---

# SSH 공개키 인증 방식

SSH는 비밀번호 대신 **공개키/개인키 쌍**으로 로그인을 인증한다. 서버에는 **공개키**만 등록해두고, 실제 인증은 서버가 던진 임의의 값(challenge)을 클라이언트가 **개인키로 서명**해 돌려주는 방식(challenge-response)으로 이뤄진다.

- 서버: `~/.ssh/authorized_keys`에 클라이언트의 공개키를 미리 등록해둔다.
- 로그인 시도: 서버가 랜덤 challenge를 생성해 클라이언트에 전달한다.
- 클라이언트: 개인키로 그 challenge에 서명해 응답한다.
- 서버: 등록된 공개키로 서명을 검증한다 — 개인키를 직접 보지 않고도 소유 여부를 확인할 수 있다.

**핵심:** 개인키는 이 과정에서 네트워크로 전송되지 않는다. 서버에 올라가는 공개키는 유출돼도 그것만으로는 로그인이 불가능해 안전하다.

**예시:**
```
ssh-copy-id user@host   # 로컬 공개키(~/.ssh/id_ed25519.pub)를 서버 authorized_keys에 등록
ssh user@host           # 이후 접속 시 challenge-response로 자동 인증
```

이 원리를 실제 원격 접속 셋업에 적용한 기록은 [원격 머신 셋업](../../Linux/claude-remote-control-setup/main.md)에 있다.

## authorized_keys와 known_hosts의 차이

SSH가 쓰는 두 등록 파일은 **인증 방향이 반대**다.

| 파일 | 위치 | 저장하는 키 | 역할 |
|---|---|---|---|
| `authorized_keys` | 서버 쪽 (`~/.ssh/`) | 클라이언트의 공개키 | 서버가 "이 사용자"를 인증 |
| `known_hosts` | 클라이언트 쪽 (`~/.ssh/`) | 서버의 공개키 | 클라이언트가 "이 서버"를 인증 (중간자 공격 방지) |

**예시:** 처음 접속하는 서버에서 뜨는 `Are you sure you want to continue connecting?` 메시지는 그 서버의 공개키가 아직 `known_hosts`에 없다는 뜻이다.

## 비대칭키 암호의 기원

**공개키-개인키 쌍(비대칭키 암호)** 개념은 1976년 Diffie–Hellman 논문에서 처음 제안됐고, 실제로 널리 쓰인 구현체는 1977년 **RSA**(발명자 Rivest, Shamir, Adleman 이니셜을 딴 이름)다. 그 이전 암호는 잠그는 키와 여는 키가 같은 **대칭키** 방식뿐이었다.

- 비대칭키 이전: 통신 양쪽이 같은 비밀키를 미리 공유해야 했다 (키 배송 문제).
- 비대칭키 이후: 공개키는 누구에게나 공개해도 되고, 개인키만 비밀로 유지하면 된다.
- SSH·HTTPS(TLS)·Git 커밋 서명 등 현재 인터넷 보안 인프라 대부분이 이 개념 위에 세워졌다.
