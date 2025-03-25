
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

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
