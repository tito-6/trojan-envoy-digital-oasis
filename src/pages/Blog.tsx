
import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { useLanguage } from "@/lib/i18n";

const Blog: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
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
            <BlogSidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
