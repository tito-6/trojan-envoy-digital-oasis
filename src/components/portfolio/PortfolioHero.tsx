import React, { useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Sparkles, Circle, LayoutGrid } from "lucide-react";

const PortfolioHero: React.FC = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Mouse follower effect
    const handleMouseMove = (e: MouseEvent) => {
      const follower = document.querySelector('.mouse-follower') as HTMLElement;
      if (!follower) return;
      
      const { clientX, clientY } = e;
      const rect = heroRef.current?.getBoundingClientRect();
      
      if (!rect) return;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      follower.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
    };
    
    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  return (
    <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
      {/* Floating mouse follower */}
      <div className="mouse-follower opacity-20 pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-primary blur-[80px] z-0"></div>
      
      {/* Grid background with glow effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
      </div>
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-1/4 left-[5%] text-primary/10"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Circle className="w-20 h-20" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 right-[5%] text-primary/10"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <LayoutGrid className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 right-[15%] text-primary/10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, 0],
          scale: [1, 0.95, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-24 h-24" />
      </motion.div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-8 text-sm font-medium relative"
        >
          <span className="relative z-10">Our Work</span>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            animate={{ scale: [0.85, 1.05, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-8"
        >
          <span className="relative inline-block">
            Project
            <motion.span 
              className="absolute -bottom-2 left-0 w-full h-1 bg-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
          </span>
          {" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">Portfolio</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Explore our diverse collection of successful projects across various industries, 
          showcasing our expertise in digital solutions.
        </motion.p>
        
        <motion.div 
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-4 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioHero;