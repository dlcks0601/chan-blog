import { PageHeader } from '@/shared/ui/PageHeader/PageHeader';
import { ProfileTable } from '@/shared/ui';
import { CareerSection } from './ui/CareerSection';
import {
  meProfileData,
  meCareerData,
  hoveredTexts,
  meProjectData,
} from './model/profileData';
import { ProjectSection } from './ui/ProjectSection/ProjectSection';

export default function MePage() {
  return (
    <div className='flex flex-col'>
      <PageHeader title='Me' />
      <ProfileTable profileData={meProfileData} className='pt-4' />
      <div className='border-t py-4'>
        <h1 className='text-sm lg:text-base font-jetbrains-light'>Career</h1>
      </div>
      <CareerSection careers={meCareerData} hoveredTexts={hoveredTexts} />
      <div className='border-t py-4'>
        <h1 className='text-sm lg:text-base font-jetbrains-light'>Project</h1>
      </div>
      <ProjectSection projects={meProjectData} hoveredTexts={hoveredTexts} />
    </div>
  );
}
