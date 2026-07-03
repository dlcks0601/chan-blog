import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import type { ProjectMedia } from '@/pages/projects/model/types';
import { TechBadge } from './TechBadge';

type Props = {
  title: string;
  date: string;
  stack: string[];
  cover: ProjectMedia;
};

export const ProjectHeader = ({ title, date, stack, cover }: Props) => {
  return (
    <header className={cn('flex flex-col gap-5')}>
      <div className={cn('flex justify-end')}>
        <Link
          href='/projects'
          className={cn(
            'text-sm text-white/60 underline underline-offset-4',
            'font-jetbrains-light',
            'transition-colors hover:text-white'
          )}
        >
          ← back
        </Link>
      </div>

      <div className={cn('flex items-center gap-5')}>
        <img
          src={cover.src}
          alt={cover.alt}
          className={cn(
            'size-24 shrink-0 object-cover',
            'rounded-2xl border border-white/10'
          )}
        />
        <div className={cn('flex flex-col gap-2.5')}>
          <h1
            className={cn(
              'text-3xl leading-none tracking-tight',
              'font-jetbrains-extrabold'
            )}
          >
            {title}
          </h1>
          <span className={cn('text-sm text-white/55', 'font-jetbrains-light')}>
            {date}
          </span>
          {stack.length > 0 && (
            <div className={cn('flex flex-wrap gap-2')}>
              {stack.map(tech => (
                <TechBadge key={tech} label={tech} />
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
