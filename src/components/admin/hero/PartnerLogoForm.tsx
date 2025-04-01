
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { PartnerLogo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface PartnerLogoFormProps {
  currentPartnerLogo: Partial<PartnerLogo>;
  onPartnerLogoChange: (field: keyof PartnerLogo, value: string | boolean) => void;
  onAddPartnerLogo: () => void;
  availableIcons: string[];
}

const PartnerLogoForm: React.FC<PartnerLogoFormProps> = ({
  currentPartnerLogo,
  onPartnerLogoChange,
  onAddPartnerLogo,
  availableIcons
}) => {
  const { toast } = useToast();

  const handleSwitchChange = (checked: boolean) => {
    onPartnerLogoChange('certified', checked);
  };

  const handleAddPartnerLogo = () => {
    if (!currentPartnerLogo.name || !currentPartnerLogo.icon) {
      toast({
        title: "Missing information",
        description: "Please provide a name and select an icon for the partner logo.",
        variant: "destructive",
      });
      return;
    }
    onAddPartnerLogo();
  };

  return (
    <div className="bg-secondary/20 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Add New Partner Logo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="partnerName">Partner Name</Label>
          <Input
            id="partnerName"
            value={currentPartnerLogo.name || ''}
            onChange={(e) => onPartnerLogoChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="partnerIcon">Partner Icon</Label>
          <Select 
            value={currentPartnerLogo.icon} 
            onValueChange={(value) => onPartnerLogoChange('icon', value)}
            required
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
          <Label htmlFor="partnerColor">Icon Color</Label>
          <Input
            id="partnerColor"
            type="color"
            value={currentPartnerLogo.color || '#000000'}
            onChange={(e) => onPartnerLogoChange('color', e.target.value)}
            className="h-10"
            required
          />
        </div>
        <div>
          <Label htmlFor="partnerBgColor">Background Color</Label>
          <Select 
            value={currentPartnerLogo.bgColor} 
            onValueChange={(value) => onPartnerLogoChange('bgColor', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select background color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-blue-100">Blue</SelectItem>
              <SelectItem value="bg-green-100">Green</SelectItem>
              <SelectItem value="bg-yellow-100">Yellow</SelectItem>
              <SelectItem value="bg-orange-100">Orange</SelectItem>
              <SelectItem value="bg-red-100">Red</SelectItem>
              <SelectItem value="bg-purple-100">Purple</SelectItem>
              <SelectItem value="bg-pink-100">Pink</SelectItem>
              <SelectItem value="bg-indigo-100">Indigo</SelectItem>
              <SelectItem value="bg-gray-100">Gray</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="certified"
          checked={currentPartnerLogo.certified || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="certified">Certified Partner</Label>
      </div>

      <Button onClick={handleAddPartnerLogo}>
        <Plus className="h-4 w-4 mr-2" />
        Add Partner Logo
      </Button>
    </div>
  );
};

export default PartnerLogoForm;
