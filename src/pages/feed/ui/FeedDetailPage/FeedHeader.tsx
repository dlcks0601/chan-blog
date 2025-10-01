import Link from 'next/link';
import { DateFormatter } from '@/shared/lib/DateFormatter';

type Props = {
  date: string;
};

export const FeedHeader = ({ date }: Props) => {
  return (
    <div className='flex items-center justify-between'>
      <span className='font-jetbrains-medium text-lg font-jetbrains-light'>
        <DateFormatter dateString={date} />
      </span>
      <Link href='/feeds' className='text-lg underline font-jetbrains-light'>
        back
      </Link>
    </div>
  );
};
