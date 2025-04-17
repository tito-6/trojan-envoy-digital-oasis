
import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Rocket, 
  Code, 
  PenTool, 
  Database, 
  Target 
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-secondary/30 p-6 rounded-xl border border-border hover:shadow-lg transition-all group"
  >
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 text-primary mr-4 group-hover:scale-110 transition-transform" />
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const WhatIsTrojanEnvoy: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Globe,
      title: "Global Digital Solutions",
      description: "We transform businesses worldwide with cutting-edge technology and strategic digital solutions."
    },
    {
      icon: Rocket,
      title: "Innovation Accelerator",
      description: "Our team drives digital transformation, helping businesses stay ahead in the rapidly evolving tech landscape."
    },
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "From web and mobile apps to complex enterprise solutions, we deliver high-quality, scalable software."
    },
    {
      icon: PenTool,
      title: "Design Excellence",
      description: "We create intuitive, beautiful user experiences that engage and delight users across all platforms."
    },
    {
      icon: Database,
      title: "Data-Driven Strategies",
      description: "Leveraging data analytics and AI to provide insights that drive business growth and efficiency."
    },
    {
      icon: Target,
      title: "Strategic Partnership",
      description: "We don't just deliver projects; we become strategic partners in your digital transformation journey."
    }
  ];

  return (
    <section className="container mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          What is Trojan Envoy?
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A premier digital innovation agency dedicated to transforming businesses through advanced technology, strategic marketing, and design excellence.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center mt-12"
      >
        <h3 className="text-2xl font-semibold mb-4">
          Our Mission
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Empower businesses to thrive in the digital age by providing innovative, tailored technology solutions that drive growth, efficiency, and competitive advantage.
        </p>
      </motion.div>
    </section>
  );
};

export default WhatIsTrojanEnvoy;
