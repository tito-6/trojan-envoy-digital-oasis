
export type ContentType = 'Page' | 'Page Section' | 'Service' | 'Portfolio' | 'Blog Post';

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
