import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import draftToHtml from 'draftjs-to-html';

interface ServiceDetailProps {
  service: ContentItem;
  relatedServices?: ContentItem[];
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, relatedServices = [] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const renderContent = () => {
    if (service.formattedContent) {
      try {
        const htmlContent = draftToHtml(service.formattedContent);
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
      } catch (error) {
        console.error("Error rendering formatted content:", error);
        return <p>{service.content}</p>;
      }
    }
    
    if (service.htmlContent) {
      return <div dangerouslySetInnerHTML={{ __html: service.htmlContent }} />;
    }
    
    return <p>{service.content}</p>;
  };
  
  const renderMetadata = () => {
    return (
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
        {service.publishDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Published: {formatDate(service.publishDate)}</span>
          </div>
        )}
        {service.author && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>By: {service.author}</span>
          </div>
        )}
        {service.duration && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{service.duration}</span>
          </div>
        )}
        {service.category && (
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>Category: {service.category}</span>
          </div>
        )}
      </div>
    );
  };
  
  const renderFeatures = () => {
    if (!service.content) return null;
    
    // Extract features from content if it contains bullet points
    if (service.content.includes('- ') || service.content.includes('• ')) {
      const features = service.content
        .split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('• '))
        .map(line => line.replace(/^[-•]\s*/, '').trim());
      
      return (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Key Features</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-1">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    return null;
  };
  
  const hasSeoStructure = () => {
    return service.seoHeadingStructure && 
    service.seoHeadingStructure.h2 && 
    service.seoHeadingStructure.h2.length > 0;
  };

  const renderH2Sections = () => {
    if (!service.seoHeadingStructure || !service.seoHeadingStructure.h2) return null;
    return service.seoHeadingStructure.h2.map((h2Title, index) => {
      const h3Items = service.seoHeadingStructure?.h3?.[h2Title] || [];
      
      return (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{h2Title}</h2>
          {h3Items.length > 0 ? (
            h3Items.map((h3Title, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{h3Title}</h3>
                <p>Content for {h3Title}...</p>
              </div>
            ))
          ) : (
            <p>Content for {h2Title}...</p>
          )}
        </div>
      );
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
        
        {service.subtitle && (
          <p className="text-xl text-muted-foreground mb-4">{service.subtitle}</p>
        )}
        
        {renderMetadata()}
        
        {service.images && service.images.length > 0 && (
          <div className="mb-8">
            <img 
              src={service.images[0]} 
              alt={service.title} 
              className="w-full h-auto rounded-lg object-cover max-h-[400px]"
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {service.technologies && <TabsTrigger value="technologies">Technologies</TabsTrigger>}
              {service.challenge && <TabsTrigger value="process">Our Process</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="overview" className="prose prose-lg max-w-none">
              {hasSeoStructure() ? renderH2Sections() : renderContent()}
              {renderFeatures()}
            </TabsContent>
            
            {service.technologies && (
              <TabsContent value="technologies">
                <h2 className="text-2xl font-bold mb-4">Technologies We Use</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {Array.isArray(service.technologies) ? (
                    service.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    service.technologies.split(',').map((tech, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {tech.trim()}
                      </Badge>
                    ))
                  )}
                </div>
                <p className="text-muted-foreground">
                  We use the latest technologies to deliver high-quality solutions for our clients.
                </p>
              </TabsContent>
            )}
            
            {service.challenge && (
              <TabsContent value="process">
                <div className="space-y-8">
                  {service.challenge && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                      <p>{service.challenge}</p>
                    </div>
                  )}
                  
                  {service.solution && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
                      <p>{service.solution}</p>
                    </div>
                  )}
                  
                  {service.results && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">The Results</h2>
                      <p>{service.results}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Contact us today to discuss your project and how we can help you achieve your goals.
              </p>
              <Button className="w-full mb-4">
                Request a Quote
              </Button>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
          
          {relatedServices.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Related Services</h3>
              <div className="space-y-4">
                {relatedServices.map((relatedService) => (
                  <Link 
                    key={relatedService.id}
                    to={`/services/${relatedService.slug || relatedService.id}`}
                    className="block"
                  >
                    <Card className="transition-all hover:border-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{relatedService.title}</h4>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
