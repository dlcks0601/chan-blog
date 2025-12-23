import { cn } from '@/shared/lib/utils';

export function HeroSection() {
  return (
    <div className={cn('flex flex-col')}>
      <h1
        className={cn(
          'text-[5rem] lg:text-[8rem]',
          'font-bold tracking-tighter',
          'text-white'
        )}
      >
        @leechan
      </h1>
    </div>
  );
}
