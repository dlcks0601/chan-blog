import { cn } from '@/shared/lib/utils';
import { DateFormatter } from '@/shared/lib/DateFormatter';
import Link from 'next/link';
import FeedType from '@/pages/feed/model/feedData';

type Props = {
  feed: FeedType;
};

export const PreviewFeed = ({ feed }: Props) => {
  const { slug, title, date } = feed;

  return (
    <Link
      href={`/feeds/${slug}`}
      className={cn(
        'flex items-center',
        'w-full',
        'h-auto lg:h-16',
        'py-4 lg:py-0',
        'border-b border-white'
      )}
    >
      <span
        className={cn(
          'w-32',
          'text-sm lg:text-base',
          'font-jetbrains-light',
          'text-white'
        )}
      >
        <DateFormatter dateString={date} />
      </span>
      <span
        className={cn(
          'w-0 grow',
          'text-sm lg:text-base',
          'tracking-tight',
          'font-jetbrains-light',
          'text-white'
        )}
      >
        {title}
      </span>
    </Link>
  );
};
