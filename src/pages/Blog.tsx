
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

const Blog: React.FC = () => {
  const { t } = useLanguage();
  const [blogStats, setBlogStats] = useState({
    total: 0,
    categories: []
  });

  useEffect(() => {
    // Get blog statistics for the sidebar
    const allContent = storageService.getAllContent();
    const blogPosts = allContent.filter(item => 
      item.type === "Blog Post" && 
      item.published === true
    );
    
    const categories = blogPosts.reduce((acc: {name: string, count: number}[], post) => {
      if (post.seoKeywords && post.seoKeywords.length > 0) {
        post.seoKeywords.forEach(keyword => {
          const existingCategory = acc.find(cat => cat.name === keyword);
          if (existingCategory) {
            existingCategory.count += 1;
          } else {
            acc.push({ name: keyword, count: 1 });
          }
        });
      }
      return acc;
    }, []);
    
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
  }, []);

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
