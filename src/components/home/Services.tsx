
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Smartphone, Paintbrush, BarChart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ServicesCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
}> = ({ title, description, icon, link, className }) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden bg-card rounded-xl p-6 border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="bg-secondary rounded-lg w-12 h-12 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        
        <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
        
        <Link
          to={link}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="absolute -z-10 inset-0 bg-gradient-to-b from-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

const Services: React.FC = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      title: t('services.web.title'),
      description: t('services.web.description'),
      icon: <Code className="w-5 h-5" />,
      link: "/services/web-development",
    },
    {
      title: t('services.mobile.title'),
      description: t('services.mobile.description'),
      icon: <Smartphone className="w-5 h-5" />,
      link: "/services/mobile-development",
    },
    {
      title: t('services.ui.title'),
      description: t('services.ui.description'),
      icon: <Paintbrush className="w-5 h-5" />,
      link: "/services/ui-ux-design",
    },
    {
      title: t('services.digital.title'),
      description: t('services.digital.description'),
      icon: <BarChart className="w-5 h-5" />,
      link: "/services/digital-marketing",
    },
  ];

  return (
    <section className="section-padding bg-background" id="services">
      <div className="container mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium animate-slide-up">
            What We Do
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-slide-up">
            {t('services.title')}
          </h2>
          
          <p className="text-muted-foreground animate-slide-up">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServicesCard
              key={service.title}
              {...service}
              className={`animate-slide-up delay-${index * 100}`}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
