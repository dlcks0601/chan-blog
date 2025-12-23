'use client';

import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

interface WriterProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  highlightWords?: string[];
  links?: { [key: string]: string };
}

export function Writer({
  children,
  speed = 30,
  className = '',
  highlightWords = [],
  links = {},
}: WriterProps) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const textContent = typeof children === 'string' ? children : '';

  useEffect(() => {
    if (displayIndex < textContent.length) {
      const timer = setTimeout(() => {
        setDisplayIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (displayIndex >= textContent.length && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [displayIndex, textContent, speed, isComplete]);

  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }

  const renderHighlightedText = (text: string) => {
    const words = text.split(/(\s+|\n)/);

    return words.map((word, index) => {
      if (word === '\n') {
        return <br key={index} />;
      }

      const cleanWord = word.replace(/[.,!?]/g, '');
      const isHighlighted = highlightWords.some(
        highlight => cleanWord.toLowerCase() === highlight.toLowerCase()
      );

      const linkUrl = links[cleanWord] || links[word];

      return (
        <span key={index}>
          {isHighlighted && linkUrl ? (
            <Link href={linkUrl} target='_blank' className={cn('underline')}>
              {word}
            </Link>
          ) : isHighlighted ? (
            <span className={cn('underline')}>{word}</span>
          ) : linkUrl ? (
            <Link href={linkUrl} target='_blank' className={cn('underline')}>
              {word}
            </Link>
          ) : (
            word
          )}
        </span>
      );
    });
  };

  const visibleText = textContent.slice(0, displayIndex);

  return (
    <span className={className}>
      {renderHighlightedText(visibleText)}
      {!isComplete && <span className={cn('animate-pulse')}>|</span>}
    </span>
  );
}
