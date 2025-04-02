import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/common/Header";
import Footer from '@/components/common/Footer';
import AboutHero from '@/components/about/AboutHero';
import ValuesSection from '@/components/about/ValuesSection';
import TeamSection from '@/components/about/TeamSection';
import { useLanguage } from "@/lib/i18n";
import { storageService } from '@/lib/storage';

const About: React.FC = () => {
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
        <AboutHero />
        <ValuesSection />
        <TeamSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
