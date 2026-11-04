import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  NoColorSpace,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  type Texture,
  Vector2,
  type WebGLRenderer,
  WebGLRenderTarget,
} from 'three';

const canvasOf = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

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

// 흐림은 GPU 에서 — 캔버스의 filter: blur() 는 Safari 가 지원하지 않는다.
// 가로 · 세로를 나눠 가우시안으로 흐리고, 큰 흐림은 절반씩 줄인 사본에서 흐린다.
const MAX_RADIUS = 24;
const blurVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }`;
const blurFragment = /* glsl */ `
  uniform sampler2D uSource;
  uniform vec2 uStep;
  uniform float uSigma;
  varying vec2 vUv;
  void main() {
    if (uSigma < 0.01) {
      gl_FragColor = texture2D(uSource, vUv);
      return;
    }
    float radius = min(ceil(uSigma * 3.0), ${MAX_RADIUS}.0);
    vec4 sum = vec4(0.0);
    float total = 0.0;
    for (int i = -${MAX_RADIUS}; i <= ${MAX_RADIUS}; i++) {
      float x = float(i);
      if (abs(x) > radius) continue;
      float w = exp(-0.5 * x * x / (uSigma * uSigma));
      sum += texture2D(uSource, vUv + uStep * x) * w;
      total += w;
    }
    gl_FragColor = sum / total;
  }`;

/** 한 장의 화면 그림을 흐림 단계별로 만든 텍스처들. 다 쓰면 dispose 한다. */
export interface BlurredLevels {
  textures: Texture[];
  dispose(): void;
}

export function createBlurrer(renderer: WebGLRenderer) {
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new ShaderMaterial({
    uniforms: {
      uSource: { value: null },
      uStep: { value: new Vector2() },
      uSigma: { value: 0 },
    },
    vertexShader: blurVertex,
    fragmentShader: blurFragment,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new Mesh(new PlaneGeometry(2, 2), material);
  scene.add(quad);

  const target = (width: number, height: number) =>
    new WebGLRenderTarget(width, height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      generateMipmaps: false,
    });
  const pass = (
    source: Texture,
    width: number,
    height: number,
    out: WebGLRenderTarget,
    [dx, dy]: [number, number],
    sigma: number
  ) => {
    material.uniforms.uSource.value = source;
    (material.uniforms.uStep.value as Vector2).set(dx / width, dy / height);
    material.uniforms.uSigma.value = sigma;
    renderer.setRenderTarget(out);
    renderer.render(scene, camera);
  };

  return {
    /**
     * 화면 그림 한 장을 흐림 단계별 텍스처로 만든다. 옆으로 2 : 위아래 1 로 번진다.
     * 가장자리는 끝 픽셀을 늘여 흐려서 검게 번지지 않는다.
     * 값은 화면에 보이는 색 그대로 흐린다(사이트 화면을 흐릴 때의 느낌과 같다).
     *
     * @param sigmas 가로 흐림(텍스처 px) — 0 은 원본
     */
    levels(canvas: HTMLCanvasElement, sigmas: number[]): BlurredLevels {
      const base = new CanvasTexture(canvas);
      base.colorSpace = NoColorSpace;
      base.minFilter = LinearFilter;
      base.generateMipmaps = false;
      base.anisotropy = 8;

      // 절반씩 줄인 사본 — 2 × 2 픽셀의 평균이라 줄여도 글자가 깜빡이지 않는다
      const chain: { texture: Texture; width: number; height: number }[] = [
        { texture: base, width: canvas.width, height: canvas.height },
      ];
      const scratch: WebGLRenderTarget[] = [];
      while (chain.length < 8 && chain[chain.length - 1].width > 16) {
        const prev = chain[chain.length - 1];
        const width = Math.max(1, Math.round(prev.width / 2));
        const height = Math.max(1, Math.round(prev.height / 2));
        const half = target(width, height);
        pass(prev.texture, prev.width, prev.height, half, [0, 0], 0);
        scratch.push(half);
        chain.push({ texture: half.texture, width, height });
      }

      const kept: WebGLRenderTarget[] = [];
      const textures = sigmas.map(sigma => {
        if (!sigma) return base as Texture;
        // 흐림이 6px 안쪽이 되는 사본에서 흐린다
        const m = Math.min(
          chain.length - 1,
          Math.max(0, Math.ceil(Math.log2(sigma / 6)))
        );
        const { texture, width, height } = chain[m];
        const scale = canvas.width / width;
        const across = target(width, height);
        const level = target(width, height);
        pass(texture, width, height, across, [1, 0], sigma / scale);
        pass(across.texture, width, height, level, [0, 1], sigma / 2 / scale);
        across.dispose();
        kept.push(level);
        return level.texture;
      });
      renderer.setRenderTarget(null);
      scratch.forEach(t => t.dispose());

      return {
        textures,
        dispose() {
          base.dispose();
          kept.forEach(t => t.dispose());
        },
      };
    },

    dispose() {
      quad.geometry.dispose();
      material.dispose();
    },
  };
}
