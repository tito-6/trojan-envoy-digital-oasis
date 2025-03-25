
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Tag, ArrowRight } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const PortfolioItem: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portfolioItem, setPortfolioItem] = useState<ContentItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    const loadPortfolioItem = () => {
      if (!slug) return;

      // Try to find by slug first
      const allContent = storageService.getAllContent();
      let item = allContent.find(
        item => item.type === "Portfolio" && item.slug === slug && item.published
      );
      
      // If not found by slug, try by ID (for fallback URLs like project-123)
      if (!item && slug.startsWith('project-')) {
        const idStr = slug.replace('project-', '');
        const id = parseInt(idStr);
        if (!isNaN(id)) {
          item = allContent.find(
            item => item.type === "Portfolio" && item.id === id && item.published
          );
        }
      }
      
      if (item) {
        setPortfolioItem(item);
        
        // Find related items with same category or keywords
        const related = allContent.filter(content => 
          content.type === "Portfolio" && 
          content.id !== item.id &&
          content.published &&
          (
            (item.category && content.category === item.category) ||
            (item.seoKeywords && content.seoKeywords && 
             item.seoKeywords.some(kw => content.seoKeywords?.includes(kw)))
          )
        ).slice(0, 3);
        
        setRelatedItems(related);
      } else {
        // Item not found - redirect to portfolio page
        toast({
          title: "Project not found",
          description: "The requested portfolio item couldn't be found.",
          variant: "destructive",
        });
        navigate('/portfolio');
      }
      
      setLoading(false);
    };
    
    loadPortfolioItem();
    
    // Subscribe to content changes
    const unsubscribe = storageService.addEventListener('content-updated', loadPortfolioItem);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadPortfolioItem);
    
    return () => {
      unsubscribe();
      unsubscribeDeleted();
    };
  }, [slug, navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-secondary rounded"></div>
            <div className="h-12 w-2/3 bg-secondary rounded"></div>
            <div className="h-64 bg-secondary rounded"></div>
            <div className="h-4 bg-secondary rounded"></div>
            <div className="h-4 bg-secondary rounded"></div>
            <div className="h-4 w-2/3 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!portfolioItem) {
    return null; // Redirecting in useEffect
  }
  
  const hasExternalLink = portfolioItem.content?.includes('http');
  const externalUrl = hasExternalLink ? portfolioItem.content : undefined;
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mb-8">
          <Link to="/portfolio" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all projects
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary">
              {portfolioItem.category || (portfolioItem.seoKeywords && portfolioItem.seoKeywords.length > 0 ? portfolioItem.seoKeywords[0] : "Project")}
            </Badge>
            
            {portfolioItem.lastUpdated && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(portfolioItem.lastUpdated).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            {portfolioItem.title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {portfolioItem.description}
          </p>
        </div>
        
        {portfolioItem.images && portfolioItem.images.length > 0 && (
          <div className="mb-12 overflow-hidden rounded-lg border border-border">
            <img 
              src={portfolioItem.images[0]} 
              alt={portfolioItem.title} 
              className="w-full aspect-video object-cover"
            />
          </div>
        )}
        
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-3">
            <h2 className="text-2xl font-display font-bold mb-4">Project Details</h2>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {hasExternalLink ? (
                <div>
                  <p>This project is available online. Visit the link below to see it in action:</p>
                  <div className="mt-4">
                    <a 
                      href={externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                      Visit Project
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: portfolioItem.content || '<p>No additional details available for this project.</p>' }} />
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-medium mb-4">Project Information</h3>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground mb-1">Category</dt>
                  <dd className="font-medium">
                    {portfolioItem.category || 
                     (portfolioItem.seoKeywords && portfolioItem.seoKeywords.length > 0 ? 
                      portfolioItem.seoKeywords[0] : "General")}
                  </dd>
                </div>
                
                {portfolioItem.seoKeywords && portfolioItem.seoKeywords.length > 0 && (
                  <div>
                    <dt className="text-sm text-muted-foreground mb-1">Tags</dt>
                    <dd className="flex flex-wrap gap-2">
                      {portfolioItem.seoKeywords.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-sm text-muted-foreground mb-1">Date</dt>
                  <dd className="font-medium">
                    {new Date(portfolioItem.lastUpdated).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <h4 className="text-sm font-medium mb-2">Interested in a similar project?</h4>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Related Projects
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedItems.map(item => (
                <div key={item.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
                  {item.images && item.images.length > 0 && (
                    <div className="aspect-video">
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="font-display font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <Link
                      to={`/portfolio/${item.slug || `project-${item.id}`}`}
                      className="inline-flex items-center text-sm font-medium"
                    >
                      View Project
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PortfolioItem;
