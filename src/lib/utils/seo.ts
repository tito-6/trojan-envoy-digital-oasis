import { availableLanguages } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/i18n';

export const getAlternateLinks = (path: string, baseUrl: string = 'https://trojanenvoy.com') => {
  return availableLanguages.map(lang => ({
    hrefLang: lang.code,
    href: `${baseUrl}/${lang.code}${path}`
  }));
};

export const getLocalizedPath = (path: string, language: LanguageCode) => {
  return language === 'en' ? path : `/${language}${path}`;
};

// Generate breadcrumb data for search engines
export const generateBreadcrumbSchema = (items: { name: string; url: string }[], baseUrl: string = 'https://trojanenvoy.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
};

// Generate FAQ schema for search engines
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};