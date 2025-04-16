import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Tag as TagIcon, Calendar, Hash, TrendingUp, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { storageService } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

interface BlogSidebarProps {
  blogStats?: {
    total: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
  };
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ blogStats }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Get popular posts from the CMS based on most recent
  const allContent = storageService.getAllContent();
  const popularPosts = allContent
    .filter(item => item.type === "Blog Post" && item.published)
    .sort((a, b) => {
      const dateA = a.publishDate || a.lastUpdated;
      const dateB = b.publishDate || b.lastUpdated;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);
  
  // Extract and count tags from all blog posts
  const tagCounts = allContent
    .filter(item => item.type === "Blog Post" && item.published)
    .flatMap(post => post.seoKeywords || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder={t("Search articles...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          >
            <Search className="w-4 h-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </Card>

      {/* Popular Posts */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t("Popular Posts")}
        </h3>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="relative">
                  {post.images && post.images.length > 0 && (
                    <div className="aspect-[16/9] rounded-md overflow-hidden mb-2">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.publishDate || post.lastUpdated}>
                      {new Date(post.publishDate || post.lastUpdated).toLocaleDateString()}
                    </time>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Categories */}
      {blogStats?.categories && blogStats.categories.length > 0 && (
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            {t("Categories")}
          </h3>
          <div className="space-y-2">
            {blogStats.categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={`/blog/category/${encodeURIComponent(category.name.toLowerCase())}`}
                  className="flex items-center justify-between group p-2 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  <Badge variant="secondary">
                    {category.count}
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Tags Cloud */}
      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          {t("Popular Tags")}
        </h3>
        <ScrollArea className="h-[180px] pr-4">
          <div className="flex flex-wrap gap-2">
            {sortedTags.map(([tag, count], index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                  className="group"
                >
                  <Badge
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer transition-all hover:scale-110"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                    <span className="ml-1 text-xs">({count})</span>
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* SEO-optimized hidden content */}
      <div className="sr-only">
        <h2>Blog Categories and Tags</h2>
        <div>
          <h3>Categories</h3>
          <ul>
            {blogStats?.categories.map(category => (
              <li key={category.name}>{category.name} ({category.count} articles)</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Popular Tags</h3>
          <ul>
            {sortedTags.map(([tag, count]) => (
              <li key={tag}>{tag} ({count} articles)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
