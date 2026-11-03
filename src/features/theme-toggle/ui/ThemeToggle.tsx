'use client';

import { THEME_STORAGE_KEY, type Theme } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

/**
 * 지금과 반대 테마의 이름을 보여주고, 누르면 그 테마로 바꾼다.
 *
 * 링크마다 붙은 hover 용 transition 이 테마 전환에도 걸리면 요소마다 다른
 * 속도로 색이 따라와 끊겨 보인다. 그래서 바꾸는 동안에는 transition 을 모두 끄고,
 * 화면 전체를 한 장으로 크로스페이드한다(View Transitions 미지원이면 즉시 전환).
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
    };

    root.classList.add('theme-switching');
    const done = () => root.classList.remove('theme-switching');

    if (document.startViewTransition) {
      document.startViewTransition(apply).finished.finally(done);
    } else {
      apply();
      // 바뀐 색이 transition 없이 먼저 계산되도록 한 번 읽고 나서 푼다.
      void getComputedStyle(root).color;
      done();
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // 저장이 막힌 환경에서는 이번 방문에만 적용된다.
    }
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className={cn(
        'w-fit cursor-pointer',
        'transition-colors hover:text-muted',
        className
      )}
    >
      {/* 서버는 저장된 테마를 모르므로 라벨은 CSS 로 고른다. */}
      <span className={cn('dark:hidden')}>dark</span>
      <span className={cn('hidden dark:inline')}>light</span>
    </button>
  );
}
