import { cn } from '@/shared/lib/utils';

interface SignatureProps {
  className?: string;
}

/** 연락처 묶음 맨 아래에 붙는 서명 — 크기는 연락처와 같고 굵기로만 구분한다. */
export function Signature({ className }: SignatureProps) {
  return (
    <span className={cn('font-semibold tracking-tight', className)}>
      @leechan
    </span>
  );
}
