
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { ReferencesSettings, ClientLogo } from "@/lib/types";
import { PlusCircle, Trash2, MoveUp, MoveDown, Eye, EyeOff, ArrowUpDown, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const AdminReferencesSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ReferencesSettings>(storageService.getReferencesSettings());
  const [newLogo, setNewLogo] = useState<Omit<ClientLogo, 'id'>>({
    name: "",
    logo: "",
    scale: "w-32",
    order: settings.clientLogos.length + 1
  });
  
  // Handle general settings change
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  // Handle new logo field changes
  const handleNewLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLogo({
      ...newLogo,
      [name]: value
    });
  };
  
  // Handle scale selection for new logo
  const handleScaleChange = (value: string) => {
    setNewLogo({
      ...newLogo,
      scale: value
    });
  };
  
  // Add a new logo
  const handleAddLogo = () => {
    if (!newLogo.name.trim() || !newLogo.logo.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and logo URL.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new logo
    storageService.addClientLogo(newLogo);
    
    // Update the settings
    setSettings(storageService.getReferencesSettings());
    
    // Reset the new logo form
    setNewLogo({
      name: "",
      logo: "",
      scale: "w-32",
      order: settings.clientLogos.length + 2
    });
    
    toast({
      title: "Client Logo Added",
      description: `${newLogo.name} has been added to your references.`
    });
  };
  
  // Update logo fields
  const handleLogoChange = (id: number, field: keyof ClientLogo, value: any) => {
    const updatedLogos = settings.clientLogos.map(logo => {
      if (logo.id === id) {
        return { ...logo, [field]: value };
      }
      return logo;
    });
    
    setSettings({
      ...settings,
      clientLogos: updatedLogos
    });
  };
  
  // Toggle logo visibility
  const handleToggleActive = (id: number) => {
    const logo = settings.clientLogos.find(logo => logo.id === id);
    if (!logo) return;
    
    const isActive = logo.isActive === false ? true : false;
    handleLogoChange(id, 'isActive', isActive);
  };
  
  // Move logo up in order
  const handleMoveUp = (id: number) => {
    const index = settings.clientLogos.findIndex(logo => logo.id === id);
    if (index <= 0) return;
    
    const updatedLogos = [...settings.clientLogos];
    const temp = updatedLogos[index].order;
    updatedLogos[index].order = updatedLogos[index - 1].order;
    updatedLogos[index - 1].order = temp;
    
    updatedLogos.sort((a, b) => a.order - b.order);
    
    setSettings({
      ...settings,
      clientLogos: updatedLogos
    });
  };
  
  // Move logo down in order
  const handleMoveDown = (id: number) => {
    const index = settings.clientLogos.findIndex(logo => logo.id === id);
    if (index >= settings.clientLogos.length - 1) return;
    
    const updatedLogos = [...settings.clientLogos];
    const temp = updatedLogos[index].order;
    updatedLogos[index].order = updatedLogos[index + 1].order;
    updatedLogos[index + 1].order = temp;
    
    updatedLogos.sort((a, b) => a.order - b.order);
    
    setSettings({
      ...settings,
      clientLogos: updatedLogos
    });
  };
  
  // Delete a logo
  const handleDeleteLogo = (id: number) => {
    const logoName = settings.clientLogos.find(logo => logo.id === id)?.name;
    
    const updatedLogos = settings.clientLogos.filter(logo => logo.id !== id);
    
    // Update orders after deletion
    const reorderedLogos = updatedLogos.map((logo, index) => ({
      ...logo,
      order: index + 1
    }));
    
    setSettings({
      ...settings,
      clientLogos: reorderedLogos
    });
    
    toast({
      title: "Client Logo Removed",
      description: `${logoName} has been removed from your references.`
    });
  };
  
  // Save all settings
  const handleSaveSettings = () => {
    storageService.updateReferencesSettings(settings);
    
    toast({
      title: "References Settings Saved",
      description: "Your changes have been saved successfully."
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">References Section Settings</h1>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="logos">Client Logos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure the main settings for the references section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Section Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={settings.title} 
                      onChange={handleGeneralSettingsChange} 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Section Subtitle</Label>
                    <Textarea 
                      id="subtitle" 
                      name="subtitle" 
                      value={settings.subtitle} 
                      onChange={handleGeneralSettingsChange} 
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="viewCaseStudiesText">Button Text</Label>
                      <Input 
                        id="viewCaseStudiesText" 
                        name="viewCaseStudiesText" 
                        value={settings.viewCaseStudiesText} 
                        onChange={handleGeneralSettingsChange} 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="viewCaseStudiesUrl">Button URL</Label>
                      <Input 
                        id="viewCaseStudiesUrl" 
                        name="viewCaseStudiesUrl" 
                        value={settings.viewCaseStudiesUrl} 
                        onChange={handleGeneralSettingsChange} 
                        placeholder="/case-studies or https://example.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        For internal pages, start with a slash (e.g., "/case-studies"). 
                        For external links, include the full URL (e.g., "https://example.com").
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Client Logo</CardTitle>
                <CardDescription>Add a new client logo to the references section.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newLogo.name} 
                      onChange={handleNewLogoChange} 
                      placeholder="e.g., Microsoft"
                    />
                  </div>
                  
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input 
                      id="logo" 
                      name="logo" 
                      value={newLogo.logo} 
                      onChange={handleNewLogoChange}
                      placeholder="https://example.com/logo.svg"
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="scale">Logo Scale</Label>
                    <Select value={newLogo.scale} onValueChange={handleScaleChange}>
                      <SelectTrigger id="scale">
                        <SelectValue placeholder="Select a scale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="w-20">Small (w-20)</SelectItem>
                        <SelectItem value="w-24">Medium Small (w-24)</SelectItem>
                        <SelectItem value="w-28">Medium (w-28)</SelectItem>
                        <SelectItem value="w-32">Large (w-32)</SelectItem>
                        <SelectItem value="w-36">Extra Large (w-36)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={handleAddLogo} className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Client Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage Client Logos</CardTitle>
                <CardDescription>Edit, reorder, or remove client logos.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Logo Preview</TableHead>
                      <TableHead>Scale</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.clientLogos.sort((a, b) => a.order - b.order).map((logo) => (
                      <TableRow key={logo.id}>
                        <TableCell className="font-medium">{logo.order}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Input 
                              value={logo.name} 
                              onChange={(e) => handleLogoChange(logo.id, 'name', e.target.value)} 
                              className="h-8"
                            />
                            <Input 
                              value={logo.logo} 
                              onChange={(e) => handleLogoChange(logo.id, 'logo', e.target.value)} 
                              className="h-8 text-xs"
                              placeholder="URL"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <img 
                            src={logo.logo} 
                            alt={logo.name} 
                            className="h-10 max-w-[100px] object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={logo.scale} 
                            onValueChange={(value) => handleLogoChange(logo.id, 'scale', value)}
                          >
                            <SelectTrigger className="h-8 w-24">
                              <SelectValue placeholder="Scale" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="w-20">w-20</SelectItem>
                              <SelectItem value="w-24">w-24</SelectItem>
                              <SelectItem value="w-28">w-28</SelectItem>
                              <SelectItem value="w-32">w-32</SelectItem>
                              <SelectItem value="w-36">w-36</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleMoveUp(logo.id)}
                              disabled={logo.order === 1}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleMoveDown(logo.id)}
                              disabled={logo.order === settings.clientLogos.length}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleActive(logo.id)}
                            >
                              {logo.isActive === false ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteLogo(logo.id)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReferencesSettings;
