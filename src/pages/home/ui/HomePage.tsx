// FSD v2.1: Pages First approach - page-specific components stay in the page slice
import { cn } from '@/shared/lib/utils';
import { HeroSection, DescriptionSection } from './components';

export function HomePage() {
  return (
    <>
      <div className={cn('flex flex-col', 'h-full w-full', 'relative z-10')}>
        <div className={cn('flex flex-col', 'w-full')}>
          <HeroSection />
          <DescriptionSection />
        </div>
      </div>
    </>
  );
}
