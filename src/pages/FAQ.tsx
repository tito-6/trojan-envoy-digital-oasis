import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { 
  Search, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight,
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Star, 
  Code, 
  Globe, 
  LineChart, 
  Bot, 
  Laptop, 
  Smartphone,
  Target,
  Share2,
  Layout,
  Database,
  FileCode,
  Zap,
  Settings,
  Lock,
  Clock,
  Users,
  DollarSign,
  Award
} from "lucide-react";

// Types for FAQ items
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
  expert?: {
    name: string;
    role: string;
    avatar?: string;
  };
  resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'guide';
  }>;
  tags?: string[];
  rating?: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
  subcategories?: Array<{
    id: string;
    name: string;
  }>;
}

// Custom highlight text component
const HighlightText = ({ children, className = "" }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 font-medium ${className}`}>
    {children}
  </span>
);

// Custom highlight box for important content
const HighlightBox = ({ children, icon: Icon, color = "primary" }) => (
  <div className={`mt-4 mb-4 p-4 rounded-lg border border-${color}/20 bg-${color}/5 relative overflow-hidden`}>
    <div className="absolute -top-6 -right-6 opacity-10">
      <Icon size={80} />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Animated counter component
const AnimatedCounter = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.toString(), 10);
      const increment = end / (duration * 60); // 60fps
      const timer = setInterval(() => {
        start += increment;
        setCount(Math.floor(start));
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    }
  }, [value, duration, isInView]);
  
  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
};

// Custom animated accordion trigger
const AnimatedAccordionTrigger = ({ children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <AccordionTrigger 
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group py-6 text-left font-medium text-lg flex relative overflow-hidden"
    >
      <div className="flex-1 flex items-center gap-3">
        {children}
      </div>
      <div className="relative">
        <motion.div
          animate={{ rotate: props["data-state"] === "open" ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform duration-300" />
        </motion.div>
        {isHovered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute inset-0 bg-primary/10 rounded-full"
            style={{ zIndex: -1 }}
          />
        )}
      </div>
    </AccordionTrigger>
  );
};

// FAQ page component
const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);

  // References for animations
  const heroRef = useRef(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Handle confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "FAQ | Trojan Envoy - The Ultimate Digital Knowledge Base";
    
    // Show a welcome toast
    toast({
      title: "Welcome to our Knowledge Hub!",
      description: "Discover answers to the most pressing digital questions",
      duration: 5000,
    });
  }, [toast]);

  // Toggle FAQ expanded state
  const toggleFAQ = (id: string) => {
    setExpandedFAQs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Categories with icons
  const categories: Category[] = [
    { 
      id: "all", 
      name: "All Questions", 
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Browse our complete knowledge base of frequently asked questions"
    },
    { 
      id: "digital-marketing", 
      name: "Digital Marketing", 
      icon: <Target className="h-5 w-5" />,
      color: "green",
      description: "Learn about SEO, social media, content marketing and paid advertising",
      subcategories: [
        { id: "seo", name: "SEO" },
        { id: "social-media", name: "Social Media" },
        { id: "content", name: "Content Marketing" },
        { id: "ppc", name: "Paid Advertising" }
      ]
    },
    { 
      id: "web-development", 
      name: "Web Development", 
      icon: <Code className="h-5 w-5" />,
      color: "blue",
      description: "Discover insights about frontend, backend, frameworks and hosting",
      subcategories: [
        { id: "frontend", name: "Frontend" },
        { id: "backend", name: "Backend" },
        { id: "frameworks", name: "Frameworks" },
        { id: "hosting", name: "Hosting" }
      ]
    },
    { 
      id: "ai", 
      name: "Artificial Intelligence", 
      icon: <Bot className="h-5 w-5" />,
      color: "purple",
      description: "Explore AI technologies, machine learning, and implementation strategies",
      subcategories: [
        { id: "machine-learning", name: "Machine Learning" },
        { id: "nlp", name: "Natural Language Processing" },
        { id: "ai-implementation", name: "AI Implementation" }
      ]
    },
    { 
      id: "mobile-dev", 
      name: "Mobile Development", 
      icon: <Smartphone className="h-5 w-5" />,
      color: "orange",
      description: "Get answers about native, cross-platform, and progressive web apps",
      subcategories: [
        { id: "native", name: "Native Apps" },
        { id: "cross-platform", name: "Cross Platform" },
        { id: "pwa", name: "Progressive Web Apps" }
      ]
    },
    { 
      id: "ux-design", 
      name: "UX/UI Design", 
      icon: <Layout className="h-5 w-5" />,
      color: "pink",
      description: "Understanding user experience, interface design and accessibility",
      subcategories: [
        { id: "user-research", name: "User Research" },
        { id: "ui-design", name: "UI Design" },
        { id: "accessibility", name: "Accessibility" }
      ]
    },
    { 
      id: "data", 
      name: "Data & Analytics", 
      icon: <LineChart className="h-5 w-5" />,
      color: "cyan",
      description: "Insights on data management, analytics and visualization",
      subcategories: [
        { id: "big-data", name: "Big Data" },
        { id: "analytics", name: "Analytics" },
        { id: "visualization", name: "Data Visualization" }
      ]
    }
  ];

  // Comprehensive FAQ items covering digital marketing, web development, and AI
  const faqs: FAQItem[] = [
    // Digital Marketing - SEO
    {
      id: "seo-importance",
      question: "Why is SEO important for my business website?",
      answer: "SEO (Search Engine Optimization) is crucial because it increases your website's visibility in search engine results, driving organic traffic without paid advertising. Properly optimized websites rank higher, building credibility and trust with potential customers. SEO also improves user experience and provides valuable insights into customer behavior. With 68% of online experiences beginning with a search engine and 75% of users never scrolling past the first page of results, SEO is essential for staying competitive in today's digital landscape.",
      category: "digital-marketing",
      subcategory: "seo",
      featured: true,
      tags: ["seo", "business growth", "website traffic"],
      rating: 4.9
    },
    {
      id: "seo-strategies",
      question: "What are the most effective SEO strategies in 2025?",
      answer: "The most effective SEO strategies in 2025 include: 1) AI-optimized content that addresses search intent while maintaining E-E-A-T principles (Experience, Expertise, Authoritativeness, Trustworthiness); 2) Voice search optimization for conversational queries; 3) Mobile-first indexing compliance; 4) Core Web Vitals optimization for page experience signals; 5) Schema markup implementation for enhanced SERP features; 6) Video content optimization as search engines increasingly prioritize video results; 7) Focus on topical authority rather than just individual keywords; and 8) Ethical link building through genuine relationship development and content partnerships.",
      category: "digital-marketing",
      subcategory: "seo",
      tags: ["seo", "trends", "optimization"],
      rating: 4.8,
      resources: [
        {
          title: "Complete Core Web Vitals Guide",
          url: "#",
          type: "guide"
        },
        {
          title: "Schema Markup Implementation",
          url: "#",
          type: "video"
        }
      ]
    },
    {
      id: "social-media-strategy",
      question: "How do I create an effective social media marketing strategy?",
      answer: "Creating an effective social media marketing strategy involves several key steps: 1) Define clear goals aligned with business objectives (brand awareness, lead generation, customer service); 2) Research your audience demographics, interests, and behaviors on each platform; 3) Analyze competitors to identify opportunities and differentiation points; 4) Select appropriate platforms based on audience presence and content format suitability; 5) Develop a content calendar with a mix of promotional, educational, and engagement content; 6) Establish brand voice and visual identity guidelines; 7) Implement a consistent posting schedule; 8) Allocate budget for paid promotion of high-performing content; 9) Monitor analytics and adjust strategy based on performance data; and 10) Stay adaptive to platform algorithm changes and emerging trends.",
      category: "digital-marketing",
      subcategory: "social-media",
      featured: true,
      tags: ["social media", "marketing strategy", "content planning"],
      rating: 4.7
    },
    {
      id: "content-marketing-roi",
      question: "How can I measure the ROI of content marketing?",
      answer: "Measuring content marketing ROI requires tracking both costs and returns. Start by calculating total investment (content creation, distribution, promotion, tools, and team time). Then track performance metrics aligned with your goals: for brand awareness, measure impressions, reach, and social engagement; for lead generation, track form completions, downloads, and email sign-ups; for sales impact, monitor attributed conversions and revenue. Use UTM parameters, conversion tracking, and attribution models in analytics platforms. Calculate ROI with the formula: ((Return - Investment) / Investment) × 100. Beyond direct ROI, consider long-term benefits like audience building, SEO improvements, and content repurposing value.",
      category: "digital-marketing",
      subcategory: "content",
      tags: ["content marketing", "roi", "metrics"],
      rating: 4.5
    },
    {
      id: "ppc-campaign",
      question: "How do I optimize my PPC campaigns for better conversion rates?",
      answer: "To optimize PPC campaigns for better conversion rates: 1) Implement granular keyword targeting with negative keywords to prevent wasted spend; 2) Create highly relevant ad groups with 3-5 closely related keywords each; 3) Write compelling ad copy that aligns with search intent and includes strong CTAs; 4) Design conversion-focused landing pages with clear value propositions and minimal friction; 5) Implement A/B testing for ad elements and landing pages; 6) Leverage ad extensions to increase visibility and provide additional information; 7) Use audience targeting and remarketing to reach high-intent users; 8) Optimize bid strategies based on device, location, time, and audience performance; 9) Implement conversion tracking with appropriate attribution models; and 10) Continuously monitor quality scores and work to improve them through relevance and landing page experience optimizations.",
      category: "digital-marketing",
      subcategory: "ppc",
      tags: ["ppc", "google ads", "conversion optimization"],
      rating: 4.6,
      expert: {
        name: "Sarah Johnson",
        role: "PPC Specialist"
      }
    },
    
    // Web Development
    {
      id: "frontend-frameworks",
      question: "Which frontend framework should I choose for my project?",
      answer: "Choosing the right frontend framework depends on your project requirements, team expertise, and business goals. React is ideal for complex, dynamic applications with its component-based architecture and vast ecosystem. Vue offers a gentle learning curve and excellent documentation, making it perfect for smaller teams or projects needing rapid development. Angular provides a comprehensive solution with strong typing and enterprise-level features, suitable for large-scale applications. Next.js (React) and Nuxt.js (Vue) are excellent choices for SEO-friendly sites needing server-side rendering. For simpler projects, consider lightweight alternatives like Svelte or Alpine.js. Evaluate your specific needs regarding performance requirements, team expertise, community support, and long-term maintenance before making your decision.",
      category: "web-development",
      subcategory: "frontend",
      featured: true,
      tags: ["react", "vue", "angular", "frontend development"],
      rating: 4.9
    },
    {
      id: "api-design",
      question: "What are the best practices for designing RESTful APIs?",
      answer: "Best practices for RESTful API design include: 1) Use nouns, not verbs in endpoints (e.g., /articles instead of /getArticles); 2) Implement proper HTTP methods (GET, POST, PUT, DELETE) for CRUD operations; 3) Use nested resources for relationships (e.g., /articles/1/comments); 4) Implement consistent error handling with appropriate status codes and informative messages; 5) Version your API (via URL path, header, or parameter); 6) Implement pagination for large data sets; 7) Support filtering, sorting, and searching with query parameters; 8) Use JSON as the primary representation format; 9) Implement proper authentication and authorization; 10) Design with idempotence in mind for PUT and DELETE operations; 11) Provide comprehensive documentation; and 12) Follow HATEOAS principles by including links to related resources in responses.",
      category: "web-development",
      subcategory: "backend",
      tags: ["api", "rest", "backend development"],
      rating: 4.7,
      resources: [
        {
          title: "Complete RESTful API Guide",
          url: "#",
          type: "guide"
        },
        {
          title: "API Security Best Practices",
          url: "#",
          type: "article"
        }
      ]
    },
    {
      id: "react-performance",
      question: "How can I improve performance in my React application?",
      answer: "To improve React application performance: 1) Implement code splitting using React.lazy() and Suspense to reduce initial bundle size; 2) Memoize expensive computations with useMemo and optimize re-renders with React.memo and useCallback; 3) Virtualize long lists with react-window or react-virtualized; 4) Implement proper state management strategies, considering local state vs. global state needs; 5) Optimize images and other assets with proper formats, compression, and lazy loading; 6) Use the Chrome Performance tab and React Profiler to identify bottlenecks; 7) Implement webpack bundle analysis to identify and reduce large dependencies; 8) Consider server-side rendering or static site generation for improved initial load; 9) Optimize CSS with critical path rendering and reduced specificity; and 10) Implement proper caching strategies for API responses and static assets.",
      category: "web-development",
      subcategory: "frameworks",
      featured: true,
      tags: ["react", "performance optimization", "javascript"],
      rating: 4.8
    },
    {
      id: "cloud-hosting",
      question: "Which cloud hosting solution is best for scalable web applications?",
      answer: "For scalable web applications, AWS, Azure, and Google Cloud Platform offer comprehensive solutions with different strengths. AWS provides the most mature ecosystem with extensive services and global reach, making it ideal for complex architectures. Azure integrates seamlessly with Microsoft products and offers robust enterprise features. GCP excels in data analytics, machine learning, and container orchestration with Kubernetes. For simpler deployments, consider specialized PaaS options like Vercel or Netlify for frontend applications, Heroku for quick deployments with less infrastructure management, or DigitalOcean for cost-effective VPS solutions. When choosing, consider factors like specific service requirements, technical expertise, budget constraints, compliance needs, and existing technology stack compatibility.",
      category: "web-development",
      subcategory: "hosting",
      tags: ["cloud hosting", "aws", "azure", "gcp"],
      rating: 4.6,
      expert: {
        name: "Michael Chen",
        role: "DevOps Engineer"
      }
    },
    
    // AI
    {
      id: "ai-business-implementation",
      question: "How can my business start implementing AI solutions?",
      answer: "To implement AI in your business: 1) Identify specific problems where AI can add value rather than adopting AI for its own sake; 2) Start with small, focused projects that can demonstrate ROI quickly; 3) Assess your data quality and quantity—AI systems need substantial, clean data to function effectively; 4) Consider pre-built AI solutions and APIs from providers like Google, AWS, or Microsoft before building custom solutions; 5) Build cross-functional teams with both technical and domain expertise; 6) Establish clear metrics for success and evaluation procedures; 7) Plan for the ethical implications and potential biases in AI systems; 8) Develop a governance framework for AI deployment and monitoring; 9) Invest in upskilling your workforce to work alongside AI systems; and 10) Prepare for iterative improvement as both AI technology and your implementation strategy mature.",
      category: "ai",
      subcategory: "ai-implementation",
      featured: true,
      tags: ["ai implementation", "business strategy", "digital transformation"],
      rating: 4.9
    },
    {
      id: "machine-learning-models",
      question: "Which machine learning model should I use for my specific use case?",
      answer: "Choosing the right machine learning model depends on your specific use case: For classification problems, consider Logistic Regression for simple binary outcomes, Random Forests for balanced performance and interpretability, or Support Vector Machines for complex decision boundaries with smaller datasets. For regression tasks, Linear Regression works for simple relationships, while Gradient Boosting shines with complex numerical predictions. Deep Learning is optimal for image recognition, natural language processing, and time series with large datasets, though it requires more computational resources and data. Clustering benefits from K-means for simple groupings or DBSCAN for irregularly shaped clusters. Always start with simpler models as baselines before moving to more complex ones, and validate with appropriate metrics for your specific problem domain.",
      category: "ai",
      subcategory: "machine-learning",
      tags: ["machine learning", "model selection", "data science"],
      rating: 4.7
    },
    {
      id: "nlp-applications",
      question: "What are practical applications of NLP in business?",
      answer: "Natural Language Processing (NLP) has numerous practical business applications: 1) Customer service chatbots and virtual assistants that understand and respond to customer queries in natural language; 2) Sentiment analysis to monitor social media, reviews, and customer feedback for brand perception insights; 3) Email categorization and prioritization to improve workflow efficiency; 4) Document analysis and information extraction to automatically process contracts, reports, and forms; 5) Content recommendation systems that understand user preferences; 6) Machine translation for global business communications and content localization; 7) Voice-to-text transcription for meetings and calls; 8) Resume parsing and candidate matching for HR departments; 9) Compliance monitoring to flag potentially problematic language in communications; and 10) Market intelligence through automated analysis of news, reports, and competitor communications.",
      category: "ai",
      subcategory: "nlp",
      featured: true,
      tags: ["nlp", "natural language processing", "business applications"],
      rating: 4.8
    },
    
    // Mobile Development
    {
      id: "native-vs-cross-platform",
      question: "Should I build a native app or use a cross-platform framework?",
      answer: "When deciding between native and cross-platform development, consider these factors: Native development (Swift/Kotlin) offers optimal performance, full access to platform features, better user experience alignment with platform guidelines, and superior performance for graphics-intensive apps. However, it requires platform-specific expertise and separate codebases. Cross-platform frameworks like React Native or Flutter provide faster development with a single codebase, cost efficiency, easier maintenance, and quicker time-to-market. Their performance gap has narrowed significantly but may still struggle with highly specialized device features. Choose native for performance-critical applications, platform-specific experiences, or long-term consumer products. Opt for cross-platform when working with limited resources, tight deadlines, MVP development, or content-focused applications where slight performance differences are less noticeable.",
      category: "mobile-dev",
      subcategory: "cross-platform",
      featured: true,
      tags: ["mobile development", "react native", "flutter", "native development"],
      rating: 4.8
    },
    {
      id: "pwa-benefits",
      question: "What are the benefits of Progressive Web Apps (PWAs)?",
      answer: "Progressive Web Apps (PWAs) offer significant benefits: 1) Cross-platform compatibility—function across devices and operating systems with a single codebase; 2) Offline functionality through service workers and caching; 3) App-like experience with full-screen mode and home screen installation without app store approval processes; 4) Significantly smaller size compared to native apps; 5) No need for updates through app stores; 6) Improved performance with faster load times through caching strategies; 7) Better discoverability through search engines; 8) Higher conversion rates due to reduced friction in the user journey; 9) Lower development and maintenance costs compared to maintaining multiple native apps; and 10) Push notification capabilities on supported browsers. PWAs are ideal for content-focused applications, e-commerce sites, and businesses looking to provide app-like experiences without the development overhead of native applications.",
      category: "mobile-dev",
      subcategory: "pwa",
      tags: ["pwa", "web development", "mobile experience"],
      rating: 4.6
    },
    
    // UX/UI Design
    {
      id: "ux-research-methods",
      question: "What are the most effective UX research methods for product development?",
      answer: "Effective UX research methods for product development include: 1) User interviews for deep qualitative insights into behaviors, needs, and pain points; 2) Usability testing to identify interaction problems through direct observation; 3) Card sorting for understanding how users organize information and expect navigation structures; 4) Surveys for collecting quantitative data from larger user samples; 5) Analytics review to understand actual usage patterns; 6) A/B testing for comparing design variations with real users; 7) Contextual inquiry—observing users in their natural environment; 8) Journey mapping to visualize the entire user experience process; 9) Prototype testing to validate concepts before full development; and 10) Heuristic evaluation against established usability principles. The most successful approach combines multiple methods for both qualitative and quantitative insights at appropriate development stages, from discovery research to post-launch validation.",
      category: "ux-design",
      subcategory: "user-research",
      featured: true,
      tags: ["ux research", "user testing", "product development"],
      rating: 4.8
    },
    {
      id: "accessibility-principles",
      question: "What are the key principles of web accessibility?",
      answer: "Key web accessibility principles include: 1) Perceivability—information must be presentable in ways all users can perceive, including text alternatives for non-text content, captions for multimedia, and adaptable content presentation; 2) Operability—interface components must be navigable and usable by all users, including full keyboard accessibility, sufficient time to read content, and avoiding content that could cause seizures; 3) Understandability—information and interface operation must be comprehensible, with readable text, predictable functionality, and input assistance; 4) Robustness—content must be robust enough to be interpreted reliably by various user agents, including assistive technologies, through clean, compliant code. Following WCAG (Web Content Accessibility Guidelines) standards at level AA compliance addresses most accessibility requirements. Remember that accessibility benefits all users, not just those with permanent disabilities, and is increasingly a legal requirement in many jurisdictions.",
      category: "ux-design",
      subcategory: "accessibility",
      tags: ["accessibility", "wcag", "inclusive design"],
      rating: 4.9
    },
    
    // Data & Analytics
    {
      id: "data-visualization-best-practices",
      question: "What are the best practices for effective data visualization?",
      answer: "Effective data visualization follows these best practices: 1) Start with a clear purpose and know your audience's needs; 2) Choose the appropriate chart type for your data relationship (bar charts for comparisons, line charts for trends, scatter plots for correlations); 3) Simplify and avoid chart junk—remove excessive gridlines, decorations, and 3D effects; 4) Use color purposefully and consistently, ensuring accessibility for colorblind users; 5) Sort data meaningfully to highlight patterns; 6) Provide proper context with clear titles, labels, and annotations; 7) Maintain appropriate scale in axes to avoid distortion; 8) Enable interaction for complex datasets to allow exploration; 9) Consider progressive disclosure for complex information—reveal details on demand; and 10) Test visualizations with actual users to ensure comprehension. Remember that the goal is insight communication, not decoration—every element should serve the purpose of making the data more understandable.",
      category: "data",
      subcategory: "visualization",
      featured: true,
      tags: ["data visualization", "dashboards", "business intelligence"],
      rating: 4.7,
      expert: {
        name: "Elena Rodriguez",
        role: "Data Visualization Specialist"
      }
    },
    {
      id: "big-data-architecture",
      question: "How should I architect a big data solution for my enterprise?",
      answer: "Architecting a big data solution requires addressing several key components: 1) Data ingestion—implement batch and/or streaming ingestion pipelines based on data volume, velocity requirements, and sources; 2) Storage—select appropriate storage systems (data lakes using S3/ADLS, data warehouses like Snowflake/BigQuery, or NoSQL databases) based on structured vs. unstructured needs; 3) Processing—choose frameworks like Spark for batch processing or Kafka/Flink for real-time streaming; 4) Analysis—implement data processing workflows with appropriate tools for machine learning, SQL analytics, or specialized processing; 5) Visualization—select BI tools aligned with user technical expertise; 6) Management—implement data governance, security controls, and metadata management; 7) Infrastructure—decide between cloud-native services, on-premises, or hybrid approaches. Start with a minimum viable architecture addressing immediate business needs, then evolve iteratively while maintaining flexibility through decoupled components and standardized interfaces between systems.",
      category: "data",
      subcategory: "big-data",
      tags: ["big data", "data architecture", "enterprise solutions"],
      rating: 4.6
    }
  ];

  // Get subcategories for the active category
  const activeSubcategories = categories.find(cat => cat.id === activeCategory)?.subcategories || [];

  // Filter FAQs based on search query, category, subcategory, and featured status
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery ? 
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
       faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) : true;
    
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSubcategory = !activeSubcategory || faq.subcategory === activeSubcategory;
    const matchesFeatured = showFeaturedOnly ? !!faq.featured : true;
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesFeatured;
  });

  // Sort FAQs by rating if needed
  const sortedFaqs = sortByRating 
    ? [...filteredFaqs].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : filteredFaqs;

  // Scroll to search when category changes
  useEffect(() => {
    if (searchRef.current && activeCategory !== "all") {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeCategory]);

  // Count FAQs by category for display
  const faqCountsByCategory = categories.reduce((acc, category) => {
    if (category.id === "all") {
      acc[category.id] = faqs.length;
    } else {
      acc[category.id] = faqs.filter(faq => faq.category === category.id).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      <main className="pt-16 pb-20 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          
          {/* Animated particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary/10 rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.2, 0],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      
        {/* Hero Section with Parallax effect */}
        <motion.section 
          ref={heroRef}
          className="pt-32 pb-20 relative overflow-hidden"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center max-w-4xl mx-auto relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <HelpCircle size={16} />
                <span>Knowledge Base</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Frequently Asked Questions
                </span>
                <motion.span
                  className="absolute -top-6 -right-10 text-primary"
                  animate={{
                    rotate: [0, 20, 0, -20, 0],
                    scale: [1, 1.2, 1, 1.2, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Discover expert answers to the most common questions about
                <HighlightText> digital marketing</HighlightText>,
                <HighlightText> web development</HighlightText>, and
                <HighlightText> artificial intelligence</HighlightText>.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <HelpCircle className="text-primary w-5 h-5" />
                  <span className="font-medium"><AnimatedCounter value={faqs.length} />+ Questions</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <FileCode className="text-primary w-5 h-5" />
                  <span className="font-medium"><AnimatedCounter value={categories.length - 1} />+ Categories</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                  <Star className="text-primary w-5 h-5" />
                  <span className="font-medium"><AnimatedCounter value={faqs.filter(f => f.featured).length} />+ Featured Answers</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Curved divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[60px] w-full">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
            </svg>
          </div>
        </motion.section>
        
        {/* Categories tabs and search section */}
        <section ref={searchRef} className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto mb-12">
              {/* Search bar with animation */}
              <motion.div 
                className="relative mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="max-w-3xl mx-auto relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for answers, keywords, or topics..."
                    className="pl-12 py-6 h-auto text-lg rounded-xl shadow-lg border-primary/20 focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                      ⌘K
                    </kbd>
                  </div>
                </div>
                
                {/* Search filters */}
                <div className="flex justify-center flex-wrap gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 rounded-full ${showFeaturedOnly ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  >
                    <Star className={`h-4 w-4 ${showFeaturedOnly ? 'fill-primary-foreground' : ''}`} />
                    Featured Only
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 rounded-full ${sortByRating ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setSortByRating(!sortByRating)}
                  >
                    <Award className="h-4 w-4" />
                    Top Rated
                  </Button>
                </div>
              </motion.div>
              
              {/* Categories */}
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <motion.div 
                  className="flex items-center justify-center mb-8 overflow-x-auto pb-2 scrollbar-none"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <TabsList className="h-auto p-1 rounded-full">
                    {categories.map(category => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="relative data-[state=active]:text-primary-foreground px-4 py-2 rounded-full gap-2 transition-all duration-300"
                      >
                        <span className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.name}</span>
                          <span className="inline-flex items-center justify-center h-5 px-2 rounded-full bg-background/20 text-xs">
                            {faqCountsByCategory[category.id]}
                          </span>
                        </span>
                        {activeCategory === category.id && (
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full -z-10"
                            layoutId="activeCategoryBackground"
                            transition={{ type: "spring", duration: 0.5 }}
                          />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </motion.div>
                
                {/* Subcategories */}
                {activeSubcategories.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2 justify-center mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full ${!activeSubcategory ? 'bg-secondary/50' : ''}`}
                      onClick={() => setActiveSubcategory(null)}
                    >
                      All Topics
                    </Button>
                    {activeSubcategories.map(subcat => (
                      <Button
                        key={subcat.id}
                        variant="outline"
                        size="sm"
                        className={`rounded-full ${activeSubcategory === subcat.id ? 'bg-secondary/50' : ''}`}
                        onClick={() => setActiveSubcategory(subcat.id)}
                      >
                        {subcat.name}
                      </Button>
                    ))}
                  </motion.div>
                )}
                
                {/* Category description */}
                {activeCategory !== "all" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-10"
                  >
                    <p className="text-muted-foreground">
                      {categories.find(c => c.id === activeCategory)?.description}
                    </p>
                  </motion.div>
                )}

                {/* FAQs section */}
                <div className="max-w-4xl mx-auto">
                  {sortedFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {sortedFaqs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <AccordionItem 
                            value={faq.id} 
                            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          >
                            <AnimatedAccordionTrigger onClick={() => toggleFAQ(faq.id)} data-state={expandedFAQs.includes(faq.id) ? "open" : "closed"}>
                              <div className="flex items-start">
                                <div className="mr-4 flex-shrink-0 mt-1">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${faq.featured ? 'bg-primary/20 text-primary' : 'bg-secondary/50 text-foreground'}`}>
                                    <QuestionIcon category={faq.category} />
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-base md:text-lg font-medium">{faq.question}</h3>
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {faq.featured && (
                                      <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2 rounded-full bg-primary/10 text-primary">
                                        <Star className="w-3 h-3 fill-primary" />
                                        Featured
                                      </span>
                                    )}
                                    {faq.rating && (
                                      <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                                        <Star className="w-3 h-3 fill-yellow-500" />
                                        {faq.rating.toFixed(1)}
                                      </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-xs py-0.5 px-2 rounded-full bg-secondary/50">
                                      {getCategoryIcon(faq.category)}
                                      {getCategoryName(faq.category, categories)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </AnimatedAccordionTrigger>
                            <AccordionContent className="text-foreground/90 pt-2 pb-6">
                              <div className="pl-12 pr-4">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  {/* Format the answer with highlighted terms */}
                                  {formatAnswer(faq.answer)}
                                </div>
                                
                                {/* Expert attribution if available */}
                                {faq.expert && (
                                  <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                      <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{faq.expert.name}</p>
                                      <p className="text-xs text-muted-foreground">{faq.expert.role}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Additional resources */}
                                {faq.resources && faq.resources.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                                      Additional Resources
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {faq.resources.map((resource, i) => (
                                        <a 
                                          key={i}
                                          href={resource.url}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                                          target="_blank"
                                          rel="noreferrer noopener"
                                        >
                                          {resource.type === 'video' ? (
                                            <Video className="w-3.5 h-3.5" />
                                          ) : resource.type === 'guide' ? (
                                            <FileCode className="w-3.5 h-3.5" />
                                          ) : (
                                            <File className="w-3.5 h-3.5" />
                                          )}
                                          {resource.title}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Tags */}
                                {faq.tags && (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {faq.tags.map((tag, i) => (
                                      <span 
                                        key={i}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary/30"
                                        onClick={() => setSearchQuery(tag)}
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Helpfulness feedback */}
                                <div className="mt-6 flex items-center justify-between">
                                  <div className="text-sm text-muted-foreground">
                                    Was this answer helpful?
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8"
                                      onClick={() => {
                                        toast({
                                          description: "Thanks for your feedback! We're glad this was helpful.",
                                        });
                                        triggerConfetti();
                                      }}
                                    >
                                      <ThumbsUp className="w-3.5 h-3.5 mr-1" /> Yes
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8"
                                      onClick={() => {
                                        toast({
                                          description: "Thanks for your feedback. We'll work on improving this answer.",
                                        });
                                      }}
                                    >
                                      <ThumbsDown className="w-3.5 h-3.5 mr-1" /> No
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  ) : (
                    <motion.div 
                      className="text-center py-16 bg-card border border-border rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">No matching questions found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search term or category filter
                      </p>
                      <Button 
                        onClick={() => {
                          setSearchQuery('');
                          setActiveCategory('all');
                          setActiveSubcategory(null);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </motion.div>
                  )}
                </div>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Topic cards section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Explore Topics By Category
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dive into our comprehensive knowledge base organized by specific areas of expertise
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {categories.filter(cat => cat.id !== "all").map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/60 hover:border-primary/40 transition-colors group">
                    <div className={`bg-${category.color || 'primary'}/10 p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-${category.color || 'primary'}/20 flex items-center justify-center text-${category.color || 'primary'}`}>
                          {category.icon}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {faqCountsByCategory[category.id]} Questions
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                    <CardContent className="p-6">
                      {category.subcategories && (
                        <div className="space-y-3">
                          {category.subcategories.map(subcat => (
                            <button
                              key={subcat.id}
                              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/80 transition-colors text-left"
                              onClick={() => {
                                setActiveCategory(category.id);
                                setActiveSubcategory(subcat.id);
                                searchRef.current?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              <span>{subcat.name}</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          ))}
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4 gap-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                        onClick={() => {
                          setActiveCategory(category.id);
                          setActiveSubcategory(null);
                          searchRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
            
        {/* Contact CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute h-full right-0 text-primary opacity-[0.02]" width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_501_1520)">
                    <path d="M1200 0H0V1200H1200V0Z" fill="currentColor"/>
                    <path d="M1200 0H0V1200H1200V0Z" fill="url(#paint0_radial_501_1520)"/>
                  </g>
                  <defs>
                    <radialGradient id="paint0_radial_501_1520" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 600) rotate(90) scale(600)">
                      <stop offset="0.5" stopColor="currentColor" stopOpacity="0.25"/>
                      <stop offset="1" stopColor="currentColor" stopOpacity="0"/>
                    </radialGradient>
                    <clipPath id="clip0_501_1520">
                      <rect width="1200" height="1200" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              
              <div className="relative p-10 md:p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Still Have Questions?
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our team of experts is ready to provide personalized answers to your specific questions. 
                  Don't hesitate to reach out for a consultation.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact">
                    <Button size="lg" className="gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Contact Our Team
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <Link to="/services">
                      <Zap className="w-5 h-5" />
                      Explore Our Services
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper functions
const getCategoryName = (categoryId: string, categories: Category[]) => {
  const foundCategory = categories.find(c => c.id === categoryId);
  return foundCategory ? foundCategory.name : categoryId;
};

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "digital-marketing":
      return <Target className="w-3 h-3" />;
    case "web-development":
      return <Code className="w-3 h-3" />;
    case "ai":
      return <Bot className="w-3 h-3" />;
    case "mobile-dev":
      return <Smartphone className="w-3 h-3" />;
    case "ux-design":
      return <Layout className="w-3 h-3" />;
    case "data":
      return <LineChart className="w-3 h-3" />;
    default:
      return <HelpCircle className="w-3 h-3" />;
  }
};

const QuestionIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "digital-marketing":
      return <Target className="w-4 h-4" />;
    case "web-development":
      return <Code className="w-4 h-4" />;
    case "ai":
      return <Bot className="w-4 h-4" />;
    case "mobile-dev":
      return <Smartphone className="w-4 h-4" />;
    case "ux-design":
      return <Layout className="w-4 h-4" />;
    case "data":
      return <LineChart className="w-4 h-4" />;
    default:
      return <HelpCircle className="w-4 h-4" />;
  }
};

const formatAnswer = (answer: string) => {
  // Split paragraphs and format them
  return answer.split(/(?:\r?\n)+/).map((paragraph, i) => (
    <p key={i} className="mb-4">
      {paragraph}
    </p>
  ));
};

// Add missing Lucide icons
const ThumbsUp = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const ThumbsDown = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
);

const File = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

const Video = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

export default FAQ;
