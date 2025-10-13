import { PageHeader } from '@/shared/ui';
import { ProjectCard } from './ui/ProjectCard';
import { getProjects } from './model/projects';
import '@/app/styles/markdown.css';

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div>
      <PageHeader title='Projects' />
      <div className='grid grid-cols-2 lg:grid-cols-4 pt-2 gap-4'>
        {projects.map(project => (
          <ProjectCard
            key={project.slug}
            slug={project.slug}
            imageSrc={project.imageSrc}
            imageAlt={project.imageAlt}
            title={project.title}
            category={project.category}
            tagColor={project.tagColor}
          />
        ))}
      </div>
    </div>
  );
}
