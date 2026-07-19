const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Unable to complete the banner request.')
  return payload
}

const dataUrlToFile = async (dataUrl, index) => {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  const extension = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'
  return new File([blob], `banner-${Date.now()}-${index}.${extension}`, { type: blob.type })
}

const normalizeBanner = (banner) => ({
  ...banner,
  image: banner.imageUrl || '',
  theme: 'ruby',
})

export const getBanners = async () => {
  const payload = await parseResponse(await fetch(`${API_URL}/banners`))
  return payload.data.map(normalizeBanner)
}

export const createBanners = async (slides) => {
  const formData = new FormData()
  const metadata = []

  for (const [index, slide] of slides.entries()) {
    const fileIndex = index
    const file = await dataUrlToFile(slide.image, index)
    formData.append('images', file)
    metadata.push({
      title: slide.title,
      description: slide.description,
      placement: slide.placement,
      sortOrder: slide.sortOrder,
      fileIndex,
    })
  }
  formData.append('slides', JSON.stringify(metadata))

  const payload = await parseResponse(await fetch(`${API_URL}/banners/batch`, { method: 'POST', body: formData }))
  return payload.data.map(normalizeBanner)
}

export const updateBanner = async (id, banner) => {
  const formData = new FormData()
  formData.append('title', banner.title)
  formData.append('description', banner.description)
  formData.append('placement', banner.placement)
  formData.append('sortOrder', String(banner.sortOrder))
  if (banner.image?.startsWith('data:')) formData.append('image', await dataUrlToFile(banner.image, 0))

  const payload = await parseResponse(await fetch(`${API_URL}/banners/${id}`, { method: 'PUT', body: formData }))
  return normalizeBanner(payload.data)
}

export const deleteBanner = async (id) => {
  await parseResponse(await fetch(`${API_URL}/banners/${id}`, { method: 'DELETE' }))
}
