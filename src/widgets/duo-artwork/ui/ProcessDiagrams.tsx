'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useId, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  CAMERA_DISTANCE,
  H,
  MEASURED_SHADE,
  shadeAt,
  TURN_EASE,
  TURN_SECONDS,
} from '../model/device';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

/** 그림 좌표는 소수 셋째 자리까지 — 서버와 브라우저의 삼각함수 끝자리가 달라 하이드레이션이 어긋나지 않게 */
const r3 = (value: number) => Math.round(value * 1000) / 1000;
const pt = (x: number, y: number) => `${r3(x)},${r3(y)}`;

// 선은 확대돼도 1px 로 남게 한다.
const HAIRLINE = {
  stroke: 'currentColor',
  vectorEffect: 'non-scaling-stroke',
  fill: 'none',
} as const;

interface DiagramProps {
  className?: string;
}

function Label({
  x,
  y,
  size = 0.9,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      textAnchor={anchor}
      fill='currentColor'
      className={cn('text-muted')}
      data-fade
    >
      {children}
    </text>
  );
}

/**
 * 보이는 순간 한 번 그려진다. 처음 그린 모습(서버)이 다 그려진 상태라
 * 동작 줄이기 설정이거나 스크립트가 늦어도 그림은 그대로 보인다.
 */
function useDrawIn(
  build: (svg: SVGSVGElement, timeline: gsap.core.Timeline) => void
) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
      });
      build(svg, timeline);
      ScrollTrigger.create({
        trigger: svg,
        start: 'top 85%',
        once: true,
        onEnter: () => timeline.play(),
      });
    },
    { scope: ref }
  );
  return ref;
}

const fadeIn = (targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) =>
  [targets, { opacity: 0, duration: 0.6, ...vars }] as const;

/**
 * 01 — 옆에서 본 경첩. 평평한 판 위의 점은 또렷하고,
 * 들린 판 위의 점은 경첩에서 멀수록 판을 따라 옆으로 길게 번진다.
 */
export function BlurDiagram({ className }: DiagramProps) {
  const id = useId();
  const HINGE: [number, number] = [1, 13];
  const LENGTH = 25;
  const LIFT = 30;
  const STEPS = [0.2, 0.4, 0.6, 0.8, 1];
  const ARC = 5;

  const stdDeviation = (d: number, k: number) =>
    `${0.6 * d * k} ${0.3 * d * k}`;
  const arcPath = (lift: number) => {
    const rad = (lift * Math.PI) / 180;
    return `M ${HINGE[0] + ARC} ${HINGE[1]} A ${ARC} ${ARC} 0 0 0 ${pt(HINGE[0] + ARC * Math.cos(rad), HINGE[1] - ARC * Math.sin(rad)).replace(',', ' ')}`;
  };

  // 판이 평평한 데서 들리며 점들이 차례로 번진다
  const ref = useDrawIn((svg, timeline) => {
    const lifted = svg.querySelector('[data-lifted]')!;
    const arc = svg.querySelector('[data-arc]')!;
    const blurs = [...svg.querySelectorAll('feGaussianBlur')];
    const pose = { lift: 0, k: 0 };
    timeline
      .fromTo(
        pose,
        { lift: 0, k: 0 },
        {
          lift: LIFT,
          k: 1,
          duration: 1.6,
          ease: 'power3.inOut',
          immediateRender: true,
          onUpdate: () => {
            lifted.setAttribute(
              'transform',
              `rotate(${-pose.lift} ${HINGE[0]} ${HINGE[1]})`
            );
            arc.setAttribute('d', arcPath(pose.lift));
            blurs.forEach((blur, i) =>
              blur.setAttribute('stdDeviation', stdDeviation(STEPS[i], pose.k))
            );
          },
        }
      )
      .from(...fadeIn(svg.querySelectorAll('[data-fade]')), '-=0.5');
  });

  return (
    <svg ref={ref} viewBox='-1 -2 28 17' aria-hidden className={className}>
      <defs>
        {STEPS.map((d, i) => (
          <filter
            key={d}
            id={`${id}-blur-${i}`}
            x='-200%'
            y='-200%'
            width='500%'
            height='500%'
          >
            <feGaussianBlur stdDeviation={stdDeviation(d, 1)} />
          </filter>
        ))}
      </defs>

      <line
        {...HAIRLINE}
        x1={HINGE[0]}
        y1={HINGE[1]}
        x2={HINGE[0] + LENGTH}
        y2={HINGE[1]}
        strokeOpacity={0.28}
      />
      {STEPS.map(d => (
        <rect
          key={d}
          x={HINGE[0] + LENGTH * d - 0.35}
          y={HINGE[1] - 0.35}
          width={0.7}
          height={0.7}
          fill='currentColor'
          shapeRendering='crispEdges'
        />
      ))}

      <g data-lifted transform={`rotate(${-LIFT} ${HINGE[0]} ${HINGE[1]})`}>
        <line
          {...HAIRLINE}
          x1={HINGE[0]}
          y1={HINGE[1]}
          x2={HINGE[0] + LENGTH}
          y2={HINGE[1]}
          strokeOpacity={0.28}
        />
        {STEPS.map((d, i) => (
          <rect
            key={d}
            x={HINGE[0] + LENGTH * d - 0.35}
            y={HINGE[1] - 0.35}
            width={0.7}
            height={0.7}
            fill='currentColor'
            filter={`url(#${id}-blur-${i})`}
          />
        ))}
      </g>

      <path data-arc {...HAIRLINE} strokeOpacity={0.5} d={arcPath(LIFT)} />
      <Label x={HINGE[0] + ARC + 1.1} y={HINGE[1] - 0.9} anchor='start'>
        θ
      </Label>
      <circle cx={HINGE[0]} cy={HINGE[1]} r={0.22} fill='currentColor' />
    </svg>
  );
}

/**
 * 02 — 들린 판의 밝기. 선은 맞춘 곡선, 점은 참고 영상에서 잰 값.
 * 가로는 경첩에서 들린 끝까지, 세로는 원래 밝기 대비.
 */
export function ShadeDiagram({ className }: DiagramProps) {
  const id = useId();
  const X = 22;
  const Y = 13;
  const at = (d: number, b: number): [number, number] => [X * d, Y * (1 - b)];
  const curve = (lift: number) =>
    Array.from({ length: 41 }, (_, i) => {
      const d = i / 40;
      return pt(...at(d, shadeAt(Math.sin((lift * Math.PI) / 180), d)));
    }).join(' ');

  // 곡선이 경첩에서 끝으로 차례로 그려지고, 잰 점이 뒤따라 찍힌다
  const ref = useDrawIn((svg, timeline) => {
    timeline
      .from(svg.querySelectorAll('[data-reveal]'), {
        attr: { width: 0 },
        duration: 1.2,
        ease: 'power2.inOut',
        stagger: 0.18,
      })
      .from(
        svg.querySelectorAll('[data-dot]'),
        {
          opacity: 0,
          scale: 0,
          transformOrigin: '50% 50%',
          duration: 0.35,
          stagger: 0.025,
        },
        0.5
      )
      .from(...fadeIn(svg.querySelectorAll('[data-fade]')), 0.9);
  });

  return (
    <svg
      ref={ref}
      viewBox='-3.5 -1.5 30 17.5'
      aria-hidden
      className={className}
    >
      <defs>
        {MEASURED_SHADE.map(({ lift }) => (
          <clipPath key={lift} id={`${id}-reveal-${lift}`}>
            <rect data-reveal x={-1} y={-2} width={X + 2} height={Y + 4} />
          </clipPath>
        ))}
      </defs>
      <polyline
        {...HAIRLINE}
        strokeOpacity={0.28}
        points={`0,0 0,${Y} ${X},${Y}`}
      />
      {MEASURED_SHADE.map(({ lift, points }, i) => {
        const opacity = 0.35 + (0.65 * i) / (MEASURED_SHADE.length - 1);
        const [, endY] = at(1, shadeAt(Math.sin((lift * Math.PI) / 180), 1));
        return (
          <g key={lift}>
            <polyline
              {...HAIRLINE}
              strokeOpacity={opacity}
              points={curve(lift)}
              clipPath={`url(#${id}-reveal-${lift})`}
            />
            {points.map(([d, b]) => {
              const [cx, cy] = at(d, b);
              return (
                <circle
                  key={d}
                  data-dot
                  cx={cx}
                  cy={cy}
                  r={0.2}
                  fill='currentColor'
                  fillOpacity={opacity}
                />
              );
            })}
            <Label x={X + 0.8} y={r3(endY + 0.3)} anchor='start'>
              {`${lift}°`}
            </Label>
          </g>
        );
      })}
      <Label x={-0.7} y={0.3} anchor='end'>
        100
      </Label>
      <Label x={-0.7} y={Y + 0.3} anchor='end'>
        0
      </Label>
      <Label x={0} y={Y + 1.6} anchor='start'>
        hinge
      </Label>
      <Label x={X} y={Y + 1.6} anchor='end'>
        edge
      </Label>
    </svg>
  );
}

/**
 * 03 — 한 번 여닫는 움직임을 같은 시간 간격으로 겹친 연속 사진.
 * 기기와 같은 이징이라 시작과 끝은 촘촘하고 가운데는 성기다.
 * 정면에서 본 원근 그대로 — 옆으로 선 90° 에서 덮개 끝이 가장 길어진다.
 */
export function MotionDiagram({ className }: DiagramProps) {
  const SCALE = 10;
  const HALF_H = (H / 2) * SCALE;
  const FRAMES = 9;
  const ease = gsap.parseEase(TURN_EASE);
  // 정면에서 본 덮개 끝 — 경첩(x = 0)을 축으로 화면 쪽으로 들리며 왼쪽으로 넘어간다
  const freeEdge = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const f = CAMERA_DISTANCE / (CAMERA_DISTANCE - Math.sin(rad));
    return { x: Math.cos(rad) * f * SCALE, h: HALF_H * f };
  };
  const angles = Array.from(
    { length: FRAMES },
    (_, i) => 180 * ease(i / (FRAMES - 1))
  );
  const trail = Array.from({ length: 61 }, (_, i) => {
    const { x, h } = freeEdge((180 * i) / 60);
    return pt(x, -h);
  }).join(' ');

  // 덮개 윤곽이 시간 순서대로 하나씩 나타나고, 끝이 지나간 길이 뒤따른다
  const ref = useDrawIn((svg, timeline) => {
    timeline
      .from(svg.querySelectorAll('[data-frame]'), {
        opacity: 0,
        duration: 0.35,
        stagger: TURN_SECONDS / (FRAMES - 1),
        ease: 'none',
      })
      .from(
        ...fadeIn(svg.querySelectorAll('[data-trail], [data-fade]')),
        '-=0.4'
      );
  });

  return (
    <svg
      ref={ref}
      viewBox='-12.5 -10.5 25 21'
      aria-hidden
      className={className}
    >
      <rect
        {...HAIRLINE}
        strokeOpacity={0.28}
        x={0}
        y={-HALF_H}
        width={SCALE}
        height={2 * HALF_H}
      />
      <polyline
        data-trail
        {...HAIRLINE}
        strokeOpacity={0.35}
        strokeDasharray='0.25 0.35'
        points={trail}
      />
      {angles.map((angle, i) => {
        const { x, h } = freeEdge(angle);
        const opacity = 0.2 + (0.8 * i) / (FRAMES - 1);
        return (
          <g key={i} data-frame>
            <polygon
              {...HAIRLINE}
              strokeOpacity={opacity}
              points={`${pt(0, -HALF_H)} ${pt(x, -h)} ${pt(x, h)} ${pt(0, HALF_H)}`}
            />
            <circle
              cx={r3(x)}
              cy={r3(-h)}
              r={0.22}
              fill='currentColor'
              fillOpacity={opacity}
            />
          </g>
        );
      })}
      <circle cx={0} cy={-HALF_H} r={0.22} fill='currentColor' />
      <circle cx={0} cy={HALF_H} r={0.22} fill='currentColor' />
      <Label x={SCALE} y={HALF_H + 1.6} anchor='end'>
        0°
      </Label>
      <Label x={-SCALE} y={HALF_H + 1.6} anchor='start'>
        180°
      </Label>
    </svg>
  );
}
