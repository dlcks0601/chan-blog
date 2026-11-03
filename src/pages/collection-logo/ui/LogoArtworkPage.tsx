import { getArtwork } from '@/entities/artwork';
import { cn } from '@/shared/lib/utils';
import {
  FoldDiagram,
  LegacyMotion,
  LettersDiagram,
  PathsDiagram,
} from '@/widgets/legacy-logo-artwork';
import { SiteFrame } from '@/widgets/site-frame';

const PROCESS = [
  { title: '01 Letters', spec: '4 × 6', Diagram: LettersDiagram },
  { title: '02 Fold', spec: '10 × 11', Diagram: FoldDiagram },
  { title: '03 Paths', spec: 'max 8.1', Diagram: PathsDiagram },
];

export function LogoArtworkPage() {
  const artwork = getArtwork('logo');

  return (
    <SiteFrame>
      <article>
        <figure>
          <div
            className={cn(
              'relative aspect-square bg-surface md:aspect-auto md:h-[min(640px,70vh)]',
              'flex items-center justify-center'
            )}
          >
            <LegacyMotion detailed className={cn('w-[88%] md:w-2/3')} />
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
                <Diagram className={cn('w-[82%]')} />
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
