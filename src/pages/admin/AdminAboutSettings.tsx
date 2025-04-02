
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { storageService } from "@/lib/storage";
import { AboutSettings, KeyPoint, StatItem } from "@/lib/types";
import AdminLayout from "@/components/admin/AdminLayout";

// Form schemas for validation
const aboutGeneralSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  missionTitle: z.string().min(1, "Mission title is required"),
  missionDescription: z.string().min(10, "Mission description must be at least 10 characters"),
  visionTitle: z.string().min(1, "Vision title is required"),
  visionDescription: z.string().min(10, "Vision description must be at least 10 characters"),
  learnMoreText: z.string().optional(),
  learnMoreUrl: z.string().optional(),
});

const keyPointSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  icon: z.string().min(1, "Icon name is required"),
});

const statsGeneralSchema = z.object({
  showStats: z.boolean(),
  statsTitle: z.string().min(1, "Stats title is required"),
  statsSubtitle: z.string().min(1, "Stats subtitle is required"),
});

const statItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
  start: z.string().optional(),
  suffix: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
});

const teamSectionSchema = z.object({
  teamSectionTitle: z.string().min(1, "Team section title is required"),
  teamSectionSubtitle: z.string().min(1, "Team section subtitle is required"),
});

const AdminAboutSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isAddingKeyPoint, setIsAddingKeyPoint] = useState(false);
  const [isEditingKeyPoint, setIsEditingKeyPoint] = useState<KeyPoint | null>(null);
  const [isAddingStatItem, setIsAddingStatItem] = useState(false);
  const [isEditingStatItem, setIsEditingStatItem] = useState<StatItem | null>(null);
  
  useEffect(() => {
    // Fetch about settings from storage/API
    const storedSettings = storageService.getAboutSettings();
    setSettings(storedSettings);
  }, []);
  
  // Form hooks
  const generalForm = useForm<z.infer<typeof aboutGeneralSchema>>({
    resolver: zodResolver(aboutGeneralSchema),
    defaultValues: {
      title: settings?.title || "",
      subtitle: settings?.subtitle || "",
      description: settings?.description || "",
      missionTitle: settings?.missionTitle || "",
      missionDescription: settings?.missionDescription || "",
      visionTitle: settings?.visionTitle || "",
      visionDescription: settings?.visionDescription || "",
      learnMoreText: settings?.learnMoreText || "",
      learnMoreUrl: settings?.learnMoreUrl || "",
    },
  });
  
  const keyPointForm = useForm<z.infer<typeof keyPointSchema>>({
    resolver: zodResolver(keyPointSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
    },
  });
  
  const statsGeneralForm = useForm<z.infer<typeof statsGeneralSchema>>({
    resolver: zodResolver(statsGeneralSchema),
    defaultValues: {
      showStats: settings?.showStats || false,
      statsTitle: settings?.statsTitle || "",
      statsSubtitle: settings?.statsSubtitle || "",
    },
  });
  
  const statItemForm = useForm<z.infer<typeof statItemSchema>>({
    resolver: zodResolver(statItemSchema),
    defaultValues: {
      label: "",
      value: "",
      icon: "",
      description: "",
      start: "",
      suffix: "",
      color: "",
      isActive: true,
    },
  });
  
  const teamSectionForm = useForm<z.infer<typeof teamSectionSchema>>({
    resolver: zodResolver(teamSectionSchema),
    defaultValues: {
      teamSectionTitle: settings?.teamSectionTitle || "",
      teamSectionSubtitle: settings?.teamSectionSubtitle || "",
    },
  });
  
  useEffect(() => {
    if (settings) {
      generalForm.reset({
        title: settings.title,
        subtitle: settings.subtitle,
        description: settings.description,
        missionTitle: settings.missionTitle,
        missionDescription: settings.missionDescription,
        visionTitle: settings.visionTitle,
        visionDescription: settings.visionDescription,
        learnMoreText: settings.learnMoreText || "",
        learnMoreUrl: settings.learnMoreUrl || "",
      });
      
      statsGeneralForm.reset({
        showStats: settings.showStats,
        statsTitle: settings.statsTitle,
        statsSubtitle: settings.statsSubtitle,
      });
      
      teamSectionForm.reset({
        teamSectionTitle: settings.teamSectionTitle,
        teamSectionSubtitle: settings.teamSectionSubtitle,
      });
    }
  }, [settings, generalForm, statsGeneralForm, teamSectionForm]);
  
  // Handlers for key points
  const handleAddKeyPoint = (data: z.infer<typeof keyPointSchema>) => {
    if (!settings) return;
    
    const newKeyPoint: KeyPoint = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      icon: data.icon,
      order: settings.keyPoints.length,
    };
    
    try {
      storageService.addKeyPoint(newKeyPoint);
      
      setSettings({
        ...settings,
        keyPoints: [...settings.keyPoints, newKeyPoint],
      });
      
      keyPointForm.reset();
      setIsAddingKeyPoint(false);
      
      toast({
        title: "Key point added",
        description: "The key point has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding key point:", error);
      toast({
        title: "Error",
        description: "There was an error adding the key point.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateKeyPoint = (data: z.infer<typeof keyPointSchema>) => {
    if (!settings || !isEditingKeyPoint) return;
    
    const updatedKeyPoint = {
      ...isEditingKeyPoint,
      title: data.title,
      description: data.description,
      icon: data.icon,
    };
    
    try {
      storageService.updateKeyPoint(updatedKeyPoint);
      
      setSettings({
        ...settings,
        keyPoints: settings.keyPoints.map(kp => 
          kp.id === updatedKeyPoint.id ? updatedKeyPoint : kp
        ),
      });
      
      keyPointForm.reset();
      setIsEditingKeyPoint(null);
      
      toast({
        title: "Key point updated",
        description: "The key point has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating key point:", error);
      toast({
        title: "Error",
        description: "There was an error updating the key point.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteKeyPoint = (id: number) => {
    if (!settings) return;
    
    try {
      storageService.deleteKeyPoint(id);
      
      setSettings({
        ...settings,
        keyPoints: settings.keyPoints.filter(kp => kp.id !== id),
      });
      
      toast({
        title: "Key point deleted",
        description: "The key point has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting key point:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the key point.",
        variant: "destructive",
      });
    }
  };
  
  // Handler for key point reordering
  const handleKeyPointDragEnd = (result: any) => {
    if (!result.destination || !settings) return;
    
    const items = Array.from(settings.keyPoints);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));
    
    try {
      storageService.reorderKeyPoints(updatedItems);
      
      setSettings({
        ...settings,
        keyPoints: updatedItems,
      });
    } catch (error) {
      console.error("Error reordering key points:", error);
      toast({
        title: "Error",
        description: "There was an error reordering the key points.",
        variant: "destructive",
      });
    }
  };
  
  // Handlers for stat items
  const handleAddStatItem = (data: z.infer<typeof statItemSchema>) => {
    if (!settings) return;
    
    const newStatItem: StatItem = {
      id: Date.now(),
      label: data.label,
      value: data.value,
      icon: data.icon || undefined,
      order: settings.stats.length,
      description: data.description,
      start: data.start,
      suffix: data.suffix,
      color: data.color,
      isActive: data.isActive || true,
    };
    
    try {
      storageService.addStatItem(newStatItem);
      
      setSettings({
        ...settings,
        stats: [...settings.stats, newStatItem],
      });
      
      statItemForm.reset();
      setIsAddingStatItem(false);
      
      toast({
        title: "Stat item added",
        description: "The statistic has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding stat item:", error);
      toast({
        title: "Error",
        description: "There was an error adding the statistic.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateStatItem = (data: z.infer<typeof statItemSchema>) => {
    if (!settings || !isEditingStatItem) return;
    
    const updatedStatItem = {
      ...isEditingStatItem,
      label: data.label,
      value: data.value,
      icon: data.icon || undefined,
      description: data.description,
      start: data.start,
      suffix: data.suffix,
      color: data.color,
      isActive: data.isActive,
    };
    
    try {
      storageService.updateStatItem(updatedStatItem);
      
      setSettings({
        ...settings,
        stats: settings.stats.map(item => 
          item.id === updatedStatItem.id ? updatedStatItem : item
        ),
      });
      
      statItemForm.reset();
      setIsEditingStatItem(null);
      
      toast({
        title: "Stat item updated",
        description: "The statistic has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating stat item:", error);
      toast({
        title: "Error",
        description: "There was an error updating the statistic.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteStatItem = (id: number) => {
    if (!settings) return;
    
    try {
      storageService.deleteStatItem(id);
      
      setSettings({
        ...settings,
        stats: settings.stats.filter(item => item.id !== id),
      });
      
      toast({
        title: "Stat item deleted",
        description: "The statistic has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting stat item:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the statistic.",
        variant: "destructive",
      });
    }
  };
  
  // Handler for stat item reordering
  const handleStatItemDragEnd = (result: any) => {
    if (!result.destination || !settings) return;
    
    const items = Array.from(settings.stats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));
    
    try {
      storageService.reorderStatItems(updatedItems);
      
      setSettings({
        ...settings,
        stats: updatedItems,
      });
    } catch (error) {
      console.error("Error reordering stat items:", error);
      toast({
        title: "Error",
        description: "There was an error reordering the statistics.",
        variant: "destructive",
      });
    }
  };
  
  // Handler for updating general settings
  const handleUpdateGeneralSettings = (data: z.infer<typeof aboutGeneralSchema>) => {
    if (!settings) return;
    
    try {
      const updatedSettings = {
        ...settings,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        missionTitle: data.missionTitle,
        missionDescription: data.missionDescription,
        visionTitle: data.visionTitle,
        visionDescription: data.visionDescription,
        learnMoreText: data.learnMoreText,
        learnMoreUrl: data.learnMoreUrl,
        lastUpdated: new Date().toISOString(),
      };
      
      storageService.updateAboutSettings(updatedSettings);
      setSettings(updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating general settings:", error);
      toast({
        title: "Error",
        description: "There was an error saving the general settings.",
        variant: "destructive",
      });
    }
  };
  
  // Handler for updating stats general settings
  const handleUpdateStatsSettings = (data: z.infer<typeof statsGeneralSchema>) => {
    if (!settings) return;
    
    try {
      const updatedSettings = {
        ...settings,
        showStats: data.showStats,
        statsTitle: data.statsTitle,
        statsSubtitle: data.statsSubtitle,
        lastUpdated: new Date().toISOString(),
      };
      
      storageService.updateAboutSettings(updatedSettings);
      setSettings(updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "Statistics settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating stats settings:", error);
      toast({
        title: "Error",
        description: "There was an error saving the statistics settings.",
        variant: "destructive",
      });
    }
  };
  
  // Handler for updating team section settings
  const handleUpdateTeamSettings = (data: z.infer<typeof teamSectionSchema>) => {
    if (!settings) return;
    
    try {
      const updatedSettings = {
        ...settings,
        teamSectionTitle: data.teamSectionTitle,
        teamSectionSubtitle: data.teamSectionSubtitle,
        lastUpdated: new Date().toISOString(),
      };
      
      storageService.updateAboutSettings(updatedSettings);
      setSettings(updatedSettings);
      
      toast({
        title: "Settings saved",
        description: "Team section settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating team section settings:", error);
      toast({
        title: "Error",
        description: "There was an error saving the team section settings.",
        variant: "destructive",
      });
    }
  };
  
  if (!settings) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6">About Page Settings</h1>
          <p>Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">About Page Settings</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="keypoints">Key Points</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="team">Team Section</TabsTrigger>
          </TabsList>
          
          {/* General Tab Content */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure the main sections of your About page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={generalForm.handleSubmit(handleUpdateGeneralSettings)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Hero Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          {...generalForm.register("title")} 
                          placeholder="About Our Company"
                        />
                        {generalForm.formState.errors.title && (
                          <p className="text-sm text-red-500">{generalForm.formState.errors.title.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input 
                          id="subtitle" 
                          {...generalForm.register("subtitle")} 
                          placeholder="Our Story"
                        />
                        {generalForm.formState.errors.subtitle && (
                          <p className="text-sm text-red-500">{generalForm.formState.errors.subtitle.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        {...generalForm.register("description")} 
                        placeholder="A brief description of your company..."
                        rows={4}
                      />
                      {generalForm.formState.errors.description && (
                        <p className="text-sm text-red-500">{generalForm.formState.errors.description.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="learnMoreText">Learn More Button Text</Label>
                        <Input 
                          id="learnMoreText" 
                          {...generalForm.register("learnMoreText")} 
                          placeholder="Learn More"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="learnMoreUrl">Learn More Button URL</Label>
                        <Input 
                          id="learnMoreUrl" 
                          {...generalForm.register("learnMoreUrl")} 
                          placeholder="/contact"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Mission & Vision</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="missionTitle">Mission Title</Label>
                        <Input 
                          id="missionTitle" 
                          {...generalForm.register("missionTitle")} 
                          placeholder="Our Mission"
                        />
                        {generalForm.formState.errors.missionTitle && (
                          <p className="text-sm text-red-500">{generalForm.formState.errors.missionTitle.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visionTitle">Vision Title</Label>
                        <Input 
                          id="visionTitle" 
                          {...generalForm.register("visionTitle")} 
                          placeholder="Our Vision"
                        />
                        {generalForm.formState.errors.visionTitle && (
                          <p className="text-sm text-red-500">{generalForm.formState.errors.visionTitle.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="missionDescription">Mission Description</Label>
                        <Textarea 
                          id="missionDescription" 
                          {...generalForm.register("missionDescription")} 
                          placeholder="Our mission is to..."
                          rows={4}
                        />
                        {generalForm.formState.errors.missionDescription && (
                          <p className="text-sm text-red-500">{generalForm.formState.errors.missionDescription.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visionDescription">Vision Description</Label>
                        <Textarea 
                          id="visionDescription" 
                          {...generalForm.register("visionDescription")} 
                          placeholder="Our vision is to..."
                          rows={4}
                        />
                        {generalForm.formState.errors.visionDescription && (
                          <p className="text-sm text-red-500">{generalForm.formState.errors.visionDescription.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit">Save General Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Key Points Tab Content */}
          <TabsContent value="keypoints" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Key Points</CardTitle>
                  <CardDescription>
                    Highlight your company's key strengths or values.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingKeyPoint(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Key Point
                </Button>
              </CardHeader>
              <CardContent>
                {settings.keyPoints.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">
                    No key points added yet. Click 'Add Key Point' to get started.
                  </p>
                ) : (
                  <DragDropContext onDragEnd={handleKeyPointDragEnd}>
                    <Droppable droppableId="keyPoints">
                      {(provided) => (
                        <div
                          className="space-y-2"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {settings.keyPoints
                            .sort((a, b) => a.order - b.order)
                            .map((keyPoint, index) => (
                              <Draggable
                                key={keyPoint.id.toString()}
                                draggableId={keyPoint.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center justify-between p-4 border rounded-md bg-card"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="cursor-grab"
                                      >
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{keyPoint.title}</h4>
                                        <p className="text-sm text-muted-foreground max-w-md truncate">
                                          {keyPoint.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setIsEditingKeyPoint(keyPoint);
                                          keyPointForm.reset({
                                            title: keyPoint.title,
                                            description: keyPoint.description,
                                            icon: keyPoint.icon,
                                          });
                                        }}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteKeyPoint(keyPoint.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Statistics Tab Content */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics Settings</CardTitle>
                <CardDescription>
                  Configure the statistics section of your About page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={statsGeneralForm.handleSubmit(handleUpdateStatsSettings)} className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="showStats">Show Statistics Section</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable the statistics section on your About page.
                      </p>
                    </div>
                    <Switch
                      id="showStats"
                      checked={statsGeneralForm.watch("showStats")}
                      onCheckedChange={(checked) => 
                        statsGeneralForm.setValue("showStats", checked)
                      }
                    />
                  </div>
                  
                  {statsGeneralForm.watch("showStats") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="statsTitle">Section Title</Label>
                        <Input
                          id="statsTitle"
                          {...statsGeneralForm.register("statsTitle")}
                          placeholder="Our Progress in Numbers"
                        />
                        {statsGeneralForm.formState.errors.statsTitle && (
                          <p className="text-sm text-red-500">{statsGeneralForm.formState.errors.statsTitle.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statsSubtitle">Section Subtitle</Label>
                        <Input
                          id="statsSubtitle"
                          {...statsGeneralForm.register("statsSubtitle")}
                          placeholder="Key metrics that showcase our success"
                        />
                        {statsGeneralForm.formState.errors.statsSubtitle && (
                          <p className="text-sm text-red-500">{statsGeneralForm.formState.errors.statsSubtitle.message}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <Button type="submit">Save Statistics Settings</Button>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingStatItem(true)}
                  disabled={!statsGeneralForm.watch("showStats")}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Statistic
                </Button>
              </CardFooter>
            </Card>
            
            {statsGeneralForm.watch("showStats") && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics Items</CardTitle>
                  <CardDescription>
                    Manage your statistical data points.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {settings.stats.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">
                      No statistics added yet. Click 'Add Statistic' to get started.
                    </p>
                  ) : (
                    <DragDropContext onDragEnd={handleStatItemDragEnd}>
                      <Droppable droppableId="stats">
                        {(provided) => (
                          <div
                            className="space-y-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {settings.stats
                              .sort((a, b) => a.order - b.order)
                              .map((stat, index) => (
                                <Draggable
                                  key={stat.id.toString()}
                                  draggableId={stat.id.toString()}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center justify-between p-4 border rounded-md bg-card"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab"
                                        >
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{stat.label}</h4>
                                            <span className="font-bold">{stat.value}</span>
                                            {stat.isActive === false && (
                                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Inactive</span>
                                            )}
                                          </div>
                                          {stat.description && (
                                            <p className="text-sm text-muted-foreground max-w-md truncate">
                                              {stat.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            setIsEditingStatItem(stat);
                                            statItemForm.reset({
                                              label: stat.label,
                                              value: stat.value,
                                              icon: stat.icon || "",
                                              description: stat.description || "",
                                              start: stat.start || "",
                                              suffix: stat.suffix || "",
                                              color: stat.color || "",
                                              isActive: stat.isActive,
                                            });
                                          }}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteStatItem(stat.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Team Section Tab Content */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Section Settings</CardTitle>
                <CardDescription>
                  Configure the team members section of your About page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={teamSectionForm.handleSubmit(handleUpdateTeamSettings)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamSectionTitle">Section Title</Label>
                    <Input
                      id="teamSectionTitle"
                      {...teamSectionForm.register("teamSectionTitle")}
                      placeholder="Meet Our Team"
                    />
                    {teamSectionForm.formState.errors.teamSectionTitle && (
                      <p className="text-sm text-red-500">{teamSectionForm.formState.errors.teamSectionTitle.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamSectionSubtitle">Section Subtitle</Label>
                    <Input
                      id="teamSectionSubtitle"
                      {...teamSectionForm.register("teamSectionSubtitle")}
                      placeholder="The talented individuals behind our success"
                    />
                    {teamSectionForm.formState.errors.teamSectionSubtitle && (
                      <p className="text-sm text-red-500">{teamSectionForm.formState.errors.teamSectionSubtitle.message}</p>
                    )}
                  </div>
                  <Button type="submit">Save Team Section Settings</Button>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Note: Team members are managed in the Content section under 'Team Member' content type.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add Key Point Dialog */}
        <Dialog open={isAddingKeyPoint} onOpenChange={setIsAddingKeyPoint}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Key Point</DialogTitle>
            </DialogHeader>
            <form onSubmit={keyPointForm.handleSubmit(handleAddKeyPoint)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...keyPointForm.register("title")} placeholder="Innovation" />
                {keyPointForm.formState.errors.title && (
                  <p className="text-sm text-red-500">{keyPointForm.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  {...keyPointForm.register("description")} 
                  placeholder="We are constantly innovating..." 
                  rows={3}
                />
                {keyPointForm.formState.errors.description && (
                  <p className="text-sm text-red-500">{keyPointForm.formState.errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input id="icon" {...keyPointForm.register("icon")} placeholder="Lightbulb" />
                <p className="text-xs text-muted-foreground">
                  Enter the name of a Lucide icon (e.g., Lightbulb, Shield, Star)
                </p>
                {keyPointForm.formState.errors.icon && (
                  <p className="text-sm text-red-500">{keyPointForm.formState.errors.icon.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingKeyPoint(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Key Point</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Key Point Dialog */}
        <Dialog open={!!isEditingKeyPoint} onOpenChange={(open) => !open && setIsEditingKeyPoint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Key Point</DialogTitle>
            </DialogHeader>
            <form onSubmit={keyPointForm.handleSubmit(handleUpdateKeyPoint)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" {...keyPointForm.register("title")} />
                {keyPointForm.formState.errors.title && (
                  <p className="text-sm text-red-500">{keyPointForm.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  {...keyPointForm.register("description")} 
                  rows={3}
                />
                {keyPointForm.formState.errors.description && (
                  <p className="text-sm text-red-500">{keyPointForm.formState.errors.description.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon Name</Label>
                <Input id="edit-icon" {...keyPointForm.register("icon")} />
                <p className="text-xs text-muted-foreground">
                  Enter the name of a Lucide icon (e.g., Lightbulb, Shield, Star)
                </p>
                {keyPointForm.formState.errors.icon && (
                  <p className="text-sm text-red-500">{keyPointForm.formState.errors.icon.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingKeyPoint(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update Key Point</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Add Stat Item Dialog */}
        <Dialog open={isAddingStatItem} onOpenChange={setIsAddingStatItem}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Statistic</DialogTitle>
            </DialogHeader>
            <form onSubmit={statItemForm.handleSubmit(handleAddStatItem)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input id="label" {...statItemForm.register("label")} placeholder="Clients" />
                  {statItemForm.formState.errors.label && (
                    <p className="text-sm text-red-500">{statItemForm.formState.errors.label.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input id="value" {...statItemForm.register("value")} placeholder="500+" />
                  {statItemForm.formState.errors.value && (
                    <p className="text-sm text-red-500">{statItemForm.formState.errors.value.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  {...statItemForm.register("description")} 
                  placeholder="Satisfied clients worldwide" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Value (Optional)</Label>
                  <Input id="start" {...statItemForm.register("start")} placeholder="0" />
                  <p className="text-xs text-muted-foreground">
                    Starting value for animation (if applicable)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suffix">Suffix (Optional)</Label>
                  <Input id="suffix" {...statItemForm.register("suffix")} placeholder="+" />
                  <p className="text-xs text-muted-foreground">
                    Character(s) to appear after the value (e.g., +, %)
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name (Optional)</Label>
                <Input id="icon" {...statItemForm.register("icon")} placeholder="Users" />
                <p className="text-xs text-muted-foreground">
                  Enter the name of a Lucide icon (e.g., Users, Award, Clock)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color (Optional)</Label>
                <Input id="color" {...statItemForm.register("color")} placeholder="#4F46E5" />
                <p className="text-xs text-muted-foreground">
                  Color code or Tailwind color class (e.g., #4F46E5, text-blue-500)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={statItemForm.watch("isActive")}
                  onCheckedChange={(checked) => statItemForm.setValue("isActive", checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddingStatItem(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Statistic</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Stat Item Dialog */}
        <Dialog open={!!isEditingStatItem} onOpenChange={(open) => !open && setIsEditingStatItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Statistic</DialogTitle>
            </DialogHeader>
            <form onSubmit={statItemForm.handleSubmit(handleUpdateStatItem)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-label">Label</Label>
                  <Input id="edit-label" {...statItemForm.register("label")} />
                  {statItemForm.formState.errors.label && (
                    <p className="text-sm text-red-500">{statItemForm.formState.errors.label.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-value">Value</Label>
                  <Input id="edit-value" {...statItemForm.register("value")} />
                  {statItemForm.formState.errors.value && (
                    <p className="text-sm text-red-500">{statItemForm.formState.errors.value.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input id="edit-description" {...statItemForm.register("description")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start">Start Value (Optional)</Label>
                  <Input id="edit-start" {...statItemForm.register("start")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-suffix">Suffix (Optional)</Label>
                  <Input id="edit-suffix" {...statItemForm.register("suffix")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon Name (Optional)</Label>
                <Input id="edit-icon" {...statItemForm.register("icon")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color (Optional)</Label>
                <Input id="edit-color" {...statItemForm.register("color")} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={statItemForm.watch("isActive")}
                  onCheckedChange={(checked) => statItemForm.setValue("isActive", checked)}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingStatItem(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update Statistic</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAboutSettings;
