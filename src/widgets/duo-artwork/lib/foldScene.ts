import {
  Color,
  DataTexture,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
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
import {
  BEV,
  BEZEL,
  BLUR_K,
  BLUR_SIGMAS,
  BLUR_SPILL,
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

/** 흐림 단계별 텍스처 — 안쪽(PC) 화면과 바깥(모바일) 화면 */
export interface ScreenTextures {
  inner: Texture[];
  outer: Texture[];
}

const LEVELS = BLUR_SIGMAS.length;

const vertexShader = /* glsl */ `
  uniform float uSa, uSb;
  varying vec2 vUv;
  varying float vS;
  void main() {
    vUv = uv;
    vS = uSa + uSb * position.x; // 경첩에서 떨어진 거리(들린 쪽 +)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

const fragmentShader = /* glsl */ `
  uniform sampler2D ${BLUR_SIGMAS.map((_, i) => `uL${i}`).join(', ')};
  uniform vec2 uU, uSize;
  uniform vec4 uRadii;
  uniform float uHinge, uPhi, uLift, uBase, uSink;
  varying vec2 vUv;
  varying float vS;

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
    float sigma = ${BLUR_K.toFixed(1)} * uPhi * max(0.0, vS + ${BLUR_SPILL});
    float f = clamp(sigma < 1.0 ? sigma : 2.0 * log2(sigma) + 1.0, 0.0, ${LEVELS - 1}.0);
    vec4 col = ${BLUR_SIGMAS.map((_, i) => `texture2D(uL${i}, t) * w(f, ${i}.0)`).join('\n      + ')};

    gl_FragColor = vec4(col.rgb, alpha);
    #include <colorspace_fragment>
    // 어둡게 하는 건 화면에 보이는 색에서 — 안쪽 화면이 깨어나는 정도와 들린 끝의 어두움이 곱해진다
    float dark = uSink * min(0.8, 0.87 * uLift) * pow(clamp(vS, 0.0, 1.0), 1.3);
    float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
    gl_FragColor.rgb = gl_FragColor.rgb * (1.0 - uBase) * (1.0 - dark) + dither;
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
    curveSegments: 32,
  });
  geometry.translate(0, 0, -T + BEV);
  return geometry;
}

/**
 * 스튜디오 — 큰 밝은 조명으로 둘러싸고 바닥과 뒤쪽만 어둡다.
 * 평평한 옆면은 어느 각도에서도 고른 은색 띠가 되고, 둥근 끝은 가는 어두운 선으로 남는다.
 */
function studio(renderer: WebGLRenderer) {
  const env = new Scene();
  env.background = new Color(0xa8a8ac);
  const light = (
    w: number,
    h: number,
    pos: [number, number, number],
    k: number
  ) => {
    const mesh = new Mesh(
      new PlaneGeometry(w, h),
      new MeshBasicMaterial({ color: new Color(k, k, k), side: DoubleSide })
    );
    mesh.position.set(...pos);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  };
  light(14, 4, [0, 6, 1], 2.4);
  light(4, 14, [-6, 0, 1], 2.2);
  light(4, 14, [6, 0, 1], 2.0);
  light(14, 8, [0, 0.5, 7], 2.0);
  light(16, 7, [0, -6, 0], 0.05);
  light(16, 1.4, [0, 2.5, -6], 0.08);

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

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

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

  const glass = new MeshStandardMaterial({
    color: 0x050506,
    roughness: 0.4,
    metalness: 0,
    envMapIntensity: 0.06,
  });
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
  const baseSlab = new Mesh(slabGeometry(-OVERLAP, W, [RH, R, R, RH]), body);
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
  const coverSlab = new Mesh(slabGeometry(-W, OVERLAP, [R, RH, RH, R]), body);
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

  // 경첩 쪽 모서리 — 접었을 때만 살짝 둥글고, 펼칠수록 각져서 활짝 펴면 두 판이 하나로 이어진다
  let hingeRadius = -1;
  function shapeHinge(rh: number) {
    if (Math.abs(rh - hingeRadius) < 0.001) return;
    hingeRadius = rh;
    baseSlab.geometry.dispose();
    baseSlab.geometry = slabGeometry(-OVERLAP, W, [rh, R, R, rh]);
    coverSlab.geometry.dispose();
    coverSlab.geometry = slabGeometry(-W, OVERLAP, [R, rh, rh, R]);
    const rs = Math.max(0, rh - BEZEL); // 바깥 화면은 몸체 모서리에서 베젤만큼 안쪽
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
      shapeHinge(RH * (1 - smoothstep(20, 160, angle)));
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
      scene.traverse(object => {
        if (object instanceof Mesh) object.geometry.dispose();
      });
      for (const mesh of [innerLeft, innerRight, outer])
        (mesh.material as Material).dispose();
      glass.dispose();
      frame.dispose();
      blank.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}

export type FoldScene = ReturnType<typeof createFoldScene>;
