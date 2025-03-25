
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItemProps {
  title: string;
  category: string;
  description: string;
  image?: string;
  delay: number;
  slug: string;
  externalUrl?: string;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ 
  title, category, description, image, delay, slug, externalUrl
}) => {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 should-animate delay-${delay}`}>
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
            <span className="text-muted-foreground">Project Image</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <span className="text-sm text-primary font-medium mb-2">{category}</span>
          <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          
          <div className="mt-auto flex justify-between items-center pt-4">
            <Link 
              to={`/portfolio/${slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              View Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            {externalUrl && (
              <a 
                href={externalUrl} 
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PortfolioGalleryProps {
  activeFilter: string;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ activeFilter }) => {
  const [portfolioItems, setPortfolioItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load portfolio items from CMS
    const loadPortfolioItems = () => {
      const allContent = storageService.getAllContent();
      const items = allContent.filter(item => 
        item.type === "Portfolio" && 
        item.published === true
      );
      
      // Sort by the most recently updated
      const sortedItems = [...items].sort((a, b) => {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
      
      setPortfolioItems(sortedItems);
      
      // Log for debugging
      console.log("Loaded portfolio items:", sortedItems);
    };
    
    loadPortfolioItems();
    
    // Subscribe to content changes for real-time updates
    const unsubscribe = storageService.addEventListener('content-updated', loadPortfolioItems);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadPortfolioItems);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadPortfolioItems);
    
    return () => {
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
    };
  }, []);
  
  useEffect(() => {
    // Filter items when the active filter changes
    if (activeFilter === "all") {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => {
        const categoryMatch = item.category && 
          item.category.toLowerCase() === activeFilter.toLowerCase();
        
        const keywordMatch = item.seoKeywords && 
          item.seoKeywords.some(keyword => keyword.toLowerCase() === activeFilter.toLowerCase());
        
        return categoryMatch || keywordMatch;
      }));
    }
    
    // Log for debugging
    console.log("Active filter:", activeFilter);
    console.log("Filtered items:", filteredItems.length);
  }, [activeFilter, portfolioItems]);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <PortfolioItem
                key={item.id}
                title={item.title}
                category={item.category || (item.seoKeywords && item.seoKeywords.length > 0 ? item.seoKeywords[0] : "Project")}
                description={item.description}
                image={item.images && item.images.length > 0 ? item.images[0] : undefined}
                delay={index * 100}
                slug={item.slug || `project-${item.id}`}
                externalUrl={item.content?.includes("http") ? item.content : undefined}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium mb-4">No projects found</h3>
              <p className="text-muted-foreground">
                {portfolioItems.length === 0 ? 
                  "No portfolio items available. Add some from the Content Management System." : 
                  "No projects match the selected filter. Try another category."}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center should-animate">
          <p className="text-muted-foreground mb-6">
            Looking for more examples of our work? Contact us to request our extended portfolio.
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Discuss Your Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
