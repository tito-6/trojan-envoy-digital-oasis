
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from "../schema";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JobPostingTabProps {
  form: UseFormReturn<ContentFormValues>;
  locationInput: string;
  departmentInput: string;
  salaryMinInput: string;
  salaryMaxInput: string;
  responsibilitiesInput: string;
  requirementsInput: string;
  benefitsInput: string;
  applyUrlInput: string;
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDepartmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSalaryMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSalaryMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResponsibilitiesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleRequirementsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBenefitsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleApplyUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const JobPostingTab: React.FC<JobPostingTabProps> = ({
  form,
  locationInput,
  departmentInput,
  salaryMinInput,
  salaryMaxInput,
  responsibilitiesInput,
  requirementsInput,
  benefitsInput,
  applyUrlInput,
  handleLocationChange,
  handleDepartmentChange,
  handleSalaryMinChange,
  handleSalaryMaxChange,
  handleResponsibilitiesChange,
  handleRequirementsChange,
  handleBenefitsChange,
  handleApplyUrlChange,
}) => {
  return (
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
};
