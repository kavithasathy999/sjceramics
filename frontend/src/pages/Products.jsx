import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { products } from '../utils/ProductData';
import pageTitleBg from '../assets/images/background/35.webp';
import headerBg from '../assets/images/background/14.jpg';

// Import our custom Products CSS
import '../styles/products.css';

export default function Products() {
  const location = useLocation();

  // --- Filter & Sort States ---
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedFinishes, setSelectedFinishes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('default');
  
  // --- UI States ---
  const [visibleCount, setVisibleCount] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // --- Filter Options Extraction ---
  const filterOptions = {
    sizes: [...new Set(products.map(p => p.size))].sort(),
    types: [...new Set(products.map(p => p.type))].sort(),
    applications: [...new Set(products.map(p => p.application))].sort(),
    materials: [...new Set(products.map(p => p.material))].sort(),
    finishes: [...new Set(products.map(p => p.finish))].sort(),
    brands: [...new Set(products.map(p => p.brand))].sort(),
  };

  // --- Filtering Logic ---
  const filteredProducts = products.filter(product => {
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(product.size);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.type);
    const appMatch = selectedApplications.length === 0 || selectedApplications.includes(product.application);
    const matMatch = selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
    const finishMatch = selectedFinishes.length === 0 || selectedFinishes.includes(product.finish);
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const priceMatch = product.price <= maxPrice;

    // Color match checks color keywords in product name
    let colorMatch = true;
    if (selectedColor) {
      const normColor = selectedColor.toLowerCase();
      const colorKeywordsMap = {
        brown: ['brown', 'coffee', 'wood', 'chocolate', 'catalina'],
        black: ['black', 'nero', 'dark', 'charcoal', 'domino'],
        blue: ['blue', 'azure', 'aqua', 'onyx'],
        cream: ['cream', 'beige', 'ivory', 'almond'],
        gold: ['gold', 'golden', 'yellow', 'royal'],
        green: ['green', 'emerald', 'mint'],
        ivory: ['ivory', 'cream', 'beige', 'bianco', 'white'],
        orange: ['orange', 'peach', 'terracotta'],
        pearl: ['pearl', 'grey', 'silver'],
        pink: ['pink', 'rose'],
        red: ['red', 'terracotta', 'ruby'],
        teal: ['teal', 'cyan', 'turquoise'],
        white: ['white', 'bianco', 'snow', 'macasar'],
        gray: ['grey', 'gray', 'silver', 'slate', 'fossil'],
        yellow: ['yellow', 'gold', 'mustard'],
        multicolor: ['decor', 'patchwork', 'multi', 'multicolor']
      };
      const keywords = colorKeywordsMap[normColor] || [normColor];
      colorMatch = keywords.some(kw => product.name.toLowerCase().includes(kw));
    }

    return sizeMatch && typeMatch && appMatch && matMatch && finishMatch && brandMatch && priceMatch && colorMatch;
  });

  // --- Sorting Logic ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default sorting (no-op)
  });

  // --- Reset visible count when filters change ---
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedSizes, selectedTypes, selectedApplications, selectedMaterials, selectedFinishes, selectedBrands, selectedColor, maxPrice]);

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedTypes([]);
    setSelectedApplications([]);
    setSelectedMaterials([]);
    setSelectedFinishes([]);
    setSelectedBrands([]);
    setSelectedColor('');
    setMaxPrice(1000);
    setSortBy('default');
  };

  const handleCheckboxChange = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // --- Parse incoming state filters from About page tabs and pre-footer links ---
  useEffect(() => {
    if (location.state) {
      const { filterCategory, filterValue } = location.state;
      
      // Clear previous filters first to apply the quick-selection cleanly
      clearAllFilters();

      if (filterCategory === 'room') {
        let mappedApp = filterValue;
        if (filterValue === 'Bathroom' || filterValue === 'Bathroom Tiles') mappedApp = 'Bathroom/Toilet/Kitchen';
        else if (filterValue === 'Living room' || filterValue === 'Living Room') mappedApp = 'Living Room/Bedroom';
        else if (filterValue === 'Wall') mappedApp = 'Wall';
        else if (filterValue === 'Elevation' || filterValue === 'Elevation Tiles') mappedApp = 'Elevation/Exterior';
        else if (filterValue === 'Stair case' || filterValue === 'Staircase') mappedApp = 'Staircase';
        else if (filterValue === 'Roof' || filterValue === 'Roof Tiles') mappedApp = 'Roofing/Terrace';
        
        setSelectedApplications([mappedApp]);
      } else if (filterCategory === 'size') {
        // Map size terms to database format
        const cleanSize = filterValue.toLowerCase().replace(/\s/g, '').replace('tiles', '');
        let matchedSize = '';
        if (cleanSize === '12x12') matchedSize = '300x300 mm';
        else if (cleanSize === '24x24') matchedSize = '600x600 mm';
        else if (cleanSize === '24x12') matchedSize = '300x600 mm';
        else if (cleanSize === '48x24') matchedSize = '600x1200 mm';
        
        if (matchedSize) {
          setSelectedSizes([matchedSize]);
        } else {
          // Attempt fuzzy match in sizes (e.g. "800x800" or raw numbers)
          const searchVal = cleanSize.replace('mm', '').trim();
          const found = filterOptions.sizes.find(s => s.toLowerCase().replace(/\s/g, '').includes(searchVal));
          if (found) {
            setSelectedSizes([found]);
          } else {
            // Check if parts match (e.g. 12x22 -> 300x550 mm)
            const parts = searchVal.split('x');
            if (parts.length === 2) {
              const num1 = parseInt(parts[0]);
              const num2 = parseInt(parts[1]);
              // Map inches to mm (approximate: 12" -> 300mm, 24" -> 600mm)
              const approxW = Math.round(num1 * 25);
              const approxH = Math.round(num2 * 25);
              const foundApprox = filterOptions.sizes.find(s => {
                const sClean = s.toLowerCase().replace('mm','').replace(/\s/g, '');
                return sClean.includes(approxW.toString()) || sClean.includes(approxH.toString());
              });
              if (foundApprox) setSelectedSizes([foundApprox]);
            }
          }
        }
      } else if (filterCategory === 'color') {
        setSelectedColor(filterValue);
      } else if (filterCategory === 'finish') {
        const normFinish = filterValue.toLowerCase();
        if (normFinish.includes('glossy')) {
          setSelectedFinishes(['Glossy/High Glossy']);
        } else if (normFinish.includes('matt') || normFinish.includes('satin') || normFinish.includes('punch')) {
          setSelectedFinishes(['Matt/Satin/Punch']);
        } else if (normFinish.includes('elevation')) {
          setSelectedApplications(['Elevation/Exterior']);
          setSelectedFinishes(['Matt/Satin/Punch']);
        } else if (normFinish.includes('parking')) {
          setSelectedApplications(['Parking/Outdoor']);
        }
      } else if (filterCategory === 'material') {
        const normMat = filterValue.toLowerCase();
        if (normMat === 'vitrified') {
          setSelectedTypes(['Vitrified']);
        } else if (normMat === 'ceramic') {
          setSelectedTypes(['Ceramic']);
        } else if (normMat === 'porcelain') {
          setSelectedMaterials(['Porcelain']);
        } else if (normMat === 'wooden') {
          setSelectedColor('wood');
        } else if (normMat === 'gvt') {
          setSelectedMaterials(['GVT/PGVT']);
        }
      }
      
      // Clear navigation state so a reload doesn't re-apply on reset
      window.history.replaceState({}, document.title);

      // Smooth scroll to the catalog listing section
      setTimeout(() => {
        const element = document.getElementById('products-catalog-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [location.state]);

  // --- Direct WhatsApp Enquiry ---
  const handleViewDetails = (productName) => {
    const message = `Hi, I am interested in the ${productName} tile. Please share pricing and availability details.`;
    const whatsappUrl = `https://wa.me/919944242685?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="page-wrapper">
      {/* 1. Header (Standard Website Header) */}
      <Header variant="inner" bgImage={headerBg} />

      {/* 2. Breadcrumbs Page Title */}
      <PageTitle title="Tiles" bgImage={pageTitleBg} />

      <main className="products-page-container">
        
        {/* Catalog Description Intro - stretches full width */}
        <section className="products-intro-section">
          <div className="auto-container">
            <h1 className="products-intro-title">Premium Tiles Catalog</h1>
            <p className="products-intro-desc">
              Discover our extensive range of high-quality tiles crafted to perfection. From luxury vitrified tiling 
              and glazed floor tiles to durable elevation stones, we offer a wide variety of dimensions, applications, 
              and finishes. Browse our designs, apply filters to find your perfect match, and enquire directly.
            </p>
          </div>
        </section>

        <div className="auto-container">
          {/* Main Content Layout */}
          <div className="products-main-layout" id="products-catalog-section">
            
            {/* --- Filter Sidebar --- */}
            {mobileFiltersOpen && (
              <div 
                className="sidebar-overlay" 
                onClick={() => setMobileFiltersOpen(false)} 
                role="presentation" 
              />
            )}

            <aside className={`products-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
              <div className="sidebar-header">
                <h3>Filters</h3>
                {(selectedSizes.length > 0 || 
                  selectedTypes.length > 0 || 
                  selectedApplications.length > 0 || 
                  selectedMaterials.length > 0 || 
                  selectedFinishes.length > 0 || 
                  selectedBrands.length > 0 || 
                  maxPrice < 1000) && (
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Price range filter */}
              <div className="filter-group">
                <div className="filter-group-title">Price Range (₹/sqft)</div>
                <div className="price-slider-wrap">
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="price-range-input"
                  />
                  <div className="price-values">
                    <span>₹10</span>
                    <span>Max: ₹{maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Size Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Size</div>
                <div className="filter-options-list">
                  {filterOptions.sizes.map(size => (
                    <label key={size} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleCheckboxChange(size, selectedSizes, setSelectedSizes)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Type</div>
                <div className="filter-options-list">
                  {filterOptions.types.map(type => (
                    <label key={type} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleCheckboxChange(type, selectedTypes, setSelectedTypes)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Application Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Application</div>
                <div className="filter-options-list">
                  {filterOptions.applications.map(app => (
                    <label key={app} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedApplications.includes(app)}
                        onChange={() => handleCheckboxChange(app, selectedApplications, setSelectedApplications)}
                      />
                      {app}
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Material</div>
                <div className="filter-options-list">
                  {filterOptions.materials.map(mat => (
                    <label key={mat} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedMaterials.includes(mat)}
                        onChange={() => handleCheckboxChange(mat, selectedMaterials, setSelectedMaterials)}
                      />
                      {mat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Finish Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Finish</div>
                <div className="filter-options-list">
                  {filterOptions.finishes.map(finish => (
                    <label key={finish} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedFinishes.includes(finish)}
                        onChange={() => handleCheckboxChange(finish, selectedFinishes, setSelectedFinishes)}
                      />
                      {finish}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Brand</div>
                <div className="filter-options-list">
                  {filterOptions.brands.map(brand => (
                    <label key={brand} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleCheckboxChange(brand, selectedBrands, setSelectedBrands)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* --- Products Catalog Content --- */}
            <section className="products-content-area">
              
              <div className="catalog-top-bar">
                <div className="product-count-label">
                  Showing {Math.min(visibleCount, sortedProducts.length)} of {sortedProducts.length} Products
                </div>
                
                <div className="sorting-dropdown-wrap">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="default">Default Sorting</option>
                    <option value="name">Sort by Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Tags */}
              <div className="active-tags-list">
                {selectedSizes.map(size => (
                  <span key={size} className="active-tag-badge">
                    Size: {size}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(size, selectedSizes, setSelectedSizes)}>×</button>
                  </span>
                ))}
                {selectedTypes.map(type => (
                  <span key={type} className="active-tag-badge">
                    Type: {type}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(type, selectedTypes, setSelectedTypes)}>×</button>
                  </span>
                ))}
                {selectedApplications.map(app => (
                  <span key={app} className="active-tag-badge">
                    App: {app}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(app, selectedApplications, setSelectedApplications)}>×</button>
                  </span>
                ))}
                {selectedMaterials.map(mat => (
                  <span key={mat} className="active-tag-badge">
                    Material: {mat}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(mat, selectedMaterials, setSelectedMaterials)}>×</button>
                  </span>
                ))}
                {selectedFinishes.map(finish => (
                  <span key={finish} className="active-tag-badge">
                    Finish: {finish}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(finish, selectedFinishes, setSelectedFinishes)}>×</button>
                  </span>
                ))}
                {selectedBrands.map(brand => (
                  <span key={brand} className="active-tag-badge">
                    Brand: {brand}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(brand, selectedBrands, setSelectedBrands)}>×</button>
                  </span>
                ))}
                {selectedColor && (
                  <span className="active-tag-badge">
                    Color: {selectedColor}
                    <button className="active-tag-remove" onClick={() => setSelectedColor('')}>×</button>
                  </span>
                )}
                {maxPrice < 1000 && (
                  <span className="active-tag-badge">
                    Price: ≤ ₹{maxPrice}
                    <button className="active-tag-remove" onClick={() => setMaxPrice(1000)}>×</button>
                  </span>
                )}
              </div>

              {/* Tiles Card Grid */}
              {sortedProducts.length > 0 ? (
                <>
                  <div className="products-grid">
                    {sortedProducts.slice(0, visibleCount).map((product) => (
                      <article className="product-card" key={product.id}>
                        <div className="product-card-img-wrap">
                          <img src={product.image} alt={product.name} loading="lazy" />
                          <div className="product-360-badge" title="360° View Available">
                            <span className="text-360">360°</span>
                            <svg className="arrow-360" viewBox="0 0 20 6" fill="none">
                              <path d="M2 2C6 4.5 14 4.5 18 2" stroke="#0b5ed7" strokeWidth="2.2" strokeLinecap="round"/>
                              <path d="M15 4.5L18 2L15 -0.5" stroke="#0b5ed7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="product-card-info">
                          <h4 className="product-card-title">{product.name}</h4>
                          
                          <div className="product-card-spec-row">
                            <span>Size:</span>
                            <span className="product-card-spec-value">{product.size}</span>
                          </div>
                          
                          <div className="product-card-spec-row">
                            <span>Finish:</span>
                            <span className="product-card-spec-value">{product.finish}</span>
                          </div>
                          
                          <div className="product-card-spec-row">
                            <span>Type:</span>
                            <span className="product-card-spec-value">{product.type}</span>
                          </div>

                          <div className="product-card-price">
                            ₹{product.price} <span style={{ fontSize: '11px', color: '#888', fontWeight: 'normal' }}>/ sqft</span>
                          </div>
                          
                          <button 
                            className="product-card-btn"
                            onClick={() => handleViewDetails(product.name)}
                          >
                            View Details
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Load More pagination button */}
                  {sortedProducts.length > visibleCount && (
                    <div className="load-more-wrap">
                      <button 
                        className="load-more-btn"
                        onClick={() => setVisibleCount(prev => prev + 12)}
                      >
                        View More
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-products-found">
                  <h3>No Products Found</h3>
                  <p>Try adjusting or resetting your filter criteria to search again.</p>
                  <button className="theme-btn btn-style-one mt-3" onClick={clearAllFilters}>
                    <span className="btn-wrap">
                      <span className="text-one">Reset All Filters</span>
                      <span className="text-two">Reset All Filters</span>
                    </span>
                  </button>
                </div>
              )}
            </section>

          </div>
         </div>
      </main>

      {/* Floating Filter Button for Mobile Screen Breakpoint */}
      <button 
        className="mobile-filter-toggle"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <span className="flaticon-filter" style={{ marginRight: '5px' }} />
        Filter Products
      </button>

      {/* 4. Footer & Navigation Helper */}
      <Footer />
      <BackToTop />
    </div>
  );
}
