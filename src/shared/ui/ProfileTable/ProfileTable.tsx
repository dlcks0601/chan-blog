import { cn } from '@/shared/lib/utils';

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
      <div className={cn('grid grid-cols-2 lg:grid-cols-4', 'pb-4')}>
        <div className={cn('text-sm lg:text-base', 'font-jetbrains-light')}>
          NAME
        </div>
        <div className={cn('text-sm lg:text-base', 'font-jetbrains-light')}>
          POSITION
        </div>
        <div className={cn('text-sm lg:text-base', 'font-jetbrains-light')}>
          DESCRIPTION
        </div>
        <div className={cn('text-sm lg:text-base', 'font-jetbrains-light')}>
          CONTACT
        </div>
      </div>

      <div
        className={cn(
          'grid grid-cols-2 lg:grid-cols-4',
          'gap-y-6 lg:gap-y-0',
          'border-t',
          'pt-4'
        )}
      >
        <div className={cn('flex flex-col gap-1')}>
          <div className={cn('font-jetbrains-bold')}>{name}</div>
          {birthDate && (
            <div className={cn('text-sm lg:text-base', 'font-jetbrains-light')}>
              {birthDate}
            </div>
          )}
        </div>
        <div className={cn('text-sm lg:text-base', 'font-jetbrains-light')}>
          {position}
        </div>
        <div
          className={cn(
            'text-sm lg:text-base',
            'font-jetbrains-light',
            'pr-10'
          )}
        >
          {description}
        </div>
        <div
          className={cn(
            'text-sm lg:text-base',
            'font-jetbrains-light',
            'underline'
          )}
        >
          {contact}
        </div>
      </div>
    </div>
  );
}
