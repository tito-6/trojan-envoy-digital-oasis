
import React from "react";
import { Target, Award, Users, Zap, Shield, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon, delay }) => {
  return (
    <Card className={`border-border hover:border-primary/50 transition-all duration-300 should-animate delay-${delay}`}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-display font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const ValuesSection: React.FC = () => {
  const { t } = useLanguage();
  
  const values = [
    {
      title: "Excellence",
      description: "We hold ourselves to the highest standards in every aspect of our work, delivering exceptional quality and results.",
      icon: <Award className="w-5 h-5 text-primary" />,
    },
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative thinking to solve complex challenges and drive progress.",
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients, fostering partnerships built on open communication and shared goals.",
      icon: <Users className="w-5 h-5 text-primary" />,
    },
    {
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical principles in all our interactions and business practices.",
      icon: <Shield className="w-5 h-5 text-primary" />,
    },
    {
      title: "Results-Driven",
      description: "We focus on delivering tangible outcomes that create real business value and measurable success.",
      icon: <Target className="w-5 h-5 text-primary" />,
    },
    {
      title: "Agility",
      description: "We adapt quickly to changing markets and technologies, remaining flexible and responsive to new opportunities.",
      icon: <Zap className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 should-animate">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Our Core Values
          </h2>
          <p className="text-muted-foreground">
            These principles guide our approach and define our commitment to excellence 
            in everything we do.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              {...value}
              delay={index * 100}
            />
          ))}
        </div>
        
        <div className="mt-20 bg-secondary/30 p-8 md:p-12 rounded-xl border border-border should-animate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Our Story</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015, Trojan Envoy began with a simple mission: to bridge the gap between
                  complex technology and practical business solutions. What started as a small team
                  of dedicated developers has grown into a comprehensive digital agency.
                </p>
                <p>
                  Over the years, we've expanded our expertise to encompass the full spectrum of
                  digital services, from cutting-edge web and mobile development to strategic digital
                  marketing and sophisticated design solutions.
                </p>
                <p>
                  Today, we're proud to have worked with clients across diverse industries, helping
                  them navigate the digital landscape and achieve remarkable growth in an increasingly
                  competitive environment.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Our Approach</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At Trojan Envoy, we believe in a collaborative, transparent approach that puts our
                  clients at the center of everything we do. We take the time to understand your unique
                  challenges, goals, and vision before crafting tailored solutions.
                </p>
                <p>
                  Our methodology combines technical expertise with strategic thinking, ensuring that
                  every project delivers not just functional excellence, but also strategic value that
                  drives your business forward.
                </p>
                <p>
                  We pride ourselves on building lasting relationships with our clients, serving as
                  trusted digital partners throughout their growth journey. Our success is measured
                  by your success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
