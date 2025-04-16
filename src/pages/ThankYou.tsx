
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Home, Mail, Calendar, Sparkles, Star, Download, ExternalLink, Heart } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface LocationState {
  email?: string;
  name?: string;
}

// Custom animated cursor component
const AnimatedCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Apply cursor position with a slight delay for smooth following effect
  useEffect(() => {
    if (cursorRef.current) {
      const updateCursor = () => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
        }
      };
      
      requestAnimationFrame(updateCursor);
    }
  }, [position]);

  return (
    <div className="hidden md:block">
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className={`fixed pointer-events-none z-50 mix-blend-difference ${isPointer ? 'scale-150' : 'scale-100'}`}
        style={{
          left: -20,
          top: -20,
          translateX: position.x,
          translateY: position.y,
          transition: 'transform 0.05s ease-out'
        }}
      >
        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all duration-300 ${isPointer ? 'scale-75 opacity-70' : ''}`} />
      </motion.div>
      
      {/* Trailing effect */}
      <div
        className="fixed pointer-events-none z-40 w-6 h-6 rounded-full bg-white/25 blur-sm"
        style={{
          left: -12,
          top: -12,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
    </div>
  );
};

// Particle effect background
const ParticleBackground: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const particlesContainer = particlesRef.current;
    if (!particlesContainer) return;
    
    // Create particles
    const particleCount = 50;
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full bg-primary/30 dark:bg-primary/20';
      
      // Random size between 2px and 8px
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random initial position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Set random velocities
      const vx = (Math.random() - 0.5) * 0.1;
      const vy = (Math.random() - 0.5) * 0.1;
      
      particle.dataset.vx = String(vx);
      particle.dataset.vy = String(vy);
      
      particlesContainer.appendChild(particle);
      particles.push(particle);
    }
    
    // Animation loop for particles
    let animationId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      particles.forEach(particle => {
        const rect = particlesContainer.getBoundingClientRect();
        const x = parseFloat(particle.style.left);
        const y = parseFloat(particle.style.top);
        const vx = parseFloat(particle.dataset.vx || "0");
        const vy = parseFloat(particle.dataset.vy || "0");
        
        let newX = x + vx * deltaTime;
        let newY = y + vy * deltaTime;
        
        // Bounce off walls
        if (newX < 0 || newX > 100) {
          particle.dataset.vx = String(-vx);
          newX = x;
        }
        
        if (newY < 0 || newY > 100) {
          particle.dataset.vy = String(-vy);
          newY = y;
        }
        
        particle.style.left = `${newX}%`;
        particle.style.top = `${newY}%`;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      particles.forEach(p => p.remove());
    };
  }, []);
  
  return (
    <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-1/4 w-1/2 aspect-square rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl opacity-70 animate-float"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 aspect-square rounded-full bg-gradient-to-br from-secondary/10 via-accent/10 to-transparent blur-3xl opacity-70 animate-float delay-1000"></div>
    </div>
  );
};

// Animated confetti explosion
const ConfettiExplosion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Confetti settings
    const confettiCount = 200;
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#f43f5e'];
    
    const confetti: {
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      angle: number;
      spin: number;
      shape: 'circle' | 'square' | 'triangle';
    }[] = [];
    
    // Generate confetti particles
    for (let i = 0; i < confettiCount; i++) {
      const shape = Math.random() > 0.6 ? 'circle' : Math.random() > 0.5 ? 'square' : 'triangle';
      
      confetti.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 8,
        shape
      });
    }
    
    // Animate confetti
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let stillVisible = false;
      
      confetti.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.angle * Math.PI) / 180);
        
        ctx.fillStyle = particle.color;
        
        if (particle.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.shape === 'square') {
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        } else {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -particle.size / 2);
          ctx.lineTo(particle.size / 2, particle.size / 2);
          ctx.lineTo(-particle.size / 2, particle.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply gravity
        particle.vy += 0.1;
        
        // Apply air resistance
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Update angle
        particle.angle += particle.spin;
        
        // Check if still on screen
        if (
          particle.x > -100 &&
          particle.x < canvas.width + 100 &&
          particle.y > -100 &&
          particle.y < canvas.height + 100
        ) {
          stillVisible = true;
        }
      });
      
      if (stillVisible) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Hide canvas when animation is complete
        setShowConfetti(false);
      }
    };
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (!showConfetti) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 0.8 }}
    />
  );
};

// Interactive Thank You Badge
const ThankYouBadge: React.FC<{ name?: string }> = ({ name }) => {
  const badgeControls = useAnimation();
  const [clicked, setClicked] = useState(false);
  
  const handleClick = async () => {
    setClicked(true);
    
    // Play a sequence of animations
    await badgeControls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 }
    });
    
    await badgeControls.start({
      y: [0, -20, 0],
      transition: { duration: 0.5, type: "spring", stiffness: 300, damping: 10 }
    });
  };
  
  return (
    <motion.div
      className="relative cursor-pointer"
      animate={badgeControls}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Star burst background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-full h-full bg-yellow-500 opacity-10 blur-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: clicked ? [0.8, 1.2, 1] : 0.8, 
            opacity: clicked ? [0, 0.2, 0.1] : 0 
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Badge */}
      <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg border border-amber-300/20 flex items-center gap-2">
        <Star className="w-5 h-5 fill-white text-white" />
        <span>Thank You{name ? `, ${name}` : ''}!</span>
        <Star className="w-5 h-5 fill-white text-white" />
        
        {/* Sparkles animation */}
        <AnimatePresence>
          {clicked && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0, 
                    opacity: 0.8 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 100, 
                    y: (Math.random() - 0.5) * 100, 
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    top: '50%',
                    left: `${20 + i * 15}%`,
                  }}
                >
                  <Sparkles className="text-yellow-300 w-6 h-6" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// 3D Rotating Success Icon
const SuccessIcon3D: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!iconRef.current) return;
    
    const rect = iconRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setRotation({
      x: y / 10,
      y: -x / 10
    });
  };
  
  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  const circleAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };
  
  return (
    <div
      ref={iconRef}
      className="w-36 h-36 md:w-48 md:h-48 relative perspective-500"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
    >
      <motion.div 
        className="w-full h-full"
        style={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* 3D layers */}
        <div className="absolute inset-0 flex items-center justify-center transform translate-z-[-40px]">
          <div className="w-full h-full rounded-full bg-primary/10 blur-md" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center transform translate-z-[-20px]">
          <div className="w-[80%] h-[80%] rounded-full bg-primary/20" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-[70%] h-[70%] rounded-full bg-primary/30 flex items-center justify-center"
          >
            <svg 
              width="65%" 
              height="65%" 
              viewBox="0 0 100 100" 
              className="text-white"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                variants={circleAnimation}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M30 50 L45 65 L70 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={circleAnimation}
                initial="hidden"
                animate="visible"
              />
            </svg>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-0 right-0 w-6 h-6 rounded-full bg-primary/60"
          initial={{ y: 0 }}
          animate={{ y: [-10, 0, -10] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
        />
        
        <motion.div
          className="absolute bottom-5 left-5 w-4 h-4 rounded-full bg-secondary/60"
          initial={{ y: 0 }}
          animate={{ y: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
        />
        
        <motion.div
          className="absolute top-10 left-0 w-5 h-5 rounded-full bg-accent/60"
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d', transform: 'translateZ(25px)' }}
        />
      </motion.div>
    </div>
  );
};

// Animated Paper Plane
const PaperPlane: React.FC = () => {
  return (
    <motion.div
      className="absolute top-[30%] -right-20 text-primary/40 w-16 h-16"
      initial={{ x: -100, y: 50, rotate: 0 }}
      animate={{
        x: [null, -window.innerWidth],
        y: [null, -50],
        rotate: [0, -10, -5, -15, -10],
      }}
      transition={{
        duration: 15,
        ease: "linear",
        times: [0, 1],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 2
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M10.3094 13.6921L9.59633 20.192C9.59633 20.192 9.40201 20.8946 10.1051 20.8946C10.8082 20.8946 12.0306 19.4897 12.0306 19.4897L18.6116 13.1913"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        <motion.path
          d="M10.3094 13.6921L4.14551 8.56078C4.14551 8.56078 3.71203 8.12729 4.14551 7.69381C4.57899 7.26032 5.01248 7.69381 5.01248 7.69381L19.9121 3.10977C19.9121 3.10977 21.2125 2.67629 20.7791 4.4107L16.1951 19.3103"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
      </svg>
    </motion.div>
  );
};

// Custom animated download button
const AnimatedDownloadButton: React.FC = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDownloading(false);
          toast({
            title: "Download Complete",
            description: "Your marketing kit has been downloaded.",
          });
        }, 500);
      }
    }, 80);
  };
  
  return (
    <Button 
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      className="relative overflow-hidden border-2"
    >
      <div className="flex items-center gap-2 z-10 relative">
        <Download className="w-4 h-4" />
        {isDownloading ? "Downloading..." : "Download Marketing Kit"}
      </div>
      
      {/* Progress bar */}
      {isDownloading && (
        <div className="absolute inset-0 bg-background opacity-20"></div>
      )}
      <div 
        ref={progressRef}
        className={`absolute left-0 top-0 bottom-0 bg-primary opacity-20 transition-all duration-100 ease-out`}
        style={{ width: '0%' }}
      ></div>
    </Button>
  );
};

// Main ThankYou page component
const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const location = useLocation();
  const state = location.state as LocationState;
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mainRef });
  const { toast } = useToast();

  // Transform values based on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  
  // Generate a unique reference ID
  const referenceId = React.useMemo(() => {
    return `TRJ-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  }, []);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = `${t('thankYou.title')} | Trojan Envoy`;
    
    // Add fade-in animation to elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-element");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".should-animate");
    elements.forEach((el) => observer.observe(el));

    // If no email in state, redirect to contact page after a short delay
    if (!state?.email) {
      const timeout = setTimeout(() => {
        navigate('/contact', { replace: true });
      }, 3000);
      
      return () => clearTimeout(timeout);
    }

    return () => observer.disconnect();
  }, [t, navigate, state?.email]);

  // Copy reference ID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceId);
    toast({
      title: "Reference ID Copied",
      description: "The reference ID has been copied to your clipboard.",
    });
  };

  // Save contact information
  const saveContact = () => {
    // Simulating download of vCard or contact information
    toast({
      title: "Contact Saved",
      description: "Our contact information has been saved to your device.",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Custom cursor */}
      <AnimatedCursor />
      
      {/* Confetti explosion */}
      <ConfettiExplosion />
      
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Paper plane animation */}
      <PaperPlane />
      
      <Header />
      
      <main ref={mainRef} className="flex-grow relative overflow-hidden">
        {/* Parallax background */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-30"
          style={{ 
            y: backgroundY,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.09\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div 
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Success icon with 3D effect */}
            <motion.div
              variants={itemVariants}
              className="mb-8 relative z-10"
            >
              <SuccessIcon3D />
            </motion.div>
            
            {/* Interactive Thank You badge */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <ThankYouBadge name={state?.name} />
            </motion.div>
            
            {/* Subheading with gradient text */}
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-muted-foreground"
              variants={itemVariants}
            >
              Your message has been successfully delivered. We'll respond to{" "}
              <span className="text-gradient bg-gradient-to-r from-primary via-purple-500 to-accent">
                {state?.email || "your email"}
              </span>{" "}
              shortly.
            </motion.p>
            
            {/* 3D rotating card */}
            <motion.div
              className="w-full max-w-md mb-12 perspective-1000"
              variants={itemVariants}
            >
              <div className="card-3d-wrapper relative">
                <Card className="backdrop-blur-sm bg-background/50 border-2 border-primary/10 hover-3d transform-style-3d transition-transform duration-500">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-6 text-primary">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-bold text-lg">Confirmation Details</p>
                    </div>
                    
                    <div className="space-y-6 text-left">
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email confirmation sent to:</p>
                          <HoverCard>
                            <HoverCardTrigger>
                              <p className="font-medium cursor-pointer underline decoration-dotted">
                                {state?.email || 'your-email@example.com'}
                              </p>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 bg-background/95 backdrop-blur-sm">
                              <div className="flex justify-between space-x-4">
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold">Email Details</h4>
                                  <p className="text-xs text-muted-foreground">
                                    We've sent you a confirmation email with details about your inquiry.
                                    Please check your inbox (or spam folder if you don't see it).
                                  </p>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 mt-0.5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expected response time:</p>
                          <div className="relative">
                            <p className="font-medium">Within 24-48 hours</p>
                            <motion.span 
                              className="absolute -right-6 top-0 text-green-500 text-xs font-bold"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            >
                              ASAP!
                            </motion.span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Reference ID:
                          </p>
                          <div 
                            className="font-mono text-xs bg-secondary/20 px-2 py-1 rounded cursor-pointer flex items-center gap-1 hover:bg-secondary/30 transition-colors"
                            onClick={copyToClipboard}
                          >
                            {referenceId}
                            <motion.span
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            {/* Call to action buttons with advanced hover effects */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={itemVariants}
            >
              <Button 
                onClick={() => navigate("/")}
                className="ripple relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-lg group"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2 group-hover:rotate-[-10deg] transition-transform duration-300" />
                <span>Return to Home</span>
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-gradient relative overflow-hidden"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Save Our Contact
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md glass">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          <Mail className="w-10 h-10 text-primary" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-medium">Trojan Envoy Contact</h3>
                      <p className="text-sm text-muted-foreground">
                        Save our contact information for future communication
                      </p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="font-medium">contact@trojanenvoy.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="font-medium">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Address:</span>
                        <span className="font-medium">123 Business St, Tech City</span>
                      </div>
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button onClick={saveContact} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Save Contact
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <AnimatedDownloadButton />
              
            </motion.div>
          </motion.div>

          {/* Featured content cards with 3D hover effect */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold inline-block relative">
                <motion.span 
                  className="absolute -z-10 -inset-1 bg-primary/10 rounded-lg blur-sm"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                Explore Our Services
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Digital Strategy",
                  desc: "Comprehensive digital strategies tailored to your business goals.",
                  path: "/services/digital-strategy",
                  bgClass: "from-blue-600/80 to-purple-600/80",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                      <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 9h8M8 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )
                },
                {
                  title: "AI Solutions",
                  desc: "Cutting-edge AI tools and implementation services for modern businesses.",
                  path: "/services/ai-solutions",
                  bgClass: "from-cyan-600/80 to-blue-600/80",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )
                },
                {
                  title: "Case Studies",
                  desc: "Explore our portfolio of successful client transformations and results.",
                  path: "/case-studies",
                  bgClass: "from-amber-600/80 to-orange-600/80",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" />
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <div key={idx} className="group perspective-1000">
                  <motion.div
                    className="relative h-full transform-style-3d transition-transform duration-500 preserve-3d"
                    whileHover={{ 
                      rotateY: 15,
                      rotateX: -5,
                      translateZ: 10, 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    {/* Card front */}
                    <div className="h-full relative">
                      <div className="absolute inset-0 bg-gradient-to-br rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm transform translate-x-2 translate-y-2" />
                      
                      <Card className="h-full overflow-hidden border-0 glass shadow-xl">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br rounded-t-lg opacity-90 text-white flex items-center justify-center z-0">
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.bgClass}`} />
                          <div className="relative z-10">{item.icon}</div>
                        </div>
                        
                        <CardContent className="p-6 pt-28 relative z-10">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-6">{item.desc}</p>
                          
                          <Button 
                            variant="ghost" 
                            className="group w-full justify-between"
                            onClick={() => navigate(item.path)}
                          >
                            <span>Explore</span>
                            <span className="flex items-center transition-transform group-hover:translate-x-1">
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </span>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Card shadow/reflection effect */}
                    <div className="absolute inset-0 top-[80%] bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg blur-sm transform -translate-z-10" />
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThankYouPage;