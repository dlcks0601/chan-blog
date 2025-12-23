import { cn } from '@/shared/lib/utils';
import {
  getFeedSlugs,
  getFeedSourceBySlug,
} from '@/entities/Feed/api/feed.api';
import { FeedHeader } from './FeedDetailPage/FeedHeader';
import { FeedContent } from './FeedDetailPage/FeedContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getFeedSlugs();

  return slugs.map(slug => ({
    slug,
  }));
}

export default async function FeedDetailPage({ params }: Props) {
  const { slug } = await params;
  const source = await getFeedSourceBySlug(slug);
  const feed = source.feed;

  return (
    <article className={cn('pt-2')}>
      <div className={cn('flex flex-col items-center')}>
        <div
          className={cn(
            'w-full lg:max-w-[60%]',
            'flex flex-col',
            'pt-0 lg:pt-[3rem]',
            'gap-y-4'
          )}
        >
          <FeedHeader date={feed.date} />
          <FeedContent title={feed.title} source={source} />
        </div>
      </div>
    </article>
  );
}
