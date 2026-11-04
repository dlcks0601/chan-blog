'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { DEFAULT_THEME, type Theme } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { blurAt, shadeAt, TURN_EASE, TURN_SECONDS } from '../model/device';
import type { ScreenTextures } from '../lib/foldScene';

// 저절로 여닫을 때 — 닫힌 채로 · 펼친 채로 머무는 시간(초)
const HOLD_CLOSED = 1.4;
const HOLD_OPEN = 2.6;
const TURN = TURN_SECONDS;
const EASE = TURN_EASE;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const themeOf = (): Theme => {
  const theme = document.documentElement.dataset.theme;
  return theme === 'light' || theme === 'dark' ? theme : DEFAULT_THEME;
};

/** 펼친 화면 텍스처 폭 — 화면에 그려지는 크기에 맞춰 512~2048px */
const textureWidthFor = (unitPx: number) =>
  clamp(
    Math.ceil((2 * unitPx * Math.min(devicePixelRatio, 2)) / 256) * 256,
    512,
    2048
  );

type Readout = 'angle' | 'blur' | 'shade';

interface DuoFoldProps {
  className?: string;
  /** 드래그 · 탭 · 방향키로 여닫는다. */
  interactive?: boolean;
  /** 저절로 접혔다 펴지기를 반복한다. */
  autoplay?: boolean;
  /** 왼쪽 아래에 각도 · 흐림 · 밝기를 실시간으로 보여준다. 부모는 relative 여야 한다. */
  detailed?: boolean;
}

/**
 * 접이식 기기 — 접으면 모바일, 펼치면 PC 화면이 보인다.
 * 판이 들리면 경첩에서 먼 쪽부터 흐려지고 어두워진다.
 * 각도는 GSAP 이 움직이고 매 틱 바뀐 만큼만 그린다. 드래그는 손을 그대로 따라간다.
 * three.js 는 기기가 나타날 때 따로 불러오고, 화면 밖에서는 멈춘다.
 * 동작 줄이기 설정이면 저절로 움직이지 않고, 여닫을 때도 바로 그 각도로 간다.
 */
export function DuoFold({
  className,
  interactive = false,
  autoplay = false,
  detailed = false,
}: DuoFoldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const readoutRefs = useRef<Partial<Record<Readout, HTMLElement | null>>>({});

  useEffect(() => {
    const root = rootRef.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let teardown = () => {};

    Promise.all([import('../lib/foldScene'), import('../lib/screens')]).then(
      ([{ createFoldScene }, { loadScreens }]) => {
        if (cancelled) return;
        const fold = createFoldScene();
        const canvas = fold.canvas;
        canvas.className = cn(
          'block size-full opacity-0 transition-opacity duration-500'
        );
        root.prepend(canvas);

        // 0° = 닫힘, 180° = 활짝
        const state = { angle: autoplay && reduced ? 180 : 0 };
        let goal = state.angle;
        let motion: gsap.core.Animation | null = null;
        let drag: {
          x: number;
          from: number;
          moved: boolean;
          t: number;
          velocity: number;
        } | null = null;
        let unitPx = 250;
        let painted = -1;
        let peeked = false;

        const showReadout = (angle: number) => {
          const rad = (angle * Math.PI) / 180;
          const phi = Math.min(rad, Math.PI - rad);
          const { angle: a, blur, shade } = readoutRefs.current;
          if (a) a.textContent = `${Math.round(angle)}°`;
          if (blur) blur.textContent = blurAt(phi, 1).toFixed(1);
          if (shade)
            shade.textContent = `${Math.round(shadeAt(Math.sin(phi), 1) * 100)}%`;
          if (interactive)
            root.setAttribute('aria-valuenow', String(Math.round(angle)));
        };

        const draw = () => {
          if (state.angle !== painted) {
            fold.setAngle(state.angle);
            showReadout(state.angle);
            painted = state.angle;
          }
          fold.render();
        };
        // 보이는 동안만 매 틱 그린다. 바뀐 게 없으면 아무것도 하지 않는다
        let ticking = false;
        const tick = (on: boolean) => {
          if (on === ticking) return;
          ticking = on;
          if (on) gsap.ticker.add(draw);
          else gsap.ticker.remove(draw);
          if (on) motion?.resume();
          else motion?.pause();
        };

        /** angle 로 움직인다. 동작 줄이기 설정이면 바로 그 각도로 */
        const turnTo = (angle: number, vars: gsap.TweenVars = {}) => {
          motion?.kill();
          motion = null;
          goal = angle;
          if (reduced) state.angle = angle;
          else
            motion = gsap.to(state, {
              angle,
              duration: TURN,
              ease: EASE,
              ...vars,
            });
        };

        if (autoplay && !reduced) {
          motion = gsap
            .timeline({ repeat: -1 })
            .to(state, { angle: 180, duration: TURN, ease: EASE }, HOLD_CLOSED)
            .to(
              state,
              { angle: 0, duration: TURN, ease: EASE },
              `+=${HOLD_OPEN}`
            );
        }

        // 처음 나타날 때 한 번 살짝 열었다 닫아 열 수 있다는 걸 보여준다. 손대면 바로 멈춘다
        const peek = () => {
          if (peeked || !interactive || autoplay || reduced) return;
          peeked = true;
          motion = gsap
            .timeline({ delay: 0.6 })
            .to(state, { angle: 42, duration: 0.8, ease: 'power2.inOut' })
            .to(state, { angle: 0, duration: 1, ease: EASE });
        };

        // 화면 — 지금 테마의 캡처를 쓰고, 테마가 바뀌면 갈아 끼운다
        const screens: Partial<Record<Theme, Promise<ScreenTextures>>> = {};
        let textureWidth = 0;
        const showScreens = async () => {
          const theme = themeOf();
          const set = await (screens[theme] ??= loadScreens(
            theme,
            textureWidth
          ).then(canvases =>
            // 그사이 페이지를 떠났으면 정리된 렌더러로 흐리지 않는다
            cancelled
              ? { inner: [], outer: [], dispose() {} }
              : fold.buildScreens(canvases)
          ));
          if (cancelled) return;
          fold.setScreens(set);
          canvas.classList.remove('opacity-0');
          peek();
        };

        const resize = () => {
          unitPx = fold.resize(root.clientWidth, root.clientHeight);
          if (!textureWidth) {
            textureWidth = textureWidthFor(unitPx);
            showScreens();
          }
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(root);

        const themeObserver = new MutationObserver(showScreens);
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        });

        const visibility = new IntersectionObserver(([entry]) =>
          tick(entry.isIntersecting)
        );
        visibility.observe(root);

        // 왼쪽으로 끌면 열리고 오른쪽으로 끌면 닫힌다. 놓으면 그 각도에 멈추고, 튕기거나 탭하면 끝까지 간다
        const onPointerDown = (event: PointerEvent) => {
          root.setPointerCapture(event.pointerId);
          motion?.kill();
          motion = null;
          drag = {
            x: event.clientX,
            from: state.angle,
            moved: false,
            t: performance.now(),
            velocity: 0,
          };
        };
        const onPointerMove = (event: PointerEvent) => {
          if (!drag) return;
          const dx = drag.x - event.clientX;
          if (Math.abs(dx) > 3) drag.moved = true;
          const now = performance.now();
          const next = clamp(drag.from + (dx / unitPx) * 180, 0, 180);
          drag.velocity = (next - state.angle) / Math.max(1, now - drag.t); // 도/ms
          state.angle = goal = next;
          drag.t = now;
        };
        const onPointerUp = () => {
          if (!drag) return;
          const { moved, velocity } = drag;
          drag = null;
          if (!moved) turnTo(state.angle < 90 ? 180 : 0);
          else if (Math.abs(velocity) > 0.25) {
            // 튕긴 속도를 이어받는다 — power3.out 은 처음 속도가 평균의 세 배
            const to = velocity > 0 ? 180 : 0;
            const seconds =
              (3 * Math.abs(to - state.angle)) / (Math.abs(velocity) * 1000);
            turnTo(to, {
              duration: clamp(seconds, 0.3, 1.2),
              ease: 'power3.out',
            });
          }
        };
        const onKeyDown = (event: KeyboardEvent) => {
          const step = { ArrowLeft: 15, ArrowRight: -15 }[event.key];
          if (!step) return;
          event.preventDefault();
          turnTo(clamp(goal + step, 0, 180), {
            duration: 0.45,
            ease: 'power2.out',
          });
        };
        if (interactive) {
          root.addEventListener('pointerdown', onPointerDown);
          root.addEventListener('pointermove', onPointerMove);
          root.addEventListener('pointerup', onPointerUp);
          root.addEventListener('pointercancel', onPointerUp);
          root.addEventListener('keydown', onKeyDown);
        }

        teardown = () => {
          motion?.kill();
          tick(false);
          resizeObserver.disconnect();
          themeObserver.disconnect();
          visibility.disconnect();
          root.removeEventListener('pointerdown', onPointerDown);
          root.removeEventListener('pointermove', onPointerMove);
          root.removeEventListener('pointerup', onPointerUp);
          root.removeEventListener('pointercancel', onPointerUp);
          root.removeEventListener('keydown', onKeyDown);
          for (const set of Object.values(screens))
            set?.then(textures => textures.dispose());
          fold.dispose();
          canvas.remove();
        };
      }
    );

    return () => {
      cancelled = true;
      teardown();
    };
  }, [interactive, autoplay]);

  return (
    <div
      ref={rootRef}
      className={cn(
        'absolute inset-0',
        interactive &&
          'cursor-grab touch-none select-none active:cursor-grabbing',
        className
      )}
      {...(interactive
        ? {
            role: 'slider',
            tabIndex: 0,
            'aria-label': '접는 각도 — 접으면 모바일, 펼치면 PC 화면',
            'aria-valuemin': 0,
            'aria-valuemax': 180,
            'aria-valuenow': 0,
          }
        : {
            role: 'img',
            'aria-label': '접으면 모바일, 펼치면 PC 화면이 보이는 접이식 기기',
          })}
    >
      {detailed && (
        <dl
          className={cn(
            'absolute bottom-gutter left-gutter',
            'flex gap-x-7',
            'text-muted tabular-nums'
          )}
        >
          {(
            [
              ['angle', 'angle'],
              ['blur', 'blur'],
              ['shade', 'shade'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className={cn('flex gap-x-1.5')}>
              <dt className={cn('font-semibold text-ink')}>{label}</dt>
              <dd
                ref={el => {
                  readoutRefs.current[key] = el;
                }}
              />
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
