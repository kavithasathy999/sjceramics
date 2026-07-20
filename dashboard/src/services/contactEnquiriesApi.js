const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'Contact Enquiries API is unavailable. Restart the updated API server.' : payload.message || 'Unable to complete the contact enquiry request.')
    error.fields = payload.errors || {}
    throw error
  }
  return payload
}

export const getContactEnquiries = async () => (await parseResponse(await fetch(`${API_URL}/contact-enquiries`))).data

export const updateContactEnquiry = async (id, values) => (await parseResponse(await fetch(`${API_URL}/contact-enquiries/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(values),
}))).data

export const deleteContactEnquiry = async (id) => parseResponse(await fetch(`${API_URL}/contact-enquiries/${id}`, { method: 'DELETE' }))
