
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { TechIcon } from "@/lib/types";
import { renderIcon } from "./utils";

interface TechStackProps {
  techStackIcons: TechIcon[];
}

const TechStack: React.FC<TechStackProps> = ({ techStackIcons }) => {
  const { t } = useLanguage();
  const techSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleTechIconsAnimation = () => {
      if (!techSectionRef.current) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const icons = techSectionRef.current?.querySelectorAll('.tech-icon');
            icons?.forEach((icon, index) => {
              setTimeout(() => {
                icon.classList.add('animate-tech-icon');
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      if (techSectionRef.current) {
        observer.observe(techSectionRef.current);
      }
      
      return () => observer.disconnect();
    };

    handleTechIconsAnimation();
  }, []);

  return (
    <div 
      ref={techSectionRef}
      className="w-full py-20 bg-gradient-to-b from-background via-background/90 to-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium should-animate">
            {t('services.subtitle')}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
            {t('services.title')} <span className="text-gradient">{t('services.subtitle')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto should-animate">
            We leverage cutting-edge technology to build modern, scalable solutions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {techStackIcons.map((tech, index) => (
            <div 
              key={`${tech.name}-${index}`}
              className="tech-icon flex flex-col items-center justify-center opacity-0 transform translate-y-8"
              style={{ 
                transitionDelay: `${index * 50}ms`,
                transition: 'all 0.5s ease'
              }}
            >
              <div 
                className={`w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-3 ${tech.animate} hover:shadow-lg transition-all duration-300`}
              >
                {renderIcon(tech.icon, 36, { color: tech.color })}
              </div>
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl"></div>
    </div>
  );
};

export default TechStack;
