
import React, { useState, useEffect } from "react";
import { storageService } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash, Plus, X, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { FooterSettings, FooterSettingsFormData, SocialLink, FooterSection, FooterLink } from "@/lib/types";

const FooterSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FooterSettings>(() => storageService.getFooterSettings());
  const [activeTab, setActiveTab] = useState("general");
  const [isEditing, setIsEditing] = useState(false);
  const [footerSectionToEdit, setFooterSectionToEdit] = useState<FooterSection | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<{ sectionId: number; link: FooterLink } | null>(null);
  const [showAddSocialLinkDialog, setShowAddSocialLinkDialog] = useState(false);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  useEffect(() => {
    const handleFooterSettingsChange = () => {
      setSettings(storageService.getFooterSettings());
    };

    const unsubscribe = storageService.addEventListener('footer-settings-updated', handleFooterSettingsChange);

    return () => {
      unsubscribe();
    };
  }, []);

  const generalFormSchema = z.object({
    copyrightText: z.string().min(1, "Copyright text is required"),
    privacyPolicyLink: z.string().min(1, "Privacy policy link is required"),
    termsOfServiceLink: z.string().min(1, "Terms of service link is required"),
    companyInfo: z.object({
      description: z.string().min(1, "Company description is required"),
      address: z.string().min(1, "Company address is required"),
      phone: z.string().min(1, "Company phone is required"),
      email: z.string().email("Invalid email address").min(1, "Company email is required"),
    }),
  });

  const socialLinkSchema = z.object({
    platform: z.string().min(1, "Platform name is required"),
    icon: z.string().min(1, "Icon is required"),
    url: z.string().url("Must be a valid URL").min(1, "URL is required"),
  });

  const footerSectionSchema = z.object({
    title: z.string().min(1, "Section title is required"),
  });

  const footerLinkSchema = z.object({
    label: z.string().min(1, "Link label is required"),
    path: z.string().min(1, "Link path is required"),
    isExternal: z.boolean().default(false),
  });

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      copyrightText: settings.copyrightText,
      privacyPolicyLink: settings.privacyPolicyLink,
      termsOfServiceLink: settings.termsOfServiceLink,
      companyInfo: {
        description: settings.companyInfo.description,
        address: settings.companyInfo.address,
        phone: settings.companyInfo.phone,
        email: settings.companyInfo.email,
      },
    },
  });

  const socialLinkForm = useForm<z.infer<typeof socialLinkSchema>>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      icon: "",
      url: "",
    },
  });

  const footerSectionForm = useForm<z.infer<typeof footerSectionSchema>>({
    resolver: zodResolver(footerSectionSchema),
    defaultValues: {
      title: "",
    },
  });

  const footerLinkForm = useForm<z.infer<typeof footerLinkSchema>>({
    resolver: zodResolver(footerLinkSchema),
    defaultValues: {
      label: "",
      path: "",
      isExternal: false,
    },
  });

  const onUpdateGeneralSettings = (data: z.infer<typeof generalFormSchema>) => {
    try {
      const updatedSettings: Partial<FooterSettings> = {
        copyrightText: data.copyrightText,
        privacyPolicyLink: data.privacyPolicyLink,
        termsOfServiceLink: data.termsOfServiceLink,
        companyInfo: {
          description: data.companyInfo.description,
          address: data.companyInfo.address,
          phone: data.companyInfo.phone,
          email: data.companyInfo.email,
        },
      };

      storageService.updateFooterSettings(updatedSettings);
      
      toast({
        title: "Settings updated",
        description: "Footer general settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating footer settings:", error);
      toast({
        title: "Error",
        description: "There was an error updating the footer settings.",
        variant: "destructive",
      });
    }
  };

  const handleAddSocialLink = (data: z.infer<typeof socialLinkSchema>) => {
    try {
      const updatedSettings = { ...settings };
      const newSocialLink: SocialLink = {
        id: Date.now(),
        platform: data.platform,
        icon: data.icon,
        url: data.url,
        order: updatedSettings.socialLinks.length,
      };

      updatedSettings.socialLinks.push(newSocialLink);
      storageService.updateFooterSettings(updatedSettings);
      
      setShowAddSocialLinkDialog(false);
      socialLinkForm.reset();
      
      toast({
        title: "Social link added",
        description: `${data.platform} social link has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding social link:", error);
      toast({
        title: "Error",
        description: "There was an error adding the social link.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSocialLink = (data: z.infer<typeof socialLinkSchema>) => {
    if (!editingSocialLink) return;

    try {
      const updatedSettings = { ...settings };
      const index = updatedSettings.socialLinks.findIndex(link => link.id === editingSocialLink.id);
      
      if (index !== -1) {
        updatedSettings.socialLinks[index] = {
          ...updatedSettings.socialLinks[index],
          platform: data.platform,
          icon: data.icon,
          url: data.url,
        };
        
        storageService.updateFooterSettings(updatedSettings);
        
        setEditingSocialLink(null);
        socialLinkForm.reset();
        
        toast({
          title: "Social link updated",
          description: `${data.platform} social link has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error updating social link:", error);
      toast({
        title: "Error",
        description: "There was an error updating the social link.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSocialLink = (id: number) => {
    try {
      const updatedSettings = { ...settings };
      updatedSettings.socialLinks = updatedSettings.socialLinks.filter(link => link.id !== id);
      
      storageService.updateFooterSettings(updatedSettings);
      
      toast({
        title: "Social link deleted",
        description: "The social link has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the social link.",
        variant: "destructive",
      });
    }
  };

  const handleAddFooterSection = (data: z.infer<typeof footerSectionSchema>) => {
    try {
      const updatedSettings = { ...settings };
      const newSection: FooterSection = {
        id: Date.now(),
        title: data.title,
        links: [],
        order: updatedSettings.footerSections.length,
      };
      
      updatedSettings.footerSections.push(newSection);
      storageService.updateFooterSettings(updatedSettings);
      
      setShowAddSectionDialog(false);
      footerSectionForm.reset();
      
      toast({
        title: "Footer section added",
        description: `${data.title} section has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding footer section:", error);
      toast({
        title: "Error",
        description: "There was an error adding the footer section.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFooterSection = (data: z.infer<typeof footerSectionSchema>) => {
    if (!footerSectionToEdit) return;

    try {
      const updatedSettings = { ...settings };
      const index = updatedSettings.footerSections.findIndex(section => section.id === footerSectionToEdit.id);
      
      if (index !== -1) {
        updatedSettings.footerSections[index] = {
          ...updatedSettings.footerSections[index],
          title: data.title,
        };
        
        storageService.updateFooterSettings(updatedSettings);
        
        setFooterSectionToEdit(null);
        footerSectionForm.reset();
        
        toast({
          title: "Footer section updated",
          description: `${data.title} section has been updated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error updating footer section:", error);
      toast({
        title: "Error",
        description: "There was an error updating the footer section.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFooterSection = (id: number) => {
    try {
      const updatedSettings = { ...settings };
      updatedSettings.footerSections = updatedSettings.footerSections.filter(section => section.id !== id);
      
      storageService.updateFooterSettings(updatedSettings);
      
      toast({
        title: "Footer section deleted",
        description: "The footer section has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting footer section:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the footer section.",
        variant: "destructive",
      });
    }
  };

  const handleAddFooterLink = (data: z.infer<typeof footerLinkSchema>) => {
    if (!selectedSectionId) return;

    try {
      const updatedSettings = { ...settings };
      const sectionIndex = updatedSettings.footerSections.findIndex(section => section.id === selectedSectionId);
      
      if (sectionIndex !== -1) {
        const newLink: FooterLink = {
          id: Date.now(),
          label: data.label,
          path: data.path,
          isExternal: data.isExternal,
          order: updatedSettings.footerSections[sectionIndex].links.length,
        };
        
        updatedSettings.footerSections[sectionIndex].links.push(newLink);
        storageService.updateFooterSettings(updatedSettings);
        
        setShowAddLinkDialog(false);
        setSelectedSectionId(null);
        footerLinkForm.reset();
        
        toast({
          title: "Footer link added",
          description: `${data.label} link has been added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding footer link:", error);
      toast({
        title: "Error",
        description: "There was an error adding the footer link.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFooterLink = (data: z.infer<typeof footerLinkSchema>) => {
    if (!editingFooterLink) return;

    try {
      const updatedSettings = { ...settings };
      const sectionIndex = updatedSettings.footerSections.findIndex(
        section => section.id === editingFooterLink.sectionId
      );
      
      if (sectionIndex !== -1) {
        const linkIndex = updatedSettings.footerSections[sectionIndex].links.findIndex(
          link => link.id === editingFooterLink.link.id
        );
        
        if (linkIndex !== -1) {
          updatedSettings.footerSections[sectionIndex].links[linkIndex] = {
            ...updatedSettings.footerSections[sectionIndex].links[linkIndex],
            label: data.label,
            path: data.path,
            isExternal: data.isExternal,
          };
          
          storageService.updateFooterSettings(updatedSettings);
          
          setEditingFooterLink(null);
          footerLinkForm.reset();
          
          toast({
            title: "Footer link updated",
            description: `${data.label} link has been updated successfully.`,
          });
        }
      }
    } catch (error) {
      console.error("Error updating footer link:", error);
      toast({
        title: "Error",
        description: "There was an error updating the footer link.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFooterLink = (sectionId: number, linkId: number) => {
    try {
      const updatedSettings = { ...settings };
      const sectionIndex = updatedSettings.footerSections.findIndex(section => section.id === sectionId);
      
      if (sectionIndex !== -1) {
        updatedSettings.footerSections[sectionIndex].links = updatedSettings.footerSections[sectionIndex].links.filter(
          link => link.id !== linkId
        );
        
        storageService.updateFooterSettings(updatedSettings);
        
        toast({
          title: "Footer link deleted",
          description: "The footer link has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting footer link:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the footer link.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Footer Settings</h1>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="sections">Footer Sections</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Footer Settings</CardTitle>
                <CardDescription>
                  Configure the general settings for your website footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onUpdateGeneralSettings)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Company Information</h3>
                      <FormField
                        control={generalForm.control}
                        name="companyInfo.description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter company description"
                                {...field}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={generalForm.control}
                        name="companyInfo.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter company address"
                                {...field}
                                rows={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="companyInfo.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={generalForm.control}
                          name="companyInfo.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter email address"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Footer Text</h3>
                      <FormField
                        control={generalForm.control}
                        name="copyrightText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Copyright Text</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="© {year} Company Name. All rights reserved."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Use {"{year}"} to automatically insert the current year.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Legal Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="privacyPolicyLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Privacy Policy Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="/privacy-policy"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={generalForm.control}
                          name="termsOfServiceLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Terms of Service Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="/terms-of-service"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="mt-4">
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Social Media Links</CardTitle>
                    <CardDescription>
                      Configure the social media links for your website footer
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setShowAddSocialLinkDialog(true);
                    socialLinkForm.reset();
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Social Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Platform</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.socialLinks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No social links added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      settings.socialLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>{link.platform}</TableCell>
                          <TableCell>{link.icon}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {link.url}
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingSocialLink(link);
                                  socialLinkForm.reset({
                                    platform: link.platform,
                                    icon: link.icon,
                                    url: link.url,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteSocialLink(link.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Footer Sections</CardTitle>
                    <CardDescription>
                      Configure the sections and links in your website footer
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setShowAddSectionDialog(true);
                    footerSectionForm.reset();
                  }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {settings.footerSections.length === 0 ? (
                    <div className="text-center py-4">
                      No footer sections added yet.
                    </div>
                  ) : (
                    settings.footerSections.map((section) => (
                      <AccordionItem key={section.id} value={section.id.toString()}>
                        <div className="flex items-center">
                          <AccordionTrigger className="flex-1">
                            {section.title}
                          </AccordionTrigger>
                          <div className="flex gap-2 pr-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFooterSectionToEdit(section);
                                footerSectionForm.reset({
                                  title: section.title,
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFooterSection(section.id);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <AccordionContent>
                          <div className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-sm font-medium">Links</h4>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedSectionId(section.id);
                                  setShowAddLinkDialog(true);
                                  footerLinkForm.reset();
                                }}
                              >
                                <Plus className="mr-2 h-3 w-3" /> Add Link
                              </Button>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Label</TableHead>
                                  <TableHead>Path</TableHead>
                                  <TableHead>External</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {section.links.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                      No links added to this section yet.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  section.links.map((link) => (
                                    <TableRow key={link.id}>
                                      <TableCell>{link.label}</TableCell>
                                      <TableCell className="max-w-xs truncate">{link.path}</TableCell>
                                      <TableCell>{link.isExternal ? "Yes" : "No"}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              setEditingFooterLink({
                                                sectionId: section.id,
                                                link: link,
                                              });
                                              footerLinkForm.reset({
                                                label: link.label,
                                                path: link.path,
                                                isExternal: link.isExternal,
                                              });
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteFooterLink(section.id, link.id)}
                                          >
                                            <Trash className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Social Link Dialog */}
      <Dialog open={showAddSocialLinkDialog} onOpenChange={setShowAddSocialLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social Link</DialogTitle>
            <DialogDescription>
              Add a new social media link to your footer.
            </DialogDescription>
          </DialogHeader>
          <Form {...socialLinkForm}>
            <form onSubmit={socialLinkForm.handleSubmit(handleAddSocialLink)} className="space-y-4">
              <FormField
                control={socialLinkForm.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LinkedIn, Twitter, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={socialLinkForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. linkedin, twitter, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Icon name from Font Awesome (without the "fa-" prefix)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={socialLinkForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Social Link</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Social Link Dialog */}
      <Dialog open={!!editingSocialLink} onOpenChange={(open) => !open && setEditingSocialLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Link</DialogTitle>
            <DialogDescription>
              Update the social media link.
            </DialogDescription>
          </DialogHeader>
          <Form {...socialLinkForm}>
            <form onSubmit={socialLinkForm.handleSubmit(handleUpdateSocialLink)} className="space-y-4">
              <FormField
                control={socialLinkForm.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. LinkedIn, Twitter, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={socialLinkForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. linkedin, twitter, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Icon name from Font Awesome (without the "fa-" prefix)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={socialLinkForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Social Link</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Footer Section Dialog */}
      <Dialog open={showAddSectionDialog} onOpenChange={setShowAddSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Footer Section</DialogTitle>
            <DialogDescription>
              Add a new section to your footer.
            </DialogDescription>
          </DialogHeader>
          <Form {...footerSectionForm}>
            <form onSubmit={footerSectionForm.handleSubmit(handleAddFooterSection)} className="space-y-4">
              <FormField
                control={footerSectionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Company, Resources, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Section</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Footer Section Dialog */}
      <Dialog open={!!footerSectionToEdit} onOpenChange={(open) => !open && setFooterSectionToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Footer Section</DialogTitle>
            <DialogDescription>
              Update the footer section title.
            </DialogDescription>
          </DialogHeader>
          <Form {...footerSectionForm}>
            <form onSubmit={footerSectionForm.handleSubmit(handleUpdateFooterSection)} className="space-y-4">
              <FormField
                control={footerSectionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Company, Resources, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Section</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Footer Link Dialog */}
      <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Footer Link</DialogTitle>
            <DialogDescription>
              Add a new link to the footer section.
            </DialogDescription>
          </DialogHeader>
          <Form {...footerLinkForm}>
            <form onSubmit={footerLinkForm.handleSubmit(handleAddFooterLink)} className="space-y-4">
              <FormField
                control={footerLinkForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. About Us, Services, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={footerLinkForm.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Path</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. /about, /services, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={footerLinkForm.control}
                name="isExternal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>External Link</FormLabel>
                      <FormDescription>
                        Check if this link should open in a new tab
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Link</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Footer Link Dialog */}
      <Dialog open={!!editingFooterLink} onOpenChange={(open) => !open && setEditingFooterLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Footer Link</DialogTitle>
            <DialogDescription>
              Update the footer link.
            </DialogDescription>
          </DialogHeader>
          <Form {...footerLinkForm}>
            <form onSubmit={footerLinkForm.handleSubmit(handleUpdateFooterLink)} className="space-y-4">
              <FormField
                control={footerLinkForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. About Us, Services, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={footerLinkForm.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Path</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. /about, /services, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={footerLinkForm.control}
                name="isExternal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>External Link</FormLabel>
                      <FormDescription>
                        Check if this link should open in a new tab
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Link</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FooterSettingsPage;
