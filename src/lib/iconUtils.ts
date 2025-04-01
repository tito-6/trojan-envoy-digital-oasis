
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
  if (iconName.startsWith('data:')) {
    // It's a data URL, not a component name
    return null;
  }
  
  // Dynamic import approach for React Icons
  try {
    // Extract the library prefix (first 2 characters) and icon name
    const prefix = iconName.substring(0, 2).toLowerCase();
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
    
    // Get the appropriate library
    const library = libraries[prefix];
    
    if (!library) {
      return null;
    }
    
    // Return the icon component
    return library[iconName] || null;
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
 * Search for icons by name in real-time from all available libraries
 * @param query The search query
 * @param limit Maximum number of results to return
 * @returns Array of matching icon objects
 */
export const searchIcons = (query: string, limit = 100): { name: string; library: string }[] => {
  if (!query || query.length < 2) return [];
  
  const results: { name: string; library: string; score: number }[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Search through icon libraries
  const iconLibraries = [
    { prefix: "Fa", name: "Font Awesome" },
    { prefix: "Si", name: "Simple Icons" },
    { prefix: "Ai", name: "Ant Design Icons" },
    { prefix: "Bs", name: "Bootstrap Icons" },
    { prefix: "Fi", name: "Feather Icons" },
    { prefix: "Gr", name: "Grommet Icons" },
    { prefix: "Hi", name: "Heroicons" },
    { prefix: "Md", name: "Material Design Icons" },
    // ... add other libraries as needed
  ];
  
  // We'd need to have a complete list of icon names for each library
  // This is a simplified approach - in a real app, you might use a pre-built index
  
  // For each library, find matching icons
  iconLibraries.forEach(lib => {
    // Get all icon names from this library
    const libraryModule = require(`react-icons/${lib.prefix.toLowerCase()}`);
    
    Object.keys(libraryModule).forEach(iconName => {
      // Skip non-icon exports like "default"
      if (iconName === 'default' || typeof libraryModule[iconName] !== 'object') {
        return;
      }
      
      const fullName = `${lib.prefix}${iconName}`;
      const lowerName = fullName.toLowerCase();
      
      // Calculate a relevance score
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
      // Match individual words in the name
      else {
        const words = lowerName.split(/[^a-z0-9]/);
        for (const word of words) {
          if (word.startsWith(lowerQuery)) {
            score = 40;
            break;
          }
        }
      }
      
      if (score > 0) {
        results.push({
          name: fullName,
          library: lib.name,
          score
        });
      }
    });
  });
  
  // Sort by relevance score
  results.sort((a, b) => b.score - a.score);
  
  // Return the top matches
  return results.slice(0, limit).map(({ name, library }) => ({ name, library }));
};
