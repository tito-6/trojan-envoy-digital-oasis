import React from 'react';
import { ContentItem } from '@/lib/types';
import { storageService } from '@/lib/storage';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesList from '@/components/services/ServicesList';
import ServicesCTA from '@/components/services/ServicesCTA';

const Services: React.FC = () => {
  const [services, setServices] = React.useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check API health first
        const healthResponse = await fetch('/api/health');
        if (!healthResponse.ok) {
          throw new Error("Database connection error");
        }
        
        const servicesData = await storageService.getContentByType("Service");
        setServices(servicesData || []);
      } catch (error) {
        console.error("Error loading services:", error);
        setError("Failed to load services. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <ServicesHero />
      <ServicesList services={services} />
      <ServicesCTA />
    </div>
  );
};

export default Services;
