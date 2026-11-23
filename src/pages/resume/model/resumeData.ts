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
  position: 'Design Engineer',
  email: 'comfyofmymind@gmail.com',
};

export const resumeCareers: ResumeEntry[] = [
  {
    title: 'Lukuku',
    link: 'https://lukuku.co',
    subtitle: 'Product Engineer · Design Lead',
    period: '2025.12 - present',
    projects: [
      {
        name: '아티스트 뷰티 브랜드 스토어',
        period: '2026.08 - present',
        achievements: [
          '웹사이트 브랜딩부터 기획 · 디자인 · 프론트엔드까지 주도',
          '브랜드 가이드를 웹의 톤앤매너와 디자인 시스템으로 정립',
          '접속 대기 화면을 11개 상황 · 45개 항목으로 자동 검증',
        ],
      },
      {
        name: '패션 브랜드 런칭 스토어',
        period: '2026.10 - present',
        achievements: [
          '주요 화면을 Figma로 직접 디자인하고 42개 화면 구현',
          '토큰 152개 · 부품 48개의 디자인 시스템 정립',
          'Design Bridge로 시안 42개를 하루 만에 테마 코드로 이식',
        ],
      },
      {
        name: '매장 POS',
        period: '2026.02 - 2026.07',
        achievements: [
          '홍콩 · 마카오 · 대만 매장 POS의 결제 · 할인 · 교환 화면 개발 리드',
          '현지 매장 3주 근무로 직원의 결제 흐름에 맞춰 화면 설계',
          '매장 쿠폰 자동 적용을 API부터 화면까지 구현',
          'Shopify GraphQL 쿼리 비용 1,117 → 약 75',
        ],
      },
      {
        name: 'Design Bridge',
        period: '2026.07 - 2026.09',
        achievements: [
          '디자인을 테마 코드로 옮기는 Claude Code · Codex 플러그인 기획 · 개발',
          '시안과 테마 화면을 자동 대조해 첫 대조의 차이 51곳 해소',
          '화면 하나의 시안 교정 9회 이상 → 2회',
          '스킬 9개를 제한된 실행 환경으로 설계한 하네스 · 루프 엔지니어링',
        ],
      },
      {
        name: '업무 OS 디자인 시스템',
        period: '2026.10',
        achievements: [
          'AI가 같은 기준으로 컴포넌트를 생성하는 디자인 시스템 설계 · 구현',
          '기존 화면 전체를 공통 컴포넌트로 전환',
          '색과 글자 크기의 직접 지정을 테스트로 차단',
        ],
      },
      {
        name: '사내 AI 에이전트',
        period: '2026.09 - 2026.10',
        achievements: [
          '디자인팀 AI 에이전트를 만들어 사내 Slack에 연결',
          '계약서 · 견적서 등 문서 7종을 회사 양식의 PDF로 생성',
          '필수 정보가 비면 멈추고, 5단계 검증을 통과한 문서만 출력',
        ],
      },
      {
        name: '명품 커머스 스토어',
        period: '2025.12 - 2026.03',
        achievements: [
          '결제 · 배송 15개 상태를 주문 타임라인 하나로 통합',
          '검색 노출 영역은 Liquid, 폼이 복잡한 영역은 React 앱으로 분리',
        ],
      },
    ],
  },
  {
    title: 'fanC',
    subtitle: 'Frontend Developer',
    period: '2025.07 - 2025.11',
    projects: [
      {
        name: 'KRWIN',
        link: 'https://krwin.io',
        period: '2025.09',
        achievements: [
          'React 홈페이지를 Next.js로 이전해 검색 인덱싱 확보',
          'FCP 87% · LCP 69% 단축, 번들 크기 10% 감소',
          'Jenkins 수동 배포를 GitHub Actions 무중단 배포로 전환',
        ],
      },
      {
        name: 'WHIP',
        period: '2025.07 - 2025.09',
        achievements: [
          'OpenAPI Generator로 API 명세를 팀의 공통 기준으로 정립',
          '저사양 기기에서도 60FPS로 도는 NFT 카드 인터랙션',
          'API 미리 불러오기와 FlashList로 진입 · 스크롤 개선',
        ],
      },
    ],
  },
  {
    title: 'Project',
    period: '',
    projects: [
      {
        name: 'our calendar',
        link: 'https://our-calendar-three-blush.vercel.app',
        period: '2026.07 - present',
        achievements: [
          '모임 시간과 그 이유를 함께 제안하는 캘린더를 기획 · 디자인 · 개발',
          '추천마다 참석자와 근거를 표시하고, 받는 사람의 화면을 미리 보기',
          '검정과 흰색을 기본으로, 색은 정보를 구분할 때만 쓰는 디자인 시스템',
        ],
      },
    ],
  },
];
