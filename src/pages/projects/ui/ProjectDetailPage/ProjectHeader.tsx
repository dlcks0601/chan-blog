import Link from 'next/link';

type Props = {
  title: string;
  date: string;
  category: string;
  tagColor?: string;
};

export const ProjectHeader = ({
  title,
  date,
  category,
  tagColor = 'bg-amber-300',
}: Props) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <div className='flex items-center justify-between'>
        <span className='text-3xl font-jetbrains-bold'>{title}</span>
        <Link
          href='/projects'
          className='text-lg underline font-jetbrains-light'
        >
          back
        </Link>
      </div>
      <div className='flex flex-col'>
        <span className='text-lg font-jetbrains-light'>{date}</span>
      </div>
      <div>
        <span
          className={`text-sm font-jetbrains-light text-black w-fit px-1 rounded-md ${tagColor}`}
        >
          {category}
        </span>
      </div>
    </div>
  );
};
