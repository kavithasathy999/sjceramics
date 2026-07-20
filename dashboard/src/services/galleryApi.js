const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Unable to complete the gallery request.')
  return payload
}

export const getGalleryItems = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/gallery`))
  return payload.data
}

const galleryFormData = ({ title, category, image }) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('category', category)
  if (image) formData.append('image', image)
  return formData
}

export const createGalleryItem = async (item) => {
  const payload = await parseResponse(await fetch(`${API_URL}/gallery`, {
    method: 'POST',
    body: galleryFormData(item),
  }))
  return payload.data
}

export const updateGalleryItem = async (id, item) => {
  const payload = await parseResponse(await fetch(`${API_URL}/gallery/${id}`, {
    method: 'PUT',
    body: galleryFormData(item),
  }))
  return payload.data
}

export const deleteGalleryItem = async (id) => {
  await parseResponse(await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' }))
}
