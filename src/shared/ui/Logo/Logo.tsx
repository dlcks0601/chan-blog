import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { LogoMark } from './LogoMark';

/** legacy 로고 — 심볼 아래에 메뉴와 같은 크기 · 굵기의 이름을 붙인다. */
export function Logo() {
  return (
    <Link href='/' className={cn('inline-flex flex-col gap-2')}>
      <LogoMark />
      <h1>legacy</h1>
    </Link>
  );
}
