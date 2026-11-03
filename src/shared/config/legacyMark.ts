// legacy 심볼 데이터 - 로고(LogoMark)와 Collection 의 logo 작품이 같이 쓴다

/** 픽셀 글자 — 4×6 격자(l 만 1×6), '#' 이 채워진 칸. */
export const LEGACY_GLYPHS = {
  l: ['#', '#', '#', '#', '#', '#'],
  e: ['####', '#..#', '####', '#...', '#...', '####'],
  g: ['####', '#..#', '####', '...#', '...#', '####'],
  a: ['####', '...#', '####', '#..#', '#..#', '####'],
  c: ['####', '#...', '#...', '#...', '#...', '####'],
  y: ['#..#', '#..#', '####', '...#', '...#', '####'],
} as const;

export type LegacyLetter = keyof typeof LEGACY_GLYPHS;

export type GridPoint = readonly [number, number];

export const LEGACY_LETTERS: readonly LegacyLetter[] = [
  'l',
  'e',
  'g',
  'a',
  'c',
  'y',
];

const cellsOf = (letter: LegacyLetter): GridPoint[] =>
  LEGACY_GLYPHS[letter].flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === '#' ? [[x, y] as const] : []))
  );

/** 글자마다 채워진 칸 좌표. */
export const LEGACY_GLYPH_CELLS: Record<LegacyLetter, readonly GridPoint[]> = {
  l: cellsOf('l'),
  e: cellsOf('e'),
  g: cellsOf('g'),
  a: cellsOf('a'),
  c: cellsOf('c'),
  y: cellsOf('y'),
};

/** 단어 legacy 로 펼쳤을 때 각 글자의 왼쪽 위 칸. */
export const LEGACY_WORD_POSITIONS: Record<LegacyLetter, GridPoint> = {
  l: [0, 0],
  e: [2, 0],
  g: [7, 0],
  a: [12, 0],
  c: [17, 0],
  y: [22, 0],
};

/**
 * 심볼(10×11) 안에서 각 글자가 놓이는 칸.
 * 아래 두 칸(l+a, c+y)은 합치면 픽셀이 같아서, 단어에서 가까운 쪽으로 보낸다.
 */
export const LEGACY_MARK_POSITIONS: Record<LegacyLetter, GridPoint> = {
  e: [0, 0],
  g: [6, 0],
  l: [0, 5],
  a: [0, 5],
  c: [6, 5],
  y: [6, 5],
};

/** 단어 기준으로 심볼이 생기는 자리 — 가장 먼 이동(약 8.1칸)이 최소가 되는 곳. */
export const LEGACY_MARK_ORIGIN: GridPoint = [8, -4];
