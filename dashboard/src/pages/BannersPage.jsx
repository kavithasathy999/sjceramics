import Icon from '../components/Icon'

function BannersPage({ banners, loading, error, onRetry, onAdd, onEdit, onDelete }) {
  return (
    <section className="dashboard-content banners-page page-enter">
      <div className="banner-page-head">
        <div className="page-heading">
          <h1>Banners</h1>
          <p>Create and maintain the visual stories shown across your website.</p>
        </div>
        <button className="add-banner-button" onClick={onAdd}><Icon name="plus" />Add Banner</button>
      </div>

      {error && <div className="banner-api-error" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>Retry</button></div>}

      <div className="banner-table-card">
        <div className="table-summary"><strong>All banners</strong><span>{banners.length} {banners.length === 1 ? 'entry' : 'entries'}</span></div>
        <div className="banner-table" role="table" aria-label="Website banners">
          <div className="banner-row banner-table-head" role="row">
            <span>S.No</span><span>Preview</span><span>Banner information</span><span>Sort order</span><span>Actions</span>
          </div>
          {!loading && banners.map((banner, index) => (
            <div className="banner-row" role="row" key={banner.id}>
              <span className="serial-number">{index + 1}</span>
              <div className={`banner-preview ${banner.theme}`}>
                {banner.image ? <img src={banner.image} alt="" /> : <><span>SJ</span><i /></>}
              </div>
              <div className="banner-information"><strong>{banner.title}</strong><span>{banner.description || 'No description added'}</span></div>
              <span className="sort-order-value">{banner.sortOrder}</span>
              <div className="row-actions">
                <button className="edit" onClick={() => onEdit(banner)} aria-label={`Edit ${banner.title}`} title="Edit banner"><Icon name="edit" /></button>
                <button className="delete" onClick={() => onDelete(banner)} aria-label={`Delete ${banner.title}`} title="Delete banner"><Icon name="trash" /></button>
              </div>
            </div>
          ))}
          {loading && <div className="empty-banners"><span className="spinner banner-spinner" /><strong>Loading banners</strong><span>Fetching the latest records from MySQL.</span></div>}
          {!loading && !banners.length && <div className="empty-banners"><Icon name="banner" /><strong>No banners yet</strong><span>Add your first website banner to get started.</span></div>}
        </div>
      </div>
    </section>
  )
}

export default BannersPage
