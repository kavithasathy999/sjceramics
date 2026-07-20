const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getExploreCollections = async () => {
  const response = await fetch(`${API_URL}/explore-collections`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Unable to load explore collections.');
  return payload.data;
};
