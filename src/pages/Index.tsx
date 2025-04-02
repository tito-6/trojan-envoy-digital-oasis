
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
  const [update, forceUpdate] = useState(false);

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

    // Get header settings for the page title
    const headerSettings = storageService.getHeaderSettings();
    document.title = `${t('hero.title')} | ${headerSettings.siteTitle}`;

    // Set up storage listeners for live updates
    const aboutUpdateListener = () => {
      // Force re-render when about settings change
      forceUpdate(prev => !prev);
    };
    
    const referencesUpdateListener = () => {
      // Force re-render when references settings change
      forceUpdate(prev => !prev);
    };
    
    const faqUpdateListener = () => {
      // Force re-render when FAQ settings change
      forceUpdate(prev => !prev);
    };
    
    const contactUpdateListener = () => {
      // Force re-render when contact settings change
      forceUpdate(prev => !prev);
    };
    
    const footerUpdateListener = () => {
      // Force re-render when footer settings change
      forceUpdate(prev => !prev);
    };
    
    // Subscribe to settings updates
    const unsubscribeAbout = storageService.addEventListener('about-settings-updated', aboutUpdateListener);
    const unsubscribeReferences = storageService.addEventListener('references-settings-updated', referencesUpdateListener);
    const unsubscribeFAQ = storageService.addEventListener('faq-settings-updated', faqUpdateListener);
    const unsubscribeContact = storageService.addEventListener('contact-settings-updated', contactUpdateListener);
    const unsubscribeFooter = storageService.addEventListener('footer-settings-updated', footerUpdateListener);
    
    return () => {
      observer.disconnect();
      unsubscribeAbout();
      unsubscribeReferences();
      unsubscribeFAQ();
      unsubscribeContact();
      unsubscribeFooter();
    };
  }, [t]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />
        <Services />
        <About key={`about-${update}`} />
        <References key={`references-${update}`} />
        <HomeFAQ key={`faq-${update}`} />
        <Contact key={`contact-${update}`} />
      </main>
      
      <Footer key={`footer-${update}`} />
    </div>
  );
};

export default Index;
