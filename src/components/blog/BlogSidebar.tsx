
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Tag, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogCategory } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";

interface BlogSidebarProps {
  blogStats: {
    total: number;
    categories: BlogCategory[];
  };
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ blogStats }) => {
  const { t, currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<{ title: string; slug: string; date: string }[]>([]);

  useEffect(() => {
    // Extract popular tags from all blog posts (combining categories and keywords)
    const allContent = storageService.getAllContent();
    const blogPosts = allContent.filter(item => 
      item.type === "Blog Post" && 
      item.published === true &&
      (!item.language || item.language === currentLanguage)
    );
    
    // Get tags frequency (from seoKeywords)
    const tagsMap = new Map<string, number>();
    
    blogPosts.forEach(post => {
      if (post.seoKeywords && Array.isArray(post.seoKeywords)) {
        post.seoKeywords.forEach(keyword => {
          if (typeof keyword === 'string') {
            const count = tagsMap.get(keyword) || 0;
            tagsMap.set(keyword, count + 1);
          }
        });
      }
    });
    
    // Sort by frequency and get top 10
    const sortedTags = Array.from(tagsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
    
    setPopularTags(sortedTags);
    
    // Get recent posts
    const recent = blogPosts
      .sort((a, b) => {
        const dateA = a.publishDate || a.lastUpdated;
        const dateB = b.publishDate || b.lastUpdated;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        slug: post.slug || '',
        date: post.publishDate || post.lastUpdated
      }));
    
    setRecentPosts(recent);
  }, [currentLanguage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4">{t('blog.search')}</h3>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            placeholder={t('blog.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Categories */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4">{t('blog.categories')}</h3>
        {blogStats.categories.length > 0 ? (
          <div className="space-y-2">
            {blogStats.categories.map((category) => (
              <div key={category.id} className="flex justify-between items-center">
                <Link
                  to={`/blog?category=${encodeURIComponent(category.slug)}`}
                  className="hover:text-primary transition-colors text-sm"
                >
                  {category.name}
                </Link>
                <Badge variant="secondary">{category.count}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{t('blog.noCategories')}</p>
        )}
      </div>

      {/* Recent Posts */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4">{t('blog.recentPosts')}</h3>
        {recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <div key={index} className="space-y-1">
                <Link
                  to={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors text-sm font-medium"
                >
                  {post.title}
                </Link>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{t('blog.noPosts')}</p>
        )}
      </div>

      {/* Popular Tags */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4">{t('blog.popularTags')}</h3>
        {popularTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <Link key={index} to={`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">{t('blog.noTags')}</p>
        )}
      </div>
    </div>
  );
};

export default BlogSidebar;
