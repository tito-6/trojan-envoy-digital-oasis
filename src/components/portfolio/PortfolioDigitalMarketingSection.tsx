
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Layers, Target, TrendingUp, LineChart, Mail, Megaphone, Users, Globe } from "lucide-react";

const DigitalMarketingCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  tools: string[];
  index: number;
}> = ({ title, description, icon, features, tools, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <Badge variant="outline" className="bg-secondary/50">Digital Marketing</Badge>
          </div>
          <CardTitle className="text-xl font-display mt-4 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Features:</h4>
              <ul className="space-y-1">
                {features.map((feature, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Tools & Integrations:</h4>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool, i) => (
                  <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-primary flex items-center gap-1 group/btn"
              >
                Learn more 
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PortfolioDigitalMarketingSection: React.FC = () => {
  const marketingServices = [
    {
      title: "Lead Generation",
      description: "Strategic campaigns designed to capture high-quality leads and drive conversions.",
      icon: <Target className="h-6 w-6" />,
      features: [
        "Custom landing page development",
        "Lead qualification & scoring",
        "A/B testing optimization",
        "Multi-channel campaign management"
      ],
      tools: ["HubSpot", "Marketo", "Pipedrive", "ActiveCampaign", "Qualified.com"]
    },
    {
      title: "SEO & Content Marketing",
      description: "Data-driven strategies that boost organic visibility and establish thought leadership.",
      icon: <TrendingUp className="h-6 w-6" />,
      features: [
        "Keyword research & optimization",
        "Content strategy & creation",
        "Technical SEO audits",
        "Link building campaigns"
      ],
      tools: ["SEMrush", "Ahrefs", "Google Analytics", "Screaming Frog", "ContentCal"]
    },
    {
      title: "PPC & Paid Media",
      description: "Performance-focused paid campaigns across search, social, and display networks.",
      icon: <LineChart className="h-6 w-6" />,
      features: [
        "Campaign structure optimization",
        "Conversion tracking setup",
        "Audience targeting & retargeting",
        "Budget management & ROI tracking"
      ],
      tools: ["Google Ads", "Facebook Ads Manager", "LinkedIn Campaign Manager", "Twitter Ads"]
    },
    {
      title: "Email Marketing",
      description: "Personalized email strategies that nurture leads and strengthen customer relationships.",
      icon: <Mail className="h-6 w-6" />,
      features: [
        "Automated workflow creation",
        "Segmentation & personalization",
        "A/B testing & optimization",
        "Deliverability management"
      ],
      tools: ["Mailchimp", "Klaviyo", "SendGrid", "Campaign Monitor", "Braze"]
    },
    {
      title: "Social Media Marketing",
      description: "Engaging social media strategies that build brand awareness and community.",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Content calendar development",
        "Community management",
        "Influencer partnership strategy",
        "Social listening & monitoring"
      ],
      tools: ["Hootsuite", "Sprout Social", "Buffer", "Later", "Iconosquare"]
    },
    {
      title: "Analytics & Reporting",
      description: "Comprehensive performance tracking and actionable insights to drive continuous improvement.",
      icon: <Layers className="h-6 w-6" />,
      features: [
        "Custom dashboard creation",
        "Multi-channel attribution",
        "Conversion funnel analysis",
        "ROI & performance reporting"
      ],
      tools: ["Google Analytics 4", "Google Data Studio", "Mixpanel", "Hotjar", "Amplitude"]
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
              <Megaphone className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Digital Marketing
            </span>
            <span className="relative">
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive digital marketing services that drive measurable results.
            From lead generation to analytics, we help you reach and engage your target audience.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {marketingServices.map((service, index) => (
            <DigitalMarketingCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              features={service.features}
              tools={service.tools}
              index={index}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-20 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 p-8 lg:p-12 border border-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="secondary" className="mb-6">Featured Service</Badge>
              <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4">
                Complete Marketing Funnel Optimization
              </h3>
              <p className="text-muted-foreground mb-6">
                Our holistic approach optimizes every stage of your marketing funnel, from awareness to conversion.
                We identify and eliminate bottlenecks, enhance user experience, and implement data-driven strategies
                that maximize your return on marketing investment.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Multi-channel Integration</h4>
                    <p className="text-sm text-muted-foreground">Seamless experience across all customer touchpoints</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Advanced Audience Targeting</h4>
                    <p className="text-sm text-muted-foreground">Precision targeting based on behavior and intent</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <LineChart className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Conversion Rate Optimization</h4>
                    <p className="text-sm text-muted-foreground">Data-backed improvements to maximize conversions</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get a Marketing Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] relative z-10 rounded-xl overflow-hidden border border-border shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
                  alt="Marketing Strategy Dashboard" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-6 -right-6 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl -z-10 opacity-70"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl -z-10 opacity-70"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioDigitalMarketingSection;
