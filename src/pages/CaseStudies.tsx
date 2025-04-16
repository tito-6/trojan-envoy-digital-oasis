import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles, Stars, Award, BarChart2, Zap, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  industry: string;
  services: string[];
  challenge: string;
  solution: string;
  results: string;
  image: string;
  slug: string;
  color: string;
}

const CaseStudies: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hoveredStudy, setHoveredStudy] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroIsInView = useInView(heroRef, { once: true });
  
  // For parallax scrolling effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Case Studies | Trojan Envoy";
  }, []);

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "E-commerce Platform Redesign",
      client: "GlobalShop",
      industry: "Retail",
      services: ["Web Development", "UI/UX Design", "Digital Marketing"],
      challenge: "GlobalShop faced declining conversion rates and customer complaints about their outdated e-commerce platform. Their legacy system was slow, not mobile-friendly, and had a complicated checkout process.",
      solution: "We redesigned the entire e-commerce platform with a focus on user experience, mobile responsiveness, and checkout simplification. We implemented a modern tech stack with React for the frontend and optimized the entire infrastructure for speed.",
      results: "Within 3 months, GlobalShop saw a 45% increase in conversion rates, 30% reduction in cart abandonment, and 60% increase in mobile sales. Overall revenue increased by 28% year-over-year.",
      image: "https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      slug: "globalshop-ecommerce-redesign",
      color: "from-blue-600/20 to-cyan-400/20"
    },
    {
      id: 2,
      title: "Healthcare Mobile App Development",
      client: "MedConnect",
      industry: "Healthcare",
      services: ["Mobile Development", "UI/UX Design", "API Integration"],
      challenge: "MedConnect needed a secure, HIPAA-compliant mobile app to connect patients with healthcare providers, schedule appointments, and manage medical records. They had strict requirements for security and ease of use.",
      solution: "We developed native iOS and Android applications with end-to-end encryption, biometric authentication, and intuitive interfaces. The app integrated with their existing systems and electronic health records (EHR) via secure APIs.",
      results: "The app achieved 50,000+ downloads in the first month, reduced appointment no-shows by 35%, and earned a 4.8/5 rating on app stores. Patient satisfaction scores increased by 40%.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      slug: "medconnect-healthcare-app",
      color: "from-green-600/20 to-emerald-400/20"
    },
    {
      id: 3,
      title: "Digital Marketing Campaign",
      client: "EcoFriendly",
      industry: "Sustainable Products",
      services: ["Digital Marketing", "Social Media", "Content Strategy"],
      challenge: "EcoFriendly, a sustainable products brand, struggled with brand awareness and reaching their target audience despite having high-quality eco-friendly products. Their digital presence was minimal with low engagement.",
      solution: "We developed a comprehensive digital marketing strategy focusing on content marketing, influencer partnerships, and targeted social media campaigns. We created compelling storytelling around their sustainability mission and products.",
      results: "Within 6 months, EcoFriendly saw a 300% increase in social media followers, 250% increase in website traffic, and 85% increase in online sales. Their customer acquisition cost decreased by 40%.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      slug: "ecofriendly-digital-marketing",
      color: "from-amber-500/20 to-orange-400/20"
    },
  ];

  const filteredStudies = activeFilter === "all" 
    ? caseStudies 
    : caseStudies.filter(study => study.industry.toLowerCase() === activeFilter.toLowerCase());

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Custom cursor styles */}
      <style>
        {`
        body {
          cursor: none;
        }
        
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
        }
        
        .fancy-card:hover {
          transform: translateY(-10px) scale(1.01);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .tag-shine {
          position: relative;
          overflow: hidden;
        }
        
        .tag-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: shine 3s infinite;
        }
        
        @keyframes shine {
          0% {
            left: -100%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          60% {
            left: 100%;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
      `}
      </style>

      <Header />
      
      <main className="pt-20 pb-20 relative overflow-hidden">
        {/* Fancy background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 opacity-30"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500/10 to-yellow-500/10 blur-[100px] -z-10"></div>
          </motion.div>
        </div>
        
        {/* Hero Section */}
        <div ref={heroRef} className="relative">
          <div className="container mx-auto px-4 py-24">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={heroIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
            >
              {/* Decorative elements */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-primary/10 -z-10"
                animate={{ 
                  rotate: 360,
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
              />
              
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-primary/5 -z-10"
                animate={{ 
                  rotate: -360,
                  scale: [1.05, 0.95, 1.05],
                }}
                transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
              />
              
              <motion.div 
                className="relative z-10 mb-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={heroIsInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              >
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Success Stories</span>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </motion.div>
              
              <h1 
                className="relative text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gradient bg-gradient-to-r from-primary via-purple-500 to-blue-500"
              >
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, y: 50 }}
                  animate={heroIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {t('caseStudies.title')}
                </motion.span>
                <motion.div 
                  className="absolute -right-6 -top-6"
                  initial={{ opacity: 0, scale: 0, rotate: -20 }}
                  animate={heroIsInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -20 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Stars className="h-5 w-5 text-yellow-400" />
                </motion.div>
              </h1>
              
              <motion.p 
                className="text-xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={heroIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {t('caseStudies.subtitle')}
                <br />
                Discover how we've helped businesses transform and achieve exceptional results.
              </motion.p>
              
              {/* Decorative bar */}
              <motion.div
                className="mx-auto mt-8 w-24 h-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-blue-500/50 rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={heroIsInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.div>

            {/* Case study filters */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={heroIsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {["All", "Retail", "Healthcare", "Sustainable Products"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter.toLowerCase())}
                  className={`px-5 py-2.5 rounded-full relative overflow-hidden transition-all duration-300 ${
                    activeFilter === filter.toLowerCase() 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "bg-secondary/50 hover:bg-secondary"
                  } relative`}
                >
                  {activeFilter === filter.toLowerCase() && (
                    <motion.div 
                      className="absolute inset-0 bg-primary -z-10"
                      layoutId="activeFilterBackground"
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  )}
                  {filter}
                  {activeFilter === filter.toLowerCase() && (
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-white/30"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
          
        {/* Case Studies Grid */}
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredStudy(study.id)}
                onMouseLeave={() => setHoveredStudy(null)}
                className={`grid md:grid-cols-2 gap-8 items-center p-8 rounded-2xl border border-border fancy-card transition-all duration-500 relative overflow-hidden`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${study.color} opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10`} />
                
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''} relative z-10`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-secondary/70 backdrop-blur-sm text-sm font-medium px-4 py-1.5 rounded-full inline-block tag-shine">
                      {study.industry}
                    </div>
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: hoveredStudy === study.id ? 1 : 0, opacity: hoveredStudy === study.id ? 1 : 0 }}
                      className="p-1 rounded-full bg-primary/10 backdrop-blur-sm"
                    >
                      <Award className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4 relative">
                    {study.title}
                    <AnimatePresence>
                      {hoveredStudy === study.id && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </h2>
                  
                  <p className="text-muted-foreground mb-4">
                    <strong>Client:</strong> {study.client}
                  </p>
                  
                  <div className="mb-4">
                    <strong>Services:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {study.services.map(service => (
                        <span key={service} className="bg-primary/10 text-primary/90 text-sm px-3 py-1 rounded-full flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5"></span>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-primary" />
                      Challenge:
                    </h3>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>
                  
                  {/* Results teaser with chart icon */}
                  <div className="mb-6 p-3 bg-secondary/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center text-sm font-medium mb-1">
                      <BarChart2 className="w-4 h-4 mr-2 text-primary" />
                      Key Results:
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{study.results}</p>
                  </div>
                  
                  <Link 
                    to={`/case-studies/${study.slug}`} 
                    className="group inline-flex items-center text-primary hover:text-primary-focus transition-all relative"
                  >
                    <span className="relative z-10">Read full case study</span>
                    <motion.div
                      className="relative z-10 ml-2 transition-transform group-hover:translate-x-1"
                      animate={hoveredStudy === study.id ? { x: [0, 5, 0] } : {}}
                      transition={{ repeat: hoveredStudy === study.id ? 1 : 0, duration: 0.5 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                    
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredStudy === study.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </div>
                
                {/* Image with hover effect */}
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''} relative z-10`}>
                  <div className="relative group overflow-hidden rounded-xl transform transition-all duration-500 hover:scale-105">
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity" />
                    
                    <motion.img 
                      src={study.image} 
                      alt={study.title} 
                      className="w-full h-[300px] md:h-[400px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                      initial={{ scale: 1.1, y: 10 }}
                      whileInView={{ scale: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                    />
                    
                    {/* Client label */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <motion.div 
                        className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg text-sm font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {study.client}
                      </motion.div>
                    </div>
                    
                    {/* View CTA on hover */}
                    <motion.div
                      className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link to={`/case-studies/${study.slug}`} className="p-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm rounded-2xl p-12 border border-primary/10 relative overflow-hidden"
          >
            {/* Background animation */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square rounded-full border border-primary/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180%] aspect-square rounded-full border border-primary/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square rounded-full border border-primary/5"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 relative inline-block">
              Ready to create your success story?
              <motion.div 
                className="absolute -right-8 -top-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Stars className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Let us help transform your business with our innovative digital solutions.
              Our team is ready to help you achieve exceptional results.
            </p>
            
            <Link 
              to="/contact" 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground px-8 py-4 font-medium transition-all"
            >
              <span className="relative z-10 flex items-center">
                Start Your Project
                <motion.div 
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.div>
              </span>
              
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-[length:200%] bg-[position:0%] group-hover:bg-[position:100%] transition-[background-position] duration-500"></div>
              
              {/* Shine effect */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-[left] duration-700 ease-in-out"></div>
            </Link>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudies;