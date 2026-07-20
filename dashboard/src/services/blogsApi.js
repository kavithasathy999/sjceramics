const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'Blogs API is unavailable. Restart the updated API server.' : payload.message || 'Unable to complete the blog request.')
    error.fields = payload.errors || {}
    throw error
  }
  return payload
}

const toFormData = ({ category, title, author, date, description, media }) => {
  const formData = new FormData()
  formData.append('category', category)
  formData.append('title', title)
  formData.append('author', author)
  formData.append('date', date)
  formData.append('description', description)
  if (media) formData.append('media', media)
  return formData
}

export const getBlogs = async () => (await parseResponse(await fetch(`${API_URL}/blogs`))).data
export const createBlog = async (values) => (await parseResponse(await fetch(`${API_URL}/blogs`, { method: 'POST', body: toFormData(values) }))).data
export const updateBlog = async (id, values) => (await parseResponse(await fetch(`${API_URL}/blogs/${id}`, { method: 'PUT', body: toFormData(values) }))).data
export const deleteBlog = async (id) => parseResponse(await fetch(`${API_URL}/blogs/${id}`, { method: 'DELETE' }))
