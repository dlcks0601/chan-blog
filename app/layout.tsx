import { ReactNode } from 'react';
import { metadata } from '@/app/config/metadata';
import { Layout } from '@/shared/ui';
import '@/app/styles/globals.css';

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body className='bg-black text-white'>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
