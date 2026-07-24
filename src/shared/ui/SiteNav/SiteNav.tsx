import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

interface SiteNavProps {
  className?: string;
}

export function SiteNav({ className }: SiteNavProps) {
  return (
    <nav className={cn('flex flex-col', className)}>
      <Link href='/resume' className={cn('w-fit', 'hover:underline')}>
        Resume
      </Link>
    </nav>
  );
}
