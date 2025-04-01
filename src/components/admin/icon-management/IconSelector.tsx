
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Upload, Link as LinkIcon, Code } from "lucide-react";
import { svgToDataUrl, loadSvgFromUrl, searchIcons, getIconComponentByName } from "@/lib/iconUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState<string>("all");
  const [filteredIcons, setFilteredIcons] = useState<{ name: string; component: React.ComponentType<any>; library: string }[]>([]);
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [customJsonInput, setCustomJsonInput] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [jsonErrorMessage, setJsonErrorMessage] = useState("");

  // Handle search input changes with debounce for real-time suggestions
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsSearching(true);
    
    // Perform the search using the utility function
    try {
      const results = searchIcons(value, 300);
      
      // Convert search results to the format expected by the component
      const formattedResults = results.map(({ name, library }) => ({
        name,
        component: getIconComponentByName(name) || (() => null),
        library
      })).filter(icon => icon.component);
      
      setFilteredIcons(formattedResults);
    } catch (error) {
      console.error("Error searching icons:", error);
      setFilteredIcons([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const debouncedSearchChange = useCallback(
    (callback: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
      };
    },
    []
  )(handleSearchChange, 300);

  // Focus the search input when tab changes to library
  useEffect(() => {
    if (activeTab === "library" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeTab]);

  // Initial search to show some icons
  useEffect(() => {
    if (activeTab === "library" && searchTerm === "") {
      debouncedSearchChange("a");
    }
  }, [activeTab]);

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
          
          toast({
            title: "Icon uploaded successfully",
            description: `${file.name} has been added to your selection`,
          });
        }
      };
      
      if (file.type.includes('svg')) {
        reader.readAsText(file); // Read SVG as text
      } else {
        reader.readAsDataURL(file); // Read other image types as data URL
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
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
        
        toast({
          title: "Icon imported successfully",
          description: "The icon has been added to your selection",
        });
        
        // Clear the URL input
        setCustomIconUrl("");
      }
    } catch (error) {
      console.error("Error importing icon from URL:", error);
      toast({
        title: "Import failed",
        description: "There was an error importing the icon from the URL",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUrl(false);
    }
  };

  // Handle JSON import for custom icons
  const handleJsonImport = () => {
    if (!customJsonInput.trim()) return;
    
    try {
      // Try to parse the JSON
      const jsonData = JSON.parse(customJsonInput);
      
      // Check if it's a valid icon configuration
      if (typeof jsonData === 'object') {
        // If it's a valid icon name
        if (typeof jsonData.iconName === 'string' && jsonData.iconName) {
          const icon = getIconComponentByName(jsonData.iconName);
          if (icon) {
            onSelectIcon(jsonData.iconName);
            
            toast({
              title: "Icon imported successfully",
              description: `${jsonData.iconName} has been added to your selection`,
            });
            
            // Clear the JSON input
            setCustomJsonInput("");
            setIsJsonValid(true);
            setJsonErrorMessage("");
            return;
          }
        }
        
        // If it's a valid SVG string
        if (typeof jsonData.svg === 'string' && jsonData.svg) {
          const dataUrl = svgToDataUrl(jsonData.svg);
          onSelectIcon(dataUrl);
          
          toast({
            title: "Icon imported successfully",
            description: "The custom SVG icon has been added to your selection",
          });
          
          // Clear the JSON input
          setCustomJsonInput("");
          setIsJsonValid(true);
          setJsonErrorMessage("");
          return;
        }
        
        // If it's a valid data URL
        if (typeof jsonData.dataUrl === 'string' && jsonData.dataUrl.startsWith('data:')) {
          onSelectIcon(jsonData.dataUrl);
          
          toast({
            title: "Icon imported successfully",
            description: "The icon has been added to your selection",
          });
          
          // Clear the JSON input
          setCustomJsonInput("");
          setIsJsonValid(true);
          setJsonErrorMessage("");
          return;
        }
      }
      
      // If we reached here, the JSON is valid but not a valid icon configuration
      setIsJsonValid(false);
      setJsonErrorMessage("Valid JSON but invalid icon configuration. Use { \"iconName\": \"FaReact\" } or { \"svg\": \"<svg>...</svg>\" } or { \"dataUrl\": \"data:...\" }");
    } catch (error) {
      // JSON is invalid
      setIsJsonValid(false);
      setJsonErrorMessage("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && filteredIcons.length > 0) {
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
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="library">Icon Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Icon</TabsTrigger>
          <TabsTrigger value="url">Import URL</TabsTrigger>
          <TabsTrigger value="json">JSON Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search icons by name..."
                onChange={(e) => debouncedSearchChange(e.target.value)}
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
              <option value="Font Awesome">Font Awesome</option>
              <option value="Simple Icons">Simple Icons</option>
              <option value="Ant Design Icons">Ant Design</option>
              <option value="Bootstrap Icons">Bootstrap</option>
              <option value="Feather Icons">Feather</option>
              <option value="Material Design Icons">Material Design</option>
              <option value="Heroicons">Heroicons</option>
              <option value="Lucide Icons">Lucide</option>
            </select>
          </div>
          
          {isSearching ? (
            <div className="border rounded-md p-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : filteredIcons.length > 0 ? (
            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {filteredIcons.map(({ name, component: Icon }) => {
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
          
          {filteredIcons.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing {filteredIcons.length} icons. 
              {searchTerm ? " Refine your search to see different icons." : " Type to search for specific icons."}
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
        
        <TabsContent value="json" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="json-import" className="text-sm font-medium">
              Import Icon via JSON
            </label>
            <div className="space-y-4">
              <Textarea
                id="json-import"
                value={customJsonInput}
                onChange={(e) => {
                  setCustomJsonInput(e.target.value);
                  setIsJsonValid(true);
                  setJsonErrorMessage("");
                }}
                placeholder={`{
  "iconName": "FaReact"
}

or

{
  "svg": "<svg>...</svg>"
}

or

{
  "dataUrl": "data:image/svg+xml;..."
}`}
                className={`h-36 font-mono text-sm ${!isJsonValid ? 'border-red-500' : ''}`}
              />
              
              {!isJsonValid && (
                <Alert variant="destructive" className="text-red-500 bg-red-50">
                  <AlertDescription>{jsonErrorMessage}</AlertDescription>
                </Alert>
              )}
              
              <Button
                type="button"
                onClick={handleJsonImport}
                disabled={!customJsonInput.trim()}
                className="bg-primary text-primary-foreground"
              >
                <Code className="w-4 h-4 mr-2" /> Import from JSON
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste JSON configuration for an icon. You can use an iconName from React Icons, custom SVG content, or a data URL.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconSelector;
