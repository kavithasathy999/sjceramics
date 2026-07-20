const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const submitContactEnquiry = async (values) => {
  const response = await fetch(`${API_URL}/contact-enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'Unable to send your message. Please try again.');
    error.fields = payload.errors || {};
    throw error;
  }
  return payload;
};
