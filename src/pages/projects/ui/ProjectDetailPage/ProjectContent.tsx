import { Markdown } from '@/pages/feed/ui/Markdown';
import { getProjectSourceBySlug } from '@/entities/Project/api/project.api';

type Props = {
  source: Awaited<ReturnType<typeof getProjectSourceBySlug>>;
};

export const ProjectContent = ({ source }: Props) => {
  return (
    <>
      <div className='w-full font-mono'>
        <Markdown source={source} />
      </div>
    </>
  );
};
