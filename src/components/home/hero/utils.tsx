
import React from "react";
import { 
  FaGoogle, 
  FaFacebook, 
  FaSearchengin, 
  FaAws, 
  FaShopify, 
  FaWordpress, 
  FaAward,
  FaReact,
  FaVuejs,
  FaAngular,
  FaNode,
  FaPython,
  FaJava,
  FaPhp,
  FaSwift,
  FaDatabase,
  FaDocker,
  FaGithub,
  FaMicrosoft,
  FaWindows
} from "react-icons/fa";

import { FaAws as FaAwsLogo } from "react-icons/fa";

import {
  SiTypescript,
  SiJavascript,
  SiFirebase,
  SiMongodb,
  SiGraphql,
  SiTailwindcss,
  SiFlutter,
  SiKotlin,
  SiSemrush,
  SiNextdotjs,
  SiExpress,
  SiDjango,
  SiSpring,
  SiLaravel,
  SiRuby,
  SiDotnet,
  SiGo,
  SiRust,
  SiElixir,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiElasticsearch,
  SiKubernetes,
  SiTerraform,
  SiAmazon,
  SiGooglecloud,
  SiVercel,
  SiNetlify,
  SiHeroku,
  SiDigitalocean
} from "react-icons/si";

import { PartnerLogo, TechIcon } from "@/lib/types";

export const renderIcon = (iconName: string, size: number = 32, style: React.CSSProperties = {}) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    FaGoogle, FaFacebook, FaSearchengin, FaAws, FaShopify, FaWordpress, FaAward,
    
    FaReact, FaVuejs, FaAngular, FaNode, FaPython, FaJava, FaPhp, FaSwift, 
    FaDatabase, FaDocker, FaAwsLogo, FaGithub, FaMicrosoft, FaWindows,
    
    SiTypescript, SiJavascript, SiFirebase, SiMongodb, SiGraphql, SiTailwindcss, 
    SiFlutter, SiKotlin, SiSemrush, SiNextdotjs, SiExpress, SiDjango, SiSpring, 
    SiLaravel, SiRuby, SiDotnet, SiGo, SiRust, SiElixir, SiPostgresql, 
    SiMysql, SiRedis, SiElasticsearch, SiKubernetes, SiTerraform, SiAmazon, 
    SiGooglecloud, SiVercel, SiNetlify, SiHeroku, SiDigitalocean
  };
  
  const IconComponent = iconMap[iconName];
  
  if (IconComponent) {
    return <IconComponent size={size} style={style} />;
  }
  
  console.warn(`Icon not found: ${iconName}`);
  return null;
};

export const getDefaultPartnerIcons = (): PartnerLogo[] => [
  { 
    name: "Google", 
    icon: "FaGoogle", 
    color: "#4285F4",
    bgColor: "bg-blue-100",
    certified: true
  },
  { 
    name: "Meta", 
    icon: "FaFacebook", 
    color: "#1877F2",
    bgColor: "bg-blue-100",
    certified: true
  },
  { 
    name: "SEMrush", 
    icon: "SiSemrush", 
    color: "#5FB246",
    bgColor: "bg-green-100",
    certified: true
  },
  { 
    name: "AWS", 
    icon: "FaAws", 
    color: "#FF9900",
    bgColor: "bg-orange-100",
    certified: true
  },
  { 
    name: "Magento", 
    icon: "FaShopify", 
    color: "#7AB55C",
    bgColor: "bg-purple-100",
    certified: true
  },
  { 
    name: "WordPress", 
    icon: "FaWordpress", 
    color: "#21759B",
    bgColor: "bg-blue-100",
    certified: true
  }
];

export const getDefaultTechStackIcons = (): TechIcon[] => [
  { icon: "FaReact", name: "React", color: "#61DAFB", animate: "animate-float" },
  { icon: "SiTypescript", name: "TypeScript", color: "#3178C6", animate: "animate-pulse-soft" },
  { icon: "FaVuejs", name: "Vue.js", color: "#4FC08D", animate: "animate-float" },
  { icon: "FaAngular", name: "Angular", color: "#DD0031", animate: "animate-pulse-soft" },
  { icon: "SiJavascript", name: "JavaScript", color: "#F7DF1E", animate: "animate-float" },
  { icon: "FaNode", name: "Node.js", color: "#339933", animate: "animate-pulse-soft" },
  { icon: "FaPython", name: "Python", color: "#3776AB", animate: "animate-float" },
  { icon: "FaJava", name: "Java", color: "#007396", animate: "animate-pulse-soft" },
  { icon: "FaPhp", name: "PHP", color: "#777BB4", animate: "animate-float" },
  { icon: "SiKotlin", name: "Kotlin", color: "#7F52FF", animate: "animate-pulse-soft" },
  { icon: "FaSwift", name: "Swift", color: "#FA7343", animate: "animate-float" },
  { icon: "SiFlutter", name: "Flutter", color: "#02569B", animate: "animate-pulse-soft" },
  { icon: "SiFirebase", name: "Firebase", color: "#FFCA28", animate: "animate-float" },
  { icon: "SiMongodb", name: "MongoDB", color: "#47A248", animate: "animate-pulse-soft" },
  { icon: "FaDatabase", name: "SQL", color: "#4479A1", animate: "animate-float" },
  { icon: "SiGraphql", name: "GraphQL", color: "#E10098", animate: "animate-pulse-soft" },
  { icon: "SiTailwindcss", name: "Tailwind", color: "#06B6D4", animate: "animate-float" },
  { icon: "FaDocker", name: "Docker", color: "#2496ED", animate: "animate-pulse-soft" },
  { icon: "FaAwsLogo", name: "AWS", color: "#FF9900", animate: "animate-float" },
  { icon: "FaGithub", name: "GitHub", color: "#181717", animate: "animate-pulse-soft" }
];
