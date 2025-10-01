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
      className='flex border-b border-white items-center w-full lg:h-16 lg:py-0 py-4'
    >
      <span className='text-sm lg:text-base font-jetbrains-light w-32 text-white'>
        <DateFormatter dateString={date} />
      </span>
      <span className='lg:text-base w-0 grow text-sm tracking-tight text-white font-jetbrains-light'>
        {title}
      </span>
    </Link>
  );
};
