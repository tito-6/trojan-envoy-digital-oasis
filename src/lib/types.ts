// Content Types
export type ContentType = 'Page' | 'Page Section' | 'Service' | 'Portfolio' | 'Blog Post';

export interface ContentPlacement {
  pageId?: number;
  sectionId?: number;
  position?: "top" | "middle" | "bottom";
}

export interface IContent {
  _id?: string;
  id?: string; // Keep for backwards compatibility
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

// Navigation Types
export interface NavigationItem {
  id: number;
  label: string;
  path: string;
  order: number;
  parentId?: number;
}

// Contact Types
export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'New' | 'In Progress' | 'Completed';
  dateSubmitted: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  lastLogin?: string;
}

// Blog Types
export interface BlogCategory {
  name: string;
  count: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContentResponse extends ApiResponse<IContent> {}
export interface ContentsResponse extends ApiResponse<IContent[]> {}

export interface WaitingListEntry {
  id: number;
  email: string;
  name?: string;
  interests?: string[];
  message?: string;
  dateSubmitted: string;
  status: 'New' | 'Contacted';
}
