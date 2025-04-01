
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ContentFormValues } from "../schema";
import { X, Plus, Info } from "lucide-react";
import { TechItem } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const availableIcons = [
    "react", "typescript", "vue-js", "angular", "javascript", 
    "node-js", "python", "java", "php", "kotlin", "swift", 
    "flutter", "firebase", "mongodb", "sql", "graphql", 
    "tailwind", "docker", "aws", "github"
  ];

  return (
    <TabsContent value="tech-stack" className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Technology Stack Items</h3>
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
      
      <p className="text-sm text-muted-foreground mb-4">
        Add technologies that you want to showcase in the technology stack section
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <FormLabel>Color (hex code)</FormLabel>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTechColor}
              onChange={(e) => setNewTechColor(e.target.value)}
              placeholder="#4285F4"
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

      <Button 
        type="button" 
        onClick={addTechItem}
        disabled={!newTechName || !newTechIcon}
        className="mb-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Technology
      </Button>

      {techItems.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium">Current Technologies ({techItems.length})</h4>
            <div className="text-sm text-muted-foreground">
              Drag to reorder (coming soon)
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {techItems.map((tech, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: tech.color || '#eee' }}
                  >
                    {tech.iconName && <span>{tech.iconName.charAt(0).toUpperCase()}</span>}
                  </div>
                  <span>{tech.name}</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeTechItem(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No technologies added yet</p>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted/50 rounded-md">
        <h4 className="font-medium mb-2">Default Technologies</h4>
        <p className="text-sm text-muted-foreground mb-4">
          If no technologies are specified, the following will be shown by default: React, TypeScript, Vue.js, Angular, JavaScript, Node.js, Python, Java, PHP, Kotlin, Swift, Flutter, Firebase, MongoDB, SQL, GraphQL, Tailwind, Docker, AWS, GitHub
        </p>
      </div>
    </TabsContent>
  );
};
