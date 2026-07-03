import { getProjectSlugs } from '@/pages/projects/model/projects';
import ProjectDetailPage from '@/pages/projects/ui/ProjectDetailPage';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map(slug => ({ slug }));
}

export default async function Page({ params }: Props) {
  return <ProjectDetailPage params={params} />;
}
