import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

import tilesImage from '../assets/images/main-slider/sjc-tiles-hero.png';
import sanitaryImage from '../assets/images/main-slider/sjc-sanitary-hero.png';
import bathImage from '../assets/images/main-slider/sjc-bath-hero.png';

const slides = [
  { category: 'Tiles', image: tilesImage, title: 'TILES', copy: 'Elevate every room with beautiful surfaces, timeless textures and designs made to last.', state: { filterCategory: 'category', filterValue: 'Tiles' } },
  { category: 'Sanitary Wares', image: sanitaryImage, title: 'SANITARY WARES', copy: 'Thoughtfully selected fixtures that bring comfort, function and quiet refinement to daily life.', state: { filterCategory: 'category', filterValue: 'Sanitary Wares' } },
  { category: 'Bath Fittings', image: bathImage, title: 'BATH FITTINGS', copy: 'Sophisticated fittings and details that make every bathing space feel considered.', state: { filterCategory: 'category', filterValue: 'Bath Fittings' } },
];

export default function HeroSlider() {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <section className="premium-hero" aria-label="SJ Ceramics collections">
      <Swiper
        className="premium-hero-swiper"
        modules={[A11y, Autoplay, Navigation, Pagination]}
        loop
        speed={850}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        navigation={{ prevEl, nextEl }}
        pagination={{
          bulletElement: 'button',
          clickable: true,
        }}
        a11y={{ paginationBulletMessage: 'Go to collection slide {{index}}' }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.category}>
            <article className="premium-hero-slide" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="premium-hero-shade" />
              <div className="premium-hero-container">
                <div className="premium-hero-content">
                  <p className="premium-hero-category">{slide.category}</p>
                  <h1>{slide.title}</h1>
                  <p className="premium-hero-copy">{slide.copy}</p>
                  <div className="premium-hero-actions">
                    <Link to="/products" state={slide.state} className="premium-hero-primary">View Products<span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="premium-hero-controls" aria-label="Hero carousel controls">
        <button ref={setPrevEl} type="button" className="premium-hero-prev" aria-label="Previous collection" />
        <button ref={setNextEl} type="button" className="premium-hero-next" aria-label="Next collection" />
      </div>
    </section>
  );
}
