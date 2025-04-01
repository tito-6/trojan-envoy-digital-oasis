
import React from "react";
import { useLanguage } from "@/lib/i18n";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";

const Contact: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="section-padding" id="contact">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium">
              Get In Touch
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t('contact.title')}
              <span className="block text-gradient mt-1">{t('contact.subtitle')}</span>
            </h2>
            
            <p className="text-muted-foreground mb-8 max-w-md">
              Have a project in mind? Let's talk about how we can help your business grow through innovative digital solutions.
            </p>
            
            <ContactInfo />
          </div>
          
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
