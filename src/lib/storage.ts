import { ContentItem, ContactRequest, User, NavigationItem, WaitingListEntry } from './types';

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

const initialWaitingList: WaitingListEntry[] = [];

class StorageService {
  private contentKey = 'trojan-envoy-content';
  private usersKey = 'trojan-envoy-users';
  private contactsKey = 'trojan-envoy-contacts';
  private navigationKey = 'trojan-envoy-navigation';
  private waitingListKey = 'waiting-list';
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
        content.publishDate
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
      slug: updatedSlug
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

  getAllWaitingListEntries(): WaitingListEntry[] {
    const entries = localStorage.getItem(this.waitingListKey);
    return entries ? JSON.parse(entries) : initialWaitingList;
  }

  getWaitingListEntryByEmail(email: string): WaitingListEntry | undefined {
    return this.getAllWaitingListEntries().find(entry => entry.email === email);
  }

  addWaitingListEntry(entry: Omit<WaitingListEntry, 'id' | 'dateSubmitted' | 'status'>): WaitingListEntry {
    const allEntries = this.getAllWaitingListEntries();
    const newId = allEntries.length > 0 ? Math.max(...allEntries.map(e => e.id)) + 1 : 1;
    
    const newEntry: WaitingListEntry = {
      ...entry,
      id: newId,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    
    allEntries.push(newEntry);
    localStorage.setItem(this.waitingListKey, JSON.stringify(allEntries));
    
    this.dispatchEvent('waiting-list-added', newEntry);
    
    return newEntry;
  }

  updateWaitingListEntry(id: number, entry: Partial<WaitingListEntry>): WaitingListEntry | null {
    const allEntries = this.getAllWaitingListEntries();
    const index = allEntries.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    const updatedEntry = { ...allEntries[index], ...entry };
    allEntries[index] = updatedEntry;
    localStorage.setItem(this.waitingListKey, JSON.stringify(allEntries));
    
    this.dispatchEvent('waiting-list-updated', updatedEntry);
    
    return updatedEntry;
  }

  deleteWaitingListEntry(id: number): boolean {
    const allEntries = this.getAllWaitingListEntries();
    const filteredEntries = allEntries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length === allEntries.length) return false;
    
    localStorage.setItem(this.waitingListKey, JSON.stringify(filteredEntries));
    
    this.dispatchEvent('waiting-list-deleted', id);
    
    return true;
  }
}

export const storageService = new StorageService();
