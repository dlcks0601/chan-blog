import type { SVGProps } from 'react';
import { LEGACY_GLYPH_CELLS, type LegacyLetter } from '@/shared/config';

interface PixelGlyphProps extends SVGProps<SVGGElement> {
  letter: LegacyLetter;
  x?: number;
  y?: number;
}

/** 픽셀 글자 하나를 1×1 칸들로 그린다. 부모 svg 의 좌표계(칸 단위)를 따른다. */
export function PixelGlyph({
  letter,
  x = 0,
  y = 0,
  ...props
}: PixelGlyphProps) {
  return (
    <g transform={`translate(${x} ${y})`} fill='currentColor' {...props}>
      {LEGACY_GLYPH_CELLS[letter].map(([cx, cy]) => (
        <rect key={`${cx},${cy}`} x={cx} y={cy} width={1} height={1} />
      ))}
    </g>
  );
}
