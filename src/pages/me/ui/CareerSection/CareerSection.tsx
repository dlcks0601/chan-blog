import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import type { HoveredText } from '../components/HighlightedText';
import { AchievementList } from '../components/AchievementList';
import { StackTags } from '../components/StackTags';
import { Reveal } from '../components/Reveal';

export interface Project {
  name: string;
  link?: string;
  period?: string;
  achievements: string[];
  stack: string[];
}

export interface CareerItem {
  company: string;
  position: string;
  period: string;
  description: string;
  projects?: Project[];
}

interface CareerSectionProps {
  careers: CareerItem[];
  className?: string;
  hoveredTexts?: HoveredText[];
}

export function CareerSection({
  careers,
  className = '',
  hoveredTexts = [],
}: CareerSectionProps) {
  return (
    <div className={className}>
      {careers.map((career, index) => (
        <Reveal
          key={index}
          className={cn(
            'grid gap-x-8 gap-y-3 lg:grid-cols-[1fr_3fr]',
            'border-t border-white/15 py-6'
          )}
        >
          {/* left meta */}
          <div className={cn('flex flex-col gap-1.5')}>
            <span className={cn('font-jetbrains-semibold underline')}>
              {career.company}
            </span>
            <span
              className={cn('text-sm text-white/55', 'font-jetbrains-light')}
            >
              {career.position}
            </span>
            <span
              className={cn('text-sm text-white/40', 'font-jetbrains-light')}
            >
              {career.period}
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
              {career.description}
            </p>

            {career.projects && career.projects.length > 0 && (
              <div className={cn('mt-6 flex flex-col gap-6')}>
                {career.projects.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className={cn(
                      'grid gap-x-6 gap-y-3 lg:grid-cols-[1fr_2fr]',
                      'border-t border-white/10 pt-5'
                    )}
                  >
                    <div className={cn('flex flex-col gap-1.5')}>
                      {project.link ? (
                        <Link
                          href={project.link}
                          target='_blank'
                          className={cn(
                            'w-fit text-sm text-white/90 underline underline-offset-4',
                            'font-jetbrains-medium',
                            'transition-colors hover:text-white'
                          )}
                        >
                          {project.name}
                        </Link>
                      ) : (
                        <span
                          className={cn(
                            'text-sm text-white/90',
                            'font-jetbrains-medium'
                          )}
                        >
                          {project.name}
                        </span>
                      )}
                      {project.period && (
                        <span
                          className={cn(
                            'text-xs text-white/40',
                            'font-jetbrains-light'
                          )}
                        >
                          {project.period}
                        </span>
                      )}
                    </div>

                    <div className={cn('flex flex-col gap-4')}>
                      <AchievementList
                        items={project.achievements}
                        hoveredTexts={hoveredTexts}
                      />
                      <StackTags stack={project.stack} />
                    </div>
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
