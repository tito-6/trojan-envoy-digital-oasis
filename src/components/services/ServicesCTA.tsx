
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const ServicesCTA: React.FC = () => {
  const { t } = useLanguage();
  
  const benefits = [
    "Tailored solutions for your unique business needs",
    "Experienced team of professionals",
    "Results-driven approach",
    "Transparent communication",
    "Ongoing support and maintenance",
    "Competitive pricing",
  ];
  
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="should-animate">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Transform Your
              <span className="block text-gradient">Digital Presence?</span>
            </h2>
            
            <p className="text-muted-foreground mb-8">
              Partner with us to leverage our expertise and propel your business forward. 
              Our team is ready to help you achieve your digital goals with tailored solutions 
              that drive results.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild size="lg">
                <Link to="/portfolio">
                  View Our Work
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative should-animate">
            <div className="bg-card p-8 rounded-xl border border-border shadow-md">
              <h3 className="text-xl font-display font-bold mb-6">Request a Free Consultation</h3>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-2">
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select a service</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="seo">SEO Services</option>
                    <option value="ecommerce">E-commerce Solutions</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full">
                  Request Consultation
                </Button>
              </form>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-4 -left-4 w-24 h-24 rounded-full bg-primary/5 blur-2xl"></div>
            <div className="absolute -z-10 -bottom-4 -right-4 w-32 h-32 rounded-full bg-accent/5 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;
