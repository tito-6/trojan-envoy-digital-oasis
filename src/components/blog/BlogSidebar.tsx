
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogCategory, ContentItem } from "@/lib/types";
import { storageService } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface BlogSidebarProps {
  blogStats?: {
    total: number;
    categories: BlogCategory[];
  };
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ blogStats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use provided categories from blogStats or fallback to empty array
  const categories = blogStats?.categories || [];
  
  // Get popular posts from the CMS based on most recent
  const allContent = storageService.getAllContent();
  const popularPosts = allContent
    .filter(item => item.type === "Blog Post" && item.published)
    .sort((a, b) => {
      const dateA = a.publishDate || a.lastUpdated;
      const dateB = b.publishDate || b.lastUpdated;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);
  
  // Extract tags from all blog posts
  const tags = Array.from(
    new Set(
      allContent
        .filter(item => item.type === "Blog Post" && item.published)
        .flatMap(post => post.seoKeywords || [])
    )
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchTerm)}`);
      toast({
        title: "Searching for",
        description: searchTerm,
      });
    }
  };
  
  return (
    <div className="space-y-8 should-animate">
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {categories.length > 0 ? (
            <ul className="divide-y divide-border">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={`/blog/category/${category.name.toLowerCase()}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-secondary/50 transition-colors"
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-muted-foreground">({category.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-4 text-muted-foreground text-sm">
              No categories found. Add some blog posts with keywords to create categories.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Popular Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {popularPosts.length > 0 ? (
            <ul className="divide-y divide-border">
              {popularPosts.map((post) => (
                <li key={post.id} className="p-6">
                  <Link
                    to={`/blog/${post.slug || `post-${post.id}`}`}
                    className="group"
                  >
                    <h4 className="font-medium group-hover:text-primary transition-colors mb-1">
                      {post.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {post.publishDate || post.lastUpdated}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-4 text-muted-foreground text-sm">
              No blog posts found. Add some from the Content Management System.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog/tag/${tag.toLowerCase()}`}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              No tags found. Add some blog posts with keywords to create tags.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter to receive the latest updates and insights.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="w-full">
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
