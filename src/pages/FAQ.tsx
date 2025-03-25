
import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "FAQ | Trojan Envoy";
  }, []);

  const faqs: FAQItem[] = [
    {
      question: "What services does Trojan Envoy offer?",
      answer: "Trojan Envoy offers a comprehensive range of digital services including web development, mobile app development, UI/UX design, and digital marketing. We specialize in creating custom solutions tailored to your specific business needs.",
      category: "services"
    },
    {
      question: "How long does it typically take to complete a website project?",
      answer: "The timeline for website projects varies depending on the complexity and scope. A simple website might take 2-4 weeks, while more complex platforms can take 2-6 months. During our initial consultation, we'll provide a more accurate timeline based on your specific requirements.",
      category: "services"
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is project-based and depends on the scope, complexity, and timeline of your specific needs. We provide detailed quotes after understanding your requirements during the initial consultation. We also offer flexible payment options and milestone-based billing.",
      category: "pricing"
    },
    {
      question: "Do you offer ongoing maintenance and support?",
      answer: "Yes, we offer various maintenance and support packages to keep your digital products up-to-date, secure, and performing optimally. These can include regular updates, security monitoring, content updates, and technical support.",
      category: "services"
    },
    {
      question: "How do you handle revisions during the design process?",
      answer: "We include a specified number of revision rounds in our project agreements. Our collaborative approach means we work closely with you throughout the process to ensure your vision is implemented correctly. Additional revisions beyond the agreed scope can be accommodated at an hourly rate.",
      category: "process"
    },
    {
      question: "What technologies do you use for development?",
      answer: "We use modern, industry-standard technologies that ensure performance, security, and scalability. For web development, we commonly use React, Vue.js, Node.js, and PHP/Laravel. For mobile apps, we develop using React Native, Swift, and Kotlin. Our specific technology choices are based on your project requirements.",
      category: "technical"
    },
    {
      question: "Can you help with improving my website's SEO?",
      answer: "Absolutely! SEO is a core component of our web development and digital marketing services. We implement SEO best practices in all our projects and offer specialized SEO services including keyword research, on-page optimization, technical SEO, and content strategy.",
      category: "marketing"
    },
    {
      question: "Do you build e-commerce websites?",
      answer: "Yes, we specialize in building custom e-commerce solutions as well as implementing platforms like Shopify, WooCommerce, and Magento. Our e-commerce solutions include secure payment processing, inventory management, and optimized checkout experiences.",
      category: "services"
    },
    {
      question: "How do you ensure the security of websites and applications?",
      answer: "Security is a top priority in all our development projects. We implement industry best practices such as secure authentication, data encryption, regular security updates, and protection against common vulnerabilities. We also conduct security testing before launch.",
      category: "technical"
    },
    {
      question: "What is your process for developing a new project?",
      answer: "Our development process includes discovery and planning, design, development, testing and quality assurance, launch, and post-launch support. We follow agile methodologies with regular client communication and iterative development cycles to ensure the final product meets your expectations.",
      category: "process"
    },
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "services", name: "Services" },
    { id: "pricing", name: "Pricing" },
    { id: "process", name: "Process" },
    { id: "technical", name: "Technical" },
    { id: "marketing", name: "Marketing" },
  ];

  // Filter FAQs based on search query and active category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{t('faq.title')}</h1>
            <p className="text-xl text-muted-foreground">
              {t('faq.subtitle')}
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">No matching questions found. Try a different search term.</p>
              </div>
            )}
            
            {/* Contact CTA */}
            <div className="mt-12 pt-8 border-t border-border text-center">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                If you couldn't find the answer you were looking for, please contact us directly.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
