
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { HeroSettings, PartnerLogo, TechIcon } from "@/lib/types";
import { 
  FaGoogle, 
  FaFacebook, 
  FaSearchengin, 
  FaAws, 
  FaShopify, 
  FaWordpress, 
  FaAward,
  FaReact,
  FaVuejs,
  FaAngular,
  FaNode,
  FaPython,
  FaJava,
  FaPhp,
  FaSwift,
  FaDatabase,
  FaDocker,
  FaGithub
} from "react-icons/fa";

import {
  SiTypescript,
  SiJavascript,
  SiFirebase,
  SiMongodb,
  SiGraphql,
  SiTailwindcss,
  SiFlutter,
  SiKotlin,
  SiSemrush
} from "react-icons/si";

// Import all icon libraries
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Ai from "react-icons/ai";
import * as Bs from "react-icons/bs";
import * as Fi from "react-icons/fi";
import * as Gr from "react-icons/gr";
import * as Hi from "react-icons/hi";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import * as Ti from "react-icons/ti";
import * as Vsc from "react-icons/vsc";
import * as Di from "react-icons/di";
import * as Bi from "react-icons/bi";
import * as Fc from "react-icons/fc";
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import * as Ri from "react-icons/ri";
import * as Wi from "react-icons/wi";
import * as Ci from "react-icons/ci";
import * as Gi from "react-icons/gi";
import * as Cg from "react-icons/cg";
import * as Lu from "react-icons/lu";
import * as Pi from "react-icons/pi";
import * as Tb from "react-icons/tb";
import * as Sl from "react-icons/sl";
import * as Rx from "react-icons/rx";
import * as Go from "react-icons/go";

// Comprehensive icon map
const iconLibraries = {
  Fa, Si, Ai, Bs, Fi, Gr, Hi, Im, Md, Ti, 
  Vsc, Di, Bi, Fc, Io, Io5, Ri, Wi, Ci, Gi, 
  Cg, Lu, Pi, Tb, Sl, Rx, Go
};

// Dynamic icon map for rendering
const getIconComponent = (iconName: string): React.ComponentType<any> => {
  // For custom icons (URL or uploaded)
  if (iconName === 'custom') {
    // Placeholder for custom icons
    return FaAward;
  }
  
  // Extract prefix (first 2 characters for standard libraries)
  const prefix = iconName.substring(0, 2);
  
  // Try to find the component in the libraries
  for (const [libPrefix, library] of Object.entries(iconLibraries)) {
    if (iconName.startsWith(libPrefix)) {
      const component = (library as any)[iconName];
      if (component) return component;
    }
  }
  
  // Fallback to a default icon if not found
  return FaAward;
};

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);
  const heroSettings = storageService.getHeroSettings();

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

  // Event listener for hero settings changes
  useEffect(() => {
    const unsubscribe = storageService.addEventListener('hero-settings-updated', () => {
      // Force component re-render when hero settings are updated
      setForceUpdate(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  // Use a state variable to force re-render when hero settings change
  const [forceUpdate, setForceUpdate] = React.useState(0);
  
  const renderPartnerLogo = (logo: PartnerLogo) => {
    const Icon = getIconComponent(logo.iconName);
    
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
          <Icon size={32} style={{ color: logo.color }} />
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
    const Icon = getIconComponent(icon.iconName);
    
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
          <Icon size={36} style={{ color: icon.color }} />
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
      {/* Background Elements */}
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

      {/* Small Grid Elements */}
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
          
          {/* Trusted by section with React icons */}
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

      {/* Technology Stack Section */}
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

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl"></div>
        </div>
      )}
    </div>
  );
};

export default Hero;
