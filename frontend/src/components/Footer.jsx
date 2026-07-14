import { Link, useNavigate } from 'react-router-dom';
import footerLogo from '../assets/images/Logo-Png.png';
import '../styles/quicklinks.css';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact Us', path: '/contact' },
];

const seoColumns = [
  {
    sections: [
      {
        title: 'Tiles By Space',
        type: 'search',
        links: ['Floor Tiles', 'Wall Tiles'],
      },
      {
        title: 'Tiles By Area',
        type: 'search',
        links: [
          'Bathroom Tiles', 'Kitchen Tiles', 'Living Room Tiles', 'Outdoor Tiles',
          'Parking Tiles', 'Bedroom Tiles', 'Elevation Tiles', 'Balcony Tiles',
          'Pooja Room Tiles', 'Stair Tiles', 'Terrace Tiles', 'Drawing Room Tiles',
          'Wash Basin Tiles', 'Hallway Tiles', 'Garden Tiles', 'Paving Tiles',
          'TV Unit Tiles', 'Foyer Tiles', 'Stout Passage Tiles', 'Porch Tiles',
          'Pathway Tiles', 'Dining Room Tiles', 'Commercial Tiles',
          'Swimming Pool Tiles', 'Hospital Tiles', 'School Tiles', 'Bar Tiles',
          'Restaurant Tiles',
        ],
      },
      {
        title: 'Natural Stone and Brick Cladding',
        type: 'search',
        links: [
          'Natural Stone Cladding', 'Brick Cladding', 'Red Brick Cladding',
          'White Brick Cladding', 'Stone Murals', 'God Picture Tiles and Stones',
          'Buddha Tiles and Stones', 'Krishna Tiles and Stones',
          'Ganesha Tiles and Stones', 'Venkateshwara Tiles and Stones',
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Size',
        type: 'size',
        links: [
          '1x1 Tiles', '2x2 Tiles', '2x4 Tiles', '4x4 Tiles', '4x8 Tiles',
          '300x450 mm Tiles', '300x600 mm Tiles', '1200x1800 mm Tiles',
          '800x1600 mm Tiles', '300x900 mm Tiles', '300x1200 mm Tiles',
          '400x400 mm Tiles', '400x1200 mm Tiles', '500x500 mm Tiles',
          '800x3000 mm Tiles', '800x2400 mm Tiles', '100x300 mm Tiles',
          '100x200 mm Tiles', '150x900 mm Tiles', '200x1200 mm Tiles',
          '200x200 mm Tiles',
        ],
      },
      {
        title: 'Tiles By Finish',
        type: 'finish',
        links: [
          'Anti Skid Tiles', 'Glossy Tiles', 'Polished Tiles', 'Matt Tiles',
          'Carving Tiles', 'Metallic Tiles', 'Rustic Tiles', 'Lappato Tiles',
          'Satin Tiles', 'Hi-Gloss Tiles',
        ],
      },
      {
        title: 'Wall Panels',
        type: 'search',
        links: ['Louver Panels', 'PVC Wall Panels', 'Charcoal Panels', 'Fluted Panels'],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Design',
        type: 'search',
        links: [
          '3D Tiles', 'Wooden Tiles', 'Marble Tiles', 'Texture Tiles',
          'Mosaic Tiles', 'Granite Tiles', 'Stone Tiles', 'Pattern Tiles',
          'Geometric Tiles', 'Cement Tiles', 'Flower Tiles', 'Travertine Tiles',
          'Slate Tiles', 'Statuario Tiles', 'Plain Tiles', 'Onyx Tiles',
          'End Match Tiles', 'Book Match Tiles', 'Carrara Tiles', 'Abstract Tiles',
          'Monochrome Tiles', 'Stylized Tiles', 'Brick Tiles', 'Hexagonal Tiles',
          'Limestone Tiles', 'Wooden Plank Tiles', 'Athangudi Tiles',
          'Moroccan Tiles', 'Subway Tiles', 'Kitkat Tiles', 'Chevron Tiles',
          'Octagon Tiles', 'Border Tiles', 'Fluted Tiles', 'Terrazzo Tiles',
          'Tropical Tiles', 'Carpet Tiles', 'Poster Tiles', 'Herringbone Tiles',
          'Kota Tiles', 'Blue Pottery Tiles', 'Terracotta Clay Jali',
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Type',
        type: 'search',
        links: [
          'Vitrified Tiles', 'Ceramic Tiles', 'Porcelain Tiles', 'Designer Tiles',
          'Digital Tiles', 'Double Charge Vitrified Tiles', 'Glazed Tiles',
          'Cool Tiles', 'Glass Highlighter Tiles', 'Full Body Vitrified Tiles',
          'Printed Tiles', 'Nano Tiles',
        ],
      },
      {
        title: 'Tiles Accessories',
        type: 'search',
        links: [
          'Tile Grout', 'Epoxy Grout', 'Cementitious Grout', 'Tile Beading',
          'Metal Beading', 'Tile Adhesives', 'Tile Spacers', 'Stone Care',
          'T Profile Patti', 'U Profile Patti',
        ],
      },
      {
        title: 'Decorative Stones',
        type: 'search',
        links: ['Pebble Stones', 'Black Pebble Stones', 'White Pebble Stones'],
      },
      {
        title: 'Imported Tiles Collection',
        type: 'search',
        links: ['Imported Tiles', 'Italian Tiles', 'Spanish Tiles', 'Chinese Tiles'],
      },
      {
        title: 'Home Utility Products',
        type: 'search',
        links: ['Wash Basin', 'Kitchen Sink', 'Glass Blocks'],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Color',
        type: 'color',
        links: [
          'White Tiles', 'Black Tiles', 'Brown Tiles', 'Beige Tiles', 'Ivory Tiles',
          'Cream Tiles', 'Yellow Tiles', 'Blue Tiles', 'Green Tiles', 'Grey Tiles',
          'Pink Tiles', 'Red Tiles', 'Aqua Tiles', 'Orange Tiles', 'Sky Blue Tiles',
          'Gold Tiles', 'Purple Tiles', 'Terracotta Tiles', 'Black and White Tiles',
          'Blue and White Tiles', 'Grey and White Tiles', 'Black and Gold Tiles',
          'White and Gold Tiles',
        ],
      },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleQuickLinkClick = (type, rawValue) => {
    let value = rawValue.replace(/ Tiles$/i, '').trim();

    if (type === 'search') {
      navigate('/products', { state: { searchQuery: value } });
      return;
    }

    navigate('/products', { state: { filterCategory: type, filterValue: value } });
  };

  return (
    <>
      {/* Pre-Footer SEO Quick Links Section */}
      <section className="footer-quick-links-section">
        <div className="auto-container">
          <div className="quick-links-grid">
            {seoColumns.map((column, columnIdx) => (
              <div className="quick-links-column" key={columnIdx}>
                {column.sections.map((section) => (
                  <div className="quick-links-group" key={section.title}>
                    <h6 className="quick-links-column-title">{section.title}</h6>
                    <ul className="quick-links-list">
                      {section.links.map((linkText) => (
                        <li key={linkText}>
                          <button
                            type="button"
                            onClick={() => handleQuickLinkClick(section.type, linkText)}
                          >
                            {linkText}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="main-footer">
      <div className="main-footer_bg" style={{ backgroundImage: `url("https://themazine.com/html/fllopi/assets/images/background/6.jpg")` }} />
      <div className="auto-container">
        <div className="inner-container">
          <div className="widgets-section">
            <div className="row clearfix">
              {/* Column 1: Brand & Socials */}
              <div className="footer_column col-lg-3 col-md-6 col-sm-12">
                <div className="footer-widget footer-two_logo-widget">
                  <div className="footer-logo">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)}><img src={footerLogo} alt="SJ Ceramics" title="SJ Ceramics" style={{ borderRadius: '10px' }} /></Link>
                  </div>
                  <div className="footer-text mt-4">
                    SJ Ceramics, a proud channel partner of KAG Tiles, is your trusted destination for premium sanitary wares, luxurious bath fittings, and top-quality tiles. Browse our wide range of products and enquire directly.
                  </div>
                  <div className="footer_socials mt-4">
                    <a className="fa-brands fa-facebook-f fa-fw me-2" href="#" aria-label="Facebook" />
                    <a className="fa-brands fa-instagram fa-fw me-2" href="#" aria-label="Instagram" />
                    <a
                      href="#"
                      aria-label="Twitter"
                      className="me-2 social-x"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a className="fa-brands fa-youtube fa-fw" href="#" aria-label="YouTube" />
                  </div>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="footer_column col-lg-3 col-md-6 col-sm-12">
                <div className="footer-widget links-widget">
                  <h5 className="footer-title">QUICK LINKS</h5>
                  <ul className="footer-list">
                    {quickLinks.map((link) => (
                      <li key={link.label}>
                        <Link 
                          to={link.path}
                          onClick={() => {
                            if (link.path === '/products' && window.location.pathname === '/products') {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: Address */}
              <div className="footer_column col-lg-3 col-md-6 col-sm-12">
                <div className="footer-widget links-widget">
                  <h5 className="footer-title">ADDRESS</h5>
                  <ul className="footer-list text-white">
                    <li className="mb-1" style={{ color: '#ffffff', fontWeight: 'bold' }}>SJ Ceramics</li>
                    <li className="mb-3" style={{ fontSize: '0.9em' }}>Authorized Channel Partner - KAG Tiles</li>
                    <li style={{ lineHeight: '1.8' }}>107/2A, Medavakkam - Mambakkam Main Road, <br/>Mambakkam, Chennai, <br/>Tamil Nadu, India - 600127</li>
                  </ul>
                </div>
              </div>

              {/* Column 4: Contact Us */}
              <div className="footer_column col-lg-3 col-md-6 col-sm-12">
                <div className="footer-widget links-widget">
                  <h5 className="footer-title">CONTACT US</h5>
                  <ul className="footer-list">
                    <li className="mb-3">
                      <span className="d-block text-white mb-1" style={{ fontWeight: '500' }}>Mobile Contact</span>
                      <a href="tel:+919944242685" style={{ display: 'flex', alignItems: 'center' }} className="mb-1">
                        <i className="fa-brands fa-whatsapp me-2" style={{color: '#25D366', fontSize: '1.2em'}} /> +91 99442 42685
                      </a>
                      <a href="tel:+919384105222" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-phone me-2" style={{ fontSize: '1.1em' }} /> +91 93841 05222
                      </a>
                    </li>
                    <li className="mb-3">
                      <span className="d-block text-white mb-1" style={{ fontWeight: '500' }}>Office Landline</span>
                      <a href="tel:04446560926" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-phone me-2" style={{ fontSize: '1.1em' }} /> 044 46560926
                      </a>
                    </li>
                    <li>
                      <span className="d-block text-white mb-1" style={{ fontWeight: '500' }}>Official Email Address</span>
                      <a href="mailto:sales@sjceramics.in" style={{ display: 'flex', alignItems: 'center' }} className="mb-1">
                        <i className="fa-solid fa-envelope me-2" style={{ fontSize: '1.1em' }} /> sales@sjceramics.in
                      </a>
                      <a href="mailto:premkumar@sjceramics.in" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-envelope me-2" style={{ fontSize: '1.1em' }} /> premkumar@sjceramics.in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="auto-container">
          <div className="text-center">
            <div className="main-footer_copyright w-100">&copy; SJ Ceramics. All Rights Reserved {new Date().getFullYear()}. Developed by Sai Techno Solutions.</div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
