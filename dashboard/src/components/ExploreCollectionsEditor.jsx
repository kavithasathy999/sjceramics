import { useEffect, useState } from 'react'
import ConfirmDelete from './ConfirmDelete'
import ExploreCollectionModal from './ExploreCollectionModal'
import Icon from './Icon'
import useToast from '../hooks/useToast'
import { createExploreCollection, deleteExploreCollection, getExploreCollections, updateExploreCollection } from '../services/exploreCollectionsApi'

const FILTERS = [
  { id: 'all', label: 'All Collections' },
  { id: 'colors', label: 'Choose By Colors' },
  { id: 'size', label: 'Choose By Size' },
  { id: 'thickness', label: 'Choose By Thickness' },
]
const typeLabel = (type) => FILTERS.find((filter) => filter.id === type)?.label || type

function ExploreCollectionsEditor() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadItems = () => {
    setLoading(true)
    setError('')
    return getExploreCollections().then(setItems).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getExploreCollections().then((data) => { if (active) setItems(data) }).catch((requestError) => { if (active) setError(requestError.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visibleItems = filter === 'all' ? items : items.filter((item) => item.type === filter)
  const saveItem = async (values) => {
    try {
      if (editingItem) await updateExploreCollection(editingItem.id, values)
      else await createExploreCollection(values)
      await loadItems()
      setModalOpen(false)
      setEditingItem(null)
      showToast(editingItem ? 'Collection entry updated successfully.' : 'Collection entry added successfully.')
    } catch (requestError) {
      showToast(requestError.message, 'error')
      throw requestError
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteExploreCollection(deleteTarget.id)
      setDeleteTarget(null)
      await loadItems()
      showToast('Collection entry deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  if (loading) return <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading explore collections</strong></div>

  return <div className="about-tab-panel explore-collections-editor">
    {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadItems}>Retry</button></div>}
    <div className="room-table-toolbar"><div><h2>Explore Collections</h2><span>{items.length} {items.length === 1 ? 'entry' : 'entries'}</span></div><button type="button" disabled={Boolean(error)} onClick={() => { setEditingItem(null); setModalOpen(true) }}><Icon name="plus" />Add Collection</button></div>
    <div className="collection-filter-tabs" role="tablist" aria-label="Filter explore collections">{FILTERS.map((entry) => <button type="button" role="tab" aria-selected={filter === entry.id} className={filter === entry.id ? 'active' : ''} onClick={() => setFilter(entry.id)} key={entry.id}>{entry.label}<span>{entry.id === 'all' ? items.length : items.filter((item) => item.type === entry.id).length}</span></button>)}</div>
    <div className="explore-collection-table-card"><div className="explore-collection-table-scroll"><div className="explore-collection-table" role="table" aria-label="Explore collections">
      <div className="explore-collection-row explore-collection-table-head" role="row"><span>S.No</span><span>Collection Type</span><span>Preview</span><span>Display Value</span><span>Sort Order</span><span>Actions</span></div>
      {visibleItems.map((item, index) => <div className="explore-collection-row" role="row" key={item.id}><span className="serial-number">{index + 1}</span><strong>{typeLabel(item.type)}</strong><div className="collection-table-preview">{item.type === 'colors' ? <span style={{ background: item.colorHex }} aria-label={`${item.colorName} colour preview`} /> : <b>{item.type === 'size' ? '↔' : 'mm'}</b>}</div><span className="collection-display-value">{item.displayValue}</span><span className="room-sort-order">{item.sortOrder}</span><div className="row-actions"><button className="edit" type="button" onClick={() => { setEditingItem(item); setModalOpen(true) }} aria-label={`Edit ${item.displayValue}`}><Icon name="edit" /></button><button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.displayValue}`}><Icon name="trash" /></button></div></div>)}
      {!visibleItems.length && <div className="empty-banners"><Icon name="category" /><strong>No collection entries</strong><span>Add an entry for this collection type.</span></div>}
    </div></div></div>
    {modalOpen && <ExploreCollectionModal item={editingItem} onClose={() => { setModalOpen(false); setEditingItem(null) }} onSave={saveItem} />}
    {deleteTarget && <ConfirmDelete banner={{ title: deleteTarget.displayValue }} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
  </div>
}

export default ExploreCollectionsEditor
