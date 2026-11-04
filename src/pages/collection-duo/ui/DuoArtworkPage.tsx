import { getArtwork } from '@/entities/artwork';
import { cn } from '@/shared/lib/utils';
import {
  BlurDiagram,
  DuoFold,
  HingeDiagram,
  MotionDiagram,
  ShadeDiagram,
} from '@/widgets/duo-artwork';
import { SiteFrame } from '@/widgets/site-frame';

const PROCESS = [
  { title: '01 Blur', spec: '46 · θ^1.6 · d^1.5', Diagram: BlurDiagram },
  { title: '02 Shade', spec: '60° → 27%', Diagram: ShadeDiagram },
  { title: '03 Motion', spec: '1.3s · power3.inOut', Diagram: MotionDiagram },
  // 화면 경계는 펼친 판과 일직선(180°)으로 남는다 — 세 칸 아래 한 줄을 다 쓴다
  { title: '04 Hinge', spec: '180°', Diagram: HingeDiagram, wide: true },
];

export function DuoArtworkPage() {
  const artwork = getArtwork('duo');

  return (
    <SiteFrame>
      <article>
        <figure>
          <div
            className={cn(
              'relative aspect-square bg-surface md:aspect-auto md:h-[min(640px,70vh)]'
            )}
          >
            <DuoFold interactive detailed />
            <p
              className={cn(
                'absolute right-gutter bottom-gutter',
                'pointer-events-none text-muted'
              )}
            >
              Drag
            </p>
          </div>
          <figcaption className={cn('flex justify-between gap-x-10 pt-2')}>
            <span>{artwork.title}</span>
            <span className={cn('text-muted')}>
              {artwork.medium} — {artwork.year}
            </span>
          </figcaption>
        </figure>

        <ol
          className={cn(
            'grid gap-x-gutter gap-y-section pt-section md:grid-cols-3'
          )}
        >
          {PROCESS.map(({ title, spec, Diagram, wide }) => (
            <li key={title} className={cn(wide && 'md:col-span-3')}>
              <div
                className={cn(
                  'h-85 bg-surface',
                  'flex items-center justify-center'
                )}
              >
                <Diagram className={cn('h-[82%] w-[82%]')} />
              </div>
              <div className={cn('flex justify-between pt-2')}>
                <span>{title}</span>
                <span className={cn('text-muted')}>{spec}</span>
              </div>
            </li>
          ))}
        </ol>
      </article>
    </SiteFrame>
  );
}
