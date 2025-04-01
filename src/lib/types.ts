
export type ContentType = 'Page' | 'Page Section' | 'Service' | 'Portfolio' | 'Blog Post' | 'Testimonial' | 'FAQ' | 'Team Member' | 'Case Study' | 'Job Posting';

export type ContentPlacement = {
  pageId?: number;
  sectionId?: number;
  position?: 'top' | 'middle' | 'bottom';
  order?: number;
};

export interface ContentItem {
  id: number;
  title: string;
  type: ContentType;
  subtitle?: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  content?: string;
  slug?: string;
  images?: string[];  // These will be URLs/paths after processing
  videos?: string[];
  documents?: string[];  // These will be URLs/paths after processing
  lastUpdated: string;
  publishDate?: string;
  published: boolean;
  order?: number;
  parentId?: number;
  language?: string;
  showInNavigation?: boolean;
  placement?: ContentPlacement;
  author?: string;
  category?: string;
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
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin?: string;
}

export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Completed';
  dateSubmitted: string;
  assignedTo?: number;
  notes?: string;
}

export interface NavigationItem {
  id: number;
  label: string;
  path: string;
  order: number;
  parentId?: number;
  children?: NavigationItem[];
}

export interface BlogCategory {
  name: string;
  count: number;
}
