import { cn } from '@/shared/lib/utils';
import { TextLink } from '@/shared/ui';
import { SiteFrame } from '@/widgets/site-frame';
import { resumeCareers, resumeProfile } from '../model/resumeData';
import { ResumeEntry } from './ResumeEntry';

/** 이름 · 포지션 · 연락처 — 흐린 이름표 아래에 값을 둔다. */
function Profile() {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-gutter gap-y-6 lg:grid-cols-9')}>
      <div className={cn('lg:col-span-2')}>
        <dt className={cn('text-muted')}>Name</dt>
        <dd>{resumeProfile.name}</dd>
      </div>
      <div className={cn('lg:col-span-2')}>
        <dt className={cn('text-muted')}>Position</dt>
        <dd>{resumeProfile.position}</dd>
      </div>
      <div className={cn('col-span-2 lg:col-span-5')}>
        <dt className={cn('text-muted')}>Contact</dt>
        <dd>
          <TextLink href={`mailto:${resumeProfile.email}`}>
            {resumeProfile.email}
          </TextLink>
        </dd>
      </div>
    </dl>
  );
}

/** 로고 · 연락처가 있는 왼쪽 줄을 비워 두고, 머리말 높이에서 바로 시작한다. */
export function ResumePage() {
  return (
    <SiteFrame layout='inset'>
      <div className={cn('flex flex-col gap-y-section')}>
        <Profile />
        {resumeCareers.map(entry => (
          <ResumeEntry key={entry.title} entry={entry} />
        ))}
      </div>
    </SiteFrame>
  );
}
