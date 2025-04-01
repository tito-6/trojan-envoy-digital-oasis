
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import * as Fa from "react-icons/fa";
import * as Si from "react-icons/si";
import * as Ai from "react-icons/ai";
import * as Bs from "react-icons/bs";
import * as Fi from "react-icons/fi";
import * as Gr from "react-icons/gr";
import * as Hi from "react-icons/hi";
import * as Im from "react-icons/im";
import * as Md from "react-icons/md";
import * as Ti from "react-icons/ti";
import * as Vsc from "react-icons/vsc";
import * as Di from "react-icons/di";
import * as Bi from "react-icons/bi";
import * as Fc from "react-icons/fc";
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import * as Ri from "react-icons/ri";
import * as Wi from "react-icons/wi";
import * as Ci from "react-icons/ci";
import * as Gi from "react-icons/gi";
import * as Cg from "react-icons/cg";
import * as Lu from "react-icons/lu";
import * as Pi from "react-icons/pi";
import * as Tb from "react-icons/tb";
import * as Sl from "react-icons/sl";
import * as Rx from "react-icons/rx";
import * as Go from "react-icons/go";

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

// Group icons by their library
const iconLibraries = [
  { prefix: "Fa", icons: Fa, name: "Font Awesome" },
  { prefix: "Si", icons: Si, name: "Simple Icons" },
  { prefix: "Ai", icons: Ai, name: "Ant Design Icons" },
  { prefix: "Bs", icons: Bs, name: "Bootstrap Icons" },
  { prefix: "Fi", icons: Fi, name: "Feather Icons" },
  { prefix: "Gr", icons: Gr, name: "Grommet Icons" },
  { prefix: "Hi", icons: Hi, name: "Heroicons" },
  { prefix: "Im", icons: Im, name: "IcoMoon" },
  { prefix: "Md", icons: Md, name: "Material Design Icons" },
  { prefix: "Ti", icons: Ti, name: "Typicons" },
  { prefix: "Vsc", icons: Vsc, name: "VS Code Icons" },
  { prefix: "Di", icons: Di, name: "Devicons" },
  { prefix: "Bi", icons: Bi, name: "Box Icons" },
  { prefix: "Fc", icons: Fc, name: "Flat Color Icons" },
  { prefix: "Io", icons: Io, name: "Ionicons 4" },
  { prefix: "Io5", icons: Io5, name: "Ionicons 5" },
  { prefix: "Ri", icons: Ri, name: "Remix Icons" },
  { prefix: "Wi", icons: Wi, name: "Weather Icons" },
  { prefix: "Ci", icons: Ci, name: "Circle Icons" },
  { prefix: "Gi", icons: Gi, name: "Game Icons" },
  { prefix: "Cg", icons: Cg, name: "CSS.gg" },
  { prefix: "Lu", icons: Lu, name: "Lucide Icons" },
  { prefix: "Pi", icons: Pi, name: "Phosphor Icons" },
  { prefix: "Tb", icons: Tb, name: "Tabler Icons" },
  { prefix: "Sl", icons: Sl, name: "Simple Line Icons" },
  { prefix: "Rx", icons: Rx, name: "Radix Icons" },
  { prefix: "Go", icons: Go, name: "Github Octicons" },
];

// Function to get all icon names
const getAllIconNames = () => {
  const iconNames: { name: string; component: React.ComponentType<any>; library: string }[] = [];
  
  iconLibraries.forEach(lib => {
    Object.entries(lib.icons).forEach(([name, component]) => {
      // Skip the "default" export
      if (name !== "default" && typeof component === "object") {
        iconNames.push({
          name: `${lib.prefix}${name}`,
          component: component as React.ComponentType<any>,
          library: lib.name
        });
      }
    });
  });
  
  return iconNames;
};

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState<string>("all");
  const [allIcons, setAllIcons] = useState<{ name: string; component: React.ComponentType<any>; library: string }[]>([]);
  
  useEffect(() => {
    // Get all icons on component mount
    setAllIcons(getAllIconNames());
  }, []);
  
  // Filter icons based on search term and selected library
  const filteredIcons = allIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLibrary = selectedLibrary === "all" || icon.library === selectedLibrary;
    return matchesSearch && matchesLibrary;
  });
  
  // For performance, limit the number of icons displayed
  const displayedIcons = filteredIcons.slice(0, 200);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select 
          className="border rounded-md px-3 py-2 text-sm"
          value={selectedLibrary}
          onChange={(e) => setSelectedLibrary(e.target.value)}
        >
          <option value="all">All Libraries</option>
          {iconLibraries.map(lib => (
            <option key={lib.prefix} value={lib.name}>{lib.name}</option>
          ))}
        </select>
      </div>
      
      {displayedIcons.length > 0 ? (
        <ScrollArea className="h-[300px] border rounded-md p-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {displayedIcons.map(({ name, component: Icon }) => {
              const isSelected = selectedIcon === name;
              return (
                <div
                  key={name}
                  className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-primary/10 text-center ${
                    isSelected ? "bg-primary/20 ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onSelectIcon(name)}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-1">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs truncate w-full">{name}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <div className="border rounded-md p-8 text-center text-muted-foreground">
          No icons found matching your search.
        </div>
      )}
      
      {filteredIcons.length > 200 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing 200 of {filteredIcons.length} icons. Refine your search to see more specific icons.
        </p>
      )}
    </div>
  );
};

export default IconSelector;
