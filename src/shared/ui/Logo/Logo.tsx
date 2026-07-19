import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { LogoMark } from './LogoMark';

export function Logo() {
  return (
    <Link href='/' className={cn('inline-flex flex-col gap-1')}>
      <LogoMark spin className={cn('h-14 w-14 md:h-16 md:w-16')} />
      <h1>@leechan</h1>
    </Link>
  );
}
