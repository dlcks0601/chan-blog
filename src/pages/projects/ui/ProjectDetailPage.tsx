import { notFound } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import {
  getProjectSlugs,
  getProjectBySlug,
} from '@/pages/projects/model/projects';
import { ProjectHeader } from './ProjectDetailPage/ProjectHeader';
import { ProjectContent } from './ProjectDetailPage/ProjectContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map(slug => ({ slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className={cn('pt-2 pb-12')}>
      <div className={cn('flex flex-col items-center')}>
        <div
          className={cn(
            'w-full lg:max-w-[60%]',
            'flex flex-col',
            'pt-0 lg:pt-[3rem]',
            'gap-6'
          )}
        >
          <ProjectHeader
            title={project.title}
            date={project.date}
            stack={project.stack}
            cover={project.cover}
          />
          <ProjectContent project={project} />
        </div>
      </div>
    </article>
  );
}
