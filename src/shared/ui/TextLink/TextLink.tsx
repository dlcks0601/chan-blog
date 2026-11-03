import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface TextLinkProps {
  href: string;
  children: ReactNode;
}

/** 본문 속 바깥 링크 — 흐린 밑줄로 링크임을 알리고, 올리면 글자가 흐려진다. */
export function TextLink({ href, children }: TextLinkProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className={cn(
        'underline decoration-muted underline-offset-4',
        'transition-colors hover:text-muted'
      )}
    >
      {children}
    </a>
  );
}
