import {
  type BufferGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DataTexture,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  Shape,
  type Texture,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  BEV,
  BEZEL,
  BLUR_CURVE,
  BLUR_K,
  BLUR_REACH,
  BLUR_SIGMAS,
  BLUR_SPILL,
  BLUR_UNIT_PX,
  CAMERA_DISTANCE,
  H,
  LIFT,
  OUTER_W,
  OVERLAP,
  R,
  RH,
  RS,
  SCREEN_H,
  SCREEN_W,
  sleepAt,
  T,
  W,
} from '../model/device';
import { createBlurrer } from './blurLevels';
import type { ScreenCanvases } from './screens';

/** 흐림 단계별 텍스처 — 안쪽(PC) 화면과 바깥(모바일) 화면. 다 쓰면 dispose 한다. */
export interface ScreenTextures {
  inner: Texture[];
  outer: Texture[];
  dispose(): void;
}

const LEVELS = BLUR_SIGMAS.length;

const vertexShader = /* glsl */ `
  uniform float uSa, uSb;
  uniform vec2 uSize;
  varying vec2 vUv;
  varying float vS;
  varying vec3 vView;
  varying vec2 vLine;
  varying vec4 vEdge;
  void main() {
    vUv = uv;
    vS = uSa + uSb * position.x; // 경첩에서 떨어진 거리(들린 쪽 +)
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vView = view.xyz;
    // 경첩 쪽 위아래 모서리가 화면에 비치는 높이 — 펼친 판의 위아래 선과 같은 수평선
    float hinge = -uSa / uSb;
    vec4 top = modelViewMatrix * vec4(hinge, 0.5 * uSize.y, 0.0, 1.0);
    vec4 bottom = modelViewMatrix * vec4(hinge, -0.5 * uSize.y, 0.0, 1.0);
    vLine = vec2(top.y / -top.z, bottom.y / -bottom.z);
    // 같은 세로줄의 화면 위아래 끝
    top = modelViewMatrix * vec4(position.x, 0.5 * uSize.y, 0.0, 1.0);
    bottom = modelViewMatrix * vec4(position.x, -0.5 * uSize.y, 0.0, 1.0);
    vEdge = vec4(top.yz, bottom.yz);
    gl_Position = projectionMatrix * view;
  }`;

const fragmentShader = /* glsl */ `
  uniform sampler2D ${BLUR_SIGMAS.map((_, i) => `uL${i}`).join(', ')};
  uniform vec2 uU, uSize;
  uniform vec4 uRadii;
  uniform float uHinge, uPhi, uLift, uBase, uSink;
  varying vec2 vUv;
  varying float vS;
  varying vec3 vView;
  varying vec2 vLine;
  varying vec4 vEdge;

  float sdRoundBox(vec2 p, vec2 b, vec4 r) { // r = (오른위, 오른아래, 왼위, 왼아래)
    r.xy = (p.x > 0.0) ? r.xy : r.zw;
    r.x = (p.y > 0.0) ? r.x : r.y;
    vec2 q = abs(p) - b + r.x;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
  }
  float w(float f, float i) { return max(0.0, 1.0 - abs(f - i)); }

  void main() {
    // 경첩 쪽(uHinge: -1 왼쪽, +1 오른쪽) 가장자리는 깎지 않는다 — 두 화면이 틈 없이 이어진다
    vec2 p = (vUv - 0.5) * uSize, b = uSize * 0.5;
    p.x -= uHinge * 0.05;
    b.x += 0.05 * abs(uHinge);
    float d = sdRoundBox(p, b, uRadii);
    float alpha = clamp(0.5 - d / max(fwidth(d), 1e-5), 0.0, 1.0);
    if (alpha <= 0.0) discard;

    // 들린 만큼, 경첩에서 먼 만큼 흐린 단계를 골라 이웃 단계와 섞는다
    vec2 t = vec2(uU.x + uU.y * vUv.x, vUv.y);
    float sigma = ${BLUR_K.toFixed(1)} * pow(uPhi, ${BLUR_CURVE.toFixed(2)}) * pow(max(0.0, vS + ${BLUR_SPILL}), ${BLUR_REACH.toFixed(2)});
    float f = clamp(sigma < 1.0 ? sigma : 2.0 * log2(sigma) + 1.0, 0.0, ${LEVELS - 1}.0);
    // 필요한 두 단계만 읽는다 — 14장을 다 읽으면 화면이 클수록 무겁다
    vec4 col = vec4(0.0);
    ${BLUR_SIGMAS.map((_, i) => `if (abs(f - ${i}.0) < 1.0) col += texture2D(uL${i}, t) * w(f, ${i}.0);`).join('\n    ')}

    // 텍스처는 화면에 보이는 색 그대로라 색 공간을 바꾸지 않고 내보낸다
    gl_FragColor = vec4(col.rgb, alpha);
    // 어둡게 하는 건 화면에 보이는 색에서 — 안쪽 화면이 깨어나는 정도와 들린 끝의 어두움이 곱해진다
    float dark = uSink * min(0.8, 0.87 * uLift) * pow(clamp(vS, 0.0, 1.0), 1.3);
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
    // 입체감 — 들린 판은 원근으로 끝이 위아래로 솟는다. 펼친 판의 위아래 선을 그대로 이은 수평선이
    // 화면의 밝은 경계로 보이게, 솟은 쐐기를 그림자로 덮는다. 쐐기 높이(over 0~1) 기준으로 선 아래 절반
    // 쯤에서 옅게 시작해 화면 끝까지 길게 짙어진다 — 반쯤 어두운 곳이 선 바로 위(쐐기의 30%)에 오고
    // 경계선은 보이지 않는다(참고 영상: 50% 지점이 쐐기의 20~28%). 살짝 열 땐 띠가 나뉘어 보이지 않게
    // 들린 만큼 서서히 짙어진다(참고 영상: 20° 까지는 띠가 없고 45° 쯤 다 짙어진다).
    // 경첩(회전축)은 움직이지 않으니 쐐기가 없고, 들린 끝으로 갈수록, 많이 들릴수록 두꺼워진다
    float h = vView.y / -vView.z;
    float top = vEdge.x / -vEdge.y, bottom = vEdge.z / -vEdge.w;
    float over = max(
      (h - vLine.x) / max(top - vLine.x, 1e-6),
      (vLine.y - h) / max(vLine.y - bottom, 1e-6)
    );
    float shadow = uSink * 0.9 * smoothstep(0.25, 0.7, uLift) * smoothstep(-0.5, 1.0, over);
    gl_FragColor.rgb =
      gl_FragColor.rgb * (1.0 - uBase) * (1.0 - dark) * (1.0 - shadow) + dither;
  }`;

function roundedRect(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  [tl, tr, br, bl]: number[]
) {
  const s = new Shape();
  s.moveTo(x0 + bl, y0);
  s.lineTo(x1 - br, y0);
  if (br) s.absarc(x1 - br, y0 + br, br, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - tr);
  if (tr) s.absarc(x1 - tr, y1 - tr, tr, 0, Math.PI / 2, false);
  s.lineTo(x0 + tl, y1);
  if (tl) s.absarc(x0 + tl, y1 - tl, tl, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + bl);
  if (bl) s.absarc(x0 + bl, y0 + bl, bl, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** 판 한 장 — 안쪽 면이 z = 0, 몸체는 뒤로. 앞뒤 면은 유리, 옆면과 끝 둥글림은 금속. */
function slabGeometry(x0: number, x1: number, radii: number[]) {
  const shape = roundedRect(
    x0 + BEV,
    -H / 2 + BEV,
    x1 - BEV,
    H / 2 - BEV,
    radii.map(r => Math.max(0, r - BEV))
  );
  const geometry = new ExtrudeGeometry(shape, {
    depth: T - 2 * BEV,
    bevelEnabled: true,
    bevelThickness: BEV,
    bevelSize: BEV,
    bevelSegments: 4,
    curveSegments: 64,
  });
  geometry.translate(0, 0, -T + BEV);
  // 둥근 모서리와 테두리를 이루는 조각 사이의 면 방향을 부드럽게 잇는다 — 금속에 조각마다 다른 빛이
  // 비쳐 곡선이 꺾여 보이지 않게. 각진 모서리(36° 넘게 꺾이는 곳)는 그대로 둔다.
  // 이 함수는 꼭짓점을 0.01 격자로 묶는데 조각 하나가 ~0.003 이라, 키워서 계산하고 되돌린다
  // (그대로 두면 조각 몇 개가 한 방향으로 뭉쳐 모서리에 줄무늬가 진다)
  geometry.scale(1000, 1000, 1000);
  const smooth = toCreasedNormals(geometry, Math.PI / 5).scale(
    0.001,
    0.001,
    0.001
  );
  geometry.dispose();
  return smooth;
}

/**
 * 스튜디오 — 카메라 축을 감싸는 원통형 링 조명과 앞쪽 원판, 뒤쪽은 어둡다.
 * 사방이 똑같아서 둥근 테두리가 어느 방향에서나 같은 모습이라 모서리가 매끄럽게 이어지고,
 * 들린 판의 평평한 옆면은 옆쪽 링을 비춰 고른 은색 띠가 된다. 뒤쪽을 비추는 테두리 바깥은 가는 어두운 선.
 */
function studio(renderer: WebGLRenderer) {
  const env = new Scene();
  env.background = new Color(0x2c2c2f);
  const glow = (k: number) =>
    new MeshBasicMaterial({ color: new Color(k, k, k), side: DoubleSide });
  const ring = new Mesh(new CylinderGeometry(7, 7, 7, 96, 1, true), glow(2.2));
  ring.rotation.x = Math.PI / 2; // 축을 카메라 쪽(z)으로
  ring.position.z = 2.5; // z −1 ~ 6, 앞쪽 반구를 둘러싼다
  env.add(ring);
  const front = new Mesh(new CircleGeometry(7, 96), glow(1.8));
  front.position.z = 6;
  env.add(front);

  const pmrem = new PMREMGenerator(renderer);
  const target = pmrem.fromScene(env, 0.02);
  pmrem.dispose();
  env.traverse(object => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      (object.material as Material).dispose();
    }
  });
  return target;
}

/**
 * 접이식 기기 한 대. 각도(0° 닫힘 ~ 180° 활짝)와 화면 텍스처만 바꿔 주면 된다.
 * 바닥 판은 오른쪽에 두고, 덮개는 경첩(x = 0, z = 0)을 축으로 왼쪽으로 펼쳐진다.
 */
export function createFoldScene() {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const environment = studio(renderer);
  scene.environment = environment.texture;
  const camera = new PerspectiveCamera(24, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_DISTANCE);

  // 베젤 — 반사 없는 검정. 밝은 스튜디오를 비추면 회색으로 뜬다
  const glass = new MeshBasicMaterial({ color: 0x050506 });
  // 경첩 너머로 겹친 곳에서 금속 끝이 다른 판의 유리와 거의 같은 깊이에 놓인다 — 금속을 살짝 뒤로 밀어 유리가 이기게 한다
  const frame = new MeshPhysicalMaterial({
    color: 0xe6e3de,
    roughness: 0.14,
    metalness: 1,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 4,
  });
  const body = [glass, frame];

  const blurrer = createBlurrer(renderer);
  const blank = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blank.needsUpdate = true;

  function screen(
    width: number,
    {
      sa,
      sb,
      u,
      radii,
      sink,
      hinge = 0,
    }: {
      sa: number;
      sb: number;
      u: [number, number];
      radii: [number, number, number, number];
      sink: number;
      hinge?: number;
    }
  ) {
    const uniforms: Record<string, { value: unknown }> = {
      uSa: { value: sa },
      uSb: { value: sb },
      uU: { value: new Vector2(...u) },
      uSize: { value: new Vector2(width, SCREEN_H) },
      uRadii: { value: new Vector4(...radii) },
      uHinge: { value: hinge },
      uPhi: { value: 0 },
      uLift: { value: 0 },
      uBase: { value: 0 },
      uSink: { value: sink },
    };
    for (let i = 0; i < LEVELS; i++) uniforms[`uL${i}`] = { value: blank };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    return new Mesh(new PlaneGeometry(width, SCREEN_H), material);
  }

  const device = new Group();
  scene.add(device);

  // 두 판은 경첩 너머로 겹친다 — 펼치면 테두리가 이음새 없이 이어진다
  const baseSlab = new Mesh(undefined, body);
  device.add(baseSlab);
  const innerRight = screen(SCREEN_W, {
    sa: -SCREEN_W / 2,
    sb: -1,
    u: [0.5, 0.5],
    radii: [RS, RS, 0, 0],
    sink: 0,
    hinge: -1,
  });
  innerRight.position.set(SCREEN_W / 2, 0, LIFT);
  device.add(innerRight);

  const cover = new Group();
  device.add(cover);
  const coverSlab = new Mesh(undefined, body);
  cover.add(coverSlab);
  const innerLeft = screen(SCREEN_W, {
    sa: SCREEN_W / 2,
    sb: -1,
    u: [0, 0.5],
    radii: [0, 0, RS, RS],
    sink: 1,
    hinge: 1,
  });
  // 덮개 화면을 조금 더 띄워 접힐 때 경첩 쪽이 바닥 화면과 겹친다 — 틈으로 몸체가 비치지 않게
  innerLeft.position.set(-SCREEN_W / 2, 0, 2 * LIFT);
  cover.add(innerLeft);
  const outer = screen(OUTER_W, {
    sa: (W - OVERLAP) / 2,
    sb: 1,
    u: [0, 1],
    radii: [RS, RS, 0, 0],
    sink: 1,
  });
  outer.position.set(-(W - OVERLAP) / 2, 0, -T - LIFT);
  outer.rotation.y = Math.PI;
  cover.add(outer);

  const uniformsOf = (mesh: Mesh) => (mesh.material as ShaderMaterial).uniforms;
  let dirty = true;

  // 경첩 쪽 모서리 — 접었을 때만 살짝 둥글고, 펼칠수록 각져서 활짝 펴면 두 판이 하나로 이어진다.
  // 몸체를 매 프레임 새로 만들면 무거워서(판 하나에 ~20ms) 세 단계를 미리 만들어 두고 갈아 끼운다
  const HINGE_STEPS = [RH, RH / 2, 0]; // 접힘 · 반쯤 · 펼침
  const variants: { base: BufferGeometry; cover: BufferGeometry }[] = [];
  const variant = (i: number) =>
    (variants[i] ??= {
      base: slabGeometry(-OVERLAP, W, [HINGE_STEPS[i], R, R, HINGE_STEPS[i]]),
      cover: slabGeometry(-W, OVERLAP, [R, HINGE_STEPS[i], HINGE_STEPS[i], R]),
    });
  baseSlab.geometry = variant(0).base;
  coverSlab.geometry = variant(0).cover;
  // 나머지 단계는 첫 화면이 뜬 뒤 쉬는 틈에 만든다
  let idle = 0;
  const prepare = (i: number) => {
    if (i >= HINGE_STEPS.length) return;
    idle = window.setTimeout(() => {
      variant(i);
      prepare(i + 1);
    }, 200);
  };
  prepare(1);
  let hingeStep = 0;
  function shapeHinge(angle: number) {
    const i = angle < 50 ? 0 : angle < 130 ? 1 : 2;
    if (i === hingeStep) return;
    hingeStep = i;
    baseSlab.geometry = variant(i).base;
    coverSlab.geometry = variant(i).cover;
    const rs = Math.max(0, HINGE_STEPS[i] - BEZEL); // 바깥 화면은 몸체 모서리에서 베젤만큼 안쪽
    (uniformsOf(outer).uRadii.value as Vector4).set(RS, RS, rs, rs);
  }

  return {
    canvas: renderer.domElement,

    /** 캔버스 크기를 맞추고, 반쪽 폭이 화면에서 몇 px 인지 돌려준다(드래그 감도에 쓴다). */
    resize(width: number, height: number) {
      renderer.setSize(width, height, false);
      const unitPx = Math.min(width / 2.35, height / 1.75);
      camera.aspect = width / height;
      camera.fov =
        (2 * Math.atan(height / unitPx / 2 / CAMERA_DISTANCE) * 180) / Math.PI;
      camera.updateProjectionMatrix();
      dirty = true;
      return unitPx;
    },

    /** 0° = 닫힘(바깥 화면), 180° = 활짝(안쪽 화면) */
    setAngle(angle: number) {
      const rad = (angle * Math.PI) / 180;
      const phi = Math.min(rad, Math.PI - rad);
      const lift = Math.sin(phi);
      cover.rotation.y = Math.PI - rad;
      shapeHinge(angle);
      // 보이는 폭의 가운데를 화면 가운데로
      device.position.x = -(Math.min(0, W * Math.cos(rad)) + W) / 2;
      const asleep = sleepAt(Math.sin(Math.min(Math.PI - rad, Math.PI / 2)));
      for (const [mesh, base] of [
        [outer, 0],
        [innerLeft, asleep],
        [innerRight, asleep],
      ] as const) {
        const u = uniformsOf(mesh);
        u.uPhi.value = phi;
        u.uLift.value = lift;
        u.uBase.value = base;
      }
      dirty = true;
    },

    /** 화면 그림을 흐림 단계 텍스처로 — 흐림 기준(반쪽 폭 250px)을 각 그림의 px 로 바꿔 넣는다 */
    buildScreens({
      inner,
      outer: outerCanvas,
    }: ScreenCanvases): ScreenTextures {
      const sigmasFor = (canvas: HTMLCanvasElement, unitsWide: number) => {
        const texPerPx = canvas.width / unitsWide / BLUR_UNIT_PX;
        return BLUR_SIGMAS.map(sigma => sigma * texPerPx);
      };
      const innerLevels = blurrer.levels(inner, sigmasFor(inner, 2 * SCREEN_W));
      const outerLevels = blurrer.levels(
        outerCanvas,
        sigmasFor(outerCanvas, OUTER_W)
      );
      return {
        inner: innerLevels.textures,
        outer: outerLevels.textures,
        dispose() {
          innerLevels.dispose();
          outerLevels.dispose();
        },
      };
    },

    setScreens({ inner, outer: outerLevels }: ScreenTextures) {
      inner.forEach((texture, i) => {
        uniformsOf(innerLeft)[`uL${i}`].value = texture;
        uniformsOf(innerRight)[`uL${i}`].value = texture;
      });
      outerLevels.forEach((texture, i) => {
        uniformsOf(outer)[`uL${i}`].value = texture;
      });
      dirty = true;
    },

    render() {
      if (!dirty) return;
      renderer.render(scene, camera);
      dirty = false;
    },

    dispose() {
      window.clearTimeout(idle);
      for (const { base, cover: c } of variants) {
        base.dispose();
        c.dispose();
      }
      scene.traverse(object => {
        if (object instanceof Mesh) object.geometry.dispose();
      });
      for (const mesh of [innerLeft, innerRight, outer])
        (mesh.material as Material).dispose();
      glass.dispose();
      frame.dispose();
      blank.dispose();
      blurrer.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}

export type FoldScene = ReturnType<typeof createFoldScene>;
