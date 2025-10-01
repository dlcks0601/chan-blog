import { FeedPage } from '@/pages/feed/ui/FeedPage';
import { getFeeds } from '@/entities/Feed/api/feed.api';

export default async function Feeds() {
  const allFeeds = await getFeeds();
  return <FeedPage feeds={allFeeds} />;
}
