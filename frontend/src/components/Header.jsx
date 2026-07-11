import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStickyHeader from '../hooks/useStickyHeader';
import { navigation } from '../utils/navigation';
import MobileMenu from './MobileMenu';
import ContactModal from './ContactModal';
import logo from '../assets/images/Logo-Png.png';
import partnerLogo from '../assets/images/kaglogo.svg';

export default function Header() {
  const navigate = useNavigate();
  const isFixed = useStickyHeader(200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [partnerLogoFailed, setPartnerLogoFailed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The original template toggled these as body-level classes so the
  // CSS transitions (defined against `body.mobile-menu-visible`) keep working unmodified.
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-visible', mobileMenuOpen);
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/products', { state: { searchQuery: searchTerm.trim() } });
    }
  };


  return (
    <>
      <header className={`main-header${isFixed ? ' fixed-header' : ''}`}>
        {/* Header Top */}
        <div className="header-top">
          <div className="auto-container header-top-container">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="left-box d-flex align-items-center flex-wrap">
                <div className="header_socials" aria-label="Social media links">
                  <a className="fa-brands fa-facebook-f fa-fw" href="#" aria-label="Facebook" />
                  <a className="fa-brands fa-instagram fa-fw" href="#" aria-label="Instagram" />
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="social-x"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a className="fa-brands fa-youtube fa-fw" href="#" aria-label="YouTube" />
                </div>
              </div>
              <div className="right-box">
                <ul className="header-top_info">
                  <li className="info-address">
                    <span className="icon flaticon-location-pin" />
                    <a href="https://maps.google.com/?q=107/2A,+Medavakkam+-+Mambakkam+Main+Road,+Mambakkam,+Chennai+-+600127" target="_blank" rel="noreferrer">
                      107/2A, Medavakkam - Mambakkam Main Road, Mambakkam, Chennai - 600127
                    </a>
                  </li>
                  <li className="info-email">
                    <span className="icon flaticon-bubble-chat" />
                    <a href="mailto:sales@sjceramics.in">sales@sjceramics.in</a>
                  </li>
                  <li className="info-hours">
                    <span className="icon flaticon-clock-2" />
                    Sun - Fri 9.00 am - 5.00 pm
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Header Lower */}
        <div className="header-lower">
          <div className="auto-container header-main-container">
            <div className="inner-container">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="left-box d-flex align-items-center flex-wrap">
                  <div className="header-logo-container">
                    <Link to="/" className="header-logo-link">
                      <img src={logo} alt="SJ Ceramics" className="header-logo-primary" />
                    </Link>

                    {!partnerLogoFailed && (
                      <>
                        <div className="header-logo-partner-wrap" title="KAG Authorized Channel Partner">
                          <img
                            src={partnerLogo}
                            alt="KAG Authorized Channel Partner"
                            className="header-logo-partner"
                            onError={() => setPartnerLogoFailed(true)}
                          />
                          <span className="header-logo-partner-tag">Channel Partner</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="nav-outer">
                    <nav className="main-menu navbar-expand-md" aria-label="Primary navigation">
                      <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                        <ul className="navigation clearfix">
                          {navigation.map((item) => (
                            <li key={item.label} className={item.children ? 'dropdown' : undefined}>
                              {item.path.startsWith('#') ? (
                                <a href={item.path}>{item.label}</a>
                              ) : (
                                <Link
                                  to={item.path}
                                  state={item.state}
                                  onClick={(e) => {
                                    if (item.path === '/products' && window.location.pathname === '/products') {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                >
                                  {item.label}
                                </Link>
                              )}
                              {item.children && (
                                <ul>
                                  {item.children.map((child) => (
                                    <li key={child.label}>
                                      {child.path.startsWith('#') ? (
                                        <a href={child.path}>{child.label}</a>
                                      ) : (
                                        <Link to={child.path} state={child.state}>{child.label}</Link>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </nav>
                  </div>
                </div>

                <div className="outer-box d-flex align-items-center flex-wrap">
                  <div className="header-search-bar">
                    <form onSubmit={handleSearchSubmit} className="header-search-form">
                      <button type="submit" className="header-search-submit" aria-label="Search products">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <circle cx="10.8" cy="10.8" r="5.8" />
                          <path d="m15.2 15.2 4.3 4.3" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        aria-label="Search products"
                        placeholder="Search Products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="header-search-input"
                      />
                    </form>
                  </div>

                  <div className="header_button-box">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="header-contact-btn"
                    >
                      Contact Us
                    </button>
                  </div>

                  <div
                    className="mobile-nav-toggler"
                    role="button"
                    tabIndex={0}
                    aria-label="Open menu"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <span className="icon flaticon-menu" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpenContactModal={() => setIsModalOpen(true)}
        />
      </header>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
