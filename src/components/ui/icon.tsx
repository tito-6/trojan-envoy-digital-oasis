
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
  // Normalize the name to lowercase for comparisons
  const normalizedName = name.toLowerCase();

  // Check if it's a FaIcon
  if (name.startsWith("Fa") && name in FaIcons) {
    const FaIcon = FaIcons[name as keyof typeof FaIcons] as React.ElementType;
    return <FaIcon color={color} size={size} className={className} />;
  }

  // Check if it's a SiIcon
  if (name.startsWith("Si") && name in SiIcons) {
    const SiIcon = SiIcons[name as keyof typeof SiIcons] as React.ElementType;
    return <SiIcon color={color} size={size} className={className} />;
  }

  // Check if it's a Lucide icon (proper check for Lucide components)
  const lucideIconName = name.charAt(0).toUpperCase() + name.slice(1);
  if (lucideIconName in LucideIcons) {
    const LucideIcon = LucideIcons[lucideIconName as keyof typeof LucideIcons] as React.ElementType;
    return <LucideIcon color={color} size={size} className={className} />;
  }

  // If it's a URL, render an image
  if (name.startsWith('http') || name.startsWith('/')) {
    return <img src={name} alt="icon" className={className} style={{ width: size, height: size }} />;
  }

  // Map common tech names to known icons if explicit icon name not found
  const techIconMap: Record<string, string> = {
    'react': 'FaReact',
    'vue': 'FaVuejs', 
    'vue.js': 'FaVuejs',
    'vue-js': 'FaVuejs',
    'angular': 'FaAngular',
    'javascript': 'SiJavascript',
    'typescript': 'SiTypescript',
    'node': 'FaNodeJs',
    'nodejs': 'FaNodeJs',
    'node.js': 'FaNodeJs',
    'node-js': 'FaNodeJs',
    'python': 'FaPython',
    'java': 'FaJava',
    'php': 'FaPhp',
    'kotlin': 'SiKotlin',
    'swift': 'FaSwift',
    'flutter': 'SiFlutter',
    'firebase': 'SiFirebase',
    'mongodb': 'SiMongodb',
    'sql': 'FaDatabase',
    'graphql': 'SiGraphql',
    'tailwind': 'SiTailwindcss',
    'tailwindcss': 'SiTailwindcss',
    'docker': 'FaDocker',
    'aws': 'FaAws',
    'github': 'FaGithub',
    'nextjs': 'SiNextdotjs',
    'next.js': 'SiNextdotjs',
    'next-js': 'SiNextdotjs'
  };

  // Try to find a matching icon in the map
  if (normalizedName in techIconMap) {
    const iconName = techIconMap[normalizedName];
    if (iconName.startsWith('Fa') && iconName in FaIcons) {
      const MappedIcon = FaIcons[iconName as keyof typeof FaIcons] as React.ElementType;
      return <MappedIcon color={color} size={size} className={className} />;
    } else if (iconName.startsWith('Si') && iconName in SiIcons) {
      const MappedIcon = SiIcons[iconName as keyof typeof SiIcons] as React.ElementType;
      return <MappedIcon color={color} size={size} className={className} />;
    }
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
