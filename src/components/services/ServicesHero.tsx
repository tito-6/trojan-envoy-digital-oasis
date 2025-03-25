
import React from "react";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";
import { 
  FaGoogle, 
  FaFacebook, 
  FaSearchengin, 
  FaAws, 
  FaShopify, 
  FaWordpress, 
  FaAward 
} from "react-icons/fa";

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
                <FaGoogle size={32} className="text-[#4285F4]" />
              </div>
              <span className="text-xs font-medium">Google</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <FaFacebook size={32} className="text-[#1877F2]" />
              </div>
              <span className="text-xs font-medium">Meta</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <FaSearchengin size={32} className="text-[#5FB246]" />
              </div>
              <span className="text-xs font-medium">SEMrush</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <FaAws size={32} className="text-[#FF9900]" />
              </div>
              <span className="text-xs font-medium">AWS</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <FaShopify size={32} className="text-[#7AB55C]" />
              </div>
              <span className="text-xs font-medium">Magento</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <FaWordpress size={32} className="text-[#21759B]" />
              </div>
              <span className="text-xs font-medium">WordPress</span>
              <div className="flex items-center text-green-600 mt-1">
                <CheckCircle size={12} className="mr-1" />
                <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <FaAward size={32} className="text-[#FFD700]" />
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
