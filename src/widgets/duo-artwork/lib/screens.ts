import type { Theme } from '@/shared/config';
import { OUTER_W, SAFE_INSET, SCREEN_H, SCREEN_W } from '../model/device';
import { blurLevels, screenCanvas } from './blurLevels';
import type { ScreenTextures } from './foldScene';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

/**
 * 사이트 첫 화면 캡처(테마별)를 흐림 단계 텍스처로 만든다.
 * 접으면 모바일, 펼치면 PC 화면이 보인다. 실제 폰처럼 가장자리에 안전 여백을 둔다.
 *
 * @param innerWidth 펼친 화면(PC) 텍스처의 폭(px)
 */
export async function loadScreens(
  theme: Theme,
  innerWidth: number
): Promise<ScreenTextures> {
  const [pc, mobile] = await Promise.all([
    loadImage(`/artworks/duo/pc-${theme}.png`),
    loadImage(`/artworks/duo/mobile-${theme}.png`),
  ]);
  const height = Math.round((innerWidth * SCREEN_H) / (2 * SCREEN_W));
  const outerWidth = Math.round((innerWidth * OUTER_W) / (2 * SCREEN_W));
  const inner = await blurLevels(
    screenCanvas(pc, innerWidth, height, 2 * SCREEN_W, SAFE_INSET),
    2 * SCREEN_W
  );
  const outer = await blurLevels(
    screenCanvas(mobile, outerWidth, height, OUTER_W, SAFE_INSET),
    OUTER_W
  );
  return { inner, outer };
}
