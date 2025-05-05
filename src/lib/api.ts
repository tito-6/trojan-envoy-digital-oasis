const API_BASE = process.env.API_URL || 'http://localhost:3001/api';

export async function fetchContent(type?: string, slug?: string) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (slug) params.append('slug', slug);
  
  const response = await fetch(`${API_BASE}/content?${params}`);
  if (!response.ok) throw new Error('Failed to fetch content');
  return response.json();
}

export async function fetchNavigation() {
  const response = await fetch(`${API_BASE}/navigation`);
  if (!response.ok) throw new Error('Failed to fetch navigation');
  return response.json();
}

export async function fetchSettings(name: string) {
  const response = await fetch(`${API_BASE}/settings/${name}`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
}