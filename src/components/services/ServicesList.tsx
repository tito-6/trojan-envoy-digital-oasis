
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Smartphone, Paintbrush, BarChart, Globe, ShoppingCart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  link: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, description, icon, features, link, delay 
}) => {
  return (
    <Card className={`overflow-hidden group hover:border-primary/50 hover:shadow-lg transition-all duration-300 should-animate delay-${delay}`}>
      <CardHeader className="pb-4">
        <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Link
          to={link}
          className="inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
};

const ServicesList: React.FC = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      title: "Web Development",
      description: "Custom websites with pixel-perfect design and optimized performance",
      icon: <Code className="w-5 h-5 text-primary" />,
      features: [
        "Responsive design for all devices",
        "CMS integration",
        "E-commerce functionality",
        "Fast loading and optimized performance",
        "SEO-friendly structure"
      ],
      link: "/services/web-development",
    },
    {
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications",
      icon: <Smartphone className="w-5 h-5 text-primary" />,
      features: [
        "iOS and Android development",
        "Cross-platform solutions",
        "User-centric interfaces",
        "Offline capabilities",
        "App store optimization"
      ],
      link: "/services/mobile-development",
    },
    {
      title: "UI/UX Design",
      description: "Intuitive interfaces and exceptional user experiences",
      icon: <Paintbrush className="w-5 h-5 text-primary" />,
      features: [
        "User research and testing",
        "Wireframing and prototyping",
        "Visual design and branding",
        "Interaction design",
        "Accessibility compliance"
      ],
      link: "/services/ui-ux-design",
    },
    {
      title: "Digital Marketing",
      description: "Data-driven strategies to grow your online presence",
      icon: <BarChart className="w-5 h-5 text-primary" />,
      features: [
        "Search engine optimization (SEO)",
        "Pay-per-click advertising (PPC)",
        "Social media marketing",
        "Content marketing",
        "Analytics and reporting"
      ],
      link: "/services/digital-marketing",
    },
    {
      title: "SEO Services",
      description: "Boost visibility and drive organic traffic to your website",
      icon: <Globe className="w-5 h-5 text-primary" />,
      features: [
        "Keyword research and analysis",
        "On-page and off-page optimization",
        "Technical SEO audits",
        "Local SEO strategies",
        "Rank tracking and reporting"
      ],
      link: "/services/seo-services",
    },
    {
      title: "E-commerce Solutions",
      description: "End-to-end online shopping experiences that convert",
      icon: <ShoppingCart className="w-5 h-5 text-primary" />,
      features: [
        "Custom e-commerce development",
        "Payment gateway integration",
        "Inventory management",
        "Mobile shopping experiences",
        "Conversion rate optimization"
      ],
      link: "/services/ecommerce-solutions",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
