
// Define base types for the application

// Content Types
export type ContentType = "Page" | "Page Section" | "Service" | "Portfolio" | "Blog Post" | "Testimonial" | "FAQ" | "Team Member" | "Case Study" | "Job Posting";

export interface ContentItem {
  id: number;
  title: string;
  type: string;
  slug?: string;
  description?: string;
  content?: string;
  images?: string[];
  seoKeywords?: string[];
  category?: string;
  author?: string;
  publishDate?: string;
  published?: boolean;
  language?: string;
  lastUpdated: string;
  
  // Additional fields for specific content types
  subtitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  showInNavigation?: boolean;
  
  // Placement information for sections
  placement?: {
    pageId?: number;
    sectionId?: number;
    position?: "top" | "middle" | "bottom" | "before" | "after" | "none";
  };
  
  // Testimonial fields
  role?: string;
  company?: string;
  rating?: number;
  
  // FAQ fields
  answer?: string;
  
  // Case Study fields
  technologies?: string[];
  duration?: string;
  client?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  
  // Team Member fields
  department?: string;
  responsibilities?: string[];
  
  // Job Posting fields
  location?: string;
  requirements?: string[];
  benefits?: string[];
  applyUrl?: string;
  salaryMin?: number;
  salaryMax?: number;
  
  // Service item specific fields
  iconName?: string;
  color?: string;
  bgColor?: string;
  
  // Content formatting fields
  formattedContent?: any;
  htmlContent?: string;
  seoHeadingStructure?: {
    h1?: string;
    h2?: string[];
    h3?: {
      [key: string]: string[];
    };
  };
  
  // Video and document attachments
  videos?: string[];
  documents?: string[];
  
  // Order for sorting
  order?: number;
  
  // Service specific fields
  link?: string;
}

// Contact Request
export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status?: 'new' | 'in-progress' | 'completed';
  company?: string;
}

// Navigation Item
export interface NavigationItem {
  id: number;
  label: string;
  path: string;
  order: number;
}

// Partner Logo
export interface PartnerLogo {
  id: number;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  order: number;
}

// Tech Icon
export interface TechIcon {
  id: number;
  name: string;
  iconName: string;
  color: string;
  animation: string;
  order: number;
}

// Blog Category
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Footer Related Types
export interface FooterLink {
  id: number;
  label: string;
  path: string;
  isExternal: boolean;
  order: number;
}

export interface FooterSection {
  id: number;
  title: string;
  links: FooterLink[];
  order: number;
}

export interface FooterSettings {
  id: number;
  companyName: string;
  logoPath?: string;
  tagline?: string;
  copyrightText: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  footerSections: FooterSection[];
  privacyPolicyLink: string;
  termsOfServiceLink: string;
  companyInfo: {
    description: string;
    address: string;
    phone: string;
    email: string;
  };
  showSocialLinks: boolean;
  showBackToTop: boolean;
  showNewsletter: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  lastUpdated: string;
}

export interface FooterSettingsFormData {
  companyName: string;
  logoPath?: string;
  tagline?: string;
  copyrightText: string;
  showSocialLinks: boolean;
  showBackToTop: boolean;
  showNewsletter: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

// Header Settings
export interface HeaderSettings {
  id: number;
  siteTitle: string;
  logoPath?: string;
  contactButtonText: string;
  contactButtonPath: string;
  showLanguageSelector: boolean;
  showThemeToggle: boolean;
  enabledLanguages: string[];
  defaultLanguage: string;
  mobileMenuLabel: string;
  lastUpdated: string;
}

// Hero Settings
export interface HeroSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  showPartnerLogos: boolean;
  partnerSectionTitle: string;
  partnerCertifiedText: string;
  showTechStack: boolean;
  techStackTitle: string;
  techStackSubtitle: string;
  techStackDescription: string;
  partnerLogos: PartnerLogo[];
  techIcons: TechIcon[];
  lastUpdated: string;
}

// Contact Settings
export interface ContactInfoItem {
  id: number;
  title: string;
  content: string;
  icon: string;
  order: number;
}

export interface ContactFormField {
  id: number;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  order: number;
}

export interface ContactSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  submitButtonText: string;
  contactInfoItems: ContactInfoItem[];
  formFields: ContactFormField[];
  enableRecaptcha: boolean;
  recaptchaSiteKey: string;
  recaptchaSecretKey: string;
  enableFingerprinting: boolean;
  enableEmailNotifications: boolean;
  emailSender: string;
  emailRecipient: string;
  emailSubject: string;
  enableAppointmentScheduling: boolean;
  appointmentLabel: string;
  availableDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  lastUpdated: string;
}

// Service Item Types
export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  link: string;
  order: number;
  color: string;
  bgColor: string;
}

export interface ServicesSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  servicesPerPage?: number;
  defaultSorting?: string;
  enableFiltering?: boolean;
  services: ServiceItem[];
  viewAllText: string;
  viewAllUrl: string;
  lastUpdated: string;
}

// About Page Types
export interface KeyPoint {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  text?: string; // Added for compatibility
}

export interface StatItem {
  id: number;
  label: string;
  value: string;
  icon?: string;
  order: number;
  description?: string;
  start?: string;
  suffix?: string;
  color?: string;
  isActive?: boolean;
}

export interface AboutSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  keyPoints: KeyPoint[];
  showStats: boolean;
  statsTitle: string;
  statsSubtitle: string;
  stats: StatItem[];
  teamSectionTitle: string;
  teamSectionSubtitle: string;
  learnMoreText?: string;
  learnMoreUrl?: string;
  lastUpdated: string;
}

// FAQ Types
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive?: boolean; // Added for compatibility
}

export interface FAQSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  faqItems: FAQItem[];
  enableSearch: boolean;
  enableCategories: boolean;
  viewAllText?: string; // Added for compatibility
  viewAllUrl?: string; // Added for compatibility
  lastUpdated: string;
}

// References/Client Types
export interface ClientLogo {
  id: number;
  name: string;
  imageUrl: string;
  order: number;
  isActive?: boolean; // Added for compatibility
  logo?: string; // Added for compatibility
  scale?: number; // Added for compatibility
}

export interface ReferencesSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  clientLogos: ClientLogo[];
  testimonialsSectionTitle: string;
  testimonialsSectionSubtitle: string;
  viewCaseStudiesText?: string; // Added for compatibility
  viewCaseStudiesUrl?: string; // Added for compatibility
  lastUpdated: string;
}

// User Management
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin?: string;
  isActive: boolean;
}

// Language/Internationalization
export interface LanguageState {
  currentLanguage: string;
  availableLanguages: { code: string; label: string; flag: string; name: string }[];
  changeLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Header props interface
export interface HeaderProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

// Portfolio component props
export interface PortfolioFiltersProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export interface PortfolioGalleryProps {
  activeFilter: string;
}
