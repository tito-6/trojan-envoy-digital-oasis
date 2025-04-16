import { IContent } from './types';

interface ContentFormValues {
  title: string;
  type: "Page" | "Page Section" | "Service" | "Portfolio" | "Blog Post";
  subtitle?: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  content?: string;
  published: boolean;
  slug?: string;
  showInNavigation: boolean;
  language?: string;
  placementPageId?: number;
  placementSectionId?: number;
  placementPosition?: "top" | "middle" | "bottom";
  category?: string;
  keywords?: string[];
  images?: (File | string)[];
  videos?: string[];
  documents?: (File | string)[];
  publishDate?: Date | string;
  placement?: {
    pageId?: number;
    sectionId?: number;
    position?: 'top' | 'middle' | 'bottom';
  };
}

export const adaptFormValuesToContent = (values: ContentFormValues): Omit<IContent, '_id'> => {
  return {
    title: values.title,
    type: values.type,
    subtitle: values.subtitle,
    description: values.description,
    seoTitle: values.seoTitle,
    seoDescription: values.seoDescription,
    seoKeywords: values.keywords || [],
    content: values.content,
    published: values.published,
    slug: values.slug ? values.slug.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : undefined,
    showInNavigation: values.showInNavigation,
    language: values.language,
    placement: values.placement,
    category: values.category,
    images: values.images?.filter((i): i is string => typeof i === 'string') || [],
    videos: values.videos || [],
    documents: values.documents?.filter((d): d is string => typeof d === 'string') || [],
    lastUpdated: new Date(),
    publishDate: values.publishDate ? new Date(values.publishDate) : undefined
  };
};

export const adaptContentToFormValues = (content: any): ContentFormValues => {
  // Handle MongoDB _id to id conversion
  const id = content._id?.toString() || content.id;
  
  return {
    title: content.title,
    type: content.type,
    subtitle: content.subtitle,
    description: content.description,
    seoTitle: content.seoTitle,
    seoDescription: content.seoDescription,
    content: content.content,
    published: content.published,
    slug: content.slug,
    showInNavigation: content.showInNavigation || false,
    language: content.language || 'en',
    keywords: content.seoKeywords || [],
    images: content.images || [],
    videos: content.videos || [],
    documents: content.documents || [],
    placement: content.placement,
    category: content.category,
    publishDate: content.publishDate ? (typeof content.publishDate === 'string' ? content.publishDate : content.publishDate.toISOString()) : undefined,
    placementPageId: content.placement?.pageId,
    placementSectionId: content.placement?.sectionId,
    placementPosition: content.placement?.position
  };
};
