import { cn } from '@/shared/lib/utils';
import { PageShell } from '@/shared/ui';
import {
  resumeCareers,
  resumeProfile,
  resumeSideProjects,
} from '../model/resumeData';
import { ResumeEntry } from './ResumeEntry';

const PROFILE_GRID = 'grid grid-cols-2 md:grid-cols-4';

function ProfileHeader() {
  return (
    <div>
      <div className={cn(PROFILE_GRID, 'pb-2 text-xs text-neutral-500')}>
        <div>ID /</div>
        <div>Position /</div>
        <div>Contact /</div>
      </div>
      <div className={cn(PROFILE_GRID, 'min-h-20 pt-1 text-xs')}>
        <div>
          <div className={cn('font-semibold')}>{resumeProfile.name}</div>
          <div className={cn('text-neutral-400')}>
            {resumeProfile.birthDate}
          </div>
        </div>
        <div>{resumeProfile.position}</div>
        <a
          href={`mailto:${resumeProfile.email}`}
          className={cn('w-fit underline')}
        >
          {resumeProfile.email}
        </a>
      </div>
    </div>
  );
}

export function ResumePage() {
  return (
    <PageShell>
      <div className={cn('flex flex-col gap-y-8', 'w-full pt-3')}>
        <ProfileHeader />
        <div className={cn('flex flex-col')}>
          {resumeCareers.map(entry => (
            <ResumeEntry key={entry.title} entry={entry} />
          ))}
        </div>
        <div className={cn('flex flex-col')}>
          <div className={cn('pb-2 text-xs text-neutral-500')}>Projects /</div>
          {resumeSideProjects.map(entry => (
            <ResumeEntry key={entry.title} entry={entry} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
