
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, X } from "lucide-react";
import { storageService } from "@/lib/storage";
import { FooterSettings, FooterSection, FooterLink, SocialLink } from "@/lib/types";

// Define the schema for footer settings form
const footerSettingsSchema = z.object({
  companyInfo: z.object({
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
  }),
  copyrightText: z.string().min(1, "Copyright text is required"),
  privacyPolicyLink: z.string().min(1, "Privacy policy link is required"),
  termsOfServiceLink: z.string().min(1, "Terms of service link is required"),
});

type FooterSettingsFormValues = z.infer<typeof footerSettingsSchema>;

// Schema for social link form
const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name is required"),
  icon: z.string().min(1, "Icon name is required"),
  url: z.string().url("Must be a valid URL"),
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

// Schema for footer section form
const footerSectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
});

type FooterSectionFormValues = z.infer<typeof footerSectionSchema>;

// Schema for footer link form
const footerLinkSchema = z.object({
  label: z.string().min(1, "Link label is required"),
  path: z.string().min(1, "Link path is required"),
  isExternal: z.boolean().default(false),
});

type FooterLinkFormValues = z.infer<typeof footerLinkSchema>;

const FooterSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<FooterSettings>(storageService.getFooterSettings());
  const [activeTab, setActiveTab] = useState("general");
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);

  // Form for general footer settings
  const form = useForm<FooterSettingsFormValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: {
      companyInfo: {
        description: settings.companyInfo.description as string,
        address: settings.companyInfo.address,
        phone: settings.companyInfo.phone,
        email: settings.companyInfo.email,
      },
      copyrightText: settings.copyrightText,
      privacyPolicyLink: settings.privacyPolicyLink,
      termsOfServiceLink: settings.termsOfServiceLink,
    },
  });

  // Form for social links
  const socialForm = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      icon: "",
      url: "",
    },
  });

  // Form for footer sections
  const sectionForm = useForm<FooterSectionFormValues>({
    resolver: zodResolver(footerSectionSchema),
    defaultValues: {
      title: "",
    },
  });

  // Form for footer links
  const linkForm = useForm<FooterLinkFormValues>({
    resolver: zodResolver(footerLinkSchema),
    defaultValues: {
      label: "",
      path: "",
      isExternal: false,
    },
  });

  useEffect(() => {
    // Update the form values when settings change
    form.reset({
      companyInfo: {
        description: settings.companyInfo.description as string,
        address: settings.companyInfo.address,
        phone: settings.companyInfo.phone,
        email: settings.companyInfo.email,
      },
      copyrightText: settings.copyrightText,
      privacyPolicyLink: settings.privacyPolicyLink,
      termsOfServiceLink: settings.termsOfServiceLink,
    });
  }, [settings, form]);

  // Save general footer settings
  const onSubmit = (data: FooterSettingsFormValues) => {
    try {
      // Use updateFooterSettings instead of setFooterSettings
      storageService.updateFooterSettings({
        ...settings,
        companyInfo: data.companyInfo,
        copyrightText: data.copyrightText,
        privacyPolicyLink: data.privacyPolicyLink,
        termsOfServiceLink: data.termsOfServiceLink,
      });

      setSettings(storageService.getFooterSettings());

      toast({
        title: "Footer settings updated",
        description: "The footer settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating footer settings:", error);
      toast({
        title: "Error updating footer settings",
        description: "There was an error updating the footer settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add or update social link
  const handleSocialSubmit = (data: SocialLinkFormValues) => {
    try {
      if (editingSocialId) {
        // Update existing social link
        storageService.updateFooterSettings({
          ...settings,
          socialLinks: settings.socialLinks.map(link => 
            link.id === editingSocialId 
              ? { ...link, ...data, order: link.order } 
              : link
          ),
        });
      } else {
        // Add new social link
        const newId = settings.socialLinks.length > 0 
          ? Math.max(...settings.socialLinks.map(link => link.id)) + 1 
          : 1;
        
        storageService.updateFooterSettings({
          ...settings,
          socialLinks: [
            ...settings.socialLinks,
            { 
              id: newId, 
              ...data, 
              order: settings.socialLinks.length 
            }
          ],
        });
      }

      setSettings(storageService.getFooterSettings());
      setSocialDialogOpen(false);
      setEditingSocialId(null);
      socialForm.reset();

      toast({
        title: editingSocialId ? "Social link updated" : "Social link added",
        description: `The social link has been successfully ${editingSocialId ? "updated" : "added"}.`,
      });
    } catch (error) {
      console.error("Error managing social link:", error);
      toast({
        title: "Error managing social link",
        description: "There was an error managing the social link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete social link
  const handleDeleteSocial = (id: number) => {
    try {
      storageService.updateFooterSettings({
        ...settings,
        socialLinks: settings.socialLinks.filter(link => link.id !== id),
      });

      setSettings(storageService.getFooterSettings());

      toast({
        title: "Social link deleted",
        description: "The social link has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast({
        title: "Error deleting social link",
        description: "There was an error deleting the social link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Edit social link - open dialog with current values
  const handleEditSocial = (link: SocialLink) => {
    setEditingSocialId(link.id);
    socialForm.reset({
      platform: link.platform,
      icon: link.icon,
      url: link.url,
    });
    setSocialDialogOpen(true);
  };

  // Add or update footer section
  const handleSectionSubmit = (data: FooterSectionFormValues) => {
    try {
      if (editingSectionId) {
        // Update existing section
        storageService.updateFooterSettings({
          ...settings,
          footerSections: settings.footerSections.map(section => 
            section.id === editingSectionId 
              ? { ...section, title: data.title } 
              : section
          ),
        });
      } else {
        // Add new section
        const newId = settings.footerSections.length > 0 
          ? Math.max(...settings.footerSections.map(section => section.id)) + 1 
          : 1;
        
        storageService.updateFooterSettings({
          ...settings,
          footerSections: [
            ...settings.footerSections,
            { 
              id: newId, 
              title: data.title, 
              links: [],
              order: settings.footerSections.length 
            }
          ],
        });
      }

      setSettings(storageService.getFooterSettings());
      setSectionDialogOpen(false);
      setEditingSectionId(null);
      sectionForm.reset();

      toast({
        title: editingSectionId ? "Footer section updated" : "Footer section added",
        description: `The footer section has been successfully ${editingSectionId ? "updated" : "added"}.`,
      });
    } catch (error) {
      console.error("Error managing footer section:", error);
      toast({
        title: "Error managing footer section",
        description: "There was an error managing the footer section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete footer section
  const handleDeleteSection = (id: number) => {
    try {
      storageService.updateFooterSettings({
        ...settings,
        footerSections: settings.footerSections.filter(section => section.id !== id),
      });

      setSettings(storageService.getFooterSettings());

      toast({
        title: "Footer section deleted",
        description: "The footer section has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting footer section:", error);
      toast({
        title: "Error deleting footer section",
        description: "There was an error deleting the footer section. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Edit footer section - open dialog with current values
  const handleEditSection = (section: FooterSection) => {
    setEditingSectionId(section.id);
    sectionForm.reset({
      title: section.title,
    });
    setSectionDialogOpen(true);
  };

  // Add or update footer link
  const handleLinkSubmit = (data: FooterLinkFormValues) => {
    if (!currentSectionId) return;

    try {
      const section = settings.footerSections.find(s => s.id === currentSectionId);
      if (!section) return;

      if (editingLinkId) {
        // Update existing link
        const updatedSections = settings.footerSections.map(section => {
          if (section.id === currentSectionId) {
            return {
              ...section,
              links: section.links.map(link => 
                link.id === editingLinkId 
                  ? { ...link, ...data } 
                  : link
              )
            };
          }
          return section;
        });

        storageService.updateFooterSettings({
          ...settings,
          footerSections: updatedSections,
        });
      } else {
        // Add new link
        const newId = section.links.length > 0 
          ? Math.max(...section.links.map(link => link.id)) + 1 
          : 1;
        
        const updatedSections = settings.footerSections.map(section => {
          if (section.id === currentSectionId) {
            return {
              ...section,
              links: [
                ...section.links,
                { 
                  id: newId, 
                  ...data, 
                  order: section.links.length 
                }
              ]
            };
          }
          return section;
        });

        storageService.updateFooterSettings({
          ...settings,
          footerSections: updatedSections,
        });
      }

      setSettings(storageService.getFooterSettings());
      setLinkDialogOpen(false);
      setEditingLinkId(null);
      setCurrentSectionId(null);
      linkForm.reset();

      toast({
        title: editingLinkId ? "Footer link updated" : "Footer link added",
        description: `The footer link has been successfully ${editingLinkId ? "updated" : "added"}.`,
      });
    } catch (error) {
      console.error("Error managing footer link:", error);
      toast({
        title: "Error managing footer link",
        description: "There was an error managing the footer link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete footer link
  const handleDeleteLink = (sectionId: number, linkId: number) => {
    try {
      const updatedSections = settings.footerSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            links: section.links.filter(link => link.id !== linkId)
          };
        }
        return section;
      });

      storageService.updateFooterSettings({
        ...settings,
        footerSections: updatedSections,
      });

      setSettings(storageService.getFooterSettings());

      toast({
        title: "Footer link deleted",
        description: "The footer link has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting footer link:", error);
      toast({
        title: "Error deleting footer link",
        description: "There was an error deleting the footer link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Edit footer link - open dialog with current values
  const handleEditLink = (sectionId: number, link: FooterLink) => {
    setCurrentSectionId(sectionId);
    setEditingLinkId(link.id);
    linkForm.reset({
      label: link.label,
      path: link.path,
      isExternal: link.isExternal,
    });
    setLinkDialogOpen(true);
  };

  // Add new link to section
  const handleAddLink = (sectionId: number) => {
    setCurrentSectionId(sectionId);
    setEditingLinkId(null);
    linkForm.reset({
      label: "",
      path: "",
      isExternal: false,
    });
    setLinkDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Footer Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="sections">Footer Sections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Footer Settings</CardTitle>
              <CardDescription>
                Manage general footer information, including company details and copyright information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyInfo.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter company description..." 
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of your company that will appear in the footer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyInfo.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter company address..." 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            The physical address of your company.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter phone number..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Contact phone number for your company.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter email address..." 
                              {...field} 
                              type="email"
                            />
                          </FormControl>
                          <FormDescription>
                            Contact email for your company.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="copyrightText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Copyright Text</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter copyright text..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Copyright information. Use {'{year}'} to insert the current year automatically.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="privacyPolicyLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy Policy Link</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter privacy policy link..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Link to your privacy policy page (e.g., /privacy-policy).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="termsOfServiceLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms of Service Link</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter terms of service link..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Link to your terms of service page (e.g., /terms-of-service).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage social media links that appear in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={() => {
                  setEditingSocialId(null);
                  socialForm.reset({
                    platform: "",
                    icon: "",
                    url: "",
                  });
                  setSocialDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
              
              <div className="space-y-4">
                {settings.socialLinks.length === 0 ? (
                  <p className="text-muted-foreground">No social links added yet.</p>
                ) : (
                  settings.socialLinks.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h3 className="font-medium">{link.platform}</h3>
                        <p className="text-sm text-muted-foreground">Icon: {link.icon}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">URL: {link.url}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditSocial(link)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSocial(link.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSocialId ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
                    <DialogDescription>
                      {editingSocialId 
                        ? "Update the details of this social media link." 
                        : "Add a new social media link to your footer."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...socialForm}>
                    <form onSubmit={socialForm.handleSubmit(handleSocialSubmit)} className="space-y-4">
                      <FormField
                        control={socialForm.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Facebook, Twitter, LinkedIn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialForm.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., facebook, twitter, linkedin" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the Font Awesome icon name without "fa-" prefix.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={socialForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>
                              Full URL to your social media profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">
                          {editingSocialId ? "Update" : "Add"} Social Link
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Footer Sections and Links</CardTitle>
              <CardDescription>
                Manage footer navigation sections and links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={() => {
                  setEditingSectionId(null);
                  sectionForm.reset({
                    title: "",
                  });
                  setSectionDialogOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Footer Section
                </Button>
              </div>
              
              {settings.footerSections.length === 0 ? (
                <p className="text-muted-foreground">No footer sections added yet.</p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {settings.footerSections.map((section) => (
                    <AccordionItem key={section.id} value={section.id.toString()}>
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="flex-1">
                          {section.title}
                        </AccordionTrigger>
                        <div className="flex space-x-2 px-4">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection(section);
                          }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent>
                        <div className="pl-4 pt-2 pb-1">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">Links</h4>
                            <Button variant="outline" size="sm" onClick={() => handleAddLink(section.id)}>
                              <Plus className="w-3 h-3 mr-1" />
                              Add Link
                            </Button>
                          </div>
                          
                          {section.links.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No links added to this section yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {section.links.map((link) => (
                                <div key={link.id} className="flex items-center justify-between p-2 border rounded-md">
                                  <div>
                                    <p className="font-medium">{link.label}</p>
                                    <p className="text-xs text-muted-foreground">Path: {link.path}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {link.isExternal ? "External link" : "Internal link"}
                                    </p>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditLink(section.id, link)}>
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLink(section.id, link.id)}>
                                      <Trash className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              
              <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSectionId ? "Edit Footer Section" : "Add Footer Section"}</DialogTitle>
                    <DialogDescription>
                      {editingSectionId 
                        ? "Update the title of this footer section." 
                        : "Add a new section to your footer navigation."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...sectionForm}>
                    <form onSubmit={sectionForm.handleSubmit(handleSectionSubmit)} className="space-y-4">
                      <FormField
                        control={sectionForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Company, Services, Resources" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">
                          {editingSectionId ? "Update" : "Add"} Section
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingLinkId ? "Edit Footer Link" : "Add Footer Link"}</DialogTitle>
                    <DialogDescription>
                      {editingLinkId 
                        ? "Update the details of this footer link." 
                        : "Add a new link to this footer section."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...linkForm}>
                    <form onSubmit={linkForm.handleSubmit(handleLinkSubmit)} className="space-y-4">
                      <FormField
                        control={linkForm.control}
                        name="label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link Label</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., About Us, Services, Contact" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={linkForm.control}
                        name="path"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link Path</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., /about, /services, https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Use relative paths for internal links (e.g., /about) or full URLs for external links.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={linkForm.control}
                        name="isExternal"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>External Link</FormLabel>
                              <FormDescription>
                                Check this box if this link should open in a new tab.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">
                          {editingLinkId ? "Update" : "Add"} Link
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterSettingsPage;
