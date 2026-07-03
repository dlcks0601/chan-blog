import { cn } from '@/shared/lib/utils';

type Props = {
  index: number;
  title: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function SectionHeading({ index, title }: Props) {
  return (
    <div
      className={cn(
        'flex items-baseline gap-4',
        'border-b border-white/10 pb-2.5 mb-5'
      )}
    >
      <span className='font-jetbrains-bold text-3xl leading-none text-white/35'>
        {pad(index)}
      </span>
      <span className='font-jetbrains-medium text-sm uppercase tracking-[0.16em] text-white/80'>
        {title}
      </span>
    </div>
  );
}
