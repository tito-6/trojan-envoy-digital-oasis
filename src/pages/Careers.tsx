import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Briefcase, 
  Users, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  Globe, 
  Clock, 
  Building
} from "lucide-react";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Careers: React.FC = () => {
  const { t } = useLanguage();
  const [activeValue, setActiveValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "Careers | Trojan Envoy";
    
    // Add animation delay
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Company values animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Company values data
  const companyValues = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "We push the boundaries of what's possible, embracing new ideas and technologies to create breakthrough solutions for our clients."
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Passion",
      description: "We're deeply passionate about our work, bringing energy and commitment to every project we undertake."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Teamwork",
      description: "We believe in the power of collaboration and diverse perspectives to drive exceptional results."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Global Mindset",
      description: "We embrace diversity and think globally, considering different cultural perspectives in our approach."
    }
  ];

  // Benefits items
  const benefitsList = [
    "Competitive salary and equity packages",
    "Health, dental, and vision insurance",
    "Unlimited paid time off",
    "Remote-first culture with flexible working hours",
    "Professional development budget",
    "Home office stipend",
    "Annual team retreats",
    "Paid parental leave",
    "Wellness programs and fitness reimbursements",
    "Catered lunches and snacks",
    "401(k) matching",
    "Ongoing education and learning opportunities"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute w-full h-full bg-gradient-to-b from-background via-background to-transparent opacity-90 z-10"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="relative w-full h-full">
                {/* Abstract patterns */}
                <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute top-[15%] right-[10%] w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
                <div className="absolute bottom-[10%] left-[20%] w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
                  Join Our Team
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Be part of a visionary team that's transforming the digital landscape and creating experiences that matter.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group" asChild>
                  <a href="#open-positions">
                    Explore Open Positions
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">
                    Learn About Us
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Mission Statement & Culture */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Our Mission & Culture</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  At Trojan Envoy, we're not just building digital products; we're crafting experiences that connect and inspire. Our mission is to create technological solutions that empower businesses to thrive in the digital age.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  We've created a culture where creativity flourishes, innovation is celebrated, and personal growth is prioritized. We believe that exceptional work comes from passionate people who love what they do and care about the impact they make.
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">Join a team of 40+ talented professionals across 12 countries</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-video"
              >
                <div className="relative z-10 bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Our team collaborating" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute bottom-6 right-6 p-4 bg-card/80 backdrop-blur-md rounded-xl border border-border/50 shadow-lg z-20 w-48">
                  <p className="text-xl font-bold">Team Retreat</p>
                  <p className="text-sm text-muted-foreground">Tokyo, Japan</p>
                </div>
                <div className="absolute -z-0 -bottom-6 -right-6 w-full h-full bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Company Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-display font-bold mb-6"
              >
                Our Values
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                These core principles guide everything we do and shape how we work together.
              </motion.p>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {companyValues.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-2xl border border-border/50 ${
                    activeValue === index ? 'bg-card ring-2 ring-primary/20' : 'bg-card/50 hover:bg-card/80'
                  } transition-all cursor-pointer`}
                  onClick={() => setActiveValue(index)}
                >
                  <div className="mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Benefits & Perks */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Benefits & Perks</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We take care of our team so they can focus on doing their best work.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefitsList.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <p>{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 gap-6"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                      alt="Team collaboration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                      alt="Office space"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                      alt="Team lunch"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                      alt="Remote work"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
                
                {/* Decorative elements */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -z-10 -top-6 -left-6 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Process/How We Work */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-display font-bold mb-6"
              >
                How We Work
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Our approach combines flexibility, transparency, and continuous improvement.
              </motion.p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="remote" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-10">
                  <TabsTrigger value="remote">Remote-First</TabsTrigger>
                  <TabsTrigger value="agile">Agile Methodology</TabsTrigger>
                  <TabsTrigger value="growth">Growth Focus</TabsTrigger>
                </TabsList>
                
                <TabsContent value="remote" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Work From Anywhere</h3>
                      <p className="text-muted-foreground mb-6">
                        We believe talent isn't confined to a single location. Our remote-first approach means you can work from anywhere in the world, with flexible hours that suit your lifestyle.
                      </p>
                      <p className="text-muted-foreground mb-6">
                        We prioritize results over hours spent at a desk, focusing on impact and collaboration regardless of time zones.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-medium">Team members across 12+ countries</p>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1588&q=80" 
                        alt="Remote work setup" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="agile" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Agile & Adaptive</h3>
                      <p className="text-muted-foreground mb-6">
                        We follow agile methodologies that allow us to adapt quickly to changing needs and deliver value incrementally. Our two-week sprints provide structure while maintaining flexibility.
                      </p>
                      <p className="text-muted-foreground mb-6">
                        Regular retrospectives help us continuously refine our processes and improve our ways of working together.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-medium">Focused daily standups that respect your time</p>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                        alt="Team meeting" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="growth" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Continuous Learning</h3>
                      <p className="text-muted-foreground mb-6">
                        We invest in your growth with dedicated learning time, conference budgets, and mentorship programs. Each team member has a personalized growth plan aligned with their career goals.
                      </p>
                      <p className="text-muted-foreground mb-6">
                        Regular knowledge-sharing sessions and tech talks keep our skills sharp and our perspectives fresh.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-medium">$2,500 annual learning budget per employee</p>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                        alt="Learning session" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Open Positions Section */}
        <section id="open-positions" className="py-20 bg-secondary/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Open Positions</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We're always looking for talented individuals to join our team. Check back soon for open positions!
                </p>
              </motion.div>

              {/* Empty state with nice illustration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card shadow-lg rounded-2xl p-10 border border-border/50 max-w-2xl mx-auto relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
                
                <div className="relative">
                  <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">No Open Positions At The Moment</h3>
                  <p className="text-muted-foreground mb-8">
                    We're growing fast and always looking for exceptional talent. Join our talent pool and we'll notify you when relevant positions become available.
                  </p>
                  
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link to="/contact">
                      Join Our Talent Pool
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Testimonials/What Our Team Says */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-display font-bold mb-6"
              >
                Meet Our Team
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Hear directly from the people who make Trojan Envoy special.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Abdullah Ismail",
                  role: "Co-founder & CEO",
                  quote: "We believe in pushing the boundaries of what's possible in digital transformation. Our team's dedication to excellence and innovation drives us to deliver exceptional results for our clients.",
                  avatar: "/images/team/abdullahismailcofounder_ceo.jpg"
                },
                {
                  name: "Ahmet",
                  role: "Chief Technology Officer",
                  quote: "Technology is more than just code – it's about creating solutions that make a real difference. At Trojan Envoy, we're committed to staying at the forefront of innovation while maintaining the highest standards of quality.",
                  avatar: "/images/team/ahmetcto.jpg"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground flex-grow">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl font-display font-bold mb-6">Ready to Join Our Team?</h2>
                    <p className="text-muted-foreground mb-8">
                      Even if you don't see an open position that matches your skills, we'd love to hear from you. Send us your resume and tell us why you'd be a great fit for our team.
                    </p>
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                      <Link to="/contact">
                        Get in Touch
                        <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                
                <div className="relative h-full min-h-[300px]">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                    alt="Team collaboration" 
                    className="absolute w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 mix-blend-multiply"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
