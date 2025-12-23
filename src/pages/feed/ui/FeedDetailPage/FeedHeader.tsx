'use client';

import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { DateFormatter } from '@/shared/lib/DateFormatter';

type Props = {
  date: string;
};

export const FeedHeader = ({ date }: Props) => {
  return (
    <div className={cn('flex items-center justify-between')}>
      <span
        className={cn('text-lg', 'font-jetbrains-medium font-jetbrains-light')}
      >
        <DateFormatter dateString={date} />
      </span>
      <Link
        href='/feeds'
        className={cn('text-lg', 'underline', 'font-jetbrains-light')}
      >
        back
      </Link>
    </div>
  );
};
