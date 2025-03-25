
import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServicesCTA from "@/components/services/ServicesCTA";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";

const Services: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Add example services if none exist
    const addExampleServicesIfEmpty = async () => {
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => item.type === "Service");
      
      if (serviceItems.length === 0 || serviceItems.length < 7) {
        // Delete existing services to ensure consistent ordering
        serviceItems.forEach(service => {
          storageService.deleteContent(service.id);
        });
        
        // Add web development service
        storageService.addContent({
          title: "Web Development Services",
          type: "Service",
          description: "Web development services",
          content: "- Responsive website design and development\n- Progressive Web Apps (PWAs)\n- E-commerce websites\n- Content Management Systems\n- Web application development\n- API development and integration\n- Performance optimization\n- SEO-friendly code structure",
          seoKeywords: ["web", "website", "development"],
          order: 1,
          published: true
        });
        
        // Add mobile app service
        storageService.addContent({
          title: "Mobile App Development",
          type: "Service",
          description: "Mobile app development",
          content: "- iOS app development\n- Android app development\n- Cross-platform development (React Native, Flutter)\n- App maintenance and updates\n- App Store optimization\n- Mobile app testing and QA\n- Push notification systems\n- In-app purchase integration",
          seoKeywords: ["mobile", "app", "android", "ios"],
          order: 2,
          published: true
        });
        
        // Add UI/UX service
        storageService.addContent({
          title: "UI/UX Design",
          type: "Service",
          description: "User interface and experience design",
          content: "- User research and testing\n- Wireframing and prototyping\n- User interface design\n- User experience optimization\n- Design systems\n- Accessibility compliance\n- Interactive prototypes\n- Usability testing",
          seoKeywords: ["design", "ui", "ux", "user interface"],
          order: 3,
          published: true
        });
        
        // Add digital marketing service
        storageService.addContent({
          title: "Digital Marketing Overview",
          type: "Service",
          description: "Digital marketing services",
          content: "- Search Engine Optimization (SEO)\n- Pay-Per-Click (PPC) advertising\n- Social media marketing\n- Content marketing\n- Email marketing campaigns\n- Analytics and reporting\n- Conversion rate optimization\n- Marketing automation",
          seoKeywords: ["marketing", "digital", "seo"],
          order: 4,
          published: true
        });
        
        // Add SEO service
        storageService.addContent({
          title: "SEO Optimization Services",
          type: "Service",
          description: "Search engine optimization services",
          content: "- Keyword research and analysis\n- On-page SEO optimization\n- Off-page SEO strategies\n- Technical SEO audits\n- Local SEO services\n- Content optimization\n- SEO reporting and analytics\n- Competitive analysis",
          seoKeywords: ["seo", "search engine", "optimization", "rankings"],
          order: 5,
          published: true
        });
        
        // Add E-commerce service
        storageService.addContent({
          title: "E-Commerce Solutions",
          type: "Service",
          description: "Custom online store development",
          content: "- E-commerce platform development\n- Shopping cart integration\n- Payment gateway setup\n- Inventory management systems\n- Product catalog management\n- Checkout process optimization\n- Order management solutions\n- E-commerce analytics",
          seoKeywords: ["ecommerce", "online store", "shop", "cart"],
          order: 6,
          published: true
        });
        
        // Add Content Creation service
        storageService.addContent({
          title: "Content Creation Services",
          type: "Service",
          description: "Professional content development",
          content: "- Blog post creation\n- Website copy development\n- Social media content\n- Email newsletter writing\n- Video script development\n- Product descriptions\n- Landing page copy\n- Content strategy planning",
          seoKeywords: ["content", "writing", "copywriting", "blogs"],
          order: 7,
          published: true
        });
        
        console.log("Example services added");
      }
    };
    
    addExampleServicesIfEmpty();
    
    // Add fade-in animation to elements with the fade-in-element class
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

    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set the page title
    document.title = `${t('services.title')} | Trojan Envoy`;

    return () => observer.disconnect();
  }, [t]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <ServicesHero />
        <ServicesList />
        <ServicesCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
