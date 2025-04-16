import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, User, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// Testimonial type
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  featured?: boolean;
}

// Testimonial Card
const TestimonialCard = ({ 
  testimonial, 
  isActive = false,
  className = "" 
}: { 
  testimonial: Testimonial; 
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col h-full bg-card border border-border p-6 md:p-8 rounded-xl shadow-lg relative z-10",
        isActive && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      <div className="mb-6">
        {/* Quote Icon */}
        <div className="absolute -top-3 -left-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        
        {/* Rating Stars */}
        <div className="flex ml-6 sm:ml-8 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Testimonial Content */}
      <div className="flex-grow">
        <p className="text-muted-foreground mb-6 italic text-sm sm:text-base">{testimonial.content}</p>
      </div>
      
      {/* Author */}
      <div className="flex items-center mt-4">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border">
          {testimonial.avatar ? (
            <AvatarImage src={testimonial.avatar} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-3">
          <h4 className="font-medium text-sm sm:text-base">{testimonial.name}</h4>
          <div className="text-xs text-muted-foreground flex items-center">
            <span>{testimonial.role}</span>
            <span className="mx-1">·</span>
            <span>{testimonial.company}</span>
          </div>
        </div>
      </div>
      
      {/* Featured Badge */}
      {testimonial.featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-purple-500 text-primary-foreground text-xs px-2.5 py-1 rounded-full">
          Featured
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-tl-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 -z-10" />
    </motion.div>
  );
};

// Navigation Button
const NavButton = ({ icon: Icon, onClick, disabled = false, direction = "next" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
        disabled
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-primary/10 hover:bg-primary/20 text-primary"
      }`}
      aria-label={direction === "next" ? "Next testimonial" : "Previous testimonial"}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </motion.button>
  );
};

const References = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Emily Johnson",
      role: "Marketing Director",
      company: "Global Innovations Inc.",
      content: "Working with Trojan Envoy transformed our online presence. Their team took the time to understand our brand and delivered a website that exceeded our expectations. The increase in conversion rate has been remarkable.",
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CEO",
      company: "TechStart Solutions",
      content: "As a startup, finding the right digital partner was crucial. Trojan Envoy provided us with a stunning website and effective digital marketing strategy that helped us scale quickly. Their expertise made all the difference.",
      rating: 5
    },
    {
      id: 3,
      name: "Sarah Patel",
      role: "E-commerce Manager",
      company: "Fashion Forward",
      content: "Our e-commerce platform needed a complete overhaul, and Trojan Envoy delivered beyond our expectations. The user experience is seamless, and our sales have increased by 40% since launch.",
      rating: 5,
      featured: true
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Operations Director",
      company: "Quantum Services",
      content: "The mobile app developed by Trojan Envoy has streamlined our operations significantly. Their attention to detail and commitment to quality is evident in every feature they implemented.",
      rating: 4
    },
    {
      id: 5,
      name: "Angela Rodriguez",
      role: "Brand Manager",
      company: "Elevate Lifestyle",
      content: "The SEO and content strategy Trojan Envoy developed for us has dramatically improved our search rankings. Their team is professional, responsive, and truly invested in our success.",
      rating: 5
    }
  ];
  
  // Handle navigation
  const handlePrev = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  // Auto-play effect
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);
  
  // Reset pause after user interaction
  useEffect(() => {
    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isPaused]);
  
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient and effects */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ opacity, y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-500/5 to-background" />
      </motion.div>
      
      {/* Floating quote icons */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 45 - 22.5,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          >
            <Quote size={20 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>Testimonials</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4">
            What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Clients</span> Say
          </h2>
          
          <p className="text-muted-foreground text-base lg:text-lg">
            Don't just take our word for it. Hear what our clients have to say about their experience working with us.
          </p>
        </motion.div>
        
        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16 py-4 md:py-6 px-4 md:px-8 rounded-2xl bg-card border border-border shadow-lg"
        >
          {[
            { icon: User, value: "500+", label: "Happy Clients" },
            { icon: Star, value: "4.9/5", label: "Average Rating" },
            { icon: Building, value: "15+", label: "Years in Business" },
            { icon: ArrowRight, value: "98%", label: "Client Retention" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-2">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 md:mb-4">
                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-lg md:text-2xl font-display font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        
        {/* Testimonials Carousel - Mobile Version */}
        <div className="md:hidden relative max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            <TestimonialCard 
              key={testimonials[activeIndex].id} 
              testimonial={testimonials[activeIndex]} 
              isActive={true} 
            />
          </AnimatePresence>
          
          {/* Mobile Navigation Controls */}
          <div className="flex justify-center gap-4 mt-6 items-center">
            <NavButton 
              icon={ChevronLeft} 
              onClick={handlePrev} 
              direction="prev" 
            />
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(index);
                  }}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-primary scale-125"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            
            <NavButton 
              icon={ChevronRight} 
              onClick={handleNext} 
              direction="next" 
            />
          </div>
        </div>
        
        {/* Testimonials Carousel - Desktop Version */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          <div className="py-8">
            <div className="grid grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {[
                  activeIndex === 0 
                    ? testimonials[testimonials.length - 1] 
                    : testimonials[activeIndex - 1],
                  testimonials[activeIndex],
                  activeIndex === testimonials.length - 1 
                    ? testimonials[0] 
                    : testimonials[activeIndex + 1]
                ].map((testimonial, index) => (
                  <TestimonialCard
                    key={`${testimonial.id}-${index}`}
                    testimonial={testimonial}
                    isActive={index === 1}
                    className={index === 1 ? "scale-110 z-20" : "opacity-50 scale-95 z-10"}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Desktop Navigation Controls */}
          <div className="flex justify-center gap-4 mt-8 items-center">
            <NavButton 
              icon={ChevronLeft} 
              onClick={handlePrev} 
              direction="prev" 
            />
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-primary scale-125"
                      : "bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            
            <NavButton 
              icon={ChevronRight} 
              onClick={handleNext} 
              direction="next" 
            />
          </div>
        </div>
        
        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/testimonials">
            <Button variant="outline" className="group">
              <span>View All Testimonials</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default References;
