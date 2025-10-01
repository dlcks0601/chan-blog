import Link from 'next/link';

interface ProjectCardProps {
  slug: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  category: string;
  tagColor?: string;
}

export function ProjectCard({
  slug,
  imageSrc,
  imageAlt,
  title,
  category,
  tagColor,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className='flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity'
    >
      <img src={imageSrc} alt={imageAlt} />
      <div className='flex flex-col gap-1'>
        <div className='text-lg font-jetbrains'>{title}</div>
        <div
          className={`text-sm font-jetbrains-light text-black w-fit px-1 rounded-md ${tagColor}`}
        >
          {category}
        </div>
      </div>
    </Link>
  );
}
