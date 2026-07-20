const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'Testimonials API is unavailable. Restart the updated API server.' : payload.message || 'Unable to complete the testimonial request.')
    error.fields = payload.errors || {}
    throw error
  }
  return payload
}

const requestOptions = (method, values) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(values),
})

export const getTestimonials = async () => (await parseResponse(await fetch(`${API_URL}/testimonials`))).data
export const createTestimonial = async (values) => (await parseResponse(await fetch(`${API_URL}/testimonials`, requestOptions('POST', values)))).data
export const updateTestimonial = async (id, values) => (await parseResponse(await fetch(`${API_URL}/testimonials/${id}`, requestOptions('PUT', values)))).data
export const deleteTestimonial = async (id) => parseResponse(await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' }))
