import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useStickyHeader from '../hooks/useStickyHeader';
import { navigation } from '../utils/navigation';
import MobileMenu from './MobileMenu';
import SearchPopup from './SearchPopup';
import logo from '../assets/images/logo.png';

export default function Header() {
  const isFixed = useStickyHeader(200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // The original template toggled these as body-level classes so the
  // CSS transitions (defined against `body.mobile-menu-visible` /
  // `body.search-active`) keep working unmodified.
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-visible', mobileMenuOpen);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.classList.toggle('search-active', searchOpen);
  }, [searchOpen]);

  return (
    <>
      <header className={`main-header${isFixed ? ' fixed-header' : ''}`} style={{ height: '12vh' }}>
        {/* Header Top */}
        <div className="header-top">
          <div className="auto-container">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="left-box d-flex align-items-center flex-wrap">
                <div className="header_socials">
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
              <div className="right-box">
                <ul className="header-top_info">
                  <li><span className="icon flaticon-location-pin" /><a href="#">107/2A, Medvakkam - Mambakkam Main Road, Mambakkam, Chennai - 600127</a></li>
                  <li><span className="icon flaticon-bubble-chat" /><a href="mailto:sales@sjceramics.in">sales@sjceramics.in</a></li>
                  <li><span className="icon flaticon-clock-2" />Sun - Fri 9.00 am - 5.00 pm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Header Lower */}
        <div className="header-lower" style={{ backgroundColor: '#ffffff' }}>
          <div className="auto-container">
            <div className="inner-container">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="left-box d-flex align-items-center flex-wrap">
                  <div className="logo-box">
                    <div className="logo">
                      <Link to="/">
                        <img src={logo} alt="SJCeramics" title="SJCeramics" />
                      </Link>
                    </div>
                  </div>

                  <div className="nav-outer">
                    <nav className="main-menu navbar-expand-md">
                      <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                        <ul className="navigation clearfix">
                          {navigation.map((item) => (
                            <li key={item.label} className={item.children ? 'dropdown' : undefined}>
                              {item.path.startsWith('#') ? (
                                <a href={item.path}>{item.label}</a>
                              ) : (
                                <Link 
                                  to={item.path}
                                  onClick={() => {
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
                                        <Link to={child.path}>{child.label}</Link>
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
                  <div className="header-options_box d-flex align-items-center">
                    <div
                      className="search-box-btn search-box-outer"
                      role="button"
                      tabIndex={0}
                      aria-label="Open search"
                      onClick={() => setSearchOpen(true)}
                    >
                      <span className="icon flaticon-search-interface-symbol" />
                    </div>
                  </div>

                  <div className="header_button-box">
                    <Link to="/contact" className="theme-btn btn-style-one">
                      <span className="btn-wrap">
                        <span className="text-one">Contact Us</span>
                        <span className="text-two">Contact Us</span>
                      </span>
                    </Link>
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

        <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {searchOpen && <SearchPopup onClose={() => setSearchOpen(false)} />}
    </>
  );
}
