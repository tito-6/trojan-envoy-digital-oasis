
import React from "react";
import { Link } from "react-router-dom";
import { Search, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BlogSidebar: React.FC = () => {
  // Sample categories
  const categories = [
    { name: "Development", count: 12 },
    { name: "SEO", count: 8 },
    { name: "Marketing", count: 10 },
    { name: "UX/UI Design", count: 6 },
    { name: "E-commerce", count: 7 },
    { name: "Security", count: 4 },
  ];
  
  // Sample popular posts
  const popularPosts = [
    { title: "10 SEO Strategies for 2023", slug: "seo-strategies-2023", date: "Nov 5, 2023" },
    { title: "The Future of Mobile App Development", slug: "future-mobile-app-development", date: "Oct 28, 2023" },
    { title: "Why User Experience Matters", slug: "why-user-experience-matters", date: "Oct 15, 2023" },
  ];
  
  // Sample tags
  const tags = [
    "Development", "SEO", "Marketing", "UX/UI", "Mobile", "Web", "E-commerce", 
    "Security", "Analytics", "Social Media", "Content", "Branding"
  ];
  
  return (
    <div className="space-y-8 should-animate">
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Popular Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {popularPosts.map((post) => (
              <li key={post.slug} className="p-6">
                <Link
                  to={`/blog/${post.slug}`}
                  className="group"
                >
                  <h4 className="font-medium group-hover:text-primary transition-colors mb-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
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
