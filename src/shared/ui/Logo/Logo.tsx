import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

export function Logo() {
  return (
    <Link href='/' className={cn('inline-flex')}>
      <h1
        className={cn('text-2xl font-bold tracking-tighter')}
        style={{
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        @leechan
      </h1>
    </Link>
  );
}
