import { cn } from '@/shared/lib/utils';
import type { CodeSnippet } from '@/pages/projects/model/types';

type Props = {
  code: CodeSnippet;
};

export function CodeBlock({ code }: Props) {
  return (
    <div
      className={cn('mt-4 overflow-hidden rounded-xl border border-white/10')}
    >
      {code.filename && (
        <div className='border-b border-white/10 bg-white/[0.03] px-4 py-2 font-jetbrains-light text-xs text-white/50'>
          {code.filename}
        </div>
      )}
      <pre className='overflow-x-auto bg-black/40 px-4 py-4'>
        <code className='font-jetbrains text-[12.5px] leading-relaxed text-white/80'>
          {code.content}
        </code>
      </pre>
    </div>
  );
}
