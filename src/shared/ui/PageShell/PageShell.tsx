import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Logo } from '../Logo';
import { SiteNav } from '../SiteNav';
import { SocialLinks } from '../SocialLinks';

interface PageShellProps {
  children: ReactNode;
}

/** 로고 · 네비 · 소셜 링크를 두르는 공통 페이지 골격. */
export function PageShell({ children }: PageShellProps) {
  return (
    <main className={cn('grow', 'flex flex-col justify-between', 'py-10')}>
      <div
        className={cn(
          'grid gap-x-10',
          'grid-cols-[1fr_4fr] md:grid-cols-[1fr_3fr_2fr]'
        )}
      >
        <div>
          <Logo />
          <SiteNav className={cn('flex md:hidden', 'pt-10 text-sm')} />
        </div>
        {children}
        <SiteNav className={cn('hidden md:flex')} />
      </div>
      <SocialLinks className={cn('pt-20')} />
    </main>
  );
}
