import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { Hovered } from '../components/Hovered';

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

interface HoveredText {
  text: string;
  imageUrl: string;
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
  const renderText = (text: string) => {
    let hasHovered = false;
    let processedText = text;

    hoveredTexts.forEach(ht => {
      if (processedText.includes(ht.text)) {
        hasHovered = true;
        processedText = processedText.replace(
          ht.text,
          `<HOVERED_START>${ht.text}<HOVERED_END>`
        );
      }
    });

    if (hasHovered) {
      const parts = processedText.split(/(<HOVERED_START>.*?<HOVERED_END>)/);
      return (
        <>
          {parts.map((part, index) => {
            if (
              part.startsWith('<HOVERED_START>') &&
              part.endsWith('<HOVERED_END>')
            ) {
              const hoveredContent = part
                .replace('<HOVERED_START>', '')
                .replace('<HOVERED_END>', '');
              const hoveredText = hoveredTexts.find(
                ht => ht.text === hoveredContent
              );
              return (
                <Hovered key={index} imageUrl={hoveredText?.imageUrl}>
                  {hoveredContent}
                </Hovered>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </>
      );
    }
    return text;
  };
  return (
    <div className={className}>
      {careers.map((career, index) => (
        <div
          key={index}
          className={cn('grid lg:grid-cols-[1fr_3fr]', 'border-t', 'py-4')}
        >
          <div>
            <div className={cn('font-jetbrains-semibold', 'underline')}>
              {career.company}
            </div>
            <div
              className={cn(
                'text-xs lg:text-sm',
                'font-jetbrains-light',
                'pt-2'
              )}
            >
              {career.position}
            </div>
            <div
              className={cn(
                'text-xs lg:text-sm',
                'font-jetbrains-light',
                'pt-2'
              )}
            >
              {career.period}
            </div>
          </div>
          <div>
            <div className={cn('text-sm', 'font-jetbrains-light', 'py-3')}>
              {career.description}
            </div>
            {career.projects && career.projects.length > 0 && (
              <div className={cn('py-4')}>
                {career.projects.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className={cn(
                      'grid lg:grid-cols-[1fr_2fr]',
                      'mb-6 last:mb-0',
                      'border-t',
                      'pt-4'
                    )}
                  >
                    <div>
                      {project.link && (
                        <Link href={project.link} target='_blank'>
                          <span
                            className={cn(
                              'text-sm lg:text-base',
                              'font-jetbrains-light',
                              'underline',
                              'pt-2'
                            )}
                          >
                            {project.name}
                          </span>
                        </Link>
                      )}
                      {!project.link && (
                        <span
                          className={cn(
                            'text-sm lg:text-base',
                            'font-jetbrains-light',
                            'pt-2'
                          )}
                        >
                          {project.name}
                        </span>
                      )}

                      <div
                        className={cn(
                          'text-xs lg:text-sm',
                          'font-jetbrains-light',
                          'pt-2 pb-2'
                        )}
                      >
                        {project.period}
                      </div>
                    </div>
                    <ul
                      className={cn(
                        'flex flex-col gap-y-1.5',
                        'text-sm',
                        'list-["-"] list-inside'
                      )}
                    >
                      {project.achievements.map(
                        (achievement, achievementIndex) => (
                          <li
                            key={achievementIndex}
                            className={cn('text-sm', 'font-jetbrains-light')}
                          >
                            {renderText(achievement)}
                          </li>
                        )
                      )}
                    </ul>
                    <div
                      className={cn(
                        'flex flex-wrap',
                        'gap-x-2 gap-y-2',
                        'pt-2'
                      )}
                    >
                      {project.stack.map((stack, stackIndex) => (
                        <div
                          key={stackIndex}
                          className={cn(
                            'flex',
                            'border',
                            'max-w-fit px-1',
                            'text-sm',
                            'font-jetbrains-thin'
                          )}
                        >
                          #{stack}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
