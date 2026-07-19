import Icon from './Icon'

function Sidebar({ activePage, onNavigate, open, onClose }) {
  return (
    <>
      <button className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Close navigation" />
      <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/Logo_Png.png" alt="SJ Ceramics" />
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>
        </div>
        <nav aria-label="Dashboard navigation">
          <span className="nav-label">Workspace</span>
          <button className={activePage === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
            <Icon name="dashboard" /><span>Dashboard</span>
          </button>
          <button className={activePage === 'banners' ? 'active' : ''} onClick={() => onNavigate('banners')}>
            <Icon name="banner" /><span>Banners</span>
          </button>
          <button className={activePage === 'about' ? 'active' : ''} onClick={() => onNavigate('about')}>
            <Icon name="video" /><span>About Page</span>
          </button>
          <button className={activePage === 'gallery' ? 'active' : ''} onClick={() => onNavigate('gallery')}>
            <Icon name="gallery" /><span>Gallery</span>
          </button>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
