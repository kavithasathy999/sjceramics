import { Link, useNavigate } from 'react-router-dom';
import footerLogo from '../assets/images/Logo-Png.png';
import kagLogo from '../assets/images/kaglogo.svg';
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
        title: 'Popular Tiles By Size',
        type: 'size',
        links: ['12X12 Tiles', '24X24 Tiles', '18X12 Tiles', '15X10 Tiles', '16X16 Tiles', '24X12 Tiles'],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Size',
        type: 'size',
        links: [
          '12x22 Tiles', '12x8 Tiles', '20x20 Tiles', '40x8 Tiles',
          '48x24 Tiles', '64x32 Tiles', '72x48 Tiles', '96x32 Tiles',
          '12x12 Tiles', '24x24 Tiles', '18x12 Tiles', '15x10 Tiles',
          '16x16 Tiles', '24x12 Tiles',
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Finish',
        type: 'finish',
        links: [
          'Dark Light Highlighter Concept', 'Digital Vitrified Parking',
          'High Depth Elevation', 'Satin Interior', 'Glossy', 'Matt',
          'Glossy Floor', 'Dark Wooden Glossy', 'Punch',
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tiles By Material',
        type: 'search',
        links: ['Vitrified', 'Ceramic', 'Porcelain', 'Wooden', 'GVT'],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Where To Use',
        type: 'search',
        links: ['Elevation Tiles', 'Living Room Tiles', 'Staircase Tiles', 'Roof Tiles', 'Bathroom Tiles'],
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
      <div className="main-footer_bg" />
      <div className="auto-container">
        <div className="inner-container">
          <div className="widgets-section">
            <div className="row clearfix">
              {/* Column 1: Brand & Socials */}
              <div className="footer_column col-lg-3 col-md-6 col-sm-12">
                <div className="footer-widget footer-two_logo-widget">
                  <div className="footer-logo">
                    <div className="footer-brand-lockup">
                      <Link
                        className="footer-logo-card footer-logo-card--sj"
                        to="/"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <img src={footerLogo} alt="SJ Ceramics" title="SJ Ceramics" />
                      </Link>

                      <div className="footer-partner-brand">
                        <div className="footer-partner-logo-card">
                          <img src={kagLogo} alt="KAG Tiles" title="KAG Tiles" />
                        </div>       
                        <span className="footer-partner-label footer-partner-label--tagline" lang="ta">
                          இது பேரல்ல, பெருமை
                        </span>
                        <span className="footer-partner-label footer-partner-label--channel">
                          Authorized Channel Partner
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="footer-text">
                    SJ Ceramics, a proud channel partner of KAG Tiles, is your trusted destination for premium sanitary wares, luxurious bath fittings, and top-quality tiles. Browse our wide range of products and enquire directly.
                  </div>
                  <div className="footer_socials">
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
                <div className="footer-widget links-widget footer-address-widget">
                  <h5 className="footer-title">ADDRESS</h5>
                  <ul className="footer-list footer-address-list text-white">
                    <li className="footer-address-lines">
                      <span>107/2A, Medavakkam - Mambakkam Main Road, Mambakkam, Chennai, Tamil Nadu,</span>
                      <span>India - 600127.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Column 4: Contact Us */}
              <div className="footer_column col-lg-3 col-md-6 col-sm-12">
                <div className="footer-widget links-widget">
                  <h5 className="footer-title">CONTACT US</h5>
                  <ul className="footer-list">
                    <li className="mb-3">
                      <span className="d-block text-white mb-1" style={{ fontWeight: '500' }}>Mobile Numbers</span>
                      <a href="tel:+919384105222" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-phone me-2" style={{ fontSize: '1.1em' }} /> +91 93841 05222
                      </a>
                      <a href="tel:044-4656 0926" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-phone me-2" style={{ fontSize: '1.1em' }} /> 044-4656 0926
                      </a>
                    </li>
                    <li>
                      <span className="d-block text-white mb-1" style={{ fontWeight: '500' }}>Email Address</span>
                      <a href="mailto:sales@sjceramics.in" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fa-solid fa-envelope me-2" style={{ fontSize: '1.1em' }} /> sales@sjceramics.in
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
