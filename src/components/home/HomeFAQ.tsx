
import React from "react";
import { useLanguage } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomeFAQ: React.FC = () => {
  const { t } = useLanguage();

  const faqs = [
    {
      question: "What services does Trojan Envoy offer?",
      answer: "We offer comprehensive digital solutions including web development, mobile app development, UI/UX design, and digital marketing services tailored to your business needs."
    },
    {
      question: "How long does it take to complete a website project?",
      answer: "Project timelines vary based on complexity. Simple websites typically take 2-4 weeks, while larger projects may take 2-6 months. We'll provide a specific timeline after understanding your requirements."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes! We offer various maintenance and support packages to keep your digital products secure, up-to-date, and performing optimally."
    },
    {
      question: "What is your approach to project management?",
      answer: "We follow agile methodologies with regular client communication and iterative development cycles to ensure transparency and alignment throughout the project."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 should-animate">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground should-animate">
            {t('faq.subtitle')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="should-animate">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-10">
            <Link 
              to="/faq"
              className="inline-flex items-center gap-2 font-medium hover:text-primary transition-colors"
            >
              View all FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
