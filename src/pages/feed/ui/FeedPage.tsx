import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { PreviewFeed } from './PreviewFeed/PreviewFeed';
import FeedType from '../model/feedData';

interface FeedPageProps {
  feeds: FeedType[];
}

export function FeedPage({ feeds }: FeedPageProps) {
  return (
    <div>
      <PageHeader title='Feed' />
      <div className='flex lg:flex-row flex-col lg:gap-x-12 gap-y-10 pt-8'>
        <div className='flex flex-col lg:w-0 flex-grow pb-20'>
          <div className='flex h-8 border-b border-white'>
            <span className='text-sm font-jetbrains-light  w-32 text-white'>
              Date
            </span>
            <span className='text-sm font-jetbrains-light w-32 text-white'>
              Title
            </span>
          </div>
          <div className='flex flex-col w-full border-white'>
            {feeds.map(feed => (
              <PreviewFeed key={feed.slug} feed={feed} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
