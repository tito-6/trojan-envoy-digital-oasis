import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AboutSettings, KeyPoint, StatItem } from "@/lib/types";
import { Plus, Trash, MoveUp, MoveDown, Link as LinkIcon, Image, FileText, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

const AdminAboutSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings>(storageService.getAboutSettings());
  const [activeTab, setActiveTab] = useState("general");
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video" | "document">("image");
  const [newKeyPointText, setNewKeyPointText] = useState("");
  const [addingKeyPoint, setAddingKeyPoint] = useState(false);

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

  const handleAddKeyPoint = () => {
    const newKeyPoint = {
      title: newKeyPointText,
      description: "Click to edit description",
      icon: "Lightbulb"
    };
    
    storageService.addKeyPoint(newKeyPoint);
    setNewKeyPointText("");
    fetchSettings();
    setAddingKeyPoint(false);
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
      const temp = keyPoints[index].order;
      keyPoints[index].order = keyPoints[index - 1].order;
      keyPoints[index - 1].order = temp;
    } else if (direction === 'down' && index < keyPoints.length - 1) {
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

  const handleAddStat = () => {
    const newStat = {
      value: "0+",
      label: "New Statistic",
      start: "0",
      order: settings.stats.length + 1,
      isActive: true,
      icon: "trophy",
      color: "#3498db",
      suffix: "+",
      description: "Short description"
    };
    
    const addedStat = storageService.addStatItem(newStat);
    setSettings((prev) => ({
      ...prev,
      stats: [...prev.stats, addedStat]
    }));
    
    toast({
      title: "Statistic Added",
      description: "A new statistic has been added to the About section."
    });
  };

  const handleStatChange = (id: number, field: keyof StatItem, value: any) => {
    storageService.updateStatItem(id, { [field]: value } as Partial<StatItem>);
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) => 
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const handleToggleStatActive = (id: number, isActive: boolean) => {
    handleStatChange(id, 'isActive', isActive);
  };

  const handleDeleteStat = (id: number) => {
    if (storageService.deleteStatItem(id)) {
      setSettings((prev) => ({
        ...prev,
        stats: prev.stats.filter((stat) => stat.id !== id)
      }));
      
      toast({
        title: "Statistic Removed",
        description: "The statistic has been removed from the About section."
      });
    }
  };

  const handleReorderStat = (id: number, direction: 'up' | 'down') => {
    const stats = [...settings.stats];
    const index = stats.findIndex((stat) => stat.id === id);
    
    if (direction === 'up' && index > 0) {
      const temp = stats[index].order;
      stats[index].order = stats[index - 1].order;
      stats[index - 1].order = temp;
    } else if (direction === 'down' && index < stats.length - 1) {
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

  const mediaOptions = [
    { label: "Images", icon: <Image className="h-4 w-4" />, type: "image" as const },
    { label: "Videos", icon: <Video className="h-4 w-4" />, type: "video" as const },
    { label: "Documents", icon: <FileText className="h-4 w-4" />, type: "document" as const }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-bold">About Section Settings</h1>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </div>
        
        <Tabs defaultValue="general" onValueChange={setActiveTab} value={activeTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="key-points">Key Points</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
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
                
                <div className="flex items-center space-x-2 mb-6">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="learnMoreUrl">Learn More URL</Label>
                    <div className="flex">
                      <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <Input 
                        id="learnMoreUrl" 
                        name="learnMoreUrl" 
                        value={settings.learnMoreUrl} 
                        onChange={handleGeneralSettingsChange}
                        className="rounded-l-none"
                        placeholder="/about or https://example.com"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For internal pages, start with a slash (e.g., "/about"). 
                      For external links, include the full URL (e.g., "https://example.com").
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="media-toggle">Enable Media Content</Label>
                    <Switch 
                      id="media-toggle" 
                      checked={showMediaOptions}
                      onCheckedChange={setShowMediaOptions}
                    />
                  </div>
                </div>
                
                {showMediaOptions && (
                  <div className="p-4 border rounded-md bg-muted/20 mt-4">
                    <h3 className="text-sm font-medium mb-2">Media Options</h3>
                    
                    <NavigationMenu className="mb-4">
                      <NavigationMenuList>
                        {mediaOptions.map((option) => (
                          <NavigationMenuItem key={option.type}>
                            <Button 
                              variant={mediaType === option.type ? "default" : "outline"}
                              size="sm"
                              className="mr-2"
                              onClick={() => setMediaType(option.type)}
                            >
                              {option.icon}
                              <span className="ml-2">{option.label}</span>
                            </Button>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>
                    
                    <div className="space-y-4">
                      {mediaType === "image" && (
                        <div>
                          <Label htmlFor="image-upload">Upload Images</Label>
                          <div className="mt-2">
                            <Input id="image-upload" type="file" accept="image/*" multiple />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            You can upload multiple images to showcase in the about section.
                          </p>
                        </div>
                      )}
                      
                      {mediaType === "video" && (
                        <div>
                          <Label htmlFor="video-upload">Upload Video</Label>
                          <div className="mt-2">
                            <Input id="video-upload" type="file" accept="video/*" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload a video to showcase your company or team.
                          </p>
                          
                          <div className="mt-4">
                            <Label htmlFor="video-url">Or Enter Video URL</Label>
                            <Input id="video-url" placeholder="https://youtube.com/..." />
                            <p className="text-xs text-muted-foreground mt-1">
                              You can also embed a YouTube or Vimeo video by pasting the URL.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {mediaType === "document" && (
                        <div>
                          <Label htmlFor="document-upload">Upload Documents</Label>
                          <div className="mt-2">
                            <Input id="document-upload" type="file" accept=".pdf,.doc,.docx" multiple />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload brochures, case studies, or other documents related to your company.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="key-points" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Points</CardTitle>
                <CardDescription>
                  Manage the key points displayed in the About section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button onClick={() => setAddingKeyPoint(true)} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Key Point
                  </Button>
                </div>
                
                <Dialog open={addingKeyPoint} onOpenChange={setAddingKeyPoint}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Key Point</DialogTitle>
                      <DialogDescription>
                        Enter the title and description for the key point.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="key-point-title">Title</Label>
                        <Input 
                          id="key-point-title" 
                          name="key-point-title" 
                          value={newKeyPointText} 
                          onChange={(e) => setNewKeyPointText(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="key-point-description">Description</Label>
                        <Textarea 
                          id="key-point-description" 
                          name="key-point-description" 
                          rows={3}
                          value="Click to edit description"
                        />
                      </div>
                    </DialogContent>
                    <DialogFooter>
                      <Button onClick={() => setAddingKeyPoint(false)}>Cancel</Button>
                      <Button onClick={handleAddKeyPoint} variant="default">Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
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
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>
                      Manage the statistics cards displayed in the About section
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddStat} variant="default" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Statistic
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {settings.stats.sort((a, b) => a.order - b.order).map((stat) => (
                    <Card key={stat.id} className="border-dashed">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Stat #{stat.id}</h3>
                          <div className="flex items-center gap-1">
                            <div className="flex items-center space-x-2 mr-2">
                              <Switch 
                                id={`active-toggle-${stat.id}`} 
                                checked={stat.isActive !== false}
                                onCheckedChange={(checked) => handleToggleStatActive(stat.id, checked)}
                              />
                              <Label htmlFor={`active-toggle-${stat.id}`} className="text-xs">
                                {stat.isActive !== false ? "Active" : "Inactive"}
                              </Label>
                            </div>
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
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div className="space-y-2">
                            <Label htmlFor={`stat-suffix-${stat.id}`}>Suffix (e.g., "+", "%")</Label>
                            <Input 
                              id={`stat-suffix-${stat.id}`}
                              value={stat.suffix || ""}
                              onChange={(e) => handleStatChange(stat.id, 'suffix', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor={`stat-description-${stat.id}`}>Description (optional)</Label>
                            <Textarea 
                              id={`stat-description-${stat.id}`}
                              value={stat.description || ""}
                              onChange={(e) => handleStatChange(stat.id, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`stat-icon-${stat.id}`}>Color</Label>
                            <input 
                              type="color" 
                              id={`stat-color-${stat.id}`}
                              value={stat.color || "#3498db"}
                              onChange={(e) => handleStatChange(stat.id, 'color', e.target.value)}
                              className="w-8 h-8 p-0 border rounded"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              {settings.stats.length === 0 && (
                <CardFooter className="flex justify-center py-6 border-t">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">No statistics added yet</p>
                    <Button onClick={handleAddStat} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Statistic
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAboutSettings;
