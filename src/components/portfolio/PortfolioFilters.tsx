
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { storageService } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Check, ChevronDown, X } from "lucide-react";

interface PortfolioFiltersProps {
  onFilterChange: (filter: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get portfolio categories from the CMS
    const loadCategories = () => {
      const allContent = storageService.getAllContent();
      const portfolioItems = allContent.filter(item => item.type === "Portfolio" && item.published);
      
      console.log("Portfolio items for categories:", portfolioItems.length);
      
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
      console.log("Portfolio categories loaded:", Array.from(uniqueCategories));
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
    
    // Show toast notification
    toast({
      title: "Filter Applied",
      description: `Showing ${filter === 'all' ? 'all projects' : `${filter} projects`}`,
      variant: "default",
    });
    
    console.log("Filter clicked:", filter);
  };
  
  const getCategoryLabel = (filter: string) => {
    return filter === "all" ? "All Projects" : 
    filter === "web" ? "Web Development" :
    filter === "mobile" ? "Mobile Apps" :
    filter === "ecommerce" ? "E-commerce" :
    filter === "marketing" ? "Digital Marketing" :
    filter === "branding" ? "Branding" :
    filter.charAt(0).toUpperCase() + filter.slice(1);
  };
  
  return (
    <section className="pb-8 pt-4">
      <div className="container mx-auto px-4">
        {/* Mobile filter dropdown */}
        <div className="md:hidden mb-6">
          <Button 
            onClick={() => setIsExpanded(!isExpanded)} 
            variant="outline" 
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>{getCategoryLabel(activeFilter)}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-2 border border-border rounded-lg shadow-lg bg-background"
              >
                <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                  {categories.map((filter) => (
                    <motion.button
                      key={filter}
                      onClick={() => {
                        handleFilterClick(filter);
                        setIsExpanded(false);
                      }}
                      className={`w-full px-3 py-2 rounded-md flex items-center justify-between ${
                        activeFilter === filter 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-secondary transition-colors'
                      }`}
                      whileHover={{ scale: 0.98 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>{getCategoryLabel(filter)}</span>
                      {activeFilter === filter && <Check className="w-4 h-4" />}
                    </motion.button>
                  ))}
                </div>
                <div className="p-2 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsExpanded(false)} 
                    className="w-full flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Desktop filter buttons */}
        <div className="hidden md:flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((filter, index) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => handleFilterClick(filter)}
                className={`mb-2 relative overflow-hidden ${activeFilter === filter ? 'shadow-md shadow-primary/20' : ''}`}
              >
                {/* Animated background for active filter */}
                {activeFilter === filter && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 -z-10"
                    animate={{
                      backgroundPosition: ['0% center', '100% center', '0% center'],
                    }}
                    transition={{
                      duration: 3,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                  />
                )}
                {getCategoryLabel(filter)}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioFilters;