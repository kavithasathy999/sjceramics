const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getBlogs = async () => {
  const response = await fetch(`${API_URL}/blogs`)
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Unable to load blogs.')
  return payload.data
}
