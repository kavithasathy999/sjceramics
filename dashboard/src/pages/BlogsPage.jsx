import { useEffect, useState } from 'react'
import BlogModal from '../components/BlogModal'
import ConfirmDelete from '../components/ConfirmDelete'
import Icon from '../components/Icon'
import useToast from '../hooks/useToast'
import { createBlog, deleteBlog, getBlogs, updateBlog } from '../services/blogsApi'

const ITEMS_PER_PAGE = 10

function BlogsPage() {
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
    return getBlogs()
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
    getBlogs().then((data) => { if (active) setItems(data) }).catch((requestError) => { if (active) setError(requestError.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const saveItem = async (values) => {
    const creating = !editingItem
    try {
      if (editingItem) await updateBlog(editingItem.id, values)
      else await createBlog(values)
      const refreshed = await loadItems()
      if (creating && refreshed) setActivePage(Math.max(1, Math.ceil(refreshed.length / ITEMS_PER_PAGE)))
      setModalOpen(false)
      setEditingItem(null)
      showToast(editingItem ? 'Blog updated successfully.' : 'Blog added successfully.')
    } catch (requestError) {
      showToast(requestError.message, 'error')
      throw requestError
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteBlog(deleteTarget.id)
      setDeleteTarget(null)
      await loadItems()
      showToast('Blog deleted successfully.')
    } catch (requestError) {
      setDeleteTarget(null)
      showToast(requestError.message, 'error')
    }
  }

  return (
    <section className="dashboard-content blogs-management-page page-enter">
      <div className="banner-page-head">
        <div className="page-heading"><h1>Blogs</h1><p>Manage the articles displayed on the website and home page.</p></div>
        <button className="add-banner-button" type="button" disabled={loading || Boolean(error)} onClick={() => { setEditingItem(null); setModalOpen(true) }}><Icon name="plus" />Add Blog</button>
      </div>
      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={loadItems}>Retry</button></div>}
      <div className="blog-table-card">
        <div className="table-summary"><strong>All blogs</strong><span>{items.length} items</span></div>
        {loading ? <div className="about-editor-loading"><span className="spinner banner-spinner" /><strong>Loading blogs</strong></div> : <>
          <div className="blog-table-scroll"><div className="blog-table" role="table" aria-label="Website blogs">
            <div className="blog-row blog-table-head" role="row"><span>S.No</span><span>Media</span><span>Title</span><span>Description</span><span>Type</span><span>Actions</span></div>
            {visibleItems.map((item, index) => <div className="blog-row" role="row" key={item.id}>
              <span className="serial-number">{startIndex + index + 1}</span>
              <div className="blog-table-preview">{item.mediaType === 'video' ? <video src={item.mediaUrl} muted preload="metadata" /> : <img src={item.mediaUrl} alt={`${item.title} preview`} />}</div>
              <strong>{item.title}</strong><p>{item.excerpt}</p><span>{item.mediaType}</span>
              <div className="row-actions"><button className="edit" type="button" onClick={() => { setEditingItem(item); setModalOpen(true) }} aria-label={`Edit ${item.title}`} title="Edit blog"><Icon name="edit" /></button><button className="delete" type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.title}`} title="Delete blog"><Icon name="trash" /></button></div>
            </div>)}
            {!items.length && <div className="empty-banners"><Icon name="blog" /><strong>No blogs configured</strong><span>Add a blog to display it on the website.</span></div>}
          </div></div>
          {items.length > ITEMS_PER_PAGE && <nav className="gallery-pagination" aria-label="Blog pagination"><button type="button" disabled={activePage === 1} onClick={() => setActivePage((page) => page - 1)}>Previous</button><div>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button type="button" className={page === activePage ? 'active' : ''} aria-current={page === activePage ? 'page' : undefined} onClick={() => setActivePage(page)} key={page}>{page}</button>)}</div><button type="button" disabled={activePage === totalPages} onClick={() => setActivePage((page) => page + 1)}>Next</button></nav>}
        </>}
      </div>
      {modalOpen && <BlogModal item={editingItem} onClose={() => { setModalOpen(false); setEditingItem(null) }} onSave={saveItem} />}
      {deleteTarget && <ConfirmDelete banner={{ title: deleteTarget.title }} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </section>
  )
}

export default BlogsPage
