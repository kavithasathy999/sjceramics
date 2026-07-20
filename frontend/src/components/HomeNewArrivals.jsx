import { useEffect, useState } from 'react';
import { products } from '../utils/ProductData';
import { getHomeOffers } from '../services/homeOffersApi';
import './BrandsMarquee.css';
import './HomeNewArrivals.css';

const fallbackUpcomingProducts = products.filter((product) => product.isNewArrival).slice(0, 6).map((product) => ({
  ...product,
  arrivalStatus: 'Coming soon',
  availability: 'Availability will be announced soon',
}));

export default function HomeNewArrivals() {
  const [upcomingProducts, setUpcomingProducts] = useState(fallbackUpcomingProducts);

  useEffect(() => {
    let active = true;
    getHomeOffers()
      .then((sections) => {
        if (!active) return;
        const section = sections.find((entry) => entry.sectionType === 'new_arrivals');
        if (!section?.configured) return;
        setUpcomingProducts(section.items.slice(0, 6).map((item) => ({
          id: item.id,
          name: item.productName,
          image: item.imageUrl,
          category: item.category,
          size: item.size,
          finish: item.finish,
          arrivalStatus: item.arrivalStatus,
          availability: item.availability,
        })));
      })
      .catch(() => {
        // Keep the original six arrivals when the API is unavailable.
      });
    return () => { active = false; };
  }, []);

  if (!upcomingProducts.length) return null;

  return (
    <section className="home-arrivals" aria-labelledby="home-arrivals-title">
      <div className="home-arrivals__container">
        <header className="home-arrivals__header">
          <div className="sec-title centered home-arrivals__title">
            <div className="sec-title_title">
              <i className="flaticon-wood-1" /> Coming to our showroom
            </div>
            <h2 className="sec-title_heading" id="home-arrivals-title">New Arrivals</h2>
          </div>
          <p>
            Preview the latest surfaces, sanitary ware and installation essentials selected for
            contemporary spaces.
          </p>
        </header>

        <div className="home-arrivals__posts">
          {upcomingProducts.map((product) => {
            const displayName = product.name.replace(/^KAG\s+/i, '');

            return (
            <article className="story-post" key={product.id}>
              <img src={product.image} alt={displayName} loading="lazy" />
              <div className="story-post__shade" />
              <div className="story-post__topline">
                <span className="story-post__number home-arrivals__new-badge">
                  <strong>New</strong>
                  <small>Arrival</small>
                </span>
                <span className="story-post__category">{product.category}</span>
              </div>
              <div className="story-post__content">
                <h3>{displayName}</h3>
                <p className="story-post__product">
                  <strong>{product.size}</strong>
                  <span>{product.finish}</span>
                </p>
                <div className="story-post__availability" aria-label={`${displayName} arrival status`}>
                  <span>{product.arrivalStatus}</span>
                  <span>Showroom arrival</span>
                </div>
                <p className="story-post__offer-note">{product.availability}</p>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
