const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Unable to complete the about section request.')
  return payload
}

export const getAboutSection = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/about-section`))
  return payload.data
}

export const updateAboutSection = async ({ title, description, video }) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  if (video) formData.append('video', video)

  const payload = await parseResponse(await fetch(`${API_URL}/about-section`, {
    method: 'PUT',
    body: formData,
  }))
  return payload.data
}

export const getFounderShowcase = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/founder-showcase`))
  return payload.data
}

export const updateFounderShowcase = async (portrait) => {
  const formData = new FormData()
  formData.append('portrait', portrait)
  const payload = await parseResponse(await fetch(`${API_URL}/founder-showcase`, {
    method: 'PUT',
    body: formData,
  }))
  return payload.data
}

export const getMissionVision = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/mission-vision`))
  return payload.data
}

export const updateMissionVision = async (data) => {
  const payload = await parseResponse(await fetch(`${API_URL}/mission-vision`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }))
  return payload.data
}

export const getRoomDesigns = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/room-designs`))
  return payload.data
}

const roomDesignFormData = ({ title, image, sortOrder }) => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('sortOrder', String(sortOrder))
  if (image) formData.append('image', image)
  return formData
}

export const createRoomDesign = async (roomDesign) => {
  const payload = await parseResponse(await fetch(`${API_URL}/room-designs`, {
    method: 'POST',
    body: roomDesignFormData(roomDesign),
  }))
  return payload.data
}

export const updateRoomDesign = async (id, roomDesign) => {
  const payload = await parseResponse(await fetch(`${API_URL}/room-designs/${id}`, {
    method: 'PUT',
    body: roomDesignFormData(roomDesign),
  }))
  return payload.data
}

export const deleteRoomDesign = async (id) => {
  await parseResponse(await fetch(`${API_URL}/room-designs/${id}`, { method: 'DELETE' }))
}
