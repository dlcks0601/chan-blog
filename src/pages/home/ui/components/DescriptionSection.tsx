// FSD v2.1: Page-specific component - only used on home page
import { Writer } from '@/shared/ui/Writer/Writer';
import { Menu } from '../Menu/Menu';

export function DescriptionSection() {
  return (
    <div className='flex flex-col'>
      <div>
        <Menu
          itemClassName='text-[1rem] lg:text-[2rem] font-jetbrains-light'
          items={[
            { href: '/feeds', label: 'Feed' },
            { href: '/me', label: 'me' },
            { href: '/projects', label: '?' },
          ]}
        />
      </div>
      <section className='w-full pb-5 pt-5 text-white font-jetbrains-light text-[1rem] lg:text-[2rem]'>
        <Writer
          speed={60}
          highlightWords={['Creative', 'Interactive', 'Comfortable', '@Github']}
          links={{ '@Github': 'https://github.com/dlcks0601' }}
        >
          {
            "Hello, I'm a Frontend Developer @Github.\nBuild anything. For users.\nInterested in creative and interactive websites and apps."
          }
        </Writer>
      </section>
    </div>
  );
}
