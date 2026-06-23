# 🎤 EXODUS ENT

> K-pop 아이돌 스케줄 & 팬 후기 플랫폼

<br/>

## 🔗 배포 링크

[![Vercel](https://img.shields.io/badge/Vercel-배포%20링크-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://exodus-ent-fe-a7x6.vercel.app)

**👉 https://exodus-ent-fe-a7x6.vercel.app**

<br/>

## 📌 프로젝트 소개

**EXODUS ENT**는 K-pop 아이돌 팬들을 위한 스케줄 관리 및 팬 후기 플랫폼입니다.

좋아하는 아이돌의 콘서트·팬미팅·음방 일정을 한눈에 확인하고,
직접 다녀온 현장의 생생한 후기를 사진과 함께 남길 수 있습니다.

어드민은 아이돌 정보와 스케줄을 관리하고,
팬들은 북마크·후기 작성·마이페이지를 통해 자신만의 팬 활동을 기록할 수 있습니다.

<br/>

## 🎬 시연 영상

> 각 기능 시연 영상입니다. GitHub에서 ▶ 버튼을 눌러 재생할 수 있습니다.

### 🏠 메인 화면

![메인 화면](https://github.com/user-attachments/assets/fb38c687-b0ea-4877-b2f8-be8e405362d7)

### 🗓️ 스케줄 캘린더

| 월간 스케줄 | 일정 상세 모달 |
|:---:|:---:|
| ![월간 스케줄](https://github.com/user-attachments/assets/8d5b8dc6-04b0-4d1a-9db2-4ae653d05f78) | ![일정 상세 모달](https://github.com/user-attachments/assets/9c1960e5-7c4e-434f-b6c5-d54e39fe7df7) |

### 🛠️ 어드민 스케줄 관리

| 스케줄 등록 | 스케줄 수정/삭제 |
|:---:|:---:|
| ![스케줄 등록](https://github.com/user-attachments/assets/edb2a90f-93c0-4887-8fa3-7cfe11775f3f) | ![스케줄 수정/삭제](https://github.com/user-attachments/assets/aa59d76d-d02e-4f01-872d-d67263c427ef) |

### 📝 후기

| 후기 목록 | 후기 등록 | 후기 삭제 |
|:---:|:---:|:---:|
| ![후기 목록](https://github.com/user-attachments/assets/98f6d79a-8d62-4780-9a59-a0c385e158a3) | ![후기 등록](https://github.com/user-attachments/assets/dded95a5-f0f2-4831-b2a9-e6b2b0afe682) | ![후기 삭제](https://github.com/user-attachments/assets/3cdd96ca-a469-4bba-9c31-40c9b444409e) |

### 👤 마이페이지

| 내 후기 조회 | 북마크 | 프로필 수정 |
|:---:|:---:|:---:|
| ![내 후기 조회](https://github.com/user-attachments/assets/57de22a8-8bf0-481c-b014-b8abb73b7dc3) | ![북마크](https://github.com/user-attachments/assets/07655fa2-f03d-48f8-8571-7ef90682e8b4) | ![프로필 수정](https://github.com/user-attachments/assets/f8c30f4a-3329-4e7e-a37b-0b8de7222cbd) |

### 🔐 인증

| 회원가입 | 이메일 로그인 | 카카오 로그인 |
|:---:|:---:|:---:|
| ![회원가입](https://github.com/user-attachments/assets/71bd6df7-798a-426e-8434-0b1c623f6c69) | ![이메일 로그인](https://github.com/user-attachments/assets/e87e6544-b4a8-4473-81cb-c607728070c8) | ![카카오 로그인](https://github.com/user-attachments/assets/96839ace-3e15-48a5-8779-6c2389feaaf9) |

<br/>

## ✨ 주요 기능

- **월간 캘린더** — FullCalendar 기반 아이돌별 색상 구분 스케줄 표시, 일정 상세 모달
- **아이돌 필터** — 아이돌별 스케줄 및 후기 필터링
- **팬 후기 CRUD** — 이미지 첨부, 별점, 스케줄 연결, 아이돌 필터
- **북마크** — 관심 스케줄 저장 및 마이페이지에서 관리
- **마이페이지** — 프로필 이미지 업로드, 닉네임 변경, 내 후기 관리
- **소셜 로그인** — 카카오 OAuth 연동
- **어드민 대시보드** — 아이돌/스케줄 등록·수정·삭제, 후기 관리
- **역할 기반 접근 제어(RBAC)** — Supabase RLS + Next.js Middleware 서버 사이드 보호

<br/>

## 🛠️ 기술 스택

![Next.js](https://img.shields.io/badge/Next.js-15.3.8-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![Zustand](https://img.shields.io/badge/Zustand-5.x-000000?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20PostgreSQL%20%2B%20Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-배포-000000?style=flat-square&logo=vercel&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.x-F7B93E?style=flat-square&logo=prettier&logoColor=black)

<br/>

| 분류 | 기술 | 버전 | 비고 |
|:---:|:---:|:---:|:---|
| Framework | Next.js | 15.3.8 | App Router |
| Language | TypeScript | 5.x | strict mode |
| Styling | Tailwind CSS | 3.x | 다크 테마 |
| Client State | Zustand | 5.x | 전역 유저 상태 |
| Backend | Supabase | - | Auth + PostgreSQL + Storage |
| Calendar | FullCalendar | 6.x | 월간 뷰 |
| Auth | Supabase Auth | - | 이메일 + 카카오 OAuth |
| Deploy | Vercel | - | Next.js 최적화 배포 |
| Linter | ESLint | 9.x | - |
| Formatter | Prettier | 3.x | - |

<br/>

## 🏗️ 프로젝트 구조

```
exodus-ent-fe/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 인증 관련 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── admin/              # 어드민 페이지
│   │   ├── idols/
│   │   └── schedule/
│   ├── artists/            # 아이돌 목록
│   ├── mypage/             # 마이페이지
│   ├── reviews/            # 후기 목록 & 작성
│   └── schedule/           # 스케줄 캘린더
├── src/
│   ├── components/         # 공통 컴포넌트
│   │   ├── admin/
│   │   ├── common/
│   │   └── review/
│   ├── lib/                # Supabase 클라이언트
│   └── store/              # Zustand 스토어
└── middleware.ts            # 인증 미들웨어
```

<br/>

## 💭 회고록

### 잘 된 점

처음으로 1인 풀스택 프로젝트를 기획부터 배포까지 혼자 완성했습니다. 요구사항 정의서, 와이어프레임, 화면 정의서, DB 설계까지 전 과정을 직접 하면서 개발 전체 흐름을 몸으로 익힐 수 있었습니다.

Next.js App Router + Supabase 조합을 실제 프로덕션에 가깝게 구현해보면서, 서버 사이드 인증(Middleware), RLS, Storage까지 Supabase의 다양한 기능을 활용해볼 수 있었습니다.

K-pop이라는 친숙한 도메인을 선택한 덕분에 기획 단계에서 사용자 입장에서 생각하기 쉬웠고, 실제로 쓰고 싶은 서비스를 만든다는 동기부여가 됐습니다.

### 아쉬운 점

배포 과정에서 Next.js CVE 보안 이슈, Supabase RLS 정책 누락, Storage 버킷 설정 등 예상치 못한 문제들로 시간을 많이 소요했습니다. 초기에 인프라 설정을 꼼꼼히 체크했다면 더 많은 기능을 구현할 수 있었을 것 같습니다.

카카오 소셜 로그인 연동 과정에서 비즈 앱 전환이 필요하다는 것을 뒤늦게 알게 되어 조교님 도움을 받아 해결했는데, 사전에 OAuth 연동 요구사항을 더 꼼꼼히 확인했어야 했다는 반성이 남습니다.

<br/>

## 🚀 향후 계획

- **소셜 로그인 고도화** — 구글 OAuth 추가, 소셜 계정 연동 관리
- **실시간 알림** — 북마크한 아이돌 스케줄 등록 시 알림
- **코드 리팩토링** — 컴포넌트 분리 및 커스텀 훅 추출, TypeScript 타입 강화
- **배포 안정화** — CI/CD 파이프라인 구축, 환경변수 관리 개선
- **검색 기능** — 아이돌명/스케줄명 통합 검색

<br/>

## 👤 개발자

| 이름 | 역할 | GitHub |
|:---:|:---:|:---:|
| 최하늘 | 기획 · 디자인 · 풀스택 | [@choisky13](https://github.com/choisky13) |

<br/>

---

<p align="center">
  <b>OZ 코딩스쿨(넥스트러너스) · 최하늘</b><br/>
  <a href="https://exodus-ent-fe-a7x6.vercel.app">🔗 서비스 바로가기</a>
</p>
