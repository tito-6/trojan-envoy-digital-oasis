
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FooterSettings, SocialLink, FooterSection, FooterLink } from "@/lib/types";
import { storageService } from "@/lib/storage";
import { ChevronDownIcon, PlusCircle, Trash2, ChevronUpIcon, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Initial default settings for a new footer
const defaultFooterSettings: FooterSettings = {
  id: 1,
  companyInfo: {
    description: "We are a leading digital transformation agency specializing in enterprise solutions. Trusted by global brands to deliver innovative technology solutions.",
    address: "123 Tech Boulevard, Innovation District\nSan Francisco, CA 94107",
    phone: "+1 (555) 123-4567",
    email: "contact@trojanenvoy.com"
  },
  socialLinks: [
    {
      id: 1,
      platform: "Facebook",
      icon: "facebook",
      url: "https://facebook.com",
      order: 1
    },
    {
      id: 2,
      platform: "Twitter",
      icon: "twitter",
      url: "https://twitter.com",
      order: 2
    },
    {
      id: 3,
      platform: "LinkedIn",
      icon: "linkedin",
      url: "https://linkedin.com",
      order: 3
    }
  ],
  footerSections: [
    {
      id: 1,
      title: "Company",
      links: [
        { id: 1, label: "About Us", path: "/about", order: 1, isExternal: false },
        { id: 2, label: "Careers", path: "/careers", order: 2, isExternal: false },
        { id: 3, label: "Contact", path: "/contact", order: 3, isExternal: false }
      ],
      order: 1
    },
    {
      id: 2,
      title: "Services",
      links: [
        { id: 4, label: "Development", path: "/services/development", order: 1, isExternal: false },
        { id: 5, label: "Design", path: "/services/design", order: 2, isExternal: false },
        { id: 6, label: "Consulting", path: "/services/consulting", order: 3, isExternal: false }
      ],
      order: 2
    },
    {
      id: 3,
      title: "Resources",
      links: [
        { id: 7, label: "Blog", path: "/blog", order: 1, isExternal: false },
        { id: 8, label: "Case Studies", path: "/case-studies", order: 2, isExternal: false },
        { id: 9, label: "Documentation", path: "https://docs.trojanenvoy.com", order: 3, isExternal: true }
      ],
      order: 3
    }
  ],
  copyrightText: "© {year} Trojan Envoy. All rights reserved.",
  privacyPolicyLink: "/privacy-policy",
  termsOfServiceLink: "/terms-of-service",
  lastUpdated: new Date().toISOString()
};

const FooterSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<FooterSettings>(defaultFooterSettings);
  const [activeTab, setActiveTab] = useState<string>("company-info");
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [showSocialLinkDialog, setShowSocialLinkDialog] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<{link: FooterLink, sectionId: number} | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load existing settings from storage
    const existingSettings = storageService.getFooterSettings();
    if (existingSettings) {
      setSettings(existingSettings);
    }
  }, []);
  
  // Function to update the settings in state and storage
  const updateSettings = (newSettings: FooterSettings) => {
    setSettings(newSettings);
    storageService.setFooterSettings(newSettings);
    storageService.dispatchEvent('footer-settings-updated');
  };
  
  // Handle changes in company info
  const handleCompanyInfoChange = (field: keyof typeof settings.companyInfo, value: string) => {
    updateSettings({
      ...settings,
      companyInfo: {
        ...settings.companyInfo,
        [field]: value
      },
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Handle changes in copyright text
  const handleCopyrightTextChange = (value: string) => {
    updateSettings({
      ...settings,
      copyrightText: value,
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Handle changes in policy links
  const handlePolicyLinkChange = (field: 'privacyPolicyLink' | 'termsOfServiceLink', value: string) => {
    updateSettings({
      ...settings,
      [field]: value,
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Add a new social link
  const addSocialLink = () => {
    setEditingSocialLink({
      id: Date.now(),
      platform: "",
      icon: "",
      url: "",
      order: settings.socialLinks.length + 1
    });
    setShowSocialLinkDialog(true);
  };
  
  // Edit an existing social link
  const editSocialLink = (link: SocialLink) => {
    setEditingSocialLink(link);
    setShowSocialLinkDialog(true);
  };
  
  // Save social link from dialog
  const saveSocialLink = () => {
    if (editingSocialLink) {
      let newLinks: SocialLink[];
      
      if (settings.socialLinks.some(link => link.id === editingSocialLink.id)) {
        // Update existing link
        newLinks = settings.socialLinks.map(link => 
          link.id === editingSocialLink.id ? editingSocialLink : link
        );
      } else {
        // Add new link
        newLinks = [...settings.socialLinks, editingSocialLink];
      }
      
      updateSettings({
        ...settings,
        socialLinks: newLinks,
        lastUpdated: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Social link has been saved.",
      });
      
      setShowSocialLinkDialog(false);
      setEditingSocialLink(null);
    }
  };
  
  // Delete a social link
  const deleteSocialLink = (id: number) => {
    const newLinks = settings.socialLinks.filter(link => link.id !== id);
    
    updateSettings({
      ...settings,
      socialLinks: newLinks,
      lastUpdated: new Date().toISOString()
    });
    
    toast({
      title: "Success",
      description: "Social link has been deleted.",
    });
  };
  
  // Reorder social links
  const moveSocialLink = (id: number, direction: 'up' | 'down') => {
    const linkIndex = settings.socialLinks.findIndex(link => link.id === id);
    if (linkIndex === -1) return;
    
    const newLinks = [...settings.socialLinks];
    
    // Swap with adjacent item
    if (direction === 'up' && linkIndex > 0) {
      [newLinks[linkIndex], newLinks[linkIndex - 1]] = [newLinks[linkIndex - 1], newLinks[linkIndex]];
    } else if (direction === 'down' && linkIndex < newLinks.length - 1) {
      [newLinks[linkIndex], newLinks[linkIndex + 1]] = [newLinks[linkIndex + 1], newLinks[linkIndex]];
    }
    
    // Update order values
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      order: index + 1
    }));
    
    updateSettings({
      ...settings,
      socialLinks: updatedLinks,
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Add a new section
  const addSection = () => {
    setEditingSection({
      id: Date.now(),
      title: "",
      links: [],
      order: settings.footerSections.length + 1
    });
    setShowSectionDialog(true);
  };
  
  // Edit an existing section
  const editSection = (section: FooterSection) => {
    setEditingSection(section);
    setShowSectionDialog(true);
  };
  
  // Save section from dialog
  const saveSection = () => {
    if (editingSection) {
      let newSections: FooterSection[];
      
      if (settings.footerSections.some(section => section.id === editingSection.id)) {
        // Update existing section
        newSections = settings.footerSections.map(section => 
          section.id === editingSection.id ? editingSection : section
        );
      } else {
        // Add new section
        newSections = [...settings.footerSections, editingSection];
      }
      
      updateSettings({
        ...settings,
        footerSections: newSections,
        lastUpdated: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Footer section has been saved.",
      });
      
      setShowSectionDialog(false);
      setEditingSection(null);
    }
  };
  
  // Delete a section
  const deleteSection = (id: number) => {
    const newSections = settings.footerSections.filter(section => section.id !== id);
    
    updateSettings({
      ...settings,
      footerSections: newSections,
      lastUpdated: new Date().toISOString()
    });
    
    toast({
      title: "Success",
      description: "Footer section has been deleted.",
    });
  };
  
  // Reorder sections
  const moveSection = (id: number, direction: 'up' | 'down') => {
    const sectionIndex = settings.footerSections.findIndex(section => section.id === id);
    if (sectionIndex === -1) return;
    
    const newSections = [...settings.footerSections];
    
    // Swap with adjacent item
    if (direction === 'up' && sectionIndex > 0) {
      [newSections[sectionIndex], newSections[sectionIndex - 1]] = [newSections[sectionIndex - 1], newSections[sectionIndex]];
    } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
      [newSections[sectionIndex], newSections[sectionIndex + 1]] = [newSections[sectionIndex + 1], newSections[sectionIndex]];
    }
    
    // Update order values
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    updateSettings({
      ...settings,
      footerSections: updatedSections,
      lastUpdated: new Date().toISOString()
    });
  };
  
  // Add a new link to a section
  const addLink = (sectionId: number) => {
    setEditingLink({
      link: {
        id: Date.now(),
        label: "",
        path: "",
        order: settings.footerSections.find(s => s.id === sectionId)?.links.length || 0 + 1,
        isExternal: false
      },
      sectionId
    });
    setShowLinkDialog(true);
  };
  
  // Edit an existing link
  const editLink = (link: FooterLink, sectionId: number) => {
    setEditingLink({ link, sectionId });
    setShowLinkDialog(true);
  };
  
  // Save link from dialog
  const saveLink = () => {
    if (editingLink) {
      const { link, sectionId } = editingLink;
      const sectionIndex = settings.footerSections.findIndex(s => s.id === sectionId);
      
      if (sectionIndex === -1) return;
      
      const section = settings.footerSections[sectionIndex];
      let newLinks: FooterLink[];
      
      if (section.links.some(l => l.id === link.id)) {
        // Update existing link
        newLinks = section.links.map(l => l.id === link.id ? link : l);
      } else {
        // Add new link
        newLinks = [...section.links, link];
      }
      
      const updatedSection = {
        ...section,
        links: newLinks
      };
      
      const updatedSections = settings.footerSections.map((s, idx) => 
        idx === sectionIndex ? updatedSection : s
      );
      
      updateSettings({
        ...settings,
        footerSections: updatedSections,
        lastUpdated: new Date().toISOString()
      });
      
      toast({
        title: "Success",
        description: "Link has been saved.",
      });
      
      setShowLinkDialog(false);
      setEditingLink(null);
    }
  };
  
  // Delete a link
  const deleteLink = (linkId: number, sectionId: number) => {
    const sectionIndex = settings.footerSections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const section = settings.footerSections[sectionIndex];
    const newLinks = section.links.filter(link => link.id !== linkId);
    
    const updatedSection = {
      ...section,
      links: newLinks
    };
    
    const updatedSections = settings.footerSections.map((s, idx) => 
      idx === sectionIndex ? updatedSection : s
    );
    
    updateSettings({
      ...settings,
      footerSections: updatedSections,
      lastUpdated: new Date().toISOString()
    });
    
    toast({
      title: "Success",
      description: "Link has been deleted.",
    });
  };
  
  // Reorder links in a section
  const moveLink = (linkId: number, sectionId: number, direction: 'up' | 'down') => {
    const sectionIndex = settings.footerSections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const section = settings.footerSections[sectionIndex];
    const linkIndex = section.links.findIndex(link => link.id === linkId);
    if (linkIndex === -1) return;
    
    const newLinks = [...section.links];
    
    // Swap with adjacent item
    if (direction === 'up' && linkIndex > 0) {
      [newLinks[linkIndex], newLinks[linkIndex - 1]] = [newLinks[linkIndex - 1], newLinks[linkIndex]];
    } else if (direction === 'down' && linkIndex < newLinks.length - 1) {
      [newLinks[linkIndex], newLinks[linkIndex + 1]] = [newLinks[linkIndex + 1], newLinks[linkIndex]];
    }
    
    // Update order values
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      order: index + 1
    }));
    
    const updatedSection = {
      ...section,
      links: updatedLinks
    };
    
    const updatedSections = settings.footerSections.map((s, idx) => 
      idx === sectionIndex ? updatedSection : s
    );
    
    updateSettings({
      ...settings,
      footerSections: updatedSections,
      lastUpdated: new Date().toISOString()
    });
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Footer Settings</h1>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(settings.lastUpdated).toLocaleString()}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="company-info">Company Info</TabsTrigger>
            <TabsTrigger value="social-links">Social Links</TabsTrigger>
            <TabsTrigger value="footer-sections">Footer Sections</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>
          
          {/* Company Info Tab */}
          <TabsContent value="company-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company information that appears in the footer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Enter company description"
                    value={settings.companyInfo.description}
                    onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address"
                    placeholder="Enter company address"
                    value={settings.companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    placeholder="Enter phone number"
                    value={settings.companyInfo.phone}
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    placeholder="Enter email address"
                    value={settings.companyInfo.email}
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Links Tab */}
          <TabsContent value="social-links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Manage your social media links that appear in the footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.socialLinks.map((link, index) => (
                    <div key={link.id} className="flex items-center justify-between border p-3 rounded">
                      <div>
                        <p className="font-medium">{link.platform}</p>
                        <p className="text-sm text-muted-foreground">{link.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSocialLink(link.id, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUpIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSocialLink(link.id, 'down')}
                          disabled={index === settings.socialLinks.length - 1}
                        >
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editSocialLink(link)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSocialLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                
                  <Button onClick={addSocialLink} className="w-full mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Social Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Footer Sections Tab */}
          <TabsContent value="footer-sections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Footer Sections</CardTitle>
                <CardDescription>
                  Manage the navigation sections that appear in the footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-4">
                  {settings.footerSections.map((section, sectionIndex) => (
                    <AccordionItem key={section.id} value={section.id.toString()} className="border p-3 rounded">
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="flex-1 py-0">
                          <h3 className="font-medium">{section.title}</h3>
                        </AccordionTrigger>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(section.id, 'up');
                            }}
                            disabled={sectionIndex === 0}
                          >
                            <ChevronUpIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(section.id, 'down');
                            }}
                            disabled={sectionIndex === settings.footerSections.length - 1}
                          >
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              editSection(section);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent>
                        <div className="space-y-3 mt-3">
                          {section.links.map((link, linkIndex) => (
                            <div key={link.id} className="flex items-center justify-between border p-2 rounded">
                              <div>
                                <p className="text-sm font-medium">{link.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {link.path} {link.isExternal && "(External)"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moveLink(link.id, section.id, 'up')}
                                  disabled={linkIndex === 0}
                                >
                                  <ChevronUpIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moveLink(link.id, section.id, 'down')}
                                  disabled={linkIndex === section.links.length - 1}
                                >
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editLink(link, section.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteLink(link.id, section.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          <Button 
                            onClick={() => addLink(section.id)} 
                            className="w-full mt-3"
                            size="sm"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Link
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <Button onClick={addSection} className="w-full mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Legal Tab */}
          <TabsContent value="legal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Legal Information</CardTitle>
                <CardDescription>
                  Manage copyright text and legal links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="copyright">Copyright Text</Label>
                  <Input 
                    id="copyright"
                    placeholder="Enter copyright text"
                    value={settings.copyrightText}
                    onChange={(e) => handleCopyrightTextChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{year}'} placeholder to include current year automatically.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">Privacy Policy Link</Label>
                  <Input 
                    id="privacyPolicy"
                    placeholder="Enter privacy policy link"
                    value={settings.privacyPolicyLink}
                    onChange={(e) => handlePolicyLinkChange('privacyPolicyLink', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="termsOfService">Terms of Service Link</Label>
                  <Input 
                    id="termsOfService"
                    placeholder="Enter terms of service link"
                    value={settings.termsOfServiceLink}
                    onChange={(e) => handlePolicyLinkChange('termsOfServiceLink', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Social Link Dialog */}
      <Dialog open={showSocialLinkDialog} onOpenChange={setShowSocialLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSocialLink && settings.socialLinks.some(link => link.id === editingSocialLink.id)
                ? "Edit Social Link"
                : "Add Social Link"
              }
            </DialogTitle>
            <DialogDescription>
              {editingSocialLink && settings.socialLinks.some(link => link.id === editingSocialLink.id)
                ? "Update the details of this social media link."
                : "Add a new social media link to your footer."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform Name</Label>
              <Input 
                id="platform"
                placeholder="e.g. Facebook, Twitter, LinkedIn"
                value={editingSocialLink?.platform || ""}
                onChange={(e) => setEditingSocialLink(prev => 
                  prev ? {...prev, platform: e.target.value} : null
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input 
                id="icon"
                placeholder="e.g. facebook, twitter, linkedin"
                value={editingSocialLink?.icon || ""}
                onChange={(e) => setEditingSocialLink(prev => 
                  prev ? {...prev, icon: e.target.value} : null
                )}
              />
              <p className="text-xs text-muted-foreground">
                Enter the Font Awesome icon name (without fa- prefix)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url"
                placeholder="https://example.com"
                value={editingSocialLink?.url || ""}
                onChange={(e) => setEditingSocialLink(prev => 
                  prev ? {...prev, url: e.target.value} : null
                )}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSocialLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveSocialLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Section Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSection && settings.footerSections.some(section => section.id === editingSection.id)
                ? "Edit Section"
                : "Add Section"
              }
            </DialogTitle>
            <DialogDescription>
              {editingSection && settings.footerSections.some(section => section.id === editingSection.id)
                ? "Update the details of this footer section."
                : "Add a new navigation section to your footer."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input 
                id="sectionTitle"
                placeholder="e.g. Company, Services, Resources"
                value={editingSection?.title || ""}
                onChange={(e) => setEditingSection(prev => 
                  prev ? {...prev, title: e.target.value} : null
                )}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSectionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveSection}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink && settings.footerSections
                .find(s => s.id === editingLink.sectionId)?.links
                .some(l => l.id === editingLink.link.id)
                ? "Edit Link"
                : "Add Link"
              }
            </DialogTitle>
            <DialogDescription>
              {editingLink && settings.footerSections
                .find(s => s.id === editingLink.sectionId)?.links
                .some(l => l.id === editingLink.link.id)
                ? "Update the details of this link."
                : "Add a new link to this section."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="linkLabel">Label</Label>
              <Input 
                id="linkLabel"
                placeholder="e.g. About Us, Services, Contact"
                value={editingLink?.link.label || ""}
                onChange={(e) => setEditingLink(prev => 
                  prev ? {...prev, link: {...prev.link, label: e.target.value}} : null
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkPath">Path</Label>
              <Input 
                id="linkPath"
                placeholder="e.g. /about, /services, https://example.com"
                value={editingLink?.link.path || ""}
                onChange={(e) => setEditingLink(prev => 
                  prev ? {...prev, link: {...prev.link, path: e.target.value}} : null
                )}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isExternal" 
                checked={editingLink?.link.isExternal || false}
                onCheckedChange={(checked) => setEditingLink(prev => 
                  prev ? {...prev, link: {...prev.link, isExternal: checked as boolean}} : null
                )}
              />
              <Label htmlFor="isExternal">Is External Link</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FooterSettingsPage;
