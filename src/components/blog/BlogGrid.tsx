
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

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
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  title, category, excerpt, date, author, slug, featured = false, delay, image
}) => {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 should-animate ${featured ? 'border-primary/50' : ''} delay-${delay}`}>
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
            <span className="text-muted-foreground">Blog Image</span>
          </div>
        )}
        
        {featured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {category && <span className="text-sm text-primary font-medium mb-2">{category}</span>}
          <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{excerpt}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              {author && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {author}
                </span>
              )}
            </div>
            
            <Link 
              to={`/blog/${slug}`}
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Read
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface BlogGridProps {
  searchTerm?: string;
  category?: string;
  tag?: string;
}

const BlogGrid: React.FC<BlogGridProps> = ({ searchTerm = '', category = '', tag = '' }) => {
  const [blogPosts, setBlogPosts] = useState<ContentItem[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ContentItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();
  const postsPerPage = 6;
  
  useEffect(() => {
    // Load blog posts from storage service
    const loadBlogPosts = () => {
      setLoading(true);
      const allContent = storageService.getAllContent();
      // Filter to only get published blog posts
      const posts = allContent.filter(item => 
        item.type === "Blog Post" && 
        item.published === true &&
        (!item.language || item.language === currentLanguage)
      );
      
      // Sort by publishDate or lastUpdated (newest first)
      const sortedPosts = [...posts].sort((a, b) => {
        const dateA = a.publishDate || a.lastUpdated;
        const dateB = b.publishDate || b.lastUpdated;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      
      setBlogPosts(sortedPosts);
      setLoading(false);
    };
    
    loadBlogPosts();
    
    // Subscribe to content changes
    const unsubscribe = storageService.addEventListener('content-updated', loadBlogPosts);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadBlogPosts);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadBlogPosts);
    
    return () => {
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
    };
  }, [currentLanguage]);
  
  // Filter posts based on search term, category, and tag
  useEffect(() => {
    let filtered = [...blogPosts];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(search) || 
        post.description.toLowerCase().includes(search) || 
        (post.content && post.content.toLowerCase().includes(search))
      );
    }
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(post => 
        (post.category && post.category.toLowerCase() === category.toLowerCase()) ||
        (post.seoKeywords && post.seoKeywords.some(kw => kw.toLowerCase() === category.toLowerCase()))
      );
    }
    
    // Apply tag filter
    if (tag) {
      filtered = filtered.filter(post => 
        post.seoKeywords && post.seoKeywords.some(kw => kw.toLowerCase() === tag.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogPosts, searchTerm, category, tag]);
  
  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  
  // If loading
  if (loading) {
    return <div className="flex justify-center items-center py-12">Loading blog posts...</div>;
  }
  
  // If there are no filtered posts
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">No blog posts found</h3>
        <p className="text-muted-foreground">
          {searchTerm ? (
            `No results found for "${searchTerm}". Try a different search term.`
          ) : category ? (
            `No posts found in the category "${category}".`
          ) : tag ? (
            `No posts found with the tag "${tag}".`
          ) : (
            "There are no published blog posts available. Add some from the Content Management System."
          )}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {(searchTerm || category || tag) && (
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold mb-2">
            {searchTerm ? (
              `Search results for "${searchTerm}"`
            ) : category ? (
              `Category: ${category}`
            ) : (
              `Tag: ${tag}`
            )}
          </h2>
          <p className="text-muted-foreground">Found {filteredPosts.length} posts</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-8">
        {currentPosts.map((post, index) => (
          <BlogPost
            key={post.id}
            title={post.title}
            excerpt={post.description}
            date={post.publishDate || post.lastUpdated}
            author={post.subtitle || post.author || "Admin"}
            slug={post.slug || `post-${post.id}`}
            category={post.category || post.seoKeywords?.[0] || "Blog"}
            featured={index === 0 && currentPage === 1}
            delay={index * 100}
            image={post.images?.[0]}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 pt-8 border-t border-border">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === i + 1 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary transition-colors"
                }`}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button 
                onClick={() => paginate(currentPage + 1)}
                className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogGrid;
