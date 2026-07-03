import type { ReactNode } from 'react';
import { Hovered } from './Hovered';

export interface HoveredText {
  text: string;
  imageUrl: string;
}

type Props = {
  text: string;
  hoveredTexts?: HoveredText[];
};

/**
 * Renders plain text, wrapping any phrase listed in `hoveredTexts`
 * with the gradient <Hovered> component (shows an image preview on hover).
 * Recurses over the remainder so multiple / repeated phrases all match.
 */
export function HighlightedText({ text, hoveredTexts = [] }: Props): ReactNode {
  const match = hoveredTexts.find(ht => ht.text && text.includes(ht.text));
  if (!match) return text;

  const splitAt = text.indexOf(match.text);
  const before = text.slice(0, splitAt);
  const after = text.slice(splitAt + match.text.length);

  return (
    <>
      {before}
      <Hovered imageUrl={match.imageUrl}>{match.text}</Hovered>
      <HighlightedText text={after} hoveredTexts={hoveredTexts} />
    </>
  );
}
