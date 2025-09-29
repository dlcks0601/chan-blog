// FSD v2.1: Page-specific component - only used on home page
import { Writer } from '@/shared/ui/Writer/Writer';
import { Menu } from '../menu/Menu';

export function DescriptionSection() {
  return (
    <div className='flex flex-col'>
      <div>
        <Menu
          itemClassName='text-[1rem] lg:text-[3rem] font-jetbrains-bold'
          items={[
            { href: '/feeds', label: 'Feed' },
            { href: '/me', label: 'me' },
            { href: '/playground', label: '?' },
          ]}
        />
      </div>
      <section className='w-full pb-5 pt-5 text-white font-jetbrains-bold text-[1rem] lg:text-[3rem]'>
        <Writer
          speed={60}
          highlightWords={['Creative', 'Interactive', 'Comfortable', '@Github']}
          links={{ '@Github': 'https://github.com/dlcks0601' }}
        >
          Hello, I&apos;m a Frontend Developer @Github.
        </Writer>
      </section>
    </div>
  );
}
