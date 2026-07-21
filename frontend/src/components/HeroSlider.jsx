import { forwardRef, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { getBanners } from '../services/bannerApi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

const HeroSlider = forwardRef(function HeroSlider({ isActive = true }, ref) {
  const swiperRef = useRef(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    let active = true;

    const loadBanners = async () => {
      try {
        const banners = await getBanners();
        if (!active || !banners.length) return;
        setSlides(banners.filter((banner) => banner.imageUrl).map((banner) => ({
          id: banner.id,
          category: banner.placement || 'Featured Collection',
          image: banner.imageUrl,
          title: banner.title,
          copy: banner.description,
          position: 'center center',
          mobilePosition: 'center center',
          state: { filterCategory: 'category', filterValue: 'Tiles' },
        })));
      } catch {
        if (active) setSlides([]);
      }
    };

    loadBanners();
    const refreshTimer = window.setInterval(loadBanners, 30000);
    window.addEventListener('focus', loadBanners);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', loadBanners);
    };
  }, []);

  useEffect(() => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) return;

    if (isActive) autoplay.start();
    else autoplay.stop();
  }, [isActive]);

  if (!slides.length) return null;

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
          <SwiperSlide key={slide.id || slide.category}>
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
