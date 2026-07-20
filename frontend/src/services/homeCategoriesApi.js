const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getHomeCategories = async () => {
  const response = await fetch(`${API_URL}/home-categories`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load home categories.');
  return { configured: Boolean(payload.configured), items: Array.isArray(payload.data) ? payload.data : [] };
};
