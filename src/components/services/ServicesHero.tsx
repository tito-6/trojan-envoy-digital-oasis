
import React from "react";
import { useLanguage } from "@/lib/i18n";
import { 
  Chrome, 
  Facebook, 
  Search, 
  Cloud, 
  ShoppingBag, 
  FileCode, 
  Award,
  CheckCircle
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
          <p className="text-sm uppercase font-semibold text-muted-foreground mb-6">{t('partners.title')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Chrome size={32} className="text-blue-600" />
              </div>
              <span className="text-xs font-medium">Google</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Facebook size={32} className="text-blue-800" />
              </div>
              <span className="text-xs font-medium">Meta</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <Search size={32} className="text-green-600" />
              </div>
              <span className="text-xs font-medium">SEMrush</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <Cloud size={32} className="text-orange-500" />
              </div>
              <span className="text-xs font-medium">AWS</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <ShoppingBag size={32} className="text-purple-600" />
              </div>
              <span className="text-xs font-medium">Magento</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <FileCode size={32} className="text-blue-500" />
              </div>
              <span className="text-xs font-medium">WordPress</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <Award size={32} className="text-yellow-600" />
              </div>
              <span className="text-xs font-medium">{t('partners.title')}</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
