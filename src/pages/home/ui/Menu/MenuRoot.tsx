import { cn } from '@/shared/lib/utils';
import type { MenuRootProps } from './types';

export function MenuRoot({ children, className }: MenuRootProps) {
  return (
    <section
      className={cn(
        'w-full flex font-bold lg:text-[2.5rem] text-[1.5rem] tracking-tighter text-white gap-4',
        className
      )}
    >
      {children}
    </section>
  );
}
