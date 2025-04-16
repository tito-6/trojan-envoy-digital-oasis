
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShoppingCart, CheckCircle, CreditCard, Package, Truck, ArrowRight, ExternalLink, Laptop, Smartphone, Server, ShoppingBag } from "lucide-react";

interface EcommerceSolution {
  id: string;
  title: string;
  description: string;
  platform: string;
  features: string[];
  imageUrl: string;
  technologies: string[];
  demoUrl?: string;
}

const ecommerceSolutions: EcommerceSolution[] = [
  {
    id: "ecom1",
    title: "Luxury Fashion Boutique",
    description: "High-end fashion e-commerce store with personalized shopping experience.",
    platform: "Shopify",
    features: [
      "Advanced product filtering",
      "AR try-on experience",
      "VIP customer portal",
      "Custom checkout flow",
      "Inventory management"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    technologies: ["Shopify Plus", "React", "Liquid", "Algolia", "Klaviyo"],
    demoUrl: "https://www.shopify.com"
  },
  {
    id: "ecom2",
    title: "Organic Food Marketplace",
    description: "Multi-vendor platform for organic food products with subscription options.",
    platform: "WooCommerce",
    features: [
      "Vendor management system",
      "Subscription boxes",
      "Delivery scheduling",
      "Recipe integration",
      "Nutritional information"
    ],
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    technologies: ["WordPress", "WooCommerce", "Dokan", "WC Subscriptions", "Elementor Pro"],
    demoUrl: "https://woocommerce.com"
  },
  {
    id: "ecom3",
    title: "Electronics Superstore",
    description: "High-performance electronics store with advanced product comparison.",
    platform: "Magento",
    features: [
      "Product comparison engine",
      "Advanced search filters",
      "Product bundling",
      "Customer rewards program",
      "Real-time inventory"
    ],
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    technologies: ["Magento 2", "MySQL", "Elasticsearch", "Vue.js", "Redis"],
    demoUrl: "https://magento.com"
  },
  {
    id: "ecom4",
    title: "Handcrafted Goods Marketplace",
    description: "Artisan marketplace for unique handcrafted products globally.",
    platform: "Custom",
    features: [
      "Artisan profiles",
      "Custom product builder",
      "Global shipping calculator",
      "Workshop booking system",
      "Product stories"
    ],
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    technologies: ["Node.js", "React", "MongoDB", "Stripe Connect", "AWS"],
  }
];

interface PlatformInfo {
  name: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  strengths: string[];
}

const platforms: PlatformInfo[] = [
  {
    name: "Shopify",
    icon: <ShoppingBag className="h-6 w-6" />,
    subtitle: "Quick launch with minimal technical requirements",
    description: "Fully hosted e-commerce platform with extensive app marketplace.",
    strengths: [
      "Easy setup and management",
      "Secure payment processing",
      "Mobile-responsive themes",
      "Marketing tools integration",
      "24/7 customer support"
    ]
  },
  {
    name: "WooCommerce",
    icon: <ShoppingCart className="h-6 w-6" />,
    subtitle: "Flexible WordPress-based solution",
    description: "Open-source plugin that transforms WordPress into an e-commerce store.",
    strengths: [
      "Full WordPress integration",
      "Unlimited customization",
      "Extensive plugin ecosystem",
      "Content marketing friendly",
      "One-time setup cost"
    ]
  },
  {
    name: "Magento",
    icon: <Server className="h-6 w-6" />,
    subtitle: "Enterprise-level commerce solution",
    description: "Robust platform for large catalogs and complex business requirements.",
    strengths: [
      "Highly scalable architecture",
      "Advanced product management",
      "Multiple store management",
      "B2B functionality",
      "Extensive customization options"
    ]
  },
  {
    name: "Custom",
    icon: <Laptop className="h-6 w-6" />,
    subtitle: "Tailored solution for unique requirements",
    description: "Built from the ground up to match your specific business needs.",
    strengths: [
      "Unlimited flexibility",
      "Unique user experience",
      "Custom feature development",
      "Performance optimization",
      "Scalable architecture"
    ]
  }
];

const ProcessStep: React.FC<{
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}> = ({ number, title, description, icon, delay }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
              Step {number}
            </span>
            <h3 className="font-display font-bold">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {number < 5 && (
        <div className="absolute left-6 top-14 h-12 border-l border-dashed border-border"></div>
      )}
    </motion.div>
  );
};

const EcommerceCard: React.FC<{ solution: EcommerceSolution; index: number }> = ({ solution, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full border-border hover:border-primary/30 transition-all hover:shadow-md">
        <AspectRatio ratio={16/9}>
          <img 
            src={solution.imageUrl} 
            alt={solution.title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute top-3 right-3">
            <Badge>{solution.platform}</Badge>
          </div>
        </AspectRatio>
        <CardContent className="p-6">
          <h3 className="text-xl font-display font-bold mb-2">{solution.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Key Features:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
              {solution.features.map((feature, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-1.5">
              {solution.technologies.map((tech, i) => (
                <Badge key={i} variant="outline" className="text-xs py-0">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          
          {solution.demoUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full gap-1.5"
              onClick={() => window.open(solution.demoUrl, "_blank", "noopener,noreferrer")}
            >
              View Demo <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PortfolioEcommerceSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState("all");
  
  const filteredSolutions = activePlatform === "all"
    ? ecommerceSolutions
    : ecommerceSolutions.filter(solution => 
        solution.platform.toLowerCase() === activePlatform.toLowerCase());

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
              <ShoppingCart className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              E-Commerce Solutions
            </span>
            <span className="relative">
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Custom e-commerce development that delivers exceptional shopping experiences.
            From small boutiques to enterprise marketplaces, we build solutions that sell.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full mb-12">
          <TabsList className="w-full max-w-xl mx-auto flex justify-between bg-background/50 backdrop-blur border border-border p-1 rounded-full">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActivePlatform("all")}
            >
              All Solutions
            </TabsTrigger>
            <TabsTrigger 
              value="shopify" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActivePlatform("shopify")}
            >
              Shopify
            </TabsTrigger>
            <TabsTrigger 
              value="woocommerce" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActivePlatform("woocommerce")}
            >
              WooCommerce
            </TabsTrigger>
            <TabsTrigger 
              value="magento" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActivePlatform("magento")}
            >
              Magento
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
              onClick={() => setActivePlatform("custom")}
            >
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredSolutions.map((solution, index) => (
                <EcommerceCard key={solution.id} solution={solution} index={index} />
              ))}
            </div>
          </TabsContent>
          
          {["shopify", "woocommerce", "magento", "custom"].map(platform => (
            <TabsContent key={platform} value={platform} className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredSolutions.map((solution, index) => (
                  <EcommerceCard key={solution.id} solution={solution} index={index} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <motion.div 
          className="max-w-4xl mx-auto my-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Our E-Commerce Development Process</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a structured approach to building custom e-commerce solutions that ensures
              your online store is optimized for sales, scalability, and customer experience.
            </p>
          </div>
          
          <div className="space-y-8 pl-2">
            <ProcessStep 
              number={1}
              title="Discovery & Strategy"
              description="We analyze your business needs, target audience, and competition to create a strategic roadmap for your e-commerce platform."
              icon={<Laptop className="h-6 w-6" />}
              delay={0.1}
            />
            <ProcessStep 
              number={2}
              title="Design & Prototyping"
              description="Our UX/UI experts design intuitive shopping experiences and customer journeys optimized for conversions."
              icon={<Smartphone className="h-6 w-6" />}
              delay={0.2}
            />
            <ProcessStep 
              number={3}
              title="Development & Integration"
              description="We build your store with clean code and integrate payment gateways, shipping providers, CRM systems, and marketing tools."
              icon={<CreditCard className="h-6 w-6" />}
              delay={0.3}
            />
            <ProcessStep 
              number={4}
              title="Testing & Launch"
              description="Comprehensive testing across devices and browsers ensures a flawless shopping experience before going live."
              icon={<Package className="h-6 w-6" />}
              delay={0.4}
            />
            <ProcessStep 
              number={5}
              title="Support & Growth"
              description="Ongoing support, performance monitoring, and continuous optimization to grow your e-commerce business."
              icon={<Truck className="h-6 w-6" />}
              delay={0.5}
            />
          </div>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {platforms.map((platform, index) => (
            <Card key={index} className="border-border hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {platform.icon}
                  </div>
                  <Badge variant="outline">{platform.name}</Badge>
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{platform.name}</h3>
                <p className="text-xs text-primary mb-2">{platform.subtitle}</p>
                <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Strengths:</h4>
                  <ul className="space-y-1">
                    {platform.strengths.map((strength, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity group"
          >
            Start Your E-Commerce Project
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="ml-1 h-4 w-4" />
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioEcommerceSection;
