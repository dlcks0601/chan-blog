export interface ResumeProject {
  name: string;
  link?: string;
  period: string;
  achievements: string[];
}

/** 회사 경력 또는 개인/팀 프로젝트 한 덩어리. */
export interface ResumeEntry {
  title: string;
  link?: string;
  subtitle?: string;
  period: string;
  projects: ResumeProject[];
}

export const resumeProfile = {
  name: '이찬',
  birthDate: '1999.06.01',
  position: 'Frontend Developer',
  email: 'comfyofmymind@gmail.com',
};

export const resumeCareers: ResumeEntry[] = [
  {
    title: 'fanC',
    subtitle: 'Frontend Developer',
    period: '2025.07 - present',
    projects: [
      {
        name: 'KRWIN',
        link: 'https://krwin.io',
        period: '2025.09 - 2025.09',
        achievements: [
          'React 기반 웹 서비스를 Next.js로 마이그레이션, FSD 아키텍처 적용',
          'SEO 성능 향상을 위해 메타데이터 최적화, 자동 사이트맵, robots.txt 설정을 적용',
          'SSR 기반 next/image 최적화와 폰트·비디오 preload 적용으로 FCP 87%, LCP 69% 단축',
          '수동 배포를 AWS EC2·Nginx·PM2 기반 GitHub Actions CI/CD 파이프라인으로 전환해 무중단 배포 확보',
          'useMemo·useCallback·React.memo 적용으로 리렌더링 최소화, Emotion SSR 최적화로 스타일 안정성 강화',
          '정적 콘텐츠는 SSR, 상호작용 컴포넌트만 CSR로 유지하는 하이브리드 전략으로 번들 사이즈 10% 감소',
        ],
      },
      {
        name: 'WHIP',
        period: '2025.07 - 2025.09',
        achievements: [
          'Expo 기반 FSD 아키텍처 설계 및 적용으로 도메인, 기능 단위 구조화',
          'AI 도구 및 Cursor rule 기반 컨벤셔널 커밋 룰 도입으로 팀 코드 일관성 확보',
          'swagger-typescript-api 기반 Code Generation 도입으로 API 명세 자동화 및 DX 향상',
          '앱 부트스트랩 단계에서 API 프리로드 및 Lottie 스플래시 스크린 적용',
          'FlashList와 useMemo, Lazy Loading으로 대규모 리스트 렌더링 성능 최적화',
          'Web3Auth를 활용한 Google OAuth2 인증 구현',
          'React Native Reanimated 기반 인터랙티브 NFT 카드 구현',
          'FCM 기반 푸시 알림 기능 구현 및 Expo EAS 빌드',
        ],
      },
    ],
  },
];

export const resumeSideProjects: ResumeEntry[] = [
  {
    title: 'FLIP',
    subtitle: '2인 프로젝트 · 기획, 디자인, 프론트엔드 전담',
    period: '2025.04 - 2025.06',
    projects: [
      {
        name: 'Spotify 플레이리스트 공유 앱',
        period: '2025.04 - 2025.06',
        achievements: [
          '개인 프로젝트로 진행했던 웹(Next.js) 서비스를 앱(Expo)으로 전환',
          "Spotify API Get User's Top Items로 아티스트 장르 데이터를 분류·카운팅해 취향 데이터 고도화",
          'React Native Animated.Value와 Modal을 조합한 커스텀 모달 인터랙션 구현',
          '실시간 음악 데이터(현재 곡/최근 곡)를 조건에 따라 시각화',
        ],
      },
    ],
  },
  {
    title: 'PLIFY',
    subtitle: '개인 프로젝트 · 기획부터 배포까지 단독 수행',
    period: '2025.02 - 2025.04',
    projects: [
      {
        name: 'Spotify 플레이리스트 공유 웹',
        period: '2025.02 - 2025.04',
        achievements: [
          'AWS(EC2, RDS), Nginx를 이용한 서버 인프라 구축 및 배포',
          'Spotify OAuth2.0 연동을 통한 사용자 인증 및 로그인 구현',
          '플레이리스트 링크로부터 데이터를 추출·시각화해 직관적인 정보 제공',
          'Spotify Web Playback SDK로 웹과 앱 간 연동 및 제어 가능한 플레이어 구현',
          'Duration(ms) 기반 재생 위치 실시간 표시 및 애니메이션으로 플레이어 UX 향상',
          '다크 모드 및 반응형 UI 적용',
        ],
      },
    ],
  },
  {
    title: 'PAD',
    subtitle: '6인 프로젝트 · 프론트엔드 파트 팀장',
    period: '2024.12 - 2025.01',
    projects: [
      {
        name: '개발자·아티스트·디자이너 커뮤니티',
        period: '2024.12 - 2025.01',
        achievements: [
          'Git Flow 전략 도입 및 Prettier, Husky 기반 코드 스타일·커밋 메시지 자동화',
          '반응형 디자인을 적용해 웹과 모바일 환경 모두에서 컨텐츠 표시 최적화',
          'fetchNextPage 기반 페이지네이션으로 게시물 10개 단위 로딩',
          '아토믹 디자인 패턴 기반 공통 컴포넌트 설계, twMerge·cn(clsx)으로 재사용성 향상',
          'Zustand 전역 상태로 사용자 역할(작성자/지원자)에 따른 UI 분기',
          '이미지 업로드 시 canvas 리사이징 및 WebP 변환으로 평균 60% 이상 용량 절감',
          'WebSocket 기반 실시간 채팅방 구현',
          'SSE 기반 커뮤니티·채팅 실시간 알림 시스템 구현',
        ],
      },
    ],
  },
];
