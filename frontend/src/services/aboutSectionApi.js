const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAboutSection = async () => {
  const response = await fetch(`${API_URL}/about-section`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load the about section.');
  return payload.data;
};

export const getFounderShowcase = async () => {
  const response = await fetch(`${API_URL}/founder-showcase`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load the CEO & Founder section.');
  return payload.data;
};

export const getRoomDesigns = async () => {
  const response = await fetch(`${API_URL}/room-designs`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load room designs.');
  return payload.data;
};
