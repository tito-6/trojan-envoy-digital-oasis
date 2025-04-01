
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Award, Edit, GripVertical, Plus, Save, Trash, X, Upload, Link, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/lib/storage";
import { TechIcon } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIconComponentByName } from "@/lib/iconUtils";
import IconSelector from "./icon-management/IconSelector";

import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNode,
  FaPython,
  FaJava,
  FaPhp,
  FaSwift,
  FaDatabase,
  FaDocker,
  FaGithub,
  FaAws
} from "react-icons/fa";

import {
  SiTypescript,
  SiJavascript,
  SiFirebase,
  SiMongodb,
  SiGraphql,
  SiTailwindcss,
  SiFlutter,
  SiKotlin
} from "react-icons/si";

const techIconFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  iconName: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  animation: z.string().min(1, "Animation is required"),
  iconUrl: z.string().optional(),
  iconSvg: z.string().optional(),
});

type TechIconFormValues = z.infer<typeof techIconFormSchema>;

// Icon map to render the actual icons
const iconMap: Record<string, React.ComponentType<any>> = {
  FaReact,
  FaVuejs,
  FaAngular,
  SiTypescript,
  SiJavascript,
  FaNode,
  FaPython,
  FaJava,
  FaPhp,
  SiKotlin,
  FaSwift,
  SiFlutter,
  SiFirebase,
  SiMongodb,
  FaDatabase,
  SiGraphql,
  SiTailwindcss,
  FaDocker,
  FaGithub,
  FaAws
};

// Animation options
const animationOptions = [
  { value: "animate-bounce", label: "Bounce" },
  { value: "animate-pulse", label: "Pulse" },
  { value: "animate-spin-slow", label: "Slow Spin" },
  { value: "hover:animate-bounce", label: "Bounce on Hover" },
  { value: "hover:animate-pulse", label: "Pulse on Hover" },
  { value: "hover:animate-spin", label: "Spin on Hover" },
  { value: "hover:scale-110 transition-transform", label: "Scale on Hover" },
  { value: "hover:rotate-12 transition-transform", label: "Rotate on Hover" },
  { value: "none", label: "No Animation" }, // Changed from empty string to "none"
];

const TechIconItem: React.FC<{
  icon: TechIcon;
  onDelete: (id: number) => void;
  onEdit: (icon: TechIcon) => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
}> = ({ icon, onDelete, onEdit, onReorder }) => {
  const renderTechIcon = () => {
    if (icon.iconName.startsWith('data:')) {
      return (
        <img 
          src={icon.iconName} 
          alt={icon.name} 
          style={{ width: '20px', height: '20px', color: icon.color }} 
        />
      );
    }
    
    const IconComponent = getIconComponentByName(icon.iconName);
    if (IconComponent) {
      return <IconComponent size={20} style={{ color: icon.color }} />;
    }
    
    return <FaReact size={20} style={{ color: icon.color }} />;
  };
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-card">
      <div className="flex items-center gap-3">
        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
        <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${icon.animation}`}>
          {renderTechIcon()}
        </div>
        <div>
          <p className="font-medium">{icon.name}</p>
          <p className="text-xs text-muted-foreground">Animation: {animationOptions.find(a => a.value === icon.animation)?.label || "Custom"}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => onReorder(icon.id, 'up')}>
          ▲
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onReorder(icon.id, 'down')}>
          ▼
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onEdit(icon)}>
          <Edit className="w-4 h-4" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-red-500">
              <Trash className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the technology icon from your hero section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(icon.id)} className="bg-red-500 text-white hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const TechStackManager: React.FC = () => {
  const { toast } = useToast();
  const [icons, setIcons] = useState<TechIcon[]>(storageService.getHeroSettings().techIcons);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<TechIcon | null>(null);
  const [iconSource, setIconSource] = useState<'library' | 'upload' | 'url'>('library');
  const [uploadedIconData, setUploadedIconData] = useState<string | null>(null);
  const [selectedLibraryIcon, setSelectedLibraryIcon] = useState<string>("");
  const [importUrl, setImportUrl] = useState<string>("");
  
  const form = useForm<TechIconFormValues>({
    resolver: zodResolver(techIconFormSchema),
    defaultValues: {
      name: "",
      iconName: "FaReact",
      color: "#61DAFB", // React blue
      animation: "hover:animate-spin",
      iconUrl: "",
      iconSvg: "",
    }
  });
  
  const handleDelete = (id: number) => {
    if (storageService.deleteTechIcon(id)) {
      setIcons(storageService.getHeroSettings().techIcons);
      toast({
        title: "Technology icon deleted",
        description: "The technology icon has been removed from your hero section.",
      });
    }
  };
  
  const handleReorder = (id: number, direction: 'up' | 'down') => {
    const newIcons = [...icons];
    const index = newIcons.findIndex(icon => icon.id === id);
    
    if (direction === 'up' && index > 0) {
      const temp = newIcons[index - 1].order;
      newIcons[index - 1].order = newIcons[index].order;
      newIcons[index].order = temp;
    } else if (direction === 'down' && index < newIcons.length - 1) {
      const temp = newIcons[index + 1].order;
      newIcons[index + 1].order = newIcons[index].order;
      newIcons[index].order = temp;
    }
    
    storageService.reorderTechIcons(
      newIcons.map(icon => ({ id: icon.id, order: icon.order }))
    );
    
    setIcons(storageService.getHeroSettings().techIcons);
    
    toast({
      title: "Icon order updated",
      description: "The technology icon order has been updated.",
    });
  };
  
  const handleIconSelect = (iconName: string) => {
    setSelectedLibraryIcon(iconName);
    form.setValue("iconName", iconName);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image or SVG
    if (!file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or SVG file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedIconData(result);
      form.setValue("iconSvg", result);
      form.setValue("iconName", "custom");
    };
    reader.readAsDataURL(file);
  };
  
  const handleImportFromUrl = () => {
    if (!importUrl) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL to import an icon.",
        variant: "destructive"
      });
      return;
    }
    
    // For a real implementation, you would fetch the SVG or image
    // and convert it to a data URL. This is a simplified version.
    form.setValue("iconUrl", importUrl);
    form.setValue("iconName", "custom");
    
    toast({
      title: "Icon imported",
      description: "The icon has been imported from the URL.",
    });
  };
  
  const onSubmit = (values: TechIconFormValues) => {
    if (editingIcon) {
      // Update existing icon
      const updatedIcon = storageService.updateTechIcon(editingIcon.id, {
        name: values.name,
        iconName: values.iconName,
        color: values.color,
        animation: values.animation
      });
      
      if (updatedIcon) {
        setIcons(storageService.getHeroSettings().techIcons);
        toast({
          title: "Technology icon updated",
          description: "The technology icon has been updated successfully.",
        });
      }
    } else {
      // Add new icon - ensure all required properties are provided
      const newIcon = storageService.addTechIcon({
        name: values.name,
        iconName: values.iconName,
        color: values.color,
        animation: values.animation,
        order: icons.length + 1
      });
      
      setIcons(storageService.getHeroSettings().techIcons);
      toast({
        title: "Technology icon added",
        description: "The new technology icon has been added to your hero section.",
      });
    }
    
    setIsAddOpen(false);
    setEditingIcon(null);
    form.reset();
    setIconSource('library');
    setUploadedIconData(null);
    setImportUrl("");
  };
  
  const handleEdit = (icon: TechIcon) => {
    setEditingIcon(icon);
    form.reset({
      name: icon.name,
      iconName: icon.iconName,
      color: icon.color,
      animation: icon.animation,
    });
    setIsAddOpen(true);
  };
  
  const handleAddDialogClose = () => {
    setIsAddOpen(false);
    setEditingIcon(null);
    form.reset();
    setIconSource('library');
    setUploadedIconData(null);
    setImportUrl("");
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Manage the technology icons displayed in your hero section
          </CardDescription>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingIcon ? "Edit Technology Icon" : "Add Technology Icon"}</DialogTitle>
              <DialogDescription>
                {editingIcon ? "Update the technology icon details" : "Add a new technology to your stack"}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="React, TypeScript, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Tabs defaultValue="library" onValueChange={(value) => setIconSource(value as 'library' | 'upload' | 'url')}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="library">Icon Library</TabsTrigger>
                    <TabsTrigger value="upload">Upload Icon</TabsTrigger>
                    <TabsTrigger value="url">Import from URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="library" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="iconName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <IconSelector 
                            selectedIcon={field.value} 
                            onSelectIcon={(iconName) => {
                              field.onChange(iconName);
                              setSelectedLibraryIcon(iconName);
                            }} 
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        Drag and drop your icon, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept="image/*,.svg"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="icon-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("icon-upload")?.click()}
                        type="button"
                      >
                        Browse Files
                      </Button>
                      
                      {uploadedIconData && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Uploaded Icon:</p>
                          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img 
                              src={uploadedIconData} 
                              alt="Uploaded icon" 
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={importUrl}
                          onChange={(e) => setImportUrl(e.target.value)}
                          placeholder="https://example.com/icon.svg"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleImportFromUrl}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Import
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the URL of an SVG or image file to import as an icon
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input {...field} type="color" className="w-12 p-1 h-10" />
                            <Input 
                              value={field.value} 
                              onChange={field.onChange}
                              placeholder="#000000" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="animation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Animation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an animation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {animationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={handleAddDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingIcon ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Technology
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Technology
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {icons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No technology icons added yet. Click the button above to add some.
            </div>
          ) : (
            icons.map((icon) => (
              <TechIconItem
                key={icon.id}
                icon={icon}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReorder={handleReorder}
              />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          {icons.length} technology icon{icons.length !== 1 ? "s" : ""} configured
        </p>
      </CardFooter>
    </Card>
  );
};

export default TechStackManager;

