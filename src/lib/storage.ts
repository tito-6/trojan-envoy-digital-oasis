import { ContentItem, ContactRequest, NavigationItem, JobOpening } from "./types";

// Configure storage for content items
const configureContentStorage = () => {
  const storageKey = 'content-items';

  // Get all content items
  const getAllContent = (): ContentItem[] => {
    const contentJson = localStorage.getItem(storageKey);
    return contentJson ? JSON.parse(contentJson) : [];
  };

  // Save all content items
  const saveAllContent = (content: ContentItem[]) => {
    localStorage.setItem(storageKey, JSON.stringify(content));
  };

  // Add a new content item
  const addContent = (contentData: Omit<ContentItem, 'id' | 'lastUpdated'>): ContentItem => {
    const content = getAllContent();
    const newContent: ContentItem = {
      id: content.length > 0 ? Math.max(...content.map(c => c.id)) + 1 : 1,
      ...contentData,
      lastUpdated: new Date().toISOString(),
    };
    content.push(newContent);
    saveAllContent(content);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('content-added', { detail: newContent }));
    
    return newContent;
  };

  // Update a content item
  const updateContent = (id: number, contentData: Partial<Omit<ContentItem, 'id' | 'lastUpdated'>>): boolean => {
    const content = getAllContent();
    const index = content.findIndex(c => c.id === id);
    if (index === -1) return false;

    content[index] = {
      ...content[index],
      ...contentData,
      lastUpdated: new Date().toISOString(),
    };
    saveAllContent(content);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('content-updated', { detail: content[index] }));
    
    return true;
  };

  // Delete a content item
  const deleteContent = (id: number): boolean => {
    const content = getAllContent();
    const newContent = content.filter(c => c.id !== id);
    saveAllContent(newContent);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('content-deleted', { detail: id }));
    
    return true;
  };
  
  // Get content item by ID
  const getContentById = (id: number): ContentItem | undefined => {
    const content = getAllContent();
    return content.find(c => c.id === id);
  };

  return {
    getAllContent,
    addContent,
    updateContent,
    deleteContent,
    getContentById,
  };
};

// Configure storage for contact requests
const configureContactStorage = () => {
  const storageKey = 'contact-requests';

  // Get all contact requests
  const getAllContactRequests = (): ContactRequest[] => {
    const requestsJson = localStorage.getItem(storageKey);
    return requestsJson ? JSON.parse(requestsJson) : [];
  };

  // Save all contact requests
  const saveAllContactRequests = (requests: ContactRequest[]) => {
    localStorage.setItem(storageKey, JSON.stringify(requests));
  };

  // Add a new contact request
  const addContactRequest = (requestData: ContactRequest): void => {
    const requests = getAllContactRequests();
    requests.push(requestData);
    saveAllContactRequests(requests);
  };

  return {
    getAllContactRequests,
    addContactRequest,
  };
};

// Configure storage for navigation items
const configureNavigationStorage = () => {
  const storageKey = 'navigation-items';

  // Get all navigation items
  const getAllNavigationItems = (): NavigationItem[] => {
    const navigationJson = localStorage.getItem(storageKey);
    return navigationJson ? JSON.parse(navigationJson) : [];
  };

  // Save all navigation items
  const saveAllNavigationItems = (navigation: NavigationItem[]) => {
    localStorage.setItem(storageKey, JSON.stringify(navigation));
  };

  // Update navigation items
  const updateNavigationItems = (newNavigation: NavigationItem[]): void => {
    saveAllNavigationItems(newNavigation);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('navigation-updated'));
  };

  return {
    getAllNavigationItems,
    updateNavigationItems,
  };
};

// Configure storage for job openings
const configureJobOpenings = () => {
  const storageKey = 'job-openings';
  
  // Get all job openings
  const getAllJobOpenings = (): JobOpening[] => {
    const jobsJson = localStorage.getItem(storageKey);
    return jobsJson ? JSON.parse(jobsJson) : [];
  };
  
  // Save all job openings
  const saveAllJobOpenings = (jobs: JobOpening[]) => {
    localStorage.setItem(storageKey, JSON.stringify(jobs));
  };
  
  // Get a job opening by ID
  const getJobOpeningById = (id: number): JobOpening | null => {
    const jobs = getAllJobOpenings();
    return jobs.find(job => job.id === id) || null;
  };
  
  // Add a new job opening
  const addJobOpening = (jobData: Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>): JobOpening => {
    const jobs = getAllJobOpenings();
    
    const now = new Date().toISOString();
    const newJob: JobOpening = {
      id: jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) + 1 : 1,
      ...jobData,
      createdAt: now,
      updatedAt: now,
    };
    
    jobs.push(newJob);
    saveAllJobOpenings(jobs);
    
    return newJob;
  };
  
  // Update a job opening
  const updateJobOpening = (id: number, jobData: Partial<Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>>): boolean => {
    const jobs = getAllJobOpenings();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) return false;
    
    jobs[index] = {
      ...jobs[index],
      ...jobData,
      updatedAt: new Date().toISOString(),
    };
    
    saveAllJobOpenings(jobs);
    return true;
  };
  
  // Delete a job opening
  const deleteJobOpening = (id: number): boolean => {
    const jobs = getAllJobOpenings();
    const newJobs = jobs.filter(job => job.id !== id);
    
    if (newJobs.length === jobs.length) return false;
    
    saveAllJobOpenings(newJobs);
    return true;
  };
  
  return {
    getAllJobOpenings,
    getJobOpeningById,
    addJobOpening,
    updateJobOpening,
    deleteJobOpening,
  };
};

// Global event listeners
const configureEventListeners = () => {
  const listeners: { [key: string]: (callback: (data: any) => void) => () => void } = {};

  const addEventListener = (eventName: string, callback: (data: any) => void) => {
    const listener = (event: Event) => {
      if ((event as CustomEvent).detail) {
        callback((event as CustomEvent).detail);
      } else {
        callback(null);
      }
    };

    window.addEventListener(eventName, listener);

    // Store the listener for later removal
    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(listener);

    return () => {
      window.removeEventListener(eventName, listener);
      listeners[eventName] = listeners[eventName].filter((l: any) => l !== listener);
    };
  };

  return {
    addEventListener,
  };
};

// Extend the storage service with all configurations
export const storageService = {
  ...configureContentStorage(),
  ...configureContactStorage(),
  ...configureNavigationStorage(),
  ...configureEventListeners(),
  ...configureJobOpenings(),
};
