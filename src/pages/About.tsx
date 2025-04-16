import React, { useEffect, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AboutHero from "@/components/about/AboutHero";
import TeamSection from "@/components/about/TeamSection";
import ValuesSection from "@/components/about/ValuesSection";
import { useLanguage } from "@/lib/i18n";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

const About: React.FC = () => {
  const { t } = useLanguage();
  const aboutRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start start", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    // Add fade-in animation to elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-element");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll(".should-animate");
    elements.forEach((el) => observer.observe(el));

    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set the page title
    document.title = `${t('about.title')} | Trojan Envoy`;

    return () => observer.disconnect();
  }, [t]);

  return (
    <div className="min-h-screen relative overflow-hidden" ref={aboutRef}>
      {/* Background particles and gradient effects */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-b from-background/40 via-primary/5 to-background/80 z-0"
        style={{ opacity: backgroundOpacity, y: backgroundY }}
      />
      
      {/* Animated floating shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-10 w-60 h-60 rounded-full bg-primary/5 blur-[100px] -z-10"
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-60 h-60 rounded-full bg-purple-500/5 blur-[100px] -z-10"
          animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Floating stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            {i % 2 === 0 ? <Star size={8 + Math.random() * 8} /> : <Sparkles size={8 + Math.random() * 8} />}
          </motion.div>
        ))}
      </div>
      
      <Header />
      
      <main>
        <AboutHero />
        <ValuesSection />
        <TeamSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
