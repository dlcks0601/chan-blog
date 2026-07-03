import { cn } from '@/shared/lib/utils';

type Props = {
  stack: string[];
  className?: string;
};

/** Keeps the `#tag` resume character, softened into hoverable pills. */
export function StackTags({ stack, className }: Props) {
  if (stack.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {stack.map(tech => (
        <span
          key={tech}
          className={cn(
            'rounded-[4px] border border-white/20 px-1.5 py-0.5',
            'text-xs text-white/60',
            'font-jetbrains-light',
            'transition-colors duration-200 hover:border-white/50 hover:text-white/90'
          )}
        >
          #{tech}
        </span>
      ))}
    </div>
  );
}
