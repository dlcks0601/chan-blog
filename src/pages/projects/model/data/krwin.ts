import type { ProjectDetail } from '../types';

export const krwin: ProjectDetail = {
  slug: 'krwin',
  title: 'KRWIN',
  date: '2025.09 - 2025.10',
  cover: { src: '/assets/projects/KRWIN.png', alt: 'KRWIN 이미지' },
  stack: ['Next.js', 'TypeScript', 'Framer Motion', 'Nginx', 'EC2', 'PM2'],
  introduce: [
    '자사 스테이블 코인 홈페이지는 React 기반 CSR 환경에서 동작하며, 검색엔진 인덱싱이 원활하지 않고 초기 로딩 속도가 느린 구조였습니다. 특히 이미지·폰트·비디오와 같은 대용량 리소스 최적화가 부족해 LCP 지표가 낮아지고, SEO 측면에서도 검색 노출에 제약이 있었습니다. 또한 Jenkins + scp 기반의 수동 배포 방식은 배포 효율성과 안정성을 보장하기 어려워 운영 부담이 컸습니다.',
    '이러한 문제를 개선하기 위해 SEO 성능 강화와 운영 효율성 제고를 목표로 프로젝트를 Next.js 기반으로 마이그레이션했습니다. SSR을 적용해 검색엔진 인덱싱 성능을 높이고, next/image 최적화 및 폰트·비디오 리소스 로딩 우선순위 조정을 통해 지표를 향상시켰습니다. 기존 수동 배포 방식을 EC2 + Nginx + PM2 기반의 GitHub Actions CI/CD 자동 배포 파이프라인으로 전환해 무중단 배포와 안정적인 운영 체계를 마련했습니다.',
  ],
  experience: [
    'React 기반 웹 서비스를 Next.js로 마이그레이션, FSD 아키텍처 적용',
    'SEO 성능 향상을 위해 메타데이터 최적화, 자동 사이트맵, robots.txt 설정을 적용',
    'SSR 기반 next/image 최적화와 폰트·비디오 preload 적용으로 FCP 87%, LCP 69% 단축',
    '기존 수동 배포를 AWS EC2·Nginx·PM2 기반 GitHub Actions CI/CD 파이프라인으로 전환, 무중단 배포 및 운영 안정성 확보, Next.js standalone 빌드로 배포 산출물 크기 최적화',
    'useMemo·useCallback·React.memo 적용으로 리렌더링 최소화, Emotion SSR 최적화로 초기 렌더링 시 스타일 안정성 강화',
    '정적 콘텐츠는 SSR, 상호작용 컴포넌트만 CSR로 유지하는 하이브리드 전략 적용, 불필요한 코드 제거로 클라이언트 번들 사이즈 10% 감소',
  ],
  problemSolve: [
    {
      title: '이미지 최적화 문제 해결',
      problem: [
        'next/image API(/_next/image)에서 400 Bad Request 발생',
        'Standalone 빌드 시 public 폴더가 포함되지 않아 발생',
      ],
      solve: [
        'GitHub Actions 빌드 단계에서 public을 .next/standalone/ 내부로 복사',
        'Nginx에서 /_next/image 경로 프록시 처리 추가',
        'Next.js 설정 (next.config.ts)',
        '/public/* 이미지는 정상 서빙되고, next/image 최적화 API도 정상 작동',
      ],
      code: {
        filename: 'next.config.ts',
        language: 'typescript',
        content: `images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 1080, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [
    { protocol: 'https', hostname: 'krwin.io', pathname: '/**' },
  ],
}`,
      },
    },
    {
      title: '서버 안정성 개선 경험',
      problem: [
        'AWS EC2(t3.micro, 1GB) 환경에서 Next.js 기반 웹 서비스를 운영 중 Lighthouse 성능 테스트 시 OOM (Out of Memory) 문제로 인스턴스가 강제 재부팅되는 현상을 경험',
        'Nginx 에러 로그와 journalctl, pm2 logs를 분석하여 메모리 부족(1GB RAM + Swap 미구성)이 원인임을 확인',
        '프로세스 메모리 사용량, 디스크 사용량을 점검하여 디스크는 충분하나 메모리 여유가 거의 없어 부하 테스트 시 OOM 발생 검증',
      ],
      solve: [
        '디스크 공간을 활용해 스왑 메모리 2GB를 구성하여 메모리 부족 시에도 프로세스가 강제 종료되지 않도록 안정성을 확보',
        '적용 후 부하 테스트를 다시 진행하여 OOM 현상이 재발하지 않고 안정적으로 서비스가 유지됨',
      ],
    },
  ],
};
