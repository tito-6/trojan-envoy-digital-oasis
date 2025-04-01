
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { HeaderSettings } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { availableLanguages } from "@/lib/i18n";

const headerSettingsSchema = z.object({
  siteTitle: z.string().min(2, { message: "Site title must be at least 2 characters" }),
  logoPath: z.string().optional(),
  contactButtonText: z.string().min(2, { message: "Button text must be at least 2 characters" }),
  contactButtonPath: z.string().min(1, { message: "Button path is required" }),
  showLanguageSelector: z.boolean().default(true),
  showThemeToggle: z.boolean().default(true),
  enabledLanguages: z.array(z.string()).min(1, { message: "At least one language must be enabled" }),
  defaultLanguage: z.string().min(2, { message: "Default language is required" }),
  mobileMenuLabel: z.string().min(2, { message: "Mobile menu label is required" }),
});

type HeaderSettingsFormValues = z.infer<typeof headerSettingsSchema>;

const HeaderSettingsForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<HeaderSettingsFormValues>({
    resolver: zodResolver(headerSettingsSchema),
    defaultValues: {
      siteTitle: "Trojan Envoy",
      logoPath: "",
      contactButtonText: "Contact Us",
      contactButtonPath: "/contact",
      showLanguageSelector: true,
      showThemeToggle: true,
      enabledLanguages: ["en"],
      defaultLanguage: "en",
      mobileMenuLabel: "Menu",
    },
  });

  useEffect(() => {
    // Load current settings
    const settings = storageService.getHeaderSettings();
    form.reset({
      siteTitle: settings.siteTitle,
      logoPath: settings.logoPath || "",
      contactButtonText: settings.contactButtonText,
      contactButtonPath: settings.contactButtonPath,
      showLanguageSelector: settings.showLanguageSelector,
      showThemeToggle: settings.showThemeToggle,
      enabledLanguages: settings.enabledLanguages,
      defaultLanguage: settings.defaultLanguage,
      mobileMenuLabel: settings.mobileMenuLabel,
    });
  }, [form]);

  const onSubmit = (data: HeaderSettingsFormValues) => {
    try {
      // Update header settings
      storageService.updateHeaderSettings(data as Partial<HeaderSettings>);
      
      toast({
        title: "Settings Updated",
        description: "Header settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating header settings:", error);
      toast({
        title: "Error",
        description: "Failed to update header settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Header Settings</h2>
        <p className="text-muted-foreground">
          Manage how the header appears on your website.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Configure your site title and logo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="siteTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter site title" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name displayed in the header.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo Path (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="/images/logo.svg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Path to your logo image. Leave empty to use the site title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Button</CardTitle>
                  <CardDescription>
                    Configure the contact button in the header.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactButtonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact Us" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactButtonPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/contact" {...field} />
                        </FormControl>
                        <FormDescription>
                          The page to navigate to when the button is clicked.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mobile Navigation</CardTitle>
                  <CardDescription>
                    Configure mobile navigation settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="mobileMenuLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Menu Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Menu" {...field} />
                        </FormControl>
                        <FormDescription>
                          Label for the mobile menu button (used for accessibility).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Display Options</CardTitle>
                  <CardDescription>
                    Control which elements are displayed in the header.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="showLanguageSelector"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Language Selector</FormLabel>
                          <FormDescription>
                            Allow users to switch between available languages.
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
                    name="showThemeToggle"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Theme Toggle</FormLabel>
                          <FormDescription>
                            Allow users to switch between light and dark modes.
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Language Settings</CardTitle>
                  <CardDescription>
                    Configure which languages are available and set the default.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="enabledLanguages"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Enabled Languages</FormLabel>
                          <FormDescription>
                            Select which languages will be available on your site.
                          </FormDescription>
                        </div>
                        {availableLanguages.map((language) => (
                          <FormField
                            key={language.code}
                            control={form.control}
                            name="enabledLanguages"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={language.code}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(language.code)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, language.code])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== language.code
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {language.name} ({language.code})
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {form.watch("enabledLanguages").map((code) => {
                            const language = availableLanguages.find(lang => lang.code === code);
                            return (
                              <option key={code} value={code}>
                                {language ? language.name : code}
                              </option>
                            );
                          })}
                        </select>
                        <FormDescription>
                          The default language for your website.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <Button type="submit" className="ml-auto">
              Save Changes
            </Button>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default HeaderSettingsForm;
