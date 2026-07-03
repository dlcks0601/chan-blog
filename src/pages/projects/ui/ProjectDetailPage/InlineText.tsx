import { Fragment } from 'react';

type Props = {
  text: string;
};

/**
 * Renders text with `backtick` segments styled as inline code chips.
 */
export function InlineText({ text }: Props) {
  const parts = text.split('`');

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className='rounded bg-white/10 px-1 py-0.5 font-jetbrains text-[0.9em] text-white/90'
          >
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
