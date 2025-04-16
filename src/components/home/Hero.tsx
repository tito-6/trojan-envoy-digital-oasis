import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle,
  Sparkles,
  Star,
  ChevronDown,
  Play,
  Globe,
  Compass,
  Lightbulb,
  Rocket,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FaGoogle,
  FaFacebook,
  FaSearchengin,
  FaAws,
  FaShopify,
  FaWordpress,
  FaAward,
  FaReact,
  FaVuejs,
  FaAngular,
  FaNode,
  FaPython,
  FaJava,
  FaPhp,
  FaSwift,
  FaDatabase,
  FaDocker,
  FaGithub
} from "react-icons/fa";

import {
  SiTypescript,
  SiJavascript,
  SiFirebase,
  SiMongodb,
  SiGraphql,
  SiTailwindcss,
  SiFlutter,
  SiKotlin,
  SiSemrush
} from "react-icons/si";

// Custom hook for particle animation
const useParticles = (canvasRef, count = 50, color = "#ffffff") => {
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    
      constructor(x: number, y: number, size: number, speed: number, opacity: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speed * (Math.random() - 0.5) * 2;
        this.speedY = speed * (Math.random() - 0.5) * 2;
        this.opacity = opacity;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > window.innerWidth || this.x < 0) this.speedX *= -1;
        if (this.y > window.innerHeight || this.y < 0) this.speedY *= -1;
      }
      
      draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    const createParticles = () => {
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speed = 0.2;
        const opacity = Math.random() * 0.5 + 0.1;
        
        particles.push(new Particle(x, y, size, speed, opacity));
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx, color);
        
        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${color}, ${0.2 - distance / 750})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef, count, color]);
};

// 3D floating card component
const FloatingCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`relative group ${className}`}
      style={{ perspective: "1000px" }}
      whileHover={{ z: 50 }}
    >
      <motion.div
        whileHover={{ rotateX: 5, rotateY: 10, z: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Glowing text effect
const GlowText = ({ children, className = "", glowColor = "text-primary" }) => {
  return (
    <span className={`relative group ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className={`absolute inset-0 blur-xl opacity-30 group-hover:opacity-40 transition-opacity ${glowColor}`}>
        {children}
      </span>
    </span>
  );
};

// Main Hero component
const Hero = () => {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const techSectionRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // Use particles effect
  useParticles(canvasRef, 80, "255, 255, 255");
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const titleTranslateY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const subtitleTranslateY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const ctaTranslateY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    // Handle tech icons animation
    const handleTechIconsAnimation = () => {
      if (!techSectionRef.current) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const icons = techSectionRef.current?.querySelectorAll('.tech-icon');
            icons?.forEach((icon, index) => {
              setTimeout(() => {
                icon.classList.add('animate-tech-icon');
              }, index * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      if (techSectionRef.current) {
        observer.observe(techSectionRef.current);
      }
      
      return () => observer.disconnect();
    };
    
    // Handle scroll indicator visibility
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    
    // Initialize
    handleTechIconsAnimation();
    window.addEventListener("scroll", handleScroll);
    
    // Change featured video periodically
    const videoInterval = setInterval(() => {
      setActiveVideoIndex(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(videoInterval);
    };
  }, []);
  
  // Partner icons with more vibrant colors
  const partnerIcons = [
    { 
      Icon: FaGoogle, 
      name: "Google", 
      color: "#4285F4",
      bgColor: "bg-blue-100 dark:bg-blue-950/30"
    },
    { 
      Icon: FaFacebook, 
      name: "Meta", 
      color: "#1877F2",
      bgColor: "bg-blue-100 dark:bg-blue-950/30"
    },
    { 
      Icon: SiSemrush, 
      name: "SEMrush", 
      color: "#5FB246",
      bgColor: "bg-green-100 dark:bg-green-950/30"
    },
    { 
      Icon: FaAws, 
      name: "AWS", 
      color: "#FF9900",
      bgColor: "bg-orange-100 dark:bg-orange-950/30"
    },
    { 
      Icon: FaShopify, 
      name: "Magento", 
      color: "#7AB55C",
      bgColor: "bg-purple-100 dark:bg-purple-950/30"
    },
    { 
      Icon: FaWordpress, 
      name: "WordPress", 
      color: "#21759B",
      bgColor: "bg-blue-100 dark:bg-blue-950/30"
    },
    { 
      Icon: FaAward, 
      name: t('partners.title'), 
      color: "#FFD700",
      bgColor: "bg-yellow-100 dark:bg-yellow-950/30"
    }
  ];

  // Tech stack with animated effects
  const techStackIcons = [
    { Icon: FaReact, name: "React", color: "#61DAFB", animate: "animate-float" },
    { Icon: SiTypescript, name: "TypeScript", color: "#3178C6", animate: "animate-pulse-soft" },
    { Icon: FaVuejs, name: "Vue.js", color: "#4FC08D", animate: "animate-float" },
    { Icon: FaAngular, name: "Angular", color: "#DD0031", animate: "animate-pulse-soft" },
    { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E", animate: "animate-float" },
    { Icon: FaNode, name: "Node.js", color: "#339933", animate: "animate-pulse-soft" },
    { Icon: FaPython, name: "Python", color: "#3776AB", animate: "animate-float" },
    { Icon: FaJava, name: "Java", color: "#007396", animate: "animate-pulse-soft" },
    { Icon: FaPhp, name: "PHP", color: "#777BB4", animate: "animate-float" },
    { Icon: SiKotlin, name: "Kotlin", color: "#7F52FF", animate: "animate-pulse-soft" },
    { Icon: FaSwift, name: "Swift", color: "#FA7343", animate: "animate-float" },
    { Icon: SiFlutter, name: "Flutter", color: "#02569B", animate: "animate-pulse-soft" },
    { Icon: SiFirebase, name: "Firebase", color: "#FFCA28", animate: "animate-float" },
    { Icon: SiMongodb, name: "MongoDB", color: "#47A248", animate: "animate-pulse-soft" },
    { Icon: FaDatabase, name: "SQL", color: "#4479A1", animate: "animate-float" },
    { Icon: SiGraphql, name: "GraphQL", color: "#E10098", animate: "animate-pulse-soft" },
    { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4", animate: "animate-float" },
    { Icon: FaDocker, name: "Docker", color: "#2496ED", animate: "animate-pulse-soft" },
    { Icon: FaAws, name: "AWS", color: "#FF9900", animate: "animate-float" },
    { Icon: FaGithub, name: "GitHub", color: "#181717", animate: "animate-pulse-soft" }
  ];
  
  // Featured video data
  const featuredVideos = [
    {
      title: "Web Development",
      description: "Creating responsive, high-performance web applications with modern frameworks",
      color: "from-blue-500/20 to-indigo-500/20",
      icon: <Globe className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Digital Strategy",
      description: "Comprehensive digital strategies to transform your business and reach new heights",
      color: "from-amber-500/20 to-orange-500/20",
      icon: <Compass className="w-8 h-8 text-amber-500" />
    },
    {
      title: "AI & Machine Learning",
      description: "Cutting-edge artificial intelligence solutions tailored to your business needs",
      color: "from-emerald-500/20 to-teal-500/20",
      icon: <Lightbulb className="w-8 h-8 text-emerald-500" />
    }
  ];

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Canvas Particle Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background"
      />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Hero content with semantic HTML and microdata */}
          <article itemScope itemType="https://schema.org/WebSite">
            <meta itemProp="name" content={t('hero.title')} />
            <meta itemProp="description" content={t('hero.description')} />
            
            {/* Custom Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm border border-primary/20 shadow-sm mb-6 mx-auto"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500" itemProp="alternativeHeadline">
                {t('hero.subtitle')}
              </span>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              style={{ y: titleTranslateY }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight mb-6 mx-auto"
              itemProp="headline"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto"
              >
                <span itemProp="name">{t('hero.title')}</span>
                <div className="mt-2">
                  <GlowText className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                    {t('hero.subtitle')}
                  </GlowText>
                </div>
              </motion.div>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              style={{ y: subtitleTranslateY }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-4"
              itemProp="description"
            >
              {t('hero.description')}
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              style={{ y: ctaTranslateY }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mx-auto"
              itemProp="potentialAction"
              itemScope
              itemType="https://schema.org/Action"
            >
              <Link to="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-14 px-8"
                >
                  <meta itemProp="name" content={t('hero.cta')} />
                  <span>{t('hero.cta')}</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/services" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-muted bg-background/50 backdrop-blur-sm hover:bg-secondary/30 transition-all duration-300 h-14 px-8"
                >
                  {t('explore.services')}
                </Button>
              </Link>
            </motion.div>
          </article>
        </motion.div>
      </div>
      
      {/* Featured Video Section */}
      <div className="relative z-10 mb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="aspect-video bg-black/90 backdrop-blur-sm relative overflow-hidden">
                {/* Video Placeholder - Would be replaced with actual video */}
                <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-background/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center"
                    >
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Video switching controls */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-1 flex items-center">
                          {featuredVideos[activeVideoIndex].icon}
                          <span className="ml-2">{featuredVideos[activeVideoIndex].title}</span>
                        </h3>
                        <p className="text-sm text-white/80">
                          {featuredVideos[activeVideoIndex].description}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {featuredVideos.map((_, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setActiveVideoIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeVideoIndex ? 'bg-primary' : 'bg-white/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Video Gradient Overlay for each section */}
                <AnimatePresence>
                  <motion.div 
                    key={activeVideoIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${featuredVideos[activeVideoIndex].color} opacity-30`}
                  />
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Partner Section - Reimagined with floating cards */}
      <div className="relative z-10 py-8 md:py-16" style={{ opacity: opacity.get() }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-base text-muted-foreground font-medium">
              {t('partners.title')}
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-5xl mx-auto">
            {partnerIcons.map((item, index) => (
              <FloatingCard key={item.name} delay={0.3 + index * 0.1} className="flex-shrink-0">
                <div className="group transform transition-all duration-300 hover:scale-110">
                  <div className={`w-16 h-16 rounded-full ${item.bgColor} flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-${item.color.replace('#', '')}/20 transition-shadow`}>
                    <item.Icon size={32} style={{ color: item.color }} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-medium block">{item.name}</span>
                  <div className="flex items-center text-green-600 mt-1 justify-center">
                    <Award className="w-3 h-3 mr-1" />
                    <span className="text-[10px] uppercase font-bold">{t('partners.certified')}</span>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </div>
      
      {/* Technology Stack Section - with improved animations */}
      <div 
        ref={techSectionRef}
        className="w-full py-20 bg-gradient-to-b from-background via-background/90 to-background relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium"
            >
              {t('services.subtitle')}
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
            >
              {t('services.title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">{t('services.subtitle')}</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              We leverage cutting-edge technology to build modern, scalable solutions
            </motion.p>
          </div>

          <div className="relative">
            {/* Technology icons with improved 3D effect */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
              {techStackIcons.map((tech, index) => (
                <div 
                  key={tech.name}
                  className={`tech-icon flex flex-col items-center justify-center opacity-0 transform translate-y-8`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="relative group">
                    <div 
                      className={`w-16 h-16 rounded-full bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center mb-3 ${tech.animate} group-hover:shadow-lg transition-all duration-300 border border-border group-hover:border-primary/20`}
                    >
                      <tech.Icon 
                        size={32} 
                        style={{ color: tech.color }} 
                        className="group-hover:scale-110 transition-transform duration-300" 
                      />
                      <div className="absolute -inset-1.5 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
                    </div>
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Floating orbiting spheres */}
            <motion.div 
              className="absolute top-1/4 left-0 w-40 h-40 rounded-full bg-primary/5 blur-[80px] -z-10"
              animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-0 w-40 h-40 rounded-full bg-purple-500/5 blur-[80px] -z-10"
              animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
        
        {/* Key benefits with icons */}
        <div className="container mx-auto px-4 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 border border-blue-500/30">
                <Rocket className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">Pushing boundaries with creative solutions that transform businesses</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 border border-purple-500/30">
                <Zap className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Performance</h3>
              <p className="text-muted-foreground">Delivering high-speed, reliable solutions optimized for growth</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                <Shield className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliability</h3>
              <p className="text-muted-foreground">Building secure, stable solutions you can count on every time</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
