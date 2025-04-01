
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ContentFormValues } from "../schema";
import { TabsContent } from "@/components/ui/tabs";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TestimonialTabProps {
  form: UseFormReturn<ContentFormValues>;
  authorInput: string;
  roleInput: string;
  companyInput: string;
  ratingInput: string;
  handleAuthorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompanyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRatingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TestimonialTab: React.FC<TestimonialTabProps> = ({
  form,
  authorInput,
  roleInput,
  companyInput,
  ratingInput,
  handleAuthorChange,
  handleRoleChange,
  handleCompanyChange,
  handleRatingChange,
}) => {
  return (
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
};
