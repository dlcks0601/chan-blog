import type { CSSProperties } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * c·h·a·n 을 팔 끝 실루엣으로 표현한 십자 마크.
 *
 * 100x100 좌표계. 네 팔은 허리(대각 반지름 12)에서 거의 수직으로 뻗다가
 * 끝(중심에서 36)에서 반폭 19로 급히 벌어지는 오목한 옆선을 공유하고,
 * 끝 처리만 팔마다 다르다. 위에서 시계방향으로 c(초승달) · h(도끼날) ·
 * a(펼친 날개) · n(갈래) 순서다.
 */
const ARM_SIDE_OUT = 'C 43.485 39.2 41.515 27.68 31 14';
const ARM_SIDE_IN = 'C 58.485 27.68 56.485 39.2 58.485 41.515';

const TERMINALS = [
  { letter: 'c', d: 'L 28 1 Q 50 29 72 1 L 69 14' },
  { letter: 'h', d: 'L 27 5 Q 50 1 73 5 L 69 14' },
  { letter: 'a', d: 'L 17 5 Q 50 19 83 5 L 69 14' },
  { letter: 'n', d: 'L 30 5 L 50 18 L 70 5 L 69 14' },
];

interface LogoMarkProps {
  className?: string;
  style?: CSSProperties;
  /** 마크를 상시 회전시킬지 여부. */
  spin?: boolean;
}

export function LogoMark({ className, style, spin = false }: LogoMarkProps) {
  return (
    <svg
      viewBox='0 0 100 100'
      fill='none'
      aria-hidden
      style={style}
      className={cn('h-6 w-6', spin && 'animate-logo-spin', className)}
    >
      <g fill='currentColor'>
        <circle cx='50' cy='50' r='10' />
        {TERMINALS.map((terminal, index) => (
          <path
            key={terminal.letter}
            transform={`rotate(${index * 90} 50 50)`}
            d={`M 41.515 41.515 ${ARM_SIDE_OUT} ${terminal.d} ${ARM_SIDE_IN} L 50 50 Z`}
          />
        ))}
      </g>
    </svg>
  );
}
