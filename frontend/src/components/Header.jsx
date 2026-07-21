import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStickyHeader from '../hooks/useStickyHeader';
import { navigation as baseNavigation } from '../utils/navigation';
import { getProducts } from '../services/productsApi';
import MobileMenu from './MobileMenu';
import ContactModal from './ContactModal';
import logo from '../assets/images/Logo-Png.png';
import partnerLogo from '../assets/images/kaglogo.svg';

function DesktopSubmenu({ items, level = 1 }) {
  return (
    <ul className={`product-menu-level product-menu-level-${level}`}>
      {items.map((item) => (
        <li key={`${item.label}-${item.state?.filterValue || item.path}`} className={item.children ? 'dropdown' : undefined}>
          {item.path.startsWith('#') ? (
            <a href={item.path}>{item.label}</a>
          ) : (
            <Link to={item.path} state={item.state}>{item.label}</Link>
          )}
          {item.children && <DesktopSubmenu items={item.children} level={level + 1} />}
        </li>
      ))}
    </ul>
  );
}

const uniqueValues = (values) => [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];

const buildProductMenu = (products) => {
  const productTypes = uniqueValues(products.map((product) => product.productType || product.type));
  const usageValues = uniqueValues(products.map((product) => product.whereToUse));
  const sizeValues = uniqueValues(products.map((product) => product.size));

  const menuSections = [
    {
      label: 'Product Type',
      values: productTypes,
      filterCategory: 'productType',
    },
    {
      label: 'Where To Use',
      values: usageValues,
      filterCategory: 'room',
    },
    {
      label: 'Size of the Tile',
      values: sizeValues,
      filterCategory: 'size',
    },
  ].filter((section) => section.values.length);

  return menuSections.map((section) => ({
    label: section.label,
    path: '/products',
    children: section.values.map((value) => ({
      label: value,
      path: '/products',
      state: {
        filterCategory: section.filterCategory,
        filterValue: value,
      },
    })),
  }));
};

const navigationWithoutStaticProducts = baseNavigation.map((item) => (
  item.label === 'Products' ? { ...item, children: undefined } : item
));

export default function Header() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const headerShellRef = useRef(null);
  const { isSticky: isFixed, isVisible } = useStickyHeader(200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [partnerLogoFailed, setPartnerLogoFailed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navigation, setNavigation] = useState(navigationWithoutStaticProducts);
  const shouldShowHeader = isVisible || mobileMenuOpen || isModalOpen;

  useEffect(() => {
    let active = true;
    getProducts()
      .then((products) => {
        if (!active) return;
        const productMenuChildren = buildProductMenu(products);
        if (!productMenuChildren.length) return;
        setNavigation(navigationWithoutStaticProducts.map((item) => (
          item.label === 'Products' ? { ...item, children: productMenuChildren } : item
        )));
      })
      .catch((error) => {
        console.error('Failed to load dynamic header products menu:', error);
      });
    return () => { active = false; };
  }, []);

  // The original template toggled these as body-level classes so the
  // CSS transitions (defined against `body.mobile-menu-visible`) keep working unmodified.
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-visible', mobileMenuOpen);
  }, [mobileMenuOpen]);

  // Preserve the complete header's document space when both rows become fixed.
  useEffect(() => {
    const header = headerRef.current;
    const headerShell = headerShellRef.current;

    if (!header || !headerShell) return undefined;

    const updateHeaderHeight = () => {
      header.style.setProperty('--header-shell-height', `${headerShell.offsetHeight}px`);
    };

    updateHeaderHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(headerShell);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/products', { state: { searchQuery: searchTerm.trim() } });
    }
  };


  return (
    <>
      <header ref={headerRef} className={`main-header${isFixed ? ' fixed-header' : ''}${isFixed && !shouldShowHeader ? ' header-hidden' : ''}`}>
        <div ref={headerShellRef} className="header-sticky-shell">
        {/* Header Top */}
        <div className="header-top">
          <div className="auto-container header-top-container">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="left-box d-flex align-items-center flex-wrap">
                <div className="header_socials" aria-label="Social media links">
                  <a className="fa-brands fa-facebook-f fa-fw social-facebook" href="#" aria-label="Facebook" />
                  <a className="fa-brands fa-instagram fa-fw social-instagram" href="#" aria-label="Instagram" />
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="social-x"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a className="fa-brands fa-youtube fa-fw social-youtube" href="#" aria-label="YouTube" />
                </div>
              </div>
              <div className="right-box">
                <ul className="header-top_info">
                  <li className="info-address">
                    <svg className="header-top-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <a href="https://maps.google.com/?q=107/2A,+Medavakkam+-+Mambakkam+Main+Road,+Mambakkam,+Chennai+-+600127" target="_blank" rel="noreferrer">
                      107/2A, Medavakkam - Mambakkam Main Road, Mambakkam, Chennai - 600127
                    </a>
                  </li>
                  <li className="info-email">
                    <svg className="header-top-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                    <a href="mailto:sales@sjceramics.in">sales@sjceramics.in</a>
                  </li>
                  <li className="info-hours">
                    <svg className="header-top-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.5 2" />
                    </svg>
                    Sun - Sun 9.00 am - 10.00 pm
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
              <div className="header-lower-row">
                  <div className="header-logo-container">
                    <Link to="/" className="header-logo-link">
                      <img src={logo} alt="SJ Ceramics" className="header-logo-primary" />
                    </Link>

                    {!partnerLogoFailed && (
                      <div className="header-logo-partner-wrap" title="KAG Authorized Channel Partner">
                        <img
                          src={partnerLogo}
                          alt="KAG Authorized Channel Partner"
                          className="header-logo-partner"
                          onError={() => setPartnerLogoFailed(true)}
                        />
                        <span className="header-logo-partner-copy">
                          <span className="header-logo-partner-slogan" lang="ta">இது பேரல்ல, பெருமை</span>
                          <span className="header-logo-partner-status">We Are Authorized Channel Partner</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="nav-outer">
                    <nav className="main-menu navbar-expand-md" aria-label="Primary navigation">
                      <div className="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                        <ul className="navigation clearfix">
                          {navigation.map((item) => (
                            <li
                              key={item.label}
                              className={`${item.children ? 'dropdown' : ''}${item.label === 'Products' ? ' products-dropdown' : ''}`.trim() || undefined}
                            >
                              {item.path.startsWith('#') ? (
                                <a href={item.path}>{item.label}</a>
                              ) : (
                                <Link
                                  to={item.path}
                                  state={item.state}
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
                                <DesktopSubmenu items={item.children} />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </nav>
                  </div>

                <div className="outer-box header-actions">
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
                        placeholder="Search"
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
                      Get In Touch
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
        </div>

        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpenContactModal={() => setIsModalOpen(true)}
          navigationItems={navigation}
        />
      </header>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
