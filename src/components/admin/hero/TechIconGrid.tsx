
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { TechIcon } from '@/lib/types';

interface TechIconGridProps {
  techIcons: TechIcon[];
  isEditing: boolean;
  onRemoveTechIcon: (index: number) => void;
}

const TechIconGrid: React.FC<TechIconGridProps> = ({
  techIcons,
  isEditing,
  onRemoveTechIcon
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {techIcons.map((tech, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{tech.name}</h3>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveTechIcon(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <div className={`w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mb-2`}>
                <div style={{ color: tech.color }}>
                  {tech.icon}
                </div>
              </div>
              <span className="text-xs animate">{tech.animate}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TechIconGrid;
