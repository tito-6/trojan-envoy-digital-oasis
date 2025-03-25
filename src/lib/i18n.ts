
import { create } from 'zustand';

type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh';

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
}

// Initial translations (we'll start with English only)
const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Premium Digital Solutions',
    'hero.subtitle': 'We transform vision into digital excellence',
    'hero.cta': 'Discuss Your Project',
    
    // Services Section
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive digital solutions for your business',
    'services.web.title': 'Web Development',
    'services.web.description': 'Custom websites with pixel-perfect design and optimized performance',
    'services.mobile.title': 'Mobile Development',
    'services.mobile.description': 'Native and cross-platform mobile applications',
    'services.digital.title': 'Digital Marketing',
    'services.digital.description': 'Data-driven strategies to grow your online presence',
    'services.ui.title': 'UI/UX Design',
    'services.ui.description': 'Intuitive interfaces and exceptional user experiences',
    
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
  },
};

export const useLanguage = create<LanguageState>((set, get) => ({
  currentLanguage: 'en',
  translations,
  setLanguage: (lang) => set({ currentLanguage: lang }),
  t: (key) => {
    const { currentLanguage, translations } = get();
    return translations[currentLanguage]?.[key] || key;
  },
}));

export const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
];
