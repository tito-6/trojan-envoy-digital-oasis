
import React, { useState, useEffect, useRef } from "react";
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
  const [uploadedIcon, setUploadedIcon] = useState<string | null>(null);

  // Function to handle the search input changes with real-time results
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      // If search is cleared, show some default icons
      if (activeTab === "library") {
        performSearch("icon");
      }
      return;
    }
    
    performSearch(value);
  };
  
  // Perform the actual search
  const performSearch = (query: string) => {
    setIsSearching(true);
    
    try {
      // Use the searchIcons utility to get matching icons
      const results = searchIcons(query, 300);
      
      // Filter by selected library if needed
      const filteredResults = selectedLibrary !== "all" 
        ? results.filter(icon => icon.library === selectedLibrary)
        : results;
      
      // Convert search results to the format expected by the component
      const formattedResults = filteredResults.map(({ name, library }) => {
        const component = getIconComponentByName(name);
        return {
          name,
          component: component || (() => <div>Icon not found</div>),
          library
        };
      }).filter(icon => icon.component);
      
      setFilteredIcons(formattedResults);
    } catch (error) {
      console.error("Error searching icons:", error);
      setFilteredIcons([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Apply library filter when it changes
  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else if (activeTab === "library") {
      performSearch("icon"); // Show some default icons
    }
  }, [selectedLibrary]);
  
  // Display initial icons when the component mounts
  useEffect(() => {
    if (activeTab === "library") {
      performSearch("icon"); // Show some default icons on mount
    }
  }, []);
  
  // Focus the search input when tab changes to library
  useEffect(() => {
    if (activeTab === "library" && searchInputRef.current) {
      searchInputRef.current.focus();
      
      // Show some default icons when the tab is opened
      if (!searchTerm) {
        performSearch("icon");
      } else {
        performSearch(searchTerm);
      }
    }
  }, [activeTab]);

  // Handle file upload for custom icons
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Check if file is an image or SVG
      if (!file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or SVG file.",
          variant: "destructive"
        });
        return;
      }

      // Read the file as a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedIcon(result);
          // We're directly setting the result as the icon - this is a data URL
          onSelectIcon(result);
          
          toast({
            title: "Icon uploaded successfully",
            description: `${file.name} has been selected`,
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
    }
    
    // Reset the file input but not the uploaded icon
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
        if (svgContent.startsWith('data:')) {
          // Already a data URL
          setUploadedIcon(svgContent);
          onSelectIcon(svgContent);
        } else {
          // Convert SVG content to data URL
          const dataUrl = svgToDataUrl(svgContent);
          setUploadedIcon(dataUrl);
          onSelectIcon(dataUrl);
        }
        
        toast({
          title: "Icon imported successfully",
          description: "The icon has been selected",
        });
        
        // Clear the URL input
        setCustomIconUrl("");
      } else {
        throw new Error("Failed to load icon from URL");
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
              description: `${jsonData.iconName} has been selected`,
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
          setUploadedIcon(dataUrl);
          onSelectIcon(dataUrl);
          
          toast({
            title: "Icon imported successfully",
            description: "The custom SVG icon has been selected",
          });
          
          // Clear the JSON input
          setCustomJsonInput("");
          setIsJsonValid(true);
          setJsonErrorMessage("");
          return;
        }
        
        // If it's a valid data URL
        if (typeof jsonData.dataUrl === 'string' && jsonData.dataUrl.startsWith('data:')) {
          setUploadedIcon(jsonData.dataUrl);
          onSelectIcon(jsonData.dataUrl);
          
          toast({
            title: "Icon imported successfully",
            description: "The icon has been selected",
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
  
  // Function to check if an icon is the selected one - handles both named icons and data URLs
  const isIconSelected = (iconValue: string) => {
    if (selectedIcon.startsWith('data:') && iconValue.startsWith('data:')) {
      return selectedIcon === iconValue;
    }
    
    return selectedIcon === iconValue;
  };
  
  // Function to render a preview of the currently selected icon
  const renderSelectedIconPreview = () => {
    if (!selectedIcon) return null;
    
    if (selectedIcon.startsWith('data:')) {
      return (
        <div className="flex items-center justify-center mb-4 p-2 border rounded-md bg-muted">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <img src={selectedIcon} alt="Selected Icon" className="max-w-full max-h-full" />
            </div>
            <p className="text-xs text-muted-foreground">Custom Icon Selected</p>
          </div>
        </div>
      );
    }
    
    const IconComponent = getIconComponentByName(selectedIcon);
    if (IconComponent) {
      return (
        <div className="flex items-center justify-center mb-4 p-2 border rounded-md bg-muted">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <IconComponent size={32} />
            </div>
            <p className="text-xs font-medium">{selectedIcon}</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      {renderSelectedIconPreview()}
      
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
              <option value="Font Awesome">Font Awesome</option>
              <option value="Simple Icons">Simple Icons</option>
              <option value="Ant Design Icons">Ant Design</option>
              <option value="Bootstrap Icons">Bootstrap</option>
              <option value="Material Design Icons">Material Design</option>
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
                {filteredIcons.map(({ name, component: Icon, library }) => (
                  <TooltipProvider key={name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          tabIndex={0}
                          className={`icon-item flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-primary/10 text-center focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            isIconSelected(name) ? "bg-primary/20 ring-2 ring-primary" : ""
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
                        <p className="text-xs text-muted-foreground">{library}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
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
          
          {uploadedIcon && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <div className="text-center">
                <h4 className="text-sm font-medium mb-2">Uploaded Icon Preview</h4>
                <div className="w-16 h-16 mx-auto rounded-md bg-white flex items-center justify-center">
                  <img src={uploadedIcon} alt="Uploaded icon" className="max-w-full max-h-full" />
                </div>
                <Button 
                  className="mt-4 bg-primary text-primary-foreground" 
                  onClick={() => onSelectIcon(uploadedIcon)}
                >
                  Use This Icon
                </Button>
              </div>
            </div>
          )}
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
