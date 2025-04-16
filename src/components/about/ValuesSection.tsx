import React, { useRef } from "react";
import { Target, Award, Users, Zap, Shield, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import { motion, useInView } from "framer-motion";

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  color: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon, delay, color }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: delay * 0.1 }}
    >
      <Card className="border-border overflow-hidden relative group h-full">
        {/* Colored border accent */}
        <div className={`absolute top-0 left-0 w-full h-1 ${color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
        
        <CardContent className="p-8 flex flex-col items-center text-center h-full">
          <motion.div
            className={`w-16 h-16 rounded-full ${color.replace('bg-', 'bg-').replace('600', '100')} flex items-center justify-center mb-6 relative`}
            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pulsing ring effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${color.replace('bg-', 'bg-').replace('600', '200')} opacity-50`}
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative z-10">
              {React.cloneElement(icon as React.ReactElement, { 
                className: `w-7 h-7 ${color.replace('bg-', 'text-')}` 
              })}
            </div>
          </motion.div>
          
          <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          
          {/* Hover reveal effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ValuesSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const values = [
    {
      title: "Excellence",
      description: "We hold ourselves to the highest standards in every aspect of our work, delivering exceptional quality and results.",
      icon: <Award />,
      color: "bg-blue-600",
    },
    {
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative thinking to solve complex challenges and drive progress.",
      icon: <Lightbulb />,
      color: "bg-purple-600",
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients, fostering partnerships built on open communication and shared goals.",
      icon: <Users />,
      color: "bg-green-600",
    },
    {
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical principles in all our interactions and business practices.",
      icon: <Shield />,
      color: "bg-indigo-600",
    },
    {
      title: "Results-Driven",
      description: "We focus on delivering tangible outcomes that create real business value and measurable success.",
      icon: <Target />,
      color: "bg-orange-600",
    },
    {
      title: "Agility",
      description: "We adapt quickly to changing markets and technologies, remaining flexible and responsive to new opportunities.",
      icon: <Zap />,
      color: "bg-cyan-600",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 relative" id="our-values">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-[100px] top-[20%] left-[10%]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 blur-[100px] bottom-[30%] right-[5%]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            Our Philosophy
          </motion.span>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 relative inline-block">
              Our Core Values
              <motion.span
                className="absolute -bottom-1 left-0 h-1 bg-primary/50 rounded-full w-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              />
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            These principles guide our approach and define our commitment to excellence 
            in everything we do.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              {...value}
              delay={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-24 bg-gradient-to-br from-secondary/70 via-secondary/30 to-background p-10 rounded-2xl border border-border relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
          
          {/* Floating accent shapes */}
          <motion.div
            className="absolute w-40 h-40 rounded-full bg-primary/5 blur-3xl -top-20 -left-20"
            animate={{ 
              x: [0, 10, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-40 h-40 rounded-full bg-purple-500/5 blur-3xl -bottom-20 -right-20"
            animate={{ 
              x: [0, -10, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            <div>
              <motion.h3 
                className="text-2xl md:text-3xl font-display font-bold mb-6 relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                Our Story
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary/50 w-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.7, delay: 1 }}
                />
              </motion.h3>
              <div className="space-y-4 text-muted-foreground">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                >
                  <span className="text-foreground font-medium">Founded in 2015</span>, Trojan Envoy began with a simple mission: to bridge the gap between
                  complex technology and practical business solutions. What started as a small team
                  of dedicated developers has grown into a comprehensive digital agency.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                >
                  Over the years, we've expanded our expertise to encompass the full spectrum of
                  digital services, from cutting-edge web and mobile development to strategic digital
                  marketing and sophisticated design solutions.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 1 }}
                >
                  Today, we're proud to have worked with clients across diverse industries, helping
                  them navigate the digital landscape and achieve remarkable growth in an increasingly
                  competitive environment.
                </motion.p>
              </div>
            </div>
            
            <div>
              <motion.h3 
                className="text-2xl md:text-3xl font-display font-bold mb-6 relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                Our Approach
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary/50 w-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.7, delay: 1.1 }}
                />
              </motion.h3>
              <div className="space-y-4 text-muted-foreground">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                >
                  At Trojan Envoy, we believe in a <span className="text-foreground font-medium">collaborative, transparent approach</span> that puts our
                  clients at the center of everything we do. We take the time to understand your unique
                  challenges, goals, and vision before crafting tailored solutions.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 1 }}
                >
                  Our methodology combines <span className="text-foreground font-medium">technical expertise with strategic thinking</span>, ensuring that
                  every project delivers not just functional excellence, but also strategic value that
                  drives your business forward.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 1.1 }}
                >
                  We pride ourselves on building lasting relationships with our clients, serving as
                  trusted digital partners throughout their growth journey. Our success is measured
                  by your success.
                </motion.p>
              </div>
            </div>
          </div>
          
          {/* Interactive element */}
          <motion.div
            className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center opacity-70 cursor-pointer group"
            whileHover={{ scale: 1.2, opacity: 0.9 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.7, scale: 1, rotate: 360 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <motion.div
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Zap />
            </motion.div>
            
            {/* Pulsing effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
