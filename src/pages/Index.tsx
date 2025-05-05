import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import About from '@/components/home/About';
import Contact from '@/components/home/Contact';
import References from '@/components/home/References';
import HomeFAQ from '@/components/home/HomeFAQ';

const Index: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Add fade-in animation to elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-element");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll(".should-animate");
    animatedElements.forEach((el) => observer.observe(el));

    // Cleanup function
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-20 space-y-12">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero />
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
