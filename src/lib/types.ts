
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
    position?: "before" | "after";
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

// Adding the missing type definitions for NavigationItem
export interface NavigationItem {
  id: number;
  label: string;
  path: string;
  order: number;
}

// Adding the missing type definitions for HeaderSettings
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

// Adding the missing type definitions for HeroSettings
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

// Adding the missing type definitions for PartnerLogo
export interface PartnerLogo {
  id: number;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  order: number;
}

// Adding the missing type definitions for TechIcon
export interface TechIcon {
  id: number;
  name: string;
  iconName: string;
  color: string;
  animation: string;
  order: number;
}

// Adding BlogCategory interface
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Adding the missing type definitions for User
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

// Adding the missing type definitions for ContactRequest
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
