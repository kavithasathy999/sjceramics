const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'Category API is unavailable. Restart the updated API server.' : payload.message || 'Unable to complete the category request.')
    error.fields = payload.errors || {}
    throw error
  }
  return payload
}

export const getHomeCategories = async () => parseResponse(await fetch(`${API_URL}/home-categories`))

const categoryFormData = ({ name, group, sortOrder, image }) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('group', group)
  formData.append('sortOrder', String(sortOrder))
  if (image) formData.append('image', image)
  return formData
}

export const createHomeCategory = async (values) => (await parseResponse(await fetch(`${API_URL}/home-categories`, { method: 'POST', body: categoryFormData(values) }))).data
export const updateHomeCategory = async (id, values) => (await parseResponse(await fetch(`${API_URL}/home-categories/${id}`, { method: 'PUT', body: categoryFormData(values) }))).data
export const deleteHomeCategory = async (id) => parseResponse(await fetch(`${API_URL}/home-categories/${id}`, { method: 'DELETE' }))
