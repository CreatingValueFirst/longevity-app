'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  ExternalLink,
  Clock,
  TrendingUp,
  Heart,
  Brain,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  fetchHealthNews,
  searchLongevityNews,
  fetchAllRSSFeeds,
  type NewsArticle,
  type RSSArticle,
} from '@/lib/news-api';

// News categories with icons
const categories = [
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'longevity', label: 'Longevity', icon: TrendingUp },
  { id: 'research', label: 'Research', icon: Brain },
];

// Loading skeleton component
function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-muted animate-shimmer flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted rounded animate-shimmer w-1/3" />
            <div className="h-5 bg-muted rounded animate-shimmer w-full" />
            <div className="h-4 bg-muted rounded animate-shimmer w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// News article card component
function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group card-hover">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-3 sm:gap-4">
            {article.image ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-primary/20 to-chart-4/20 flex items-center justify-center flex-shrink-0">
                <Newspaper className="h-8 w-8 text-primary/60" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary" className="text-xs font-medium">
                  {article.source.name}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {publishedDate}
                </span>
              </div>
              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                {article.description}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2 font-medium"
              >
                Read more <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// RSS article card component
function RSSCard({ article, index }: { article: RSSArticle; index: number }) {
  const publishedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden group card-hover">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-2/20 to-primary/20 flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 text-chart-2" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {article.source}
                </Badge>
                {publishedDate && (
                  <span className="text-xs text-muted-foreground">{publishedDate}</span>
                )}
              </div>
              <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {article.description}
              </p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2 font-medium"
              >
                Read article <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Featured news card
function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden glass-card border-0">
        <div className="relative">
          {article.image ? (
            <div className="h-40 sm:h-48 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-primary/30 via-chart-4/20 to-chart-2/30 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-primary/60" />
            </div>
          )}
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
            Featured
          </Badge>
        </div>
        <CardContent className="p-4 -mt-8 relative z-10">
          <Badge variant="secondary" className="mb-2">
            {article.source.name}
          </Badge>
          <h2 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2">
            {article.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.description}
          </p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
          >
            Read full article <ExternalLink className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState('health');
  const [healthNews, setHealthNews] = useState<NewsArticle[]>([]);
  const [longevityNews, setLongevityNews] = useState<NewsArticle[]>([]);
  const [researchNews, setResearchNews] = useState<RSSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    try {
      const [health, longevity, research] = await Promise.all([
        fetchHealthNews(10),
        searchLongevityNews('longevity OR anti-aging OR healthspan OR biohacking', 10),
        fetchAllRSSFeeds(),
      ]);

      setHealthNews(health.articles || []);
      setLongevityNews(longevity.articles || []);
      setResearchNews(research || []);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const featuredArticle = healthNews[0] || longevityNews[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-chart-4/20">
              <Newspaper className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <span className="gradient-text">Health & Longevity News</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with the latest research and discoveries
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Featured Article */}
      {!loading && featuredArticle && (
        <FeaturedNewsCard article={featuredArticle} />
      )}

      {/* Quick Category Stats */}
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                activeTab === cat.id
                  ? 'border-primary bg-primary/5 shadow-premium'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setActiveTab(cat.id)}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center">
                <div
                  className={`p-2 rounded-lg mb-2 ${
                    activeTab === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <cat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs sm:text-sm font-medium">{cat.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="text-xs sm:text-sm py-2"
            >
              <cat.icon className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{cat.label}</span>
              <span className="sm:hidden">{cat.label.slice(0, 4)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="health" className="mt-4 sm:mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid gap-3 sm:gap-4">
                {[...Array(5)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {healthNews.slice(1).map((article, index) => (
                  <NewsCard
                    key={article.id || index}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="longevity" className="mt-4 sm:mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid gap-3 sm:gap-4">
                {[...Array(5)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {longevityNews.map((article, index) => (
                  <NewsCard
                    key={article.id || index}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="research" className="mt-4 sm:mt-6">
          <Card className="mb-4 bg-muted/50">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-chart-2" />
                Curated research from Harvard Health, ScienceDaily & Medical News Today
              </p>
            </CardContent>
          </Card>
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid gap-3 sm:gap-4">
                {[...Array(5)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {researchNews.slice(0, 15).map((article, index) => (
                  <RSSCard
                    key={`rss-${index}`}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Load More */}
      {!loading && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="w-full sm:w-auto">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
}
