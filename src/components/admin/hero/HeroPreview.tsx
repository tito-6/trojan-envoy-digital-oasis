
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { PartnerLogo, TechIcon } from '@/lib/types';

interface HeroPreviewProps {
  formData: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
  };
  partnerLogos: PartnerLogo[];
  techIcons: TechIcon[];
}

const HeroPreview: React.FC<HeroPreviewProps> = ({
  formData,
  partnerLogos,
  techIcons
}) => {
  return (
    <div>
      <div className="flex justify-center">
        <Button onClick={() => window.open('/', '_blank')}>
          <Eye className="h-4 w-4 mr-2" />
          View Live Hero
        </Button>
      </div>
      <div className="mt-6 p-4 border rounded-lg bg-secondary/10">
        <h2 className="text-2xl font-bold">{formData.title}</h2>
        <p className="text-sm font-medium text-secondary-foreground mt-2">{formData.subtitle}</p>
        <p className="mt-4 text-muted-foreground">{formData.description}</p>
        
        <div className="flex gap-4 mt-6">
          {formData.ctaLabel && (
            <Button>{formData.ctaLabel}</Button>
          )}
          {formData.secondaryCtaLabel && (
            <Button variant="outline">{formData.secondaryCtaLabel}</Button>
          )}
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4">Partners ({partnerLogos.length})</h3>
          <div className="flex flex-wrap gap-4">
            {partnerLogos.map((logo, i) => (
              <div key={i} className="text-center">
                <div className={`w-10 h-10 rounded-full ${logo.bgColor} flex items-center justify-center`}>
                  <div style={{ color: logo.color }}>{logo.icon}</div>
                </div>
                <span className="text-xs block mt-1">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium mb-4">Tech Stack ({techIcons.length})</h3>
          <div className="flex flex-wrap gap-4">
            {techIcons.map((tech, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                  <div style={{ color: tech.color }}>{tech.icon}</div>
                </div>
                <span className="text-xs block mt-1">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPreview;
