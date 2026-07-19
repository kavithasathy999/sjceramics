import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { getGalleryItems } from '../services/galleryApi'

function DashboardPage({ bannerCount, onOpenBanners, onOpenGallery }) {
  const [galleryCount, setGalleryCount] = useState(null)

  useEffect(() => {
    let active = true
    const loadGalleryCount = () => {
      getGalleryItems()
        .then((items) => {
          if (active) setGalleryCount(items.length)
        })
        .catch(() => {
          // Keep the dashboard stable while the API is temporarily unavailable.
        })
    }

    loadGalleryCount()
    window.addEventListener('focus', loadGalleryCount)
    return () => {
      active = false
      window.removeEventListener('focus', loadGalleryCount)
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
      </div>
    </section>
  )
}

export default DashboardPage
