
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Add a function to get icon by name as a replacement for iconLibrary
export function getIconByName(iconName: string) {
  // This function would normally map icon names to actual icon components
  // For now, we'll return a default icon or null
  return null;
}
