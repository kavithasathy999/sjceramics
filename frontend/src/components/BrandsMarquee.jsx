import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import './BrandsMarquee.css';
import { getHomeOffers } from '../services/homeOffersApi';
import { getHomeCategories } from '../services/homeCategoriesApi';

const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

const categoryState = (filterValue) => ({ filterCategory: 'category', filterValue });

export default function BrandsMarquee({ children }) {
  const [offerProducts, setOfferProducts] = useState([]);
  const [marqueeCategories, setMarqueeCategories] = useState([]);

  useEffect(() => {
    let active = true;
    getHomeOffers()
      .then((sections) => {
        if (!active) return;
        const dynamicOffers = ['todays_offer', 'launching_offer'].flatMap((sectionType) => {
          const section = sections.find((entry) => entry.sectionType === sectionType);
          if (!section?.configured) return [];
          return section.items.slice(0, 1).map((item) => {
            const saving = Number(item.mrp || 0) - Number(item.offerPrice || 0);
            return {
              label: item.label,
              availability: item.availability,
              saving,
              discount: item.mrp ? Math.round((saving / item.mrp) * 100) : 0,
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
        if (active) setOfferProducts([]);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    getHomeCategories()
      .then(({ configured, items }) => {
        if (!active) return;
        if (!configured) {
          setMarqueeCategories([]);
          return;
        }
        setMarqueeCategories(items.map((item) => ({
          id: item.id,
          name: item.name,
          group: item.group,
          image: item.imageUrl,
        })));
      })
      .catch(() => {
        if (active) setMarqueeCategories([]);
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

        {offerProducts.length > 0 && <div className="collection-stories__posts">
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
        </div>}

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
