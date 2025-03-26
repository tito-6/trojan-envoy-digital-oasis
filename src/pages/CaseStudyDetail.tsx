
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { ArrowLeft, Calendar, User, Tag, CheckCircle, ExternalLink } from "lucide-react";

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  industry: string;
  services: string[];
  challenge: string;
  solution: string;
  results: string;
  image: string;
  slug: string;
  fullDescription?: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  technologies?: string[];
  duration?: string;
  date?: string;
  resultMetrics?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "E-commerce Platform Redesign",
    client: "GlobalShop",
    industry: "Retail",
    services: ["Web Development", "UI/UX Design", "Digital Marketing"],
    challenge: "GlobalShop faced declining conversion rates and customer complaints about their outdated e-commerce platform. Their legacy system was slow, not mobile-friendly, and had a complicated checkout process.",
    solution: "We redesigned the entire e-commerce platform with a focus on user experience, mobile responsiveness, and checkout simplification. We implemented a modern tech stack with React for the frontend and optimized the entire infrastructure for speed.",
    results: "Within 3 months, GlobalShop saw a 45% increase in conversion rates, 30% reduction in cart abandonment, and 60% increase in mobile sales. Overall revenue increased by 28% year-over-year.",
    image: "https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    slug: "globalshop-ecommerce-redesign",
    fullDescription: "GlobalShop, a leading retailer with over 500 products and a customer base spanning 15 countries, approached us with a critical challenge. Their decade-old e-commerce platform was causing significant business problems: declining conversion rates, high cart abandonment, and increasing customer complaints about usability, especially on mobile devices.\n\nOur team conducted thorough user research, including user interviews, heatmap analysis, and competitor benchmarking. We identified key pain points in the customer journey and developed a comprehensive redesign strategy focusing on three main pillars: user experience enhancement, mobile optimization, and performance improvement.\n\nThe solution included a complete frontend rebuild using React.js with a component-based architecture for scalability. We simplified the navigation structure, reduced the checkout process from 5 steps to 2, implemented an intelligent product recommendation engine, and created a responsive design that works flawlessly across all devices. On the backend, we optimized the database queries, implemented caching strategies, and moved to a cloud-based infrastructure for better scalability.\n\nThe results exceeded the client's expectations. Within just three months after launch, GlobalShop experienced a 45% increase in conversion rates, a 30% reduction in cart abandonment, and a 60% increase in mobile sales. Overall revenue increased by 28% year-over-year, customer satisfaction scores improved by 40%, and page load times decreased by 70%, dropping from 6 seconds to under 2 seconds.",
    testimonial: {
      quote: "The redesign completely transformed our business. Not only did we see immediate improvements in our metrics, but our team also gained a platform that can grow with us for years to come. The attention to detail and commitment to understanding our specific needs made all the difference.",
      author: "Sarah Johnson",
      position: "CEO at GlobalShop"
    },
    technologies: ["React", "Node.js", "MongoDB", "AWS", "Redis", "Stripe", "Cloudflare"],
    duration: "4 months",
    date: "January 2023",
    resultMetrics: [
      { label: "Conversion Rate Increase", value: "45%" },
      { label: "Cart Abandonment Reduction", value: "30%" },
      { label: "Mobile Sales Increase", value: "60%" },
      { label: "Revenue Growth", value: "28%" }
    ]
  },
  {
    id: 2,
    title: "Healthcare Mobile App Development",
    client: "MedConnect",
    industry: "Healthcare",
    services: ["Mobile Development", "UI/UX Design", "API Integration"],
    challenge: "MedConnect needed a secure, HIPAA-compliant mobile app to connect patients with healthcare providers, schedule appointments, and manage medical records. They had strict requirements for security and ease of use.",
    solution: "We developed native iOS and Android applications with end-to-end encryption, biometric authentication, and intuitive interfaces. The app integrated with their existing systems and electronic health records (EHR) via secure APIs.",
    results: "The app achieved 50,000+ downloads in the first month, reduced appointment no-shows by 35%, and earned a 4.8/5 rating on app stores. Patient satisfaction scores increased by 40%.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    slug: "medconnect-healthcare-app",
    fullDescription: "MedConnect, a leading healthcare provider network serving over 200,000 patients across 50 hospitals and clinics, approached us with a significant challenge. They needed a secure, HIPAA-compliant mobile application that would streamline patient-provider communication, simplify appointment scheduling, and provide secure access to medical records, all while meeting stringent security and compliance requirements.\n\nOur team began with comprehensive stakeholder interviews, including patients, doctors, nurses, and administrators, to understand the full scope of needs and pain points. We developed detailed user personas and journey maps to guide our design process, ensuring the solution would be intuitive for users of all ages and technical abilities.\n\nThe development process included creating native applications for both iOS and Android platforms to ensure optimal performance and security. Key features implemented included end-to-end encryption for all data transmission, biometric authentication for secure access, real-time appointment scheduling with calendar integration, secure messaging between patients and providers, medical record access and sharing capabilities, medication reminders, and telemedicine video consultation functionality.\n\nIntegration was a critical component, with the app connecting seamlessly to MedConnect's existing Electronic Health Record (EHR) system, laboratory information systems, and billing platforms through secure APIs. We implemented advanced security measures including HIPAA-compliant data storage, regular security audits, and comprehensive access controls.\n\nThe results were transformative for MedConnect. The app achieved over 50,000 downloads in the first month, with an impressive 4.8/5 star rating across app stores. Appointment no-shows decreased by 35%, saving an estimated $2.1 million annually. Patient satisfaction scores increased by 40%, and the telemedicine feature reduced unnecessary in-person visits by 25%. Staff reported saving an average of 5 hours per week on administrative tasks, allowing more focus on patient care.",
    testimonial: {
      quote: "This app has revolutionized how we deliver care. Our patients love the convenience, and our staff appreciate the reduction in administrative burden. The security features give everyone peace of mind, and the intuitive design means we've seen adoption across all age groups.",
      author: "Dr. Michael Chen",
      position: "Chief Medical Officer at MedConnect"
    },
    technologies: ["Swift", "Kotlin", "Firebase", "FHIR API", "OAuth 2.0", "WebRTC", "AWS"],
    duration: "6 months",
    date: "March 2023",
    resultMetrics: [
      { label: "App Downloads", value: "50,000+" },
      { label: "App Store Rating", value: "4.8/5" },
      { label: "No-show Reduction", value: "35%" },
      { label: "Patient Satisfaction Increase", value: "40%" }
    ]
  },
  {
    id: 3,
    title: "Digital Marketing Campaign",
    client: "EcoFriendly",
    industry: "Sustainable Products",
    services: ["Digital Marketing", "Social Media", "Content Strategy"],
    challenge: "EcoFriendly, a sustainable products brand, struggled with brand awareness and reaching their target audience despite having high-quality eco-friendly products. Their digital presence was minimal with low engagement.",
    solution: "We developed a comprehensive digital marketing strategy focusing on content marketing, influencer partnerships, and targeted social media campaigns. We created compelling storytelling around their sustainability mission and products.",
    results: "Within 6 months, EcoFriendly saw a 300% increase in social media followers, 250% increase in website traffic, and 85% increase in online sales. Their customer acquisition cost decreased by 40%.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    slug: "ecofriendly-digital-marketing",
    fullDescription: "EcoFriendly, a startup dedicated to sustainable home and personal care products, faced significant challenges in market penetration despite offering innovative eco-friendly alternatives to conventional products. With limited brand recognition and a modest marketing budget, they struggled to connect with environmentally conscious consumers and convert awareness into sales.\n\nOur team began with comprehensive market research, including competitor analysis, target audience profiling, and keyword research. We identified key market gaps and opportunities, crafting a digital marketing strategy built around authentic storytelling and educational content that highlighted both the environmental benefits and the effectiveness of EcoFriendly's products.\n\nThe execution included a multi-channel approach: We developed a content marketing calendar focused on sustainability education, practical tips, and product spotlights. We redesigned their website with conversion optimization in mind and implemented SEO best practices. We identified and partnered with micro-influencers in the sustainability space for authentic product reviews and demonstrations. We created targeted social media campaigns across Instagram, Facebook, Pinterest, and TikTok with platform-specific content. We launched a newsletter featuring sustainability tips and exclusive offers. And we implemented Google Ads and retargeting campaigns focused on high-intent keywords.\n\nThe results transformed EcoFriendly's business trajectory. Within six months, they saw a 300% increase in social media followers across platforms and a 250% increase in website traffic. Online sales grew by 85%, with a 40% decrease in customer acquisition costs. Their email list grew from 2,000 to 15,000 subscribers, with an average open rate of 28%. Organic search visibility improved by 200%, bringing in sustainable traffic. Most importantly, EcoFriendly established itself as a thought leader in the sustainable products space, with content regularly shared by environmental organizations and influencers.",
    testimonial: {
      quote: "The digital marketing campaign completely transformed our business. Not only did we see immediate growth in followers and sales, but we've established ourselves as a respected voice in the sustainability conversation. The team's understanding of both digital marketing and the eco-friendly market made all the difference.",
      author: "Emma Lewis",
      position: "Founder & CEO of EcoFriendly"
    },
    technologies: ["Google Analytics", "Hootsuite", "Mailchimp", "Shopify", "SEMrush", "Canva", "Meta Ads"],
    duration: "6 months",
    date: "May 2023",
    resultMetrics: [
      { label: "Social Media Growth", value: "300%" },
      { label: "Website Traffic Increase", value: "250%" },
      { label: "Sales Growth", value: "85%" },
      { label: "CAC Reduction", value: "40%" }
    ]
  }
];

const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Find the case study with the matching slug
    const study = caseStudies.find(s => s.slug === slug);
    setCaseStudy(study || null);
    
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    if (study) {
      document.title = `${study.title} | Case Study`;
    } else {
      document.title = "Case Study Not Found";
    }
  }, [slug]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Case Study Not Found</h1>
            <p className="mb-8">The case study you're looking for doesn't exist or may have been moved.</p>
            <Link 
              to="/case-studies" 
              className="inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              to="/case-studies" 
              className="inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </div>
          
          {/* Hero Section */}
          <div className="mb-12">
            <div className="bg-secondary/50 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">
              {caseStudy.industry}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8">{caseStudy.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Client: <strong>{caseStudy.client}</strong></span>
              </div>
              {caseStudy.date && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Completed: <strong>{caseStudy.date}</strong></span>
                </div>
              )}
              {caseStudy.duration && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Duration: <strong>{caseStudy.duration}</strong></span>
                </div>
              )}
            </div>
            
            <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
              <img 
                src={caseStudy.image} 
                alt={caseStudy.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground mb-8">{caseStudy.fullDescription || caseStudy.challenge}</p>
                
                <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                <p className="text-muted-foreground mb-8">{caseStudy.challenge}</p>
                
                <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
                <p className="text-muted-foreground mb-8">{caseStudy.solution}</p>
                
                <h2 className="text-2xl font-bold mb-4">Results</h2>
                <p className="text-muted-foreground mb-8">{caseStudy.results}</p>
              </div>
              
              {/* Result Metrics */}
              {caseStudy.resultMetrics && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {caseStudy.resultMetrics.map((metric, index) => (
                      <div 
                        key={index} 
                        className="bg-card p-6 rounded-xl border border-border card-hover"
                      >
                        <div className="text-3xl font-bold mb-2">{metric.value}</div>
                        <div className="text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Testimonial */}
              {caseStudy.testimonial && (
                <div className="mt-12 bg-secondary/30 p-8 rounded-xl">
                  <blockquote className="relative">
                    <p className="text-lg italic mb-4">"{caseStudy.testimonial.quote}"</p>
                    <footer>
                      <div className="font-semibold">{caseStudy.testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{caseStudy.testimonial.position}</div>
                    </footer>
                  </blockquote>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-card border border-border p-6 rounded-xl sticky top-32 card-hover">
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Services Provided</h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.services.map(service => (
                        <span key={service} className="bg-secondary text-sm px-3 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {caseStudy.technologies && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.technologies.map(tech => (
                          <span key={tech} className="bg-primary/10 text-sm px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center w-full justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Start Your Project
                    </Link>
                  </div>
                  
                  <div>
                    <Link
                      to="/case-studies"
                      className="inline-flex items-center w-full justify-center bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                    >
                      View More Case Studies
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseStudyDetail;
