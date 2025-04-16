import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Search, Hash, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogHeroProps {
  searchTerm?: string;
  category?: string;
  tag?: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ searchTerm, category, tag }) => {
  const { t } = useLanguage();
  const [activeBubble, setActiveBubble] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set active bubble based on current filter
    if (tag) setActiveBubble(tag);
    else if (category) setActiveBubble(category);
  }, [tag, category]);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Change the title based on filters
  let title = t("Our Blog");
  let subtitle = t("Explore our articles, guides, and insights on digital trends, technology, and business strategies.");
  let icon = <FileText className="w-6 h-6" />;
  
  if (searchTerm) {
    title = t(`Search Results: "${searchTerm}"`);
    subtitle = t("Browse articles matching your search query");
    icon = <Search className="w-6 h-6" />;
  } else if (category) {
    title = t(`Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    subtitle = t(`Browse all articles in the ${category} category`);
    icon = <BookOpen className="w-6 h-6" />;
  } else if (tag) {
    title = t(`Tag: ${tag.charAt(0).toUpperCase() + tag.slice(1)}`);
    subtitle = t(`Browse all articles with the ${tag} tag`);
    icon = <Hash className="w-6 h-6" />;
  }
  
  // Letter animation sequence
  const titleLetters = title.split("");
  
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden" ref={heroRef}>
      <motion.div 
        className="absolute inset-0 -z-10" 
        style={{ y, opacity }}
      >
        <div className="absolute top-1/3 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </motion.div>
      
      {/* Animated floating elements */}
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div 
          key={index}
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 70 + 15}%`,
          }}
          animate={{ 
            y: [0, Math.random() * 30 - 15, 0],
            rotate: [0, Math.random() * 10 - 5, 0],
            scale: [1, Math.random() * 0.2 + 0.9, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-24 h-24 text-primary/5">
            {index % 3 === 0 ? (
              <FileText className="w-full h-full" />
            ) : index % 3 === 1 ? (
              <BookOpen className="w-full h-full" />
            ) : (
              <Hash className="w-full h-full" />
            )}
          </div>
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary mb-8"
        >
          <span className="text-sm font-medium flex items-center gap-2">
            {icon}
            {searchTerm ? "Search Results" : category ? "Category" : tag ? "Tag" : "Blog"}
          </span>
          
          {/* Pulsing ring animation */}
          <motion.span
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.7, 0], scale: [1, 1.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>
        
        <motion.div className="overflow-hidden mb-6">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold flex flex-wrap justify-center gap-x-3 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {titleLetters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.03 * index + 0.3,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="inline-block"
              >
                {letter === " " ? <>&nbsp;</> : letter}
              </motion.span>
            ))}
            
            {/* Gradient underline */}
            <motion.span
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent w-0"
              initial={{ width: "0%" }}
              animate={{ width: "30%" }}
              transition={{ duration: 1, delay: 1 }}
            />
          </motion.h1>
        </motion.div>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {subtitle}
        </motion.p>
        
        {/* Scroll indicator */}
        <motion.div 
          className="mt-12 mb-4 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div 
            className="w-10 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center relative"
            animate={{ boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 20px rgba(0,0,0,0.2)", "0 0 0 rgba(0,0,0,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;