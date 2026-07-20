import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon'
import {
  createRoomDesign,
  deleteRoomDesign,
  getAboutSection,
  getFounderShowcase,
  getRoomDesigns,
  updateAboutSection,
  updateFounderShowcase,
  updateRoomDesign,
} from '../services/aboutSectionApi'
import useToast from '../hooks/useToast'
import RoomDesignModal from '../components/RoomDesignModal'
import ConfirmDelete from '../components/ConfirmDelete'
import ExploreCollectionsEditor from '../components/ExploreCollectionsEditor'

const MAX_VIDEO_SIZE = 8 * 1024 * 1024
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm'])
const MAX_IMAGE_SIZE = 3 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const countWords = (value) => value.trim() ? value.trim().split(/\s+/).length : 0

function HomeAboutEditor() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ title: '', description: '' })
  const [video, setVideo] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const objectUrlRef = useRef('')
  const fileInputRef = useRef(null)

  const applySection = (section) => {
    setForm({ title: section.title, description: section.description })
    setVideoUrl(section.videoUrl)
  }

  const loadSection = () => {
    setLoading(true)
    setRequestError('')
    return getAboutSection()
      .then(applySection)
      .catch((error) => setRequestError(error.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getAboutSection()
      .then((section) => {
        if (active) {
          setForm({ title: section.title, description: section.description })
          setVideoUrl(section.videoUrl)
        }
      })
      .catch((error) => {
        if (active) setRequestError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleVideo = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      setErrors((current) => ({ ...current, video: 'Upload an MP4 or WebM video.' }))
      return
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setErrors((current) => ({ ...current, video: 'About video must be 8 MB or smaller.' }))
      return
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = URL.createObjectURL(file)
    setVideo(file)
    setVideoUrl(objectUrlRef.current)
    setErrors((current) => ({ ...current, video: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'About title is required.'
    else if (countWords(form.title) > 6) nextErrors.title = 'About title must contain 6 words or fewer.'
    if (!form.description.trim()) nextErrors.description = 'About description is required.'
    else if (countWords(form.description) > 100) nextErrors.description = 'About description must contain 100 words or fewer.'
    if (!videoUrl) nextErrors.video = 'About video is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      showToast('Please correct the highlighted fields.', 'error')
      return
    }

    setSaving(true)
    setRequestError('')
    try {
      const updated = await updateAboutSection({
        title: form.title.trim(),
        description: form.description.trim(),
        video,
      })
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = ''
      }
      setVideo(null)
      applySection(updated)
      showToast('About section updated successfully.')
    } catch (error) {
      setRequestError(error.message)
      showToast(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="about-tab-panel">
      {requestError && <div className="banner-api-error" role="alert"><span>{requestError}</span><button type="button" onClick={loadSection}>Retry</button></div>}

      <form id="home-about-settings-form" className="about-editor-card" onSubmit={handleSubmit} aria-busy={loading || saving}>
        {loading ? (
          <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading about section</strong></div>
        ) : (
          <>
            <div className="editor-settings-toolbar">
              <button className="about-save-settings" type="submit" disabled={saving}>
                <Icon name="save" />{saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
            <div className="about-editor-fields">
              <label>
                <span className="field-label-row"><strong>Title</strong><small className={countWords(form.title) > 6 ? 'over-limit' : ''}>{countWords(form.title)} / 6 words</small></span>
                <input value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Enter about title" />
                {errors.title && <em>{errors.title}</em>}
              </label>

              <label>
                <span className="field-label-row"><strong>Description</strong><small className={countWords(form.description) > 100 ? 'over-limit' : ''}>{countWords(form.description)} / 100 words</small></span>
                <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Enter about description" rows="9" />
                {errors.description && <em>{errors.description}</em>}
              </label>
            </div>

            <div className="about-video-editor">
              <span className="about-editor-label">About video</span>
              <div className="about-video-preview">
                {videoUrl ? <video key={videoUrl} src={videoUrl} controls preload="metadata" /> : <Icon name="video" />}
              </div>
              <input ref={fileInputRef} type="file" accept=".mp4,.webm,video/mp4,video/webm" onChange={handleVideo} />
              <button type="button" className="about-video-button" onClick={() => fileInputRef.current?.click()}><Icon name="video" />{videoUrl ? 'Change Video' : 'Upload Video'}</button>
              <small>MP4 or WebM - Max 8 MB</small>
              {errors.video && <em>{errors.video}</em>}
            </div>

          </>
        )}
      </form>
    </div>
  )
}

const validateImage = (file) => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return 'Upload a JPG, PNG, or WebP image.'
  if (file.size > MAX_IMAGE_SIZE) return 'Image must be 3 MB or smaller.'
  return ''
}

function FounderEditor() {
  const { showToast } = useToast()
  const [portraitUrl, setPortraitUrl] = useState('')
  const [portrait, setPortrait] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const objectUrlRef = useRef('')
  const inputRef = useRef(null)

  const loadPortrait = () => {
    setLoading(true)
    setError('')
    return getFounderShowcase()
      .then((data) => setPortraitUrl(data.portraitUrl || ''))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getFounderShowcase()
      .then((data) => {
        if (active) setPortraitUrl(data.portraitUrl || '')
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const handlePortrait = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      showToast(validationError, 'error')
      return
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = URL.createObjectURL(file)
    setPortrait(file)
    setPortraitUrl(objectUrlRef.current)
    setError('')
  }

  const savePortrait = async () => {
    if (!portrait) {
      const message = 'Choose a CEO & Founder photo.'
      setError(message)
      showToast(message, 'error')
      return
    }

    setSaving(true)
    setError('')
    try {
      const updated = await updateFounderShowcase(portrait)
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = ''
      setPortrait(null)
      setPortraitUrl(updated.portraitUrl || '')
      showToast('CEO & Founder photo updated successfully.')
    } catch (requestError) {
      setError(requestError.message)
      showToast(requestError.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading CEO & Founder photo</strong></div>

  return (
    <div className="about-tab-panel">
      {error && <div className="banner-api-error" role="alert"><span>{error}</span>{!portraitUrl && <button type="button" onClick={loadPortrait}>Retry</button>}</div>}
      <form id="founder-settings-form" className="founder-editor-card" onSubmit={(event) => { event.preventDefault(); savePortrait() }}>
        <div className="editor-settings-toolbar">
          <button className="about-save-settings" type="submit" disabled={!portrait || saving}>
            <Icon name="save" />{saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        <div className={`founder-editor-preview ${portraitUrl ? '' : 'empty'}`}>
          {portraitUrl ? <img src={portraitUrl} alt="CEO and Founder preview" /> : <Icon name="video" />}
        </div>
        <div className="founder-editor-copy">
          <span className="content-kicker">Leadership portrait</span>
          <h2>CEO &amp; Founder Photo</h2>
          <p>Upload the portrait displayed on the right side of the About page leadership section.</p>
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handlePortrait} />
          <small>JPG, PNG or WebP - Max 3 MB</small>
          <div className="founder-editor-actions">
            <button type="button" className="secondary" onClick={() => inputRef.current?.click()}>{portraitUrl ? 'Change Photo' : 'Upload Photo'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

function RoomDesignsEditor() {
  const { showToast } = useToast()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingDesign, setEditingDesign] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadDesigns = () => {
    setLoading(true)
    setError('')
    return getRoomDesigns()
      .then(setDesigns)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getRoomDesigns()
      .then((data) => {
        if (active) setDesigns(data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const saveDesign = async (values) => {
    try {
      if (editingDesign) {
        await updateRoomDesign(editingDesign.id, values)
        showToast('Room design updated successfully.')
      } else {
        await createRoomDesign(values)
        showToast('Room design added successfully.')
      }
      await loadDesigns()
      setModalOpen(false)
      setEditingDesign(null)
    } catch (requestError) {
      showToast(requestError.message, 'error')
      throw requestError
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteRoomDesign(deleteTarget.id)
      setDeleteTarget(null)
      await loadDesigns()
      showToast('Room design deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  if (loading) return <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading room designs</strong></div>

  return (
    <div className="about-tab-panel">
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadDesigns}>Retry</button></div>}
      <div className="room-table-toolbar">
        <div><h2>Rooms &amp; Designs</h2><span>{designs.length} {designs.length === 1 ? 'entry' : 'entries'}</span></div>
        <button type="button" onClick={() => { setEditingDesign(null); setModalOpen(true) }}><Icon name="plus" />Add Rooms &amp; Design</button>
      </div>

      <div className="room-design-table-card">
        <div className="room-design-table" role="table" aria-label="Rooms and designs">
          <div className="room-design-row room-design-table-head" role="row"><span>S.No</span><span>Image Preview</span><span>Title</span><span>Sort Order</span><span>Actions</span></div>
          {designs.map((design, index) => (
            <div className="room-design-row" role="row" key={design.id}>
              <span className="serial-number">{index + 1}</span>
              <div className="room-table-preview"><img src={design.imageUrl} alt={`${design.title} preview`} /></div>
              <strong>{design.title}</strong>
              <span className="room-sort-order">{design.sortOrder}</span>
              <div className="row-actions">
                <button className="edit" type="button" onClick={() => { setEditingDesign(design); setModalOpen(true) }} aria-label={`Edit ${design.title}`} title="Edit room design"><Icon name="edit" /></button>
                <button className="delete" type="button" onClick={() => setDeleteTarget(design)} aria-label={`Delete ${design.title}`} title="Delete room design"><Icon name="trash" /></button>
              </div>
            </div>
          ))}
          {!designs.length && <div className="empty-banners"><Icon name="banner" /><strong>No room designs yet</strong><span>Add your first room design to get started.</span></div>}
        </div>
      </div>

      {modalOpen && <RoomDesignModal roomDesign={editingDesign} nextSortOrder={designs.length + 1} onClose={() => { setModalOpen(false); setEditingDesign(null) }} onSave={saveDesign} />}
      {deleteTarget && <ConfirmDelete banner={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </div>
  )
}

const tabs = [
  { id: 'home', label: 'Home About Section' },
  { id: 'founder', label: 'CEO & Founder' },
  { id: 'room-designs', label: 'Room Designs' },
  { id: 'explore-collections', label: 'Explore Collections' },
]

const getSelectedTab = () => {
  const section = new URLSearchParams(window.location.search).get('section')
  return tabs.some((tab) => tab.id === section) ? section : 'home'
}

function AboutSectionPage() {
  const [activeTab, setActiveTab] = useState(getSelectedTab)

  useEffect(() => {
    const syncTab = () => setActiveTab(getSelectedTab())
    window.addEventListener('popstate', syncTab)
    return () => window.removeEventListener('popstate', syncTab)
  }, [])

  const selectTab = (tabId) => {
    const url = new URL(window.location.href)
    url.searchParams.set('section', tabId)
    window.history.pushState(null, '', url)
    setActiveTab(tabId)
  }

  return (
    <section className="dashboard-content about-section-page page-enter">
      <div className="about-settings-heading">
        <span className="about-settings-icon"><Icon name="video" /></span>
        <div><h1>About Us Settings</h1><p style={{color: "#dd2328"}}>Select a website section and update its visual content.</p></div>
      </div>

      <nav className="about-settings-tabs" aria-label="About page settings">
        {tabs.map((tab) => (
          <button type="button" className={activeTab === tab.id ? 'active' : ''} onClick={() => selectTab(tab.id)} aria-current={activeTab === tab.id ? 'page' : undefined} key={tab.id}>{tab.label}</button>
        ))}
      </nav>

      {activeTab === 'home' && <HomeAboutEditor />}
      {activeTab === 'founder' && <FounderEditor />}
      {activeTab === 'room-designs' && <RoomDesignsEditor />}
      {activeTab === 'explore-collections' && <ExploreCollectionsEditor />}
    </section>
  )
}

export default AboutSectionPage
