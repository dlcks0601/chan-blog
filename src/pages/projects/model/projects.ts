import { projects } from './data';
import type { ProjectDetail, ProjectSummary } from './types';

/** Newest first, by date range string (e.g. "2025.09 - 2025.10"). */
const byDateDesc = (a: ProjectDetail, b: ProjectDetail) =>
  a.date > b.date ? -1 : 1;

export function getProjectSlugs(): string[] {
  return projects.map(project => project.slug);
}

export function getProjectSummaries(): ProjectSummary[] {
  return [...projects]
    .sort(byDateDesc)
    .map(({ slug, title, date, cover, stack }) => ({
      slug,
      title,
      date,
      cover,
      stack,
    }));
}

export function getProjectBySlug(slug: string): ProjectDetail | undefined {
  return projects.find(project => project.slug === slug);
}
