
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ContentFormValues } from "../schema";
import { X, Plus, Info, ArrowUp, ArrowDown, EyeIcon, Paintbrush } from "lucide-react";
import { TechItem } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TechStackTabProps {
  form: UseFormReturn<ContentFormValues>;
  techItems: TechItem[];
  setTechItems: React.Dispatch<React.SetStateAction<TechItem[]>>;
  newTechName: string;
  setNewTechName: React.Dispatch<React.SetStateAction<string>>;
  newTechIcon: string;
  setNewTechIcon: React.Dispatch<React.SetStateAction<string>>;
  newTechColor: string;
  setNewTechColor: React.Dispatch<React.SetStateAction<string>>;
  addTechItem: () => void;
  removeTechItem: (index: number) => void;
}

export const TechStackTab: React.FC<TechStackTabProps> = ({
  form,
  techItems,
  setTechItems,
  newTechName,
  setNewTechName,
  newTechIcon,
  setNewTechIcon,
  newTechColor,
  setNewTechColor,
  addTechItem,
  removeTechItem
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const availableIcons = [
    "react", "typescript", "vue-js", "angular", "javascript", 
    "node-js", "python", "java", "php", "kotlin", "swift", 
    "flutter", "firebase", "mongodb", "sql", "graphql", 
    "tailwind", "docker", "aws", "github"
  ];
  
  const animationOptions = [
    { value: "animate-float", label: "Float" },
    { value: "animate-pulse-soft", label: "Pulse" },
    { value: "", label: "None" }
  ];
  
  const moveTechItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...techItems];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setTechItems(newItems);
  };
  
  const updateTechItem = (index: number, field: keyof TechItem, value: string) => {
    const newItems = [...techItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setTechItems(newItems);
  };
  
  const toggleEditMode = (index: number | null) => {
    setEditingIndex(index);
    
    // If we're closing edit mode, clear the new tech fields
    if (index === null) {
      setNewTechName("");
      setNewTechIcon("");
      setNewTechColor("");
    }
    // If we're entering edit mode for an existing item, load its values
    else if (index !== null && techItems[index]) {
      setNewTechName(techItems[index].name);
      setNewTechIcon(techItems[index].iconName);
      setNewTechColor(techItems[index].color || "#000000");
    }
  };
  
  const handleUpdateTechItem = () => {
    if (editingIndex === null || !newTechName || !newTechIcon) return;
    
    const updatedItem = {
      name: newTechName,
      iconName: newTechIcon,
      color: newTechColor,
      animate: techItems[editingIndex]?.animate || "animate-float"
    };
    
    const newItems = [...techItems];
    newItems[editingIndex] = updatedItem;
    setTechItems(newItems);
    
    // Reset form and exit edit mode
    toggleEditMode(null);
  };
  
  const toggleAnimation = (index: number) => {
    const item = techItems[index];
    let nextAnimation = "";
    
    if (!item.animate || item.animate === "") {
      nextAnimation = "animate-float";
    } else if (item.animate === "animate-float") {
      nextAnimation = "animate-pulse-soft";
    } else {
      nextAnimation = "";
    }
    
    updateTechItem(index, "animate", nextAnimation);
  };
  
  const getAnimationLabel = (animate?: string) => {
    if (!animate || animate === "") return "None";
    if (animate === "animate-float") return "Float";
    if (animate === "animate-pulse-soft") return "Pulse";
    return animate;
  };

  return (
    <TabsContent value="tech-stack" className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Technology Stack Items</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="preview-mode" 
              checked={previewMode}
              onCheckedChange={setPreviewMode}
            />
            <Label htmlFor="preview-mode">Preview Mode</Label>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Add technologies that will be displayed in the Technology Stack section on the homepage.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Add technologies that you want to showcase in the technology stack section
      </p>

      {/* Add/Edit Technology Form */}
      {!previewMode && (
        <div className="bg-muted/30 p-4 rounded-md mb-6 border">
          <h4 className="font-medium mb-4">{editingIndex !== null ? "Edit Technology" : "Add New Technology"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <FormLabel>Technology Name</FormLabel>
              <Input
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                placeholder="e.g. React"
              />
            </div>
            
            <div>
              <FormLabel>Icon Name</FormLabel>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={newTechIcon}
                onChange={(e) => setNewTechIcon(e.target.value)}
              >
                <option value="">Select an icon</option>
                {availableIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <FormLabel>Color</FormLabel>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTechColor}
                  onChange={(e) => setNewTechColor(e.target.value)}
                  placeholder="#4285F4"
                  className="flex-grow"
                />
                <div className="relative">
                  <Input
                    type="color"
                    value={newTechColor || "#4285F4"}
                    onChange={(e) => setNewTechColor(e.target.value)}
                    className="w-10 h-10 p-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {editingIndex !== null ? (
              <>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => toggleEditMode(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleUpdateTechItem}
                  disabled={!newTechName || !newTechIcon}
                >
                  Update Technology
                </Button>
              </>
            ) : (
              <Button 
                type="button" 
                onClick={addTechItem}
                disabled={!newTechName || !newTechIcon}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Technology
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Technology List */}
      {techItems.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium">Current Technologies ({techItems.length})</h4>
            <div className="text-sm text-muted-foreground">
              {previewMode ? "Preview Mode" : "Edit Mode"}
            </div>
          </div>
          
          {previewMode ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 bg-background/50 rounded-lg border">
              {techItems.map((tech, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center justify-center"
                >
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${tech.animate || ""}`}
                    style={{ backgroundColor: tech.color ? `${tech.color}20` : '#eee' }}
                  >
                    <div className="text-2xl font-bold" style={{ color: tech.color }}>
                      {tech.iconName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {techItems.map((tech, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-grow">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: tech.color ? `${tech.color}20` : '#eee' }}
                    >
                      <span style={{ color: tech.color }}>{tech.iconName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{tech.name}</span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="mr-2">{tech.iconName}</span>
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: tech.color || '#ccc' }}
                        />
                        <span>{tech.color || 'No color'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => toggleAnimation(index)}
                    >
                      {getAnimationLabel(tech.animate)}
                    </Badge>
                  
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveTechItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => moveTechItem(index, 'down')}
                        disabled={index === techItems.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleEditMode(index)}
                      >
                        <Paintbrush className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeTechItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No technologies added yet</p>
        </div>
      )}
      
      {/* Import Default Technologies Button */}
      {techItems.length === 0 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            const defaultTechs = [
              { name: "React", iconName: "react", color: "#61DAFB", animate: "animate-float" },
              { name: "TypeScript", iconName: "typescript", color: "#3178C6", animate: "animate-pulse-soft" },
              { name: "Vue.js", iconName: "vue-js", color: "#4FC08D", animate: "animate-float" },
              { name: "Angular", iconName: "angular", color: "#DD0031", animate: "animate-pulse-soft" },
              { name: "JavaScript", iconName: "javascript", color: "#F7DF1E", animate: "animate-float" },
              { name: "Node.js", iconName: "node-js", color: "#339933", animate: "animate-pulse-soft" },
              { name: "Python", iconName: "python", color: "#3776AB", animate: "animate-float" },
              { name: "Java", iconName: "java", color: "#007396", animate: "animate-pulse-soft" },
              { name: "PHP", iconName: "php", color: "#777BB4", animate: "animate-float" },
              { name: "Kotlin", iconName: "kotlin", color: "#7F52FF", animate: "animate-pulse-soft" },
              { name: "Swift", iconName: "swift", color: "#FA7343", animate: "animate-float" },
              { name: "Flutter", iconName: "flutter", color: "#02569B", animate: "animate-pulse-soft" },
              { name: "Firebase", iconName: "firebase", color: "#FFCA28", animate: "animate-float" },
              { name: "MongoDB", iconName: "mongodb", color: "#47A248", animate: "animate-pulse-soft" },
              { name: "SQL", iconName: "sql", color: "#4479A1", animate: "animate-float" },
              { name: "GraphQL", iconName: "graphql", color: "#E10098", animate: "animate-pulse-soft" },
              { name: "Tailwind", iconName: "tailwind", color: "#06B6D4", animate: "animate-float" },
              { name: "Docker", iconName: "docker", color: "#2496ED", animate: "animate-pulse-soft" },
              { name: "AWS", iconName: "aws", color: "#FF9900", animate: "animate-float" },
              { name: "GitHub", iconName: "github", color: "#181717", animate: "animate-pulse-soft" }
            ];
            setTechItems(defaultTechs);
          }}
          className="w-full"
        >
          Import Default Technologies
        </Button>
      )}
      
      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium mb-2">Available Animations</h4>
        <div className="flex gap-4 mb-4">
          {animationOptions.map((opt) => (
            <div key={opt.value} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2 ${opt.value}`}>
                <span className="text-primary font-bold">A</span>
              </div>
              <span className="text-xs">{opt.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          If no technologies are specified, default technologies will be shown on the homepage.
        </p>
      </div>
    </TabsContent>
  );
};
