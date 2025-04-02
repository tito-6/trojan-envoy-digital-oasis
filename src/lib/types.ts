export type ContentType =
  | "Page"
  | "Blog Post"
  | "Service"
  | "Portfolio"
  | "Testimonial"
  | "FAQ"
  | "Team Member"
  | "Case Study"
  | "Job Posting"
  | "Page Section";

export interface ContentItem {
  id: number;
  title: string;
  type: ContentType;
  subtitle?: string;
  description?: string;
  content?: string;
  formattedContent?: { blocks: any[]; entityMap: Record<string, any> };
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  showInNavigation?: boolean;
  language?: string;
  images?: string[];
  videos?: string[];
  documents?: string[];
  published: boolean;
  lastUpdated: string;
  placement?: {
    pageId?: number;
    sectionId?: number;
    position?: "top" | "middle" | "bottom" | "before" | "after";
  };
  category?: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  answer?: string;
  technologies?: string[];
  duration?: string;
  client?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  location?: string;
  department?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  applyUrl?: string;
  salaryMin?: number;
  salaryMax?: number;
  iconName?: string;
  bgColor?: string;
  color?: string;
  htmlContent?: string;
  order?: number;
  publishDate?: string;
  seoHeadingStructure?: {
    h1?: string;
    h2?: string[];
    h3?: string[];
  };
}

export interface ServicesSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  viewAllText: string;
  viewAllUrl: string;
  services: ServiceItem[];
  lastUpdated: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  link: string;
  order: number;
  color: string;
  bgColor: string;
  formattedDescription?: { blocks: any[]; entityMap: Record<string, any> };
  htmlContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoHeadingStructure?: {
    h1?: string;
    h2?: string[];
    h3?: string[];
  };
  images?: string[];
  videos?: string[];
  documents?: string[];
}

export interface NavigationItem {
  id: number;
  label: string;
  path: string;
  order: number;
}

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

export interface PartnerLogo {
  id: number;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  order: number;
}

export interface TechIcon {
  id: number;
  name: string;
  iconName: string;
  color: string;
  animation: string;
  order: number;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  dateSubmitted: string;
  status: 'New' | 'In Progress' | 'Completed';
}

export interface AboutSettings {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  missionTitle: string;
  missionDescription: string;
  keyPoints: KeyPoint[];
  learnMoreText: string;
  learnMoreUrl: string;
  stats: StatItem[];
  lastUpdated: string;
  mediaEnabled?: boolean;
  mediaItems?: MediaItem[];
}

export interface KeyPoint {
  id: number;
  text: string;
  order: number;
}

export interface StatItem {
  id: number;
  value: string;
  label: string;
  start: string;
  order: number;
  isActive?: boolean;
  icon?: string;
  color?: string;
  suffix?: string;
  description?: string;
}

export interface MediaItem {
  id: number;
  type: "image" | "video" | "document";
  url: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  order: number;
}

export interface ReferencesSettings {
  id: number;
  title: string;
  subtitle: string;
  viewCaseStudiesText: string;
  viewCaseStudiesUrl: string;
  clientLogos: ClientLogo[];
  lastUpdated: string;
}

export interface ClientLogo {
  id: number;
  name: string;
  logo: string;
  scale: string;
  order: number;
  isActive?: boolean;
}

export interface FAQSettings {
  id: number;
  title: string;
  subtitle: string;
  viewAllText: string;
  viewAllUrl: string;
  faqItems: FAQItem[];
  lastUpdated: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive?: boolean;
}

export interface FooterSettings {
  id: number;
  companyInfo: {
    description: string;
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: SocialLink[];
  footerSections: FooterSection[];
  copyrightText: string;
  privacyPolicyLink: string;
  termsOfServiceLink: string;
  lastUpdated: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  icon: string;
  url: string;
  order: number;
}

export interface FooterSection {
  id: number;
  title: string;
  links: FooterLink[];
  order: number;
}

export interface FooterLink {
  id: number;
  label: string;
  path: string;
  order: number;
  isExternal: boolean;
}

export interface ContactSettings {
  id: number;
  title: string;
  subtitle: string;
  description: any;
  submitButtonText: string;
  contactInfoItems: ContactInfoItem[];
  formFields: ContactFormField[];
  enableRecaptcha: boolean;
  recaptchaSiteKey?: string;
  recaptchaSecretKey?: string;
  enableFingerprinting: boolean;
  enableEmailNotifications: boolean;
  emailSender?: string;
  emailRecipient?: string;
  emailSubject?: string;
  enableAppointmentScheduling: boolean;
  appointmentLabel?: string;
  availableDays?: string[];
  workingHoursStart?: string;
  workingHoursEnd?: string;
  lastUpdated: string;
}

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
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  placeholder: string;
  order: number;
  options?: {
    id: number;
    label: string;
    value: string;
  }[];
}
