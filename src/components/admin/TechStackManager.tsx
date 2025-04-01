
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Edit, GripVertical, Plus, Save, Trash } from "lucide-react";
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
  FaAws,
  FaGithub
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
  animation: z.string().min(1, "Animation style is required"),
});

type TechIconFormValues = z.infer<typeof techIconFormSchema>;

// Icon map to render the actual icons
const iconMap: Record<string, React.ComponentType<any>> = {
  FaReact,
  SiTypescript,
  FaVuejs,
  FaAngular,
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
  FaAws,
  FaGithub
};

// Animation options
const animationOptions = [
  { value: "animate-float", label: "Float" },
  { value: "animate-pulse-soft", label: "Pulse" },
  { value: "animate-bounce", label: "Bounce" },
  { value: "animate-spin-slow", label: "Spin (Slow)" },
];

const TechIconItem: React.FC<{
  icon: TechIcon;
  onDelete: (id: number) => void;
  onEdit: (icon: TechIcon) => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
}> = ({ icon, onDelete, onEdit, onReorder }) => {
  const Icon = iconMap[icon.iconName] || FaReact;
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-card">
      <div className="flex items-center gap-3">
        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
        <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
          <Icon size={24} style={{ color: icon.color }} />
        </div>
        <div>
          <p className="font-medium">{icon.name}</p>
          <p className="text-xs text-muted-foreground">Animation: {icon.animation.replace('animate-', '')}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
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
                This will remove the technology icon from your tech stack display.
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
  
  const form = useForm<TechIconFormValues>({
    resolver: zodResolver(techIconFormSchema),
    defaultValues: {
      name: "",
      iconName: "FaReact",
      color: "#000000",
      animation: "animate-float",
    }
  });
  
  const handleDelete = (id: number) => {
    if (storageService.deleteTechIcon(id)) {
      setIcons(storageService.getHeroSettings().techIcons);
      toast({
        title: "Technology icon deleted",
        description: "The technology icon has been removed from your tech stack.",
      });
    }
  };
  
  const handleReorder = (id: number, direction: 'up' | 'down') => {
    // Implementation for drag-and-drop or up/down reordering would go here
    // This is a simplified version
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
  };
  
  const onSubmit = (values: TechIconFormValues) => {
    if (editingIcon) {
      // Update existing icon
      const updatedIcon = storageService.updateTechIcon(editingIcon.id, {
        ...values
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
        description: "The new technology icon has been added to your tech stack.",
      });
    }
    
    setIsAddOpen(false);
    setEditingIcon(null);
    form.reset();
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
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Manage the technology icons displayed in your tech stack section
          </CardDescription>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIcon ? "Edit Technology Icon" : "Add Technology Icon"}</DialogTitle>
              <DialogDescription>
                {editingIcon ? "Update the technology icon details" : "Add a new technology to your tech stack"}
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
                
                <FormField
                  control={form.control}
                  name="iconName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FaReact">React</SelectItem>
                          <SelectItem value="SiTypescript">TypeScript</SelectItem>
                          <SelectItem value="FaVuejs">Vue.js</SelectItem>
                          <SelectItem value="FaAngular">Angular</SelectItem>
                          <SelectItem value="SiJavascript">JavaScript</SelectItem>
                          <SelectItem value="FaNode">Node.js</SelectItem>
                          <SelectItem value="FaPython">Python</SelectItem>
                          <SelectItem value="FaJava">Java</SelectItem>
                          <SelectItem value="FaPhp">PHP</SelectItem>
                          <SelectItem value="SiKotlin">Kotlin</SelectItem>
                          <SelectItem value="FaSwift">Swift</SelectItem>
                          <SelectItem value="SiFlutter">Flutter</SelectItem>
                          <SelectItem value="SiFirebase">Firebase</SelectItem>
                          <SelectItem value="SiMongodb">MongoDB</SelectItem>
                          <SelectItem value="FaDatabase">SQL</SelectItem>
                          <SelectItem value="SiGraphql">GraphQL</SelectItem>
                          <SelectItem value="SiTailwindcss">Tailwind CSS</SelectItem>
                          <SelectItem value="FaDocker">Docker</SelectItem>
                          <SelectItem value="FaAws">AWS</SelectItem>
                          <SelectItem value="FaGithub">GitHub</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                        <FormLabel>Animation Style</FormLabel>
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
                        Update Icon
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Icon
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
