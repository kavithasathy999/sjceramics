const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(response.status === 404
      ? 'Offers API is unavailable. Restart the updated API server.'
      : payload.message || 'Unable to complete the offer request.')
    error.fields = payload.errors || {}
    error.status = response.status
    throw error
  }
  return payload
}

export const getHomeOffers = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/home-offers`))
  return payload.data
}

const toFormData = (values) => {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') formData.append(key, value)
  })
  return formData
}

export const createHomeOffer = async (values) => {
  const payload = await parseResponse(await fetch(`${API_URL}/home-offers`, {
    method: 'POST',
    body: toFormData(values),
  }))
  return payload.data
}

export const updateHomeOffer = async (id, values) => {
  const payload = await parseResponse(await fetch(`${API_URL}/home-offers/${id}`, {
    method: 'PUT',
    body: toFormData(values),
  }))
  return payload.data
}

export const deleteHomeOffer = async (id) => {
  await parseResponse(await fetch(`${API_URL}/home-offers/${id}`, { method: 'DELETE' }))
}
