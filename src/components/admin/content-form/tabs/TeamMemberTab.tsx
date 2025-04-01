
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

interface TeamMemberTabProps {
  form: UseFormReturn<ContentFormValues>;
  roleInput: string;
  departmentInput: string;
  responsibilitiesInput: string;
  handleRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDepartmentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResponsibilitiesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TeamMemberTab: React.FC<TeamMemberTabProps> = ({
  form,
  roleInput,
  departmentInput,
  responsibilitiesInput,
  handleRoleChange,
  handleDepartmentChange,
  handleResponsibilitiesChange,
}) => {
  return (
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
};
