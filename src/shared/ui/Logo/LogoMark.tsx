import { LEGACY_LETTERS, LEGACY_MARK_POSITIONS } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { PixelGlyph } from './PixelGlyph';

interface LogoMarkProps {
  className?: string;
}

/**
 * legacy 심볼 — 픽셀 글자 l·e·g·a·c·y 를 10×11 격자에 겹쳐 놓은 것.
 *
 * 한 칸이 정수 픽셀로 떨어져야 선이 고르게 보이므로 높이는 11의 배수로만 쓴다
 * (기본 22px = 칸당 2px). app/icon.svg 같은 파비콘도 같은 모양이다.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox='0 0 10 11'
      shapeRendering='crispEdges'
      aria-hidden
      className={cn('h-5.5 w-5', className)}
    >
      {LEGACY_LETTERS.map(letter => {
        const [x, y] = LEGACY_MARK_POSITIONS[letter];
        return <PixelGlyph key={letter} letter={letter} x={x} y={y} />;
      })}
    </svg>
  );
}
