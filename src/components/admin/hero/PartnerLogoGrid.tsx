
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { PartnerLogo } from '@/lib/types';

interface PartnerLogoGridProps {
  partnerLogos: PartnerLogo[];
  isEditing: boolean;
  onRemovePartnerLogo: (index: number) => void;
}

const PartnerLogoGrid: React.FC<PartnerLogoGridProps> = ({
  partnerLogos,
  isEditing,
  onRemovePartnerLogo
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {partnerLogos.map((logo, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{logo.name}</h3>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePartnerLogo(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <div className={`w-12 h-12 rounded-full ${logo.bgColor} flex items-center justify-center mb-2`}>
                <div style={{ color: logo.color }}>
                  {logo.icon}
                </div>
              </div>
              {logo.certified && (
                <div className="flex items-center text-green-600 mt-1">
                  <span className="text-xs uppercase font-bold">Certified</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PartnerLogoGrid;
