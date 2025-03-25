
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
  const category = categoryPath ? categoryPath[1] : searchParams.get('category') || '';
  const tagPath = location.pathname.match(/\/tag\/(.+)/);
  const tag = tagPath ? tagPath[1] : searchParams.get('tag') || '';
  const { toast } = useToast();
  
  const [blogStats, setBlogStats] = useState<{
    total: number;
    categories: BlogCategory[];
  }>({
    total: 0,
    categories: []
  });

  useEffect(() => {
    // Add example blog posts if none exist
    const addExampleBlogPostsIfEmpty = async () => {
      const allContent = storageService.getAllContent();
      const blogPosts = allContent.filter(item => item.type === "Blog Post");
      
      if (blogPosts.length === 0) {
        // Add some example blog posts
        storageService.addContent({
          title: "How to Choose the Right Technology Stack for Your Project",
          type: "Blog Post",
          description: "A comprehensive guide to selecting technologies that align with your business goals",
          content: "<p>Choosing the right technology stack is crucial for the success of your project. Here are the key factors to consider:</p><h3>1. Project Requirements</h3><p>Start by analyzing what your project actually needs to accomplish.</p><h3>2. Development Timeline</h3><p>Consider how quickly you need to launch.</p><h3>3. Team Expertise</h3><p>Leverage what your team already knows or what skills are readily available.</p><h3>4. Scalability</h3><p>Plan for growth from the beginning.</p><h3>5. Long-term Maintenance</h3><p>Consider the future support and updates needed.</p>",
          seoKeywords: ["technology", "development", "programming"],
          category: "Technology",
          author: "Alex Johnson",
          publishDate: new Date().toISOString().split('T')[0],
          published: true
        });
        
        storageService.addContent({
          title: "5 UX Design Trends to Watch in 2023",
          type: "Blog Post",
          description: "Explore the latest user experience design trends that are shaping digital products this year",
          content: "<p>As digital experiences evolve, here are the top UX design trends making waves this year:</p><h3>1. Dark Mode Everywhere</h3><p>More apps and websites are implementing dark mode options for users.</p><h3>2. Voice User Interfaces</h3><p>Voice-controlled interfaces are becoming mainstream.</p><h3>3. Micro-interactions</h3><p>Small animations that delight users are increasingly important.</p><h3>4. 3D Elements</h3><p>Three-dimensional graphics are enhancing flat design.</p><h3>5. Minimalism 2.0</h3><p>Simplicity continues to reign but with more personality.</p>",
          seoKeywords: ["design", "UX", "trends"],
          category: "Design",
          author: "Maria Chen",
          publishDate: new Date().toISOString().split('T')[0],
          published: true
        });
        
        console.log("Example blog posts added");
      }
    };
    
    // Get blog statistics for the sidebar
    const loadBlogStats = () => {
      addExampleBlogPostsIfEmpty();
      
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
        if (post.category) {
          // Priority to the category field
          const count = categoryMap.get(post.category) || 0;
          categoryMap.set(post.category, count + 1);
        } else if (post.seoKeywords && post.seoKeywords.length > 0) {
          // Fall back to keywords if no category
          post.seoKeywords.forEach(keyword => {
            const count = categoryMap.get(keyword) || 0;
            categoryMap.set(keyword, count + 1);
          });
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
