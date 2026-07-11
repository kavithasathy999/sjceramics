import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import allTiles from '../assets/images/brands/all_tiles.png';
import wallTiles from '../assets/images/brands/wall_tiles.png';
import floorTiles from '../assets/images/brands/floor_tiles.png';
import athangudiTiles from '../assets/images/brands/athangudi_tiles.png';
import aquaFaucet from '../assets/images/brands/aqua_faucet.png';
import sanitaryware from '../assets/images/brands/sanitaryware.png';
import kitchenSink from '../assets/images/brands/kitchen_sink.png';
import flushTank from '../assets/images/brands/flush_tank.png';
import ptmtTaps from '../assets/images/brands/ptmt_taps.png';
import adhesiveGrout from '../assets/images/brands/adhesive_grout.png';

const brandCategories = [
  { name: 'All Tiles', image: allTiles, filterCategory: 'category', filterValue: 'Tiles' },
  { name: 'Wall Tiles', image: wallTiles, filterCategory: 'category', filterValue: 'Tiles' },
  { name: 'Floor Tiles', image: floorTiles, filterCategory: 'category', filterValue: 'Tiles' },
  { name: 'Athangudi Tiles', image: athangudiTiles, filterCategory: 'category', filterValue: 'Tiles' },
  { name: 'Aqua Faucet', image: aquaFaucet, filterCategory: 'category', filterValue: 'Bath Fittings' },
  { name: 'Sanitaryware', image: sanitaryware, filterCategory: 'category', filterValue: 'Sanitary Wares' },
  { name: 'Kitchen Sink', image: kitchenSink, filterCategory: 'category', filterValue: 'Bath Fittings' },
  { name: 'Flush Tank', image: flushTank, filterCategory: 'category', filterValue: 'Sanitary Wares' },
  { name: 'PTMT Taps', image: ptmtTaps, filterCategory: 'category', filterValue: 'Bath Fittings' },
  { name: 'Adhesive and Grout', image: adhesiveGrout, filterCategory: 'category', filterValue: 'Others' },
];

export default function BrandsMarquee() {
  const navigate = useNavigate();

  const handleClick = (cat, val) => {
    navigate('/products', { state: { filterCategory: cat, filterValue: val } });
  };
  return (
    <section className="brands-marquee-section">
      <div className="auto-container">
        <div className="sec-title centered">
          <div className="sec-title_title"><i className="flaticon-wood-1" /> Categories</div>
          <h2 className="sec-title_heading">Explore Our Products</h2>
        </div>

        <div className="brands-slider-container">
          <button className="brands-slider-btn brands-slider-prev" aria-label="Previous slide">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              nextEl: '.brands-slider-next',
              prevEl: '.brands-slider-prev',
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              }
            }}
            className="brands-swiper"
          >
            {brandCategories.map((brand, idx) => (
              <SwiperSlide key={idx}>
                <div 
                  className="brand-category-card" 
                  onClick={() => handleClick(brand.filterCategory, brand.filterValue)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="brand-category-image-wrap">
                    <img src={brand.image} alt={brand.name} />
                  </div>
                  <div className="brand-category-title">{brand.name}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="brands-slider-btn brands-slider-next" aria-label="Next slide">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
