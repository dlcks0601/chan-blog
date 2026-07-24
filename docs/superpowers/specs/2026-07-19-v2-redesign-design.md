# v2 리디자인 스펙 — zerolog 스타일 블랙/화이트 미니멀

날짜: 2026-07-19
브랜치: `v2`
레퍼런스: https://zerolog.vercel.app (홈, /resume)

## 목표

블로그를 zerolog와 같은 초미니멀 구조로 재구성한다. 컬러는 블랙 배경 + 화이트/그레이
텍스트의 모노크롬으로 유지하고, 라우트는 홈과 Resume 두 개로 줄인다.

## 라우트 구조

| 라우트 | 내용 |
| --- | --- |
| `/` | 홈. 로고, 한 줄 소개(타자기 인터랙션), Resume 네비, 소셜 링크 |
| `/resume` | 이력서. 프로필 헤더 + 회사/프로젝트 이력 |

### 삭제 대상

- `app/feeds/` 라우트 전체, `src/pages/feed/`, `src/entities/Feed/`, `_feeds/` 콘텐츠
- `app/projects/` 라우트 전체, `src/pages/projects/`
- `app/me/` 라우트, `src/pages/me/` (데이터는 `/resume`으로 이전 후 삭제)
- 위 페이지에서만 쓰이던 shared 컴포넌트 중 미사용이 되는 것 (예: `ProfileTable`,
  `PageHeader` 등 — 이전 후 실제 사용처 기준으로 판단)

## 홈 (`/`)

zerolog 홈과 동일한 골격, 블랙 배경 버전.

- `h-screen` 컬럼 레이아웃, `justify-between`, `py-10`, `px-4 lg:px-8`
- 상단 그리드: `md:grid-cols-[1fr_3fr_2fr]` / 모바일 `grid-cols-[1fr_4fr]`
  - 1열: 로고 — 작은 마크(선 회전 애스터리스크) + `@leechan` 텍스트. 홈 링크
  - 2열: 한 줄 소개 문단. 기존 `Writer` 타자기 인터랙션 유지, 하이라이트/링크 지원
  - 3열: 네비 — `Resume` 링크 하나 (모바일에서는 로고 아래로 이동)
- 하단: 소셜 링크 세로 나열 — Github(https://github.com/dlcks0601), Email
- 거대 히어로 타이포(`text-[8rem] @leechan`)는 제거

## Resume (`/resume`)

zerolog /resume과 동일한 정보 구조. 기존 `src/pages/me/model/profileData.ts` 데이터를
재구성해 사용한다.

- 상단: 홈과 동일한 로고/네비 헤더
- 프로필 헤더: `ID / Position / Contact` 라벨-값 구조 (이찬, Frontend Developer, 이메일)
- 회사 섹션 (예: fanC): 회사명, 포지션, 재직 기간
  - 프로젝트 서브섹션: 프로젝트명(링크 있으면 underline), 기간, 성과 bullet 리스트
- 섹션 간 구분은 여백 또는 얇은 horizontal rule
- 스택 태그, hover gif(`Hovered`), 이미지 등 장식 요소는 제거. 텍스트 중심
- `Reveal` 등 가벼운 등장 인터랙션은 유지 가능 (과하지 않게)

## 폰트

- **Overused Grotesk** (variable, 300–900) 추가 — zerolog와 동일. `--font-sans`로 등록,
  영문 본문/제목에 사용. 한글은 시스템 sans 폴백 (zerolog도 동일 방식)
- **JetBrains Mono** 유지 — `--font-mono`. 날짜, 라벨 등 보조 용도
- 폰트 파일은 `public/fonts/`에 woff2로 추가 (오픈소스, OFL 라이선스)

## 컬러

- 배경: 현행 `#131313` 유지
- 텍스트: 기본 white, 보조 텍스트 gray 계열 (예: `text-neutral-400`)
- 링크: 컬러 악센트 없이 underline만. hover 시 밝기 변화 정도
- 그 외 컬러 사용 금지 (모노크롬)

## 인터랙션

- 유지: 홈 소개 문구의 `Writer` 타자기 효과, 링크 hover, (선택) `Reveal` 등장 효과
- 제거: hover gif 프리뷰, 과한 Framer Motion 연출

## 검증

- `pnpm build` 통과, `pnpm lint` 통과
- `/feeds`, `/projects`, `/me` 접근 시 404
- 로컬 `pnpm dev`로 유저가 직접 확인 (v2 브랜치)
