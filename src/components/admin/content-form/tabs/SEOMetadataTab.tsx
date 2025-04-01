
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

interface SEOMetadataTabProps {
  form: UseFormReturn<ContentFormValues>;
}

export const SEOMetadataTab: React.FC<SEOMetadataTabProps> = ({ form }) => {
  return (
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
  );
};
