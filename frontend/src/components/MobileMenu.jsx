import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation } from '../utils/navigation';
import mobileLogo from '../assets/images/Logo-Png.png';

function MobileNavigationItems({ items, level, parentKey, openItems, toggleItem, onClose, currentPath }) {
  return items.map((item, index) => {
    const itemKey = `${parentKey}-${index}`;
    const isOpen = Boolean(openItems[itemKey]);
    const isActive = item.path && !item.path.startsWith('#') && (
      item.path === '/' ? currentPath === '/' : currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );

    return (
      <li
        key={`${itemKey}-${item.label}`}
        className={`${item.children ? 'dropdown' : ''}${isOpen ? ' open' : ''}${isActive ? ' current' : ''}`.trim()}
      >
        {item.path.startsWith('#') ? (
          <a href={item.path} onClick={item.children ? undefined : onClose}>
            {item.label}
          </a>
        ) : (
          <Link to={item.path} state={item.state} onClick={onClose}>
            {item.label}
          </Link>
        )}
        {item.children && (
          <>
            <button
              type="button"
              className="dropdown-btn"
              aria-label={`Toggle ${item.label} submenu`}
              aria-expanded={isOpen}
              onClick={() => toggleItem(itemKey)}
            >
              <span className={`fa fa-angle-${isOpen ? 'up' : 'down'}`} />
            </button>
            <ul
              className={`mobile-menu-level mobile-menu-level-${level + 1}`}
            >
              <MobileNavigationItems
                items={item.children}
                level={level + 1}
                parentKey={itemKey}
                openItems={openItems}
                toggleItem={toggleItem}
                onClose={onClose}
                currentPath={currentPath}
              />
            </ul>
          </>
        )}
      </li>
    );
  });
}

export default function MobileMenu({ open, onClose, onOpenContactModal, navigationItems = navigation }) {
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    if (open) return undefined;

    const resetTimer = window.setTimeout(() => {
      setOpenItems({});
    }, 360);

    return () => window.clearTimeout(resetTimer);
  }, [open]);

  const toggleItem = (itemKey) => {
    setOpenItems((current) => ({
      ...current,
      [itemKey]: !current[itemKey],
    }));
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
            <MobileNavigationItems
              items={navigationItems}
              level={0}
              parentKey="root"
              openItems={openItems}
              toggleItem={toggleItem}
              onClose={onClose}
              currentPath={location.pathname}
            />
          </ul>
        </div>
      </nav>
    </div>
  );
}
