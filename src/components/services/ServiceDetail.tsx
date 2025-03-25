
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ContentItem } from "@/lib/types";

interface ServiceDetailProps {
  service: ContentItem;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  const { t } = useLanguage();
  
  const renderServiceContent = () => {
    if (!service.content) return null;
    
    // Try to parse the content as markdown-style list items
    const contentLines = service.content.split("\n").map(line => line.trim()).filter(Boolean);
    
    // Check if content has list items (starting with - or •)
    const hasListItems = contentLines.some(line => line.startsWith('-') || line.startsWith('•'));
    
    if (hasListItems) {
      const sections = [];
      let currentSection = { title: '', items: [] as string[] };
      
      for (const line of contentLines) {
        if (!line.startsWith('-') && !line.startsWith('•')) {
          // This is a section title
          if (currentSection.items.length > 0) {
            sections.push({...currentSection});
            currentSection = { title: line, items: [] };
          } else {
            currentSection.title = line;
          }
        } else {
          // This is a list item
          currentSection.items.push(line.replace(/^[-•]\s*/, ''));
        }
      }
      
      // Add the last section
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      
      return (
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              {section.title && <h3 className="text-xl font-semibold">{section.title}</h3>}
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    
    // If no list items, just render as paragraphs
    return (
      <div className="space-y-4">
        {contentLines.map((paragraph, index) => (
          <p key={index} className="text-muted-foreground">{paragraph}</p>
        ))}
      </div>
    );
  };
  
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <Link to="/services" className="inline-flex items-center gap-1.5 mb-8 text-sm hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.services')}
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold">{service.title}</h1>
            <p className="text-lg text-muted-foreground">{service.description}</p>
            
            <div className="py-4 space-y-8">
              {renderServiceContent()}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-semibold">{t('service.cta')}</h3>
              <p className="text-muted-foreground">{t('service.contact')}</p>
              
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t('contact.title')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="pt-4 border-t border-border mt-4 space-y-4">
                <h4 className="font-medium">{t('service.features')}</h4>
                <ul className="space-y-2">
                  {service.content && parseFeatures(service.content).slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to parse features from content
const parseFeatures = (content: string): string[] => {
  if (content.includes('- ') || content.includes('• ')) {
    return content
      .split(/\n/)
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
  }
  
  return content
    .split(/\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 5);
};

export default ServiceDetail;
