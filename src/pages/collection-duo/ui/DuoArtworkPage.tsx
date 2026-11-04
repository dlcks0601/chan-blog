import { getArtwork } from '@/entities/artwork';
import { cn } from '@/shared/lib/utils';
import {
  BlurDiagram,
  DuoFold,
  MotionDiagram,
  ShadeDiagram,
} from '@/widgets/duo-artwork';
import { SiteFrame } from '@/widgets/site-frame';

const PROCESS = [
  { title: '01 Blur', spec: '48 · θ · d', Diagram: BlurDiagram },
  { title: '02 Shade', spec: '60° → 27%', Diagram: ShadeDiagram },
  { title: '03 Motion', spec: '1.3s · power3.inOut', Diagram: MotionDiagram },
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
          {PROCESS.map(({ title, spec, Diagram }) => (
            <li key={title}>
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
