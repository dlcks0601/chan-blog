import { cn } from '@/shared/lib/utils';
import type { CoreItem } from '@/pages/projects/model/types';
import { SectionHeading } from './SectionHeading';
import { InlineText } from './InlineText';

type Props = {
  index: number;
  items: CoreItem[];
};

const pad = (n: number) => String(n).padStart(2, '0');

export function CoreSection({ index, items }: Props) {
  return (
    <section>
      <SectionHeading index={index} title='Core' />
      <div className='flex flex-col gap-9'>
        {items.map((item, i) => (
          <div key={i}>
            <div className='mb-4 flex items-baseline gap-2.5 font-jetbrains-medium text-sm text-white/90'>
              <span className='font-jetbrains-bold text-white/45'>
                {pad(i + 1)}
              </span>
              <span>{item.title}</span>
            </div>
            <div className='flex flex-col gap-5 sm:flex-row'>
              {item.media && (
                <img
                  src={item.media.src}
                  alt={item.media.alt}
                  className={cn(
                    'h-auto w-full max-w-[220px] shrink-0',
                    'rounded-xl border border-white/10'
                  )}
                />
              )}
              <ul className='flex flex-1 flex-col gap-2'>
                {item.points.map((point, j) => (
                  <li
                    key={j}
                    className='relative pl-4 font-jetbrains-light text-[12.5px] leading-relaxed text-white/65'
                  >
                    <span className='absolute left-0 text-white/25'>—</span>
                    <InlineText text={point} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
