import { useEffect, useState } from 'react'
import TestimonialModal from '../components/TestimonialModal'
import ConfirmDelete from '../components/ConfirmDelete'
import Icon from '../components/Icon'
import useToast from '../hooks/useToast'
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '../services/testimonialsApi'

const ITEMS_PER_PAGE = 10

function TestimonialsPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadItems = () => {
    setLoading(true)
    setError('')
    return getTestimonials()
      .then((data) => {
        setItems(data)
        setActivePage((current) => Math.min(current, Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE))))
        return data
      })
      .catch((requestError) => { setError(requestError.message); return null })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getTestimonials().then((data) => { if (active) setItems(data) }).catch((requestError) => { if (active) setError(requestError.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const saveItem = async (values) => {
    const creating = !editingItem
    try {
      if (editingItem) await updateTestimonial(editingItem.id, values)
      else await createTestimonial(values)
      const refreshed = await loadItems()
      if (creating && refreshed) setActivePage(Math.max(1, Math.ceil(refreshed.length / ITEMS_PER_PAGE)))
      setModalOpen(false)
      setEditingItem(null)
      showToast(editingItem ? 'Testimonial updated successfully.' : 'Testimonial added successfully.')
    } catch (requestError) {
      showToast(requestError.message, 'error')
      throw requestError
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTestimonial(deleteTarget.id)
      setDeleteTarget(null)
      await loadItems()
      showToast('Testimonial deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  return (
    <section className="dashboard-content testimonials-page page-enter">
      <div className="banner-page-head"><div className="page-heading"><h1>Testimonials</h1><p>Manage the customer feedback displayed on the home page.</p></div><button className="add-banner-button" type="button" disabled={loading || Boolean(error)} onClick={() => { setEditingItem(null); setModalOpen(true) }}><Icon name="plus" />Add Testimonial</button></div>
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadItems}>Retry</button></div>}
      <div className="testimonial-table-card">
        <div className="table-summary"><strong>All testimonials</strong><span>{items.length} items</span></div>
        {loading ? <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading testimonials</strong></div> : <>
          <div className="testimonial-table-scroll"><div className="testimonial-table" role="table" aria-label="Website testimonials">
            <div className="testimonial-row testimonial-table-head" role="row"><span>S.No</span><span>Customer Name</span><span>Designation</span><span>Description</span><span>Rating</span><span>Actions</span></div>
            {visibleItems.map((item, index) => <div className="testimonial-row" role="row" key={item.id}><span className="serial-number">{startIndex + index + 1}</span><strong>{item.customerName}</strong><span>{item.designation}</span><p>{item.description}</p><span className="testimonial-rating" aria-label={`${item.starRating} out of 5 stars`}>{'★'.repeat(item.starRating)}<i>{'★'.repeat(5 - item.starRating)}</i></span><div className="row-actions"><button className="edit" type="button" onClick={() => { setEditingItem(item); setModalOpen(true) }} aria-label={`Edit ${item.customerName}`}><Icon name="edit" /></button><button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.customerName}`}><Icon name="trash" /></button></div></div>)}
            {!items.length && <div className="empty-banners"><Icon name="testimonial" /><strong>No testimonials configured</strong><span>Add a testimonial to display it on the website.</span></div>}
          </div></div>
          {items.length > ITEMS_PER_PAGE && <nav className="gallery-pagination" aria-label="Testimonial pagination"><button type="button" disabled={activePage === 1} onClick={() => setActivePage((page) => page - 1)}>Previous</button><div>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" className={page === activePage ? 'active' : ''} aria-current={page === activePage ? 'page' : undefined} onClick={() => setActivePage(page)} key={page}>{page}</button>)}</div><button type="button" disabled={activePage === totalPages} onClick={() => setActivePage((page) => page + 1)}>Next</button></nav>}
        </>}
      </div>
      {modalOpen && <TestimonialModal item={editingItem} onClose={() => { setModalOpen(false); setEditingItem(null) }} onSave={saveItem} />}
      {deleteTarget && <ConfirmDelete banner={{ title: deleteTarget.customerName }} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </section>
  )
}

export default TestimonialsPage
