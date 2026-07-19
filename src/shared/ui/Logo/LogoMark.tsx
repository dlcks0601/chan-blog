import type { CSSProperties } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * 네 갈래 끝이 원인 십자 마크. 각 팁에 c·h·a·n 을 위에서 시계방향으로 파낸다.
 *
 * 48x48 좌표계에서 팁 원(중심 거리 16.5 / 반지름 7)과 중앙 원(반지름 5)을
 * 대각선의 오목 원(중심 거리 9.814 / 반지름 4.814)으로 이어 붙인다.
 * 오목 원을 팁 원과 중앙 원 양쪽에 외접시켰기 때문에 모든 이음매가 접선으로
 * 만나 외곽선에 각이 생기지 않는다. 팔의 폭(8.224)은 오목 원과 팁 원의
 * 접점에서 구한 값으로, 직선부가 원 밖으로 삐져나오지 않는 최대치다.
 */
const TIPS = [
  { letter: 'c', x: 24, y: 7.5 },
  { letter: 'h', x: 40.5, y: 24 },
  { letter: 'a', x: 24, y: 40.5 },
  { letter: 'n', x: 7.5, y: 24 },
];

const NOTCHES = [
  { x: 30.939, y: 17.061 },
  { x: 30.939, y: 30.939 },
  { x: 17.061, y: 30.939 },
  { x: 17.061, y: 17.061 },
];

interface LogoMarkProps {
  className?: string;
  style?: CSSProperties;
  /** 마크와 글자를 상시 회전시킬지 여부. */
  spin?: boolean;
}

export function LogoMark({ className, style, spin = false }: LogoMarkProps) {
  return (
    <svg
      viewBox='0 0 48 48'
      fill='none'
      aria-hidden
      style={style}
      className={cn('h-6 w-6', spin && 'animate-logo-spin', className)}
    >
      <mask
        id='logo-mark'
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='48'
        height='48'
      >
        <rect width='48' height='48' fill='black' />
        <rect x='7.5' y='19.888' width='33' height='8.224' fill='white' />
        <rect x='19.888' y='7.5' width='8.224' height='33' fill='white' />
        {TIPS.map(tip => (
          <circle key={tip.letter} cx={tip.x} cy={tip.y} r='7' fill='white' />
        ))}
        <circle cx='24' cy='24' r='5' fill='white' />
        {NOTCHES.map(notch => (
          <circle
            key={`${notch.x}-${notch.y}`}
            cx={notch.x}
            cy={notch.y}
            r='4.814'
            fill='black'
          />
        ))}
        {TIPS.map(tip => (
          <g
            key={tip.letter}
            className={cn(spin && 'animate-logo-counterspin')}
            style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
          >
            <text
              x={tip.x}
              y={tip.y}
              fill='black'
              fontSize='11'
              fontWeight='700'
              textAnchor='middle'
              dominantBaseline='central'
            >
              {tip.letter}
            </text>
          </g>
        ))}
      </mask>
      <rect width='48' height='48' fill='currentColor' mask='url(#logo-mark)' />
    </svg>
  );
}
