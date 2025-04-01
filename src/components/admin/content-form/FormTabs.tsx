
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentType } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from "./schema";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { SEOMetadataTab } from "./tabs/SEOMetadataTab";
import { MediaTab } from "./tabs/MediaTab";
import { PlacementTab } from "./tabs/PlacementTab";
import { TestimonialTab } from "./tabs/TestimonialTab";
import { FAQTab } from "./tabs/FAQTab";
import { TeamMemberTab } from "./tabs/TeamMemberTab";
import { CaseStudyTab } from "./tabs/CaseStudyTab";
import { JobPostingTab } from "./tabs/JobPostingTab";

interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  contentType: ContentType;
  form: UseFormReturn<ContentFormValues>;
  // Form state
  slugInput: string;
  autoGenerateSlug: boolean;
  keywordInput: string;
  keywords: string[];
  formErrors: {
    slug?: string;
    keywords?: string;
    placement?: string;
  };
  images: (File | string)[];
  documents: (File | string)[];
  videos: string[];
  videoInput: string;
  pages: any[];
  pageSections: any[];
  // Testimonial fields
  authorInput: string;
  roleInput: string;
  companyInput: string;
  ratingInput: string;
  // FAQ fields
  answerInput: string;
  // Team Member fields
  departmentInput: string;
  responsibilitiesInput: string;
  // Case Study fields
  clientInput: string;
  durationInput: string;
  technologiesInput: string;
  challengeInput: string;
  solutionInput: string;
  resultsInput: string;
  // Job Posting fields
  locationInput: string;
  requirementsInput: string;
  benefitsInput: string;
  applyUrlInput: string;
  salaryMinInput: string;
  salaryMaxInput: string;
  categoryInput: string;
  // Handlers
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleAutoGenerateSlug: () => void;
  addKeyword: () => void;
  removeKeyword: (keyword: string) => void;
  setKeywordInput: (value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeDocument: (index: number) => void;
  addVideo: () => void;
  removeVideo: (video: string) => void;
  setVideoInput: (value: string) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAuthorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRatingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAnswerChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTechnologiesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChallengeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSolutionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleResultsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDepartmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResponsibilitiesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleRequirementsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBenefitsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleApplyUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSalaryMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSalaryMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  activeTab,
  setActiveTab,
  contentType,
  form,
  ...props
}) => {
  const showTestimonialFields = contentType === "Testimonial";
  const showTeamMemberFields = contentType === "Team Member";
  const showFAQFields = contentType === "FAQ";
  const showCaseStudyFields = contentType === "Case Study";
  const showJobPostingFields = contentType === "Job Posting";

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
        <TabsTrigger value="seo" className="flex-1">SEO & Metadata</TabsTrigger>
        <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
        <TabsTrigger value="placement" className="flex-1">Placement</TabsTrigger>
        {showTestimonialFields && (
          <TabsTrigger value="testimonial" className="flex-1">Testimonial</TabsTrigger>
        )}
        {showTeamMemberFields && (
          <TabsTrigger value="team" className="flex-1">Team Member</TabsTrigger>
        )}
        {showFAQFields && (
          <TabsTrigger value="faq" className="flex-1">FAQ</TabsTrigger>
        )}
        {showCaseStudyFields && (
          <TabsTrigger value="case-study" className="flex-1">Case Study</TabsTrigger>
        )}
        {showJobPostingFields && (
          <TabsTrigger value="job" className="flex-1">Job Posting</TabsTrigger>
        )}
      </TabsList>
      
      <BasicInfoTab 
        form={form} 
        contentType={contentType} 
        {...props} 
      />
      
      <SEOMetadataTab 
        form={form} 
      />
      
      <MediaTab 
        {...props} 
      />
      
      <PlacementTab 
        form={form} 
        contentType={contentType} 
        pages={props.pages}
        pageSections={props.pageSections}
        formErrors={props.formErrors}
      />
      
      {showTestimonialFields && (
        <TestimonialTab 
          form={form}
          authorInput={props.authorInput}
          roleInput={props.roleInput}
          companyInput={props.companyInput}
          ratingInput={props.ratingInput}
          handleAuthorChange={props.handleAuthorChange}
          handleRoleChange={props.handleRoleChange}
          handleCompanyChange={props.handleCompanyChange}
          handleRatingChange={props.handleRatingChange}
        />
      )}
      
      {showFAQFields && (
        <FAQTab
          form={form}
          answerInput={props.answerInput}
          handleAnswerChange={props.handleAnswerChange}
        />
      )}
      
      {showTeamMemberFields && (
        <TeamMemberTab
          form={form}
          roleInput={props.roleInput}
          departmentInput={props.departmentInput}
          responsibilitiesInput={props.responsibilitiesInput}
          handleRoleChange={props.handleRoleChange}
          handleDepartmentChange={props.handleDepartmentChange}
          handleResponsibilitiesChange={props.handleResponsibilitiesChange}
        />
      )}
      
      {showCaseStudyFields && (
        <CaseStudyTab
          form={form}
          clientInput={props.clientInput}
          durationInput={props.durationInput}
          technologiesInput={props.technologiesInput}
          challengeInput={props.challengeInput}
          solutionInput={props.solutionInput}
          resultsInput={props.resultsInput}
          handleClientChange={props.handleClientChange}
          handleDurationChange={props.handleDurationChange}
          handleTechnologiesChange={props.handleTechnologiesChange}
          handleChallengeChange={props.handleChallengeChange}
          handleSolutionChange={props.handleSolutionChange}
          handleResultsChange={props.handleResultsChange}
        />
      )}
      
      {showJobPostingFields && (
        <JobPostingTab
          form={form}
          locationInput={props.locationInput}
          departmentInput={props.departmentInput}
          salaryMinInput={props.salaryMinInput}
          salaryMaxInput={props.salaryMaxInput}
          responsibilitiesInput={props.responsibilitiesInput}
          requirementsInput={props.requirementsInput}
          benefitsInput={props.benefitsInput}
          applyUrlInput={props.applyUrlInput}
          handleLocationChange={props.handleLocationChange}
          handleDepartmentChange={props.handleDepartmentChange}
          handleSalaryMinChange={props.handleSalaryMinChange}
          handleSalaryMaxChange={props.handleSalaryMaxChange}
          handleResponsibilitiesChange={props.handleResponsibilitiesChange}
          handleRequirementsChange={props.handleRequirementsChange}
          handleBenefitsChange={props.handleBenefitsChange}
          handleApplyUrlChange={props.handleApplyUrlChange}
        />
      )}
    </Tabs>
  );
};
