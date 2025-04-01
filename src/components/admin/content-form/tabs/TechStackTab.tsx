import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ContentFormValues } from "../schema";
import { X, Plus, Info, ArrowUp, ArrowDown, EyeIcon, Paintbrush, Upload, Search } from "lucide-react";
import { TechItem } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

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
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [iconLibraryOpen, setIconLibraryOpen] = useState(false);
  const [currentIconType, setCurrentIconType] = useState<"preset" | "custom">("preset");
  const [customIconUrl, setCustomIconUrl] = useState("");
  
  const availableIcons = [
    "react", "typescript", "vue-js", "angular", "javascript", 
    "node-js", "python", "java", "php", "kotlin", "swift", 
    "flutter", "firebase", "mongodb", "sql", "graphql", 
    "tailwind", "docker", "aws", "github"
  ];
  
  const faIcons = Object.keys(FaIcons)
    .filter(key => key.startsWith("Fa") && typeof FaIcons[key as keyof typeof FaIcons] === "function")
    .filter(key => iconSearchTerm ? key.toLowerCase().includes(iconSearchTerm.toLowerCase()) : true)
    .slice(0, 50);
  
  const siIcons = Object.keys(SiIcons)
    .filter(key => key.startsWith("Si") && typeof SiIcons[key as keyof typeof SiIcons] === "function")
    .filter(key => iconSearchTerm ? key.toLowerCase().includes(iconSearchTerm.toLowerCase()) : true)
    .slice(0, 50);
  
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
    
    if (index === null) {
      setNewTechName("");
      setNewTechIcon("");
      setNewTechColor("");
      setCustomIconUrl("");
      setCurrentIconType("preset");
    } else if (index !== null && techItems[index]) {
      setNewTechName(techItems[index].name);
      setNewTechIcon(techItems[index].iconName);
      setNewTechColor(techItems[index].color || "#000000");
      
      if (availableIcons.includes(techItems[index].iconName) || 
          techItems[index].iconName.startsWith("Fa") || 
          techItems[index].iconName.startsWith("Si")) {
        setCurrentIconType("preset");
      } else {
        setCurrentIconType("custom");
        setCustomIconUrl(techItems[index].iconName);
      }
    }
  };
  
  const handleUpdateTechItem = () => {
    if (editingIndex === null || !newTechName || !newTechIcon) return;
    
    const updatedItem = {
      name: newTechName,
      iconName: currentIconType === "custom" && customIconUrl ? customIconUrl : newTechIcon,
      color: newTechColor,
      animate: techItems[editingIndex]?.animate || "animate-float"
    };
    
    const newItems = [...techItems];
    newItems[editingIndex] = updatedItem;
    setTechItems(newItems);
    
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

  const handleSelectIcon = (iconName: string) => {
    setNewTechIcon(iconName);
    setIconLibraryOpen(false);
  };

  const handleAddWithCustomIcon = () => {
    if (newTechName && customIconUrl) {
      const newItem: TechItem = {
        name: newTechName,
        iconName: customIconUrl,
        color: newTechColor || "#4285F4",
        animate: Math.random() > 0.5 ? "animate-float" : "animate-pulse-soft"
      };
      
      setTechItems(prev => [...prev, newItem]);
      setNewTechName("");
      setNewTechIcon("");
      setNewTechColor("#4285F4");
      setCustomIconUrl("");
      setCurrentIconType("preset");
    }
  };

  const renderIconPreview = (iconName: string) => {
    if (availableIcons.includes(iconName)) {
      return (
        <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
          <div className="text-xl font-bold" style={{ color: newTechColor || "#4285F4" }}>
            {iconName.charAt(0).toUpperCase()}
          </div>
        </div>
      );
    }
    
    if (iconName.startsWith("Fa") && FaIcons[iconName as keyof typeof FaIcons]) {
      const Icon = FaIcons[iconName as keyof typeof FaIcons];
      return <Icon size={24} color={newTechColor || "#4285F4"} />;
    }
    
    if (iconName.startsWith("Si") && SiIcons[iconName as keyof typeof SiIcons]) {
      const Icon = SiIcons[iconName as keyof typeof SiIcons];
      return <Icon size={24} color={newTechColor || "#4285F4"} />;
    }
    
    if (iconName.startsWith('http') || iconName.startsWith('/')) {
      return <img src={iconName} alt="icon" className="w-8 h-8" />;
    }
    
    return (
      <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
        <span className="text-sm font-bold">?</span>
      </div>
    );
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

      {!previewMode && (
        <div className="bg-muted/30 p-4 rounded-md mb-6 border">
          <h4 className="font-medium mb-4">{editingIndex !== null ? "Edit Technology" : "Add New Technology"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-4">
              <FormLabel>Technology Name</FormLabel>
              <Input
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                placeholder="e.g. React"
              />
            </div>
            
            <div className="md:col-span-4">
              <FormLabel>Icon Selection</FormLabel>
              <div className="flex gap-2">
                <div className="flex-1">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={currentIconType}
                    onChange={(e) => setCurrentIconType(e.target.value as "preset" | "custom")}
                  >
                    <option value="preset">Use Preset Icon</option>
                    <option value="custom">Use Custom URL</option>
                  </select>
                </div>
                
                <Dialog open={iconLibraryOpen} onOpenChange={setIconLibraryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className={currentIconType === "custom" ? "opacity-50" : ""} disabled={currentIconType === "custom"}>
                      Browse Icons
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Select an Icon</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <Input
                          placeholder="Search icons..."
                          value={iconSearchTerm}
                          onChange={(e) => setIconSearchTerm(e.target.value)}
                          className="mb-2"
                          icon={<Search className="h-4 w-4" />}
                        />
                      </div>
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Preset Technology Icons</h5>
                        <div className="grid grid-cols-5 gap-2">
                          {availableIcons.map((icon) => (
                            <Button
                              key={icon}
                              variant="outline"
                              className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-secondary/20"
                              onClick={() => handleSelectIcon(icon)}
                            >
                              <div className="text-xl">{renderIconPreview(icon)}</div>
                              <span className="text-xs truncate w-full text-center">{icon}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <ScrollArea className="h-60 rounded-md border p-4">
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2">Font Awesome Icons</h5>
                          <div className="grid grid-cols-5 gap-2">
                            {faIcons.map((icon) => (
                              <Button
                                key={icon}
                                variant="outline"
                                className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-secondary/20"
                                onClick={() => handleSelectIcon(icon)}
                              >
                                <div className="text-xl">
                                  {(() => {
                                    const Icon = FaIcons[icon as keyof typeof FaIcons];
                                    return <Icon size={24} />;
                                  })()}
                                </div>
                                <span className="text-xs truncate w-full text-center">{icon.replace("Fa", "")}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2 mt-4">Simple Icons</h5>
                          <div className="grid grid-cols-5 gap-2">
                            {siIcons.map((icon) => (
                              <Button
                                key={icon}
                                variant="outline"
                                className="h-16 flex flex-col items-center justify-center gap-1 hover:bg-secondary/20"
                                onClick={() => handleSelectIcon(icon)}
                              >
                                <div className="text-xl">
                                  {(() => {
                                    const Icon = SiIcons[icon as keyof typeof SiIcons];
                                    return <Icon size={24} />;
                                  })()}
                                </div>
                                <span className="text-xs truncate w-full text-center">{icon.replace("Si", "")}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIconLibraryOpen(false)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {currentIconType === "custom" && (
                <div className="mt-2">
                  <Input
                    value={customIconUrl}
                    onChange={(e) => setCustomIconUrl(e.target.value)}
                    placeholder="https://example.com/icon.svg or /images/icon.png"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a URL to an image (SVG, PNG, etc.)
                  </p>
                </div>
              )}
              
              {(newTechIcon || customIconUrl) && (
                <div className="mt-2 flex items-center">
                  <span className="text-sm mr-2">Preview:</span>
                  {renderIconPreview(currentIconType === "custom" ? customIconUrl : newTechIcon)}
                </div>
              )}
            </div>
            
            <div className="md:col-span-4">
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
                  disabled={!newTechName || !(newTechIcon || (currentIconType === "custom" && customIconUrl))}
                >
                  Update Technology
                </Button>
              </>
            ) : (
              <>
                {currentIconType === "preset" ? (
                  <Button 
                    type="button" 
                    onClick={addTechItem}
                    disabled={!newTechName || !newTechIcon}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Technology
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleAddWithCustomIcon}
                    disabled={!newTechName || !customIconUrl}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add With Custom Icon
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
                    {renderIconPreview(tech.iconName)}
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
                      {renderIconPreview(tech.iconName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{tech.name}</span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="mr-2">{tech.iconName.length > 20 ? tech.iconName.substring(0, 20) + '...' : tech.iconName}</span>
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
