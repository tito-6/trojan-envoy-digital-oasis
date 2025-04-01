import { ContentItem, ContactRequest, User, NavigationItem, HeaderSettings, HeroSettings, PartnerLogo, TechIcon } from './types';

// Initial sample data for content - we'll keep this minimal
const initialContent: ContentItem[] = [];

// Initial navigation items
const initialNavigation: NavigationItem[] = [
  { id: 1, label: "Home", path: "/", order: 1 },
  { id: 2, label: "Services", path: "/services", order: 2 },
  { id: 3, label: "About", path: "/about", order: 3 },
  { id: 4, label: "Portfolio", path: "/portfolio", order: 4 },
  { id: 5, label: "Blog", path: "/blog", order: 5 },
  { id: 6, label: "Contact", path: "/contact", order: 6 },
];

// Initial sample users
const initialUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@trojan-envoy.com", role: "Admin", lastLogin: "2023-11-15" },
];

// Initial sample contact requests - empty now
const initialContacts: ContactRequest[] = [];

// Initial header settings
const initialHeaderSettings: HeaderSettings = {
  id: 1,
  siteTitle: "Trojan Envoy",
  contactButtonText: "Contact Us",
  contactButtonPath: "/contact",
  showLanguageSelector: true,
  showThemeToggle: true,
  enabledLanguages: ["en", "fr", "es", "de", "tr", "ar", "zh"],
  defaultLanguage: "en",
  mobileMenuLabel: "Menu",
  lastUpdated: "2023-11-15"
};

// Initial hero settings
const initialHeroSettings: HeroSettings = {
  id: 1,
  title: "Transform Your Digital Presence",
  subtitle: "Expert digital solutions",
  description: "We deliver cutting-edge web and mobile solutions that help businesses thrive in the digital landscape. Our team of experts is dedicated to creating exceptional digital experiences.",
  primaryButtonText: "Get Started",
  primaryButtonUrl: "/contact",
  secondaryButtonText: "Explore Services",
  secondaryButtonUrl: "/services",
  showPartnerLogos: true,
  partnerSectionTitle: "Trusted By Industry Leaders",
  partnerCertifiedText: "Certified",
  showTechStack: true,
  techStackTitle: "Built With Modern Technologies",
  techStackSubtitle: "Tech Stack",
  techStackDescription: "We leverage cutting-edge technology to build modern, scalable solutions",
  partnerLogos: [
    { id: 1, name: "Google", iconName: "FaGoogle", color: "#4285F4", bgColor: "bg-blue-100", order: 1 },
    { id: 2, name: "Meta", iconName: "FaFacebook", color: "#1877F2", bgColor: "bg-blue-100", order: 2 },
    { id: 3, name: "SEMrush", iconName: "SiSemrush", color: "#5FB246", bgColor: "bg-green-100", order: 3 },
    { id: 4, name: "AWS", iconName: "FaAws", color: "#FF9900", bgColor: "bg-orange-100", order: 4 },
    { id: 5, name: "Magento", iconName: "FaShopify", color: "#7AB55C", bgColor: "bg-purple-100", order: 5 },
    { id: 6, name: "WordPress", iconName: "FaWordpress", color: "#21759B", bgColor: "bg-blue-100", order: 6 },
    { id: 7, name: "Industry Leaders", iconName: "FaAward", color: "#FFD700", bgColor: "bg-yellow-100", order: 7 }
  ],
  techIcons: [
    { id: 1, name: "React", iconName: "FaReact", color: "#61DAFB", animation: "animate-float", order: 1 },
    { id: 2, name: "TypeScript", iconName: "SiTypescript", color: "#3178C6", animation: "animate-pulse-soft", order: 2 },
    { id: 3, name: "Vue.js", iconName: "FaVuejs", color: "#4FC08D", animation: "animate-float", order: 3 },
    { id: 4, name: "Angular", iconName: "FaAngular", color: "#DD0031", animation: "animate-pulse-soft", order: 4 },
    { id: 5, name: "JavaScript", iconName: "SiJavascript", color: "#F7DF1E", animation: "animate-float", order: 5 },
    { id: 6, name: "Node.js", iconName: "FaNode", color: "#339933", animation: "animate-pulse-soft", order: 6 },
    { id: 7, name: "Python", iconName: "FaPython", color: "#3776AB", animation: "animate-float", order: 7 },
    { id: 8, name: "Java", iconName: "FaJava", color: "#007396", animation: "animate-pulse-soft", order: 8 },
    { id: 9, name: "PHP", iconName: "FaPhp", color: "#777BB4", animation: "animate-float", order: 9 },
    { id: 10, name: "Kotlin", iconName: "SiKotlin", color: "#7F52FF", animation: "animate-pulse-soft", order: 10 },
    { id: 11, name: "Swift", iconName: "FaSwift", color: "#FA7343", animation: "animate-float", order: 11 },
    { id: 12, name: "Flutter", iconName: "SiFlutter", color: "#02569B", animation: "animate-pulse-soft", order: 12 },
    { id: 13, name: "Firebase", iconName: "SiFirebase", color: "#FFCA28", animation: "animate-float", order: 13 },
    { id: 14, name: "MongoDB", iconName: "SiMongodb", color: "#47A248", animation: "animate-pulse-soft", order: 14 },
    { id: 15, name: "SQL", iconName: "FaDatabase", color: "#4479A1", animation: "animate-float", order: 15 },
    { id: 16, name: "GraphQL", iconName: "SiGraphql", color: "#E10098", animation: "animate-pulse-soft", order: 16 },
    { id: 17, name: "Tailwind", iconName: "SiTailwindcss", color: "#06B6D4", animation: "animate-float", order: 17 },
    { id: 18, name: "Docker", iconName: "FaDocker", color: "#2496ED", animation: "animate-pulse-soft", order: 18 },
    { id: 19, name: "AWS", iconName: "FaAws", color: "#FF9900", animation: "animate-float", order: 19 },
    { id: 20, name: "GitHub", iconName: "FaGithub", color: "#181717", animation: "animate-pulse-soft", order: 20 }
  ],
  lastUpdated: "2023-11-15"
};

class StorageService {
  private contentKey = 'trojan-envoy-content';
  private usersKey = 'trojan-envoy-users';
  private contactsKey = 'trojan-envoy-contacts';
  private navigationKey = 'trojan-envoy-navigation';
  private headerSettingsKey = 'trojan-envoy-header-settings';
  private heroSettingsKey = 'trojan-envoy-hero-settings';
  private eventListeners: Record<string, Function[]> = {};

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    if (!localStorage.getItem(this.contentKey)) {
      localStorage.setItem(this.contentKey, JSON.stringify(initialContent));
    }
    
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify(initialUsers));
    }
    
    if (!localStorage.getItem(this.contactsKey)) {
      localStorage.setItem(this.contactsKey, JSON.stringify(initialContacts));
    }
    
    if (!localStorage.getItem(this.navigationKey)) {
      localStorage.setItem(this.navigationKey, JSON.stringify(initialNavigation));
    }
    
    if (!localStorage.getItem(this.headerSettingsKey)) {
      localStorage.setItem(this.headerSettingsKey, JSON.stringify(initialHeaderSettings));
    }
    
    if (!localStorage.getItem(this.heroSettingsKey)) {
      localStorage.setItem(this.heroSettingsKey, JSON.stringify(initialHeroSettings));
    }
  }

  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
    return () => this.removeEventListener(event, callback);
  }

  removeEventListener(event: string, callback: Function) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  dispatchEvent(event: string, data: any) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  getAllContent(): ContentItem[] {
    const content = localStorage.getItem(this.contentKey);
    return content ? JSON.parse(content) : [];
  }

  getContentById(id: number): ContentItem | undefined {
    return this.getAllContent().find(item => item.id === id);
  }

  getContentByType(type: string): ContentItem[] {
    return this.getAllContent().filter(item => item.type === type);
  }

  getContentBySlug(slug: string): ContentItem | undefined {
    return this.getAllContent().find(item => item.slug === slug);
  }

  addContent(content: Omit<ContentItem, 'id' | 'lastUpdated'>): ContentItem {
    const allContent = this.getAllContent();
    const newId = allContent.length > 0 ? Math.max(...allContent.map(item => item.id)) + 1 : 1;
    
    const normalizedContent: ContentItem = {
      ...content,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
      published: content.published ?? false,
      seoKeywords: content.seoKeywords || [],
      slug: content.slug 
        ? content.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') 
        : content.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      publishDate: content.type === 'Blog Post' ? 
        (content.publishDate || new Date().toISOString().split('T')[0]) : 
        content.publishDate,
      responsibilities: content.responsibilities || [],
      requirements: content.requirements || [],
      benefits: content.benefits || [],
      technologies: content.technologies || []
    };
    
    allContent.push(normalizedContent);
    localStorage.setItem(this.contentKey, JSON.stringify(allContent));
    
    if (content.type === 'Page' && content.showInNavigation && normalizedContent.slug) {
      this.addNavigationItem({
        label: content.title,
        path: `/${normalizedContent.slug}`,
        order: this.getAllNavigationItems().length + 1
      });
    }
    
    this.dispatchEvent('content-added', normalizedContent);
    
    return normalizedContent;
  }

  updateContent(id: number, content: Partial<ContentItem>): ContentItem | null {
    const allContent = this.getAllContent();
    const index = allContent.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const originalContent = allContent[index];
    
    let updatedSlug = originalContent.slug;
    if (content.slug !== undefined) {
      updatedSlug = content.slug
        ? content.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
        : originalContent.slug;
    } else if (content.title && !originalContent.slug) {
      updatedSlug = content.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    const updatedContent: ContentItem = {
      ...originalContent,
      ...content,
      lastUpdated: new Date().toISOString().split('T')[0],
      seoKeywords: content.seoKeywords || originalContent.seoKeywords || [],
      slug: updatedSlug,
      responsibilities: content.responsibilities || originalContent.responsibilities || [],
      requirements: content.requirements || originalContent.requirements || [],
      benefits: content.benefits || originalContent.benefits || [],
      technologies: content.technologies || originalContent.technologies || []
    };
    
    allContent[index] = updatedContent;
    localStorage.setItem(this.contentKey, JSON.stringify(allContent));
    
    if (updatedContent.type === 'Page') {
      const navItem = this.getNavigationItemByPath(`/${originalContent.slug || ''}`);
      
      if (updatedContent.showInNavigation && !navItem && updatedContent.slug) {
        this.addNavigationItem({
          label: updatedContent.title,
          path: `/${updatedContent.slug}`,
          order: this.getAllNavigationItems().length + 1
        });
      } 
      else if (navItem) {
        if (!updatedContent.showInNavigation) {
          this.deleteNavigationItem(navItem.id);
        } else if (originalContent.title !== updatedContent.title || originalContent.slug !== updatedContent.slug) {
          this.updateNavigationItem(navItem.id, {
            label: updatedContent.title,
            path: `/${updatedContent.slug}`
          });
        }
      }
    }
    
    this.dispatchEvent('content-updated', updatedContent);
    
    return updatedContent;
  }

  deleteContent(id: number): boolean {
    const allContent = this.getAllContent();
    const contentToDelete = allContent.find(item => item.id === id);
    const filteredContent = allContent.filter(item => item.id !== id);
    
    if (filteredContent.length === allContent.length) return false;
    
    localStorage.setItem(this.contentKey, JSON.stringify(filteredContent));
    
    if (contentToDelete?.type === 'Page' && contentToDelete.showInNavigation && contentToDelete.slug) {
      const navItem = this.getNavigationItemByPath(`/${contentToDelete.slug}`);
      if (navItem) {
        this.deleteNavigationItem(navItem.id);
      }
    }
    
    this.dispatchEvent('content-deleted', id);
    
    return true;
  }

  getAllNavigationItems(): NavigationItem[] {
    const navItems = localStorage.getItem(this.navigationKey);
    return navItems ? JSON.parse(navItems) : [];
  }

  getNavigationItemById(id: number): NavigationItem | undefined {
    return this.getAllNavigationItems().find(item => item.id === id);
  }

  getNavigationItemByPath(path: string): NavigationItem | undefined {
    return this.getAllNavigationItems().find(item => item.path === path);
  }

  addNavigationItem(item: Omit<NavigationItem, 'id'>): NavigationItem {
    const allItems = this.getAllNavigationItems();
    const newId = allItems.length > 0 ? Math.max(...allItems.map(i => i.id)) + 1 : 1;
    
    const newItem: NavigationItem = { ...item, id: newId };
    allItems.push(newItem);
    localStorage.setItem(this.navigationKey, JSON.stringify(allItems));
    
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    
    return newItem;
  }

  updateNavigationItem(id: number, item: Partial<NavigationItem>): NavigationItem | null {
    const allItems = this.getAllNavigationItems();
    const index = allItems.findIndex(i => i.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...allItems[index], ...item };
    allItems[index] = updatedItem;
    localStorage.setItem(this.navigationKey, JSON.stringify(allItems));
    
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    
    return updatedItem;
  }

  deleteNavigationItem(id: number): boolean {
    const allItems = this.getAllNavigationItems();
    const filteredItems = allItems.filter(item => item.id !== id);
    
    if (filteredItems.length === allItems.length) return false;
    
    localStorage.setItem(this.navigationKey, JSON.stringify(filteredItems));
    
    this.dispatchEvent('navigation-updated', filteredItems);
    
    return true;
  }

  reorderNavigationItems(items: { id: number, order: number }[]): NavigationItem[] {
    const allItems = this.getAllNavigationItems();
    
    items.forEach(item => {
      const index = allItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        allItems[index].order = item.order;
      }
    });
    
    // Sort by order
    const sortedItems = [...allItems].sort((a, b) => a.order - b.order);
    
    localStorage.setItem(this.navigationKey, JSON.stringify(sortedItems));
    
    this.dispatchEvent('navigation-updated', sortedItems);
    
    return sortedItems;
  }

  getAllUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  getUserById(id: number): User | undefined {
    return this.getAllUsers().find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getAllUsers().find(user => user.email === email);
  }

  addUser(user: Omit<User, 'id'>): User {
    const allUsers = this.getAllUsers();
    const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;
    
    const newUser = { ...user, id: newId };
    allUsers.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(allUsers));
    
    this.dispatchEvent('user-added', newUser);
    
    return newUser;
  }

  updateUser(id: number, user: Partial<User>): User | null {
    const allUsers = this.getAllUsers();
    const index = allUsers.findIndex(u => u.id === id);
    
    if (index === -1) return null;
    
    const updatedUser = { ...allUsers[index], ...user };
    allUsers[index] = updatedUser;
    localStorage.setItem(this.usersKey, JSON.stringify(allUsers));
    
    this.dispatchEvent('user-updated', updatedUser);
    
    return updatedUser;
  }

  deleteUser(id: number): boolean {
    const allUsers = this.getAllUsers();
    const filteredUsers = allUsers.filter(user => user.id !== id);
    
    if (filteredUsers.length === allUsers.length) return false;
    
    localStorage.setItem(this.usersKey, JSON.stringify(filteredUsers));
    
    this.dispatchEvent('user-deleted', id);
    
    return true;
  }

  getAllContactRequests(): ContactRequest[] {
    const contacts = localStorage.getItem(this.contactsKey);
    return contacts ? JSON.parse(contacts) : [];
  }

  getContactRequestById(id: number): ContactRequest | undefined {
    return this.getAllContactRequests().find(contact => contact.id === id);
  }

  addContactRequest(contact: Omit<ContactRequest, 'id' | 'dateSubmitted' | 'status'>): ContactRequest {
    const allContacts = this.getAllContactRequests();
    const newId = allContacts.length > 0 ? Math.max(...allContacts.map(c => c.id)) + 1 : 1;
    
    const newContact: ContactRequest = {
      ...contact,
      id: newId,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    
    allContacts.push(newContact);
    localStorage.setItem(this.contactsKey, JSON.stringify(allContacts));
    
    this.dispatchEvent('contact-added', newContact);
    
    return newContact;
  }

  updateContactRequest(id: number, contact: Partial<ContactRequest>): ContactRequest | null {
    const allContacts = this.getAllContactRequests();
    const index = allContacts.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    const updatedContact = { ...allContacts[index], ...contact };
    allContacts[index] = updatedContact;
    localStorage.setItem(this.contactsKey, JSON.stringify(allContacts));
    
    this.dispatchEvent('contact-updated', updatedContact);
    
    return updatedContact;
  }

  deleteContactRequest(id: number): boolean {
    const allContacts = this.getAllContactRequests();
    const filteredContacts = allContacts.filter(contact => contact.id !== id);
    
    if (filteredContacts.length === allContacts.length) return false;
    
    localStorage.setItem(this.contactsKey, JSON.stringify(filteredContacts));
    
    this.dispatchEvent('contact-deleted', id);
    
    return true;
  }

  getHeaderSettings(): HeaderSettings {
    const settings = localStorage.getItem(this.headerSettingsKey);
    return settings ? JSON.parse(settings) : initialHeaderSettings;
  }

  updateHeaderSettings(settings: Partial<HeaderSettings>): HeaderSettings {
    const currentSettings = this.getHeaderSettings();
    const updatedSettings: HeaderSettings = {
      ...currentSettings,
      ...settings,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem(this.headerSettingsKey, JSON.stringify(updatedSettings));
    
    this.dispatchEvent('header-settings-updated', updatedSettings);
    
    return updatedSettings;
  }

  getHeroSettings(): HeroSettings {
    const settings = localStorage.getItem(this.heroSettingsKey);
    return settings ? JSON.parse(settings) : initialHeroSettings;
  }

  updateHeroSettings(settings: Partial<HeroSettings>): HeroSettings {
    const currentSettings = this.getHeroSettings();
    const updatedSettings: HeroSettings = {
      ...currentSettings,
      ...settings,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem(this.heroSettingsKey, JSON.stringify(updatedSettings));
    
    this.dispatchEvent('hero-settings-updated', updatedSettings);
    
    return updatedSettings;
  }

  addPartnerLogo(logo: Omit<PartnerLogo, 'id'>): PartnerLogo {
    const settings = this.getHeroSettings();
    const newId = settings.partnerLogos.length > 0 ? 
      Math.max(...settings.partnerLogos.map(logo => logo.id)) + 1 : 1;
    
    const newLogo: PartnerLogo = { ...logo, id: newId };
    
    settings.partnerLogos.push(newLogo);
    this.updateHeroSettings(settings);
    
    return newLogo;
  }

  updatePartnerLogo(id: number, logo: Partial<PartnerLogo>): PartnerLogo | null {
    const settings = this.getHeroSettings();
    const index = settings.partnerLogos.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedLogo = { ...settings.partnerLogos[index], ...logo };
    settings.partnerLogos[index] = updatedLogo;
    
    this.updateHeroSettings(settings);
    
    return updatedLogo;
  }

  deletePartnerLogo(id: number): boolean {
    const settings = this.getHeroSettings();
    const filteredLogos = settings.partnerLogos.filter(logo => logo.id !== id);
    
    if (filteredLogos.length === settings.partnerLogos.length) return false;
    
    settings.partnerLogos = filteredLogos;
    this.updateHeroSettings(settings);
    
    return true;
  }

  reorderPartnerLogos(items: { id: number, order: number }[]): PartnerLogo[] {
    const settings = this.getHeroSettings();
    
    items.forEach(item => {
      const index = settings.partnerLogos.findIndex(i => i.id === item.id);
      if (index !== -1) {
        settings.partnerLogos[index].order = item.order;
      }
    });
    
    // Sort by order
    settings.partnerLogos.sort((a, b) => a.order - b.order);
    
    this.updateHeroSettings(settings);
    
    return settings.partnerLogos;
  }

  addTechIcon(icon: Omit<TechIcon, 'id'>): TechIcon {
    const settings = this.getHeroSettings();
    const newId = settings.techIcons.length > 0 ? 
      Math.max(...settings.techIcons.map(icon => icon.id)) + 1 : 1;
    
    const newIcon: TechIcon = { ...icon, id: newId };
    
    settings.techIcons.push(newIcon);
    this.updateHeroSettings(settings);
    
    return newIcon;
  }

  updateTechIcon(id: number, icon: Partial<TechIcon>): TechIcon | null {
    const settings = this.getHeroSettings();
    const index = settings.techIcons.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedIcon = { ...settings.techIcons[index], ...icon };
    settings.techIcons[index] = updatedIcon;
    
    this.updateHeroSettings(settings);
    
    return updatedIcon;
  }

  deleteTechIcon(id: number): boolean {
    const settings = this.getHeroSettings();
    const filteredIcons = settings.techIcons.filter(icon => icon.id !== id);
    
    if (filteredIcons.length === settings.techIcons.length) return false;
    
    settings.techIcons = filteredIcons;
    this.updateHeroSettings(settings);
    
    return true;
  }

  reorderTechIcons(items: { id: number, order: number }[]): TechIcon[] {
    const settings = this.getHeroSettings();
    
    items.forEach(item => {
      const index = settings.techIcons.findIndex(i => i.id === item.id);
      if (index !== -1) {
        settings.techIcons[index].order = item.order;
      }
    });
    
    // Sort by order
    settings.techIcons.sort((a, b) => a.order - b.order);
    
    this.updateHeroSettings(settings);
    
    return settings.techIcons;
  }
}

export const storageService = new StorageService();
