import type { ReactNode } from 'react';
import type { ProjectDetail } from '@/pages/projects/model/types';
import { IntroduceSection } from './IntroduceSection';
import { ExperienceSection } from './ExperienceSection';
import { CoreSection } from './CoreSection';
import { ProblemSolveSection } from './ProblemSolveSection';

type Props = {
  project: ProjectDetail;
};

export const ProjectContent = ({ project }: Props) => {
  const sections: ReactNode[] = [];
  let index = 1;

  sections.push(
    <IntroduceSection
      key='introduce'
      index={index++}
      paragraphs={project.introduce}
    />
  );
  sections.push(
    <ExperienceSection
      key='experience'
      index={index++}
      items={project.experience}
    />
  );
  if (project.core?.length) {
    sections.push(
      <CoreSection key='core' index={index++} items={project.core} />
    );
  }
  if (project.problemSolve?.length) {
    sections.push(
      <ProblemSolveSection
        key='problem-solve'
        index={index++}
        items={project.problemSolve}
      />
    );
  }

  return <div className='flex flex-col gap-12'>{sections}</div>;
};
