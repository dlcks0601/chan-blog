import { cn } from '@/shared/lib/utils';
import type {
  AchievementGroup,
  ResumeEntry as Entry,
  ResumeProject,
} from '../model/resumeData';

interface ResumeEntryProps {
  entry: Entry;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul
      className={cn(
        "list-['-'] list-inside",
        'flex flex-col gap-y-1.5',
        'text-xs text-neutral-300'
      )}
    >
      {items.map(item => (
        <li key={item} className={cn('pl-1')}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function AchievementGroups({ groups }: { groups: AchievementGroup[] }) {
  return (
    <div className={cn('flex flex-col gap-y-4')}>
      {groups.map(group => (
        <div
          key={group.label ?? group.items[0]}
          className={cn('flex flex-col gap-y-2')}
        >
          {group.label && (
            <div className={cn('text-xs text-neutral-500')}>{group.label}</div>
          )}
          <Bullets items={group.items} />
        </div>
      ))}
    </div>
  );
}

function ProjectBlock({ project }: { project: ResumeProject }) {
  return (
    <div className={cn('grid md:grid-cols-[1fr_2fr]', 'gap-4 py-4')}>
      <div className={cn('flex flex-col gap-y-2')}>
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
          <div className={cn('text-xs text-neutral-400')}>{project.period}</div>
        </div>
        {project.description && (
          <p className={cn('text-xs leading-relaxed text-neutral-400')}>
            {project.description}
          </p>
        )}
        {project.stack && (
          <div className={cn('text-xs text-neutral-600')}>
            {project.stack.join(' · ')}
          </div>
        )}
      </div>
      <div>
        {project.groups ? (
          <AchievementGroups groups={project.groups} />
        ) : project.achievements ? (
          <Bullets items={project.achievements} />
        ) : null}
      </div>
    </div>
  );
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
        {entry.description && (
          <p className={cn('pt-2 text-xs leading-relaxed text-neutral-400')}>
            {entry.description}
          </p>
        )}
      </div>
      <div>
        {entry.projects.map(project => (
          <ProjectBlock key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
