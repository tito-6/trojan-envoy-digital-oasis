
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Upload, Link as LinkIcon } from "lucide-react";
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
import { svgToDataUrl, loadSvgFromUrl } from "@/lib/iconUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce function for search input
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);
  
  useEffect(() => {
    // Get all icons on component mount
    setAllIcons(getAllIconNames());
    
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Filtered icons list with improved real-time suggestions
  const filteredIcons = allIcons.filter(icon => {
    const matchesSearch = searchTerm.length > 0 ? 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesLibrary = selectedLibrary === "all" || icon.library === selectedLibrary;
    return matchesSearch && matchesLibrary;
  });
  
  // For performance, limit the number of icons displayed
  const displayedIcons = filteredIcons.slice(0, 300);
  
  // Handle file upload for custom icons
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Generate a unique name for the uploaded icon
          const timestamp = new Date().getTime();
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
          const iconName = `custom-${fileName}-${timestamp}`;
          
          // Pass the data URL to the parent component
          onSelectIcon(result);
        }
      };
      
      if (file.type.includes('svg')) {
        reader.readAsText(file); // Read SVG as text
      } else {
        reader.readAsDataURL(file); // Read other image types as data URL
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Handle URL import for custom icons
  const handleUrlImport = async () => {
    if (!customIconUrl.trim()) return;
    
    setIsLoadingUrl(true);
    try {
      const svgContent = await loadSvgFromUrl(customIconUrl);
      if (svgContent) {
        // Generate a unique name for the imported icon
        const timestamp = new Date().getTime();
        const urlParts = customIconUrl.split('/');
        const fileName = urlParts[urlParts.length - 1].replace(/\.[^/.]+$/, ""); // Remove file extension
        const iconName = `url-${fileName}-${timestamp}`;
        
        if (svgContent.startsWith('data:')) {
          // Already a data URL
          onSelectIcon(svgContent);
        } else {
          // Convert SVG content to data URL
          const dataUrl = svgToDataUrl(svgContent);
          onSelectIcon(dataUrl);
        }
        
        // Clear the URL input
        setCustomIconUrl("");
      }
    } catch (error) {
      console.error("Error importing icon from URL:", error);
    } finally {
      setIsLoadingUrl(false);
    }
  };
  
  // Handle search input changes with debounce for real-time suggestions
  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
  }, 200);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && displayedIcons.length > 0) {
      e.preventDefault();
      // Focus the first icon element
      const iconElements = document.querySelectorAll('.icon-item');
      if (iconElements.length > 0) {
        (iconElements[0] as HTMLElement).focus();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="library">Icon Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Icon</TabsTrigger>
          <TabsTrigger value="url">Import URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search icons by name..."
                defaultValue={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-8"
                autoComplete="off"
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
                    <TooltipProvider key={name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            tabIndex={0}
                            className={`icon-item flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-primary/10 text-center focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                              isSelected ? "bg-primary/20 ring-2 ring-primary" : ""
                            }`}
                            onClick={() => onSelectIcon(name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectIcon(name);
                              }
                            }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center mb-1">
                              <Icon size={20} />
                            </div>
                            <span className="text-xs truncate w-full">{name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="border rounded-md p-8 text-center text-muted-foreground">
              {searchTerm ? "No icons found matching your search." : "Type to search for icons."}
            </div>
          )}
          
          {filteredIcons.length > 300 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing 300 of {filteredIcons.length} icons. Refine your search to see more specific icons.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-md p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Upload an icon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop or click to upload SVG, PNG, or JPG files
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id="icon-upload"
                accept=".svg,.png,.jpg,.jpeg,.gif"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground"
              >
                Select File
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="icon-url" className="text-sm font-medium">
              Icon URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="icon-url"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  placeholder="https://example.com/icon.svg"
                  className="pl-8"
                />
              </div>
              <Button
                type="button"
                onClick={handleUrlImport}
                disabled={isLoadingUrl || !customIconUrl.trim()}
                className="bg-primary text-primary-foreground"
              >
                {isLoadingUrl ? "Loading..." : "Import"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the URL of an SVG, PNG, or JPG icon to import
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconSelector;
