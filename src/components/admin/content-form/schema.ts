
import { z } from "zod";

// Schema to handle proper type conversions
export const contentFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(["Page", "Page Section", "Service", "Portfolio", "Blog Post", "Testimonial", "FAQ", "Team Member", "Case Study", "Job Posting", "Hero", "Tech Stack"] as const),
  subtitle: z.string().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().default(true),
  slug: z.string().optional(),
  showInNavigation: z.boolean().default(false),
  language: z.string().optional(),
  placementPageId: z.string().optional()
    .transform(val => val && val !== "none" ? val : undefined),
  placementSectionId: z.string().optional()
    .transform(val => val && val !== "none" ? val : undefined),
  placementPosition: z.enum(["top", "middle", "bottom", "none"] as const).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  rating: z.coerce.number().optional(),
  answer: z.string().optional(),
  technologies: z.string().optional(),
  duration: z.string().optional(),
  client: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  applyUrl: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  // Hero specific fields
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaUrl: z.string().optional(),
  partnerLogos: z.string().optional(), // This is a JSON string that will be parsed into PartnerLogo[]
  techIcons: z.string().optional(), // This is a JSON string that will be parsed into TechIcon[]
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;
