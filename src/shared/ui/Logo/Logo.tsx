import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

const MARK_ANGLES = [0, 45, 90, 135];

export function Logo() {
  return (
    <Link href='/' className={cn('inline-flex flex-col')}>
      <div className={cn('relative h-6 w-6', 'text-white')}>
        {MARK_ANGLES.map(angle => (
          <div
            key={angle}
            className={cn(
              'absolute inset-0',
              'flex items-center justify-center'
            )}
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className={cn('h-px w-full', 'bg-current')} />
          </div>
        ))}
      </div>
      <h1>@leechan</h1>
    </Link>
  );
}
