# 🎤 엑소더스Ent 기여 가이드

## 📌 브랜치 전략 (Branch Strategy)

- `main` : 최종 배포 브랜치
- `dev` : 개발 통합 브랜치 (default)
- `feature/기능명` : 기능 개발 브랜치

---

## 🌿 Branch 네이밍 컨벤션

feature/캘린더-메인페이지
feature/로그인-회원가입
feature/스케줄-상세모달
feature/후기-CRUD
feature/북마크
feature/마이페이지
fix/버그내용
hotfix/긴급수정내용

---

## ✏️ Commit Message 컨벤션

타입: 작업 내용 요약
예시)
feat: 월별 캘린더 UI 구현
fix: 로그인 에러 메시지 표시 오류 수정
style: 필터 바 반응형 스타일 수정
refactor: 스케줄 상세 모달 컴포넌트 분리
chore: Supabase 환경변수 설정
docs: README 업데이트

| 타입       | 설명                            |
| ---------- | ------------------------------- |
| `feat`     | 새로운 기능 추가                |
| `fix`      | 버그 수정                       |
| `style`    | UI/스타일 변경 (기능 변경 없음) |
| `refactor` | 코드 리팩토링                   |
| `chore`    | 설정, 패키지 등 기타 작업       |
| `docs`     | 문서 수정                       |
| `test`     | 테스트 코드                     |

---

## 📋 Issue 제목 컨벤션

[feat] 월별 캘린더 UI 구현
[fix] 로그인 에러 메시지 표시 오류
[style] 필터 바 반응형 스타일 수정
[chore] ESLint 설정 추가

---

## 🔀 PR 제목/본문 규칙

### 제목

[feat] 월별 캘린더 UI 구현 (#이슈번호)

### 본문 템플릿

작업 내용

월별 캘린더 그리드 구현
날짜 클릭 시 스케줄 상세 모달 연동

관련 이슈
closes #1
스크린샷
(변경된 UI가 있으면 첨부)
체크리스트

코드 동작 확인
불필요한 console.log 제거
타입 에러 없음 확인

---

## 🔗 Merge 방식

- `feature` → `dev` : **Squash and Merge** (커밋 깔끔하게)
- `dev` → `main` : **Merge Commit** (이력 보존)

---

## 📁 폴더 구조

src/
├── app/ # Next.js App Router 페이지
├── components/ # 공통 컴포넌트
│ ├── common/ # 버튼, 인풋 등 공용 UI
│ ├── calendar/ # 캘린더 관련 컴포넌트
│ ├── schedule/ # 스케줄 상세 관련
│ └── review/ # 후기 관련
├── store/ # Zustand 전역 상태
├── lib/ # Supabase 클라이언트 등
├── types/ # TypeScript 타입 정의
└── styles/ # 글로벌 스타일
