
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ContentType, ContentItem } from "@/lib/types";
import { storageService } from "@/lib/storage";
import { FormTabs } from "./FormTabs";
import { contentFormSchema, ContentFormValues } from "./schema";

interface ContentFormProps {
  initialValues?: Partial<ContentItem>;
  onSave: (values: ContentItem) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({ initialValues, onSave, onCancel, isEditing = false }) => {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<string[]>(initialValues?.seoKeywords || []);
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
  const [ratingInput, setRatingInput] = useState(
    initialValues?.rating !== undefined ? String(initialValues.rating) : "5"
  );
  const [answerInput, setAnswerInput] = useState(initialValues?.answer || "");
  const [technologiesInput, setTechnologiesInput] = useState(
    initialValues?.technologies ? initialValues.technologies.join(', ') : ""
  );
  const [durationInput, setDurationInput] = useState(initialValues?.duration || "");
  const [clientInput, setClientInput] = useState(initialValues?.client || "");
  const [challengeInput, setChallengeInput] = useState(initialValues?.challenge || "");
  const [solutionInput, setSolutionInput] = useState(initialValues?.solution || "");
  const [resultsInput, setResultsInput] = useState(initialValues?.results || "");
  const [locationInput, setLocationInput] = useState(initialValues?.location || "");
  const [departmentInput, setDepartmentInput] = useState(initialValues?.department || "");
  const [responsibilitiesInput, setResponsibilitiesInput] = useState(
    initialValues?.responsibilities ? initialValues.responsibilities.join('\n') : ""
  );
  const [requirementsInput, setRequirementsInput] = useState(
    initialValues?.requirements ? initialValues.requirements.join('\n') : ""
  );
  const [benefitsInput, setBenefitsInput] = useState(
    initialValues?.benefits ? initialValues.benefits.join('\n') : ""
  );
  const [applyUrlInput, setApplyUrlInput] = useState(initialValues?.applyUrl || "");
  const [salaryMinInput, setSalaryMinInput] = useState(
    initialValues?.salaryMin !== undefined ? String(initialValues.salaryMin) : ""
  );
  const [salaryMaxInput, setSalaryMaxInput] = useState(
    initialValues?.salaryMax !== undefined ? String(initialValues.salaryMax) : ""
  );

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
      seoKeywords: initialValues?.seoKeywords ? initialValues.seoKeywords.join(', ') : "",
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
      salaryMin: salaryMinInput,
      salaryMax: salaryMaxInput,
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
    
    const seoKeywords = values.seoKeywords
      ? values.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      : keywords;
      
    // Convert string values to numbers where needed
    const rating = values.rating ? Number(values.rating) : undefined;
    const salaryMin = values.salaryMin ? Number(values.salaryMin) : undefined;
    const salaryMax = values.salaryMax ? Number(values.salaryMax) : undefined;
    
    const formattedValues: Partial<ContentItem> = {
      ...values,
      slug: slugInput,
      seoKeywords,
      images,
      documents,
      videos,
      rating,
      technologies: parsedTechnologies,
      responsibilities: parsedResponsibilities,
      requirements: parsedRequirements,
      benefits: parsedBenefits,
      salaryMin,
      salaryMax,
      placement: {
        pageId: values.placementPageId ? Number(values.placementPageId) : undefined,
        sectionId: values.placementSectionId ? Number(values.placementSectionId) : undefined,
        position: values.placementPosition === "none" ? undefined : values.placementPosition,
      },
      lastUpdated: new Date().toISOString(),
      id: initialValues?.id,
    };
    
    onSave(formattedValues as ContentItem);
  };

  // Helper methods for the form fields
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

  // Value handlers for specialized fields
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

  // Form tab state and helper fields
  const formTabProps = {
    activeTab,
    setActiveTab,
    contentType,
    form,
    // Form state
    slugInput,
    autoGenerateSlug,
    keywordInput,
    keywords,
    formErrors,
    images,
    documents,
    videos,
    videoInput,
    pages,
    pageSections,
    // Testimonial fields
    authorInput,
    roleInput,
    companyInput,
    ratingInput,
    // FAQ fields
    answerInput,
    // Team Member fields
    departmentInput,
    responsibilitiesInput,
    // Case Study fields
    clientInput,
    durationInput,
    technologiesInput,
    challengeInput,
    solutionInput,
    resultsInput,
    // Job Posting fields
    locationInput,
    requirementsInput,
    benefitsInput,
    applyUrlInput,
    salaryMinInput,
    salaryMaxInput,
    categoryInput,
    // Handlers
    handleSlugChange,
    toggleAutoGenerateSlug,
    addKeyword,
    removeKeyword,
    setKeywordInput,
    handleImageChange,
    removeImage,
    handleDocumentChange,
    removeDocument,
    addVideo,
    removeVideo,
    setVideoInput,
    handleCategoryChange,
    handleAuthorChange,
    handleRoleChange,
    handleCompanyChange,
    handleRatingChange,
    handleAnswerChange,
    handleTechnologiesChange,
    handleDurationChange,
    handleClientChange,
    handleChallengeChange,
    handleSolutionChange,
    handleResultsChange,
    handleLocationChange,
    handleDepartmentChange,
    handleResponsibilitiesChange,
    handleRequirementsChange,
    handleBenefitsChange,
    handleApplyUrlChange,
    handleSalaryMinChange,
    handleSalaryMaxChange,
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormTabs {...formTabProps} />
        
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
