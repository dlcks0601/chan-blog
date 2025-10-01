import { getFeedSlugs } from '@/entities/Feed/api/feed.api';
import FeedDetailPage from '@/pages/feed/ui/FeedDetailPage';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getFeedSlugs();

  return slugs.map(slug => ({
    slug,
  }));
}

export default async function Page({ params }: Props) {
  return <FeedDetailPage params={params} />;
}
