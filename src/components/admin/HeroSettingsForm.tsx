
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { HeroSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must not exceed 100 characters"),
  subtitle: z.string().max(100, "Subtitle must not exceed 100 characters"),
  description: z.string().max(300, "Description must not exceed 300 characters"),
  primaryButtonText: z.string().min(1, "Primary button text is required"),
  primaryButtonUrl: z.string().min(1, "Primary button URL is required"),
  secondaryButtonText: z.string().min(1, "Secondary button text is required"),
  secondaryButtonUrl: z.string().min(1, "Secondary button URL is required"),
  showPartnerLogos: z.boolean(),
  partnerSectionTitle: z.string().max(100, "Partner section title must not exceed 100 characters"),
  partnerCertifiedText: z.string().max(50, "Partner certified text must not exceed 50 characters"),
  showTechStack: z.boolean(),
  techStackTitle: z.string().max(100, "Tech stack title must not exceed 100 characters"),
  techStackSubtitle: z.string().max(100, "Tech stack subtitle must not exceed 100 characters"),
  techStackDescription: z.string().max(200, "Tech stack description must not exceed 200 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const HeroSettingsForm: React.FC = () => {
  const { toast } = useToast();
  const heroSettings = storageService.getHeroSettings();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: heroSettings.title,
      subtitle: heroSettings.subtitle,
      description: heroSettings.description,
      primaryButtonText: heroSettings.primaryButtonText,
      primaryButtonUrl: heroSettings.primaryButtonUrl,
      secondaryButtonText: heroSettings.secondaryButtonText,
      secondaryButtonUrl: heroSettings.secondaryButtonUrl,
      showPartnerLogos: heroSettings.showPartnerLogos,
      partnerSectionTitle: heroSettings.partnerSectionTitle,
      partnerCertifiedText: heroSettings.partnerCertifiedText,
      showTechStack: heroSettings.showTechStack,
      techStackTitle: heroSettings.techStackTitle,
      techStackSubtitle: heroSettings.techStackSubtitle,
      techStackDescription: heroSettings.techStackDescription,
    }
  });
  
  const onSubmit = (values: FormValues) => {
    const updatedSettings: Partial<HeroSettings> = {
      ...values
    };
    
    storageService.saveHeroSettings(updatedSettings);
    
    toast({
      title: "Settings updated",
      description: "Hero section settings have been successfully updated.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section Settings</CardTitle>
        <CardDescription>
          Customize the main content and buttons in your hero section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Headline</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter main headline" />
                      </FormControl>
                      <FormDescription>
                        This is the main headline of your hero section
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
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter subtitle" />
                      </FormControl>
                      <FormDescription>
                        This appears below the main headline
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter description" 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of your company or services
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="primaryButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Get Started" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="primaryButtonUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/contact" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="secondaryButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Explore Services" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="secondaryButtonUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/services" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="showPartnerLogos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Partner Logos</FormLabel>
                        <FormDescription>
                          Display the "Trusted By" partner logos section
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
                
                <FormField
                  control={form.control}
                  name="partnerSectionTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Section Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Trusted By Industry Leaders" />
                      </FormControl>
                      <FormDescription>
                        The heading above the partner logos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="partnerCertifiedText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partner Certified Text</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Certified" />
                      </FormControl>
                      <FormDescription>
                        Text displayed below each partner logo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="showTechStack"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Technology Stack</FormLabel>
                        <FormDescription>
                          Display the technology stack section
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
                
                <FormField
                  control={form.control}
                  name="techStackTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tech Stack Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Built With Modern Technologies" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="techStackSubtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tech Stack Subtitle</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tech Stack" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="techStackDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tech Stack Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="We leverage cutting-edge technology to build modern, scalable solutions" 
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full sm:w-auto">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default HeroSettingsForm;
