import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaXTwitter, FaFacebook, FaGithub } from "react-icons/fa6";
import { Linkedin, Facebook, Mail, ChevronLeft, ChevronRight, Sparkles, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import cn from "classnames";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedIn: string;
  facebook: string;
  github: string;
  delay: number;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  total: number;
}

const TeamMember: React.FC<TeamMemberProps> = ({ 
  name, role, bio, image, linkedIn, facebook, github, delay, index, activeIndex, setActiveIndex, total 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  
  const isActive = index === activeIndex;
  const isPrev = (index === activeIndex - 1) || (activeIndex === 0 && index === total - 1);
  const isNext = (index === activeIndex + 1) || (activeIndex === total - 1 && index === 0);
  
  const gradients = [
    "from-blue-500/10 to-purple-600/10",
    "from-purple-500/10 to-pink-500/10",
    "from-cyan-500/10 to-blue-500/10",
    "from-emerald-500/10 to-teal-500/10",
    "from-orange-500/10 to-amber-500/10"
  ];
  
  const gradient = gradients[index % gradients.length];
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "absolute transform transition-all duration-500 ease-out",
        isActive ? "z-30 scale-100 opacity-100" : 
        isPrev || isNext ? "z-20 opacity-60 cursor-pointer" :
        "opacity-0 pointer-events-none"
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isActive ? 1 : isPrev || isNext ? 0.6 : 0,
        y: 0,
        x: isActive ? '-50%' : isPrev ? '-80%' : isNext ? '-20%' : '-50%',
        scale: isActive ? 1 : 0.8
      }}
      transition={{ duration: 0.7, delay: delay * 0.1 }}
      style={{ 
        left: '50%',
        top: '50%',
        translateY: '-50%'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isActive && setActiveIndex(index)}
    >
      <Card className={cn(
        "w-[300px] sm:w-[350px] md:w-[400px] overflow-hidden transition-shadow duration-500",
        isActive ? "shadow-2xl shadow-primary/20" : "hover:shadow-xl"
      )}>
        <div className="relative aspect-[3/4]">
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/20 to-background z-10"></div>
          <motion.img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            animate={isHovered && isActive ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fff1_1px,transparent_1px)] bg-[size:10px_10px] mix-blend-soft-light opacity-30 z-10"></div>
          
          <motion.div 
            className={cn("absolute inset-0 bg-gradient-to-t opacity-60 z-10", gradient)}
            animate={isHovered && isActive ? { opacity: 0.4 } : { opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          />
          
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-6 z-20"
            animate={isHovered && isActive ? { y: 0 } : { y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-white"
              animate={isHovered && isActive ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-display font-bold text-white mb-1">{name}</h3>
              <p className="text-primary/90 font-medium">{role}</p>
            </motion.div>
          </motion.div>
        </div>
        
        <CardContent className="p-6">
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{bio}</p>
                
                <div className="flex items-center gap-2 mt-4">
                  <motion.a 
                    href={linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </motion.a>
                  <motion.a 
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaFacebook className="w-4 h-4" />
                  </motion.a>
                  <motion.a 
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaGithub className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TeamSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const teamMembers = [
    {
      name: "Abdullah Ismail",
      role: "Co-founder & CEO",
      image: "/images/team/abdullahismailcofounder_ceo.jpg",
      bio: "A visionary leader with a deep understanding of digital transformation, Abdullah brings over a decade of experience in technology and business strategy. His passion for innovation and commitment to excellence has been instrumental in shaping Trojan Envoy's success and culture of continuous improvement.",
      linkedIn: "https://www.linkedin.com/in/abdullah-ismail-54788baa/",
      facebook: "https://www.facebook.com/AbdullahIsmail91",
      github: "https://github.com/abdullahismail91"
    },
    {
      name: "Ahmet",
      role: "Chief Technology Officer",
      image: "/images/team/ahmetcto.jpg",
      bio: "As CTO, Ahmet leads our technical strategy and innovation initiatives. With extensive experience in software architecture and emerging technologies, he ensures Trojan Envoy stays at the cutting edge of digital solutions. His expertise in AI, cloud computing, and enterprise systems drives our technological excellence.",
      linkedIn: "https://www.linkedin.com/in/ahmed-alkhalid-53116424b/",
      facebook: "https://www.facebook.com/ahmetelhalit01",
      github: "https://github.com/tito-6"
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] -top-[250px] -left-[250px]"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px] -bottom-[250px] -right-[250px]"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Our Team
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-display font-bold mb-6 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Meet Our Experts
            <motion.span
              className="absolute bottom-0 left-0 h-1 bg-primary/50 rounded-full w-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            />
          </motion.h2>
          
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            The talented individuals behind our success, bringing diverse expertise 
            and shared passion to every project.
          </motion.p>
        </motion.div>
        
        {/* Carousel display */}
        <div className="relative h-[600px] mb-20">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={member.name}
              {...member}
              delay={index}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              total={teamMembers.length}
            />
          ))}
          
          {/* Navigation controls */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-2 z-20">
            {/* Dots indicator */}
            <div className="flex gap-2 items-center bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
              {teamMembers.map((_, idx) => (
                <motion.button
                  key={idx}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    idx === activeIndex ? 'bg-primary' : 'bg-secondary/50'
                  )}
                  onClick={() => setActiveIndex(idx)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>
          
          {/* Arrow controls */}
          <motion.button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg text-primary"
            onClick={prevSlide}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg text-primary"
            onClick={nextSlide}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Join Our Team Section */}
        <motion.div 
          className="mt-36 pt-20 text-center relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent via-primary/30 to-primary/50"></div>
          
          <div className="relative inline-block mb-6">
            <motion.div
              className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-70"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <div className="relative bg-background/80 backdrop-blur rounded-lg p-2 flex items-center gap-2">
              <Sparkles className="text-primary w-5 h-5" />
              <span className="font-semibold text-primary">We're Hiring!</span>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 relative inline-block">
            Join Our Innovative Team
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-purple-500/40 to-blue-500/40 rounded-full"></div>
          </h3>
          
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            We're always looking for talented individuals to join our growing team. 
            Check out our current openings or send us your resume.
          </p>
          
          <Link
            to="/careers"
            className="group relative inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium overflow-hidden"
          >
            <span className="relative z-10">View Open Positions</span>
            
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%] bg-[position:0%] group-hover:bg-[position:100%] transition-[background-position] duration-500"></div>
            
            {/* Shine effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-[left] duration-700 ease-in-out"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;