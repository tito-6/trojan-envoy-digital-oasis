import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { storageService } from "@/lib/storage";
import { ServiceItem, ServicesSettings } from "@/lib/types";
import { getIconComponentByName } from "@/lib/iconUtils";

interface ServicesCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const ServicesCard: React.FC<ServicesCardProps> = ({ 
  title, 
  description, 
  icon, 
  link, 
  className,
  iconBgColor = "bg-secondary",
  iconColor = "text-foreground"
}) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden bg-card rounded-xl p-6 border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className={cn("rounded-lg w-12 h-12 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors", iconBgColor)}>
          <div className={cn("w-5 h-5", iconColor)}>
            {icon}
          </div>
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

const defaultServices: ServiceItem[] = [
  {
    id: 1,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies to meet your business needs.",
    iconName: "Code",
    link: "/services/web-development",
    order: 1,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications for iOS and Android devices.",
    iconName: "Smartphone",
    link: "/services/mobile-development",
    order: 2,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "User-centered design that enhances the user experience and increases conversion rates.",
    iconName: "Paintbrush",
    link: "/services/ui-ux-design",
    order: 3,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description: "Data-driven marketing strategies to increase your online presence and drive results.",
    iconName: "BarChart",
    link: "/services/digital-marketing",
    order: 4,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const defaultSettings: ServicesSettings = {
  id: 1,
  title: "Our Services",
  subtitle: "What We Do",
  description: "We provide comprehensive digital solutions to help businesses succeed in the digital age.",
  viewAllText: "View All Services",
  viewAllUrl: "/services",
  services: defaultServices,
  lastUpdated: new Date().toISOString(),
};

const Services: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ServicesSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const storedSettings = await storageService.getServicesSettings();
        if (storedSettings) {
          setSettings(storedSettings);
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading services settings:', error);
        setError('Failed to load services. Please try again later.');
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
    
    const unsubscribe = storageService.addEventListener('services-settings-updated', loadSettings);
    
    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding bg-background" id="services">
        <div className="container mx-auto text-center">
          <div className="animate-pulse">Loading services...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-background" id="services">
        <div className="container mx-auto text-center text-red-500">
          {error}
        </div>
      </section>
    );
  }

  const currentSettings = settings || defaultSettings;
  
  // Sort services by order
  const sortedServices = [...(currentSettings.services || [])].sort((a, b) => a.order - b.order);

  return (
    <section className="section-padding bg-background" id="services">
      <div className="container mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium animate-slide-up">
            {currentSettings.subtitle}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 animate-slide-up">
            {currentSettings.title}
          </h2>
          
          <p className="text-muted-foreground animate-slide-up">
            {currentSettings.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedServices.map((service, index) => {
            const IconComponent = getIconComponentByName(service.iconName);
            return (
              <ServicesCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={IconComponent ? <IconComponent /> : null}
                link={service.link}
                className={`animate-slide-up delay-${index * 100}`}
                iconBgColor={service.bgColor || "bg-secondary"}
                iconColor={service.color || "text-foreground"}
              />
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to={currentSettings.viewAllUrl}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {currentSettings.viewAllText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
