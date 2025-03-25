
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PortfolioItemProps {
  title: string;
  category: string;
  description: string;
  image: string;
  delay: number;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ 
  title, category, description, image, delay 
}) => {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 should-animate delay-${delay}`}>
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
          <span className="text-muted-foreground">Project Image</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <span className="text-sm text-primary font-medium mb-2">{category}</span>
          <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          
          <div className="mt-auto flex justify-between items-center pt-4">
            <Link 
              to={`/portfolio/${title.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              View Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <a 
              href="#" 
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PortfolioGallery: React.FC = () => {
  // Sample portfolio items
  const portfolioItems = [
    {
      title: "E-commerce Platform",
      category: "Web Development",
      description: "A fully responsive e-commerce platform with advanced filtering and secure payment processing.",
      image: "ecommerce.jpg",
    },
    {
      title: "Healthcare Mobile App",
      category: "Mobile Apps",
      description: "A patient-centered mobile application for healthcare providers with appointment scheduling and telehealth features.",
      image: "healthcare.jpg",
    },
    {
      title: "Real Estate Website",
      category: "Web Development",
      description: "A premium real estate website with property listings, virtual tours, and agent profiles.",
      image: "realestate.jpg",
    },
    {
      title: "Food Delivery App",
      category: "Mobile Apps",
      description: "A food delivery application with real-time order tracking and seamless payment integration.",
      image: "foodapp.jpg",
    },
    {
      title: "Corporate Rebrand",
      category: "Branding",
      description: "Complete corporate rebranding including logo design, visual identity, and brand guidelines.",
      image: "branding.jpg",
    },
    {
      title: "Marketing Campaign",
      category: "Digital Marketing",
      description: "A multi-channel digital marketing campaign that increased client's conversion rates by 45%.",
      image: "marketing.jpg",
    },
  ];
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <PortfolioItem
              key={item.title}
              {...item}
              delay={index * 100}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center should-animate">
          <p className="text-muted-foreground mb-6">
            Looking for more examples of our work? Contact us to request our extended portfolio.
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Discuss Your Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
