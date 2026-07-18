import { forwardRef, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

import marbleFloorImage from '../assets/images/main-slider/hero-marble-floor-v2.webp';
import designerWallImage from '../assets/images/main-slider/hero-designer-wall-v2.webp';
import woodStoneImage from '../assets/images/main-slider/hero-wood-stone-v2.webp';
import sanitaryBathImage from '../assets/images/main-slider/hero-sanitary-bath-v2.webp';

const slides = [
  {
    category: 'Floor Tiles',
    image: marbleFloorImage,
    title: 'MARBLE TILES',
    copy: 'Bring quiet luxury home with expansive marble-inspired surfaces, refined veining and a beautifully polished finish.',
    position: 'center center',
    mobilePosition: '72% center',
    state: { filterCategory: 'category', filterValue: 'Tiles' },
  },
  {
    category: 'Wall Tiles',
    image: designerWallImage,
    title: 'DESIGNER WALL TILES',
    copy: 'Create tactile feature walls with dimensional textures, warm stone character and considered contemporary detail.',
    position: 'center center',
    mobilePosition: '72% center',
    state: { filterCategory: 'room', filterValue: 'Wall' },
  },
  {
    category: 'Surface Collections',
    image: woodStoneImage,
    title: 'WOOD & STONE TILES',
    copy: 'Discover the natural warmth of timber and the enduring character of stone, recreated for modern everyday spaces.',
    position: 'center center',
    mobilePosition: '69% center',
    state: { filterCategory: 'category', filterValue: 'Tiles' },
  },
  {
    category: 'Bathroom Collection',
    image: sanitaryBathImage,
    title: 'SANITARY WARES & BATH FITTINGS',
    copy: 'Complete your bathroom with sculptural sanitary ware and precision fittings selected for comfort, function and lasting style.',
    position: 'center center',
    mobilePosition: '72% center',
    state: {
      filterCategory: 'category',
      filterValues: ['Sanitary Wares', 'Bath Fittings'],
    },
  },
];

const HeroSlider = forwardRef(function HeroSlider({ isActive = true }, ref) {
  const swiperRef = useRef(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;

    if (isActive) autoplay.start();
    else autoplay.stop();
  }, [isActive]);

  return (
    <section ref={ref} className="premium-hero" aria-label="SJ Ceramics collections">
      <Swiper
        className="premium-hero-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (!isActive) swiper.autoplay.stop();
        }}
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
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.category}>
            <article className="premium-hero-slide premium-hero-zoom-in">
              <img
                className="premium-hero-media"
                src={slide.image}
                alt=""
                width="1776"
                height="920"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                style={{
                  '--hero-position': slide.position,
                  '--hero-mobile-position': slide.mobilePosition,
                }}
                aria-hidden="true"
              />
              <div className="premium-hero-shade" />
              <div className="premium-hero-container">
                <div className="premium-hero-content">
                  <p className="premium-hero-category">{slide.category}</p>
                  <h1 className={`premium-hero-title${slide.title.length > 24 ? ' premium-hero-title-long' : ''}`}>{slide.title}</h1>
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
});

export default HeroSlider;
