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
  position: 'Frontend Developer',
  email: 'comfyofmymind@gmail.com',
};

export const resumeCareers: ResumeEntry[] = [
  {
    title: 'Lukuku',
    link: 'https://lukuku.co',
    subtitle: 'Frontend Developer · Design Lead',
    period: '2025.12 - present',
    projects: [
      {
        name: 'Design Bridge',
        period: '2026.07 - present',
        achievements: [
          'Figma ↔ Liquid 양방향 변환 · 자동 검증 플러그인 개발',
          '단계별 검증 하네스로 디자인 불일치 해소',
          '페이지당 수정 라운드 78% 이상 감소',
          '테마를 오토레이아웃 Figma로 역변환, 반응형 불일치 98% 감소',
        ],
      },
      {
        name: '글로벌 리테일 프로젝트',
        period: '2026.02 - 2026.07',
        achievements: [
          '할인 안분 정산 오차를 총액 확정·차액 재배분으로 해결, POS·영수증·ERP 정산 일치',
          '반품·교환 통합 주문과 만료 프로모션 복원 교환 모드 설계',
          '6종 할인 규칙을 순수 함수로 분리하고 단위 테스트로 검증',
          'Shopify GraphQL 쿼리 분리·병렬화로 조회 비용 1117 → 75 절감',
          '공통 컴포넌트·팝업 체계로 멀티 브랜드 POS 아키텍처 구성',
          '구형 프린터 번체 깨짐을 줄 단위 이미지 렌더링으로 대응',
        ],
      },
      {
        name: '명품 커머스 프로젝트',
        period: '2025.12 - 2026.03',
        achievements: [
          '결제·배송 15개 상태를 단일 타임라인으로 매핑·시각화',
          '커스텀 백엔드 연동으로 상품 단위 배송지 변경·취소·반품 구현',
          '웹뷰 NICE 본인인증 딥링크·결과 폴링으로 인증 흐름 복구',
          'CSS max() 기반 iOS·Android 안전 영역 통일로 플랫폼 분기 제거',
          'GSAP·CSS transform 분리로 브랜드 로고 마퀴 성능 개선',
        ],
      },
    ],
  },
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
          'Next.js 마이그레이션 및 FSD 아키텍처 설계',
          'next/image·preload 최적화로 FCP 87%·LCP 69% 단축',
          'SSR·CSR 하이브리드 전략으로 클라이언트 번들 10% 감소',
          'GitHub Actions·EC2·PM2 무중단 배포 파이프라인 구축',
        ],
      },
      {
        name: 'WHIP',
        period: '2025.07 - 2025.09',
        achievements: [
          'Expo·FSD 아키텍처 설계',
          'FlashList·Lazy Loading으로 대규모 리스트 렌더링 최적화',
          'Reanimated 기반 인터랙티브 NFT 카드 구현',
          'Web3Auth 기반 Google OAuth2 인증 구현',
        ],
      },
    ],
  },
];
