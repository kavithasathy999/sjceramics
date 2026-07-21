import { useEffect, useMemo, useState } from 'react'
import ConfirmDelete from '../components/ConfirmDelete'
import Icon from '../components/Icon'
import OfferModal from '../components/OfferModal'
import useToast from '../hooks/useToast'
import { createHomeOffer, deleteHomeOffer, getHomeOffers, updateHomeOffer } from '../services/offersApi'

const tabs = [
  { type: 'todays_offer', label: "Today's Offer", limit: 1 },
  { type: 'launching_offer', label: 'Launching Offer', limit: 1 },
]

function OffersPage() {
  const { showToast } = useToast()
  const [activeType, setActiveType] = useState('todays_offer')
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadSections = () => {
    setLoading(true)
    setError('')
    return getHomeOffers()
      .then(setSections)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getHomeOffers()
      .then((data) => { if (active) setSections(data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const selectedTab = tabs.find((tab) => tab.type === activeType)
  const selectedSection = useMemo(() => sections.find((section) => section.sectionType === activeType), [activeType, sections])
  const items = selectedSection?.items || []
  const atLimit = items.length >= selectedTab.limit
  const unavailable = Boolean(error) && sections.length === 0

  const saveItem = async (values) => {
    try {
      if (editingItem) {
        await updateHomeOffer(editingItem.id, values)
        showToast('Offer card updated successfully.')
      } else {
        await createHomeOffer(values)
        showToast('Offer card added successfully.')
      }
      await loadSections()
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
      await deleteHomeOffer(deleteTarget.id)
      setDeleteTarget(null)
      await loadSections()
      showToast('Offer card deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  return (
    <section className="dashboard-content offers-page page-enter">
      <div className="banner-page-head">
        <div className="page-heading"><h1>Offers</h1><p>Manage the offer and new-arrival cards displayed on the home page</p></div>
      </div>

      <div className="offers-tabs" role="tablist" aria-label="Offer sections">
        {tabs.map((tab) => {
          const count = sections.find((section) => section.sectionType === tab.type)?.items.length || 0
          return <button type="button" role="tab" aria-selected={activeType === tab.type} className={activeType === tab.type ? 'active' : ''} onClick={() => setActiveType(tab.type)} key={tab.type}><span>{tab.label}</span><small>{unavailable ? '—' : count} / {tab.limit}</small></button>
        })}
      </div>

      <div className="offers-section-toolbar">
        <div><h2>{selectedTab.label}</h2><span>{unavailable ? '—' : items.length} / {selectedTab.limit} cards</span></div>
        <button className="add-banner-button" type="button" disabled={atLimit || loading || unavailable} onClick={() => { setEditingItem(null); setModalOpen(true) }}><Icon name="plus" />Add Card</button>
      </div>

      {atLimit && <div className="gallery-limit-message" role="status">{selectedTab.label} maximum limit reached. Delete the existing card before adding another.</div>}
      {!loading && selectedSection && !selectedSection.configured && <div className="offers-fallback-note" role="status">The website is currently showing its original frontend content for this section. Adding a card will activate dashboard-managed content.</div>}
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadSections}>Retry</button></div>}

      <div className="offers-table-card">
        {loading ? <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading offers</strong></div> : (
          <div className="offers-card-list" role="table" aria-label={`${selectedTab.label} cards`}>
            {!unavailable && <div className="offers-list-head" role="row"><span role="columnheader">S.No</span><span role="columnheader">Preview</span><span role="columnheader">Card information</span><span role="columnheader">Actions</span></div>}
            {unavailable ? (
              <div className="offers-unavailable-state"><Icon name="offer" /><strong>Offers API unavailable</strong><span>The original website content is still safe. Restart the updated API server, then retry.</span><button type="button" onClick={loadSections}>Retry</button></div>
            ) : items.map((item, index) => (
              <article className="dashboard-offer-card" role="row" key={item.id}>
                <span className="offer-serial" role="cell">{index + 1}</span>
                <div className="dashboard-offer-image" role="cell"><img src={item.imageUrl} alt={`${item.productName} preview`} /></div>
                <div className="dashboard-offer-copy" role="cell"><small>{item.category}</small><h2>{item.productName}</h2><p>{item.size} · {item.finish}</p>{activeType === 'new_arrivals' ? <strong>{item.arrivalStatus}</strong> : <strong>₹{item.offerPrice} <del>₹{item.mrp}</del></strong>}<p>{item.availability}</p></div>
                <div className="row-actions" role="cell"><button className="edit" type="button" onClick={() => { setEditingItem(item); setModalOpen(true) }} aria-label={`Edit ${item.productName}`} title="Edit card"><Icon name="edit" /></button><button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.productName}`} title="Delete card"><Icon name="trash" /></button></div>
              </article>
            ))}
            {!unavailable && !items.length && <div className="empty-banners"><Icon name="banner" /><strong>No dashboard cards in this section</strong><span>Original frontend content remains visible until an admin adds a card.</span></div>}
          </div>
        )}
      </div>

      {modalOpen && <OfferModal item={editingItem} sectionType={activeType} onClose={() => { setModalOpen(false); setEditingItem(null) }} onSave={saveItem} />}
      {deleteTarget && <ConfirmDelete banner={{ title: deleteTarget.productName }} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </section>
  )
}

export default OffersPage
