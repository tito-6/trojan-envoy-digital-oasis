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
  // Return null for empty inputs
  if (!iconName) {
    return null;
  }
  
  // Handle data URLs (custom uploaded icons)
  if (iconName.startsWith('data:')) {
    return (props: any) => React.createElement('img', {
      src: iconName,
      alt: "Custom Icon",
      style: { width: props.size || '24px', height: props.size || '24px' },
      ...props
    });
  }
  
  // Extract the library prefix (first 2 characters usually) and icon name
  const prefix = iconName.substring(0, 2).toLowerCase();
  
  // Import the relevant library dynamically
  try {
    let iconComponent = null;
    
    // Special case for Io5 (since it starts with "Io5" not just "Io")
    if (iconName.startsWith('Io5')) {
      const Io5Icons = require('react-icons/io5');
      iconComponent = Io5Icons[iconName];
    } else {
      // Map of prefixes to libraries
      const libraryMap: Record<string, string> = {
        fa: 'fa', si: 'si', ai: 'ai', bs: 'bs', fi: 'fi',
        gr: 'gr', hi: 'hi', im: 'im', md: 'md', ti: 'ti',
        vs: 'vsc', di: 'di', bi: 'bi', fc: 'fc', io: 'io',
        ri: 'ri', wi: 'wi', ci: 'ci', gi: 'gi', cg: 'cg',
        lu: 'lu', pi: 'pi', tb: 'tb', sl: 'sl', rx: 'rx',
        go: 'go',
      };
      
      const libraryName = libraryMap[prefix];
      if (!libraryName) {
        console.warn(`Library not found for prefix: ${prefix}`);
        return null;
      }
      
      // Import the library
      const iconLibrary = require(`react-icons/${libraryName}`);
      iconComponent = iconLibrary[iconName];
    }
    
    if (!iconComponent) {
      console.warn(`Icon not found: ${iconName}`);
      return null;
    }
    
    return iconComponent;
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
  
  // If it's a data URL, return a component that renders an image
  if (typeof icon === 'string' && icon.startsWith('data:')) {
    return (props: any) => React.createElement('img', {
      src: icon,
      alt: "Custom Icon",
      style: { width: props.size || '24px', height: props.size || '24px' },
      ...props
    });
  }
  
  // If it's a component name string, try to get the component
  if (typeof icon === 'string') {
    return getIconComponentByName(icon);
  }
  
  return null;
};

/**
 * Search for icons by name in real-time using client-side filtering
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
  
  // Create a list of all available icon names from react-icons
  const allIcons = [
    // Font Awesome icons
    { prefix: 'Fa', icons: ['FaReact', 'FaAngular', 'FaVuejs', 'FaNode', 'FaNpm', 'FaGithub', 'FaAws', 'FaGoogle', 'FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'FaAmazon', 'FaApple', 'FaMicrosoft', 'FaSlack', 'FaJira', 'FaWordpress', 'FaShopify'] },
    // Simple Icons
    { prefix: 'Si', icons: ['SiJavascript', 'SiTypescript', 'SiReact', 'SiNextdotjs', 'SiVuedotjs', 'SiAngular', 'SiTailwindcss', 'SiBootstrap', 'SiMongodb', 'SiPostgresql', 'SiMysql', 'SiFirebase', 'SiGraphql', 'SiDocker', 'SiKubernetes', 'SiGooglecloud', 'SiAmazonaws', 'SiMicrosoft', 'SiVercel', 'SiNetlify'] },
    // Lucide Icons
    { prefix: 'Lu', icons: ['LuActivity', 'LuAirplay', 'LuAlertCircle', 'LuAlertOctagon', 'LuAlertTriangle', 'LuAlignCenter', 'LuAlignJustify', 'LuAlignLeft', 'LuAlignRight', 'LuAnchor', 'LuAperture', 'LuArchive', 'LuArrowDown', 'LuArrowLeft', 'LuArrowRight', 'LuArrowUp', 'LuAtSign', 'LuAward', 'LuBarChart', 'LuBattery'] },
    // Material Design Icons
    { prefix: 'Md', icons: ['MdHome', 'MdSettings', 'MdSearch', 'MdPerson', 'MdEmail', 'MdPhone', 'MdLock', 'MdMenu', 'MdClose', 'MdAdd', 'MdRemove', 'MdEdit', 'MdDelete', 'MdCheck', 'MdStar', 'MdFavorite', 'MdShare', 'MdDownload', 'MdUpload', 'MdNotifications'] },
    // Bootstrap Icons
    { prefix: 'Bs', icons: ['BsBootstrap', 'BsGithub', 'BsTwitter', 'BsFacebook', 'BsInstagram', 'BsLinkedin', 'BsGoogle', 'BsYoutube', 'BsSlack', 'BsTwitch', 'BsApple', 'BsAndroid', 'BsWindows', 'BsAmazon', 'BsPaypal', 'BsSpotify', 'BsTelegram', 'BsWhatsapp', 'BsDiscord', 'BsReddit'] },
  ];
  
  // Process each library and search for matching icons
  for (const library of allIcons) {
    const libraryName = libraryNames[library.prefix] || library.prefix;
    
    for (const iconName of library.icons) {
      const fullName = iconName;
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
          library: libraryName,
          score
        });
      }
    }
  }
  
  // Sort by relevance score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  // Log the number of results found
  console.log(`Found ${results.length} icons matching "${query}"`);
  
  // Limit and return the results
  return results.slice(0, limit).map(({ name, library }) => ({ name, library }));
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
          catalog[prefix] = iconNames;
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
 * Get all icons from a specific library
 * @param libraryPrefix The library prefix (e.g., "Fa", "Si")
 * @returns Array of icon objects with name and component
 */
export const getIconsFromLibrary = (libraryPrefix: string): { name: string; component: React.ComponentType<any> }[] => {
  try {
    if (!libraryPrefix) return [];
    
    const lowercasePrefix = libraryPrefix.substring(0, 2).toLowerCase();
    let library;
    
    try {
      library = require(`react-icons/${lowercasePrefix}`);
    } catch (error) {
      console.warn(`Failed to load icon library: ${libraryPrefix}`, error);
      return [];
    }
    
    const icons = Object.keys(library)
      .filter(key => key !== 'default' && typeof library[key] === 'object')
      .map(name => ({
        name: libraryPrefix + name,
        component: library[name]
      }));
    
    return icons;
  } catch (error) {
    console.error(`Error getting icons from library ${libraryPrefix}:`, error);
    return [];
  }
};
