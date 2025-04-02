
// src/lib/storage.ts

import { ContentItem, ContactRequest, NavigationItem, FooterLink, FooterSection, FooterSettings, SocialLink, HeaderSettings, HeroSettings, ContactInfoItem, ContactFormField, ContactSettings, ServiceItem, ServicesSettings, AboutSettings, KeyPoint, StatItem, FAQItem, FAQSettings, ClientLogo, ReferencesSettings, User } from './types';

const DB_VERSION = '1';
const DB_NAME = 'trojanEnvoyDB';

class StorageService {
  private db: IDBDatabase | null = null;

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

      request.onsuccess = (event: any) => {
        const id = event.target.result;
        resolve({ id, ...content } as ContentItem);
      };

      request.onerror = (event: any) => {
        console.error("Error adding content: ", event.target.error);
        reject(event.target.error);
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
      };

      request.onerror = (event: any) => {
        console.error("Error updating content: ", event.target.error);
        reject(event.target.error);
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

      request.onsuccess = (event: any) => {
        resolve(event.target.result as ContentItem | undefined);
      };

      request.onerror = (event: any) => {
        console.error("Error getting content: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getContentByType = (type: string): Promise<ContentItem[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = (event: any) => {
        resolve(event.target.result as ContentItem[]);
      };

      request.onerror = (event: any) => {
        console.error("Error getting content by type: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getAllContent = (): Promise<ContentItem[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const request = store.getAll();

      request.onsuccess = (event: any) => {
        resolve(event.target.result as ContentItem[]);
      };

      request.onerror = (event: any) => {
        console.error("Error getting all content: ", event.target.error);
        reject(event.target.error);
      };
    });
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
      };

      request.onerror = (event: any) => {
        console.error("Error deleting content: ", event.target.error);
        reject(event.target.error);
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

      const transaction = this.db.transaction(['contactRequests'], 'readwrite');
      const store = transaction.objectStore('contactRequests');
      const request = store.put({ id, ...contactRequest });

      request.onsuccess = () => {
        resolve(contactRequest);
      };

      request.onerror = (event: any) => {
        console.error("Error updating contact request: ", event.target.error);
        reject(event.target.error);
      };
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
      const request = store.add(navigationItem);

      request.onsuccess = (event: any) => {
        const id = event.target.result;
        resolve({ id, ...navigationItem } as NavigationItem);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('navigation-updated');
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error adding navigation item: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  updateNavigationItem = (id: number, navigationItem: NavigationItem): Promise<NavigationItem> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['navigation'], 'readwrite');
      const store = transaction.objectStore('navigation');
      const request = store.put({ id, ...navigationItem });

      request.onsuccess = () => {
        resolve(navigationItem);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('navigation-updated');
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error updating navigation item: ", event.target.error);
        reject(event.target.error);
      };
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

      request.onsuccess = (event: any) => {
        resolve(event.target.result as NavigationItem | undefined);
      };

      request.onerror = (event: any) => {
        console.error("Error getting navigation item: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getAllNavigationItems = (): Promise<NavigationItem[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['navigation'], 'readonly');
      const store = transaction.objectStore('navigation');
      const request = store.getAll();

      request.onsuccess = (event: any) => {
        resolve(event.target.result as NavigationItem[]);
      };

      request.onerror = (event: any) => {
        console.error("Error getting all navigation items: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  deleteNavigationItem = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['navigation'], 'readwrite');
      const store = transaction.objectStore('navigation');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('navigation-updated');
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error deleting navigation item: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  // --- Footer Settings Operations ---
  saveFooterSettings = (footerSettings: FooterSettings): Promise<FooterSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['footerSettings'], 'readwrite');
      const store = transaction.objectStore('footerSettings');
      const request = store.put(footerSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(footerSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('footer-settings-updated', { detail: footerSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving footer settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getFooterSettings = (): Promise<FooterSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['footerSettings'], 'readonly');
      const store = transaction.objectStore('footerSettings');
      const request = store.get(1); // Use the same fixed key (1) to retrieve settings

      request.onsuccess = (event: any) => {
        const settings = event.target.result as FooterSettings;
        resolve(settings || this.getDefaultFooterSettings()); // Return settings or default
      };

      request.onerror = (event: any) => {
        console.error("Error getting footer settings: ", event.target.error);
        reject(event.target.error);
      };
    });
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
  saveHeaderSettings = (headerSettings: HeaderSettings): Promise<HeaderSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['headerSettings'], 'readwrite');
      const store = transaction.objectStore('headerSettings');
      const request = store.put(headerSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(headerSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('header-settings-updated', { detail: headerSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving header settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getHeaderSettings = (): HeaderSettings => {
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
  saveHeroSettings = (heroSettings: HeroSettings): Promise<HeroSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['heroSettings'], 'readwrite');
      const store = transaction.objectStore('heroSettings');
      const request = store.put(heroSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(heroSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('hero-settings-updated', { detail: heroSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving hero settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getHeroSettings = (): HeroSettings => {
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

  // --- Contact Settings Operations ---
  saveContactSettings = (contactSettings: ContactSettings): Promise<ContactSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['contactSettings'], 'readwrite');
      const store = transaction.objectStore('contactSettings');
      const request = store.put(contactSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(contactSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('contact-settings-updated', { detail: contactSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving contact settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getContactSettings = (): ContactSettings => {
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

  // --- Services Settings Operations ---
  saveServicesSettings = (servicesSettings: ServicesSettings): Promise<ServicesSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['servicesSettings'], 'readwrite');
      const store = transaction.objectStore('servicesSettings');
      const request = store.put(servicesSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(servicesSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('services-settings-updated', { detail: servicesSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving services settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

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
  saveAboutSettings = (aboutSettings: AboutSettings): Promise<AboutSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['aboutSettings'], 'readwrite');
      const store = transaction.objectStore('aboutSettings');
      const request = store.put(aboutSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(aboutSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('about-settings-updated', { detail: aboutSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving about settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getAboutSettings = (): AboutSettings => {
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

  saveKeyPoints = (keyPoints: KeyPoint[]): Promise<KeyPoint[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      // Assuming you want to store key points as part of aboutSettings
      this.getAboutSettings().then(aboutSettings => {
        const updatedSettings: AboutSettings = { ...aboutSettings, keyPoints: keyPoints };
        this.saveAboutSettings(updatedSettings).then(() => {
          resolve(keyPoints);
        }).catch(error => {
          console.error("Error saving key points: ", error);
          reject(error);
        });
      }).catch(error => {
        console.error("Error getting about settings: ", error);
        reject(error);
      });
    });
  };

  saveStats = (stats: StatItem[]): Promise<StatItem[]> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      // Assuming you want to store stats as part of aboutSettings
      this.getAboutSettings().then(aboutSettings => {
        const updatedSettings: AboutSettings = { ...aboutSettings, stats: stats };
        this.saveAboutSettings(updatedSettings).then(() => {
          resolve(stats);
        }).catch(error => {
          console.error("Error saving stats: ", error);
          reject(error);
        });
      }).catch(error => {
        console.error("Error getting about settings: ", error);
        reject(error);
      });
    });
  };

  // --- FAQ Settings Operations ---
  saveFAQSettings = (faqSettings: FAQSettings): Promise<FAQSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['faqSettings'], 'readwrite');
      const store = transaction.objectStore('faqSettings');
      const request = store.put(faqSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(faqSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('faq-settings-updated', { detail: faqSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving faq settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getFAQSettings = (): FAQSettings => {
    const defaultFAQSettings: FAQSettings = {
      id: 1,
      title: "Frequently Asked Questions",
      subtitle: "Have questions? We've got answers!",
      description: "Find answers to common questions about our services and company.",
      faqItems: [],
      enableSearch: true,
      enableCategories: true,
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('faqSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as FAQSettings;
      } catch (error) {
        console.error("Error parsing faq settings from localStorage: ", error);
        return defaultFAQSettings;
      }
    }

    return defaultFAQSettings;
  };

  // --- References Settings Operations ---
  saveReferencesSettings = (referencesSettings: ReferencesSettings): Promise<ReferencesSettings> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("Database not initialized");
        return;
      }

      const transaction = this.db.transaction(['referencesSettings'], 'readwrite');
      const store = transaction.objectStore('referencesSettings');
      const request = store.put(referencesSettings, 1); // Use a fixed key (1) to store settings

      request.onsuccess = () => {
        resolve(referencesSettings);

        // Dispatch a custom event to notify components about the update
        const event = new CustomEvent('references-settings-updated', { detail: referencesSettings });
        window.dispatchEvent(event);
      };

      request.onerror = (event: any) => {
        console.error("Error saving references settings: ", event.target.error);
        reject(event.target.error);
      };
    });
  };

  getReferencesSettings = (): ReferencesSettings => {
    const defaultReferencesSettings: ReferencesSettings = {
      id: 1,
      title: "Our Clients",
      subtitle: "We work with amazing companies",
      description: "These are some of the companies we have worked with in the past",
      clientLogos: [],
      testimonialsSectionTitle: "What Our Clients Say",
      testimonialsSectionSubtitle: "Testimonials from our clients",
      lastUpdated: new Date().toISOString(),
    };

    // Retrieve settings from localStorage
    const storedSettings = localStorage.getItem('referencesSettings');
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings) as ReferencesSettings;
      } catch (error) {
        console.error("Error parsing references settings from localStorage: ", error);
        return defaultReferencesSettings;
      }
    }

    return defaultReferencesSettings;
  };
  
  // Add client logo
  addClientLogo = (logo: Omit<ClientLogo, "id" | "order">): Promise<ClientLogo> => {
    return new Promise((resolve, reject) => {
      try {
        const settings = this.getReferencesSettings();
        const newLogo: ClientLogo = {
          id: Date.now(),
          order: settings.clientLogos.length + 1,
          ...logo
        };
        
        settings.clientLogos.push(newLogo);
        localStorage.setItem('referencesSettings', JSON.stringify(settings));
        
        resolve(newLogo);
      } catch (error) {
        console.error("Error adding client logo: ", error);
        reject(error);
      }
    });
  };

  // Add FAQ item
  addFAQItem = (item: Omit<FAQItem, "id" | "order">): Promise<FAQItem> => {
    return new Promise((resolve, reject) => {
      try {
        const settings = this.getFAQSettings();
        const newItem: FAQItem = {
          id: Date.now(),
          order: settings.faqItems.length + 1,
          ...item
        };
        
        settings.faqItems.push(newItem);
        localStorage.setItem('faqSettings', JSON.stringify(settings));
        
        resolve(newItem);
      } catch (error) {
        console.error("Error adding FAQ item: ", error);
        reject(error);
      }
    });
  };

  // Update FAQ settings
  updateFAQSettings = (settings: FAQSettings): Promise<FAQSettings> => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem('faqSettings', JSON.stringify(settings));
        resolve(settings);
      } catch (error) {
        console.error("Error updating FAQ settings: ", error);
        reject(error);
      }
    });
  };
}

export const storageService = new StorageService();
