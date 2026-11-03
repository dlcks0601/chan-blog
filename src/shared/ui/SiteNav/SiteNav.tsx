'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const LINKS = [
  { href: '/collection', label: 'Collection' },
  { href: '/resume', label: 'Resume' },
];

interface SiteNavProps {
  className?: string;
}

/** 어느 공간 안에 있으면 그 이름만 진하게 두고 나머지는 흐리게 한다. */
export function SiteNav({ className }: SiteNavProps) {
  const pathname = usePathname() ?? '/';
  const current = LINKS.find(link => pathname.startsWith(link.href));

  return (
    <nav className={cn('flex flex-col', className)}>
      {LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link === current ? 'page' : undefined}
          className={cn(
            'w-fit transition-colors',
            current && link !== current
              ? 'text-muted hover:text-ink'
              : 'hover:text-muted'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
