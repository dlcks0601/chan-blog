import { cn } from '@/shared/lib/utils';
import { HighlightedText, type HoveredText } from './HighlightedText';

type Props = {
  items: string[];
  hoveredTexts?: HoveredText[];
};

export function AchievementList({ items, hoveredTexts = [] }: Props) {
  return (
    <ul className={cn('flex flex-col gap-2')}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            'relative pl-4',
            'text-[13px] leading-relaxed text-white/75',
            'font-jetbrains-light'
          )}
        >
          <span className='absolute left-0 text-white/30'>-</span>
          <HighlightedText text={item} hoveredTexts={hoveredTexts} />
        </li>
      ))}
    </ul>
  );
}
