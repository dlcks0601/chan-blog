'use client';

import { Markdown } from '@/pages/feed/ui/Markdown';
import { getProjectSourceBySlug } from '@/entities/Project/api/project.api';

type Props = {
  source: Awaited<ReturnType<typeof getProjectSourceBySlug>>;
};

export const ProjectContent = ({ source }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { project, ...mdxSource } = source;

  return (
    <>
      <div className='w-full font-mono'>
        <Markdown source={{ ...mdxSource, scope: mdxSource.scope ?? {} }} />
      </div>
    </>
  );
};
