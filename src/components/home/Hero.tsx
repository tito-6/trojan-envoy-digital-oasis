
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { 
  FaGoogle, 
  FaFacebook, // Replace FaMeta with FaFacebook as Meta's icon
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
  FaAws as FaAwsLogo,
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

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);

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

  const partnerIcons = [
    { 
      Icon: FaGoogle, 
      name: "Google", 
      color: "#4285F4",
      bgColor: "bg-blue-100"
    },
    { 
      Icon: FaFacebook, // Use FaFacebook instead of FaMeta
      name: "Meta", 
      color: "#1877F2",
      bgColor: "bg-blue-100"
    },
    { 
      Icon: SiSemrush, 
      name: "SEMrush", 
      color: "#5FB246",
      bgColor: "bg-green-100"
    },
    { 
      Icon: FaAws, 
      name: "AWS", 
      color: "#FF9900",
      bgColor: "bg-orange-100"
    },
    { 
      Icon: FaShopify, 
      name: "Magento", 
      color: "#7AB55C",
      bgColor: "bg-purple-100"
    },
    { 
      Icon: FaWordpress, 
      name: "WordPress", 
      color: "#21759B",
      bgColor: "bg-blue-100"
    },
    { 
      Icon: FaAward, 
      name: t('partners.title'), 
      color: "#FFD700",
      bgColor: "bg-yellow-100"
    }
  ];

  const techStackIcons = [
    { Icon: FaReact, name: "React", color: "#61DAFB", animate: "animate-float" },
    { Icon: SiTypescript, name: "TypeScript", color: "#3178C6", animate: "animate-pulse-soft" },
    { Icon: FaVuejs, name: "Vue.js", color: "#4FC08D", animate: "animate-float" },
    { Icon: FaAngular, name: "Angular", color: "#DD0031", animate: "animate-pulse-soft" },
    { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E", animate: "animate-float" },
    { Icon: FaNode, name: "Node.js", color: "#339933", animate: "animate-pulse-soft" },
    { Icon: FaPython, name: "Python", color: "#3776AB", animate: "animate-float" },
    { Icon: FaJava, name: "Java", color: "#007396", animate: "animate-pulse-soft" },
    { Icon: FaPhp, name: "PHP", color: "#777BB4", animate: "animate-float" },
    { Icon: SiKotlin, name: "Kotlin", color: "#7F52FF", animate: "animate-pulse-soft" },
    { Icon: FaSwift, name: "Swift", color: "#FA7343", animate: "animate-float" },
    { Icon: SiFlutter, name: "Flutter", color: "#02569B", animate: "animate-pulse-soft" },
    { Icon: SiFirebase, name: "Firebase", color: "#FFCA28", animate: "animate-float" },
    { Icon: SiMongodb, name: "MongoDB", color: "#47A248", animate: "animate-pulse-soft" },
    { Icon: FaDatabase, name: "SQL", color: "#4479A1", animate: "animate-float" },
    { Icon: SiGraphql, name: "GraphQL", color: "#E10098", animate: "animate-pulse-soft" },
    { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4", animate: "animate-float" },
    { Icon: FaDocker, name: "Docker", color: "#2496ED", animate: "animate-pulse-soft" },
    { Icon: FaAwsLogo, name: "AWS", color: "#FF9900", animate: "animate-float" },
    { Icon: FaGithub, name: "GitHub", color: "#181717", animate: "animate-pulse-soft" }
  ];

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
            {t('hero.subtitle')}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 animate-fade-in delay-100">
            {t('hero.title')}
            <span className="block text-gradient">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <Link
              to="/contact"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/services"
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              {t('explore.services')}
            </Link>
          </div>
          
          {/* Trusted by section with React icons */}
          <div className="mt-16 md:mt-24">
            <p className="text-sm text-muted-foreground mb-6 animate-fade-in delay-400">
              {t('partners.title')}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 animate-fade-in delay-500">
              {partnerIcons.map((item, index) => (
                <div 
                  key={item.name} 
                  className="relative flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-110 group flip-card"
                  style={{ 
                    animationDelay: `${500 + (index * 100)}ms`,
                    opacity: 0,
                    animation: 'fadeInUp 0.6s ease forwards'
                  }}
                >
                  <div className={`w-16 h-16 rounded-full ${item.bgColor} flex items-center justify-center mb-3 flip-card-inner`}>
                    <item.Icon size={32} style={{ color: item.color }} />
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                  <div className="flex items-center text-green-600 mt-1">
                    <Award className="w-3 h-3 mr-1" />
                    <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
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
                key={tech.name}
                className="tech-icon flex flex-col items-center justify-center opacity-0 transform translate-y-8"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transition: 'all 0.5s ease'
                }}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-3 ${tech.animate} hover:shadow-lg transition-all duration-300`}
                >
                  <tech.Icon size={36} style={{ color: tech.color }} />
                </div>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hero;
