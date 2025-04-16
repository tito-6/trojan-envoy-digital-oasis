import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, User, Loader2, BookOpen, Search, Folder, Tag, ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { storageService } from "@/lib/storage";
import { IContent } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

interface BlogPostProps {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author?: string;
  category?: string;
  featured?: boolean;
  delay: number;
  image?: string;
  tags?: string[];
  activeTag?: string | null;
  onTagClick?: (tag: string, e: React.MouseEvent) => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  title, category, excerpt, date, author, slug, featured = false, delay, image, tags, activeTag, onTagClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={featured ? "col-span-full" : ""}
    >
      <Card
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group overflow-hidden border-border hover:shadow-lg transition-all duration-300 ${
          featured ? 'md:grid md:grid-cols-2 gap-6' : ''
        }`}
      >
        <CardContent className={`p-0 ${featured ? 'md:p-8' : ''}`}>
          <Link to={`/blog/${slug}`} className="block">
            <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9] md:aspect-square' : 'aspect-[16/9]'}`}>
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <FileText className="w-12 h-12 text-primary/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                {category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {category}
                  </span>
                )}
                {tags && tags.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {tags.map(tag => (
                      <button
                        key={tag}
                        onClick={(e) => onTagClick?.(tag, e)}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          activeTag === tag
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-primary/20 text-muted-foreground'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <h3 className={`font-display font-bold tracking-tight mb-2 group-hover:text-primary transition-colors ${
                featured ? 'text-2xl md:text-3xl' : 'text-xl'
              }`}>
                {title}
              </h3>

              <p className="text-muted-foreground line-clamp-2 mb-4">{excerpt}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  {author && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {author}
                    </span>
                  )}
                  {date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {date}
                    </span>
                  )}
                </div>
                <span className="flex items-center font-medium text-primary">
                  Read more
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>

          {/* SEO-friendly hidden content */}
          <div className="sr-only">
            <h2>{title}</h2>
            <p>{excerpt}</p>
            <ul>
              {tags?.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <time dateTime={date}>{date}</time>
            {author && <span>Written by {author}</span>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Badge } from '@/components/ui/badge';

interface BlogGridProps {
  posts: {
    id: string | number;
    title: string;
    description: string;
    category: string;
    publishDate: string;
    seoKeywords?: string[];
    images?: string[];
    content: string;
    slug: string;
    author?: string;
    published: boolean;
    type: string;
  }[];
  searchTerm?: string;
  category?: string;
  tag?: string;
}

export function BlogGrid({ posts, searchTerm = '', category = 'all', tag = 'all' }: BlogGridProps) {
  const [sortBy, setSortBy] = useState('newest');

  // Extract unique categories and tags
  const categories = ['all', ...new Set(posts.map(post => post.category))];
  const tags = ['all', ...new Set(posts.flatMap(post => post.seoKeywords || []))];  // Use seoKeywords instead of tags

  // Filter and sort posts using props instead of internal state
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = searchTerm ? 
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())) : true;
      const matchesCategory = category === 'all' || post.category.toLowerCase() === category.toLowerCase();
      const matchesTag = tag === 'all' || (post.seoKeywords && post.seoKeywords.some(t => t.toLowerCase() === tag.toLowerCase()));
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="aspect-video overflow-hidden">
                  {post.images?.[0] ? (
                    <ProgressiveImage
                      src={post.images[0]}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="mt-2 line-clamp-2 text-muted-foreground">
                    {post.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.seoKeywords?.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">
            No posts found. Try adjusting your filters.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Add default export
export default BlogGrid;
