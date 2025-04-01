
import React from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as LucideIcons from "lucide-react";

// Type that encompasses all the different icon libraries
type IconProps = {
  name: string;
  color?: string;
  size?: number;
  className?: string;
};

export const Icon: React.FC<IconProps> = ({ name, color, size = 24, className = "" }) => {
  // Check if it's a FaIcon
  if (name.startsWith("Fa") && FaIcons[name as keyof typeof FaIcons]) {
    const FaIcon = FaIcons[name as keyof typeof FaIcons];
    return <FaIcon color={color} size={size} className={className} />;
  }

  // Check if it's a SiIcon
  if (name.startsWith("Si") && SiIcons[name as keyof typeof SiIcons]) {
    const SiIcon = SiIcons[name as keyof typeof SiIcons];
    return <SiIcon color={color} size={size} className={className} />;
  }

  // Check if it's a Lucide icon
  if (LucideIcons[name as keyof typeof LucideIcons]) {
    const LucideIcon = LucideIcons[name as keyof typeof LucideIcons];
    return <LucideIcon color={color} size={size} className={className} />;
  }

  // If it's a URL, render an image
  if (name.startsWith('http') || name.startsWith('/')) {
    return <img src={name} alt="icon" className={className} style={{ width: size, height: size }} />;
  }

  // Fallback for when no icon is found
  return (
    <div 
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color ? `${color}20` : '#eee',
        color: color || '#333'
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
