import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  CheckCircle, 
  ExternalLink, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  Trophy,
  Target,
  LightbulbIcon,
  Zap,
  ArrowRight,
  Heart,
  Award,
  BarChart
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

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
  fullDescription?: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  technologies?: string[];
  duration?: string;
  date?: string;
  resultMetrics?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  color?: string;
  gallery?: string[];
}

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
    fullDescription: "GlobalShop, a leading retailer with over 500 products and a customer base spanning 15 countries, approached us with a critical challenge. Their decade-old e-commerce platform was causing significant business problems: declining conversion rates, high cart abandonment, and increasing customer complaints about usability, especially on mobile devices.\n\nOur team conducted thorough user research, including user interviews, heatmap analysis, and competitor benchmarking. We identified key pain points in the customer journey and developed a comprehensive redesign strategy focusing on three main pillars: user experience enhancement, mobile optimization, and performance improvement.\n\nThe solution included a complete frontend rebuild using React.js with a component-based architecture for scalability. We simplified the navigation structure, reduced the checkout process from 5 steps to 2, implemented an intelligent product recommendation engine, and created a responsive design that works flawlessly across all devices. On the backend, we optimized the database queries, implemented caching strategies, and moved to a cloud-based infrastructure for better scalability.\n\nThe results exceeded the client's expectations. Within just three months after launch, GlobalShop experienced a 45% increase in conversion rates, a 30% reduction in cart abandonment, and a 60% increase in mobile sales. Overall revenue increased by 28% year-over-year, customer satisfaction scores improved by 40%, and page load times decreased by 70%, dropping from 6 seconds to under 2 seconds.",
    testimonial: {
      quote: "The redesign completely transformed our business. Not only did we see immediate improvements in our metrics, but our team also gained a platform that can grow with us for years to come. The attention to detail and commitment to understanding our specific needs made all the difference.",
      author: "Sarah Johnson",
      position: "CEO at GlobalShop"
    },
    technologies: ["React", "Node.js", "MongoDB", "AWS", "Redis", "Stripe", "Cloudflare"],
    duration: "4 months",
    date: "January 2023",
    resultMetrics: [
      { label: "Conversion Rate Increase", value: "45%" },
      { label: "Cart Abandonment Reduction", value: "30%" },
      { label: "Mobile Sales Increase", value: "60%" },
      { label: "Revenue Growth", value: "28%" }
    ],
    color: "from-blue-600/10 to-cyan-400/10",
    gallery: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558879787-39abee90be53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549122728-f519709caa9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
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
    fullDescription: "MedConnect, a leading healthcare provider network serving over 200,000 patients across 50 hospitals and clinics, approached us with a significant challenge. They needed a secure, HIPAA-compliant mobile application that would streamline patient-provider communication, simplify appointment scheduling, and provide secure access to medical records, all while meeting stringent security and compliance requirements.\n\nOur team began with comprehensive stakeholder interviews, including patients, doctors, nurses, and administrators, to understand the full scope of needs and pain points. We developed detailed user personas and journey maps to guide our design process, ensuring the solution would be intuitive for users of all ages and technical abilities.\n\nThe development process included creating native applications for both iOS and Android platforms to ensure optimal performance and security. Key features implemented included end-to-end encryption for all data transmission, biometric authentication for secure access, real-time appointment scheduling with calendar integration, secure messaging between patients and providers, medical record access and sharing capabilities, medication reminders, and telemedicine video consultation functionality.\n\nIntegration was a critical component, with the app connecting seamlessly to MedConnect's existing Electronic Health Record (EHR) system, laboratory information systems, and billing platforms through secure APIs. We implemented advanced security measures including HIPAA-compliant data storage, regular security audits, and comprehensive access controls.\n\nThe results were transformative for MedConnect. The app achieved over 50,000 downloads in the first month, with an impressive 4.8/5 star rating across app stores. Appointment no-shows decreased by 35%, saving an estimated $2.1 million annually. Patient satisfaction scores increased by 40%, and the telemedicine feature reduced unnecessary in-person visits by 25%. Staff reported saving an average of 5 hours per week on administrative tasks, allowing more focus on patient care.",
    testimonial: {
      quote: "This app has revolutionized how we deliver care. Our patients love the convenience, and our staff appreciate the reduction in administrative burden. The security features give everyone peace of mind, and the intuitive design means we've seen adoption across all age groups.",
      author: "Dr. Michael Chen",
      position: "Chief Medical Officer at MedConnect"
    },
    technologies: ["Swift", "Kotlin", "Firebase", "FHIR API", "OAuth 2.0", "WebRTC", "AWS"],
    duration: "6 months",
    date: "March 2023",
    resultMetrics: [
      { label: "App Downloads", value: "50,000+" },
      { label: "App Store Rating", value: "4.8/5" },
      { label: "No-show Reduction", value: "35%" },
      { label: "Patient Satisfaction Increase", value: "40%" }
    ],
    color: "from-green-600/10 to-emerald-400/10",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471440671318-55bdbb772f93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
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
    fullDescription: "EcoFriendly, a startup dedicated to sustainable home and personal care products, faced significant challenges in market penetration despite offering innovative eco-friendly alternatives to conventional products. With limited brand recognition and a modest marketing budget, they struggled to connect with environmentally conscious consumers and convert awareness into sales.\n\nOur team began with comprehensive market research, including competitor analysis, target audience profiling, and keyword research. We identified key market gaps and opportunities, crafting a digital marketing strategy built around authentic storytelling and educational content that highlighted both the environmental benefits and the effectiveness of EcoFriendly's products.\n\nThe execution included a multi-channel approach: We developed a content marketing calendar focused on sustainability education, practical tips, and product spotlights. We redesigned their website with conversion optimization in mind and implemented SEO best practices. We identified and partnered with micro-influencers in the sustainability space for authentic product reviews and demonstrations. We created targeted social media campaigns across Instagram, Facebook, Pinterest, and TikTok with platform-specific content. We launched a newsletter featuring sustainability tips and exclusive offers. And we implemented Google Ads and retargeting campaigns focused on high-intent keywords.\n\nThe results transformed EcoFriendly's business trajectory. Within six months, they saw a 300% increase in social media followers across platforms and a 250% increase in website traffic. Online sales grew by 85%, with a 40% decrease in customer acquisition costs. Their email list grew from 2,000 to 15,000 subscribers, with an average open rate of 28%. Organic search visibility improved by 200%, bringing in sustainable traffic. Most importantly, EcoFriendly established itself as a thought leader in the sustainable products space, with content regularly shared by environmental organizations and influencers.",
    testimonial: {
      quote: "The digital marketing campaign completely transformed our business. Not only did we see immediate growth in followers and sales, but we've established ourselves as a respected voice in the sustainability conversation. The team's understanding of both digital marketing and the eco-friendly market made all the difference.",
      author: "Emma Lewis",
      position: "Founder & CEO of EcoFriendly"
    },
    technologies: ["Google Analytics", "Hootsuite", "Mailchimp", "Shopify", "SEMrush", "Canva", "Meta Ads"],
    duration: "6 months",
    date: "May 2023",
    resultMetrics: [
      { label: "Social Media Growth", value: "300%" },
      { label: "Website Traffic Increase", value: "250%" },
      { label: "Sales Growth", value: "85%" },
      { label: "CAC Reduction", value: "40%" }
    ],
    color: "from-amber-500/10 to-orange-400/10",
    gallery: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [hasShowedConfetti, setHasShowedConfetti] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isResultsInView = useInView(resultsRef, { once: true, margin: "-100px" });
  
  // For parallax scrolling
  const { scrollYProgress } = useScroll();
  const heroImageY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  useEffect(() => {
    // Find the case study with the matching slug
    const study = caseStudies.find(s => s.slug === slug);
    setCaseStudy(study || null);
    
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    if (study) {
      document.title = `${study.title} | Case Study`;
    } else {
      document.title = "Case Study Not Found";
    }
  }, [slug]);
  
  // Show confetti when results section is in view
  useEffect(() => {
    if (isResultsInView && caseStudy && !hasShowedConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A'],
      });
      setHasShowedConfetti(true);
    }
  }, [isResultsInView, caseStudy, hasShowedConfetti]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen">
        <Header />
        <motion.main 
          className="pt-32 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Case Study Not Found</h1>
            <p className="mb-8 text-muted-foreground">The case study you're looking for doesn't exist or may have been moved.</p>
            <Button
              variant="default" 
              onClick={() => navigate("/case-studies")}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Case Studies
            </Button>
          </div>
        </motion.main>
        <Footer />
      </div>
    );
  }

  // Split paragraphs from fullDescription
  const descriptionParagraphs = caseStudy.fullDescription?.split('\n\n') || [caseStudy.challenge];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Page-specific styles */}
      <style>{`
        .highlight-text {
          background-image: linear-gradient(to right, transparent 0%, rgba(var(--primary), 0.1) 5%, rgba(var(--primary), 0.1) 95%, transparent 100%);
          padding: 2px 8px;
          margin: 0 -8px;
          border-radius: 4px;
        }
        
        .result-card:hover .result-value {
          transform: translateY(-5px);
        }
        
        .result-card:hover .result-icon {
          transform: scale(1.2);
        }
        
        .ribbon {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(40%, -40%) rotate(45deg);
          background-image: linear-gradient(90deg, rgba(var(--primary), 0.7), rgba(var(--primary), 0.9));
          padding: 8px 40px;
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .gallery-image {
          transition: all 0.3s ease;
        }
        
        .gallery-image:hover {
          transform: scale(1.05);
          z-index: 10;
        }
        
        .tech-pill:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .blockquote {
          position: relative;
        }
        
        .blockquote::before {
          content: """;
          font-size: 6rem;
          position: absolute;
          left: -1.5rem;
          top: -2rem;
          opacity: 0.1;
          font-family: serif;
          color: hsl(var(--primary));
        }
        
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .float-up {
          animation: floatUp 0.5s ease forwards;
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(0.95); }
        }
        
        .pulse-animation {
          animation: pulse 3s infinite ease-in-out;
        }
      `}</style>
      
      {/* Fancy background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-40"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 blur-[120px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500/10 via-yellow-500/10 to-orange-500/10 blur-[100px] -z-10"></div>
        </motion.div>
      </div>
      
      <Header />
      
      <main className="pt-24 md:pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/case-studies" 
              className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Case Studies</span>
            </Link>
          </motion.div>
          
          {/* Hero Section */}
          <div ref={heroRef} className="mb-16 relative">
            {/* Hero content */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/70 backdrop-blur-sm text-sm font-medium rounded-full mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                {caseStudy.industry}
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-blue-600">
                  {caseStudy.title}
                </span>
                <motion.div 
                  className="absolute -right-10 -top-10"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100, delay: 1 }}
                >
                  <Award className="h-8 w-8 text-primary/70" />
                </motion.div>
              </motion.h1>
              
              <motion.div 
                className="flex flex-wrap gap-4 mb-8"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="flex items-center text-sm"
                  variants={fadeInUp}
                >
                  <User className="w-4 h-4 mr-2 text-primary" />
                  <span>Client: <strong>{caseStudy.client}</strong></span>
                </motion.div>
                
                {caseStudy.date && (
                  <motion.div 
                    className="flex items-center text-sm"
                    variants={fadeInUp}
                  >
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <span>Completed: <strong>{caseStudy.date}</strong></span>
                  </motion.div>
                )}
                
                {caseStudy.duration && (
                  <motion.div 
                    className="flex items-center text-sm"
                    variants={fadeInUp}
                  >
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span>Duration: <strong>{caseStudy.duration}</strong></span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
            
            {/* Hero image with parallax */}
            <motion.div 
              className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/40 via-purple-500/30 to-blue-500/40 opacity-70"
                animate={{
                  background: [
                    "linear-gradient(to bottom right, rgba(var(--primary), 0.4), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.4))",
                    "linear-gradient(to bottom right, rgba(59, 130, 246, 0.4), rgba(var(--primary), 0.3), rgba(147, 51, 234, 0.4))",
                    "linear-gradient(to bottom right, rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.3), rgba(var(--primary), 0.4))"
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.img 
                src={caseStudy.image} 
                alt={caseStudy.title} 
                className="w-full h-full object-cover"
                style={{ y: heroImageY }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                <motion.div
                  className="max-w-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <p className="text-lg md:text-xl font-medium text-white mb-4 text-shadow">
                    "{caseStudy.challenge.split('.')[0]}."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-white/90">
                      Our mission was to transform challenges into opportunities and deliver exceptional results.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <AnimatePresence>
                {activeImage && (
                  <motion.div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setActiveImage(null)}
                  >
                    <motion.div
                      className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                      <img 
                        src={activeImage} 
                        alt="Gallery" 
                        className="w-full h-full object-contain"
                      />
                      <button 
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage(null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="prose prose-lg max-w-none mb-16">
                <motion.h2 
                  className="text-2xl md:text-3xl font-display font-bold mb-6 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <span className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Target className="h-5 w-5 text-primary" />
                  </span>
                  The Challenge
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-muted-foreground mb-8">
                    <span className="highlight-text font-medium text-foreground">
                      {caseStudy.challenge.split('.')[0]}.
                    </span> 
                    {caseStudy.challenge.split('.').slice(1).join('.')}
                  </p>
                  
                  {/* Additional description paragraphs if available */}
                  {descriptionParagraphs.slice(0, 1).map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground mb-8">{paragraph}</p>
                  ))}
                </motion.div>
                
                <motion.h2 
                  className="text-2xl md:text-3xl font-display font-bold mb-6 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <span className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <LightbulbIcon className="h-5 w-5 text-primary" />
                  </span>
                  Our Solution
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-muted-foreground mb-8">
                    <span className="highlight-text font-medium text-foreground">
                      {caseStudy.solution.split('.')[0]}.
                    </span> 
                    {caseStudy.solution.split('.').slice(1).join('.')}
                  </p>
                  
                  {/* Additional description paragraphs if available */}
                  {descriptionParagraphs.slice(1, 2).map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground mb-8">{paragraph}</p>
                  ))}
                </motion.div>
                
                {/* Image gallery */}
                {caseStudy.gallery && (
                  <motion.div 
                    className="my-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                      Project Gallery
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {caseStudy.gallery.map((image, index) => (
                        <motion.div
                          key={index}
                          className="aspect-[4/3] rounded-lg overflow-hidden relative group cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveImage(image)}
                        >
                          <img 
                            src={image} 
                            alt={`${caseStudy.title} screenshot ${index + 1}`} 
                            className="w-full h-full object-cover gallery-image"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-white text-sm font-medium">View image</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <div ref={resultsRef}>
                  <motion.h2 
                    className="text-2xl md:text-3xl font-display font-bold mb-6 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <span className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Trophy className="h-5 w-5 text-primary" />
                    </span>
                    Results
                  </motion.h2>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isResultsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <p className="text-muted-foreground mb-8">
                    <span className="highlight-text font-medium text-foreground">
                      {caseStudy.results.split('.')[0]}.
                    </span> 
                    {caseStudy.results.split('.').slice(1).join('.')}
                  </p>
                  
                  {/* Additional description paragraphs if available */}
                  {descriptionParagraphs.slice(2).map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground mb-8">{paragraph}</p>
                  ))}
                </motion.div>
              </div>
              
              {/* Result Metrics */}
              {caseStudy.resultMetrics && (
                <motion.div 
                  className="mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-display font-bold mb-6 flex items-center">
                    <span className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <BarChart className="h-5 w-5 text-primary" />
                    </span>
                    Key Metrics
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {caseStudy.resultMetrics.map((metric, index) => (
                      <motion.div 
                        key={index} 
                        className={`result-card bg-gradient-to-br ${caseStudy.color || 'from-primary/5 to-accent/5'} p-6 rounded-xl border border-primary/10 transition-all duration-300 hover:shadow-lg relative group`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <motion.div 
                              className="text-3xl md:text-4xl font-bold mb-2 result-value text-gradient bg-gradient-to-r from-primary to-blue-600"
                              animate={isResultsInView ? 
                                { scale: [1, 1.1, 1], transition: { delay: 0.5 + index * 0.1, duration: 0.5 } } : 
                                {}
                              }
                            >
                              {metric.value}
                            </motion.div>
                            <div className="text-muted-foreground">{metric.label}</div>
                          </div>
                          <motion.div 
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center result-icon transition-transform duration-300"
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: 15 }}
                          >
                            {metric.icon || <ArrowUpRight className="h-5 w-5 text-primary" />}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Testimonial */}
              {caseStudy.testimonial && (
                <motion.div 
                  className="mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm rounded-2xl relative overflow-hidden border border-primary/10">
                    {/* Decorative elements */}
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-primary/5 blur-xl"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    
                    <blockquote className="relative blockquote">
                      <motion.div
                        className="absolute -top-2 -left-2 text-primary/20"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.05, 0.95, 1]
                        }}
                        transition={{ duration: 6, repeat: Infinity }}
                      >
                        <Heart className="h-6 w-6 fill-current opacity-30" />
                      </motion.div>
                      
                      <p className="text-lg italic mb-6 leading-relaxed">"{caseStudy.testimonial.quote}"</p>
                      
                      <footer className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{caseStudy.testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">{caseStudy.testimonial.position}</div>
                        </div>
                      </footer>
                    </blockquote>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <motion.div 
                  className="bg-gradient-to-br from-card/50 to-background/50 backdrop-blur-sm border border-primary/10 rounded-xl overflow-hidden shadow-lg relative mb-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-6 relative">
                      Project Details
                      <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary/50 rounded-full"></span>
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Services Provided</h4>
                        <div className="flex flex-wrap gap-2">
                          {caseStudy.services.map(service => (
                            <span key={service} className="bg-primary/10 text-primary-foreground text-sm px-3 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {caseStudy.technologies && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {caseStudy.technologies.map((tech, index) => (
                              <motion.span 
                                key={tech} 
                                className="tech-pill bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full transition-all duration-300"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to="/contact"
                            className="group relative inline-flex items-center w-full justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all"
                          >
                            <span className="relative z-10 flex items-center">
                              Start Your Project
                              <motion.div 
                                className="ml-2"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </span>
                            
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-[length:200%] bg-[position:0%] group-hover:bg-[position:100%] transition-[background-position] duration-500"></div>
                            
                            {/* Shine effect */}
                            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-[left] duration-700 ease-in-out"></div>
                          </Link>
                        </motion.div>
                      </div>
                      
                      <div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to="/case-studies"
                            className="inline-flex items-center w-full justify-center bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                          >
                            View More Case Studies
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-primary/10 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-blue-500/10 blur-xl"></div>
                  <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-purple-500/10 blur-lg"></div>
                  
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-blue-500" />
                    Need Similar Results?
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    Our team is ready to help your business achieve extraordinary outcomes with tailored digital solutions.
                  </p>
                  
                  <Link
                    to="/contact#consultation"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <span>Book a free consultation</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Related case studies - simplified version */}
          <div className="mt-16">
            <motion.h2 
              className="text-2xl md:text-3xl font-display font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Explore Related Case Studies
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies
                .filter(study => study.id !== caseStudy.id)
                .map((study, index) => (
                  <motion.div 
                    key={study.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-hover"
                  >
                    <Link 
                      to={`/case-studies/${study.slug}`}
                      className="block bg-card/50 border border-border rounded-xl overflow-hidden transition-all duration-300 h-full"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <img 
                          src={study.image} 
                          alt={study.title} 
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-3 left-3 z-20">
                          <div className="px-2 py-1 bg-primary/80 text-primary-foreground text-xs rounded-full">
                            {study.industry}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{study.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{study.challenge}</p>
                        <div className="mt-4 flex items-center text-primary text-sm">
                          <span>Read case study</span>
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudyDetail;