import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Check, ArrowRight, Sparkles, BarChart3, Award, Clock, Users, Medal, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

// Counter animation component
const AnimatedCounter = ({ value, duration = 2000, className = "" }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!inView) return;
    
    let start = null;
    const startValue = 0;
    const endValue = parseInt(value.replace(/[^0-9]/g, ""));
    
    const counter = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(counter);
      }
    };
    
    requestAnimationFrame(counter);
  }, [inView, value, duration]);
  
  return (
    <span ref={nodeRef} className={className}>
      {value.includes('+') ? `${count}+` : count}
    </span>
  );
};

// Floating element component
const FloatingElement = ({ children, delay = 0, duration = 6, offsetY = 10, className = "" }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [-offsetY/2, offsetY/2, -offsetY/2],
      }}
      transition={{ 
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// About section component
const About = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const statsRef = useRef(null);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);
  
  // Stats data with enhanced visuals
  const stats = [
    { 
      value: "10+", 
      label: "Years Experience", 
      icon: <Clock className="w-6 h-6 text-primary" />,
      color: "from-primary/30 to-primary/5"
    },
    { 
      value: "200+", 
      label: "Projects Completed", 
      icon: <Award className="w-6 h-6 text-purple-500" />,
      color: "from-purple-500/30 to-purple-500/5"
    },
    { 
      value: "50+", 
      label: "Team Members", 
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500/30 to-blue-500/5"
    },
    { 
      value: "98%", 
      label: "Client Satisfaction", 
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      color: "from-rose-500/30 to-rose-500/5"
    },
  ];
  
  // Key points data with enhanced styling
  const keyPoints = [
    {
      text: "Industry-leading expertise",
      icon: <Medal className="w-3 h-3 text-amber-500" />,
      color: "bg-amber-500/10"
    },
    {
      text: "Results-driven approach",
      icon: <BarChart3 className="w-3 h-3 text-emerald-500" />,
      color: "bg-emerald-500/10" 
    },
    {
      text: "Innovative technologies",
      icon: <Sparkles className="w-3 h-3 text-blue-500" />,
      color: "bg-blue-500/10"
    },
    {
      text: "Dedicated support",
      icon: <Heart className="w-3 h-3 text-rose-500" />,
      color: "bg-rose-500/10"
    },
    {
      text: "Transparent communication",
      icon: <Check className="w-3 h-3 text-violet-500" />,
      color: "bg-violet-500/10"
    },
    {
      text: "Agile methodology",
      icon: <Check className="w-3 h-3 text-cyan-500" />,
      color: "bg-cyan-500/10"
    },
  ];

  return (
    <motion.section 
      ref={sectionRef}
      className="section-padding bg-secondary/30 relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div style={{ y: y1 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium"
            >
              About Our Agency
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-bold mb-6"
            >
              {t('about.title')}
              <span className="block text-gradient mt-1">{t('about.subtitle')}</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground mb-6"
            >
              {t('about.description')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-8 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full mr-3"></span>
                {t('about.mission.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('about.mission.description')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
            >
              {keyPoints.map((point, index) => (
                <motion.div 
                  key={point.text} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-center gap-2"
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full ${point.color} flex items-center justify-center`}>
                    {point.icon}
                  </div>
                  <span className="text-sm">{point.text}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium group"
              >
                Learn more about us
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative" 
            ref={statsRef}
            style={{ y: y2 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="card-hover stats-card bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border h-full flex flex-col items-center justify-center text-center relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                  
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
                    <div className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center mb-3 shadow-sm border border-border">
                      {stat.icon}
                    </div>
                  </div>
                  
                  <div 
                    className="counter text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                  >
                    <AnimatedCounter value={stat.value} className="" />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  
                  {/* Pulsing background circle */}
                  <div className="absolute -z-10 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="w-1/2 h-1/2 rounded-full bg-background/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Floating decorative elements */}
            <FloatingElement 
              delay={0.5} 
              duration={7} 
              offsetY={15}
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-primary/10 backdrop-blur-3xl bg-primary/5 -z-10"
            />
            <FloatingElement 
              delay={0.2} 
              duration={8} 
              offsetY={10}
              className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full border border-purple-500/10 backdrop-blur-3xl bg-purple-500/5 -z-10"
            />
            <FloatingElement 
              delay={0.7} 
              duration={6} 
              offsetY={8}
              className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full border border-blue-500/10 backdrop-blur-3xl bg-blue-500/5 -z-10"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
