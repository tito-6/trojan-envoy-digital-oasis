// Waiting List Page Component
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, ArrowRight, ChevronRight, CheckCircle, Target, CupSoda, CalendarDays,
  Gauge, Bot, FileSearch, BarChart, LineChart, Lock, Shield, Layers, 
  Star, Zap, LightbulbIcon, Clock, Users, HeartHandshake
} from "lucide-react";

// Animated number counter
const Counter = ({ from, to, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);

  useEffect(() => {
    let start = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

// AI Tool Card with more detailed information
const ToolDetailCard = ({ 
  title, 
  description, 
  icon: Icon, 
  features = [], 
  releaseDate,
  progress = 75,
  accentColor = "from-blue-500 to-purple-600",
  metrics = []
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const currentElement = document.getElementById(`tool-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [title]);

  return (
    <div 
      id={`tool-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="overflow-hidden border-0 shadow-lg">
          <div 
            className="absolute inset-0 bg-gradient-to-br opacity-10"
            style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }}
          />
          
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div 
                  className="mb-3 w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center text-white"
                  style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-display">{title}</CardTitle>
                <CardDescription className="mt-2 text-base">{description}</CardDescription>
              </div>
              
              <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-1 pl-3 pr-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">{releaseDate}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Development Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-base">Development Progress</Label>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})`,
                    width: `${progress}%` 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            
            {/* Key Features */}
            <div>
              <Label className="text-base">Key Features</Label>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Key Metrics */}
            <div>
              <Label className="text-base">Key Metrics & Benefits</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {metrics.map((metric, idx) => (
                  <Card key={idx} className="border-0 bg-muted/50">
                    <CardContent className="p-3 text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-br ${accentColor}`}>
                        {metric.icon}
                      </div>
                      <div className="text-xl font-bold">{metric.value}</div>
                      <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Preview Video or Image */}
            <div className="rounded-xl overflow-hidden aspect-video bg-gradient-to-br shadow-inner relative"
              style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1, 0.98]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-white/90 flex flex-col items-center">
                    <Icon className="w-10 h-10 mb-3" />
                    <span className="text-sm font-medium">Preview Coming Soon</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button className="w-full text-white" 
              style={{ backgroundImage: `linear-gradient(to right, ${accentColor.split(" ")[0].replace("from-", "")}, ${accentColor.split(" ")[1].replace("to-", "")})` }}
            >
              Get Early Access
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Background decorative elements */}
      <div 
        className="absolute right-0 top-1/4 w-20 h-20 rounded-full blur-3xl opacity-20 -z-10"
        style={{ backgroundColor: accentColor.split(" ")[0].replace("from-", "") }}
      />
      <div 
        className="absolute left-10 bottom-10 w-32 h-32 rounded-full blur-3xl opacity-10 -z-10"
        style={{ backgroundColor: accentColor.split(" ")[1].replace("to-", "") }}
      />
    </div>
  );
};

const WaitingListPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: location.state?.email || "",
    company: "",
    jobTitle: "",
    interests: [],
    message: ""
  });
  const [activeTab, setActiveTab] = useState("overview");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  useEffect(() => {
    document.title = "AI Tools Waiting List | Trojan Envoy";
    window.scrollTo(0, 0);
  }, []);
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Form validation would go here
    
    toast({
      title: "You've joined the waiting list!",
      description: "Thank you for your interest. We'll be in touch soon with exclusive updates.",
    });
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      jobTitle: "",
      interests: [],
      message: ""
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };
  
  const toolsDetails = [
    {
      title: "Website Analyzer",
      description: "An advanced tool that provides comprehensive analysis of your website's performance, SEO, accessibility, and user experience with actionable recommendations.",
      icon: Gauge,
      features: [
        "Comprehensive speed audit with optimization recommendations",
        "Full SEO analysis including on-page and technical factors",
        "Mobile responsiveness testing across devices",
        "Competitor benchmarking and analysis",
        "Accessibility compliance checking",
        "Custom reporting and scheduled monitoring"
      ],
      releaseDate: "Q3 2023",
      progress: 85,
      accentColor: "from-blue-500 to-indigo-600",
      metrics: [
        { 
          icon: <Zap className="w-4 h-4 text-white" />, 
          value: "47%", 
          label: "Speed Improvement" 
        },
        { 
          icon: <Target className="w-4 h-4 text-white" />, 
          value: "91%", 
          label: "SEO Score Boost" 
        },
        { 
          icon: <Users className="w-4 h-4 text-white" />, 
          value: "3.2x", 
          label: "Conversion Rate" 
        },
        { 
          icon: <LineChart className="w-4 h-4 text-white" />, 
          value: "64%", 
          label: "Bounce Rate Reduced" 
        }
      ]
    },
    {
      title: "AI Chatbot",
      description: "An intelligent conversational AI that can be trained on your business data to provide 24/7 customer support, answer questions, and generate leads.",
      icon: Bot,
      features: [
        "Natural language processing for human-like conversations",
        "Custom training on your business data and documents",
        "Integration with CRM and help desk systems",
        "Multi-language support for global businesses",
        "Analytics dashboard to track performance and interactions",
        "Easy deployment on website, mobile apps, and messaging platforms"
      ],
      releaseDate: "Q4 2023",
      progress: 70,
      accentColor: "from-emerald-500 to-teal-600",
      metrics: [
        { 
          icon: <Clock className="w-4 h-4 text-white" />, 
          value: "24/7", 
          label: "Availability" 
        },
        { 
          icon: <Zap className="w-4 h-4 text-white" />, 
          value: "87%", 
          label: "Resolution Rate" 
        },
        { 
          icon: <CupSoda className="w-4 h-4 text-white" />, 
          value: "93%", 
          label: "Customer Satisfaction" 
        },
        { 
          icon: <Users className="w-4 h-4 text-white" />, 
          value: "5.3x", 
          label: "Support Capacity" 
        }
      ]
    },
    {
      title: "Document Analyzer",
      description: "A powerful AI tool that can extract, analyze, and summarize information from various document formats, providing actionable insights and data points.",
      icon: FileSearch,
      features: [
        "Support for PDF, Word, Excel, and image-based documents",
        "Automatic information extraction and classification",
        "Custom entity recognition for industry-specific needs",
        "Sentiment analysis and key theme identification",
        "Summary generation with adjustable detail levels",
        "Data visualization of extracted information"
      ],
      releaseDate: "Q1 2024",
      progress: 60,
      accentColor: "from-amber-500 to-orange-600",
      metrics: [
        { 
          icon: <Clock className="w-4 h-4 text-white" />, 
          value: "93%", 
          label: "Time Saved" 
        },
        { 
          icon: <Bot className="w-4 h-4 text-white" />, 
          value: "99%", 
          label: "Accuracy Rate" 
        },
        { 
          icon: <Layers className="w-4 h-4 text-white" />, 
          value: "14+", 
          label: "File Formats" 
        },
        { 
          icon: <LightbulbIcon className="w-4 h-4 text-white" />, 
          value: "82%", 
          label: "Insight Discovery" 
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header />
      
      {/* Decorative Background Elements */}
      <motion.div style={{ y }} className="fixed top-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "60%"]) }} className="fixed -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="container px-4 mx-auto">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary mb-6 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Exclusive Early Access
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">AI Tools</span> Waiting List
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Be among the first to experience our revolutionary AI tools and get exclusive benefits including early access, special pricing, and personalized onboarding.
            </motion.p>
          </div>
          
          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-primary">
                  <Counter from={0} to={538} />
                </div>
                <p className="text-sm text-muted-foreground">People on Waitlist</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-purple-500">
                  <Counter from={0} to={3} />
                </div>
                <p className="text-sm text-muted-foreground">AI Tools in Development</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-blue-500">
                  <Counter from={0} to={85} />%
                </div>
                <p className="text-sm text-muted-foreground">Development Complete</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-amber-500">
                  <Counter from={0} to={72} />
                </div>
                <p className="text-sm text-muted-foreground">Days Until Launch</p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Tabs Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-4">The Future of AI Tools</h3>
                        <p className="text-muted-foreground mb-4">
                          At Trojan Envoy, we're developing a suite of AI tools designed to revolutionize how businesses approach digital strategy, marketing, and operations.
                        </p>
                        <p className="text-muted-foreground mb-4">
                          Our tools harness the latest advancements in artificial intelligence to provide actionable insights, automate complex tasks, and deliver measurable business impact.
                        </p>
                        
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3">Why Join Our Waiting List?</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                              <span>Early access to all tools before public release</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                              <span>Special founder pricing with lifetime discounts</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                              <span>Direct input into feature development</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                              <span>Personalized onboarding and training sessions</span>
                            </li>
                          </ul>
                        </div>
                        
                        <Button className="mt-6" onClick={() => setActiveTab("signup")}>
                          Join the Waiting List
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl" />
                        
                        <div className="relative p-6 h-full flex flex-col justify-center">
                          <div className="space-y-4">
                            <div className="bg-white dark:bg-black/40 rounded-lg p-4 shadow-sm border border-border">
                              <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-blue-500" />
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold mb-1">Intelligent Analysis</h5>
                                  <p className="text-xs text-muted-foreground">
                                    Our AI tools provide deep analysis and actionable insights that would typically require teams of specialists.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-black/40 rounded-lg p-4 shadow-sm border border-border">
                              <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-purple-500" />
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold mb-1">Automation & Efficiency</h5>
                                  <p className="text-xs text-muted-foreground">
                                    Automate time-consuming tasks and workflows to free up your team for creative and strategic work.
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-black/40 rounded-lg p-4 shadow-sm border border-border">
                              <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <LineChart className="w-5 h-5 text-green-500" />
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold mb-1">Growth & Performance</h5>
                                  <p className="text-xs text-muted-foreground">
                                    Unlock new opportunities for growth with data-driven insights and performance optimization.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Floating Elements */}
                          <motion.div
                            className="absolute top-5 right-5 w-6 h-6 rounded-full bg-primary/30"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.div
                            className="absolute bottom-10 left-10 w-4 h-4 rounded-full bg-purple-500/30"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.div
                            className="absolute bottom-20 right-20 w-5 h-5 rounded-full bg-blue-500/30"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                  <Button size="lg" onClick={() => setActiveTab("tools")}>
                    Explore Our AI Tools
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-display">Exclusive Waiting List Benefits</CardTitle>
                    <CardDescription>
                      Join our waiting list today to unlock these exclusive benefits and more.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 md:p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-transparent">
                        <CardContent className="p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold">Priority Access</h3>
                          <p className="text-muted-foreground text-sm">
                            Be the first to access our AI tools before the general public, with immediate access as soon as they're ready.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500/5 to-transparent">
                        <CardContent className="p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Target className="w-6 h-6 text-purple-500" />
                          </div>
                          <h3 className="text-xl font-semibold">Founder Pricing</h3>
                          <p className="text-muted-foreground text-sm">
                            Lock in exclusive pricing with up to 50% off regular rates, guaranteed for the lifetime of your subscription.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500/5 to-transparent">
                        <CardContent className="p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <HeartHandshake className="w-6 h-6 text-blue-500" />
                          </div>
                          <h3 className="text-xl font-semibold">VIP Support</h3>
                          <p className="text-muted-foreground text-sm">
                            Receive dedicated support with priority response times and personalized onboarding sessions.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500/5 to-transparent">
                        <CardContent className="p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <LightbulbIcon className="w-6 h-6 text-amber-500" />
                          </div>
                          <h3 className="text-xl font-semibold">Feature Input</h3>
                          <p className="text-muted-foreground text-sm">
                            Have direct input into our product roadmap and feature development, helping shape the tools you'll use.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500/5 to-transparent">
                        <CardContent className="p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CalendarDays className="w-6 h-6 text-emerald-500" />
                          </div>
                          <h3 className="text-xl font-semibold">Exclusive Webinars</h3>
                          <p className="text-muted-foreground text-sm">
                            Access to exclusive webinars and training sessions with our AI experts and development team.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-0 shadow-md bg-gradient-to-br from-pink-500/5 to-transparent">
                        <CardContent className="p-6 space-y-4">
                          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-pink-500" />
                          </div>
                          <h3 className="text-xl font-semibold">Extended Trial</h3>
                          <p className="text-muted-foreground text-sm">
                            Get an extended 60-day trial period for all tools, compared to the standard 14-day trial.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                  <Button size="lg" onClick={() => setActiveTab("signup")} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white border-0">
                    Secure Your Spot Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="tools" className="space-y-16">
                {toolsDetails.map((tool, index) => (
                  <ToolDetailCard
                    key={tool.title}
                    {...tool}
                  />
                ))}
                
                <div className="text-center">
                  <Button size="lg" onClick={() => setActiveTab("signup")} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white border-0">
                    Join the Waiting List
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-white">
                      <CardTitle className="text-2xl font-display">Join the Waiting List</CardTitle>
                      <CardDescription className="text-white/80">
                        Fill out the form to secure your spot and exclusive benefits.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6 md:p-8">
                      <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              name="firstName" 
                              value={formData.firstName} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              name="lastName" 
                              value={formData.lastName} 
                              onChange={handleInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company">Company Name</Label>
                            <Input 
                              id="company" 
                              name="company" 
                              value={formData.company} 
                              onChange={handleInputChange} 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input 
                              id="jobTitle" 
                              name="jobTitle" 
                              value={formData.jobTitle} 
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Tools of Interest</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {toolsDetails.map(tool => (
                              <div 
                                key={tool.title} 
                                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                                  formData.interests.includes(tool.title)
                                    ? "bg-primary/10 border-primary"
                                    : "bg-card border-border hover:bg-muted/50"
                                }`}
                                onClick={() => handleInterestToggle(tool.title)}
                              >
                                <div className={`w-4 h-4 rounded flex items-center justify-center mr-2 ${
                                  formData.interests.includes(tool.title)
                                    ? "bg-primary text-white"
                                    : "border border-muted-foreground"
                                }`}>
                                  {formData.interests.includes(tool.title) && (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                </div>
                                <span className="text-sm">{tool.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="message">Additional Information (Optional)</Label>
                          <Textarea 
                            id="message" 
                            name="message" 
                            value={formData.message} 
                            onChange={handleInputChange} 
                            placeholder="Tell us about your specific needs or questions"
                            className="h-24"
                          />
                        </div>
                        
                        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white border-0">
                          Submit and Join Waiting List
                        </Button>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          By submitting this form, you agree to receive communications about our AI tools. You can unsubscribe at any time.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card className="border-0 shadow-md overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">What Happens Next?</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="p-6">
                        <ol className="space-y-4">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                              <span className="font-semibold text-primary">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Confirmation Email</h4>
                              <p className="text-sm text-muted-foreground">
                                You'll receive an immediate confirmation with your position on the waiting list.
                              </p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                              <span className="font-semibold text-primary">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Regular Updates</h4>
                              <p className="text-sm text-muted-foreground">
                                We'll send you exclusive updates on development progress and sneak peeks.
                              </p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                              <span className="font-semibold text-primary">3</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Early Access Invitation</h4>
                              <p className="text-sm text-muted-foreground">
                                When a tool is ready for early access, you'll receive an invitation with your special pricing.
                              </p>
                            </div>
                          </li>
                          
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                              <span className="font-semibold text-primary">4</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Onboarding & Training</h4>
                              <p className="text-sm text-muted-foreground">
                                Schedule your personalized onboarding session with our team of experts.
                              </p>
                            </div>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-md overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">When will the tools be available?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Our first tool (Website Analyzer) is expected to launch in Q3 2023, with the remaining tools following quarterly.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">What's the pricing structure?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Waiting list members will receive up to 50% off our regular pricing, with both monthly and annual plans available.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Can I cancel my waiting list spot?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Yes, you can unsubscribe at any time by clicking the link in any of our emails.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Will there be enterprise options?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Yes, we'll offer enterprise plans with custom features, dedicated support, and volume discounts.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WaitingListPage;
