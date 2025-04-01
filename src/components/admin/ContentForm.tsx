
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload, Plus, FileText, Youtube, Link, Calendar, GanttChart, PlusCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ContentType, ContentItem } from "@/lib/types";
import { storageService } from "@/lib/storage";
import { availableLanguages } from "@/lib/i18n";

const contentFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(["Page", "Page Section", "Service", "Portfolio", "Blog Post", "Testimonial", "FAQ", "Team Member", "Case Study", "Job Posting"] as const),
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
  placementPageId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  placementSectionId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  placementPosition: z.enum(["top", "middle", "bottom"] as const).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  rating: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  answer: z.string().optional(),
  technologies: z.string().optional().transform(val => val ? val.split(',').map(t => t.trim()) : []),
  duration: z.string().optional(),
  client: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  responsibilities: z.string().optional().transform(val => val ? val.split('\n').map(t => t.trim()).filter(t => t) : []),
  requirements: z.string().optional().transform(val => val ? val.split('\n').map(t => t.trim()).filter(t => t) : []),
  benefits: z.string().optional().transform(val => val ? val.split('\n').map(t => t.trim()).filter(t => t) : []),
  applyUrl: z.string().optional(),
  salaryMin: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  salaryMax: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

interface ContentFormProps {
  initialValues?: Partial<ContentFormValues & { 
    keywords: string[]; 
    images: (File | string)[];
    videos: string[];
    documents: (File | string)[];
    publishDate?: Date | string;
    placement?: {
      pageId?: number;
      sectionId?: number;
      position?: 'top' | 'middle' | 'bottom';
    };
    technologies?: string[];
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
  }>;
  onSave: (values: ContentFormValues & { 
    keywords: string[]; 
    images: (File | string)[];
    videos: string[];
    documents: (File | string)[];
    publishDate?: Date | string;
    placement?: {
      pageId?: number;
      sectionId?: number;
      position?: 'top' | 'middle' | 'bottom';
    };
  }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ initialValues, onSave, onCancel, isEditing = false }) => {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<string[]>(initialValues?.keywords || []);
  const [keywordInput, setKeywordInput] = useState("");
  const [images, setImages] = useState<(File | string)[]>(initialValues?.images || []);
  const [documents, setDocuments] = useState<(File | string)[]>(initialValues?.documents || []);
  const [videos, setVideos] = useState<string[]>(initialValues?.videos || []);
  const [videoInput, setVideoInput] = useState("");
  const [slugInput, setSlugInput] = useState(initialValues?.slug || "");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(!initialValues?.slug);
  const [pages, setPages] = useState<ContentItem[]>([]);
  const [pageSections, setPageSections] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [formErrors, setFormErrors] = useState<{
    slug?: string;
    keywords?: string;
    placement?: string;
  }>({});
  const [categoryInput, setCategoryInput] = useState(initialValues?.category || "");
  const [authorInput, setAuthorInput] = useState(initialValues?.author || "");
  const [roleInput, setRoleInput] = useState(initialValues?.role || "");
  const [companyInput, setCompanyInput] = useState(initialValues?.company || "");
  const [ratingInput, setRatingInput] = useState(initialValues?.rating?.toString() || "5");
  const [answerInput, setAnswerInput] = useState(initialValues?.answer || "");
  const [technologiesInput, setTechnologiesInput] = useState(initialValues?.technologies?.join(', ') || "");
  const [durationInput, setDurationInput] = useState(initialValues?.duration || "");
  const [clientInput, setClientInput] = useState(initialValues?.client || "");
  const [challengeInput, setChallengeInput] = useState(initialValues?.challenge || "");
  const [solutionInput, setSolutionInput] = useState(initialValues?.solution || "");
  const [resultsInput, setResultsInput] = useState(initialValues?.results || "");
  const [locationInput, setLocationInput] = useState(initialValues?.location || "");
  const [departmentInput, setDepartmentInput] = useState(initialValues?.department || "");
  const [responsibilitiesInput, setResponsibilitiesInput] = useState(initialValues?.responsibilities?.join('\n') || "");
  const [requirementsInput, setRequirementsInput] = useState(initialValues?.requirements?.join('\n') || "");
  const [benefitsInput, setBenefitsInput] = useState(initialValues?.benefits?.join('\n') || "");
  const [applyUrlInput, setApplyUrlInput] = useState(initialValues?.applyUrl || "");
  const [salaryMinInput, setSalaryMinInput] = useState(initialValues?.salaryMin?.toString() || "");
  const [salaryMaxInput, setSalaryMaxInput] = useState(initialValues?.salaryMax?.toString() || "");

  useEffect(() => {
    const allPages = storageService.getContentByType("Page");
    const allSections = storageService.getContentByType("Page Section");
    setPages(allPages);
    setPageSections(allSections);
  }, []);

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: initialValues?.title || "",
      type: (initialValues?.type as ContentType) || "Page Section",
      subtitle: initialValues?.subtitle || "",
      description: initialValues?.description || "",
      seoTitle: initialValues?.seoTitle || "",
      seoDescription: initialValues?.seoDescription || "",
      seoKeywords: initialValues?.seoKeywords || "",
      content: initialValues?.content || "",
      published: initialValues?.published !== undefined ? initialValues.published : true,
      slug: initialValues?.slug || "",
      showInNavigation: initialValues?.showInNavigation || false,
      language: initialValues?.language || "en",
      placementPageId: initialValues?.placement?.pageId !== undefined ? initialValues.placement.pageId.toString() : undefined,
      placementSectionId: initialValues?.placement?.sectionId !== undefined ? initialValues.placement.sectionId.toString() : undefined,
      placementPosition: initialValues?.placement?.position,
      category: initialValues?.category || "",
      author: initialValues?.author || "",
      role: initialValues?.role || "",
      company: initialValues?.company || "",
      rating: initialValues?.rating?.toString() || "5",
      answer: initialValues?.answer || "",
      technologies: technologiesInput,
      duration: initialValues?.duration || "",
      client: initialValues?.client || "",
      challenge: initialValues?.challenge || "",
      solution: initialValues?.solution || "",
      results: initialValues?.results || "",
      location: initialValues?.location || "",
      department: initialValues?.department || "",
      responsibilities: responsibilitiesInput,
      requirements: requirementsInput,
      benefits: benefitsInput,
      applyUrl: initialValues?.applyUrl || "",
      salaryMin: initialValues?.salaryMin?.toString() || "",
      salaryMax: initialValues?.salaryMax?.toString() || "",
    },
  });

  const contentType = form.watch("type");

  useEffect(() => {
    if (autoGenerateSlug) {
      const title = form.watch("title");
      if (title) {
        const generatedSlug = title.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special chars
          .replace(/\s+/g, '-'); // Replace spaces with hyphens
        setSlugInput(generatedSlug);
        form.setValue("slug", generatedSlug);
        
        if (formErrors.slug) {
          setFormErrors(prev => ({ ...prev, slug: undefined }));
        }
      }
    }
  }, [form.watch("title"), autoGenerateSlug, form, formErrors.slug]);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocuments = Array.from(e.target.files);
      setDocuments([...documents, ...newDocuments]);
    }
  };

  const addVideo = () => {
    if (videoInput.trim() && !videos.includes(videoInput.trim())) {
      if (videoInput.includes("youtube.com") || videoInput.includes("youtu.be")) {
        setVideos([...videos, videoInput.trim()]);
        setVideoInput("");
      } else {
        toast({
          title: "Invalid YouTube URL",
          description: "Please enter a valid YouTube video URL",
          variant: "destructive",
        });
      }
    }
  };

  const removeVideo = (video: string) => {
    setVideos(videos.filter(v => v !== video));
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugInput(e.target.value);
    form.setValue("slug", e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInput(e.target.value);
    form.setValue("category", e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorInput(e.target.value);
    form.setValue("author", e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleInput(e.target.value);
    form.setValue("role", e.target.value);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInput(e.target.value);
    form.setValue("company", e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRatingInput(e.target.value);
    form.setValue("rating", e.target.value);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(e.target.value);
    form.setValue("answer", e.target.value);
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechnologiesInput(e.target.value);
    form.setValue("technologies", e.target.value);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationInput(e.target.value);
    form.setValue("duration", e.target.value);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientInput(e.target.value);
    form.setValue("client", e.target.value);
  };

  const handleChallengeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChallengeInput(e.target.value);
    form.setValue("challenge", e.target.value);
  };

  const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSolutionInput(e.target.value);
    form.setValue("solution", e.target.value);
  };

  const handleResultsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResultsInput(e.target.value);
    form.setValue("results", e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    form.setValue("location", e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentInput(e.target.value);
    form.setValue("department", e.target.value);
  };

  const handleResponsibilitiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponsibilitiesInput(e.target.value);
    form.setValue("responsibilities", e.target.value);
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequirementsInput(e.target.value);
    form.setValue("requirements", e.target.value);
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBenefitsInput(e.target.value);
    form.setValue("benefits", e.target.value);
  };

  const handleApplyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplyUrlInput(e.target.value);
    form.setValue("applyUrl", e.target.value);
  };

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMinInput(e.target.value);
    form.setValue("salaryMin", e.target.value);
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMaxInput(e.target.value);
    form.setValue("salaryMax", e.target.value);
  };

  const toggleAutoGenerateSlug = () => {
    setAutoGenerateSlug(!autoGenerateSlug);
    if (!autoGenerateSlug) {
      const title = form.watch("title");
      const generatedSlug = title.toLowerCase().replace(/\s+/g, '-');
      setSlugInput(generatedSlug);
      form.setValue("slug", generatedSlug);
    }
  };

  const validateBeforeSubmit = () => {
    const newErrors: {
      slug?: string;
      keywords?: string;
      placement?: string;
    } = {};
    
    if ((contentType === "Page" || contentType === "Blog Post" || 
         contentType === "Service" || contentType === "Portfolio") && 
        !slugInput.trim()) {
      newErrors.slug = "A URL slug is required for this content type";
    }
    
    if (contentType === "Blog Post" && keywords.length === 0) {
      newErrors.keywords = "Adding categories/keywords helps organize and find your content";
    }
    
    if (contentType === "Page Section" && 
        !form.getValues("placementPageId") && 
        !form.getValues("placementSectionId")) {
      newErrors.placement = "Consider setting where this section should appear";
    }
    
    setFormErrors(newErrors);
    
    return !newErrors.slug;
  };

  const onSubmit = (values: ContentFormValues) => {
    if (!validateBeforeSubmit()) {
      toast({
        title: "Please fix the errors before saving",
        description: "Some required fields need your attention",
        variant: "destructive",
      });
      return;
    }
    
    if (formErrors.keywords || formErrors.placement) {
      toast({
        title: "Content will be saved with recommendations",
        description: "We've noted some suggestions to improve your content organization",
        variant: "default",
      });
    }
    
    onSave({
      ...values,
      keywords,
      images,
      documents,
      videos,
      slug: slugInput,
      publishDate: new Date(),
      placement: {
        pageId: values.placementPageId ? parseInt(values.placementPageId.toString()) : undefined,
        sectionId: values.placementSectionId ? parseInt(values.placementSectionId.toString()) : undefined,
        position: values.placementPosition,
      },
      category: categoryInput,
      author: authorInput,
      role: roleInput,
      company: companyInput,
      rating: values.rating,
      answer: answerInput,
      technologies: values.technologies as string[],
      duration: durationInput,
      client: clientInput,
      challenge: challengeInput,
      solution: solutionInput,
      results: resultsInput,
      location: locationInput,
      department: departmentInput,
      responsibilities: values.responsibilities as string[],
      requirements: values.requirements as string[],
      benefits: values.benefits as string[],
      applyUrl: applyUrlInput,
      salaryMin: values.salaryMin,
      salaryMax: values.salaryMax,
    });
  };

  const showTestimonialFields = contentType === "Testimonial";
  const showTeamMemberFields = contentType === "Team Member";
  const showFAQFields = contentType === "FAQ";
  const showCaseStudyFields = contentType === "Case Study";
  const showJobPostingFields = contentType === "Job Posting";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
            <TabsTrigger value="seo" className="flex-1">SEO & Metadata</TabsTrigger>
            <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
            <TabsTrigger value="placement" className="flex-1">Placement</TabsTrigger>
            {showTestimonialFields && <TabsTrigger value="testimonial" className="flex-1">Testimonial</TabsTrigger>}
            {showTeamMemberFields && <TabsTrigger value="team" className="flex-1">Team Member</TabsTrigger>}
            {showFAQFields && <TabsTrigger value="faq" className="flex-1">FAQ</TabsTrigger>}
            {showCaseStudyFields && <TabsTrigger value="case-study" className="flex-1">Case Study</TabsTrigger>}
            {showJobPostingFields && <TabsTrigger value="job" className="flex-1">Job Details</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Page Section">Page Section</SelectItem>
                          <SelectItem value="Page">Page</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Portfolio">Portfolio Item</SelectItem>
                          <SelectItem value="Blog Post">Blog Post</SelectItem>
                          <SelectItem value="Testimonial">Testimonial</SelectItem>
                          <SelectItem value="FAQ">FAQ</SelectItem>
                          <SelectItem value="Team Member">Team Member</SelectItem>
                          <SelectItem value="Case Study">Case Study</SelectItem>
                          <SelectItem value="Job Posting">Job Posting</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {(contentType === "Portfolio" || contentType === "Blog Post") && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter category" 
                        value={categoryInput}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Categorize your {contentType === "Portfolio" ? "portfolio item" : "blog post"} for better organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {(contentType === "Page" || contentType === "Blog Post" || contentType === "Service" || contentType === "Portfolio") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>URL Slug</FormLabel>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Auto-generate from title</span>
                    <Switch 
                      checked={autoGenerateSlug} 
                      onCheckedChange={toggleAutoGenerateSlug} 
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground pr-1">/</span>
                  <Input
                    value={slugInput}
                    onChange={handleSlugChange}
                    disabled={autoGenerateSlug}
                    placeholder="page-url-slug"
                    className="flex-grow"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be the URL of your content: example.com/{slugInput}
                </p>
              </div>
            )}
            
            {contentType === "Page" && (
              <FormField
                control={form.control}
                name="showInNavigation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show in Navigation</FormLabel>
                      <FormDescription>
                        Add this page to the main site navigation menu
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            {contentType === "Blog Post" && (
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "en"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {availableLanguages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the language for this blog post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subtitle (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a short description" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Main content text" 
                      rows={8}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publishing Status</FormLabel>
                    <FormDescription>
                      Set whether this content should be publicly visible
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO Title (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optimized title for search engines
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO Description (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Brief description for search engine results
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add keywords"
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addKeyword}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 h-4 w-4 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Images</span>
                  </Button>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative bg-secondary/40 rounded-md p-2">
                        <img
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs mt-1 truncate">
                          {typeof image === 'string' 
                            ? image.split('/').pop() || image 
                            : image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Documents</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('document-upload')?.click()}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Upload Documents</span>
                  </Button>
                  <input
                    type="file"
                    id="document-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                </div>
                
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/40 p-2 rounded-md">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <p className="text-sm truncate">
                            {typeof doc === 'string' 
                              ? doc.split('/').pop() || doc 
                              : doc.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="h-6 w-6 bg-secondary text-muted-foreground rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Videos (YouTube)</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                    placeholder="Add YouTube URL"
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addVideo();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addVideo}
                    variant="outline"
                    size="icon"
                  >
                    <Youtube className="h-4 w-4" />
                  </Button>
                </div>
                
                {videos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {videos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between bg-secondary/40 p-2 rounded-md">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <Youtube className="h-4 w-4 flex-shrink-0" />
                          <a 
                            href={video} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm truncate text-blue-600 hover:underline"
                          >
                            {video}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideo(video)}
                          className="h-6 w-6 bg-secondary text-muted-foreground rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="placement" className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="placementPageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Page</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a page" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {pages.map(page => (
                          <SelectItem key={page.id} value={page.id.toString()}>
                            {page.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose which page this content should appear on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="placementSectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {pageSections.map(section => (
                          <SelectItem key={section.id} value={section.id.toString()}>
                            {section.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      For nested content, choose a parent section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="placementPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position on Page</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set where this content should appear on the page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          {showTestimonialFields && (
            <TabsContent value="testimonial" className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client/Author Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter client name" 
                          value={authorInput}
                          onChange={handleAuthorChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={() => (
                    <FormItem>
                      <FormLabel>Client Role/Position</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g. CEO, Marketing Director" 
                          value={roleInput}
                          onChange={handleRoleChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={() => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter company name"
                          value={companyInput}
                          onChange={handleCompanyChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={() => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={ratingInput}
                          onChange={handleRatingChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex items-center">
                          <span className="mr-2">{ratingInput}</span>
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          )}
          
          {showFAQFields && (
            <TabsContent value="faq" className="space-y-6">
              <FormField
                control={form.control}
                name="answer"
                render={() => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the answer to this FAQ"
                        rows={6}
                        value={answerInput}
                        onChange={e => handleAnswerChange({
                          ...e, 
                          target: { ...e.target, value: e.target.value }
                        } as unknown as React.ChangeEvent<HTMLInputElement>)}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear and concise answer to the question in the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          )}
          
          {showTeamMemberFields && (
            <TabsContent value="team" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={() => (
                    <FormItem>
                      <FormLabel>Role/Position</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g. CEO, Marketing Director" 
                          value={roleInput}
                          onChange={handleRoleChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={() => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g. Marketing, Development"
                          value={departmentInput}
                          onChange={handleDepartmentChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          )}
          
          {showCaseStudyFields && (
            <TabsContent value="case-study" className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="client"
                  render={() => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter client name"
                          value={clientInput}
                          onChange={handleClientChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="technologies"
                  render={() => (
                    <FormItem>
                      <FormLabel>Technologies Used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g. React, Node.js, AWS (comma separated)"
                          value={technologiesInput}
                          onChange={handleTechnologiesChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter technologies as a comma-separated list
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={() => (
                    <FormItem>
                      <FormLabel>Project Duration</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="E.g. 3 months, Jan-Mar 2024"
                          value={durationInput}
                          onChange={handleDurationChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="challenge"
                  render={() => (
                    <FormItem>
                      <FormLabel>Challenge</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the challenge the client faced"
                          rows={4}
                          value={challengeInput}
                          onChange={handleChallengeChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="solution"
                  render={() => (
                    <FormItem>
                      <FormLabel>Solution</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how you solved the problem"
                          rows={4}
                          value={solutionInput}
                          onChange={handleSolutionChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="results"
                  render={() => (
                    <FormItem>
                      <FormLabel>Results</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the outcomes and benefits achieved"
                          rows={4}
                          value={resultsInput}
                          onChange={handleResultsChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          )}
          
          {showJobPostingFields && (
            <TabsContent value="job" className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={() => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g. Remote, New York, NY"
                            value={locationInput}
                            onChange={handleLocationChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={() => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g. Engineering, Marketing"
                            value={departmentInput}
                            onChange={handleDepartmentChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={() => (
                      <FormItem>
                        <FormLabel>Minimum Salary</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="E.g. 50000"
                            value={salaryMinInput}
                            onChange={handleSalaryMinChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={() => (
                      <FormItem>
                        <FormLabel>Maximum Salary</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="E.g. 80000"
                            value={salaryMaxInput}
                            onChange={handleSalaryMaxChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={() => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List job responsibilities (one per line)"
                          rows={4}
                          value={responsibilitiesInput}
                          onChange={handleResponsibilitiesChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each responsibility on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requirements"
                  render={() => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List job requirements (one per line)"
                          rows={4}
                          value={requirementsInput}
                          onChange={handleRequirementsChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each requirement on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="benefits"
                  render={() => (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List job benefits (one per line)"
                          rows={4}
                          value={benefitsInput}
                          onChange={handleBenefitsChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each benefit on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="applyUrl"
                  render={() => (
                    <FormItem>
                      <FormLabel>Application URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="URL for online application"
                          value={applyUrlInput}
                          onChange={handleApplyUrlChange}
                        />
                      </FormControl>
                      <FormDescription>
                        External link where candidates can apply
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Content" : "Create Content"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
