
import React, { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import References from "@/components/home/References";
import HomeFAQ from "@/components/home/HomeFAQ";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";

const Index: React.FC = () => {
  const { t } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
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

    // Set the page title based on current language
    document.title = `${t('hero.title')} | Trojan Envoy`;

    // Listen for content updates to force a re-render
    const unsubscribe = storageService.addEventListener('content-updated', () => {
      setForceUpdate(prev => prev + 1);
    });

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [t]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero key={`hero-${forceUpdate}`} />
        <Services />
        <About />
        <References />
        <HomeFAQ />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
