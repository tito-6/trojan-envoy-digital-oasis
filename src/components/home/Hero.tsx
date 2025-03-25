
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
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
            Premium Software Development & Digital Marketing
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 animate-fade-in delay-100">
            {t('hero.title')}
            <span className="block text-gradient">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
            We create exceptional digital experiences through innovative software development, strategic marketing, and cutting-edge design.
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
              Explore Our Services
            </Link>
          </div>
          
          {/* Trusted by logos */}
          <div className="mt-16 md:mt-24">
            <p className="text-sm text-muted-foreground mb-6 animate-fade-in delay-400">
              Certified Partners With Leading Platforms
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 animate-fade-in delay-500">
              {['Google', 'Meta', 'SEMrush', 'AWS', 'Magento', 'WordPress', 'ERC'].map((brand) => (
                <div key={brand} className="flex items-center justify-center">
                  <span className="text-lg font-bold tracking-tight">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
