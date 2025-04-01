import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pen, Plus, Trash2, MoveVertical, ArrowUp, ArrowDown, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { storageService } from '@/lib/storage';
import { ServiceItem, ServicesSettings } from '@/lib/types';
import IconSelector from '@/components/admin/icon-management/IconSelector';
import RichTextEditor from '@/components/admin/richtext/RichTextEditor';
import ServiceSEOTab from '@/components/admin/services/ServiceSEOTab';
import ServiceMediaTab from '@/components/admin/services/ServiceMediaTab';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminServicesSettings: React.FC = () => {
  const [settings, setSettings] = useState<ServicesSettings>({
    id: 1,
    title: 'Our Services',
    subtitle: 'What we do',
    description: 'We provide tailored solutions to meet your digital needs.',
    viewAllText: 'View All Services',
    viewAllUrl: '/services',
    services: [],
    lastUpdated: new Date().toISOString()
  });
  
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [serviceFormTab, setServiceFormTab] = useState('general');
  
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [h1Heading, setH1Heading] = useState('');
  const [h2Headings, setH2Headings] = useState<string[]>([]);
  const [h2Input, setH2Input] = useState('');
  const [h3Headings, setH3Headings] = useState<string[]>([]);
  const [h3Input, setH3Input] = useState('');
  
  const [images, setImages] = useState<(File | string)[]>([]);
  const [documents, setDocuments] = useState<(File | string)[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoInput, setVideoInput] = useState('');
  
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadServicesSettings();
    
    const unsubscribeContentUpdated = storageService.addEventListener('content-updated', handleRealTimeSync);
    const unsubscribeContentAdded = storageService.addEventListener('content-added', handleRealTimeSync);
    const unsubscribeContentDeleted = storageService.addEventListener('content-deleted', handleRealTimeSync);
    
    return () => {
      unsubscribeContentUpdated();
      unsubscribeContentAdded();
      unsubscribeContentDeleted();
    };
  }, []);

  const loadServicesSettings = () => {
    const storedSettings = storageService.getServicesSettings();
    if (storedSettings) {
      setSettings(storedSettings);
      setServices(storedSettings.services || []);
    }
  };

  const handleRealTimeSync = () => {
    setIsSyncing(true);
    loadServicesSettings();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleSaveGeneralSettings = () => {
    const updatedSettings = {
      ...settings,
      services: services
    };
    
    storageService.updateServicesSettings(updatedSettings);
    
    toast({
      title: "Settings updated",
      description: "General settings have been saved successfully.",
    });
  };

  const handleCreateService = () => {
    const newId = services.length > 0 
      ? Math.max(...services.map(s => s.id)) + 1 
      : 1;
    
    setEditingService({
      id: newId,
      title: '',
      description: '',
      iconName: 'code',
      link: '/services/service-name',
      order: services.length + 1,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      seoHeadingStructure: {
        h1: '',
        h2: [],
        h3: []
      },
      images: [],
      videos: [],
      documents: []
    });
    
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords([]);
    setKeywordInput('');
    setH1Heading('');
    setH2Headings([]);
    setH2Input('');
    setH3Headings([]);
    setH3Input('');
    setImages([]);
    setDocuments([]);
    setVideos([]);
    setVideoInput('');
    setServiceFormTab('general');
    
    setIsServiceDialogOpen(true);
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingService(service);
    
    setSeoTitle(service.seoTitle || '');
    setSeoDescription(service.seoDescription || '');
    setSeoKeywords(service.seoKeywords || []);
    
    if (service.seoHeadingStructure) {
      setH1Heading(service.seoHeadingStructure.h1 || '');
      setH2Headings(service.seoHeadingStructure.h2 || []);
      setH3Headings(service.seoHeadingStructure.h3 || []);
    } else {
      setH1Heading('');
      setH2Headings([]);
      setH3Headings([]);
    }
    
    setImages(service.images || []);
    setDocuments(service.documents || []);
    setVideos(service.videos || []);
    
    setServiceFormTab('general');
    setIsServiceDialogOpen(true);
  };

  const openDeleteServiceDialog = (service: ServiceItem) => {
    setServiceToDelete(service);
    setDeleteConfirmText('');
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteService = () => {
    if (serviceToDelete && deleteConfirmText === 'DELETE') {
      const updatedServices = services.filter(s => s.id !== serviceToDelete.id);
      setServices(updatedServices);
      
      const updatedSettings = {
        ...settings,
        services: updatedServices
      };
      
      storageService.updateServicesSettings(updatedSettings);
      
      toast({
        title: "Service deleted",
        description: `Service "${serviceToDelete.title}" has been deleted.`,
      });
      
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleMoveService = (id: number, direction: 'up' | 'down') => {
    const index = services.findIndex(s => s.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === services.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedServices = [...services];
    const temp = updatedServices[index];
    updatedServices[index] = updatedServices[newIndex];
    updatedServices[newIndex] = temp;
    
    updatedServices.forEach((item, i) => {
      item.order = i + 1;
    });
    
    setServices(updatedServices);
    
    const updatedSettings = {
      ...settings,
      services: updatedServices
    };
    
    storageService.updateServicesSettings(updatedSettings);
  };

  const handleServiceFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingService) return;
    
    const serviceItem: ServiceItem = {
      id: editingService.id,
      title: editingService.title,
      description: editingService.description,
      iconName: editingService.iconName,
      link: editingService.link,
      order: editingService.order,
      color: editingService.color,
      bgColor: editingService.bgColor,
      formattedDescription: editingService.formattedDescription,
      
      seoTitle: seoTitle,
      seoDescription: seoDescription,
      seoKeywords: seoKeywords,
      seoHeadingStructure: {
        h1: h1Heading,
        h2: h2Headings,
        h3: h3Headings
      },
      
      images: processFilesForStorage(images),
      documents: processFilesForStorage(documents),
      videos: videos
    };
    
    let updatedServices = [...services];
    const index = updatedServices.findIndex(s => s.id === serviceItem.id);
    
    if (index !== -1) {
      updatedServices[index] = serviceItem;
    } else {
      updatedServices.push(serviceItem);
    }
    
    updatedServices.sort((a, b) => a.order - b.order);
    
    setServices(updatedServices);
    
    const updatedSettings = {
      ...settings,
      services: updatedServices
    };
    
    storageService.updateServicesSettings(updatedSettings);
    
    toast({
      title: index !== -1 ? "Service updated" : "Service created",
      description: `Service "${serviceItem.title}" has been ${index !== -1 ? 'updated' : 'created'}.`,
    });
    
    setIsServiceDialogOpen(false);
  };

  const processFilesForStorage = (files: (File | string)[]): string[] => {
    return files.map(file => {
      if (typeof file === 'string') {
        return file;
      }
      return `/uploads/${file.name}`;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocuments = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newDocuments]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVideo = () => {
    if (
      videoInput.trim() && 
      !videos.includes(videoInput.trim()) && 
      (videoInput.includes('youtube.com') || videoInput.includes('youtu.be') || videoInput.includes('vimeo.com'))
    ) {
      setVideos(prev => [...prev, videoInput.trim()]);
      setVideoInput('');
    } else {
      toast({
        title: "Invalid video URL",
        description: "Please enter a valid YouTube or Vimeo video URL",
        variant: "destructive",
      });
    }
  };

  const handleRemoveVideo = (video: string) => {
    setVideos(prev => prev.filter(v => v !== video));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim())) {
      setSeoKeywords(prev => [...prev, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSeoKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleAddH2Heading = () => {
    if (h2Input.trim() && !h2Headings.includes(h2Input.trim())) {
      setH2Headings(prev => [...prev, h2Input.trim()]);
      setH2Input('');
    }
  };

  const handleRemoveH2Heading = (index: number) => {
    setH2Headings(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddH3Heading = () => {
    if (h3Input.trim() && !h3Headings.includes(h3Input.trim())) {
      setH3Headings(prev => [...prev, h3Input.trim()]);
      setH3Input('');
    }
  };

  const handleRemoveH3Heading = (index: number) => {
    setH3Headings(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (value: any) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        formattedDescription: value
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Services Section Settings</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRealTimeSync} 
              className={`${isSyncing ? 'bg-green-50' : ''}`}
            >
              <RotateCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin text-green-500' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure the general settings for the services section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Section Title</Label>
                    <Input 
                      id="title" 
                      value={settings.title} 
                      onChange={(e) => setSettings({...settings, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Section Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      value={settings.subtitle} 
                      onChange={(e) => setSettings({...settings, subtitle: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Section Description</Label>
                  <Textarea 
                    id="description" 
                    value={settings.description} 
                    onChange={(e) => setSettings({...settings, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="viewAllText">Button Text</Label>
                    <Input 
                      id="viewAllText" 
                      value={settings.viewAllText} 
                      onChange={(e) => setSettings({...settings, viewAllText: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="viewAllUrl">Button URL</Label>
                    <Input 
                      id="viewAllUrl" 
                      value={settings.viewAllUrl} 
                      onChange={(e) => setSettings({...settings, viewAllUrl: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Service Cards</h2>
              <Button onClick={handleCreateService}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <Card key={service.id}>
                  <CardHeader 
                    className="pb-2"
                    style={{ backgroundColor: service.bgColor, color: service.color }}
                  >
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMoveService(service.id, 'up')}
                          className="h-7 w-7"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMoveService(service.id, 'down')}
                          className="h-7 w-7"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {service.seoKeywords && service.seoKeywords.length > 0 && 
                        service.seoKeywords.map((keyword, idx) => (
                          <span key={idx} className="inline-flex text-xs bg-secondary px-2 py-1 rounded-full">
                            {keyword}
                          </span>
                        ))
                      }
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>Icon: {service.iconName}</span>
                      <span>•</span>
                      <span>Order: {service.order}</span>
                      {service.images && service.images.length > 0 && (
                        <>
                          <span>•</span>
                          <span>Images: {service.images.length}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditService(service)}
                    >
                      <Pen className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => openDeleteServiceDialog(service)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {services.length === 0 && (
                <div className="col-span-full text-center py-10 bg-muted rounded-lg">
                  <p className="text-muted-foreground">No services added yet. Click "Add Service" to create one.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService && services.some(s => s.id === editingService.id) 
                  ? 'Edit Service' 
                  : 'Add New Service'
                }
              </DialogTitle>
              <DialogDescription>
                Configure the service details that will be displayed on the homepage and service page.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleServiceFormSubmit}>
              <Tabs value={serviceFormTab} onValueChange={setServiceFormTab} className="mt-4">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-title">Title</Label>
                      <Input 
                        id="service-title" 
                        value={editingService?.title || ''} 
                        onChange={(e) => setEditingService(prev => prev ? {...prev, title: e.target.value} : null)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service-link">Link</Label>
                      <Input 
                        id="service-link" 
                        value={editingService?.link || ''} 
                        onChange={(e) => setEditingService(prev => prev ? {...prev, link: e.target.value} : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-description">Description</Label>
                    <Textarea 
                      id="service-description" 
                      value={editingService?.description || ''} 
                      onChange={(e) => setEditingService(prev => prev ? {...prev, description: e.target.value} : null)}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <IconSelector 
                      selectedIcon={editingService?.iconName || 'code'} 
                      onSelectIcon={(iconName) => setEditingService(prev => prev ? {...prev, iconName} : null)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service-color">Text Color</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="service-color" 
                          type="color" 
                          value={editingService?.color || '#3b82f6'} 
                          onChange={(e) => setEditingService(prev => prev ? {...prev, color: e.target.value} : null)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={editingService?.color || '#3b82f6'} 
                          onChange={(e) => setEditingService(prev => prev ? {...prev, color: e.target.value} : null)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service-bg-color">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="service-bg-color" 
                          type="color" 
                          value={editingService?.bgColor || '#eff6ff'} 
                          onChange={(e) => setEditingService(prev => prev ? {...prev, bgColor: e.target.value} : null)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={editingService?.bgColor || '#eff6ff'} 
                          onChange={(e) => setEditingService(prev => prev ? {...prev, bgColor: e.target.value} : null)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-order">Order</Label>
                    <Input 
                      id="service-order" 
                      type="number" 
                      min="1"
                      value={editingService?.order || services.length + 1} 
                      onChange={(e) => setEditingService(prev => prev ? {...prev, order: parseInt(e.target.value)} : null)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rich Content Editor</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Use the editor below to create formatted content for your service. You can add text styling, colors, links, emojis, and more.
                    </p>
                    <RichTextEditor
                      label="Service Content"
                      value={editingService?.formattedDescription || editingService?.description || ''}
                      onChange={handleDescriptionChange}
                      height="300px"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="seo">
                  <ServiceSEOTab 
                    seoTitle={seoTitle}
                    seoDescription={seoDescription}
                    seoKeywords={seoKeywords}
                    keywordInput={keywordInput}
                    h1Heading={h1Heading}
                    h2Headings={h2Headings}
                    h2Input={h2Input}
                    h3Headings={h3Headings}
                    h3Input={h3Input}
                    onSeoTitleChange={setSeoTitle}
                    onSeoDescriptionChange={setSeoDescription}
                    onKeywordInputChange={setKeywordInput}
                    onAddKeyword={handleAddKeyword}
                    onRemoveKeyword={handleRemoveKeyword}
                    onH1HeadingChange={setH1Heading}
                    onH2InputChange={setH2Input}
                    onAddH2Heading={handleAddH2Heading}
                    onRemoveH2Heading={handleRemoveH2Heading}
                    onH3InputChange={setH3Input}
                    onAddH3Heading={handleAddH3Heading}
                    onRemoveH3Heading={handleRemoveH3Heading}
                  />
                </TabsContent>
                
                <TabsContent value="media">
                  <ServiceMediaTab 
                    images={images}
                    documents={documents}
                    videos={videos}
                    videoInput={videoInput}
                    onImageChange={handleImageChange}
                    onDocumentChange={handleDocumentChange}
                    onRemoveImage={handleRemoveImage}
                    onRemoveDocument={handleRemoveDocument}
                    onVideoInputChange={setVideoInput}
                    onAddVideo={handleAddVideo}
                    onRemoveVideo={handleRemoveVideo}
                  />
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Service</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this service?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{serviceToDelete?.title}" from your services list.
                <div className="mt-4">
                  <p className="font-semibold mb-2">Type "DELETE" to confirm:</p>
                  <Input 
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="mt-1"
                    placeholder="Type DELETE here"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteService}
                disabled={deleteConfirmText !== 'DELETE'}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminServicesSettings;
