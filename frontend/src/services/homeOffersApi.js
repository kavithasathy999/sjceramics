import { secureMediaItem } from './mediaUrl';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let pendingRequest;

export const getHomeOffers = ({ fresh = false } = {}) => {
  if (!fresh && pendingRequest) return pendingRequest;
  pendingRequest = fetch(`${API_URL}/home-offers`)
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'Unable to load home offers.');
      return Array.isArray(payload.data)
        ? payload.data.map((section) => ({
          ...section,
          items: Array.isArray(section.items) ? section.items.map((item) => secureMediaItem(item)) : [],
        }))
        : [];
    })
    .catch((error) => {
      pendingRequest = undefined;
      throw error;
    });
  return pendingRequest;
};
