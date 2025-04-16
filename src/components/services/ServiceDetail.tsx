import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Gauge, 
  Lightbulb,
  Home,
  Building,
  TrendingUp,
  Target,
  Video,
  Camera,
  Film,
  PlayCircle
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceDetailProps {
  service: {
    title: string;
    type: string;
    slug: string;
    description: string;
    content: string;
  };
}

interface ServiceStats {
  projects?: string;
  satisfaction: string;
  rating: string;
  downloads?: string;
  views?: string;
  leads?: string;
  clients?: string;
  websites?: string;
  stores?: string;
  uptime?: string;
  roi?: string;
  conversion?: string;
  ranking?: string;
  sales?: string;
  support?: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  
  // Mock images for the service detail (normally these would come from the service data)
  const mockImages = [
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop"
  ];

  // Service-specific images based on slug
  const serviceImages = {
    'web-development': [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2940&auto=format&fit=crop"
    ],
    'mobile-development': [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=2940&auto=format&fit=crop"
    ],
    'ui-ux-design': [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=2940&auto=format&fit=crop"
    ],
    'digital-marketing': [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2940&auto=format&fit=crop"
    ],
    'seo-services': [
      "https://images.unsplash.com/photo-1571677419400-39631a3670ac?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2940&auto=format&fit=crop"
    ],
    'ecommerce-solutions': [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2940&auto=format&fit=crop"
    ],
    'video-production': [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=2940&auto=format&fit=crop"
    ],
    'real-estate-leads': [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628744404730-5e143358539b?q=80&w=2940&auto=format&fit=crop"
    ]
  };

  // Get images for current service
  const currentServiceImages = serviceImages[service.slug as keyof typeof serviceImages] || mockImages;

  // Additional service-specific stats
  const serviceStats: Record<string, ServiceStats> = {
    'web-development': {
      projects: "200+",
      satisfaction: "98%",
      uptime: "99.9%",
      rating: "4.9★"
    },
    'mobile-development': {
      projects: "150+",
      satisfaction: "97%",
      downloads: "1M+",
      rating: "4.8★"
    },
    'ui-ux-design': {
      projects: "180+",
      satisfaction: "99%",
      conversion: "+65%",
      rating: "5.0★"
    },
    'digital-marketing': {
      clients: "120+",
      satisfaction: "96%",
      roi: "300%",
      rating: "4.7★"
    },
    'seo-services': {
      websites: "250+",
      satisfaction: "95%",
      ranking: "Top 10",
      rating: "4.8★"
    },
    'ecommerce-solutions': {
      stores: "100+",
      satisfaction: "97%",
      sales: "+180%",
      rating: "4.9★"
    },
    'video-production': {
      projects: "300+",
      satisfaction: "99%",
      views: "10M+",
      rating: "4.9★"
    },
    'real-estate-leads': {
      leads: "50K+",
      satisfaction: "98%",
      conversion: "35%",
      rating: "5.0★"
    }
  };

  // Get stats for current service
  const stats: ServiceStats = serviceStats[service.slug] || {
    projects: "100+",
    satisfaction: "98%",
    support: "24/7",
    rating: "5★"
  };
  
  useEffect(() => {
    // Reveal the content with a slight delay for a nice entrance effect
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 300);
    
    // Auto-rotate the showcase images
    const imageInterval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % currentServiceImages.length);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(imageInterval);
    };
  }, [currentServiceImages.length]);

  const renderServiceContent = () => {
    if (!service.content) return null;
    
    // Try to parse the content as markdown-style list items
    const contentLines = service.content.split("\n").map(line => line.trim()).filter(Boolean);
    
    // Check if content has list items (starting with - or •)
    const hasListItems = contentLines.some(line => line.startsWith('-') || line.startsWith('•'));
    
    if (hasListItems) {
      const sections = [];
      let currentSection = { title: '', items: [] as string[] };
      
      for (const line of contentLines) {
        if (!line.startsWith('-') && !line.startsWith('•')) {
          // This is a section title
          if (currentSection.items.length > 0) {
            sections.push({...currentSection});
            currentSection = { title: line, items: [] };
          } else {
            currentSection.title = line;
          }
        } else {
          // This is a list item
          currentSection.items.push(line.replace(/^[-•]\s*/, ''));
        }
      }
      
      // Add the last section
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-12"
        >
          {sections.map((section, index) => (
            <motion.div 
              key={index} 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              {section.title && (
                <div className="relative">
                  <h3 className="text-2xl font-display font-bold relative z-10">{section.title}</h3>
                  <div className="absolute -bottom-2 left-0 h-3 bg-primary/10 w-32 -z-10 rounded-full"></div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((item, itemIndex) => (
                  <motion.div 
                    key={itemIndex}
                    className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (itemIndex * 0.1) }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-foreground group-hover:text-primary transition-colors">{item}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
    
    // If no list items, just render as paragraphs
    return (
      <div className="space-y-6">
        {contentLines.map((paragraph, index) => (
          <motion.p 
            key={index} 
            className="text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    );
  };

  // Update the stats card section
  const renderStatsCard = () => (
    <motion.div 
      className="bg-card border border-border rounded-xl p-6"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="font-medium mb-4">Service Stats</h4>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-lg bg-primary/5">
          <div className="text-2xl font-bold text-primary mb-1">{stats.satisfaction}</div>
          <div className="text-xs text-muted-foreground">Client Satisfaction</div>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/5">
          {stats.projects || stats.leads ? (
            <>
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {stats.projects || stats.leads}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.leads ? 'Qualified Leads' : 'Projects Completed'}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {stats.clients || stats.websites || stats.stores}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.clients ? 'Active Clients' : 
                 stats.websites ? 'Websites Optimized' : 
                 'Stores Launched'}
              </div>
            </>
          )}
        </div>
        <div className="p-3 rounded-lg bg-green-500/5">
          <div className="text-2xl font-bold text-green-500 mb-1">
            {stats.roi || stats.conversion || stats.downloads || 
             stats.uptime || stats.ranking || stats.sales || 
             stats.views || stats.support}
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.roi ? 'Average ROI' : 
             stats.conversion ? 'Conversion Rate' : 
             stats.downloads ? 'App Downloads' : 
             stats.uptime ? 'Server Uptime' :
             stats.ranking ? 'Google Rankings' :
             stats.sales ? 'Sales Growth' :
             stats.views ? 'Video Views' :
             'Support Available'}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-blue-500/5">
          <div className="text-2xl font-bold text-blue-500 mb-1">{stats.rating}</div>
          <div className="text-xs text-muted-foreground">Average Rating</div>
        </div>
      </div>
    </motion.div>
  );

  // Service-specific icons and features
  const serviceIcons = {
    'video-production': {
      benefits: [
        { icon: Video, title: "Professional Equipment", color: "blue" },
        { icon: Camera, title: "Expert Cinematography", color: "purple" },
        { icon: Film, title: "Premium Editing", color: "green" }
      ]
    },
    'real-estate-leads': {
      benefits: [
        { icon: Home, title: "Qualified Leads", color: "blue" },
        { icon: Target, title: "Targeted Marketing", color: "purple" },
        { icon: TrendingUp, title: "High ROI", color: "green" }
      ]
    }
  };

  // Get current service icons
  const currentIcons = serviceIcons[service.slug as keyof typeof serviceIcons]?.benefits || [
    { icon: ShieldCheck, title: "Quality Guarantee", color: "blue" },
    { icon: Gauge, title: "Fast Delivery", color: "green" },
    { icon: Lightbulb, title: "Custom Solutions", color: "purple" }
  ];

  // Enhance the benefits section with service-specific content
  const renderBenefits = () => (
    <motion.div 
      className="mt-12 pt-12 border-t border-border space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-display font-bold">Key Benefits</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentIcons.map((benefit, index) => (
          <motion.div 
            key={index}
            className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className={`w-12 h-12 rounded-full bg-${benefit.color}-500/10 flex items-center justify-center mb-4`}>
              <benefit.icon className={`w-6 h-6 text-${benefit.color}-500`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground text-sm">{
              service.slug === 'real-estate-leads' ? 
                index === 0 ? "Pre-qualified leads ready to convert" :
                index === 1 ? "AI-powered targeting for optimal results" :
                "Proven ROI with detailed analytics" :
              service.slug === 'video-production' ?
                index === 0 ? "State-of-the-art production equipment" :
                index === 1 ? "Experienced cinematographers and directors" :
                "Advanced post-production and effects" :
              "We ensure the highest quality standards for all our services."
            }</p>
          </motion.div>
        ))}
      </div>

      {/* Extra section for real estate leads */}
      {service.slug === 'real-estate-leads' && (
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Success Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="text-3xl font-bold text-primary mb-1">35%</div>
                <div className="text-sm text-muted-foreground">Average Conversion Rate</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/5">
                <div className="text-3xl font-bold text-purple-500 mb-1">24h</div>
                <div className="text-sm text-muted-foreground">Average Response Time</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/5">
                <div className="text-3xl font-bold text-blue-500 mb-1">50k+</div>
                <div className="text-sm text-muted-foreground">Monthly Leads</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5">
                <div className="text-3xl font-bold text-green-500 mb-1">3x</div>
                <div className="text-sm text-muted-foreground">ROI Increase</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Why Choose Us</h3>
            <ul className="space-y-4">
              {[
                "Exclusive territory rights",
                "AI-powered lead scoring",
                "Real-time notifications",
                "Integrated CRM solutions"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Extra section for video production */}
      {service.slug === 'video-production' && (
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Equipment & Technology</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <PlayCircle className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-medium mb-1">4K Cameras</h4>
                <p className="text-sm text-muted-foreground">Professional cinema-grade equipment</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <Film className="w-8 h-8 text-purple-500 mb-2" />
                <h4 className="font-medium mb-1">Pro Audio</h4>
                <p className="text-sm text-muted-foreground">High-end sound recording</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <Camera className="w-8 h-8 text-blue-500 mb-2" />
                <h4 className="font-medium mb-1">Lighting</h4>
                <p className="text-sm text-muted-foreground">Professional lighting kits</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <Video className="w-8 h-8 text-green-500 mb-2" />
                <h4 className="font-medium mb-1">Drones</h4>
                <p className="text-sm text-muted-foreground">Aerial videography</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Production Process</h3>
            <div className="relative">
              <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-primary/20"></div>
              {[
                "Pre-production & Planning",
                "Filming & Direction",
                "Post-production & Editing",
                "Final Delivery & Revisions"
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative pl-12 pb-8 last:pb-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <h4 className="font-medium mb-2">{step}</h4>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? "Detailed planning and storyboarding" :
                     index === 1 ? "Professional filming with expert crew" :
                     index === 2 ? "Advanced editing and effects" :
                     "Review and final touches"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
  
  return (
    <div className="py-20 md:py-28 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      <div className="absolute top-1/4 left-10 w-60 h-60 rounded-full bg-blue-500/5 blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-[100px] -z-10"></div>
      
      {/* Animated particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-0 w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 relative">
        <Link 
          to="/services" 
          className="inline-flex items-center gap-2 mb-8 text-sm group"
        >
          <motion.span
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
          </motion.span>
          <span className="group-hover:text-primary transition-colors">{t('nav.services')}</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: isRevealed ? 0 : -20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Service header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 mb-3">
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary px-3">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {service.type}
                </Badge>
                <Badge variant="outline" className="border-purple-500/30 bg-purple-500/5 text-purple-500 px-3">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  Premium
                </Badge>
              </div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {service.title}
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {service.description}
              </motion.p>
            </div>
            
            {/* Service images showcase */}
            <motion.div 
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden my-12 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              
              <AnimatePresence mode="wait">
                {currentServiceImages.map((image, index) => (
                  activeImage === index && (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <img
                        src={image}
                        alt={`${service.title} showcase ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {currentServiceImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImage === index ? "w-6 bg-primary" : "bg-white/50"
                    }`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Content sections */}
            <div className="py-4 space-y-8">
              {renderServiceContent()}
            </div>
            
            {/* Benefits section */}
            {renderBenefits()}
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isRevealed ? 1 : 0, x: isRevealed ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-24 space-y-8">
              {/* CTA Card */}
              <motion.div 
                className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg relative overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-[10px] bg-[radial-gradient(farthest-side_at_top_right,rgb(var(--primary-500))/0.2,transparent_70%)] opacity-50" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-semibold">{t('service.cta')}</h3>
                  <p className="text-muted-foreground">{t('service.contact')}</p>
                  
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                    <span className="relative z-10">{t('contact.title')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* Features Card */}
              <motion.div 
                className="bg-card border border-border rounded-xl p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium mb-4">{t('service.features')}</h4>
                <ul className="space-y-3">
                  {service.content && parseFeatures(service.content).slice(0, 5).map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Stats Card */}
              {renderStatsCard()}
              
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper function to parse features from content
const parseFeatures = (content: string): string[] => {
  if (content.includes('- ') || content.includes('• ')) {
    return content
      .split(/\n/)
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
  }
  
  return content
    .split(/\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 5);
};

export default ServiceDetail;
