import React, { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, Lightbulb, Sparkles, PlusCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Enhanced floating element component
const FloatingElement = ({ children, delay = 0, duration = 6, offsetY = 10, className = "" }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [-offsetY/2, offsetY/2, -offsetY/2],
      }}
      transition={{ 
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Enhanced FAQ component with 3D effects and animations
const HomeFAQ: React.FC = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: "What services does Trojan Envoy offer?",
      answer: "We offer comprehensive digital solutions including web development, mobile app development, UI/UX design, and digital marketing services tailored to your business needs.",
      icon: <Sparkles className="w-5 h-5 text-primary" />
    },
    {
      question: "How long does it take to complete a website project?",
      answer: "Project timelines vary based on complexity. Simple websites typically take 2-4 weeks, while larger projects may take 2-6 months. We'll provide a specific timeline after understanding your requirements.",
      icon: <PlusCircle className="w-5 h-5 text-purple-500" />
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes! We offer various maintenance and support packages to keep your digital products secure, up-to-date, and performing optimally.",
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />
    },
    {
      question: "What is your approach to project management?",
      answer: "We follow agile methodologies with regular client communication and iterative development cycles to ensure transparency and alignment throughout the project.",
      icon: <Star className="w-5 h-5 text-emerald-500" />
    }
  ];

  const handleAccordionChange = (value: string) => {
    setExpandedFaq(expandedFaq === value ? null : value);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      <FloatingElement
        delay={0.5}
        duration={7}
        offsetY={15}
        className="absolute top-1/4 left-[10%] w-16 h-16 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"
      />
      <FloatingElement
        delay={0.2}
        duration={8}
        offsetY={10}
        className="absolute bottom-1/4 right-[10%] w-20 h-20 rounded-full bg-purple-500/10 blur-2xl pointer-events-none"
      />
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary mb-4 text-sm font-medium"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>FAQ</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate"
          >
            {t('faq.title')}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground should-animate"
          >
            {t('faq.subtitle')}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto relative"
        >
          {/* 3D-style card effect for FAQ container */}
          <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/20 rounded-2xl transform rotate-1 scale-[1.02] -z-10 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-background to-purple-500/10 rounded-2xl transform -rotate-1 scale-[1.01] -z-20 opacity-60"></div>
          
          <Accordion 
            type="single" 
            collapsible 
            className="w-full bg-card/50 backdrop-blur-sm rounded-xl p-1 sm:p-2 shadow-lg border border-border/50"
            value={expandedFaq || ""}
            onValueChange={handleAccordionChange}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={`faq-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="group border-border/50 overflow-hidden mb-2 last:mb-0 bg-background/40 backdrop-blur-sm rounded-lg hover:bg-background/70 transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-medium px-5 py-4 group-data-[state=open]:bg-gradient-to-r group-data-[state=open]:from-primary/5 group-data-[state=open]:to-purple-500/5 transition-colors">
                    <div className="flex items-center">
                      <span className="mr-3">{faq.icon}</span>
                      <span className="group-data-[state=open]:text-primary group-data-[state=open]:font-semibold transition-colors">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AnimatePresence>
                    <AccordionContent className="text-muted-foreground px-5 pb-4 pt-1">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.answer}
                      </motion.div>
                    </AccordionContent>
                  </AnimatePresence>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
          
          <div className="text-center mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link to="/faq">
                <Button 
                  variant="outline"
                  className="group border-primary/30 hover:bg-primary/5 hover:border-primary transition-all py-2 px-5"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 font-medium">
                    View all FAQs
                  </span>
                  <ArrowRight className="h-4 w-4 ml-2 text-primary transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFAQ;
