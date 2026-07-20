import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { getHomeCategories } from '../services/categoriesApi'
import { getGalleryItems } from '../services/galleryApi'
import { getHomeOffers } from '../services/offersApi'

function DashboardPage({ bannerCount, onOpenBanners, onOpenGallery, onOpenOffers, onOpenCategories }) {
  const [galleryCount, setGalleryCount] = useState(null)
  const [offerCount, setOfferCount] = useState(null)
  const [categoryCount, setCategoryCount] = useState(null)

  useEffect(() => {
    let active = true
    const loadDashboardCounts = () => {
      getGalleryItems()
        .then((items) => {
          if (active) setGalleryCount(items.length)
        })
        .catch(() => {
          // Keep the dashboard stable while the API is temporarily unavailable.
        })

      getHomeOffers()
        .then((sections) => {
          if (active) setOfferCount(sections.reduce((total, section) => total + section.items.length, 0))
        })
        .catch(() => {
          // Each count fails independently so the remaining cards stay available.
        })

      getHomeCategories()
        .then((payload) => {
          if (active) setCategoryCount(payload.data.length)
        })
        .catch(() => {
          // Keep the category card available with a neutral count fallback.
        })
    }

    loadDashboardCounts()
    window.addEventListener('focus', loadDashboardCounts)
    return () => {
      active = false
      window.removeEventListener('focus', loadDashboardCounts)
    }
  }, [])

  return (
    <section className="dashboard-content dashboard-overview-page page-enter">
      <div className="page-heading">
        <h1>Dashboard Overview</h1>
        <p>Monitor and manage your application data</p>
      </div>

      <div className="dashboard-stat-grid">
        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenBanners}
          aria-label={`Open Banners, ${bannerCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="banner" /></span>
          <span className="banner-stat-copy">
            <span>Banners</span>
            <strong>{bannerCount}</strong>
          </span>
        </button>

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenGallery}
          aria-label={galleryCount === null ? 'Open Gallery' : `Open Gallery, ${galleryCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="gallery" /></span>
          <span className="banner-stat-copy">
            <span>Gallery</span>
            <strong>{galleryCount ?? '—'}</strong>
          </span>
        </button>

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenOffers}
          aria-label={offerCount === null ? 'Open Offers' : `Open Offers, ${offerCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="offer" /></span>
          <span className="banner-stat-copy">
            <span>Offers</span>
            <strong>{offerCount ?? '—'}</strong>
          </span>
        </button>

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenCategories}
          aria-label={categoryCount === null ? 'Open Category' : `Open Category, ${categoryCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="category" /></span>
          <span className="banner-stat-copy">
            <span>Category</span>
            <strong>{categoryCount ?? '—'}</strong>
          </span>
        </button>
      </div>
    </section>
  )
}

export default DashboardPage
