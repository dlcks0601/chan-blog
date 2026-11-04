import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three';
import { BLUR_SIGMAS, BLUR_UNIT_PX } from '../model/device';

const canvasOf = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * 가장자리 픽셀을 바깥으로 늘여 붙인 뒤 흐리고 다시 잘라낸다.
 * 화면 끝까지 고르게 흐려지고, 가장자리가 검게 번지거나 원본이 비치지 않는다.
 */
function blurred(
  src: HTMLCanvasElement,
  width: number,
  height: number,
  radius: number
) {
  const pad = Math.ceil(radius * 3);
  const { width: sw, height: sh } = src;
  const big = canvasOf(width + 2 * pad, height + 2 * pad);
  const g = big.getContext('2d')!;
  g.drawImage(src, pad, pad, width, height);
  g.drawImage(src, 0, 0, 1, sh, 0, pad, pad, height);
  g.drawImage(src, sw - 1, 0, 1, sh, pad + width, pad, pad, height);
  g.drawImage(src, 0, 0, sw, 1, pad, 0, width, pad);
  g.drawImage(src, 0, sh - 1, sw, 1, pad, pad + height, width, pad);
  g.drawImage(src, 0, 0, 1, 1, 0, 0, pad, pad);
  g.drawImage(src, sw - 1, 0, 1, 1, pad + width, 0, pad, pad);
  g.drawImage(src, 0, sh - 1, 1, 1, 0, pad + height, pad, pad);
  g.drawImage(src, sw - 1, sh - 1, 1, 1, pad + width, pad + height, pad, pad);

  const soft = canvasOf(big.width, big.height);
  const sg = soft.getContext('2d')!;
  sg.filter = `blur(${radius}px)`;
  sg.drawImage(big, 0, 0);

  const out = canvasOf(width, height);
  out
    .getContext('2d')!
    .drawImage(soft, pad, pad, width, height, 0, 0, width, height);
  return out;
}

function textureOf(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 8;
  return texture;
}

const nextTask = () => new Promise<void>(resolve => setTimeout(resolve, 0));

/**
 * 사이트 캡처를 화면 크기의 캔버스에 안전 영역을 두고 줄여 넣는다.
 * 둥근 모서리가 가장자리 글자를 깎지 않게, 바깥은 캡처의 바탕색으로 채운다.
 *
 * @param unitsWide 이 화면의 폭(반쪽 폭 단위)
 * @param inset 좌우 안전 여백(반쪽 폭 단위). 위아래는 캡처 비율에 맞춰 정해진다
 */
export function screenCanvas(
  image: HTMLImageElement,
  width: number,
  height: number,
  unitsWide: number,
  inset: number
) {
  const source = canvasOf(width, height);
  const g = source.getContext('2d')!;
  g.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 1);
  const [r, gr, b] = g.getImageData(0, 0, 1, 1).data;
  g.fillStyle = `rgb(${r} ${gr} ${b})`;
  g.fillRect(0, 0, width, height);

  const drawnW = ((unitsWide - 2 * inset) / unitsWide) * width;
  const drawnH = drawnW * (image.naturalHeight / image.naturalWidth);
  g.imageSmoothingQuality = 'high';
  g.drawImage(
    image,
    (width - drawnW) / 2,
    (height - drawnH) / 2,
    drawnW,
    drawnH
  );
  return source;
}

/**
 * 화면 그림 한 장을 흐림 단계별 텍스처로 만든다.
 * 가로를 반으로 줄여 흐린 뒤 화면에서 다시 늘리면 옆으로 2 : 위아래 1 로 번진다.
 * 단계마다 쉬어 가며 만들어 페이지가 멈추지 않는다.
 *
 * @param unitsWide 이 화면의 폭(반쪽 폭 단위) — 흐림 px 을 텍스처 px 로 바꾸는 데 쓴다
 */
export async function blurLevels(source: HTMLCanvasElement, unitsWide: number) {
  const { width, height } = source;
  const texPerPx = width / unitsWide / BLUR_UNIT_PX;
  const half = Math.round(width / 2);
  const textures = [textureOf(source)];
  for (const sigma of BLUR_SIGMAS.slice(1)) {
    await nextTask();
    textures.push(
      textureOf(blurred(source, half, height, (sigma * texPerPx) / 2))
    );
  }
  return textures;
}
