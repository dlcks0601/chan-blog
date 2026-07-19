import type { CSSProperties } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * 3회 대칭 장식 문양.
 *
 * 100x100 좌표계, 중심 (50,50). 팔메트 부채꼴 3개와 오목한 칼날 3개가 60도씩
 * 번갈아 놓인다. 잎은 각도 폭을 고정(반각 5.2도)해 머리 반지름을 역산하므로
 * 어느 잎도 이웃과 겹치지 않고 사이에 여백이 남는다.
 */
const CENTER = 50;
const DEG = Math.PI / 180;

const PETAL_HALF_DEG = 5.2;
const PETAL_TIP = 12;

/** 부채꼴 한 벌: 각도 오프셋과 머리 중심까지의 거리. */
const FAN = [
  { angle: 0, reach: 34 },
  { angle: -12, reach: 32 },
  { angle: 12, reach: 32 },
  { angle: -24, reach: 29 },
  { angle: 24, reach: 29 },
  { angle: -36, reach: 24 },
  { angle: 36, reach: 24 },
];

const FAN_ANGLES = [0, 120, 240];
const BLADE_ANGLES = [60, 180, 300];

/** 바깥은 둥근 머리, 안쪽은 뾰족하게 좁아지는 물방울 잎. */
function petalPath(reach: number) {
  const q = reach * Math.sin(PETAL_HALF_DEG * DEG);
  const headY = CENTER - reach;
  const tipY = CENTER - PETAL_TIP;
  const span = tipY - headY;
  return [
    `M ${CENTER} ${tipY}`,
    `C ${CENTER + q * 0.5} ${tipY - span * 0.5} ${CENTER + q} ${headY + q * 0.7} ${CENTER + q} ${headY}`,
    `A ${q} ${q} 0 0 0 ${CENTER - q} ${headY}`,
    `C ${CENTER - q} ${headY + q * 0.7} ${CENTER - q * 0.5} ${tipY - span * 0.5} ${CENTER} ${tipY}`,
    'Z',
  ].join(' ');
}

/** 바깥 모서리가 안으로 파여 두 뿔이 생기는 칼날. */
const BLADE_PATH = [
  `M ${CENTER} 37`,
  `C ${CENTER + 7.7} 27.55 ${CENTER + 14} 21 ${CENTER + 14} 10`,
  `Q ${CENTER} 26 ${CENTER - 14} 10`,
  `C ${CENTER - 14} 21 ${CENTER - 7.7} 27.55 ${CENTER} 37`,
  'Z',
].join(' ');

interface LogoMarkProps {
  className?: string;
  style?: CSSProperties;
  /** 120도씩 돌고 쉬기를 반복할지 여부. */
  spin?: boolean;
}

export function LogoMark({ className, style, spin = false }: LogoMarkProps) {
  return (
    <svg
      viewBox='0 0 100 100'
      aria-hidden
      style={style}
      className={cn('h-6 w-6', spin && 'animate-logo-spin', className)}
    >
      <g fill='currentColor'>
        {BLADE_ANGLES.map(angle => (
          <path
            key={`blade-${angle}`}
            transform={`rotate(${angle} ${CENTER} ${CENTER})`}
            d={BLADE_PATH}
          />
        ))}
        {FAN_ANGLES.map(base =>
          FAN.map(petal => (
            <path
              key={`petal-${base}-${petal.angle}-${petal.reach}`}
              transform={`rotate(${base + petal.angle} ${CENTER} ${CENTER})`}
              d={petalPath(petal.reach)}
            />
          ))
        )}
        <ellipse cx={CENTER} cy={CENTER} rx='5.5' ry='6.5' />
      </g>
    </svg>
  );
}
