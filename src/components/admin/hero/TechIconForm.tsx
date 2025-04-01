
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { TechIcon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TechIconFormProps {
  currentTechIcon: Partial<TechIcon>;
  onTechIconChange: (field: keyof TechIcon, value: string) => void;
  onAddTechIcon: () => void;
  availableIcons: string[];
  animationOptions: { label: string; value: string }[];
}

const TechIconForm: React.FC<TechIconFormProps> = ({
  currentTechIcon,
  onTechIconChange,
  onAddTechIcon,
  availableIcons,
  animationOptions
}) => {
  const { toast } = useToast();

  const handleAddTechIcon = () => {
    if (!currentTechIcon.name || !currentTechIcon.icon) {
      toast({
        title: "Missing information",
        description: "Please provide a name and select an icon for the tech stack.",
        variant: "destructive",
      });
      return;
    }
    onAddTechIcon();
  };

  return (
    <div className="bg-secondary/20 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Add New Tech Icon</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="techName">Technology Name</Label>
          <Input
            id="techName"
            value={currentTechIcon.name || ''}
            onChange={(e) => onTechIconChange('name', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="techIcon">Icon</Label>
          <Select 
            value={currentTechIcon.icon} 
            onValueChange={(value) => onTechIconChange('icon', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="techColor">Icon Color</Label>
          <Input
            id="techColor"
            type="color"
            value={currentTechIcon.color || '#000000'}
            onChange={(e) => onTechIconChange('color', e.target.value)}
            className="h-10"
          />
        </div>
        <div>
          <Label htmlFor="techAnimation">Animation</Label>
          <Select 
            value={currentTechIcon.animate} 
            onValueChange={(value) => onTechIconChange('animate', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              {animationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleAddTechIcon}>
        <Plus className="h-4 w-4 mr-2" />
        Add Tech Icon
      </Button>
    </div>
  );
};

export default TechIconForm;
