
import React, { useEffect, useState } from "react";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Sparkles, Bot, FileSearch, Gauge, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const AIToolsCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  className?: string;
}> = ({ title, description, icon, comingSoon = true, className }) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 rounded-md border border-border bg-secondary/30 flex items-center justify-center overflow-hidden">
          {comingSoon && (
            <div className="absolute inset-0 backdrop-blur-sm bg-background/70 flex flex-col items-center justify-center gap-2">
              <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Coming Soon
              </div>
              <Clock className="w-8 h-8 text-muted-foreground animate-pulse mt-2" />
            </div>
          )}
          <div className="text-center p-6">
            <p className="text-muted-foreground">Tool preview will appear here</p>
          </div>
        </div>

        <Button className="w-full mt-6" disabled={comingSoon}>
          {comingSoon ? "Notify Me When Available" : "Access Tool"}
        </Button>
      </CardContent>
    </Card>
  );
};

const AITools: React.FC = () => {
  const { t } = useLanguage();
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    // Set up theme toggle function
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkTheme(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDarkTheme(true);
    }

    // Fade in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-element");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll(".should-animate");
    elements.forEach((el) => observer.observe(el));

    // Scroll to top on page load
    window.scrollTo(0, 0);

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkTheme(true);
    }
  };

  const aiTools = [
    {
      title: "Website Analyzer",
      description: "Comprehensive performance and SEO analysis for your website, similar to Google's PageSpeed Insights.",
      icon: <Gauge className="w-5 h-5 text-primary" />,
    },
    {
      title: "AI Chatbot",
      description: "Intelligent conversational AI capable of answering a wide range of queries about digital marketing and development.",
      icon: <Bot className="w-5 h-5 text-primary" />,
    },
    {
      title: "Document Analyzer",
      description: "AI-powered document analysis supporting PDF and various file formats with detailed insights and recommendations.",
      icon: <FileSearch className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:30px_30px]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary mb-6 text-sm font-medium should-animate">
              <Sparkles className="w-4 h-4 text-primary" />
              Advanced AI Tools
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 should-animate">
              Powerful AI Tools for <br />
              <span className="text-gradient">Digital Excellence</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 should-animate">
              Our suite of AI-powered tools designed to transform your digital presence, 
              enhance performance, and deliver actionable insights.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 should-animate">
              <Button size="lg">
                Join Waiting List
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        {/* Tools Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiTools.map((tool, index) => (
                <AIToolsCard
                  key={tool.title}
                  {...tool}
                  className={`should-animate delay-${index * 100}`}
                />
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 should-animate">
                Subscribe for Early Access
              </h2>
              
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 should-animate">
                Be the first to know when our AI tools are available. Early subscribers will receive 
                exclusive beta access and special pricing.
              </p>
              
              <form className="max-w-lg mx-auto should-animate">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button type="submit">Subscribe</Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AITools;
