import {
  getProjectSlugs,
  getProjectSourceBySlug,
} from '@/entities/Project/api/project.api';
import { ProjectHeader } from './ProjectDetailPage/ProjectHeader';
import { ProjectContent } from './ProjectDetailPage/ProjectContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getProjectSlugs();

  return slugs.map(slug => ({
    slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const source = await getProjectSourceBySlug(slug);
  const project = source.project;

  return (
    <article className='pt-2'>
      <div className='flex flex-col items-center'>
        <div className='w-full lg:max-w-[60%] flex flex-col lg:pt-[3rem] gap-y-4'>
          <ProjectHeader
            title={project.title}
            date={project.date}
            category={project.category}
            tagColor={project.tagColor}
          />
          <ProjectContent source={source} />
        </div>
      </div>
    </article>
  );
}
