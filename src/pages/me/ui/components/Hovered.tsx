'use client';

import { cn } from '@/shared/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

type Props = {
  children: string;
  imageUrl?: string;
};

export const Hovered = ({ children, imageUrl }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={cn('relative overflow-visible inline-block')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.span
          animate={{
            backgroundPosition: '300% 0',
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className={cn(
            'inline',
            'font-bold',
            'bg-gradient-to-r from-[#ffffff] via-[#f7a373] to-[#ffffff]',
            'bg-[length:300%_100%]',
            'bg-clip-text text-transparent'
          )}
        >
          {children}
        </motion.span>
        <AnimatePresence>
          {isHovered && (
            <motion.img
              src={imageUrl}
              className={cn(
                'fixed z-1',
                'bottom-1 right-1',
                'rounded-2xl',
                'origin-bottom-right',
                'max-w-[calc(100vw-2rem)] max-h-[60vh]',
                'lg:max-w-[500px] lg:max-h-[500px]'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
