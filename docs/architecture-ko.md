# 프로젝트 아키텍처 문서

## 개요

이 프로젝트는 Next.js 15 App Router와 함께 **Feature-Sliced Design (FSD)** 아키텍처를 구현하여, 확장 가능하고 유지보수가 용이한 현대적인 React 애플리케이션 구조를 제공합니다.

## 기술 스택

- **프레임워크**: Next.js 15.5.3 (App Router, Turbopack)
- **런타임**: React 19.1.0
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS 4 (PostCSS)
- **애니메이션**: Framer Motion 12.23.15
- **패키지 매니저**: pnpm
- **코드 품질**: ESLint, Prettier, Husky, Commitlint

## 디렉토리 구조

```
ai-study/
├── app/                          # Next.js App Router (라우팅 전용)
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈 페이지
│   └── favicon.ico              # 앱 파비콘
│
├── pages/                        # Next.js 호환성을 위한 stub
│   └── .gitkeep                 # git에서 디렉토리 유지
│
├── src/                          # FSD 아키텍처 레이어
│   ├── app/                     # App 레이어 - 초기화 및 글로벌 설정
│   │   ├── providers/           # React 프로바이더 (테마, 상태 등)
│   │   └── styles/              # 글로벌 스타일
│   │       └── globals.css      # Tailwind를 포함한 글로벌 CSS
│   │
│   ├── pages/                   # Pages 레이어 - FSD v2.1 "Pages First"
│   │   └── home/                # 홈 페이지 슬라이스
│   │       ├── index.ts         # Public API
│   │       └── ui/              # 페이지별 UI 컴포넌트
│   │           └── HomePage.tsx # 홈 페이지 컴포넌트
│   │
│   ├── widgets/                 # Widget 레이어 - 완전한 UI 블록
│   │   └── .gitkeep
│   │
│   ├── features/                # Feature 레이어 - 비즈니스 기능
│   │   └── .gitkeep
│   │
│   ├── entities/                # Entity 레이어 - 비즈니스 엔티티
│   │   └── .gitkeep
│   │
│   └── shared/                  # Shared 레이어 - 재사용 가능한 코드
│       ├── ui/                  # 공유 UI 컴포넌트
│       │   └── index.ts         # UI 컴포넌트 export
│       ├── lib/                 # 유틸리티 함수
│       │   └── index.ts         # 라이브러리 함수 export
│       ├── api/                 # API 레이어
│       │   └── index.ts         # API 클라이언트 export
│       └── config/              # 설정 파일
│           ├── index.ts         # 설정 export
│           ├── routes.ts        # 라우트 상수
│           ├── api.ts           # API 설정
│           └── env.ts           # 환경 변수
│
├── docs/                         # 문서
├── .husky/                       # Git 훅
└── 설정 파일들...
```

## FSD v2.1 레이어 아키텍처

### 레이어 계층 구조 (상위 → 하위)

1. **App 레이어** (`src/app/`)
   - 애플리케이션 초기화
   - 글로벌 프로바이더 (테마, 라우터, 상태)
   - 글로벌 스타일 및 폰트
   - 앱 레벨 설정

2. **Pages 레이어** (`src/pages/` + Next.js `app/` 라우팅)
   - **v2.1 "Pages First" 접근법**: 더 많은 코드를 pages에 유지
   - 다른 페이지에서 재사용되지 않는 큰 UI 블록, 폼, 데이터 로직
   - 페이지별 컴포넌트 및 로직
   - SEO 및 메타데이터

3. **Widgets 레이어** (`src/widgets/`)
   - **v2.1 강화**: 더 이상 단순한 조합 레이어가 아님
   - 위젯 자체의 store, 비즈니스 로직, API 상호작용 포함
   - 크고 독립적인 UI 블록
   - Header, Footer, Sidebar, Dashboard 컴포넌트

4. **Features 레이어** (`src/features/`)
   - 재사용 가능한 비즈니스 기능
   - 사용자 상호작용 (로그인, 검색, 장바구니)
   - 기능별 로직 및 상태

5. **Entities 레이어** (`src/entities/`)
   - 비즈니스 도메인 모델
   - 데이터 구조 (User, Product, Order)
   - 엔티티별 연산

6. **Shared 레이어** (`src/shared/`)
   - **v2.1 확장**: 애플리케이션 인식 요소 허용
   - 라우트 상수, API 호출, 회사 로고 등 포함 가능
   - UI 킷 컴포넌트 (Button, Input, Modal)
   - 헬퍼 함수 및 설정

## Import 규칙

### 의존성 방향
- 상위 레이어는 하위 레이어에서 import 가능
- 하위 레이어는 상위 레이어에서 import 불가
- 같은 레벨 간의 import는 피해야 함

### Import 예시
```typescript
// ✅ 올바름 - 상위 레이어가 하위 레이어에서 import
// src/features/auth/login.tsx
import { Button } from '@/shared/ui/button'
import { User } from '@/entities/user'

// ✅ 올바름 - alias 사용
import { api } from '@/shared/api'

// ❌ 잘못됨 - 하위 레이어가 상위 레이어에서 import
// src/shared/ui/button.tsx
import { LoginForm } from '@/features/auth' // ❌ 이렇게 하지 마세요
```

## 개발 가이드라인

### 컴포넌트 생성
1. 컴포넌트에 적합한 레이어 식별
2. TypeScript 모범 사례를 따라 컴포넌트 생성
3. 깔끔한 import를 위해 index 파일을 통해 export
4. 적절한 타이핑 및 문서화 추가

### 기능 개발
1. 필요한 경우 shared 유틸리티부터 시작
2. 비즈니스 로직을 위한 entity 모델 생성
3. entities와 shared 코드를 사용하여 features 구현
4. features와 entities로 widgets 구성
5. app 레이어에서 모든 것을 연결

### 파일 명명 규칙
- 디렉토리는 kebab-case 사용: `user-profile/`
- React 컴포넌트는 PascalCase 사용: `UserProfile.tsx`
- 유틸리티는 camelCase 사용: `formatDate.ts`
- 상수는 UPPER_CASE 사용: `API_ENDPOINTS.ts`

### API 구성 가이드라인 (FSD v2.1)

#### 1. Pages First - 페이지별 API
한 페이지에서만 사용되는 API는 해당 페이지 슬라이스에 보관:
```typescript
// src/pages/home/api/getHomeData.ts
// 홈 페이지에서만 사용하는 API
export async function getLatestPosts() {
  return fetch('/api/posts/latest?limit=5') // 홈 전용 최신 5개 글
}

export async function getHomeBanner() {
  return fetch('/api/banner/home') // 홈 페이지 전용 배너
}
```

#### 2. Entities - 도메인별 재사용 API
여러 페이지에서 재사용되는 도메인 관련 API:
```typescript
// src/entities/post/api/postApi.ts
// 상세페이지, 편집페이지, 미리보기 등에서 재사용
export async function getPostById(id: string) {
  return fetch(`/api/posts/${id}`)
}

export async function getAllPosts() {
  return fetch('/api/posts') // 목록페이지, 검색페이지에서 사용
}
```

#### 3. Shared - 공통 API 유틸리티
범용 API 클라이언트와 설정:
```typescript
// src/shared/api/client.ts
export const apiClient = {
  get: (url: string) => fetch(url),
  post: (url: string, data: any) => fetch(url, { method: 'POST', body: JSON.stringify(data) })
}

// src/shared/config/api.ts
export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  USERS: '/api/users'
}
```

#### 판단 기준
- **한 페이지에서만 사용** → `pages/[페이지]/api/`
- **여러 페이지에서 재사용** → `entities/[도메인]/api/`
- **공통 API 유틸리티** → `shared/api/`

## 이 아키텍처의 장점

1. **확장성**: 명확한 관심사 분리로 새로운 기능 추가가 예측 가능
2. **유지보수성**: 단방향 의존성으로 복잡성 감소
3. **재사용성**: 공유 컴포넌트와 유틸리티를 여러 기능에서 사용 가능
4. **팀 협업**: 명확한 경계로 팀이 독립적으로 작업 가능
5. **테스팅**: 각 레이어를 독립적으로 테스트 가능

## FSD CLI 사용법 (v2.1)

### CLI 설치
```bash
npm install -g @feature-sliced/cli
```

### 구조 생성 예시
```bash
# Pages 레이어에 home 슬라이스 생성 (ui 세그먼트 포함)
fsd p home -s ui -r src

# Features 레이어에 auth 기능 생성
fsd f auth -s ui api model -r src

# Shared 레이어에 여러 세그먼트 생성
fsd s ui api lib config -r src

# Widgets 레이어에 header 위젯 생성
fsd w header -s ui api -r src
```

## v2.1 주요 변경사항

1. **"Pages First" 접근법**: 페이지에서 재사용되지 않는 코드는 해당 페이지에 유지
2. **Widget 레이어 강화**: 위젯이 자체 로직과 상태를 포함할 수 있음
3. **Cross-Import 표준화**: `@x` 표기법이 공식 표준이 됨
4. **Shared 레이어 확장**: 애플리케이션별 설정과 상수 허용

## 시작하기

1. 의존성 설치: `pnpm install`
2. 개발 시작: `pnpm dev`
3. FSD CLI로 구조 생성: `fsd [layer] [slice] -s [segments] -r src`
4. `src/pages/`에서 페이지별 기능 개발 (Pages First)
5. `src/shared/ui/`에서 공유 컴포넌트 빌드
6. 커밋 컨벤션 따르기: `pnpm run commit`

## 커밋 컨벤션

이 프로젝트는 Conventional Commits를 사용합니다:

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경 (포맷팅 등)
- `refactor`: 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가/수정
- `build`: 빌드 시스템 변경
- `ci`: CI 설정 변경
- `chore`: 기타 작업

**사용법**: `pnpm run commit` 명령어로 인터랙티브 커밋 생성

## 개발 도구

- **FSD CLI**: `@feature-sliced/cli` - 레이어, 슬라이스, 세그먼트 자동 생성
- **Steiger**: FSD 아키텍처 린터 (개발 중)
- **Husky**: Git 훅을 통한 코드 품질 관리
- **Commitizen**: Conventional Commits 표준 준수