import fs from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import FeedType from '@/pages/feed/model/feedData';

const feedsDirectory = join(process.cwd(), '_feeds');

const getFeedRawSourceBySlug = (slug: string) => {
  const fullPath = join(feedsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return fileContents;
};

export const getFeedSourceBySlug = async (slug: string) => {
  try {
    const fileContents = getFeedRawSourceBySlug(slug);

    const serializedData = await serialize(fileContents, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        format: 'mdx',
      },
      parseFrontmatter: true,
      // This explicitly tells next-mdx-remote that this content should only be rendered on the client
      scope: {}, // Pass any values you want available to the MDX content
    });

    return {
      ...serializedData,
      feed: { ...serializedData.frontmatter, slug } as FeedType,
    };
  } catch (error) {
    console.error(`Error serializing MDX for slug ${slug}:`, error);
    // Return a valid but empty serialized content to prevent build failures
    return {
      compiledSource: '',
      scope: {},
      frontmatter: {},
      feed: {
        title: 'Error loading feed',
        date: new Date().toISOString(),
        slug,
      } as FeedType,
    };
  }
};

const getFeedFrontmatterBySlug = async (slug: string) => {
  const fileContents = getFeedRawSourceBySlug(slug);

  const serializedData = await serialize(fileContents, {
    parseFrontmatter: true,
  });

  return { ...serializedData.frontmatter, slug } as FeedType;
};

export function getFeedSlugs() {
  return fs.readdirSync(feedsDirectory).map(slug => slug.replace(/\.mdx$/, ''));
}

export const getFeeds = async () => {
  const slugs = getFeedSlugs();

  const feeds = Promise.all(
    slugs.map(slug => getFeedFrontmatterBySlug(slug))
  ).then(sources =>
    sources.sort((feed1, feed2) => (feed1.date > feed2.date ? -1 : 1))
  );

  return feeds;
};
