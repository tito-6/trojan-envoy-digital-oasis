
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { HeroSettings, PartnerLogo, TechIcon } from "@/lib/types";
import { getIconComponentByName } from "@/lib/iconUtils";

const renderIcon = (iconName: string, props = {}) => {
  if (iconName.startsWith('data:')) {
    return (
      <img 
        src={iconName} 
        alt="Custom Icon" 
        className="w-full h-full object-contain" 
        {...props} 
      />
    );
  }
  
  const IconComponent = getIconComponentByName(iconName);
  if (IconComponent) {
    return <IconComponent {...props} />;
  }
  
  return <Award {...props} />;
};

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);
  const [heroSettings, setHeroSettings] = useState(storageService.getHeroSettings());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const elements = heroRef.current.querySelectorAll('.parallax-element');
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) / 25;
      const moveY = (e.clientY - centerY) / 25;
      
      elements.forEach((el) => {
        const depth = parseFloat((el as HTMLElement).dataset.depth || "1");
        const translationX = moveX * depth;
        const translationY = moveY * depth;
        
        (el as HTMLElement).style.transform = `translate(${translationX}px, ${translationY}px)`;
      });
    };

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

    document.addEventListener('mousemove', handleMouseMove);
    handleTechIconsAnimation();
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = storageService.addEventListener('hero-settings-updated', () => {
      setHeroSettings(storageService.getHeroSettings());
    });
    
    return unsubscribe;
  }, []);
  
  const renderPartnerLogo = (logo: PartnerLogo) => {
    return (
      <div 
        key={logo.id} 
        className="relative flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-110 group flip-card"
        style={{ 
          animationDelay: `${500 + (logo.order * 100)}ms`,
          opacity: 0,
          animation: 'fadeInUp 0.6s ease forwards'
        }}
      >
        <div className={`w-16 h-16 rounded-full ${logo.bgColor} flex items-center justify-center mb-3 flip-card-inner`}>
          {renderIcon(logo.iconName, { size: 32, style: { color: logo.color } })}
        </div>
        <span className="text-xs font-medium">{logo.name}</span>
        <div className="flex items-center text-green-600 mt-1">
          <Award className="w-3 h-3 mr-1" />
          <span className="text-[10px] uppercase font-bold">{heroSettings.partnerCertifiedText}</span>
        </div>
      </div>
    );
  };
  
  const renderTechIcon = (icon: TechIcon) => {
    return (
      <div 
        key={icon.id}
        className="tech-icon flex flex-col items-center justify-center opacity-0 transform translate-y-8"
        style={{ 
          transitionDelay: `${icon.order * 50}ms`,
          transition: 'all 0.5s ease'
        }}
      >
        <div 
          className={`w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-3 ${icon.animation} hover:shadow-lg transition-all duration-300`}
        >
          {renderIcon(icon.iconName, { size: 36, style: { color: icon.color } })}
        </div>
        <span className="text-sm font-medium">{icon.name}</span>
      </div>
    );
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-start overflow-hidden pt-20"
    >
      <div className="absolute inset-0 -z-10">
        <div 
          className="parallax-element absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          data-depth="0.3"
        ></div>
        <div 
          className="parallax-element absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          data-depth="0.5"
        ></div>
      </div>

      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-6 text-sm font-medium animate-fade-in">
            {heroSettings.subtitle}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 animate-fade-in delay-100">
            {heroSettings.title}
            <span className="block text-gradient">{heroSettings.subtitle}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
            {heroSettings.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <Link
              to={heroSettings.primaryButtonUrl}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              {heroSettings.primaryButtonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to={heroSettings.secondaryButtonUrl}
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              {heroSettings.secondaryButtonText}
            </Link>
          </div>
          
          {heroSettings.showPartnerLogos && (
            <div className="mt-16 md:mt-24">
              <p className="text-sm text-muted-foreground mb-6 animate-fade-in delay-400">
                {heroSettings.partnerSectionTitle}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 animate-fade-in delay-500">
                {heroSettings.partnerLogos.map(renderPartnerLogo)}
              </div>
            </div>
          )}
        </div>
      </div>

      {heroSettings.showTechStack && (
        <div 
          ref={techSectionRef}
          className="w-full py-20 bg-gradient-to-b from-background via-background/90 to-background relative overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium should-animate">
                {heroSettings.techStackSubtitle}
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
                {heroSettings.techStackTitle} <span className="text-gradient">{heroSettings.techStackSubtitle}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto should-animate">
                {heroSettings.techStackDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
              {heroSettings.techIcons.map(renderTechIcon)}
            </div>
          </div>

          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl"></div>
        </div>
      )}
    </div>
  );
};

export default Hero;
