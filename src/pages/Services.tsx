
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
      
      if (serviceItems.length === 0) {
        // Add some sample services
        storageService.addContent({
          title: "Web Development",
          type: "Service",
          description: "Custom websites and web applications built with modern technologies",
          content: "- Responsive website design and development\n- Progressive Web Apps (PWAs)\n- E-commerce websites\n- Content Management Systems\n- Web application development\n- API development and integration",
          seoKeywords: ["web", "website", "development"],
          order: 1,
          published: true
        });
        
        storageService.addContent({
          title: "Mobile App Development",
          type: "Service",
          description: "Native and cross-platform mobile applications for iOS and Android",
          content: "- iOS app development\n- Android app development\n- Cross-platform development (React Native, Flutter)\n- App maintenance and updates\n- App Store optimization\n- Mobile app testing and QA",
          seoKeywords: ["mobile", "app", "android", "ios"],
          order: 2,
          published: true
        });
        
        storageService.addContent({
          title: "UI/UX Design",
          type: "Service",
          description: "User-centered design services that enhance usability and user satisfaction",
          content: "- User research and testing\n- Wireframing and prototyping\n- User interface design\n- User experience optimization\n- Design systems\n- Accessibility compliance",
          seoKeywords: ["design", "ui", "ux", "user interface"],
          order: 3,
          published: true
        });
        
        storageService.addContent({
          title: "Digital Marketing",
          type: "Service",
          description: "Comprehensive digital marketing strategies to grow your online presence",
          content: "- Search Engine Optimization (SEO)\n- Pay-Per-Click (PPC) advertising\n- Social media marketing\n- Content marketing\n- Email marketing campaigns\n- Analytics and reporting",
          seoKeywords: ["marketing", "digital", "seo"],
          order: 4,
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

    return () => observer.disconnect();
  }, []);

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
