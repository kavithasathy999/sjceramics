import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import './BrandsMarquee.css';
import { products } from '../utils/ProductData';
import { getHomeOffers } from '../services/homeOffersApi';
import { getHomeCategories } from '../services/homeCategoriesApi';

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

const fallbackOfferProducts = [
  { label: "Today's Offer", productId: 4, availability: 'Limited-period showroom offer' },
  { label: 'Launching Offer', productId: 8, availability: 'Coming soon to our showroom' },
].map((offer) => {
  const product = products.find(({ id }) => id === offer.productId);
  const saving = product.mrp - product.offerPrice;

  return {
    ...offer,
    product,
    saving,
    discount: Math.round((saving / product.mrp) * 100),
  };
});

const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

const fallbackMarqueeCategories = [
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

export default function BrandsMarquee({ children }) {
  const [offerProducts, setOfferProducts] = useState(fallbackOfferProducts);
  const [marqueeCategories, setMarqueeCategories] = useState(fallbackMarqueeCategories);

  useEffect(() => {
    let active = true;
    getHomeOffers()
      .then((sections) => {
        if (!active) return;
        const dynamicOffers = ['todays_offer', 'launching_offer'].flatMap((sectionType, index) => {
          const section = sections.find((entry) => entry.sectionType === sectionType);
          if (!section?.configured) return [fallbackOfferProducts[index]];
          return section.items.slice(0, 1).map((item) => {
            const saving = item.mrp - item.offerPrice;
            return {
              label: item.label,
              availability: item.availability,
              saving,
              discount: Math.round((saving / item.mrp) * 100),
              product: {
                id: item.id,
                name: item.productName,
                image: item.imageUrl,
                category: item.category,
                size: item.size,
                finish: item.finish,
                mrp: item.mrp,
                offerPrice: item.offerPrice,
              },
            };
          });
        });
        setOfferProducts(dynamicOffers);
      })
      .catch(() => {
        // Keep the original curated cards when the API is unavailable.
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    getHomeCategories()
      .then(({ configured, items }) => {
        if (!active || !configured) return;
        setMarqueeCategories(items.map((item) => ({
          id: item.id,
          name: item.name,
          group: item.group,
          image: item.imageUrl,
        })));
      })
      .catch(() => {
        // Keep the original ten category cards when the API is unavailable.
      });
    return () => { active = false; };
  }, []);

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
          {offerProducts.map((offer) => (
            <article className="story-post" key={offer.label}>
              <img src={offer.product.image} alt={`${offer.product.name} tile`} />
              <div className="story-post__shade" />
              <div className="story-post__topline">
                <span className="story-post__number">
                  <strong>{offer.discount}%</strong>
                  <small>Off</small>
                </span>
                <span className="story-post__category">{offer.product.category}</span>
              </div>
              <div className="story-post__content">
                <h3>{offer.label}</h3>
                <p className="story-post__product">
                  <strong>{offer.product.name}</strong>
                  <span>{offer.product.size} · {offer.product.finish}</span>
                </p>
                <div className="story-post__availability" aria-label={`${offer.label} pricing`}>
                  <span>MRP <del>₹{formatPrice(offer.product.mrp)}</del></span>
                  <span>Offer <strong>₹{formatPrice(offer.product.offerPrice)}</strong> / sq.ft</span>
                </div>
                <p className="story-post__offer-note">
                  Save ₹{formatPrice(offer.saving)} / sq.ft · {offer.availability}
                </p>
              </div>
            </article>
          ))}
        </div>

        {children ? (
          <div className="collection-stories__interlude">
            {children}
          </div>
        ) : null}

        {marqueeCategories.length > 0 && <>
        <div className="category-marquee__heading">
          <div className="sec-title centered" style={{ marginBottom: 0 }}>
            <div className="sec-title_title">
              <i className="flaticon-wood-1" /> Browse collections
            </div>
            <h2 className="sec-title_heading">
              Find the right category
            </h2>
          </div>
        </div>

        <Swiper
          className="category-marquee"
          modules={[Autoplay, Navigation]}
          loop={marqueeCategories.length > 1}
          speed={5000}
          autoplay={marqueeCategories.length > 1 ? { delay: 0, disableOnInteraction: false } : false}
          navigation={{ prevEl: '.category-marquee__prev', nextEl: '.category-marquee__next' }}
          breakpoints={{
            0: { slidesPerView: 1.45, spaceBetween: 14 },
            480: { slidesPerView: 2.15, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 18 },
            1100: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {marqueeCategories.map((category) => (
            <SwiperSlide key={category.id || category.name}>
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
        </>}
      </div>
    </section>
  );
}
