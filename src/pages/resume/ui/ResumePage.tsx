import { cn } from '@/shared/lib/utils';
import { Logo, SiteNav } from '@/shared/ui';
import {
  resumeCareers,
  resumeProfile,
  resumeSideProjects,
} from '../model/resumeData';
import { ResumeSection } from './ResumeSection';

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={cn(
        'grid gap-x-10',
        'grid-cols-[5.5rem_1fr] md:grid-cols-[1fr_5fr]'
      )}
    >
      <span className={cn('text-neutral-500')}>{label} /</span>
      <span>{value}</span>
    </div>
  );
}

export function ResumePage() {
  return (
    <main className={cn('flex flex-col', 'py-10')}>
      <div
        className={cn(
          'flex flex-col',
          'md:grid md:gap-x-10 md:grid-cols-[1fr_3fr_2fr]'
        )}
      >
        <div>
          <Logo />
          <SiteNav className={cn('flex md:hidden', 'pt-10 text-sm')} />
        </div>
        <div className={cn('flex flex-col gap-16', 'pb-24 text-base')}>
          <section className={cn('flex flex-col gap-1', 'pt-10 md:pt-0')}>
            <ProfileRow label='ID' value={resumeProfile.name} />
            <ProfileRow label='Position' value={resumeProfile.position} />
            <ProfileRow label='Contact' value={resumeProfile.contact} />
          </section>
          <div className={cn('flex flex-col gap-12')}>
            {resumeCareers.map(career => (
              <ResumeSection key={career.company} career={career} />
            ))}
          </div>
          <hr className={cn('border-neutral-800')} />
          <div className={cn('flex flex-col gap-12')}>
            <h2 className={cn('text-sm text-neutral-500')}>Projects</h2>
            {resumeSideProjects.map(project => (
              <ResumeSection key={project.company} career={project} />
            ))}
          </div>
        </div>
        <SiteNav className={cn('hidden md:flex')} />
      </div>
    </main>
  );
}
