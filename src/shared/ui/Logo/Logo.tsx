import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

export function Logo() {
  return (
    <Link href='/' className={cn('inline-flex')}>
      <h1>@leechan</h1>
    </Link>
  );
}
