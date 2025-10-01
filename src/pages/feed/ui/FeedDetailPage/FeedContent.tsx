'use client';

import { Markdown } from '@/pages/feed/ui/Markdown';
import { getFeedSourceBySlug } from '@/entities/Feed/api/feed.api';

type Props = {
  title: string;
  source: Awaited<ReturnType<typeof getFeedSourceBySlug>>;
};

export const FeedContent = ({ title, source }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { feed, ...mdxSource } = source;

  return (
    <>
      <div className='text-3xl lg:text-5xl font-jetbrains-medium break-keep tracking-tighter font-jetbrains-semibold text-start pb-4'>
        {title}
      </div>
      <div className='w-full lg:max-w-[60%] font-mono'>
        <Markdown source={{ ...mdxSource, scope: mdxSource.scope ?? {} }} />
      </div>
    </>
  );
};
