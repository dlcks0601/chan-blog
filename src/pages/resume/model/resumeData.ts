export interface ResumeProject {
  name: string;
  link?: string;
  period: string;
  achievements: string[];
}

export interface ResumeCareer {
  company: string;
  position?: string;
  period: string;
  description?: string;
  projects: ResumeProject[];
}

export const resumeProfile = {
  name: '이찬',
  position: 'Frontend Developer',
  contact: 'comfyofmymind@gmail.com',
};

export const resumeCareers: ResumeCareer[] = [
  {
    company: 'fanC',
    position: 'Frontend Developer',
    period: '2025.07 - present',
    description:
      'fanC 서비스에서 웹과 앱을 개발하고 있으며, 주로 React Native와 Next.js 환경에서 유지보수 및 신규 기능을 담당하고 있습니다.',
    projects: [
      {
        name: 'KRWIN',
        link: 'https://krwin.io',
        period: '2025.09 - 2025.09',
        achievements: [
          'React 기반 웹 서비스를 Next.js로 마이그레이션, FSD 아키텍처 적용',
          'SEO 성능 향상을 위해 메타데이터 최적화, 자동 사이트맵, robots.txt 설정을 적용',
          'SSR 기반 next/image 최적화와 폰트·비디오 preload 적용으로 FCP 87%, LCP 69% 단축',
          '기존 수동 배포를 AWS EC2·Nginx·PM2 기반 GitHub Actions CI/CD 파이프라인으로 전환, 무중단 배포 및 운영 안정성 확보, Next.js standalone 빌드로 배포 산출물 크기 최적화',
          'useMemo·useCallback·React.memo 적용으로 리렌더링 최소화, Emotion SSR 최적화로 초기 렌더링 시 스타일 안정성 강화',
          '정적 콘텐츠는 SSR, 상호작용 컴포넌트만 CSR로 유지하는 하이브리드 전략 적용, 불필요한 코드 제거로 클라이언트 번들 사이즈 10% 감소',
        ],
      },
      {
        name: 'WHIP',
        period: '2025.07 - 2025.09',
        achievements: [
          'Expo 기반 FSD 아키텍처 설계 및 적용으로 도메인, 기능 단위 구조화, 협업 및 유지보수성 강화',
          'AI 도구 및 Cursor rule 기반 컨벤셔널 커밋 룰 도입으로 팀 코드 일관성 확보',
          'swagger-typescript-api 기반 Code Generation 도입으로 API 명세 자동화 및 DX 향상',
          '앱 부트스트랩 단계에서 API 프리로드 및 Lottie 스플래시 스크린 적용으로 안정적이고 자연스러운 앱 시작 경험 제공',
          'FlashList와 useMemo, Lazy Loading을 적용해 대규모 리스트 렌더링 성능을 최적화하고 UX를 개선',
          'Web3Auth를 활용한 Google OAuth2 인증 구현',
          'React Native Reanimated 기반 인터랙티브 NFT 카드 구현',
          'FCM(Firebase Cloud Messaging) 기반 푸시 알림 기능 구현',
          'Expo EAS를 활용한 빌드',
        ],
      },
    ],
  },
];

export const resumeSideProjects: ResumeCareer[] = [
  {
    company: 'FLIP',
    position:
      '프론트엔드 1명 · 백엔드 1명으로 구성된 2인 프로젝트 / 기획, 디자인, 프론트엔드 개발 전담',
    period: '2025.04 - 2025.06',
    description: 'Spotify 플레이리스트 공유 앱 플랫폼',
    projects: [
      {
        name: 'FLIP',
        period: '2025.04 - 2025.06',
        achievements: [
          '기존에 개인 프로젝트로 진행했던 Spotify 플레이리스트 공유 플랫폼 웹 (Next.js) → 앱 (Expo) 전환',
          'Spotify API Get User’s Top Items(artists) 를 활용하여 아티스트 객체의 장르 데이터를 분류 및 카운팅 하여 유저의 취향 데이터를 고도화',
          'React Native의 Animated.Value와 Modal을 조합해 커스텀 모달 인터랙션을 구현하고, 더 부드러운 사용자 경험 제공',
          'Spotify API 기반의 실시간 음악 데이터(현재 곡/최근 곡)를 조건에 따라 시각화해 몰입감 있는 사용자 경험 구현',
        ],
      },
    ],
  },
  {
    company: 'PLIFY',
    position:
      '기획부터 디자인, 개발, 배포까지 전 과정을 단독으로 수행한 개인 프로젝트',
    period: '2025.02 - 2025.04',
    description: 'Spotify 플레이리스트 공유 웹 플랫폼',
    projects: [
      {
        name: 'PLIFY',
        period: '2025.02 - 2025.04',
        achievements: [
          'AWS(EC2, RDS), Nginx를 이용한 서버 인프라 구축 및 배포',
          'Spotify OAuth2.0 연동을 통한 사용자 인증 및 로그인 구현',
          'Spotify 플레이리스트 링크로부터 데이터를 추출·시각화해 직관적인 정보 제공',
          'Spotify Web Playback SDK를 활용해 웹과 Spotify 앱 간 연동 및 제어 가능한 플레이어 구현',
          'Duration(ms)을 기반으로 재생 위치를 실시간 표시하고 부드러운 애니메이션을 적용해 플레이어 UX 향상',
          'Spotify API를 활용해 유저의 취향 데이터를 시각화하여 개인화된 사용자 경험 강화',
          '다크 모드 및 반응형 UI를 적용해 다양한 환경에서 최적의 사용자 경험 제공',
        ],
      },
    ],
  },
  {
    company: 'PAD',
    position:
      '프론트엔드 4명 · 백엔드 2명으로 구성된 6인 프로젝트 / 기획, 디자인, 프론트엔드 개발 파트 팀장',
    period: '2024.12 - 2025.01',
    description: '프로그래머, 아티스트, 디자이너를 위한 소셜 커뮤니티 플랫폼',
    projects: [
      {
        name: 'PAD',
        period: '2024.12 - 2025.01',
        achievements: [
          'Git Flow 전략 도입 및 Prettier, Husky를 활용한 코드 스타일·커밋 메시지 자동화로 개발 생산성 향상',
          '반응형 디자인을 적용하여 웹과 모바일 환경 모두에서 자연스러운 컨텐츠 표시 및 UX 최적화',
          'fetchNextPage 기반 페이지네이션으로 게시물 10개 단위 로딩, 렌더링 성능 최적화',
          '아토믹 디자인 패턴 기반으로 공통 컴포넌트를 설계하고, twMerge, cn(clsx)를 활용해 재사용성과 UI 개발 효율을 향상',
          'Zustand 전역 상태 관리를 통해 사용자 역할(작성자/지원자)에 따른 UI 동적으로 분기, 사용자 경험 강화',
          '이미지 업로드 시 canvas를 활용한 자동 리사이징 및 WebP 포맷 변환으로 평균 60% 이상 용량 절감',
          'WebSocket 기반 실시간 채팅방 구현, 메시지 전송·수신 및 UI 자동 갱신을 통한 사용자 간 원활한 실시간 소통 제공',
          'SSE 기반으로 커뮤니티 및 채팅 이벤트에 대한 실시간 알림 시스템 구현, 사용자 몰입도 및 상호작용 향상',
        ],
      },
    ],
  },
];
