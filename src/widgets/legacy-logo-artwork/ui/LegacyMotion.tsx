'use client';

import { useEffect, useRef } from 'react';
import {
  LEGACY_LETTERS,
  LEGACY_WORD_POSITIONS,
  type LegacyLetter,
} from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { PixelGlyph } from '@/shared/ui';
import { centerOf, formatCoord, positionAt, targetOf } from '../lib/geometry';

// 한 바퀴: 단어로 머물기 → 모이기 → 심볼로 머물기 → 흩어지기
const HOLD_WORD = 1400;
const MOVE = 1100;
const HOLD_MARK = 2600;
const CYCLE = HOLD_WORD + MOVE + HOLD_MARK + MOVE;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** 한 바퀴 안의 시각 t(ms)에서 진행도(0 = 단어, 1 = 심볼). */
function progressAt(t: number) {
  if (t < HOLD_WORD) return 0;
  if (t < HOLD_WORD + MOVE) return easeInOutCubic((t - HOLD_WORD) / MOVE);
  if (t < HOLD_WORD + MOVE + HOLD_MARK) return 1;
  return 1 - easeInOutCubic((t - HOLD_WORD - MOVE - HOLD_MARK) / MOVE);
}

interface LegacyMotionProps {
  className?: string;
  /** 동선과 실시간 좌표까지 보여준다. 부모는 relative 여야 좌표 줄이 아래에 붙는다. */
  detailed?: boolean;
}

/**
 * 단어 legacy 가 심볼로 모였다가 다시 흩어지기를 반복한다.
 * 매 프레임 React 상태를 거치지 않고 transform 과 좌표 글자만 직접 바꾼다.
 * 화면 밖에서는 멈추고, 동작 줄이기 설정이면 심볼로 멈춰 있는다.
 */
export function LegacyMotion({
  className,
  detailed = false,
}: LegacyMotionProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const glyphRefs = useRef<Partial<Record<LegacyLetter, SVGGElement | null>>>(
    {}
  );
  const coordRefs = useRef<Partial<Record<LegacyLetter, HTMLElement | null>>>(
    {}
  );

  useEffect(() => {
    const render = (p: number) => {
      for (const letter of LEGACY_LETTERS) {
        const [x, y] = positionAt(letter, p);
        glyphRefs.current[letter]?.setAttribute(
          'transform',
          `translate(${x} ${y})`
        );
        const coord = coordRefs.current[letter];
        if (coord) coord.textContent = `${formatCoord(x)}, ${formatCoord(y)}`;
      }
    };

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(1);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      render(progressAt((now - start) % CYCLE));
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) raf = requestAnimationFrame(tick);
      if (!entry.isIntersecting) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    observer.observe(svgRef.current!);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        viewBox={detailed ? '-1 -6 28 15' : '0 -4 26 11'}
        role='img'
        aria-label='legacy 글자가 모여 심볼이 되는 애니메이션'
        className={cn('block overflow-visible', className)}
      >
        {detailed &&
          LEGACY_LETTERS.map(letter => {
            const [x1, y1] = centerOf(letter, LEGACY_WORD_POSITIONS[letter]);
            const [x2, y2] = centerOf(letter, targetOf(letter));
            return (
              <g key={letter}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke='currentColor'
                  strokeOpacity={0.28}
                  vectorEffect='non-scaling-stroke'
                />
                <circle
                  cx={x1}
                  cy={y1}
                  r={0.14}
                  fill='currentColor'
                  className={cn('text-muted')}
                />
              </g>
            );
          })}
        <g shapeRendering='crispEdges'>
          {LEGACY_LETTERS.map(letter => {
            const [x, y] = LEGACY_WORD_POSITIONS[letter];
            return (
              <PixelGlyph
                key={letter}
                ref={el => {
                  glyphRefs.current[letter] = el;
                }}
                letter={letter}
                x={x}
                y={y}
              />
            );
          })}
        </g>
      </svg>
      {detailed && (
        <dl
          className={cn(
            'absolute bottom-gutter left-gutter',
            'grid grid-cols-3 gap-x-7 md:grid-cols-6',
            'text-muted tabular-nums'
          )}
        >
          {LEGACY_LETTERS.map(letter => (
            <div key={letter} className={cn('flex gap-x-1.5')}>
              <dt className={cn('font-semibold text-ink')}>{letter}</dt>
              <dd
                ref={el => {
                  coordRefs.current[letter] = el;
                }}
              />
            </div>
          ))}
        </dl>
      )}
    </>
  );
}
