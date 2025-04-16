import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUp, Heart, Sparkles, ChevronRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaGithub, FaXTwitter } from "react-icons/fa6";

// Social media button with hover effects
const SocialButton = ({ icon: Icon, url, color }) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center h-10 w-10 rounded-full bg-background dark:bg-secondary/30 border border-border group overflow-hidden relative"
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: color, borderRadius: "100%" }}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <Icon 
        className="relative z-10 size-5 text-foreground/80 group-hover:text-white transition-colors duration-300" 
      />
    </motion.a>
  );
};

// Animated footer link
const FooterLink = ({ to, children }) => {
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
      <Link
        to={to}
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center group"
      >
        <motion.span
          className="mr-1 opacity-0 group-hover:opacity-100"
          initial={{ width: 0 }}
          whileHover={{ width: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-3 w-3" />
        </motion.span>
        <span className="text-sm">{children}</span>
      </Link>
    </motion.div>
  );
};

// Animated contact info item
const ContactItem = ({ icon: Icon, children, delay = 0 }) => {
  return (
    <motion.div 
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Icon className="w-5 h-5 mt-0.5 text-primary" />
      <span className="text-sm">{children}</span>
    </motion.div>
  );
};

// Back to top button component
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-purple-600 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group"
          aria-label="Back to top"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Wave divider component
const WaveDivider = () => {
  return (
    <div className="absolute top-0 left-0 w-full overflow-hidden">
      <svg
        preserveAspectRatio="none"
        className="w-full h-12 md:h-20"
        viewBox="0 0 1200 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          className="fill-background dark:fill-background"
        ></path>
      </svg>
    </div>
  );
};

const Footer = () => {
  const { t, getLocalizedSlug } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1500);
  };

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", path: `/about` },
        { label: "Services", path: `/services` },
        { label: "Portfolio", path: `/portfolio` },
        { label: "Case Studies", path: `/case-studies` },
        { label: "Careers", path: `/careers` },
        { label: "Contact", path: `/contact` },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Web Development", path: `/services/web-development` },
        { label: "Mobile Development", path: `/services/mobile-development` },
        { label: "UI/UX Design", path: `/services/ui-ux-design` },
        { label: "Digital Marketing", path: `/services/digital-marketing` },
        { label: "SEO Optimization", path: `/services/seo` },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", path: `/blog` },
        { label: "Case Studies", path: `/case-studies` },
        { label: "AI Tools", path: `/ai-tools` },
        { label: "Waiting List", path: `/waiting-list` },
        { label: "FAQ", path: `/faq` },
        { label: t('footer.privacy'), path: `/privacy-policy` },
        { label: t('footer.terms'), path: `/terms-of-service` },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaLinkedin, url: "https://www.linkedin.com/company/trojan-envoy/about/", color: "#0077B5" },
    { icon: FaXTwitter, url: "https://x.com/Trojan_Envoy", color: "#000000" },
    { icon: FaFacebook, url: "https://www.facebook.com/trojanenvoy/", color: "#1877F2" },
    { icon: FaInstagram, url: "https://www.instagram.com/trojanenvoy", color: "#E1306C" }
  ];

  return (
    <footer className="relative bg-secondary text-secondary-foreground pt-16 pb-8 overflow-hidden">
      <WaveDivider />
      
      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {/* Company Info - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 w-full max-w-md">
            <Link to="/" className="text-xl font-display font-bold tracking-tight mb-4 inline-block group text-center md:text-left">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 group-hover:from-primary/90 group-hover:to-purple-600/90 transition-all">
                Trojan Envoy
              </span>
              <motion.div 
                className="inline-block ml-1" 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4 text-primary inline" />
              </motion.div>
            </Link>
            
            <motion.p 
              className="text-muted-foreground mt-4 max-w-md text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Premium software development and digital marketing agency delivering excellence and driving results for businesses worldwide.
            </motion.p>

            <div className="mt-6 space-y-3">
              <ContactItem icon={MapPin} delay={0.1}>
                1234 Tech Avenue, Innovation District, New York, NY 10001
              </ContactItem>
              <ContactItem icon={Phone} delay={0.2}>
                +1 (555) 123-4567
              </ContactItem>
              <ContactItem icon={Mail} delay={0.3}>
                contact@trojanenvoy.com
              </ContactItem>
            </div>

            <motion.div 
              className="mt-6 flex gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {socialLinks.map((social, index) => (
                <SocialButton
                  key={index}
                  icon={social.icon}
                  url={social.url}
                  color={social.color}
                />
              ))}
            </motion.div>
          </div>

          {/* Navigation Links - Each takes up 1 column */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div 
              key={section.title}
              className="w-full text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (sectionIndex + 1) }}
            >
              <h3 className="font-semibold text-lg mb-4 relative inline-block">
                {section.title}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 w-8 bg-primary"
                  animate={{ width: ["0%", "100%", "30%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path} className="text-center md:text-left">
                    <FooterLink to={link.path}>
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 max-w-md mx-auto"
        >
          <div className="bg-background/50 dark:bg-background/10 backdrop-blur-sm p-6 rounded-xl border border-border/50 text-center">
            <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2 justify-center">
              <div className="flex-grow max-w-xs">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 dark:bg-background/10 border-border"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || isSubscribed}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : isSubscribed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center"
                  >
                    <Heart className="w-5 h-5 text-red-500 mr-1" />
                    <span className="text-xs">Thanks!</span>
                  </motion.div>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />

        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Trojan Envoy. {t('footer.rights')}.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
      
      <BackToTopButton />
    </footer>
  );
};

export default Footer;
