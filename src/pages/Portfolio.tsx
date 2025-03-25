
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    // Add fade-in animation to elements with the fade-in-element class
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

    // Initialize the CMS with some portfolio items if none exist
    const addExamplePortfolioIfEmpty = async () => {
      const allContent = storageService.getAllContent();
      const portfolioItems = allContent.filter(item => item.type === "Portfolio");
      
      if (portfolioItems.length === 0) {
        // Add some portfolio items
        storageService.addContent({
          title: "Modern E-commerce Website",
          type: "Portfolio",
          description: "Fully responsive online store with integrated payment processing",
          content: "This project showcases a modern e-commerce platform built with React and Node.js, featuring product search, filtering, user accounts, and secure checkout.",
          seoKeywords: ["web", "ecommerce", "responsive"],
          category: "web",
          published: true
        });
        
        storageService.addContent({
          title: "Restaurant Mobile App",
          type: "Portfolio",
          description: "Native mobile application for food ordering and delivery",
          content: "A mobile app for iOS and Android that allows customers to browse menus, place orders, and track deliveries in real-time.",
          seoKeywords: ["mobile", "app", "food"],
          category: "mobile",
          published: true
        });
        
        storageService.addContent({
          title: "Brand Identity Design",
          type: "Portfolio",
          description: "Complete brand identity package for a technology startup",
          content: "This branding project included logo design, color palette, typography, and brand guidelines document.",
          seoKeywords: ["branding", "design", "identity"],
          category: "branding",
          published: true
        });
        
        console.log("Example portfolio items added");
      }
    };
    
    addExamplePortfolioIfEmpty();

    return () => observer.disconnect();
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    console.log("Portfolio filter changed to:", filter);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <PortfolioHero />
        <PortfolioFilters onFilterChange={handleFilterChange} />
        <PortfolioGallery activeFilter={activeFilter} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
