
import { supabase } from "./supabase";
import { 
  ContentItem, 
  ContactRequest, 
  NavigationItem, 
  PartnerLogo, 
  TechIcon, 
  FooterSection, 
  FooterLink, 
  SocialLink,
  ContactSettings,
  ContactInfoItem,
  ContactFormField,
  User,
} from "./types";

class StorageService {
  private listeners: { [key: string]: ((event: any) => void)[] } = {};

  addEventListener(event: string, callback: (event: any) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => {
      this.removeEventListener(event, callback);
    };
  }

  removeEventListener(event: string, callback: (event: any) => void): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Navigation Methods
  getAllNavigationItems(): NavigationItem[] {
    const items = localStorage.getItem('navigationItems');
    return items ? JSON.parse(items) : [];
  }

  addNavigationItem(item: Omit<NavigationItem, 'id'>): NavigationItem {
    const items = this.getAllNavigationItems();
    const newItem = {
      ...item,
      id: Date.now(),
    };
    
    localStorage.setItem('navigationItems', JSON.stringify([...items, newItem]));
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    return newItem;
  }

  updateNavigationItem(id: number, updates: Partial<NavigationItem>): NavigationItem | null {
    const items = this.getAllNavigationItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    
    localStorage.setItem('navigationItems', JSON.stringify(items));
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    return updatedItem;
  }

  deleteNavigationItem(id: number): boolean {
    const items = this.getAllNavigationItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    localStorage.setItem('navigationItems', JSON.stringify(filteredItems));
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    return true;
  }

  reorderNavigationItems(updates: { id: number; order: number }[]): boolean {
    const items = this.getAllNavigationItems();
    
    updates.forEach(update => {
      const index = items.findIndex(item => item.id === update.id);
      if (index !== -1) {
        items[index].order = update.order;
      }
    });
    
    localStorage.setItem('navigationItems', JSON.stringify(items));
    this.dispatchEvent('navigation-updated', this.getAllNavigationItems());
    return true;
  }

  // Content Methods
  getAllContent(): ContentItem[] {
    const content = localStorage.getItem('content');
    return content ? JSON.parse(content) : [];
  }

  getContentByType(type: string): ContentItem[] {
    return this.getAllContent().filter(item => item.type === type);
  }

  addContent(item: Omit<ContentItem, 'id'>): ContentItem {
    const content = this.getAllContent();
    const newItem: ContentItem = {
      ...item,
      id: Date.now(),
      slug: item.slug || this.generateSlug(item.title),
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem('content', JSON.stringify([...content, newItem]));
    this.dispatchEvent('content-added', newItem);
    return newItem;
  }

  updateContent(id: number, updates: Partial<ContentItem>): ContentItem | null {
    const content = this.getAllContent();
    const index = content.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { 
      ...content[index], 
      ...updates,
      lastUpdated: new Date().toISOString() 
    };
    
    content[index] = updatedItem;
    localStorage.setItem('content', JSON.stringify(content));
    this.dispatchEvent('content-updated', updatedItem);
    return updatedItem;
  }

  deleteContent(id: number): boolean {
    const content = this.getAllContent();
    const filteredContent = content.filter(item => item.id !== id);
    
    if (filteredContent.length === content.length) return false;
    
    localStorage.setItem('content', JSON.stringify(filteredContent));
    this.dispatchEvent('content-deleted', id);
    return true;
  }

  // Contact Request Methods
  addContactRequest(request: Omit<ContactRequest, 'id' | 'createdAt'>): ContactRequest {
    const requests = this.getContactRequests();
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem('contactRequests', JSON.stringify([...requests, newRequest]));
    this.dispatchEvent('contact-request-added', newRequest);
    return newRequest;
  }

  getContactRequests(): ContactRequest[] {
    const requests = localStorage.getItem('contactRequests');
    return requests ? JSON.parse(requests) : [];
  }

  // Partner Logo Methods
  deletePartnerLogo(id: number): boolean {
    const settings = this.getHeroSettings();
    const filteredLogos = settings.partnerLogos.filter(logo => logo.id !== id);
    
    if (filteredLogos.length === settings.partnerLogos.length) return false;
    
    settings.partnerLogos = filteredLogos;
    this.updateHeroSettings(settings);
    return true;
  }

  reorderPartnerLogos(updates: { id: number; order: number }[]): boolean {
    const settings = this.getHeroSettings();
    
    updates.forEach(update => {
      const index = settings.partnerLogos.findIndex(logo => logo.id === update.id);
      if (index !== -1) {
        settings.partnerLogos[index].order = update.order;
      }
    });
    
    this.updateHeroSettings(settings);
    return true;
  }

  updatePartnerLogo(id: number, updates: Partial<PartnerLogo>): PartnerLogo | null {
    const settings = this.getHeroSettings();
    const index = settings.partnerLogos.findIndex(logo => logo.id === id);
    
    if (index === -1) return null;
    
    const updatedLogo = { ...settings.partnerLogos[index], ...updates };
    settings.partnerLogos[index] = updatedLogo;
    
    this.updateHeroSettings(settings);
    return updatedLogo;
  }

  addPartnerLogo(logo: Omit<PartnerLogo, 'id'>): PartnerLogo {
    const settings = this.getHeroSettings();
    const newLogo: PartnerLogo = {
      ...logo,
      id: Date.now(),
    };
    
    settings.partnerLogos.push(newLogo);
    this.updateHeroSettings(settings);
    return newLogo;
  }

  // Tech Icon Methods
  deleteTechIcon(id: number): boolean {
    const settings = this.getHeroSettings();
    const filteredIcons = settings.techIcons.filter(icon => icon.id !== id);
    
    if (filteredIcons.length === settings.techIcons.length) return false;
    
    settings.techIcons = filteredIcons;
    this.updateHeroSettings(settings);
    return true;
  }

  reorderTechIcons(updates: { id: number; order: number }[]): boolean {
    const settings = this.getHeroSettings();
    
    updates.forEach(update => {
      const index = settings.techIcons.findIndex(icon => icon.id === update.id);
      if (index !== -1) {
        settings.techIcons[index].order = update.order;
      }
    });
    
    this.updateHeroSettings(settings);
    return true;
  }

  updateTechIcon(id: number, updates: Partial<TechIcon>): TechIcon | null {
    const settings = this.getHeroSettings();
    const index = settings.techIcons.findIndex(icon => icon.id === id);
    
    if (index === -1) return null;
    
    const updatedIcon = { ...settings.techIcons[index], ...updates };
    settings.techIcons[index] = updatedIcon;
    
    this.updateHeroSettings(settings);
    return updatedIcon;
  }

  addTechIcon(icon: Omit<TechIcon, 'id'>): TechIcon {
    const settings = this.getHeroSettings();
    const newIcon: TechIcon = {
      ...icon,
      id: Date.now(),
    };
    
    settings.techIcons.push(newIcon);
    this.updateHeroSettings(settings);
    return newIcon;
  }

  // About page settings
  addKeyPoint(keyPoint: { title: string; description: string; icon: string; }): any {
    const settings = this.getAboutSettings();
    const newPoint = {
      id: Date.now(),
      title: keyPoint.title,
      description: keyPoint.description,
      icon: keyPoint.icon,
      order: settings.keyPoints.length
    };
    
    settings.keyPoints.push(newPoint);
    this.updateAboutSettings(settings);
    return newPoint;
  }

  updateKeyPoint(id: number, updates: Partial<any>): any {
    const settings = this.getAboutSettings();
    const index = settings.keyPoints.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedPoint = { ...settings.keyPoints[index], ...updates };
    settings.keyPoints[index] = updatedPoint;
    
    this.updateAboutSettings(settings);
    return updatedPoint;
  }

  deleteKeyPoint(id: number): boolean {
    const settings = this.getAboutSettings();
    const filteredPoints = settings.keyPoints.filter(point => point.id !== id);
    
    if (filteredPoints.length === settings.keyPoints.length) return false;
    
    settings.keyPoints = filteredPoints;
    this.updateAboutSettings(settings);
    return true;
  }

  reorderKeyPoints(updates: { id: number; order: number }[]): boolean {
    const settings = this.getAboutSettings();
    
    updates.forEach(update => {
      const index = settings.keyPoints.findIndex(point => point.id === update.id);
      if (index !== -1) {
        settings.keyPoints[index].order = update.order;
      }
    });
    
    this.updateAboutSettings(settings);
    return true;
  }

  addStatItem(stat: { label: string; value: string; icon?: string; }): any {
    const settings = this.getAboutSettings();
    const newStat = {
      id: Date.now(),
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
      order: settings.stats.length
    };
    
    settings.stats.push(newStat);
    this.updateAboutSettings(settings);
    return newStat;
  }

  updateStatItem(id: number, updates: Partial<any>): any {
    const settings = this.getAboutSettings();
    const index = settings.stats.findIndex(stat => stat.id === id);
    
    if (index === -1) return null;
    
    const updatedStat = { ...settings.stats[index], ...updates };
    settings.stats[index] = updatedStat;
    
    this.updateAboutSettings(settings);
    return updatedStat;
  }

  deleteStatItem(id: number): boolean {
    const settings = this.getAboutSettings();
    const filteredStats = settings.stats.filter(stat => stat.id !== id);
    
    if (filteredStats.length === settings.stats.length) return false;
    
    settings.stats = filteredStats;
    this.updateAboutSettings(settings);
    return true;
  }

  reorderStatItems(updates: { id: number; order: number }[]): boolean {
    const settings = this.getAboutSettings();
    
    updates.forEach(update => {
      const index = settings.stats.findIndex(stat => stat.id === update.id);
      if (index !== -1) {
        settings.stats[index].order = update.order;
      }
    });
    
    this.updateAboutSettings(settings);
    return true;
  }

  // FAQ Settings
  addFAQItem(item: { question: string; answer: string; }): any {
    const settings = this.getFAQSettings();
    const newItem = {
      id: Date.now(),
      question: item.question,
      answer: item.answer,
      order: settings.faqItems.length
    };
    
    settings.faqItems.push(newItem);
    this.updateFAQSettings(settings);
    return newItem;
  }

  // References
  addClientLogo(logo: { name: string; imageUrl: string; }): any {
    const settings = this.getReferencesSettings();
    const newLogo = {
      id: Date.now(),
      name: logo.name,
      imageUrl: logo.imageUrl,
      order: settings.clientLogos.length
    };
    
    settings.clientLogos.push(newLogo);
    this.updateReferencesSettings(settings);
    return newLogo;
  }

  // User Management
  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  updateUser(id: number, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    
    localStorage.setItem('users', JSON.stringify(users));
    return updatedUser;
  }

  getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Supabase integration
  async getContactSettingsFromSupabase(): Promise<ContactSettings | null> {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('Error fetching contact settings from Supabase:', error);
        return null;
      }
      
      return data as unknown as ContactSettings;
    } catch (error) {
      console.error('Error in getContactSettingsFromSupabase:', error);
      return null;
    }
  }

  // Event Dispatch Helper
  private dispatchEvent(eventName: string, data: any): void {
    if (!this.listeners[eventName]) return;
    
    this.listeners[eventName].forEach(callback => {
      callback(data);
    });
  }

  // Helper method to generate a slug from a title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Get header settings
  getHeaderSettings(): any {
    const settings = localStorage.getItem('headerSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      siteTitle: "Trojan Envoy",
      logoPath: "/logo.svg",
      contactButtonText: "Contact Us",
      contactButtonPath: "/contact",
      showLanguageSelector: true,
      showThemeToggle: true,
      enabledLanguages: ['en', 'de', 'es'],
      defaultLanguage: 'en',
      mobileMenuLabel: 'Menu',
      lastUpdated: new Date().toISOString()
    };
  }

  // Update header settings
  updateHeaderSettings(settings: any): void {
    localStorage.setItem('headerSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('header-settings-updated', { detail: settings }));
  }

  // Get hero settings
  getHeroSettings(): any {
    const settings = localStorage.getItem('heroSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "We are a digital agency that helps businesses grow",
      subtitle: "We help you to grow your business by providing the best digital solutions",
      description: "We are a team of experienced professionals who are passionate about helping businesses grow. We offer a wide range of digital solutions to help you achieve your goals.",
      primaryButtonText: "Get Started",
      primaryButtonUrl: "/contact",
      secondaryButtonText: "Learn More",
      secondaryButtonUrl: "/about",
      showPartnerLogos: true,
      partnerSectionTitle: "Trusted by the best",
      partnerCertifiedText: "Certified Partner",
      showTechStack: true,
      techStackTitle: "Our Tech Stack",
      techStackSubtitle: "We use the latest technologies to build your dream",
      techStackDescription: "We are always learning and experimenting with new technologies to provide you with the best possible solutions.",
      partnerLogos: [],
      techIcons: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Update hero settings
  updateHeroSettings(settings: any): void {
    localStorage.setItem('heroSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('hero-settings-updated', { detail: settings }));
  }

  // Get about settings
  getAboutSettings(): any {
    const settings = localStorage.getItem('aboutSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "About Us",
      subtitle: "We are a digital agency that helps businesses grow",
      description: "We are a team of experienced professionals who are passionate about helping businesses grow. We offer a wide range of digital solutions to help you achieve your goals.",
      missionTitle: "Our Mission",
      missionDescription: "To help businesses grow by providing the best digital solutions.",
      keyPoints: [],
      learnMoreText: "Learn More",
      learnMoreUrl: "/about",
      stats: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Update about settings
  updateAboutSettings(settings: any): void {
    localStorage.setItem('aboutSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('about-settings-updated', { detail: settings }));
  }

  // Get services settings
  getServicesSettings(): any {
    const settings = localStorage.getItem('servicesSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Our Services",
      subtitle: "We offer a wide range of digital solutions to help you achieve your goals.",
      description: "We are a team of experienced professionals who are passionate about helping businesses grow. We offer a wide range of digital solutions to help you achieve your goals.",
      viewAllText: "View All Services",
      viewAllUrl: "/services",
      services: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Update services settings
  updateServicesSettings(settings: any): void {
    localStorage.setItem('servicesSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('services-settings-updated', { detail: settings }));
  }

  getReferencesSettings(): any {
    const settings = localStorage.getItem('referencesSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Our Clients",
      subtitle: "We have worked with some of the best companies in the world",
      viewCaseStudiesText: "View Case Studies",
      viewCaseStudiesUrl: "/case-studies",
      clientLogos: [],
      lastUpdated: new Date().toISOString()
    };
  }

  updateReferencesSettings(settings: any): void {
    localStorage.setItem('referencesSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('references-settings-updated', { detail: settings }));
  }

  getFAQSettings(): any {
    const settings = localStorage.getItem('faqSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Frequently Asked Questions",
      subtitle: "Here are some of the most frequently asked questions about our company",
      viewAllText: "View All FAQs",
      viewAllUrl: "/faq",
      faqItems: [],
      lastUpdated: new Date().toISOString()
    };
  }

  updateFAQSettings(settings: any): void {
    localStorage.setItem('faqSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('faq-settings-updated', { detail: settings }));
  }

  getContactSettings(): any {
    const settings = localStorage.getItem('contactSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      title: "Contact Us",
      subtitle: "We would love to hear from you",
      description: "If you have any questions or would like to learn more about our services, please contact us.",
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
      appointmentLabel: "Schedule an Appointment",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      lastUpdated: new Date().toISOString()
    };
  }

  getFooterSettings(): any {
    const settings = localStorage.getItem('footerSettings');
    return settings ? JSON.parse(settings) : {
      id: 1,
      companyInfo: {
        description: "We are a digital agency that helps businesses grow",
        address: "123 Main Street, Anytown, CA 12345",
        phone: "123-456-7890",
        email: "info@example.com"
      },
      socialLinks: [],
      footerSections: [],
      copyrightText: "© {year} Trojan Envoy. All rights reserved.",
      privacyPolicyLink: "/privacy-policy",
      termsOfServiceLink: "/terms-of-service",
      lastUpdated: new Date().toISOString()
    };
  }

  // Update footer settings
  updateFooterSettings(settings: any): void {
    localStorage.setItem('footerSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('footer-settings-updated', { detail: settings }));
  }

  // Update contact settings
  updateContactSettings(settings: any): void {
    localStorage.setItem('contactSettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('contact-settings-updated', { detail: settings }));
  }
}

export const storageService = new StorageService();
