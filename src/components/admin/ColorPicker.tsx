
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded-md border"
          style={{ backgroundColor: value }}
        />
        <Input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full h-10"
        />
      </div>
    </div>
  );
};
