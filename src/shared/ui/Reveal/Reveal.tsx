'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Subtle fade + rise as the entry scrolls into view. */
export function Reveal({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
