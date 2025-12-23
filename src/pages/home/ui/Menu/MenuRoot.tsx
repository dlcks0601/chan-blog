import { cn } from '@/shared/lib/utils';
import type { MenuRootProps } from '../../model';

export function MenuRoot({ children, className }: MenuRootProps) {
  return (
    <section
      className={cn(
        'w-full flex gap-4',
        'text-[1.5rem] lg:text-[2.5rem]',
        'font-bold tracking-tighter',
        'text-white',
        className
      )}
    >
      {children}
    </section>
  );
}
