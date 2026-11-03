import {
  LEGACY_GLYPHS,
  LEGACY_MARK_ORIGIN,
  LEGACY_MARK_POSITIONS,
  LEGACY_WORD_POSITIONS,
  type GridPoint,
  type LegacyLetter,
} from '@/shared/config';

/** 단어 좌표계에서 글자가 심볼로 모였을 때의 왼쪽 위 칸. */
export function targetOf(letter: LegacyLetter): GridPoint {
  const [ox, oy] = LEGACY_MARK_ORIGIN;
  const [x, y] = LEGACY_MARK_POSITIONS[letter];
  return [ox + x, oy + y];
}

/** 진행도 p(0 = 단어, 1 = 심볼)에서 글자의 왼쪽 위 칸. 곧은 선 위를 움직인다. */
export function positionAt(letter: LegacyLetter, p: number): GridPoint {
  const [wx, wy] = LEGACY_WORD_POSITIONS[letter];
  const [tx, ty] = targetOf(letter);
  return [wx + (tx - wx) * p, wy + (ty - wy) * p];
}

/** 동선을 그릴 때 쓰는 글자의 가운데 점. */
export function centerOf(letter: LegacyLetter, [x, y]: GridPoint): GridPoint {
  return [x + LEGACY_GLYPHS[letter][0].length / 2, y + 3];
}

export function glyphWidthOf(letter: LegacyLetter) {
  return LEGACY_GLYPHS[letter][0].length;
}

export function distanceOf(letter: LegacyLetter) {
  const [wx, wy] = LEGACY_WORD_POSITIONS[letter];
  const [tx, ty] = targetOf(letter);
  return Math.hypot(tx - wx, ty - wy);
}

/** 소수 첫째 자리까지, 음수는 진짜 빼기 기호(−)로. */
export function formatCoord(n: number) {
  return (Math.round(n * 10) / 10).toFixed(1).replace('-', '−');
}
