/**
 * 접이식 기기의 치수와 화면 효과. 길이 단위 1 = 반쪽 폭.
 * 흐림과 어두움은 참고 영상의 프레임마다 판이 들린 각도와 화면 밝기를 재서 맞췄다.
 */

export const W = 1; // 반쪽 폭
export const H = 1.42; // 높이 — 접었을 때 폭:높이 ≈ 0.71
export const T = 0.04; // 반쪽 두께
export const BEZEL = 0.02; // 베젤(금속 테두리 포함)
export const R = 0.136; // 몸체 모서리
export const RS = R - BEZEL; // 화면 모서리 — 몸체와 같은 중심
export const BEV = 0.006; // 프레임 끝 둥글림 — 옆면은 평평한 은색 띠
/** 두 판이 경첩 너머로 겹치는 폭 — 둥근 끝이 서로 덮여 펼쳤을 때 프레임이 홈 없이 이어진다 */
export const OVERLAP = 2 * BEV;
export const RH = 0.03; // 접었을 때 경첩 쪽 모서리
export const LIFT = 0.004; // 화면을 유리 위로 띄우는 높이
export const CAMERA_DISTANCE = 6.5; // 원근 — 반쪽 폭의 약 6.5배

export const SCREEN_W = W - BEZEL; // 안쪽 반쪽 화면 — 경첩 쪽엔 베젤이 없다
export const OUTER_W = W - 2 * BEZEL + OVERLAP; // 바깥 화면 — 경첩 너머로 겹친 폭만큼 넓다
export const SCREEN_H = H - 2 * BEZEL;
/** 화면 안전 여백(좌우) — 둥근 모서리가 가장자리 글자를 깎지 않게 캡처를 이만큼 안쪽으로 줄여 넣는다 */
export const SAFE_INSET = 0.04;

/** 한 번 여닫는 움직임 — 기기와 과정 그림(03 Motion)이 같은 값을 쓴다 */
export const TURN_SECONDS = 1.3;
export const TURN_EASE = 'power3.inOut';

/** 흐림 기준 — 반쪽 폭이 250px 일 때의 px */
export const BLUR_UNIT_PX = 250;
export const BLUR_K = 46;
/** 흐림이 들린 각도에 따라 느는 정도 — 1 보다 크면 살짝 들 땐 덜 흐리고 많이 들수록 빨리 흐려진다 */
export const BLUR_CURVE = 1.6;
/** 흐림이 경첩에서 멀어지며 느는 정도 — 1 보다 크면 경첩 가까이는 또렷하게 남는다 */
export const BLUR_REACH = 1.5;
export const BLUR_SPILL = 0.04; // 경첩 옆 평평한 면까지 번지는 폭 — 접힌 선을 감춘다
/** 미리 흐려 두는 단계(px). √2배 간격이라 단계 사이가 줄무늬로 보이지 않는다 */
export const BLUR_SIGMAS = [
  0,
  ...Array.from({ length: 13 }, (_, i) => 2 ** (i / 2)),
];

/** 들린 판 위, 경첩에서 d(0~1)만큼 떨어진 곳의 흐림(px). 옆으로 2 : 위아래 1 로 번지고 경첩은 또렷하다. */
export const blurAt = (phi: number, d: number) =>
  BLUR_K *
  Math.pow(phi, BLUR_CURVE) *
  Math.pow(Math.max(0, d + BLUR_SPILL), BLUR_REACH);

/** 들린 판 위의 밝기(0~1). lift = sin(들린 각도). 끝도 완전히 꺼지지 않는다. */
export const shadeAt = (lift: number, d: number) =>
  1 - Math.min(0.8, 0.87 * lift) * Math.pow(d, 1.3);

/**
 * 안쪽 화면이 아직 덜 깨어난 정도(0~1). 펼칠수록 0 에 가까워진다.
 * 참고 영상(0.45)보다 옅게 — 흰 사이트 화면이 회색으로 가라앉지 않을 만큼만 깨어난다.
 */
export const sleepAt = (lift: number) => 0.2 * Math.pow(lift, 1.4);

/** 참고 영상에서 잰 들린 판의 밝기 — 들린 각도마다 [경첩에서 떨어진 거리, 밝기] */
export const MEASURED_SHADE = [
  {
    lift: 22,
    points: [
      [0.3, 0.93],
      [0.45, 0.85],
      [0.6, 0.82],
      [0.75, 0.77],
      [0.85, 0.76],
      [0.95, 0.68],
    ],
  },
  {
    lift: 34,
    points: [
      [0.3, 0.91],
      [0.45, 0.81],
      [0.6, 0.72],
      [0.75, 0.62],
      [0.85, 0.56],
      [0.95, 0.49],
    ],
  },
  {
    lift: 46,
    points: [
      [0.3, 0.92],
      [0.45, 0.8],
      [0.6, 0.69],
      [0.75, 0.53],
      [0.85, 0.45],
      [0.95, 0.4],
    ],
  },
  {
    lift: 60,
    points: [
      [0.3, 0.92],
      [0.45, 0.82],
      [0.6, 0.69],
      [0.75, 0.49],
      [0.85, 0.37],
      [0.95, 0.27],
    ],
  },
] as const;
