
import React from "react";
import { ArrowRight, Code, Smartphone, Paintbrush, BarChart, Globe, ShoppingCart, FileText } from "lucide-react";
import { ContentItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceDetailProps {
  service: ContentItem;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const { t } = useLanguage();
  
  const getIconForService = (iconName: string = 'code') => {
    const iconMap: Record<string, React.ReactNode> = {
      code: <Code className="w-6 h-6 text-primary" />,
      smartphone: <Smartphone className="w-6 h-6 text-primary" />,
      paintbrush: <Paintbrush className="w-6 h-6 text-primary" />,
      barChart: <BarChart className="w-6 h-6 text-primary" />,
      globe: <Globe className="w-6 h-6 text-primary" />,
      shoppingCart: <ShoppingCart className="w-6 h-6 text-primary" />,
      fileText: <FileText className="w-6 h-6 text-primary" />
    };
    
    return iconMap[iconName] || <Code className="w-6 h-6 text-primary" />;
  };
  
  const renderFormattedContent = () => {
    if (service.formattedContent) {
      try {
        const htmlContent = require('draftjs-to-html')(service.formattedContent);
        return (
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        );
      } catch (error) {
        console.error("Error rendering formatted content:", error);
        return <p>{service.content || service.description}</p>;
      }
    }
    
    return <p>{service.content || service.description}</p>;
  };
  
  const parseFeatures = (content?: string): string[] => {
    if (!content) return [];
    
    if (content.includes('- ') || content.includes('• ')) {
      return content
        .split(/\n/)
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);
    }
    
    return content
      .split(/\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .slice(0, 5);
  };
  
  const features = service.content ? parseFeatures(service.content) : [];
  
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            {service.iconName ? 
              getIconForService(service.iconName) : 
              <Code className="w-6 h-6 text-primary" />
            }
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{service.description}</p>
          
          {service.technologies && service.technologies.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {service.technologies.map((tech, idx) => (
                <Badge key={idx} variant="secondary">{tech}</Badge>
              ))}
            </div>
          )}
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <div className="space-y-8">
              {renderFormattedContent()}
              
              {features.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">{t('key.features')}</h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-muted p-6 rounded-lg sticky top-24">
              <h3 className="text-xl font-bold mb-4">{t('get.started')}</h3>
              <p className="text-muted-foreground mb-6">{t('contact.us.services.desc')}</p>
              <Button className="w-full">
                {t('contact.us')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <hr className="my-6" />
              
              <div className="space-y-4">
                {service.images && service.images.length > 0 && (
                  <img 
                    src={service.images[0]} 
                    alt={service.title} 
                    className="w-full h-auto rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {(service.images && service.images.length > 1) || (service.videos && service.videos.length > 0) ? (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">{t('portfolio.showcase')}</h3>
            
            <Tabs defaultValue="images" className="w-full">
              {service.images && service.images.length > 0 && (
                <TabsList className="mb-6">
                  <TabsTrigger value="images">{t('images')}</TabsTrigger>
                  {service.videos && service.videos.length > 0 && (
                    <TabsTrigger value="videos">{t('videos')}</TabsTrigger>
                  )}
                </TabsList>
              )}
              
              <TabsContent value="images">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.images && service.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${service.title} - ${index + 1}`} 
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.videos && service.videos.map((video, index) => (
                    <div key={index} className="aspect-video">
                      <iframe
                        src={video.replace('watch?v=', 'embed/')}
                        title={`${service.title} Video ${index + 1}`}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
        
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">{t('interested.in.service')}</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('contact.for.consultation')}
          </p>
          <Button size="lg">
            {t('contact.us')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
