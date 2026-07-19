import { cn } from '@/shared/lib/utils';

const SOCIALS = [
  { label: 'Github', href: 'https://github.com/dlcks0601' },
  { label: 'Email', href: 'mailto:comfyofmymind@gmail.com' },
];

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {SOCIALS.map(social => (
        <a
          key={social.label}
          href={social.href}
          target='_blank'
          rel='noreferrer'
          className={cn('w-fit', 'hover:underline')}
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}
