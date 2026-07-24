import { cn } from '@/shared/lib/utils';
import type { ResumeEntry as Entry } from '../model/resumeData';

interface ResumeEntryProps {
  entry: Entry;
}

export function ResumeEntry({ entry }: ResumeEntryProps) {
  return (
    <div className={cn('grid md:grid-cols-[1fr_3fr]', 'gap-x-4 pt-2')}>
      <div>
        <h2 className={cn('pt-2 text-sm')}>
          {entry.link ? (
            <a
              href={entry.link}
              target='_blank'
              rel='noreferrer'
              className={cn('underline')}
            >
              {entry.title}
            </a>
          ) : (
            entry.title
          )}
        </h2>
        {entry.subtitle && (
          <div className={cn('text-xs text-neutral-400')}>{entry.subtitle}</div>
        )}
        <div className={cn('pt-2 text-xs text-neutral-400')}>
          {entry.period}
        </div>
      </div>
      <div>
        {entry.projects.map(project => (
          <div
            key={project.name}
            className={cn('grid md:grid-cols-[1fr_2fr]', 'gap-4 py-4')}
          >
            <div>
              <div className={cn('text-sm')}>
                {project.link ? (
                  <a
                    href={project.link}
                    target='_blank'
                    rel='noreferrer'
                    className={cn('underline')}
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </div>
              <div className={cn('text-xs text-neutral-400')}>
                {project.period}
              </div>
            </div>
            <ul
              className={cn(
                "list-['-'] list-inside",
                'flex flex-col gap-y-1.5',
                'text-xs text-neutral-300'
              )}
            >
              {project.achievements.map(achievement => (
                <li key={achievement} className={cn('pl-1')}>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
