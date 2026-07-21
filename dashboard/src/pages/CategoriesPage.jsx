import { useEffect, useState } from 'react'
import CategoryModal from '../components/CategoryModal'
import ConfirmDelete from '../components/ConfirmDelete'
import Icon from '../components/Icon'
import useToast from '../hooks/useToast'
import { createHomeCategory, deleteHomeCategory, getHomeCategories, updateHomeCategory } from '../services/categoriesApi'

const ITEMS_PER_PAGE = 10

function CategoriesPage() {
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
    return getHomeCategories()
      .then((payload) => {
        setItems(payload.data)
        setActivePage((current) => Math.min(current, Math.max(1, Math.ceil(payload.data.length / ITEMS_PER_PAGE))))
        return payload.data
      })
      .catch((requestError) => { setError(requestError.message); return null })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    getHomeCategories()
      .then((payload) => { if (active) setItems(payload.data) })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const nextSortOrder = Math.max(0, ...items.map((item) => item.sortOrder)) + 1

  const saveItem = async (values) => {
    const isCreating = !editingItem
    try {
      if (editingItem) {
        await updateHomeCategory(editingItem.id, values)
        showToast('Category updated successfully.')
      } else {
        await createHomeCategory(values)
        showToast('Category added successfully.')
      }
      const refreshed = await loadItems()
      if (isCreating && refreshed) setActivePage(Math.max(1, Math.ceil(refreshed.length / ITEMS_PER_PAGE)))
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
      await deleteHomeCategory(deleteTarget.id)
      setDeleteTarget(null)
      await loadItems()
      showToast('Category deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  return (
    <section className="dashboard-content categories-page page-enter">
      <div className="banner-page-head"><div className="page-heading"><h1>Category</h1><p>Manage the collection cards displayed in the home-page category</p></div><button className="add-banner-button" type="button" disabled={loading || Boolean(error)} onClick={() => { setEditingItem(null); setModalOpen(true) }}><Icon name="plus" />Add Category</button></div>
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadItems}>Retry</button></div>}
      <div className="category-table-card">
        <div className="table-summary"><strong>All categories</strong><span>{items.length} items</span></div>
        {loading ? <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading categories</strong></div> : (
          <>
            <div className="category-table-scroll"><div className="category-table" role="table" aria-label="Home categories">
              <div className="category-row category-table-head" role="row"><span>S.No</span><span>Preview</span><span>Category name</span><span>Group</span><span>Sort order</span><span>Actions</span></div>
              {visibleItems.map((item, index) => <div className="category-row" role="row" key={item.id}>
                <span className="serial-number">{startIndex + index + 1}</span><div className="category-table-preview"><img src={item.imageUrl} alt={`${item.name} preview`} /></div><strong>{item.name}</strong><span className="gallery-category-badge">{item.group}</span><span className="sort-order-value">{item.sortOrder}</span><div className="row-actions"><button className="edit" type="button" onClick={() => { setEditingItem(item); setModalOpen(true) }} aria-label={`Edit ${item.name}`}><Icon name="edit" /></button><button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.name}`}><Icon name="trash" /></button></div>
              </div>)}
              {!items.length && <div className="empty-banners"><Icon name="offer" /><strong>No categories configured</strong><span>Add a category to display it on the website.</span></div>}
            </div></div>
            {items.length > ITEMS_PER_PAGE && <nav className="gallery-pagination" aria-label="Category pagination"><button type="button" disabled={activePage === 1} onClick={() => setActivePage((page) => page - 1)}>Previous</button><div>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" className={page === activePage ? 'active' : ''} aria-current={page === activePage ? 'page' : undefined} onClick={() => setActivePage(page)} key={page}>{page}</button>)}</div><button type="button" disabled={activePage === totalPages} onClick={() => setActivePage((page) => page + 1)}>Next</button></nav>}
          </>
        )}
      </div>
      {modalOpen && <CategoryModal item={editingItem} nextSortOrder={nextSortOrder} onClose={() => { setModalOpen(false); setEditingItem(null) }} onSave={saveItem} />}
      {deleteTarget && <ConfirmDelete banner={{ title: deleteTarget.name }} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </section>
  )
}

export default CategoriesPage
