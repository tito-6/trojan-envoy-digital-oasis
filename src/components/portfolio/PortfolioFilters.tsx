
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { storageService } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface PortfolioFiltersProps {
  onFilterChange: (filter: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get portfolio categories from the CMS
    const loadCategories = () => {
      const allContent = storageService.getAllContent();
      const portfolioItems = allContent.filter(item => item.type === "Portfolio" && item.published);
      
      // Extract unique categories from portfolio items
      const uniqueCategories = new Set<string>();
      uniqueCategories.add("all");
      
      portfolioItems.forEach(item => {
        if (item.category) {
          uniqueCategories.add(item.category.toLowerCase());
        }
        
        // Also add from keywords
        if (item.seoKeywords && item.seoKeywords.length > 0) {
          item.seoKeywords.forEach(keyword => {
            uniqueCategories.add(keyword.toLowerCase());
          });
        }
      });
      
      setCategories(Array.from(uniqueCategories));
    };
    
    loadCategories();
    
    // Subscribe to content changes for real-time updates
    const unsubscribe = storageService.addEventListener('content-updated', loadCategories);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadCategories);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadCategories);
    
    return () => {
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
    };
  }, []);
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };
  
  return (
    <section className="pb-8 pt-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 should-animate">
          {categories.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => handleFilterClick(filter)}
              className="mb-2"
            >
              {filter === "all" ? "All Projects" : 
               filter === "web" ? "Web Development" :
               filter === "mobile" ? "Mobile Apps" :
               filter === "ecommerce" ? "E-commerce" :
               filter === "marketing" ? "Digital Marketing" :
               filter === "branding" ? "Branding" :
               filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioFilters;
