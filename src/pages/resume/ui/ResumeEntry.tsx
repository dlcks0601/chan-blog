import { cn } from '@/shared/lib/utils';
import { TextLink } from '@/shared/ui';
import type { ResumeEntry as Entry } from '../model/resumeData';

interface ResumeEntryProps {
  entry: Entry;
}

/**
 * 회사 한 곳. 9칸 중 왼쪽 2칸은 회사, 나머지 7칸은 프로젝트(이름 2칸 · 성과 5칸) —
 * 모두 같은 간격이라 위의 Name · Position · Contact 와 세로줄이 맞는다.
 */
export function ResumeEntry({ entry }: ResumeEntryProps) {
  return (
    <section className={cn('grid gap-x-gutter gap-y-6 lg:grid-cols-9')}>
      <header className={cn('lg:col-span-2')}>
        <h2>
          {entry.link ? (
            <TextLink href={entry.link}>{entry.title}</TextLink>
          ) : (
            entry.title
          )}
        </h2>
        {entry.subtitle && <p className={cn('text-muted')}>{entry.subtitle}</p>}
        <p className={cn('text-muted')}>{entry.period}</p>
      </header>

      <div className={cn('flex flex-col gap-y-6 lg:col-span-7')}>
        {entry.projects.map(project => (
          <article
            key={project.name}
            className={cn('grid gap-x-gutter gap-y-2 lg:grid-cols-7')}
          >
            <div className={cn('lg:col-span-2')}>
              <h3>
                {project.link ? (
                  <TextLink href={project.link}>{project.name}</TextLink>
                ) : (
                  project.name
                )}
              </h3>
              <p className={cn('text-muted')}>{project.period}</p>
            </div>
            <ul className={cn('lg:col-span-5')}>
              {project.achievements.map(achievement => (
                <li key={achievement} className={cn('flex gap-x-2')}>
                  <span aria-hidden className={cn('text-muted')}>
                    –
                  </span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
