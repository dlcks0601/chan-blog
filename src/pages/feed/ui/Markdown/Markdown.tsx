'use client';

import { useEffect, useState } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

type Props = {
  source: MDXRemoteSerializeResult;
};

export const Markdown = ({ source }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MDXRemote, setMDXRemote] = useState<any>(null);

  useEffect(() => {
    import('next-mdx-remote').then(mod => {
      setMDXRemote(() => mod.MDXRemote);
    });
  }, []);

  if (!MDXRemote) {
    return <div>Loading...</div>;
  }

  return (
    <article
      id='markdown'
      className='leading-loose font-jetbrains-light flex flex-col gap-y-3 w-full pb-20'
    >
      <MDXRemote {...source} components={components} />
    </article>
  );
};

const components = {
  // Headings
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className='text-[1.5rem] lg:text-3xl font-jetbrains-bold pt-4'>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className='text-lg lg:text-xl font-jetbrains-semibold pt-4'>
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className='text-base lg:text-lg font-jetbrains-semibold pt-4'>
      {children}
    </h4>
  ),

  // Lists (ol에도 flex를 넣어 gap이 적용되도록)
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className='list-disc list-inside flex flex-col gap-y-1 font-jetbrains-light'>
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol
      className='list-decimal list-outside pl-8 flex flex-col gap-y-4 font-jetbrains-light 
               [&>li>p:first-child]:inline [&>li>p:first-child]:m-0'
    >
      {children}
    </ol>
  ),

  // Link
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      target='_blank'
      href={href}
      className='inline font-jetbrains-light text-blue-500 hover:text-blue-600 hover:underline'
      rel='noreferrer'
    >
      {children}
    </a>
  ),

  // Image (기본 폭 제한 추가)
  img: ({
    src,
    alt,
    width,
  }: {
    src?: string;
    alt?: string;
    width?: string | number;
  }) => (
    <span className='w-full flex'>
      <img
        src={src ?? ''}
        alt={alt ?? ''}
        width={width}
        className={width ? '' : 'w-full max-w-[640px] rounded-xl'}
      />
    </span>
  ),

  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className='border-l-4 border-white pl-4'>{children}</blockquote>
  ),

  // Table
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className='overflow-x-auto my-6'>
      <table className='w-full border-collapse'>{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className='border-b border-gray-200 hover:bg-gray-50'>{children}</tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className='px-4 py-2 text-left font-jetbrains-medium border border-gray-300'>
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className='px-4 py-2 border border-gray-300 font-jetbrains-light'>
      {children}
    </td>
  ),
};
