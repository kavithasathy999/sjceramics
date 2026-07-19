import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import useToast from '../hooks/useToast'

const PROFILE_IMAGE_KEY = 'sj-dashboard-profile-image'
const MAX_PROFILE_SIZE = 3 * 1024 * 1024
const ALLOWED_PROFILE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const loadProfileImage = () => {
  try {
    return localStorage.getItem(PROFILE_IMAGE_KEY) || ''
  } catch {
    return ''
  }
}

function DashboardHeader({ activePage, onMenu, onLogout }) {
  const { showToast } = useToast()
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(loadProfileImage)
  const [uploadError, setUploadError] = useState('')
  const profileMenuRef = useRef(null)
  const fileInputRef = useRef(null)
  const pageTitle = activePage === 'dashboard'
    ? 'Admin Portal'
    : activePage === 'banners' ? 'Banner Management'
      : activePage === 'gallery' ? 'Gallery Management' : 'About Page Management'

  useEffect(() => {
    if (!profileOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileOpen])

  const handleProfileUpload = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    setUploadError('')
    if (!file) return

    if (!ALLOWED_PROFILE_TYPES.has(file.type)) {
      const message = 'Upload a JPG, PNG, or WebP image.'
      setUploadError(message)
      showToast(message, 'error')
      return
    }

    if (file.size > MAX_PROFILE_SIZE) {
      const message = 'Profile picture must be 3 MB or smaller.'
      setUploadError(message)
      showToast(message, 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imageData = String(reader.result)
        localStorage.setItem(PROFILE_IMAGE_KEY, imageData)
        setProfileImage(imageData)
        setProfileOpen(false)
        showToast('Profile picture updated successfully.')
      } catch {
        const message = 'Unable to save this image. Choose a smaller file.'
        setUploadError(message)
        showToast(message, 'error')
      }
    }
    reader.onerror = () => {
      const message = 'Unable to read this image. Please try another file.'
      setUploadError(message)
      showToast(message, 'error')
    }
    reader.readAsDataURL(file)
  }

  return (
    <header className="dashboard-header">
      <button className="menu-button" onClick={onMenu} aria-label="Open navigation"><Icon name="menu" /></button>
      <div>
        <span className="header-eyebrow">SJ Ceramics</span>
        <strong>{pageTitle}</strong>
      </div>

      <div className="profile-menu" ref={profileMenuRef}>
        <button
          className="admin-profile"
          type="button"
          onClick={() => { setProfileOpen((current) => !current); setUploadError('') }}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
        >
          <span className="admin-avatar">
            {profileImage ? <img src={profileImage} alt="Admin profile" /> : 'A'}
          </span>
          <div><strong>Admin</strong></div>
          <span className={`profile-chevron ${profileOpen ? 'open' : ''}`}><Icon name="chevron" /></span>
        </button>

        {profileOpen && (
          <div className="profile-dropdown" role="menu">
            <button type="button" role="menuitem" onClick={() => fileInputRef.current?.click()}>
              <Icon name="edit" /><span>Upload Profile Picture</span>
            </button>
            <input
              ref={fileInputRef}
              className="profile-upload-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleProfileUpload}
            />
            {uploadError && <p className="profile-upload-error" role="alert">{uploadError}</p>}
            <span className="profile-menu-divider" />
            <button className="profile-logout" type="button" role="menuitem" onClick={onLogout}>
              <Icon name="logout" /><span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default DashboardHeader
