import Icon from './Icon'

function Sidebar({ activePage, onNavigate, open, onClose }) {
  return (
    <>
      <button className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Close navigation" />
      <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img
            src="/Logo_Png.png"
            alt="SJ Ceramics"
            onClick={() => onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
          />
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation"><Icon name="close" /></button>
        </div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          <span className="nav-label">WORKSPACE</span>
          <button className={activePage === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
            <Icon name="dashboard" /><span>Dashboard</span>
          </button>
          <button className={activePage === 'banners' ? 'active' : ''} onClick={() => onNavigate('banners')}>
            <Icon name="banner" /><span>Banners</span>
          </button>
          <button className={activePage === 'gallery' ? 'active' : ''} onClick={() => onNavigate('gallery')}>
            <Icon name="gallery" /><span>Gallery</span>
          </button>
          <button className={activePage === 'offers' ? 'active' : ''} onClick={() => onNavigate('offers')}>
            <Icon name="offer" /><span>Offers</span>
          </button>
          <button className={activePage === 'new-arrivals' ? 'active' : ''} onClick={() => onNavigate('new-arrivals')}>
            <Icon name="arrival" /><span>New Arrivals</span>
          </button>
          <button className={activePage === 'about' ? 'active' : ''} onClick={() => onNavigate('about')}>
            <Icon name="video" /><span>About Page</span>
          </button>
          <button className={activePage === 'categories' ? 'active' : ''} onClick={() => onNavigate('categories')}>
            <Icon name="category" /><span>Category</span>
          </button>
          <button className={activePage === 'products' ? 'active' : ''} onClick={() => onNavigate('products')}>
            <Icon name="product" /><span>Products</span>
          </button>
          <button className={activePage === 'footer' ? 'active' : ''} onClick={() => onNavigate('footer')}>
            <Icon name="footer" /><span>Footer Columns</span>
          </button>
          <button className={activePage === 'meta' ? 'active' : ''} onClick={() => onNavigate('meta')}>
            <Icon name="blog" /><span>Meta Tags</span>
          </button>
          <button className={activePage === 'blogs' ? 'active' : ''} onClick={() => onNavigate('blogs')}>
            <Icon name="blog" /><span>Blogs</span>
          </button>
          <button className={activePage === 'testimonials' ? 'active' : ''} onClick={() => onNavigate('testimonials')}>
            <Icon name="testimonial" /><span>Testimonials</span>
          </button>
          <button className={activePage === 'contact-enquiries' ? 'active' : ''} onClick={() => onNavigate('contact-enquiries')}>
            <Icon name="mail" /><span>Contact Enquiries</span>
          </button>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
