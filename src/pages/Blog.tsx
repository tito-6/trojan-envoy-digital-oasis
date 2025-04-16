import React, { useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams, useParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { IContent, BlogCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, BookOpen, PenTool, Hash } from "lucide-react";

const Blog: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { tag: urlTag } = useParams<{ tag?: string }>();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const categoryPath = location.pathname.match(/\/category\/(.+)/);
  const [category, setCategory] = useState(categoryPath ? categoryPath[1] : searchParams.get('category') || '');
  const [tag, setTag] = useState(urlTag || searchParams.get('tag') || '');
  const { toast } = useToast();
  const blogRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: blogRef,
    offset: ["start start", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const [blogStats, setBlogStats] = useState<{
    total: number;
    categories: BlogCategory[];
  }>({
    total: 0,
    categories: []
  });

  useEffect(() => {
    // Set page title
    document.title = `Blog | Trojan Envoy`;
    
    // Add example blog posts if none exist
    const addExampleBlogPostsIfEmpty = async () => {
      const allContent = storageService.getAllContent();
      // First, clear any existing blog posts
      allContent
        .filter(item => item.type === "Blog Post")
        .forEach(post => storageService.deleteContent(post.id));
      
      // Add initial blog posts
      storageService.addContent({
        title: "How to Choose the Right Technology Stack for Your Project",
        type: "Blog Post",
        description: "A comprehensive guide to selecting technologies that align with your business goals",
        content: "<p>Choosing the right technology stack is crucial for the success of your project. Here are the key factors to consider:</p><h3>1. Project Requirements</h3><p>Start by analyzing what your project actually needs to accomplish.</p><h3>2. Development Timeline</h3><p>Consider how quickly you need to launch.</p><h3>3. Team Expertise</h3><p>Leverage what your team already knows or what skills are readily available.</p><h3>4. Scalability</h3><p>Plan for growth from the beginning.</p><h3>5. Long-term Maintenance</h3><p>Consider the future support and updates needed.</p>",
        seoKeywords: ["technology", "development", "programming"],
        category: "Technology",
        author: "Alex Johnson",
        images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        published: true,
        publishDate: new Date().toISOString().split('T')[0],
      });

      storageService.addContent({
        title: "The Future of Web Development in 2025",
        type: "Blog Post",
        description: "Explore emerging trends shaping the future of web development",
        content: "<p>As we move through 2025, several key trends are revolutionizing web development...</p>",
        category: "Web Development",
        author: "Sarah Chen",
        seoKeywords: ["web development", "trends", "future tech"],
        images: ["https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        published: true,
        publishDate: new Date().toISOString().split('T')[0],
      });

      storageService.addContent({
        title: "Building Accessible Web Applications",
        type: "Blog Post",
        description: "Best practices for creating inclusive and accessible web experiences",
        content: "<p>Web accessibility is not just a requirement, it's a responsibility...</p>",
        category: "Accessibility",
        author: "Lisa Park",
        seoKeywords: ["accessibility", "web development", "inclusive design"],
        images: ["https://images.unsplash.com/photo-1586936893354-362ad6ae46ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
        published: true,
        publishDate: new Date().toISOString().split('T')[0],
      });
    };
    
    // Get blog statistics for the sidebar
    const loadBlogStats = () => {
      addExampleBlogPostsIfEmpty();
      
      const allContent = storageService.getAllContent();
      const blogPosts = allContent.filter(item => item.type === "Blog Post" && item.published);
      
      // Count posts per category
      const categoryCount = blogPosts.reduce((acc, post) => {
        if (post.category) {
          acc[post.category] = (acc[post.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Convert to array of category objects
      const categories = Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count
      }));

      setBlogStats({
        total: blogPosts.length,
        categories: categories
      });
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

  useEffect(() => {
    // Add schema markup for Blog
    const blogPosts = storageService.getAllContent()
      .filter(item => item.type === "Blog Post" && item.published)
      .sort((a, b) => {
        const dateA = a.publishDate || a.lastUpdated;
        const dateB = b.publishDate || b.lastUpdated;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Trojan Envoy Blog",
      "description": "Expert insights on technology, development, and industry trends",
      "url": window.location.href,
      "blogPost": blogPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": post.images?.[0],
        "datePublished": post.publishDate,
        "dateModified": post.lastUpdated,
        "author": {
          "@type": "Person",
          "name": post.author || "Admin"
        },
        "url": `${window.location.origin}/blog/${post.slug}`
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Update meta tags for blog listing page
    document.title = 'Blog | Trojan Envoy';
    
    const metaTags = [
      { name: 'description', content: 'Explore our latest articles and insights on technology, development, and industry trends.' },
      { name: 'keywords', content: 'blog, technology, development, insights, articles, tutorials' },
      { property: 'og:title', content: 'Trojan Envoy Blog' },
      { property: 'og:description', content: 'Expert insights on technology, development, and industry trends' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: blogPosts[0]?.images?.[0] || '/placeholder.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Trojan Envoy Blog' },
      { name: 'twitter:description', content: 'Expert insights on technology, development, and industry trends' },
      { name: 'twitter:image', content: blogPosts[0]?.images?.[0] || '/placeholder.svg' }
    ];

    // Remove existing meta tags
    document.querySelectorAll('meta').forEach(tag => {
      if (tag.getAttribute('name')?.startsWith('description') ||
          tag.getAttribute('name')?.startsWith('keywords') ||
          tag.getAttribute('property')?.startsWith('og:') ||
          tag.getAttribute('name')?.startsWith('twitter:')) {
        tag.remove();
      }
    });

    // Add new meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        if (value) meta.setAttribute(key, value);
      });
      document.head.appendChild(meta);
    });

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link') as HTMLLinkElement;
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href.split('?')[0]; // Remove query parameters

    return () => {
      // Cleanup
      script.remove();
      metaTags.forEach(tag => {
        document.querySelector(`meta[${Object.keys(tag)[0]}="${Object.values(tag)[0]}"]`)?.remove();
      });
      canonical?.remove();
    };
  }, [currentLanguage]);

  // Enhanced tag filtering functionality
  const handleTagFilter = (selectedTag: string) => {
    setTag(selectedTag);
    setSearchTerm('');
    setCategory('');
    
    // Add visual feedback for tag selection
    const tagElement = document.querySelector(`[data-tag="${selectedTag}"]`) as HTMLElement;
    if (tagElement) {
      tagElement.classList.add('selected-tag');
      setTimeout(() => tagElement.classList.remove('selected-tag'), 300);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" ref={blogRef}>
      {/* Background particles and gradient effects */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-b from-background/40 via-blue-500/5 to-background/80 z-0"
        style={{ opacity: backgroundOpacity, y: backgroundY }}
      />
      
      {/* Animated floating shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-[100px] -z-10"
          animate={{ x: [-30, 30, -30], y: [-30, 30, -30] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-10 w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] -z-10"
          animate={{ x: [30, -30, 30], y: [30, -30, 30] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating blog elements */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-primary/10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText size={60} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[20%] right-[10%] text-primary/10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen size={50} />
        </motion.div>
        
        <motion.div
          className="absolute top-[40%] right-[15%] text-primary/10"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <PenTool size={70} />
        </motion.div>
        
        <motion.div
          className="absolute top-[60%] left-[15%] text-primary/10"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Hash size={55} />
        </motion.div>
      </div>
      
      <Header />
      
      <main>
        <BlogHero 
          searchTerm={searchTerm}
          category={category}
          tag={tag}
        />
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <div className="lg:col-span-8">
            <BlogGrid 
              posts={storageService.getAllContent().filter(item => item.type === "Blog Post" && item.published)}
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
