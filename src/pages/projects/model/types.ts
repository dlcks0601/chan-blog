export interface ProjectMedia {
  src: string;
  alt: string;
}

export interface CoreItem {
  title: string;
  media?: ProjectMedia;
  points: string[];
}

export interface CodeSnippet {
  filename?: string;
  language?: string;
  content: string;
}

export interface ProblemSolveItem {
  title: string;
  problem: string[];
  solve: string[];
  code?: CodeSnippet;
}

export interface ProjectDetail {
  slug: string;
  title: string;
  date: string;
  cover: ProjectMedia;
  /** Tech stack shown as glass badges in the header. */
  stack: string[];
  introduce: string[];
  experience: string[];
  core?: CoreItem[];
  problemSolve?: ProblemSolveItem[];
}

/** Lightweight view used by the projects list/cards. */
export type ProjectSummary = Pick<
  ProjectDetail,
  'slug' | 'title' | 'date' | 'cover' | 'stack'
>;
