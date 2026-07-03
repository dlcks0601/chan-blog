import { SectionHeading } from './SectionHeading';
import { InlineText } from './InlineText';

type Props = {
  index: number;
  items: string[];
};

export function ExperienceSection({ index, items }: Props) {
  return (
    <section>
      <SectionHeading index={index} title='Experience' />
      <ul>
        {items.map((item, i) => (
          <li
            key={i}
            className='flex gap-3 border-b border-white/[0.06] py-2.5 font-jetbrains-light text-[13px] leading-relaxed text-white/70'
          >
            <span className='text-white/30'>—</span>
            <span>
              <InlineText text={item} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
