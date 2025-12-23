import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';
import { metadata } from '@/app/config/metadata';
import { Layout } from '@/shared/ui';
import '@/app/styles/globals.css';

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body className={cn('bg-[#131313]', 'text-white')}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
