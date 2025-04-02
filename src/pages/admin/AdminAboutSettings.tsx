import React, { useState, useEffect } from "react";
import { 
  Info, 
  Pencil, 
  Plus, 
  Trash, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/admin/AdminLayout";
import { storageService } from "@/lib/storage";
import { AboutSettings, KeyPoint, StatItem } from "@/lib/types";

const AdminAboutSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [editableSettings, setEditableSettings] = useState<Partial<AboutSettings>>({});
  
  useEffect(() => {
    const storedSettings = storageService.getAboutSettings();
    setSettings(storedSettings);
    setEditableSettings(storedSettings);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggleEdit = () => {
    setIsEditing(prev => !prev);
  };
  
  const handleToggleEditMission = () => {
    setIsEditingMission(prev => !prev);
  };
  
  const handleToggleEditVision = () => {
    setIsEditingVision(prev => !prev);
  };
  
  const handleSave = () => {
    if (!editableSettings) return;
    
    // Save settings
    const updatedSettings = {
      ...settings,
      ...editableSettings
    };
    
    storageService.saveAboutSettings(updatedSettings);
    
    setSettings(updatedSettings as AboutSettings);
    setIsEditing(false);
    
    toast({
      title: "Settings updated",
      description: "About page settings have been successfully updated."
    });
  };
  
  const handleAddKeyPoint = () => {
    // Mock implementation
    toast({
      title: "Key point added",
      description: "A new key point has been added to the about page."
    });
  };
  
  const handleEditKeyPoint = (index: number) => {
    // Mock implementation
    toast({
      title: "Key point updated",
      description: "The key point has been successfully updated."
    });
  };
  
  const handleDeleteKeyPoint = (index: number) => {
    // Mock implementation
    toast({
      title: "Key point deleted",
      description: "The key point has been successfully deleted."
    });
  };
  
  const handleAddStat = () => {
    // Mock implementation
    toast({
      title: "Stat added",
      description: "A new stat has been added to the about page."
    });
  };
  
  const handleEditStat = (index: number) => {
    // Mock implementation
    toast({
      title: "Stat updated",
      description: "The stat has been successfully updated."
    });
  };
  
  const handleDeleteStat = (index: number) => {
    // Mock implementation
    toast({
      title: "Stat deleted",
      description: "The stat has been successfully deleted."
    });
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">About Page Settings</h1>
        
        {/* General Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage the main settings for the about page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={editableSettings?.title || ""} 
                  onChange={handleChange} 
                  disabled={!isEditing} 
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input 
                  type="text" 
                  id="subtitle" 
                  name="subtitle" 
                  value={editableSettings?.subtitle || ""} 
                  onChange={handleChange} 
                  disabled={!isEditing} 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={editableSettings?.description || ""} 
                onChange={handleChange} 
                className="resize-none" 
                disabled={!isEditing} 
              />
            </div>
            <div className="flex justify-end">
              {isEditing ? (
                <div className="space-x-2">
                  <Button variant="ghost" onClick={handleToggleEdit}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <Button onClick={handleToggleEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Mission Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mission Section</CardTitle>
            <CardDescription>Manage the mission statement for the about page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="missionTitle">Mission Title</Label>
              <Input 
                type="text" 
                id="missionTitle" 
                name="missionTitle" 
                value={editableSettings?.missionTitle || ""} 
                onChange={handleChange} 
                disabled={!isEditingMission} 
              />
            </div>
            <div>
              <Label htmlFor="missionDescription">Mission Description</Label>
              <Textarea 
                id="missionDescription" 
                name="missionDescription" 
                value={editableSettings?.missionDescription || ""} 
                onChange={handleChange} 
                className="resize-none" 
                disabled={!isEditingMission} 
              />
            </div>
            <div className="flex justify-end">
              {isEditingMission ? (
                <div className="space-x-2">
                  <Button variant="ghost" onClick={handleToggleEditMission}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <Button onClick={handleToggleEditMission}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Vision Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vision Section</CardTitle>
            <CardDescription>Manage the vision statement for the about page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="visionTitle">Vision Title</Label>
              <Input 
                type="text" 
                id="visionTitle" 
                name="visionTitle" 
                value={editableSettings?.visionTitle || ""} 
                onChange={handleChange} 
                disabled={!isEditingVision} 
              />
            </div>
            <div>
              <Label htmlFor="visionDescription">Vision Description</Label>
              <Textarea 
                id="visionDescription" 
                name="visionDescription" 
                value={editableSettings?.visionDescription || ""} 
                onChange={handleChange} 
                className="resize-none" 
                disabled={!isEditingVision} 
              />
            </div>
            <div className="flex justify-end">
              {isEditingVision ? (
                <div className="space-x-2">
                  <Button variant="ghost" onClick={handleToggleEditVision}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <Button onClick={handleToggleEditVision}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Key Points Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Points Section</CardTitle>
            <CardDescription>Manage the key points for the about page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Key Points</h3>
              <Button onClick={handleAddKeyPoint}>
                <Plus className="w-4 h-4 mr-2" />
                Add Key Point
              </Button>
            </div>
            {/* Mock Key Points List */}
            <ul className="space-y-2">
              {[1, 2, 3].map((index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>Key Point {index}</span>
                  <div className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditKeyPoint(index)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteKeyPoint(index)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Stats Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stats Section</CardTitle>
            <CardDescription>Manage the statistics for the about page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Stats</h3>
              <Button onClick={handleAddStat}>
                <Plus className="w-4 h-4 mr-2" />
                Add Stat
              </Button>
            </div>
            {/* Mock Stats List */}
            <ul className="space-y-2">
              {[1, 2, 3].map((index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>Stat {index}</span>
                  <div className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditStat(index)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStat(index)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAboutSettings;
