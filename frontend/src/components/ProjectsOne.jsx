import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tileTexture from '../assets/images/background/projects-tile-texture.png';
import allTiles from '../assets/images/brands/all_tiles.png';
import floorTiles from '../assets/images/brands/floor_tiles.png';
import wallTiles from '../assets/images/brands/wall_tiles.png';
import athangudiTiles from '../assets/images/brands/athangudi_tiles.png';
import sanitaryware from '../assets/images/brands/sanitaryware.png';
import flushTank from '../assets/images/brands/flush_tank.png';
import aquaFaucet from '../assets/images/brands/aqua_faucet.png';
import ptmtTaps from '../assets/images/brands/ptmt_taps.png';
import kitchenSink from '../assets/images/brands/kitchen_sink.png';
import adhesiveGrout from '../assets/images/brands/adhesive_grout.png';
import sanitaryGallery from '../assets/images/gallery/sanitary-ware-gallery-v2.png';
import bathFittingsGallery from '../assets/images/gallery/bath-fittings-gallery-v2.png';
import { getGalleryItems } from '../services/galleryApi';
import './ProjectsOne.css';

const fallbackGalleryItems = [
  { image: floorTiles, name: 'Premium Floor Tiles', category: 'Tiles', position: 'center 64%', filter: { filterCategory: 'room', filterValue: 'Living Room' } },
  { image: wallTiles, name: 'Decorative Wall Tiles', category: 'Tiles', position: 'center', filter: { filterCategory: 'room', filterValue: 'Bathroom Tiles' } },
  { image: allTiles, name: 'Designer Tile Collection', category: 'Tiles', position: 'center', filter: { filterCategory: 'category', filterValue: 'Tiles' } },
  { image: athangudiTiles, name: 'Athangudi Heritage Tiles', category: 'Tiles', position: 'center', filter: { filterCategory: 'category', filterValue: 'Tiles' } },
  { image: sanitaryGallery, name: 'Sanitary Ware Collection', category: 'Sanitary Wares', position: 'center 58%', filter: { filterCategory: 'category', filterValue: 'Sanitary Wares' } },
  { image: sanitaryware, name: 'Luxury Bathroom Suite', category: 'Sanitary Wares', position: 'center', filter: { filterCategory: 'category', filterValue: 'Sanitary Wares' } },
  { image: flushTank, name: 'Modern Flush Tank', category: 'Sanitary Wares', position: 'center', filter: { filterCategory: 'category', filterValue: 'Sanitary Wares' } },
  { image: bathFittingsGallery, name: 'Premium Bath Fittings', category: 'Bath Fittings', position: '36% center', filter: { filterCategory: 'category', filterValue: 'Bath Fittings' } },
  { image: aquaFaucet, name: 'Chrome Basin Mixer', category: 'Bath Fittings', position: 'center', filter: { searchQuery: 'AQUA LUXURY BASIN MIXER' } },
  { image: ptmtTaps, name: 'PTMT Designer Tap', category: 'Others', position: 'center', filter: { searchQuery: 'PTMT LEAK-PROOF TAP' } },
  { image: adhesiveGrout, name: 'Tile Adhesive & Grout', category: 'Others', position: 'center', filter: { searchQuery: 'KAG PREMIUM TILE ADHESIVE' } },
  { image: kitchenSink, name: 'Kitchen Sink Collection', category: 'Others', position: 'center', filter: { filterCategory: 'category', filterValue: 'Others' } },
];

export default function ProjectsOne() {
  const [galleryItems, setGalleryItems] = useState(fallbackGalleryItems);

  useEffect(() => {
    let active = true;
    const loadGallery = () => {
      getGalleryItems()
        .then((items) => {
          if (active && items.length) {
            setGalleryItems(items.map((item) => ({
              ...item,
              image: item.imageUrl,
              name: item.title,
              position: item.position || 'center',
              filter: item.filter || {},
            })));
          }
        })
        .catch(() => {
          // Keep the original gallery visible while the API is unavailable.
        });
    };

    loadGallery();
    const refreshTimer = window.setInterval(loadGallery, 30000);
    window.addEventListener('focus', loadGallery);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', loadGallery);
    };
  }, []);

  return (
    <section
      className="project-showcase"
      style={{ '--project-tile-texture': `url(${tileTexture})` }}
      aria-labelledby="project-showcase-title"
    >
      <div className="project-showcase__container">
        <div className="sec-title centered project-showcase__heading">
          <div className="sec-title_title">
            <i className="flaticon-wood-1" /> Our Gallery
          </div>
          <h2 className="sec-title_heading" id="project-showcase-title">
            Explore Our Signature Collection
          </h2>
          <p>
            A curated gallery of surfaces, sanitaryware, fittings and essentials crafted for beautiful spaces.
          </p>
        </div>

        <div className="project-showcase__gallery">
          {galleryItems.map((item) => (
            <article
              className="project-showcase__gallery-item"
              key={item.id || item.name}
              style={{ '--gallery-object-position': item.position }}
            >
              <Link
                to="/products"
                state={item.filter}
                className="project-showcase__image"
                aria-label={`View ${item.name} products`}
              >
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="project-showcase__image-shade" aria-hidden="true" />
                <div className="project-showcase__product-copy">
                  <span className="project-showcase__product-category">{item.category}</span>
                  <h3>{item.name}</h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
