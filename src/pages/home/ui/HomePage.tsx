import { cn } from '@/shared/lib/utils';
import { Logo, SiteNav, SocialLinks, Writer } from '@/shared/ui';

export function HomePage() {
  return (
    <main className={cn('h-full', 'flex flex-col justify-between', 'py-10')}>
      <div
        className={cn(
          'grid gap-x-10',
          'grid-cols-[1fr_4fr] md:grid-cols-[1fr_3fr_2fr]'
        )}
      >
        <div>
          <Logo />
          <SiteNav className={cn('flex md:hidden', 'pt-10 text-sm')} />
        </div>
        <p>
          <Writer
            speed={40}
            highlightWords={['@Github']}
            links={{ '@Github': 'https://github.com/dlcks0601' }}
          >
            {
              "Hello, I'm a Frontend Developer @Github.\nBuild anything. For users."
            }
          </Writer>
        </p>
        <SiteNav className={cn('hidden md:flex')} />
      </div>
      <SocialLinks />
    </main>
  );
}
