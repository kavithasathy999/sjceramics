const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'Explore Collections API is unavailable. Restart the updated API server.' : payload.message || 'Unable to complete the collection request.')
    error.fields = payload.errors || {}
    throw error
  }
  return payload
}

const jsonOptions = (method, values) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })

export const getExploreCollections = async () => (await parseResponse(await fetch(`${API_URL}/explore-collections`))).data
export const createExploreCollection = async (values) => (await parseResponse(await fetch(`${API_URL}/explore-collections`, jsonOptions('POST', values)))).data
export const updateExploreCollection = async (id, values) => (await parseResponse(await fetch(`${API_URL}/explore-collections/${id}`, jsonOptions('PUT', values)))).data
export const deleteExploreCollection = async (id) => parseResponse(await fetch(`${API_URL}/explore-collections/${id}`, { method: 'DELETE' }))
