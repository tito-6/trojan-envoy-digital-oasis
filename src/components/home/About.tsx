import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const About: React.FC = () => {
  const { t } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);
  
  const stats = [
    { value: "10+", label: "Years Experience", start: "0" },
    { value: "200+", label: "Projects Completed", start: "0" },
    { value: "50+", label: "Team Members", start: "0" },
    { value: "98%", label: "Client Satisfaction", start: "0" },
  ];
  
  const keyPoints = [
    "Industry-leading expertise",
    "Results-driven approach",
    "Innovative technologies",
    "Dedicated support",
    "Transparent communication",
    "Agile methodology",
  ];

  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counterElements = entry.target.querySelectorAll('.counter');
          counterElements.forEach((element) => {
            element.classList.add('counter-animated');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium">
              About Our Agency
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t('about.title')}
              <span className="block text-gradient mt-1">{t('about.subtitle')}</span>
            </h2>
            
            <p className="text-muted-foreground mb-6">
              {t('about.description')}
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{t('about.mission.title')}</h3>
              <p className="text-muted-foreground">
                {t('about.mission.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {keyPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{point}</span>
                </div>
              ))}
            </div>
            
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Learn more about us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative" ref={statsRef}>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="card-hover stats-card bg-background p-6 rounded-xl border border-border h-full flex flex-col items-center justify-center text-center"
                >
                  <div 
                    className="counter text-3xl md:text-4xl font-bold mb-2"
                    data-start={stat.start}
                    data-end={stat.value}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -left-4 w-24 h-24 rounded-full bg-primary/5 blur-2xl"></div>
            <div className="absolute -z-10 -bottom-4 -right-4 w-32 h-32 rounded-full bg-accent/5 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
