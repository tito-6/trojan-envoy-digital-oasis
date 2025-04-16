import React, { useEffect, useRef } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServicesCTA from "@/components/services/ServicesCTA";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Stars, Zap, Rocket, Shield, Award, Globe } from "lucide-react";
import { FaReact, FaNodeJs, FaMobileAlt, FaLaptopCode } from "react-icons/fa";

const Services: React.FC = () => {
  const { t } = useLanguage();
  const servicesRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["start start", "end start"],
  });

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 0.3], ["0%", "30%"]);
  const scrollMultiplier = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    // Add example services if none exist
    const addExampleServicesIfEmpty = async () => {
      const allContent = storageService.getAllContent();
      const serviceItems = allContent.filter(item => item.type === "Service");
      
      if (serviceItems.length === 0 || serviceItems.length < 9) {
        // Delete existing services to ensure consistent ordering
        serviceItems.forEach(service => {
          storageService.deleteContent(service.id);
        });
        
        // Web Development Service
        storageService.addContent({
          title: "Web Development",
          type: "Service",
          slug: "web-development",
          description: "Create powerful, scalable, and beautiful web applications that drive business growth",
          content: `Modern Web Solutions
- Custom website development using React, Next.js, and modern frameworks
- Progressive Web Applications (PWA) for enhanced mobile experience
- E-commerce platforms with secure payment integration
- Content Management Systems (CMS) for easy updates
- API development and third-party integrations
- Performance optimization and speed enhancement
- SEO-friendly architecture and implementation
- Responsive design for all devices and screens

Technical Expertise
- Frontend: React, Vue.js, Angular, TypeScript
- Backend: Node.js, Python, PHP, Java
- Database: MongoDB, PostgreSQL, MySQL
- Cloud: AWS, Google Cloud, Azure
- DevOps: Docker, Kubernetes, CI/CD
- Security: SSL, HTTPS, Data Encryption

Development Process
- Requirements analysis and planning
- UI/UX design and prototyping
- Agile development methodology
- Continuous testing and quality assurance
- Performance optimization
- Launch and deployment
- Ongoing maintenance and support`,
          seoKeywords: ["web development", "react", "javascript", "frontend", "backend"],
          order: 1,
          published: true
        });

        // Mobile Development Service
        storageService.addContent({
          title: "Mobile Development",
          type: "Service",
          slug: "mobile-development",
          description: "Build native and cross-platform mobile applications that engage users and drive results",
          content: `Mobile Solutions
- Native iOS app development (Swift, SwiftUI)
- Native Android app development (Kotlin, Jetpack Compose)
- Cross-platform development (React Native, Flutter)
- Progressive Web Apps (PWA)
- Mobile app UI/UX design
- App store optimization (ASO)
- Integration with backend services
- Push notifications and real-time updates

Technical Features
- Offline functionality and data sync
- Location-based services and maps
- Social media integration
- Payment gateway integration
- Real-time messaging and chat
- Analytics and crash reporting
- Biometric authentication
- Cloud storage integration

Development Process
- Market research and competitor analysis
- Wireframing and prototyping
- Native and cross-platform development
- Rigorous testing on multiple devices
- App store submission and optimization
- Post-launch monitoring
- Regular updates and maintenance`,
          seoKeywords: ["mobile development", "ios", "android", "react native", "flutter"],
          order: 2,
          published: true
        });

        // UI/UX Design Service
        storageService.addContent({
          title: "UI/UX Design",
          type: "Service",
          slug: "ui-ux-design",
          description: "Create intuitive, engaging, and user-centered digital experiences that convert",
          content: `Design Services
- User Interface (UI) Design
- User Experience (UX) Design
- Design System Development
- Interactive Prototyping
- User Research and Testing
- Information Architecture
- Responsive Design
- Motion and Interaction Design

Design Process
- User Research and Personas
- Journey Mapping
- Wireframing and Prototyping
- Visual Design and Branding
- Usability Testing
- Design Implementation
- Design System Creation
- Documentation and Guidelines

Tools and Technologies
- Figma, Adobe XD, Sketch
- InVision, Principle
- User Testing Tools
- Analytics Integration
- Accessibility Testing
- Design Version Control
- Collaboration Tools
- Handoff Solutions`,
          seoKeywords: ["ui design", "ux design", "user interface", "user experience"],
          order: 3,
          published: true
        });

        // Digital Marketing Service
        storageService.addContent({
          title: "Digital Marketing",
          type: "Service",
          slug: "digital-marketing",
          description: "Drive growth with data-driven digital marketing strategies and campaigns",
          content: `Marketing Services
- Search Engine Optimization (SEO)
- Pay-Per-Click (PPC) Advertising
- Social Media Marketing
- Content Marketing Strategy
- Email Marketing Campaigns
- Marketing Automation
- Analytics and Reporting
- Conversion Rate Optimization

Strategy Development
- Market Research and Analysis
- Competitor Analysis
- Target Audience Definition
- Campaign Planning
- Content Strategy
- Channel Strategy
- Budget Allocation
- ROI Tracking

Tools and Platforms
- Google Analytics and Tag Manager
- Social Media Management Tools
- Email Marketing Platforms
- SEO Tools and Software
- Ad Campaign Management
- CRM Integration
- Marketing Automation
- Performance Tracking`,
          seoKeywords: ["digital marketing", "seo", "social media", "content marketing"],
          order: 4,
          published: true
        });

        // SEO Services
        storageService.addContent({
          title: "SEO Services",
          type: "Service",
          slug: "seo-services",
          description: "Improve your search rankings and drive organic traffic with comprehensive SEO solutions",
          content: `SEO Strategies
- Technical SEO Optimization
- On-page SEO Implementation
- Off-page SEO and Link Building
- Local SEO Optimization
- Mobile SEO
- Voice Search Optimization
- E-commerce SEO
- International SEO

SEO Process
- Website Audit and Analysis
- Keyword Research and Strategy
- Competitor Analysis
- Content Optimization
- Technical Implementation
- Link Building Campaign
- Performance Monitoring
- Monthly Reporting

Tools and Technologies
- Google Search Console
- SEMrush, Ahrefs, Moz
- Technical SEO Tools
- Content Analysis Tools
- Rank Tracking Software
- Analytics Platforms
- Link Building Tools
- Reporting Dashboards`,
          seoKeywords: ["seo", "search engine optimization", "technical seo", "local seo"],
          order: 5,
          published: true
        });

        // E-commerce Solutions
        storageService.addContent({
          title: "E-commerce Solutions",
          type: "Service",
          slug: "ecommerce-solutions",
          description: "Build and optimize your online store with powerful e-commerce solutions",
          content: `E-commerce Services
- Custom E-commerce Development
- Shopping Cart Implementation
- Payment Gateway Integration
- Inventory Management Systems
- Order Processing Automation
- Multi-channel Integration
- Mobile Commerce Solutions
- B2B E-commerce Platforms

Features and Capabilities
- Product Catalog Management
- Secure Payment Processing
- Order Management System
- Customer Account Portal
- Shipping Integration
- Tax Calculation
- Discount and Coupon System
- Analytics and Reporting

Platforms and Technologies
- Shopify Development
- WooCommerce Integration
- Custom E-commerce Solutions
- Payment Gateways
- Inventory Management
- CRM Integration
- Security Implementation
- Performance Optimization`,
          seoKeywords: ["ecommerce", "online store", "shopify", "woocommerce"],
          order: 6,
          published: true
        });

        // Video Production Service
        storageService.addContent({
          title: "Video Production",
          type: "Service",
          slug: "video-production",
          description: "Create stunning, professional videos that captivate your audience and tell your story",
          content: `Professional Video Services
- Commercial Video Production
- Corporate Video Production
- Brand Story Videos
- Product Demonstrations
- Event Coverage
- Aerial Videography
- Training & Educational Videos
- Social Media Video Content

Production Process
- Pre-production Planning
- Storyboarding & Scripting
- Location Scouting
- Professional Filming
- High-end Equipment Usage
- Professional Lighting
- Sound Recording & Design
- Green Screen Technology

Post-Production Excellence
- Professional Video Editing
- Color Grading & Correction
- Motion Graphics & Animation
- Sound Mixing & Design
- Visual Effects (VFX)
- 4K/HD Resolution Output
- Multi-platform Optimization
- Subtitles & Captions`,
          seoKeywords: ["video production", "commercial videos", "corporate videos", "video editing"],
          order: 7,
          published: true
        });

        // Real Estate Lead Generation Service
        storageService.addContent({
          title: "Real Estate Lead Generation",
          type: "Service",
          slug: "real-estate-leads",
          description: "Transform your real estate business with our premium lead generation solutions designed specifically for real estate professionals",
          content: `Premium Lead Generation
- Qualified Real Estate Buyer Leads
- High-Intent Seller Leads
- Investment Property Opportunities
- Luxury Property Market Leads
- First-time Homebuyer Targeting
- Exclusive Territory Rights
- Real-time Lead Alerts
- Lead Qualification System

Advanced Marketing Strategies
- AI-Powered Lead Targeting
- Custom Landing Pages
- Property Value Campaigns
- Virtual Tour Marketing
- Social Media Marketing
- Google Ads Management
- Facebook Marketing
- Instagram Story Ads

Technology & Implementation
- Custom CRM Integration
- Lead Scoring System
- Automated Follow-up
- SMS & Email Automation
- Analytics Dashboard
- Lead Activity Tracking
- ROI Reporting
- Market Analysis Tools

Client Success Program
- Dedicated Success Manager
- Weekly Performance Reviews
- Strategy Optimization
- Competition Analysis
- Market Trend Reports
- Training & Support
- Best Practices Guide
- ROI Maximization Plan

Additional Features
- Virtual Property Tours
- Professional Photography
- Drone Videography
- Property Websites
- Email Marketing
- Retargeting Campaigns
- Neighborhood Guides
- Market Reports`,
          seoKeywords: ["real estate leads", "lead generation", "property marketing", "real estate marketing"],
          order: 8,
          published: true
        });
      }
    };
    
    addExampleServicesIfEmpty();
    
    // Add fade-in animation to elements with the fade-in-element class
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
    document.title = `${t('services.title')} | Trojan Envoy`;

    return () => observer.disconnect();
  }, [t]);

  return (
    <div className="min-h-screen relative overflow-hidden" ref={servicesRef}>
      {/* Background particles and gradient effects */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-b from-background/40 via-primary/5 to-background/80 z-0"
        style={{ opacity: backgroundOpacity, y: backgroundY }}
      />
      
      {/* Animated floating shapes */}
      <motion.div 
        className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-primary/5 blur-[80px] -z-10"
        animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-purple-500/5 blur-[80px] -z-10"
        animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <Header />
      
      <main>
        <ServicesHero />
        <ServicesList />
        <ServicesCTA />
      </main>
      
      <Footer />
      
      {/* Floating technology icons */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          className="absolute top-[25%] left-[10%] text-primary/10 opacity-20"
          animate={{ 
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <FaReact size={100} />
        </motion.div>
        
        <motion.div 
          className="absolute top-[75%] right-[15%] text-primary/10 opacity-20"
          animate={{ 
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <FaNodeJs size={80} />
        </motion.div>
        
        <motion.div 
          className="absolute top-[50%] right-[5%] text-primary/10 opacity-20"
          animate={{ 
            x: [0, -50, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <FaMobileAlt size={70} />
        </motion.div>
        
        <motion.div 
          className="absolute top-[15%] right-[25%] text-primary/10 opacity-20"
          animate={{ 
            y: [0, 70, 0],
            x: [0, -30, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <FaLaptopCode size={90} />
        </motion.div>
        
        <motion.div 
          className="absolute top-[60%] left-[20%] text-primary/10 opacity-20"
          animate={{ 
            y: [0, -40, 0],
            x: [0, 30, 0],
            rotate: [0, 120, 0]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <Globe size={85} />
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
