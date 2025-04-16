import { IContent, ApiResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  async fetchContent(): Promise<IContent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/content`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data: ApiResponse<IContent[]> = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch content');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  async fetchContentById(id: string): Promise<IContent> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${id}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data: ApiResponse<IContent> = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch content');
      return data.data!;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  async createContent(content: Omit<IContent, 'id'>): Promise<IContent> {
    try {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to create content');
      const data: ApiResponse<IContent> = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to create content');
      return data.data!;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  async updateContent(id: string, content: Partial<IContent>): Promise<IContent> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to update content');
      const data: ApiResponse<IContent> = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to update content');
      return data.data!;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }

  async deleteContent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete content');
      const data: ApiResponse<void> = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete content');
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  async uploadMedia(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      const data: ApiResponse<{ url: string }> = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to upload file');
      return data.data!.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();
