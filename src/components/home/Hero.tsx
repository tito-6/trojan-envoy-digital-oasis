
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { ContentItem } from "@/lib/types";
import { storageService } from "@/lib/storage";
import HeroContent from "./hero/HeroContent";
import TechStack from "./hero/TechStack";
import { getDefaultPartnerIcons, getDefaultTechStackIcons } from "./hero/utils";

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroContent, setHeroContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    const loadHeroContent = () => {
      const heroItems = storageService.getContentByType('Hero');
      if (heroItems.length > 0) {
        setHeroContent(heroItems[0]);
      }
    };

    loadHeroContent();

    const unsubscribe = storageService.addEventListener('content-updated', (updatedContent: ContentItem) => {
      if (updatedContent.type === 'Hero') {
        loadHeroContent();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const title = heroContent?.title || "Navigating the Digital Frontier";
  const subtitle = heroContent?.subtitle || t('hero.subtitle');
  const description = heroContent?.description || t('hero.description');
  const ctaLabel = heroContent?.ctaLabel || t('hero.cta');
  const ctaUrl = heroContent?.ctaUrl || "/contact";
  const secondaryCtaLabel = heroContent?.secondaryCtaLabel || t('explore.services');
  const secondaryCtaUrl = heroContent?.secondaryCtaUrl || "/services";
  const partnerIcons = heroContent?.partnerLogos || getDefaultPartnerIcons();
  const techStackIcons = heroContent?.techIcons || getDefaultTechStackIcons();

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

      <HeroContent
        title={title}
        subtitle={subtitle}
        description={description}
        ctaLabel={ctaLabel}
        ctaUrl={ctaUrl}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaUrl={secondaryCtaUrl}
        partnerIcons={partnerIcons}
      />

      <TechStack techStackIcons={techStackIcons} />
    </div>
  );
};

export default Hero;
