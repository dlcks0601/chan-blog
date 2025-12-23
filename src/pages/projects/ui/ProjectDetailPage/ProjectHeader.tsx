import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

type Props = {
  title: string;
  date: string;
  category: string;
  tagColor?: string;
};

export const ProjectHeader = ({
  title,
  date,
  category,
  tagColor = 'bg-amber-300',
}: Props) => {
  return (
    <div className={cn('flex flex-col gap-y-1')}>
      <div className={cn('flex items-center justify-between')}>
        <span className={cn('text-3xl', 'font-jetbrains-bold')}>{title}</span>
        <Link
          href='/projects'
          className={cn('text-lg', 'underline', 'font-jetbrains-light')}
        >
          back
        </Link>
      </div>
      <div className={cn('flex flex-col')}>
        <span className={cn('text-lg', 'font-jetbrains-light')}>{date}</span>
      </div>
      <div>
        <span
          className={cn(
            'text-sm',
            'font-jetbrains-light',
            'text-black',
            'w-fit px-1',
            'rounded-md',
            tagColor
          )}
        >
          {category}
        </span>
      </div>
    </div>
  );
};
