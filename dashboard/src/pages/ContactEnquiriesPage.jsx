import { useEffect, useState } from 'react'
import ConfirmDelete from '../components/ConfirmDelete'
import ContactEnquiryModal from '../components/ContactEnquiryModal'
import Icon from '../components/Icon'
import useToast from '../hooks/useToast'
import { deleteContactEnquiry, getContactEnquiries, updateContactEnquiry } from '../services/contactEnquiriesApi'

const ITEMS_PER_PAGE = 10
const formatSubmitted = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata',
}).format(new Date(value))

function ContactEnquiriesPage() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadItems = () => {
    setLoading(true)
    setError('')
    return getContactEnquiries()
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
    getContactEnquiries().then((data) => { if (active) setItems(data) }).catch((requestError) => { if (active) setError(requestError.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const saveItem = async (values) => {
    try {
      await updateContactEnquiry(editingItem.id, values)
      await loadItems()
      setEditingItem(null)
      showToast('Contact enquiry updated successfully.')
    } catch (requestError) {
      showToast(requestError.message, 'error')
      throw requestError
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteContactEnquiry(deleteTarget.id)
      setDeleteTarget(null)
      await loadItems()
      showToast('Contact enquiry deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  return (
    <section className="dashboard-content contact-enquiries-page page-enter">
      <div className="banner-page-head"><div className="page-heading"><h1>Contact Enquiries</h1><p>Manage enquiries submitted through the website contact form</p></div></div>
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadItems}>Retry</button></div>}
      <div className="contact-enquiry-table-card">
        <div className="table-summary"><strong>All contact enquiries</strong><span>{items.length} items</span></div>
        {loading ? <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading contact enquiries</strong></div> : <>
          <div className="contact-enquiry-table-scroll"><div className="contact-enquiry-table" role="table" aria-label="Contact enquiries">
            <div className="contact-enquiry-row contact-enquiry-table-head" role="row"><span>S.No</span><span>Customer Name</span><span>Email</span><span>Mobile Number</span><span>Message</span><span>Submitted</span><span>Actions</span></div>
            {visibleItems.map((item, index) => <div className="contact-enquiry-row" role="row" key={item.id}><span className="serial-number">{startIndex + index + 1}</span><strong>{item.fullName}</strong><a href={`mailto:${item.email}`}>{item.email}</a><a href={`tel:${item.phone}`}>{item.phone}</a><p>{item.message}</p><time dateTime={item.submittedAt}>{formatSubmitted(item.submittedAt)}</time><div className="row-actions"><button className="edit" type="button" onClick={() => setEditingItem(item)} aria-label={`Edit ${item.fullName}`}><Icon name="edit" /></button><button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.fullName}`}><Icon name="trash" /></button></div></div>)}
            {!items.length && <div className="empty-banners"><Icon name="mail" /><strong>No contact enquiries yet</strong><span>New contact form submissions will appear here.</span></div>}
          </div></div>
          {items.length > ITEMS_PER_PAGE && <nav className="gallery-pagination" aria-label="Contact enquiry pagination"><button type="button" disabled={activePage === 1} onClick={() => setActivePage((page) => page - 1)}>Previous</button><div>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" className={page === activePage ? 'active' : ''} aria-current={page === activePage ? 'page' : undefined} onClick={() => setActivePage(page)} key={page}>{page}</button>)}</div><button type="button" disabled={activePage === totalPages} onClick={() => setActivePage((page) => page + 1)}>Next</button></nav>}
        </>}
      </div>
      {editingItem && <ContactEnquiryModal item={editingItem} onClose={() => setEditingItem(null)} onSave={saveItem} />}
      {deleteTarget && <ConfirmDelete banner={{ title: deleteTarget.fullName }} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </section>
  )
}

export default ContactEnquiriesPage
