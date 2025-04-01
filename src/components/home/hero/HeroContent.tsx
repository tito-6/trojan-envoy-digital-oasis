
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import PartnerLogos from "./PartnerLogos";
import { PartnerLogo } from "@/lib/types";

interface HeroContentProps {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  partnerIcons: PartnerLogo[];
}

const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  description,
  ctaLabel,
  ctaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  partnerIcons,
}) => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-6 text-sm font-medium animate-fade-in">
          {subtitle}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 animate-fade-in delay-100">
          {title}
          <span className="block text-gradient">{subtitle}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
          <Link
            to={ctaUrl}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            to={secondaryCtaUrl}
            className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            {secondaryCtaLabel}
          </Link>
        </div>
        
        <PartnerLogos partnerIcons={partnerIcons} />
      </div>
    </div>
  );
};

export default HeroContent;
