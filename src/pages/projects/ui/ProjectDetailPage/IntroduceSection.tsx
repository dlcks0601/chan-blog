import { SectionHeading } from './SectionHeading';

type Props = {
  index: number;
  paragraphs: string[];
};

export function IntroduceSection({ index, paragraphs }: Props) {
  return (
    <section>
      <SectionHeading index={index} title='Introduce' />
      <div className='flex flex-col gap-3.5'>
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className='font-jetbrains-light text-sm leading-[1.85] text-white/65'
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
