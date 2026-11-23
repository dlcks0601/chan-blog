import { cn } from '@/shared/lib/utils';
import { TextLink } from '@/shared/ui';
import { SiteFrame } from '@/widgets/site-frame';

export function HomePage() {
  return (
    <SiteFrame>
      <p className={cn('max-w-140')}>
        <span className={cn('block')}>
          Hello, I&apos;m a Frontend Developer.
        </span>
        <span className={cn('block')}>Build anything. For users.</span>
        <span className={cn('block')}>
          Interested in the creative, interactive web and design systems.
        </span>
        <span className={cn('block')}>
          Currently at <TextLink href='https://lukuku.co'>Lukuku</TextLink>,
          crafting Shopify commerce and tools for developers and designers.
        </span>
      </p>
    </SiteFrame>
  );
}
