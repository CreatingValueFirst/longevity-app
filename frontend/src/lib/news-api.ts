// Types for news articles
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export interface RSSArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

// GNews API configuration (free tier: 100 requests/day)
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || process.env.NEXT_PUBLIC_GNEWS_API_KEY;
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

// RSS feed URLs for reliable health/longevity news
const RSS_FEEDS = {
  harvard: {
    url: 'https://www.health.harvard.edu/blog/feed',
    name: 'Harvard Health',
  },
  scienceDaily: {
    url: 'https://www.sciencedaily.com/rss/health_medicine.xml',
    name: 'ScienceDaily',
  },
  medicalNews: {
    url: 'https://www.medicalnewstoday.com/rss/health',
    name: 'Medical News Today',
  },
};

/**
 * Fetch health news headlines from GNews API
 */
export async function fetchHealthNews(maxArticles: number = 10): Promise<NewsResponse> {
  if (!GNEWS_API_KEY) {
    // Return fallback data if no API key
    return getFallbackNews();
  }

  try {
    const url = `${GNEWS_BASE_URL}/top-headlines?category=health&lang=en&country=us&max=${maxArticles}&apikey=${GNEWS_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`GNews API error: ${response.status}`);
      return getFallbackNews();
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch health news:', error);
    return getFallbackNews();
  }
}

/**
 * Search for longevity-specific news
 */
export async function searchLongevityNews(
  query: string = 'longevity OR anti-aging OR healthspan',
  maxArticles: number = 10
): Promise<NewsResponse> {
  if (!GNEWS_API_KEY) {
    return getFallbackNews();
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${GNEWS_BASE_URL}/search?q=${encodedQuery}&lang=en&max=${maxArticles}&apikey=${GNEWS_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getFallbackNews();
    }

    return response.json();
  } catch (error) {
    console.error('Failed to search longevity news:', error);
    return getFallbackNews();
  }
}

/**
 * Parse RSS feed
 */
export async function fetchRSSFeed(feedKey: keyof typeof RSS_FEEDS): Promise<RSSArticle[]> {
  const feed = RSS_FEEDS[feedKey];

  try {
    const response = await fetch(feed.url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const items: RSSArticle[] = [];

    // Simple XML parsing
    const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const item of itemMatches.slice(0, 10)) {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                         item.match(/<title>(.*?)<\/title>/);
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                        item.match(/<description>(.*?)<\/description>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

      const title = (titleMatch?.[1] || titleMatch?.[2] || '').replace(/<[^>]*>/g, '');
      const description = (descMatch?.[1] || descMatch?.[2] || '').replace(/<[^>]*>/g, '').slice(0, 200);

      if (title) {
        items.push({
          title,
          description,
          link: linkMatch?.[1] || '',
          pubDate: pubDateMatch?.[1] || '',
          source: feed.name,
        });
      }
    }

    return items;
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${feedKey}:`, error);
    return [];
  }
}

/**
 * Fetch from all RSS feeds
 */
export async function fetchAllRSSFeeds(): Promise<RSSArticle[]> {
  const feeds = await Promise.allSettled([
    fetchRSSFeed('harvard'),
    fetchRSSFeed('scienceDaily'),
    fetchRSSFeed('medicalNews'),
  ]);

  const articles: RSSArticle[] = [];

  for (const result of feeds) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }

  // Sort by date, newest first
  return articles.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

/**
 * Fallback news data when API is not available
 */
function getFallbackNews(): NewsResponse {
  return {
    totalArticles: 6,
    articles: [
      {
        id: '1',
        title: 'New Research Shows Promise in Longevity Interventions',
        description: 'Scientists have discovered new pathways that could extend healthy lifespan through targeted interventions.',
        content: 'Full article content...',
        url: 'https://example.com/longevity-research',
        image: null,
        publishedAt: new Date().toISOString(),
        source: { name: 'Health Research Daily', url: 'https://example.com' },
      },
      {
        id: '2',
        title: 'The Science of Sleep: How Quality Rest Impacts Your Biological Age',
        description: 'Deep sleep stages are crucial for cellular repair and may significantly impact your biological aging process.',
        content: 'Full article content...',
        url: 'https://example.com/sleep-science',
        image: null,
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: { name: 'Sleep Science Journal', url: 'https://example.com' },
      },
      {
        id: '3',
        title: 'Intermittent Fasting: Latest Studies Reveal Metabolic Benefits',
        description: 'Time-restricted eating continues to show promising results for metabolic health and cellular regeneration.',
        content: 'Full article content...',
        url: 'https://example.com/fasting-studies',
        image: null,
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: { name: 'Nutrition Research', url: 'https://example.com' },
      },
      {
        id: '4',
        title: 'Exercise and VO2 Max: The Strongest Predictor of Longevity',
        description: 'Cardiorespiratory fitness remains the most powerful modifiable factor for extending healthy lifespan.',
        content: 'Full article content...',
        url: 'https://example.com/vo2max-longevity',
        image: null,
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        source: { name: 'Fitness Medicine', url: 'https://example.com' },
      },
      {
        id: '5',
        title: 'Biomarkers That Predict Your True Biological Age',
        description: 'Understanding which blood markers best indicate your biological versus chronological age.',
        content: 'Full article content...',
        url: 'https://example.com/biomarkers-age',
        image: null,
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        source: { name: 'Biomarker Research', url: 'https://example.com' },
      },
      {
        id: '6',
        title: 'The Role of Supplements in Healthy Aging',
        description: 'Evidence-based analysis of which supplements show the most promise for longevity.',
        content: 'Full article content...',
        url: 'https://example.com/supplements-aging',
        image: null,
        publishedAt: new Date(Date.now() - 432000000).toISOString(),
        source: { name: 'Supplement Science', url: 'https://example.com' },
      },
    ],
  };
}
