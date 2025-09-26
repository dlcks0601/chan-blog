// FSD v2.1: Pages First approach - page-specific components stay in the page slice
import {
  HeroSection,
  DescriptionSection,
  AnimatedBackground,
} from './components';

export function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <div className='flex flex-col h-full w-full lg:p-10 relative z-10'>
        <div className='flex w-full flex-col'>
          <HeroSection />
          <DescriptionSection />
        </div>
      </div>
    </>
  );
}
