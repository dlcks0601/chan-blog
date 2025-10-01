import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  className?: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className={`flex items-end justify-between`}>
      <h2 className='text-[4rem] lg:text-[6rem] text-white leading-[1.2]'>
        {title}
      </h2>
      <Link
        href='/'
        className='text-[1rem] lg:text-[1.5rem] text-white underline font-jetbrains-light'
      >
        Home
      </Link>
    </div>
  );
}
