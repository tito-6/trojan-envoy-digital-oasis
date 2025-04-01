
import React from 'react';
import * as LucideIcons from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as LuIcons from 'react-icons/lu';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as DiIcons from 'react-icons/di';
import * as GiIcons from 'react-icons/gi';
import * as TiIcons from 'react-icons/ti';
import * as CgIcons from 'react-icons/cg';
import * as RiIcons from 'react-icons/ri';

/**
 * Utility functions for icon management
 */

// Define a map of all imported icon libraries
const iconLibraries: Record<string, Record<string, React.ComponentType<any>>> = {
  Fa: FaIcons as Record<string, React.ComponentType<any>>,
  Si: SiIcons as Record<string, React.ComponentType<any>>,
  Md: MdIcons as Record<string, React.ComponentType<any>>,
  Bs: BsIcons as Record<string, React.ComponentType<any>>,
  Ai: AiIcons as Record<string, React.ComponentType<any>>,
  Bi: BiIcons as Record<string, React.ComponentType<any>>,
  Io: IoIcons as Record<string, React.ComponentType<any>>,
  Io5: Io5Icons as Record<string, React.ComponentType<any>>,
  Di: DiIcons as Record<string, React.ComponentType<any>>,
  Gi: GiIcons as Record<string, React.ComponentType<any>>,
  Ti: TiIcons as Record<string, React.ComponentType<any>>,
  Cg: CgIcons as Record<string, React.ComponentType<any>>,
  Ri: RiIcons as Record<string, React.ComponentType<any>>,
  Lu: {} as Record<string, React.ComponentType<any>> // We'll handle Lucide icons separately
};

// Filter Lucide exports to only include component types
const lucideIconEntries = Object.entries(LucideIcons).filter(([key, value]) => {
  return typeof value === 'function' && key !== 'createLucideIcon' && key !== 'Icon';
});
const lucideIcons = Object.fromEntries(lucideIconEntries) as Record<string, React.ComponentType<any>>;

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
    // Return a function component that renders an image
    return function CustomIcon(props: any) {
      return (
        <img 
          src={iconName}
          alt="Custom Icon"
          className="w-full h-full object-contain"
          style={{ width: props.size || '24px', height: props.size || '24px' }}
          {...props}
        />
      );
    };
  }
  
  // Special case for Io5 (since it starts with "Io5" not just "Io")
  if (iconName.startsWith('Io5')) {
    return Io5Icons[iconName] || null;
  }
  
  // Extract the library prefix (first 2 characters usually) and icon name
  const prefix = iconName.substring(0, 2);
  
  // Try to find the icon in the corresponding library
  const library = iconLibraries[prefix];
  if (library && library[iconName]) {
    return library[iconName];
  }
  
  // If not found in our libraries, check if it's a Lucide icon
  if (lucideIcons[iconName]) {
    return lucideIcons[iconName];
  }
  
  console.warn(`Icon not found: ${iconName}`);
  return null;
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
      className: "w-full h-full object-contain",
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
  
  // Create a list of all available icon names
  // Since we can't dynamically require all icons, we'll use a predefined list for each library
  // This is a simplified approach - in a production app, this might be generated at build time
  
  const commonIcons = [
    // Font Awesome icons
    { prefix: 'Fa', icons: ['FaReact', 'FaAngular', 'FaVuejs', 'FaNode', 'FaNpm', 'FaGithub', 'FaAws', 'FaGoogle', 'FaFacebook', 'FaTwitter', 'FaInstagram', 'FaLinkedin', 'FaYoutube', 'FaAmazon', 'FaApple', 'FaMicrosoft', 'FaSlack', 'FaJira', 'FaWordpress', 'FaShopify', 'FaDocker', 'FaDatabase', 'FaPython', 'FaJava', 'FaPhp', 'FaSwift', 'FaAward'] },
    // Simple Icons
    { prefix: 'Si', icons: ['SiJavascript', 'SiTypescript', 'SiReact', 'SiNextdotjs', 'SiVuedotjs', 'SiAngular', 'SiTailwindcss', 'SiBootstrap', 'SiMongodb', 'SiPostgresql', 'SiMysql', 'SiFirebase', 'SiGraphql', 'SiDocker', 'SiKubernetes', 'SiGooglecloud', 'SiAmazonaws', 'SiMicrosoft', 'SiVercel', 'SiNetlify', 'SiFlutter', 'SiKotlin', 'SiMongodb', 'SiGraphql'] },
    // Lucide Icons
    { prefix: 'Lu', icons: ['LuActivity', 'LuAirplay', 'LuAlertCircle', 'LuAlertOctagon', 'LuAlertTriangle', 'LuAlignCenter', 'LuAlignJustify', 'LuAlignLeft', 'LuAlignRight', 'LuAnchor', 'LuAperture', 'LuArchive', 'LuArrowDown', 'LuArrowLeft', 'LuArrowRight', 'LuArrowUp', 'LuAtSign', 'LuAward', 'LuBarChart', 'LuBattery'] },
    // Material Design Icons
    { prefix: 'Md', icons: ['MdHome', 'MdSettings', 'MdSearch', 'MdPerson', 'MdEmail', 'MdPhone', 'MdLock', 'MdMenu', 'MdClose', 'MdAdd', 'MdRemove', 'MdEdit', 'MdDelete', 'MdCheck', 'MdStar', 'MdFavorite', 'MdShare', 'MdDownload', 'MdUpload', 'MdNotifications'] },
    // Bootstrap Icons
    { prefix: 'Bs', icons: ['BsBootstrap', 'BsGithub', 'BsTwitter', 'BsFacebook', 'BsInstagram', 'BsLinkedin', 'BsGoogle', 'BsYoutube', 'BsSlack', 'BsTwitch', 'BsApple', 'BsAndroid', 'BsWindows', 'BsAmazon', 'BsPaypal', 'BsSpotify', 'BsTelegram', 'BsWhatsapp', 'BsDiscord', 'BsReddit'] },
  ];
  
  // Process each library and search for matching icons
  for (const library of commonIcons) {
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
  
  // Also check actual imported libraries for exact matches
  for (const [prefix, library] of Object.entries(iconLibraries)) {
    const libraryName = libraryNames[prefix] || prefix;
    
    for (const iconName of Object.keys(library)) {
      // Skip non-icon exports
      if (iconName === 'default' || typeof library[iconName] !== 'function') continue;
      
      const lowerName = iconName.toLowerCase();
      let score = 0;
      
      if (lowerName === lowerQuery) {
        score = 100;
      } else if (lowerName.startsWith(lowerQuery)) {
        score = 80;
      } else if (lowerName.includes(lowerQuery)) {
        score = 60;
      } else {
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
      
      if (score > 0 && !results.some(r => r.name === iconName)) {
        results.push({
          name: iconName,
          library: libraryName,
          score
        });
      }
    }
  }
  
  // Sort by relevance score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  // Limit and return the results
  return results.slice(0, limit).map(({ name, library }) => ({ name, library }));
};

/**
 * Get all icons from a specific library
 * @param libraryPrefix The library prefix (e.g., "Fa", "Si")
 * @returns Array of icon objects with name and component
 */
export const getIconsFromLibrary = (libraryPrefix: string): { name: string; component: React.ComponentType<any> }[] => {
  try {
    if (!libraryPrefix) return [];
    
    const library = iconLibraries[libraryPrefix];
    if (!library) {
      console.warn(`Library not found: ${libraryPrefix}`);
      return [];
    }
    
    return Object.entries(library)
      .filter(([key, value]) => key !== 'default' && typeof value === 'function')
      .map(([name, component]) => ({
        name,
        component
      }));
  } catch (error) {
    console.error(`Error getting icons from library ${libraryPrefix}:`, error);
    return [];
  }
};

/**
 * Get a catalog of available icon names
 * @returns A list of icon names by library
 */
export const getIconCatalog = (): string[] => {
  const catalog: string[] = [];
  
  for (const [prefix, library] of Object.entries(iconLibraries)) {
    for (const iconName of Object.keys(library)) {
      if (iconName !== 'default' && typeof library[iconName] === 'function') {
        catalog.push(iconName);
      }
    }
  }
  
  return catalog;
};
