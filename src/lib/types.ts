
// Define base types for the application

// Content Types
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

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

// Contact Settings
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

export interface ContactInfoItem {
  id: number;
  title: string;
  content: string;
  icon: string;
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

// User Management
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin?: string;
  isActive: boolean;
}
