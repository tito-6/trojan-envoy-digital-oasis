
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ServiceDetail from "@/components/services/ServiceDetail";
import ServicesCTA from "@/components/services/ServicesCTA";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [service, setService] = React.useState<ContentItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    if (slug) {
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => 
        item.type === "Service" && item.published === true
      );
      
      // Try to find by slug
      let foundService = serviceItems.find(item => 
        (item.slug && item.slug.toLowerCase() === slug.toLowerCase()) || 
        item.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );
      
      if (foundService) {
        setService(foundService);
        document.title = `${foundService.title} | Trojan Envoy`;
      } else {
        navigate('/services', { replace: true });
      }
      
      setLoading(false);
    }
    
    // Add fade-in animations
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
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    return () => observer.disconnect();
  }, [slug, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex items-center justify-center py-40">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center py-40 text-center px-4">
          <h1 className="text-3xl font-bold mb-4">{t('nav.services')}</h1>
          <p className="text-muted-foreground mb-6">{t('service.not.found')}</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <ServiceDetail service={service} />
        <ServicesCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
