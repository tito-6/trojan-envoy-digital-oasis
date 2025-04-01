
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { ContentType } from "@/lib/types";
import { availableLanguages } from "@/lib/i18n";

interface BasicInfoTabProps {
  form: UseFormReturn<ContentFormValues>;
  contentType: ContentType;
  slugInput: string;
  autoGenerateSlug: boolean;
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleAutoGenerateSlug: () => void;
  formErrors: {
    slug?: string;
    keywords?: string;
    placement?: string;
  };
  keywordInput: string;
  keywords: string[];
  addKeyword: () => void;
  removeKeyword: (keyword: string) => void;
  setKeywordInput: (value: string) => void;
  categoryInput: string;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  form,
  contentType,
  slugInput,
  autoGenerateSlug,
  handleSlugChange,
  toggleAutoGenerateSlug,
  formErrors,
  keywordInput,
  keywords,
  addKeyword,
  removeKeyword,
  setKeywordInput,
  categoryInput,
  handleCategoryChange,
}) => {
  return (
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
  );
};
