type FeedType = {
  slug: string;
  title: string;
  date: string;
  coverImage?: string;
  ogImage?: {
    url: string;
  };
  content: string;
};

export default FeedType;
