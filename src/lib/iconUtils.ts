
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
 * This is a stub function that would integrate with a more comprehensive solution
 * @param iconName The name of the icon
 * @returns The icon component or null if not found
 */
export const getIconComponentByName = (iconName: string): React.ComponentType<any> | null => {
  try {
    // This would be replaced with actual dynamic loading of components from libraries
    // or a more comprehensive approach to icon management
    const module = require(`react-icons/${iconName.substring(0, 2).toLowerCase()}`);
    return module[iconName] || null;
  } catch (error) {
    console.error(`Failed to load icon: ${iconName}`, error);
    return null;
  }
};

/**
 * Load an SVG from a URL
 * @param url The URL of the SVG
 * @returns Promise resolving to the SVG content or null if failed
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
