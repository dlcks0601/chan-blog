'use client';

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
    } else {
      setIsComplete(true);
    }
  }, [displayIndex, textContent, speed]);

  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }

  const renderHighlightedText = (text: string) => {
    if (highlightWords.length === 0 && Object.keys(links).length === 0) {
      return text;
    }

    const words = text.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      const isHighlighted = highlightWords.some(
        highlight => cleanWord.toLowerCase() === highlight.toLowerCase()
      );

      const linkUrl = links[cleanWord] || links[word];

      return (
        <span key={index}>
          {isHighlighted && linkUrl ? (
            <Link href={linkUrl} target='_blank' className='underline'>
              {word}
            </Link>
          ) : isHighlighted ? (
            <span className='underline'>{word}</span>
          ) : linkUrl ? (
            <Link href={linkUrl} target='_blank' className='underline'>
              {word}
            </Link>
          ) : (
            word
          )}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      );
    });
  };

  const visibleText = textContent.slice(0, displayIndex);

  return (
    <span className={className}>
      {renderHighlightedText(visibleText)}
      {!isComplete && <span className='animate-pulse'>|</span>}
    </span>
  );
}
