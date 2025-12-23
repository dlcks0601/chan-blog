'use client';

import { cn } from '@/shared/lib/utils';
import { Markdown } from '@/pages/feed/ui/Markdown';
import { getProjectSourceBySlug } from '@/entities/Project/api/project.api';

type Props = {
  source: Awaited<ReturnType<typeof getProjectSourceBySlug>>;
};

export const ProjectContent = ({ source }: Props) => {
   
  const { project, ...mdxSource } = source;

  return (
    <>
      <div className={cn('w-full', 'font-mono')}>
        <Markdown source={{ ...mdxSource, scope: mdxSource.scope ?? {} }} />
      </div>
    </>
  );
};
