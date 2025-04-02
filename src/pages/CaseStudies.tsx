import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storageService } from '@/lib/storage';
import { Clock, Tag, ArrowRight } from 'lucide-react';

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  industry: string;
  services: string[];
  challenge: string;
  solution: string;
  results: string;
  image: string;
  slug: string;
}

const CaseStudies: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Case Studies | Trojan Envoy";
  }, []);

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "E-commerce Platform Redesign",
      client: "GlobalShop",
      industry: "Retail",
      services: ["Web Development", "UI/UX Design", "Digital Marketing"],
      challenge: "GlobalShop faced declining conversion rates and customer complaints about their outdated e-commerce platform. Their legacy system was slow, not mobile-friendly, and had a complicated checkout process.",
      solution: "We redesigned the entire e-commerce platform with a focus on user experience, mobile responsiveness, and checkout simplification. We implemented a modern tech stack with React for the frontend and optimized the entire infrastructure for speed.",
      results: "Within 3 months, GlobalShop saw a 45% increase in conversion rates, 30% reduction in cart abandonment, and 60% increase in mobile sales. Overall revenue increased by 28% year-over-year.",
      image: "https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      slug: "globalshop-ecommerce-redesign"
    },
    {
      id: 2,
      title: "Healthcare Mobile App Development",
      client: "MedConnect",
      industry: "Healthcare",
      services: ["Mobile Development", "UI/UX Design", "API Integration"],
      challenge: "MedConnect needed a secure, HIPAA-compliant mobile app to connect patients with healthcare providers, schedule appointments, and manage medical records. They had strict requirements for security and ease of use.",
      solution: "We developed native iOS and Android applications with end-to-end encryption, biometric authentication, and intuitive interfaces. The app integrated with their existing systems and electronic health records (EHR) via secure APIs.",
      results: "The app achieved 50,000+ downloads in the first month, reduced appointment no-shows by 35%, and earned a 4.8/5 rating on app stores. Patient satisfaction scores increased by 40%.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      slug: "medconnect-healthcare-app"
    },
    {
      id: 3,
      title: "Digital Marketing Campaign",
      client: "EcoFriendly",
      industry: "Sustainable Products",
      services: ["Digital Marketing", "Social Media", "Content Strategy"],
      challenge: "EcoFriendly, a sustainable products brand, struggled with brand awareness and reaching their target audience despite having high-quality eco-friendly products. Their digital presence was minimal with low engagement.",
      solution: "We developed a comprehensive digital marketing strategy focusing on content marketing, influencer partnerships, and targeted social media campaigns. We created compelling storytelling around their sustainability mission and products.",
      results: "Within 6 months, EcoFriendly saw a 300% increase in social media followers, 250% increase in website traffic, and 85% increase in online sales. Their customer acquisition cost decreased by 40%.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      slug: "ecofriendly-digital-marketing"
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{t('caseStudies.title')}</h1>
            <p className="text-xl text-muted-foreground">
              {t('caseStudies.subtitle')}
            </p>
          </div>
          
          {/* Case Studies Grid */}
          <div className="grid gap-12 mb-16">
            {caseStudies.map((study, index) => (
              <div 
                key={study.id} 
                className="grid md:grid-cols-2 gap-8 items-center p-6 rounded-xl border border-border hover:border-primary/50 transition-all card-hover"
              >
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="bg-secondary/50 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
                    {study.industry}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4">{study.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    <strong>Client:</strong> {study.client}
                  </p>
                  
                  <div className="mb-4">
                    <strong>Services:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {study.services.map(service => (
                        <span key={service} className="bg-primary/10 text-sm px-3 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Challenge:</h3>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>
                  
                  <Link 
                    to={`/case-studies/${study.slug}`} 
                    className="inline-flex items-center text-primary hover:underline mt-4"
                  >
                    Read full case study <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-[300px] object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="text-center max-w-2xl mx-auto bg-secondary/50 rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to create your success story?</h2>
            <p className="text-muted-foreground mb-6">
              Let us help transform your business with our innovative digital solutions.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudies;
