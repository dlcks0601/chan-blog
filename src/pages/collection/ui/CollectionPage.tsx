import Link from 'next/link';
import type { ReactNode } from 'react';
import { ARTWORKS, type ArtworkSlug } from '@/entities/artwork';
import { cn } from '@/shared/lib/utils';
import { LegacyMotion } from '@/widgets/legacy-logo-artwork';
import { SiteFrame } from '@/widgets/site-frame';

/** 목록에서 사각형 안에 보여줄 작품 그 자체. */
const PREVIEWS: Record<ArtworkSlug, ReactNode> = {
  logo: <LegacyMotion className={cn('w-4/5')} />,
};

export function CollectionPage() {
  return (
    <SiteFrame>
      <ul
        className={cn(
          'grid grid-cols-2 gap-x-gutter gap-y-section md:grid-cols-4'
        )}
      >
        {ARTWORKS.map(artwork => (
          <li key={artwork.slug}>
            <Link
              href={`/collection/${artwork.slug}`}
              className={cn('group block')}
            >
              <div
                className={cn(
                  'aspect-3/4 bg-surface',
                  'flex items-center justify-center'
                )}
              >
                {PREVIEWS[artwork.slug]}
              </div>
              <p
                className={cn(
                  'pt-2',
                  'transition-colors group-hover:text-muted'
                )}
              >
                {artwork.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </SiteFrame>
  );
}
