import React from "react";
import { ContentType } from "@/lib/types";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, GanttChart } from "lucide-react";
import { ContentItem } from "@/lib/types";

interface PlacementTabProps {
  form: UseFormReturn<ContentFormValues>;
  contentType: ContentType;
  pages: ContentItem[];
  pageSections: ContentItem[];
  formErrors: {
    slug?: string;
    keywords?: string;
    placement?: string;
  };
}

export const PlacementTab: React.FC<PlacementTabProps> = ({
  form,
  contentType,
  pages,
  pageSections,
  formErrors,
}) => {
  return (
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
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Default</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="before">Before</SelectItem>
                        <SelectItem value="after">After</SelectItem>
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
  );
};
