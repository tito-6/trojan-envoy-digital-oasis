
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { storageService } from "@/lib/storage";

const Footer: React.FC = () => {
  const { t, getLocalizedSlug } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(() => storageService.getFooterSettings());
  
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(storageService.getFooterSettings());
    };
    
    const unsubscribe = storageService.addEventListener('footer-settings-updated', handleSettingsUpdate);
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Replace {year} with current year in copyright text
  const copyrightText = settings.copyrightText.replace('{year}', currentYear.toString());

  // Helper function to safely render description content
  const renderDescription = () => {
    const description = settings.companyInfo.description;
    
    if (typeof description === 'string') {
      return description;
    }
    
    if (description && 
        typeof description === 'object' && 
        'blocks' in description && 
        Array.isArray(description.blocks) && 
        description.blocks.length > 0) {
      return description.blocks[0].text || '';
    }
    
    return '';
  };

  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-display font-bold tracking-tight mb-4 inline-block">
              Trojan Envoy
            </Link>
            <div 
              className="text-muted-foreground mt-4 max-w-md"
              dangerouslySetInnerHTML={{ __html: renderDescription() }}
            />

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <span className="text-sm whitespace-pre-line">{settings.companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm">{settings.companyInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm">{settings.companyInfo.email}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              {settings.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-background flex items-center justify-center transition-transform hover:scale-110"
                  aria-label={`Follow us on ${social.platform}`}
                >
                  <span className="sr-only">{social.platform}</span>
                  <i className={`fab fa-${social.icon} text-primary`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {settings.footerSections.map((section) => (
            <div key={section.id}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {copyrightText}
          </p>
          <div className="flex gap-6">
            <Link
              to={settings.privacyPolicyLink}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to={settings.termsOfServiceLink}
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
