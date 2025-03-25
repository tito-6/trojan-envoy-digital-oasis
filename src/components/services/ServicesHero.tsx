
import React from "react";
import { useLanguage } from "@/lib/i18n";
import { 
  Chrome, 
  Facebook, 
  Search, 
  Cloud, 
  ShoppingBag, 
  FileCode, 
  Award
} from "lucide-react";

const ServicesHero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium should-animate">
          {t('services.subtitle')}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 should-animate">
          {t('services.title')} <span className="text-gradient">{t('services.subtitle')}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 should-animate">
          {t('services.description')}
        </p>
        
        {/* Partner Logos Section */}
        <div className="mt-12 mb-8">
          <p className="text-sm text-muted-foreground mb-6">{t('home.trusted.by')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <Chrome size={40} className="text-blue-500 mb-2" />
              <span className="text-xs font-medium">Google</span>
            </div>
            <div className="flex flex-col items-center">
              <Facebook size={40} className="text-blue-600 mb-2" />
              <span className="text-xs font-medium">Meta</span>
            </div>
            <div className="flex flex-col items-center">
              <Search size={40} className="text-green-500 mb-2" />
              <span className="text-xs font-medium">SEMrush</span>
            </div>
            <div className="flex flex-col items-center">
              <Cloud size={40} className="text-orange-500 mb-2" />
              <span className="text-xs font-medium">AWS</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag size={40} className="text-purple-500 mb-2" />
              <span className="text-xs font-medium">Magento</span>
            </div>
            <div className="flex flex-col items-center">
              <FileCode size={40} className="text-blue-400 mb-2" />
              <span className="text-xs font-medium">WordPress</span>
            </div>
            <div className="flex flex-col items-center">
              <Award size={40} className="text-yellow-500 mb-2" />
              <span className="text-xs font-medium">Certification</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
