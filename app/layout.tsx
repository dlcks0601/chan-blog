import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';
import { metadata } from '@/app/config/metadata';
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from '@/shared/config';
import { Layout } from '@/shared/ui';
import '@/app/styles/globals.css';

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko' data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={cn(
          'bg-canvas text-ink',
          'font-sans text-base font-light antialiased'
        )}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
