
import { ContentItem, ContactRequest, User } from './types';

// Initial sample data for content
const initialContent: ContentItem[] = [
  { id: 1, title: "Home Hero Section", type: "Page Section", description: "Main hero section for homepage", lastUpdated: "2023-11-05", published: true },
  { id: 2, title: "About Us Page", type: "Page", description: "Company about page", lastUpdated: "2023-10-28", published: true },
  { id: 3, title: "Web Development Services", type: "Service", description: "Web development services", lastUpdated: "2023-10-15", published: true },
  { id: 4, title: "Mobile App Development", type: "Service", description: "Mobile app development", lastUpdated: "2023-10-10", published: true },
  { id: 5, title: "Digital Marketing Overview", type: "Service", description: "Digital marketing services", lastUpdated: "2023-09-22", published: true },
  { id: 6, title: "E-commerce Project", type: "Portfolio", description: "E-commerce project showcase", lastUpdated: "2023-09-15", published: true },
  { id: 7, title: "Healthcare Mobile App", type: "Portfolio", description: "Healthcare app showcase", lastUpdated: "2023-09-10", published: true },
  { id: 8, title: "Top 10 SEO Strategies", type: "Blog Post", description: "SEO strategies blog post", lastUpdated: "2023-08-28", published: true },
  { id: 9, title: "Contact Information", type: "Page Section", description: "Contact info section", lastUpdated: "2023-08-15", published: true },
  { id: 10, title: "Company Values", type: "Page Section", description: "Company values section", lastUpdated: "2023-08-05", published: true },
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
    
    // Dispatch event for real-time updates
    this.dispatchEvent('content-added', newContent);
    
    return newContent;
  }

  updateContent(id: number, content: Partial<ContentItem>): ContentItem | null {
    const allContent = this.getAllContent();
    const index = allContent.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedContent = {
      ...allContent[index],
      ...content,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    allContent[index] = updatedContent;
    localStorage.setItem(this.contentKey, JSON.stringify(allContent));
    
    // Dispatch event for real-time updates
    this.dispatchEvent('content-updated', updatedContent);
    
    return updatedContent;
  }

  deleteContent(id: number): boolean {
    const allContent = this.getAllContent();
    const filteredContent = allContent.filter(item => item.id !== id);
    
    if (filteredContent.length === allContent.length) return false;
    
    localStorage.setItem(this.contentKey, JSON.stringify(filteredContent));
    
    // Dispatch event for real-time updates
    this.dispatchEvent('content-deleted', id);
    
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
