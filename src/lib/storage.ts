// src/lib/storage.ts

import { ContentItem, ContactRequest, NavigationItem, FooterLink, FooterSection, FooterSettings, SocialLink, HeaderSettings, HeroSettings, ContactInfoItem, ContactFormField, ContactSettings, ServiceItem, ServicesSettings, AboutSettings, KeyPoint, StatItem, FAQItem, FAQSettings, ClientLogo, ReferencesSettings, User, PartnerLogo, TechIcon } from './types';

const DB_VERSION = '1';
const DB_NAME = 'trojanEnvoyDB';

type EventCallback = (data: any) => void;

interface FAQSettings {
  id: number;
  title: string;
  subtitle: string;
  viewAllText: string;
  viewAllUrl: string;
  faqItems: FAQItem[];
  isActive: boolean;
  showInFooter: boolean;
  lastUpdated: string;
}

class StorageService {
  private db: IDBDatabase | null = null;
  private eventListeners: Record<string, EventCallback[]> = {};

  constructor() {
    this.openDatabase();
  }

  private openDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, parseInt(DB_VERSION));

      request.onerror = (event: any) => {
        console.error("Database error: ", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        console.log("Database opened successfully");
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;

        // Generic content store
        if (!db.objectStoreNames.contains('content')) {
          const contentStore = db.createObjectStore('content', { keyPath: 'id', autoIncrement: true });
          contentStore.createIndex('type', 'type', { unique: false });
          contentStore.createIndex('slug', 'slug', { unique: true });
          contentStore.createIndex('published', 'published', { unique: false });
          contentStore.createIndex('language', 'language', { unique: false });
        }

        // Contact requests store
        if (!db.objectStoreNames.contains('contactRequests')) {
          const contactRequestsStore = db.createObjectStore('contactRequests', { keyPath: 'id', autoIncrement: true });
          contactRequestsStore.createIndex('createdAt', 'createdAt', { unique: false });
          contactRequestsStore.createIndex('status', 'status', { unique: false });
        }

        // Navigation items store
        if (!db.objectStoreNames.contains('navigation')) {
          const navigationStore = db.createObjectStore('navigation', { keyPath: 'id', autoIncrement: true });
          navigationStore.createIndex('order', 'order', { unique: false });
        }

        // Footer settings store
        if (!db.objectStoreNames.contains('footerSettings')) {
          db.createObjectStore('footerSettings', { keyPath: 'id' });
        }

        // Header settings store
        if (!db.objectStoreNames.contains('headerSettings')) {
          db.createObjectStore('headerSettings', { keyPath: 'id' });
        }

        // Hero settings store
        if (!db.objectStoreNames.contains('heroSettings')) {
          db.createObjectStore('heroSettings', { keyPath: 'id' });
        }

        // Contact settings store
        if (!db.objectStoreNames.contains('contactSettings')) {
          db.createObjectStore('contactSettings', { keyPath: 'id' });
        }

        // Services settings store
        if (!db.objectStoreNames.contains('servicesSettings')) {
          db.createObjectStore('servicesSettings', { keyPath: 'id' });
        }

        // About settings store
        if (!db.objectStoreNames.contains('aboutSettings')) {
          db.createObjectStore('aboutSettings', { keyPath: 'id' });
        }

        // FAQ settings store
        if (!db.objectStoreNames.contains('faqSettings')) {
          db.createObjectStore('faqSettings', { keyPath: 'id' });
        }

        // References settings store
        if (!db.objectStoreNames.contains('referencesSettings')) {
          db.createObjectStore('referencesSettings', { keyPath: 'id' });
        }

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
          usersStore.createIndex('isActive', 'isActive', { unique: false });
        }

        console.log("Database upgrade needed");
      };
    });
  };

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

  // --- Generic Content Operations ---
  addContent = (content: Omit<ContentItem, "id">): Promise<ContentItem> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const request = store.add(content);

      request.onsuccess = (evt: any) => {
        const id = evt.target.result;
        const newContent = { id, ...content } as ContentItem;
        resolve(newContent);
        
        // Dispatch event
        this.dispatchEvent('content-updated', newContent);
      };

      request.onerror = (evt: any) => {
        console.error("Error adding content: ", evt.target.error);
        reject(evt.target.error);
      };
    });
  };

  updateContent = (id: number, content: ContentItem): Promise<ContentItem> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const request = store.put({ id, ...content });

      request.onsuccess = () => {
        resolve(content);
        
        // Dispatch event
        this.dispatchEvent('content-updated', content);
      };

      request.onerror = (evt: any) => {
        console.error("Error updating content: ", evt.target.error);
        reject(evt.target.error);
      };
    });
  };

  getContentById = (id: number): Promise<ContentItem | undefined> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const request = store.get(id);

      request.onsuccess = (evt: any) => {
        resolve(evt.target.result as ContentItem | undefined);
      };

      request.onerror = (evt: any) => {
        console.error("Error getting content: ", evt.target.error);
        reject(evt.target.error);
      };
    });
  };

  getContentByType = async (type: string): Promise<ContentItem[]> => {
    // For now, return mock data or empty array
    // This should be adapted to actually fetch from the database
    return [];
  };

  getAllContent = async (): Promise<ContentItem[]> => {
    // For now, return mock data or empty array
    return [];
  };

  deleteContent = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['content'], 'readwrite');
      const store = transaction.objectStore('content');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
        
        // Dispatch event
        this.dispatchEvent('content-deleted', id);
      };

      request.onerror = (evt: any) => {
        console.error("Error deleting content: ", evt.target.error);
        reject(evt.target.error);
      };
    });
  };

  // --- Contact Request Operations ---
  addContactRequest = (contactRequest: Omit<ContactRequest, "id">): Promise<ContactRequest> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['contactRequests'], 'readwrite');
      const store = transaction.objectStore('contactRequests');
      const request = store.add(contactRequest);

      request.onsuccess = (event: any) => {
        const id = event.target.result;
        resolve({ id, ...contactRequest } as ContactRequest);
      };

      request.onerror = (event: any) => {
        console.error("Error adding contact request: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  updateContactRequest = (id: number, contactRequest: ContactRequest): Promise<ContactRequest> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      // First get the existing item
      this.getContactRequestById(id).then(existingItem => {
        if (!existingItem) {
          reject(`Contact request with ID ${id} not found`);
          return;
        }

        const updatedItem = { ...existingItem, ...contactRequest };
        
        const transaction = this.db.transaction(['contactRequests'], 'readwrite');
        const store = transaction.objectStore('contactRequests');
        const request = store.put(updatedItem);

        request.onsuccess = () => {
          resolve(updatedItem);

          // Dispatch a custom event to notify components about the update
          this.dispatchEvent('contact-request-updated', updatedItem);
        };

        request.onerror = (evt: any) => {
          console.error("Error updating contact request: ", evt.target.error);
          reject(evt.target.error);
        };
      }).catch(reject);
    });
  };

  getContactRequestById = (id: number): Promise<ContactRequest | undefined> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['contactRequests'], 'readonly');
      const store = transaction.objectStore('contactRequests');
      const request = store.get(id);

      request.onsuccess = (event: any) => {
        resolve(event.target.result as ContactRequest | undefined);
      };

      request.onerror = (event: any) => {
        console.error("Error getting contact request: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getAllContactRequests = (): Promise<ContactRequest[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['contactRequests'], 'readonly');
      const store = transaction.objectStore('contactRequests');
      const request = store.getAll();

      request.onsuccess = (event: any) => {
        resolve(event.target.result as ContactRequest[]);
      };

      request.onerror = (event: any) => {
        console.error("Error getting all contact requests: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  deleteContactRequest = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['contactRequests'], 'readwrite');
      const store = transaction.objectStore('contactRequests');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event: any) => {
        console.error("Error deleting contact request: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  // --- Navigation Item Operations ---
  addNavigationItem = (navigationItem: Omit<NavigationItem, "id">): Promise<NavigationItem> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['navigation'], 'readwrite');
      const store = transaction.objectStore('navigation');
      const request = store.add({
        ...navigationItem,
        order: navigationItem.order || 0
      });

      request.onsuccess = (evt: any) => {
        const id = evt.target.result;
        const newItem = { id, ...navigationItem } as NavigationItem;
        resolve(newItem);

        // Dispatch a custom event to notify components about the update
        this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
      };

      request.onerror = (evt: any) => {
        console.error("Error adding navigation item: ", evt.target.error);
        reject(evt.target.error);
      };
    });
  };

  updateNavigationItem = (id: number, navigationItem: Partial<NavigationItem>): Promise<NavigationItem> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      // First get the existing item
      this.getNavigationItemById(id).then(existingItem => {
        if (!existingItem) {
          reject(`Navigation item with ID ${id} not found`);
          return;
        }

        const updatedItem = { ...existingItem, ...navigationItem };
        
        const transaction = this.db.transaction(['navigation'], 'readwrite');
        const store = transaction.objectStore('navigation');
        const request = store.put(updatedItem);

        request.onsuccess = () => {
          resolve(updatedItem);

          // Dispatch a custom event to notify components about the update
          this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
        };

        request.onerror = (evt: any) => {
          console.error("Error updating navigation item: ", evt.target.error);
          reject(evt.target.error);
        };
      }).catch(reject);
    });
  };

  getNavigationItemById = (id: number): Promise<NavigationItem | undefined> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['navigation'], 'readonly');
      const store = transaction.objectStore('navigation');
      const request = store.get(id);

      request.onsuccess = (evt: any) => {
        resolve(evt.target.result as NavigationItem | undefined);
      };

      request.onerror = (evt: any) => {
        console.error("Error getting navigation item: ", evt.target.error);
        reject(evt.target.error);
      };
    });
  };

  getAllNavigationItems = async (): Promise<NavigationItem[]> => {
    // For now, return mock data
    return [
      { id: 1, label: 'Home', path: '/', order: 1 },
      { id: 2, label: 'About', path: '/about', order: 2 },
      { id: 3, label: 'Services', path: '/services', order: 3 },
      { id: 4, label: 'Contact', path: '/contact', order: 4 }
    ];
  };

  deleteNavigationItem = (id: number): boolean => {
    // Mock implementation
    console.log(`Deleting navigation item with ID: ${id}`);
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    return true;
  };

  reorderNavigationItems = (items: Array<{ id: number; order: number }>): boolean => {
    // Mock implementation
    console.log("Reordering navigation items:", items);
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    return true;
  };

  // --- Footer Settings Operations ---
  saveFooterSettings = async (footerSettings: Partial<FooterSettings>): Promise<FooterSettings> => {
    const current = await this.getFooterSettings();
    const updated = { ...current, ...footerSettings };
    
    // Mock implementation
    console.log("Saving footer settings:", updated);
    this.dispatchEvent('footer-settings-updated', updated);
    
    return updated;
  };

  // Alias for saveFooterSettings for compatibility
  updateFooterSettings = this.saveFooterSettings;

  getFooterSettings = async (): Promise<FooterSettings> => {
    const defaultSettings = this.getDefaultFooterSettings();
    // Return default settings directly - we'll replace with actual data fetching later
    return defaultSettings;
  };

  private getDefaultFooterSettings = (): FooterSettings => {
    return {
      id: 1,
      companyName: "Trojan Envoy",
      copyrightText: "© 2023 Trojan Envoy. All rights reserved.",
      sections: [],
      socialLinks: [],
      footerSections: [],
      privacyPolicyLink: "/privacy-policy",
      termsOfServiceLink: "/terms-of-service",
      companyInfo: {
        description: "Trojan Envoy is a digital agency...",
        address: "123 Main St, Anytown",
        phone: "555-123-4567",
        email: "info@trojanenvoy.com",
      },
      showSocialLinks: true,
      showBackToTop: true,
      showNewsletter: true,
      lastUpdated: new Date().toISOString(),
    };
  };

  // --- Header Settings Operations ---
  saveHeaderSettings = async (headerSettings: Partial<HeaderSettings>): Promise<HeaderSettings> => {
    const currentSettings = await this.getHeaderSettings();
    const updatedSettings = { ...currentSettings, ...headerSettings };
    
    // For now, just store in localStorage
    localStorage.setItem('headerSettings', JSON.stringify(updatedSettings));
    
    // Dispatch update event
    this.dispatchEvent('header-settings-updated', updatedSettings);
    
    return updatedSettings;
  };

  // Alias for saveHeaderSettings for compatibility
  updateHeaderSettings = this.saveHeaderSettings;

  getHeaderSettings = async (): Promise<HeaderSettings> => {
    const defaultHeaderSettings: HeaderSettings = {
      id: 1,
      siteTitle: "Trojan Envoy",
      logoPath: "/logo.svg",
      contactButtonText: "Contact Us",
      contactButtonPath: "/contact",
      showLanguageSelector: true,
      showThemeToggle: true,
      enabledLanguages: ["en"],
      defaultLanguage: "en",
      mobileMenuLabel: "Menu",
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('headerSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as HeaderSettings;
      } catch (error) {
        console.error("Error parsing header settings from localStorage: ", error);
        return defaultHeaderSettings;
      }
    }

    return defaultHeaderSettings;
  };

  // --- Hero Settings Operations ---
  saveHeroSettings = async (heroSettings: Partial<HeroSettings>): Promise<HeroSettings> => {
    const currentSettings = await this.getHeroSettings();
    const updatedSettings = { ...currentSettings, ...heroSettings };
    
    // For now, just store in localStorage
    localStorage.setItem('heroSettings', JSON.stringify(updatedSettings));
    
    // Dispatch update event
    this.dispatchEvent('hero-settings-updated', updatedSettings);
    
    return updatedSettings;
  };

  // Alias for saveHeroSettings for compatibility
  updateHeroSettings = this.saveHeroSettings;

  getHeroSettings = async (): Promise<HeroSettings> => {
    const defaultHeroSettings: HeroSettings = {
      id: 1,
      title: "We are Trojan Envoy",
      subtitle: "A digital agency",
      description: "We help businesses grow with digital marketing",
      primaryButtonText: "Learn More",
      primaryButtonUrl: "/about",
      secondaryButtonText: "Contact Us",
      secondaryButtonUrl: "/contact",
      showPartnerLogos: true,
      partnerSectionTitle: "Our Partners",
      partnerCertifiedText: "Certified Partners",
      showTechStack: true,
      techStackTitle: "Our Tech Stack",
      techStackSubtitle: "We use the latest technologies",
      techStackDescription: "We are always learning new technologies to stay ahead of the curve",
      partnerLogos: [],
      techIcons: [],
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('heroSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as HeroSettings;
      } catch (error) {
        console.error("Error parsing hero settings from localStorage: ", error);
        return defaultHeroSettings;
      }
    }

    return defaultHeroSettings;
  };

  // Partner Logo methods
  addPartnerLogo = (logo: Omit<PartnerLogo, "id" | "order">): PartnerLogo => {
    const settings = this.getHeroSettings();
    const newLogo: PartnerLogo = {
      id: Date.now(),
      order: settings.then(s => s.partnerLogos.length + 1),
      ...logo
    };
    
    settings.then(s => {
      s.partnerLogos.push(newLogo);
      localStorage.setItem('heroSettings', JSON.stringify(s));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', s);
    });
    
    return newLogo;
  };

  updatePartnerLogo = (id: number, updates: Partial<PartnerLogo>): Promise<PartnerLogo | null> => {
    return this.getHeroSettings().then(settings => {
      const index = settings.partnerLogos.findIndex(logo => logo.id === id);
      
      if (index === -1) return null;
      
      const updatedLogo = { ...settings.partnerLogos[index], ...updates };
      settings.partnerLogos[index] = updatedLogo;
      localStorage.setItem('heroSettings', JSON.stringify(settings));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', settings);
      
      return updatedLogo;
    });
  };

  deletePartnerLogo = (id: number): Promise<boolean> => {
    return this.getHeroSettings().then(settings => {
      const index = settings.partnerLogos.findIndex(logo => logo.id === id);
      
      if (index === -1) return false;
      
      settings.partnerLogos.splice(index, 1);
      
      // Update order values
      settings.partnerLogos.forEach((logo, idx) => {
        logo.order = idx + 1;
      });
      
      localStorage.setItem('heroSettings', JSON.stringify(settings));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', settings);
      
      return true;
    });
  };

  reorderPartnerLogos = (items: Array<{ id: number; order: number }>): Promise<boolean> => {
    return this.getHeroSettings().then(settings => {
      items.forEach(item => {
        const logo = settings.partnerLogos.find(l => l.id === item.id);
        if (logo) {
          logo.order = item.order;
        }
      });
      
      // Sort by order
      settings.partnerLogos.sort((a, b) => a.order - b.order);
      
      localStorage.setItem('heroSettings', JSON.stringify(settings));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', settings);
      
      return true;
    });
  };

  // Tech Icon methods
  addTechIcon = (icon: Omit<TechIcon, "id" | "order">): TechIcon => {
    const settings = this.getHeroSettings();
    const newIcon: TechIcon = {
      id: Date.now(),
      order: settings.then(s => s.techIcons.length + 1),
      ...icon
    };
    
    settings.then(s => {
      s.techIcons.push(newIcon);
      localStorage.setItem('heroSettings', JSON.stringify(s));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', s);
    });
    
    return newIcon;
  };

  updateTechIcon = (id: number, updates: Partial<TechIcon>): Promise<TechIcon | null> => {
    return this.getHeroSettings().then(settings => {
      const index = settings.techIcons.findIndex(icon => icon.id === id);
      
      if (index === -1) return null;
      
      const updatedIcon = { ...settings.techIcons[index], ...updates };
      settings.techIcons[index] = updatedIcon;
      localStorage.setItem('heroSettings', JSON.stringify(settings));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', settings);
      
      return updatedIcon;
    });
  };

  deleteTechIcon = (id: number): Promise<boolean> => {
    return this.getHeroSettings().then(settings => {
      const index = settings.techIcons.findIndex(icon => icon.id === id);
      
      if (index === -1) return false;
      
      settings.techIcons.splice(index, 1);
      
      // Update order values
      settings.techIcons.forEach((icon, idx) => {
        icon.order = idx + 1;
      });
      
      localStorage.setItem('heroSettings', JSON.stringify(settings));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', settings);
      
      return true;
    });
  };

  reorderTechIcons = (items: Array<{ id: number; order: number }>): Promise<boolean> => {
    return this.getHeroSettings().then(settings => {
      items.forEach(item => {
        const icon = settings.techIcons.find(i => i.id === item.id);
        if (icon) {
          icon.order = item.order;
        }
      });
      
      // Sort by order
      settings.techIcons.sort((a, b) => a.order - b.order);
      
      localStorage.setItem('heroSettings', JSON.stringify(settings));
      
      // Dispatch update event
      this.dispatchEvent('hero-settings-updated', settings);
      
      return true;
    });
  };

  // --- Contact Settings Operations ---
  saveContactSettings = async (contactSettings: Partial<ContactSettings>): Promise<ContactSettings> => {
    const currentSettings = await this.getContactSettings();
    const updatedSettings = { ...currentSettings, ...contactSettings };
    
    // For now, just store in localStorage
    localStorage.setItem('contactSettings', JSON.stringify(updatedSettings));
    
    // Dispatch update event
    this.dispatchEvent('contact-settings-updated', updatedSettings);
    
    return updatedSettings;
  };

  // Alias for saveContactSettings for compatibility
  updateContactSettings = this.saveContactSettings;

  getContactSettings = async (): Promise<ContactSettings> => {
    const defaultContactSettings: ContactSettings = {
      id: 1,
      title: "Contact Us",
      subtitle: "Get in touch",
      description: "We'd love to hear from you",
      submitButtonText: "Send Message",
      contactInfoItems: [],
      formFields: [],
      enableRecaptcha: false,
      recaptchaSiteKey: "",
      recaptchaSecretKey: "",
      enableFingerprinting: false,
      enableEmailNotifications: false,
      emailSender: "",
      emailRecipient: "",
      emailSubject: "New Contact Form Submission",
      enableAppointmentScheduling: false,
      appointmentLabel: "Schedule Appointment",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      workingHoursStart: "9:00",
      workingHoursEnd: "17:00",
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('contactSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as ContactSettings;
      } catch (error) {
        console.error("Error parsing contact settings from localStorage: ", error);
        return defaultContactSettings;
      }
    }

    return defaultContactSettings;
  };

  // Added for compatibility
  getContactSettingsFromSupabase = async (): Promise<ContactSettings> => {
    return this.getContactSettings();
  };

  // --- Services Settings Operations ---
  saveServicesSettings = (servicesSettings: Partial<ServicesSettings>): Promise<ServicesSettings> => {
    return new Promise((resolve) => {
      const currentSettings = this.getServicesSettings();
      const updatedSettings = { ...currentSettings, ...servicesSettings };
      
      // For now, just store in localStorage
      localStorage.setItem('servicesSettings', JSON.stringify(updatedSettings));
      
      // Dispatch update event
      this.dispatchEvent('services-settings-updated', updatedSettings);
      
      resolve(updatedSettings);
    });
  };

  // Alias for saveServicesSettings for compatibility
  updateServicesSettings = this.saveServicesSettings;

  getServicesSettings = (): ServicesSettings => {
    const defaultServicesSettings: ServicesSettings = {
      id: 1,
      title: "Our Services",
      subtitle: "What we offer",
      description: "We offer a wide range of services to help businesses grow",
      services: [],
      viewAllText: "View All Services",
      viewAllUrl: "/services",
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('servicesSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as ServicesSettings;
      } catch (error) {
        console.error("Error parsing services settings from localStorage: ", error);
        return defaultServicesSettings;
      }
    }

    return defaultServicesSettings;
  };

  // --- About Settings Operations ---
  saveAboutSettings = async (aboutSettings: Partial<AboutSettings>): Promise<AboutSettings> => {
    const currentSettings = await this.getAboutSettings();
    const updatedSettings = { ...currentSettings, ...aboutSettings };
    
    // For now, just store in localStorage
    localStorage.setItem('aboutSettings', JSON.stringify(updatedSettings));
    
    // Dispatch update event
    this.dispatchEvent('about-settings-updated', updatedSettings);
    
    return updatedSettings;
  };

  getAboutSettings = async (): Promise<AboutSettings> => {
    const defaultAboutSettings: AboutSettings = {
      id: 1,
      title: "About Us",
      subtitle: "Learn more about our company",
      description: "We are a digital agency that helps businesses grow",
      missionTitle: "Our Mission",
      missionDescription: "To help businesses grow with digital marketing",
      visionTitle: "Our Vision",
      visionDescription: "To be the leading digital agency in the world",
      keyPoints: [],
      showStats: true,
      statsTitle: "Our Stats",
      statsSubtitle: "We are proud of our results",
      stats: [],
      teamSectionTitle: "Our Team",
      teamSectionSubtitle: "Meet our team",
      learnMoreText: "Learn More",
      learnMoreUrl: "/about",
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('aboutSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as AboutSettings;
      } catch (error) {
        console.error("Error parsing about settings from localStorage: ", error);
        return defaultAboutSettings;
      }
    }

    return defaultAboutSettings;
  };

  saveKeyPoints = async (keyPoints: KeyPoint[]): Promise<KeyPoint[]> => {
    const settings = await this.getAboutSettings();
    settings.keyPoints = keyPoints;
    
    localStorage.setItem('aboutSettings', JSON.stringify(settings));
    
    // Dispatch update event
    this.dispatchEvent('about-settings-updated', settings);
    
    return keyPoints;
  };

  saveStats = async (stats: StatItem[]): Promise<StatItem[]> => {
    const settings = await this.getAboutSettings();
    settings.stats = stats;
    
    localStorage.setItem('aboutSettings', JSON.stringify(settings));
    
    // Dispatch update event
    this.dispatchEvent('about-settings-updated', settings);
    
    return stats;
  };

  // --- FAQ Settings Operations ---
  saveFAQSettings = (faqSettings: Partial<FAQSettings>): Promise<FAQSettings> => {
    return new Promise((resolve) => {
      const currentSettings = this.getFAQSettings();
      const updatedSettings = { ...currentSettings, ...faqSettings };
      
      // For now, just store in localStorage
      localStorage.setItem('faqSettings', JSON.stringify(updatedSettings));
      
      // Dispatch update event
      this.dispatchEvent('faq-settings-updated', updatedSettings);
      
      resolve(updatedSettings);
    });
  };

  getFAQSettings = (): FAQSettings => {
    const defaultFAQSettings: FAQSettings = {
      id: 1,
      title: "Frequently Asked Questions",
      subtitle: "Have questions? We've got answers!",
      description: "Find answers to common questions about our services and company.",
      faqItems: [],
      enableSearch: boolean,
      enableCategories: boolean,
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('faqSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as FAQSettings;
      } catch (error) {
        console.error("Error parsing FAQ settings from localStorage: ", error);
        return defaultFAQSettings;
      }
    }

    return defaultFAQSettings;
  };
}

// Export a singleton instance of the StorageService
export const storageService = new StorageService();
