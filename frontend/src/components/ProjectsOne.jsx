import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tileTexture from '../assets/images/background/projects-tile-texture.png';
import { getGalleryItems } from '../services/galleryApi';
import './ProjectsOne.css';

export default function ProjectsOne() {
  const [galleryItems, setGalleryItems] = useState([]);

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
          if (active) setGalleryItems([]);
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

  if (!galleryItems.length) return null;

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
