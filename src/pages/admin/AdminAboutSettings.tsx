import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Pencil, Plus, Save, Trash, X } from 'lucide-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { storageService } from '@/lib/storage';
import { AboutSettings, KeyPoint, StatItem } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const aboutSettingsSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  missionTitle: z.string().optional(),
  missionDescription: z.string().optional(),
  visionTitle: z.string().optional(),
  visionDescription: z.string().optional(),
  showStats: z.boolean().default(false),
  statsTitle: z.string().optional(),
  statsSubtitle: z.string().optional(),
  teamSectionTitle: z.string().optional(),
  teamSectionSubtitle: z.string().optional(),
  learnMoreText: z.string().optional(),
  learnMoreUrl: z.string().optional(),
});

type AboutSettingsValues = z.infer<typeof aboutSettingsSchema>;

function AdminAboutSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AboutSettings>({
    id: 1,
    title: "About Us",
    subtitle: "Learn more about our company",
    description: "We are a team of passionate individuals",
    missionTitle: "Our Mission",
    missionDescription: "To provide the best service",
    visionTitle: "Our Vision",
    visionDescription: "To be the best in the world",
    keyPoints: [],
    showStats: false,
    statsTitle: "Our Stats",
    statsSubtitle: "We have achieved a lot",
    stats: [],
    teamSectionTitle: "Our Team",
    teamSectionSubtitle: "Meet our team",
    learnMoreText: "Learn More",
    learnMoreUrl: "/about",
    lastUpdated: new Date().toISOString()
  });
  const [newKeyPointText, setNewKeyPointText] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatValue, setNewStatValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AboutSettingsValues>({
    resolver: zodResolver(aboutSettingsSchema),
    defaultValues: {
      title: settings.title,
      subtitle: settings.subtitle || "",
      description: settings.description || "",
      missionTitle: settings.missionTitle || "",
      missionDescription: settings.missionDescription || "",
      visionTitle: settings.visionTitle || "",
      visionDescription: settings.visionDescription || "",
      showStats: settings.showStats,
      statsTitle: settings.statsTitle || "",
      statsSubtitle: settings.statsSubtitle || "",
      teamSectionTitle: settings.teamSectionTitle || "",
      teamSectionSubtitle: settings.teamSectionSubtitle || "",
      learnMoreText: settings.learnMoreText || "",
      learnMoreUrl: settings.learnMoreUrl || "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    const storedSettings = storageService.getAboutSettings();
    if (storedSettings) {
      setSettings(storedSettings);
      form.reset(storedSettings);
    }
  };

  const handleFormSubmit = async (values: AboutSettingsValues) => {
    setIsSaving(true);
    try {
      const updatedSettings: AboutSettings = {
        ...settings,
        ...values,
        lastUpdated: new Date().toISOString()
      };
      storageService.saveAboutSettings(updatedSettings);
      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "About settings updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update about settings"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddKeyPoint = () => {
    if (!newKeyPointText) {
      toast({
        title: "Error",
        description: "Please enter key point text"
      });
      return;
    }

    try {
      const newKeyPoint = {
        id: Date.now(),
        title: newKeyPointText,
        description: "",
        icon: "Check",
        order: settings.keyPoints ? settings.keyPoints.length + 1 : 1
      };
      
      storageService.addKeyPoint(newKeyPoint);
      
      toast({
        title: "Success",
        description: "Key point added successfully"
      });
      
      setNewKeyPointText('');
      fetchSettings(); // Reload data from storage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add key point"
      });
    }
  };

  const handleRemoveKeyPoint = (keyPointId: number) => {
    try {
      storageService.deleteKeyPoint(keyPointId);
      toast({
        title: "Success",
        description: "Key point removed successfully"
      });
      fetchSettings(); // Reload data from storage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove key point"
      });
    }
  };

  const handleUpdateKeyPoint = (keyPoint: KeyPoint) => {
    try {
      storageService.updateKeyPoint(keyPoint);
      toast({
        title: "Success",
        description: "Key point updated successfully"
      });
      fetchSettings(); // Reload data from storage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update key point"
      });
    }
  };

  const handleAddStat = () => {
    if (!newStatLabel || !newStatValue) {
      toast({
        title: "Error",
        description: "Please enter both label and value for the stat"
      });
      return;
    }

    try {
      const newStat = {
        id: Date.now(),
        label: newStatLabel,
        value: newStatValue,
        icon: "Activity",
        order: settings.stats ? settings.stats.length + 1 : 1
      };
      
      storageService.addStatItem(newStat);
      
      toast({
        title: "Success",
        description: "Stat added successfully"
      });
      
      setNewStatLabel('');
      setNewStatValue('');
      fetchSettings(); // Reload data from storage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stat"
      });
    }
  };

  const handleRemoveStat = (statId: number) => {
    try {
      storageService.deleteStatItem(statId);
      toast({
        title: "Success",
        description: "Stat removed successfully"
      });
      fetchSettings(); // Reload data from storage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove stat"
      });
    }
  };

  const handleUpdateStat = (stat: StatItem) => {
    try {
      storageService.updateStatItem(stat);
      toast({
        title: "Success",
        description: "Stat updated successfully"
      });
      fetchSettings(); // Reload data from storage
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stat"
      });
    }
  };

  const onKeyPointDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(settings.keyPoints);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order of the key points
    const updatedKeyPoints = items.map((keyPoint, index) => ({
      ...keyPoint,
      order: index + 1
    }));

    // Save the updated key points to storage
    storageService.saveKeyPoints(updatedKeyPoints);

    // Update the state
    setSettings({
      ...settings,
      keyPoints: updatedKeyPoints
    });
  };

  const onStatDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(settings.stats);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order of the stats
    const updatedStats = items.map((stat, index) => ({
      ...stat,
      order: index + 1
    }));

    // Save the updated stats to storage
    storageService.saveStats(updatedStats);

    // Update the state
    setSettings({
      ...settings,
      stats: updatedStats
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">About Settings</h1>
          <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Update general information about the about page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" type="text" placeholder="About Us" {...form.register("title")} />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" type="text" placeholder="Learn more about our company" {...form.register("subtitle")} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="We are a team of passionate individuals" className="resize-none" {...form.register("description")} />
              </div>
              <div>
                <Label htmlFor="missionTitle">Mission Title</Label>
                <Input id="missionTitle" type="text" placeholder="Our Mission" {...form.register("missionTitle")} />
              </div>
              <div>
                <Label htmlFor="missionDescription">Mission Description</Label>
                <Textarea id="missionDescription" placeholder="To provide the best service" className="resize-none" {...form.register("missionDescription")} />
              </div>
              <div>
                <Label htmlFor="visionTitle">Vision Title</Label>
                <Input id="visionTitle" type="text" placeholder="Our Vision" {...form.register("visionTitle")} />
              </div>
              <div>
                <Label htmlFor="visionDescription">Vision Description</Label>
                <Textarea id="visionDescription" placeholder="To be the best in the world" className="resize-none" {...form.register("visionDescription")} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="showStats" checked={form.getValues("showStats")} onCheckedChange={(checked) => form.setValue("showStats", checked)} />
                <Label htmlFor="showStats">Show Stats Section</Label>
              </div>
              <div>
                <Label htmlFor="statsTitle">Stats Title</Label>
                <Input id="statsTitle" type="text" placeholder="Our Stats" {...form.register("statsTitle")} />
              </div>
              <div>
                <Label htmlFor="statsSubtitle">Stats Subtitle</Label>
                <Input id="statsSubtitle" type="text" placeholder="We have achieved a lot" {...form.register("statsSubtitle")} />
              </div>
              <div>
                <Label htmlFor="teamSectionTitle">Team Section Title</Label>
                <Input id="teamSectionTitle" type="text" placeholder="Our Team" {...form.register("teamSectionTitle")} />
              </div>
              <div>
                <Label htmlFor="teamSectionSubtitle">Team Section Subtitle</Label>
                <Input id="teamSectionSubtitle" type="text" placeholder="Meet our team" {...form.register("teamSectionSubtitle")} />
              </div>
              <div>
                <Label htmlFor="learnMoreText">Learn More Text</Label>
                <Input id="learnMoreText" type="text" placeholder="Learn More" {...form.register("learnMoreText")} />
              </div>
              <div>
                <Label htmlFor="learnMoreUrl">Learn More URL</Label>
                <Input id="learnMoreUrl" type="text" placeholder="/about" {...form.register("learnMoreUrl")} />
              </div>
              <Button disabled={isSaving}>
                {isSaving && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Points</CardTitle>
            <CardDescription>Manage key points displayed on the about page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Enter key point text"
                  value={newKeyPointText}
                  onChange={(e) => setNewKeyPointText(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={handleAddKeyPoint}>Add Key Point</Button>
              </div>
            </div>
            <DragDropContext onDragEnd={onKeyPointDragEnd}>
              <Droppable droppableId="keyPoints">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {settings.keyPoints && settings.keyPoints.sort((a, b) => a.order - b.order).map((keyPoint, index) => (
                      <Draggable key={keyPoint.id} draggableId={String(keyPoint.id)} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
                          >
                            <span>{keyPoint.title}</span>
                            <div>
                              <Button variant="ghost" size="icon" onClick={() => handleUpdateKeyPoint({ ...keyPoint, title: prompt("Enter new title", keyPoint.title) || keyPoint.title })}>
                                <Pencil className="h-4 w-4 mr-2" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveKeyPoint(keyPoint.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {settings.showStats && (
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Manage stats displayed on the about page.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newStatLabel">Stat Label</Label>
                    <Input
                      type="text"
                      id="newStatLabel"
                      placeholder="Enter stat label"
                      value={newStatLabel}
                      onChange={(e) => setNewStatLabel(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newStatValue">Stat Value</Label>
                    <Input
                      type="text"
                      id="newStatValue"
                      placeholder="Enter stat value"
                      value={newStatValue}
                      onChange={(e) => setNewStatValue(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleAddStat} className="mt-2">Add Stat</Button>
              </div>
              <DragDropContext onDragEnd={onStatDragEnd}>
                <Droppable droppableId="stats">
                  {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {settings.stats && settings.stats.sort((a, b) => a.order - b.order).map((stat, index) => (
                        <Draggable key={stat.id} draggableId={String(stat.id)} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
                            >
                              <span>{stat.label}: {stat.value}</span>
                              <div>
                                <Button variant="ghost" size="icon" onClick={() => handleUpdateStat({ ...stat, label: prompt("Enter new label", stat.label) || stat.label })}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleUpdateStat({ ...stat, value: prompt("Enter new value", stat.value) || stat.value })}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveStat(stat.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAboutSettings;
