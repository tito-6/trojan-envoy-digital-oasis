import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Smartphone, Paintbrush, BarChart, Globe, ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  link: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, description, icon, features, link, delay 
}) => {
  return (
    <Card className={`overflow-hidden group hover:border-primary/50 hover:shadow-lg transition-all duration-300 should-animate delay-${delay}`}>
      <CardHeader className="pb-4">
        <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link
          to={link}
          className="inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
};

const getIconForService = (title: string) => {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('web')) return <Code className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('mobile')) return <Smartphone className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('ui') || normalizedTitle.includes('ux') || normalizedTitle.includes('design')) return <Paintbrush className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('market')) return <BarChart className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('seo')) return <Globe className="w-5 h-5 text-primary" />;
  if (normalizedTitle.includes('commerce')) return <ShoppingCart className="w-5 h-5 text-primary" />;
  return <Code className="w-5 h-5 text-primary" />;
};

const ServicesList: React.FC = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<ContentItem[]>([]);
  
  useEffect(() => {
    const loadServices = () => {
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => 
        item.type === "Service" && item.published === true
      );
      
      const sortedServices = [...serviceItems].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a.title.localeCompare(b.title);
      });
      
      setServices(sortedServices);
    };
    
    loadServices();
    
    const unsubscribe = storageService.addEventListener('content-updated', loadServices);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadServices);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadServices);
    
    return () => {
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
    };
  }, []);
  
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
  
  if (services.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            No services found. Add some from the Content Management System.
          </p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const features = parseFeatures(service.content);
            
            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={getIconForService(service.title)}
                features={features.length > 0 ? features : ["Service details coming soon"]}
                link={`/services/${service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}`}
                delay={index * 100}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
