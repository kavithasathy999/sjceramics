import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import modelImg from '../assets/images/bgimages/leftimage.png';
import '../styles/choosetab.css';
import { getExploreCollections } from '../services/exploreCollectionsApi';

const EMPTY_COLLECTIONS = { colors: [], sizes: [], thicknesses: [] };

// SVG Icons for Rooms
const RoomIcons = {
  bathroom: (
    <svg viewBox="0 0 24 24">
      <path d="M21 11H3V10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1H21zM7 6h2v1H7V6zm8 0h2v1h-2V6zM3 13h18v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-1zm4 6h2v2H7v-2zm8 0h2v2h-2v-2z" />
    </svg>
  ),
  wall: (
    <svg viewBox="0 0 24 24">
      <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 6v3H5V6h4zm0 5v3H5v-3h4zm10 7H5v-2h14v2zm0-5h-8v-3h8v3zm0-5h-8V6h8v3z" />
    </svg>
  ),
  livingroom: (
    <svg viewBox="0 0 24 24">
      <path d="M4 18v2h2v-2h12v2h2v-2a3 3 0 0 0 3-3V9a2 2 0 0 0-2-2h-3V5H8v2H5a2 2 0 0 0-2 2v6a3 3 0 0 0 3 3zm4-11h8v1H8V7zm-3 2h14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9z" />
    </svg>
  ),
  elevation: (
    <svg viewBox="0 0 24 24">
      <path d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm0-4H5V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z" />
    </svg>
  ),
  pool: (
    <svg viewBox="0 0 24 24">
      <path d="M2 20a2.5 2.5 0 0 0 4 0 2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0 2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0h-2a1 1 0 0 1-1.6.8l-.4-.3a2.5 2.5 0 0 0-4 0 2.5 2.5 0 0 1-4 0 2.5 2.5 0 0 0-4 0 2.5 2.5 0 0 1-4 0H2zm16-4V7a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2H9V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v12h2V8h2v8h2V8h2v8h2v-4h1v4h2z" />
    </svg>
  ),
  staircase: (
    <svg viewBox="0 0 24 24">
      <path d="M19 3h-3v3h-3v3H10v3H7v3H4v6h17V3zm-1 17H5v-1h3v-3h3v-3h3v-3h3V5h1v15z" />
    </svg>
  ),
  kitchen: (
    <svg viewBox="0 0 24 24">
      <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v5h7V5H4zm9 0v5h7V5h-7zM4 12v7h7v-7H4zm9 0v7h7v-7h-7zm3 1h2v2h-2v-2zM6 13h2v2H6v-2z" />
    </svg>
  ),
  flooring: (
    <svg viewBox="0 0 24 24">
      <path d="M3 3h18v18H3V3zm2 2v6h6V5H5zm8 0v6h6V5h-6zM5 13v6h6v-6H5zm8 0v6h6v-6h-6z" />
    </svg>
  ),
  parking: (
    <svg viewBox="0 0 24 24">
      <path d="M7 2h7a6 6 0 0 1 0 12h-3v8H7V2zm4 4v4h3a2 2 0 0 0 0-4h-3z" />
    </svg>
  )
};

export default function ChooseTabSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [collections, setCollections] = useState(EMPTY_COLLECTIONS);
  const [collectionError, setCollectionError] = useState('');

  const loadCollections = useCallback(() => {
    setCollectionError('');
    return getExploreCollections()
      .then((items) => setCollections({
        colors: items.filter((item) => item.type === 'colors').map((item) => ({ name: item.colorName, hex: item.colorHex })),
        sizes: items.filter((item) => item.type === 'size').map((item) => item.displayValue),
        thicknesses: items.filter((item) => item.type === 'thickness').map((item) => item.displayValue),
      }))
      .catch(() => {
        setCollections(EMPTY_COLLECTIONS);
        setCollectionError('Unable to load live collections. Please try again.');
      });
  }, []);

  useEffect(() => { loadCollections(); }, [loadCollections]);

  const tabs = [
    { label: 'Choose by Colors' },
    { label: 'Choose by Rooms' },
    { label: 'Choose by Size' },
    { label: 'Choose by Thickness' }
  ];

  const rooms = [
    { name: 'Bathroom', icon: 'bathroom', value: 'Bathroom' },
    { name: 'Wall', icon: 'wall', value: 'Wall' },
    { name: 'Living room', icon: 'livingroom', value: 'Living room' },
    { name: 'Elevation', icon: 'elevation', value: 'Elevation' },
    { name: 'Swimming pool', icon: 'pool', value: 'Swimming pool' },
    { name: 'Stair case', icon: 'staircase', value: 'Stair case' },
    { name: 'Kitchen', icon: 'kitchen', value: 'Kitchen' },
    { name: 'Flooring', icon: 'flooring', value: 'Tiles', category: 'category' },
    { name: 'Parking', icon: 'parking', value: 'Parking' }
  ];

  // Route to catalog with parameters
  const handleSelect = (category, value) => {
    navigate('/products', { state: { filterCategory: category, filterValue: value } });
  };

  // Dynamically calculate the top pointer position based on button height + margins
  const pointerTop = `${30 + activeTab * 56}px`;

  return (
    <section className="choose-tab-section">
      <div className="auto-container">
        
        {/* Component Title Header */}
        <div className="sec-title centered" style={{ marginBottom: '50px' }}>
          <div className="sec-title_title">
            <i className="flaticon-home" style={{ marginRight: '8px' }} />
            COLLECTIONS
          </div>
          <h2 style={{ marginTop: '10px', color: '#231f1c', fontWeight: 800 }}>Explore Our Collections</h2>
        </div>

        {collectionError && <div className="collection-fallback-alert" role="status"><span>{collectionError}</span><button type="button" onClick={loadCollections}>Retry</button></div>}
        <div className="choose-tab-container">
          
          {/* Left Vertical Tabs list */}
          <div className="choose-tabs-list">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                className={`choose-tab-btn${activeTab === idx ? ' active-tab' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Card Panel */}
          <div 
            className="choose-tab-content-card"
            style={{ '--pointer-top': pointerTop }}
          >
            {/* Colors tab panel */}
            {activeTab === 0 && (
              <div className="colors-grid">
                {collections.colors.map((color, idx) => (
                  <div 
                    className="color-swatch-item" 
                    key={idx}
                    onClick={() => handleSelect('color', color.name)}
                  >
                    <div 
                      className="color-swatch-circle"
                      style={{ 
                        background: color.hex,
                        border: color.name === 'White' || color.name === 'Ivory' ? '1px solid #ddd' : '1px solid rgba(0,0,0,0.05)'
                      }}
                    />
                    <span className="color-swatch-name">{color.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Rooms tab panel */}
            {activeTab === 1 && (
              <div className="rooms-panel-container">
                <div
                  className="rooms-grid"
                  role="region"
                  aria-label="Room collections"
                  tabIndex={0}
                >
                  {rooms.map((room, idx) => (
                    <div 
                      className="room-card-item" 
                      key={idx}
                      onClick={() => handleSelect(room.category || 'room', room.value)}
                    >
                      <div className="room-card-icon-wrap">
                        {RoomIcons[room.icon]}
                      </div>
                      <span className="room-card-name">{room.name}</span>
                    </div>
                  ))}
                </div>
                <div className="rooms-model-image-wrap">
                  <img src={modelImg} alt="Pointing model" />
                </div>
              </div>
            )}

            {/* Sizes tab panel */}
            {activeTab === 2 && (
              <div className="sizes-grid">
                {collections.sizes.map((size, idx) => (
                  <button 
                    className="size-pill-btn" 
                    key={idx}
                    onClick={() => handleSelect('size', size.replace(/×/g, 'x'))}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Thickness tab panel */}
            {activeTab === 3 && (
              <div className="thickness-grid">
                {collections.thicknesses.map((thickness, idx) => (
                  <button 
                    className="thickness-pill-btn" 
                    key={idx}
                    onClick={() => handleSelect('thickness', thickness)}
                  >
                    {thickness}
                  </button>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
