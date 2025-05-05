// src/lib/storage.ts
import { fetchContent, fetchSettings, fetchNavigation } from './api';
import type { 
  ContentItem, ContactRequest, NavigationItem, FooterSettings, 
  HeaderSettings, HeroSettings, FAQSettings, ServicesSettings, 
  AboutSettings, ReferencesSettings, ContactSettings, User 
} from './types';

type EventCallback = (data: any) => void;

class StorageService {
  private eventListeners: Record<string, EventCallback[]> = {};
  private apiBase = '/api';

  constructor() {
    // Initialize event system
    this.eventListeners = {};
  }

  // Event handling
  addEventListener = (eventName: string, callback: EventCallback): (() => void) => {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    
    this.eventListeners[eventName].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.eventListeners[eventName] = this.eventListeners[eventName].filter(cb => cb !== callback);
    };
  };

  dispatchEvent = (eventName: string, data?: any) => {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach(callback => callback(data));
    }
  };

  // API Helpers
  private async apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${this.apiBase}${path}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  private async apiPost<T>(path: string, data: any): Promise<T> {
    const response = await fetch(`${this.apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  // Content Operations
  getContentById = async (id: number): Promise<ContentItem | undefined> => {
    return this.apiGet(`/content/${id}`);
  };

  getContentByType = async (type: string): Promise<ContentItem[]> => {
    return this.apiGet(`/content?type=${encodeURIComponent(type)}`);
  };

  getAllContent = async (): Promise<ContentItem[]> => {
    return this.apiGet('/content');
  };

  // Navigation Operations
  getAllNavigationItems = async (): Promise<NavigationItem[]> => {
    return fetchNavigation();
  };

  // Settings Operations
  getFooterSettings = async (): Promise<FooterSettings> => {
    return fetchSettings('footer_settings');
  };

  getHeaderSettings = async (): Promise<HeaderSettings> => {
    return fetchSettings('header_settings');
  };

  getHeroSettings = async (): Promise<HeroSettings> => {
    return fetchSettings('hero_settings');
  };

  getFAQSettings = async (): Promise<FAQSettings> => {
    return fetchSettings('faq_settings');
  };

  getServicesSettings = async (): Promise<ServicesSettings> => {
    return fetchSettings('services_settings');
  };

  getAboutSettings = async (): Promise<AboutSettings> => {
    return fetchSettings('about_settings');
  };

  getReferencesSettings = async (): Promise<ReferencesSettings> => {
    return fetchSettings('references_settings');
  };

  getContactSettings = async (): Promise<ContactSettings> => {
    return fetchSettings('contact_settings');
  };

  updateContactSettings = async (settings: ContactSettings): Promise<void> => {
    await this.apiPost('/contact-settings', settings);
    this.dispatchEvent('contactSettingsUpdated', settings);
  };

  // User Operations
  getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      return this.apiGet(`/users?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  };
}

// Export a singleton instance of the StorageService
export const storageService = new StorageService();
export default storageService;

// Re-export the API utilities for backward compatibility
