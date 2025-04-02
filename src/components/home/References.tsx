
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { storageService } from "@/lib/storage";

const References: React.FC = () => {
  const { t } = useLanguage();
  const [update, forceUpdate] = useState(false);
  
  // Get references settings from storage
  const referencesSettings = storageService.getReferencesSettings();
  
  // Filter active logos
  const activeLogos = referencesSettings.clientLogos.filter(logo => logo.isActive !== false);
  
  useEffect(() => {
    // Set up storage listeners for live updates
    const referencesUpdateListener = () => {
      // Force re-render when references settings change
      forceUpdate(prev => !prev);
    };
    
    // Subscribe to references settings updates
    const unsubscribe = storageService.addEventListener('references-settings-updated', referencesUpdateListener);
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
            {referencesSettings.title}
          </h2>
          <p className="text-muted-foreground should-animate">
            {referencesSettings.subtitle}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-16 md:gap-y-12 max-w-5xl mx-auto">
          {activeLogos.map((client, index) => (
            <div 
              key={client.id} 
              className={cn(
                "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 should-animate",
                `delay-${index * 100}`
              )}
            >
              <img 
                src={client.logo} 
                alt={`${client.name} logo`} 
                className={cn("h-12 md:h-16", client.scale)} 
                onError={(e) => {
                  console.error(`Failed to load image for ${client.name}`);
                  e.currentTarget.src = "/placeholder.svg"; // Fallback image
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link 
            to={referencesSettings.viewCaseStudiesUrl}
            className="inline-block px-6 py-3 bg-secondary font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            {referencesSettings.viewCaseStudiesText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default References;
