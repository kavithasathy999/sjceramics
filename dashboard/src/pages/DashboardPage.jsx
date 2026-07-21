import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import { getHomeCategories } from '../services/categoriesApi'
import { getGalleryItems } from '../services/galleryApi'
import { getHomeOffers } from '../services/offersApi'
import { getProducts } from '../services/productsApi'
import { getBlogs } from '../services/blogsApi'
import { getTestimonials } from '../services/testimonialsApi'
import { getContactEnquiries } from '../services/contactEnquiriesApi'

function DashboardPage({
  bannerCount,
  onOpenBanners,
  onOpenGallery,
  onOpenOffers,
  onOpenNewArrivals,
  onOpenCategories,
  onOpenProducts,
  onOpenBlogs,
  onOpenTestimonials,
  onOpenContactEnquiries
}) {
  const [galleryCount, setGalleryCount] = useState(null)
  const [offerCount, setOfferCount] = useState(null)
  const [newArrivalCount, setNewArrivalCount] = useState(null)
  const [categoryCount, setCategoryCount] = useState(null)
  const [productCount, setProductCount] = useState(null)
  const [blogCount, setBlogCount] = useState(null)
  const [testimonialCount, setTestimonialCount] = useState(null)
  const [contactEnquiryCount, setContactEnquiryCount] = useState(null)

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
          if (!active) return
          setOfferCount(sections
            .filter((section) => section.sectionType !== 'new_arrivals')
            .reduce((total, section) => total + section.items.length, 0))
          setNewArrivalCount(sections.find((section) => section.sectionType === 'new_arrivals')?.items.length || 0)
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

      getProducts()
        .then((payload) => {
          if (active && payload && payload.data) setProductCount(payload.data.length)
        })
        .catch(() => {
          // Stable fallback
        })

      getBlogs()
        .then((items) => {
          if (active && items) setBlogCount(items.length)
        })
        .catch(() => {
          // Stable fallback
        })

      getTestimonials()
        .then((items) => {
          if (active && items) setTestimonialCount(items.length)
        })
        .catch(() => {
          // Stable fallback
        })

      getContactEnquiries()
        .then((items) => {
          if (active && items) setContactEnquiryCount(items.length)
        })
        .catch(() => {
          // Stable fallback
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
          onClick={onOpenNewArrivals}
          aria-label={newArrivalCount === null ? 'Open New Arrivals' : `Open New Arrivals, ${newArrivalCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="arrival" /></span>
          <span className="banner-stat-copy">
            <span>New Arrivals</span>
            <strong>{newArrivalCount ?? '-'}</strong>
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

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenProducts}
          aria-label={productCount === null ? 'Open Products' : `Open Products, ${productCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="product" /></span>
          <span className="banner-stat-copy">
            <span>Products</span>
            <strong>{productCount ?? '—'}</strong>
          </span>
        </button>

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenBlogs}
          aria-label={blogCount === null ? 'Open Blogs' : `Open Blogs, ${blogCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="blog" /></span>
          <span className="banner-stat-copy">
            <span>Blogs</span>
            <strong>{blogCount ?? '—'}</strong>
          </span>
        </button>

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenTestimonials}
          aria-label={testimonialCount === null ? 'Open Testimonials' : `Open Testimonials, ${testimonialCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="testimonial" /></span>
          <span className="banner-stat-copy">
            <span>Testimonials</span>
            <strong>{testimonialCount ?? '—'}</strong>
          </span>
        </button>

        <button
          className="banner-stat-card"
          type="button"
          onClick={onOpenContactEnquiries}
          aria-label={contactEnquiryCount === null ? 'Open Contact Enquiries' : `Open Contact Enquiries, ${contactEnquiryCount} total`}
        >
          <span className="banner-stat-icon"><Icon name="mail" /></span>
          <span className="banner-stat-copy">
            <span>Contact Enquiries</span>
            <strong>{contactEnquiryCount ?? '—'}</strong>
          </span>
        </button>
      </div>
    </section>
  )
}

export default DashboardPage
