
import React from 'react';

/**
 * Utility functions for icon management
 */

/**
 * Convert an SVG string to a data URL
 * @param svgString The SVG content as a string
 * @returns Data URL for the SVG
 */
export const svgToDataUrl = (svgString: string): string => {
  // If it's already a data URL, return it
  if (svgString.startsWith('data:')) {
    return svgString;
  }
  
  // Encode the SVG as a data URL
  const encodedSvg = encodeURIComponent(svgString);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
};

/**
 * Convert a React Icon component name to its component
 * @param iconName The name of the icon (e.g. "FaReact", "SiJavascript")
 * @returns The icon component or null if not found
 */
export const getIconComponentByName = (iconName: string): React.ComponentType<any> | null => {
  // Handle special cases
  if (iconName?.startsWith('data:')) {
    // It's a data URL, not a component name
    return null;
  }
  
  if (!iconName) {
    return null;
  }
  
  // Extract the library prefix (first 2 characters usually) and icon name
  const prefix = iconName.substring(0, 2).toLowerCase();
  
  try {
    // Define the libraries mapping (prefix to package)
    const libraries: Record<string, any> = {
      fa: require('react-icons/fa'),
      si: require('react-icons/si'),
      ai: require('react-icons/ai'),
      bs: require('react-icons/bs'),
      fi: require('react-icons/fi'),
      gr: require('react-icons/gr'),
      hi: require('react-icons/hi'),
      im: require('react-icons/im'),
      md: require('react-icons/md'),
      ti: require('react-icons/ti'),
      vs: require('react-icons/vsc'),
      di: require('react-icons/di'),
      bi: require('react-icons/bi'),
      fc: require('react-icons/fc'),
      io: require('react-icons/io'),
      io5: require('react-icons/io5'),
      ri: require('react-icons/ri'),
      wi: require('react-icons/wi'),
      ci: require('react-icons/ci'),
      gi: require('react-icons/gi'),
      cg: require('react-icons/cg'),
      lu: require('react-icons/lu'),
      pi: require('react-icons/pi'),
      tb: require('react-icons/tb'),
      sl: require('react-icons/sl'),
      rx: require('react-icons/rx'),
      go: require('react-icons/go'),
    };
    
    // Handle special case for Io5 (since it starts with "Io5" not just "Io")
    if (iconName.startsWith('Io5')) {
      return libraries.io5[iconName] || null;
    }
    
    // Get the appropriate library based on the icon name prefix
    const library = libraries[prefix];
    if (!library) {
      console.warn(`Library not found for prefix: ${prefix}`);
      return null;
    }
    
    // Return the icon component
    const component = library[iconName];
    if (!component) {
      console.warn(`Icon not found: ${iconName} in library ${prefix}`);
      return null;
    }
    
    return component;
  } catch (error) {
    console.error(`Failed to load icon: ${iconName}`, error);
    return null;
  }
};

/**
 * Load an SVG from a URL
 * @param url The URL of the SVG or image
 * @returns Promise resolving to the SVG content or data URL
 */
export const loadSvgFromUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    
    // Handle SVG files
    if (contentType?.includes('svg')) {
      return await response.text();
    }
    
    // Handle image files (convert to data URL)
    if (contentType?.includes('image/')) {
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
    
    throw new Error(`Unsupported content type: ${contentType}`);
  } catch (error) {
    console.error('Error loading SVG from URL:', error);
    return null;
  }
};

/**
 * Parse an SVG string to extract viewBox, width, height, etc.
 * @param svgString The SVG content as a string
 * @returns Object with SVG attributes or null if parsing failed
 */
export const parseSvgAttributes = (svgString: string): Record<string, string> | null => {
  try {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) {
      throw new Error('No SVG element found');
    }
    
    const attributes: Record<string, string> = {};
    
    // Extract common attributes
    ['viewBox', 'width', 'height', 'xmlns'].forEach(attr => {
      const value = svgElement.getAttribute(attr);
      if (value) {
        attributes[attr] = value;
      }
    });
    
    return attributes;
  } catch (error) {
    console.error('Error parsing SVG:', error);
    return null;
  }
};

/**
 * Optimize an SVG string (simplified version)
 * For a real implementation, consider using a library like SVGO
 * @param svgString The SVG content as a string
 * @returns Optimized SVG content
 */
export const optimizeSvg = (svgString: string): string => {
  // This is a very simplified version of optimization
  // In a real implementation, use a proper SVG optimization library
  
  // Remove comments
  let optimized = svgString.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove empty attributes
  optimized = optimized.replace(/\s+(\w+)=""/g, '');
  
  // Remove unnecessary whitespace
  optimized = optimized.replace(/>\s+</g, '><');
  
  return optimized;
};

/**
 * Convert an icon to a format that can be rendered
 * @param icon The icon name, component, or data URL
 * @returns Component that can be rendered or null if conversion failed
 */
export const renderIcon = (icon: string | React.ComponentType<any>): React.ComponentType<any> | null => {
  if (!icon) return null;
  
  // If it's already a component, return it
  if (typeof icon === 'function') {
    return icon;
  }
  
  // If it's a component name string, try to get the component
  if (typeof icon === 'string' && !icon.startsWith('data:')) {
    return getIconComponentByName(icon);
  }
  
  // If it's a data URL, return a component that renders an image
  if (typeof icon === 'string' && icon.startsWith('data:')) {
    return (props: any) => React.createElement('img', {
      src: icon,
      alt: "Custom Icon",
      style: { width: props.size || '24px', height: props.size || '24px' },
      ...props
    });
  }
  
  return null;
};

/**
 * Get a catalog of available icons by library
 * @returns A map of library prefixes to arrays of icon names
 */
export const getIconCatalog = (): Record<string, string[]> => {
  try {
    const catalog: Record<string, string[]> = {};
    
    // Define the libraries to catalog
    const libraryPrefixes = [
      'Fa', 'Si', 'Ai', 'Bs', 'Fi', 'Gr', 'Hi', 'Im', 'Md', 'Ti', 
      'Vsc', 'Di', 'Bi', 'Fc', 'Io', 'Io5', 'Ri', 'Wi', 'Ci', 'Gi', 
      'Cg', 'Lu', 'Pi', 'Tb', 'Sl', 'Rx', 'Go'
    ];
    
    // Import each library and extract icon names
    libraryPrefixes.forEach(prefix => {
      try {
        const lowercasePrefix = prefix.toLowerCase();
        const library = require(`react-icons/${lowercasePrefix}`);
        
        // Filter to include only component exports
        const iconNames = Object.keys(library).filter(key => 
          key !== 'default' && typeof library[key] === 'object'
        );
        
        if (iconNames.length > 0) {
          catalog[prefix] = iconNames.map(name => `${prefix}${name}`);
        }
      } catch (error) {
        console.warn(`Failed to load icon library: ${prefix}`, error);
      }
    });
    
    return catalog;
  } catch (error) {
    console.error('Error creating icon catalog:', error);
    return {};
  }
};

/**
 * Search for icons by name in real-time from all available libraries
 * @param query The search query
 * @param limit Maximum number of results to return
 * @returns Array of matching icon objects
 */
export const searchIcons = (query: string, limit = 100): { name: string; library: string }[] => {
  if (!query || query.length < 1) return [];
  
  const results: { name: string; library: string; score: number }[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Map of library prefixes to friendly names
  const libraryNames: Record<string, string> = {
    "Fa": "Font Awesome",
    "Si": "Simple Icons",
    "Ai": "Ant Design Icons",
    "Bs": "Bootstrap Icons",
    "Fi": "Feather Icons",
    "Gr": "Grommet Icons",
    "Hi": "Heroicons",
    "Im": "IcoMoon",
    "Md": "Material Design Icons",
    "Ti": "Typicons",
    "Vsc": "VS Code Icons",
    "Di": "Devicons",
    "Bi": "Box Icons",
    "Fc": "Flat Color Icons",
    "Io": "Ionicons 4",
    "Io5": "Ionicons 5",
    "Ri": "Remix Icons",
    "Wi": "Weather Icons",
    "Ci": "Circle Icons",
    "Gi": "Game Icons",
    "Cg": "CSS.gg",
    "Lu": "Lucide Icons",
    "Pi": "Phosphor Icons",
    "Tb": "Tabler Icons",
    "Sl": "Simple Line Icons",
    "Rx": "Radix Icons",
    "Go": "Github Octicons"
  };
  
  // For debugging
  console.log(`Searching for icons with query: "${query}"`);
  
  // Define libraries and try to load the modules
  const iconLibraries = [
    { prefix: "Fa", module: () => require('react-icons/fa') },
    { prefix: "Si", module: () => require('react-icons/si') },
    { prefix: "Ai", module: () => require('react-icons/ai') },
    { prefix: "Bs", module: () => require('react-icons/bs') },
    { prefix: "Fi", module: () => require('react-icons/fi') },
    { prefix: "Gr", module: () => require('react-icons/gr') },
    { prefix: "Hi", module: () => require('react-icons/hi') },
    { prefix: "Im", module: () => require('react-icons/im') },
    { prefix: "Md", module: () => require('react-icons/md') },
    { prefix: "Ti", module: () => require('react-icons/ti') },
    { prefix: "Vsc", module: () => require('react-icons/vsc') },
    { prefix: "Di", module: () => require('react-icons/di') },
    { prefix: "Bi", module: () => require('react-icons/bi') },
    { prefix: "Fc", module: () => require('react-icons/fc') },
    { prefix: "Io", module: () => require('react-icons/io') },
    { prefix: "Io5", module: () => require('react-icons/io5') },
    { prefix: "Ri", module: () => require('react-icons/ri') },
    { prefix: "Wi", module: () => require('react-icons/wi') },
    { prefix: "Ci", module: () => require('react-icons/ci') },
    { prefix: "Gi", module: () => require('react-icons/gi') },
    { prefix: "Cg", module: () => require('react-icons/cg') },
    { prefix: "Lu", module: () => require('react-icons/lu') },
    { prefix: "Pi", module: () => require('react-icons/pi') },
    { prefix: "Tb", module: () => require('react-icons/tb') },
    { prefix: "Sl", module: () => require('react-icons/sl') },
    { prefix: "Rx", module: () => require('react-icons/rx') },
    { prefix: "Go", module: () => require('react-icons/go') },
  ];
  
  // Process each library
  for (const { prefix, module } of iconLibraries) {
    try {
      const library = libraryNames[prefix] || prefix;
      const iconModule = module();
      
      // Get all exported components from the module
      Object.keys(iconModule).forEach(iconName => {
        // Skip non-component exports
        if (iconName === 'default' || typeof iconModule[iconName] !== 'object') {
          return;
        }
        
        const fullName = `${prefix}${iconName}`;
        const lowerName = fullName.toLowerCase();
        
        // Calculate a relevance score based on the search query
        let score = 0;
        
        // Exact match gets highest score
        if (lowerName === lowerQuery) {
          score = 100;
        }
        // Starting with the query gets high score
        else if (lowerName.startsWith(lowerQuery)) {
          score = 80;
        }
        // Contains the query gets medium score
        else if (lowerName.includes(lowerQuery)) {
          score = 60;
        }
        // Check if individual parts of the name match
        else {
          // Convert camelCase to words for more flexible matching
          const words = iconName.replace(/([A-Z])/g, ' $1').toLowerCase().split(/\s+/);
          for (const word of words) {
            if (word.startsWith(lowerQuery)) {
              score = 40;
              break;
            } else if (word.includes(lowerQuery)) {
              score = 30;
              break;
            }
          }
        }
        
        if (score > 0) {
          results.push({
            name: fullName,
            library,
            score
          });
        }
      });
    } catch (error) {
      console.warn(`Error searching icons in ${prefix}:`, error);
    }
  }
  
  // Sort by relevance score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  // Log the number of results found
  console.log(`Found ${results.length} icons matching "${query}"`);
  
  // Limit and return the results
  return results.slice(0, limit).map(({ name, library }) => ({ name, library }));
};
