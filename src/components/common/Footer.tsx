
import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const Footer: React.FC = () => {
  const { t, getLocalizedSlug } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About Us", path: `/about` },
        { label: "Services", path: `/services` },
        { label: "Portfolio", path: `/portfolio` },
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
        { label: "FAQ", path: `/faq` },
        { label: t('footer.privacy'), path: `/privacy-policy` },
        { label: t('footer.terms'), path: `/terms-of-service` },
      ],
    },
  ];

  const socialLinks = [
    { icon: "linkedin", url: "#" },
    { icon: "twitter", url: "#" },
    { icon: "facebook", url: "#" },
    { icon: "instagram", url: "#" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-display font-bold tracking-tight mb-4 inline-block">
              Trojan Envoy
            </Link>
            <p className="text-muted-foreground mt-4 max-w-md">
              Premium software development and digital marketing agency delivering excellence and driving results for businesses worldwide.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <span className="text-sm">1234 Tech Avenue, Innovation District, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm">contact@trojanenvoy.com</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background flex items-center justify-center transition-transform hover:scale-110"
                  aria-label={`Follow us on ${social.icon}`}
                >
                  <span className="sr-only">{social.icon}</span>
                  <i className={`fab fa-${social.icon} text-primary`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
    </footer>
  );
};

export default Footer;
