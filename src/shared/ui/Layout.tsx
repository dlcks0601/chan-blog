import { cn } from '@/shared/lib/utils';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={cn('h-screen w-full', 'flex flex-col', 'px-4', className)}>
      <div className={cn('flex flex-col', 'w-full', 'h-0 grow')}>
        {children}
      </div>
    </div>
  );
};
