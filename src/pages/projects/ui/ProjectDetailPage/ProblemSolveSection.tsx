import { cn } from '@/shared/lib/utils';
import type { ProblemSolveItem } from '@/pages/projects/model/types';
import { SectionHeading } from './SectionHeading';
import { InlineText } from './InlineText';
import { CodeBlock } from './CodeBlock';

type Props = {
  index: number;
  items: ProblemSolveItem[];
};

const pad = (n: number) => String(n).padStart(2, '0');

function Block({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'border-l-2 pl-4',
        accent ? 'border-white/25' : 'border-white/15'
      )}
    >
      <div
        className={cn(
          'mb-1.5 font-jetbrains-medium text-[10.5px] uppercase tracking-[0.14em]',
          accent ? 'text-white/60' : 'text-white/45'
        )}
      >
        {label}
      </div>
      <ul className='flex flex-col gap-1'>
        {items.map((item, i) => (
          <li
            key={i}
            className='font-jetbrains-light text-[12.5px] leading-relaxed text-white/65'
          >
            <InlineText text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProblemSolveSection({ index, items }: Props) {
  return (
    <section>
      <SectionHeading index={index} title='Problem & Solve' />
      <div className='flex flex-col gap-7'>
        {items.map((item, i) => (
          <div key={i}>
            <div className='mb-3 font-jetbrains-medium text-[13.5px] text-white/90'>
              <span className='mr-2 font-jetbrains-bold text-white/45'>
                {pad(i + 1)}
              </span>
              {item.title}
            </div>
            <div className='flex flex-col gap-3'>
              <Block label='Problem' items={item.problem} />
              <Block label='Solve' items={item.solve} accent />
            </div>
            {item.code && <CodeBlock code={item.code} />}
          </div>
        ))}
      </div>
    </section>
  );
}
