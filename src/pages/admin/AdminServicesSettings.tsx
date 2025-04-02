
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceItem, ServicesSettings } from "@/lib/types";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminServicesSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ServicesSettings>({
    id: 1,
    title: "Our Services",
    subtitle: "What We Do",
    description: "We provide comprehensive digital solutions to help businesses succeed in the digital age.",
    servicesPerPage: 8,
    defaultSorting: "newest",
    enableFiltering: true,
    services: [],
    viewAllText: "View All Services",
    viewAllUrl: "/services",
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    const storedSettings = storageService.getServicesSettings();
    if (storedSettings) {
      setSettings(storedSettings);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean, name: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    try {
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString()
      };
      
      storageService.updateServicesSettings(updatedSettings);
      
      toast({
        title: "Settings Saved",
        description: "Services settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save services settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Services Settings</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure how services are displayed across the website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Services Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={settings.title}
                  onChange={handleInputChange}
                  placeholder="Our Services"
                />
                <p className="text-sm text-muted-foreground">The main title for your services section</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Services Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={settings.subtitle}
                  onChange={handleInputChange}
                  placeholder="What We Do"
                />
                <p className="text-sm text-muted-foreground">A short subtitle that appears above the main title</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Services Description</Label>
              <Input
                id="description"
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                placeholder="We provide comprehensive digital solutions..."
              />
              <p className="text-sm text-muted-foreground">A brief description of your services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="viewAllText">View All Button Text</Label>
                <Input
                  id="viewAllText"
                  name="viewAllText"
                  value={settings.viewAllText}
                  onChange={handleInputChange}
                  placeholder="View All Services"
                />
                <p className="text-sm text-muted-foreground">The text shown on the "View All" button</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="viewAllUrl">View All Button URL</Label>
                <Input
                  id="viewAllUrl"
                  name="viewAllUrl"
                  value={settings.viewAllUrl}
                  onChange={handleInputChange}
                  placeholder="/services"
                />
                <p className="text-sm text-muted-foreground">The URL that the "View All" button links to</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services List Settings</CardTitle>
            <CardDescription>Configure how your services are displayed in list views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="servicesPerPage">Services Per Page</Label>
                <Input
                  id="servicesPerPage"
                  name="servicesPerPage"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.servicesPerPage}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">Number of services to display per page</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultSorting">Default Sorting</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange(value, 'defaultSorting')}
                  value={settings.defaultSorting}
                >
                  <SelectTrigger id="defaultSorting">
                    <SelectValue placeholder="Select default sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="reverse-alphabetical">Reverse Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">How services are sorted by default</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col">
                <Label htmlFor="enableFiltering" className="mb-2">Enable Filtering</Label>
                <p className="text-sm text-muted-foreground">Allow users to filter services by category</p>
              </div>
              <Switch
                id="enableFiltering"
                checked={settings.enableFiltering}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'enableFiltering')}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminServicesSettings;
