
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { ContentItem, BlogCategory } from "@/lib/types";

const Blog: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [blogStats, setBlogStats] = useState<{
    total: number;
    categories: BlogCategory[];
  }>({
    total: 0,
    categories: []
  });

  useEffect(() => {
    // Get blog statistics for the sidebar
    const allContent = storageService.getAllContent();
    const blogPosts = allContent.filter(item => 
      item.type === "Blog Post" && 
      item.published === true &&
      (!item.language || item.language === currentLanguage)
    );
    
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

    return () => observer.disconnect();
  }, [currentLanguage]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <BlogHero />
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <BlogGrid />
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
