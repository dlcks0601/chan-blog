import {
  ICON_COLORS,
  LEGACY_GLYPH_CELLS,
  LEGACY_LETTERS,
  LEGACY_MARK_POSITIONS,
} from '@/shared/config';

interface MarkIconImageProps {
  /** 정사각 아이콘 한 변(px). */
  size: number;
  /** 심볼 한 칸(px). 정수여야 칸이 번지지 않는다. */
  cell: number;
}

/**
 * 파비콘 · 홈 화면 아이콘용 심볼 그림 — next/og ImageResponse(Satori)로 PNG 가 된다.
 * 글자 데이터에서 바로 그리므로 심볼을 고치면 아이콘도 같이 바뀐다.
 * 세로 위치는 칸 단위로 내려서, 브라우저가 절반 크기로 줄여도 칸이 정수 픽셀에 떨어진다.
 */
export function MarkIconImage({ size, cell }: MarkIconImageProps) {
  const left = (size - 10 * cell) / 2;
  const top = Math.floor((size - 11 * cell) / (2 * cell)) * cell;
  const cells = new Set(
    LEGACY_LETTERS.flatMap(letter => {
      const [mx, my] = LEGACY_MARK_POSITIONS[letter];
      return LEGACY_GLYPH_CELLS[letter].map(([x, y]) => `${mx + x},${my + y}`);
    })
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        position: 'relative',
        background: ICON_COLORS.canvas,
      }}
    >
      {[...cells].map(key => {
        const [x, y] = key.split(',').map(Number);
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: left + x * cell,
              top: top + y * cell,
              width: cell,
              height: cell,
              background: ICON_COLORS.ink,
            }}
          />
        );
      })}
    </div>
  );
}
