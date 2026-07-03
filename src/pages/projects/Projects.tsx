import { cn } from '@/shared/lib/utils';
import { PageHeader } from '@/shared/ui';
import { ProjectCard } from './ui/ProjectCard';
import { getProjectSummaries } from './model/projects';

export default function Projects() {
  const projects = getProjectSummaries();

  return (
    <div>
      <PageHeader title='Projects' />
      <div className={cn('grid grid-cols-2 lg:grid-cols-4', 'pt-2', 'gap-4')}>
        {projects.map(project => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </div>
  );
}
