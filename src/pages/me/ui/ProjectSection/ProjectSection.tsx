import { cn } from '@/shared/lib/utils';
import type { HoveredText } from '../components/HighlightedText';
import { AchievementList } from '../components/AchievementList';
import { StackTags } from '../components/StackTags';
import { Reveal } from '../components/Reveal';

export interface Project {
  name?: string;
  link?: string;
  period?: string;
  achievements: string[];
  stack: string[];
}

export interface ProjectItem {
  team: string;
  position: string;
  period: string;
  description: string;
  projects?: Project[];
}

interface ProjectSectionProps {
  projects: ProjectItem[];
  className?: string;
  hoveredTexts?: HoveredText[];
}

export function ProjectSection({
  projects,
  className = '',
  hoveredTexts = [],
}: ProjectSectionProps) {
  return (
    <div className={className}>
      {projects.map((project, index) => (
        <Reveal
          key={index}
          className={cn(
            'grid gap-x-8 gap-y-3 lg:grid-cols-[1fr_3fr]',
            'border-t border-white/15 py-6'
          )}
        >
          {/* left meta */}
          <div className={cn('flex flex-col gap-1.5')}>
            <span className={cn('text-base font-jetbrains-semibold')}>
              {project.team}
            </span>
            <span
              className={cn(
                'text-sm leading-relaxed text-white/55',
                'font-jetbrains-light'
              )}
            >
              {project.position}
            </span>
            <span
              className={cn('text-sm text-white/40', 'font-jetbrains-light')}
            >
              {project.period}
            </span>
          </div>

          {/* right content */}
          <div>
            <p
              className={cn(
                'text-sm leading-relaxed text-white/75',
                'font-jetbrains-light'
              )}
            >
              {project.description}
            </p>

            {project.projects && project.projects.length > 0 && (
              <div className={cn('mt-6 flex flex-col gap-6')}>
                {project.projects.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    className={cn(
                      'flex flex-col gap-4',
                      'border-t border-white/10 pt-5'
                    )}
                  >
                    <AchievementList
                      items={sub.achievements}
                      hoveredTexts={hoveredTexts}
                    />
                    <StackTags stack={sub.stack} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
