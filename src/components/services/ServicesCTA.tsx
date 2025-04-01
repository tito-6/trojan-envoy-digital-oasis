
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const ServicesCTA: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('ready.to.start')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('service.cta.desc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            {t('contact.us')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="lg">
            {t('view.all.services')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesCTA;
