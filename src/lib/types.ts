
export type ContentType = 'Page' | 'Page Section' | 'Service' | 'Portfolio' | 'Blog Post';

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
  images?: string[];
  videos?: string[];
  documents?: string[];
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

export interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  applicationUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
