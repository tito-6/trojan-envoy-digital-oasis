import React, { useEffect } from "react";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WorldReferences from "@/components/home/WorldReferences";
import HomeFAQ from "@/components/home/HomeFAQ";
import SEO from "@/components/common/SEO";
import { useLanguage } from "@/lib/i18n";

const Index: React.FC = () => {
  const { t } = useLanguage();

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

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO 
        title={t('hero.title')}
        description={t('hero.description')}
        path="/"
      />
      
      <Header />
      
      <main>
        <article itemScope itemType="https://schema.org/WebPage">
          <meta itemProp="name" content={t('hero.title')} />
          <meta itemProp="description" content={t('hero.description')} />
          
          <Hero />
          
          <section itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content={t('services.title')} />
            <meta itemProp="description" content={t('services.subtitle')} />
            <Services />
          </section>
          
          <section itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content={t('about.title')} />
            <meta itemProp="description" content={t('about.description')} />
            <About />
          </section>
          
          <section itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content={t('references.title')} />
            <WorldReferences />
          </section>
          
          <section itemScope itemType="https://schema.org/FAQPage">
            <meta itemProp="name" content={t('faq.title')} />
            <HomeFAQ />
          </section>
          
          <section itemScope itemType="https://schema.org/ContactPoint">
            <meta itemProp="name" content={t('contact.title')} />
            <Contact />
          </section>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
