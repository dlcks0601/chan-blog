'use client';

import { cn } from '@/shared/lib/utils';
import { useEffect, useState } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

type Props = {
  source: MDXRemoteSerializeResult;
};

/**
 * MDX 마크다운 렌더링 컴포넌트
 * - 블로그 포스트의 마크다운 콘텐츠를 렌더링
 * - 커스텀 스타일이 적용된 HTML 요소 제공
 */
export const Markdown = ({ source }: Props) => {
   
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
      className={cn(
        'flex flex-col',
        'w-full',
        'gap-y-3',
        'pb-20',
        'leading-loose',
        'font-jetbrains-light'
      )}
    >
      <MDXRemote {...source} components={components} />
    </article>
  );
};

/** MDX 커스텀 컴포넌트 매핑 */
const components = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2
      className={cn('text-[1.5rem] lg:text-3xl', 'font-jetbrains-bold', 'pt-4')}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className={cn('text-lg lg:text-xl', 'font-jetbrains-semibold', 'pt-4')}>
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4
      className={cn('text-base lg:text-lg', 'font-jetbrains-semibold', 'pt-4')}
    >
      {children}
    </h4>
  ),

  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul
      className={cn(
        'list-disc list-inside', // disc: 원형 불릿, inside: 마커가 텍스트 영역 안쪽
        'flex flex-col gap-y-1',
        'font-jetbrains-light'
      )}
    >
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol
      className={cn(
        'list-decimal list-outside', // decimal: 숫자 리스트, outside: 마커가 텍스트 영역 밖쪽
        'pl-8',
        'flex flex-col gap-y-4',
        'font-jetbrains-light',
        '[&>li>p:first-child]:inline [&>li>p:first-child]:m-0' // li 내부 첫 p 태그를 인라인으로, 마진 제거
      )}
    >
      {children}
    </ol>
  ),

  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      target='_blank'
      href={href}
      className={cn(
        'inline',
        'font-jetbrains-light',
        'text-blue-500',
        'hover:text-blue-600 hover:underline'
      )}
      rel='noreferrer'
    >
      {children}
    </a>
  ),

  img: ({
    src,
    alt,
    width,
  }: {
    src?: string;
    alt?: string;
    width?: string | number;
  }) => (
    <span className={cn('w-full flex')}>
      <img
        src={src ?? ''}
        alt={alt ?? ''}
        width={width}
        className={width ? '' : cn('w-full max-w-[640px]', 'rounded-xl')}
      />
    </span>
  ),

  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className={cn('border-l-4 border-white', 'pl-4')}>
      {children}
    </blockquote>
  ),

  table: ({ children }: { children?: React.ReactNode }) => (
    <div className={cn('overflow-x-auto', 'my-6')}>
      <table className={cn('w-full border-collapse')}>{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className={cn('border-b border-gray-200', 'hover:bg-gray-50')}>
      {children}
    </tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th
      className={cn(
        'px-4 py-2',
        'text-left',
        'font-jetbrains-medium',
        'border border-gray-300'
      )}
    >
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td
      className={cn(
        'px-4 py-2',
        'border border-gray-300',
        'font-jetbrains-light'
      )}
    >
      {children}
    </td>
  ),
};
