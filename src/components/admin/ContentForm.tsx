
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

// Updated schema with proper number handling
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
  placementPageId: z.string().optional()
    .transform(val => val && val !== "none" ? parseInt(val) : undefined),
  placementSectionId: z.string().optional()
    .transform(val => val && val !== "none" ? parseInt(val) : undefined),
  placementPosition: z.enum(["top", "middle", "bottom", "none"] as const).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  role: z.string().optional(),
  company: z.string().optional(),
  rating: z.string().optional()
    .transform(val => val ? Number(val) : undefined),
  answer: z.string().optional(),
  // Make sure technologies is a string in the schema
  technologies: z.string().optional(),
  duration: z.string().optional(),
  client: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  location: z.string().optional(),
  department: z.string().optional(),
  // Make sure these are strings in the schema
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  applyUrl: z.string().optional(),
  salaryMin: z.string().optional()
    .transform(val => val ? Number(val) : undefined),
  salaryMax: z.string().optional()
    .transform(val => val ? Number(val) : undefined),
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
    technologies?: string[];
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
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
  const [ratingInput, setRatingInput] = useState(initialValues?.rating !== undefined ? String(initialValues.rating) : "5");
  const [answerInput, setAnswerInput] = useState(initialValues?.answer || "");
  const [technologiesInput, setTechnologiesInput] = useState(initialValues?.technologies ? initialValues.technologies.join(', ') : "");
  const [durationInput, setDurationInput] = useState(initialValues?.duration || "");
  const [clientInput, setClientInput] = useState(initialValues?.client || "");
  const [challengeInput, setChallengeInput] = useState(initialValues?.challenge || "");
  const [solutionInput, setSolutionInput] = useState(initialValues?.solution || "");
  const [resultsInput, setResultsInput] = useState(initialValues?.results || "");
  const [locationInput, setLocationInput] = useState(initialValues?.location || "");
  const [departmentInput, setDepartmentInput] = useState(initialValues?.department || "");
  const [responsibilitiesInput, setResponsibilitiesInput] = useState(initialValues?.responsibilities ? initialValues.responsibilities.join('\n') : "");
  const [requirementsInput, setRequirementsInput] = useState(initialValues?.requirements ? initialValues.requirements.join('\n') : "");
  const [benefitsInput, setBenefitsInput] = useState(initialValues?.benefits ? initialValues.benefits.join('\n') : "");
  const [applyUrlInput, setApplyUrlInput] = useState(initialValues?.applyUrl || "");
  const [salaryMinInput, setSalaryMinInput] = useState(initialValues?.salaryMin !== undefined ? String(initialValues.salaryMin) : "");
  const [salaryMaxInput, setSalaryMaxInput] = useState(initialValues?.salaryMax !== undefined ? String(initialValues.salaryMax) : "");

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
      placementPageId: initialValues?.placement?.pageId !== undefined ? String(initialValues.placement.pageId) : undefined,
      placementSectionId: initialValues?.placement?.sectionId !== undefined ? String(initialValues.placement.sectionId) : undefined,
      placementPosition: initialValues?.placement?.position || undefined,
      category: initialValues?.category || "",
      author: initialValues?.author || "",
      role: initialValues?.role || "",
      company: initialValues?.company || "",
      rating: initialValues?.rating !== undefined ? String(initialValues.rating) : "5",
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
      salaryMin: initialValues?.salaryMin !== undefined ? String(initialValues.salaryMin) : "",
      salaryMax: initialValues?.salaryMax !== undefined ? String(initialValues.salaryMax) : "",
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

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      if (title) {
        const generatedSlug = title.toLowerCase().replace(/\s+/g, '-');
        setSlugInput(generatedSlug);
        form.setValue("slug", generatedSlug);
      }
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
    
    // Parse string inputs into arrays
    const parsedTechnologies = technologiesInput
      ? technologiesInput.split(',').map(t => t.trim()).filter(Boolean) 
      : [];
    
    const parsedResponsibilities = responsibilitiesInput
      ? responsibilitiesInput.split('\n').map(r => r.trim()).filter(Boolean) 
      : [];
    
    const parsedRequirements = requirementsInput
      ? requirementsInput.split('\n').map(r => r.trim()).filter(Boolean) 
      : [];
    
    const parsedBenefits = benefitsInput
      ? benefitsInput.split('\n').map(b => b.trim()).filter(Boolean) 
      : [];
    
    onSave({
      ...values,
      keywords,
      images,
      documents,
      videos,
      slug: slugInput,
      publishDate: new Date(),
      placement: {
        pageId: values.placementPageId,
        sectionId: values.placementSectionId,
        position: values.placementPosition === "none" ? undefined : values.placementPosition,
      },
      category: categoryInput,
      author: authorInput,
      role: roleInput,
      company: companyInput,
      technologies: parsedTechnologies, 
      duration: durationInput,
      client: clientInput,
      challenge: challengeInput,
      solution: solutionInput,
      results: resultsInput,
      location: locationInput,
      department: departmentInput,
      responsibilities: parsedResponsibilities,
      requirements: parsedRequirements,
      benefits: parsedBenefits,
      applyUrl: applyUrlInput
    });
  };

  const showTestimonialFields = contentType === "Testimonial";
  const showTeamMemberFields = contentType === "Team Member";
  const showFAQFields = contentType === "FAQ";
  const showCaseStudyFields = contentType === "Case Study";
  const showJobPostingFields = contentType === "Job Posting";

  // Render functions for each type of content form fields
  const renderTestimonialFields = () => (
    <TabsContent value="testimonial" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter author name" 
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter role" 
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter company" 
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Enter rating" 
                  value={ratingInput}
                  onChange={handleRatingChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );

  const renderFAQFields = () => (
    <TabsContent value="faq" className="space-y-6">
      <FormField
        control={form.control}
        name="answer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter answer" 
                rows={5}
                value={answerInput}
                onChange={handleAnswerChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );

  const renderTeamMemberFields = () => (
    <TabsContent value="team" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role/Position</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter role" 
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter department" 
                  value={departmentInput}
                  onChange={handleDepartmentChange}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsibilities</FormLabel>
            <FormDescription>Enter each responsibility on a new line</FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter responsibilities" 
                rows={5}
                value={responsibilitiesInput}
                onChange={handleResponsibilitiesChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );

  const renderCaseStudyFields = () => (
    <TabsContent value="case-study" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter client" 
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. 3 months" 
                  value={durationInput}
                  onChange={handleDurationChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="technologies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Technologies</FormLabel>
            <FormDescription>Enter technologies separated by commas (e.g. React, Node.js, Supabase)</FormDescription>
            <FormControl>
              <Input 
                placeholder="Enter technologies" 
                value={technologiesInput}
                onChange={handleTechnologiesChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="challenge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Challenge</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the challenge" 
                rows={3}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solution</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the solution" 
                rows={3}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Results</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the results" 
                rows={3}
                value={resultsInput}
                onChange={handleResultsChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );

  const renderJobPostingFields = () => (
    <TabsContent value="job" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Remote, New York, NY" 
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Engineering, Marketing" 
                  value={departmentInput}
                  onChange={handleDepartmentChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="salaryMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Salary</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="e.g. 50000" 
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Salary</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="e.g. 80000" 
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsibilities</FormLabel>
            <FormDescription>Enter each responsibility on a new line</FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter responsibilities" 
                rows={4}
                value={responsibilitiesInput}
                onChange={handleResponsibilitiesChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requirements</FormLabel>
            <FormDescription>Enter each requirement on a new line</FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter requirements" 
                rows={4}
                value={requirementsInput}
                onChange={handleRequirementsChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefits</FormLabel>
            <FormDescription>Enter each benefit on a new line</FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter benefits" 
                rows={4}
                value={benefitsInput}
                onChange={handleBenefitsChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="applyUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Application URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter URL for application" 
                value={applyUrlInput}
                onChange={handleApplyUrlChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  );

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
            {showJobPostingFields && <TabsTrigger value="job" className="flex-1">Job Posting</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: ContentType) => {
                        field.onChange(value);
                        // Reset active tab when changing content type
                        setActiveTab("basic");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Page">Page</SelectItem>
                          <SelectItem value="Page Section">Page Section</SelectItem>
                          <SelectItem value="Blog Post">Blog Post</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Portfolio">Portfolio</SelectItem>
                          <SelectItem value="Testimonial">Testimonial</SelectItem>
                          <SelectItem value="FAQ">FAQ</SelectItem>
                          <SelectItem value="Team Member">Team Member</SelectItem>
                          <SelectItem value="Case Study">Case Study</SelectItem>
                          <SelectItem value="Job Posting">Job Posting</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The type of content determines where and how it will be displayed on your website
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The title will be displayed as the main heading
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter subtitle" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A subtitle provides additional context to the title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(contentType === "Page" || contentType === "Blog Post" || 
              contentType === "Service" || contentType === "Portfolio") && (
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>URL Slug</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={autoGenerateSlug}
                          onCheckedChange={toggleAutoGenerateSlug}
                          id="auto-slug"
                        />
                        <label
                          htmlFor="auto-slug"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Auto-generate
                        </label>
                      </div>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="Enter URL slug" 
                        value={slugInput}
                        onChange={handleSlugChange}
                        disabled={autoGenerateSlug}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be used in the URL: {contentType === "Blog Post" ? "/blog/" : 
                                                    contentType === "Page" ? "/" :
                                                    `/${contentType.toLowerCase()}/`}{slugInput || "your-slug"}
                    </FormDescription>
                    {formErrors.slug && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {formErrors.slug}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of this content
                  </FormDescription>
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
                      placeholder="Enter content" 
                      {...field} 
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content. You can use basic markdown for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {contentType === "Blog Post" && (
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
                      The main category for this blog post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {contentType === "Blog Post" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Keywords/Tags</FormLabel>
                  {formErrors.keywords && (
                    <p className="text-sm font-medium text-amber-500">
                      {formErrors.keywords}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a keyword"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={addKeyword}
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="rounded-full h-4 w-4 inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {keywords.length === 0 && (
                    <p className="text-sm text-muted-foreground">No keywords added yet</p>
                  )}
                </div>
              </div>
            )}
            
            {contentType === "Blog Post" && (
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
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
                    </FormControl>
                    <FormDescription>
                      The language this content is written in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>
                        This content will be visible on your website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {contentType === "Page" && (
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="showInNavigation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Show in Navigation</FormLabel>
                        <FormDescription>
                          Add this page to your main navigation menu
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-6">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter SEO title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The title that will appear in search engine results (defaults to regular title if left empty)
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
                    <Textarea 
                      placeholder="Enter SEO description" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    A description that will appear in search engine results (defaults to regular description if left empty)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Images</h3>
              <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-sm font-medium mb-1">Drag images here or click to upload</h4>
                  <p className="text-xs text-muted-foreground mb-4">Upload images to include in your content</p>
                  <label className="cursor-pointer">
                    <Button variant="outline" type="button" className="relative">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </label>
                </div>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative group border rounded-md overflow-hidden aspect-square bg-muted"
                    >
                      <img 
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Uploaded ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-8 h-8 p-0 rounded-full"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Documents</h3>
              <div className="border border-dashed border-border rounded-lg p-6 text-center mb-4">
                <div className="flex flex-col items-center">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-sm font-medium mb-1">Drag documents here or click to upload</h4>
                  <p className="text-xs text-muted-foreground mb-4">Upload PDFs, Word documents, or other files</p>
                  <label className="cursor-pointer">
                    <Button variant="outline" type="button" className="relative">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleDocumentChange}
                      />
                    </Button>
                  </label>
                </div>
              </div>
              
              {documents.length > 0 && (
                <div className="space-y-2 mb-6">
                  {documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm truncate max-w-[300px]">
                          {typeof doc === 'string' ? doc.split('/').pop() : doc.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Videos</h3>
              <div className="space-y-4 mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube URL"
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    onClick={addVideo}
                    variant="secondary"
                  >
                    <Youtube className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only YouTube videos are supported. Paste the full video URL.
                </p>
              </div>
              
              {videos.length > 0 && (
                <div className="space-y-2 mb-6">
                  {videos.map((video, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <Youtube className="h-5 w-5 text-red-500" />
                        <span className="text-sm truncate max-w-[300px]">{video}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full"
                        onClick={() => removeVideo(video)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="placement" className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-md mb-6">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Publish Date</h3>
                  <p className="text-xs text-muted-foreground">
                    Content will be published immediately if set to "Published". Changes can be made later.
                  </p>
                </div>
              </div>
            </div>
            
            {contentType === "Page Section" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Section Placement</h3>
                  {formErrors.placement && (
                    <p className="text-sm font-medium text-amber-500">
                      {formErrors.placement}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="placementPageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place on Page</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || "none"}
                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a page" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {pages.map(page => (
                                <SelectItem key={page.id} value={String(page.id)}>
                                  {page.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select the page where this section should appear
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
                        <FormLabel>Place Inside Section</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || "none"}
                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {pageSections.map(section => (
                                <SelectItem key={section.id} value={String(section.id)}>
                                  {section.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select a parent section (optional)
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
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || "none"}
                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value as "top" | "middle" | "bottom")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Default</SelectItem>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="middle">Middle</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Position within the page or parent section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="p-4 border border-border rounded-md">
                    <div className="flex items-start gap-2">
                      <GanttChart className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium mb-1">Layout Structure Tips</h4>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Sections can be placed on a page or inside another section</li>
                          <li>Placing sections within other sections creates a nested layout</li>
                          <li>Use the position setting to control the order of sections</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {showTestimonialFields && renderTestimonialFields()}
          {showFAQFields && renderFAQFields()}
          {showTeamMemberFields && renderTeamMemberFields()}
          {showCaseStudyFields && renderCaseStudyFields()}
          {showJobPostingFields && renderJobPostingFields()}
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Save"} {contentType}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
