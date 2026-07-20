import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import NewArrivalsSlider from '../components/NewArrivalsSlider';
import ProductEnquiryModal from '../components/ProductEnquiryModal';
import ProductImageModal from '../components/ProductImageModal';
import { products } from '../utils/ProductData';
import { PRODUCT_FILTER_OPTIONS as FILTER_OPTIONS } from '../utils/productCatalogOptions';
import headerBg from '../assets/images/background/14.jpg';
import productsMarbleHero from '../assets/images/background/products-marble-hero.png';
import sjCeramicsLogo from '../assets/images/Logo-Png.png';
import kagLogo from '../assets/images/kaglogo.svg';

// Import our custom Products CSS
import '../styles/products.css';

const PRODUCT_CATEGORIES = [
  { name: 'Tiles', icon: 'fa-border-all' },
  { name: 'Sanitary Wares', icon: 'fa-toilet' },
  { name: 'Bath Fittings', icon: 'fa-shower' },
  { name: 'Others', icon: 'fa-shapes' },
];

const SIZE_ALIASES = {
  '300x300 mm': ['12x12'],
  '300x600 mm': ['24X12'],
  '600x600 mm': ['24X24'],
  '600x1200 mm': ['48X24'],
  '200x1200 mm': ['40X8'],
};

const FINISH_ALIASES = {
  'Glossy/High Glossy': ['Glossy', 'Crystal_high_glossy'],
  'Satin/Matt': ['Matt'],
  Structured: ['Engrave'],
  'Rustic/Carving': ['Carving'],
  Wood: ['Varnis'],
  'Glossy White': ['Glossy'],
  Chrome: ['Glossy'],
  'Mirror Finish': ['Hg_polished_finish'],
  'Grey Powder': ['Glue'],
  'White/Ivory': ['Matt'],
};

const USAGE_ALIASES = {
  'Bathroom/Toilet/Kitchen': ['Bath_bedroom_living-Kit', 'Kitchen_bathroom'],
  'Living Room/Bedroom': ['Living_room', 'Bedroom_livingroom_kit'],
  'Elevation/Exterior': ['Elevation / Exterior Tiles', 'Elevation_exterior'],
  'Parking/Driveway/Garage': ['Parking'],
  Bathroom: ['Bathroom_tiles'],
  'Bathroom/Dining': ['Bath_bedroom_living'],
  'Bathroom/Kitchen': ['Kitchen_bathroom'],
  'Office/Commercial/Shop': ['Commercial_spaces'],
  'Outdoor/Bathroom': ['Outdoor', 'Bathroom_tiles'],
  'Tiling Installation': ['Outdoor'],
};

const MATERIAL_ALIASES = {
  'Double Charge Vitrified': ['Double_charge', 'Vitrified'],
  'Full Body Vitrified': ['Full_body_vitrified', 'Vitrified'],
  'Glazed Vitrified (GVT)': ['Vitrified'],
  'Polished Glazed Vitrified (PGVT)': ['Pgvt', 'Vitrified'],
  Ceramic: ['Porcelain'],
  'Ceramic/Glazed Ceramic': ['Porcelain'],
  'Cement-based': ['Floor_tiles_material'],
};

const NET_QUANTITY_BY_SIZE = {
  '300x300 mm': '10',
  '300x600 mm': '6',
  '600x600 mm': '4',
  '600x1200 mm': '2',
  '800x800 mm': '3',
  '200x1200 mm': '6',
  Standard: '1',
  '20 kg': '1',
};

const COLOR_KEYWORDS = {
  Brown: ['brown', 'wood'],
  Blue: ['blue', 'aqua'],
  Black: ['black'],
  Cream: ['beige'],
  Gold: ['gold'],
  Green: ['green'],
  Ivory: ['ivory'],
  Orange: ['orange'],
  Pearl: ['pearl'],
  Pink: ['pink', 'rose'],
  Red: ['red'],
  Teal: ['teal'],
  White: ['white', 'bianco'],
  Gray: ['grey', 'gray', 'slate'],
  Yellow: ['yellow'],
  Multicolor: ['decor', 'multi'],
};

const getProductColors = (product) => {
  const searchableName = product.name.toLowerCase();
  const colors = Object.entries(COLOR_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => searchableName.includes(keyword)))
    .map(([color]) => color);
  const darkKeywords = ['black', 'brown', 'blue', 'slate'];
  const tone = darkKeywords.some((keyword) => searchableName.includes(keyword)) ? 'Dark' : 'Light';
  return [...new Set([tone, ...colors])];
};

const catalogProducts = products.map((product) => ({
  ...product,
  filterMeta: {
    sizes: SIZE_ALIASES[product.size] || [],
    finishes: FINISH_ALIASES[product.finish] || [],
    usage: USAGE_ALIASES[product.application] || [],
    materials: MATERIAL_ALIASES[product.material] || [],
    colors: getProductColors(product),
    netQuantities: NET_QUANTITY_BY_SIZE[product.size] ? [NET_QUANTITY_BY_SIZE[product.size]] : [],
  },
}));
const newArrivalProducts = catalogProducts.filter(product => product.isNewArrival);
const MAX_PRICE = Math.max(...catalogProducts.map(product => product.offerPrice));
const PRODUCTS_PER_PAGE = 12;
const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, 'start-ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, 'start-ellipsis', currentPage - 1, currentPage, currentPage + 1, 'end-ellipsis', totalPages];
};

const matchesSelectedOptions = (selectedOptions, productOptions) => (
  selectedOptions.length === 0 || selectedOptions.some((option) => productOptions.includes(option))
);

const findCanonicalOption = (options, value) => options.find(
  (option) => option.toLowerCase() === String(value).toLowerCase()
);

const ROOM_USAGE_ALIASES = {
  Bathroom: 'Bathroom_tiles',
  'Bathroom Tiles': 'Bathroom_tiles',
  'Living room': 'Living_room',
  'Living Room': 'Living_room',
  Elevation: 'Elevation / Exterior Tiles',
  'Elevation Tiles': 'Elevation / Exterior Tiles',
  'Stair case': 'Staircase',
  Staircase: 'Staircase',
  Roof: 'Roof',
  'Roof Tiles': 'Roof',
  Kitchen: 'Kitchen',
  Parking: 'Parking',
  'Swimming pool': 'Swimming_pool',
};

const getCanonicalUsage = (value) => {
  const directMatch = findCanonicalOption(FILTER_OPTIONS.usage, value);
  if (directMatch) return directMatch;
  if (ROOM_USAGE_ALIASES[value]) return ROOM_USAGE_ALIASES[value];
  return USAGE_ALIASES[value]?.[0] || '';
};

export default function Products() {
  const location = useLocation();

  // --- Filter & Sort States ---
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedFinishes, setSelectedFinishes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedNetQuantities, setSelectedNetQuantities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- UI States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  // --- Filtering Logic ---
  const filteredProducts = catalogProducts.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category || 'Tiles');
    const sizeMatch = matchesSelectedOptions(selectedSizes, product.filterMeta.sizes);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.type);
    const appMatch = matchesSelectedOptions(selectedApplications, product.filterMeta.usage);
    const matMatch = matchesSelectedOptions(selectedMaterials, product.filterMeta.materials);
    const finishMatch = matchesSelectedOptions(selectedFinishes, product.filterMeta.finishes);
    const colorMatch = matchesSelectedOptions(selectedColors, product.filterMeta.colors);
    const netQuantityMatch = matchesSelectedOptions(selectedNetQuantities, product.filterMeta.netQuantities);
    const priceMatch = product.offerPrice <= maxPrice;

    // Fuzzy text search match across multiple database attributes
    const searchMatch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.application.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.size.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && sizeMatch && typeMatch && appMatch && matMatch && finishMatch &&
      colorMatch && netQuantityMatch && priceMatch && searchMatch;
  });

  // --- Sorting Logic ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.offerPrice - b.offerPrice;
    if (sortBy === 'price-high') return b.offerPrice - a.offerPrice;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default sorting (no-op)
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const pageStartIndex = (activePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(pageStartIndex, pageStartIndex + PRODUCTS_PER_PAGE);
  const paginationItems = getPaginationItems(activePage, totalPages);

  // --- Reset pagination when the catalogue result set changes ---
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedSizes, selectedTypes, selectedApplications, selectedMaterials, selectedFinishes, selectedColors, selectedNetQuantities, maxPrice, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedTypes([]);
    setSelectedApplications([]);
    setSelectedMaterials([]);
    setSelectedFinishes([]);
    setSelectedColors([]);
    setSelectedNetQuantities([]);
    setMaxPrice(MAX_PRICE);
    setSortBy('default');
    setSearchQuery('');
  };

  const handleCheckboxChange = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleCategorySelect = (category) => {
    const isAlreadySelected = selectedCategories.includes(category);
    clearAllFilters();
    setSelectedCategories(isAlreadySelected ? [] : (category ? [category] : []));
    setMobileFiltersOpen(false);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === activePage) return;

    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      document.getElementById('products-catalog-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  // --- Parse incoming state filters from About page tabs, pre-footer links, and search popup ---
  useEffect(() => {
    if (location.state) {
      const {
        filterCategory,
        filterValue,
        filterValues,
        parentCategory,
        parentType,
        searchQuery: incomingSearch,
      } = location.state;
      
      // Clear previous filters first to apply the quick-selection cleanly
      clearAllFilters();

      if (incomingSearch !== undefined) {
        setSearchQuery(incomingSearch);
      } else if (filterCategory === 'category') {
        const incomingCategories = Array.isArray(filterValues)
          ? filterValues.filter(value => PRODUCT_CATEGORIES.some(category => category.name === value))
          : [filterValue];
        setSelectedCategories(incomingCategories);
      } else if (filterCategory === 'type') {
        if (parentCategory) setSelectedCategories([parentCategory]);
        setSelectedTypes([filterValue]);
      } else if (filterCategory === 'product') {
        if (parentCategory) setSelectedCategories([parentCategory]);
        if (parentType) setSelectedTypes([parentType]);
        setSearchQuery(filterValue);
      } else if (filterCategory === 'applications' && Array.isArray(filterValues)) {
        const validApplications = [...new Set(filterValues.map(getCanonicalUsage).filter(Boolean))];
        setSelectedApplications(validApplications);
      } else if (filterCategory === 'room') {
        const mappedUsage = getCanonicalUsage(filterValue);
        if (mappedUsage) setSelectedApplications([mappedUsage]);
      } else if (filterCategory === 'size') {
        const matchedSize = findCanonicalOption(FILTER_OPTIONS.sizes, filterValue);
        if (matchedSize) setSelectedSizes([matchedSize]);
      } else if (filterCategory === 'color') {
        const matchedColor = findCanonicalOption(FILTER_OPTIONS.colors, filterValue);
        if (matchedColor) setSelectedColors([matchedColor]);
      } else if (filterCategory === 'finish') {
        const normFinish = filterValue.toLowerCase();
        if (normFinish.includes('glossy')) {
          setSelectedFinishes(['Glossy']);
        } else if (normFinish.includes('matt') || normFinish.includes('satin') || normFinish.includes('punch')) {
          setSelectedFinishes(['Matt']);
        } else if (normFinish.includes('elevation')) {
          setSelectedApplications(['Elevation / Exterior Tiles']);
          setSelectedFinishes(['Matt']);
        } else if (normFinish.includes('parking')) {
          setSelectedApplications(['Parking']);
        }
      } else if (filterCategory === 'material') {
        const normMat = filterValue.toLowerCase();
        if (normMat === 'vitrified') {
          setSelectedMaterials(['Vitrified']);
        } else if (normMat === 'ceramic') {
          setSelectedMaterials(['Porcelain']);
        } else if (normMat === 'porcelain') {
          setSelectedMaterials(['Porcelain']);
        } else if (normMat === 'wooden') {
          setSelectedFinishes(['Varnis']);
        } else if (normMat === 'gvt') {
          setSelectedMaterials(['Vitrified']);
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

  return (
    <div className="page-wrapper">
      {/* 1. Header (Standard Website Header) */}
      <Header variant="inner" bgImage={headerBg} />

      {/* 2. Breadcrumbs Page Title */}
      <PageTitle
        title="Products"
        bgImage={productsMarbleHero}
        className="products-page-title"
      />

      <main className="products-page-container">
        <svg className="products-watermark-filter" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id="products-elephant-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.42  0 0 0 0 0.42  0 0 0 0 0.42  2 -1 -1 0 0"
            />
          </filter>
        </svg>
        <div className="products-elephant-watermarks" aria-hidden="true">
          <img className="products-elephant-watermark watermark-one" src={sjCeramicsLogo} alt="" />
          <img className="products-elephant-watermark watermark-two" src={sjCeramicsLogo} alt="" />
          <img className="products-elephant-watermark watermark-three" src={sjCeramicsLogo} alt="" />
        </div>

        {/* <section
          className="products-brand-hero"
          style={{ '--products-hero-image': `url(${productsMarbleHero})` }}
          aria-label="SJ Ceramics and KAG Tiles"
        >
          <div className="auto-container products-brand-hero_inner">
            <div className="products-brand-hero_brands">
              <div className="products-brand-hero_sj">
                <img src={sjCeramicsLogo} alt="SJ Ceramics — Elegance, Quality, Trust" />
              </div>

              <span className="products-brand-hero_divider" aria-hidden="true" />

              <div className="products-brand-hero_kag">
                <img src={kagLogo} alt="KAG Tiles — Touch to feel" />
                <strong>Wholesale and Retail</strong>
                <p>Authorized channel partner for premium KAG tiles and fittings.</p>
              </div>
            </div>

            <div className="products-brand-hero_links" aria-label="Brand websites">
              <span><i className="fa-solid fa-globe" aria-hidden="true" />www.sjceramics.in</span>
              <span><i className="fa-solid fa-globe" aria-hidden="true" />www.kagindia.com</span>
            </div>
          </div>
        </section> */}
        
        {/* Catalog Description Intro - stretches full width */}
        <section className="products-intro-section">
          <div className="auto-container">
            <h1 className="products-intro-title">Premium Product Catalog</h1>
            <p className="products-intro-desc">
              Explore a refined selection of tiles, sanitary wares, bath fittings, and essential installation
              products chosen for lasting quality, thoughtful design, and dependable performance.
            </p>
          </div>
        </section>

        <div className="auto-container">
          <NewArrivalsSlider products={newArrivalProducts} onProductSelect={setSelectedProduct} />

          <section className="product-categories" aria-labelledby="product-categories-title">
            <div className="product-categories_heading">
              <span>Shop by category</span>
              <h2 id="product-categories-title">Find the right collection</h2>
              <p style={{color: "var(--color-seven)"}}>Choose a category to view products curated for your space.</p>
            </div>
            <div className="product-category-buttons" aria-label="Product categories">
              {PRODUCT_CATEGORIES.map(({ name, icon }) => {
                const isSelected = selectedCategories.includes(name);
                return (
                  <button
                    type="button"
                    className={`product-category-button${isSelected ? ' is-selected' : ''}`}
                    onClick={() => handleCategorySelect(name)}
                    aria-pressed={isSelected}
                    key={name}
                  >
                    <span className="product-category-button_icon" aria-hidden="true">
                      <i className={`fa-solid ${icon}`} />
                    </span>
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </section>

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
                {(selectedCategories.length > 0 ||
                  selectedSizes.length > 0 || 
                  selectedTypes.length > 0 || 
                  selectedApplications.length > 0 || 
                  selectedMaterials.length > 0 || 
                  selectedFinishes.length > 0 ||
                  selectedColors.length > 0 ||
                  selectedNetQuantities.length > 0 ||
                  maxPrice < MAX_PRICE) && (
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Price range filter */}
              <div className="filter-group price-filter-card">
                <div className="filter-group-title">Price ({formatPrice(maxPrice)})</div>
                <div className="price-slider-wrap">
                  <input 
                    type="range" 
                    min="0" 
                    max={MAX_PRICE}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="price-range-input"
                    aria-label="Maximum product price"
                    style={{ '--price-progress': `${(maxPrice / MAX_PRICE) * 100}%` }}
                  />
                  <div className="price-values">
                    <span>₹0</span>
                    <span>₹{formatPrice(MAX_PRICE)}</span>
                  </div>
                </div>
              </div>

              {/* Size Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Size</div>
                <div className="filter-options-list">
                  {FILTER_OPTIONS.sizes.map(size => (
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

              {/* Finish Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Finish</div>
                <div className="filter-options-list">
                  {FILTER_OPTIONS.finishes.map(finish => (
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

              {/* Where To Use Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Where To Use</div>
                <div className="filter-options-list">
                  {FILTER_OPTIONS.usage.map(app => (
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
                  {FILTER_OPTIONS.materials.map(mat => (
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

              {/* Color Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Color</div>
                <div className="filter-options-list">
                  {FILTER_OPTIONS.colors.map(color => (
                    <label key={color} className="filter-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={selectedColors.includes(color)}
                        onChange={() => handleCheckboxChange(color, selectedColors, setSelectedColors)}
                      />
                      {color}
                    </label>
                  ))}
                </div>
              </div>

              {/* Net Quantity Filters */}
              <div className="filter-group">
                <div className="filter-group-title">Net quantity (tiles per box)</div>
                <div className="filter-options-list">
                  {FILTER_OPTIONS.netQuantities.map(quantity => (
                    <label key={quantity} className="filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedNetQuantities.includes(quantity)}
                        onChange={() => handleCheckboxChange(
                          quantity,
                          selectedNetQuantities,
                          setSelectedNetQuantities,
                        )}
                      />
                      {quantity}
                    </label>
                  ))}
                </div>
              </div>

            </aside>

            {/* --- Products Catalog Content --- */}
            <section className="products-content-area">
              
              <div className="catalog-top-bar">
                <div className="product-count-label">
                  {sortedProducts.length > 0
                    ? `Showing ${pageStartIndex + 1}–${Math.min(pageStartIndex + PRODUCTS_PER_PAGE, sortedProducts.length)} of ${sortedProducts.length} Products`
                    : 'Showing 0 Products'}
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
                {selectedCategories.map(cat => (
                  <span key={cat} className="active-tag-badge">
                    Category: {cat}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(cat, selectedCategories, setSelectedCategories)}>×</button>
                  </span>
                ))}
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
                    {app}
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
                {selectedColors.map(color => (
                  <span key={color} className="active-tag-badge">
                    Color: {color}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(color, selectedColors, setSelectedColors)}>×</button>
                  </span>
                ))}
                {selectedNetQuantities.map(quantity => (
                  <span key={quantity} className="active-tag-badge">
                    Net quantity: {quantity}
                    <button className="active-tag-remove" onClick={() => handleCheckboxChange(quantity, selectedNetQuantities, setSelectedNetQuantities)}>×</button>
                  </span>
                ))}
                {searchQuery && (
                  <span className="active-tag-badge">
                    Search: {searchQuery}
                    <button className="active-tag-remove" onClick={() => setSearchQuery('')}>×</button>
                  </span>
                )}
                {maxPrice < MAX_PRICE && (
                  <span className="active-tag-badge">
                    Price: ≤ ₹{formatPrice(maxPrice)}
                    <button className="active-tag-remove" onClick={() => setMaxPrice(MAX_PRICE)}>×</button>
                  </span>
                )}
              </div>

              {/* Tiles Card Grid */}
              {sortedProducts.length > 0 ? (
                <>
                  <div className="products-grid">
                    {paginatedProducts.map((product) => (
                      <article
                        className="product-card"
                        key={product.id}
                      >
                        <div className="product-card-img-wrap">
                          <button
                            type="button"
                            className="product-card-image-button"
                            onClick={() => setPreviewProduct(product)}
                            aria-label={`View larger image of ${product.name}`}
                          >
                            <img src={product.image} alt={product.name} loading="lazy" />
                          </button>
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

                          <div className="product-card-pricing">
                            <div className="product-card-mrp">
                              <span>MRP</span>
                              <del>₹{formatPrice(product.mrp)}</del>
                              {product.category === 'Tiles' && <small>/ sqft</small>}
                            </div>
                            <div className="product-card-offer">
                              <span>Offer Price</span>
                              <strong>₹{formatPrice(product.offerPrice)}</strong>
                              {product.category === 'Tiles' && <small>/ sqft</small>}
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            className="product-card-btn"
                            onClick={() => setSelectedProduct(product)}
                          >
                            Proceed To Checkout
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav className="products-pagination" aria-label="Product catalogue pagination">
                      <button
                        type="button"
                        className="products-pagination_nav"
                        onClick={() => handlePageChange(activePage - 1)}
                        disabled={activePage === 1}
                        aria-label="Go to previous page"
                      >
                        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                        <span>Previous</span>
                      </button>

                      <div className="products-pagination_pages">
                        {paginationItems.map(item => (
                          typeof item === 'number' ? (
                            <button
                              type="button"
                              className={`products-pagination_page ${item === activePage ? 'is-active' : ''}`}
                              onClick={() => handlePageChange(item)}
                              aria-label={`Go to page ${item}`}
                              aria-current={item === activePage ? 'page' : undefined}
                              key={item}
                            >
                              {item}
                            </button>
                          ) : (
                            <span className="products-pagination_ellipsis" aria-hidden="true" key={item}>…</span>
                          )
                        ))}
                      </div>

                      <button
                        type="button"
                        className="products-pagination_nav"
                        onClick={() => handlePageChange(activePage + 1)}
                        disabled={activePage === totalPages}
                        aria-label="Go to next page"
                      >
                        <span>Next</span>
                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="no-products-found">
                  <h3>Out Of Stock</h3>
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

      {selectedProduct && (
        <ProductEnquiryModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {previewProduct && (
        <ProductImageModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}

      {/* 4. Footer & Navigation Helper */}
      <Footer />
      <BackToTop />
    </div>
  );
}
