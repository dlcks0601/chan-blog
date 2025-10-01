import fs from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import type { Project } from '@/pages/projects/model/types';

const projectsDirectory = join(process.cwd(), '_projects');

const getProjectRawSourceBySlug = (slug: string) => {
  const fullPath = join(projectsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return fileContents;
};

export const getProjectSourceBySlug = async (slug: string) => {
  try {
    const fileContents = getProjectRawSourceBySlug(slug);

    const serializedData = await serialize(fileContents, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        format: 'mdx',
      },
      parseFrontmatter: true,
      scope: {},
    });

    return {
      ...serializedData,
      project: { ...serializedData.frontmatter, slug } as Project,
    };
  } catch (error) {
    console.error(`Error serializing MDX for slug ${slug}:`, error);
    return {
      compiledSource: '',
      scope: {},
      frontmatter: {},
      project: {
        title: 'Error loading project',
        category: '',
        slug,
        imageSrc: '',
        imageAlt: '',
        date: new Date().toISOString(),
      } as Project,
    };
  }
};

const getProjectFrontmatterBySlug = async (slug: string) => {
  const fileContents = getProjectRawSourceBySlug(slug);

  const serializedData = await serialize(fileContents, {
    parseFrontmatter: true,
  });

  return { ...serializedData.frontmatter, slug } as Project;
};

export function getProjectSlugs() {
  return fs
    .readdirSync(projectsDirectory)
    .map(slug => slug.replace(/\.mdx$/, ''));
}

export const getProjects = async () => {
  const slugs = getProjectSlugs();

  const projects = Promise.all(
    slugs.map(slug => getProjectFrontmatterBySlug(slug))
  ).then(sources =>
    sources.sort((project1, project2) =>
      project1.date > project2.date ? -1 : 1
    )
  );

  return projects;
};
