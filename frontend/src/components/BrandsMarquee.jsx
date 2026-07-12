import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import './BrandsMarquee.css';

import allTiles from '../assets/images/brands/all_tiles.png';
import wallTiles from '../assets/images/brands/wall_tiles.png';
import floorTiles from '../assets/images/brands/floor_tiles.png';
import athangudiTiles from '../assets/images/brands/athangudi_tiles.png';
import sanitaryware from '../assets/images/brands/sanitaryware.png';
import flushTank from '../assets/images/brands/flush_tank.png';
import aquaFaucet from '../assets/images/brands/aqua_faucet.png';
import kitchenSink from '../assets/images/brands/kitchen_sink.png';
import ptmtTaps from '../assets/images/brands/ptmt_taps.png';
import adhesiveGrout from '../assets/images/brands/adhesive_grout.png';

const promotions = [
  {
    label: "Today's Offer",
    copy: 'Discover selected wall and floor tile collections for inspired everyday spaces.',
    image: allTiles,
    category: 'Tiles',
  },
  {
    label: 'Launching Offer',
    copy: 'Explore refined sanitary ware created around comfort, hygiene and modern living.',
    image: sanitaryware,
    category: 'Sanitary Wares',
  },
  {
    label: 'New Arrivals',
    copy: 'Meet our latest bath fittings in contemporary forms and enduring finishes.',
    image: aquaFaucet,
    category: 'Bath Fittings',
  },
];

const marqueeCategories = [
  { name: 'All Tiles', group: 'Tiles', image: allTiles },
  { name: 'Wall Tiles', group: 'Tiles', image: wallTiles },
  { name: 'Floor Tiles', group: 'Tiles', image: floorTiles },
  { name: 'Athangudi Tiles', group: 'Tiles', image: athangudiTiles },
  { name: 'Sanitary Wares', group: 'Sanitary Wares', image: sanitaryware },
  { name: 'Flush Tanks', group: 'Sanitary Wares', image: flushTank },
  { name: 'Bath Fittings', group: 'Bath Fittings', image: aquaFaucet },
  { name: 'Kitchen Sinks', group: 'Bath Fittings', image: kitchenSink },
  { name: 'PTMT Taps', group: 'Bath Fittings', image: ptmtTaps },
  { name: 'Adhesives & Grout', group: 'Others', image: adhesiveGrout },
];

const categoryState = (filterValue) => ({ filterCategory: 'category', filterValue });

export default function BrandsMarquee() {
  return (
    <section className="collection-stories" aria-labelledby="collection-stories-title">
      <div className="collection-stories__container">
        <header className="collection-stories__header">
          <div className="sec-title centered collection-stories__title">
            <div className="sec-title_title">
              <i className="flaticon-wood-1" /> Curated for your space
            </div>
            <h2 className="sec-title_heading" id="collection-stories-title">
              What’s New at SJ Ceramics
            </h2>
          </div>
          <Link className="collection-stories__view-all" to="/products">
            View all products <span aria-hidden="true">↗</span>
          </Link>
        </header>

        <div className="collection-stories__posts">
          {promotions.map((promotion) => (
            <article className="story-post" key={promotion.label}>
              <img src={promotion.image} alt="" />
              <div className="story-post__shade" />
              <div className="story-post__topline">
                <span className="story-post__number">{promotion.number}</span>
                <span className="story-post__category">{promotion.category}</span>
              </div>
              <div className="story-post__content">
                <h3>{promotion.label}</h3>
                <p>{promotion.copy}</p>              
              </div>
            </article>
          ))}
        </div>

        <div className="category-marquee__heading">
          <div className="sec-title centered" style={{ marginBottom: 0 }}>
            <div className="sec-title_title">
              <i className="flaticon-wood-1" /> Browse collections
            </div>
            <h2 className="sec-title_heading">
              Find the right category
            </h2>
          </div>
          <div className="category-marquee__controls">
            <button className="category-marquee__prev" type="button" aria-label="Previous categories">←</button>
            <button className="category-marquee__next" type="button" aria-label="Next categories">→</button>
          </div>
        </div>

        <Swiper
          className="category-marquee"
          modules={[Autoplay, Navigation]}
          loop
          speed={5000}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          navigation={{ prevEl: '.category-marquee__prev', nextEl: '.category-marquee__next' }}
          breakpoints={{
            0: { slidesPerView: 1.45, spaceBetween: 14 },
            480: { slidesPerView: 2.15, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 18 },
            1100: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {marqueeCategories.map((category) => (
            <SwiperSlide key={category.name}>
              <Link
                className="category-marquee__card"
                to="/products"
                state={categoryState(category.group)}
                aria-label={`Browse ${category.name}`}
              >
                <div className="category-marquee__image">
                  <img src={category.image} alt={`${category.name} collection`} />
                  <span aria-hidden="true">↗</span>
                </div>
                <p>{category.group}</p>
                <h4>{category.name}</h4>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
