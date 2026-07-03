import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import type { ProjectSummary } from '@/pages/projects/model/types';

type ProjectCardProps = ProjectSummary;

export function ProjectCard({
  slug,
  title,
  date,
  cover,
  stack,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={cn(
        'flex flex-col gap-2',
        'cursor-pointer',
        'hover:opacity-80',
        'transition-opacity'
      )}
    >
      <img
        src={cover.src}
        alt={cover.alt}
        className={cn('w-full rounded-lg border border-white/10')}
      />
      <div className={cn('flex flex-col gap-1')}>
        <div className={cn('text-lg', 'font-jetbrains')}>{title}</div>
        <div className={cn('text-xs text-white/45', 'font-jetbrains-light')}>
          {date}
        </div>
        <div className={cn('mt-0.5 flex flex-wrap gap-1')}>
          {stack.slice(0, 3).map(tech => (
            <span
              key={tech}
              className={cn(
                'rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5',
                'text-[10px] text-white/60',
                'font-jetbrains-light'
              )}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
