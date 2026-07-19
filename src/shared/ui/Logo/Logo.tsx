'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { LogoMark } from './LogoMark';

/** 마크가 4회 대칭이라 90도씩 돌면 제자리로 떨어진다. */
const TURN_DEGREES = 90;

export function Logo() {
  const [turns, setTurns] = useState(0);

  return (
    <Link
      href='/'
      onMouseEnter={() => setTurns(current => current + 1)}
      className={cn('inline-flex flex-col')}
    >
      <LogoMark
        style={{ transform: `rotate(${turns * TURN_DEGREES}deg)` }}
        className={cn(
          'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none'
        )}
      />
      <h1>@leechan</h1>
    </Link>
  );
}
