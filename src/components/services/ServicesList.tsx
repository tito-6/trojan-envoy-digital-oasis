import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Code, 
  Smartphone, 
  Paintbrush, 
  BarChart, 
  Globe, 
  ShoppingCart, 
  FileText, 
  Zap,
  Sparkles,
  Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { ContentItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  link: string;
  delay: number;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon, 
  features, 
  link, 
  delay,
  index 
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isEven = index % 2 === 0;
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const shimmerVariants = {
    hidden: { x: "-100%", opacity: 0.3 },
    visible: { 
      x: "100%", 
      opacity: 0.6,
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "linear",
        delay: delay
      }
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <Card 
        className={`h-full overflow-hidden relative group ${
          isHovered ? "shadow-xl ring-1 ring-primary/20" : "shadow-md"
        } transition-all duration-500`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card background effects */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${
            isEven 
              ? "from-blue-500/[0.03] to-purple-500/[0.03]" 
              : "from-primary/[0.03] to-orange-500/[0.03]"
          }`}
        ></div>
        
        <motion.div 
          className="absolute inset-0 bg-white/5 -z-10" 
          variants={shimmerVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        />
        
        <div className="p-6 flex flex-col h-full relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl ${
              isEven 
                ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20" 
                : "bg-gradient-to-br from-primary/20 to-orange-500/20"
            } flex items-center justify-center`}>
              {icon}
            </div>
            
            <div>
              <h3 className="text-xl font-display font-semibold group-hover:text-primary transition-colors duration-300">{title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            </div>
          </div>
          
          <div className="flex-grow">
            <ul className="space-y-3 mb-6">
              {features.slice(0, 3).map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-2 text-sm group/feature"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5 group-hover/feature:bg-primary/20 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-muted-foreground group-hover/feature:text-foreground transition-colors">{feature}</span>
                </motion.li>
              ))}
              
              {features.length > 3 && (
                <motion.div 
                  className="text-xs text-muted-foreground/70 pl-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  +{features.length - 3} more features
                </motion.div>
              )}
            </ul>
          </div>
          
          <Link
            to={link}
            className="inline-flex items-center gap-1.5 text-sm font-medium group/link relative"
          >
            <span className="group-hover/link:text-primary transition-colors">
              {t('learn.more')}
            </span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform text-primary" />
            
            <motion.span 
              className="absolute -bottom-px left-0 w-full h-px bg-primary"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

const getIconForService = (title: string) => {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('web')) return <Code className="w-5 h-5 text-blue-500" />;
  if (normalizedTitle.includes('mobile')) return <Smartphone className="w-5 h-5 text-purple-500" />;
  if (normalizedTitle.includes('ui') || normalizedTitle.includes('ux') || normalizedTitle.includes('design')) return <Paintbrush className="w-5 h-5 text-pink-500" />;
  if (normalizedTitle.includes('market')) return <BarChart className="w-5 h-5 text-green-500" />;
  if (normalizedTitle.includes('seo')) return <Globe className="w-5 h-5 text-cyan-500" />;
  if (normalizedTitle.includes('commerce')) return <ShoppingCart className="w-5 h-5 text-orange-500" />;
  if (normalizedTitle.includes('content')) return <FileText className="w-5 h-5 text-yellow-500" />;
  return <Zap className="w-5 h-5 text-primary" />;
};

const ServicesList: React.FC = () => {
  const { t } = useLanguage();
  const [services, setServices] = useState<ContentItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  useEffect(() => {
    const loadServices = () => {
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => 
        item.type === "Service" && item.published === true
      );
      
      const sortedServices = [...serviceItems].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a.title.localeCompare(b.title);
      });
      
      setServices(sortedServices);
    };
    
    loadServices();
    
    const unsubscribe = storageService.addEventListener('content-updated', loadServices);
    const unsubscribeAdded = storageService.addEventListener('content-added', loadServices);
    const unsubscribeDeleted = storageService.addEventListener('content-deleted', loadServices);
    
    return () => {
      unsubscribe();
      unsubscribeAdded();
      unsubscribeDeleted();
    };
  }, []);
  
  const parseFeatures = (content?: string): string[] => {
    if (!content) return [];
    
    if (content.includes('- ') || content.includes('• ')) {
      return content
        .split(/\n/)
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);
    }
    
    return content
      .split(/\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .slice(0, 5);
  };
  
  if (services.length === 0) {
    return (
      <section className="py-16 md:py-24" ref={containerRef}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            No services found. Add some from the Content Management System.
          </p>
        </div>
      </section>
    );
  }
  
  return (
    <motion.section 
      className="py-20 md:py-32 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Section header */}
      <div className="container mx-auto px-4 mb-16">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Our Expertise</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Comprehensive <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Professional Services</span>
          </h2>
          
          <p className="text-muted-foreground">
            We offer a wide range of specialized services designed to help your business thrive in the digital landscape.
            Every solution is tailored to meet your specific needs and goals.
          </p>
        </motion.div>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] -z-10"></div>
      
      <motion.div
        className="absolute top-40 left-0 w-60 h-60 rounded-full bg-primary/5 blur-[100px] -z-5"
        style={{ y }}
      />
      
      <motion.div
        className="absolute bottom-40 right-0 w-80 h-80 rounded-full bg-purple-500/5 blur-[120px] -z-5"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Floating elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-0"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
        >
          <motion.div
            className="text-primary/10 opacity-40"
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            {i % 2 === 0 ? (
              <Star className="w-6 h-6" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </motion.div>
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4">
        {/* Featured service if available */}
        {services.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to={`/services/${services[0].slug || services[0].title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-8 lg:p-12 shadow-lg group hover:shadow-xl transition-all duration-500">
                {/* Background effects */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[radial-gradient(farthest-side_at_top_right,rgb(var(--primary-500))/0.2,transparent_70%)]"></div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
                  <div className="lg:w-1/2">
                    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary px-3 mb-4 py-1.5">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Featured Service
                    </Badge>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                      {services[0].title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      {services[0].description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {parseFeatures(services[0].content).slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="px-2.5 py-1 bg-secondary/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></div>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="inline-flex items-center gap-2 group/link">
                      <span className="group-hover/link:text-primary transition-colors font-medium">
                        {t('learn.more')}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform text-primary" />
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2 aspect-video rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
                        {getIconForService(services[0].title)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated border gradient */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                    backgroundSize: ["100% 100%", "200% 200%"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>
            </Link>
          </motion.div>
        )}
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(services.length > 0 ? 1 : 0).map((service, index) => {
            const features = parseFeatures(service.content);
            
            return (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={getIconForService(service.title)}
                features={features.length > 0 ? features : [t('service.details')]}
                link={`/services/${service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}`}
                delay={(index % 9) * 0.1}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesList;
