
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { ContentItem, BlogCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Blog: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchTerm = searchParams.get('search') || '';
  const categoryPath = location.pathname.match(/\/category\/(.+)/);
  const category = categoryPath ? categoryPath[1] : '';
  const tagPath = location.pathname.match(/\/tag\/(.+)/);
  const tag = tagPath ? tagPath[1] : '';
  const { toast } = useToast();
  
  const [blogStats, setBlogStats] = useState<{
    total: number;
    categories: BlogCategory[];
  }>({
    total: 0,
    categories: []
  });

  useEffect(() => {
    // Get blog statistics for the sidebar
    const loadBlogStats = () => {
      const allContent = storageService.getAllContent();
      const blogPosts = allContent.filter(item => 
        item.type === "Blog Post" && 
        item.published === true &&
        (!item.language || item.language === currentLanguage)
      );
      
      console.log("Found blog posts:", blogPosts.length);
      
      // Process categories from the blog post keywords
      const categoryMap = new Map<string, number>();
      
      blogPosts.forEach(post => {
        if (post.seoKeywords && post.seoKeywords.length > 0) {
          post.seoKeywords.forEach(keyword => {
            const count = categoryMap.get(keyword) || 0;
            categoryMap.set(keyword, count + 1);
          });
        } else if (post.category) {
          // Also consider the category field if keywords aren't available
          const count = categoryMap.get(post.category) || 0;
          categoryMap.set(post.category, count + 1);
        }
      });
      
      const categories: BlogCategory[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      
      setBlogStats({
        total: blogPosts.length,
        categories
      });
      
      console.log("Blog stats updated:", { total: blogPosts.length, categories: categories.length });
    };
    
    loadBlogStats();
    
    // Subscribe to content changes for real-time updates
    const unsubscribe = storageService.addEventListener('content-updated', loadBlogStats);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadBlogStats);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadBlogStats);
    
    // Add fade-in animation to elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-element");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll(".should-animate");
    elements.forEach((el) => observer.observe(el));

    // Scroll to top on page load
    window.scrollTo(0, 0);

    return () => {
      observer.disconnect();
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
    };
  }, [currentLanguage]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <BlogHero 
          searchTerm={searchTerm}
          category={category}
          tag={tag}
        />
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <BlogGrid 
              searchTerm={searchTerm}
              category={category}
              tag={tag}
            />
          </div>
          <div className="lg:col-span-4">
            <BlogSidebar blogStats={blogStats} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
