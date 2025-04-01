
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ContentFormValues } from "../schema";
import { X, Plus } from "lucide-react";
import { TechItem } from "@/lib/types";

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
      <h3 className="text-lg font-medium">Technology Stack Items</h3>
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
              value={newTechColor}
              onChange={(e) => setNewTechColor(e.target.value)}
              placeholder="#4285F4"
            />
            <div 
              className="h-10 w-10 rounded-md border"
              style={{ backgroundColor: newTechColor || '#ccc' }}
            />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {techItems.map((tech, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 border rounded-md"
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
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground">No technologies added yet</p>
        </div>
      )}
    </TabsContent>
  );
};
