
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ServiceDetail from "@/components/services/ServiceDetail"; // Using default import
import ServicesCTA from "@/components/services/ServicesCTA";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [service, setService] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };
  
  useEffect(() => {
    if (slug) {
      // First try to get services from services settings (which will have the rich formatted content)
      const servicesSettings = storageService.getServicesSettings();
      let foundService = null;
      
      if (servicesSettings && servicesSettings.services) {
        foundService = servicesSettings.services.find(service => 
          service.link.endsWith(slug) || 
          service.link === `/services/${slug}`
        );
        
        if (foundService) {
          // Convert service to ContentItem format
          const contentItem: ContentItem = {
            id: foundService.id,
            title: foundService.title,
            type: "Service",
            description: foundService.description,
            content: foundService.content,
            formattedContent: foundService.formattedDescription,
            htmlContent: foundService.htmlContent,
            seoTitle: foundService.seoTitle,
            seoDescription: foundService.seoDescription,
            seoKeywords: foundService.seoKeywords,
            seoHeadingStructure: foundService.seoHeadingStructure,
            images: foundService.images,
            videos: foundService.videos,
            documents: foundService.documents,
            published: true,
            lastUpdated: new Date().toISOString(),
            iconName: foundService.iconName,
            color: foundService.color,
            bgColor: foundService.bgColor
          };
          
          setService(contentItem);
          document.title = foundService.seoTitle || `${foundService.title} | Trojan Envoy`;
          
          // If there's a seoDescription, add it as a meta tag
          if (foundService.seoDescription) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', foundService.seoDescription);
            } else {
              const meta = document.createElement('meta');
              meta.name = 'description';
              meta.content = foundService.seoDescription;
              document.head.appendChild(meta);
            }
          }
          
          setLoading(false);
          return;
        }
      }
      
      // Fallback to the content items if not found in services settings
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => 
        item.type === "Service" && item.published === true
      );
      
      // Try to find by slug
      foundService = serviceItems.find(item => 
        (item.slug && item.slug.toLowerCase() === slug.toLowerCase()) || 
        item.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );
      
      if (foundService) {
        setService(foundService);
        document.title = foundService.seoTitle || `${foundService.title} | Trojan Envoy`;
        
        // Add meta description if available
        if (foundService.seoDescription) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', foundService.seoDescription);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = foundService.seoDescription;
            document.head.appendChild(meta);
          }
        }
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
    
    return () => {
      observer.disconnect();
      // Clean up meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.remove();
      }
    };
  }, [slug, navigate]);
  
  useEffect(() => {
    if (!service) {
      const mockService: ContentItem = {
        id: 1,
        title: "Web Development",
        type: "Service",
        description: "Custom web applications built with modern technologies",
        content: "<p>Our web development services include...</p>",
        formattedContent: "Our web development services include...",
        htmlContent: "<div>Our web development services include...</div>",
        seoKeywords: ["web development", "javascript", "react", "node.js"],
        category: "Development",
        published: true,
        lastUpdated: new Date().toISOString(),
        iconName: "Code",
        color: "#4285F4",
        bgColor: "#EBF2FF",
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        documents: ["/examples/service-brochure.pdf"],
        seoHeadingStructure: {
          h1: "Web Development Services",
          h2: ["Our Approach", "Technologies We Use", "Benefits"],
          h3: {
            "Our Approach": ["Discovery", "Planning", "Development", "Testing", "Deployment"],
            "Technologies We Use": ["Frontend", "Backend", "Database", "Hosting"],
            "Benefits": ["Scalability", "Performance", "Security", "Maintainability"]
          }
        }
      };
      
      setService(mockService);
    }
  }, [service]);
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
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
        <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
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
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main>
        <ServiceDetail service={service} />
        <ServicesCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
