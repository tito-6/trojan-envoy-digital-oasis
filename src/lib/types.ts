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
  htmlContent?: string; // Added HTML content field
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
