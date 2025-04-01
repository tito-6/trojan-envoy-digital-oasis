
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GeneralInfoFormProps {
  formData: {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
  };
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({
  formData,
  isEditing,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={formData.subtitle || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={onChange}
          rows={4}
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ctaLabel">Primary Button Text</Label>
          <Input
            id="ctaLabel"
            name="ctaLabel"
            value={formData.ctaLabel || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="ctaUrl">Primary Button URL</Label>
          <Input
            id="ctaUrl"
            name="ctaUrl"
            value={formData.ctaUrl || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="secondaryCtaLabel">Secondary Button Text</Label>
          <Input
            id="secondaryCtaLabel"
            name="secondaryCtaLabel"
            value={formData.secondaryCtaLabel || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="secondaryCtaUrl">Secondary Button URL</Label>
          <Input
            id="secondaryCtaUrl"
            name="secondaryCtaUrl"
            value={formData.secondaryCtaUrl || ''}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoForm;
