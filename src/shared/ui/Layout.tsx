import { cn } from '@/shared/lib/utils';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div
      className={cn(
        'min-h-screen w-full',
        'flex flex-col',
        'px-gutter',
        className
      )}
    >
      <div className={cn('flex flex-col', 'w-full', 'grow')}>{children}</div>
    </div>
  );
};
