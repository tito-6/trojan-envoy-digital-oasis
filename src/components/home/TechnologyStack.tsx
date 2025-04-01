
import React, { useEffect, useState, useRef } from "react";
import { storageService } from "@/lib/storage";
import { ContentItem, TechItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Icon } from "@/components/ui/icon";

const TechnologyStack: React.FC = () => {
  const [techStackContent, setTechStackContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTechStack = () => {
      setLoading(true);
      const allContent = storageService.getContentByType("Technology Stack");
      console.log("Tech stack content from storage:", allContent);
      
      if (allContent.length > 0) {
        // Get the most recently updated tech stack content
        const sortedContent = [...allContent].sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        console.log("Using tech stack:", sortedContent[0]);
        console.log("Tech items:", sortedContent[0].techItems);
        setTechStackContent(sortedContent[0]);
      } else {
        // Use default data if no tech stack content is found
        console.log("No tech stack content found, using defaults");
        setTechStackContent(null);
      }
      setLoading(false);
    };

    fetchTechStack();
    
    // Listen for content updates and refresh when they happen
    const unsubscribe = storageService.addEventListener("content-updated", () => {
      console.log("Content updated event received, refreshing tech stack");
      fetchTechStack();
      toast({
        title: "Technology Stack Updated",
        description: "The technology stack has been refreshed with the latest data.",
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [toast]);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
        if (isInView) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const defaultTechItems: TechItem[] = [
    { name: "React", iconName: "react", color: "#61DAFB", animate: "animate-float" },
    { name: "TypeScript", iconName: "typescript", color: "#3178C6", animate: "animate-pulse-soft" },
    { name: "Vue.js", iconName: "vue-js", color: "#4FC08D", animate: "animate-float" },
    { name: "Angular", iconName: "angular", color: "#DD0031", animate: "animate-pulse-soft" },
    { name: "JavaScript", iconName: "javascript", color: "#F7DF1E", animate: "animate-float" },
    { name: "Node.js", iconName: "node-js", color: "#339933", animate: "animate-pulse-soft" },
    { name: "Python", iconName: "python", color: "#3776AB", animate: "animate-float" },
    { name: "Java", iconName: "java", color: "#007396", animate: "animate-pulse-soft" },
    { name: "PHP", iconName: "php", color: "#777BB4", animate: "animate-float" },
    { name: "Kotlin", iconName: "kotlin", color: "#7F52FF", animate: "animate-pulse-soft" },
    { name: "Swift", iconName: "swift", color: "#FA7343", animate: "animate-float" },
    { name: "Flutter", iconName: "flutter", color: "#02569B", animate: "animate-pulse-soft" },
    { name: "Firebase", iconName: "firebase", color: "#FFCA28", animate: "animate-float" },
    { name: "MongoDB", iconName: "mongodb", color: "#47A248", animate: "animate-pulse-soft" },
    { name: "SQL", iconName: "sql", color: "#4479A1", animate: "animate-float" },
    { name: "GraphQL", iconName: "graphql", color: "#E10098", animate: "animate-pulse-soft" },
    { name: "Tailwind", iconName: "tailwind", color: "#06B6D4", animate: "animate-float" },
    { name: "Docker", iconName: "docker", color: "#2496ED", animate: "animate-pulse-soft" },
    { name: "AWS", iconName: "aws", color: "#FF9900", animate: "animate-float" },
    { name: "GitHub", iconName: "github", color: "#181717", animate: "animate-pulse-soft" }
  ];

  const title = techStackContent?.title || "Our Technology Stack";
  const subtitle = techStackContent?.subtitle || "Comprehensive digital solutions for your business";
  const description = techStackContent?.description || "We leverage cutting-edge technology to build modern, scalable solutions";
  
  // Ensure we always have techItems array
  const techItems = techStackContent?.techItems && techStackContent.techItems.length > 0
    ? techStackContent.techItems 
    : defaultTechItems;
  
  console.log("Tech items to render:", techItems);

  const renderIcon = (tech: TechItem) => {
    console.log("Rendering icon for tech:", tech.name, "icon:", tech.iconName);
    return <Icon name={tech.iconName} color={tech.color} size={36} />;
  };

  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <p>Loading technology stack...</p>
      </div>
    );
  }

  return (
    <div 
      id="tech-stack-section"
      ref={sectionRef}
      className="w-full py-20 bg-gradient-to-b from-background via-background/90 to-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium should-animate">
            {subtitle}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto should-animate">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {techItems.map((tech, index) => {
            return (
              <div 
                key={`${tech.name}-${index}`}
                className={`tech-icon flex flex-col items-center justify-center ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-8'}`}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transition: 'all 0.5s ease'
                }}
              >
                <div 
                  className={`w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-3 ${tech.animate || ""} hover:shadow-lg transition-all duration-300`}
                >
                  {renderIcon(tech)}
                </div>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl"></div>
    </div>
  );
};

export default TechnologyStack;
