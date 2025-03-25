
import React, { useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServicesCTA from "@/components/services/ServicesCTA";
import { useLanguage } from "@/lib/i18n";

const Services: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Add fade-in animation to elements
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
