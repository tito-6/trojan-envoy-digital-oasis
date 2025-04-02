
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { storageService } from "@/lib/storage";

const HomeFAQ: React.FC = () => {
  const { t } = useLanguage();
  const [update, forceUpdate] = useState(false);
  
  // Get FAQ settings from storage
  const faqSettings = storageService.getFAQSettings();
  
  // Filter active FAQ items
  const activeFAQs = faqSettings.faqItems.filter(item => item.isActive !== false);
  
  useEffect(() => {
    // Set up storage listeners for live updates
    const faqUpdateListener = () => {
      // Force re-render when FAQ settings change
      forceUpdate(prev => !prev);
    };
    
    // Subscribe to FAQ settings updates
    const unsubscribe = storageService.addEventListener('faq-settings-updated', faqUpdateListener);
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
            {faqSettings.title}
          </h2>
          <p className="text-muted-foreground should-animate">
            {faqSettings.subtitle}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {activeFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="should-animate">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-10">
            <Link 
              to={faqSettings.viewAllUrl}
              className="inline-flex items-center gap-2 font-medium hover:text-primary transition-colors"
            >
              {faqSettings.viewAllText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
