import { ContentItem, ContactRequest, User, NavigationItem } from './types';

// Initial sample data for content
const initialContent: ContentItem[] = [
  { id: 1, title: "Home Hero Section", type: "Page Section", description: "Main hero section for homepage", lastUpdated: "2023-11-05", published: true },
  { id: 2, title: "About Us Page", type: "Page", description: "Company about page", lastUpdated: "2023-10-28", published: true, slug: "about", showInNavigation: true },
  { id: 3, title: "Web Development Services", type: "Service", description: "Web development services", lastUpdated: "2023-10-15", published: true },
  { id: 4, title: "Mobile App Development", type: "Service", description: "Mobile app development", lastUpdated: "2023-10-10", published: true },
  { id: 5, title: "Digital Marketing Overview", type: "Service", description: "Digital marketing services", lastUpdated: "2023-09-22", published: true },
  { id: 6, title: "E-commerce Project", type: "Portfolio", description: "E-commerce project showcase", lastUpdated: "2023-09-15", published: true },
  { id: 7, title: "Healthcare Mobile App", type: "Portfolio", description: "Healthcare app showcase", lastUpdated: "2023-09-10", published: true },
  
  { 
    id: 8, 
    title: "10 Essential SEO Strategies for 2023", 
    type: "Blog Post", 
    subtitle: "By Sarah Johnson",
    description: "Learn the most effective SEO strategies to boost your website's visibility and traffic in 2023.", 
    content: "Search Engine Optimization continues to evolve in 2023. This article explores the most effective techniques to improve your website ranking and drive organic traffic. From technical SEO to content strategies, we cover it all.",
    lastUpdated: "2023-08-28", 
    publishDate: "2023-08-25",
    published: true, 
    language: "en",
    seoKeywords: ["SEO", "Digital Marketing"],
    images: ["https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VvfGVufDB8fDB8fHww"],
    slug: "seo-strategies-2023"
  },
  { 
    id: 9, 
    title: "The Future of Mobile App Development", 
    type: "Blog Post", 
    subtitle: "By Michael Chen",
    description: "Explore the emerging trends and technologies shaping the future of mobile application development.", 
    content: "The mobile app development landscape is rapidly changing with new technologies and user expectations. This post examines upcoming trends like AI integration, cross-platform development advancements, and new design paradigms.",
    lastUpdated: "2023-09-15", 
    publishDate: "2023-09-10",
    published: true, 
    language: "en",
    seoKeywords: ["Mobile Development", "Technology"],
    images: ["https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fHww"],
    slug: "future-mobile-development"
  },
  { 
    id: 10, 
    title: "Why UX Design is Crucial for Business Success", 
    type: "Blog Post", 
    subtitle: "By Emma Roberts",
    description: "Discover why prioritizing user experience is essential for digital product success and customer retention.", 
    content: "User experience design has become a critical differentiator in today's competitive digital landscape. This article explains how investment in UX directly impacts business metrics including conversion rates, customer loyalty, and brand perception.",
    lastUpdated: "2023-10-05", 
    publishDate: "2023-10-01",
    published: true, 
    language: "en",
    seoKeywords: ["UX/UI", "Design"],
    images: ["https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVzZXIlMjBleHBlcmllbmNlfGVufDB8fDB8fHww"],
    slug: "ux-design-business-success"
  },
  { 
    id: 11, 
    title: "Effective Social Media Marketing Strategies", 
    type: "Blog Post", 
    subtitle: "By James Wilson",
    description: "A comprehensive guide to creating effective social media marketing campaigns that drive engagement.", 
    content: "Social media continues to be a powerful marketing channel for businesses of all sizes. This guide walks through platform-specific strategies, content planning, and performance measurement to help you maximize your social media ROI.",
    lastUpdated: "2023-10-20", 
    publishDate: "2023-10-15",
    published: true, 
    language: "en",
    seoKeywords: ["Social Media", "Digital Marketing"],
    images: ["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D"],
    slug: "social-media-marketing-strategies"
  },
  { 
    id: 12, 
    title: "E-commerce Optimization Tips for Higher Conversions", 
    type: "Blog Post", 
    subtitle: "By Alexandra Lopez",
    description: "Practical tips to optimize your e-commerce store for better conversions and customer satisfaction.", 
    content: "Converting visitors into customers is the ultimate goal of any e-commerce store. This article provides actionable optimization techniques for product pages, checkout processes, and overall site experience to boost your conversion rates.",
    lastUpdated: "2023-11-10", 
    publishDate: "2023-11-05",
    published: true, 
    language: "en",
    seoKeywords: ["E-commerce", "Conversion Optimization"],
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWNvbW1lcmNlfGVufDB8fDB8fHww"],
    slug: "ecommerce-optimization-tips"
  },
  { 
    id: 13, 
    title: "Cybersecurity Essentials for Small Businesses", 
    type: "Blog Post", 
    subtitle: "By David Miller",
    description: "Essential cybersecurity best practices to protect your business and customers in the digital age.", 
    content: "Small businesses are increasingly becoming targets for cyber attacks. This guide covers fundamental security practices, from password management to network security and employee training, that can help protect your business assets and customer data.",
    lastUpdated: "2023-11-25", 
    publishDate: "2023-11-20",
    published: true, 
    language: "en",
    seoKeywords: ["Cybersecurity", "Business"],
    images: ["https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y3liZXJzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D"],
    slug: "cybersecurity-essentials-small-business"
  },
  { 
    id: 14, 
    title: "Contact Information", 
    type: "Page Section", 
    description: "Contact info section", 
    lastUpdated: "2023-08-15", 
    published: true 
  },
  { 
    id: 15, 
    title: "Company Values", 
    type: "Page Section", 
    description: "Company values section", 
    lastUpdated: "2023-08-05", 
    published: true 
  },
];

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
  { id: 2, name: "Content Editor", email: "editor@trojan-envoy.com", role: "Editor", lastLogin: "2023-11-10" }
];

// Initial sample contact requests
const initialContacts: ContactRequest[] = [
  { id: 1, name: "John Smith", email: "john@example.com", phone: "+1 555-123-4567", subject: "Project Inquiry", message: "I'd like to discuss a potential web project for my company.", status: "New", dateSubmitted: "2023-11-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+44 20 1234 5678", subject: "Service Question", message: "Can you provide more details about your digital marketing services?", status: "In Progress", dateSubmitted: "2023-11-14", assignedTo: 2 }
];

class StorageService {
  private contentKey = 'trojan-envoy-content';
  private usersKey = 'trojan-envoy-users';
  private contactsKey = 'trojan-envoy-contacts';
  private navigationKey = 'trojan-envoy-navigation';
  private eventListeners: Record<string, Function[]> = {};

  constructor() {
    this.initializeStorage();
  }

  // Initialize localStorage with default data if empty
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
  }

  // EVENT SYSTEM FOR REAL-TIME UPDATES
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

  // CONTENT METHODS
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
    
    const newContent: ContentItem = {
      ...content,
      id: newId,
      lastUpdated: new Date().toISOString().split('T')[0],
      published: content.published ?? false
    };
    
    allContent.push(newContent);
    localStorage.setItem(this.contentKey, JSON.stringify(allContent));
    
    // If this is a page and should be shown in navigation, add it to nav items
    if (content.type === 'Page' && content.showInNavigation && content.slug) {
      this.addNavigationItem({
        label: content.title,
        path: `/${content.slug}`,
        order: this.getAllNavigationItems().length + 1
      });
    }
    
    // Dispatch event for real-time updates
    this.dispatchEvent('content-added', newContent);
    
    return newContent;
  }

  updateContent(id: number, content: Partial<ContentItem>): ContentItem | null {
    const allContent = this.getAllContent();
    const index = allContent.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const originalContent = allContent[index];
    const updatedContent = {
      ...originalContent,
      ...content,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    allContent[index] = updatedContent;
    localStorage.setItem(this.contentKey, JSON.stringify(allContent));
    
    // Handle navigation changes if this is a page and navigation status changed
    if (updatedContent.type === 'Page') {
      const navItem = this.getNavigationItemByPath(`/${updatedContent.slug || ''}`);
      
      // If should show in nav but no nav item exists
      if (updatedContent.showInNavigation && !navItem && updatedContent.slug) {
        this.addNavigationItem({
          label: updatedContent.title,
          path: `/${updatedContent.slug}`,
          order: this.getAllNavigationItems().length + 1
        });
      } 
      // If exists in nav but should not show or the path changed
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
    
    // Dispatch event for real-time updates
    this.dispatchEvent('content-updated', updatedContent);
    
    return updatedContent;
  }

  deleteContent(id: number): boolean {
    const allContent = this.getAllContent();
    const contentToDelete = allContent.find(item => item.id === id);
    const filteredContent = allContent.filter(item => item.id !== id);
    
    if (filteredContent.length === allContent.length) return false;
    
    localStorage.setItem(this.contentKey, JSON.stringify(filteredContent));
    
    // If this was a page in navigation, remove from navigation
    if (contentToDelete?.type === 'Page' && contentToDelete.showInNavigation && contentToDelete.slug) {
      const navItem = this.getNavigationItemByPath(`/${contentToDelete.slug}`);
      if (navItem) {
        this.deleteNavigationItem(navItem.id);
      }
    }
    
    // Dispatch event for real-time updates
    this.dispatchEvent('content-deleted', id);
    
    return true;
  }

  // NAVIGATION METHODS
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

  // USER METHODS
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

  // CONTACT REQUEST METHODS
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
}

// Create a singleton instance
export const storageService = new StorageService();
