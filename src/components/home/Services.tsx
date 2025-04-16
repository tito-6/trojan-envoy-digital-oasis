import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Code, 
  Smartphone, 
  Paintbrush, 
  BarChart, 
  Globe, 
  ShoppingCart, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  Zap,
  ExternalLink,
  Star,
  Settings,
  Server,
  Shield,
  Brain
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle, FaWordpress } from "react-icons/fa";
import { FaMeta, FaShopify } from "react-icons/fa6";
import { SiWoocommerce, SiZapier } from "react-icons/si";

// Enhanced Service Card Component with External Links
const ServiceCard = ({ 
  id,
  title, 
  icon: Icon, 
  description, 
  features = [], 
  externalLinks = [],
  colorClass = "from-primary to-purple-600",
  isExpanded, 
  onExpand 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  return (
    <motion.div
      layout
      className={`relative group overflow-hidden ${
        isExpanded ? "col-span-2 row-span-2 md:col-span-2 lg:col-span-2" : ""
      }`}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-full bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 0.05 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-full h-full bg-gradient-to-br ${colorClass}`} />
        </motion.div>

        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Card header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={() => onExpand()}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronRight 
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  isExpanded ? "rotate-90" : "group-hover:translate-x-1"
                }`} 
              />
            </button>
          </div>

          {/* Card content */}
          <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            {description}
          </p>

          {/* Features list */}
          <AnimatePresence>
            {(isExpanded || isHovered) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mb-6"
              >
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 group/feature"
                  >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${colorClass} flex-shrink-0 flex items-center justify-center`}>
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover/feature:text-foreground transition-colors">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* External Resources Section - Enhanced for SEO */}
          {isExpanded && externalLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto pt-4 border-t border-border/50"
            >
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Related Resources & Documentation:</h4>
              <div className="grid grid-cols-2 gap-2">
                {externalLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group/link text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "Opening external resource",
                        description: `Redirecting to ${link.title}...`
                      });
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                      {link.icon}
                    </div>
                    <span className="truncate group-hover/link:text-primary transition-colors">
                      {link.title}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const { t } = useLanguage();
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const servicesRef = useRef(null);
  
  // Reset expanded service when scrolling away
  useEffect(() => {
    const handleScroll = () => {
      const element = servicesRef.current;
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setExpandedService(null);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Service data with enhanced descriptions and external links
  const services = [
    {
      id: 1,
      title: "Web Development",
      icon: Code,
      description: "Custom websites and web applications designed to engage users and drive conversions.",
      colorClass: "from-blue-600 to-indigo-700",
      features: [
        "Responsive design for all devices",
        "Performance optimization",
        "Custom CMS integration",
        "API development",
        "Progressive Web Apps (PWAs)"
      ],
      externalLinks: [
        { title: "React Official Docs", url: "https://react.dev/", icon: <Code /> },
        { title: "Next.js by Vercel", url: "https://nextjs.org/", icon: <Globe /> },
        { title: "Google Web Dev", url: "https://developers.google.com/web", icon: <Globe /> },
        { title: "MDN Web Docs", url: "https://developer.mozilla.org/", icon: <FileText /> }
      ],
      link: "/services/web-development"
    },
    {
      id: 2,
      title: "Mobile App Development",
      icon: Smartphone,
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      colorClass: "from-purple-600 to-fuchsia-700",
      features: [
        "iOS and Android development",
        "Cross-platform solutions",
        "UI/UX design",
        "App maintenance and updates",
        "Integration with device features"
      ],
      externalLinks: [
        { title: "Apple Developer", url: "https://developer.apple.com/", icon: <Smartphone /> },
        { title: "Android Developers", url: "https://developer.android.com/", icon: <Smartphone /> },
        { title: "React Native", url: "https://reactnative.dev/", icon: <Code /> },
        { title: "Flutter", url: "https://flutter.dev/", icon: <Code /> }
      ],
      link: "/services/mobile-development"
    },
    {
      id: 3,
      title: "UI/UX Design",
      icon: Paintbrush,
      description: "User-centered design that creates intuitive, engaging digital experiences.",
      colorClass: "from-pink-500 to-rose-600",
      features: [
        "User research and testing",
        "Wireframing and prototyping",
        "Visual design",
        "Interaction design",
        "Accessibility compliance"
      ],
      externalLinks: [
        { title: "Material Design", url: "https://m3.material.io/", icon: <Paintbrush /> },
        { title: "Apple HIG", url: "https://developer.apple.com/design/", icon: <Paintbrush /> },
        { title: "Figma", url: "https://www.figma.com/", icon: <Paintbrush /> },
        { title: "Adobe XD", url: "https://helpx.adobe.com/xd/user-guide.html", icon: <Star /> }
      ],
      link: "/services/ui-ux-design"
    },
    {
      id: 4,
      title: "Digital Marketing",
      icon: BarChart,
      description: "Strategic marketing solutions that grow your audience and drive meaningful results.",
      colorClass: "from-green-500 to-teal-600",
      features: [
        "Search Engine Optimization (SEO)",
        "Pay-per-click advertising (PPC)",
        "Social media marketing",
        "Email marketing campaigns",
        "Analytics and reporting"
      ],
      externalLinks: [
        { title: "Meta Business", url: "https://business.facebook.com/", icon: <Globe /> },
        { title: "Google Ads", url: "https://ads.google.com/", icon: <BarChart /> },
        { title: "Google Analytics", url: "https://analytics.google.com/", icon: <BarChart /> },
        { title: "LinkedIn Marketing", url: "https://business.linkedin.com/marketing-solutions", icon: <Globe /> }
      ],
      link: "/services/digital-marketing"
    },
    {
      id: 5,
      title: "SEO Optimization",
      icon: Globe,
      description: "Improve your search visibility and organic traffic with data-driven SEO strategies.",
      colorClass: "from-cyan-500 to-blue-600",
      features: [
        "Keyword research and analysis",
        "On-page optimization",
        "Technical SEO audits",
        "Content strategy",
        "Rank tracking and reporting"
      ],
      externalLinks: [
        { title: "Google Search Console", url: "https://search.google.com/search-console/about", icon: <Globe /> },
        { title: "Google SEO Guide", url: "https://developers.google.com/search", icon: <FileText /> },
        { title: "Bing Webmaster", url: "https://www.bing.com/webmasters/about", icon: <Globe /> },
        { title: "Schema.org", url: "https://schema.org/", icon: <Code /> }
      ],
      link: "/services/seo-optimization"
    },
    {
      id: 6,
      title: "E-Commerce Solutions",
      icon: ShoppingCart,
      description: "Build and optimize online stores that convert visitors into loyal customers.",
      colorClass: "from-orange-500 to-amber-600",
      features: [
        "Custom e-commerce development",
        "Shopping cart integration",
        "Payment gateway setup",
        "Product management systems",
        "Conversion optimization"
      ],
      externalLinks: [
        { title: "Shopify Dev", url: "https://developers.shopify.com/", icon: <ShoppingCart /> },
        { title: "WooCommerce", url: "https://woocommerce.com/documentation/", icon: <ShoppingCart /> },
        { title: "Stripe Docs", url: "https://stripe.com/docs", icon: <ShoppingCart /> },
        { title: "PayPal Dev", url: "https://developer.paypal.com/", icon: <ShoppingCart /> }
      ],
      link: "/services/ecommerce-solutions"
    },
    {
      id: 7,
      title: "Business Automation",
      icon: Zap,
      description: "Streamline your business processes and boost productivity with intelligent automation.",
      colorClass: "from-yellow-500 to-amber-600",
      features: [
        "Workflow automation",
        "Integration between platforms",
        "Custom automation scripts",
        "Process optimization",
        "AI-powered solutions"
      ],
      externalLinks: [
        { title: "Zapier Platform", url: "https://platform.zapier.com/", icon: <Zap /> },
        { title: "Make.com Docs", url: "https://www.make.com/en/help/", icon: <Settings /> },
        { title: "Power Automate", url: "https://learn.microsoft.com/power-automate/", icon: <Settings /> },
        { title: "Google Apps Script", url: "https://developers.google.com/apps-script", icon: <Code /> }
      ],
      link: "/services/business-automation"
    },
    {
      id: 8,
      title: "Cloud Solutions",
      icon: Server,
      description: "Scalable cloud infrastructure and services to power your digital transformation.",
      colorClass: "from-sky-500 to-blue-600",
      features: [
        "Cloud architecture design",
        "Migration services",
        "DevOps implementation",
        "Serverless solutions",
        "Cloud security"
      ],
      externalLinks: [
        { title: "AWS", url: "https://aws.amazon.com/documentation/", icon: <Server /> },
        { title: "Azure", url: "https://learn.microsoft.com/azure/", icon: <Server /> },
        { title: "Google Cloud", url: "https://cloud.google.com/docs", icon: <Server /> },
        { title: "Digital Ocean", url: "https://docs.digitalocean.com/", icon: <Server /> }
      ],
      link: "/services/cloud-solutions"
    },
    {
      id: 9,
      title: "Content Creation",
      icon: FileText,
      description: "Engaging content that tells your story and connects with your audience.",
      colorClass: "from-emerald-500 to-green-600",
      features: [
        "Content strategy",
        "Copywriting",
        "Video production",
        "Graphic design",
        "Social media content"
      ],
      externalLinks: [
        { title: "Meta Creative Hub", url: "https://www.facebook.com/business/tools/creative-hub", icon: <FileText /> },
        { title: "YouTube Creators", url: "https://www.youtube.com/creators/", icon: <FileText /> },
        { title: "Canva Learn", url: "https://www.canva.com/learn/", icon: <Paintbrush /> },
        { title: "Adobe Create", url: "https://create.adobe.com/", icon: <Paintbrush /> }
      ],
      link: "/services/content-creation"
    },
    {
      id: 10,
      title: "Data Analytics",
      icon: BarChart,
      description: "Transform your data into actionable insights for better business decisions.",
      colorClass: "from-violet-500 to-purple-600",
      features: [
        "Data visualization",
        "Business intelligence",
        "Performance tracking",
        "Custom reporting",
        "Predictive analytics"
      ],
      externalLinks: [
        { title: "Google Analytics", url: "https://analytics.google.com/analytics/academy/", icon: <BarChart /> },
        { title: "Power BI", url: "https://learn.microsoft.com/power-bi/", icon: <BarChart /> },
        { title: "Tableau", url: "https://www.tableau.com/learn", icon: <BarChart /> },
        { title: "Meta Analytics", url: "https://www.facebook.com/business/insights/tools/analytics", icon: <BarChart /> }
      ],
      link: "/services/data-analytics"
    },
    {
      id: 11,
      title: "Cybersecurity",
      icon: Shield,
      description: "Protect your digital assets with comprehensive security solutions.",
      colorClass: "from-red-500 to-rose-600",
      features: [
        "Security audits",
        "Penetration testing",
        "Compliance consulting",
        "Security training",
        "Incident response"
      ],
      externalLinks: [
        { title: "OWASP", url: "https://owasp.org/", icon: <Shield /> },
        { title: "Google Security", url: "https://safety.google/security/", icon: <Shield /> },
        { title: "AWS Security", url: "https://aws.amazon.com/security/", icon: <Shield /> },
        { title: "Microsoft Security", url: "https://www.microsoft.com/security", icon: <Shield /> }
      ],
      link: "/services/cybersecurity"
    },
    {
      id: 12,
      title: "AI Integration",
      icon: Brain,
      description: "Harness the power of artificial intelligence to transform your business.",
      colorClass: "from-indigo-500 to-blue-600",
      features: [
        "AI strategy consulting",
        "Machine learning solutions",
        "Natural language processing",
        "Computer vision",
        "AI automation"
      ],
      externalLinks: [
        { title: "OpenAI", url: "https://platform.openai.com/docs", icon: <Brain /> },
        { title: "Google AI", url: "https://ai.google/", icon: <Brain /> },
        { title: "Azure AI", url: "https://azure.microsoft.com/solutions/ai/", icon: <Brain /> },
        { title: "IBM Watson", url: "https://www.ibm.com/watson", icon: <Brain /> }
      ],
      link: "/services/ai-integration"
    }
  ];

  const handleExpand = (id) => {
    if (expandedService === id) {
      setExpandedService(null);
    } else {
      setExpandedService(id);
    }
  };

  return (
    <section ref={servicesRef} className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient and effects */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ opacity, y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </motion.div>
      
      {/* Animated blobs */}
      <motion.div 
        className="absolute top-40 left-10 w-72 h-72 rounded-full bg-primary/5 blur-[120px] -z-5"
        animate={{ 
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      
      <motion.div 
        className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-purple-500/5 blur-[140px] -z-5"
        animate={{ 
          x: [0, -50, 0],
          opacity: [0.4, 0.6, 0.4] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('services.subtitle')}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
            Exceptional <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">{t('services.subtitle')}</span> for Modern Businesses
          </h2>
          
          <p className="text-muted-foreground text-lg">
            We offer comprehensive digital solutions tailored to meet your specific business needs and goals. Our expert team delivers cutting-edge services to help your business thrive in the digital era.
          </p>
        </motion.div>
        
        {/* Services Grid with staggered animation */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <ServiceCard
                {...service}
                isExpanded={expandedService === service.id}
                onExpand={() => handleExpand(service.id)}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Integration Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-gradient-to-br from-card/50 to-card rounded-2xl border border-border/50 p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/5 text-primary px-4 py-1.5">
              <Server className="w-3.5 h-3.5 mr-1.5" /> Seamless Integrations
            </Badge>
            <h3 className="text-2xl md:text-3xl font-display font-semibold">
              Connect With Your Favorite Platforms
            </h3>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Our services integrate with the tools and platforms you already use, creating a seamless workflow for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {[
              { name: "WordPress", icon: <FaWordpress className="w-8 h-8 mx-auto opacity-70" /> },
              { name: "Shopify", icon: <FaShopify className="w-8 h-8 mx-auto opacity-70" /> },
              { name: "WooCommerce", icon: <SiWoocommerce className="w-8 h-8 mx-auto opacity-70" /> },
              { name: "Zapier", icon: <SiZapier className="w-8 h-8 mx-auto opacity-70" /> },
              { name: "Meta", icon: <FaMeta className="w-8 h-8 mx-auto opacity-70" /> },
              { name: "Google", icon: <FaGoogle className="w-8 h-8 mx-auto opacity-70" /> }
            ].map((platform, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-card transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="text-muted-foreground hover:text-foreground transition-colors">
                  {platform.icon}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{platform.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Looking for a custom solution? Our team of experts will help you build the perfect digital strategy tailored to your business goals.
          </p>
          
          <Link to="/services">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-primary-foreground group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
              <span className="relative flex items-center">
                Explore All Services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;