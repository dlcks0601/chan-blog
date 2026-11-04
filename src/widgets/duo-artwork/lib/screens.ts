import type { Theme } from '@/shared/config';
import { OUTER_W, SAFE_INSET, SCREEN_H, SCREEN_W } from '../model/device';
import { screenCanvas } from './blurLevels';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

/** 안쪽(PC) · 바깥(모바일) 화면에 띄울 그림 */
export interface ScreenCanvases {
  inner: HTMLCanvasElement;
  outer: HTMLCanvasElement;
}

/**
 * 사이트 캡처(테마별)를 화면 크기의 그림으로 만든다. 흐림 단계는 기기 장면이 GPU 로 만든다.
 * 접으면 모바일, 펼치면 홈과 Resume 를 합친 한 화면. 실제 폰처럼 가장자리에 안전 여백을 둔다.
 *
 * @param innerWidth 펼친 화면(PC) 그림의 폭(px)
 */
export async function loadScreens(
  theme: Theme,
  innerWidth: number
): Promise<ScreenCanvases> {
  const [pc, mobile] = await Promise.all([
    loadImage(`/artworks/duo/pc-${theme}.png`),
    loadImage(`/artworks/duo/mobile-${theme}.png`),
  ]);
  const height = Math.round((innerWidth * SCREEN_H) / (2 * SCREEN_W));
  const outerWidth = Math.round((innerWidth * OUTER_W) / (2 * SCREEN_W));
  return {
    inner: screenCanvas(pc, innerWidth, height, 2 * SCREEN_W, SAFE_INSET),
    outer: screenCanvas(mobile, outerWidth, height, OUTER_W, SAFE_INSET),
  };
}
