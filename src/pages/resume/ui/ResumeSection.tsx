import { cn } from '@/shared/lib/utils';
import { Reveal } from '@/shared/ui';
import type { ResumeCareer } from '../model/resumeData';

interface ResumeSectionProps {
  career: ResumeCareer;
}

export function ResumeSection({ career }: ResumeSectionProps) {
  return (
    <Reveal>
      <section className={cn('flex flex-col gap-6')}>
        <div className={cn('flex flex-col')}>
          <h2 className={cn('text-lg font-semibold')}>{career.company}</h2>
          {career.position && (
            <p className={cn('text-sm text-neutral-400')}>{career.position}</p>
          )}
          <p className={cn('text-sm text-neutral-500', 'font-mono')}>
            {career.period}
          </p>
          {career.description && (
            <p className={cn('pt-2 text-sm text-neutral-300')}>
              {career.description}
            </p>
          )}
        </div>
        {career.projects.map(project => (
          <div key={project.name} className={cn('flex flex-col gap-2')}>
            <div className={cn('flex items-baseline gap-3')}>
              {project.link ? (
                <a
                  href={project.link}
                  target='_blank'
                  rel='noreferrer'
                  className={cn('font-medium underline')}
                >
                  {project.name}
                </a>
              ) : (
                <h3 className={cn('font-medium')}>{project.name}</h3>
              )}
              <span className={cn('text-xs text-neutral-500', 'font-mono')}>
                {project.period}
              </span>
            </div>
            <ul className={cn('flex flex-col gap-1', 'pl-4')}>
              {project.achievements.map(achievement => (
                <li
                  key={achievement}
                  className={cn('list-disc', 'text-sm text-neutral-300')}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Reveal>
  );
}
