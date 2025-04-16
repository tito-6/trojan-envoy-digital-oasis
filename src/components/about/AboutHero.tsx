import React, { useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Sparkles, Circle, Triangle, Square } from "lucide-react";

const AboutHero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  
  // Text animations - splitting into words
  const titleWords = "About Trojan Envoy".split(" ");
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse follow animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.querySelector('.cursor-glow') as HTMLElement;
      if (!cursor) return;
      
      const { clientX, clientY } = e;
      
      // Smooth animation with requestAnimationFrame
      requestAnimationFrame(() => {
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Dynamic shapes with random positioning
  const shapes = [
    { component: Star, color: "text-primary/20", size: "w-16 h-16" },
    { component: Sparkles, color: "text-primary/20", size: "w-20 h-20" },
    { component: Circle, color: "text-purple-400/20", size: "w-14 h-14" },
    { component: Triangle, color: "text-blue-400/20", size: "w-16 h-16" },
    { component: Square, color: "text-indigo-400/20", size: "w-12 h-12" },
  ];
  
  return (
    <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
      {/* Cursor follow effect */}
      <div className="cursor-glow fixed w-[300px] h-[300px] pointer-events-none rounded-full bg-primary opacity-[0.07] blur-[80px] -translate-x-1/2 -translate-y-1/2 z-0"></div>
      
      {/* Background grid and gradient */}
      <div className="absolute inset-0 -z-10">
        <motion.div style={{ y, opacity }}>
          <div className="absolute top-1/3 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </motion.div>
      </div>
      
      {/* Floating animated shapes */}
      {shapes.map((Shape, index) => {
        const randomX = Math.floor(Math.random() * 80) + 10; // 10-90%
        const randomY = Math.floor(Math.random() * 70) + 10; // 10-80%
        const randomDelay = Math.random() * 2;
        const randomDuration = Math.random() * 5 + 5;
        
        return (
          <motion.div
            key={index}
            className={`absolute hidden md:block ${Shape.color} ${Shape.size}`}
            style={{ 
              left: `${randomX}%`, 
              top: `${randomY}%`,
              opacity: 0.7,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: randomDuration,
              delay: randomDelay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Shape.component />
          </motion.div>
        );
      })}
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block relative"
        >
          <div className="px-4 py-1.5 rounded-full bg-secondary mb-8 text-sm font-medium">
            Our Story
          </div>
          
          {/* Pulsing light behind the badge */}
          <motion.div
            className="absolute inset-0 rounded-full bg-secondary/50"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-8 relative">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mx-2 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + i * 0.1,
                ease: [0.215, 0.61, 0.355, 1] 
              }}
            >
              {word === "Trojan" && (
                <motion.span 
                  className="text-gradient bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              )}
              
              {word === "Envoy" && (
                <motion.span 
                  className="text-gradient bg-gradient-to-r from-indigo-500 via-purple-500 to-primary bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              )}
              
              {word !== "Trojan" && word !== "Envoy" && word}
              
              {/* Animated underline for each word */}
              <motion.span 
                className="absolute -bottom-2 left-0 h-1 bg-primary/50 rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8 + i * 0.1,
                }}
              />
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.8,
            ease: [0.215, 0.61, 0.355, 1] 
          }}
        >
          We are a team of passionate digital experts dedicated to transforming businesses 
          through innovative technology solutions and strategic marketing.
          
          {/* Decorative elements */}
          <motion.span
            className="absolute -left-8 top-1/2 w-5 h-1 bg-primary/50 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          />
          <motion.span
            className="absolute -right-8 top-1/2 w-5 h-1 bg-primary/50 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          />
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-10"
        >
          <motion.a 
            href="#our-values"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary/30 text-primary"
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
