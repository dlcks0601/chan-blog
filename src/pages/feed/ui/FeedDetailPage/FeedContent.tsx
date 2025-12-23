'use client';

import { cn } from '@/shared/lib/utils';
import { Markdown } from '@/pages/feed/ui/Markdown';
import { getFeedSourceBySlug } from '@/entities/Feed/api/feed.api';

type Props = {
  title: string;
  source: Awaited<ReturnType<typeof getFeedSourceBySlug>>;
};

export const FeedContent = ({ title, source }: Props) => {
   
  const { feed, ...mdxSource } = source;

  return (
    <>
      <div
        className={cn(
          'text-3xl lg:text-5xl',
          'font-jetbrains-medium font-jetbrains-semibold',
          'tracking-tighter',
          'break-keep',
          'text-start',
          'pb-4'
        )}
      >
        {title}
      </div>
      <div className={cn('w-full lg:max-w-[60%]', 'font-mono')}>
        <Markdown source={{ ...mdxSource, scope: mdxSource.scope ?? {} }} />
      </div>
    </>
  );
};
