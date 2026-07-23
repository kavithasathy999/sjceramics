import { secureMediaItem } from './mediaUrl';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAboutSection = async () => {
  const response = await fetch(`${API_URL}/about-section`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load the about section.');
  return secureMediaItem(payload.data);
};

export const getFounderShowcase = async () => {
  const response = await fetch(`${API_URL}/founder-showcase`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load the CEO & Founder section.');
  return secureMediaItem(payload.data);
};

export const getMissionVision = async () => {
  const response = await fetch(`${API_URL}/mission-vision`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load Our Mission & Vision section.');
  return payload.data;
};

export const getRoomDesigns = async () => {
  const response = await fetch(`${API_URL}/room-designs`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load room designs.');
  return Array.isArray(payload.data) ? payload.data.map((item) => secureMediaItem(item)) : [];
};
