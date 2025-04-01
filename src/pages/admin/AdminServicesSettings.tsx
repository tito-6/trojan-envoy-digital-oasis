
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pen, Plus, Trash2, MoveVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { storageService } from '@/lib/storage';
import { ServiceItem, ServicesSettings } from '@/lib/types';
import IconSelector from '@/components/admin/icon-management/IconSelector';
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
    title: 'Our Services',
    subtitle: 'What we do',
    description: 'We provide tailored solutions to meet your digital needs.',
    buttonText: 'View All Services',
    buttonUrl: '/services',
    services: []
  });
  
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    const storedSettings = storageService.getServicesSettings();
    if (storedSettings) {
      setSettings(storedSettings);
      setServices(storedSettings.services || []);
    }
  }, []);

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
    });
    
    setIsServiceDialogOpen(true);
  };

  const handleEditService = (service: ServiceItem) => {
    setEditingService(service);
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
    
    // Update order properties
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
    
    // Ensure the service item has all required fields
    const serviceItem: ServiceItem = {
      id: editingService.id,
      title: editingService.title,
      description: editingService.description,
      iconName: editingService.iconName,
      link: editingService.link,
      order: editingService.order,
      color: editingService.color,
      bgColor: editingService.bgColor,
    };
    
    let updatedServices = [...services];
    const index = updatedServices.findIndex(s => s.id === serviceItem.id);
    
    if (index !== -1) {
      // Update existing service
      updatedServices[index] = serviceItem;
    } else {
      // Add new service
      updatedServices.push(serviceItem);
    }
    
    // Sort by order
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

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Services Section Settings</h1>
        
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
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input 
                      id="buttonText" 
                      value={settings.buttonText} 
                      onChange={(e) => setSettings({...settings, buttonText: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonUrl">Button URL</Label>
                    <Input 
                      id="buttonUrl" 
                      value={settings.buttonUrl} 
                      onChange={(e) => setSettings({...settings, buttonUrl: e.target.value})}
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
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>Icon: {service.iconName}</span>
                      <span>•</span>
                      <span>Order: {service.order}</span>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService && services.some(s => s.id === editingService.id) 
                  ? 'Edit Service' 
                  : 'Add New Service'
                }
              </DialogTitle>
              <DialogDescription>
                Configure the service details that will be displayed on the homepage.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleServiceFormSubmit}>
              <div className="grid gap-4 py-4">
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
              </div>
              
              <DialogFooter>
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
