import React from 'react';
import { ContentItem } from '@/lib/types';
import { storageService } from '@/lib/storage';

const Services: React.FC = () => {
  const [services, setServices] = React.useState<ContentItem[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const storedServices = storageService.getContentByType("Service");
    setServices(storedServices);
  };

  const onAddWebDevelopmentService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "Web Development",
      type: "Service",
      description: "Custom web applications built with modern technologies",
      content: "<p>Our web development services include...</p>",
      seoKeywords: ["web development", "javascript", "react", "node.js"],
      category: "Development",
      published: true,
      order: 1,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  const onAddMobileService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "Mobile App Development",
      type: "Service",
      description: "Native and cross-platform mobile applications",
      content: "<p>Our mobile development expertise includes...</p>",
      seoKeywords: ["mobile app", "ios", "android", "react native"],
      category: "Development",
      published: true,
      order: 2,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  const onAddUIUXService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "UI/UX Design",
      type: "Service",
      description: "User-centered design solutions for digital products",
      content: "<p>Our design process focuses on...</p>",
      seoKeywords: ["ui design", "ux design", "user interface", "user experience"],
      category: "Design",
      published: true,
      order: 3,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  const onAddCloudService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "Cloud Services",
      type: "Service",
      description: "Cloud infrastructure and DevOps solutions",
      content: "<p>Our cloud services include...</p>",
      seoKeywords: ["cloud", "aws", "azure", "devops"],
      category: "Infrastructure",
      published: true,
      order: 4,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  const onAddConsultingService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "IT Consulting",
      type: "Service",
      description: "Strategic technology consulting for businesses",
      content: "<p>Our consulting services help businesses...</p>",
      seoKeywords: ["it consulting", "technology strategy", "digital transformation"],
      category: "Consulting",
      published: true,
      order: 5,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  const onAddEcommerceService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "E-commerce Solutions",
      type: "Service",
      description: "Custom online store development and optimization",
      content: "<p>Our e-commerce solutions include...</p>",
      seoKeywords: ["e-commerce", "online store", "shopify", "woocommerce"],
      category: "Development",
      published: true,
      order: 6,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  const onAddCMSService = () => {
    const service: Omit<ContentItem, "id"> = {
      title: "Content Management Systems",
      type: "Service",
      description: "Custom CMS solutions for your content needs",
      content: "<p>We develop content management systems...</p>",
      seoKeywords: ["cms", "wordpress", "contentful", "headless cms"],
      category: "Development",
      published: true,
      order: 7,
      lastUpdated: new Date().toISOString()
    };
    
    storageService.addContent(service);
    fetchData();
  };

  return (
    <div>
      <h1>Services Page</h1>
      <button onClick={onAddWebDevelopmentService}>Add Web Development Service</button>
      <button onClick={onAddMobileService}>Add Mobile App Service</button>
      <button onClick={onAddUIUXService}>Add UI/UX Service</button>
      <button onClick={onAddCloudService}>Add Cloud Service</button>
      <button onClick={onAddConsultingService}>Add Consulting Service</button>
      <button onClick={onAddEcommerceService}>Add E-commerce Service</button>
      <button onClick={onAddCMSService}>Add CMS Service</button>
      <ul>
        {services.map(service => (
          <li key={service.id}>{service.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
