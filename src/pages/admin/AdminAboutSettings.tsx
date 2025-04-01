
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash, MoveUp, MoveDown } from "lucide-react";
import { storageService } from "@/lib/storage";
import { AboutSettings, KeyPoint, StatItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const AdminAboutSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings>(storageService.getAboutSettings());
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSettings = () => {
    storageService.updateAboutSettings(settings);
    toast({
      title: "Settings Updated",
      description: "About section settings have been updated successfully."
    });
  };
  
  // Key Points Management
  const handleAddKeyPoint = () => {
    const newKeyPoint = {
      text: "New key point",
      order: settings.keyPoints.length + 1
    };
    
    const addedPoint = storageService.addKeyPoint(newKeyPoint);
    setSettings((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, addedPoint]
    }));
  };
  
  const handleKeyPointChange = (id: number, text: string) => {
    storageService.updateKeyPoint(id, { text });
    setSettings((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.map((point) => 
        point.id === id ? { ...point, text } : point
      )
    }));
  };
  
  const handleDeleteKeyPoint = (id: number) => {
    if (storageService.deleteKeyPoint(id)) {
      setSettings((prev) => ({
        ...prev,
        keyPoints: prev.keyPoints.filter((point) => point.id !== id)
      }));
    }
  };
  
  const handleReorderKeyPoint = (id: number, direction: 'up' | 'down') => {
    const keyPoints = [...settings.keyPoints];
    const index = keyPoints.findIndex((point) => point.id === id);
    
    if (direction === 'up' && index > 0) {
      // Swap with previous item
      const temp = keyPoints[index].order;
      keyPoints[index].order = keyPoints[index - 1].order;
      keyPoints[index - 1].order = temp;
    } else if (direction === 'down' && index < keyPoints.length - 1) {
      // Swap with next item
      const temp = keyPoints[index].order;
      keyPoints[index].order = keyPoints[index + 1].order;
      keyPoints[index + 1].order = temp;
    } else {
      return; // No change needed
    }
    
    storageService.reorderKeyPoints(
      keyPoints.map(point => ({ id: point.id, order: point.order }))
    );
    
    setSettings((prev) => ({
      ...prev,
      keyPoints: keyPoints.sort((a, b) => a.order - b.order)
    }));
  };
  
  // Stats Management
  const handleAddStat = () => {
    const newStat = {
      value: "0+",
      label: "New Statistic",
      start: "0",
      order: settings.stats.length + 1
    };
    
    const addedStat = storageService.addStatItem(newStat);
    setSettings((prev) => ({
      ...prev,
      stats: [...prev.stats, addedStat]
    }));
  };
  
  const handleStatChange = (id: number, field: keyof StatItem, value: string) => {
    storageService.updateStatItem(id, { [field]: value } as Partial<StatItem>);
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) => 
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    }));
  };
  
  const handleDeleteStat = (id: number) => {
    if (storageService.deleteStatItem(id)) {
      setSettings((prev) => ({
        ...prev,
        stats: prev.stats.filter((stat) => stat.id !== id)
      }));
    }
  };
  
  const handleReorderStat = (id: number, direction: 'up' | 'down') => {
    const stats = [...settings.stats];
    const index = stats.findIndex((stat) => stat.id === id);
    
    if (direction === 'up' && index > 0) {
      // Swap with previous item
      const temp = stats[index].order;
      stats[index].order = stats[index - 1].order;
      stats[index - 1].order = temp;
    } else if (direction === 'down' && index < stats.length - 1) {
      // Swap with next item
      const temp = stats[index].order;
      stats[index].order = stats[index + 1].order;
      stats[index + 1].order = temp;
    } else {
      return; // No change needed
    }
    
    storageService.reorderStatItems(
      stats.map(stat => ({ id: stat.id, order: stat.order }))
    );
    
    setSettings((prev) => ({
      ...prev,
      stats: stats.sort((a, b) => a.order - b.order)
    }));
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-bold">About Section Settings</h1>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </div>
        
        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the main content for the About section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={settings.title} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input 
                  id="subtitle" 
                  name="subtitle" 
                  value={settings.subtitle} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={3}
                  value={settings.description} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="missionTitle">Mission Title</Label>
                <Input 
                  id="missionTitle" 
                  name="missionTitle" 
                  value={settings.missionTitle} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="missionDescription">Mission Description</Label>
                <Textarea 
                  id="missionDescription" 
                  name="missionDescription" 
                  rows={3}
                  value={settings.missionDescription} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learnMoreText">Learn More Text</Label>
                <Input 
                  id="learnMoreText" 
                  name="learnMoreText" 
                  value={settings.learnMoreText} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learnMoreUrl">Learn More URL</Label>
                <Input 
                  id="learnMoreUrl" 
                  name="learnMoreUrl" 
                  value={settings.learnMoreUrl} 
                  onChange={handleGeneralSettingsChange} 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Key Points */}
          <Card>
            <CardHeader>
              <CardTitle>Key Points</CardTitle>
              <CardDescription>
                Manage the key points displayed in the About section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={handleAddKeyPoint} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Key Point
                </Button>
              </div>
              
              <div className="space-y-4">
                {settings.keyPoints.sort((a, b) => a.order - b.order).map((point) => (
                  <div key={point.id} className="flex items-center gap-2">
                    <Input 
                      value={point.text} 
                      onChange={(e) => handleKeyPointChange(point.id, e.target.value)}
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleReorderKeyPoint(point.id, 'up')}
                        className="h-8 w-8"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleReorderKeyPoint(point.id, 'down')}
                        className="h-8 w-8"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteKeyPoint(point.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Manage the statistics cards displayed in the About section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={handleAddStat} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Statistic
                </Button>
              </div>
              
              <div className="space-y-6">
                {settings.stats.sort((a, b) => a.order - b.order).map((stat) => (
                  <div key={stat.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Stat #{stat.id}</h3>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleReorderStat(stat.id, 'up')}
                          className="h-8 w-8"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleReorderStat(stat.id, 'down')}
                          className="h-8 w-8"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteStat(stat.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`stat-value-${stat.id}`}>Value</Label>
                        <Input 
                          id={`stat-value-${stat.id}`}
                          value={stat.value} 
                          onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`stat-label-${stat.id}`}>Label</Label>
                        <Input 
                          id={`stat-label-${stat.id}`}
                          value={stat.label} 
                          onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`stat-start-${stat.id}`}>Start Value (for animation)</Label>
                        <Input 
                          id={`stat-start-${stat.id}`}
                          value={stat.start} 
                          onChange={(e) => handleStatChange(stat.id, 'start', e.target.value)}
                        />
                      </div>
                    </div>
                    {stat.id !== settings.stats[settings.stats.length - 1].id && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAboutSettings;
