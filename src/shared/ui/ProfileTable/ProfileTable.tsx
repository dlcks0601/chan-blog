export interface ProfileData {
  name: string;
  birthDate?: string;
  position: string;
  description: string;
  contact: string;
}

interface ProfileTableProps {
  profileData: ProfileData;
  className?: string;
}

export function ProfileTable({
  profileData,
  className = '',
}: ProfileTableProps) {
  const { name, birthDate, position, description, contact } = profileData;

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className='grid grid-cols-2 lg:grid-cols-4 pb-4'>
        <div className='font-jetbrains-light text-sm lg:text-base'>NAME</div>
        <div className='font-jetbrains-light text-sm lg:text-base'>
          POSITION
        </div>
        <div className='font-jetbrains-light text-sm lg:text-base'>
          DESCRIPTION
        </div>
        <div className='font-jetbrains-light text-sm lg:text-base'>CONTACT</div>
      </div>

      {/* 데이터 */}
      <div className='grid grid-cols-2 lg:grid-cols-4 border-t pt-4 min-h-40'>
        <div className='flex flex-col gap-1'>
          <div className='font-jetbrains-bold'>{name}</div>
          {birthDate && (
            <div className='font-jetbrains-light text-sm lg:text-base'>
              {birthDate}
            </div>
          )}
        </div>
        <div className='font-jetbrains-light text-sm lg:text-base'>
          {position}
        </div>
        <div className='font-jetbrains-light text-sm lg:text-base pr-10'>
          {description}
        </div>
        <div className='font-jetbrains-light text-sm lg:text-base underline'>
          {contact}
        </div>
      </div>
    </div>
  );
}
