import { PageShell, Writer } from '@/shared/ui';

export function HomePage() {
  return (
    <PageShell>
      <p>
        <Writer
          speed={40}
          highlightWords={['Creative', 'Interactive', '@Github']}
          links={{ '@Github': 'https://github.com/dlcks0601' }}
        >
          {
            "Hello, I'm a Frontend Developer @Github.\nBuild anything. For users.\nInterested in creative and interactive websites and apps."
          }
        </Writer>
      </p>
    </PageShell>
  );
}
