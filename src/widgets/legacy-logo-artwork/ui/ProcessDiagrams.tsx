import {
  LEGACY_GLYPHS,
  LEGACY_LETTERS,
  LEGACY_MARK_POSITIONS,
  LEGACY_WORD_POSITIONS,
} from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { PixelGlyph } from '@/shared/ui';
import {
  centerOf,
  distanceOf,
  formatCoord,
  glyphWidthOf,
  targetOf,
} from '../lib/geometry';

// 모든 그림은 칸 단위 좌표계. 선은 확대돼도 1px 로 남게 한다.
const HAIRLINE = {
  stroke: 'currentColor',
  vectorEffect: 'non-scaling-stroke',
  fill: 'none',
} as const;

interface DiagramProps {
  className?: string;
}

function Label({
  x,
  y,
  size,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  size: number;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      fill='currentColor'
      className={cn('text-muted')}
    >
      {children}
    </text>
  );
}

/** 01 — 4×6 점 격자 위의 글자 여섯 개. */
export function LettersDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox='-1 -1 28 9' aria-hidden className={className}>
      {LEGACY_LETTERS.map(letter => {
        const [wx] = LEGACY_WORD_POSITIONS[letter];
        const width = glyphWidthOf(letter);
        return (
          <g key={letter}>
            {LEGACY_GLYPHS[letter].flatMap((row, y) =>
              [...row].map((_, x) => (
                <circle
                  key={`${x},${y}`}
                  cx={wx + x + 0.5}
                  cy={y + 0.5}
                  r={0.06}
                  fill='currentColor'
                  className={cn('text-muted')}
                />
              ))
            )}
            <PixelGlyph
              letter={letter}
              x={wx}
              y={0}
              shapeRendering='crispEdges'
            />
            <Label x={wx + width / 2} y={7.6} size={0.9}>
              {letter}
            </Label>
          </g>
        );
      })}
    </svg>
  );
}

/** 02 — 네 칸에 접어 넣기. 위아래 칸은 가운데 한 줄을 나눠 쓴다. */
export function FoldDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox='-6 -1.5 22 14' aria-hidden className={className}>
      <g shapeRendering='crispEdges'>
        {LEGACY_LETTERS.map(letter => {
          const [x, y] = LEGACY_MARK_POSITIONS[letter];
          return <PixelGlyph key={letter} letter={letter} x={x} y={y} />;
        })}
      </g>
      <line
        x1={-1.2}
        y1={5.5}
        x2={11.2}
        y2={5.5}
        {...HAIRLINE}
        strokeOpacity={0.28}
        strokeDasharray='2 3'
      />
      <Label x={-1.2} y={1.2} size={0.75} anchor='end'>
        e
      </Label>
      <Label x={11.2} y={1.2} size={0.75} anchor='start'>
        g
      </Label>
      <Label x={-1.2} y={9} size={0.75} anchor='end'>
        l + a
      </Label>
      <Label x={11.2} y={9} size={0.75} anchor='start'>
        c + y
      </Label>
      <Label x={11.6} y={5.75} size={0.75} anchor='start'>
        shared row
      </Label>
    </svg>
  );
}

/** 03 — 글자마다 곧은 한 줄로 모이는 동선과 출발 좌표 · 이동 거리. */
export function PathsDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox='-1 -6.5 28 15.5' aria-hidden className={className}>
      <g shapeRendering='crispEdges' fillOpacity={0.18}>
        {LEGACY_LETTERS.map(letter => {
          const [x, y] = LEGACY_WORD_POSITIONS[letter];
          return <PixelGlyph key={letter} letter={letter} x={x} y={y} />;
        })}
      </g>
      <g shapeRendering='crispEdges' fillOpacity={0.38}>
        {LEGACY_LETTERS.map(letter => {
          const [x, y] = targetOf(letter);
          return <PixelGlyph key={letter} letter={letter} x={x} y={y} />;
        })}
      </g>
      {LEGACY_LETTERS.map(letter => {
        const [wx, wy] = LEGACY_WORD_POSITIONS[letter];
        const [x1, y1] = centerOf(letter, [wx, wy]);
        const [x2, y2] = centerOf(letter, targetOf(letter));
        const toRight = x2 > x1;
        return (
          <g key={letter}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              {...HAIRLINE}
              strokeOpacity={0.85}
            />
            <circle
              cx={x1}
              cy={y1}
              r={0.2}
              strokeWidth={0.07}
              stroke='currentColor'
              className={cn('fill-surface')}
            />
            <circle cx={x2} cy={y2} r={0.2} fill='currentColor' />
            <Label x={x1} y={7.4} size={0.72}>
              {`${letter} ${wx},${wy}`}
            </Label>
            <Label
              x={(x1 + x2) / 2 + (toRight ? 0.3 : -0.3)}
              y={(y1 + y2) / 2 - 0.25}
              size={0.72}
              anchor={toRight ? 'start' : 'end'}
            >
              {formatCoord(distanceOf(letter))}
            </Label>
          </g>
        );
      })}
    </svg>
  );
}
