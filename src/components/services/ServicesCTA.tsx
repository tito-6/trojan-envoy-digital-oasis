
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

const ServicesCTA: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const features = [
    t('services.cta.features.title1'),
    t('services.cta.features.title2'),
    t('services.cta.features.title3'),
    t('services.cta.features.title4'),
    t('services.cta.features.title5'),
    t('services.cta.features.title6')
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!name.trim() || !email.trim() || !service.trim()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Form Submitted",
        description: "Thank you for your interest. We'll contact you soon!",
        variant: "default"
      });
      setName("");
      setEmail("");
      setService("");
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6 should-animate">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t('services.cta.title')}
            </h2>
            
            <p className="text-muted-foreground">
              {t('services.cta.description')}
            </p>
            
            <ul className="space-y-3 pt-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/contact"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                {t('services.cta.button.primary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/portfolio"
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors inline-flex items-center justify-center"
              >
                {t('services.cta.button.secondary')}
              </Link>
            </div>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-6 lg:p-8 should-animate delay-200">
            <h3 className="text-xl font-semibold mb-6">
              {t('services.form.title')}
            </h3>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t('services.form.name')}
                </label>
                <Input 
                  id="name" 
                  placeholder={t('services.form.name.placeholder')} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('services.form.email')}
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t('services.form.email.placeholder')} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium">
                  {t('services.form.service')}
                </label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('services.form.service.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">{t('services.web.title')}</SelectItem>
                    <SelectItem value="mobile-development">{t('services.mobile.title')}</SelectItem>
                    <SelectItem value="ui-design">{t('services.ui.title')}</SelectItem>
                    <SelectItem value="digital-marketing">{t('services.digital.title')}</SelectItem>
                    <SelectItem value="seo-optimization">{t('services.seo.title')}</SelectItem>
                    <SelectItem value="ecommerce-solutions">{t('services.ecommerce.title')}</SelectItem>
                    <SelectItem value="content-creation">{t('services.content.title')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-2 bg-primary text-primary-foreground hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('services.form.submitting') : t('services.form.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;
