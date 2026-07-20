import { useCallback, useEffect, useMemo, useState } from 'react'
import { createBanners, deleteBanner, getBanners, updateBanner } from '../services/bannerApi'
import DashboardPage from '../pages/DashboardPage'
import BannersPage from '../pages/BannersPage'
import AboutSectionPage from '../pages/AboutSectionPage'
import GalleryPage from '../pages/GalleryPage'
import OffersPage from '../pages/OffersPage'
import CategoriesPage from '../pages/CategoriesPage'
import BlogsPage from '../pages/BlogsPage'
import TestimonialsPage from '../pages/TestimonialsPage'
import ContactEnquiriesPage from '../pages/ContactEnquiriesPage'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import BannerModal from './BannerModal'
import ConfirmDelete from './ConfirmDelete'
import useToast from '../hooks/useToast'

function DashboardShell({ onLogout }) {
  const { showToast } = useToast()
  const [activePage, setActivePage] = useState(() => new URLSearchParams(window.location.search).has('section') ? 'about' : 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [banners, setBanners] = useState([])
  const [loadingBanners, setLoadingBanners] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [editingBanner, setEditingBanner] = useState(null)
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const activeBannerCount = useMemo(() => banners.length, [banners])

  const loadBannerData = useCallback(async () => {
    setLoadingBanners(true)
    setRequestError('')
    try {
      setBanners(await getBanners())
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setLoadingBanners(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    getBanners()
      .then((data) => {
        if (active) setBanners(data)
      })
      .catch((error) => {
        if (active) setRequestError(error.message)
      })
      .finally(() => {
        if (active) setLoadingBanners(false)
      })

    return () => {
      active = false
    }
  }, [])

  const navigate = (page) => {
    const url = new URL(window.location.href)
    if (page === 'about') url.searchParams.set('section', url.searchParams.get('section') || 'home')
    else url.searchParams.delete('section')
    window.history.replaceState(null, '', url)
    setActivePage(page)
    setSidebarOpen(false)
  }

  const saveBanner = async (slides) => {
    const isEditing = Boolean(editingBanner)
    setRequestError('')
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, slides[0])
        if (slides.length > 1) await createBanners(slides.slice(1))
      } else {
        await createBanners(slides)
      }
      await loadBannerData()
      setShowBannerModal(false)
      setEditingBanner(null)
      showToast(isEditing
        ? slides.length > 1 ? 'Banner updated and new banners added successfully.' : 'Banner updated successfully.'
        : slides.length > 1 ? 'Banners added successfully.' : 'Banner added successfully.')
    } catch (error) {
      setRequestError(error.message)
      showToast(error.message, 'error')
      throw error
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setRequestError('')
      await deleteBanner(deleteTarget.id)
      setDeleteTarget(null)
      await loadBannerData()
      showToast('Banner deleted successfully.')
    } catch (error) {
      setRequestError(error.message)
      setDeleteTarget(null)
      showToast(error.message, 'error')
    }
  }

  return (
    <main className="dashboard-app">
      <Sidebar activePage={activePage} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <DashboardHeader activePage={activePage} onMenu={() => setSidebarOpen(true)} onLogout={onLogout} />
        {activePage === 'dashboard' ? (
          <DashboardPage
            bannerCount={activeBannerCount}
            onOpenBanners={() => navigate('banners')}
            onOpenGallery={() => navigate('gallery')}
            onOpenOffers={() => navigate('offers')}
            onOpenCategories={() => navigate('categories')}
          />
        ) : activePage === 'banners' ? (
          <BannersPage
            banners={banners}
            loading={loadingBanners}
            error={requestError}
            onRetry={loadBannerData}
            onAdd={() => { setEditingBanner(null); setShowBannerModal(true) }}
            onEdit={(banner) => { setEditingBanner(banner); setShowBannerModal(true) }}
            onDelete={setDeleteTarget}
          />
        ) : activePage === 'about' ? (
          <AboutSectionPage />
        ) : activePage === 'gallery' ? (
          <GalleryPage />
        ) : activePage === 'offers' ? (
          <OffersPage />
        ) : activePage === 'blogs' ? (
          <BlogsPage />
        ) : activePage === 'categories' ? (
          <CategoriesPage />
        ) : activePage === 'testimonials' ? (
          <TestimonialsPage />
        ) : (
          <ContactEnquiriesPage />
        )}
      </div>
      {showBannerModal && (
        <BannerModal
          banner={editingBanner}
          existingSortOrders={banners.filter((item) => item.id !== editingBanner?.id).map((item) => item.sortOrder)}
          nextSortOrder={Math.max(0, ...banners.map((item) => item.sortOrder)) + 1}
          onClose={() => { setShowBannerModal(false); setEditingBanner(null) }}
          onSave={saveBanner}
        />
      )}
      {deleteTarget && <ConfirmDelete banner={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </main>
  )
}

export default DashboardShell
