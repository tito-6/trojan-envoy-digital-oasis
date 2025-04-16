import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Rocket, 
  Zap, 
  Shield, 
  Heart, 
  Star,
  Code,
  Smartphone,
  PencilRuler,
  Globe,
  BarChart,
  ShoppingCart,
  Trophy,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { Card } from "@/components/ui/card";

// Service card component with rich features
const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features,
  gradient 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  features: string[];
  gradient: string;
}) => {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 opacity-[0.03] ${gradient}`} />
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
};

const ServicesCTA: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites and web applications built with cutting-edge technologies",
      gradient: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
      features: ["Responsive Design", "SEO Optimization", "Performance Focus"]
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      features: ["Native Performance", "Cross-Platform", "Offline Support"]
    },
    {
      icon: PencilRuler,
      title: "UI/UX Design",
      description: "User-centered design solutions that engage and convert",
      gradient: "bg-gradient-to-br from-pink-500/20 to-orange-500/20",
      features: ["User Research", "Prototyping", "Design Systems"]
    },
    {
      icon: Globe,
      title: "Digital Marketing",
      description: "Strategic digital marketing solutions to grow your business",
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
      features: ["Social Media", "Content Strategy", "Analytics"]
    },
    {
      icon: BarChart,
      title: "SEO Services",
      description: "Improve your search rankings and online visibility",
      gradient: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20",
      features: ["Keyword Research", "Technical SEO", "Content Optimization"]
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Solutions",
      description: "Build and optimize your online store for success",
      gradient: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
      features: ["Payment Integration", "Inventory Management", "Shopping Cart"]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium text-primary mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Our Services</span>
            </motion.div>
            
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {t('services.cta.title')}
            </motion.h2>
            
            <motion.p
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t('services.cta.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                  <span className="relative flex items-center gap-2">
                    Start Your Project
                    <MessageSquare className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                {...service}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;
