export const BANNERS_KEY = 'sj-dashboard-banners'

export const initialBanners = [
  { id: 1, title: 'Luxury Tiles Collection', description: 'Timeless surfaces for beautiful spaces', placement: 'Home hero', theme: 'ruby', image: '', sortOrder: 1 },
  { id: 2, title: 'Premium Bathware', description: 'Thoughtful design meets everyday comfort', placement: 'Home hero', theme: 'charcoal', image: '', sortOrder: 2 },
  { id: 3, title: 'New Arrivals 2026', description: 'Discover our latest ceramic collection', placement: 'Products', theme: 'coral', image: '', sortOrder: 3 },
]

const normalizeBanners = (banners) => banners
  .map((banner, index) => ({
    id: banner.id,
    title: banner.title || '',
    description: banner.description ?? banner.subtitle ?? '',
    placement: banner.placement || 'Home hero',
    theme: banner.theme || 'ruby',
    image: banner.image || '',
    sortOrder: Number.isInteger(Number(banner.sortOrder)) && Number(banner.sortOrder) > 0
      ? Number(banner.sortOrder)
      : index + 1,
  }))
  .sort((first, second) => first.sortOrder - second.sortOrder)

export const loadBanners = () => {
  try {
    const saved = localStorage.getItem(BANNERS_KEY)
    return saved ? normalizeBanners(JSON.parse(saved)) : initialBanners
  } catch {
    return initialBanners
  }
}
