
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceSEOTabProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  keywordInput: string;
  h1Heading: string;
  h2Headings: string[];
  h2Input: string;
  h3Headings: string[];
  h3Input: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onKeywordInputChange: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
  onH1HeadingChange: (value: string) => void;
  onH2InputChange: (value: string) => void;
  onAddH2Heading: () => void;
  onRemoveH2Heading: (index: number) => void;
  onH3InputChange: (value: string) => void;
  onAddH3Heading: () => void;
  onRemoveH3Heading: (index: number) => void;
}

const ServiceSEOTab: React.FC<ServiceSEOTabProps> = ({
  seoTitle,
  seoDescription,
  seoKeywords,
  keywordInput,
  h1Heading,
  h2Headings,
  h2Input,
  h3Headings,
  h3Input,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onH1HeadingChange,
  onH2InputChange,
  onAddH2Heading,
  onRemoveH2Heading,
  onH3InputChange,
  onAddH3Heading,
  onRemoveH3Heading,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => onSeoTitleChange(e.target.value)}
              placeholder="SEO Title (will be used in meta tags)"
            />
            <p className="text-xs text-muted-foreground">
              Recommended length: 50-60 characters. Current length: {seoTitle.length}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => onSeoDescriptionChange(e.target.value)}
              placeholder="Meta description for search engines"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Recommended length: 150-160 characters. Current length: {seoDescription.length}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-keywords">Keywords</Label>
            <div className="flex space-x-2">
              <Input
                id="seo-keywords"
                value={keywordInput}
                onChange={(e) => onKeywordInputChange(e.target.value)}
                placeholder="Add keyword"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddKeyword();
                  }
                }}
              />
              <Button type="button" onClick={onAddKeyword} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {seoKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {seoKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {keyword}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => onRemoveKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-medium mb-4">Heading Structure</h3>
          
          <div className="space-y-2">
            <Label htmlFor="h1-heading">H1 Heading (Main Title)</Label>
            <Input
              id="h1-heading"
              value={h1Heading}
              onChange={(e) => onH1HeadingChange(e.target.value)}
              placeholder="Main H1 heading (should contain your primary keyword)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="h2-headings">H2 Headings (Section Titles)</Label>
            <div className="flex space-x-2">
              <Input
                id="h2-headings"
                value={h2Input}
                onChange={(e) => onH2InputChange(e.target.value)}
                placeholder="Add H2 heading"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddH2Heading();
                  }
                }}
              />
              <Button type="button" onClick={onAddH2Heading} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {h2Headings.length > 0 && (
              <div className="space-y-2 mt-2">
                {h2Headings.map((heading, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                    <span className="text-sm font-medium">H2: {heading}</span>
                    <X
                      className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => onRemoveH2Heading(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="h3-headings">H3 Headings (Subsection Titles)</Label>
            <div className="flex space-x-2">
              <Input
                id="h3-headings"
                value={h3Input}
                onChange={(e) => onH3InputChange(e.target.value)}
                placeholder="Add H3 heading"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddH3Heading();
                  }
                }}
              />
              <Button type="button" onClick={onAddH3Heading} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {h3Headings.length > 0 && (
              <div className="space-y-2 mt-2">
                {h3Headings.map((heading, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                    <span className="text-sm font-medium">H3: {heading}</span>
                    <X
                      className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => onRemoveH3Heading(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSEOTab;
