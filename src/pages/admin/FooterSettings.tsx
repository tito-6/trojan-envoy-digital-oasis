import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/lib/storage';
import { FooterSettings as FooterSettingsType, SocialLink, FooterSection, FooterLink } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, Check, Edit, Trash2, Plus, Info, MoveUp, MoveDown, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import IconSelector from '@/components/admin/icon-management/IconSelector';
import RichTextEditor from '@/components/admin/richtext/RichTextEditor';

const socialLinkSchema = z.object({
  platform: z.string().min(2, {
    message: 'Platform must be at least 2 characters.',
  }),
  icon: z.string().min(2, {
    message: 'Icon must be at least 2 characters.',
  }),
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
});

const footerSectionSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
});

const footerLinkSchema = z.object({
  label: z.string().min(2, {
    message: 'Label must be at least 2 characters.',
  }),
  path: z.string().min(1, {
    message: 'Path must be at least 1 character.',
  }),
});

const FooterSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<FooterSettingsType>(storageService.getFooterSettings());
  const [updating, setUpdating] = useState(false);
  const [companyDescription, setCompanyDescription] = useState(settings.companyInfo.description);
  const [address, setAddress] = useState(settings.companyInfo.address);
  const [phone, setPhone] = useState(settings.companyInfo.phone);
  const [email, setEmail] = useState(settings.companyInfo.email);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(settings.socialLinks);
  const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id' | 'order'>>({
    platform: '',
    icon: '',
    url: '',
  });
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [footerSections, setFooterSections] = useState<FooterSection[]>(settings.footerSections);
  const [newFooterSection, setNewFooterSection] = useState<Omit<FooterSection, 'id' | 'order'>>({
    title: '',
    links: [],
  });
  const [editingFooterSection, setEditingFooterSection] = useState<FooterSection | null>(null);
  const [newFooterLink, setNewFooterLink] = useState<Omit<FooterLink, 'id' | 'order'>>({
    label: '',
    path: '',
    isExternal: false,
  });
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLink | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [copyrightText, setCopyrightText] = useState(settings.copyrightText);
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState(settings.privacyPolicyLink);
  const [termsOfServiceLink, setTermsOfServiceLink] = useState(settings.termsOfServiceLink);

  useEffect(() => {
    setSettings(storageService.getFooterSettings());
  }, []);

  useEffect(() => {
    setCompanyDescription(settings.companyInfo.description);
    setAddress(settings.companyInfo.address);
    setPhone(settings.companyInfo.phone);
    setEmail(settings.companyInfo.email);
    setSocialLinks(settings.socialLinks);
    setFooterSections(settings.footerSections);
    setCopyrightText(settings.copyrightText);
    setPrivacyPolicyLink(settings.privacyPolicyLink);
    setTermsOfServiceLink(settings.termsOfServiceLink);
  }, [settings]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const updatedSettings: Partial<FooterSettingsType> = {
        ...settings,
        companyInfo: {
          description: companyDescription,
          address: address,
          phone: phone,
          email: email,
        },
        socialLinks: socialLinks,
        footerSections: footerSections,
        copyrightText: copyrightText,
        privacyPolicyLink: privacyPolicyLink,
        termsOfServiceLink: termsOfServiceLink,
      };
      storageService.updateFooterSettings(updatedSettings);
      toast({
        title: 'Footer settings updated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Failed to update footer settings.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const addSocialLink = () => {
    try {
      socialLinkSchema.parse(newSocialLink);
      const newLink = { ...newSocialLink, id: Date.now(), order: socialLinks.length };
      setSocialLinks([...socialLinks, newLink]);
      setNewSocialLink({ platform: '', icon: '', url: '' });
    } catch (error: any) {
      toast({
        title: 'Failed to add social link.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateSocialLink = (id: number) => {
    try {
      socialLinkSchema.parse(editingSocialLink);
      const updatedLinks = socialLinks.map((link) =>
        link.id === id ? { ...link, ...editingSocialLink } : link
      );
      setSocialLinks(updatedLinks);
      setEditingSocialLink(null);
    } catch (error: any) {
      toast({
        title: 'Failed to update social link.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteSocialLink = (id: number) => {
    const updatedLinks = socialLinks.filter((link) => link.id !== id);
    setSocialLinks(updatedLinks);
  };

  const moveSocialLink = (index: number, direction: 'up' | 'down') => {
    const newSocialLinks = [...socialLinks];
    if (direction === 'up' && index > 0) {
      [newSocialLinks[index], newSocialLinks[index - 1]] = [
        newSocialLinks[index - 1],
        newSocialLinks[index],
      ];
    } else if (direction === 'down' && index < socialLinks.length - 1) {
      [newSocialLinks[index], newSocialLinks[index + 1]] = [
        newSocialLinks[index + 1],
        newSocialLinks[index],
      ];
    }
    setSocialLinks(newSocialLinks);
  };

  const addFooterSection = () => {
    try {
      footerSectionSchema.parse(newFooterSection);
      const newSection = { ...newFooterSection, id: Date.now(), order: footerSections.length };
      setFooterSections([...footerSections, newSection]);
      setNewFooterSection({ title: '', links: [] });
    } catch (error: any) {
      toast({
        title: 'Failed to add footer section.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateFooterSection = (id: number) => {
    try {
      footerSectionSchema.parse(editingFooterSection);
      const updatedSections = footerSections.map((section) =>
        section.id === id ? { ...section, ...editingFooterSection } : section
      );
      setFooterSections(updatedSections);
      setEditingFooterSection(null);
    } catch (error: any) {
      toast({
        title: 'Failed to update footer section.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteFooterSection = (id: number) => {
    const updatedSections = footerSections.filter((section) => section.id !== id);
    setFooterSections(updatedSections);
  };

  const addFooterLink = (sectionId: number) => {
    try {
      footerLinkSchema.parse(newFooterLink);
      const updatedSections = footerSections.map((section) => {
        if (section.id === sectionId) {
          const newLink = { ...newFooterLink, id: Date.now(), order: section.links.length };
          return { ...section, links: [...section.links, newLink] };
        }
        return section;
      });
      setFooterSections(updatedSections);
      setNewFooterLink({ label: '', path: '', isExternal: false });
      setSelectedSectionId(null);
    } catch (error: any) {
      toast({
        title: 'Failed to add footer link.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateFooterLink = (sectionId: number, linkId: number) => {
    try {
      footerLinkSchema.parse(editingFooterLink);
      const updatedSections = footerSections.map((section) => {
        if (section.id === sectionId) {
          const updatedLinks = section.links.map((link) =>
            link.id === linkId ? { ...link, ...editingFooterLink } : link
          );
          return { ...section, links: updatedLinks };
        }
        return section;
      });
      setFooterSections(updatedSections);
      setEditingFooterLink(null);
    } catch (error: any) {
      toast({
        title: 'Failed to update footer link.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteFooterLink = (sectionId: number, linkId: number) => {
    const updatedSections = footerSections.map((section) => {
      if (section.id === sectionId) {
        const updatedLinks = section.links.filter((link) => link.id !== linkId);
        return { ...section, links: updatedLinks };
      }
      return section;
    });
    setFooterSections(updatedSections);
  };

  const handleRichTextChange = (content: any) => {
    setCompanyDescription(content);
  };

  return (
    <div className="container mx-auto py-6 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Footer Settings</h1>
          <p className="text-muted-foreground">
            Manage your website footer information and navigation links
          </p>
        </div>
        <Button onClick={handleUpdate} disabled={updating}>
          {updating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="company-info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company-info">Company Info</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Links</TabsTrigger>
          <TabsTrigger value="legal">Legal & Copyright</TabsTrigger>
        </TabsList>

        <TabsContent value="company-info" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company description and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel htmlFor="description">Company Description</FormLabel>
                <div className="mt-2">
                  <RichTextEditor
                    initialContent={companyDescription}
                    onChange={setCompanyDescription}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your company address"
                    rows={4}
                  />
                  <FormDescription>
                    Display your physical address. Use line breaks for formatting.
                  </FormDescription>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Manage your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add Social Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Social Media Link</DialogTitle>
                      <DialogDescription>
                        Add a new social media platform to your footer
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="new-platform">Platform Name</FormLabel>
                        <Input
                          id="new-platform"
                          value={newSocialLink.platform}
                          onChange={(e) =>
                            setNewSocialLink({ ...newSocialLink, platform: e.target.value })
                          }
                          placeholder="LinkedIn"
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="new-icon">Icon Name</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            id="new-icon"
                            value={newSocialLink.icon}
                            onChange={(e) =>
                              setNewSocialLink({ ...newSocialLink, icon: e.target.value })
                            }
                            placeholder="linkedin"
                            className="flex-1"
                          />
                          <IconSelector
                            onSelect={(icon) =>
                              setNewSocialLink({ ...newSocialLink, icon })
                            }
                          />
                        </div>
                        <FormDescription>
                          Enter a Font Awesome icon name, like "linkedin" or "twitter"
                        </FormDescription>
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="new-url">URL</FormLabel>
                        <Input
                          id="new-url"
                          value={newSocialLink.url}
                          onChange={(e) =>
                            setNewSocialLink({ ...newSocialLink, url: e.target.value })
                          }
                          placeholder="https://linkedin.com/company/yourcompany"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addSocialLink}>Add Link</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {socialLinks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Icon</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {socialLinks.map((link, index) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{link.order}</span>
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSocialLink(index, 'up')}
                                disabled={index === 0}
                              >
                                <MoveUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSocialLink(index, 'down')}
                                disabled={index === socialLinks.length - 1}
                              >
                                <MoveDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{link.platform}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <i className={`fab fa-${link.icon} text-primary`}></i>
                            <span className="text-xs text-muted-foreground">
                              {link.icon}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[200px]">
                          {link.url}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Social Media Link</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <FormLabel htmlFor={`edit-platform-${link.id}`}>
                                      Platform Name
                                    </FormLabel>
                                    <Input
                                      id={`edit-platform-${link.id}`}
                                      value={
                                        editingSocialLink?.id === link.id
                                          ? editingSocialLink.platform
                                          : link.platform
                                      }
                                      onChange={(e) =>
                                        setEditingSocialLink({
                                          ...editingSocialLink!,
                                          platform: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <FormLabel htmlFor={`edit-icon-${link.id}`}>
                                      Icon Name
                                    </FormLabel>
                                    <div className="flex gap-2">
                                      <Input
                                        id={`edit-icon-${link.id}`}
                                        value={
                                          editingSocialLink?.id === link.id
                                            ? editingSocialLink.icon
                                            : link.icon
                                        }
                                        onChange={(e) =>
                                          setEditingSocialLink({
                                            ...editingSocialLink!,
                                            icon: e.target.value,
                                          })
                                        }
                                        className="flex-1"
                                      />
                                      <IconSelector
                                        onSelect={(icon) =>
                                          setEditingSocialLink({
                                            ...editingSocialLink!,
                                            icon,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <FormLabel htmlFor={`edit-url-${link.id}`}>
                                      URL
                                    </FormLabel>
                                    <Input
                                      id={`edit-url-${link.id}`}
                                      value={
                                        editingSocialLink?.id === link.id
                                          ? editingSocialLink.url
                                          : link.url
                                      }
                                      onChange={(e) =>
                                        setEditingSocialLink({
                                          ...editingSocialLink!,
                                          url: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => updateSocialLink(link.id)}>
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSocialLink(link.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No social links added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Navigation Sections</CardTitle>
              <CardDescription>
                Manage the sections and links in your website footer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Footer Section</DialogTitle>
                      <DialogDescription>
                        Add a new section to your footer navigation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="new-section-title">Section Title</FormLabel>
                        <Input
                          id="new-section-title"
                          value={newFooterSection.title}
                          onChange={(e) =>
                            setNewFooterSection({ ...newFooterSection, title: e.target.value })
                          }
                          placeholder="Company"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addFooterSection}>Add Section</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {footerSections.length > 0 ? (
                <Accordion type="single" collapsible>
                  {footerSections.map((section, sectionIndex) => (
                    <AccordionItem key={section.id} value={`section-${section.id}`}>
                      <AccordionTrigger className="flex justify-between items-center py-2">
                        {section.title}
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Footer Section</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <FormLabel htmlFor={`edit-section-title-${section.id}`}>
                                    Section Title
                                  </FormLabel>
                                  <Input
                                    id={`edit-section-title-${section.id}`}
                                    value={
                                      editingFooterSection?.id === section.id
                                        ? editingFooterSection.title
                                        : section.title
                                    }
                                    onChange={(e) =>
                                      setEditingFooterSection({
                                        ...editingFooterSection!,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={() => updateFooterSection(section.id)}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteFooterSection(section.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Dialog>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-end mb-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setSelectedSectionId(section.id)}
                              >
                                <Plus className="h-4 w-4" /> Add Link
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Footer Link</DialogTitle>
                                <DialogDescription>
                                  Add a new link to this footer section
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <FormLabel htmlFor="new-link-label">Link Label</FormLabel>
                                  <Input
                                    id="new-link-label"
                                    value={newFooterLink.label}
                                    onChange={(e) =>
                                      setNewFooterLink({ ...newFooterLink, label: e.target.value })
                                    }
                                    placeholder="About Us"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <FormLabel htmlFor="new-link-path">Link Path</FormLabel>
                                  <Input
                                    id="new-link-path"
                                    value={newFooterLink.path}
                                    onChange={(e) =>
                                      setNewFooterLink({ ...newFooterLink, path: e.target.value })
                                    }
                                    placeholder="/about"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="new-link-external"
                                    checked={newFooterLink.isExternal}
                                    onCheckedChange={(checked) =>
                                      setNewFooterLink({ ...newFooterLink, isExternal: checked! })
                                    }
                                  />
                                  <label
                                    htmlFor="new-link-external"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    External Link
                                  </label>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={() => addFooterLink(section.id)}>
                                  Add Link
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {section.links.length > 0 ? (
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
                              {section.links.map((link) => (
                                <TableRow key={link.id}>
                                  <TableCell>{link.label}</TableCell>
                                  <TableCell className="font-mono text-xs truncate max-w-[200px]">
                                    {link.path}
                                  </TableCell>
                                  <TableCell>
                                    {link.isExternal ? (
                                      <Badge variant="outline">External</Badge>
                                    ) : (
                                      <Badge>Internal</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Edit Footer Link</DialogTitle>
                                          </DialogHeader>
                                          <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                              <FormLabel htmlFor={`edit-link-label-${link.id}`}>
                                                Link Label
                                              </FormLabel>
                                              <Input
                                                id={`edit-link-label-${link.id}`}
                                                value={
                                                  editingFooterLink?.id === link.id
                                                    ? editingFooterLink.label
                                                    : link.label
                                                }
                                                onChange={(e) =>
                                                  setEditingFooterLink({
                                                    ...editingFooterLink!,
                                                    label: e.target.value,
                                                  })
                                                }
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <FormLabel htmlFor={`edit-link-path-${link.id}`}>
                                                Link Path
                                              </FormLabel>
                                              <Input
                                                id={`edit-link-path-${link.id}`}
                                                value={
                                                  editingFooterLink?.id === link.id
                                                    ? editingFooterLink.path
                                                    : link.path
                                                }
                                                onChange={(e) =>
                                                  setEditingFooterLink({
                                                    ...editingFooterLink!,
                                                    path: e.target.value,
                                                  })
                                                }
                                              />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                id={`edit-link-external-${link.id}`}
                                                checked={
                                                  editingFooterLink?.id === link.id
                                                    ? editingFooterLink.isExternal
                                                    : link.isExternal
                                                }
                                                onCheckedChange={(checked) =>
                                                  setEditingFooterLink({
                                                    ...editingFooterLink!,
                                                    isExternal: checked!,
                                                  })
                                                }
                                              />
                                              <label
                                                htmlFor={`edit-link-external-${link.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                External Link
                                              </label>
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              onClick={() => updateFooterLink(section.id, link.id)}
                                            >
                                              Save Changes
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteFooterLink(section.id, link.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No links added to this section yet.
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No footer sections added yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal & Copyright</CardTitle>
              <CardDescription>
                Update your copyright notice and legal page links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <FormLabel htmlFor="copyright">Copyright Text</FormLabel>
                <Input
                  id="copyright"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  placeholder="© {year} Your Company Name. All rights reserved."
                />
                <FormDescription>
                  Use "{year}" as a placeholder for the current year
                </FormDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel htmlFor="privacy-link">Privacy Policy Link</FormLabel>
                  <Input
                    id="privacy-link"
                    value={privacyPolicy
