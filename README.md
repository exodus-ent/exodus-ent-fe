# 엑소더스Ent

케이팝 아이돌 스케줄 관리 플랫폼. 콘서트·팬싸인회·발매 등 스케줄을 캘린더로 확인하고, 후기를 남기며 북마크로 모아볼 수 있습니다.

## 주요 기능

| 기능 | 설명 |
|---|---|
| 스케줄 캘린더 | 월별 캘린더에서 아이돌 스케줄 확인, 카테고리·아이돌 필터 |
| 스케줄 상세 | 모달로 일시·장소·설명·링크 확인, 북마크 저장 |
| 후기 CRUD | 별점(1~5점)·텍스트·이미지 후기 작성·수정·삭제 |
| 북마크 | 스케줄 북마크 토글, 마이페이지에서 목록 관리 |
| 마이페이지 | 내 후기 / 북마크 / 프로필(닉네임·아바타) 수정 |
| 관리자 | 스케줄 등록·수정·삭제 (관리자 계정 전용) |
| 인증 | 이메일 회원가입·로그인, Google OAuth |

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 상태 관리 | Zustand v5 |
| 백엔드·인증 | Supabase (Auth, Database, Storage) |
| 캘린더 | FullCalendar 6 |
| 개발 목업 | MSW 2 |

## 로컬 실행 방법

### 요구 사항

- Node.js 18 이상
- Supabase 프로젝트 (무료 플랜 가능)

### 설치

```bash
git clone https://github.com/exodus-ent/exodus-ent-fe.git
cd exodus-ent-fe
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Supabase 대시보드 → **Project Settings → API** 에서 확인할 수 있습니다.

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 으로 접속합니다.

> 개발 환경에서는 MSW(Mock Service Worker)가 자동으로 활성화되어 목 데이터로 동작합니다.

## Supabase 설정

### 테이블

Supabase SQL Editor에서 아래 SQL을 실행합니다.

```sql
-- 프로필
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- 스케줄
create table schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  idol text not null,
  category text not null,
  date date not null,
  time text,
  location text,
  description text,
  thumbnail_url text,
  detail_url text,
  created_at timestamptz default now()
);

-- 후기
create table reviews (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references schedules(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  nickname text not null,
  rating int not null check (rating between 1 and 5),
  content text not null,
  created_at timestamptz default now()
);

-- 후기 이미지
create table review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references reviews(id) on delete cascade,
  url text not null,
  created_at timestamptz default now()
);

-- 북마크
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  schedule_id uuid references schedules(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, schedule_id)
);
```

### Storage 버킷

Supabase 대시보드 → **Storage** 에서 아래 버킷을 **Public** 으로 생성합니다.

| 버킷 이름 | 용도 |
|---|---|
| `review-images` | 후기 첨부 이미지 |
| `schedule-thumbnails` | 스케줄 썸네일 이미지 |
| `avatars` | 프로필 아바타 이미지 |

## 프로젝트 구조

```
├── app/
│   ├── page.tsx              # 메인 (스케줄 캘린더)
│   ├── login/page.tsx        # 로그인
│   ├── signup/page.tsx       # 회원가입
│   ├── reviews/page.tsx      # 전체 후기 목록
│   ├── mypage/page.tsx       # 마이페이지
│   └── admin/
│       ├── page.tsx          # 관리자 스케줄 목록
│       └── schedule/
│           ├── new/          # 스케줄 등록
│           └── [id]/edit/    # 스케줄 수정
├── src/
│   ├── components/
│   │   ├── calendar/         # 캘린더·필터바·스케줄 로더
│   │   ├── schedule/         # 스케줄 상세 모달
│   │   ├── review/           # 후기 컴포넌트
│   │   ├── admin/            # 관리자 폼
│   │   └── common/           # 공통 (Navbar)
│   ├── hooks/
│   │   └── useBookmark.ts    # 북마크 토글 훅
│   ├── store/                # Zustand 스토어
│   ├── lib/
│   │   └── supabase.ts       # Supabase 클라이언트
│   └── mocks/                # MSW 목 핸들러 (개발 전용)
```
