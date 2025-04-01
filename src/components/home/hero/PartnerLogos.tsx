
import React from "react";
import { Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { PartnerLogo } from "@/lib/types";
import { renderIcon } from "./utils";

interface PartnerLogosProps {
  partnerIcons: PartnerLogo[];
}

const PartnerLogos: React.FC<PartnerLogosProps> = ({ partnerIcons }) => {
  const { t } = useLanguage();
  
  return (
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
              {renderIcon(item.icon, 32, { color: item.color })}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
            {item.certified && (
              <div className="flex items-center text-green-600 mt-1">
                <Award className="w-3 h-3 mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogos;
