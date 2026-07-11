import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { navigation } from '../utils/navigation';
import mobileLogo from '../assets/images/mobile-logo.png';

export default function MobileMenu({ open, onClose, onOpenContactModal }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (!open) setOpenIndex(null);
  }, [open]);

  const toggleItem = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="mobile-menu">
      <div className="menu-backdrop" onClick={onClose} />
      <div className="close-btn" onClick={onClose}>
        <span className="icon flaticon-close" />
      </div>

      <nav className="menu-box">
        <div className="nav-logo">
          <Link to="/" onClick={onClose}>
            <img src={mobileLogo} alt="SJCeramics" title="SJCeramics" />
          </Link>
        </div>
        <div className="menu-outer">
          <ul className="navigation">
            {navigation.map((item, index) => (
              <li
                key={item.label}
                className={`${item.children ? 'dropdown' : ''}${openIndex === index ? ' open' : ''}`}
              >
                {item.path.startsWith('#') ? (
                  <a
                    href={item.path}
                    onClick={(event) => {
                      if (item.children) {
                        event.preventDefault();
                        toggleItem(index);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    state={item.state}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <>
                    <button
                      type="button"
                      className="dropdown-btn"
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() => toggleItem(index)}
                    >
                      <span className="fa fa-angle-down" />
                    </button>
                    <ul style={{ display: openIndex === index ? 'block' : 'none' }}>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.path.startsWith('#') ? (
                            <a href={child.path} onClick={onClose}>
                              {child.label}
                            </a>
                          ) : (
                            <Link to={child.path} state={child.state} onClick={onClose}>
                              {child.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
