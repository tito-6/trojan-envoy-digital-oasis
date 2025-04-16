import React, { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle, Sparkles, Stars, Rocket, Zap, Database, Globe, Search, ShoppingCart, PencilRuler } from "lucide-react";
import { 
  FaGoogle, 
  FaFacebook, 
  FaSearchengin, 
  FaAws, 
  FaShopify, 
  FaWordpress, 
  FaAward 
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// 3D floating card component
const FloatingCard = ({ 
  icon: Icon, 
  iconColor, 
  title, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  iconColor: string; 
  title: string;
  delay?: number;
}) => {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="bg-card/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center h-full relative z-10"
        whileHover={{ 
          y: -5, 
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          borderColor: "rgba(255,255,255,0.3)"
        }}
      >
        <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white" />
        </div>
        <span className="text-sm font-medium text-center">{title}</span>
      </motion.div>
    </motion.div>
  );
};

// Animated partner logo component
const PartnerLogo = ({ 
  icon: Icon, 
  name, 
  color, 
  delay = 0 
}: {
  icon: React.ElementType;
  name: string;
  color: string;
  delay?: number;
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-3 transition-shadow`}
        whileHover={{ boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
      >
        <Icon size={32} />
      </motion.div>
      <span className="text-xs font-medium">{name}</span>
      <div className="flex items-center text-green-600 mt-1">
        <CheckCircle size={12} className="mr-1" />
        <span className="text-[10px] uppercase font-bold">Certified</span>
      </div>
    </motion.div>
  );
};

const ServicesHero: React.FC = () => {
  const { t } = useLanguage();
  const controls = useAnimation();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const headlines = [
    "Digital Solutions for Modern Business",
    "Expert Development Services",
    "Strategic Digital Transformation",
    "Building the Future Today"
  ];
  
  const serviceIcons = [
    { icon: Rocket, color: "bg-gradient-to-r from-blue-500 to-purple-500", title: "Web Development" },
    { icon: Zap, color: "bg-gradient-to-r from-orange-400 to-pink-500", title: "Fast Performance" },
    { icon: Database, color: "bg-gradient-to-r from-green-400 to-teal-500", title: "Secure Storage" },
    { icon: Globe, color: "bg-gradient-to-r from-blue-400 to-cyan-400", title: "Global Reach" },
    { icon: Search, color: "bg-gradient-to-r from-yellow-400 to-orange-500", title: "SEO Optimization" },
    { icon: ShoppingCart, color: "bg-gradient-to-r from-pink-400 to-red-500", title: "E-Commerce" },
    { icon: PencilRuler, color: "bg-gradient-to-r from-purple-400 to-indigo-500", title: "Custom Design" },
    { icon: Stars, color: "bg-gradient-to-r from-teal-400 to-green-500", title: "Premium Quality" },
  ];
  
  useEffect(() => {
    // Start the animation sequence
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    
    // Cycle through headlines
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [controls, headlines.length]);

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10"></div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] -z-10"></div>
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-40 left-20 w-60 h-60 rounded-full bg-blue-500/10 blur-[100px] -z-5"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-purple-500/10 blur-[100px] -z-5"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Header */}
          <div className="text-center space-y-6 mb-16">
            {/* Animated badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('services.subtitle')}</span>
            </motion.div>
            
            {/* Animated main title */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ delay: 0.1 }}
            >
              {t('services.title')}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={activeIndex}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {headlines[activeIndex]}
                  </motion.span>
                </AnimatePresence>
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-purple-600 w-full rounded-full" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </span>
            </motion.h1>
            
            {/* Animated description */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ delay: 0.2 }}
            >
              {t('services.description')}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              transition={{ delay: 0.3 }}
            >
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link to="/portfolio">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/30 hover:bg-primary/5"
                >
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </div>
          
          {/* Service Icons Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            transition={{ delay: 0.4 }}
          >
            {serviceIcons.map((item, index) => (
              <FloatingCard 
                key={index} 
                icon={item.icon} 
                iconColor={item.color} 
                title={item.title}
                delay={0.4 + index * 0.05}
              />
            ))}
          </motion.div>
        </div>
        
        {/* Partner Logos Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm uppercase font-semibold text-muted-foreground text-center mb-8">{t('partners.title')}</p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <PartnerLogo icon={FaGoogle} name="Google" color="bg-blue-100" delay={0.6} />
            <PartnerLogo icon={FaFacebook} name="Meta" color="bg-blue-100" delay={0.65} />
            <PartnerLogo icon={FaSearchengin} name="SEMrush" color="bg-green-100" delay={0.7} />
            <PartnerLogo icon={FaAws} name="AWS" color="bg-orange-100" delay={0.75} />
            <PartnerLogo icon={FaShopify} name="Magento" color="bg-purple-100" delay={0.8} />
            <PartnerLogo icon={FaWordpress} name="WordPress" color="bg-blue-100" delay={0.85} />
            <PartnerLogo icon={FaAward} name={t('partners.title')} color="bg-yellow-100" delay={0.9} />
          </div>
        </motion.div>
        
        {/* Background floating sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20 z-0"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.2,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            <Sparkles size={8 + Math.random() * 8} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesHero;