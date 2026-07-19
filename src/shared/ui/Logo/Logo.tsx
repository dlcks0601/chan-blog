import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { LogoMark } from './LogoMark';

export function Logo() {
  return (
    <Link href='/' className={cn('inline-flex flex-col')}>
      <LogoMark spin className={cn('h-14 w-14')} />
      <h1>@leechan</h1>
    </Link>
  );
}
