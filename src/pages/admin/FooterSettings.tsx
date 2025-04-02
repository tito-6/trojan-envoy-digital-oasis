
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { Plus, X, Move, ArrowUp, ArrowDown } from "lucide-react";
import { FooterSettings, FooterSection, FooterLink, SocialLink } from "@/lib/types";
import RichTextEditor from "@/components/admin/richtext/RichTextEditor";

const AdminFooterSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FooterSettings>(() => storageService.getFooterSettings());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyInfoChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  // Social Links Management
  const addSocialLink = () => {
    setSettings(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          id: Date.now(),
          platform: "New Platform",
          icon: "twitter",
          url: "#",
          order: prev.socialLinks.length
        }
      ]
    }));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    setSettings(prev => {
      const updatedLinks = [...prev.socialLinks];
      updatedLinks[index] = {
        ...updatedLinks[index],
        [field]: value
      };
      return {
        ...prev,
        socialLinks: updatedLinks
      };
    });
  };

  const removeSocialLink = (id: number) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const moveSocialLink = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === settings.socialLinks.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedLinks = [...settings.socialLinks];
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[newIndex];
    updatedLinks[newIndex] = temp;

    // Update orders
    updatedLinks.forEach((link, i) => {
      link.order = i;
    });

    setSettings(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };

  // Footer Sections Management
  const addFooterSection = () => {
    setSettings(prev => ({
      ...prev,
      footerSections: [
        ...prev.footerSections,
        {
          id: Date.now(),
          title: "New Section",
          links: [],
          order: prev.footerSections.length
        }
      ]
    }));
  };

  const updateFooterSection = (index: number, field: string, value: string) => {
    setSettings(prev => {
      const updatedSections = [...prev.footerSections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...prev,
        footerSections: updatedSections
      };
    });
  };

  const removeFooterSection = (id: number) => {
    setSettings(prev => ({
      ...prev,
      footerSections: prev.footerSections.filter(section => section.id !== id)
    }));
  };

  const moveFooterSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === settings.footerSections.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...settings.footerSections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[newIndex];
    updatedSections[newIndex] = temp;

    // Update orders
    updatedSections.forEach((section, i) => {
      section.order = i;
    });

    setSettings(prev => ({
      ...prev,
      footerSections: updatedSections
    }));
  };

  // Footer Links Management
  const addFooterLink = (sectionIndex: number) => {
    setSettings(prev => {
      const updatedSections = [...prev.footerSections];
      const section = updatedSections[sectionIndex];
      section.links = [
        ...section.links,
        {
          id: Date.now(),
          label: "New Link",
          path: "#",
          order: section.links.length,
          isExternal: false
        }
      ];
      return {
        ...prev,
        footerSections: updatedSections
      };
    });
  };

  const updateFooterLink = (sectionIndex: number, linkIndex: number, field: string, value: any) => {
    setSettings(prev => {
      const updatedSections = [...prev.footerSections];
      const section = updatedSections[sectionIndex];
      const updatedLinks = [...section.links];
      updatedLinks[linkIndex] = {
        ...updatedLinks[linkIndex],
        [field]: value
      };
      section.links = updatedLinks;
      return {
        ...prev,
        footerSections: updatedSections
      };
    });
  };

  const removeFooterLink = (sectionIndex: number, linkId: number) => {
    setSettings(prev => {
      const updatedSections = [...prev.footerSections];
      const section = updatedSections[sectionIndex];
      section.links = section.links.filter(link => link.id !== linkId);
      return {
        ...prev,
        footerSections: updatedSections
      };
    });
  };

  const moveFooterLink = (sectionIndex: number, linkIndex: number, direction: 'up' | 'down') => {
    const section = settings.footerSections[sectionIndex];
    if ((direction === 'up' && linkIndex === 0) || 
        (direction === 'down' && linkIndex === section.links.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? linkIndex - 1 : linkIndex + 1;
    
    setSettings(prev => {
      const updatedSections = [...prev.footerSections];
      const section = updatedSections[sectionIndex];
      const updatedLinks = [...section.links];
      
      const temp = updatedLinks[linkIndex];
      updatedLinks[linkIndex] = updatedLinks[newIndex];
      updatedLinks[newIndex] = temp;
      
      // Update orders
      updatedLinks.forEach((link, i) => {
        link.order = i;
      });
      
      section.links = updatedLinks;
      return {
        ...prev,
        footerSections: updatedSections
      };
    });
  };

  const saveSettings = async () => {
    setIsUpdating(true);
    try {
      storageService.updateFooterSettings(settings);
      toast({
        title: "Settings saved",
        description: "Footer settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "An error occurred while saving the settings.",
        variant: "destructive"
      });
      console.error("Error saving footer settings:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Footer Settings</h1>
          <Button onClick={saveSettings} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Configure the company information displayed in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company Description</Label>
                <RichTextEditor
                  value={settings.companyInfo.description}
                  onChange={(value) => handleCompanyInfoChange('description', value)}
                  height="150px"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    value={settings.companyInfo.address} 
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)} 
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={settings.companyInfo.phone} 
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={settings.companyInfo.email} 
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage social media links displayed in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addSocialLink}
                className="mb-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Social Link
              </Button>
              
              {settings.socialLinks.map((link, index) => (
                <div key={link.id} className="p-4 border rounded-md space-y-3 relative">
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSocialLink(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSocialLink(index, 'down')}
                      disabled={index === settings.socialLinks.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSocialLink(link.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Input 
                        value={link.platform} 
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input 
                        value={link.icon} 
                        onChange={(e) => updateSocialLink(index, 'icon', e.target.value)} 
                        placeholder="fontawesome icon name (e.g. facebook, twitter)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input 
                        value={link.url} 
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Footer Navigation Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Navigation Sections</CardTitle>
              <CardDescription>
                Manage navigation sections in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addFooterSection}
                className="mb-4"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Footer Section
              </Button>
              
              {settings.footerSections.map((section, sectionIndex) => (
                <div key={section.id} className="p-4 border rounded-md space-y-3 relative">
                  <div className="absolute right-2 top-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFooterSection(sectionIndex, 'up')}
                      disabled={sectionIndex === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFooterSection(sectionIndex, 'down')}
                      disabled={sectionIndex === settings.footerSections.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFooterSection(section.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="pt-6">
                    <div className="space-y-2 mb-4">
                      <Label>Section Title</Label>
                      <Input 
                        value={section.title} 
                        onChange={(e) => updateFooterSection(sectionIndex, 'title', e.target.value)} 
                      />
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <Label>Links</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addFooterLink(sectionIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Link
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {section.links.map((link, linkIndex) => (
                          <div key={link.id} className="p-3 border rounded-md relative">
                            <div className="absolute right-2 top-2 flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveFooterLink(sectionIndex, linkIndex, 'up')}
                                disabled={linkIndex === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveFooterLink(sectionIndex, linkIndex, 'down')}
                                disabled={linkIndex === section.links.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeFooterLink(sectionIndex, link.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6">
                              <div className="space-y-2">
                                <Label>Label</Label>
                                <Input 
                                  value={link.label} 
                                  onChange={(e) => updateFooterLink(sectionIndex, linkIndex, 'label', e.target.value)} 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Path</Label>
                                <Input 
                                  value={link.path} 
                                  onChange={(e) => updateFooterLink(sectionIndex, linkIndex, 'path', e.target.value)} 
                                />
                              </div>
                              <div className="flex items-center space-x-2 h-full pt-8">
                                <input 
                                  type="checkbox" 
                                  id={`external-${section.id}-${link.id}`} 
                                  checked={link.isExternal} 
                                  onChange={(e) => updateFooterLink(sectionIndex, linkIndex, 'isExternal', e.target.checked)} 
                                  className="h-4 w-4"
                                />
                                <Label htmlFor={`external-${section.id}-${link.id}`}>External link</Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>
                Configure copyright and legal information in the footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copyrightText">Copyright Text</Label>
                <Input 
                  id="copyrightText" 
                  name="copyrightText" 
                  value={settings.copyrightText} 
                  onChange={handleBasicInfoChange} 
                  placeholder="© {year} Company Name. All rights reserved."
                />
                <p className="text-sm text-muted-foreground">Use {year} as a placeholder for the current year.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacyPolicyLink">Privacy Policy Link</Label>
                <Input 
                  id="privacyPolicyLink" 
                  name="privacyPolicyLink" 
                  value={settings.privacyPolicyLink} 
                  onChange={handleBasicInfoChange} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsOfServiceLink">Terms of Service Link</Label>
                <Input 
                  id="termsOfServiceLink" 
                  name="termsOfServiceLink" 
                  value={settings.termsOfServiceLink} 
                  onChange={handleBasicInfoChange} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFooterSettings;
