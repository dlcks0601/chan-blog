import type { ReactNode } from 'react';
import { ThemeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib/utils';
import { Logo, Signature, SiteNav, SocialLinks } from '@/shared/ui';

interface SiteFrameProps {
  children: ReactNode;
  /**
   * stacked — 내용이 로고 아래에서 시작한다(기본).
   * inset — 넓은 화면에서 12칸 중 3~11번째 칸에 놓여 로고 · 메뉴와 같은 높이에서 시작한다.
   */
  layout?: 'stacked' | 'inset';
}

/**
 * 네 모서리 틀 — 왼쪽 위 로고, 오른쪽 위 메뉴, 왼쪽 아래 연락처와 서명,
 * 오른쪽 아래 테마. 내용이 짧으면 아래 모서리가 화면 끝에 붙는다.
 */
export function SiteFrame({ children, layout = 'stacked' }: SiteFrameProps) {
  const inset = layout === 'inset';

  return (
    <main className={cn('grow', 'flex flex-col', 'py-gutter')}>
      <div
        className={cn(
          'grow content-start',
          'grid grid-cols-[1fr_auto] gap-x-10',
          inset && 'lg:grid-cols-12 lg:gap-x-gutter'
        )}
      >
        <header className={cn('contents')}>
          <div className={cn('row-start-1', inset && 'lg:col-span-2')}>
            <Logo />
          </div>
          <SiteNav
            className={cn(
              'row-start-1 items-end text-right',
              inset && 'lg:col-start-12'
            )}
          />
        </header>
        <div
          className={cn(
            'col-span-2 pt-section',
            inset && 'lg:col-span-9 lg:col-start-3 lg:row-start-1 lg:pt-0'
          )}
        >
          {children}
        </div>
      </div>
      <footer
        className={cn('flex items-end justify-between gap-x-10', 'pt-20')}
      >
        <div className={cn('flex flex-col')}>
          <SocialLinks />
          <Signature />
        </div>
        <ThemeToggle />
      </footer>
    </main>
  );
}
