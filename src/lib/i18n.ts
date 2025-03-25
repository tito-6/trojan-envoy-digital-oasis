
import { create } from 'zustand';
import { es } from './i18n/translations/es';
import { fr } from './i18n/translations/fr';
import { de } from './i18n/translations/de';
import { zh } from './i18n/translations/zh';
import { ar } from './i18n/translations/ar';
import { tr } from './i18n/translations/tr';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'tr';

interface Translation {
  [key: string]: string;
}

interface Translations {
  [key: string]: Translation;
}

interface LanguageState {
  currentLanguage: LanguageCode;
  translations: Translations;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  getLocalizedSlug: (baseSlug: string) => string;
}

// Initial translations with all languages
const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.theme': 'Theme',
    'nav.language': 'Language',
    
    // Hero Section
    'hero.title': 'Premium Digital Solutions',
    'hero.subtitle': 'We transform vision into digital excellence',
    'hero.cta': 'Discuss Your Project',
    'hero.description': 'We create exceptional digital experiences through innovative software development, strategic marketing, and cutting-edge design.',
    'partners.title': 'Certified Partners With Leading Platforms',
    'partners.certified': 'Certified',
    
    // Services Section
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive digital solutions for your business',
    'services.description': 'We offer a wide range of services to help your business achieve its digital goals.',
    'services.web.title': 'Web Development',
    'services.web.description': 'Custom websites with pixel-perfect design and optimized performance',
    'services.mobile.title': 'Mobile Development',
    'services.mobile.description': 'Native and cross-platform mobile applications',
    'services.digital.title': 'Digital Marketing',
    'services.digital.description': 'Data-driven strategies to grow your online presence',
    'services.ui.title': 'UI/UX Design',
    'services.ui.description': 'Intuitive interfaces and exceptional user experiences',
    'services.seo.title': 'SEO Optimization',
    'services.seo.description': 'Improve your search rankings and drive organic traffic',
    'services.ecommerce.title': 'E-Commerce Solutions',
    'services.ecommerce.description': 'Custom online stores and shopping experiences',
    'services.content.title': 'Content Creation',
    'services.content.description': 'Engaging content that connects with your audience',
    
    // About Section
    'about.title': 'About Trojan Envoy',
    'about.subtitle': 'A premium agency delivering excellence',
    'about.description': 'We are a team of passionate digital experts dedicated to transforming businesses through innovative technology solutions. With years of experience across diverse industries, we bring a unique perspective to every project.',
    'about.mission.title': 'Our Mission',
    'about.mission.description': 'To empower businesses with cutting-edge digital solutions that drive growth and success.',
    
    // Contact Section
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Let\'s discuss your project',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.subject': 'Subject',
    'contact.message': 'Your Message',
    'contact.submit': 'Send Message',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'There was an error sending your message. Please try again.',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    
    // Additional sections
    'references.title': 'Our References',
    'references.subtitle': 'Trusted by leading brands',
    'caseStudies.title': 'Case Studies',
    'caseStudies.subtitle': 'Success stories of our clients',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to common inquiries',
    
    // Explore services button
    'explore.services': 'Explore Our Services',
    
    // Service pages
    'service.details': 'Service Details',
    'service.features': 'Key Features',
    'service.benefits': 'Benefits',
    'service.process': 'Our Process',
    'service.cta': 'Ready to get started?',
    'service.contact': 'Contact us today',
    
    // Services CTA
    'services.cta.title': 'Ready to Transform Your Digital Presence?',
    'services.cta.description': 'Partner with us to leverage our expertise and propel your business forward. Our team is ready to help you achieve your digital goals with tailored solutions that drive results.',
    'services.cta.features.title1': 'Tailored solutions for your unique business needs',
    'services.cta.features.title2': 'Experienced team of professionals',
    'services.cta.features.title3': 'Results-driven approach',
    'services.cta.features.title4': 'Transparent communication',
    'services.cta.features.title5': 'Ongoing support and maintenance',
    'services.cta.features.title6': 'Competitive pricing',
    'services.cta.button.primary': 'Get Started',
    'services.cta.button.secondary': 'View Our Work',
    
    // Contact form on services page
    'services.form.title': 'Request a Free Consultation',
    'services.form.name': 'Your Name',
    'services.form.name.placeholder': 'John Doe',
    'services.form.email': 'Email Address',
    'services.form.email.placeholder': 'john@example.com',
    'services.form.service': 'Service of Interest',
    'services.form.service.placeholder': 'Select a service',
    'services.form.submit': 'Request Consultation',
    
    // Learn more button
    'learn.more': 'Learn More',
  },
  es,
  fr,
  de,
  zh,
  ar,
  tr,
};

export const useLanguage = create<LanguageState>((set, get) => ({
  currentLanguage: 'en',
  translations,
  setLanguage: (lang) => {
    set({ currentLanguage: lang });
    localStorage.setItem('preferred-language', lang);
    
    // Update URL with language prefix if not already present
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    if (pathSegments.length === 0 || !isLanguageCode(pathSegments[0])) {
      // Only update URL if not already navigating or at root
      if (currentPath !== '/' && !window.location.href.includes('?')) {
        window.history.replaceState(null, '', `/${lang}${currentPath}`);
      }
    } else if (isLanguageCode(pathSegments[0]) && pathSegments[0] !== lang) {
      // Replace language code in URL
      pathSegments[0] = lang;
      window.history.replaceState(null, '', `/${pathSegments.join('/')}`);
    }
  },
  t: (key) => {
    const { currentLanguage, translations } = get();
    return translations[currentLanguage]?.[key] || key;
  },
  getLocalizedSlug: (baseSlug) => {
    const { currentLanguage } = get();
    return currentLanguage === 'en' ? baseSlug : `${currentLanguage}/${baseSlug}`;
  }
}));

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية', rtl: true },
  { code: 'tr', name: 'Türkçe' },
];

// Helper function to check if a string is a valid language code
const isLanguageCode = (code: string): code is LanguageCode => {
  return availableLanguages.some(lang => lang.code === code);
}

// Initialize with language detection
if (typeof window !== 'undefined') {
  // Check for saved language preference
  const savedLanguage = localStorage.getItem('preferred-language') as LanguageCode | null;
  
  if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
    useLanguage.getState().setLanguage(savedLanguage);
  } else {
    // Check URL for language code
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && isLanguageCode(pathSegments[0])) {
      useLanguage.getState().setLanguage(pathSegments[0]);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as LanguageCode;
      if (availableLanguages.some(lang => lang.code === browserLang)) {
        useLanguage.getState().setLanguage(browserLang);
      }
    }
  }
  
  // Add RTL support for Arabic
  const currentLang = useLanguage.getState().currentLanguage;
  const isRTL = availableLanguages.find(lang => lang.code === currentLang)?.rtl;
  if (isRTL) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
}

// Subscribe to language changes for RTL support
useLanguage.subscribe((state) => {
  const currentLang = state.currentLanguage;
  const isRTL = availableLanguages.find(lang => lang.code === currentLang)?.rtl;
  if (isRTL) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
});
