
import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import PortfolioVideoSection from "@/components/portfolio/PortfolioVideoSection";
import PortfolioPhotoSection from "@/components/portfolio/PortfolioPhotoSection";
import PortfolioDigitalMarketingSection from "@/components/portfolio/PortfolioDigitalMarketingSection";
import PortfolioEcommerceSection from "@/components/portfolio/PortfolioEcommerceSection";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { motion, useScroll, useTransform } from "framer-motion";
import { PenTool, MousePointer, Sparkles } from "lucide-react";

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: portfolioRef,
    offset: ["start start", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

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
    
    // Set page title
    document.title = `${t('portfolio.title')} | Trojan Envoy`;

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
  }, [t]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    console.log("Portfolio filter changed to:", filter);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" ref={portfolioRef}>
      {/* Background particles and gradient effects */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-b from-background/40 via-purple-500/5 to-background/80 z-0"
        style={{ opacity: backgroundOpacity, y: backgroundY }}
      />
      
      {/* Animated floating design elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-[100px] -z-10"
          animate={{ x: [-30, 30, -30], y: [-30, 30, -30] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-10 w-72 h-72 rounded-full bg-purple-500/5 blur-[100px] -z-10"
          animate={{ x: [30, -30, 30], y: [30, -30, 30] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating design tools */}
        <motion.div
          className="absolute top-[15%] left-[8%] text-primary/10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <PenTool size={60} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-[20%] right-[10%] text-primary/10"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <MousePointer size={50} />
        </motion.div>
        
        <motion.div
          className="absolute top-[40%] right-[15%] text-primary/10"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={70} />
        </motion.div>
      </div>
      
      <Header />
      
      <main>
        <PortfolioHero />
        <PortfolioFilters onFilterChange={handleFilterChange} />
>
        
        {/* New sections */}
        <PortfolioVideoSection />
        <PortfolioPhotoSection />
        <PortfolioDigitalMarketingSection />
        <PortfolioEcommerceSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
