import { getProjectSlugs } from '@/entities/Project/api/project.api';
import ProjectDetailPage from '@/pages/projects/ui/ProjectDetailPage';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getProjectSlugs();

  return slugs.map(slug => ({
    slug,
  }));
}

export default async function Page({ params }: Props) {
  return <ProjectDetailPage params={params} />;
}
