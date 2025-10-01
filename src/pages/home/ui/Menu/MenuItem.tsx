import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import type { MenuItemProps } from './types';

export function MenuItem({ href, children, className }: MenuItemProps) {
  return (
    <Link href={href} className={cn('underline', className)}>
      {children}
    </Link>
  );
}
