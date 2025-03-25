
import React from "react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const References: React.FC = () => {
  const { t } = useLanguage();

  const clients = [
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", scale: "w-32" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", scale: "w-28" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", scale: "w-32" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", scale: "w-24" },
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", scale: "w-32" },
    { name: "Coca-Cola", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg", scale: "w-32" },
    { name: "Toyota", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.svg", scale: "w-20" },
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", scale: "w-20" },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
            {t('references.title')}
          </h2>
          <p className="text-muted-foreground should-animate">
            {t('references.subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8 md:gap-x-16 md:gap-y-12 max-w-5xl mx-auto">
          {clients.map((client, index) => (
            <div 
              key={client.name} 
              className={cn(
                "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 should-animate",
                `delay-${index * 100}`
              )}
            >
              <img 
                src={client.logo} 
                alt={`${client.name} logo`} 
                className={cn("h-12 md:h-16", client.scale)} 
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="/case-studies" 
            className="inline-block px-6 py-3 bg-secondary font-medium rounded-lg hover:bg-secondary/80 transition-colors"
          >
            View Our Case Studies
          </a>
        </div>
      </div>
    </section>
  );
};

export default References;
