import { useEffect, useState } from 'react'
import ConfirmDelete from '../components/ConfirmDelete'
import GalleryModal from '../components/GalleryModal'
import Icon from '../components/Icon'
import useToast from '../hooks/useToast'
import { createGalleryItem, deleteGalleryItem, getGalleryItems, updateGalleryItem } from '../services/galleryApi'

const MAX_GALLERY_ITEMS = 20

function GalleryPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadItems = () => {
    setLoading(true)
    setError('')
    return getGalleryItems()
      .then(setItems)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getGalleryItems()
      .then((data) => { if (active) setItems(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const saveItem = async (values) => {
    try {
      if (editingItem) {
        await updateGalleryItem(editingItem.id, values)
        showToast('Gallery item updated successfully.')
      } else {
        await createGalleryItem(values)
        showToast('Gallery item added successfully.')
      }
      await loadItems()
      setModalOpen(false)
      setEditingItem(null)
    } catch (requestError) {
      showToast(requestError.message, 'error')
      throw requestError
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteGalleryItem(deleteTarget.id)
      setDeleteTarget(null)
      await loadItems()
      showToast('Gallery item deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  const atLimit = items.length >= MAX_GALLERY_ITEMS

  return (
    <section className="dashboard-content gallery-page page-enter">
      <div className="banner-page-head">
        <div className="page-heading"><h1>Gallery</h1><p>Manage the images and titles displayed in the website gallery.</p></div>
        <button className="add-banner-button" type="button" disabled={atLimit} onClick={() => { setEditingItem(null); setModalOpen(true) }}><Icon name="plus" />Add Gallery Item</button>
      </div>

      {atLimit && <div className="gallery-limit-message" role="status">Maximum limit reached. Delete an item before adding another.</div>}
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadItems}>Retry</button></div>}

      <div className="gallery-table-card banner-table-card">
        <div className="table-summary"><strong>All gallery items</strong><span>{items.length} / {MAX_GALLERY_ITEMS} items</span></div>
        {loading ? <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading gallery</strong></div> : (
          <div className="gallery-table" role="table" aria-label="Gallery items">
            <div className="gallery-row gallery-table-head" role="row"><span>S.No</span><span>Image Preview</span><span>Title</span><span>Actions</span></div>
            {items.map((item, index) => (
              <div className="gallery-row" role="row" key={item.id}>
                <span className="serial-number">{index + 1}</span>
                <div className="gallery-table-preview"><img src={item.imageUrl} alt={`${item.title} preview`} /></div>
                <strong>{item.title}</strong>
                <div className="row-actions">
                  <button className="edit" type="button" onClick={() => { setEditingItem(item); setModalOpen(true) }} aria-label={`Edit ${item.title}`} title="Edit gallery item"><Icon name="edit" /></button>
                  <button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.title}`} title="Delete gallery item"><Icon name="trash" /></button>
                </div>
              </div>
            ))}
            {!items.length && <div className="empty-banners"><Icon name="gallery" /><strong>No gallery items yet</strong><span>Add your first gallery item to get started.</span></div>}
          </div>
        )}
      </div>

      {modalOpen && <GalleryModal item={editingItem} onClose={() => { setModalOpen(false); setEditingItem(null) }} onSave={saveItem} />}
      {deleteTarget && <ConfirmDelete banner={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </section>
  )
}

export default GalleryPage
