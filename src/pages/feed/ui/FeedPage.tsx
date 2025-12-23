import { cn } from '@/shared/lib/utils';
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
      <div
        className={cn(
          'flex flex-col lg:flex-row',
          'gap-y-10 lg:gap-x-12',
          'pt-8'
        )}
      >
        <div className={cn('flex flex-col flex-grow lg:w-0', 'pb-20')}>
          <div className={cn('flex h-8', 'border-b border-white')}>
            <span
              className={cn(
                'w-32',
                'text-sm',
                'font-jetbrains-light',
                'text-white'
              )}
            >
              Date
            </span>
            <span
              className={cn(
                'w-32',
                'text-sm',
                'font-jetbrains-light',
                'text-white'
              )}
            >
              Title
            </span>
          </div>
          <div className={cn('flex flex-col', 'w-full', 'border-white')}>
            {feeds.map(feed => (
              <PreviewFeed key={feed.slug} feed={feed} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
